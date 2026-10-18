# Sitemap audit - https://lucaloupe.ir/sitemap.xml (2026-10-18)

Summary: valid XML, 36 URLs (18 fa/en pairs). 34/36 return 200; 2 redirect (308). No products/blog posts because the catalog in the DB is empty.

## Findings
1. CRITICAL/HIGH - No product or blog URLs: backend catalog is empty (data issue, not a code bug)
 - Evidence: live GET /api/products/getslugs -> {"data":[],"isSuccess":true}; /api/blogs/getslugs -> []; /api/products and /api/blogs -> totalCount 0. tags/getslugs and discounts/getslugs also [].
 - Route is force-dynamic (FrontEnd/app/sitemap.xml/route.ts:7), so not a build/ISR freeze. Handler filter (BackEnd/Application/Handler/QueryHandler/ProductQueryHandler.cs:264: IsActive && !IsDeleted && Slug non-empty) is reasonable; zero rows match, so products are missing/inactive/without slug.
 - Fix: publish active products with slugs and blogs; verify the filter columns.
 - Verify: curl /api/products/getslugs returns non-empty; sitemap contains /fa/products/<slug>.
2. HIGH - Homepage hero CTA links /fa/products/1 (404; the "1" is an id not a slug, and no product exists). Link comes from landing-slide data (rendered by LandingHero via getSlides, FrontEnd/lib/landing.ts), not hardcoded in the page. Fix: point the slide CTA to /fa/products (or a real slug). Verify: curl -I returns 200.
3. HIGH - Supplier URL with raw non-ASCII slug: sitemap emits https://lucaloupe.ir/{fa,en}/suppliers/رها unencoded. Requesting it returns 308 to /fa/suppliers?%3F%3F= (mangled, loses the slug); the percent-encoded form (%D8%B1%D9%87%D8%A7) returns 200. Cause: slug is only xml-escaped, not URL-encoded - FrontEnd/app/sitemap.xml/route.ts:119,132-134 (via absoluteUrl in FrontEnd/lib/seo.ts). Also affects hreflang hrefs. Fix: encodeURI/encodeURIComponent the path segment (in buildUrlXml) and check that nginx/middleware does not mangle raw UTF-8; consider an ASCII slug for the supplier. Verify: all sitemap URLs return 200 with no redirect.
4. MEDIUM - Fake lastmod: 22 static URLs have lastmod = request time (2026-10-18T07:13:46.782Z, identical, regenerated every request) - route.ts:146,175. Records use API updatedAt (OK, real dates) but they lack a timezone (e.g. 2026-10-16T07:54:19.6989) - route.ts:81 passes the raw value. Fix: drop lastmod for static pages or use a real date; normalize with new Date(x+'Z').toISOString() (or output as UTC). Verify: lastmod values are valid W3C datetimes and stable between requests.
5. LOW/INFO - Deprecated tags: changefreq/priority on all 36 URLs (route.ts:138-139). Ignored by Google; remove.
6. INFO - hreflang: correct and reciprocal (fa, en, x-default=fa) on every URL; self-referencing; matches page canonicals (checked /fa/discounts, /tags, /faq, /categories/*, /suppliers/content-admin: canonical present, robots index,follow).
7. INFO - Image extension: image:image entries are built (route.ts:122-129,177+) and attached only for product/blog/brand/category/supplier records; the xmlns is declared. Note the image tags are emitted per locale correctly. Brand/category image URLs come from API.
8. INFO - Coverage: all existing records returned by the API are in the sitemap: 1 brand (luca-loupe-1), 4 categories (flip-up-loupes-2, ttl-loupes-3, prismatic-loupes-4, ergonomic-loupes-5), 2 suppliers (content-admin, رها). Tags and discounts are empty, so only their list pages appear. Static pages included: home, products, blog, brands, categories, suppliers, tags, discounts, faq, cooperation, story.
9. INFO - Robustness: fetchRecords swallows errors and returns [] (route.ts:95,99-101) with a 2.5s timeout (line 32); an API outage silently yields a sitemap with static pages only. Cache-Control becomes no-store (line 246-254) only if products and blogs are both empty - which is the current state, so the sitemap is currently not cacheable (header seen: no-store). Fix: fail with 503 when all APIs error, instead of 200.
10. INFO - Other checks: no noindexed URLs in sitemap (all index,follow); no admin/checkout paths included; robots.txt references the sitemap; limits fine (36 URLs << 50k); XML well-formed; Content-Type application/xml.
11. INFO - Leftover: FrontEnd/app/api/sitemap.xml is an empty directory; FrontEnd/app/[locale]/sitemap/page.tsx is the HTML sitemap page (not XML). Default siteBaseUrl fallback in FrontEnd/lib/api.ts:1 is 'https://rooshakshop.ir' - a risk if NEXT_PUBLIC_SITE_URL is missing at runtime (currently correct in prod).

## Status code table
34 of 36 sitemap URLs: 200. 2 (fa/en suppliers/رها): 308 (see #3). Source list: raw/sitemap-urls.txt.
