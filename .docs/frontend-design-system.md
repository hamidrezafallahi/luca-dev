# Luca frontend design system

Read this before changing any `FrontEnd/` UI. The admin theme dashboard at `/{locale}/admin/themeSettings` edits theme rows; only the active row controls the live site. The backend contract is `BackEnd/Application/Dtos/ThemeSettingDtos.cs` and the domain validation is `BackEnd/Domain/Entities/ThemeSetting.cs`. The editor model is `FrontEnd/components/templates/admin/themeSettings/palette.ts`, and the editor is `themeStudio.tsx` in the same directory.

## Data flow and precedence

1. Admin saves a theme (`ThemeSettingsController`, POST/PUT), then activates one (`PUT /api/ThemeSettings/active`). Saving an inactive theme does not change the storefront. The editor calls `refreshStorefrontTheme()` after successful changes to revalidate the `themeSettings` tag.
2. `FrontEnd/lib/theme.ts` fetches `GET /api/ThemeSettings/active` on the server, with a 60-second revalidation fallback. `FrontEnd/app/[locale]/layout.tsx` also fetches custom fonts and emits a validated `<style id="site-theme">` on the root page. No active row or fetch failure leaves the fallback tokens in `FrontEnd/style/globals.css`.
3. `themeToCss()` emits `:root:root` declarations. This specificity is intentional: the active admin palette wins over the fallback palette and the local `[data-theme="dark"]` preset. The dark toggle is a fallback preset, not a second source of admin colors. Avoid adding a conflicting unscoped color override.
4. `FrontEnd/tailwind.config.ts` maps semantic utility colors to CSS variables. `FrontEnd/postcss/font-scale.cjs` processes both Tailwind utilities and authored CSS after Tailwind expansion. Do not bypass this pipeline with inline numeric `fontSize` or `fontWeight`.

## Backend fields and frontend tokens

The 13 color fields are validated `#RRGGBB` values. `themeToCss()` validates them again before inserting CSS. Use semantic aliases for a component's context; never copy default hex values into JSX or a new component rule.

| Theme field | Runtime token or role |
| --- | --- |
| `primaryColor` | `--primary-color`, main action, focus, link, active state |
| `secondaryColor` | `--secondary-color`, secondary brand/ink accent |
| `highlightColor` | `--highlight-color`, limited accent and discount state |
| `neutralColor` | `--neutral-color`, paper/neutral background |
| `successColor`, `errorColor`, `warningColor`, `infoColor` | matching `--*-color` status tokens |
| `surfaceColor` | `--store-surface`, `--store-surface-solid`, `--admin-surface`, `--admin-surface-elevated`; page and panel backgrounds |
| `surfaceMutedColor` | `--store-surface-muted`, `--admin-surface-muted`, `--admin-hover`; subdued panels |
| `borderColor` | `--store-border`, `--admin-border`; default lines |
| `textColor` | `--store-text`, `--store-border-strong`, `--admin-text`; normal text/strong lines |
| `textMutedColor` | `--store-text-muted`, `--admin-text-muted`; supporting text |

Derived tokens in `globals.css` include `--tint-color`, `--store-placeholder`, `--admin-active`, and `--admin-danger-soft`; derive their values from the fields above. The design has flat surfaces, square corners, 1px borders, and no default shadow. Rounded circles are for avatars, indicators, and controls whose shape has meaning. Hero/media overlays and text over photographs may use a deliberate fixed contrast color; verify contrast against the actual image or backdrop.

### Typography

`fontFamily` and `headingFontFamily` are catalog keys from `FrontEnd/lib/fontCatalog.ts` or validated uploaded font keys. Use `font-body`/`var(--font-body)` for UI and `font-display`/`var(--font-display)` for headings. Never pin a component to Vazirmatn, Markazi, IRANSans, or an uploaded font by name. Uploaded faces are declared only when selected.

`bodyTextSize` and `headingTextSize` are `small`, `medium`, `large`, or `custom`. Custom body size is 12–24px based on 16px; custom heading size is 24–120px based on the 76px H1. `bodyFontWeight` and `headingFontWeight` are 100–900 in steps of 100. `lib/typography.ts` converts these to `--text-scale`, `--heading-scale`, `--weight-shift`, and `--heading-weight-shift`. PostCSS transforms fixed `font-size` and numeric/normal/bold `font-weight` declarations; headings, `.luca-display`, `.luca-h*`, `.luca-wordmark`, and `.font-display` switch to the heading scales in `globals.css`. Relative `em`, inherited sizes, variable based sizes, and inline styles are not automatically transformed. Use normal Tailwind text/weight utilities or CSS declarations; check custom text containers under both scales. Preserve legibility at both extremes.

## Implementation rules

- Prefer existing semantic classes (`store-*`, `admin-*`, `luca-*`) and Tailwind layout/spacing utilities in JSX. For a reused visual pattern, define one component class in `globals.css` or a colocated stylesheet. Keep color and type decisions in theme tokens. Avoid duplicating long utility lists or layering later overrides onto an old rule.
- Use `bg-store-surface`, `text-store-text`, `text-store-subtle`, `border-store-border`, `bg-primary`, etc. in storefront JSX; use `--admin-*` tokens in admin UI. Legacy `ink`, `mute`, `line`, and `paper` utilities are mapped to theme tokens for old call sites; use the explicit semantic names for new code.
- Use `color-mix(in srgb, var(--token) …, transparent)` for translucent variants; do not put a hex color or `hsl(var(--primary-color))` in a utility. Theme fields are hex, not HSL channels. Avoid `bg-white`, `text-black`, and fixed gray utilities for theme owned surfaces and text.
- Use CSS logical properties and `dir` aware layouts for `fa` (RTL) and `en` (LTR). Keep locale labels in `next-intl`. Add accessible focus, hover, disabled, empty, error, and loading states using semantic tokens.
- The dashboard's `storefrontPreview.tsx` deliberately uses local `--t-*` variables so an unsaved preview cannot recolor the rest of the admin UI. Do not replace these with global tokens in the preview.
- The shared select menu is portaled to `document.body`. Keep popup colors on semantic store tokens, and use `--admin-surface-elevated`, `--admin-text`, `--admin-border`, and `--admin-hover` for popups opened from `.admin-shell` or `.admin-dialog`. Native admin select options use the same admin tokens.
- If adding a backend theme field, update the DTO/domain, `SiteTheme` and `themeToCss`, editor palette and preview, fallback CSS, Tailwind mapping when relevant, this table, and tests. Do not add a setting that only the editor knows how to render.

## Review checks

Check a storefront and admin page with two very different active palettes, custom body and heading fonts, smallest/largest text presets, and both font weights. Check light/dark fallback when no active row exists, both locales, and mobile widths. Run `npx tsc --noEmit` and `npm run build` from `FrontEnd/` when dependencies and the API are available. Search changed JSX/CSS for hardcoded surface/text colors and fixed font families. A visually correct default palette alone does not verify theme support.
