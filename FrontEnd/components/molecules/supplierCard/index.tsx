"use client";
import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { IUser } from '@models/user';

export default function SupplierCard({
  supplier,
}: {
  supplier: IUser;
}) {
  const locale = useLocale();
  const t = useTranslations('common');

  return (
    <Link
      href={`/${locale}/suppliers/${supplier.slug || supplier.id}`}
      className="group flex flex-col justify-center items-center gap-2 px-4 py-6 border hover:border-ink min-h-[230px] text-center transition-colors luca-line"
    >
      <span className="block relative rounded-full w-16 h-16 overflow-hidden luca-ph">
        <MediaImage
          src={supplier.image}
          alt={supplier.fullName}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </span>

      <h3 className="font-body font-normal text-[15px]">{supplier.fullName}</h3>

      <div className="flex flex-col text-[13px] luca-muted">
        <span>
          {supplier.role
            ? t('roleLabel', { role: supplier.role })
            : t('supplier')}
        </span>
        {supplier.phoneNumber ? <span dir="ltr">{supplier.phoneNumber}</span> : null}
        {supplier.email ? <span dir="ltr">{supplier.email}</span> : null}
      </div>

      {supplier.userDescription && (
        <p className="text-xs line-clamp-2 luca-muted">
          {supplier.userDescription}
        </p>
      )}

      <span className="pt-1 text-[13px] underline underline-offset-[6px]">
        {t('viewSupplierPlain')}
      </span>
    </Link>
  );
}
