# E-commerce SEO findings: lucaloupe.ir (On-page analysis (static) + live API probes, 2026-10-18)
Overall e-commerce score: 12/100 (no sellable catalog is published). Details in the handback report.
1. CRITICAL: Products API returns zero records (GET /api/Products -> totalCount 0; /api/Products/getslugs -> data []; /api/Products/1 -> 404). No product page exists.
2. CRITICAL: Homepage hero CTA /fa/products/1 comes from banner firstUrl (admin data), FrontEnd/components/molecules/landing Elements/landingSlider.tsx:49-51; target does not exist.
3. HIGH: sitemap has no product URLs (app/sitemap.xml/route.ts:150,177) because getslugs is empty.
4. HIGH: /feeds/google-merchant.xml is an empty channel (app/feeds/google-merchant.xml/route.ts); no Torob feed/endpoint exists anywhere in the code.
5. MEDIUM: Product JSON-LD template gaps (app/[locale]/products/[slug]/page.tsx:131-160).
6. MEDIUM: Image alt is name-only/English-suffixed (productGallery.tsx:35,54,87).
7. MEDIUM: Specs rendered as key/value list, not a table (productSpecs.tsx:22-31); no additionalProperty in schema.
