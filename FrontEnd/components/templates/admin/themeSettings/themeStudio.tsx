'use client';

import React, {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  customFontFaceCss,
  DEFAULT_FONT_KEY,
  DEFAULT_HEADING_FONT_KEY,
  findFont,
  FONT_CATEGORIES,
  FONT_OPTIONS,
  type FontCategory,
  type FontOption,
  fontStack,
  headingFontStack,
  isFontKey,
} from '@lib/fontCatalog';
import {
  BODY_BASE_PX,
  BODY_PX_RANGE,
  bodyTextScale,
  bodyWeightShift,
  FONT_WEIGHTS,
  type FontWeight,
  HEADING_BASE_PX,
  HEADING_PX_RANGE,
  headingTextScale,
  headingWeightShift,
  TEXT_SIZE_KEYS,
  type TextSizeKey,
} from '@lib/typography';
import { saveEntity } from '@lib/saveEntity';
import {
  showErrorToast,
  showSuccessToast,
} from '@utils/core';

import {
  refreshStorefrontTheme,
  THEME_ENDPOINT,
  uploadCustomFont,
} from './api';
import { Glyph } from './icons';
import {
  COLOR_GROUPS,
  COLOR_KEYS,
  ColorKey,
  CONTRAST_CHECKS,
  contrastRatio,
  HEX,
  inkOf,
  DEFAULT_TYPOGRAPHY,
  Palette,
  PRESETS,
  Typography,
} from './palette';
import StorefrontPreview from './storefrontPreview';

type StudioProps = {
  /** Present when editing an existing theme. */
  id?: number;
  isActive?: boolean;
  initialName: string;
  initialPalette: Palette;
  /** Main font key (lib/fontCatalog.ts); defaults to the site's current font. */
  initialFont?: string | null;
  /** Heading font key; defaults to the site's current heading face. */
  initialHeadingFont?: string | null;
  /** Body / heading text sizes (lib/typography.ts). */
  initialTypography?: Typography;
  /** Fonts the admin uploaded (CustomFonts table), already validated. */
  customFonts?: FontOption[];
};

type FontTarget = 'body' | 'heading';

const samePalette = (a: Palette, b: Palette) => COLOR_KEYS.every((key) => a[key] === b[key]);

function SectionTitle({ index, title, hint }: { index: string; title: string; hint: string }) {
  return (
    <header className="mb-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-[var(--admin-text-muted)] text-lg">{index}</span>
        <h2 className="text-[26px] sm:text-[28px] luca-display">{title}</h2>
      </div>
      <p className="mt-1 text-[13px] text-[var(--admin-text-muted)] leading-6">{hint}</p>
    </header>
  );
}

function ColorRow({
  colorKey,
  value,
  original,
  onChange,
  onFocusKey,
}: {
  colorKey: ColorKey;
  value: string;
  original: string;
  onChange: (key: ColorKey, hex: string) => void;
  onFocusKey: (key: ColorKey | null) => void;
}) {
  const t = useTranslations('admin.themeSettings');
  const [text, setText] = useState(value);
  const label = t(`fields.${colorKey}.label`);
  const changed = value !== original;

  useEffect(() => setText(value), [value]);

  const commit = (raw: string) => {
    const next = raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`;
    setText(next);
    if (HEX.test(next)) onChange(colorKey, next.toLowerCase());
  };

  return (
    <li
      className="flex items-center gap-3 sm:gap-4 py-3.5 border-[var(--admin-border)] border-t"
      onMouseEnter={() => onFocusKey(colorKey)}
      onMouseLeave={() => onFocusKey(null)}
      onFocus={() => onFocusKey(colorKey)}
      onBlur={() => onFocusKey(null)}
    >
      <div className="flex-1 min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 text-[15px] text-[var(--admin-text)]">
          {label}
          {changed && (
            <span className="text-[12px] text-[var(--admin-text-muted)]" title={t('changedFrom', { hex: original })}>
              {t('edited')}
            </span>
          )}
        </p>
        <p className="text-[13px] text-[var(--admin-text-muted)] line-clamp-2 leading-6">
          {t(`fields.${colorKey}.help`)}
        </p>
      </div>

      <label
        className="relative rounded-full ring-1 ring-black/15 focus-within:ring-2 focus-within:ring-[color:var(--admin-text)] ring-offset-2 ring-offset-[color:var(--admin-surface)] w-9 h-9 cursor-pointer shrink-0"
        style={{ background: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value.toLowerCase())}
          aria-label={label}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>

      <input
        type="text"
        dir="ltr"
        value={text}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        aria-label={t('hexOf', { label })}
        aria-invalid={!HEX.test(text)}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setText(value)}
        className={`bg-[var(--admin-surface-elevated)] px-2.5 border outline-none w-[5.75rem] sm:w-[6.25rem] h-10 font-mono text-[13px] text-[var(--admin-text)] uppercase focus:border-[var(--admin-text)] ${
          HEX.test(text) ? 'border-[#8a8a85]' : 'border-[var(--error-color)]'
        }`}
      />

      {changed ? (
        <button
          type="button"
          onClick={() => onChange(colorKey, original)}
          className="!w-8 !h-8 admin-icon-btn shrink-0"
          aria-label={t('revertColor')}
          title={t('revertColor')}
        >
          <Glyph name="undo" className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="w-8 shrink-0" aria-hidden />
      )}
    </li>
  );
}

/** Upload box at the end of each font category: file + Persian/English name. */
function AddFontCard({ category, onAdded }: { category: FontCategory; onAdded: () => void }) {
  const t = useTranslations('admin.themeSettings');
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async () => {
    if (busy) return;
    if (!file) {
      showErrorToast(t('addFontNeedFile'), '', 4000);
      return;
    }
    if (!nameFa.trim() && !nameEn.trim()) {
      showErrorToast(t('addFontNeedName'), '', 4000);
      return;
    }
    setBusy(true);
    const res = await uploadCustomFont({ file, nameFa: nameFa.trim(), nameEn: nameEn.trim(), category });
    setBusy(false);
    if (res.isSuccess) {
      showSuccessToast(t('addFontDone'), '', 4000);
      setOpen(false);
      setFile(null);
      setNameFa('');
      setNameEn('');
      if (fileRef.current) fileRef.current.value = '';
      onAdded();
    } else {
      showErrorToast(res.error || t('addFontFailed'), '', 6000);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex justify-center items-center gap-2 px-3.5 py-3 border border-[var(--admin-border)] hover:border-[var(--admin-text)] border-dashed w-full h-full min-h-[84px] text-[13px] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
      >
        <span aria-hidden className="text-lg leading-none">+</span>
        {t('addFontTitle')}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 px-3.5 py-3 border border-[var(--admin-text)] w-full">
      <p className="m-0 text-[13px] text-[var(--admin-text-muted)] leading-6">{t('addFontHint')}</p>
      <label className="flex flex-col gap-1 text-[13px]">
        {t('addFontFile')}
        <input
          ref={fileRef}
          type="file"
          accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-[13px]"
        />
      </label>
      <input
        value={nameFa}
        onChange={(e) => setNameFa(e.target.value)}
        placeholder={t('addFontNameFa')}
        aria-label={t('addFontNameFa')}
        maxLength={60}
        className="luca-input"
      />
      <input
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        placeholder={t('addFontNameEn')}
        aria-label={t('addFontNameEn')}
        maxLength={60}
        dir="ltr"
        className="luca-input"
      />
      <div className="flex gap-2">
        <button type="button" className="flex-1 admin-btn admin-btn-primary" onClick={submit} disabled={busy}>
          {busy ? t('addFontUploading') : t('addFontSubmit')}
        </button>
        <button type="button" className="admin-btn" onClick={() => setOpen(false)} disabled={busy}>
          {t('addFontCancel')}
        </button>
      </div>
    </div>
  );
}

function FontPicker({
  value,
  onChange,
  target,
  customFonts,
  onFontAdded,
}: {
  value: string;
  onChange: (key: string) => void;
  target: FontTarget;
  customFonts: FontOption[];
  onFontAdded: () => void;
}) {
  const t = useTranslations('admin.themeSettings');
  const locale = useLocale();
  const heading = target === 'heading';
  const allFonts = [...FONT_OPTIONS, ...customFonts];

  return (
    <div className="flex flex-col gap-6" role="radiogroup" aria-label={t(`fontTargets.${target}`)}>
      {FONT_CATEGORIES.map((category) => (
        <div key={category}>
          <p className="mb-2 font-medium text-[13px] text-[var(--admin-text-muted)]">
            {t(`fontCategories.${category}`)}
          </p>
          <ul className="gap-2 grid grid-cols-1 sm:grid-cols-2">
            {allFonts.filter((font) => font.category === category).map((font) => {
              const selected = font.key === value;
              return (
                <li key={font.key}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(font.key)}
                    className={`flex flex-col items-start gap-1.5 px-3.5 py-3 border w-full h-full text-start transition-colors ${
                      selected
                        ? 'border-[var(--admin-text)] ring-1 ring-[color:var(--admin-text)]'
                        : 'border-[var(--admin-border)] hover:border-[var(--admin-text)]'
                    }`}
                  >
                    <span className="flex justify-between items-baseline gap-2 w-full text-[13px] text-[var(--admin-text-muted)]">
                      <span>
                        {locale === 'fa' ? font.fa : font.en}
                        {locale === 'fa' && (
                          <span dir="ltr" className="ms-1.5 text-[11px]">
                            {font.en}
                          </span>
                        )}
                      </span>
                      <span className="flex gap-1.5 shrink-0">
                        {font.family && <span className="admin-badge">{t('customFontBadge')}</span>}
                        {selected && (
                          <span className="admin-badge admin-badge-success">{t('fontCurrent')}</span>
                        )}
                      </span>
                    </span>
                    <span
                      className={`text-[var(--admin-text)] leading-relaxed ${heading ? 'text-[22px]' : 'text-[17px]'}`}
                      style={{
                        fontFamily: heading
                          ? headingFontStack(font.key, customFonts)
                          : fontStack(font.key, customFonts),
                      }}
                    >
                      {t(heading ? 'fontHeadingSample' : 'fontSample')}
                    </span>
                  </button>
                </li>
              );
            })}
            <li>
              <AddFontCard category={category} onAdded={onFontAdded} />
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Three presets or an exact pixel size, for body text or for headings. */
function TextSizePicker({
  target,
  size,
  px,
  onChange,
}: {
  target: FontTarget;
  size: TextSizeKey;
  px: number | null;
  onChange: (size: TextSizeKey, px: number | null) => void;
}) {
  const t = useTranslations('admin.themeSettings');
  const range = target === 'heading' ? HEADING_PX_RANGE : BODY_PX_RANGE;
  const base = target === 'heading' ? HEADING_BASE_PX : BODY_BASE_PX;
  const inputId = `text-size-px-${target}`;
  const invalid = size === 'custom' && (px === null || px < range.min || px > range.max);

  return (
    <div className="flex flex-col gap-2.5">
      <p className="m-0 font-medium text-[13px] text-[var(--admin-text-muted)]">{t(`fontTargets.${target}`)}</p>
      <div className="flex flex-wrap" role="radiogroup" aria-label={t(`fontTargets.${target}`)}>
        {TEXT_SIZE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={size === key}
            onClick={() => onChange(key, key === 'custom' ? (px ?? base) : null)}
            className={`flex-1 sm:flex-none px-4 h-10 border text-[13px] transition-colors -ms-px first:ms-0 ${
              size === key
                ? 'relative z-10 border-[var(--admin-text)] bg-[var(--admin-text)] text-[var(--admin-surface-elevated)]'
                : 'border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-text)]'
            }`}
          >
            {t(`textSizes.${key}`)}
          </button>
        ))}
      </div>
      {size === 'custom' && (
        <div className="flex items-center gap-2">
          <label htmlFor={inputId} className="text-[13px]">
            {t(target === 'heading' ? 'textSizePxHeading' : 'textSizePxBody')}
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={range.min}
            max={range.max}
            value={px ?? ''}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              onChange('custom', Number.isFinite(n) ? n : null);
            }}
            aria-invalid={invalid}
            dir="ltr"
            className={`w-24 luca-input ${invalid ? '!border-[var(--error-color)]' : ''}`}
          />
          <span className="text-[13px] text-[var(--admin-text-muted)]">px</span>
        </div>
      )}
      {size === 'custom' && (
        <p className={`m-0 text-[13px] ${invalid ? 'text-[var(--error-color)]' : 'text-[var(--admin-text-muted)]'}`}>
          {t('textSizePxRange', { min: range.min, max: range.max, base })}
        </p>
      )}
    </div>
  );
}

/** Font weight (100..900) for body text or for headings; every other weight moves with it. */
function FontWeightPicker({
  target,
  value,
  onChange,
}: {
  target: FontTarget;
  value: FontWeight;
  onChange: (weight: FontWeight) => void;
}) {
  const t = useTranslations('admin.themeSettings');
  const label = `${t(`fontTargets.${target}`)} — ${t('fontWeightTitle')}`;
  return (
    <div className="flex flex-col gap-2.5">
      <p className="m-0 font-medium text-[13px] text-[var(--admin-text-muted)]">{label}</p>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {FONT_WEIGHTS.map((weight) => (
          <button
            key={weight}
            type="button"
            role="radio"
            aria-checked={value === weight}
            onClick={() => onChange(weight)}
            className={`flex flex-col items-center justify-center px-3 min-w-[4.5rem] h-14 border text-[13px] transition-colors ${
              value === weight
                ? 'border-[var(--admin-text)] bg-[var(--admin-text)] text-[var(--admin-surface-elevated)]'
                : 'border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-text)]'
            }`}
          >
            {/* The sample keeps its real weight: [font-weight:var(--w)] is not rewritten by the theme. */}
            <span className="text-[17px] leading-none [font-weight:var(--w)]" style={{ ['--w' as string]: weight }}>
              {t('fontWeightSample')}
            </span>
            <span className="mt-1 text-[11px] opacity-75">{t(`fontWeights.${weight}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ThemeStudio({
  id,
  isActive = false,
  initialName,
  initialPalette,
  initialFont,
  initialHeadingFont,
  initialTypography = DEFAULT_TYPOGRAPHY,
  customFonts = [],
}: StudioProps) {
  const t = useTranslations('admin.themeSettings');
  const locale = useLocale();
  const router = useRouter();
  const base = `/${locale}/admin/themeSettings`;

  const [name, setName] = useState(initialName);
  const [palette, setPalette] = useState<Palette>(initialPalette);
  // Uploaded fonts keep their key even if the list could not be loaded, so saving
  // never silently swaps a custom font for the default one.
  const startFont = initialFont && isFontKey(initialFont) ? initialFont : DEFAULT_FONT_KEY;
  const [font, setFont] = useState<string>(startFont);
  const startHeadingFont =
    initialHeadingFont && isFontKey(initialHeadingFont) ? initialHeadingFont : DEFAULT_HEADING_FONT_KEY;
  const [headingFont, setHeadingFont] = useState<string>(startHeadingFont);
  const [typography, setTypography] = useState<Typography>(initialTypography);
  const [fontTarget, setFontTarget] = useState<FontTarget>('body');
  const [focusKey, setFocusKey] = useState<ColorKey | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileTab, setMobileTab] = useState<'colors' | 'preview'>('colors');
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const leavingRef = useRef(false);

  const sameTypography =
    typography.bodyTextSize === initialTypography.bodyTextSize &&
    typography.bodyTextSizePx === initialTypography.bodyTextSizePx &&
    typography.headingTextSize === initialTypography.headingTextSize &&
    typography.headingTextSizePx === initialTypography.headingTextSizePx &&
    typography.bodyFontWeight === initialTypography.bodyFontWeight &&
    typography.headingFontWeight === initialTypography.headingFontWeight;
  const dirty =
    name !== initialName ||
    !samePalette(palette, initialPalette) ||
    font !== startFont ||
    headingFont !== startHeadingFont ||
    !sameTypography;
  const fontFaces = useMemo(() => customFontFaceCss(customFonts), [customFonts]);
  const fontName = (key: string) => findFont(key, customFonts)?.[locale === 'fa' ? 'fa' : 'en'];
  const number = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }), [locale]);
  const index = useMemo(() => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }), [locale]);

  const checks = CONTRAST_CHECKS.map((check) => {
    const fg = inkOf(palette, check.fg);
    const bg = palette[check.bg];
    const ratio = contrastRatio(fg, bg);
    return { ...check, fgHex: fg, bgHex: bg, ratio, ok: ratio >= check.min };
  });
  const passed = checks.filter((c) => c.ok).length;

  // Unsaved colours are easy to lose with a stray click on the sidebar.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (leavingRef.current) return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  // Ctrl/⌘ + S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const setColor = (key: ColorKey, hex: string) => setPalette((prev) => ({ ...prev, [key]: hex }));

  const reset = () => {
    setName(initialName);
    setPalette(initialPalette);
    setFont(startFont);
    setHeadingFont(startHeadingFont);
    setTypography(initialTypography);
    setNameError(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!name.trim()) {
      setNameError(true);
      setMobileTab('colors');
      nameRef.current?.focus();
      return;
    }
    setSaving(true);
    const res = await saveEntity({
      endPoint: THEME_ENDPOINT,
      method: id ? 'PUT' : 'POST',
      body: {
        ...(id ? { id } : {}),
        name: name.trim(),
        ...palette,
        fontFamily: font,
        headingFontFamily: headingFont,
        bodyTextSize: typography.bodyTextSize,
        bodyTextSizePx: typography.bodyTextSize === 'custom' ? typography.bodyTextSizePx : null,
        headingTextSize: typography.headingTextSize,
        headingTextSizePx: typography.headingTextSize === 'custom' ? typography.headingTextSizePx : null,
        bodyFontWeight: typography.bodyFontWeight,
        headingFontWeight: typography.headingFontWeight,
      },
    });
    if (res?.isSuccess) {
      showSuccessToast(t(isActive ? 'savedLive' : 'saved'), '', 4000);
      if (isActive) await refreshStorefrontTheme();
      leavingRef.current = true;
      router.push(base);
      router.refresh();
    } else {
      showErrorToast(res?.error || t('saveFailed'), '', 5000);
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={save} className="admin-page" noValidate>
      {/* Uploaded fonts for the previews below (validated paths under /uploads/fonts only). */}
      {fontFaces ? <style dangerouslySetInnerHTML={{ __html: fontFaces }} /> : null}
      <header className="admin-page-header">
        <div className="min-w-0">
          <nav aria-label={t('title')} className="flex items-center gap-2 text-[13px] text-[var(--admin-text-muted)]">
            <Link href={base} className="hover:text-[var(--admin-text)] underline underline-offset-4">
              {t('title')}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-[var(--admin-text)]">{id ? t('editTitle') : t('createTitle')}</span>
          </nav>
          <h1 className="mt-2 truncate admin-page-title">{id && initialName ? initialName : t('createTitle')}</h1>
          <p className="admin-page-subtitle">{t('studioSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isActive && <span className="admin-badge admin-badge-success">{t('liveShort')}</span>}
          <Link href={base} className="flex-1 sm:flex-none admin-btn">
            {t('back')}
          </Link>
        </div>
      </header>

      <div className="lg:hidden grid grid-cols-2 border border-[var(--admin-text)]" role="tablist">
        {(['colors', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            className={`h-11 font-medium text-sm transition-colors ${
              mobileTab === tab
                ? 'bg-[var(--admin-text)] text-[var(--admin-surface-elevated)]'
                : 'text-[var(--admin-text)]'
            }`}
          >
            {t(tab === 'colors' ? 'tabColors' : 'tabPreview')}
          </button>
        ))}
      </div>

      <div className="items-start gap-8 xl:gap-12 grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} lg:flex flex-col lg:sticky lg:top-6 min-w-0`}>
          <div className="flex justify-between items-center gap-3 pb-3">
            <p className="text-[13px] text-[var(--admin-text-muted)]">{t('livePreview')}</p>
            <div className="flex">
              {(['desktop', 'mobile'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={device === d}
                  onClick={() => setDevice(d)}
                  className={`px-3 h-9 border text-[13px] transition-colors -ms-px first:ms-0 ${
                    device === d
                      ? 'relative z-10 border-[var(--admin-text)] bg-[var(--admin-text)] text-[var(--admin-surface-elevated)]'
                      : 'border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-text)]'
                  }`}
                >
                  {t(d === 'desktop' ? 'deviceDesktop' : 'deviceMobile')}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[var(--admin-border)]">
            <div
              dir="ltr"
              className="flex justify-between items-center bg-[var(--admin-surface-muted)] px-3 border-[var(--admin-border)] border-b h-8 font-mono text-[11px] text-[var(--admin-text-muted)]"
              aria-hidden
            >
              <span>lucaloupe.ir</span>
              <span>{device === 'desktop' ? '1440' : '390'}</span>
            </div>
            <div
              className="bg-[var(--admin-surface-muted)] lg:max-h-[calc(100dvh-18rem)] overflow-y-auto"
              style={{
                ['--font-body' as string]: fontStack(font, customFonts),
                ['--font-display' as string]: headingFontStack(headingFont, customFonts),
                ['--text-scale' as string]: String(bodyTextScale(typography.bodyTextSize, typography.bodyTextSizePx)),
                ['--heading-scale' as string]: String(
                  headingTextScale(typography.headingTextSize, typography.headingTextSizePx),
                ),
                ['--weight-shift' as string]: String(bodyWeightShift(typography.bodyFontWeight)),
                ['--heading-weight-shift' as string]: String(headingWeightShift(typography.headingFontWeight)),
                fontFamily: 'var(--font-body)',
              }}
            >
              <StorefrontPreview palette={palette} device={device} focusKey={focusKey} />
            </div>
          </div>
          <p className="mt-2 text-[13px] text-[var(--admin-text-muted)] leading-6">{t('previewHint')}</p>
        </div>

        <div className={`${mobileTab === 'colors' ? 'flex' : 'hidden'} lg:flex flex-col gap-10 min-w-0`}>
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="theme-name" className="luca-label">
                {t('nameLabel')}
              </label>
              <input
                id="theme-name"
                ref={nameRef}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError(false);
                }}
                placeholder={t('namePlaceholder')}
                aria-invalid={nameError}
                maxLength={100}
                className={`luca-input ${nameError ? '!border-[var(--error-color)]' : ''}`}
              />
              <p
                className={`mt-1.5 text-[13px] ${
                  nameError ? 'text-[var(--error-color)]' : 'text-[var(--admin-text-muted)]'
                }`}
              >
                {nameError ? t('nameRequired') : t('nameHelp')}
              </p>
            </div>

            <div>
              <p className="luca-label">{t('presetsTitle')}</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="luca-chip"
                    aria-pressed={samePalette(preset.palette, palette)}
                    onClick={() => setPalette(preset.palette)}
                  >
                    <span className="flex -space-x-1 rtl:space-x-reverse" aria-hidden>
                      {(['primaryColor', 'surfaceColor', 'textColor'] as const).map((key) => (
                        <span
                          key={key}
                          className="rounded-full ring-1 ring-black/15 w-3.5 h-3.5"
                          style={{ background: preset.palette[key] }}
                        />
                      ))}
                    </span>
                    {t(`presets.${preset.id}`)}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[13px] text-[var(--admin-text-muted)]">{t('presetsHint')}</p>
            </div>
          </div>

          {COLOR_GROUPS.map((group, i) => (
            <section key={group.id}>
              <SectionTitle
                index={index.format(i + 1)}
                title={t(`groups.${group.id}.title`)}
                hint={t(`groups.${group.id}.hint`)}
              />
              <ul className="border-[var(--admin-border)] border-b">
                {group.keys.map((key) => (
                  <ColorRow
                    key={key}
                    colorKey={key}
                    value={palette[key]}
                    original={initialPalette[key]}
                    onChange={setColor}
                    onFocusKey={setFocusKey}
                  />
                ))}
              </ul>
            </section>
          ))}

          <section>
            <SectionTitle
              index={index.format(COLOR_GROUPS.length + 1)}
              title={t('fontTitle')}
              hint={t('fontHint')}
            />
            <div className="flex mb-5" role="tablist" aria-label={t('fontTitle')}>
              {(['body', 'heading'] as const).map((target) => (
                <button
                  key={target}
                  type="button"
                  role="tab"
                  aria-selected={fontTarget === target}
                  onClick={() => setFontTarget(target)}
                  className={`flex-1 sm:flex-none px-4 h-10 border text-[13px] transition-colors -ms-px first:ms-0 ${
                    fontTarget === target
                      ? 'relative z-10 border-[var(--admin-text)] bg-[var(--admin-text)] text-[var(--admin-surface-elevated)]'
                      : 'border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-text)]'
                  }`}
                >
                  {t(`fontTargets.${target}`)}
                  <span className="ms-1.5 opacity-75">
                    ({fontName(target === 'body' ? font : headingFont)})
                  </span>
                </button>
              ))}
            </div>
            {fontTarget === 'body' ? (
              <FontPicker
                target="body"
                value={font}
                onChange={setFont}
                customFonts={customFonts}
                onFontAdded={() => router.refresh()}
              />
            ) : (
              <FontPicker
                target="heading"
                value={headingFont}
                onChange={setHeadingFont}
                customFonts={customFonts}
                onFontAdded={() => router.refresh()}
              />
            )}
          </section>

          <section>
            <SectionTitle
              index={index.format(COLOR_GROUPS.length + 2)}
              title={t('textSizeTitle')}
              hint={t('textSizeHint')}
            />
            <div className="flex flex-col gap-6">
              <TextSizePicker
                target="body"
                size={typography.bodyTextSize}
                px={typography.bodyTextSizePx}
                onChange={(size, px) => setTypography((prev) => ({ ...prev, bodyTextSize: size, bodyTextSizePx: px }))}
              />
              <TextSizePicker
                target="heading"
                size={typography.headingTextSize}
                px={typography.headingTextSizePx}
                onChange={(size, px) =>
                  setTypography((prev) => ({ ...prev, headingTextSize: size, headingTextSizePx: px }))
                }
              />
              <FontWeightPicker
                target="body"
                value={typography.bodyFontWeight}
                onChange={(w) => setTypography((prev) => ({ ...prev, bodyFontWeight: w }))}
              />
              <FontWeightPicker
                target="heading"
                value={typography.headingFontWeight}
                onChange={(w) => setTypography((prev) => ({ ...prev, headingFontWeight: w }))}
              />
            </div>
          </section>

          <section>
            <SectionTitle
              index={index.format(COLOR_GROUPS.length + 3)}
              title={t('contrastTitle')}
              hint={t('contrastHint')}
            />
            <p className="mb-2 font-medium text-sm">
              {t('contrastScore', { passed, total: checks.length })}
            </p>
            <ul className="border-[var(--admin-border)] border-b">
              {checks.map((check) => (
                <li
                  key={check.id}
                  onMouseEnter={() => setFocusKey(check.bg)}
                  onMouseLeave={() => setFocusKey(null)}
                  className="flex items-center gap-3 py-3 border-[var(--admin-border)] border-t"
                >
                  <span
                    className="place-items-center grid border border-black/10 w-9 h-9 font-display text-base shrink-0"
                    style={{ background: check.bgHex, color: check.fgHex }}
                    aria-hidden
                  >
                    {t('sample')}
                  </span>
                  <span className="flex-1 min-w-0 text-sm truncate">{t(`checks.${check.id}`)}</span>
                  <span className="text-[13px] text-[var(--admin-text-muted)] whitespace-nowrap">
                    {t('ratio', { value: number.format(check.ratio), min: number.format(check.min) })}
                  </span>
                  <span
                    className={`admin-badge shrink-0 ${
                      check.ok ? 'admin-badge-success' : '!border-[var(--error-color)] text-[var(--error-color)]'
                    }`}
                  >
                    {check.ok ? t('pass') : t('fail')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="bottom-0 z-20 sticky flex flex-wrap justify-between items-center gap-3 bg-[var(--admin-surface)] -mx-5 md:-mx-8 xl:-mx-12 -mb-5 md:-mb-8 xl:-mb-10 px-5 md:px-8 xl:px-12 py-3.5 border-[var(--admin-border)] border-t">
        <p className="flex items-center gap-2 text-[13px] text-[var(--admin-text-muted)]">
          <span
            className={`w-2 h-2 rounded-full ${dirty ? 'bg-[var(--warning-color)]' : 'bg-[var(--admin-border)]'}`}
            aria-hidden
          />
          {dirty ? t('unsavedLong') : t('noChanges')}
        </p>
        <div className="flex flex-1 sm:flex-none gap-2">
          <button
            type="button"
            className="flex-1 sm:flex-none admin-btn"
            onClick={reset}
            disabled={!dirty || saving}
          >
            {t('reset')}
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none disabled:opacity-60 sm:min-w-36 admin-btn admin-btn-primary"
            disabled={saving}
            title={t('saveShortcut')}
          >
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>
    </form>
  );
}
