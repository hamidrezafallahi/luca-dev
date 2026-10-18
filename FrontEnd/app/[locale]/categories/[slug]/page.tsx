import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';

import SeoHighlight from '@components/molecules/storefront/SeoHighlight';
import StoreBreadcrumbs from '@components/molecules/storefront/StoreBreadcrumbs';
import FaqSection, { parseFaqJson } from '@components/molecules/storefront/FaqSection';
import CategoryTemplate from '@components/templates/categoryTemplate';
import { serverApiBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { buildPageMetadata } from '@lib/seo';
import { pickLocalized } from '@lib/utils';
import { fetchStaticSlugParams } from '@lib/staticParams';
import { SimpleResponse } from '@models/base';
import type { ICategory } from '@models/category';

export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return fetchStaticSlugParams('Categories/getslugs', 'Categories/getids');
}

async function fetchCategory(
  slug: string,
): Promise<{ status: number; category: ICategory | null }> {
  const result = await safeFetchJson<SimpleResponse<ICategory>>(
    `${serverApiBaseUrl}/Categories/${slug}`,
    { next: { revalidate: 36 } },
  );

  if (!result.ok) return { status: result.status || 500, category: null };
  if (result.data?.isSuccess === false || !result.data?.data) {
    return { status: 404, category: null };
  }
  return { status: 200, category: result.data.data };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const tStore = await getTranslations({ locale, namespace: 'store' });
  const { status, category } = await fetchCategory(slug);

  // Metadata resolves before the response status is sent; calling notFound()
  // here (not only in the page) is what makes the response a real 404.
  if (!category && status === 404) {
    notFound();
  }

  if (!category) {
    return buildPageMetadata({
      locale,
      path: `categories/${slug}`,
      title: tStore('loadError'),
      description: '',
      noIndex: true,
    });
  }

  const canonical = category.slug || String(category.id);
  const title =
    (locale === 'fa' ? category.seoTitleFa : category.seoTitleEn) ||
    pickLocalized(locale, category.persianName, category.englishName);
  const description =
    (locale === 'fa' ? category.metaDescriptionFa : category.metaDescriptionEn) ||
    pickLocalized(locale, category.categoryPersianDesc, category.categoryEnglishDesc);

  return buildPageMetadata({
    locale,
    path: `categories/${canonical}`,
    title,
    description,
    images: [category.categoryCover],
  });
}

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'header' });
  const tFaq = await getTranslations({ locale, namespace: 'categoryFaq' });
  const { status, category } = await fetchCategory(slug);

  // Unknown slug → real HTTP 404 via app/[locale]/not-found.tsx.
  if (!category && status === 404) {
    notFound();
  }

  // API down / 5xx: error status instead of an indexable 200 page.
  if (!category) {
    throw new Error(`Category ${slug} could not be loaded (API status ${status})`);
  }

  if (category.slug && category.slug !== slug && /^\d+$/.test(slug)) {
    permanentRedirect(`/${locale}/categories/${category.slug}`);
  }

  // The parent may be inactive or deleted; only link to it when it resolves.
  const parent = category.parentCategoryId
    ? (await fetchCategory(String(category.parentCategoryId))).category
    : null;

  const title = pickLocalized(locale, category.persianName, category.englishName);
  const seoTitle =
    (locale === 'fa' ? category.seoTitleFa : category.seoTitleEn) || null;
  const seoDescription =
    (locale === 'fa' ? category.metaDescriptionFa : category.metaDescriptionEn) ||
    null;

  const faqItems = parseFaqJson(category.faqJson);
  const fallbackFaq =
    faqItems.length > 0
      ? faqItems
      : [
          {
            question: tFaq('whatQuestion', { name: title }),
            answer:
              pickLocalized(
                locale,
                category.categoryPersianDesc,
                category.categoryEnglishDesc
              ) || tFaq('whatAnswer'),
          },
          {
            question: tFaq('authenticQuestion'),
            answer: tFaq('authenticAnswer'),
          },
        ];

  return (
    <div className="store-page !pt-6">
      <StoreBreadcrumbs
        locale={locale}
        items={[
          { name: tNav('home'), path: '' },
          { name: tNav('categories'), path: 'categories' },
          { name: title },
        ]}
      />
      <SeoHighlight locale={locale} title={seoTitle} description={seoDescription} />
      <CategoryTemplate category={category} parent={parent} />
      <FaqSection locale={locale} items={fallbackFaq} />
    </div>
  );
}
