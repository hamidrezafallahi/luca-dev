import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { ICategory } from '@models/category';

import CategoryCard from '../categoryCart';

interface IProps {
  categories: ICategory[];
}
export default async  function LandingCategory(props: IProps) {
  const { categories } = props;
  const locale = await getLocale();
  const t = await getTranslations('landing');
  return (
    <section id="categories" className="flex flex-col gap-10 store-section luca-container">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="luca-h2">{t('categoriesTitle')}</h2>
        <Link href={`/${locale}/categories`} className="luca-link">
          {t('viewAllCategories')}
        </Link>
      </div>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-5 grid grid-cols-2 md:grid-cols-4">
        {categories?.map((cat, index) => (
          <CategoryCard key={index} category={cat} />
        ))}
      </div>
    </section>
  );
}
