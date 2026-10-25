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

import { saveEntity } from '@lib/saveEntity';
import {
  showErrorToast,
  showSuccessToast,
} from '@utils/core';

import {
  refreshStorefrontTheme,
  THEME_ENDPOINT,
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
  Palette,
  PRESETS,
} from './palette';
import StorefrontPreview from './storefrontPreview';

type StudioProps = {
  /** Present when editing an existing theme. */
  id?: number;
  isActive?: boolean;
  initialName: string;
  initialPalette: Palette;
};

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

export default function ThemeStudio({ id, isActive = false, initialName, initialPalette }: StudioProps) {
  const t = useTranslations('admin.themeSettings');
  const locale = useLocale();
  const router = useRouter();
  const base = `/${locale}/admin/themeSettings`;

  const [name, setName] = useState(initialName);
  const [palette, setPalette] = useState<Palette>(initialPalette);
  const [focusKey, setFocusKey] = useState<ColorKey | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileTab, setMobileTab] = useState<'colors' | 'preview'>('colors');
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const leavingRef = useRef(false);

  const dirty = name !== initialName || !samePalette(palette, initialPalette);
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
      body: { ...(id ? { id } : {}), name: name.trim(), ...palette },
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
            <div className="bg-[var(--admin-surface-muted)] lg:max-h-[calc(100dvh-18rem)] overflow-y-auto">
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
