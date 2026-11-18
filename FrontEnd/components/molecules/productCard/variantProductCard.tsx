'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import VariantPicker, { pickDefaultVariant } from '@components/molecules/variantPicker';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { ILandingProduct } from '@models/product';

import { PriceLabel, ProductShowcaseCard } from './cardParts';

type Props = {
  product: ILandingProduct;
  /** `sizes` for the image; the default fits the landing carousel. */
  imageSizes?: string;
  /** All product photos, main image first; defaults to the main image alone. */
  images?: (string | null | undefined)[];
};

/**
 * Storefront product card with the shopper's chosen option. When the product has
 * options (e.g. magnification 2.5x / 3x / 3.5x) the price and "buy now" follow
 * the chosen option's offer. "Buy now" adds it to the cart and opens the cart.
 */
export default function VariantProductCard({
  product,
  imageSizes = '(max-width: 640px) 72vw, 320px',
  images,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { add, pending } = useAddToCart();
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(
    () => pickDefaultVariant(variants, product.bestOfferId)?.offerId ?? null,
  );
  const variant = variants.find((v) => v.offerId === selectedOfferId) ?? null;

  // With options, everything shown comes from the chosen option; otherwise from the best offer.
  const offerId = variant ? variant.offerId : product.bestOfferId;
  const price = variant ? variant.price : product.price;
  const finalPrice = variant ? variant.finalPrice : product.finalPrice;
  const discountAmount = variant ? variant.discountAmount : product.discountAmount;
  const discountIsPercent = variant ? variant.discountIsPercent : product.discountIsPercent;
  const inStock = variant ? variant.inStock : product.inStock;

  const canBuy = inStock && offerId != null && price != null && finalPrice != null;
  const href = `/${locale}/products/${product.slug || product.id}`;

  const handleBuy = async () => {
    if (!canBuy) return;
    const added = await add({
      productId: product.id,
      productOfferId: offerId!,
      name: variant ? `${product.name} - ${variant.name ? `${variant.name} ` : ''}${variant.value}` : product.name,
      description: product.description,
      price: price!,
      finalPrice: finalPrice!,
      discountAmount,
      discountIsPercent,
      mainImage: product.mainImage,
    });
    if (added) router.push(`/${locale}/shoppingCart`);
  };

  return (
    <ProductShowcaseCard
      href={href}
      name={product.name}
      category={
        (locale === 'fa' ? product.persianCategoryName : product.englishCategoryName) || product.brand
      }
      images={images ?? [product.mainImage]}
      imageSizes={imageSizes}
      outOfStock={!canBuy}
      price={
        canBuy ? (
          <PriceLabel
            price={price}
            finalPrice={finalPrice}
            locale={locale}
            currency={t('common.currency')}
          />
        ) : undefined
      }
      options={
        variants.length > 1 ? (
          <VariantPicker
            variants={variants}
            selectedOfferId={selectedOfferId}
            onSelect={(v) => setSelectedOfferId(v.offerId)}
            size="sm"
            showLabel={false}
          />
        ) : undefined
      }
      buy={{
        onClick: handleBuy,
        disabled: !canBuy || pending,
        ariaLabel: `${t('common.buyNow')}: ${variant ? `${product.name} ${variant.value}` : product.name}`,
      }}
    />
  );
}
