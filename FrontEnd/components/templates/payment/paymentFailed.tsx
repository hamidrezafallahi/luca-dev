"use client";

import StoreShell from '@components/templates/storeShell';
import { useEffect } from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  Card,
  CardContent,
} from '@components/atoms/defaultElements/card';
import { Button } from '@components/atoms/defaultElements/customButton';
import {
  CreditCard,
  HelpCircle,
  RefreshCw,
  XCircle,
} from '@components/atoms/iconComponents';

interface IPaymentFailedProps {
  params?: {};
  searchParams: {
    errorCode?: string;
    errorMessage?: string;
    orderId?: string;
  };
}

export default function PaymentFailed({}: IPaymentFailedProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorMessage =
    searchParams.get("errorMessage") || t("payment.paymentFailed");
  const errorCode = searchParams.get("errorCode");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    console.error("Payment failed:", { errorCode, errorMessage, orderId });
  }, []);

  const handleRetry = () => {
    router.push(`/${locale}/checkout`);
  };

  const commonErrors: Record<string, string> = {
    insufficient_funds: t("payment.insufficient_funds"),
    card_declined: t("payment.card_declined"),
    expired_card: t("payment.expired_card"),
    network_error: t("payment.network_error"),
    timeout: t("payment.timeout"),
  };

  const getErrorTitle = () => {
    if (errorCode && commonErrors[errorCode]) {
      return commonErrors[errorCode];
    }
    return t("payment.payment_error");
  };

  return (
    <StoreShell>
      <div className="mx-auto max-w-[1000px]">
        <div className="mb-8 pt-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex justify-center items-center border-[1.5px] border-ink rounded-full w-[76px] h-[76px] text-ink [&_svg]:!text-ink">
              <XCircle config={{ className: "w-16 h-16 text-red-500" }} />
            </div>
          </div>
          <h1 className="mb-2 luca-h2">{getErrorTitle()}</h1>
          <p className="text-mute">{t("payment.payment_issue")}</p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-shrink-0 justify-center items-center border border-line w-11 h-11 [&_svg]:!text-ink">
                    <XCircle config={{ className: "w-6 h-6 text-red-500" }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-body font-semibold text-[15px]">
                      {t("payment.what_happened")}
                    </h3>
                    <p className="mb-4 text-mute">{errorMessage}</p>

                    {errorCode && (
                      <div className="bg-paper mt-4 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-mute text-sm">
                            {t("payment.error_code")}
                          </span>
                          <code className="bg-white px-2 py-1 rounded font-mono text-sm">
                            {errorCode}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <h3 className="mb-4 font-body font-semibold text-[15px]">
                  {t("payment.solutions_title")}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw />
                    <div>
                      <p className="font-medium">
                        {t("payment.retry_title")}
                      </p>
                      <p className="text-mute text-sm">
                        {t("payment.retry_desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard />
                    <div>
                      <p className="font-medium">
                        {t("payment.alternative_title")}
                      </p>
                      <p className="text-mute text-sm">
                        {t("payment.alternative_desc")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HelpCircle />
                    <div>
                      <p className="font-medium">
                        {t("payment.support_title")}
                      </p>
                      <p className="text-mute text-sm">
                        {t("payment.support_desc")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {orderId && (
              <Card className="bg-white border-line">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-body font-semibold text-[15px]">
                    {t("payment.order_title")}
                  </h3>

                  <div className="bg-paper p-4 rounded-lg">
                    <p className="text-mute text-sm">
                      {t("payment.order_number")}
                    </p>
                    <p className="font-semibold">{orderId}</p>

                    <span className="luca-badge">
                      {t("payment.failed_status")}
                    </span>

                    <p className="mt-3 text-mute text-sm">
                      {t("payment.order_notice")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="bg-white border-line">
              <CardContent className="space-y-3 p-6">
                <Button onClick={handleRetry} className="w-full h-14">
                  {t("payment.retry_button")}
                </Button>

                <Link href={`/${locale}/checkout`}>
                  <Button variant="outline" className="w-full h-14">
                    {t("payment.back_to_checkout")}
                  </Button>
                </Link>

                <Link href={`/${locale}/cart`}>
                  <Button variant="outline" className="w-full h-14">
                    {t("payment.view_cart")}
                  </Button>
                </Link>

                <Link href={`/${locale}`}>
                  <Button variant="outline" className="w-full h-14">
                    {t("payment.back_home")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
