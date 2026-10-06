import React from 'react';

/**
 * Luca line icons — 1.4px stroke, 24px grid, inherit `currentColor`.
 * Used by the storefront chrome so every icon shares one weight.
 */
type IconProps = { size?: number; className?: string };

function Svg({ size = 22, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IcSearch = (p: IconProps) => (<Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></Svg>);
export const IcUser = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-4 4-5.5 7.5-5.5s6.3 1.5 7.5 5.5" /></Svg>);
export const IcBag = (p: IconProps) => (<Svg {...p}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></Svg>);
export const IcPin = (p: IconProps) => (<Svg {...p}><path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11z" /><circle cx="12" cy="10" r="2.3" /></Svg>);
export const IcMenu = (p: IconProps) => (<Svg {...p}><path d="M3.5 7h17M3.5 12h17M3.5 17h17" /></Svg>);
export const IcClose = (p: IconProps) => (<Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>);
export const IcPlus = (p: IconProps) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
export const IcMinus = (p: IconProps) => (<Svg {...p}><path d="M5 12h14" /></Svg>);
export const IcChevronDown = (p: IconProps) => (<Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>);
export const IcChevronLeft = (p: IconProps) => (<Svg {...p}><path d="M14 6l-6 6 6 6" /></Svg>);
export const IcChevronRight = (p: IconProps) => (<Svg {...p}><path d="M10 6l6 6-6 6" /></Svg>);
export const IcCheck = (p: IconProps) => (<Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>);
export const IcBox = (p: IconProps) => (<Svg {...p}><path d="M3.5 8l8.5-4.5L20.5 8v8L12 20.5 3.5 16V8z" /><path d="M3.5 8L12 12.5 20.5 8M12 12.5v8" /></Svg>);
export const IcShield = (p: IconProps) => (<Svg {...p}><path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5z" /><path d="M9 12l2.2 2.2L15 10.4" /></Svg>);
export const IcClock = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>);
export const IcStar = (p: IconProps) => (<Svg {...p}><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8L12 3.5z" /></Svg>);
export const IcTrash = (p: IconProps) => (<Svg {...p}><path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7" /></Svg>);
export const IcEdit = (p: IconProps) => (<Svg {...p}><path d="M4 20h4L19 9l-4-4L4 16v4z" /></Svg>);
export const IcDownload = (p: IconProps) => (<Svg {...p}><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" /></Svg>);
export const IcUpload = (p: IconProps) => (<Svg {...p}><path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19.5h14" /></Svg>);
export const IcEye = (p: IconProps) => (<Svg {...p}><path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></Svg>);
export const IcGrid = (p: IconProps) => (<Svg {...p}><rect x="4" y="4" width="6.5" height="6.5" /><rect x="13.5" y="4" width="6.5" height="6.5" /><rect x="4" y="13.5" width="6.5" height="6.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" /></Svg>);
export const IcFilter = (p: IconProps) => (<Svg {...p}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></Svg>);
export const IcGlobe = (p: IconProps) => (<Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></Svg>);

/** Loupe mark used inside empty image placeholders. */
export function LoupeMark({ width = 88, className }: { width?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={width / 2}
      viewBox="0 0 120 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="8" y="14" width="44" height="30" rx="13" />
      <rect x="68" y="14" width="44" height="30" rx="13" />
      <path d="M52 25c4-4 12-4 16 0M8 24l-6-4M112 24l6-4" />
      <circle cx="30" cy="32" r="9" /><circle cx="30" cy="32" r="5" />
      <circle cx="90" cy="32" r="9" /><circle cx="90" cy="32" r="5" />
    </svg>
  );
}
