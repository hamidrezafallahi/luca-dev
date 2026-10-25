'use client';

import React, { useState } from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  showErrorToast,
  showSuccessToast,
} from '@utils/core';

import {
  activateTheme,
  deleteTheme,
  refreshStorefrontTheme,
} from './api';
import { Glyph } from './icons';
import {
  ColorKey,
  ThemeRecord,
} from './palette';
import StorefrontPreview, { StorefrontThumb } from './storefrontPreview';

/** The colours a shopper notices first, listed like a product's specifications. */
const SPEC_KEYS: ColorKey[] = [
  'primaryColor',
  'secondaryColor',
  'textColor',
  'surfaceColor',
  'surfaceMutedColor',
  'borderColor',
];

/** Round swatches, like the frame-colour picker on the product page. */
function FrameDots({ colors }: { colors: string[] }) {
  return (
    <span className="flex items-center gap-1.5 shrink-0" aria-hidden>
      {colors.map((c, i) => (
        <span key={i} className="rounded-full ring-1 ring-black/10 w-[18px] h-[18px]" style={{ background: c }} />
      ))}
    </span>
  );
}

export default function ThemeGallery({ themes }: { themes: ThemeRecord[] | null }) {
  const t = useTranslations('admin.themeSettings');
  const tf = useTranslations('admin.themeSettings.fields');
  const locale = useLocale();
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const base = `/${locale}/admin/themeSettings`;

  if (themes === null) {
    return (
      <div className="admin-page">
        <div className="admin-panel admin-empty">
          <p className="admin-empty-title">{t('loadError')}</p>
          <button type="button" className="mt-2 admin-btn" onClick={() => router.refresh()}>
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  const active = themes.find((theme) => theme.isActive) ?? null;

  const run = async (theme: ThemeRecord, action: 'activate' | 'delete') => {
    if (busyId !== null) return;
    setBusyId(theme.id);
    const res = action === 'activate' ? await activateTheme(theme.id) : await deleteTheme(theme.id);
    if (res.isSuccess) {
      showSuccessToast(t(action === 'activate' ? 'activated' : 'deleted', { name: theme.name }), '', 4000);
      if (action === 'activate') await refreshStorefrontTheme();
      setConfirmId(null);
      router.refresh();
    } else {
      showErrorToast(res.error || t('actionFailed'), '', 5000);
    }
    setBusyId(null);
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="min-w-0">
          <h1 className="admin-page-title">{t('title')}</h1>
          <p className="max-w-xl admin-page-subtitle">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/${locale}`} target="_blank" className="flex-1 sm:flex-none admin-btn">
            {t('viewStore')}
          </Link>
          <Link href={`${base}/new`} className="flex-1 sm:flex-none admin-btn admin-btn-primary">
            <Glyph name="plus" />
            {t('newTheme')}
          </Link>
        </div>
      </header>

      {active ? (
        <section className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] border border-[var(--admin-border)]">
          <div className="bg-[var(--admin-surface-muted)] p-4 sm:p-6 md:p-8 border-[var(--admin-border)] border-b lg:border-b-0 lg:border-e">
            <div className="relative border border-[var(--admin-border)] max-h-[320px] sm:max-h-[420px] overflow-hidden">
              <StorefrontPreview palette={active} />
              <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-[var(--admin-surface-muted)] to-transparent h-20" />
            </div>
          </div>

          <div className="flex flex-col gap-5 bg-[var(--admin-surface-elevated)] p-5 sm:p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="admin-badge admin-badge-success">{t('liveShort')}</span>
              <span className="text-[13px] text-[var(--admin-text-muted)]">{t('activeEyebrow')}</span>
            </div>
            <div>
              <h2 className="luca-h3">{active.name}</h2>
              <p className="mt-2 max-w-md text-[var(--admin-text-muted)] text-sm leading-7">{t('liveHint')}</p>
            </div>

            <dl className="gap-x-6 grid grid-cols-2">
              {SPEC_KEYS.map((key) => (
                <div key={key} className="py-3 border-[var(--admin-border)] border-t min-w-0">
                  <dt className="text-[13px] text-[var(--admin-text-muted)] truncate">{tf(`${key}.label`)}</dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <span className="rounded-full ring-1 ring-black/10 w-4 h-4 shrink-0" style={{ background: active[key] }} />
                    <span dir="ltr" className="font-mono text-[var(--admin-text)] text-sm uppercase">
                      {active[key]}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2 mt-auto">
              <Link href={`${base}/${active.id}`} className="flex-1 sm:flex-none admin-btn admin-btn-primary">
                {t('edit')}
              </Link>
              <Link href={`${base}/new?from=${active.id}`} className="flex-1 sm:flex-none admin-btn">
                {t('duplicate')}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex sm:flex-row flex-col sm:items-center gap-4 bg-[var(--admin-surface-muted)] p-5 sm:p-6 border border-[var(--admin-border)]">
          <div className="flex-1 min-w-0">
            <h2 className="luca-display text-[26px]">{t('noActiveTitle')}</h2>
            <p className="mt-1 text-[var(--admin-text-muted)] text-sm leading-7">{t('noActiveHint')}</p>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-5 pt-2">
        <div className="flex justify-between items-baseline gap-3 pb-3 border-[var(--admin-border)] border-b">
          <h2 className="luca-display text-[28px] sm:text-[32px]">{t('allThemes')}</h2>
          <span className="text-[13px] text-[var(--admin-text-muted)]">{t('count', { count: themes.length })}</span>
        </div>

        <ul className="gap-x-5 gap-y-10 grid sm:grid-cols-2 2xl:grid-cols-3">
          {themes.map((theme) => {
            const busy = busyId === theme.id;
            return (
              <li key={theme.id} className="flex flex-col min-w-0">
                <Link
                  href={`${base}/${theme.id}`}
                  aria-label={t('editNamed', { name: theme.name })}
                  className={`relative block bg-[var(--admin-surface-muted)] p-4 border aspect-[4/3] transition-colors ${
                    theme.isActive
                      ? 'border-[var(--admin-text)]'
                      : 'border-[var(--admin-border)] hover:border-[var(--admin-text)]'
                  }`}
                >
                  <div className="border border-[var(--admin-border)] h-full overflow-hidden">
                    <StorefrontThumb palette={theme} />
                  </div>
                  {theme.isActive && (
                    <span className="top-0 absolute admin-badge admin-badge-success start-0">{t('liveShort')}</span>
                  )}
                </Link>

                <div className="flex justify-between items-start gap-3 pt-4">
                  <div className="min-w-0">
                    <p className="text-[13px] text-[var(--admin-text-muted)]">{t('themeId', { id: theme.id })}</p>
                    <h3 className="luca-display text-[22px] truncate">{theme.name}</h3>
                  </div>
                  <FrameDots
                    colors={[theme.primaryColor, theme.secondaryColor, theme.surfaceMutedColor, theme.textColor]}
                  />
                </div>

                {confirmId === theme.id ? (
                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3 px-3 py-2 border border-[var(--error-color)] text-sm">
                    <span className="text-[var(--error-color)]">{t('confirmDelete')}</span>
                    <span className="flex gap-4">
                      <button type="button" className="!min-h-[36px] luca-link" onClick={() => setConfirmId(null)} disabled={busy}>
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        className="!min-h-[36px] text-[var(--error-color)] luca-link"
                        onClick={() => run(theme, 'delete')}
                        disabled={busy}
                      >
                        {busy ? t('working') : t('delete')}
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-4 mt-3 pt-1 border-[var(--admin-border)] border-t">
                    {theme.isActive ? (
                      <span className="inline-flex items-center gap-1.5 min-h-[44px] font-medium text-sm">
                        <Glyph name="check" />
                        {t('isLive')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="font-semibold luca-link"
                        onClick={() => run(theme, 'activate')}
                        disabled={busyId !== null}
                      >
                        {busy ? t('working') : t('activate')}
                      </button>
                    )}
                    <span className="flex-1" />
                    <Link href={`${base}/${theme.id}`} className="luca-link">
                      {t('edit')}
                    </Link>
                    <Link href={`${base}/new?from=${theme.id}`} className="luca-link">
                      {t('duplicate')}
                    </Link>
                    <button
                      type="button"
                      className="disabled:opacity-35 text-[var(--error-color)] luca-link disabled:cursor-not-allowed"
                      title={theme.isActive ? t('cannotDeleteActive') : undefined}
                      disabled={theme.isActive || busyId !== null}
                      onClick={() => setConfirmId(theme.id)}
                    >
                      {t('delete')}
                    </button>
                  </div>
                )}
              </li>
            );
          })}

          <li className="min-w-0">
            <Link
              href={`${base}/new`}
              className="group flex flex-col justify-center items-center gap-3 hover:bg-[var(--admin-surface-muted)] p-6 border border-[#8a8a85] border-dashed aspect-[4/3] text-center transition-colors"
            >
              <span className="place-items-center grid border border-[var(--admin-text)] w-12 h-12 group-hover:bg-[var(--admin-text)] group-hover:text-[var(--admin-surface-elevated)] transition-colors">
                <Glyph name="plus" className="w-5 h-5" />
              </span>
              <span className="luca-display text-[22px]">{t('newTileTitle')}</span>
              <span className="max-w-[17rem] text-[13px] text-[var(--admin-text-muted)] leading-6">{t('newTileHint')}</span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
