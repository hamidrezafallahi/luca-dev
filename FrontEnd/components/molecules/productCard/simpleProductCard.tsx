import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';

import { PriceLabel, ProductShowcaseCard } from './cardParts';
import { ISimpleProduct } from './type';

/**
 * Listing product card (products, category, brand and tag pages).
 * These listings carry no offer to put in the cart, so "buy" opens the product
 * page, where the shopper picks the option and buys.
 */
export async function SimpleProductCard({ product }: { product: ISimpleProduct }) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  const href = `/${locale}/products/${product.slug || product.id}`;

  const category =
    product.categoryName ||
    (locale === 'fa' ? product.persianCategoryName : product.englishCategoryName) ||
    product.brandName ||
    null;

  const price = (
    <PriceLabel
      price={product.price}
      finalPrice={product.finalPrice}
      locale={locale}
      currency={t('currency')}
    />
  );
  const hasPrice = Boolean((product.finalPrice ?? 0) > 0 || (product.price ?? 0) > 0);

  return (
    <ProductShowcaseCard
      href={href}
      name={product.name}
      category={category}
      description={product.description}
      images={[product.mainImage, ...(product.imageUrls ?? [])]}
      price={hasPrice ? price : undefined}
      buy={{ href }}
    />
  );
}
