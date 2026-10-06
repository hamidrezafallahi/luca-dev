import React from 'react';

import {
  getLocale,
  getTranslations,
} from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IUser } from '@models/user';

export async function SimpleSupplierCard({
  supplier,
}: {
  supplier: IUser;
}) {
  const locale = await getLocale();
  const t = await getTranslations();
  return (
    <Link
      className="group flex flex-col justify-center items-center gap-2 px-4 py-6 border hover:border-ink min-h-[230px] text-center transition-colors luca-line"
      href={`/${locale}/suppliers/${supplier.slug || supplier.id}`}
    >
      <span className="block relative rounded-full w-16 h-16 overflow-hidden luca-ph">
        <MediaImage
          alt={supplier.fullName}
          src={supplier.image}
          width={64}
          height={64}
          className="w-16 h-16 object-cover"
        />
      </span>
      <span className="text-[15px]">{supplier.fullName}</span>
      {supplier.userDescription && (
        <span className="text-xs line-clamp-2 luca-muted">{supplier.userDescription}</span>
      )}
      {supplier.email && <span className="text-[13px] luca-muted" dir="ltr">{supplier.email}</span>}
      {supplier.phoneNumber && (
        <span className="text-[13px] luca-muted" dir="ltr">{supplier.phoneNumber}</span>
      )}
      <span className="pt-1 text-[13px] underline underline-offset-[6px]">
        {t("common.viewSupplierPlain")}
      </span>
    </Link>
  );
}
