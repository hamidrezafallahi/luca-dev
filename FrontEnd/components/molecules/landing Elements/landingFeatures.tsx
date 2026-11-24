import { getLocale } from 'next-intl/server';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';
import MediaImage from '@components/atoms/MediaImage';
import { getLandingFeatures } from '@lib/landingFeatures';

/** Server rendered, with the public API response cached for at most 60 seconds. */
export default async function LandingFeatures() {
  const locale = await getLocale();
  const features = await getLandingFeatures();
  const pick = (fa: string, en: string) => (locale === 'en' ? en || fa : fa || en);

  return (
    <>
      {features.map((f) => {
        const title = pick(f.titleFa, f.titleEn);
        const link = f.linkUrl.trim();
        const href = /^https?:\/\//i.test(link) ? link : `/${locale}/${link.replace(/^\/+/, '')}`;
        return (
          <section key={f.id} className="grid grid-cols-1 md:grid-cols-2">
            <div className={`relative flex flex-col justify-center items-center gap-3.5 h-[360px] md:h-[460px] xl:h-[620px] text-store-subtle luca-ph ${f.reverse ? 'md:order-2' : ''}`}>
              {f.imageUrl ? (
                <MediaImage src={f.imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : <LoupeMark width={150} />}
            </div>
            <div className={`flex flex-col justify-center items-center md:items-start gap-3.5 px-5 md:px-10 xl:px-24 py-10 min-h-[320px] text-center md:text-start ${f.reverse ? 'luca-tint md:order-1' : ''}`}>
              <span className="luca-eyebrow">{pick(f.eyebrowFa, f.eyebrowEn)}</span>
              <h2 className="luca-h2">{title}</h2>
              <p className="max-w-[460px] leading-loose whitespace-pre-line luca-muted">{pick(f.bodyFa, f.bodyEn)}</p>
              {link && (f.linkTextFa || f.linkTextEn) ? (
                <Link href={href} className="luca-link">{pick(f.linkTextFa, f.linkTextEn)}</Link>
              ) : null}
            </div>
          </section>
        );
      })}
    </>
  );
}
