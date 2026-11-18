"use client";
import React, {
  useRef,
} from 'react';

import { useTranslations } from 'next-intl';

import { IcChevronLeft, IcChevronRight } from '@components/atoms/lucaIcons';
import VariantProductCard from '@components/molecules/productCard/variantProductCard';
import { ILandingProduct } from '@models/product';

interface ProductsCarouselProps {
  /** Section title. Omit for the default, pass `null` when the parent renders its own heading. */
  title?: string | null;
  items: ILandingProduct[] | undefined;
  Loading: boolean;
}

export default function ProductsCarousel({
  items = [],
  Loading,
  title,
}: ProductsCarouselProps) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollAmount = 300;

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };
  const heading = title === undefined ? t('landing.selectedProducts') : title;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center gap-4 store-section-head">
        {heading ? <h2 className="luca-h2">{heading}</h2> : <span />}
        <div className="hidden sm:flex gap-2" dir="ltr">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label={t('common.scrollPrev')}
            className="flex justify-center items-center bg-white border hover:border-ink rounded-full w-11 h-11 transition-colors luca-line"
          >
            <IcChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label={t('common.scrollNext')}
            className="flex justify-center items-center bg-white border border-ink rounded-full w-11 h-11"
          >
            <IcChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hidden-show-scrollbar pc-rail"
      >
        {Loading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : (
          items?.map((p) => (
            <div key={p.id} className="pc-rail-item">
              <VariantProductCard product={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="pc-rail-item" aria-hidden="true">
      <div className="animate-pulse pc-card">
        <div className="pc-panel" />
        <div className="pc-body">
          <div className="bg-white/20 w-1/3 h-4" />
          <div className="bg-white/25 mt-3 w-3/4 h-7" />
          <div className="bg-white/15 mt-6 w-full h-16" />
          <div className="pc-actions">
            <div className="bg-white/40 rounded-full w-2/5 h-14" />
            <div className="flex-1 border border-white/40 rounded-full h-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
