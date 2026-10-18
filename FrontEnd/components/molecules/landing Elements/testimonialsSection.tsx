'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { IcStar } from '@components/atoms/lucaIcons';
import { isPlaceholder } from '@lib/placeholder';

const ITEM_KEYS = ['1', '2', '3'] as const;

const TestimonialsSection: React.FC = () => {
  const t = useTranslations('testimonials');
  const tCommon = useTranslations('common');

  // Only real testimonials are shown; template placeholders stay hidden.
  const items = ITEM_KEYS.filter(
    (id) =>
      !isPlaceholder(t(`items.${id}.comment`)) &&
      !isPlaceholder(t(`items.${id}.name`)),
  );

  if (items.length === 0) return null;

  return (
    <section className="text-white" style={{ background: 'var(--primary-color)' }}>
      <div className="flex flex-col gap-10 store-section luca-container">
        <h2 className="text-white text-center luca-h2">{t('sectionTitle')}</h2>
        <div className="gap-8 grid md:grid-cols-3">
          {items.map((id) => (
            <figure key={id} className="flex flex-col items-center gap-3 m-0 text-center">
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label={tCommon('fiveOfFive')}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden>
                    <IcStar size={16} />
                  </span>
                ))}
              </div>
              <blockquote className="m-0 text-[26px] leading-normal luca-display">
                «{t(`items.${id}.comment`)}»
              </blockquote>
              <figcaption className="flex flex-col text-sm">
                <span className="font-medium">{t(`items.${id}.name`)}</span>
                {!isPlaceholder(t(`items.${id}.product`)) && (
                  <span className="opacity-80 text-[13px]">{t(`items.${id}.product`)}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
