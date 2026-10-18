# Technical SEO findings: lucaloupe.ir (2026-10-18) - score 68/100

Corrections to prior assumptions: hreflang IS present (HTML link tags + HTTP Link header); the sitemap code DOES include products/blogs, but the API returns empty lists.

## Critical/High
1. HIGH - No indexable product/blog content exists in the live data. /api/products/getslugs and /api/blogs/getslugs return {"data":[]}; /fa/products shows "محصولی یافت نشد", /fa/blog shows "مقاله‌ای یافت نشد". Sitemap therefore has 36 URLs, no products/blogs. Code: FrontEnd/app/sitemap.xml/route.ts:148-190 (fine). Fix: publish products/articles in backend (data issue, not code); verify getslugs returns keys and sitemap grows.
2. HIGH - Broken product link on homepage: /fa/products/1 -> 404. Fallback `product.slug || product.id` in components/molecules/productCard/detailedProductCard.tsx:37, simpleProductCard.tsx:17, productsCarousel/index.tsx:138 (also supplierProductsCarousel.tsx:123, brandCard, categoryCart:24, supplierCard, tagCard). Fix: ensure slug always set in API; omit link/card when slug missing. Verify: crawl homepage links, all 200.
3. HIGH - Nested <html>/layout mismatch: root app/layout.tsx:76 hardcodes <html lang="fa"> with no dir; locale layout app/[locale]/layout.tsx:43-46 sets dir/lang on a <div> only. /en pages are served with <html lang="fa"> (en.html) and <html> has no dir="rtl" (project rule violated). Fix: set lang/dir on <html> from locale (e.g. root layout reading locale via next-intl, or move html/body into [locale]/layout). Verify: curl /en | grep '<html'; expect lang="en" dir="ltr"; /fa dir="rtl".

## Medium
4. MEDIUM - Soft 404s: /foo.txt and /indexnow.txt return 200 text/html (app shell) instead of 404. Unknown /foo gets 307 (redirect to locale then 404). Fix: nginx/middleware matcher should 404 file-like paths; confirm [locale] catch does not swallow them. Verify: curl -I /foo.txt = 404.
5. MEDIUM - `/` uses 307 (temporary) to /fa; use 301/308 or serve content. Also Link-header x-default points to https://lucaloupe.ir/ (a redirect) while HTML x-default points to /fa: inconsistent. Fix: align both to /fa (find where Link header is set, middleware / i18n routing config). Also x-default is better as true default only if / redirects consistently.
6. MEDIUM - Thin/empty listings are index,follow with canonical (/fa/products, /fa/blog, empty categories). Until content exists, consider noindex on empty listings or populate. Sitemap also lists /fa/suppliers/content-admin (internal-looking account slug) and /fa/suppliers/رها; review.
7. MEDIUM - Category slugs carry numeric id suffix (ttl-loupes-3, flip-up-loupes-2, prismatic-loupes-4, ergonomic-loupes-5, brand luca-loupe-1). Slug without id (/fa/categories/ttl-loupes) 404s, so id is required for lookup. Not harmful but poor for keywords/stability; consider clean slug with redirect from old. Low risk to keep.
8. MEDIUM - Structured data: only OnlineStore/WebSite/SearchAction/PostalAddress on homepage; no Product/Offer/BreadcrumbList/Article (no detail pages exist). products/blog listing pages have no ld+json (blog.html: 0).
9. MEDIUM - CSP script-src has 'unsafe-inline' 'unsafe-eval' (weak XSS protection); no 'frame-ancestors'/'upgrade-insecure-requests'. X-XSS-Protection is deprecated (harmless).

## Low
10. LOW - robots.txt: `Host:` is Yandex-only/obsolete (FrontEnd/app/robots.ts:57); identical groups repeated per bot (duplication, harmless, but AI-bot policy is effectively allow-all; confirm intent). Sitemap declared and valid (sitemap_discovery: valid urlset).
11. LOW - Sitemap: all <lastmod> = generation time (fallbackLastmod), changefreq/priority ignored by Google; ensure real lastmod from API.
12. LOW - No IndexNow key file (/indexnow.txt returns app shell, not a key). Implement for Bing/Yandex/Naver: generate key, host /<key>.txt, submit on publish.
13. LOW - 404 page has noindex (good); trailing slash 308 to non-slash (good); http->https 301 and www->apex 301 (good).

## Passing
HTTPS+HSTS preload; X-Content-Type-Options; X-Frame-Options; Referrer-Policy; Permissions-Policy; viewport meta; self-canonical per locale (/fa, /en, category); hreflang fa/en/x-default reciprocal in HTML and sitemap; unique titles/descriptions; SSR/ISR (x-nextjs-prerender, h1 + content in initial HTML, no CSR dependence); static assets immutable 1y; Lighthouse mobile 100/desktop 99; TTFB ~0.7s (stale-while-revalidate).
Core Web Vitals: no field data; lab good. Mobile: viewport OK, no issues from source.
