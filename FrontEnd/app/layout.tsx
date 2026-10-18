import '../style/globals.css';

import { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import { Markazi_Text, Vazirmatn } from 'next/font/google';

import { siteBaseUrl } from '@lib/api';
import { SITE_NAME } from '@lib/seo';
import { getActiveTheme, themeToCss } from '@lib/theme';

// Luca typefaces: Markazi Text (display) + Vazirmatn (UI). next/font downloads
// them at build time and serves them from /_next/static/media, so the CSP's
// style-src/font-src 'self' allows them and no request goes to Google Fonts.
const displayFont = Markazi_Text({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-markazi',
});

const bodyFont = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

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
    <html
      lang="fa"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
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
