import React from 'react';

import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { SimpleResponse } from '@models/base';
import { IUser } from '@models/user';

export async function BrandSuppliers({ id }: { id: number }) {
  const result = await safeFetchJson<SimpleResponse<IUser[]>>(
    `${serverApiBaseUrl}/Brands/getProductsSuppliersByBrandId/${id}`,
    { next: { revalidate: 36 } },
  );
  const suppliers: IUser[] =
    result.ok && result.data?.isSuccess !== false ? result.data?.data || [] : [];
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <div className="flex flex-col">
      <h2 className="mb-8 luca-h2">{t('product.brandSuppliers')}</h2>
      <div className="gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-6 md:gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {suppliers.map((s) => (
          <Link
            key={s.id}
            href={`/${locale}/suppliers/${s.slug || s.id}`}
            className="flex flex-col justify-center items-center gap-1 px-4 py-6 border hover:border-ink min-h-[230px] text-center transition-colors luca-line"
          >
            <div className="relative flex justify-center items-center mb-2 rounded-full w-16 h-16 overflow-hidden luca-ph">
              <MediaImage
                src={s.userImage}
                alt={s.fullName}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="font-body font-normal text-[15px] text-center">
              {s.fullName}
            </h3>
            <span className="text-[13px] luca-muted" dir="ltr">{s.email}</span>
            <span className="text-[13px] luca-muted" dir="ltr">{s.phoneNumber}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
