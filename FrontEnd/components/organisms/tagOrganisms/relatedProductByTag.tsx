import React from 'react';

import { getTranslations } from 'next-intl/server';

import { SimpleProductCard } from '@components/molecules/productCard';
import { ISimpleProduct } from '@components/molecules/productCard/type';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';

export async function RelatedProductByTag({ tagId }: { tagId: number }) {
  const result = await safeFetchJson<SimpleResponse<ISimpleProduct[]>>(
    `${serverApiBaseUrl}/ProductOfferTags/tag/${tagId}`,
    { next: { revalidate: 36 } },
  );
  const products: ISimpleProduct[] =
    result.ok && result.data?.isSuccess !== false ? result.data?.data || [] : [];
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <h2 className="mb-8 luca-h2">{t('product.tagProducts')}</h2>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-7 md:gap-y-10 lg:gap-y-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, idx) => (
          <SimpleProductCard key={idx} product={p} />
        ))}
      </div>
    </div>
  );
}
