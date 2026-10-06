import React from 'react';

import { shallowEqual } from 'react-redux';

import {
  MinusIcon,
  PlusIcon2,
  RialIcon,
} from '@components/atoms/iconComponents';
import MediaImage from '@components/atoms/MediaImage';
import { useAppSelector } from '@store/index';

import DecreaseButton
  from '../../../molecules/shoppingCartButtons/decreaseButton';
import IncreaseButton
  from '../../../molecules/shoppingCartButtons/increaseButton';
import RemoveButton from '../../../molecules/shoppingCartButtons/removeButton';
import Header from './header';

interface IProps {
  locale: string;
}
function ShoppingCartComponent({ ...props }: IProps) {
  const { locale } = props;
  const { ShoppingCart } = useAppSelector(
    (state) => ({
      ShoppingCart: state.withPersist.ShoppingCart,
    }),
    shallowEqual,
  );

  return (
    <>
      <Header locale={locale} />
      <div className="flex flex-col border-b luca-line">
        {ShoppingCart.products.map((item, index) => {
          return (
            <div key={index} className="flex gap-4 py-5 border-t luca-line">
              <div className="flex-shrink-0 w-24 md:w-[120px] h-24 md:h-[120px] overflow-hidden luca-ph">
                <MediaImage
                  src={item.mainImage}
                  fallbackSrc="/images/default-product.jpg"
                  alt={item.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 gap-1.5 min-w-0 text-start">
                <h3 className="font-body font-normal text-base">{item.name}</h3>
                <p className="text-[13px] line-clamp-2 luca-muted">{item.description}</p>

                <div className="flex items-center gap-2 font-medium text-[15px]">
                  {item.finalPrice * item.quantity}
                  <RialIcon />
                  {item.discountAmount > 0 && (
                    <span className="flex items-center gap-1.5 font-normal text-[13px] line-through luca-muted">
                      {item.price * item.quantity}
                      <RialIcon config={{ size: 16 }} />
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center gap-3 pt-1.5">
                  <div className="inline-flex items-center border luca-line">
                    <IncreaseButton
                      id={item.id}
                      productOfferId={item.productOfferId}
                      content={<PlusIcon2 />}
                      className="flex justify-center items-center w-11 h-11"
                    />
                    <span className="min-w-[36px] text-sm text-center">{item.quantity}</span>
                    <DecreaseButton
                      id={item.id}
                      productOfferId={item.productOfferId}
                      content={<MinusIcon />}
                      className="flex justify-center items-center w-11 h-11"
                    />
                  </div>
                  <RemoveButton
                    id={item.id}
                    productOfferId={item.productOfferId}
                    cartItemId={item.cartItemId}
                    className="flex flex-shrink-0 justify-center items-center w-11 h-11 hover:text-ink luca-muted"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ShoppingCartComponent;
