# Content Quality and E-E-A-T Audit: lucaloupe.ir

Date: 2026-10-18. Scope: 19 Persian URLs fetched with render_page.py (`--mode never`, SSR HTML; every page has `is_spa=false`, so the text below is what crawlers get). These include every /fa URL in sitemap.xml plus /fa/sitemap, /fa/products/1, /fa/products/2 and /fa/categories/1. This is a report only. Nothing was changed.

## Scores

| Metric | Score |
|---|---|
| **Content Quality** | **22 / 100** |
| **On-Page (titles, metas, headings, internal links)** | **48 / 100** |
| AI citation readiness | 20 / 100 |
| E-E-A-T composite (this skill's own weights) | 15 / 100 |

### E-E-A-T breakdown

| Factor (weight) | Score | Basis |
|---|---|---|
| Experience (20%) | 8 | No product photos or video of real use, no case studies, and the review slots are literal placeholders |
| Expertise (25%) | 32 | The category FAQs are accurate and practical (PD, declination, TTL vs flip-up). There is no author, no clinical advisor and no spec source |
| Authoritativeness (25%) | 8 | No dealer or official-representation proof, no Korean manufacturer identity, social links go to bare root domains, no articles |
| Trustworthiness (30%) | 12 | Warranty, returns and COD text are placeholders. No visible phone or address. JSON-LD carries another company's contacts. An internal service account is exposed |

Weighted: 0.2*8 + 0.25*32 + 0.25*8 + 0.3*12 = 15.2.

### Word count vs page-type floors (main content, extracted_text)

| URL | Type | Words | Floor | Verdict |
|---|---|---|---|---|
| /fa | Homepage | 187 (654 visible incl. nav/footer) | 500 | Thin |
| /fa/products | Listing | 39, "محصولی یافت نشد" | n/a | Empty |
| /fa/categories/ttl-loupes-3 | Category | 203 | ~500 | Thin, no products |
| /fa/categories/flip-up-loupes-2 | Category | 209 | ~500 | Thin, no products |
| /fa/categories/prismatic-loupes-4 | Category | 142 | ~500 | Thin, no products |
| /fa/categories/ergonomic-loupes-5 | Category | 137 | ~500 | Thin, no products |
| /fa/blog | Blog index | 19, "مقاله‌ای یافت نشد" | 1,500/post | No posts at all |
| /fa/faq | FAQ | 49, "هنوز سوالی ثبت نشده است" | n/a | Empty |
| /fa/story | About | 164, has placeholders | 500 | Thin |
| /fa/brands, /fa/brands/luca-loupe-1 | Brand | 47 / 44 | 300 | Thin |
| /fa/suppliers, /fa/tags, /fa/discounts | Listing | 16 / 40 / 19 | n/a | Empty |
| /fa/cooperation | Form | 61 | n/a | OK for a form, but it is the only "contact" page |
| /fa/products/1, /fa/products/2 | Product | 404 | 300-400 | No product detail page exists |

### Keyword cluster coverage (visible text, all 19 pages)

| Cluster term | Hits | Status |
|---|---|---|
| لوپ دندانپزشکی / دندان‌پزشکی | present | Covered in titles. Spelling is inconsistent (see C-11) |
| قیمت لوپ | 0 | Missing. No prices, no "تومان" anywhere |
| لوپ TTL / فلیپ‌آپ / پریزماتیک | present | Category pages exist, but they are thin |
| گالیله‌ای | 8 (brand text only) | No category or explainer page |
| بزرگنمایی ۲.۵ / ۳.۵ | 0 / 1 | Missing (۳.۵ appears once, inside the prismatic FAQ) |
| فاصله کاری | 12 | Mentioned, but there is no measurement guide |
| عمق میدان / وزن | 3 / 6 | Passing mentions, no numbers |
| کمردرد دندانپزشکان | 0 (کمر ×3) | Missing as a topic. Only unsourced claims |
| لوپ برای دانشجو | 0 | Missing |
| هدلایت | 29 (mostly nav/meta) | Promised in the site title, but there is no headlight category or product |
| Pillar «راهنمای انتخاب لوپ دندانپزشکی» | 0 pages | Does not exist. The phrase appears only in meta descriptions |

### Templated metadata check (metadata_template.py, 19 pairs)

`site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, `site_flags: []`. Descriptions are written per page with no stock CTA. No templated-metadata finding.

---

## Findings

Severity scale: Critical > High > Medium > Low.

### C-01 Critical: Placeholder text is live on the homepage and the About page
- Evidence: https://lucaloupe.ir/fa "[مدت و شرایط گارانتی]", "[مهلت و شرایط بازگشت کالا]", "[شرایط پرداخت در محل]", "« [نقل‌قول مشتری ۱] » [نام و تخصص]". https://lucaloupe.ir/fa/story "[سال تأسیس] — کره جنوبی", "گارانتی اپتیک [مدت]".
- Source: FrontEnd/messages/fa.json lines 201-264, 476, 492, 744, 835-867.
- Impact: Each trust block on the site (warranty, returns, COD, dentist testimonials, founding year, dealer count) shows bracketed template text. Raters and users will see an unfinished or untrustworthy store. For a high-price professional purchase this is the strongest negative trust signal on the site.
- Fix: Until the owner supplies real values, hide each block whose value is still a `[...]` placeholder. A render guard that skips strings starting with "[" works. The owner must supply the warranty term, return window, COD terms, payment methods, founding year, number of countries and real dentist quotes (name, specialty, product, with consent). Per the project rules, nothing may be invented.
- Verify: `grep -c '\[' ` on the visible text of /fa and /fa/story returns 0. The SSR HTML contains no "[نام" or "[مدت".

### C-02 Critical: The store has no products, and the product URLs return 404
- Evidence: https://lucaloupe.ir/fa/products "محصولی یافت نشد". https://lucaloupe.ir/fa/products/1 returns HTTP 404. The homepage "منتخب لوکا" and "پیشنهاد ویژه امروز" sections show "پیشنهادی موجود نیست". /fa/sitemap reads "محصولات: موردی برای نمایش وجود ندارد".
- Impact: Priority #1 in CLAUDE.md (a product page with a full spec table) and #2 (Product schema with additionalProperty) cannot start. Every category page is a listing with nothing in it. No page can rank for purchase intent (خرید / قیمت لوپ).
- Fix: Publish at least one product per category from the official manufacturer catalogue. Each needs magnification, working distance, depth of field, field of view, weight, frame, light compatibility, warranty and price. Every spec the catalogue does not give is a gap for the owner to fill. Do not estimate.
- Verify: /fa/products lists more than 0 items. Each /fa/products/{slug} returns 200, is in sitemap.xml, and has more than 300 words with a spec table.

### C-03 Critical: Organization JSON-LD carries another business's identity
- Evidence: https://lucaloupe.ir/fa JSON-LD has `"email":"info@rooshak.ir"`, `"sameAs":["https://instagram.com/roshak_kitchenware","https://t.me/Arash71tj"]`.
- Source: FrontEnd/app/[locale]/page.tsx lines 80-88 (a `TODO(luca)` comment is present).
- Impact: Google receives conflicting entity signals that tie the dental store to a kitchenware Instagram account and a personal Telegram handle. This is a direct trust and entity-confusion problem.
- Fix: Replace these with the owner's real email, phone and social profiles, plus a full PostalAddress (city, street). If a real value is not yet available, leave the field out rather than keep a wrong one. Add `logo`.
- Verify: The SSR HTML of /fa contains no "rooshak" or "roshak". Rich Results Test shows the correct Organization details.

### C-04 High: An internal service account is published as a public "supplier"
- Evidence: https://lucaloupe.ir/fa/suppliers/content-admin "Service account for automated SEO blog pipeline". The page is in sitemap.xml along with its /en twin. /fa/suppliers/رها is an empty supplier stub with the English meta "Luca Loupe — dental loupes store".
- Impact: Tells users and raters that the blog is produced by an automated pipeline. That undercuts the Experience and Expertise of any future articles and leaks internal details.
- Fix: Remove or deactivate the content-admin supplier in the backend. Exclude suppliers with 0 products from sitemap.ts and set them `noindex`. Use a real human author profile for articles.
- Verify: /fa/suppliers/content-admin returns 404/410 or noindex and is absent from sitemap.xml.

### C-05 High: No pillar guide, no blog posts, and no cluster articles
- Evidence: https://lucaloupe.ir/fa/blog "مقاله‌ای یافت نشد". The meta promises "راهنمای انتخاب، استفاده و نگهداری لوپ".
- Impact: CLAUDE.md names educational and comparison content as the main acquisition engine. Right now there is none. Uncovered clusters: قیمت لوپ، گالیله‌ای، ۲.۵/۳.۵ برابر، فاصله کاری measurement، کمردرد/ارگونومی، لوپ برای دانشجو.
- Fix: Publish the pillar «راهنمای انتخاب لوپ دندانپزشکی» (2,500+ words) with spokes: TTL یا فلیپ‌آپ، گالیله‌ای یا پریزماتیک، نحوه اندازه‌گیری فاصله کاری، لوپ برای دانشجو، بزرگنمایی ۲.۵ یا ۳.۵، لوپ و ارگونومی. Each article needs a named author with dental credentials (supplied by the owner), a date, sources, and links to the matching category and product pages.
- Verify: /fa/blog lists posts. The pillar URL returns 200, links to all four categories and at least one product, and every spoke links back to the pillar.

### C-06 High: No visible contact details. "تماس با ما" opens a B2B form
- Evidence: Header "تماس با ما" and homepage "راه‌های تماس و همکاری با لوکا" both link to https://lucaloupe.ir/fa/cooperation, which is a form for suppliers, wholesale buyers and resellers ("تأمین کالا، خرید عمده یا نمایندگی فروش"). No page shows a phone number, address, working hours or an e-Namad/Samandehi badge.
- Impact: Fails basic YMYL-adjacent trust checks for an expensive purchase. Iranian buyers also look specifically for e-Namad.
- Fix: Build a real /fa/contact page with phone, WhatsApp, address or showroom, hours and a map, and add these to the footer. Show the e-Namad badge once it is issued. Keep /fa/cooperation for B2B only.
- Verify: The footer of every page shows a phone and address. The "تماس با ما" link points to /fa/contact.

### C-07 High: No proof of official dealership or Korean origin
- Evidence: Korea appears only in the placeholder "[سال تأسیس] — کره جنوبی" (/fa/story). The hero subtitle in fa.json mentioning Korea is replaced by "زیرا چشمان شما لایق بهترین دقت است". https://lucaloupe.ir/fa/suppliers "تأمین‌کننده‌ای یافت نشد", yet the header link "نمایندگی‌ها" points to it.
- Impact: "Made in South Korea" and "official dealer" are the differentiators named in CLAUDE.md. The site shows neither, and its "dealers" page is empty.
- Fix: The owner should supply the manufacturer's legal name, a dealership or import certificate (image), warranty-card details and the after-sales process. Add a "اصالت کالا و گارانتی" section or page. Hide the "نمایندگی‌ها" link until real dealers exist.
- Verify: An authenticity/warranty page exists, links from product pages and shows a certificate image with descriptive Persian alt text.

### C-08 High: Unsourced ergonomic and medical claims
- Evidence: https://lucaloupe.ir/fa/story "لوپ خوب وضعیت نشستن را اصلاح می‌کند". The same page says "فشار از گردن و شانه برداشته شود". /fa/categories/ergonomic-loupes-5 "برای کاهش فشار روی گردن و کمر در کارهای طولانی". The ergonomic title reads "وضعیت صاف گردن، فشار کمتر".
- Impact: These are health-outcome claims written as certainties. The project rules require cautious wording with sources.
- Fix: Soften them, for example "می‌تواند به حفظ وضعیت خنثی گردن کمک کند". Cite peer-reviewed ergonomics studies on loupes and declination angle in the future ergonomics article. Add a line saying loupes do not replace treatment for existing musculoskeletal pain.
- Verify: Every sentence about neck or back pain has a hedge and a linked source. No sentence uses absolute verbs such as "اصلاح می‌کند" or "برداشته شود".

### C-09 Medium: Optical spec claims with no catalogue source
- Evidence: /fa/categories/prismatic-loupes-4 "بزرگ‌نمایی ۴ تا ۶ برابر" (repeated in the title and meta). Homepage "تصویری روشن و بدون اعوجاج در تمام میدان دید". The brand page says the range includes "گالیله‌ای و پریزماتیک" and "TTL و Flip-up", but there is no Galilean category.
- Impact: The project rule is never to guess specs. "4-6x" and "distortion-free across the full field" must match the Luca catalogue or be removed.
- Fix: The owner confirms magnification ranges and coating claims against the official catalogue. Add a Galilean category, or reword the brand text, so the taxonomy matches.
- Verify: Each numeric or optical claim on category pages maps to a catalogue page reference kept on file.

### C-10 Medium: Category pages are thin, have no products, and show an "SEO summary" box
- Evidence: Each category page has about 140-210 words, "زیر دسته بندی ای وجود ندارد", "تامین کننده ای وجود ندارد", and a visible aside labelled "خلاصه سئو" that repeats the meta title and description (component SeoHighlight.tsx, key `seoSummary`).
- Impact: The visible "SEO summary" label reads as a developer artifact and wastes the strongest position on the page. Empty "no sub-category / no supplier" messages add noise.
- Fix: Remove the SeoHighlight aside, or rename it and turn it into a real intro without the label. Hide empty sub-category and supplier blocks. Expand each category to 500+ words: who it suits, a comparison table against the other types (only specs the owner confirms), a choosing checklist and links to the guides. Keep the FAQs, which are the best content on the site.
- Verify: The SSR HTML contains no "خلاصه سئو". Each category has more than 500 main-content words and at least one product card.

### C-11 Low: Persian readability and copy consistency
- Readability is good overall: short sentences, clear explanations, correct use of ZWNJ in most body text (82 ZWNJ on the homepage).
- Issues:
  - "دندانپزشکی" (site title, homepage meta) and "دندان‌پزشکی" (category titles) are mixed. Pick one form site-wide; "دندانپزشکی" matches the planned keywords.
  - The English tagline has a grammar error: "because your eye deserve precision" should be "eyes deserve".
  - The hero line "زیرا چشمان شما لایق بهترین دقت است" reads as a literal translation.
  - /fa/sitemap shows generic labels: "برند 1", "دسته 2".
  - Spacing: "دسته بندی" (without ZWNJ) is used in several labels.
- Verify: A grep shows a single spelling form across fa.json, and the tagline is corrected.

### C-12 Low: Freshness signals are artificial
- Evidence: sitemap.xml gives every URL `lastmod` 2026-10-18T07:13 (build time). The parsed `publication_date` is 2026-01-01 on every page.
- Fix: Take lastmod from each entity's API `updatedAt`. Show visible "تاریخ انتشار/به‌روزرسانی" on articles.
- Verify: lastmod differs per URL and matches the last real edit.

---

## On-Page findings

### O-01 High: Broken internal links on high-value spots
- The hero CTA "مشاهده مجموعه" on https://lucaloupe.ir/fa links to /fa/products/1, which returns 404 (the link comes from the slider banner data).
- "برو به دسته بندی والد" on all four category pages links to /fa/categories/1, which returns 404 (categoryTemplate/index.tsx line 41 uses parentCategoryId=1, the hidden root).
- Fix: Point the hero CTA to /fa/products or the guide. Do not render the parent link when the parent is the root category.
- Verify: A crawl of /fa returns 0 internal 4xx links.

### O-02 Medium: Wrong anchor targets
- "آشنایی با لوپ‌های ارگونومیک" links to /fa/products (empty), not /fa/categories/ergonomic-loupes-5 (landingFeatures.tsx line 13, `href: 'products'`).
- "نمایندگی‌ها" links to an empty /fa/suppliers. "تماس با ما" links to the B2B form (see C-06).
- Fix: Retarget these links as described. Verify: each anchor's destination matches its text.

### O-03 Medium: Heading order. An H2 comes before the H1 on category and brand pages
- Evidence: On /fa/categories/ttl-loupes-3 the first heading is H2 "خرید لوپ TTL دندان‌پزشکی | سفارشی..." and the H1 "لوپ TTL" follows it. /fa/brands/luca-loupe-1 has the same pattern.
- The H1s themselves are too short to target the head term: "لوپ TTL", "لوپ فلیپ‌آپ". The homepage H1 "دقت، در امتداد نگاه شما" is a slogan with no keyword. Footer column labels are all H2s, so every page carries 5 extra H2s.
- Fix: Make the H1 descriptive, for example "لوپ TTL دندانپزشکی" or "لوپ دندانپزشکی لوکا، ساخت کره جنوبی" on the homepage. Remove the SEO-summary H2. Change footer headings to non-heading elements or `<p>`.
- Verify: The first heading in the DOM is the H1, and each page has exactly one H1 that includes its main keyword.

### O-04 Medium: Empty and stub pages are indexable and listed in the sitemap
- /fa/blog, /fa/faq, /fa/tags, /fa/discounts, /fa/suppliers and the supplier stubs return 200 with "یافت نشد" content, and all appear in sitemap.xml. This is a soft-404 risk.
- Fix: Set `noindex` and remove them from sitemap.ts while they have 0 items. Re-add them automatically when the count is above 0.
- Verify: sitemap.xml lists only URLs that have content. Search Console shows no "Soft 404".

### O-05 Low: Title and meta details
- Titles are unique and keyword-led on category pages, but they run 69-71 characters including " | Luca Loupe", so they truncate in the SERP. Trim the second clause or drop the brand suffix on long ones.
- Generic titles and metas: /fa/brands "برندهای موجود در فروشگاه را اینجا ببینید." /fa/products title "لوپ‌ها و هدلایت‌ها" has no "خرید/قیمت".
- Persian pages with English metas: /fa/suppliers/content-admin, /fa/suppliers/رها.
- Raw `<html lang="fa">` has no `dir="rtl"` attribute (dir appears later in the DOM). CLAUDE.md requires both on `<html>`.
- Verify: Titles are at most about 60 characters, every /fa page has a Persian meta, and `<html lang="fa" dir="rtl">` appears in the SSR HTML.

### O-06 Low: Social links go to bare root domains
- Footer: https://instagram.com, https://t.me, https://youtube.com, https://wa.me with no handle.
- Fix: Use the real profile URLs, or remove the links. Verify: every footer social href includes a handle.

---

## AI citation readiness (20/100)
- Positives: Category FAQs use clear question-and-answer pairs with FAQPage schema, so they are quotable. BreadcrumbList is present.
- Gaps: No numeric facts (prices, weights, working-distance ranges, warranty months), no tables, no dated or authored articles, no product entity, and no consistent brand entity because the schema contacts are wrong.
- Fix: Add spec tables with owner-confirmed numbers, a "در یک نگاه" summary box at the top of each guide, and Product plus Article schema with author.

## Gaps the owner must supply (do not invent)
1. Warranty duration and terms, return window, COD terms, payment methods, and the free-shipping threshold.
2. Real dentist testimonials: name, specialty, product, consent. A real product video (aparat or YouTube) with the real channel URL.
3. Manufacturer legal name in Korea, dealership or import proof, founding year, number of countries.
4. Full spec sheets per model from the official catalogue, plus prices.
5. Real phone, address, email, social handles, and the e-Namad status.
6. A named author or clinical reviewer with credentials for the articles.

## Structured findings (audit-data.json, category "Content Quality")

```json
{
  "category": "Content Quality",
  "score": 22,
  "onpage_score": 48,
  "eeat": {"experience": 8, "expertise": 32, "authoritativeness": 8, "trustworthiness": 12, "composite": 15},
  "ai_citation_readiness": 20,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}},
  "findings": [
    {"id": "C-01", "severity": "critical", "title": "Placeholder text live on homepage and story", "url": "https://lucaloupe.ir/fa"},
    {"id": "C-02", "severity": "critical", "title": "Zero products; product URLs 404", "url": "https://lucaloupe.ir/fa/products"},
    {"id": "C-03", "severity": "critical", "title": "Organization JSON-LD uses rooshak/kitchenware contacts", "url": "https://lucaloupe.ir/fa"},
    {"id": "C-04", "severity": "high", "title": "content-admin service account exposed as supplier", "url": "https://lucaloupe.ir/fa/suppliers/content-admin"},
    {"id": "C-05", "severity": "high", "title": "No pillar guide or blog posts", "url": "https://lucaloupe.ir/fa/blog"},
    {"id": "C-06", "severity": "high", "title": "No visible contact info; contact link goes to B2B form", "url": "https://lucaloupe.ir/fa/cooperation"},
    {"id": "C-07", "severity": "high", "title": "No dealership or Korean origin proof", "url": "https://lucaloupe.ir/fa/story"},
    {"id": "C-08", "severity": "high", "title": "Unsourced ergonomic health claims", "url": "https://lucaloupe.ir/fa/categories/ergonomic-loupes-5"},
    {"id": "C-09", "severity": "medium", "title": "Optical specs without catalogue source", "url": "https://lucaloupe.ir/fa/categories/prismatic-loupes-4"},
    {"id": "C-10", "severity": "medium", "title": "Thin categories with visible SEO-summary box", "url": "https://lucaloupe.ir/fa/categories/ttl-loupes-3"},
    {"id": "C-11", "severity": "low", "title": "Spelling inconsistency and tagline grammar", "url": "https://lucaloupe.ir/fa"},
    {"id": "C-12", "severity": "low", "title": "Artificial lastmod freshness", "url": "https://lucaloupe.ir/sitemap.xml"},
    {"id": "O-01", "severity": "high", "title": "Hero CTA and parent-category links 404", "url": "https://lucaloupe.ir/fa"},
    {"id": "O-02", "severity": "medium", "title": "Anchors pointing to wrong or empty pages", "url": "https://lucaloupe.ir/fa"},
    {"id": "O-03", "severity": "medium", "title": "H2 before H1; weak H1s; footer H2s", "url": "https://lucaloupe.ir/fa/categories/ttl-loupes-3"},
    {"id": "O-04", "severity": "medium", "title": "Empty pages indexable and in sitemap", "url": "https://lucaloupe.ir/fa/faq"},
    {"id": "O-05", "severity": "low", "title": "Long titles, generic metas, missing dir=rtl on html", "url": "https://lucaloupe.ir/fa/brands"},
    {"id": "O-06", "severity": "low", "title": "Social links to bare domains", "url": "https://lucaloupe.ir/fa"}
  ]
}
```
