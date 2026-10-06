import React from 'react';

import { useTranslations } from 'next-intl';

import {
  FastIcon,
  ResetIcon,
  ShieldCheckIcon,
} from '@components/atoms/iconComponents';

import { IProps } from '../type';
import PaymentMethod from './PaymentMethod';
import PriceSummary from './priceSummary';
import PromoCode from './PromoCode';
import ShippingMethod from './shippingMethod';
import SubmitButton from './submitButton';

function SummarySideBar({ ...props }: IProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 bg-white p-6 border w-full text-start luca-line">
      <h2 className="luca-h3">
        {t("shoppingCart.shoppingCartSummary")}
      </h2>
      <p className="text-[13px] luca-muted">
        {t("shoppingCart.reviewYourCartDetailsAndShippingInformation")}
      </p>

      {/* Shipping Method */}
      <ShippingMethod />
      {/* Payment Method */}
      <PaymentMethod />
      {/* Promo Code */}
      <PromoCode />
      {/* Price Summary */}
      <PriceSummary />

      {/* Features */}
      <div className="flex flex-wrap justify-between gap-2 luca-muted">
        <div className="flex items-center gap-1 text-xs">
          <ResetIcon />
          <span>{t("shoppingCart.freeReturns")}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <ShieldCheckIcon />
          <span>{t("shoppingCart.securePayment")}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <FastIcon />
          <span>{t("shoppingCart.fastDelivery")}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <SubmitButton {...props} />
    </div>
  );
}

export default SummarySideBar;
