import '../style/globals.css';

import { ReactNode } from 'react';

import type { Metadata } from 'next';
import Script from 'next/script';

import { siteBaseUrl } from '@lib/api';
import { SITE_NAME } from '@lib/seo';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Luca — dental loupes and LED headlights, custom-fitted for clinicians. Persian and English storefront.',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const THEME_BOOTSTRAP = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m?decodeURIComponent(m[1]):'';if(t&&t!=='default')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <head>
        {/* Luca typefaces: Markazi Text (display) + Vazirmatn (UI).
            For production in restricted networks, self-host these as woff2 in /public/fonts
            and replace this <link> with @font-face rules in style/globals.css. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400;500;600&family=Vazirmatn:wght@300;400;500;600&display=swap"
        />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP}
        </Script>
      </head>
      <body className="bg-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
