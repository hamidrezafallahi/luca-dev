# Google PageSpeed Report: lucaloupe.ir

- **URL tested:** https://lucaloupe.ir (redirects to https://lucaloupe.ir/fa)
- **Run:** 2026-10-18 05:33 UTC, Lighthouse 13.5.0, PageSpeed Insights v5
- **Field data (CrUX):** none. Chrome traffic is too low to qualify, so all numbers below are lab data from a single run.

## Lighthouse scores

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 94 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 92 | 92 |
| SEO | 92 | 92 |

## Lab metrics

| Metric | Mobile | Desktop | Rating (mobile) |
|---|---|---|---|
| LCP | 2.9 s | 0.6 s | Needs Improvement (good is 2.5 s or less) |
| CLS | 0 | 0 | Good |
| TBT (lab proxy for INP) | 0 ms | 10 ms | Good |
| FCP | 2.0 s | 0.6 s | Needs Improvement |
| Speed Index | 2.4 s | 0.7 s | Good |

## Findings

| Priority | Issue | Evidence | Fix |
|---|---|---|---|
| High | Root redirect costs about 750 ms on mobile | `/` redirects to `/fa` (751 ms wasted) | Serve `/fa` directly at `/` with a server-level 301, or make the default locale render without a redirect. Point internal links, canonical and sitemap at the final URL. |
| High | Google Fonts blocked by your CSP | `style-src 'self' 'unsafe-inline'` blocks fonts.googleapis.com (Vazirmatn, Markazi Text) | Self-host the fonts (e.g. `next/font`), or add `fonts.googleapis.com` to `style-src` and `fonts.gstatic.com` to `font-src`. Right now visitors may see fallback fonts. |
| High | Product request returns 500 | `/fa/products/1?_rsc=…` → 500 Internal Server Error | Check the server logs for the product 1 route. Broken product pages hurt crawling and indexing. |
| Medium | Generic link text | Two "بیشتر بدانید" links (to /fa/faq and /fa/cooperation) | Make the link text descriptive, e.g. "سوالات متداول" or "همکاری با ما". |
| Low | Header logo link's accessible name doesn't match its visible text | `header > div > a` | Make the `aria-label` match or include the visible text. |
| Low | Unused CSS (about 13 KiB) and image delivery (about 8 KiB) | Lighthouse estimates | Minor. Do these last. |

## How to check the fixes worked

- The redirect fix worked if the "Avoid multiple page redirects" audit no longer appears and mobile LCP drops by roughly 0.5 s or more on the next run.
- The CSP/font fix worked if there are no CSP errors in the DevTools console and Vazirmatn shows up as loaded in the Network panel.
- The 500 fix worked if `curl -I https://lucaloupe.ir/fa/products/1` returns 200.
- Lab scores vary between runs, so run it two or three times before comparing.
