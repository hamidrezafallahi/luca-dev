'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

import { IcChevronLeft, IcChevronRight, IcClose, IcMenu } from '@components/atoms/lucaIcons';
import LangSwitcher from '@components/molecules/lang';

const LINKS = [
  { href: '', labelKey: 'home' as const },
  { href: 'products', labelKey: 'products' as const },
  { href: 'categories', labelKey: 'categories' as const },
  { href: 'brands', labelKey: 'brands' as const },
  { href: 'suppliers', labelKey: 'suppliers' as const },
  { href: 'tags', labelKey: 'tags' as const },
  { href: 'exhibition', labelKey: 'exhibition' as const },
  { href: 'discounts', labelKey: 'discounts' as const },
  { href: 'blog', labelKey: 'blogs' as const },
  { href: 'story', labelKey: 'story' as const },
  { href: 'shoppingCart', labelKey: 'shopping cart' as const },
  { href: 'register', labelKey: 'register' as const },
] as const;

function MobileMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');

  const openDrawer = () => {
    setIsVisible(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const navLinks = useMemo(
    () =>
      LINKS.map((item) => ({
        ...item,
        hrefValue: item.href ? `/${locale}/${item.href}` : `/${locale}`,
      })),
    [locale],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const frame = window.requestAnimationFrame(() => {
      setIsOpen(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isVisible]);

  useEffect(() => {
    if (isOpen) return;
    if (!isVisible) return;

    const timeout = window.setTimeout(() => {
      setIsVisible(false);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isOpen, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isVisible]);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  const drawer = isMounted && isVisible
    ? createPortal(
        <div
          className={`fixed inset-0 z-[90] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          style={{ fontFamily: 'var(--font-body)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
        >
          <button
            type="button"
            className={`absolute inset-0 h-full w-full border-0 bg-black/40 p-0 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label={t('closeMenu')}
            onClick={closeDrawer}
          />

          <aside
            id="mobile-nav-drawer"
            aria-label={t('mainNav')}
            className={`absolute inset-y-0 start-0 flex w-[min(360px,88vw)] flex-col overflow-hidden bg-[color:var(--store-surface-solid)] text-[var(--store-text)] transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center px-2 border-b h-16 luca-line">
              <button
                type="button"
                onClick={closeDrawer}
                className="store-icon-btn shrink-0"
                aria-label={t('closeMenu')}
              >
                <IcClose />
              </button>
              <p id="mobile-nav-title" className="text-[26px] luca-wordmark">
                LUCA
              </p>
              <div className="flex justify-end w-11">
                <LangSwitcher />
              </div>
            </div>

            <ul className="flex flex-col flex-1 px-5 overflow-y-auto">
              {navLinks.map((item) => {
                const isActive = pathname === item.hrefValue;

                return (
                  <li key={item.href || 'home'} className="border-b luca-line">
                    <Link
                      href={item.hrefValue}
                      onClick={closeDrawer}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between min-h-[56px] text-[15px] ${
                        isActive ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      <span>{t(item.labelKey)}</span>
                      <span className="rtl:hidden"><IcChevronRight size={16} /></span>
                      <span className="ltr:hidden"><IcChevronLeft size={16} /></span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="[padding-bottom:calc(env(safe-area-inset-bottom)+1.25rem)] flex flex-col gap-3 px-5 pt-5 border-t luca-line">
              <Link
                href={`/${locale}/register`}
                className="w-full store-btn store-btn-primary"
                onClick={closeDrawer}
              >
                {t('register')}
              </Link>
            </div>
          </aside>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="store-icon-btn"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        aria-label={t('openMenu')}
      >
        <IcMenu />
      </button>

      {drawer}
    </>
  );
}

export default MobileMenu;
