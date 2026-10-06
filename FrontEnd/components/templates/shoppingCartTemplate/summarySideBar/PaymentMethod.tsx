import React, { useEffect } from 'react';

import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';

import { RadioList } from '@components/atoms/defaultElements/customRadio';
import { DataResponse } from '@models/base';
import { IPaymentMethod } from '@models/paymentMethod';
import { useGetData } from '@services/base';
import { setPaymentMethod } from '@slice/shoppingCartSlice';
import { useAppSelector } from '@store/index';

export default function PaymentMethod() {
     const selectedPaymentMethod = useAppSelector(
      (state) => state.withPersist.ShoppingCart.paymentMethod?.id
    );
    const t = useTranslations()
  const dispatch = useDispatch();
  const { data } = useGetData<DataResponse<IPaymentMethod>>({
    url: '/paymentMethods',
    method: 'GET',
  });
const handleChangePaymentMethod = (e:string|number)=>{
const selectedMethod = data?.data.records.find((method) => method.id === e);
if (selectedMethod) {
  dispatch(setPaymentMethod(selectedMethod));
}
}
useEffect(()=>{
  if(data?.isSuccess){
     const defaultMethod = data.data.records.find(
      (method) => method.displayOrder == 1
    );
    if (defaultMethod) {
      dispatch(setPaymentMethod(defaultMethod));
    }
  }
},[data])
  return (
    <div>
      <h3 className="mb-2 font-body font-semibold text-[15px]">{t("general.paymentMethod")}</h3>
      <div className="px-4 py-3 border luca-line">
          <RadioList
          name='paymentMethods'
          className='!flex-row flex-wrap justify-between gap-3 text-sm'
            options={data?.data.records?.map((method) => ({label:method.title,value:method.id}))||[]}
             onChange={handleChangePaymentMethod}
             value={selectedPaymentMethod}
            // checked={selectedPaymentMethod === method.id}
            // onChange={() => dispatch(setPaymentMethodId({ paymentMethodId: method.id }))}
          />
      </div>
    </div>
  );
}
