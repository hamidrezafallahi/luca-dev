import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

/** Localized 404 for notFound() calls and unknown paths under /fa or /en. */
export default function LocaleNotFound() {
  const locale = useLocale();
  const t = useTranslations('store');
  const tBrand = useTranslations('brand');

  return (
    <div className="flex flex-col bg-white min-h-screen text-ink">
      <div className="flex justify-center items-center border-b h-16 md:h-[88px] luca-line">
        <Link
          href={`/${locale}`}
          aria-label={tBrand('homeLink')}
          className="text-[30px] md:text-[42px] luca-wordmark"
        >
          LUCA
        </Link>
      </div>
      <main className="flex flex-col flex-1 justify-center items-center gap-3.5 px-5 py-14 text-center">
        <span className="text-[120px] md:text-[140px] leading-none luca-display" aria-hidden>
          {locale === 'fa' ? '۴۰۴' : '404'}
        </span>
        <h1 className="luca-h2">{t('pageNotFound')}</h1>
        <p className="max-w-[480px] leading-loose luca-muted">{t('notFoundHint')}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-3">
          <Link href={`/${locale}`} className="store-btn store-btn-primary">
            {t('backHome')}
          </Link>
          <Link href={`/${locale}/products`} className="!h-14 store-btn">
            {t('viewProducts')}
          </Link>
        </div>
      </main>
    </div>
  );
}
