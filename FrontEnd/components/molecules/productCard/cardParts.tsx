'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ProductImageSlider } from './productImageSlider';

/**
 * Light product card. Two parts:
 *  1. the photo panel (#F8F8F8, 26px corners, faint shadow) with the product
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
    <article className="group relative flex flex-col w-full min-w-0 h-full">
      <ProductImageSlider
        href={href}
        name={name}
        images={images}
        sizes={imageSizes}
        priority={priority}
      />

      <div className="flex flex-col flex-1 mt-3 md:mt-4 px-1 text-start">
        <p className="min-h-[1.25rem] font-normal text-[#77777A] text-[11px] md:text-[12px] uppercase truncate tracking-[0.06em] leading-5">
          {category || t('productsLabel')}
        </p>

        <h3 className="mt-0.5 min-h-[3rem] md:min-h-[3.25rem] font-normal text-[#1B1B1D] text-[14px] md:text-[17px] line-clamp-2 leading-6 md:leading-[1.625rem]">
          {/* Stretched link: the card's text area opens the product too. */}
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline underline-offset-4"
          >
            {name}
          </Link>
        </h3>

        <div
          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-1 min-h-[1.5rem] font-normal tabular-nums text-[#1B1B1D] text-[13px] md:text-[14px] leading-6"
          aria-live="polite"
        >
          {outOfStock ? (
            <span className="text-[#77777A]">{t('outOfStock')}</span>
          ) : price ? (
            price
          ) : (
            <Link
              href={href}
              className="z-10 relative text-[#1B1B1D] hover:underline underline-offset-4"
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
  'relative z-10 flex h-10 w-full items-center justify-center rounded-full',
  'bg-[var(--primary-color)] text-[13px] font-medium text-white',
  'transition-[filter,opacity] duration-300 hover:brightness-110',
  'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-color)] focus-visible:ring-offset-2',
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
        <span className="font-normal text-[#77777A] text-[11px] md:text-[12px]">{currency}</span>
      </span>
      {price && price > now ? (
        <span className="font-normal text-[#9A9A9D] text-[11px] md:text-[12px] line-through">
          {money.format(price)}
        </span>
      ) : null}
    </>
  );
}
