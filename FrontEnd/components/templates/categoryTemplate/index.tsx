import React from 'react';

import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import Link from 'next/link';

import { Banner } from '@components/molecules/banner';
import {
  CategoryDescription,
  CategoryProducts,
  CategorySupplierExtended,
  SubCategories,
} from '@components/organisms/categoryOrganisms';
import { pickLocalized } from '@lib/utils';
import { ICategory } from '@models/category';

export default async function CategoryTemplate({
  category,
  parent = null,
}: {
  category: ICategory;
  /** Resolved parent category; null when there is none or it is not published. */
  parent?: ICategory | null;
}) {
  const locale = await getLocale();
  const t = await getTranslations();

  if (!category) {
    return null;
  }

  const name = pickLocalized(locale, category.persianName, category.englishName);

  return (
    <div className="flex flex-col gap-12 md:gap-16 w-full">
      {/* Category head: title, description, cover */}
      <section className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-2.5 py-4 md:py-8 text-center">
          {parent ? (
            <Link
              className="text-[13px] luca-link luca-muted"
              href={`/${locale}/categories/${parent.slug || parent.id}`}
            >
              {t('category.goToParent')}
            </Link>
          ) : null}
          <h1 className="luca-h1">{name}</h1>
          <CategoryDescription
            desc={pickLocalized(
              locale,
              category.categoryPersianDesc,
              category.categoryEnglishDesc
            )}
          />
        </header>
        <Banner src={category.categoryCover} name={name} />
      </section>

      <SubCategories sub={category.subCategories ?? []} />
      <CategoryProducts id={category.id} />
      <CategorySupplierExtended id={category.id} />
    </div>
  );
}
