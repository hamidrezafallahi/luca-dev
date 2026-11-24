'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { IcChevronRight } from '@components/atoms/lucaIcons';

import { ProductImageSlider } from './productImageSlider';

type BuyAction =
  /** Goes to a page, e.g. the product page where the option and offer are chosen. */
  | { href: string }
  /** Runs the card's own purchase flow (add to cart, then on to the cart). */
  | { onClick: () => void; disabled?: boolean; ariaLabel?: string };

export type ProductShowcaseCardProps = {
  href: string;
  name: string;
  /** Supporting classification (category, else brand or supplier). */
  category?: string | null;
  /** Product photos, main image first. Rotation and indicators appear only with two or more. */
  images: (string | null | undefined)[];
  /** Price line content (see PriceLabel). Without one a "see price" link is shown. */
  price?: React.ReactNode;
  /** Shows "out of stock" in place of the price. */
  outOfStock?: boolean;
  buy: BuyAction;
  /** Option chips (e.g. magnification) shown above the button. */
  options?: React.ReactNode;
  imageSizes?: string;
  /** Load the main photo eagerly (only for cards known to be above the fold). */
  priority?: boolean;
};

export function ProductShowcaseCard({
  href,
  name,
  category,
  images,
  price,
  outOfStock = false,
  buy,
  options,
  imageSizes,
  priority,
}: ProductShowcaseCardProps) {
  const t = useTranslations('common');
  const buyLabel = (
    <>
      <span className="min-w-0 [overflow-wrap:anywhere]">{t('buyNow')}</span>
      <IcChevronRight size={16} className="shrink-0 rtl:-scale-x-100" />
    </>
  );

  return (
    <article className="group/card relative isolate flex h-full w-full min-w-0 flex-col font-body text-store-text">
      <ProductImageSlider
        href={href}
        name={name}
        images={images}
        sizes={imageSizes}
        priority={priority}
      />

      <div className="mt-3 flex min-w-0 flex-1 flex-col text-start md:mt-4">
        <h3 className="product-card__title text-pretty font-display font-medium leading-tight [overflow-wrap:anywhere]">
          <Link
            href={href}
            className="underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:underline"
          >
            {name}
          </Link>
        </h3>
        {category?.trim() ? (
          <p className="mt-0.5 text-xs font-normal leading-relaxed text-store-subtle [overflow-wrap:anywhere]">
            {category}
          </p>
        ) : null}

        <div
          className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm font-medium leading-relaxed tabular-nums [overflow-wrap:anywhere]"
          aria-live="polite"
        >
          {outOfStock ? (
            <span className="font-normal text-store-subtle">{t('outOfStock')}</span>
          ) : price ? (
            price
          ) : (
            <Link href={href} className="relative z-10 underline-offset-4 hover:underline focus-visible:underline">
              {t('seePrice')}
            </Link>
          )}
        </div>

        {options ? <div className="pc-options relative z-10 mt-2.5">{options}</div> : null}

        <div className="mt-auto pt-3">
          {'href' in buy ? (
            <Link href={buy.href} aria-label={`${t('buyNow')}: ${name}`} className={buyClass}>
              {buyLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={buy.onClick}
              disabled={buy.disabled}
              aria-label={buy.ariaLabel}
              className={buyClass}
            >
              {buyLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const buyClass = [
  'relative z-10 flex min-h-11 w-full touch-manipulation items-center justify-between gap-2 px-2.5 py-1.5 text-start sm:px-3',
  'border border-store-border bg-store-surface text-sm font-medium leading-snug text-store-text',
  '[&:not(:disabled):hover]:border-store-strong [&:not(:disabled):hover]:bg-store-muted',
  'disabled:cursor-not-allowed disabled:text-store-subtle',
].join(' ');

/** Formats a toman amount for the price line: old price (struck) when discounted, then the price. */
export function PriceLabel({
  price,
  finalPrice,
  locale,
  currency,
}: {
  price?: number | null;
  finalPrice?: number | null;
  locale: string;
  currency: string;
}) {
  const now = finalPrice && finalPrice > 0 ? finalPrice : price;
  if (!now || now <= 0) return null;
  const money = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US');
  return (
    <>
      <span>
        <bdi>{money.format(now)}</bdi>{' '}
        <span className="text-xs font-normal text-store-subtle">{currency}</span>
      </span>
      {price && price > now ? (
        <s className="text-xs font-normal text-store-subtle"><bdi>{money.format(price)}</bdi></s>
      ) : null}
    </>
  );
}
