import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { pickLocalized } from '@lib/utils';
import { ICategory } from '@models/category';

type CategoryCardProps = {
  category: ICategory;
  /** Extra scale for the cover (1 = default size); for covers that look small or large. */
  imageScale?: number;
  /** CSS object-position for the cover inside its corner box. Default: bottom right. */
  imagePosition?: string;
  /** Extra classes for the cover's box, e.g. a different width/height for one category. */
  imageClassName?: string;
};

/**
 * Light category tile (#F8F8F8, 28px corners, faint shadow): name, a short
 * description and an "explore" link at the top; the cover photo anchored to
 * the bottom-right corner, shown whole and clipped by the rounded card.
 *
 * The cover sits on the physical right in both directions (right-0, not end-0)
 * and the text block is kept clear of it. Covers read best as transparent
 * PNG/WebP cut-outs; a photo with its own white background shows as a white
 * rectangle on the grey card, and should be re-exported without it.
 */
export default async function CategoryCard({
  category,
  imageScale = 1,
  imagePosition = 'right bottom',
  imageClassName = '',
}: CategoryCardProps) {
  const {
    id,
    categoryCover,
    persianName,
    englishName,
    categoryPersianDesc,
    categoryEnglishDesc,
  } = category;
  const locale = await getLocale();
  const t = await getTranslations('common');
  const name = pickLocalized(locale, persianName, englishName);
  const desc = pickLocalized(locale, categoryPersianDesc, categoryEnglishDesc);

  return (
    <Link
      href={`/${locale}/categories/${category.slug || id}`}
      className={[
        'group relative isolate flex min-h-[220px] w-full min-w-0 flex-col overflow-hidden',
        'aspect-[1.08/1] md:aspect-[1.1/1]',
        'rounded-[28px] bg-[#F8F8F8] p-6 md:p-8 lg:p-10',
        'shadow-[0_2px_4px_rgba(17,17,17,0.015),0_16px_36px_-20px_rgba(17,17,17,0.08)]',
        'transition-[transform,box-shadow] duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_18px_38px_-22px_rgba(20,20,20,0.16)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1B1D]/30 focus-visible:ring-offset-2',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      ].join(' ')}
    >
      <span className="z-10 relative flex flex-col items-start gap-2 md:gap-3 max-w-[78%] md:max-w-[62%] text-start">
        <h3 className="font-normal text-[#1B1B1D] text-[22px] md:text-[26px] lg:text-[32px] line-clamp-2 leading-tight tracking-tight">
          {name}
        </h3>
        {desc ? (
          <span className="text-[#77777A] text-[12px] md:text-[13px] lg:text-[14px] line-clamp-3 leading-6">
            {desc}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5 mt-2 pb-1 border-[#1B1B1D]/70 border-b font-medium text-[#1B1B1D] text-[12px] md:text-[13px]">
          {t('viewCategory')}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="group-hover:translate-x-[3px] rtl:group-hover:-translate-x-[3px] rtl:-scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>

      {/* Cover: bottom-right corner, whole photo, clipped by the card's rounded edge. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 right-0 h-[52%] w-[62%] ${imageClassName}`}
        style={imageScale !== 1 ? { transform: `scale(${imageScale})`, transformOrigin: 'right bottom' } : undefined}
      >
        <MediaImage
          src={categoryCover}
          alt={name}
          fill
          sizes="(max-width: 767px) 62vw, 400px"
          loading="lazy"
          style={{ objectPosition: imagePosition }}
          className="group-hover:scale-[1.04] motion-reduce:group-hover:scale-100 object-contain origin-bottom-right transition-transform duration-500 ease-out"
        />
      </span>
    </Link>
  );
}
