'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';

/**
 * Product photo box for the light product card: a #F8F8F8 rounded panel with
 * the photo centred and shown whole (object-contain, never cropped).
 *
 * With two or more photos it cross-fades through them every 2s, main image
 * first, looping forever. Autoplay pauses while the card is off screen, the tab
 * is hidden, the pointer or focus is on the card, or the visitor prefers
 * reduced motion. Indicators, prev/next buttons (hover on desktop, always on
 * touch) and swipe change the photo by hand, which restarts the 2s timer.
 *
 * Only the main photo is in the server HTML. The others mount once the card
 * has been on screen, one step ahead of the one showing, and a slide is only
 * revealed after its file has loaded, so changing slides never flashes empty.
 */

export const SLIDE_INTERVAL_MS = 2000;
/** Above this many photos the dots would crowd the card; show "2 / 7" instead. */
const MAX_DOTS = 6;
const SWIPE_MIN_PX = 40;

type Props = {
  href: string;
  name: string;
  /** Product photos, main image first. Empty, duplicate and blank entries are dropped. */
  images: (string | null | undefined)[];
  sizes?: string;
  /** Load the main photo eagerly (only for cards known to be above the fold). */
  priority?: boolean;
};

/** Main image first, then the gallery; blanks and repeats removed. */
export function buildSlides(images: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of images) {
    const src = typeof raw === 'string' ? raw.trim() : '';
    if (!src || src === 'null' || src === 'undefined' || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  return out;
}

/* ---------- one IntersectionObserver shared by every card on the page ---------- */
type VisibilityCallback = (visible: boolean) => void;
let sharedObserver: IntersectionObserver | null = null;
const observed = new Map<Element, VisibilityCallback>();

function observeVisibility(el: Element, cb: VisibilityCallback): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    cb(true);
    return () => {};
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) observed.get(entry.target)?.(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
  }
  observed.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    observed.delete(el);
    sharedObserver?.unobserve(el);
  };
}

function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function ProductImageSlider({
  href,
  name,
  images,
  sizes = '(max-width: 767px) 50vw, 400px',
  priority = false,
}: Props) {
  const t = useTranslations('common');
  const locale = useLocale();
  const rtl = locale === 'fa';

  // Callers build a new array each render; key on the contents so nothing resets needlessly.
  const slidesKey = buildSlides(images).join('\n');
  const slides = useMemo(() => (slidesKey ? slidesKey.split('\n') : []), [slidesKey]);
  const count = slides.length;
  const many = count > 1;

  /** Slide the visitor or the timer asked for. */
  const [index, setIndex] = useState(0);
  /** Slide on screen: trails `index` until that photo has loaded. */
  const [shown, setShown] = useState(0);
  /** Highest slide index mounted so far (photos past it are not downloaded yet). */
  const [reach, setReach] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, true>>({});
  const [failed, setFailed] = useState<Record<string, true>>({});

  const [onScreen, setOnScreen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  const boxRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // A different product (or photo list): start again from its main image.
  useEffect(() => {
    setIndex(0);
    setShown(0);
    setReach(0);
  }, [slidesKey]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !many) return;
    return observeVisibility(el, setOnScreen);
  }, [many]);

  // Once the card has been seen, keep the next photo mounted so it is ready.
  useEffect(() => {
    if (!many || !onScreen) return;
    setReach((r) => Math.max(r, Math.min(index + 1, count - 1)));
  }, [many, onScreen, index, count]);

  const isReady = useCallback(
    (i: number) => Boolean(loaded[slides[i]] || failed[slides[i]]),
    [loaded, failed, slides],
  );

  // Reveal the requested slide as soon as its photo is ready; until then the
  // previous photo stays on screen, so the panel never goes blank.
  useEffect(() => {
    if (index !== shown && isReady(index)) setShown(index);
  }, [index, shown, isReady]);

  const autoplay = many && onScreen && pageVisible && !hovered && !focused && !reducedMotion;

  // One timeout per slide change: every change (timer or hand) restarts the 2s,
  // and Strict Mode's double effect run cleans up the first timer.
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, index, count]);

  const go = useCallback(
    (i: number) => {
      const target = ((i % count) + count) % count;
      setReach((r) => Math.max(r, target));
      setIndex(target);
    },
    [count],
  );
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    const p = e.touches[0];
    touchStart.current = { x: p.clientX, y: p.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !many) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    // Content flows right-to-left in Persian, so a rightward swipe moves forward.
    const forward = rtl ? dx > 0 : dx < 0;
    if (forward) next();
    else prev();
  };

  const money = new Intl.NumberFormat(rtl ? 'fa-IR' : 'en-US');

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onTouchStart={many ? onTouchStart : undefined}
      onTouchEnd={many ? onTouchEnd : undefined}
      className={[
        'group/slider relative isolate z-10 aspect-[1/1.05] w-full shrink-0 overflow-hidden rounded-[28px] bg-[#F8F8F8]',
        'shadow-[0_2px_4px_rgba(17,17,17,0.015),0_16px_36px_-20px_rgba(17,17,17,0.08)]',
        'transition-[transform,box-shadow] duration-300 ease-out',
        'group-hover:-translate-y-1 group-hover:shadow-[0_18px_38px_-22px_rgba(20,20,20,0.16)]',
        'group-focus-within:-translate-y-1',
        'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-within:translate-y-0',
      ].join(' ')}
    >
      {/* The photo itself opens the product; the title link is the one screen readers get. */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 flex justify-center items-center"
        draggable={false}
      >
        <span className="relative w-[78%] h-[78%] group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-500 ease-out">
          {count === 0 ? (
            <PhotoPlaceholder />
          ) : (
            slides.map((src, i) => {
              if (i > reach && i !== 0) return null;
              const active = i === shown;
              return failed[src] ? (
                <span
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-[450ms] ${active ? 'opacity-100' : 'opacity-0'}`}
                >
                  <PhotoPlaceholder />
                </span>
              ) : (
                <MediaImage
                  key={src}
                  src={src}
                  alt={i === 0 ? name : `${name} - ${i + 1}`}
                  fill
                  sizes={sizes}
                  priority={priority && i === 0}
                  loading={priority && i === 0 ? undefined : 'lazy'}
                  draggable={false}
                  onLoad={() => setLoaded((m) => (m[src] ? m : { ...m, [src]: true }))}
                  onError={() => setFailed((m) => (m[src] ? m : { ...m, [src]: true }))}
                  className={[
                    'object-contain object-center select-none',
                    'transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    active ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.015]',
                  ].join(' ')}
                />
              );
            })
          )}
        </span>
      </Link>

      {many && (
        <>
          {/* Prev / next: shown on hover or focus with a mouse; always on touch screens. */}
          <SlideButton side="start" label={t('previousImage')} onClick={prev} />
          <SlideButton side="end" label={t('nextImage')} onClick={next} />

          <div className="bottom-3 md:bottom-3.5 z-20 absolute inset-x-0 flex justify-center pointer-events-none">
            {count <= MAX_DOTS ? (
              <div className="flex items-center gap-1 pointer-events-auto">
                {slides.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={t('imageOf', { n: money.format(i + 1), total: money.format(count) })}
                    aria-current={i === index ? 'true' : undefined}
                    className="group/dot flex justify-center items-center px-[3px] h-6"
                  >
                    <span
                      className={[
                        'block h-[4px] rounded-full transition-all duration-300 ease-out motion-reduce:transition-none',
                        i === index ? 'w-[18px] bg-[#242424]' : 'w-[5px] bg-[#D4D4D4] group-hover/dot:bg-[#a9a9a9]',
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <span
                className="bg-white/85 shadow-[0_3px_10px_rgba(0,0,0,0.06)] backdrop-blur-sm px-2.5 py-1 rounded-full font-medium tabular-nums text-[#1B1B1D] text-[11px] leading-4"
                aria-live="polite"
              >
                {money.format(index + 1)} / {money.format(count)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SlideButton({
  side,
  label,
  onClick,
}: {
  side: 'start' | 'end';
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={[
        'absolute top-1/2 z-20 -translate-y-1/2 flex size-8 items-center justify-center rounded-full',
        side === 'start' ? 'start-2.5' : 'end-2.5',
        'bg-white/85 text-[#1B1B1D] shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm',
        'transition-[opacity,background-color] duration-300 ease-out hover:bg-white',
        // Hidden until hover/focus where a mouse exists; touch screens always see them.
        '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/slider:opacity-100 focus-visible:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1B1D]/40',
      ].join(' ')}
    >
      {/* Chevron points "back" at the start side and "forward" at the end side in either direction. */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={side === 'start' ? 'rtl:-scale-x-100' : '-scale-x-100 rtl:scale-x-100'}
      >
        <path d="M14 6l-6 6 6 6" />
      </svg>
    </button>
  );
}

/** Neutral stand-in when a product has no photo or its file fails to load. */
function PhotoPlaceholder() {
  return (
    <span className="absolute inset-0 flex justify-center items-center text-[#C9C9CC]">
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="M20.5 16l-5-5-8 8" />
      </svg>
    </span>
  );
}
