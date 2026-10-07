import React from 'react';

/**
 * Content frame for the checkout-flow screens (orders, invoices, payment result).
 * The storefront header and footer are rendered by the route layouts (they are
 * server components, so they cannot be imported from these client screens).
 */
export default function StoreShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`pt-6 pb-16 md:pb-24 min-h-[60vh] text-ink text-start luca-container ${className}`}>
      {children}
    </main>
  );
}
