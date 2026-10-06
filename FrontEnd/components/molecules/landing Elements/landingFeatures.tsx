import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';
import MediaImage from '@components/atoms/MediaImage';

type FeatureKey = 'ergonomics' | 'optics';

const FEATURES: { key: FeatureKey; href: string; image: string | null; reverse: boolean }[] = [
  // Set `image` to a file under /public/images/landingPage/ once the editorial photos exist.
  { key: 'ergonomics', href: 'products', image: null, reverse: false },
  { key: 'optics', href: 'story', image: null, reverse: true },
];

/** Alternating image / text editorial blocks from the Luca home prototype. */
export default async function LandingFeatures() {
  const locale = await getLocale();
  const t = await getTranslations('landing.features');

  return (
    <>
      {FEATURES.map((f) => (
        <section key={f.key} className="grid grid-cols-1 md:grid-cols-2">
          <div
            className={`relative flex flex-col justify-center items-center gap-3.5 h-[360px] md:h-[460px] xl:h-[620px] text-[#6a6a65] luca-ph ${
              f.reverse ? 'md:order-2' : ''
            }`}
          >
            {f.image ? (
              <MediaImage src={f.image} alt={t(`${f.key}.title`)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <LoupeMark width={150} />
            )}
          </div>
          <div
            className={`flex flex-col justify-center items-start gap-3.5 px-5 md:px-10 xl:px-24 py-10 min-h-[320px] text-start ${
              f.reverse ? 'luca-tint md:order-1' : ''
            }`}
          >
            <span className="luca-eyebrow">{t(`${f.key}.eyebrow`)}</span>
            <h2 className="luca-h2">{t(`${f.key}.title`)}</h2>
            <p className="max-w-[460px] leading-loose luca-muted">{t(`${f.key}.body`)}</p>
            <Link href={`/${locale}/${f.href}`} className="luca-link">
              {t(`${f.key}.cta`)}
            </Link>
          </div>
        </section>
      ))}
    </>
  );
}
