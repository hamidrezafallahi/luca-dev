import { getRequestConfig } from 'next-intl/server';

const supportedLocales = ['fa', 'en'] as const;
type SupportedLocale = (typeof supportedLocales)[number];

// next-intl v4: `locale` is only set when a caller passes it explicitly
// (e.g. getTranslations({ locale })). Plain getLocale()/getTranslations()
// must read `requestLocale` (setRequestLocale or the middleware header),
// otherwise every server component falls back to 'fa' on /en pages.
export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requested = locale ?? (await requestLocale);
  const currentLocale: SupportedLocale = supportedLocales.includes(
    requested as SupportedLocale
  )
    ? (requested as SupportedLocale)
    : 'fa';
  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default,
  };
});
