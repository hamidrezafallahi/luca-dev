'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { IcBag, IcBox, IcClock, IcShield, IcStar } from '@components/atoms/lucaIcons';

const BADGE_KEYS = [
  { id: 'secure', icon: <IcShield size={26} /> },
  { id: 'cod', icon: <IcBag size={26} /> },
  { id: 'return', icon: <IcClock size={26} /> },
  { id: 'shipping', icon: <IcBox size={26} /> },
] as const;

const REVIEW_KEYS = ['1', '2', '3'] as const;

const TrustSection: React.FC = () => {
  const t = useTranslations('trust');
  const tCommon = useTranslations('common');

  return (
    <section className="flex flex-col gap-10 store-section luca-container">
      <h2 className="text-center luca-h2">{t('sectionTitle')}</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-s luca-line">
        {BADGE_KEYS.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-1 px-4 py-8 border-e border-b text-center luca-line"
          >
            <span aria-hidden>{badge.icon}</span>
            <h3 className="mt-2 font-body font-medium text-[15px]">{t(`badges.${badge.id}.title`)}</h3>
            <p className="text-[13px] luca-muted">{t(`badges.${badge.id}.description`)}</p>
          </div>
        ))}
      </div>

      <div className="gap-4 lg:gap-6 grid md:grid-cols-3">
        {REVIEW_KEYS.map((id) => (
          <figure key={id} className="flex flex-col gap-3 m-0 p-6 border text-start luca-line">
            <div
              className="flex text-ink"
              role="img"
              aria-label={tCommon('fiveOfFive')}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} aria-hidden>
                  <IcStar size={16} />
                </span>
              ))}
            </div>
            <blockquote className="m-0 text-[15px] leading-loose luca-muted">
              {t(`reviews.${id}.comment`)}
            </blockquote>
            <figcaption className="mt-auto font-medium text-sm">{t(`reviews.${id}.name`)}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;
