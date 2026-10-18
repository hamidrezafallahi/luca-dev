import '../style/globals.css';

import { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';

import { siteBaseUrl } from '@lib/api';
import { SITE_NAME } from '@lib/seo';

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

/**
 * <html> lives in app/[locale]/layout.tsx so lang/dir follow the URL locale
 * without making every page dynamic. Routes outside [locale] that render UI
 * (app/not-found.tsx) provide their own <html>.
 */
export default function RootLayout({ children }: Props) {
  return children;
}
