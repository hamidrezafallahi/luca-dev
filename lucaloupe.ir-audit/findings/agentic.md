# Agent readiness: https://lucaloupe.ir/fa (checked 2026-10-18; vendor-matrix facts dated 2026-09-23)

Lighthouse Agentic Browsing: unavailable (PSI HTTP 403 mobile and desktop; no X/N). Fraction not reported.
Agent-UX heuristic: unavailable (render_page returned no meaningful body; no score). Partial manual check of raw HTML only.

## Findings
- P1 llms.txt and llms-full.txt return 200 text/html (~300 KB Next.js page; no H1, no Markdown links). Soft 404; Lighthouse counts a fail. Fix: return real 404 or publish a real Markdown llms.txt (H1, > summary, H2 link sections to guides/categories/products).
- P1 /.well-known/* (ai-catalog.json, mcp.json, security.txt, api-catalog, oauth) return 403 HTML for both script and curl. Ambiguous: WAF/nginx blocks the whole /.well-known path. Fix: allow /.well-known/ at nginx (also needed for security.txt and ACME). 403 means agents cannot tell "absent" from "blocked".
- P1 (verification gap) PSI 403 and Agent-UX render failure: Google PSI and headless renders may be blocked or geo-limited (Iran hosting). Re-test from another network; if PSI is blocked, agents from Google infra may be too.
- P2 Possible html lacks dir="rtl" (raw <html lang="fa"> only; project rule requires dir="rtl"). Verify.
- P2 No Content-Signal in robots.txt (preference only; draft; Google does not act on it). Optional: Content-Signal: search=yes, ai-input=yes, ai-train=<owner decision>.
- P3 Markdown delivery absent (Accept: text/markdown gives HTML; /fa.md 404). Opportunity only.
- P3 WebMCP absent (0 forms, 0 registerTool; W3C CG draft, not a standard). Opportunity only, e.g. search, consultation request.
- P3 ai-catalog.json: not verifiable (403); ARD draft, optional.

## Passes
- Server rendering: 636 words without JS, no JS shell.
- robots.txt 200, 6 groups (*, Googlebot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended) all Allow / with the same private-path disallows (api, auth, admin, checkout, shoppingCart, payment, order); Sitemap declared. Cart/checkout blocked from crawlers is correct.
- Real 404 for unknown URLs.
- Homepage semantics: one h1, main, nav, JSON-LD x2, descriptive aria-labels (search, cart, login, main menu, language). PSI accessibility 100 (provided).

## Access policy (robots.txt)
- Training (GPTBot, Google-Extended, ClaudeBot): allowed, no opt-out. Decide deliberately.
- Search (Googlebot, PerplexityBot): allowed.
- User-triggered (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent): not blocked; Claude-User honours robots, others may ignore.

## Not tested
Cart, consultation and product flow accessibility trees (render failed); fix render/WAF first and re-run agent_ux_check.py.
