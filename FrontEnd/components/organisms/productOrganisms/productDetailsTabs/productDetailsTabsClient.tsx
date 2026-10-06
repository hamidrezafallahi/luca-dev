'use client';

import {
  ReactNode,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';

type TabKey = 'desc' | 'specs' | 'comments';

export default function ProductDetailsTabsClient({
  children,
}: {
  children: ReactNode[];
}) {
  const [active, setActive] = useState<TabKey>('desc');
  const t = useTranslations();
 
  return (
    <>
      {/* Tabs Header */}
      <div className="flex gap-8 mb-8 border-[#c9c9c4] border-b overflow-x-auto text-sm" role="tablist">
        <TabButton
          label={t('product.description')}
          active={active === 'desc'}
          onClick={() => setActive('desc')}
        />
        <TabButton
          label={t('product.specs')}
          active={active === 'specs'}
          onClick={() => setActive('specs')}
        />
        <TabButton
          label={t('product.userReviews')}
          active={active === 'comments'}
          onClick={() => setActive('comments')}
        />
      </div>

      {/* Content (SEO safe) */}
      <div>
        <div className={active === 'desc' ? 'block' : 'hidden'}>
          {children[0]}
        </div>
        <div className={active === 'specs' ? 'block' : 'hidden'}>
          {children[1]}
        </div>
        <div className={active === 'comments' ? 'block' : 'hidden'}>
          {children[2]}
        </div>
      </div>
    </>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      role="tab"
      className={`min-h-[44px] whitespace-nowrap transition-colors border-b -mb-px ${
        active
          ? 'border-ink font-semibold text-ink'
          : 'border-transparent text-mute hover:text-ink'
      }`}
      aria-selected={active}
    >
      {label}
    </button>
  );
}
