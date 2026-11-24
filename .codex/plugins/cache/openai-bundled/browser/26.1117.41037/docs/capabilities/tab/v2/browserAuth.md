# Tab Capability: browserAuth

Sign into websites by obtaining credentials and securely filling sign-in forms. Signing in has two parts: request credentials with `requestCredentials`, then enter them with `fillCredentials`. Ask the user for any additional information or action needed to complete sign-in.

Never ask users to share passwords, security answers, or recovery codes in chat. If the user has already provided sign-in credentials in chat, use them through ordinary browser interactions following the confirmation policy, without asking the user to re-enter them in the secure sign-in prompt.

## Sign-in preferences

When choosing a sign-in method:

1. Use the sign-in method the user explicitly requested, if available and supported.
2. Otherwise, prefer a method supported by evidence of a prior sign-in to this website.
3. Otherwise, prefer email OTP when the site offers it and an available email connector can access the matching mailbox. Prefer other available methods over email sign-in links (magic links).
4. Ask the user which method to use only when the choice remains ambiguous.

Passkeys are not supported. Use another sign-in method if available.

For Google verification, prefer an existing phone OTP method; otherwise, use device approval if available. Do not ask the user to choose when the selection is clear.

## API

These methods are on the object returned by `tab.capabilities.get("browserAuth")`, named `auth` in the examples.

`auth.requestCredentials(request)` returns `{ status: "ready", handle }` or a terminal status. For username/password requests, pass `element_index` from one visible field in the intended sign-in form. The credential origin is derived from that field’s frame; secret values are never returned. Pass the opaque handle to `auth.fillCredentials({ handle, fields, submit })` to enter the credentials.

When requesting credentials, users can select saved credentials from ChatGPT Passwords or 1Password when available in the secure sign-in prompt. You cannot read passwords or add credentials directly to a password manager through chat.

Use numeric element indices from a fresh `tab.ax.get("state")` result. Each field is `{ element_index, label }`, where `label` is one of `username`, `email`, `phone`, `password`, `otp`, or `other`. Labels describe field roles, never credential values.

Provide `submit: { element_index }` to click that control after filling. If `submit` is omitted, the flow attempts Enter on the last filled field.

### Username and password

`auth.requestCredentials({ type: "username_password", usernameType: "email", element_index: 12 })` requests an email and password together. Use `usernameType: "phone"` for a phone number, or `"username"` for a username or other account identifier. Use this when a password is needed now, or you’re confident from the page or your knowledge of the site that one will be needed later. Otherwise, use known information or ask the user in chat for the needed information and enter it with regular browser APIs.

Fill either or both fields, choosing the identifier label that matches the page. Use `other` for a generic account identifier requested with `usernameType: "username"`. Reuse the handle across steps when the site asks for the identifier and password separately.

```js
const credentials = await auth.requestCredentials({ type: "username_password", usernameType: "email", element_index: 12 });
nodeRepl.write(credentials);
if (credentials.status === "ready") {
  nodeRepl.write(await auth.fillCredentials({
    handle: credentials.handle,
    fields: [
      { element_index: 12, label: "email" },
      { element_index: 13, label: "password" },
    ],
    submit: { element_index: 14 },
  }));
}
```

### One-time code

For email codes, check the matching mailbox connector for this sign-in attempt before asking the user. If it returns an OTP handle, use `auth.requestCredentials({ type: "otp", otpHandle })`. For `[otp-handle:VALUE]`, pass `VALUE` as `otpHandle`, not the code itself. Fill one whole-code input with `{ element_index, label: "otp" }`, or list separate character inputs in code order, each labeled `otp`.

If you find a visible code but no OTP handle while checking the user's inbox for a sign-in code, ask permission to use it without quoting it.

Otherwise, ask the user for the code in chat. Enter any codes provided by the user using regular browser APIs.

### Results

Use a handle from a `ready` request. Respect `declined` and `cancelled`; for `unavailable` or `expired`, ask the user for the action needed to continue.

Reuse an existing credential handle from context for the intended account and website. If the browser or page needs recovery, return to the previously visited sign-in page, inspect it, and fill using the same handle with fresh element indices. Request credentials only when no suitable handle is available or it has expired.

After filling, inspect the original tab for visible signs of success, another sign-in step, or a website error. `submission_failed` and `unknown` can occur after the website accepts the sign-in. If the tab shows the requested signed-in state, continue the task without filling or submitting again. If the outcome is unclear, report the fill status and what the tab shows before considering another attempt.

After `locator_invalid`, refresh the AX state and choose current element indices.
