'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ProductImageSlider } from './productImageSlider';

/**
 * Product card. Two parts:
 *  1. the photo panel (rounded with a faint shadow) with the product
 *     centred and cross-fading through its photos every 2s, main image first;
 *  2. the details below it on the page background: category/brand, name,
 *     price (old price struck through when discounted) or stock state, option
 *     chips and the buy button.
 *
 * Every storefront product card renders through this shell; the callers supply
 * the real data and decide what "buy" does. The card fills its container's
 * width (rail slot or grid cell), and rows of cards keep equal heights.
 */

type BuyAction =
  /** Goes to a page, e.g. the product page where the option and offer are chosen. */
  | { href: string }
  /** Runs the card's own purchase flow (add to cart, then on to the cart). */
  | { onClick: () => void; disabled?: boolean; ariaLabel?: string };

export type ProductShowcaseCardProps = {
  href: string;
  name: string;
  /** Small label above the name (category, else brand or supplier). */
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

  return (
    <article className="group relative flex flex-col w-full min-w-0 h-full font-body">
      <ProductImageSlider
        href={href}
        name={name}
        images={images}
        sizes={imageSizes}
        priority={priority}
      />

      <div className="flex flex-col flex-1 mt-3 md:mt-4 px-1 text-start">
        <p className="font-normal text-store-subtle text-[11px] md:text-[12px] uppercase truncate tracking-[0.06em] leading-relaxed">
          {category || t('productsLabel')}
        </p>

        <h3 className="mt-0.5 min-h-[2lh] font-display text-store-text text-[14px] md:text-[17px] line-clamp-2 leading-snug">
          {/* Stretched link: the card's text area opens the product too. */}
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline underline-offset-4"
          >
            {name}
          </Link>
        </h3>

        <div
          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-1 min-h-[1.5rem] font-normal tabular-nums text-store-text text-[13px] md:text-[14px] leading-relaxed"
          aria-live="polite"
        >
          {outOfStock ? (
            <span className="text-store-subtle">{t('outOfStock')}</span>
          ) : price ? (
            price
          ) : (
            <Link
              href={href}
              className="z-10 relative text-store-text hover:underline underline-offset-4"
            >
              {t('seePrice')}
            </Link>
          )}
        </div>

        {options && <div className="z-10 relative mt-2.5 pc-options">{options}</div>}

        {/* mt-auto pins the button to the bottom so buttons line up across a row. */}
        <div className="mt-auto pt-3">
          {'href' in buy ? (
            <Link href={buy.href} aria-label={`${t('buyNow')}: ${name}`} className={buyClass}>
              {t('buyNow')}
            </Link>
          ) : (
            <button
              type="button"
              onClick={buy.onClick}
              disabled={buy.disabled}
              aria-label={buy.ariaLabel}
              className={buyClass}
            >
              {t('buyNow')}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const buyClass = [
  'relative z-10 flex min-h-10 w-full items-center justify-center rounded-full px-2 py-1 text-center leading-snug',
  'bg-primary text-[13px] font-medium text-primary-foreground',
  'transition-[filter,opacity] duration-300 hover:brightness-110',
  'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-store-surface',
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
        {money.format(now)}{' '}
        <span className="font-normal text-store-subtle text-[11px] md:text-[12px]">{currency}</span>
      </span>
      {price && price > now ? (
        <span className="font-normal text-store-subtle text-[11px] md:text-[12px] line-through">
          {money.format(price)}
        </span>
      ) : null}
    </>
  );
}
