"use client";

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { getCookie } from '@utils/core';

import ClientAddress from './clientAddress';
import ShoppingCartComponent from './shoppingCartComponent';
import SummarySideBar from './summarySideBar';
import { IProps } from './type';

export default function ShoppingCartTemplate({ ...props }: IProps) {
  const { locale } = props;
  const route=useRouter()
  const isAuthenticated = Boolean(getCookie("candySession"));

  useEffect(() => {
    if (!isAuthenticated) {
      route.push(`/${locale}/register`);
    }
  }, [isAuthenticated]);
    if (!isAuthenticated) {
    return null; 
  }
  return (
    <>
      <main className="pt-4 pb-16 md:pb-24 text-ink luca-container">
        <div className="items-start gap-8 lg:gap-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Cart lines and delivery address */}
          <div className="flex flex-col gap-8 min-w-0">
            <ShoppingCartComponent locale={locale} />
            <ClientAddress />
          </div>

          {/* Order summary */}
          <SummarySideBar locale={locale} />
        </div>
      </main>
    </>
  );
}
