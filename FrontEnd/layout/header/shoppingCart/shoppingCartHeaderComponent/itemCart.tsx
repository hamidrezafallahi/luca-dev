import React from 'react';

import { RialIcon } from '@components/atoms/iconComponents';
import DecreaseButton
  from '@components/molecules/shoppingCartButtons/decreaseButton';
import IncreaseButton
  from '@components/molecules/shoppingCartButtons/increaseButton';
import RemoveButton
  from '@components/molecules/shoppingCartButtons/removeButton';
import { ICartProduct } from '@models/product';
import { toMediaUrl } from '@utils/toMediaUrl';

function ItemCart({ ...props }: { item: ICartProduct }) {
  const { item } = props;
  return (
    <div className="flex gap-3 py-3 border-t luca-line">
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden luca-ph">
        <img
          src={toMediaUrl(item.mainImage)}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-body font-normal text-sm truncate leading-relaxed">
            {item.name}
          </h3>
          <RemoveButton
            id={item.id}
            cartItemId={item.cartItemId}
            productOfferId={item.productOfferId}
            className="flex-shrink-0 hover:text-ink luca-muted"
          />
        </div>

        <p className="mb-1.5 text-xs truncate luca-muted">{item.description}</p>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center border luca-line">
            <IncreaseButton
              id={item.id}
              productOfferId={item.productOfferId}
              className="flex justify-center items-center w-8 h-8 text-sm"
            />
            <span className="w-6 text-sm text-center">{item.quantity}</span>
            <DecreaseButton
              id={item.id}
              productOfferId={item.productOfferId}
              className="flex justify-center items-center w-8 h-8 text-sm"
            />
          </div>

          <div className="text-end">
            <div className="flex items-center gap-1.5 font-medium text-sm">
              {item.finalPrice * item.quantity}
              <RialIcon config={{ size: 18 }} />
            </div>
            {item.discountAmount > 0 && (
              <div className="flex items-center gap-1.5 text-xs line-through luca-muted">
                {item.price * item.quantity}
                <RialIcon config={{ size: 16 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCart;
