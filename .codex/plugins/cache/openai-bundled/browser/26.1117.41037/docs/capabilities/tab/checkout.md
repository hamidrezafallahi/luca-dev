# Tab Capability: checkout
Reports observations from checkout attempts in the browser.

## Checkout Reporting

Track requested purchases from the checkout page until the merchant confirms the order or the checkout attempt stops without confirmation.

Call `checkout.begin()` once when a requested purchase reaches the checkout form
or order review page, including with Wallet. Keep the returned attempt through
redirects, verification and retries in the same tab. Call `attempt.end(...)` once
when checkout ends. These calls record observations about checkout.
Skip reporting when the user only wants a quote.

Also follow Wallet's guidance for `report_purchase_outcome`. Call it with each
Wallet `purchase_attempt_id` when that payment attempt ends, even if checkout
continues.

Follow purchase and approval rules. Never place or repeat an order for internal
telemetry.

### Choose The Submission

- `submitted` if you took the final action to place the order.
- `stopped_before_submit` if you stopped before that action.
- `unknown` if submission is unclear.

### Choose The Outcome

- `confirmed` requires explicit merchant confirmation of this submitted order.
  Wallet approval, generic thanks and old receipts are insufficient.
- `failed` requires an explicit rejection or a checkout error that rules out
  an order.
- `unknown` for an unclear result, even after submission.

### Describe The Checkout

Include details even on success. Use `unknown` when unsure.
Exclude credentials, page text and full URLs.

Include `observed_total` with the latest visible checkout amount as a decimal
string, uppercase currency code and `kind`: `total`, `subtotal` or `estimate`.
Prefer the total including any tax, shipping and fees, otherwise use a visible
subtotal or estimate. Omit it if no amount or currency is available. Only for
`confirmed` orders, include `order_reference` with the merchant order ID when shown.

- `merchant_account_state` records `guest` or `signed_in`.
- `payment_source` records the final method attempted. `merchant_saved` means
  a card saved with the merchant.
- `required_human_intervention` is `yes` only if the user must act to continue
  the current attempt. Routine approval alone is `no`.
- `saw_captcha` records any CAPTCHA, even if solved.

### Choose The Reason

Omit `reason` for `confirmed` or an unclear cause. For `failed` or `unknown`,
choose the most specific cause you observed.

- `payment_declined` for an explicit card decline.
- `payment_error` only when checkout explicitly reports a payment processing
  error.
- `verification_required` for unresolved verification that stops checkout.
- `session_expired` for a lost checkout session.
- `fraud_blocked` for an explicit fraud or risk rejection.
- `bot_blocked` for a site bot block that ends checkout. Also call
  `botDetection.report` if its evidence requirements are met.
- `user_handoff` only with `unknown` when the user takes over.

### Example

Save the attempt at checkout.

```js
const checkout = await tab.capabilities.get("checkout")
const attempt = await checkout.begin()
```

The merchant confirms a guest Wallet order with routine approval and no CAPTCHA.

```js
const result = await attempt.end({
  submission: "submitted",
  outcome: "confirmed",
  observed_total: { amount: "64.08", currency: "USD", kind: "total" },
  order_reference: "ORDER-123",
  merchant_account_state: "guest",
  payment_source: "openai_wallet",
  required_human_intervention: "no",
  saw_captcha: "no",
})
nodeRepl.write(JSON.stringify(result))
```

## API Reference
```ts
const capability = await tab.capabilities.get("checkout");

interface CheckoutAttempt {
  end(options: { merchant_account_state?: "unknown" | "guest" | "signed_in"; observed_total?: { amount: string; currency: string; kind?: "total" | "subtotal" | "estimate" }; order_reference?: string; outcome: "confirmed"; payment_source?: "unknown" | "other" | "openai_wallet" | "merchant_saved"; required_human_intervention?: "unknown" | "yes" | "no"; saw_captcha?: "unknown" | "yes" | "no"; submission: "submitted" } | { merchant_account_state?: "unknown" | "guest" | "signed_in"; observed_total?: { amount: string; currency: string; kind?: "total" | "subtotal" | "estimate" }; outcome: "unknown" | "failed"; payment_source?: "unknown" | "other" | "openai_wallet" | "merchant_saved"; reason?: "payment_declined" | "payment_error" | "verification_required" | "session_expired" | "bot_blocked" | "fraud_blocked"; required_human_intervention?: "unknown" | "yes" | "no"; saw_captcha?: "unknown" | "yes" | "no"; submission: "unknown" | "submitted" | "stopped_before_submit" } | { merchant_account_state?: "unknown" | "guest" | "signed_in"; observed_total?: { amount: string; currency: string; kind?: "total" | "subtotal" | "estimate" }; outcome: "unknown"; payment_source?: "unknown" | "other" | "openai_wallet" | "merchant_saved"; reason: "user_handoff"; required_human_intervention?: "unknown" | "yes" | "no"; saw_captcha?: "unknown" | "yes" | "no"; submission: "unknown" | "submitted" | "stopped_before_submit" }): Promise<{ attempt_id: string; status: "reported" }>; // Report the outcome of this checkout attempt.
}

interface CheckoutTabCapability {
  begin(): Promise<CheckoutAttempt>; // Record reaching checkout and return the attempt used to report its outcome.
}
```
