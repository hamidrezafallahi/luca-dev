"use client";
import StoreShell from '@components/templates/storeShell';
import React from 'react';

import Header from './header';
import InvoiceList from './invoiceList';

export default async function CheckoutTemplate( ) {
    return (
    <StoreShell className="flex flex-col gap-6 !max-w-[924px]">
      <Header />
      <InvoiceList />
    </StoreShell>
  );
}
