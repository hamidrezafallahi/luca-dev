import type { Metadata } from 'next';
import {
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';

import BlogSection from '@components/molecules/landing Elements/blogSection';
import LandingBrands
  from '@components/molecules/landing Elements/landingBrands';
import LandingCategory
  from '@components/molecules/landing Elements/landingCategory';
import LandingContactBand
  from '@components/molecules/landing Elements/landingContactBand';
import LandingExperience
  from '@components/molecules/landing Elements/landingExperience';
import LandingFaq from '@components/molecules/landing Elements/landingFaq';
import LandingFeatures
  from '@components/molecules/landing Elements/landingFeatures';
import LandingSlider
  from '@components/molecules/landing Elements/landingSlider';
import LandingSpecialOffer
  from '@components/molecules/landing Elements/landingSpecialOffer';
import TestimonialsSection
  from '@components/molecules/landing Elements/testimonialsSection';
import TheMostProducts
  from '@components/molecules/landing Elements/theMostProducts';
import TrustSection from '@components/molecules/landing Elements/trustSection';
import USPSection from '@components/molecules/landing Elements/uspSection';
import JsonLd from '@components/molecules/storefront/JsonLd';
import AdminDock from '@components/organisms/adminDock';
import LandingHero from '@components/organisms/landingHero';
import Footer from '@layout/footer';
import Header from '@layout/header';
import { siteBaseUrl } from '@lib/api';
import { getLandingCategories } from '@lib/category';
import {
  getSlides,
  splitHeroSlide,
} from '@lib/landing';
import {
  absoluteUrl,
  buildPageMetadata,
} from '@lib/seo';

/** ISR: homepage cacheable; regenerate every 60s. */
export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return buildPageMetadata({
    locale,
    path: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
    keywords: t('homeKeywords').split(',').map((k) => k.trim()),
    // Avoid streaming metadata after </head> (Lighthouse SEO fails otherwise).
    skipSeoOverride: true,
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tBrand = await getTranslations({ locale, namespace: 'brand' });
  const tSeo = await getTranslations({ locale, namespace: 'seo' });

  const { hero, rest } = splitHeroSlide(await getSlides());
  const categories = await getLandingCategories();

const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${absoluteUrl(locale, '')}#organization`,
    name: tBrand('name'),
    url: absoluteUrl(locale, ''),
    // Root-absolute assets (never locale-prefixed).
    logo: `${siteBaseUrl}/logo.png`,
    image: `${siteBaseUrl}/og-image.jpg`,
    // TODO(luca): replace contact details and social profiles with the brand's real ones.
    email: 'info@lucaloupe.ir',
    telephone: '+98-935-5716386',
  
    sameAs: [
      'https://instagram.com/lucaloupe.ir',
      'https://wa.me/989355716386',
    ],
  
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
    },
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl(locale, '')}#website`,
    name: tBrand('name'),
    url: absoluteUrl(locale, ''),
    description: tSeo('homeDescription'),
    inLanguage: locale,
    publisher: {
      '@id': `${absoluteUrl(locale, '')}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl(locale, 'products')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={[organizationLd, websiteLd]} />
      <Header />
      <main className="flex flex-col min-h-screen">
        <LandingHero slide={hero} />
        <TheMostProducts />
        <LandingSlider images={rest} />
        <LandingCategory categories={categories} />
        <LandingFeatures />
        <LandingSpecialOffer />
        <LandingBrands />
        <LandingExperience />
        <USPSection />
        <TrustSection />
        <BlogSection />
        <TestimonialsSection />
        <LandingFaq locale={locale} />
        <LandingContactBand />
      </main>
      <AdminDock />
      <Footer />
    </>
  );
}
