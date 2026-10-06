import React from 'react';

import { getLocale } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { ICategory } from '@models/category';

export default async function CategoryCard({ category }: { category: ICategory}) {
  const {
    id,
    categoryCover,
    persianName,
    englishName,
    categoryPersianDesc,
    categoryEnglishDesc,
  } = category;
  const locale = await getLocale()
  const name = locale == "fa" ? persianName : englishName;
  const desc = locale == "fa" ? categoryPersianDesc : categoryEnglishDesc;
  return (
    <Link
      href={`/${locale}/categories/${category.slug || id}`}
      className="group flex flex-col min-w-0"
    >
      <span className="block relative w-full aspect-[31/28] overflow-hidden luca-ph">
        <MediaImage
          src={categoryCover}
          alt={name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
          loading="lazy"
        />
      </span>
      <span className="flex flex-col justify-center items-center px-2 min-h-[72px] text-center">
        <h3 className="font-body font-normal text-[15px] group-hover:underline underline-offset-4">{name}</h3>
        {desc ? <span className="text-xs line-clamp-1 luca-muted">{desc}</span> : null}
      </span>
    </Link>
  );
}
