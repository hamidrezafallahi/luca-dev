import React, { Suspense } from 'react';

import PaymentCheck from '@components/templates/payment/paymantCheck';
import PaymentFailed from '@components/templates/payment/paymentFailed';
import PaymentSuccess from '@components/templates/payment/paymentSuccess';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function Page({ params, searchParams }: Props) {
  await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const authority =
    firstParam(resolvedSearchParams?.Authority) ??
    firstParam(resolvedSearchParams?.authority);
  const resultStatus = firstParam(resolvedSearchParams?.status);
  const errorCode = firstParam(resolvedSearchParams?.errorCode);
  const errorMessage = firstParam(resolvedSearchParams?.errorMessage);
  const orderId = firstParam(resolvedSearchParams?.orderId);
  const amount = firstParam(resolvedSearchParams?.amount);
  const transactionId = firstParam(resolvedSearchParams?.transactionId);

  // Zarinpal callback: Authority + Status present and not our result status
  if (authority && resultStatus !== 'success' && resultStatus !== 'failed') {
    return (
      <Suspense
        fallback={
          <div className="flex justify-center items-center bg-white min-h-[70vh] text-ink">
            <div className="mx-auto border-line border-t-ink border-[3px] rounded-full w-[76px] h-[76px] animate-spin" />
          </div>
        }
      >
        <PaymentCheck />
      </Suspense>
    );
  }

  if (resultStatus === 'success') {
    return (
      <PaymentSuccess
        searchParams={{
          amount: amount || '0',
          transactionId: transactionId || '',
          orderId: orderId || '',
        }}
      />
    );
  }

  return (
    <PaymentFailed
      searchParams={{
        errorCode: errorCode || 'unknown_error',
        errorMessage: errorMessage || 'پرداخت ناموفق بود',
        orderId: orderId || '',
      }}
    />
  );
}
