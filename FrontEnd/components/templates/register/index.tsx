'use client';

import React, { useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { LoupeMark } from '@components/atoms/lucaIcons';

import { LoginForm } from './login';
import { SignUpForm } from './signUp';

function Register() {
  const [isLogin, setIsLogin] = useState(true);
  const t = useTranslations('register');
  const tHeader = useTranslations('header');
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[680px]">
      {/* Brand image panel (tablet and up). Swap the mark for a campaign photo when available. */}
      <div className="hidden md:flex flex-col justify-center items-center gap-3.5 text-[#6a6a65] luca-ph">
        <LoupeMark width={160} />
      </div>

      <div className="flex justify-center items-center px-5 md:px-10 py-10 md:py-12">
        <div className="flex flex-col gap-[18px] w-full max-w-[400px] text-start">
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
      </div>
    </div>
  );
}

export default Register;
