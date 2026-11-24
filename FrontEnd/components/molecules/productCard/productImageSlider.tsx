'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { IcChevronRight } from '@components/atoms/lucaIcons';
import MediaImage from '@components/atoms/MediaImage';
import { CardPhotoPlaceholder } from '@components/molecules/storefront/CardPhoto';

/**
 * Product photos fill the frame and the current slide stays visible while the
 * next one loads. Only the main photo is mounted before the gallery is seen.
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
  const [rotationPaused, setRotationPaused] = useState(false);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  const boxRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

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

  const autoplay = many && onScreen && pageVisible && !hovered && !focused && !reducedMotion && !rotationPaused;
  const readyToAdvance = index === shown && isReady(shown);

  // One timeout per slide change: every change (timer or hand) restarts the 2s,
  // and Strict Mode's double effect run cleans up the first timer.
  useEffect(() => {
    if (!autoplay || !readyToAdvance) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, readyToAdvance, shown, count]);

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

  const onPointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!e.isPrimary) return;
    swiped.current = false;
    touchStart.current = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY } : null;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!e.isPrimary) return;
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swiped.current = true;
    const forward = rtl ? dx > 0 : dx < 0;
    if (forward) next();
    else prev();
  };

  const number = new Intl.NumberFormat(rtl ? 'fa-IR' : 'en-US');
  const shownLabel = t('imageOf', { n: number.format(shown + 1), total: number.format(count) });

  return (
    <div
      ref={boxRef}
      role={many ? 'group' : undefined}
      aria-label={many ? t('productGallery', { name }) : undefined}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHovered(false); }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      className="product-gallery group/slider relative isolate z-10 aspect-[4/3] w-full shrink-0 overflow-hidden bg-store-muted"
    >
      {many && !reducedMotion ? (
        <button
          type="button"
          aria-label={t(rotationPaused ? 'resumeImages' : 'pauseImages')}
          onClick={() => setRotationPaused((paused) => !paused)}
          className={`${controlClass} end-0 top-0 motion-reduce:hidden`}
        >
          <span className={controlIconClass}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {rotationPaused ? <path d="m9 5 11 7-11 7Z" /> : <path d="M9 5v14m6-14v14" />}
            </svg>
          </span>
        </button>
      ) : null}

      {/* The photo itself opens the product; the title link is the one screen readers get. */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`product-gallery__link absolute flex items-center justify-center ${many ? 'product-gallery__link--with-controls touch-pan-y touch-pinch-zoom' : 'touch-manipulation'}`}
        draggable={false}
        onPointerDown={many ? onPointerDown : undefined}
        onPointerUp={many ? onPointerUp : undefined}
        onPointerCancel={many ? () => { touchStart.current = null; } : undefined}
        onClick={many ? (e) => {
          if (swiped.current) {
            e.preventDefault();
            swiped.current = false;
          }
        } : undefined}
      >
        <span className="product-gallery__photo pointer-events-none relative motion-safe:transition-transform motion-safe:duration-300 motion-safe:[@media(hover:hover)]:group-hover/slider:scale-[1.02]">
          {count === 0 ? (
            <CardPhotoPlaceholder />
          ) : (
            slides.map((src, i) => {
              if (i > reach && i !== 0) return null;
              const active = i === shown;
              return failed[src] ? (
                <span
                  key={src}
                  className={`absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
                >
                  <CardPhotoPlaceholder />
                </span>
              ) : (
                <MediaImage
                  key={src}
                  src={src}
                  alt=""
                  fill
                  sizes={sizes}
                  priority={priority && i === 0}
                  loading={priority && i === 0 ? undefined : 'lazy'}
                  draggable={false}
                  onLoad={() => setLoaded((m) => (m[src] ? m : { ...m, [src]: true }))}
                  onError={() => setFailed((m) => (m[src] ? m : { ...m, [src]: true }))}
                  className={[
                    'object-cover object-center select-none',
                    'motion-safe:transition-opacity motion-safe:duration-300',
                    active ? 'opacity-100' : 'opacity-0',
                  ].join(' ')}
                />
              );
            })
          )}
        </span>
      </Link>

      {many ? (
        <>
          <SlideButton side="start" label={t('previousImage')} onClick={prev} />
          <SlideButton side="end" label={t('nextImage')} onClick={next} />

          <div className="product-gallery__pager pointer-events-none absolute z-20 flex justify-center">
            {count <= MAX_DOTS ? (
              <div className="product-gallery__dots pointer-events-auto bg-store-surface">
                {slides.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={t('imageOf', { n: number.format(i + 1), total: number.format(count) })}
                    aria-current={i === shown ? 'true' : undefined}
                    className="group/dot grid size-6 touch-manipulation place-items-center focus-visible:outline-offset-[-2px]"
                  >
                    <span
                      className={[
                        'h-0.5',
                        i === shown ? 'w-4 bg-store-text' : 'w-2 bg-store-subtle group-hover/dot:bg-store-text',
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>
            ) : null}
            <span
              aria-hidden="true"
              className={`product-gallery__count ${count <= MAX_DOTS ? 'product-gallery__narrow-count' : ''} bg-store-surface py-0.5 text-xs font-medium leading-snug tabular-nums text-store-text`}
            >
              {number.format(shown + 1)} / {number.format(count)}
            </span>
          </div>
          <span className="sr-only" aria-live={autoplay ? 'off' : 'polite'}>{shownLabel}</span>
        </>
      ) : null}
    </div>
  );
}

const controlClass = [
  'product-gallery__control group/control absolute z-20 grid size-11 touch-manipulation place-items-center text-store-text focus-visible:outline-offset-[-2px]',
  'motion-safe:transition-opacity motion-safe:duration-200',
].join(' ');

const controlIconClass = 'grid size-7 place-items-center border border-store-border bg-store-surface group-hover/control:border-store-strong group-focus-visible/control:border-store-strong';

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
      onClick={onClick}
      className={`${controlClass} product-gallery__step ${side === 'start' ? 'start-0' : 'end-0'}`}
    >
      <span className={controlIconClass}>
        <IcChevronRight size={16} className={side === 'start' ? '-scale-x-100 rtl:scale-x-100' : 'rtl:-scale-x-100'} />
      </span>
    </button>
  );
}
