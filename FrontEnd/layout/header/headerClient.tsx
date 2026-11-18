'use client';

import React from 'react';

import {
  useLocale,
  useTranslations,
} from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  IcPin,
  IcSearch,
  IcUser,
} from '@components/atoms/lucaIcons';
import LangSwitcher from '@components/molecules/lang';

import MobileMenu from './mobileMenu';
import ShoppingCart from './shoppingCart';

const NAV_KEYS = [
  { href: 'products', labelKey: 'products' as const },
  { href: 'categories', labelKey: 'categories' as const },
  { href: 'brands', labelKey: 'brands' as const },
  { href: 'discounts', labelKey: 'discounts' as const },
  { href: 'blog', labelKey: 'blogs' as const },
  { href: 'story', labelKey: 'story' as const },
] as const;

export type HeaderAnnouncement = {
  message: string;
  link: { href: string; external: boolean } | null;
  backgroundColor: string;
  textColor: string;
  backgroundImage: string | null;
};

type HeaderProps = {
  /** Admin-managed bar above the header; null = nothing scheduled right now. */
  announcement?: HeaderAnnouncement | null;
};

export default function HeaderClient({ announcement = null }: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations('header');
  const tBrand = useTranslations('brand');

  return (
    <header className="store-nav" role="banner">
      {announcement ? <AnnouncementStrip bar={announcement} /> : null}

      {/* Main row: utilities · wordmark · actions.
          Mobile: the menu button always sits on the physical RIGHT edge (thumb side for
          right-handers) in both languages, and the account + cart pair sits tight against
          the left edge as its counterweight. */}
      <div className="items-center grid grid-cols-[1fr_auto_1fr] px-1 md:px-10 xl:px-16 border-b md:border-b-0 h-16 md:h-[72px] xl:h-[88px] store-nav-bar luca-line">
        <div className="flex max-md:ltr:justify-end items-center gap-6 max-md:ltr:order-3 text-[13px]">
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
          aria-label={tBrand('homeLink')}
          className="inline-flex items-center max-md:ltr:order-2"
        >
          {/* 640×166 artwork; the height drives the size so the ratio is kept. */}
          <Image
            src="/logo-wordmark.png"
            alt={tBrand('name')}
            width={640}
            height={166}
            priority
            sizes="(min-width: 1280px) 170px, (min-width: 768px) 139px, 116px"
            className="w-auto h-[30px] md:h-9 xl:h-11"
          />
        </Link>

        <div className="flex max-md:ltr:flex-row-reverse justify-end items-center gap-0 md:gap-1 max-md:ltr:order-1">
          <div className="hidden md:flex">
            <LangSwitcher />
          </div>
          <Link
            href={`/${locale}/products`}
            aria-label={t('search')}
            className="hidden md:inline-flex store-icon-btn"
          >
            <IcSearch />
          </Link>
          <Link
            href={`/${locale}/register`}
            aria-label={t('register')}
            className="store-icon-btn !w-10"
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

function AnnouncementStrip({ bar }: { bar: HeaderAnnouncement }) {
  const t = useTranslations('header');
  const className =
    'flex justify-center items-center gap-2.5 px-5 py-1 w-full min-h-[var(--store-announce-h)] text-[13px] text-center bg-cover bg-center';
  const style: React.CSSProperties = {
    backgroundColor: bar.backgroundColor,
    color: bar.textColor,
    backgroundImage: bar.backgroundImage ? `url("${bar.backgroundImage}")` : undefined,
  };
  const content = (
    <>
      <span className="line-clamp-2 leading-tight">{bar.message}</span>
      {bar.link ? (
        <span className="underline underline-offset-4 shrink-0">{t('announcementCta')}</span>
      ) : null}
    </>
  );

  if (!bar.link) {
    return (
      <p className={className} style={style}>
        {content}
      </p>
    );
  }

  return bar.link.external ? (
    <a
      href={bar.link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {content}
    </a>
  ) : (
    <Link href={bar.link.href} className={className} style={style}>
      {content}
    </Link>
  );
}
