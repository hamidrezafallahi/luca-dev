"use client"
import { useState } from 'react';

import StoreShell from '@components/templates/storeShell';

import OrderDetails from './orderDetails';
import OrderList from './orderList';

export default function OrderTemplate() {

  const [selectedOrderId,setSelectedOrderId]=useState<null|number>(null)
  return (
    <StoreShell className="flex flex-col gap-7">
      <div className="items-start gap-7 lg:gap-10 grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
        {/* Orders list */}
        <OrderList setSelectedOrderId={setSelectedOrderId} selectedOrderId={selectedOrderId} />
        {/* Order details */}
        <div className="p-6 border luca-line">
          <OrderDetails selectedOrderId={selectedOrderId} />
        </div>
      </div>
    </StoreShell>
  );
}
