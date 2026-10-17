'use client';

import { useEffect, useState } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Rendered outside the locale layout (no next-intl provider), so the copy
// lives here and the language is taken from the URL prefix.
const COPY = {
  fa: {
    title: 'خطای بحرانی',
    message: 'برنامه با مشکل غیرمنتظره روبه‌رو شد.',
    retry: 'تلاش مجدد',
  },
  en: {
    title: 'Critical error',
    message: 'The app ran into an unexpected problem.',
    retry: 'Try again',
  },
} as const;

/** Root-level boundary — must define its own html/body. */
export default function GlobalError({ error, reset }: Props) {
  const [locale, setLocale] = useState<'fa' | 'en'>('fa');
  const copy = COPY[locale];

  useEffect(() => {
    if (/^\/en(\/|$)/.test(window.location.pathname)) setLocale('en');
  }, []);

  useEffect(() => {
    const payload = {
      level: 'error',
      message: error.message,
      context: { scope: 'global-error', digest: error.digest },
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };
    console.error(JSON.stringify({ ...payload, source: 'client', ts: new Date().toISOString() }));
    void fetch('/auth/client-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  }, [error]);

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'Tahoma, sans-serif',
          background: '#07140e',
          color: '#f4f7f5',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>{copy.title}</h1>
          <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            {process.env.NODE_ENV === 'development'
              ? error.message
              : copy.message}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#0E5E2D',
              color: '#fff',
              border: 0,
              borderRadius: 12,
              padding: '10px 18px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {copy.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
