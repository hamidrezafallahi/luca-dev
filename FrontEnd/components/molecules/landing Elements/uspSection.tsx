'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { IcBag, IcBox, IcCheck, IcShield, IcUser } from '@components/atoms/lucaIcons';
import { isPlaceholder } from '@lib/placeholder';

const USP_KEYS = [
  { id: 'shipping', icon: <IcBox size={26} /> },
  { id: 'support', icon: <IcUser size={26} /> },
  { id: 'cod', icon: <IcBag size={26} /> },
  { id: 'warranty', icon: <IcShield size={26} /> },
  { id: 'authenticity', icon: <IcCheck size={26} /> },
] as const;

// Literal class names so Tailwind keeps them; the USP count varies.
const LG_COLS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

const USPSection: React.FC = () => {
  const t = useTranslations('usp');

  // Hide USPs whose terms are still template placeholders (payment, warranty).
  const usps = USP_KEYS.filter(
    (usp) => !isPlaceholder(t(`items.${usp.id}.description`)),
  );

  return (
    <section className="luca-tint" aria-labelledby="usp-title">
      <div className="flex flex-col gap-10 store-section luca-container">
        <h2 id="usp-title" className="text-center luca-h2">
          {t('sectionTitle')}
        </h2>
        <div className={`gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 ${LG_COLS[usps.length] ?? 'lg:grid-cols-5'}`}>
          {usps.map((usp) => (
            <article key={usp.id} className="flex flex-col items-center gap-1 text-center">
              <span aria-hidden>{usp.icon}</span>
              <h3 className="mt-2 font-body font-medium text-[15px]">
                {t(`items.${usp.id}.title`)}
              </h3>
              <p className="text-[13px] leading-relaxed luca-muted">
                {t(`items.${usp.id}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
