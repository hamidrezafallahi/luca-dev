'use client';

import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { IcPlus } from '@components/atoms/lucaIcons';

// TODO(luca): replace with the brand's real social profiles.
const SOCIAL = [
  { href: 'https://instagram.com', label: 'Instagram', labelKey: 'instagram' as const },
  { href: 'https://t.me', label: 'Telegram', labelKey: 'telegram' as const },
  { href: 'https://youtube.com', label: 'YouTube', labelKey: 'youtube' as const },
  { href: 'https://wa.me', label: 'WhatsApp', labelKey: 'whatsapp' as const },
] as const;

const COLUMNS = [
  {
    titleKey: 'support' as const,
    links: [
      { href: 'order', labelKey: 'trackOrder' as const },
      { href: 'faq', labelKey: 'faq' as const },
      { href: 'cooperation', labelKey: 'cooperation' as const },
      { href: 'sitemap', labelKey: 'sitemap' as const },
    ],
  },
  {
    titleKey: 'shop' as const,
    links: [
      { href: 'products', labelKey: 'products' as const },
      { href: 'categories', labelKey: 'categories' as const },
      { href: 'brands', labelKey: 'brands' as const },
      { href: 'discounts', labelKey: 'discounts' as const },
    ],
  },
  {
    titleKey: 'discover' as const,
    links: [
      { href: 'blog', labelKey: 'blog' as const },
      { href: 'suppliers', labelKey: 'suppliers' as const },
      { href: 'tags', labelKey: 'tags' as const },
      { href: 'exhibition', labelKey: 'exhibition' as const },
    ],
  },
  {
    titleKey: 'account' as const,
    links: [
      { href: 'register', labelKey: 'register' as const },
      { href: 'shoppingCart', labelKey: 'cart' as const },
      { href: 'order', labelKey: 'orders' as const },
      { href: 'story', labelKey: 'story' as const },
    ],
  },
] as const;

const linkClass = 'block py-[9px] text-sm luca-muted';

const Footer: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');
  const year = new Date().getFullYear();

  const social = (
    <ul className="flex flex-col">
      {SOCIAL.map((s) => (
        <li key={s.label}>
          <Link href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {t(`social.${s.labelKey}`)}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="store-footer" role="contentinfo">
      <div className="luca-container">
        {/* Desktop / tablet: link columns */}
        <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-8 pb-10 border-b border-[#dcdcd6]">
          {COLUMNS.map((col) => (
            <div key={col.titleKey} className="flex flex-col">
              <h2 className="pb-2 font-body font-semibold text-[13px]">
                {t(`columns.${col.titleKey}`)}
              </h2>
              <ul className="flex flex-col">
                {col.links.map((link) => (
                  <li key={`${col.titleKey}-${link.labelKey}`}>
                    <Link href={`/${locale}/${link.href}`} className={linkClass}>
                      {t(`links.${link.labelKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col">
            <h2 className="pb-2 font-body font-semibold text-[13px]">{t('columns.follow')}</h2>
            {social}
          </div>
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden flex flex-col">
          {COLUMNS.map((col) => (
            <details key={col.titleKey} className="group border-b border-[#dcdcd6]">
              <summary className="flex justify-between items-center h-14 font-medium text-sm list-none cursor-pointer marker:content-none [&::-webkit-details-marker]:hidden">
                <span>{t(`columns.${col.titleKey}`)}</span>
                <IcPlus size={18} className="group-open:rotate-45 transition-transform" />
              </summary>
              <ul className="flex flex-col pb-3">
                {col.links.map((link) => (
                  <li key={`${col.titleKey}-${link.labelKey}`}>
                    <Link href={`/${locale}/${link.href}`} className={linkClass}>
                      {t(`links.${link.labelKey}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <details className="group border-b border-[#dcdcd6]">
            <summary className="flex justify-between items-center h-14 font-medium text-sm list-none cursor-pointer marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{t('columns.follow')}</span>
              <IcPlus size={18} className="group-open:rotate-45 transition-transform" />
            </summary>
            <div className="pb-3">{social}</div>
          </details>
        </div>

        <div className="flex md:flex-row flex-col justify-between items-center gap-3 pt-7">
          <span className="text-[30px] luca-wordmark" aria-label={tBrand('name')}>
            LUCA
          </span>
          <p className="max-w-md text-[13px] text-center luca-muted">{t('tagline')}</p>
          <p className="text-[13px] luca-muted">
            {t('copyright', { year, brand: tBrand('name') })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
