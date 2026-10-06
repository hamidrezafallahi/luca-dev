import React from 'react';

import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IBrand } from '@models/brand';

export async function SupplierBrands(props: { brands: IBrand[] }) {
  const { brands } = props;
  const locale = await getLocale();
  const t = await getTranslations();

  // حذف برندهای تکراری
  const uniqueBrands = Array.from(new Map(brands.map((b) => [b.id, b])).values());

  return (
    <div className="gap-3 md:gap-4 lg:gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {uniqueBrands?.map((b, i) => (
        <Link
          href={`/${locale}/brands/${b.id}`}
          key={i}
          className="group flex flex-col justify-center items-center gap-2 px-4 py-6 border hover:border-ink min-h-[220px] text-center transition-colors luca-line"
        >
          <MediaImage
            src={b.logoFile}
            alt={b.name}
            className="w-auto h-20 object-contain"
            loading="lazy"
            width={160}
            height={80}
          />
          <h3 className="font-body font-normal text-sm">{b.name}</h3>
          {b.description && (
            <p className="text-xs line-clamp-2 luca-muted">{b.description}</p>
          )}
          <span className="pt-1 text-[13px] underline underline-offset-[6px]">
            {t('common.viewBrand')}
          </span>
        </Link>
      ))}
    </div>
  );
}
