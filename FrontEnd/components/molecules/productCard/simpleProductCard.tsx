import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

import { ISimpleProduct } from './type';

export async function SimpleProductCard({
  product,
}: {
  product: ISimpleProduct;
}) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  const href = `/${locale}/products/${product.slug || product.id}`;
  return (
    <article key={product.id} className="flex flex-col flex-shrink-0 gap-3.5 w-full min-w-0">
      <Link href={href} className="block relative w-full aspect-[31/34] overflow-hidden luca-ph" aria-label={product.name}>
        <MediaImage
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 310px"
        />
      </Link>
      <div className="flex flex-col items-center gap-1 text-center">
        <Link href={href} className="hover:underline underline-offset-4">
          <h4 className="font-body font-normal text-[15px] line-clamp-2 leading-relaxed">{product.name}</h4>
        </Link>
        <p className="text-[13px] line-clamp-1 luca-muted">{product.description}</p>
        {product.suppliers && product.suppliers?.length > 0 ? (
          <div className="flex justify-center items-center -space-x-2 rtl:space-x-reverse pt-1">
            {product.suppliers.map((s, idx) => (
              <Link
                className="hover:z-20 relative bg-white border rounded-full w-9 h-9 overflow-hidden luca-line"
                key={idx}
                href={`/${locale}/suppliers/${s.id}`}
                aria-label={s.fullName}
              >
                <MediaImage
                  alt={s.fullName}
                  src={s.image}
                  fill
                  sizes="36px"
                  loading="lazy"
                  className="rounded-full object-cover"
                />
              </Link>
            ))}
          </div>
        ) : (
          <Link href={href} className="text-[13px] luca-link">
            {t('view')}
          </Link>
        )}
      </div>
    </article>
  );
}
