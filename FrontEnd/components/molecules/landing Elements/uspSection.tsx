'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { IcBag, IcBox, IcCheck, IcShield, IcUser } from '@components/atoms/lucaIcons';

const USP_KEYS = [
  { id: 'shipping', icon: <IcBox size={26} /> },
  { id: 'support', icon: <IcUser size={26} /> },
  { id: 'cod', icon: <IcBag size={26} /> },
  { id: 'warranty', icon: <IcShield size={26} /> },
  { id: 'authenticity', icon: <IcCheck size={26} /> },
] as const;

const USPSection: React.FC = () => {
  const t = useTranslations('usp');

  return (
    <section className="luca-tint" aria-labelledby="usp-title">
      <div className="flex flex-col gap-10 store-section luca-container">
        <h2 id="usp-title" className="text-center luca-h2">
          {t('sectionTitle')}
        </h2>
        <div className="gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {USP_KEYS.map((usp) => (
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
