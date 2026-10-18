# SXO Findings: lucaloupe.ir (Search Experience)

Date: 2026-10-18. Scope: Persian (/fa) pages. Report only; nothing on the site was changed.
The SXO Gap Score is separate from the SEO Health Score.

## Key finding

Every commercial query in the target set (لوپ دندانپزشکی، قیمت لوپ دندانپزشکی، خرید لوپ، لوپ TTL) has a SERP made of Iranian dental-equipment **category pages that list products with Toman prices, followed by a 1,500 to 2,500 word buying guide and an FAQ**. Torob product listings with prices also appear. lucaloupe.ir has no page of that type that actually works:
- /fa/products shows "محصولی یافت نشد" (no products found) and has 24 words.
- The four category pages list 0 products.
- The homepage hero CTA goes to /fa/products/1, which returns 404.
- The sitemap contains no product or post URLs.

The informational queries (TTL یا فلیپ‌آپ، گالیله‌ای یا پریزماتیک، لوپ برای دانشجو) have SERPs made of blog guides and comparisons. /fa/blog shows "مقاله‌ای یافت نشد" (no articles found).

So there is a page-type mismatch on every query: the site has no page of the type Google rewards, or has one that is empty. On top of that, the homepage displays template placeholders where the warranty, returns, payment terms and testimonials should be. Its OnlineStore schema also carries the contact identity of another business (rooshak / roshak_kitchenware). For a high-ticket, research-heavy purchase these are trust breakers.

Performance is not the problem: PageSpeed mobile is 100 and desktop is 99 (pagespeed.json).

## SERP analysis per query

Sources: DuckDuckGo html with region `ir-fa` for Q1 and Q2 (10 organic results each). After that DDG rate-limited the requests (anomaly page). WebSearch (standard and extended) covered the rest. No direct Google SERP, PAA, ads or AI Overview data was available (see Limitations).

| # | Query | Top results observed | Dominant SERP type (taxonomy) | Confidence | Page lucaloupe.ir would rank | Its state | Mismatch |
|---|---|---|---|---|---|---|---|
| Q1 | لوپ دندانپزشکی | torob.com/p/... (Exp, product), medickala.com category, partakdental.com category, arsendental.ir category ("نقد و اقساط بلند مدت"), dornikasalamat.com/loop, hamindental.com category, hamindental.com/بهترین-لوپ (listicle guide), sohadent.com category, dentouth.ir category, tavadent.com category | Product (category or PLP variant with an embedded guide) | 9/10 = 90% (1 listicle) | /fa (homepage, Landing type) or /fa/products | /fa: landing page with no products. /fa/products: empty | **CRITICAL** |
| Q2 | قیمت لوپ دندانپزشکی | Same retailer set. torob shows "لوپ ... Exp با بزرگ نمایی 3.5 ... ۱۴٫۰۰۰٫۰۰۰ تومان". medickala FAQ "قیمت لوپ دندانپزشکی به چه عواملی بستگی دارد؟" | Product (PLP with prices) | 9/10 = 90% | /fa/products | No price anywhere on the site (no "تومان" string outside the JS i18n bundle) | **CRITICAL** |
| Q3 | خرید لوپ / خرید لوپ دندانپزشکی | partakdental, hamindental, tavadent, avadental, nutrident category, tukateb product page (Gavouz X4 Semi TTL, 110,000,000 Toman), dentateb product (Orange Dental Opt-on, about 125M Toman) | Product (PLP plus product detail pages) | about 85% | /fa/products | Empty. The only linked product URL (/fa/products/1) returns 404 | **CRITICAL** |
| Q4 | لوپ TTL | tukateb.com Semi TTL product, partakdental/hamindental/tavadent categories, dandanet.com/لوپ-Loupe guide, lumadent TTL-vs-flip-up blog (EN) | Product (PLP/PDP) about 70%, Comparison/Blog about 30% | about 70% | /fa/categories/ttl-loupes-3 | Category type matches, but it lists 0 products, has about 200 words and shows the empty states "زیر دسته بندی ای وجود ندارد" and "تامین کننده ای وجود ندارد". The 4-question FAQ is good | **HIGH** |
| Q5 | لوپ فلیپ‌آپ / فلیپ آپ یا TTL | For the comparison form: azadmed.com news article, dandanet guide, younit-app.com/blog, godza.ir/what-is-a-dental-loupe, dentateb.ir/blog/best-dental-loupe. The head term on WebSearch was polluted with "flipper tooth" results | Blog/Comparison for "فلیپ‌آپ یا TTL" (5/5). Head term probably PLP (low confidence) | 100% for the comparison form, low for the head term | /fa/categories/flip-up-loupes-2 | Empty category with no comparison content | **HIGH** |
| Q6 | لوپ گالیله‌ای یا پریزماتیک | Persian SERP is weak: the results are about telescopes (Nikon binocular guide, USPTO, arxiv). In English, every result is a comparison blog (dentalproductshopper, loupedirect, illuco, proloupes, optident) | Comparison (blog with a table) | about 90% (EN). The Persian SERP is underserved, so this is an **opportunity** | /fa/categories/prismatic-loupes-4 (no Galilean category exists) | Prismatic category FAQ partly answers the question ("چه زمانی لوپ پریزماتیک انتخاب بهتری است؟"). No comparison page, no Galilean page | **HIGH** (gap plus opportunity) |
| Q7 | لوپ برای دانشجوی دندانپزشکی | partakdental.com/dental-loupe-buying-guide, dornikadentall.com/بهترین-لوپ..., dornikadentall راهنمای جامع 2025, dentateb.ir/blog/best-dental-loupe, nutrident.co/راهنمای-خرید-ارزان‌ترین-لوپ, khabaronline "5 لوپ برتر", ensafnews "3 برند برتر" | Blog (buying guide / listicle Comparison) | about 85% | Nothing. At best /fa | No page exists. Blog is empty | **CRITICAL** |

SERP-level patterns that matter for SXO:
- Ranking retailer category pages put the product grid with prices first, then long guide sections. medickala, the #2 result for Q1, has about 2,257 words, 41 images, CollectionPage + BreadcrumbList schema, and H2/H3 sections such as "انواع لوپ"، "بزرگنمایی مناسب"، "قیمت لوپ دندانپزشکی"، "تفاوت لوپ TTL و Flip Up چیست؟"، "آیا استفاده از لوپ دندانپزشکی برای دانشجویان نیز مناسب است؟"، "لوپ دندانپزشکی دارای هدلایت چه مزیتی دارد؟".
- Commercial modifiers that show up in titles and snippets: "نقد و اقساط بلند مدت" (arsendental), "ضمانت اصالت، مشاوره تخصصی" (dornika), "پشتیبانی 24 ساعته و خدمات پس از فروش" (hamindental), and a phone number for ordering (avadental).
- A Korean competitor brand already has a reputation: JTL/Mediplus (Korea) is described as "یکی از بهترین لوپ های دندانپزشکی در بازار ایران" (fardadtajhiz / hamindental). Luca is also Korean, so "لوپ کره‌ای" comparison content has a natural angle. Keep it fair, per the project rules.

## Target pages: classification and evidence

| Page | Taxonomy type | Words | Schema | Notable evidence |
|---|---|---|---|---|
| /fa | Landing Page | 575 | OnlineStore, WebSite, SearchAction | H1 "دقت، در امتداد نگاه شما" has no keyword. Hero CTA "مشاهده مجموعه" goes to /fa/products/1 (404). "منتخب لوکا" carousel is empty. "پیشنهاد ویژه امروز" shows "پیشنهادی موجود نیست". Placeholders are shown publicly (listed below). English line "because your eye deserve precision" is ungrammatical |
| /fa/products | Product listing (empty) | 24 | CollectionPage (no ItemList) | "محصولی یافت نشد" |
| /fa/categories/* (4) | Product listing (empty) + FAQ | about 200 | BreadcrumbList, FAQPage | 0 products. Empty-state strings are visible. No Galilean or headlight category, although the brand page says Luca makes Galilean loupes and LED headlights |
| /fa/blog | Blog index (empty) | 15 | none | "مقاله‌ای یافت نشد" |
| /fa/faq | FAQ (empty) | small | n/a | "هنوز سوالی ثبت نشده است" |
| /fa/story | About | small | n/a | Placeholders: [سال تأسیس], [نقل‌قول از بنیان‌گذار ...], [نام و سمت], [سال], [تعداد], [مدت] |
| /fa/cooperation | B2B form | small | n/a | Every "رزرو وقت مشاوره" consultation CTA lands here, but the copy reads "تأمین کالا، خرید عمده یا نمایندگی فروش" (supply, wholesale, dealership) and the form requires an address |
| /fa/brands/luca-loupe-1 | Brand page | small | n/a | H2s "محصولات برند" and "دسته‌بندی‌ها" are empty |
| /fa/products/1 | n/a | n/a | n/a | HTTP 404 |

Placeholders live on /fa (they are in the server HTML, so Google indexes them): `[روش‌های پرداخت]`, `[مدت و شرایط گارانتی]`, `[شرایط پرداخت در محل]`, `[مهلت و شرایط بازگشت کالا]`, `[نظر مشتری ۱]`...`[نظر مشتری ۳]`, `[نام مشتری]`, `[نقل‌قول مشتری ۱]`...`[۳]`, `[نام و تخصص]`, `[محصول]`.

Wrong entity data in the /fa OnlineStore JSON-LD: `"email": "info@rooshak.ir"`, `"sameAs": ["https://instagram.com/roshak_kitchenware", "https://t.me/Arash71tj"]`. Footer social links are bare domains (`https://instagram.com`, `https://t.me`, `https://youtube.com`, `https://wa.me`). The page has no visible phone number and no `tel:` link.

## SXO Gap Score (7 dimensions, 100 points)

### /fa/products for Q1 to Q3 (the money page): **15/100**
| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 3/15 | Right type in name only (PLP), but it lists 0 products. The SERP's #1 type is a PLP with prices |
| Content Depth | 1/15 | 24 words, against about 2,257 on medickala |
| UX Signals | 4/15 | Fast (PSI 100) and the header has a consultation CTA, but the page is an empty dead-end |
| Schema | 3/15 | CollectionPage only. No ItemList, Product or Offer |
| Media | 0/15 | 0 images |
| Authority | 2/15 | No reviews, warranty or dealer proof. The sitewide Org schema points to another brand |
| Freshness | 2/10 | No dates or "updated" signal. Prices, which carry freshness in this SERP, are absent |

### /fa (homepage) for Q1: **31/100**
Page Type 6/15 (Landing page where the SERP wants a PLP). Content Depth 4/15 (575 words, no guide or spec content). UX 6/15 (fast, but the hero CTA 404s and two modules are empty). Schema 6/15 (OnlineStore + WebSite present, wrong email and sameAs). Media 6/15 (6 images, no product photos or video). Authority 1/15 (placeholder testimonials and warranty text actively undermine trust). Freshness 2/10.

### /fa/categories/ttl-loupes-3 for Q4: **30/100**
Page Type 7/15 (category type, 0 products). Content Depth 4/15 (about 200 words plus 4 solid FAQ answers). UX 5/15 (empty-state strings, no next step except the header CTA). Schema 7/15 (BreadcrumbList + FAQPage are valid. No ItemList or Product). Media 3/15 (1 image). Authority 2/15. Freshness 2/10.

### Queries Q5 to Q7 (comparison and student guides): **no target page exists**, scored 0 to 10/100. The only partial coverage is in the category FAQs.

## User stories (derived from observed SERP signals)

1. **Decision, practicing dentist.** As a general dentist ready to buy, I want to see models, magnification options and a Toman price on one page, because I'm comparing several stores this week. I'm blocked because Luca shows no products and no prices: /fa/products is empty and the hero CTA returns 404.
   *Signal:* 9/10 Q1 results are PLPs with prices. torob shows "۱۴٫۰۰۰٫۰۰۰ تومان". medickala FAQ "قیمت لوپ دندانپزشکی به چه عواملی بستگی دارد؟".
2. **Consideration, budget.** As a final-year student, I want to know which magnification and type suits a student (2.5x, TTL or flip-up) and whether installments exist, because a loupe is one of my biggest purchases. I'm blocked because Luca has no student guide, no prices and no payment terms ("[روش‌های پرداخت]" is a placeholder).
   *Signal:* Q7 SERP is all guides: nutrident "راهنمای خرید ارزان‌ترین لوپ", partak buying guide, medickala FAQ "آیا ... برای دانشجویان نیز مناسب است؟". arsendental's title says "نقد و اقساط بلند مدت". The search synthesis recommends 2.5x for students.
3. **Consideration, any dentist.** As a dentist choosing between TTL and flip-up, I want a side-by-side comparison of weight, field of view, sharing and price, because I can't try both before buying. I'm blocked because Luca only has short category blurbs and no comparison page.
   *Signal:* Q5 SERP is all comparison and blog content (azadmed, younit blog, dentateb blog, godza). lumadent "TTL vs flip-up" ranks for Q4.
4. **Decision, specialist.** As an endodontist or surgeon, I want prismatic options at 4 to 6x with a matching headlight, plus the exact specs (working distance, depth of field, weight), because image quality at high magnification decides my outcomes. I'm blocked because the prismatic category has no products, no spec table and no headlight category.
   *Signal:* sohadent snippet "مناسب ایمپلنت، اندو، جراحی". medickala H3 "لوپ دندانپزشکی دارای هدلایت چه مزیتی دارد؟". English Q6 SERP is comparison blogs. The Persian Q6 SERP is unserved.
5. **Awareness to decision, risk-averse buyer.** As a dentist spending 10 to 125 million Toman, I want proof of authenticity, a real warranty, an official dealer and real reviews from colleagues, because counterfeits and imports with no after-sales support are common. I'm blocked because the warranty, returns and testimonials on Luca are literal placeholders and the store's schema names a kitchenware brand.
   *Signal:* dornika "ضمانت اصالت، مشاوره تخصصی", hamindental "خدمات پس از فروش", the search synthesis note on imported Chinese models and the advice to check warranty, sharghdaily advice to buy from reputable sellers.

Journey stages covered: awareness, consideration, decision.

## Persona scoring (Relevance / Clarity / Trust / Action, 25 each)

Sorted weakest first.

| Persona | Landing page they'd hit | Rel | Clar | Trust | Action | Total |
|---|---|---|---|---|---|---|
| Final-year student on a budget (Q7, Q2) | /fa (no student page exists) | 3 | 4 | 3 | 5 | **15/100** |
| Practicing general dentist (Q1 to Q3) | /fa or /fa/products | 10 | 6 | 3 | 7 | **26/100** |
| Specialist / surgeon (endo, perio, implant) (Q6, prismatic) | /fa/categories/prismatic-loupes-4 | 12 | 9 | 3 | 6 | **30/100** |

**Student (15).**
- Relevance 3: nothing addresses students. Clarity 4: no magnification guidance on /fa.
- Trust 3: placeholders, no price.
- Action 5: the only CTA is a B2B form that requires an address.
- *Improve:* publish a guide at /fa/blog/loupe-for-dental-students covering 2.5x vs 3.5x, TTL vs flip-up for students, and budget. It needs price ranges from the owner's real price list and installment terms if they exist. Add a "student" entry point (a homepage module or filter). Add a lightweight CTA: "مشاوره رایگان انتخاب لوپ برای دانشجو" with phone and WhatsApp. If a student discount exists, state it with its real conditions.

**Practicing dentist (26).**
- Relevance 10: the title targets "خرید لوپ دندانپزشکی", but there are no products.
- Clarity 6: category blurbs are clear but there are no prices or models.
- Trust 3: placeholders and the wrong-brand schema.
- Action 7: the "رزرو وقت" CTA is visible in the header, but it lands on a wholesale form.
- *Improve:* publish products with SSR detail pages, prices or "از ... تومان", and a spec table taken from the official catalog only. Replace the placeholders with the real warranty, return and payment terms. Add a dedicated consultation booking page and a visible `tel:` link with the real WhatsApp number.

**Specialist (30).**
- Relevance 12: the prismatic FAQ really does answer "when prismatic" and "do I need a headlight".
- Clarity 9: no spec table, no 4x/5x/6x options listed.
- Trust 3. Action 6.
- *Improve:* add prismatic product pages with additionalProperty specs (magnification, working distance, depth of field, weight, all from the catalog). Add a headlight category and products. Write a Galilean vs prismatic comparison article with a table. The Persian SERP for it is effectively empty, so it is a fast win. Add real specialist testimonials only if the owner supplies them.

## Findings (severity, evidence, fix, verification)

### SXO-01 CRITICAL: No product is reachable or indexable, but every commercial SERP expects a PLP with prices
- **Evidence:** /fa/products says "محصولی یافت نشد" (24 words). The 4 category pages have 0 products. /fa/products/1 returns 404 and is the target of the hero CTA. sitemap-urls.txt has 36 URLs and none are products or posts. Q1 to Q3 SERPs are 85 to 90% priced product listings.
- **Fix:** Find out whether the products are missing or unpublished in the ASP.NET API, or whether the Next.js data fetch returns empty at build or ISR time. The response header shows `x-nextjs-cache: STALE` with a 31,535,940 s stale-while-revalidate window, so a stale prerender from a time when the catalog was empty is plausible. Publish the real products with server-rendered detail pages that have slug URLs. Render the category grids server-side. Add products to app/sitemap.ts. Do this on its own branch and merge only with the owner's approval, per CLAUDE.md.
- **Verify:** `curl -s https://lucaloupe.ir/fa/products | grep -c "<product name>"` > 0 in the raw HTML. Every product URL returns 200. The sitemap includes /fa/products/<slug>. The Rich Results Test detects Product + Offer.

### SXO-02 CRITICAL: Template placeholders are shown publicly where trust content should be
- **Evidence:** Homepage "چرا لوکا؟", "چرا دندانپزشکان به لوکا اعتماد می‌کنند؟" and "از زبان دندانپزشکان" show `[مدت و شرایط گارانتی]`, `[مهلت و شرایط بازگشت کالا]`, `[روش‌های پرداخت]`, `[نقل‌قول مشتری ۱]`, `[نام و تخصص]`. /fa/story shows `[سال تأسیس]`, `[تعداد]`, `[مدت]`.
- **Fix:** Get the real warranty, return and payment terms and company facts from the owner. Until they exist, hide those blocks with a conditional render. Testimonials must be real ones supplied by the owner (CLAUDE.md forbids invented reviews).
- **Verify:** `curl -s https://lucaloupe.ir/fa https://lucaloupe.ir/fa/story | grep -cE '\[(نظر|نقل|نام|مدت|مهلت|روش|شرایط|سال|تعداد|محصول)'` returns 0.

### SXO-03 CRITICAL: Organization/OnlineStore schema carries another business's identity
- **Evidence:** /fa JSON-LD has `"email": "info@rooshak.ir"` and `"sameAs": ["https://instagram.com/roshak_kitchenware", "https://t.me/Arash71tj"]`. It has no street address.
- **Fix:** Replace these with Luca's real email, Instagram, Telegram, YouTube and WhatsApp, and add the dealer or legal name and address supplied by the owner. Point the footer social links at the same real profiles (they are bare domains now).
- **Verify:** `grep -c rooshak` = 0 on all pages. The schema validator shows the correct sameAs. Footer hrefs contain profile paths.

### SXO-04 HIGH: The consultation CTA, the main conversion path, lands on a B2B wholesale form
- **Evidence:** Every "رزرو وقت مشاوره" / "ثبت درخواست" link goes to /fa/cooperation. Its copy says "تأمین کالا، خرید عمده یا نمایندگی فروش" and the address field is required. There is no visible phone number and no `tel:` link. The WhatsApp link is the bare `https://wa.me`.
- **Fix:** Create a dedicated consultation booking page (for example /fa/consultation). Fields: name, mobile, role (dentist, student, specialist), preferred time, and in-person or online measurement. No address required. Add a click-to-call phone number and a real WhatsApp deep link in the header and on product and category pages.
- **Verify:** Consultation CTAs resolve to the new page. A test submission arrives. `grep -c 'href="tel:'` ≥ 1 sitewide.

### SXO-05 HIGH: Empty modules and dead ends make the store look abandoned
- **Evidence:** Hero "مشاهده مجموعه" goes to a 404. The "منتخب لوکا" tabs are empty. "پیشنهاد ویژه امروز" says "پیشنهادی موجود نیست" under "فقط تا پایان امروز...". /fa/faq says "هنوز سوالی ثبت نشده است". Categories show "زیر دسته بندی ای وجود ندارد" and "تامین کننده ای وجود ندارد". Brand page H2s are empty.
- **Fix:** Render modules only when they have data. Point the hero CTA at /fa/products or the TTL category. Fill /fa/faq with the existing category FAQ content plus purchase questions (measurement, delivery time, warranty) using owner-confirmed answers.
- **Verify:** No "وجود ندارد", "یافت نشد" or "موجود نیست" strings in the server HTML of /fa, /fa/faq or category pages. The hero CTA returns 200.

### SXO-06 HIGH: The comparison and guide content that Q5 to Q7 reward is missing
- **Evidence:** /fa/blog is empty. Q5 and Q7 SERPs are 85 to 100% guide or comparison pages. The Q6 Persian SERP has no relevant Persian loupe result.
- **Fix:** Build the pillar "راهنمای انتخاب لوپ دندانپزشکی" plus cluster posts: TTL یا فلیپ‌آپ (with a comparison table), گالیله‌ای یا پریزماتیک (table), نحوه اندازه‌گیری فاصله کاری, لوپ برای دانشجو. Each post needs an author (a real dentist reviewer if available), dates, Article schema, and internal links to the matching category or product. Ergonomics and back-pain claims must stay cautious and sourced. Use `/seo content-brief` for each.
- **Verify:** The posts return 200 and are in the sitemap. GSC shows impressions for the Q5 to Q7 queries within 4 to 8 weeks.

### SXO-07 HIGH: No price signal on a price-led SERP
- **Evidence:** There is no Toman figure anywhere in the visible content. Competitors and torob show prices (from 14,000,000 to about 125,000,000 Toman). CLAUDE.md lists Torob presence as a priority, and Torob requires prices.
- **Fix:** Show the real price, or "شروع قیمت از ..." for custom builds, using owner-supplied figures. Add an Offer to the Product schema. State installment or credit terms if they exist. Then list the products on Torob.
- **Verify:** The price is in the raw HTML of PLP and PDP pages. The Rich Results Test shows Offer.price with priceCurrency IRR. The Torob listing is live.

### SXO-08 MEDIUM: The taxonomy doesn't match how searchers segment the products
- **Evidence:** Categories are flip-up, TTL, prismatic and ergonomic. There is no Galilean or headlight (هدلایت) category, although the homepage title, the brand copy and the medickala SERP all feature headlights and Galilean loupes. No spec table exists (magnification, working distance, weight).
- **Fix:** Add Galilean and LED headlight categories, and consider magnification facets (2.5x / 3.5x / 4 to 6x). Add a spec table to every product from the official catalog. Do not guess specs; ask the owner when data is missing.
- **Verify:** The new category URLs return 200 with products, and the sitemap is updated.

### SXO-09 MEDIUM: Category pages are thin compared with the SERP norm
- **Evidence:** About 200 words plus 4 FAQs on Luca, against about 2,257 words with 9 H2 guide sections on medickala (#2 for Q1).
- **Fix:** Keep the existing FAQ, which is substantive and has valid FAQPage schema. Below the product grid add 600 to 1,200 words: who this type suits, a magnification guide, how measurement works at Luca, warranty and after-sales, and links to the cluster posts.
- **Verify:** Word count in the raw HTML. Category rankings for Q4 in GSC.

### SXO-10 LOW: Homepage hero copy
- **Evidence:** The H1 "دقت، در امتداد نگاه شما" contains no keyword. The English line "because your eye deserve precision" is ungrammatical (should be "your eyes deserve").
- **Fix:** Use an H1 such as "لوپ و هدلایت دندانپزشکی لوکا، ساخت کره جنوبی" with the slogan as a subtitle. Fix the English grammar.
- **Verify:** The H1 in the raw HTML.

### Note for the technical agent (not SXO)
The HTTP `Link` header sets x-default to `https://lucaloupe.ir/categories/ttl-loupes-3` (no locale), while the HTML sets it to /fa/... These are inconsistent.

## Cross-skill recommendations
- `/seo schema`: Product + Offer + additionalProperty, a corrected Organization, ItemList on PLPs.
- `/seo content` and `/seo content-brief`: E-E-A-T gaps (no author, no real reviews), the pillar and cluster plan.
- `/seo page`: rerun on the PLP and PDPs once products are published.
- `/seo local`: not needed. No local-pack signal was seen in the SERPs.

## Limitations
- No live Google.com (Iran) SERP. WebSearch is US-based and sometimes mixed in English results. DDG `ir-fa` gave clean top 10s for Q1 and Q2 only, then rate-limited. PAA, ads, AI Overview, Shopping carousels and related searches could not be observed. User stories therefore rely on titles, snippets and the H2/FAQ structure of ranking pages.
- The head term "لوپ فلیپ‌آپ" was polluted by "flipper tooth" results. Its SERP type is inferred from the comparison variant and is low confidence.
- No GSC data, so I could not see which URL Google actually ranks for each query or the search volumes.
- I couldn't tell whether the products are unpublished in the admin or the frontend fails to fetch them. Only the public output was observed.
- Persona scores are analyst judgments against the rubric. Only one page (TTL category) got a Playwright render with `--mode always`. The other pages are server HTML from raw fetches; the site is not an SPA (`is_spa: false`). No visual above-the-fold review was done.

## Structured findings (audit-data.json, category "Search Experience")
```json
{
  "category": "Search Experience",
  "sxo_gap_scores": {"/fa/products": 15, "/fa": 31, "/fa/categories/ttl-loupes-3": 30},
  "persona_scores": {"student_budget": 15, "practicing_dentist": 26, "specialist_surgeon": 30},
  "serp_consensus": {
    "لوپ دندانپزشکی": {"type": "Product (PLP)", "confidence": 0.9, "mismatch": "CRITICAL"},
    "قیمت لوپ دندانپزشکی": {"type": "Product (PLP)", "confidence": 0.9, "mismatch": "CRITICAL"},
    "خرید لوپ": {"type": "Product (PLP/PDP)", "confidence": 0.85, "mismatch": "CRITICAL"},
    "لوپ TTL": {"type": "Product (PLP/PDP)", "confidence": 0.7, "mismatch": "HIGH"},
    "لوپ فلیپ‌آپ (یا TTL)": {"type": "Comparison/Blog", "confidence": 1.0, "mismatch": "HIGH"},
    "لوپ گالیله‌ای یا پریزماتیک": {"type": "Comparison", "confidence": 0.9, "mismatch": "HIGH"},
    "لوپ برای دانشجوی دندانپزشکی": {"type": "Blog/Comparison", "confidence": 0.85, "mismatch": "CRITICAL"}
  },
  "findings": [
    {"id": "SXO-01", "severity": "critical", "title": "No reachable/indexable products; PLP and category pages empty; hero CTA 404", "urls": ["/fa/products", "/fa/products/1", "/fa/categories/*"]},
    {"id": "SXO-02", "severity": "critical", "title": "Template placeholders shown publicly for warranty, returns, payment, testimonials", "urls": ["/fa", "/fa/story"]},
    {"id": "SXO-03", "severity": "critical", "title": "OnlineStore schema uses another brand's email/sameAs (rooshak)", "urls": ["/fa"]},
    {"id": "SXO-04", "severity": "high", "title": "Consultation CTA lands on B2B wholesale form; no tel: or real WhatsApp", "urls": ["/fa/cooperation"]},
    {"id": "SXO-05", "severity": "high", "title": "Empty modules and dead ends (carousels, deal, FAQ, brand)", "urls": ["/fa", "/fa/faq", "/fa/brands/luca-loupe-1"]},
    {"id": "SXO-06", "severity": "high", "title": "No comparison/guide content for TTL vs flip-up, Galilean vs prismatic, student", "urls": ["/fa/blog"]},
    {"id": "SXO-07", "severity": "high", "title": "No price signal on price-led SERPs; blocks Torob listing", "urls": ["/fa/products"]},
    {"id": "SXO-08", "severity": "medium", "title": "Taxonomy lacks Galilean and headlight categories and spec tables", "urls": ["/fa/categories"]},
    {"id": "SXO-09", "severity": "medium", "title": "Category pages about 200 words vs about 2,250 SERP norm", "urls": ["/fa/categories/*"]},
    {"id": "SXO-10", "severity": "low", "title": "Homepage H1 lacks keyword; English tagline grammar", "urls": ["/fa"]}
  ]
}
```
