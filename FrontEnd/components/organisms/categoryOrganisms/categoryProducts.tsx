import React from 'react';

import { getTranslations } from 'next-intl/server';

import { SimpleProductCard } from '@components/molecules/productCard';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import { ILandingProduct } from '@models/product';

export async function CategoryProducts({ id }: { id: number }) {
  const t = await getTranslations('productsPage');

  const result = await safeFetchJson<SimpleResponse<ILandingProduct[] | { records?: ILandingProduct[] }>>(
    `${serverApiBaseUrl}/Products/getProductByCategoryId/${id}`,
    { next: { revalidate: 36 } },
  );

  if (!result.ok || !result.data) return null;

  const payload = result.data.data;
  const products: ILandingProduct[] = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.records)
      ? payload.records
      : [];

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="mb-8 luca-h2">{t('title')}</h2>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-7 md:gap-y-10 lg:gap-y-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <SimpleProductCard
            key={product.id ?? product.slug}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
