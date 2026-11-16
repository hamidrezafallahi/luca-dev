import { ReactNode } from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import CustomLayout from '@layout/index';
import { getCustomFonts } from '@lib/customFonts';
import { fontVariables } from '@lib/fonts';
import { getActiveTheme, themeToCss } from '@lib/theme';
import type { TLang } from '@slice/config/type';

interface IProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return [{ locale: 'fa' }, { locale: 'en' }];
}

const LOCALES: readonly string[] = ['fa', 'en'];

export default async function BaseLayout({ children, params }: IProps) {
  const { locale } = await params;
  // The middleware skips file-like paths (/foo.txt, /llms.txt), so they land
  // here as a "locale". Anything that isn't fa/en is a real 404, not a copy
  // of the homepage.
  if (!LOCALES.includes(locale)) {
    notFound();
  }
  // Lets nested server components call getLocale()/getTranslations() without
  // a locale argument while staying statically renderable.
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  // Colours come from the active ThemeSetting row (cached fetch); globals.css
  // only holds the fallback palette. Avoid cookies()/headers() here so
  // storefront segments can stay SSG/ISR instead of always dynamic.
  const [theme, customFonts] = await Promise.all([getActiveTheme(), getCustomFonts()]);
  const themeCss = themeToCss(theme, customFonts);

  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {themeCss ? (
          <style id="site-theme" dangerouslySetInnerHTML={{ __html: themeCss }} />
        ) : null}
      </head>
      <body className="bg-store-surface min-h-screen text-store-text antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomLayout>{children}</CustomLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
