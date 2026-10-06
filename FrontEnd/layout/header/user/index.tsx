import React from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { UserIcon } from '@components/atoms/iconComponents';

export default function Register() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}/register`}
      aria-label={t("header.register")}
      className="store-icon-btn"
    >
      <UserIcon />
    </Link>
  );
}
