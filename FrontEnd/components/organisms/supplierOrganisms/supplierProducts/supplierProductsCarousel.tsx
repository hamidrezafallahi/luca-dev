"use client"
import {
  useRef,
} from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { IcChevronLeft, IcChevronRight } from '@components/atoms/lucaIcons';
import { IDetailedProductOffer } from '@models/product';
import { useGetConditionallyMutation } from '@services/base';
import {
  addToCart,
  synchronousCart,
} from '@slice/shoppingCartSlice';
import { getCookie } from '@utils/core';
import { toMediaUrl } from '@utils/toMediaUrl';

interface ProductsCarouselProps {
  items: IDetailedProductOffer[] | undefined;
  Loading?: boolean;
}
export default function SupplierProductsCarousel({
  items = [],
}: ProductsCarouselProps) {
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
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center gap-4">
        <h2 className="luca-h2">{t('product.supplierProducts')}</h2>
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
        {items?.map((p) => (
          <div
            key={p.id}
            className="flex-shrink-0 w-[168px] md:w-[236px] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: IDetailedProductOffer }) {
  const isAuthenticated = Boolean(getCookie("candySession"));
  const locale = useLocale();
  const t = useTranslations();
  const [addToShoppingCart] = useGetConditionallyMutation();
  const dispatch = useDispatch();
  const handleAddToCart = async (product: IDetailedProductOffer) => {
    if (isAuthenticated) {
      console.log(product)
      const syncCartResponse = await addToShoppingCart({
        url: '/CartItems',
        body: {
          productId: product.id,
          productOfferId: product.id,
          quantity: 1,
        },
      }).unwrap();
      if (syncCartResponse.isSuccess) {
        dispatch(synchronousCart(syncCartResponse.data));
      }
    } else {
dispatch(addToCart({
  product: {
    id: product.id,
    productOfferId: product.id,
    name: product.productName,
    description: product.productDescription,
    price: product.basePrice,
    discountAmount: 0,
    discountIsPercent: false,
    finalPrice: product.finalPrice ?? product.basePrice,
    quantity: 1,
    mainImage: product.productImage,
  }
}));
    }
  };
  const href = `/${locale}/products/${product.productSlug || product.slug || product.productId}`;
  const hasDiscount =
    product.finalPrice != null && product.basePrice != null && product.finalPrice < product.basePrice;

  return (
    <article className="flex flex-col gap-3.5 w-full min-w-0">
      <Link href={href} className="block relative w-full aspect-[31/34] overflow-hidden luca-ph">
        <img
          src={toMediaUrl(product.productImage)}
          alt={product.productName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col items-center gap-1 text-center">
        <Link href={href} className="hover:underline underline-offset-4">
          <h3 className="font-body font-normal text-[15px] line-clamp-2 leading-relaxed">{product.productName}</h3>
        </Link>
        <div className="flex flex-wrap justify-center items-baseline gap-x-2 text-sm">
          {hasDiscount && (
            <span className="line-through luca-muted">
              {product.basePrice?.toLocaleString()}
            </span>
          )}
          <span>{(product.finalPrice ?? product.basePrice)?.toLocaleString()}</span>
          <span className="luca-muted">{t('common.currency')}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            handleAddToCart(product);
          }}
          className="text-[13px] luca-link"
        >
          {t('common.addToCart')}
        </button>
      </div>
    </article>
  );
}
