import '../style/globals.css';

import { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';

import { siteBaseUrl } from '@lib/api';
import { SITE_NAME } from '@lib/seo';
import { getActiveTheme, themeToCss } from '@lib/theme';

type Props = {
  children: ReactNode;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
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

export default async function RootLayout({ children }: Props) {
  // Colours come from the active ThemeSetting row; globals.css only holds the fallback palette.
  const themeCss = themeToCss(await getActiveTheme());

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
        {themeCss ? (
          <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
        ) : null}
      </head>
      <body className="bg-store-surface min-h-screen text-store-text antialiased">
        {children}
      </body>
    </html>
  );
}
