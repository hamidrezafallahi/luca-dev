import React from 'react';

import { getTranslations } from 'next-intl/server';

import { SimpleProductCard } from '@components/molecules/productCard';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import { IProduct } from '@models/product';

export async function BrandProducts({ id }: { id: number }) {
  const result = await safeFetchJson<SimpleResponse<IProduct[]>>(
    `${serverApiBaseUrl}/Brands/getProductByBrandId/${id}`,
    { next: { revalidate: 36 } },
  );
  const products: IProduct[] =
    result.ok && result.data?.isSuccess !== false ? result.data?.data || [] : [];
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <h2 className="mb-8 luca-h2">{t('product.brandProducts')}</h2>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-7 md:gap-y-10 lg:gap-y-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, idx) => (
          <SimpleProductCard key={idx} product={product} />
        ))}
      </div>
    </div>
  );
}
