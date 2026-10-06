'use client';

import { useTranslations } from 'next-intl';

interface RedirectToPaymentProps {
  paymentMethodTitle?: string;
}

export default function RedirectToPayment({
  paymentMethodTitle,
}: RedirectToPaymentProps) {
  const t = useTranslations();

  return (
    <div className="flex justify-center items-center bg-white py-10 text-ink">
      <div className="text-center">
        <div className="mx-auto mb-4 border-line border-t-ink border-[3px] rounded-full w-[76px] h-[76px] animate-spin"></div>
        <p className="luca-h3">{t('payment.redirect')}</p>
        <p className="mt-2 text-mute text-sm">{t('payment.waiting')}</p>
        {paymentMethodTitle ? (
          <p className="mt-2 text-mute text-sm">{paymentMethodTitle}</p>
        ) : null}
      </div>
    </div>
  );
}
