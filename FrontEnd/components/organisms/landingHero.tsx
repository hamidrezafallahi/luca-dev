import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function LandingHero() {
  const locale = await getLocale();
  const t = await getTranslations('homePage');

  return (
    <section
      className="relative flex flex-col justify-end items-center px-5 md:px-10 pb-10 md:pb-14 h-[520px] xl:h-[640px] overflow-hidden text-center luca-dark"
      aria-labelledby="home-hero-title"
    >
      {/* Campaign image. Replace /public/images/landingPage/11.jpg with the Luca campaign visual. */}
      <Image
        src="/images/landingPage/11.jpg"
        alt={t('heroImageAlt')}
        fill
        className="opacity-60 object-cover"
        priority
        fetchPriority="high"
        quality={70}
        sizes="100vw"
      />
      <div className="z-10 relative flex flex-col items-center gap-2.5">
        <span className="font-medium text-[#d0d0cb] text-[13px]">{t('eyebrow')}</span>
        <h1 id="home-hero-title" className="text-white luca-h1">
          {t('title')}
        </h1>
        <p className="max-w-[520px] text-[#d8d8d3] leading-loose">{t('subtitle')}</p>
        <div className="flex flex-wrap justify-center gap-x-8">
          <Link href={`/${locale}/products`} className="text-white hover:text-white luca-link">
            {t('ctaProducts')}
          </Link>
          <Link href={`/${locale}/discounts`} className="text-white hover:text-white luca-link">
            {t('ctaDiscounts')}
          </Link>
        </div>
      </div>
    </section>
  );
}
