import { Markazi_Text, Vazirmatn } from 'next/font/google';

// Luca typefaces: Markazi Text (display) + Vazirmatn (UI). next/font downloads
// them at build time and serves them from /_next/static/media, so the CSP's
// style-src/font-src 'self' allows them and no request goes to Google Fonts.
// Shared by every layout that renders <html> (locale layout, root not-found).
export const displayFont = Markazi_Text({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-markazi',
});

export const bodyFont = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-vazirmatn',
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
