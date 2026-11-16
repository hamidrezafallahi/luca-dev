'use client';

import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { Rate } from '@components/atoms/defaultElements/customRate';
import MediaImage from '@components/atoms/MediaImage';
import VariantPicker, { pickDefaultVariant } from '@components/molecules/variantPicker';
import { useAddToCart } from '@/hooks/useAddToCart';
import { getFeaturedProduct } from '@lib/featuredProducts';
import type { ILandingProduct } from '@models/product';

import { CardPlus, ImmersiveFeatureCard, ProductCardVariant } from './cardParts';

type Props = {
  product: ILandingProduct;
  /** Editorial by default; products in lib/featuredProducts.ts become immersive. */
  variant?: ProductCardVariant;
  /** `sizes` for the image; the default fits the landing carousel. */
  imageSizes?: string;
};

/**
 * Storefront product card (LUCA Card System v02). When the product has options
 * (e.g. magnification 2.5x / 3x / 3.5x) the shopper picks one on the card and the
 * price, discount badge, stock and add-to-cart all follow that option's offer.
 */
export default function VariantProductCard({
  product,
  variant: variantProp,
  imageSizes = '(max-width: 768px) 272px, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 320px',
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

  const featured = getFeaturedProduct(product);
  const cardVariant = variantProp ?? (featured ? 'immersive' : 'editorial');
  const label =
    product.brand || (locale === 'fa' ? product.persianCategoryName : product.englishCategoryName);

  // The immersive highlight leads to the product page, where the options are picked.
  if (cardVariant === 'immersive') {
    return (
      <ImmersiveFeatureCard
        href={href}
        name={product.name}
        description={product.description}
        image={featured?.image || product.mainImage}
        imagePosition={featured?.imagePosition}
        tint={featured?.tint}
        label={label || t('common.featured')}
        pill={
          <span className="luca-card-pill">
            {canBuy
              ? `${money.format(finalPrice!)} ${t('common.currency')}`
              : t('common.outOfStock')}
          </span>
        }
        pills={variants.map((v) => v.value)}
        ctaLabel={t('common.viewProduct')}
        imageSizes={imageSizes}
      />
    );
  }

  return (
    <article className="luca-card">
      {/* The title links to the product for keyboard and screen-reader users. */}
      <Link href={href} className="luca-card-media" tabIndex={-1} aria-hidden="true">
        {product.mainImage && (
          <MediaImage
            src={product.mainImage}
            alt={product.name}
            fill
            className="luca-card-img"
            sizes={imageSizes}
            loading="lazy"
          />
        )}
        <div className="luca-card-badges">
          {hasDiscount && (discountAmount ?? 0) > 0 && (
            <span className="luca-card-badge luca-card-badge-solid">
              {discountIsPercent
                ? `${money.format(discountAmount!)}${t('common.percentOff')}`
                : `-${money.format(discountAmount!)}`}
            </span>
          )}
          {!inStock && (
            <span className="luca-card-badge luca-card-badge-mute">{t('common.outOfStock')}</span>
          )}
        </div>
      </Link>

      <div className="luca-card-body">
        {label && <span className="luca-card-eyebrow">{label}</span>}
        <h3 className="luca-card-title">
          <Link href={href}>{product.name}</Link>
        </h3>
        {product.description && <p className="luca-card-desc">{product.description}</p>}
        {/* An unrated product shows no stars rather than five empty ones. */}
        {product.rateCount > 0 && (
          <div className="flex items-center">
            <Rate value={product.averageRate} />
          </div>
        )}

        <div className="luca-card-foot">
          {variants.length > 0 && (
            <VariantPicker
              variants={variants}
              selectedOfferId={selectedOfferId}
              onSelect={(v) => setSelectedOfferId(v.offerId)}
              size="sm"
              showLabel={false}
            />
          )}

          {/* Price at the start, compact add-to-cart pill at the end (reference card A). */}
          <div className="luca-card-actions">
            <div aria-live="polite" className="luca-card-price">
              {canBuy ? (
                <>
                  {hasDiscount && <span className="luca-card-price-old">{money.format(price!)}</span>}
                  <span className="luca-card-price-now">{money.format(finalPrice!)}</span>
                  <span className="luca-card-price-unit">{t('common.currency')}</span>
                </>
              ) : (
                <span className="luca-card-price-unit">{t('common.outOfStock')}</span>
              )}
            </div>

            <button
              type="button"
              disabled={!canBuy || pending}
              onClick={handleAdd}
              aria-label={t('common.addToCartAria', {
                name: variant ? `${product.name} ${variant.value}` : product.name,
              })}
              className="luca-card-action"
            >
              {t('common.add')}
              <CardPlus />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
