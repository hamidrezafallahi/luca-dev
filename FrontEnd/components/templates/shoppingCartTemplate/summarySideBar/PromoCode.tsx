import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import {
  shallowEqual,
  useDispatch,
} from 'react-redux';

import { useGetConditionallyMutation } from '@services/base';
import { setPromotionCode } from '@slice/shoppingCartSlice';
import { useAppSelector } from '@store/index';
import {
  showErrorToast,
  showSuccessToast,
} from '@utils/core';

function PromoCode() {
  const t = useTranslations();
  const [promoCode, setPromoCode] = useState<string>("");
  const {promotionCode}=useAppSelector((state)=>({promotionCode:state.withPersist.ShoppingCart.promoCode}),shallowEqual)
  const [getPromoCode] = useGetConditionallyMutation();
  const dispatch = useDispatch();
  const handleSubmitPromoCode = async () => {
    if (promoCode && promoCode.trim().length > 0) {
      const res = await getPromoCode({
        url: `/DiscountCodes/getCode/${promoCode?.trim()}`,
        method: "GET",
        id:"none"
      }).unwrap();
      if (res.isSuccess == false) {
          showErrorToast(res.error);
        } else if (res.isSuccess) {
          dispatch(setPromotionCode({ promo: res.data}));
        showSuccessToast(t("shoppingCart.promoCodeSubmit"));
      }
    }
  };
  const handleRemovePromoCode =  () => {
    setPromoCode("")
 dispatch(setPromotionCode({ promo: null }));
  };
  return (
    <div>
      <label className="block mb-2 font-semibold text-[15px]">
        {t("shoppingCart.promoCode")}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t("shoppingCart.promoCodePlaceHolder")}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 min-w-0 !h-11 text-sm luca-input"
        />
        <button
          onClick={handleSubmitPromoCode}
          className="px-[18px] h-11 store-btn"
        >
          {t("general.apply")}
        </button>
        {promotionCode?.length>0 && <button
          onClick={handleRemovePromoCode}
          className="px-3 h-11 text-[13px] luca-link"
        >
          {t("general.delete")}
        </button>}
       
      </div>
    </div>
  );
}

export default PromoCode;
