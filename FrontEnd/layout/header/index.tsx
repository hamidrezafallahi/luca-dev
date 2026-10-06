'use client';

import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { IcPin, IcSearch, IcUser } from '@components/atoms/lucaIcons';
import LangSwitcher from '@components/molecules/lang';

import MobileMenu from './mobileMenu';
import ShoppingCart from './shoppingCart';

const NAV_KEYS = [
  { href: 'products', labelKey: 'products' as const },
  { href: 'categories', labelKey: 'categories' as const },
  { href: 'brands', labelKey: 'brands' as const },
  { href: 'discounts', labelKey: 'discounts' as const },
  { href: 'blog', labelKey: 'blogs' as const },
  { href: 'exhibition', labelKey: 'exhibition' as const },
  { href: 'story', labelKey: 'story' as const },
] as const;

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('header');
  const tBrand = useTranslations('brand');

  return (
    <header className="store-nav" role="banner">
      {/* Announcement bar */}
      <div
        className="flex justify-center items-center gap-2.5 px-5 min-h-[44px] md:min-h-[40px] text-[13px] text-white text-center"
        style={{ background: 'var(--primary-color)' }}
      >
        <span>{t('announcement')}</span>
        <Link href={`/${locale}/cooperation`} className="text-white underline underline-offset-4">
          {t('announcementCta')}
        </Link>
      </div>

      {/* Main row: utilities · wordmark · actions */}
      <div className="store-nav-bar items-center grid grid-cols-[1fr_auto_1fr] px-2 md:px-10 xl:px-16 h-16 md:h-[72px] xl:h-[88px] border-b md:border-b-0 luca-line">
        <div className="flex items-center gap-6 text-[13px]">
          <div className="md:hidden flex">
            <MobileMenu />
          </div>
          <Link
            href={`/${locale}/suppliers`}
            className="hidden md:inline-flex items-center gap-1.5 min-h-[44px] hover:underline underline-offset-4"
          >
            <IcPin size={18} />
            <span>{t('dealers')}</span>
          </Link>
          <Link
            href={`/${locale}/cooperation`}
            className="hidden md:inline-flex items-center min-h-[44px] hover:underline underline-offset-4"
          >
            {t('contact')}
          </Link>
        </div>

        <Link
          href={`/${locale}`}
          aria-label={tBrand('name')}
          className="luca-wordmark text-[30px] md:text-[36px] xl:text-[42px]"
        >
          LUCA
        </Link>

        <div className="flex justify-end items-center gap-1">
          <div className="hidden md:flex">
            <LangSwitcher />
          </div>
          <Link href={`/${locale}/products`} aria-label={t('search')} className="store-icon-btn">
            <IcSearch />
          </Link>
          <Link
            href={`/${locale}/register`}
            aria-label={t('register')}
            className="hidden md:inline-flex store-icon-btn"
          >
            <IcUser />
          </Link>
          <ShoppingCart />
        </div>
      </div>

      {/* Navigation row */}
      <nav
        className="hidden md:flex justify-center items-center gap-[18px] lg:gap-9 border-b h-[52px] text-[13px] lg:text-sm luca-line"
        aria-label={t('mainNav')}
      >
        {NAV_KEYS.map((item) => (
          <Link key={item.href} href={`/${locale}/${item.href}`} className="store-nav-link">
            {t(item.labelKey)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
