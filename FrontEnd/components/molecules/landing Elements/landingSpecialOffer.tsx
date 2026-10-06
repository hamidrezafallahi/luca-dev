// app/components/landing/LandingSpecialOffer.tsx
import React from 'react';

import { getTranslations } from 'next-intl/server';

import { getAll } from '@lib/getAll';
import { SpecialOffer } from '@models/specialOffer';

import SpecialOfferCarouselClient from './SpecialOfferCarouselClient';

export default async  function LandingSpecialOffer() {
  const t = await getTranslations('landing');
  const spacialOffers = await getAll<SpecialOffer>("SpecialOffers/landing");
  return (
    <section className="luca-dark">
      <div className="flex md:flex-row flex-col items-center gap-8 md:gap-12 py-12 md:py-16 luca-container">
        <div className="flex flex-col flex-1 items-start gap-3 min-w-0 text-start">
          <span className="font-medium text-[#d0d0cb] text-[13px]">{t('specialOfferEyebrow')}</span>
          <h2 className="text-white luca-h2">{t('specialOfferTitle')}</h2>
          <p className="max-w-md text-[#d8d8d3] leading-loose">{t('specialOfferDesc')}</p>
        </div>
        <div className="flex flex-1 justify-center w-full min-w-0">
          <div className="w-full h-[420px]">
            <SpecialOfferCarouselClient spacialOffers={spacialOffers?.data.records||[]} />
          </div>
        </div>
      </div>
    </section>
  );
}
