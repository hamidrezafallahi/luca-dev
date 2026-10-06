// app/[locale]/payment/success/page.tsx
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
  CheckCircle,
  Download,
  Home,
  Package,
  Printer,
  RialIcon,
} from '@components/atoms/iconComponents';

interface IPaymentSuccessProps {
  params?: {};
  searchParams: {
    orderId?: string;
    transactionId?: string;
    amount?: string;
  };
}

export default function PaymentSuccess({ params }: IPaymentSuccessProps) {
  const locale = useLocale();
  const t = useTranslations('paymentSuccess');
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId') || 'N/A';
  const transactionId = searchParams.get('transactionId') || 'N/A';
  const amount = searchParams.get('amount') || '0';
  const date = new Date().toLocaleDateString(
    locale === 'fa' ? 'fa-IR' : 'en-US',
  );

  // در صورت نیاز، می‌توانید داده‌ها را به سرور هم ارسال کنید
  useEffect(() => {
    // ثبت لاگ یا آمار موفقیت پرداخت
    console.log('Payment successful:', { orderId, transactionId, amount });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // منطق دانلود فاکتور
    console.log('Downloading invoice...');
  };

  return (
    <StoreShell>
      <div className="mx-auto max-w-[1000px]">
        {/* هدر صفحه */}
        <div className="mb-8 pt-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex justify-center items-center bg-primary rounded-full w-[76px] h-[76px] text-white [&_svg]:!text-white">
              <CheckCircle config={{className:"w-16 h-16 text-green-500"}}  />
            </div>
          </div>
          <h1 className="mb-2 luca-h2">
            {t('title')}
          </h1>
          <p className="text-mute">
            {t('subtitle')}
          </p>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
          {/* بخش اصلی اطلاعات */}
          <div className="space-y-6 lg:col-span-2">
            {/* کارت تبریک */}
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-shrink-0 justify-center items-center border border-line w-11 h-11 [&_svg]:!text-ink">
                    <CheckCircle config={{className:"w-6 h-6 text-green-500"}} />
                  </div>
                  <div>
                    <h3 className="mb-2 font-body font-semibold text-[15px]">
                      {t('thankYou')}
                    </h3>
                    <p className="text-mute">
                      {t('thankYouDesc', { orderId })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* جزئیات سفارش */}
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <h3 className="mb-4 font-body font-semibold text-[15px]">
                  {t('orderDetails')}
                </h3>
                <div className="space-y-4">
                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <p className="text-mute text-sm">
                        {t('orderNumber')}
                      </p>
                      <p className="font-mono font-semibold">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-mute text-sm">
                        {t('orderDate')}
                      </p>
                      <p>{date}</p>
                    </div>
                    <div>
                      <p className="text-mute text-sm">
                        {t('transactionId')}
                      </p>
                      <p className="font-mono text-sm">{transactionId}</p>
                    </div>
                    <div>
                      <p className="text-mute text-sm">
                        {t('amountPaid')}
                      </p>
                      <div className="flex items-center gap-1 font-semibold">
                        {amount}
                        <RialIcon config={{className:"w-4 h-4"}} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* مراحل بعدی */}
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <h3 className="mb-4 font-body font-semibold text-[15px]">
                  {t('nextSteps')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center border border-line w-11 h-11 [&_svg]:!text-ink">
                      <Package config={{className:"w-5 h-5 text-blue-400"}}  />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('processing')}
                      </p>
                      <p className="text-mute text-sm">
                        {t('processingDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center border border-line w-11 h-11 [&_svg]:!text-ink">
                      <Package config={{className:"w-5 h-5 text-purple-400"}} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {t('trackOrder')}
                      </p>
                      <p className="text-mute text-sm">
                        {t('trackOrderDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* سایدبار اقدامات */}
          <div className="space-y-4">
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <h3 className="mb-4 font-body font-semibold text-[15px]">
                  {t('actions')}
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={handlePrint}
                    variant="outline" className="w-full h-14"
                    variant="outline"
                  >
                    <Printer config={{className:"ml-2 w-4 h-4"}}   />
                    {t('printReceipt')}
                  </Button>
                  <Button
                    onClick={handleDownloadInvoice}
                    variant="outline" className="w-full h-14"
                    variant="outline"
                  >
                    <Download config={{className:"ml-2 w-4 h-4"}} />
                    {t('downloadInvoice')}
                  </Button>
                  <Link href={`/${locale}/orders`}>
                    <Button className="w-full h-14">
                      <Package config={{className:"ml-2 w-4 h-4"}} />
                      {t('viewOrders')}
                    </Button>
                  </Link>
                  <Link href={`/${locale}`}>
                    <Button variant="outline" className="w-full h-14">
                      <Home config={{className:"ml-2 w-4 h-4"}} />
                      {t('backHome')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* پشتیبانی */}
            <Card className="bg-white border-line">
              <CardContent className="p-6">
                <h4 className="mb-2 font-semibold">
                  {t('needHelp')}
                </h4>
                <p className="mb-4 text-mute text-sm">
                  {t('needHelpDesc')}
                </p>
                <Link href={`/${locale}/contact`}>
                  <Button variant="link" className="p-0">
                    {t('contactSupport')}
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
