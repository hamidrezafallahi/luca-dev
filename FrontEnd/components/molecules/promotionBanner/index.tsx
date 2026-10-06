"use client";

import { useTranslations } from 'next-intl';

function PromotionBanner() {
  const t = useTranslations('promotion');
  const hasBanner = false;

  if (!hasBanner) return null;

  return (
    <div className="flex justify-center items-center bg-primary px-5 w-full min-h-[44px] text-[13px] text-white text-center">
      {t('yaldaBanner')}
    </div>
  );
}
export default PromotionBanner;
