import React, { ReactNode } from 'react';

import { setRequestLocale } from 'next-intl/server';

import Footer from '@layout/footer';
import Header from '@layout/header';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function EntityLayout({ children, params }: Props) {
  // Header/Footer call getLocale(). Without this, a notFound() render of an
  // ISR route reads the locale from headers() and fails with a 500.
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <div className="min-h-[70vh]">{children}</div>
      <Footer />
    </>
  );
}

export default EntityLayout;
