import React, {
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import {
  shallowEqual,
  useDispatch,
} from 'react-redux';

import { isPlaceholder } from '@lib/placeholder';
import { IShippingMethod } from '@models/shippingMethod';
import { useGetData } from '@services/base';
import { setShippingMethod } from '@slice/shoppingCartSlice';
import { useAppSelector } from '@store/index';

import ItemCart from './itemCart';

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
 
}
function ShoppingCartHeaderComponent({ ...props }: IProps) {
  const { setIsOpen } = props;
  const locale = useLocale()
  const t = useTranslations();
  const dispatch = useDispatch();

  const { ShoppingCart } = useAppSelector(
    (state) => ({
      ShoppingCart: state.withPersist.ShoppingCart,
    }),
    shallowEqual
  );
  const { data, isSuccess } = useGetData<any, IShippingMethod[]>({
    url: "/ShippingMethods",
    skip: ShoppingCart.products.length == 0,
  });
  useEffect(() => {
    if (data?.isSuccess) {
      const records = data.data?.records ?? [];
      if (records.length === 0) return;
      const method =
        records.find((m: IShippingMethod) => m.isDefault) ?? records[0];
      dispatch(setShippingMethod(method));
    }
  }, [data, dispatch]);
  const kol =
    (ShoppingCart?.finalTotal ?? 0) +
    (ShoppingCart?.shippingMethod?.price ?? 0);

    const totalDiscount =  new Intl.NumberFormat("fa-IR", {
  style: "currency",
  currency: "IRR",
  maximumFractionDigits: 0,
}).format(ShoppingCart?.totalDiscount);
    const formattedKol =  new Intl.NumberFormat("fa-IR", {
  style: "currency",
  currency: "IRR",
  maximumFractionDigits: 0,
}).format(kol);
    const shippingMethod =  new Intl.NumberFormat("fa-IR", {
  style: "currency",
  currency: "IRR",
  maximumFractionDigits: 0,
}).format(ShoppingCart?.shippingMethod?.price??0);

  return (
    <div
      className="top-full max-md:right-auto max-md:left-0 z-50 absolute mt-0 end-0"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="bg-store-surface p-5 border w-[min(340px,92vw)] text-ink text-start luca-line">
        <div className="flex justify-between items-center gap-3 mb-1">
          <h2 className="luca-h3">
            {t("shoppingCart.header.yourCart")}
          </h2>
          <span className="luca-badge luca-badge-mute">
            {ShoppingCart?.products.length} {t("shoppingCart.header.items")}
          </span>
        </div>

        <p className="mb-3 text-[13px] luca-muted">
          {t("shoppingCart.header.reviewBeforeCheckout")}
        </p>

        <div
          className="hidden-show-scrollbar flex flex-col mb-4 max-h-[calc(100dvh-460px)] overflow-y-auto"
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          {ShoppingCart?.products.map((item, index) => (
            <ItemCart key={index} item={item} />
          ))}
        </div>

        <div className="flex flex-col mb-4 pt-3 border-t luca-line">
          <div className="luca-row">
            <span>{t("shoppingCart.header.totalDiscount")}</span>
            <span className="flex items-center gap-2">
              {totalDiscount}
              {/* <RialIcon config={{ size: 20 }} /> */}
            </span>
          </div>
          <div className="luca-row">
            <span>{t("shoppingCart.header.shipping")}</span>
            {ShoppingCart.products.length !== 0 && (
              <span className="flex items-center gap-2">
                {shippingMethod || 0}
                {/* <RialIcon config={{ size: 20 }} /> */}
              </span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t luca-line luca-row luca-row-strong">
            <span>{t("shoppingCart.header.total")}</span>
            <span className="flex items-center gap-2">
              {ShoppingCart?.products?.length > 0 ? formattedKol : 0}
              {/* <RialIcon /> */}
            </span>
          </div>
        </div>

        {!isPlaceholder(t("shoppingCart.header.freeShippingOver")) && (
          <p className="mb-3 text-xs text-center luca-muted">
            {t("shoppingCart.header.freeShippingOver")}
          </p>
        )}

        <div className="flex flex-col items-center gap-1">
          <Link
            className="w-full store-btn store-btn-primary"
            href={`/${locale}/shoppingCart`}
            onClick={() => setIsOpen(false)}
          >
            {t("shoppingCart.header.checkout")}
          </Link>
          <Link
            className="luca-link"
            href={`/${locale}/shoppingCart`}
            onClick={() => setIsOpen(false)}
          >
            {t("shoppingCart.header.viewCart")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartHeaderComponent;
