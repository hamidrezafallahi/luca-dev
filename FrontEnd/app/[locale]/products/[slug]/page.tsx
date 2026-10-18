import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';

import ProductBrand from '@components/organisms/productOrganisms/productBrand';
import ProductCategory from '@components/organisms/productOrganisms/productCategory';
import { ProductDetailsTabs } from '@components/organisms/productOrganisms/productDetailsTabs';
import ProductHero from '@components/organisms/productOrganisms/productHero';
import { ProductSupplierExtended } from '@components/organisms/productOrganisms/productSuppliers';
import ProductTags from '@components/organisms/productOrganisms/productTags';
import JsonLd from '@components/molecules/storefront/JsonLd';
import RelatedSeoLinks from '@components/molecules/storefront/RelatedSeoLinks';
import SeoHighlight from '@components/molecules/storefront/SeoHighlight';
import StoreBreadcrumbs from '@components/molecules/storefront/StoreBreadcrumbs';
import { serverApiBaseUrl, siteBaseUrl } from '@lib/api';
import { safeFetchJson } from '@lib/safeFetch';
import { absoluteUrl, buildPageMetadata } from '@lib/seo';
import { pickLocalized } from '@lib/utils';
import { fetchStaticSlugParams } from '@lib/staticParams';
import { SimpleResponse } from '@models/base';
import { IDetailedProduct } from '@models/product';
import { toMediaUrl } from '@utils/toMediaUrl';

export const dynamicParams = true;

export async function generateStaticParams() {
  return fetchStaticSlugParams('Products/getslugs', 'Products/getids');
}

function toAbsoluteImage(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const mediaPath = toMediaUrl(url);
  return mediaPath ? `${siteBaseUrl}${mediaPath}` : undefined;
}

async function fetchProduct(
  slug: string,
): Promise<{ status: number; product: IDetailedProduct | null }> {
  const result = await safeFetchJson<
    SimpleResponse<IDetailedProduct> | IDetailedProduct
  >(`${serverApiBaseUrl}/Products/${slug}`, {
    next: { revalidate: 36 },
  });

  if (!result.ok) {
    return { status: result.status || 500, product: null };
  }

  const envelope = result.data as SimpleResponse<IDetailedProduct>;
  if (envelope && typeof envelope === 'object' && 'data' in envelope) {
    if (envelope.isSuccess === false) {
      return { status: 404, product: null };
    }
    return { status: 200, product: envelope.data || null };
  }

  return { status: 200, product: (result.data as IDetailedProduct) || null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale?: string }>;
}): Promise<Metadata> {
  const { slug, locale = 'fa' } = await params;
  const tStore = await getTranslations({ locale, namespace: 'store' });
  const { status, product } = await fetchProduct(slug);

  // Metadata resolves before the response status is sent; calling notFound()
  // here (not only in the page) is what makes the response a real 404.
  if (!product && (status === 404 || status === 200)) {
    notFound();
  }

  if (!product || status >= 400) {
    return buildPageMetadata({
      locale,
      path: `products/${slug}`,
      title: tStore('productFallbackTitle'),
      description: '',
      noIndex: true,
    });
  }

  const canonicalSlug = product.slug || slug;
  const seoTitle =
    (locale === 'fa' ? product.seoTitleFa : product.seoTitleEn) ||
    product.name ||
    tStore('productFallbackTitle');
  const description =
    (locale === 'fa' ? product.metaDescriptionFa : product.metaDescriptionEn) ||
    product.description ||
    '';
  const image = product.imageUrls?.[0] || product.mainImage;

  return buildPageMetadata({
    locale,
    path: `products/${canonicalSlug}`,
    title: seoTitle,
    description,
    images: [image],
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'header' });
  const tStore = await getTranslations({ locale, namespace: 'store' });
  const { status, product } = await fetchProduct(slug);

  // Unknown slug → real HTTP 404 via app/[locale]/not-found.tsx.
  if (!product && (status === 404 || status === 200)) {
    notFound();
  }

  // API down / 5xx: throw so the response is an error status (and ISR keeps
  // the last good page) instead of a 200 "load error" page Google could index.
  if (!product) {
    throw new Error(`Product ${slug} could not be loaded (API status ${status})`);
  }

  // Legacy numeric URLs → permanent SEO slug (must not be inside a broad try/catch).
  if (product.slug && product.slug !== slug && /^\d+$/.test(slug)) {
    permanentRedirect(`/${locale}/products/${product.slug}`);
  }

  const canonicalSlug = product?.slug || slug;
  const seoTitle =
    (locale === 'fa' ? product.seoTitleFa : product.seoTitleEn) || null;
  const seoDescription =
    (locale === 'fa' ? product.metaDescriptionFa : product.metaDescriptionEn) ||
    null;
  const categoryKey = product.categorySlug || product.categoryId;
  const categoryName = pickLocalized(
    locale,
    product.categoryName,
    product.categoryEnglishName
  );
  const images = (product.imageUrls?.length
    ? product.imageUrls
    : [product.mainImage]
  )
    .map((img: string) => toAbsoluteImage(img))
    .filter(Boolean) as string[];
  const productUrl = absoluteUrl(locale, `products/${canonicalSlug}`);
  const price = product.finalPrice ?? product.price;
  const availability = product.inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.length ? images : undefined,
    url: productUrl,
    sku: String(product.id),
    category: categoryName || undefined,
    brand: product.brandName
      ? { '@type': 'Brand', name: product.brandName }
      : undefined,
  };

  if (price != null && Number(price) >= 0) {
    productLd.offers = {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: product.currency || 'IRR',
      price: Number(price),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
    };
  }

  if ((product.rateCount ?? 0) > 0 && (product.averageRate ?? 0) > 0) {
    productLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.averageRate,
      reviewCount: product.rateCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const homeLabel = tNav('home');
  const productsLabel = tNav('products');

  return (
    <article className="store-page !pt-6">
      <JsonLd data={productLd} />
      <StoreBreadcrumbs
        locale={locale}
        items={[
          { name: homeLabel, path: '' },
          { name: productsLabel, path: 'products' },
          ...(categoryName
            ? [
                {
                  name: categoryName,
                  path: `categories/${categoryKey}`,
                },
              ]
            : []),
          { name: product.name || productsLabel },
        ]}
      />
      <SeoHighlight locale={locale} title={seoTitle} description={seoDescription} />
      <ProductHero product={product} />
      <ProductSupplierExtended productId={product.id} />
      <ProductDetailsTabs product={product} />
      <ProductTags id={product.id} />
      <ProductCategory id={product.categoryId} />
      <ProductBrand id={product.brandId} />
      <RelatedSeoLinks
        locale={locale}
        links={[
          {
            href: `/${locale}/products`,
            label: tStore('allProducts'),
          },
          ...(categoryName
            ? [
                {
                  href: `/${locale}/categories/${product.categorySlug || product.categoryId}`,
                  label: categoryName,
                },
              ]
            : []),
          ...(product.brandName
            ? [
                {
                  href: `/${locale}/brands/${product.brandSlug || product.brandId}`,
                  label: product.brandName as string,
                },
              ]
            : []),
          {
            href: `/${locale}/blog`,
            label: tStore('blogGuides'),
          },
        ]}
      />
    </article>
  );
}
