# Luca storefront — what changed from the Rooshak front end

This project is the Rooshak front end (Next.js App Router, next-intl, Redux, Tailwind) re-skinned to the
Luca prototypes. Routing, data fetching, API calls, cart/checkout logic, auth, SEO and admin logic are unchanged.

## Design system

| Where | What |
|---|---|
| `style/globals.css` | Luca tokens (`--primary-color: #1e3a8a`, ink, paper, tint, fonts) and a "Luca design layer" that restyles the shared `store-*`, `admin-*`, `exhibit-*` classes. New helpers: `luca-container`, `luca-h1/h2/h3`, `luca-link`, `luca-input`, `luca-badge*`, `luca-chip`, `luca-ph`, `luca-tint`, `luca-dark`, `luca-article`. |
| `tailwind.config.ts` | Square corners and no shadows everywhere (`rounded-full` kept), warm neutral scale for `gray/zinc/slate`, colours `ink / mute / line / paper / tint`, `font-display` / `font-body`. |
| `app/layout.tsx` | White ground; loads Markazi Text + Vazirmatn from Google Fonts. |
| `components/atoms/lucaIcons` | One line-icon set for the storefront chrome + the loupe placeholder mark. |

To change the brand colour, edit `--primary-color` in `style/globals.css`.

## Screens

- **Chrome**: `layout/header` (announcement bar, centred wordmark, nav row, side drawer on mobile), `layout/footer` (5 columns, accordion on mobile), header cart popover.
- **Home**: hero, product tabs carousel, banner slider, categories, editorial features (new), special offers, brands, experience (new), USP, trust, blog, testimonials, FAQ, contact band (new).
- **Catalogue**: products, categories, brands, suppliers, tags, discounts lists and detail pages; product page (gallery grid, info, offers, tabs).
- **Content**: blog list and article, price lists (exhibition), FAQ, cooperation, HTML sitemap, **story** (new route `/[locale]/story`).
- **Account / checkout**: login + sign-up, cart, invoices (checkout), final confirmation, payment verify / success / failed, orders. These screens now render inside the site header and footer (`components/templates/storeShell.tsx`).
- **Admin**: persistent sidebar on desktop, drawer + dock below 1024px; tables, forms, dashboard, SEO, payments, backup restyled through the `admin-*` classes.
- **System**: 404, error boundary, loading.

## Before going live — things only you can supply

1. **`public/`** was not in the uploaded archive. Copy it from the Rooshak repo (`public/fonts/IRANSansWeb(FaNum).woff` and `public/images/...` are imported by the code), then replace Rooshak imagery with Luca photography. `public/arianSystemLogo1.png` is no longer used.
2. **Hero image**: `public/images/landingPage/11.jpg` is still the Rooshak picture. Editorial image slots (home features, experience cards, story page, login panel) show a placeholder mark until you set real images.
3. **Fonts**: Google Fonts is loaded with a `<link>`. If your servers or users cannot reach Google, self-host the two families in `public/fonts` and switch to `@font-face`.
4. **Domain / contact**: `lib/api.ts` (`DEFAULT_SITE_URL`), `next.config.ts` (image hostnames), `.env*`, and the organisation JSON-LD in `app/[locale]/page.tsx` (email, phone, social links) still point at Rooshak. Footer social links are generic.
5. **Copy in brackets** in `messages/fa.json` / `messages/en.json` is placeholder text that needs real facts: testimonials and reviews, warranty and return terms, payment-on-delivery terms, free-shipping threshold, founding year, dealer count, story quote.
6. **Price lists**: `lib/exhibitionCatalogs.ts`, the `sadaf / delvin / leona` pages and `/public/exhibition/*` still hold Rooshak catalogues. Replace them with Luca catalogues.
7. **Newsletter**: the prototype shows a newsletter form; the API has no newsletter endpoint, so the home page closes with a contact-request band instead.
8. **Themes**: the theme switcher was removed from the storefront header (the prototypes have a single light theme). The dark theme tokens exist but the new screens were designed for light only.

## Not verified

The archive had no `node_modules` and the build machine had no network, so `next build`, `tsc` and ESLint were **not run**.
Every `.ts/.tsx` file was parse-checked and every static translation key was checked against both message files.
Run `yarn install && yarn build` and fix whatever the type checker reports before deploying.
