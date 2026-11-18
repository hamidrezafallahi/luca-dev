'use client';

import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  InstagramIcon,
  TelegramIcon,
  WhatsAppIcon,
} from '@components/atoms/iconComponents';

// TODO(luca): replace with the brand's real social profiles.
const SOCIAL = [
  { icon: <InstagramIcon />, href: 'https://instagram.com/lucaloupe.ir', labelKey: 'instagram' as const },
  { icon: <TelegramIcon />, href: 'https://t.me/Raha_aku', labelKey: 'telegram' as const },
  { icon: <WhatsAppIcon />, href: 'https://wa.me/989355716386', labelKey: 'whatsapp' as const },
] as const;

/**
 * Four balanced columns on every screen size (2 × 2 on mobile, 4 across on desktop):
 * three link columns of 4–5 links each, plus the brand column.
 */
const COLUMNS = [
  {
    titleKey: 'shop' as const,
    links: [
      { href: 'products', labelKey: 'products' as const },
      { href: 'categories', labelKey: 'categories' as const },
      { href: 'brands', labelKey: 'brands' as const },
      { href: 'discounts', labelKey: 'discounts' as const },
      { href: 'suppliers', labelKey: 'suppliers' as const },
    ],
  },
  {
    titleKey: 'guides' as const,
    links: [
      { href: 'blog', labelKey: 'blog' as const },
      { href: 'tags', labelKey: 'tags' as const },
      { href: 'faq', labelKey: 'faq' as const },
      { href: 'story', labelKey: 'story' as const },
    ],
  },
  {
    titleKey: 'service' as const,
    links: [
      { href: 'register', labelKey: 'register' as const },
      { href: 'shoppingCart', labelKey: 'cart' as const },
      { href: 'order', labelKey: 'trackOrder' as const },
      { href: 'cooperation', labelKey: 'cooperation' as const },
      { href: 'sitemap', labelKey: 'sitemap' as const },
    ],
  },
] as const;

const linkClass = 'inline-block py-[7px] text-sm luca-muted';

const Footer: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tBrand = useTranslations('brand');
  const year = new Date().getFullYear();

  return (
    <footer className="store-footer" role="contentinfo">
      <div className="gap-x-6 gap-y-10 lg:gap-10 grid grid-cols-2 md:grid-cols-4 pb-10 border-[#dcdcd6] border-b text-center md:text-start luca-container">
        {COLUMNS.map((col) => (
          <nav key={col.titleKey} aria-label={t(`columns.${col.titleKey}`)} className="flex flex-col">
            <h2 className="pb-3 font-body font-semibold text-[13px] store-footer-title">
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
          </nav>
        ))}

        {/* Brand column — the rectangular wordmark is the only logo used inside pages. */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href={`/${locale}`} aria-label={tBrand('homeLink')} className="inline-flex">
            <Image
              src="/logo-wordmark.png"
              alt={tBrand('name')}
              width={640}
              height={166}
              sizes="140px"
              className="w-auto h-8 md:h-9"
            />
          </Link>
          <p className="max-w-xs text-[13px] leading-relaxed luca-muted">{t('tagline')}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-1 -mx-2">
            {SOCIAL.map((s) => (
              <Link
                key={s.labelKey}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`social.${s.labelKey}`)}
                className="store-icon-btn"
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="pt-7 text-[13px] text-center md:text-start luca-muted luca-container">
        {t('copyright', { year, brand: tBrand('name') })}
      </p>
    </footer>
  );
};

export default Footer;
