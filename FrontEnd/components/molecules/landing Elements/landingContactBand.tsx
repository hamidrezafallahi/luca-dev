import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

/**
 * Closing band of the home page. The prototype shows a newsletter sign-up here;
 * the API has no newsletter endpoint yet, so it routes to the contact-request form (/cooperation).
 */
export default async function LandingContactBand() {
  const locale = await getLocale();
  const t = await getTranslations('landing.contactBand');

  return (
    <section className="luca-tint">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-7 py-12 md:min-h-[220px] luca-container">
        <div className="flex flex-col gap-1 text-start">
          <h2 className="luca-h3">{t('title')}</h2>
          <p className="text-[15px] luca-muted">{t('body')}</p>
        </div>
        <Link href={`/${locale}/cooperation`} className="store-btn store-btn-primary shrink-0">
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
