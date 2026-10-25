'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import {
  ColorKey,
  focusOutlineCss,
  Palette,
  previewVars,
} from './palette';

/** The loupe drawing the Luca prototypes use as a product-photo placeholder. */
export function LoupeGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" fill="none" stroke="currentColor" strokeWidth={1.1} className={className} aria-hidden>
      <path d="M17 13 4 9.5M63 13l13-3.5" strokeLinecap="round" />
      <circle cx="27" cy="16" r="10" />
      <circle cx="27" cy="16" r="6.2" />
      <circle cx="27" cy="16" r="2.4" />
      <circle cx="53" cy="16" r="10" />
      <circle cx="53" cy="16" r="6.2" />
      <circle cx="53" cy="16" r="2.4" />
      <path d="M37 14.5c2-2 4-2 6 0" strokeLinecap="round" />
    </svg>
  );
}

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-[15px] h-[15px]" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  search: 'm21 21-5.2-5.2M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z',
  user: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.1a7.5 7.5 0 0 1 15 0',
  bag: 'M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.36-1.99 1.26 12A1.13 1.13 0 0 1 19.75 21H4.25a1.13 1.13 0 0 1-1.12-1.24l1.26-12A1.13 1.13 0 0 1 5.51 6.75h12.98c.58 0 1.06.43 1.12 1.01Z',
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
  menu: 'M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5',
};

const STATUS: { key: ColorKey; msg: string; cssVar: string }[] = [
  { key: 'successColor', msg: 'alertSuccess', cssVar: '--t-success' },
  { key: 'errorColor', msg: 'alertError', cssVar: '--t-error' },
  { key: 'warningColor', msg: 'alertWarning', cssVar: '--t-warning' },
  { key: 'infoColor', msg: 'alertInfo', cssVar: '--t-info' },
];

function Wordmark({ className }: { className: string }) {
  return (
    <span
      dir="ltr"
      className={`font-display font-medium text-[var(--t-text)] leading-none tracking-[0.32em] ps-[0.32em] ${className}`}
    >
      LUCA
    </span>
  );
}

type PreviewProps = {
  palette: Palette;
  device?: 'desktop' | 'mobile';
  /** Colour row currently hovered in the editor; its uses get outlined. */
  focusKey?: ColorKey | null;
};

/** A miniature of the Luca product page (prototype layout) painted with `palette`. */
export default function StorefrontPreview({ palette, device = 'desktop', focusKey }: PreviewProps) {
  const t = useTranslations('admin.themeSettings.preview');
  const mobile = device === 'mobile';
  const frames = [palette.secondaryColor, palette.textMutedColor, palette.borderColor, palette.primaryColor];

  return (
    <div
      className={`lc-preview mx-auto overflow-hidden bg-[var(--t-surface)] text-[var(--t-text)] text-start leading-normal transition-[max-width] duration-300 select-none ${
        mobile ? 'max-w-[360px] border border-[var(--t-border)]' : 'max-w-full'
      }`}
      style={previewVars(palette)}
      data-focus={focusKey ?? undefined}
      aria-hidden
    >
      <style>{focusOutlineCss('.lc-preview')}</style>

      <div
        data-c="primaryColor"
        className="flex justify-center items-center gap-2 bg-[var(--t-primary)] px-3 h-7 text-[10.5px] text-white"
      >
        <span>{t('announcement')}</span>
        <span className="underline underline-offset-2">{t('announcementLink')}</span>
      </div>

      <div data-c="surfaceColor" className="items-center grid grid-cols-[1fr_auto_1fr] px-4 h-12">
        <span className="flex items-center gap-3 min-w-0 text-[10.5px] text-[var(--t-text)] whitespace-nowrap">
          {mobile ? (
            <Icon d={ICONS.menu} />
          ) : (
            <>
              <span className="flex items-center gap-1">
                <Icon d={ICONS.pin} />
                {t('dealers')}
              </span>
              <span className="hidden sm:inline">{t('contact')}</span>
            </>
          )}
        </span>
        <Wordmark className={mobile ? 'text-lg' : 'text-xl'} />
        <span className="flex justify-end items-center gap-3">
          <Icon d={ICONS.search} />
          {!mobile && <Icon d={ICONS.user} />}
          <Icon d={ICONS.bag} />
        </span>
      </div>
      {!mobile && (
        <nav
          data-c="borderColor"
          className="flex justify-center gap-5 pb-2.5 border-[var(--t-border)] border-b text-[10.5px]"
        >
          {['nav1', 'nav2', 'nav3', 'nav4', 'nav5'].map((key) => (
            <span key={key}>{t(key)}</span>
          ))}
        </nav>
      )}
      {mobile && <div data-c="borderColor" className="border-[var(--t-border)] border-b" />}

      <p data-c="textMutedColor" className="px-4 pt-3 text-[9.5px] text-[var(--t-text-muted)]">
        {t('crumbs')}
      </p>

      <section className={`grid gap-4 px-4 pt-3 pb-6 ${mobile ? 'grid-cols-1' : 'grid-cols-[1.05fr_1fr]'}`}>
        <div className="gap-1.5 grid grid-cols-2">
          {(mobile ? [0, 1] : [0, 1, 2, 3]).map((i) => (
            <div
              key={i}
              data-c="surfaceMutedColor"
              className="place-items-center grid bg-[var(--t-surface-muted)] aspect-[4/5] text-[var(--t-text-muted)]"
            >
              <LoupeGlyph className="w-1/2" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 min-w-0">
          <p data-c="highlightColor" className="font-medium text-[9.5px] text-[var(--t-highlight)]">
            {t('eyebrow')}
          </p>
          <p data-c="textColor" className="font-display font-medium text-[22px] leading-tight">
            {t('productTitle')}
          </p>
          <p className="font-medium text-[12px]">{t('price')}</p>
          <p data-c="textMutedColor" className="text-[10.5px] text-[var(--t-text-muted)] leading-5">
            {t('productText')}
          </p>

          <div>
            <p data-c="textMutedColor" className="mb-1.5 text-[9.5px] text-[var(--t-text-muted)]">
              {t('magnification')}
            </p>
            <div className="flex gap-1.5">
              {['2.5x', '3.0x', '3.5x'].map((m, i) => (
                <span
                  key={m}
                  dir="ltr"
                  data-c={i === 0 ? 'textColor' : 'borderColor'}
                  className={`grid place-items-center w-11 h-7 text-[10px] border ${
                    i === 0 ? 'border-[var(--t-text)] font-medium' : 'border-[var(--t-border)]'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p data-c="textMutedColor" className="mb-1.5 text-[9.5px] text-[var(--t-text-muted)]">
              {t('frameColor')}
            </p>
            <div className="flex items-center gap-2">
              {frames.map((c, i) => (
                <span
                  key={i}
                  data-c={i === 0 ? 'secondaryColor' : undefined}
                  className={`rounded-full w-4 h-4 ${
                    i === 0 ? 'ring-1 ring-[color:var(--t-text)] ring-offset-2 ring-offset-[color:var(--t-surface)]' : ''
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <span
            data-c="primaryColor"
            className="place-items-center grid bg-[var(--t-primary)] mt-1 h-8 font-medium text-[10.5px] text-white"
          >
            {t('addToCart')}
          </span>
          <span className="place-items-center grid border border-[var(--t-text)] h-8 font-medium text-[10.5px]">
            {t('bookFitting')}
          </span>
        </div>
      </section>

      <section data-c="primaryColor" className="bg-[var(--t-tint)] px-4 py-5">
        <p className="mb-3 font-display font-medium text-[18px] text-center">{t('specs')}</p>
        <dl className={`grid gap-x-4 ${mobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {(['spec1', 'spec2', 'spec3'] as const).map((key) => (
            <div key={key} data-c="borderColor" className="py-2 border-[var(--t-border)] border-t">
              <dt data-c="textMutedColor" className="text-[9px] text-[var(--t-text-muted)]">
                {t(`${key}Label`)}
              </dt>
              <dd className="font-medium text-[11px]">{t(`${key}Value`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={`grid gap-2 px-4 py-4 ${mobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {STATUS.map((s) => (
          <p
            key={s.key}
            data-c={s.key}
            className="flex items-center gap-2 px-2.5 py-2 border text-[10px]"
            style={{ borderColor: `var(${s.cssVar})`, color: `var(${s.cssVar})` }}
          >
            <span className="w-1.5 h-1.5 shrink-0" style={{ background: `var(${s.cssVar})` }} />
            {t(s.msg)}
          </p>
        ))}
      </div>

      <section
        data-c="neutralColor"
        className={`flex gap-3 bg-[var(--t-neutral)] px-4 py-4 ${mobile ? 'flex-col' : 'items-end justify-between'}`}
      >
        <div>
          <p className="font-display font-medium text-[15px]">{t('newsletter')}</p>
          <p data-c="textMutedColor" className="text-[9.5px] text-[var(--t-text-muted)]">
            {t('newsletterText')}
          </p>
        </div>
        <div className="flex">
          <span className="flex items-center bg-[var(--t-surface)] px-2 border border-[var(--t-text-muted)] w-32 h-7 text-[9px] text-[var(--t-text-muted)]" dir="ltr">
            you@example.com
          </span>
          <span
            data-c="secondaryColor"
            className="place-items-center grid bg-[var(--t-secondary)] px-3 h-7 text-[9.5px] text-white"
          >
            {t('subscribe')}
          </span>
        </div>
      </section>

      <footer
        data-c="surfaceMutedColor borderColor"
        className="flex justify-between items-center bg-[var(--t-surface-muted)] px-4 py-3 border-[var(--t-border)] border-t"
      >
        <Wordmark className="text-[13px]" />
        <span data-c="textMutedColor" className="text-[9px] text-[var(--t-text-muted)]">
          {t('copyright')}
        </span>
      </footer>
    </div>
  );
}

/** Card-sized thumbnail of the product page: structure and colours only. */
export function StorefrontThumb({ palette }: { palette: Palette }) {
  return (
    <div
      className="flex flex-col bg-[var(--t-surface)] h-full overflow-hidden text-[var(--t-text)] select-none"
      style={previewVars(palette)}
      aria-hidden
    >
      <div className="bg-[var(--t-primary)] h-3 shrink-0" />
      <div className="flex flex-col justify-center items-center gap-1.5 border-[var(--t-border)] border-b h-10 shrink-0">
        <Wordmark className="text-[11px]" />
        <span className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className="bg-[var(--t-text)] opacity-40 w-3 h-px" />
          ))}
        </span>
      </div>
      <div className="flex-1 gap-3 grid grid-cols-[1.1fr_1fr] p-3 min-h-0">
        <div className="gap-1 grid grid-cols-2 grid-rows-2 min-h-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="place-items-center grid bg-[var(--t-surface-muted)] min-h-0 text-[var(--t-text-muted)]">
              {i === 0 && <LoupeGlyph className="w-3/5" />}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <i className="bg-[var(--t-highlight)] w-1/3 h-[2px]" />
          <i className="bg-[var(--t-text)] w-4/5 h-1.5" />
          <i className="bg-[var(--t-text-muted)] w-1/2 h-[2px]" />
          <span className="flex gap-1 mt-1">
            <i className="bg-[var(--t-secondary)] rounded-full w-2 h-2" />
            <i className="bg-[var(--t-text-muted)] rounded-full w-2 h-2" />
            <i className="bg-[var(--t-primary)] rounded-full w-2 h-2" />
          </span>
          <i className="bg-[var(--t-primary)] mt-auto w-full h-3" />
          <i className="border border-[var(--t-text)] w-full h-3" />
        </div>
      </div>
      <div className="bg-[var(--t-tint)] px-3 py-2 shrink-0">
        <span className="gap-2 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <i key={i} className="border-[var(--t-border)] border-t h-1.5" />
          ))}
        </span>
      </div>
    </div>
  );
}
