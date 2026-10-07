'use client';

import React, { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import HeroMedia from '@components/organisms/heroMedia';

import { LoginForm } from './login';
import { SignUpForm } from './signUp';

type Props = {
  imageSrc: string;
  videoSrc?: string;
  mediaAlt: string;
  playLabel: string;
  pauseLabel: string;
};

/**
 * Standalone sign-in / sign-up screen (no header/footer). On desktop it is split in
 * two halves: hero media on one side, the form on the other; switching between the
 * two forms swaps the sides. The media panel sits above the form so the form
 * slides out from behind it.
 */
function Register({ imageSrc, videoSrc, mediaAlt, playLabel, pauseLabel }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const t = useTranslations('register');
  const tHeader = useTranslations('header');
  const tBrand = useTranslations('brand');
  const locale = useLocale();

  return (
    <div className="lg:relative lg:overflow-hidden min-h-screen">
      {/* Desktop: both halves are absolutely placed and slide past each other. */}
      <aside
        className={`hidden lg:block lg:absolute lg:z-10 lg:inset-y-0 lg:start-0 lg:w-1/2 luca-dark overflow-hidden lg:transition-transform lg:duration-[800ms] lg:ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isLogin ? '' : 'ltr:lg:translate-x-full rtl:lg:-translate-x-full'
        }`}
      >
        <HeroMedia
          desktop={{ image: imageSrc, video: videoSrc }}
          alt={mediaAlt}
          playLabel={playLabel}
          pauseLabel={pauseLabel}
          noScrim
          dim
        />
        <Link
          href={`/${locale}`}
          aria-label={tBrand('name')}
          className="top-8 start-8 z-10 absolute text-[32px] text-white luca-wordmark"
        >
          LUCA
        </Link>
      </aside>

      <main
        className={`flex flex-col justify-center items-center gap-6 bg-store-surface px-5 sm:px-10 py-10 min-h-screen lg:absolute lg:z-0 lg:inset-y-0 lg:end-0 lg:w-1/2 lg:min-h-0 lg:overflow-y-auto lg:transition-transform lg:duration-[800ms] lg:ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isLogin ? '' : 'ltr:lg:-translate-x-full rtl:lg:translate-x-full'
        }`}
      >
        <Link
          href={`/${locale}`}
          aria-label={tBrand('name')}
          className="lg:hidden text-[32px] luca-wordmark"
        >
          LUCA
        </Link>

        <div
          key={isLogin ? 'login' : 'signup'}
          className="flex flex-col gap-[18px] w-full max-w-[400px] text-start animate-formIn"
        >
          <h1 className="luca-h2">{isLogin ? t('enter') : t('signUp')}</h1>

          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} />
          ) : (
            <SignUpForm setIsLogin={setIsLogin} />
          )}

          <Link href={`/${locale}`} className="self-center text-[13px] luca-link luca-muted">
            {tHeader('landing page')}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Register;
