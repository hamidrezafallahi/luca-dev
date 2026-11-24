import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { IcChevronRight } from '@components/atoms/lucaIcons';
import CardPhoto from '@components/molecules/storefront/CardPhoto';
import { pickLocalized } from '@lib/utils';
import type { ICategory } from '@models/category';

type CategoryCardProps = {
  category: ICategory;
  /** Extra scale for the cover (1 = default size); for covers that look small or large. */
  imageScale?: number;
  /** CSS object-position for the cover. Default: center. */
  imagePosition?: string;
  /** Extra classes for the cover's box, e.g. a different width/height for one category. */
  imageClassName?: string;
};

export default async function CategoryCard({
  category,
  imageScale = 1,
  imagePosition = 'center',
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
  const [locale, t] = await Promise.all([getLocale(), getTranslations('common')]);
  const name = pickLocalized(locale, persianName, englishName).trim() || t('viewCategory');
  const desc = pickLocalized(locale, categoryPersianDesc, categoryEnglishDesc).trim();

  return (
    <div className="category-card min-w-0">
      <Link
        href={`/${locale}/categories/${category.slug || id}`}
        aria-label={name}
        className="category-card__link group/category grid h-full w-full min-w-0 touch-manipulation border border-store-border bg-store-surface text-start font-body text-store-text hover:border-store-strong"
      >
        <div className="category-card__media relative min-w-0 overflow-hidden bg-store-muted">
          <span
            className={`absolute inset-0 ${imageClassName}`}
            style={imageScale !== 1 ? { transform: `scale(${imageScale})` } : undefined}
          >
            <CardPhoto
              src={categoryCover}
              sizes="(max-width: 767px) 100vw, (max-width: 920px) 50vw, 28vw"
              position={imagePosition}
            />
          </span>
        </div>
        <div className="category-card__caption grid min-w-0 items-center gap-3">
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <h3 className="category-card__title text-pretty font-display font-medium leading-tight underline-offset-4 group-hover/category:underline">
              {name}
            </h3>
            {desc ? <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-store-subtle">{desc}</p> : null}
          </div>
          <IcChevronRight size={22} className="justify-self-end rtl:-scale-x-100" />
        </div>
      </Link>
    </div>
  );
}
