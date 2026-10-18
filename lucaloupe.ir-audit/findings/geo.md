# GEO / AI Search Readiness - lucaloupe.ir

Audit date: 2026-10-18. Scope: /fa and /en home, products, blog, faq, story, brand, cooperation, 4 category pages, robots.txt, sitemap.xml, /llms.txt, off-site entity checks.
Method: raw curl + claude-seo render_page.py (--mode never; every page is SSR, is_spa=false) plus trafilatura extracted_text. All evidence below was observed directly. No specs or claims were invented.

## AI Search Readiness score: 30 / 100

| Dimension | Weight | Score | Weighted | Basis |
|---|---|---|---|---|
| Citability | 25% | 25 | 6.3 | Only 16 FAQ answers (4 category pages) are citable. Products, blog and /faq are empty. No specs, numbers or sources. |
| Structural readability | 20% | 40 | 8.0 | Clean SSR headings, FAQ accordions with FAQPage schema. Question text sits in accordion buttons, not H2/H3. An SEO-title H2 comes before the H1 on category/brand pages. |
| Multi-modal | 15% | 15 | 2.3 | 6 images with 1-3 word alt text. No video, spec tables or diagrams. |
| Authority & brand | 20% | 8 | 1.6 | Wrong Organization entity in schema, live template placeholders, no author/date/manufacturer/dealer identity, no off-site footprint. |
| Technical accessibility | 20% | 60 | 12.0 | SSR, AI search bots get 200, hreflang OK. /llms.txt is a soft-200 HTML page, EN pages declare lang="fa", homepage links to a 404 product, sitemap has no product/post URLs. |
| **Total** | | | **30** | |

Platform scores (estimates): Google AI Overviews 25, ChatGPT Search 20, Perplexity 25, Bing Copilot 20. The site has little to cite and no third-party corroboration of the entity; Perplexity/AIO can at most lift category FAQ answers.

## AI crawler access (robots.txt, live)

Named groups: `*`, Googlebot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended. All are `Allow: /` with only /api, /auth, admin, checkout, cart, payment and order disallowed. Sitemap is declared.

| Crawler | Governs | Status | Evidence |
|---|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed (via `*`) | UA test /fa -> 200 |
| Claude-SearchBot | Claude search citations | Allowed (via `*`) | UA test /fa -> 200 |
| PerplexityBot | Perplexity search | Allowed (named) | UA test /fa -> 200 |
| Googlebot | Google Search + AI Overviews | Allowed (named) | |
| Bingbot | Bing / Copilot | Allowed (via `*`) | |
| Applebot | Siri/Spotlight | Allowed (via `*`) | |
| GPTBot | OpenAI training only | Allowed (named) | UA test 200. Not evidence for ChatGPT Search |
| ClaudeBot | Anthropic training only | Allowed (named) | Not evidence for Claude search |
| Google-Extended | Gemini/Vertex training + grounding; not AIO inclusion | Allowed (named) | |
| Applebot-Extended, CCBot, cohere-ai | Training only | Allowed (via `*`) | Business choice |

No crawler blocking issue. Optional: name OAI-SearchBot and Claude-SearchBot explicitly so the intent is documented.

## llms.txt / RSL: MALFORMED (soft-200 HTML)

`GET /llms.txt` returns `200`, `Content-Type: text/html`, 322 KB. The body is the homepage shell with `<title>لوکا | لوپ و هدلایت دندانپزشکی</title>`, `<link rel="canonical" href="https://lucaloupe.ir/llms.txt">` and `robots index, follow`. /llms-full.txt, /license.xml and even /foo.txt behave the same way. Any dotted root path returns an indexable self-canonical copy of the homepage, while undotted unknown paths 307 to /fa/... and then 404 correctly. There is no real llms.txt and no RSL license.

## Findings

### F1. CRITICAL: /llms.txt and every dotted root path return an indexable homepage copy
- Evidence: see above. `x-nextjs-prerender: 1`, `x-nextjs-cache: HIT`. The middleware/route likely skips paths containing a dot (the static-file matcher), and a catch-all renders the home template.
- Impact: there is no usable llms.txt, and arbitrary URLs create infinite duplicates with self-canonicals.
- Fix: return a real 404 for unknown dotted paths. Add `public/llms.txt` (or `app/llms.txt/route.ts` returning `text/plain`) only after there is real content. It should list factual Persian and English summaries of brand, origin, dealer, categories and guide URLs, all owner-approved.
- Verify: `curl -sI https://lucaloupe.ir/llms.txt` shows `200 text/plain` (or 404 if omitted), and `curl -sI https://lucaloupe.ir/foo.txt` shows 404.

### F2. CRITICAL: no products, posts or FAQ for AI to cite
- Evidence: /fa/products shows "نمایش 0 مورد ... محصولی یافت نشد". /fa/blog shows "مقاله‌ای یافت نشد". /fa/faq shows "هنوز سوالی ثبت نشده است" (same on /en). The homepage links `/fa/products/1`, which returns 404. sitemap.xml has 36 URLs with no /products/ or /blog/ entries. Category pages show "تامین کننده ای وجود ندارد / زیر دسته بندی ای وجود ندارد".
- Impact: AI cannot answer queries like «لوپ لوکا ۳.۵ برابر», «قیمت لوپ دندانپزشکی» or «فاصله کاری لوپ» from this site.
- Fix: publish product pages with spec tables taken only from the official manufacturer catalog (owner to supply), Product + Offer + additionalProperty schema, and the pillar guide plus the 4 sub-articles from CLAUDE.md. Fill /faq from real customer questions. Remove the /fa/products/1 link or point it at a live product.
- Verify: sitemap contains product and post URLs. /fa/products HTML shows product names without JS. `/fa/products/<slug>` returns 200 with Product JSON-LD.

### F3. CRITICAL: Organization schema identifies the wrong entity
- Evidence (hp.html, en.html JSON-LD `OnlineStore`): `"email":"info@rooshak.ir"`, `"sameAs":["https://instagram.com/roshak_kitchenware","https://t.me/Arash71tj"]`, `"address":{"addressCountry":"IR"}` only. The fa and en pages also declare separate `@id`s (`/fa#organization`, `/en#organization`).
- Impact: entity resolution ties "لوکا" to a kitchenware Instagram account and a personal Telegram. This poisons Knowledge Graph and LLM entity linking.
- Fix: one Organization/OnlineStore `@id` (e.g. `https://lucaloupe.ir/#organization`) used by both locales. Include the real legal name of the Iranian dealer, a lucaloupe.ir email, the real phone and street address, and only Luca-owned profiles in sameAs. Mark the brand Luca/LucaLoupe as a separate `Brand` entity, with the manufacturer as `Organization` (Korea) if the owner confirms the details. All values come from the owner.
- Verify: Rich Results Test / validator.schema.org on /fa and /en shows the same @id, and no "rooshak" remains (`curl -s https://lucaloupe.ir/fa | grep -ci rooshak` returns 0).

### F4. HIGH: template placeholders are live, crawlable text
- Evidence (visible HTML): homepage `[نام مشتری]`x3, `[نظر مشتری ۱..۳]`, `[نقل‌قول مشتری ۱..۳]`, `[نام و تخصص]`, `[محصول]`, `[روش‌های پرداخت]`, `[مدت و شرایط گارانتی]`, `[مهلت و شرایط بازگشت کالا]`, `[شرایط پرداخت در محل]`. /fa/story: `[سال تأسیس] — کره جنوبی`, `«[نقل‌قول از بنیان‌گذار ...]»`, `[نام و سمت]`, `[سال]`, `[تعداد]`, `[مدت]`. EN equivalents too (`[Customer quote 1]`, `[Founding year] — South Korea` ...).
- Impact: these read as low-trust, unfinished content, and the warranty and returns facts AI looks for are missing.
- Fix: hide each block until the owner supplies real data. Testimonials must be real ones provided by the owner (CLAUDE.md forbids invented reviews).
- Verify: `grep -E '>\[[^]<]+\]<'` on /fa, /en, /fa/story returns nothing.

### F5. HIGH: entity facts (brand, manufacturer, Korea origin, Iranian dealer) are missing or contradictory
- Evidence: on the FA homepage the hero subtitle is the English string "because your eye deserve precision" (grammatically wrong). The Persian string «لوپ‌های دندانپزشکی لوکا؛ طراحی‌شده در کره ...» exists only in the RSC translation payload and is not rendered. EN hero shows "designed in Korea" (designed, not made). /fa/story says «لوکا لوپ دندانپزشکی می‌سازد» (manufacturer voice), and the brand page says «LucaLoupe تولیدکننده ...». The site never states who sells in Iran (dealer name, official-representative status, warranty provider). No manufacturer website link.
- Impact: LLMs cannot reliably answer «لوپ لوکا ساخت کجاست؟» or «نمایندگی لوپ لوکا در ایران کیست؟». CLAUDE.md says "ساخت کره جنوبی" while the site says "designed in Korea".
- Fix: owner confirms the facts. Then add one self-contained ~60-100 word Persian paragraph on /fa/story and the brand page, e.g. «لوکا (LucaLoupe) برند لوپ ... ساخت/طراحی [کشور، تأیید شود]؛ فروش و خدمات در ایران توسط [نام حقوقی] به‌عنوان [نماینده رسمی؟]». Mirror it in Organization/Brand schema. Render the Persian hero subtitle on /fa.
- Verify: /fa HTML (no JS) contains the confirmed origin and dealer sentence. Schema shows `brand`, `manufacturer`, and the seller Organization.

### F6. HIGH: category FAQ answers are the only citable content, and they do not cover the core comparisons
- Evidence (SSR + FAQPage schema): TTL, flip-up, prismatic and ergonomic pages each have 4 Q&As of about 30-60 words. They give direct, mostly self-contained answers, e.g. «آیا لوپ فلیپ‌آپ از TTL سنگین‌تر است؟ معمولاً بله...». The prismatic page also says «وقتی بزرگنمایی بیشتر از حدود ۳.۵ برابر لازم دارید...». Gaps: there is no Galilean-category page or explicit «گالیله‌ای یا پریزماتیک» answer. Working distance is never defined (only "measured"). No magnification guidance for 2.5x vs 3.5x, no depth-of-field numbers, weight, price, or sources. Answers fall short of the ~130-170 word self-contained-block heuristic (a third-party heuristic; Google says chunking is not required).
- Fix: in the pillar guide, add question-form H2/H3 headings (e.g. «لوپ TTL بهتر است یا فلیپ‌آپ؟», «فاصله کاری لوپ چیست و چطور اندازه‌گیری می‌شود؟», «بزرگنمایی ۲.۵ یا ۳.۵ برابر؟») with the answer in the first 40-60 words, then a comparison table. Product numbers come only from the catalog; ergonomic/medical statements need cited sources.
- Verify: each target question has an H2/H3 plus a direct answer in SSR HTML, and an AI query test (ChatGPT/Perplexity, Persian) cites lucaloupe.ir.

### F7. MEDIUM: unsourced spec and health claims
- Evidence: the prismatic category H2 says «بزرگ‌نمایی ۴ تا ۶ برابر», a range with no product data behind it. /fa/story says «لوپ خوب وضعیت نشستن را اصلاح می‌کند ... فشار از گردن و شانه برداشته شود».
- Fix: owner confirms the magnification range against the official catalog. Soften the health wording and cite ergonomics literature (per CLAUDE.md).
- Verify: each numeric claim maps to a catalog page, and the health sentence carries a citation.

### F8. MEDIUM: language signals are wrong on /en
- Evidence: every /en page has `<html lang="fa">`. /en/categories/ttl-loupes-3 renders the FAQ in Persian, and its FAQPage JSON-LD is Persian. /fa pages have `dir="rtl"` on a wrapper, not on `<html>` (CLAUDE.md requires `lang="fa" dir="rtl"` on html).
- Fix: set `<html lang={locale} dir={locale==='fa'?'rtl':'ltr'}>` in the root layout. Localize the category FAQs (or omit them on /en).
- Verify: `curl -s https://lucaloupe.ir/en | grep -o '<html[^>]*>'` shows `lang="en" dir="ltr"`.

### F9. MEDIUM: no authorship, dates or expert review
- Evidence: no Person/author, datePublished or dateModified anywhere. render_page `publication_date` falls back to 2026-01-01.
- Fix: when articles exist, add a named author (a dentist or the dealer's specialist, with a real bio), visible publish and update dates, and Article schema.
- Verify: Article JSON-LD with author and dateModified on each post.

### F10. MEDIUM: social links are placeholders, and there is no off-site entity footprint
- Evidence: footer links are bare `https://instagram.com`, `https://t.me`, `https://youtube.com`, `https://wa.me`. Wikipedia (en) search "lucaloupe": 0 hits. Wikidata "LucaLoupe": no entity. A YouTube search for "lucaloupe" returns nothing relevant. The Persian query «لوپ لوکا» returns third-party loupe buying guides (e.g. «بهترین راهنمای خرید لوپ دندانپزشکی در سال 2025»), not Luca content. Reddit and Bing were not checkable (blocked or irrelevant results). Torob presence was unverified (the API was unreachable).
- Impact: YouTube mentions have the strongest observed correlation with AI citations (~0.737). The brand has none.
- Fix: real product videos on a Luca YouTube/Aparat channel embedded on product pages (CLAUDE.md priority 4), real social profile URLs, a Torob listing (priority 5), and mentions in Iranian dental communities. Wikipedia only if real notability exists.
- Verify: footer hrefs resolve to real profiles, the YouTube search shows the channel, and the Torob search shows lucaloupe.ir offers.

### F11. LOW: heading and multimodal hygiene
- Evidence: on category/brand pages an SEO-title H2 («خرید لوپ TTL دندان‌پزشکی | ...») precedes the H1. Image alts are 1-3 words ("LucaLoupe", "لوپ TTL"). There are no video or spec tables.
- Fix: make the SEO line part of the H1 or a subtitle `<p>`, use descriptive Persian alts, and add spec tables (with catalog data) and real videos.

## Positives
- Full SSR/prerender: all text is in the initial HTML, with no SPA dependency.
- AI search crawlers are allowed. Correct fa/en/x-default hreflang. Sitemap lastmod values are fresh.
- Category FAQ answers are direct, mostly neutral and in natural Persian, with FAQPage schema (ZWNJ preserved in HTML/JSON-LD).

## Persian-language AI answer readiness
Low. The Persian prose quality is good, but there is almost nothing to cite. No Persian answer exists for price, specs, origin, dealer, warranty, Galilean vs prismatic, working distance or student choice. The FA hero is in English.

## Top 5 changes (impact / effort)
1. Publish real products with catalog spec tables + Product/Offer schema, and fix /fa/products/1 (very high / L, needs owner data).
2. Fix the Organization schema entity (rooshak/kitchenware) and add confirmed brand/manufacturer/dealer facts (very high / S).
3. Remove the live placeholders and fill warranty/returns/payment with real terms (high / S).
4. Pillar guide + 4 sub-articles with question H2s and direct answers (high / M-L).
5. 404 dotted paths, add a real text/plain llms.txt, and fix html lang/dir per locale (medium / S).

## Structured findings (audit-data.json, category "AI Search Readiness")
```json
{
  "category": "AI Search Readiness",
  "score": 30,
  "dimensions": {"citability": 25, "structural_readability": 40, "multimodal": 15, "authority_brand": 8, "technical_accessibility": 60},
  "platform_scores": {"google_aio": 25, "chatgpt_search": 20, "perplexity": 25, "bing_copilot": 20},
  "llms_txt": "malformed (soft-200 text/html homepage copy, self-canonical, indexable)",
  "ai_crawlers": {"OAI-SearchBot": "allowed", "Claude-SearchBot": "allowed", "PerplexityBot": "allowed", "Googlebot": "allowed", "Bingbot": "allowed", "GPTBot": "allowed (training)", "ClaudeBot": "allowed (training)", "Google-Extended": "allowed (training/grounding)", "Applebot-Extended": "allowed (training)", "CCBot": "allowed (training)", "cohere-ai": "allowed (training)"},
  "findings": [
    {"id": "GEO-1", "severity": "critical", "title": "/llms.txt and any dotted root path return indexable homepage HTML (200, self-canonical)"},
    {"id": "GEO-2", "severity": "critical", "title": "Products, blog and FAQ empty; homepage links /fa/products/1 (404); no product/post URLs in sitemap"},
    {"id": "GEO-3", "severity": "critical", "title": "Organization schema uses info@rooshak.ir, instagram.com/roshak_kitchenware and a personal Telegram; separate fa/en @ids"},
    {"id": "GEO-4", "severity": "high", "title": "Template placeholders rendered live (testimonials, warranty, returns, founding year)"},
    {"id": "GEO-5", "severity": "high", "title": "Brand/manufacturer/Korea origin/Iranian dealer facts missing or inconsistent; FA hero in English"},
    {"id": "GEO-6", "severity": "high", "title": "Only 16 short category FAQ answers are citable; no Galilean vs prismatic, working distance or magnification guidance"},
    {"id": "GEO-7", "severity": "medium", "title": "Unsourced magnification range (4-6x) and ergonomic health claims"},
    {"id": "GEO-8", "severity": "medium", "title": "/en pages declare lang=fa and show Persian FAQ + Persian FAQPage schema; dir not on html"},
    {"id": "GEO-9", "severity": "medium", "title": "No author, dates or expert review signals"},
    {"id": "GEO-10", "severity": "medium", "title": "Placeholder social links; no Wikipedia/Wikidata/YouTube footprint"},
    {"id": "GEO-11", "severity": "low", "title": "H2 before H1 on category/brand pages; minimal alt text; no video or tables"}
  ]
}
```
