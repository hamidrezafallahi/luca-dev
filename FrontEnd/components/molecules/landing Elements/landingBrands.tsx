import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { getAll } from '@lib/getAll';
import { IBrand } from '@models/brand';

import BrandCard from '../brandCard';

export default async function LandingBrands( ) {
    const locale = await getLocale();
    const t = await getTranslations('landing');
   const response = await getAll<IBrand>("brands", {
     page: 1,
     pageSize: 5,
     byConfig: false,
   });
  return (
    <section className="flex flex-col gap-8 store-section luca-container">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="luca-h2">{t('brandsTitle')}</h2>
          <p className="text-sm luca-muted">{t('brandsSubtitle')}</p>
        </div>
        <Link href={`/${locale}/brands`} className="luca-link">
          {t('viewAllBrands')}
        </Link>
      </div>
      <div className="gap-3 md:gap-4 lg:gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {response?.data?.records?.map((brand, index) => (
          <BrandCard brand={brand} key={index} />
        ))}
      </div>
    </section>
  )
}
