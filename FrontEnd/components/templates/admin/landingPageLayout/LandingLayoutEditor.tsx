'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { browserApiBaseUrl } from '@lib/api';
import { describeThrown, readApiResult } from '@lib/apiError';
import { fetchWithAuth } from '@lib/client-auth';
import { defaultLandingComponents, landingKeys, type LandingPageComponent } from '@lib/landingPageContract';

const labels: Record<string, [string, string]> = {
  hero: ['Hero', 'بنر اصلی'], products: ['Products', 'محصولات'], homeSlider: ['Home slider', 'اسلایدر صفحه اصلی'], categories: ['Categories', 'دسته‌بندی‌ها'], features: ['Features', 'ویژگی‌ها'], specialOffers: ['Special offers', 'پیشنهادهای ویژه'], experience: ['Luca experience', 'تجربه لوکا'], usp: ['Benefits', 'مزیت‌ها'], trust: ['Trust', 'اعتماد'], blog: ['Journal', 'مجله'], testimonials: ['Testimonials', 'نظر مشتریان'], faq: ['FAQ', 'پرسش‌های متداول'], contactBand: ['Contact', 'تماس'],
};
const copy = {
  en: { heading: 'Landing page layout', hint: 'Drag sections or use the move buttons. Changes appear after saving.', enabled: 'Visible', required: 'Required', up: 'Move up', down: 'Move down', save: 'Save changes', discard: 'Discard changes', reset: 'Default order', editing: 'Edit content', saved: 'Layout saved.', loading: 'Loading layout…', retry: 'Retry', error: 'Could not load layout.' },
  fa: { heading: 'چیدمان صفحه اصلی', hint: 'بخش‌ها را بکشید یا با دکمه‌ها جابه‌جا کنید. تغییرات پس از ذخیره اعمال می‌شوند.', enabled: 'نمایش', required: 'الزامی', up: 'انتقال به بالا', down: 'انتقال به پایین', save: 'ذخیره تغییرات', discard: 'لغو تغییرات', reset: 'ترتیب پیش‌فرض', editing: 'ویرایش محتوا', saved: 'چیدمان ذخیره شد.', loading: 'در حال بارگذاری چیدمان…', retry: 'تلاش دوباره', error: 'بارگذاری چیدمان انجام نشد.' },
};

function normalize(items: LandingPageComponent[]): LandingPageComponent[] {
  const known = new Map(items.filter((item) => landingKeys.includes(item.componentKey as typeof landingKeys[number])).map((item) => [item.componentKey, item]));
  return landingKeys.map((key, index) => known.get(key) ?? defaultLandingComponents[index])
    .sort((a, b) => a.displayOrder - b.displayOrder || landingKeys.indexOf(a.componentKey as typeof landingKeys[number]) - landingKeys.indexOf(b.componentKey as typeof landingKeys[number]));
}

export default function LandingLayoutEditor() {
  const locale = useLocale();
  const c = locale === 'en' ? copy.en : copy.fa;
  const router = useRouter();
  const [saved, setSaved] = useState<LandingPageComponent[]>([]);
  const [draft, setDraft] = useState<LandingPageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dragging, setDragging] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await readApiResult<LandingPageComponent[]>(await fetchWithAuth(`${browserApiBaseUrl}/LandingPageComponents`, { cache: 'no-store' }));
      if (!result.isSuccess || !Array.isArray(result.data)) throw new Error(result.error || c.error);
      const records = normalize(result.data);
      setSaved(records); setDraft(records);
    } catch (cause) { setError(describeThrown(cause)); }
    finally { setLoading(false); }
  }, [c.error]);

  useEffect(() => { void load(); }, [load]);

  function move(from: number, to: number) {
    if (from < 1 || to < 1 || from >= draft.length || to >= draft.length || from === to) return;
    setDraft((previous) => { const next = [...previous]; next.splice(to, 0, ...next.splice(from, 1)); return next; });
  }

  async function save() {
    if (saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const visibility = Object.fromEntries(draft.map((item) => [item.componentKey, item.componentKey === 'hero' || item.isEnabled]));
      const result = await readApiResult(await fetchWithAuth(`${browserApiBaseUrl}/LandingPageComponents/order`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keys: draft.map((item) => item.componentKey), visibility }) }));
      if (!result.isSuccess) throw new Error(result.error || c.error);
      await load(); setNotice(c.saved); router.refresh();
    } catch (cause) { setError(describeThrown(cause)); }
    finally { setSaving(false); }
  }

  return <div className="admin-page space-y-6">
    <header className="admin-page-header"><div><h1 className="admin-page-title">{c.heading}</h1><p className="admin-page-subtitle">{c.hint}</p></div></header>
    {loading ? <p role="status">{c.loading}</p> : error && !draft.length ? <div className="admin-panel" role="alert"><p>{error}</p><button type="button" className="admin-btn" onClick={() => void load()}>{c.retry}</button></div> : <>
      <ol className="space-y-2" aria-label={c.heading}>
        {draft.map((item, index) => {
          const required = item.componentKey === 'hero' || item.isRequired;
          const label = labels[item.componentKey]?.[locale === 'en' ? 0 : 1] ?? item.componentKey;
          return <li key={item.componentKey} draggable={!required} onDragStart={() => setDragging(item.componentKey)} onDragEnd={() => setDragging(null)} onDragOver={(event) => { if (dragging && !required) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); const from = draft.findIndex((row) => row.componentKey === dragging); move(from, index); setDragging(null); }} className="admin-panel flex flex-wrap items-center gap-3">
            <span aria-hidden="true" className="text-[var(--admin-text-muted)]">⋮⋮</span>
            <span className="min-w-[9rem] flex-1 text-[var(--admin-text)]">{index + 1}. {label}</span>
            {required && <span className="text-[var(--admin-text-muted)]">{c.required}</span>}
            {item.componentKey === 'experience' && <Link className="admin-btn admin-btn-ghost" href={`/${locale}/admin/landingExperience`}>{c.editing}</Link>}
            <label className="flex items-center gap-2 text-[var(--admin-text)]"><input type="checkbox" checked={required || item.isEnabled} disabled={required} onChange={(event) => setDraft((old) => old.map((row) => row.componentKey === item.componentKey ? { ...row, isEnabled: event.target.checked } : row))} />{c.enabled}</label>
            <div className="flex gap-1"><button type="button" className="admin-icon-btn" aria-label={`${c.up}: ${label}`} disabled={required || index < 2} onClick={() => move(index, index - 1)}>↑</button><button type="button" className="admin-icon-btn" aria-label={`${c.down}: ${label}`} disabled={required || index === draft.length - 1} onClick={() => move(index, index + 1)}>↓</button></div>
          </li>;
        })}
      </ol>
      <div aria-live="polite">{error && <p role="alert" className="text-[var(--error-color)]">{error}</p>}{notice && <p className="text-[var(--success-color)]">{notice}</p>}</div>
      <div className="flex flex-wrap gap-3"><button className="admin-btn" type="button" disabled={saving} onClick={() => void save()}>{c.save}</button><button className="admin-btn admin-btn-ghost" type="button" disabled={saving} onClick={() => setDraft(saved)}>{c.discard}</button><button className="admin-btn admin-btn-ghost" type="button" disabled={saving} onClick={() => setDraft(defaultLandingComponents)}>{c.reset}</button></div>
    </>}
  </div>;
}
