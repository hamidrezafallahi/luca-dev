import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';
import MediaImage from '@components/atoms/MediaImage';
import { getLandingExperience, type ExperienceCard, type ExperienceCardKey } from '@lib/landingExperience';

const cards: { key: ExperienceCardKey; href: string }[] = [
  { key: 'appointment', href: 'cooperation' },
  { key: 'fitting', href: 'faq' },
  { key: 'contact', href: 'cooperation' },
];

function cardHref(raw: string, locale: string, fallback: string) {
  const link = raw.trim();
  if (!link) return `/${locale}/${fallback}`;
  if (/^https:\/\//i.test(link)) return link;
  if (!link.startsWith('/') || link.startsWith('//')) return `/${locale}/${fallback}`;
  return /^\/(fa|en)(\/|$)/.test(link) ? link : `/${locale}${link}`;
}

function CardMedia({ card, alt, primary = false }: { card?: ExperienceCard; alt: string; primary?: boolean }) {
  if (!card?.imageUrl && !card?.mobileImageUrl) {
    return primary ? null : (
      <div className="flex justify-center items-center h-[220px] xl:h-[260px] text-store-subtle luca-ph">
        <LoupeMark width={90} />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden luca-ph ${primary ? 'w-full h-[180px]' : 'h-[220px] xl:h-[260px]'}`}>
      {card.mobileImageUrl && (
        <MediaImage src={card.mobileImageUrl} alt={alt} fill className="object-cover md:hidden" sizes="100vw" />
      )}
      {card.imageUrl && (
        <MediaImage src={card.imageUrl} alt={alt} fill className={`object-cover ${card.mobileImageUrl ? 'hidden md:block' : ''}`} sizes="(max-width: 768px) 100vw, 33vw" />
      )}
      {!card.imageUrl && card.mobileImageUrl && (
        <MediaImage src={card.mobileImageUrl} alt={alt} fill className="hidden object-cover md:block" sizes="33vw" />
      )}
    </div>
  );
}

/** Server-rendered content with a 60-second fetch cache and the original layout fallback. */
export default async function LandingExperience() {
  const [locale, t, content] = await Promise.all([
    getLocale(), getTranslations('landing.experience'), getLandingExperience(),
  ]);
  if (content === null) return null;
  const pick = (fa?: string, en?: string) => (locale === 'en' ? en || fa : fa || en) || '';
  const sectionTitle = pick(content?.titleFa, content?.titleEn) || t('title');
  const byKey = new Map(content?.cards?.map((card) => [card.cardKey, card]));

  return (
    <section id="appointment" className="flex flex-col gap-12 store-section luca-container">
      <h2 className="text-center luca-h2">{sectionTitle}</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ key, href }) => {
          const card = byKey.get(key);
          const primary = key === 'appointment';
          const title = pick(card?.titleFa, card?.titleEn) || t(`${key}.title`);
          const body = pick(card?.bodyFa, card?.bodyEn) || t(`${key}.body`);
          const label = pick(card?.ctaTextFa, card?.ctaTextEn) || t(`${key}.cta`);
          const imageAlt = pick(card?.imageAltFa, card?.imageAltEn) || title;
          return primary ? (
            <div key={key} className="flex flex-col justify-center items-center xl:items-start gap-3.5 md:col-span-2 xl:col-span-1 p-7 md:p-10 xl:p-12 border min-h-[260px] text-center xl:text-start luca-line">
              <CardMedia card={card} alt={imageAlt} primary />
              <h3 className="luca-h3">{title}</h3>
              <p className="max-w-[420px] leading-loose whitespace-pre-line luca-muted">{body}</p>
              <Link href={cardHref(card?.ctaLink ?? '', locale, href)} className="store-btn">{label}</Link>
            </div>
          ) : (
            <div key={key} className="flex flex-col gap-2.5">
              <CardMedia card={card} alt={imageAlt} />
              <div className="flex flex-col items-start gap-1 pt-2.5 text-start">
                <h3 className="luca-h3">{title}</h3>
                <p className="leading-loose whitespace-pre-line luca-muted">{body}</p>
                <Link href={cardHref(card?.ctaLink ?? '', locale, href)} className="luca-link">{label}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
