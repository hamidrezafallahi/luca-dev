'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import VariantPicker, { pickDefaultVariant } from '@components/molecules/variantPicker';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { IDetailedProduct } from '@models/product';

/**
 * Price, option chips (e.g. magnification) and add-to-cart of the product page.
 * Choosing an option swaps the price, stock and the offer that goes in the cart.
 */
export default function ProductPurchase({ product }: { product: IDetailedProduct }) {
  const t = useTranslations();
  const locale = useLocale();
  const { add, pending } = useAddToCart();
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(
    () => pickDefaultVariant(variants, product.bestOfferId)?.offerId ?? null,
  );
  const variant = variants.find((v) => v.offerId === selectedOfferId) ?? null;

  const offerId = variant ? variant.offerId : product.bestOfferId ?? null;
  const price = variant ? variant.price : product.price ?? null;
  const finalPrice = variant ? variant.finalPrice : product.finalPrice ?? null;
  const inStock = variant ? variant.inStock : product.inStock !== false;
  const inventory = variant ? variant.inventory : product.inventory;

  const base = price ?? finalPrice ?? 0;
  const final = finalPrice ?? price ?? 0;
  const hasPrice = price != null || finalPrice != null;
  const hasDiscount = final > 0 && base > 0 && final < base;
  const canBuy = inStock && offerId != null && hasPrice;
  const money = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US');
  const unit = !product.currency || product.currency === 'IRR' ? t('common.currency') : product.currency;
  const stockLabel = !inStock
    ? t('common.outOfStock')
    : inventory != null && inventory > 0 && inventory <= 10
      ? t('common.lowStock', { count: inventory })
      : null;

  const handleAdd = () => {
    if (!canBuy) return;
    add({
      productId: product.id,
      productOfferId: offerId!,
      name: variant ? `${product.name} - ${variant.name ? `${variant.name} ` : ''}${variant.value}` : product.name,
      description: product.description,
      price: base,
      finalPrice: final,
      discountAmount: variant ? variant.discountAmount : product.discountAmount,
      discountIsPercent: variant ? variant.discountIsPercent : product.discountIsPercent,
      mainImage: product.mainImage,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {variants.length > 0 && (
        <VariantPicker
          variants={variants}
          selectedOfferId={selectedOfferId}
          onSelect={(v) => setSelectedOfferId(v.offerId)}
        />
      )}

      {hasPrice && (
        <div className="flex flex-col items-start gap-2" aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-2">
            {hasDiscount && <span className="text-sm line-through luca-muted">{money.format(base)}</span>}
            <span className={`text-[22px] ${hasDiscount ? 'font-semibold' : ''}`}>{money.format(final)}</span>
            <span className="text-sm luca-muted">{unit}</span>
          </div>
          {stockLabel && (
            <span className={`luca-badge ${inStock ? '' : 'luca-badge-mute'}`}>{stockLabel}</span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={!canBuy || pending}
        className="w-full store-btn store-btn-primary"
      >
        {t('product.chooseOffer')}
      </button>
    </div>
  );
}
