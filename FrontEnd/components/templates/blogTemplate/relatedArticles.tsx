import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';

export async function RelatedArticles() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'blog' });

  return (
    <section className="store-section" aria-labelledby="related-articles-title">
      <div className="-mx-5 md:-mx-10 xl:-mx-16 px-5 md:px-10 xl:px-16 py-12 md:py-16 luca-tint">
        <h2
          id="related-articles-title"
          className="store-section-title mb-8"
        >
          {t('title')}
        </h2>
        <p className="text-[var(--store-text-muted)] text-sm">
          {t('emptyHint')}
        </p>
      </div>
    </section>
  );
}
