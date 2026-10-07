import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import type { LandingSlide } from '@lib/landing';
import { toMediaUrl } from '@utils/toMediaUrl';

import HeroMedia from './heroMedia';

/** Used until an admin uploads a hero slide (image, optionally with a video). Replace with the Luca campaign visual. */
const DEFAULT_IMAGE = '/images/landingPage/11.jpg';

type Props = {
  /** Slide flagged as hero in the admin (Slides table). Falls back to the bundled media. */
  slide?: LandingSlide | null;
};

const internalHref = (locale: string, url?: string) => {
  const clean = url?.trim().replace(/^\/+/, '');
  return clean ? `/${locale}/${clean}` : null;
};

export default async function LandingHero({ slide }: Props) {
  const locale = await getLocale();
  const t = await getTranslations('homePage');

  const hasSlide = Boolean(slide?.bannerUrl);
  const desktop = {
    image: hasSlide ? toMediaUrl(slide?.bannerUrl) : DEFAULT_IMAGE,
    video: slide?.videoUrl ? toMediaUrl(slide.videoUrl) : undefined,
  };
  // Phone assets are optional; HeroMedia falls back to the desktop ones per part.
  const mobile = {
    image: slide?.mobileBannerUrl ? toMediaUrl(slide.mobileBannerUrl) : undefined,
    video: slide?.mobileVideoUrl ? toMediaUrl(slide.mobileVideoUrl) : undefined,
  };

  const primaryHref = internalHref(locale, slide?.firstUrl) ?? `/${locale}/products`;
  const secondaryHref = internalHref(locale, slide?.secondUrl) ?? `/${locale}/discounts`;

  return (
    <section
      className="relative flex flex-col justify-end items-center px-5 md:px-10 pb-10 md:pb-14 h-[520px] xl:h-[640px] overflow-hidden text-center luca-dark"
      aria-labelledby="home-hero-title"
    >
      <HeroMedia
        desktop={desktop}
        mobile={mobile}
        alt={t('heroImageAlt')}
        playLabel={t('videoPlay')}
        pauseLabel={t('videoPause')}
        noScrim
        dim
      />
      <div className="z-10 relative flex flex-col items-center gap-2.5">
        <span className="font-medium text-[#d0d0cb] text-[13px]">
          {slide?.bannerTitle?.trim() || t('eyebrow')}
        </span>
        <h1 id="home-hero-title" className="text-white luca-h1">
          {t('title')}
        </h1>
        <p className="max-w-[520px] text-[#d8d8d3] leading-loose">
          {slide?.bannerDescription?.trim() || t('subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-x-8">
          <Link href={primaryHref} className="text-white hover:text-white luca-link">
            {t('ctaProducts')}
          </Link>
          <Link href={secondaryHref} className="text-white hover:text-white luca-link">
            {t('ctaDiscounts')}
          </Link>
        </div>
      </div>
    </section>
  );
}
