import React from 'react';

const paths = {
  plus: 'M12 4.5v15m7.5-7.5h-15',
  check: 'm4.5 12.75 6 6 9-13.5',
  arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
  undo: 'M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3',
  external:
    'M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
} as const;

/** Hairline icons matching the Luca prototypes (1.4 stroke, square caps). */
export function Glyph({ name, className = 'w-4 h-4' }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className={className} aria-hidden>
      <path strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}
