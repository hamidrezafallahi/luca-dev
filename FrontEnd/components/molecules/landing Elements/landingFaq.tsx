import React from 'react';

import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import FaqAccordion from '@components/molecules/storefront/FaqAccordion';
import { getFaqs } from '@lib/faq';

/** How many questions the landing page previews before linking to /faq. */
const LANDING_FAQ_LIMIT = 6;

/** Landing-page FAQ preview. Renders nothing until at least one FAQ exists. */
export default async function LandingFaq({ locale }: { locale: string }) {
  const faqs = await getFaqs(LANDING_FAQ_LIMIT);
  if (!faqs.length) return null;

  const t = await getTranslations({ locale, namespace: 'faqPage' });

  return (
    <section className="flex flex-col items-center gap-8 store-section luca-container">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="luca-h2">{t('title')}</h2>
        <p className="max-w-[600px] luca-muted">{t('description')}</p>
      </div>
      <FaqAccordion items={faqs} />
      <Link href={`/${locale}/faq`} className="store-btn">
        {t('viewAll')}
      </Link>
    </section>
  );
}
