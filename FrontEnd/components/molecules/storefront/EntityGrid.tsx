import React from 'react';

type EntityGridProps = {
  children: React.ReactNode;
  cols?: 'products' | 'cards' | 'dense';
  className?: string;
};

// Luca grid rhythm: 4 / 3 / 2 columns (desktop / tablet / phone).
const COLS = {
  products:
    'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-7 md:gap-y-10 lg:gap-y-12',
  cards:
    'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-4 lg:gap-x-6 gap-y-6 md:gap-y-8 lg:gap-y-10',
  dense:
    'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6',
} as const;

export default function EntityGrid({
  children,
  cols = 'cards',
  className = '',
}: EntityGridProps) {
  return <div className={`${COLS[cols]} ${className}`}>{children}</div>;
}
