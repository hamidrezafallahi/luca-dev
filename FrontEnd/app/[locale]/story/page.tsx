import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';
import { buildPageMetadata } from '@lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'story' });

  return buildPageMetadata({
    locale,
    path: 'story',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

const CHAPTERS = [
  { key: 'optics' as const, reverse: false, cta: null },
  { key: 'ergonomics' as const, reverse: true, cta: null },
  { key: 'custom' as const, reverse: false, cta: 'cooperation' },
];

const FACTS = ['1', '2', '3'] as const;

/** Image slot. Replace the mark with <MediaImage> / <Image> once brand photography exists. */
function Placeholder({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div
      className={`flex justify-center items-center ${
        dark ? 'text-[#6f6f69]' : 'text-[#6a6a65] luca-ph'
      } ${className}`}
    >
      <LoupeMark width={150} />
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'story' });

  return (
    <article className="flex flex-col text-ink">
      {/* Hero */}
      <section className="flex flex-col items-center px-5 md:px-10 pb-10 md:pb-14 h-[480px] md:h-[460px] xl:h-[560px] text-center luca-dark">
        <Placeholder dark className="flex-1" />
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-medium text-[#d0d0cb] text-[13px]">{t('eyebrow')}</span>
          <h1 className="text-white luca-h1">{t('title')}</h1>
          <p className="max-w-[520px] text-[#d8d8d3] leading-loose">{t('subtitle')}</p>
        </div>
      </section>

      {/* Statement */}
      <section className="flex flex-col justify-center items-center gap-6 py-14 md:py-24 text-center luca-container">
        <span className="luca-eyebrow">{t('introEyebrow')}</span>
        <p className="max-w-[820px] text-[26px] md:text-[32px] xl:text-[36px] leading-normal luca-display">
          {t('intro')}
        </p>
      </section>

      {/* Chapters */}
      {CHAPTERS.map((chapter) => (
        <section key={chapter.key} className="grid grid-cols-1 md:grid-cols-2">
          <Placeholder
            className={`h-[360px] md:h-[460px] xl:h-[620px] ${chapter.reverse ? 'md:order-2' : ''}`}
          />
          <div
            className={`flex flex-col justify-center items-start gap-3.5 px-5 md:px-10 xl:px-24 py-10 min-h-[320px] text-start ${
              chapter.reverse ? 'luca-tint md:order-1' : ''
            }`}
          >
            <span className="luca-eyebrow">{t(`chapters.${chapter.key}.eyebrow`)}</span>
            <h2 className="luca-h2">{t(`chapters.${chapter.key}.title`)}</h2>
            <p className="max-w-[460px] leading-loose luca-muted">
              {t(`chapters.${chapter.key}.body`)}
            </p>
            {chapter.cta ? (
              <Link href={`/${locale}/${chapter.cta}`} className="luca-link">
                {t(`chapters.${chapter.key}.cta`)}
              </Link>
            ) : null}
          </div>
        </section>
      ))}

      {/* Quote */}
      <section
        className="flex flex-col justify-center items-center gap-5 px-5 md:px-10 py-14 min-h-[340px] xl:min-h-[380px] text-white text-center"
        style={{ background: 'var(--primary-color)' }}
      >
        <blockquote className="m-0 max-w-[860px] text-[28px] md:text-[36px] xl:text-[44px] leading-snug luca-display">
          «{t('quote')}»
        </blockquote>
        <span className="text-sm">{t('quoteBy')}</span>
      </section>

      {/* Facts */}
      <section className="py-12 md:py-20 luca-container">
        <dl className="grid grid-cols-1 md:grid-cols-3 m-0">
          {FACTS.map((id) => (
            <div key={id} className="flex flex-col-reverse justify-center items-center gap-0.5 min-h-[130px] text-center">
              <dt className="text-sm luca-muted">{t(`facts.${id}.label`)}</dt>
              <dd className="m-0 text-[44px] md:text-[48px] xl:text-[60px] leading-tight luca-display">
                {t(`facts.${id}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Closing tiles */}
      <section className="gap-8 md:gap-4 xl:gap-6 grid grid-cols-1 md:grid-cols-2 pb-12 md:pb-16 xl:pb-[88px] luca-container">
        {[
          { key: 'ctaShop' as const, href: 'products' },
          { key: 'ctaContact' as const, href: 'cooperation' },
        ].map((tile) => (
          <div key={tile.key} className="flex flex-col">
            <Placeholder className="h-[400px] xl:h-[600px]" />
            <div className="flex flex-col items-center gap-0.5 pt-5 min-h-[96px]">
              <h2 className="luca-h3">{t(`${tile.key}.title`)}</h2>
              <Link href={`/${locale}/${tile.href}`} className="luca-link">
                {t(`${tile.key}.link`)}
              </Link>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
