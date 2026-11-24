import React from 'react';

import { useTranslations } from 'next-intl';
import { shallowEqual } from 'react-redux';

import {
  MinusIcon,
  PlusIcon2,
} from '@components/atoms/iconComponents';
import { useAppSelector } from '@store/index';

function PriceSummary() {
    const t = useTranslations();
      const { ShoppingCart } = useAppSelector(
        (state) => ({
          ShoppingCart: state.withPersist.ShoppingCart,
        }),
        shallowEqual
      );


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
    const discountCodeAmount =  new Intl.NumberFormat("fa-IR", {
  style: "currency",
  currency: "IRR",
  maximumFractionDigits: 0,
}).format(ShoppingCart.discountCodeAmount);
    const totalPrice =  new Intl.NumberFormat("fa-IR", {
  style: "currency",
  currency: "IRR",
  maximumFractionDigits: 0,
}).format(ShoppingCart.totalPrice);











  return (
         <div className="space-y-2 py-2 border-line border-b">
        <div className="flex justify-between text-sm">
          <span className="text-mute">{t("shoppingCart.subTotal")}</span>
          <span className="flex gap-2 font-medium">
            <span className='relative end-4'>{totalPrice}</span>
            {/* <RialIcon /> */}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-mute">{t("shoppingCart.totalDiscount")}</span>
          <span className="flex items-center gap-2 font-medium">
            {totalDiscount}<MinusIcon config={{className:"stroke-rose-800"}}/>
            {/* <RialIcon /> */}
          </span>
        </div>
        {ShoppingCart.discountCodeAmount > 0 && <div className="flex justify-between text-sm">
          <span className="text-mute">{t("shoppingCart.discountCodeAmount")} </span>
          <span className="flex items-center gap-2 font-medium">
            {discountCodeAmount}
            <MinusIcon config={{className:"stroke-rose-800"}}/>
            {/* <RialIcon /> */}
          </span>
        </div>}
        <div className="flex justify-between text-sm">
          <span className="text-mute">{t("shoppingCart.shipping")}</span>
          <span className="flex items-center gap-2 font-medium">
            {ShoppingCart?.products?.length > 0
              ? shippingMethod
              : 0}
            <PlusIcon2 />
            {/* <RialIcon /> */}
          </span>
        </div>
        <div className="flex justify-between pt-3 font-semibold text-[17px]">
          <span>{t("shoppingCart.total")}</span>
          <span className="flex gap-2">
            <span className='relative end-4'> {ShoppingCart?.products?.length>0?formattedKol:0}</span>
            {/* <RialIcon /> */}
          </span>
        </div>
      </div>
  )
}

export default PriceSummary