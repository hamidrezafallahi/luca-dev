// @components/molecules/productCard.tsx
"use client";

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

import { IDetailedProductCardProps } from './type';

export function DetailedProductCard({
  product,
  locale,
}: IDetailedProductCardProps) {
  const t = useTranslations('common');
  const [isHovered, setIsHovered] = useState(false);
  // محاسبه تخفیف
  const hasDiscount =
    product.finalPrice > 0 && product.finalPrice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
    : 0;

  // قیمت نهایی
  const finalPrice =
    product.finalPrice > 0 ? product.finalPrice : product.price;

  // موجودی
  const isOutOfStock = product.inventory <= 0;
  const isLowStock = product.inventory > 0 && product.inventory <= 10;

  // تصویر محصول
  const imageSrc = product.mainImage || product.imageUrl;

  const href = `/${locale}/products/${product.slug || product.id}`;

  return (
    <div className="group flex flex-col gap-3.5 min-w-0">
      {/* تصویر محصول */}
      <Link
        href={href}
        className="block relative aspect-[31/34] overflow-hidden luca-ph"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MediaImage
          src={imageSrc}
          fallbackSrc="/images/default-product.jpg"
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={85}
        />

        {/* تخفیف و وضعیت موجودی */}
        <div className="top-3 z-10 absolute flex flex-col items-start gap-1.5 start-3">
          {hasDiscount && (
            <span className="luca-badge luca-badge-accent">
              {discountPercentage}% {t('percentOff')}
            </span>
          )}
          {isOutOfStock && (
            <span className="luca-badge luca-badge-mute">{t('outOfStock')}</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="luca-badge">{t('lowStockShort')}</span>
          )}
        </div>
      </Link>

      {/* اطلاعات محصول */}
      <div className="flex flex-col items-center gap-1 text-center">
        {(product.categoryName || product.brandName) && (
          <span className="text-xs luca-muted">
            {[product.brandName, product.categoryName].filter(Boolean).join(' · ')}
          </span>
        )}

        <Link href={href} className="hover:underline underline-offset-4">
          <h3 className="font-body font-normal text-[15px] line-clamp-2 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* قیمت */}
        <div className="flex flex-wrap justify-center items-baseline gap-x-2 text-sm">
          {hasDiscount && (
            <span className="line-through luca-muted">
              {product.price?.toLocaleString()}
            </span>
          )}
          <span className={hasDiscount ? "font-semibold" : ""}>
            {finalPrice?.toLocaleString()}
          </span>
          <span className="luca-muted">{t('currency')}</span>
        </div>

        {/* رتبه‌بندی (اختیاری) */}
        {product.rating !== undefined && (
          <span
            className="text-xs luca-muted"
            aria-label={t('ratingAria', { value: product.rating.toFixed(1), max: 5 })}
          >
            ★ {product.rating.toFixed(1)}
          </span>
        )}

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => {
            // افزودن به سبد خرید
            console.log("Add to cart:", product.id);
          }}
          className="disabled:opacity-40 text-[13px] disabled:no-underline disabled:cursor-not-allowed luca-link"
        >
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}
