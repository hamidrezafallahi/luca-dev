# Schema audit - lucaloupe.ir (2026-10-18)
Score: 38/100. See SubagentHandback report for full detail (same content).

Generator: FrontEnd/components/molecules/storefront/JsonLd.tsx:10 ; lib/seo.ts:226 (jsonLdScript escapes "<").
Detected live: home fa/en = OnlineStore+PostalAddress+WebSite(SearchAction); /products = CollectionPage; category = BreadcrumbList + FAQPage; brand detail = BreadcrumbList.
No JSON-LD: /categories, /blog, /faq, /brands, /story (fa and en). Live catalog has 0 product and 0 blog post URLs (not in sitemap or listing), so Product/Article only code-reviewed.

Critical:
1. Organization data copied from another project: app/[locale]/page.tsx (organizationLd): email info@rooshak.ir, sameAs instagram.com/roshak_kitchenware, t.me/Arash71tj (kitchenware brand). No logo.
2. Product schema has no additionalProperty (magnification, working distance, weight): app/[locale]/products/[slug]/page.tsx ~L131-160.
3. Product offers lacks priceValidUntil, shippingDetails, hasMerchantReturnPolicy, seller.
Warnings: Article lacks publisher, author fallback, image is relative? (blog/[slug]/page.tsx ~L75-85); breadcrumbs absent on list pages; CollectionPage lacks ItemList; no Brand/Organization @id link from Product.
Info: FAQPage on category pages (FaqSection.tsx:~33) and /faq (FaqAccordion.tsx:~30) - no SERP benefit since May 2026.
