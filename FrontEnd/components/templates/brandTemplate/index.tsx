import React from 'react';

import { getTranslations } from 'next-intl/server';

import MediaImage from '@components/atoms/MediaImage';
import {
  BrandCategories,
  BrandDescription,
  BrandProducts,
  BrandSuppliers,
} from '@components/organisms/brandOrganisms';
import { IBrand } from '@models/brand';

export default async  function BrandTemplate({ brand }: { brand: IBrand}) {
  const t = await getTranslations('common');

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Brand hero: logo plate + name + description */}
      <section className="flex md:flex-row flex-col items-start md:items-center gap-7 md:gap-16 pb-4 text-start">
        <div className="relative flex-shrink-0 border w-[200px] xl:w-[240px] h-[200px] xl:h-[240px] overflow-hidden luca-line">
          <MediaImage
            src={brand.logoFile}
            alt={brand.name}
            fill
            className="p-6 object-contain"
            sizes="240px"
            priority
          />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <span className="luca-eyebrow">{t('brand')}</span>
          <h1 className="luca-h1">{brand.name}</h1>
          <div className="max-w-[560px] leading-loose luca-muted">
            <BrandDescription brand={brand} />
          </div>
        </div>
      </section>

      <BrandCategories id={brand.id} />
      <BrandProducts id={brand.id} />
      <BrandSuppliers id={brand.id} />
    </div>
  );
}
