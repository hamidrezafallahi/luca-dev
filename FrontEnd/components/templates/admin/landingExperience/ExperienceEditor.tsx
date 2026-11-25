'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import MediaImage from '@components/atoms/MediaImage';
import { browserApiBaseUrl } from '@lib/api';
import { describeThrown, readApiResult } from '@lib/apiError';
import { fetchWithAuth } from '@lib/client-auth';
import type { ExperienceCard, ExperienceCardKey, LandingExperienceContent } from '@lib/landingExperience';

const cardKeys: ExperienceCardKey[] = ['appointment', 'fitting', 'contact'];
const copy = {
  en: { heading: 'The Luca experience', hint: 'Edit the section and its three cards in both languages.', section: 'Section title', card: 'Card', title: 'Title', body: 'Body', cta: 'Button text', link: 'Button URL (https:// or /path)', alt: 'Image alternative text', image: 'Main image', mobile: 'Mobile image', remove: 'Remove existing image', save: 'Save content', deletion: 'Delete content', confirm: 'Delete this section and its images?', retry: 'Retry', empty: 'No content yet. Fill the fields to create it.', loading: 'Loading content…', saved: 'Content saved.', failed: 'Could not load content.', linkError: 'Use a local /path or an https:// URL.' },
  fa: { heading: 'تجربه لوکا', hint: 'عنوان بخش و سه کارت را به فارسی و انگلیسی ویرایش کنید.', section: 'عنوان بخش', card: 'کارت', title: 'عنوان', body: 'متن', cta: 'متن دکمه', link: 'آدرس دکمه (https:// یا /path)', alt: 'متن جایگزین تصویر', image: 'تصویر اصلی', mobile: 'تصویر موبایل', remove: 'حذف تصویر فعلی', save: 'ذخیره محتوا', deletion: 'حذف محتوا', confirm: 'این بخش و تصویرهای آن حذف شوند؟', retry: 'تلاش دوباره', empty: 'هنوز محتوایی ثبت نشده است. برای ایجاد، فیلدها را پر کنید.', loading: 'در حال بارگذاری محتوا…', saved: 'محتوا ذخیره شد.', failed: 'بارگذاری محتوا انجام نشد.', linkError: 'آدرس باید با / یا https:// شروع شود.' },
};

function blankCard(cardKey: ExperienceCardKey, t: ReturnType<typeof useTranslations<'landing.experience'>>): ExperienceCard {
  return { cardKey, titleFa: '', titleEn: t(`${cardKey}.title`), bodyFa: '', bodyEn: t(`${cardKey}.body`), ctaTextFa: '', ctaTextEn: t(`${cardKey}.cta`), ctaLink: cardKey === 'fitting' ? '/faq' : '/cooperation', imageUrl: '', mobileImageUrl: '', imageAltFa: '', imageAltEn: '' };
}

export default function ExperienceEditor() {
  const locale = useLocale();
  const t = useTranslations('landing.experience');
  const router = useRouter();
  const c = locale === 'en' ? copy.en : copy.fa;
  const [value, setValue] = useState<LandingExperienceContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState<Record<string, File | null>>({});
  const [removals, setRemovals] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await readApiResult<LandingExperienceContent | null>(await fetchWithAuth(`${browserApiBaseUrl}/LandingExperiences`, { cache: 'no-store' }));
      if (!result.isSuccess) throw new Error(result.error || c.failed);
      setValue(result.data ?? { id: 0, titleFa: '', titleEn: t('title'), cards: cardKeys.map((key) => blankCard(key, t)) });
    } catch (cause) { setError(describeThrown(cause)); }
    finally { setLoading(false); }
  }, [c.failed, t]);

  useEffect(() => { void load(); }, [load]);

  function setCard(key: ExperienceCardKey, field: keyof ExperienceCard, text: string) {
    setValue((current) => current && ({ ...current, cards: current.cards.map((card) => card.cardKey === key ? { ...card, [field]: text } : card) }));
  }

  async function save() {
    if (!value || saving) return;
    for (const card of value.cards) {
      if (card.ctaLink && !(/^https:\/\//i.test(card.ctaLink) || /^\/(?!\/)/.test(card.ctaLink))) { setError(c.linkError); return; }
    }
    setSaving(true); setError(''); setNotice('');
    try {
      const payload = { titleFa: value.titleFa, titleEn: value.titleEn, cards: value.cards.map(({ cardKey, titleFa, titleEn, bodyFa, bodyEn, ctaTextFa, ctaTextEn, ctaLink, imageAltFa, imageAltEn }) => ({ cardKey, titleFa, titleEn, bodyFa, bodyEn, ctaTextFa, ctaTextEn, ctaLink, imageAltFa, imageAltEn })) };
      const response = await fetchWithAuth(`${browserApiBaseUrl}/LandingExperiences`, { method: value.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await readApiResult(response);
      if (!result.isSuccess) throw new Error(result.error || c.failed);
      for (const key of cardKeys) {
        const image = uploads[`${key}.image`], mobile = uploads[`${key}.mobile`];
        const removeImage = removals[`${key}.image`], removeMobileImage = removals[`${key}.mobile`];
        if (!image && !mobile && !removeImage && !removeMobileImage) continue;
        const data = new FormData();
        if (image) data.append('Image', image);
        if (mobile) data.append('MobileImage', mobile);
        data.append('RemoveImage', String(!image && Boolean(removeImage)));
        data.append('RemoveMobileImage', String(!mobile && Boolean(removeMobileImage)));
        const uploaded = await readApiResult(await fetchWithAuth(`${browserApiBaseUrl}/LandingExperiences/cards/${key}/image`, { method: 'PUT', body: data }));
        if (!uploaded.isSuccess) throw new Error(uploaded.error || c.failed);
      }
      setUploads({}); setRemovals({}); setNotice(c.saved);
      await load(); router.refresh();
    } catch (cause) { setError(describeThrown(cause)); }
    finally { setSaving(false); }
  }

  async function removeContent() {
    if (!value?.id || saving || !window.confirm(c.confirm)) return;
    setSaving(true); setError('');
    try {
      const result = await readApiResult(await fetchWithAuth(`${browserApiBaseUrl}/LandingExperiences`, { method: 'DELETE' }));
      if (!result.isSuccess) throw new Error(result.error || c.failed);
      setUploads({}); setRemovals({}); await load(); router.refresh();
    } catch (cause) { setError(describeThrown(cause)); }
    finally { setSaving(false); }
  }

  const inputClass = 'w-full border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] px-3 py-2 text-[var(--admin-text)] focus-visible:outline-2 focus-visible:outline-[var(--primary-color)]';
  const textField = (label: string, field: 'titleFa' | 'titleEn', lang: string) => (
    <label className="flex flex-col gap-2 text-[var(--admin-text)]">{label} ({lang})
      <input className={inputClass} value={value?.[field] ?? ''} onChange={(event) => setValue((current) => current && ({ ...current, [field]: event.target.value }))} maxLength={200} required />
    </label>
  );
  const cardField = (card: ExperienceCard, field: keyof ExperienceCard, label: string, language?: string, multiline = false) => (
    <label key={`${card.cardKey}.${field}`} className="flex flex-col gap-2 text-[var(--admin-text)]">{label} {language ? `(${language})` : ''}
      {multiline ? <textarea className={inputClass} rows={4} maxLength={4000} value={String(card[field] ?? '')} onChange={(event) => setCard(card.cardKey, field, event.target.value)} />
        : <input className={inputClass} maxLength={field === 'ctaLink' ? 300 : 200} value={String(card[field] ?? '')} onChange={(event) => setCard(card.cardKey, field, event.target.value)} />}
    </label>
  );

  return <div className="admin-page space-y-6">
    <header className="admin-page-header"><div><h1 className="admin-page-title">{c.heading}</h1><p className="admin-page-subtitle">{c.hint}</p></div></header>
    {loading ? <p role="status">{c.loading}</p> : error && !value ? <div role="alert" className="admin-panel"><p>{error}</p><button type="button" className="admin-btn" onClick={() => void load()}>{c.retry}</button></div> : value && <>
      {!value.id && <p className="admin-panel">{c.empty}</p>}
      <section className="admin-panel space-y-4"><h2 className="luca-h3">{c.section}</h2><div className="grid gap-4 md:grid-cols-2">{textField(c.section, 'titleFa', 'فارسی')}{textField(c.section, 'titleEn', 'English')}</div></section>
      {cardKeys.map((key) => {
        const card = value.cards.find((item) => item.cardKey === key) ?? blankCard(key, t);
        return <section key={key} className="admin-panel space-y-5"><h2 className="luca-h3">{c.card}: {locale === 'en' ? card.titleEn || key : card.titleFa || key}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cardField(card, 'titleFa', c.title, 'فارسی')}{cardField(card, 'titleEn', c.title, 'English')}
            {cardField(card, 'bodyFa', c.body, 'فارسی', true)}{cardField(card, 'bodyEn', c.body, 'English', true)}
            {cardField(card, 'ctaTextFa', c.cta, 'فارسی')}{cardField(card, 'ctaTextEn', c.cta, 'English')}
            {cardField(card, 'ctaLink', c.link)}<div />
            {cardField(card, 'imageAltFa', c.alt, 'فارسی')}{cardField(card, 'imageAltEn', c.alt, 'English')}
          </div>
          <div className="grid gap-4 md:grid-cols-2">{(['image', 'mobile'] as const).map((kind) => {
            const current = kind === 'image' ? card.imageUrl : card.mobileImageUrl;
            const name = `${key}.${kind}`;
            return <div key={kind} className="space-y-2">
              <label className="flex flex-col gap-2">{kind === 'image' ? c.image : c.mobile}
                <input className={inputClass} type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setUploads((prev) => ({ ...prev, [name]: event.target.files?.[0] ?? null }))} />
              </label>
              {current && <div className="relative w-32 h-24"><MediaImage src={current} alt={locale === 'en' ? card.imageAltEn : card.imageAltFa} fill className="object-cover" sizes="128px" /></div>}
              {current && <label className="flex items-center gap-2"><input type="checkbox" checked={Boolean(removals[name])} onChange={(event) => setRemovals((prev) => ({ ...prev, [name]: event.target.checked }))} />{c.remove}</label>}
            </div>;
          })}</div>
        </section>;
      })}
      <div aria-live="polite">{error && <p role="alert" className="text-[var(--error-color)]">{error}</p>}{notice && <p className="text-[var(--success-color)]">{notice}</p>}</div>
      <div className="flex flex-wrap gap-3"><button type="button" className="admin-btn" disabled={saving} onClick={() => void save()}>{c.save}</button>{Boolean(value.id) && <button type="button" className="admin-btn admin-btn-ghost" disabled={saving} onClick={() => void removeContent()}>{c.deletion}</button>}</div>
    </>}
  </div>;
}
