'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

/**
 * Product showcase card: white rounded image panel over a graphite body with a
 * price pill and a buy button (styles: "Product showcase card" in globals.css).
 * Every storefront product card renders through this shell; the callers supply
 * the real data and decide what "buy" does.
 */

type BuyAction =
  /** Goes to a page, e.g. the product page where the option and offer are chosen. */
  | { href: string }
  /** Runs the card's own purchase flow (add to cart, then on to the cart). */
  | { onClick: () => void; disabled?: boolean; ariaLabel?: string };

export type ProductShowcaseCardProps = {
  href: string;
  name: string;
  /** Small label above the title (category, else brand). */
  category?: string | null;
  description?: string | null;
  /** Product photos, main image first. Pagination appears only with two or more. */
  images: (string | null | undefined)[];
  /** Price pill content. Without one the pill links to the product to see the price. */
  price?: React.ReactNode;
  buy: BuyAction;
  /** Option chips (e.g. magnification) shown above the buttons. */
  options?: React.ReactNode;
  imageSizes?: string;
};

export function ProductShowcaseCard({
  href,
  name,
  category,
  description,
  images,
  price,
  buy,
  options,
  imageSizes = '(max-width: 640px) 90vw, 380px',
}: ProductShowcaseCardProps) {
  const t = useTranslations('common');
  const photos = Array.from(new Set(images.filter((src): src is string => Boolean(src))));
  const [index, setIndex] = useState(0);
  const current = photos[index] ?? null;
  const many = photos.length > 1;

  return (
    <article className="pc-card">
      <div className="pc-panel">
        {/* The back control steps through the photos; with one photo there is nothing to go back to. */}
        {many && (
          <button
            type="button"
            className="pc-control pc-control-start"
            onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
            aria-label={t('previousImage')}
          >
            <ChevronIcon />
          </button>
        )}

        {/* The title link and the more control lead to the product for keyboard users. */}
        <Link href={href} className="pc-photo" tabIndex={-1} aria-hidden="true">
          {current && (
            <MediaImage
              key={current}
              src={current}
              alt={name}
              fill
              className="pc-img"
              sizes={imageSizes}
              loading="lazy"
            />
          )}
        </Link>

        {many && (
          <div className="pc-dots">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                className="pc-dot"
                aria-current={i === index}
                aria-label={t('imageOf', { n: i + 1, total: photos.length })}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pc-body">
        <span className="pc-category">{category || t('productsLabel')}</span>
        <h3 className="pc-title">
          <Link href={href}>{name}</Link>
        </h3>
        {description && <p className="pc-desc">{description.trim()}</p>}
        {options && <div className="pc-options">{options}</div>}

        <div className="pc-actions">
          {price ? (
            <span className="pc-pill pc-price" aria-live="polite">
              {price}
            </span>
          ) : (
            <Link href={href} className="pc-pill pc-price">
              {t('seePrice')}
            </Link>
          )}
          {'href' in buy ? (
            <Link href={buy.href} className="pc-pill pc-buy" aria-label={`${t('buyNow')}: ${name}`}>
              {t('buyNow')}
            </Link>
          ) : (
            <button
              type="button"
              className="pc-pill pc-buy"
              onClick={buy.onClick}
              disabled={buy.disabled}
              aria-label={buy.ariaLabel}
            >
              {t('buyNow')}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** Formats a toman amount for the price pill: old price (struck) when discounted, then the price. */
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
      {price && price > now ? <span className="pc-price-old">{money.format(price)}</span> : null}
      <span>{money.format(now)}</span>
      <span className="pc-price-unit">{currency}</span>
    </>
  );
}

function ChevronIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="18.5" r="1.7" />
    </svg>
  );
}
