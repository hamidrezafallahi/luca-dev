import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import MediaImage from '@components/atoms/MediaImage';
import { getFeaturedProduct } from '@lib/featuredProducts';

import { CardArrow, ImmersiveFeatureCard, ProductCardVariant } from './cardParts';
import { ISimpleProduct } from './type';

const IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 320px';

/**
 * Listing product card (LUCA Card System v02).
 * Editorial by default; a product listed in lib/featuredProducts.ts, or an
 * explicit `variant="immersive"`, renders the immersive feature card instead.
 */
export async function SimpleProductCard({
  product,
  variant,
}: {
  product: ISimpleProduct;
  variant?: ProductCardVariant;
}) {
  const locale = await getLocale();
  const t = await getTranslations('common');
  const href = `/${locale}/products/${product.slug || product.id}`;

  const featured = getFeaturedProduct(product);
  const resolvedVariant = variant ?? (featured ? 'immersive' : 'editorial');

  // Listing endpoints send the category or brand name with each product.
  const meta = product.categoryName || product.brandName || null;

  if (resolvedVariant === 'immersive') {
    return (
      <ImmersiveFeatureCard
        href={href}
        name={product.name}
        description={product.description}
        image={featured?.image || product.mainImage}
        imagePosition={featured?.imagePosition}
        tint={featured?.tint}
        label={t('featured')}
        ctaLabel={t('viewProduct')}
        imageSizes={IMAGE_SIZES}
      />
    );
  }

  return (
    <article className="luca-card">
      {/* The title and the CTA already link to the product for keyboard and screen-reader users. */}
      <Link href={href} className="luca-card-media" tabIndex={-1} aria-hidden="true">
        {product.mainImage && (
          <MediaImage
            src={product.mainImage}
            alt={product.name}
            fill
            className="luca-card-img"
            sizes={IMAGE_SIZES}
          />
        )}
      </Link>
      <div className="luca-card-body">
        <h3 className="luca-card-title">
          <Link href={href}>{product.name}</Link>
        </h3>
        {product.description && <p className="luca-card-desc">{product.description}</p>}
        {/* Details at the start, compact pill action at the end (reference card A). */}
        <div className="luca-card-foot luca-card-actions">
          {product.suppliers && product.suppliers.length > 0 ? (
            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {product.suppliers.map((s, idx) => (
                <Link
                  className="hover:z-20 relative bg-white border rounded-full w-9 h-9 overflow-hidden luca-line"
                  key={idx}
                  href={`/${locale}/suppliers/${s.id}`}
                  aria-label={s.fullName}
                >
                  <MediaImage
                    alt={s.fullName}
                    src={s.image}
                    fill
                    sizes="36px"
                    loading="lazy"
                    className="rounded-full object-cover"
                  />
                </Link>
              ))}
            </div>
          ) : (
            meta && (
              <span className="luca-card-meta" title={meta}>
                {meta}
              </span>
            )
          )}
          <Link href={href} className="luca-card-action" aria-label={`${t('viewProduct')}: ${product.name}`}>
            {t('view')}
            <CardArrow />
          </Link>
        </div>
      </div>
    </article>
  );
}
