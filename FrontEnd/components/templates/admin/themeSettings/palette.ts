import type { CSSProperties } from 'react';

/**
 * Palette model of the theme editor. Mirrors ThemeSettingDto (BackEnd) and
 * SiteTheme (lib/theme.ts); every colour is a lower-case #RRGGBB string.
 * In Luca the admin panel shares this palette (see themeToCss).
 */
export const COLOR_KEYS = [
  'primaryColor',
  'secondaryColor',
  'highlightColor',
  'neutralColor',
  'successColor',
  'errorColor',
  'warningColor',
  'infoColor',
  'surfaceColor',
  'surfaceMutedColor',
  'borderColor',
  'textColor',
  'textMutedColor',
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];
export type Palette = Record<ColorKey, string>;
export type ThemeRecord = Palette & { id: number; name: string; isActive: boolean };

export const HEX = /^#[0-9a-fA-F]{6}$/;

/** Editor sections, in order. Titles and help texts: admin.themeSettings.groups / fields. */
export const COLOR_GROUPS: { id: 'brand' | 'page' | 'status'; keys: ColorKey[] }[] = [
  { id: 'brand', keys: ['primaryColor', 'secondaryColor', 'highlightColor'] },
  {
    id: 'page',
    keys: ['surfaceColor', 'surfaceMutedColor', 'neutralColor', 'borderColor', 'textColor', 'textMutedColor'],
  },
  { id: 'status', keys: ['successColor', 'errorColor', 'warningColor', 'infoColor'] },
];

/** The storefront fallback in globals.css: white ground, near-black ink, one navy accent. */
export const DEFAULT_PALETTE: Palette = {
  primaryColor: '#1e3a8a',
  secondaryColor: '#111111',
  highlightColor: '#1e3a8a',
  neutralColor: '#f6f6f3',
  successColor: '#1d5c3f',
  errorColor: '#a3262e',
  warningColor: '#8a5a00',
  infoColor: '#1e3a8a',
  surfaceColor: '#ffffff',
  surfaceMutedColor: '#f6f6f3',
  borderColor: '#e4e4e0',
  textColor: '#111111',
  textMutedColor: '#5c5c58',
};

/** Starting points for a new theme: the day and night palettes of globals.css. */
export const PRESETS: { id: 'day' | 'night'; palette: Palette }[] = [
  { id: 'day', palette: DEFAULT_PALETTE },
  {
    id: 'night',
    palette: {
      primaryColor: '#8fa5e8',
      secondaryColor: '#f3f3f0',
      highlightColor: '#8fa5e8',
      neutralColor: '#1d1d1b',
      successColor: '#6fc79b',
      errorColor: '#f08a90',
      warningColor: '#e0b354',
      infoColor: '#8fa5e8',
      surfaceColor: '#1d1d1b',
      surfaceMutedColor: '#262624',
      borderColor: '#3a3a37',
      textColor: '#f3f3f0',
      textMutedColor: '#a9a9a4',
    },
  },
];

/** Builds a ThemeRecord from an API row; colours that are not valid hex fall back to the default. */
export function toThemeRecord(row: Record<string, unknown> | null | undefined): ThemeRecord | null {
  if (!row || typeof row.id !== 'number') return null;
  const palette = { ...DEFAULT_PALETTE };
  COLOR_KEYS.forEach((key) => {
    const value = row[key];
    if (typeof value === 'string' && HEX.test(value)) palette[key] = value.toLowerCase();
  });
  return {
    ...palette,
    id: row.id,
    name: typeof row.name === 'string' ? row.name : '',
    isActive: Boolean(row.isActive),
  };
}

export function pickPalette(source: Palette): Palette {
  const palette = {} as Palette;
  COLOR_KEYS.forEach((key) => {
    palette[key] = source[key];
  });
  return palette;
}

// ===== WCAG 2.1 contrast =====

function channel(value: number) {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string) {
  if (!HEX.test(a) || !HEX.test(b)) return 1;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

type Ink = ColorKey | 'white';
export const inkOf = (palette: Palette, ink: Ink) => (ink === 'white' ? '#ffffff' : palette[ink]);

/**
 * Pairs the storefront and admin actually render; `min` is the WCAG AA threshold.
 * Primary and ink buttons always carry white labels (luca-badge-accent, admin-btn-primary).
 */
export const CONTRAST_CHECKS: { id: string; fg: Ink; bg: ColorKey; min: number }[] = [
  { id: 'body', fg: 'textColor', bg: 'surfaceColor', min: 4.5 },
  { id: 'muted', fg: 'textMutedColor', bg: 'surfaceColor', min: 4.5 },
  { id: 'paper', fg: 'textColor', bg: 'surfaceMutedColor', min: 4.5 },
  { id: 'button', fg: 'white', bg: 'primaryColor', min: 4.5 },
  { id: 'ink', fg: 'white', bg: 'secondaryColor', min: 4.5 },
  { id: 'link', fg: 'primaryColor', bg: 'surfaceColor', min: 4.5 },
  { id: 'error', fg: 'errorColor', bg: 'surfaceColor', min: 4.5 },
];

// ===== Preview plumbing =====

const VAR_NAME: Record<ColorKey, string> = {
  primaryColor: '--t-primary',
  secondaryColor: '--t-secondary',
  highlightColor: '--t-highlight',
  neutralColor: '--t-neutral',
  successColor: '--t-success',
  errorColor: '--t-error',
  warningColor: '--t-warning',
  infoColor: '--t-info',
  surfaceColor: '--t-surface',
  surfaceMutedColor: '--t-surface-muted',
  borderColor: '--t-border',
  textColor: '--t-text',
  textMutedColor: '--t-text-muted',
};

/** Scoped CSS variables, so a preview never repaints the admin around it. */
export function previewVars(palette: Palette): CSSProperties {
  const vars: Record<string, string> = {
    // Same mix as --tint-color in globals.css (the "specifications" band).
    '--t-tint': `color-mix(in srgb, ${palette.primaryColor} 8%, ${palette.surfaceColor})`,
  };
  COLOR_KEYS.forEach((key) => {
    vars[VAR_NAME[key]] = palette[key];
  });
  return vars as CSSProperties;
}

/**
 * Marks every preview element tagged `data-c="<key>"` while that colour row is
 * hovered or focused in the editor, so the admin sees where a colour is used.
 */
export function focusOutlineCss(scope: string) {
  const selectors = COLOR_KEYS.map(
    (key) => `${scope}[data-focus="${key}"] [data-c~="${key}"]`,
  ).join(',');
  return `${selectors}{outline:2px solid var(--admin-text);outline-offset:3px}`;
}
