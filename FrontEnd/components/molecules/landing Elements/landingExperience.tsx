import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';

const CARDS = [
  { key: 'fitting' as const, href: 'faq' },
  { key: 'contact' as const, href: 'cooperation' },
];

/** "The Luca experience": consultation booking plus two service cards. */
export default async function LandingExperience() {
  const locale = await getLocale();
  const t = await getTranslations('landing.experience');

  return (
    <section id="appointment" className="flex flex-col gap-12 store-section luca-container">
      <h2 className="text-center luca-h2">{t('title')}</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col justify-center items-center xl:items-start gap-3.5 md:col-span-2 xl:col-span-1 p-7 md:p-10 xl:p-12 border min-h-[260px] text-center xl:text-start luca-line">
          <h3 className="luca-h3">{t('appointment.title')}</h3>
          <p className="max-w-[420px] text-[15px] leading-loose luca-muted">{t('appointment.body')}</p>
          <Link href={`/${locale}/cooperation`} className="store-btn">
            {t('appointment.cta')}
          </Link>
        </div>
        {CARDS.map((card) => (
          <div key={card.key} className="flex flex-col gap-2.5">
            <div className="flex justify-center items-center h-[220px] xl:h-[260px] text-[#6a6a65] luca-ph">
              <LoupeMark width={90} />
            </div>
            <div className="flex flex-col items-start gap-1 pt-2.5 text-start">
              <h3 className="luca-h3">{t(`${card.key}.title`)}</h3>
              <p className="text-[15px] leading-loose luca-muted">{t(`${card.key}.body`)}</p>
              <Link href={`/${locale}/${card.href}`} className="luca-link">
                {t('more')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
