'use client';

import { useState } from 'react';

import { useDispatch } from 'react-redux';

import { useGetConditionallyMutation } from '@services/base';
import {
  addToCart,
  synchronousCart,
} from '@slice/shoppingCartSlice';
import { getCookie } from '@utils/core';

export type AddToCartItem = {
  productId: number;
  /** The product offer (= the chosen variant) that goes in the cart. */
  productOfferId: number;
  name: string;
  description?: string;
  price: number;
  finalPrice: number;
  discountAmount?: number | null;
  discountIsPercent?: boolean | null;
  mainImage?: string | null;
};

/**
 * Adds one unit of a product offer to the cart: the server cart for signed-in
 * users, the local (persisted) cart for guests. Shared by the product cards and
 * the product page so a chosen variant always reaches the cart the same way.
 */
export function useAddToCart() {
  const dispatch = useDispatch();
  const [addToShoppingCart] = useGetConditionallyMutation();
  const [pending, setPending] = useState(false);

  /** Resolves to true once the item is in the cart (used by "buy now" to go on to it). */
  const add = async (item: AddToCartItem): Promise<boolean> => {
    if (pending) return false;
    if (Boolean(getCookie('candySession'))) {
      setPending(true);
      try {
        const res = await addToShoppingCart({
          url: '/CartItems',
          body: {
            productId: item.productId,
            productOfferId: item.productOfferId,
            quantity: 1,
          },
        }).unwrap();
        if (res.isSuccess) dispatch(synchronousCart(res.data));
        return Boolean(res.isSuccess);
      } catch {
        // baseQueryByToken already showed the reason.
        return false;
      } finally {
        setPending(false);
      }
    }

    dispatch(
      addToCart({
        product: {
          id: item.productId,
          productOfferId: item.productOfferId,
          name: item.name,
          description: item.description ?? '',
          price: item.price,
          discountAmount: item.discountAmount ?? 0,
          discountIsPercent: item.discountIsPercent ?? false,
          finalPrice: item.finalPrice,
          quantity: 1,
          mainImage: item.mainImage ?? '',
        },
      }),
    );
    return true;
  };

  return { add, pending };
}
