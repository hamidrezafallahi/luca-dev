"use client";
import React, {
  Suspense,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';
import { shallowEqual } from 'react-redux';

import { SpinnerIcon } from '@components/atoms/iconComponents';
import { IcBag } from '@components/atoms/lucaIcons';
import { useAppSelector } from '@store/index';

const ShoppingCartHeaderComponent = React.lazy(
  () => import("./shoppingCartHeaderComponent")
);

function ShoppingCart() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const { ShoppingCart } = useAppSelector(
    (state) => ({
      ShoppingCart: state.withPersist.ShoppingCart,
    }),
    shallowEqual
  );

  return (
    <>
      <div className="relative">
        <button
          type="button"
          aria-label={t("header.shopping cart")}
          aria-expanded={isOpen}
          className="relative store-icon-btn !w-10"
          onMouseEnter={() => setIsOpen(true)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <IcBag />
          {ShoppingCart?.products.length > 0 && (
            <span className="store-cart-badge">
              {ShoppingCart?.products.length}
            </span>
          )}
        </button>

        {isOpen && (
          <Suspense
            fallback={
              <div className="top-2 absolute start-2">
                <SpinnerIcon />
              </div>
            }
          >
            <ShoppingCartHeaderComponent
              setIsOpen={setIsOpen}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}

export default ShoppingCart;
