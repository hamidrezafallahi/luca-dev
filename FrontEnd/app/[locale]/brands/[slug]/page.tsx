import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';

import SeoHighlight from '@components/molecules/storefront/SeoHighlight';
import StoreBreadcrumbs from '@components/molecules/storefront/StoreBreadcrumbs';
import BrandTemplate from '@components/templates/brandTemplate';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { buildPageMetadata } from '@lib/seo';
import { fetchStaticSlugParams } from '@lib/staticParams';
import { SimpleResponse } from '@models/base';
import { IBrand } from '@models/brand';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return fetchStaticSlugParams('Brands/getslugs', 'Brands/getids');
}

async function fetchBrand(slug: string): Promise<IBrand | null> {
  const result = await safeFetchJson<SimpleResponse<IBrand>>(
    `${serverApiBaseUrl}/Brands/${slug}`,
    { next: { revalidate: 300 } },
  );

  if (!result.ok || !result.data?.data) return null;
  if (result.data.isSuccess === false) return null;
  return result.data.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const brand = await fetchBrand(slug);

  // Metadata resolves before the response status is sent; calling notFound()
  // here (not only in the page) is what makes the response a real 404.
  if (!brand) {
    notFound();
  }

  const canonical = brand.slug || String(brand.id);
  const title =
    (locale === 'fa' ? brand.seoTitleFa : brand.seoTitleEn) || brand.name;
  const description =
    (locale === 'fa' ? brand.metaDescriptionFa : brand.metaDescriptionEn) ||
    brand.description;

  return buildPageMetadata({
    locale,
    path: `brands/${canonical}`,
    title,
    description,
    images: [brand.logoFile],
  });
}

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'header' });
  const brand = await fetchBrand(slug);

  if (!brand) {
    notFound();
  }

  if (brand.slug && brand.slug !== slug && /^\d+$/.test(slug)) {
    permanentRedirect(`/${locale}/brands/${brand.slug}`);
  }

  const seoTitle =
    (locale === 'fa' ? brand.seoTitleFa : brand.seoTitleEn) || null;
  const seoDescription =
    (locale === 'fa' ? brand.metaDescriptionFa : brand.metaDescriptionEn) ||
    null;

  return (
    <div className="store-page !pt-6">
      <StoreBreadcrumbs
        locale={locale}
        items={[
          { name: tNav('home'), path: '' },
          { name: tNav('brands'), path: 'brands' },
          { name: brand.name || slug },
        ]}
      />
      <SeoHighlight locale={locale} title={seoTitle} description={seoDescription} />
      <BrandTemplate brand={brand} />
    </div>
  );
}
