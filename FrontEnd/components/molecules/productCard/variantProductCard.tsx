'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { Rate } from '@components/atoms/defaultElements/customRate';
import MediaImage from '@components/atoms/MediaImage';
import VariantPicker, { pickDefaultVariant } from '@components/molecules/variantPicker';
import { useAddToCart } from '@/hooks/useAddToCart';
import type { ILandingProduct } from '@models/product';

type Props = {
  product: ILandingProduct;
  /** `sizes` for the image; the default fits the landing carousel. */
  imageSizes?: string;
};

/**
 * Storefront product card. When the product has options (e.g. magnification
 * 2.5x / 3x / 3.5x) the shopper picks one on the card and the price, discount
 * badge, stock and add-to-cart all follow that option's offer.
 */
export default function VariantProductCard({
  product,
  imageSizes = '(max-width: 640px) 168px, (max-width: 1024px) 236px, 310px',
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
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
  const hasDiscount = canBuy && finalPrice! < price!;
  const money = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US');
  const href = `/${locale}/products/${product.slug || product.id}`;

  const handleAdd = () => {
    if (!canBuy) return;
    add({
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
  };

  return (
    <article className="flex flex-col gap-3.5 w-full h-full min-w-0">
      <Link href={href} className="group block relative w-full aspect-[31/34] overflow-hidden luca-ph">
        <MediaImage
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={imageSizes}
          loading="lazy"
        />
        <div className="top-3 z-10 absolute flex flex-col items-start gap-1.5 start-3">
          {hasDiscount && (discountAmount ?? 0) > 0 && (
            <span className="luca-badge luca-badge-accent">
              {discountIsPercent
                ? `${money.format(discountAmount!)}${t('common.percentOff')}`
                : `-${money.format(discountAmount!)}`}
            </span>
          )}
          {!inStock && <span className="luca-badge luca-badge-mute">{t('common.outOfStock')}</span>}
        </div>
      </Link>

      <div className="flex flex-col flex-1 items-center gap-1.5 text-center">
        {product.brand && <span className="text-xs luca-muted">{product.brand}</span>}
        <Link href={href} className="hover:underline underline-offset-4">
          <h3 className="font-body font-normal text-[15px] line-clamp-2 leading-relaxed">{product.name}</h3>
        </Link>
        <div className="flex justify-center items-center">
          <Rate value={product.averageRate} />
        </div>

        {variants.length > 0 && (
          <div className="py-1 w-full">
            <VariantPicker
              variants={variants}
              selectedOfferId={selectedOfferId}
              onSelect={(v) => setSelectedOfferId(v.offerId)}
              size="sm"
              showLabel={false}
              align="center"
            />
          </div>
        )}

        <div aria-live="polite" className="flex flex-wrap justify-center items-baseline gap-x-2 min-h-[1.5rem] text-sm">
          {canBuy ? (
            <>
              {hasDiscount && <span className="line-through luca-muted">{money.format(price!)}</span>}
              <span className={hasDiscount ? 'font-semibold' : ''}>{money.format(finalPrice!)}</span>
              <span className="luca-muted">{t('common.currency')}</span>
            </>
          ) : (
            <span className="luca-muted">{t('common.outOfStock')}</span>
          )}
        </div>

        <button
          type="button"
          disabled={!canBuy || pending}
          onClick={handleAdd}
          aria-label={t('common.addToCartAria', {
            name: variant ? `${product.name} ${variant.value}` : product.name,
          })}
          className="mt-auto !px-3 w-full !h-10 !text-[13px] store-btn"
        >
          {t('common.addToCart')}
        </button>
      </div>
    </article>
  );
}
