"use client";
import React, {
  useRef,
} from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { Rate } from '@components/atoms/defaultElements/customRate';
import { IcChevronLeft, IcChevronRight } from '@components/atoms/lucaIcons';
import MediaImage from '@components/atoms/MediaImage';
import { ILandingProduct } from '@models/product';
import { useGetConditionallyMutation } from '@services/base';
import {
  addToCart,
  synchronousCart,
} from '@slice/shoppingCartSlice';
import { getCookie } from '@utils/core';

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
      <div className="flex justify-between items-center gap-4">
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
        className="hidden-show-scrollbar flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth"
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
            <div
              key={p.id}
              className="flex-shrink-0 w-[168px] md:w-[236px] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ILandingProduct }) {
  const t = useTranslations();
  const isAuthenticated = Boolean(getCookie("candySession"));
  const locale = useLocale();
  const [addToShoppingCart] = useGetConditionallyMutation();
  const dispatch = useDispatch();
  const handleAddToCart = async (product: ILandingProduct) => {
    if (isAuthenticated) {
      const syncCartResponse = await addToShoppingCart({
        url: '/CartItems',
        body: {
          productId: product.id,
          productOfferId: product.bestOfferId,
          quantity: 1,
        },
      }).unwrap();
      if (syncCartResponse.isSuccess) {
         dispatch(synchronousCart(syncCartResponse.data));
      }
    } else {
      dispatch(
        addToCart({
          product: {
            id: product.id,
            productOfferId: product.bestOfferId,
            name: product.name,
            description: product.description,
            price: product.price,
            discountAmount: product.discountAmount,
            discountIsPercent: product.discountIsPercent,
            finalPrice: product.finalPrice,
            quantity: 1,
            mainImage: product.mainImage,
          },
        }),
      );
    }
  };
 
  const href = `/${locale}/products/${product.slug || product.id}`;

  return (
    <article className="flex flex-col gap-3.5 w-full min-w-0">
      <Link href={href} className="block relative w-full aspect-[31/34] overflow-hidden luca-ph">
        <MediaImage
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 168px, (max-width: 1024px) 236px, 310px"
          loading="lazy"
        />
        {product.discountAmount > 0 && (
          <span className="top-3 absolute start-3 luca-badge luca-badge-accent">
            -{product.discountAmount}
            {product.discountIsPercent && "%"}
          </span>
        )}
      </Link>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs luca-muted">{product.brand}</span>
        <Link href={href} className="hover:underline underline-offset-4">
          <h3 className="font-body font-normal text-[15px] line-clamp-2 leading-relaxed">{product.name}</h3>
        </Link>
        <div className="flex justify-center items-center">
          <Rate value={product.averageRate} />
        </div>
        <div className="flex flex-wrap justify-center items-baseline gap-x-2 text-sm">
          {product.discountAmount > 0 && (
            <span className="line-through luca-muted">
              {product.price?.toLocaleString()}
            </span>
          )}
          <span>{product.finalPrice?.toLocaleString()}</span>
          <span className="luca-muted">{t('common.currency')}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            handleAddToCart(product);
          }}
          aria-label={t('common.addToCartAria', { name: product.name })}
          className="text-[13px] luca-link"
        >
          {t('common.addToCart')}
        </button>
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div
      className="flex flex-col flex-shrink-0 gap-3.5 w-[168px] md:w-[236px] lg:w-[calc((100%-4.5rem)/4)] animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full aspect-[31/34] luca-ph" />
      <div className="flex flex-col items-center gap-2">
        <div className="w-3/4 h-4 luca-ph" />
        <div className="w-1/2 h-3 luca-ph" />
      </div>
    </div>
  );
}
