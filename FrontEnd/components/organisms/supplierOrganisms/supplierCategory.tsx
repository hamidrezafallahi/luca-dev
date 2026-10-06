import React from 'react';

import { getLocale } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { ICategory } from '@models/category';

export async function SupplierCategory(props: {
  categories: ICategory[];
}) {
  const { categories } = props;
  const locale = await getLocale();
  const uniqueCategory: ICategory[] = [];
  categories.forEach((element) => {
    if (!uniqueCategory.some((u) => u.id == element.id)) {
      uniqueCategory.push(element);
    }
  });
  return (
    <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-5 grid grid-cols-2 md:grid-cols-4">
      {uniqueCategory?.map((cat, i) => (
        <Link
          href={`/${locale}/categories/${cat.id}`}
          key={i}
          className="group flex flex-col min-w-0"
        >
          <span className="block relative w-full aspect-[31/28] overflow-hidden luca-ph">
            <MediaImage
              src={cat.categoryCover}
              alt={cat.persianName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width={320}
              height={290}
            />
          </span>
          <span className="flex flex-col justify-center items-center px-2 min-h-[72px] text-center">
            <h3 className="font-body font-normal text-[15px] group-hover:underline underline-offset-4">
              {locale == "fa" ? cat.persianName : cat.englishName}
            </h3>
            <span className="text-xs line-clamp-1 luca-muted">
              {locale == "fa"
                ? cat.categoryPersianDesc
                : cat.categoryEnglishDesc}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
