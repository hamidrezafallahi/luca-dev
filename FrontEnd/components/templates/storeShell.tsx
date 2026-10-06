import React from 'react';

import Footer from '@layout/footer';
import Header from '@layout/header';

/**
 * Storefront chrome for the checkout-flow screens (orders, invoices, payment result),
 * which previously rendered as bare full-screen views.
 */
export default function StoreShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <Header />
      <main className={`pt-6 pb-16 md:pb-24 min-h-[60vh] text-ink text-start luca-container ${className}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
