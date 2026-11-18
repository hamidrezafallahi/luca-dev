"use client"
import {
  useRef,
} from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { IcChevronLeft, IcChevronRight } from '@components/atoms/lucaIcons';
import { IDetailedProductOffer } from '@models/product';
import { useGetConditionallyMutation } from '@services/base';
import {
  addToCart,
  synchronousCart,
} from '@slice/shoppingCartSlice';
import { getCookie } from '@utils/core';
import { PriceLabel, ProductShowcaseCard } from '@components/molecules/productCard/cardParts';

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
      <div className="flex justify-between items-center gap-4 store-section-head">
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
        className="hidden-show-scrollbar pc-rail"
      >
        {items?.map((p) => (
          <div key={p.id} className="pc-rail-item">
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
  const router = useRouter();
  const handleAddToCart = async (product: IDetailedProductOffer) => {
    if (isAuthenticated) {
      console.log(product)
      try {
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
      } catch {
        // baseQueryByToken already showed the reason.
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

  return (
    <ProductShowcaseCard
      href={href}
      name={product.productName}
      category={product.supplierName}
      images={[product.productImage]}
      price={
        <PriceLabel
          price={product.basePrice}
          finalPrice={product.finalPrice}
          locale={locale}
          currency={t('common.currency')}
        />
      }
      buy={{
        onClick: async () => {
          await handleAddToCart(product);
          router.push(`/${locale}/shoppingCart`);
        },
        ariaLabel: `${t('common.buyNow')}: ${product.productName}`,
      }}
    />
  );
}
