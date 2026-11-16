import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

// Keep filenames URL-safe (no commas): /_next/image decodes the url param and
// a comma path makes its internal fetch 404.
import heroPicture from '@public/images/landingPage/Black Eyeglasses with LUCA Magnifying Loupe.png';
import headbandPicture from '@public/images/landingPage/luca-headband-loupe.png';
import caseOpenPicture from '@public/images/landingPage/luca-loupe-case-open.png';
import casePicture from '@public/images/landingPage/luca-loupe-case.png';
import onexPicture from '@public/images/landingPage/luca-onex-loupe.png';
import { getAboutContent } from '@lib/about';
import { isPlaceholder } from '@lib/placeholder';
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
  { key: 'optics' as const, reverse: false, cta: null, image: onexPicture, contain: false },
  { key: 'ergonomics' as const, reverse: true, cta: null, image: headbandPicture, contain: true },
  { key: 'custom' as const, reverse: false, cta: 'cooperation', image: caseOpenPicture, contain: false },
];

const TILES = [
  { key: 'ctaShop' as const, section: 'cta-shop', href: 'products', image: headbandPicture, contain: true },
  { key: 'ctaContact' as const, section: 'cta-contact', href: 'cooperation', image: casePicture, contain: false },
];

const FACTS = ['1', '2', '3'] as const;

// Literal class names so Tailwind keeps them; the fact count varies.
const MD_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
};

type Field = 'eyebrow' | 'title' | 'body' | 'linkText' | 'linkUrl';

/** Internal paths get the locale prefix; full http(s) URLs are kept. */
const toHref = (locale: string, url: string) =>
  /^https?:\/\//i.test(url) ? url : `/${locale}/${url.replace(/^\/+/, '')}`;

/** Full-bleed photo filling its slot; the slot sets the height. */
function StoryImage({
  src,
  alt,
  sizes,
  className = '',
  priority = false,
  contain = false,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  contain?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#2b2b2b] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={contain ? 'object-contain' : 'object-cover'}
      />
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'story' });

  // Texts come from the AboutSections table (admin → «داستان لوکا»). When the API
  // cannot be reached (e.g. at build time) the page falls back to the bundled
  // messages, whose template placeholders ([سال] ...) stay off the page.
  const content = await getAboutContent(locale);
  const fallback = (key: string) => (isPlaceholder(t(key)) ? '' : t(key));
  /** A field of a section; a missing (switched-off) section or an empty text gives ''. */
  const text = (section: string, field: Field, fallbackKey?: string) =>
    content ? content.get(section)?.[field] ?? '' : fallbackKey ? fallback(fallbackKey) : '';

  const hero = {
    eyebrow: text('hero', 'eyebrow', 'eyebrow'),
    title: text('hero', 'title', 'title') || t('title'),
    subtitle: text('hero', 'body', 'subtitle'),
  };
  const intro = {
    eyebrow: text('intro', 'eyebrow', 'introEyebrow'),
    body: text('intro', 'body', 'intro'),
  };
  const chapters = CHAPTERS.map((chapter) => {
    const id = `chapter-${chapter.key}`;
    const base = `chapters.${chapter.key}`;
    return {
      ...chapter,
      eyebrow: text(id, 'eyebrow', `${base}.eyebrow`),
      title: text(id, 'title', `${base}.title`),
      body: text(id, 'body', `${base}.body`),
      linkText: text(id, 'linkText', chapter.cta ? `${base}.cta` : undefined),
      linkUrl: text(id, 'linkUrl') || chapter.cta || '',
    };
  }).filter((c) => c.title || c.body);
  const quote = { text: text('quote', 'body', 'quote'), by: text('quote', 'title', 'quoteBy') };
  const facts = FACTS.map((id) => ({
    id,
    value: text(`fact-${id}`, 'title', `facts.${id}.value`),
    label: text(`fact-${id}`, 'body', `facts.${id}.label`),
  })).filter((f) => f.value);
  const tiles = TILES.map((tile) => ({
    ...tile,
    title: text(tile.section, 'title', `${tile.key}.title`),
    linkText: text(tile.section, 'linkText', `${tile.key}.link`),
    linkUrl: text(tile.section, 'linkUrl') || tile.href,
  })).filter((tile) => tile.title || tile.linkText);

  return (
    <article className="flex flex-col text-ink">
      {/* Hero */}
      <section className="flex flex-col items-center px-5 md:px-10 pb-10 md:pb-14 h-[480px] md:h-[460px] xl:h-[560px] text-center luca-dark">
        <StoryImage
          src={heroPicture}
          alt={t('images.hero')}
          sizes="100vw"
          priority
          className="flex-1 -mx-5 md:-mx-10 mb-6 self-stretch"
        />
        <div className="flex flex-col items-center gap-2.5">
          {hero.eyebrow ? <span className="font-medium text-[#d0d0cb] text-[13px]">{hero.eyebrow}</span> : null}
          <h1 className="text-white luca-h1">{hero.title}</h1>
          {hero.subtitle ? <p className="max-w-[520px] text-[#d8d8d3] leading-loose">{hero.subtitle}</p> : null}
        </div>
      </section>

      {/* Statement */}
      {intro.body ? (
        <section className="flex flex-col justify-center items-center gap-6 py-14 md:py-24 text-center luca-container">
          {intro.eyebrow ? <span className="luca-eyebrow">{intro.eyebrow}</span> : null}
          <p className="max-w-[820px] text-[26px] md:text-[32px] xl:text-[36px] leading-normal whitespace-pre-line luca-display">
            {intro.body}
          </p>
        </section>
      ) : null}

      {/* Chapters */}
      {chapters.map((chapter) => (
        <section key={chapter.key} className="grid grid-cols-1 md:grid-cols-2">
          <StoryImage
            src={chapter.image}
            contain={chapter.contain}
            alt={t(`images.${chapter.key}`)}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`h-[360px] md:h-[460px] xl:h-[620px] ${chapter.reverse ? 'md:order-2' : ''}`}
          />
          <div
            className={`flex flex-col justify-center items-start gap-3.5 px-5 md:px-10 xl:px-24 py-10 min-h-[320px] text-start ${
              chapter.reverse ? 'luca-tint md:order-1' : ''
            }`}
          >
            {chapter.eyebrow ? <span className="luca-eyebrow">{chapter.eyebrow}</span> : null}
            {chapter.title ? <h2 className="luca-h2">{chapter.title}</h2> : null}
            {chapter.body ? (
              <p className="max-w-[460px] leading-loose whitespace-pre-line luca-muted">{chapter.body}</p>
            ) : null}
            {chapter.linkText && chapter.linkUrl ? (
              <Link href={toHref(locale, chapter.linkUrl)} className="luca-link">
                {chapter.linkText}
              </Link>
            ) : null}
          </div>
        </section>
      ))}

      {/* Quote */}
      {quote.text ? (
        <section
          className="flex flex-col justify-center items-center gap-5 px-5 md:px-10 py-14 min-h-[340px] xl:min-h-[380px] text-white text-center"
          style={{ background: 'var(--primary-color)' }}
        >
          <blockquote className="m-0 max-w-[860px] text-[28px] md:text-[36px] xl:text-[44px] leading-snug luca-display">
            «{quote.text}»
          </blockquote>
          {quote.by ? <span className="text-sm">{quote.by}</span> : null}
        </section>
      ) : null}

      {/* Facts */}
      {facts.length > 0 && (
        <section className="py-12 md:py-20 luca-container">
          <dl className={`grid grid-cols-1 ${MD_COLS[facts.length] ?? 'md:grid-cols-3'} m-0`}>
            {facts.map((fact) => (
              <div key={fact.id} className="flex flex-col-reverse justify-center items-center gap-0.5 min-h-[130px] text-center">
                <dt className="text-sm luca-muted">{fact.label}</dt>
                <dd className="m-0 text-[44px] md:text-[48px] xl:text-[60px] leading-tight luca-display">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Closing tiles */}
      {tiles.length > 0 && (
        <section className="gap-8 md:gap-4 xl:gap-6 grid grid-cols-1 md:grid-cols-2 pb-12 md:pb-16 xl:pb-[88px] luca-container">
          {tiles.map((tile) => (
            <div key={tile.key} className="flex flex-col">
              <StoryImage
                src={tile.image}
                contain={tile.contain}
                alt={t(`images.${tile.key}`)}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-[400px] xl:h-[600px]"
              />
              <div className="flex flex-col items-center gap-0.5 pt-5 min-h-[96px]">
                {tile.title ? <h2 className="luca-h3">{tile.title}</h2> : null}
                {tile.linkText ? (
                  <Link href={toHref(locale, tile.linkUrl)} className="luca-link">
                    {tile.linkText}
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}
