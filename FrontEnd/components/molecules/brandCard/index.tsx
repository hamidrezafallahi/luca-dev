"use client";
import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IBrand } from '@models/brand';

export default function BrandCard({brand}:{brand:IBrand}) {
    const locale = useLocale();
    const t = useTranslations('common');
  return (
    <Link
      href={`/${locale}/brands/${brand.slug || brand.id}`}
      className="group flex flex-col justify-center items-center gap-2 px-4 py-6 border hover:border-ink min-h-[220px] text-center transition-colors luca-line"
    >
      <span className="block relative w-full h-20">
        <MediaImage
          src={brand.logoFile}
          alt={brand.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />
      </span>
      <h3 className="font-body font-normal text-sm">{brand.name}</h3>
      {brand.description ? (
        <p className="text-xs line-clamp-2 luca-muted">{brand.description}</p>
      ) : null}
      <span className="pt-1 text-[13px] underline underline-offset-[6px]">
        {t('viewBrand')}
      </span>
    </Link>
  )
}
