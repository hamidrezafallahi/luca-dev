import React from 'react';

import { useTranslations } from 'next-intl';

import BackToLandingPageButton
  from '@components/molecules/backToLandingPageButton';

export default function Header() {
      const t = useTranslations()
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
        <BackToLandingPageButton />
        <div className="flex flex-col">
          <span className="text-[13px] whitespace-nowrap luca-muted">
            {t("checkout.landing page")}
          </span>
        </div>
          <h1 className="order-first luca-h2">
            {t("checkout.title")} 
          </h1>
      </div>
  )
}
