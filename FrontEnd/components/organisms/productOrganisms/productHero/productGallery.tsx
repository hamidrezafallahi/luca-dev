'use client';

import {
  useEffect,
  useState,
} from 'react';

import MediaImage from '@components/atoms/MediaImage';
import { IDetailedProduct } from '@models/product';
import { toMediaUrl } from '@utils/toMediaUrl';

export default function ProductGallery({ product }: { product: IDetailedProduct }) {
  const [activeImage, setActiveImage] = useState<string>(toMediaUrl(product?.mainImage));

  useEffect(() => {
    if (product?.mainImage) {
      setActiveImage(toMediaUrl(product.mainImage));
    }
  }, [product?.mainImage]);
  const defaultImage = '/images/default-product.jpg';
  const gallery = [product?.mainImage, ...(product.imageUrls ?? [])].filter(
    (img, index, list): img is string => Boolean(img) && list.indexOf(img) === index,
  );

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {/* Desktop: editorial 2-column grid of every image */}
      {gallery.length > 1 ? (
        <div className="hidden lg:grid grid-cols-2 gap-2">
          {gallery.map((img, index) => (
            <div key={`${img}-${index}`} className="relative aspect-[4/5] overflow-hidden luca-ph">
              <MediaImage
                src={img}
                fallbackSrc={defaultImage}
                alt={`${product.name} - view ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1440px) 30vw, 420px"
                quality={85}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* Phone / tablet (and single-image products): active image + thumbnails */}
      <div className={`flex flex-col gap-2 ${gallery.length > 1 ? 'lg:hidden' : ''}`}>
        <div className="relative aspect-square md:aspect-[16/11] lg:aspect-[4/5] overflow-hidden luca-ph">
          {(activeImage || product?.mainImage) && (
            <MediaImage
              src={activeImage || product.mainImage}
              fallbackSrc={defaultImage}
              alt={product.name || 'Product image'}
              fill
              priority={true}
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              className="object-cover transition-opacity duration-300"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImage;
              }}
            />
          )}
        </div>

        {/* گالری تصاویر کوچک */}
        {product.imageUrls?.length > 0 && (
          <div className="hidden-show-scrollbar flex items-center gap-2 overflow-x-auto">
            {product.imageUrls.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setActiveImage(toMediaUrl(img))}
                className={`relative flex-shrink-0 w-16 h-16 overflow-hidden border transition-colors luca-ph ${
                  toMediaUrl(img) === activeImage
                    ? 'border-ink'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1}`}
                aria-pressed={toMediaUrl(img) === activeImage}
              >
                <MediaImage
                  src={img}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  priority={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
