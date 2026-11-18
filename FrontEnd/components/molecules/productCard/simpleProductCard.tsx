import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';

import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import type { SimpleResponse } from '@models/base';
import type { IDetailedProduct, ILandingProduct } from '@models/product';

import { PriceLabel, ProductShowcaseCard } from './cardParts';
import { ISimpleProduct } from './type';
import VariantProductCard from './variantProductCard';

/**
 * Listing product card (products, category, brand and tag pages).
 *
 * The listing endpoints carry no offers, so the card reads the product's own
 * record (cached like the product page) to show the magnification chips with
 * each one's price, stock, add-to-cart and the full photo gallery, exactly
 * like the home-page rail. If that read fails it falls back to the listing
 * data, with "buy" opening the product page.
 */
async function fetchCardDetail(key: string | number): Promise<IDetailedProduct | null> {
  const result = await safeFetchJson<SimpleResponse<IDetailedProduct> | IDetailedProduct>(
    `${serverApiBaseUrl}/Products/${encodeURIComponent(String(key))}`,
    { next: { revalidate: 60 } },
    1,
  );
  if (!result.ok || !result.data || typeof result.data !== 'object') return null;
  if ('isSuccess' in result.data || 'data' in result.data) {
    const envelope = result.data as SimpleResponse<IDetailedProduct>;
    return envelope.isSuccess === false ? null : envelope.data ?? null;
  }
  return result.data as IDetailedProduct;
}

function toCardProduct(d: IDetailedProduct, listing: ISimpleProduct): ILandingProduct {
  return {
    id: d.id,
    slug: d.slug ?? listing.slug,
    bestOfferId: d.bestOfferId ?? null,
    name: d.name || listing.name,
    description: d.description ?? listing.description,
    price: d.price ?? null,
    inventory: d.inventory ?? 0,
    inStock: d.inStock ?? false,
    persianCategoryName: d.categoryName ?? listing.persianCategoryName ?? listing.categoryName ?? '',
    englishCategoryName: d.categoryEnglishName ?? listing.englishCategoryName ?? '',
    brand: d.brandName ?? listing.brandName ?? '',
    discountIsPercent: d.discountIsPercent ?? null,
    discountAmount: d.discountAmount ?? null,
    finalPrice: d.finalPrice ?? null,
    mainImage: d.mainImage || listing.mainImage || '',
    averageRate: d.averageRate ?? 0,
    rateCount: d.rateCount ?? 0,
    variants: d.variants ?? [],
  };
}

export async function SimpleProductCard({ product }: { product: ISimpleProduct }) {
  const detail = await fetchCardDetail(product.slug || product.id);
  if (detail) {
    return (
      <VariantProductCard
        product={toCardProduct(detail, product)}
        images={[detail.mainImage || product.mainImage, ...(detail.imageUrls ?? [])]}
        imageSizes="(max-width: 767px) 50vw, 400px"
      />
    );
  }

  const locale = await getLocale();
  const t = await getTranslations('common');
  const href = `/${locale}/products/${product.slug || product.id}`;

  const category =
    product.categoryName ||
    (locale === 'fa' ? product.persianCategoryName : product.englishCategoryName) ||
    product.brandName ||
    null;

  const hasPrice = Boolean((product.finalPrice ?? 0) > 0 || (product.price ?? 0) > 0);

  return (
    <ProductShowcaseCard
      href={href}
      name={product.name}
      category={category}
      images={[product.mainImage, ...(product.imageUrls ?? [])]}
      price={
        hasPrice ? (
          <PriceLabel
            price={product.price}
            finalPrice={product.finalPrice}
            locale={locale}
            currency={t('currency')}
          />
        ) : undefined
      }
      buy={{ href }}
    />
  );
}
