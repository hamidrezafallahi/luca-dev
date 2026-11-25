import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ACCESS_COOKIE } from '@lib/auth-cookies';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/** UI hint only. Admin endpoints still enforce authorization on the backend. */
export async function GET() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ role: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const claims = jwtDecode<Record<string, unknown>>(token);
    if (typeof claims.exp !== 'number' || claims.exp <= Date.now() / 1000) {
      return NextResponse.json({ role: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }
    const role = claims.role ?? claims[ROLE_CLAIM];
    return NextResponse.json(
      { role: typeof role === 'string' ? role : null },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json({ role: null }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
}
