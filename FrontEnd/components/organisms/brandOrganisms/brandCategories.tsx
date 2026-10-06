import React from 'react';

import { getTranslations } from 'next-intl/server';

import CategoryCard from '@components/molecules/categoryCart';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import { ICategory } from '@models/category';

export async function BrandCategories({ id }: { id: number }) {
  const result = await safeFetchJson<SimpleResponse<ICategory[]>>(
    `${serverApiBaseUrl}/Brands/getProductsCategoriesByBrandId/${id}`,
    { next: { revalidate: 36 } },
  );
  const categories: ICategory[] =
    result.ok && result.data?.isSuccess !== false ? result.data?.data || [] : [];
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <h2 className="mb-8 luca-h2">{t('product.brandCategories')}</h2>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-5 grid grid-cols-2 md:grid-cols-4">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} category={cat} />
        ))}
      </div>
    </div>
  );
}
