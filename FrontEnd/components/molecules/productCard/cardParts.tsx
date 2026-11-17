'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

/**
 * Charcoal product card: the product photo sits in its own area at the top,
 * shown whole at its natural proportions (object-contain, never cropped), and
 * cross-fades through the product's photos every 2s starting with the main
 * image, with one indicator dot per photo. Below it: title + price pill,
 * description, category badge, option chips and a white pill "buy" button.
 *
 * Every storefront product card renders through this shell; the callers supply
 * the real data and decide what "buy" does. The card fills its container's
 * width (rail slot or grid cell).
 */

type BuyAction =
  /** Goes to a page, e.g. the product page where the option and offer are chosen. */
  | { href: string }
  /** Runs the card's own purchase flow (add to cart, then on to the cart). */
  | { onClick: () => void; disabled?: boolean; ariaLabel?: string };

export type ProductShowcaseCardProps = {
  href: string;
  name: string;
  /** Small badge under the description (category, else brand). */
  category?: string | null;
  description?: string | null;
  /** Product photos, main image first. Rotation and dots appear only with two or more. */
  images: (string | null | undefined)[];
  /** Price pill content. Without one the pill links to the product to see the price. */
  price?: React.ReactNode;
  buy: BuyAction;
  /** Option chips (e.g. magnification) shown above the button. */
  options?: React.ReactNode;
  imageSizes?: string;
};

const SLIDE_INTERVAL_MS = 2000;

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
  const many = photos.length > 1;

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);

  // Only rotate while the card is on screen.
  useEffect(() => {
    const el = photoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!many || !visible) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % photos.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [many, visible, photos.length]);

  const pill =
    'rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium leading-4 whitespace-nowrap';

  return (
    <article
      className={[
        'group relative isolate flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[26px] bg-[#232326] text-white',
        'shadow-[0_22px_45px_-14px_rgba(15,15,20,0.45),0_8px_16px_-8px_rgba(15,15,20,0.18)]',
        'transition-[transform,box-shadow] duration-300 ease-out',
        'hover:-translate-y-[5px] hover:shadow-[0_32px_60px_-14px_rgba(15,15,20,0.55),0_10px_20px_-8px_rgba(15,15,20,0.22)]',
        'focus-within:-translate-y-[5px]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0',
      ].join(' ')}
    >
      {/* Photo area: whole photos (object-contain), cross-fading, main image first */}
      <div ref={photoRef} className="relative w-full aspect-[6/5] shrink-0">
        {photos.map((src, i) => (
          <MediaImage
            key={src}
            src={src}
            alt={i === 0 ? name : `${name} - ${i + 1}`}
            aria-hidden={i !== index}
            fill
            sizes={imageSizes}
            loading="lazy"
            className={[
              'object-contain transition-opacity duration-700 ease-in-out motion-reduce:transition-none',
              i === index ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Content stack below the photo */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        {/* Slide indicator: one dot per photo */}
        {many && (
          <div aria-hidden className="flex justify-center items-center gap-1 mb-2.5">
            {photos.map((src, i) => (
              <span
                key={src}
                className={[
                  'h-[5px] w-[5px] rounded-full transition-colors duration-500',
                  i === index ? 'bg-white' : 'bg-white/45',
                ].join(' ')}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center gap-2">
          <h3 className="min-w-0 font-semibold text-base leading-7 truncate">
            {/* Stretched link: the whole card opens the product */}
            <Link
              href={href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline"
            >
              {name}
            </Link>
          </h3>
          {price ? (
            <span className={`${pill} relative z-10 flex items-baseline gap-1 shrink-0`} aria-live="polite">
              {price}
            </span>
          ) : (
            <Link href={href} className={`${pill} relative z-10 shrink-0 hover:bg-white/20`}>
              {t('seePrice')}
            </Link>
          )}
        </div>

        {description && (
          <p className="mt-1 min-h-[3.2em] font-light text-[12px] text-white/80 line-clamp-2 leading-[1.6]">
            {description.trim()}
          </p>
        )}

        <ul className="flex gap-1.5 mt-2.5 min-h-[24px] overflow-hidden">
          <li className={`${pill} truncate`}>{category || t('productsLabel')}</li>
        </ul>

        {options && <div className="z-10 relative pc-options">{options}</div>}

        {/* Always keep a gap above the button; mt-auto still pins it to the bottom in equal-height rows */}
        <div className="mt-auto pt-4">
          {'href' in buy ? (
            <Link
              href={buy.href}
              aria-label={`${t('buyNow')}: ${name}`}
              className={buyClass}
            >
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
  'relative z-10 flex h-11 w-full items-center justify-center rounded-full bg-white',
  'text-sm font-semibold text-[#111114]',
  'transition-colors duration-300 hover:bg-[#ececef] disabled:cursor-not-allowed disabled:opacity-60',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#232326]',
].join(' ');

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
      {price && price > now ? (
        <span className="opacity-60 line-through">{money.format(price)}</span>
      ) : null}
      <span>{money.format(now)}</span>
      <span className="opacity-80">{currency}</span>
    </>
  );
}
