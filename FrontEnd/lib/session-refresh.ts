import type { NextRequest, NextResponse } from 'next/server';

import { serverApiBaseUrl } from './api';
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  SESSION_FLAG_COOKIE,
  accessCookieOptions,
  refreshCookieOptions,
  sessionFlagCookieOptions,
} from './auth-cookies';

/**
 * Server Components (getById, getAll, …) read candyAccess but cannot write cookies,
 * so they have no way to refresh an expired session themselves. The middleware runs
 * this before rendering: the new tokens go into the request cookies (so this render
 * uses them) and into the response cookies (so the browser keeps them).
 */

// Refresh slightly early so a render that starts now does not reach the backend
// with a token that expires mid-request (the backend uses ClockSkew = 0).
const EXPIRY_MARGIN_MS = 60 * 1000;

export type SessionRefresh =
  | { kind: 'none' }
  | { kind: 'refreshed'; accessToken: string; refreshToken?: string }
  | { kind: 'invalid' };

function accessTokenExpiresSoon(token: string | undefined) {
  if (!token) return true;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp !== 'number' || exp * 1000 - Date.now() < EXPIRY_MARGIN_MS;
  } catch {
    return true;
  }
}

export async function refreshSessionIfNeeded(
  req: NextRequest,
): Promise<SessionRefresh> {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!refreshToken || !accessTokenExpiresSoon(accessToken)) {
    return { kind: 'none' };
  }

  try {
    const response = await fetch(`${serverApiBaseUrl}/Identity/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, refreshToken }),
      cache: 'no-store',
    });
    const data = await response.json();
    if (data?.isSuccess && data.data?.accessToken) {
      return {
        kind: 'refreshed',
        accessToken: data.data.accessToken as string,
        refreshToken: (data.data.refreshToken as string | undefined) ?? undefined,
      };
    }
    // The backend answered and rejected the token: drop it so every page
    // does not retry. Network/5xx errors fall through and keep the session.
    return response.ok ? { kind: 'invalid' } : { kind: 'none' };
  } catch {
    return { kind: 'none' };
  }
}

export function applySessionToRequest(req: NextRequest, session: SessionRefresh) {
  if (session.kind === 'refreshed') {
    req.cookies.set(ACCESS_COOKIE, session.accessToken);
    if (session.refreshToken) {
      req.cookies.set(REFRESH_COOKIE, session.refreshToken);
    }
  } else if (session.kind === 'invalid') {
    req.cookies.delete(ACCESS_COOKIE);
    req.cookies.delete(REFRESH_COOKIE);
  }
}

export function applySessionToResponse(res: NextResponse, session: SessionRefresh) {
  if (session.kind === 'refreshed') {
    res.cookies.set(ACCESS_COOKIE, session.accessToken, accessCookieOptions);
    if (session.refreshToken) {
      res.cookies.set(REFRESH_COOKIE, session.refreshToken, refreshCookieOptions);
    }
    res.cookies.set(SESSION_FLAG_COOKIE, '1', sessionFlagCookieOptions);
  } else if (session.kind === 'invalid') {
    res.cookies.set(ACCESS_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    res.cookies.set(REFRESH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    res.cookies.set(SESSION_FLAG_COOKIE, '', { path: '/', maxAge: 0 });
  }
}
