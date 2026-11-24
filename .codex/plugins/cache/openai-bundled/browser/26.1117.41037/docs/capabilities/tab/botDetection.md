# Tab Capability: botDetection
Reports when a cloud browser task is blocked by bot detection, CAPTCHA, hard access denial, or a repeated challenge loop.

## Bot Detection Reporting

Use this capability only when the current cloud browser tab may be blocked by
bot-detection, anti-automation, human-verification, or related access-control
systems served by the target site or its anti-bot provider. Report the blocker
only after the current URL and visible page provide enough evidence to classify
it, then stop or continue according to the surrounding Browser Safety guidance.
This report is internal telemetry. It does not replace telling the user that
the site blocked this browser or, when appropriate, switching to another
reputable source as directed by the Cloud Browser Context.

Do not use this capability for a bare HTTP status code or for browser,
organization, or network-policy failures. `ERR_BLOCKED_BY_ADMINISTRATOR`, proxy
or egress denials, DNS or TLS failures, timeouts, and refused or reset
connections are not bot detection.

Pending checks alone are not blockers or failed attempts. Continue permitted
verification through successive status pages, even when no report is warranted,
within active instructions, confirmation policy, retry limits, and deadlines.
Inspect the resulting URL and page after each action.

### Choose The Reason

- `sign_in_blocked`: Use when a site-served bot or anti-automation block prevents
  signing in.
- `add_to_cart_blocked`: Use when a site-served bot or anti-automation block
  prevents adding an item to the cart.
- `purchase_blocked`: Use when a site-served bot or anti-automation block prevents
  checkout or completing a purchase.
- `captcha_failed`: Use after you attempted a CAPTCHA or human-verification
  challenge under the active confirmation policy, but the site rejected it or
  the challenge still blocks progress.
- `access_denied`: Use for hard site-served access blocks such as Access Denied,
  request blocked, forbidden, or bot traffic denied when the page identifies
  bot, automation, or security screening and does not present an interactive
  challenge. A bare 403 is not enough.
- `challenge_loop`: Use when verification repeatedly restarts without progress.
  Use `captcha_failed` for repeated challenge rejections. A pending check or
  your own reload alone is insufficient.
- `unexpected_bot_error`: Use for other errors explicitly involving bot
  detection or anti-automation. A generic page or browser error is not enough.
- `unknown`: Use for uncertain blockers. Returns `uncertain`, excluded from
  confirmed-block counts.

Use the most specific matching value. Do not invent a free-form reason.

Pass only a verbatim visible `error_excerpt` (up to 256 characters), when
available.

```js
const botDetection = await tab.capabilities.get("botDetection");
const reportResult = await botDetection.report({
  reason: "captcha_failed",
});
nodeRepl.write(JSON.stringify(reportResult));
```

## API Reference
```ts
const capability = await tab.capabilities.get("botDetection");

interface BotDetectionTabCapability {
  report(options: { error_excerpt?: string; observations?: { ad_screen_percent?: number; biometric_or_photo_video_required?: boolean; captcha_failed_or_retried?: boolean; captcha_seen?: boolean; captcha_solved?: boolean; captcha_unsolved_after_retries?: boolean; content_obscured?: boolean; email_verification_required?: boolean; hard_block?: boolean; human_intervention_needed?: boolean; kyc_document_required?: boolean; mobile_app_name?: string; mobile_app_required?: boolean; password_rejected?: boolean; password_unavailable?: boolean; site_broken?: boolean; sms_or_phone_required?: boolean; sso_required?: boolean; support_contact_required?: boolean }; reason: "unknown" | "captcha_failed" | "access_denied" | "challenge_loop" | "sign_in_blocked" | "add_to_cart_blocked" | "purchase_blocked" | "unexpected_bot_error" }): Promise<{ evidence?: { document_http_status?: number; error_excerpt?: string; observed_failed_requests: Array<{ age_ms: number; http_status: number; request_url: string }> }; hostname: null | string; status: "reported" | "uncertain" }>; // Report a current block, or return an uncertain observation with `unknown`. Only confirmed reports enter block metrics, without raw evidence. Evidence is returned through ordinary tool output. Missing evidence does not establish that no request failed. Request URLs are same-origin Fetch/XHR URLs, not necessarily final redirect destinations or the cause of the block. An optional error_excerpt is returned only if it matches visible page text. Supply only observations differing from false/0/empty defaults. Requirements describe the current page; CAPTCHA/human observations cover this task on this site. ad_screen_percent: visible screen, 0–100. content_obscured: overlays covering needed content/forms. support_contact_required: no self-serve continuation. captcha_unsolved_after_retries: still blocked after actual retries or human help.
}
```
