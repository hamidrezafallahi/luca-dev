'use client';

import React, { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { ILandingProduct } from '@models/product';

import ProductsCarousel from '../productsCarousel';

type TabKey = 'BestSeller' | 'TheNewest' | 'Discounters';

type Props = {
  bestSeller: ILandingProduct[];
  theNewest: ILandingProduct[];
  discounters: ILandingProduct[];
};

export default function TheMostProductsClient({
  bestSeller,
  theNewest,
  discounters,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('BestSeller');
  const locale = useLocale();
  const t = useTranslations();

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'BestSeller', label: t('landing.bestSellers') },
    { key: 'TheNewest', label: t('landing.newest') },
    { key: 'Discounters', label: t('landing.discounters') },
  ];

  const items = useMemo(() => {
    switch (activeTab) {
      case 'TheNewest':
        return theNewest;
      case 'Discounters':
        return discounters;
      case 'BestSeller':
      default:
        return bestSeller;
    }
  }, [activeTab, bestSeller, theNewest, discounters]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-3">
          <h2 className="luca-h2">{t('landing.selectedProducts')}</h2>
          <div className="flex flex-wrap items-center gap-x-6" role="group">
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        </div>
        <Link href={`/${locale}/products`} className="luca-link">
          {t('common.viewAllProducts')}
        </Link>
      </div>

      <ProductsCarousel items={items} Loading={false} title={null} />
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] text-sm transition-colors border-b ${
        active
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-mute hover:text-ink'
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
