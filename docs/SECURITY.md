# Security, Privacy, and Compliance Baseline

## Identity and access

- Verify Firebase ID tokens server-side; never trust client role claims without server verification.
- Require verified email and phone before checkout.
- Use short-lived sessions, secure cookies where applicable, CSRF protection for cookie-authenticated requests, and rate limits on auth, OTP, assistant, upload, and payment routes.
- Enforce object-level authorization for every customer-owned resource.
- Admin access requires MFA, least privilege, reauthentication for refunds/settings, and complete audit logging.

## Payments and financial data

- Do not store raw card numbers, CVV, or payment passwords. Use provider-hosted fields/tokens.
- Verify webhook signatures, timestamps, provider references, and amount/currency before applying payment state.
- Use idempotency keys for payment creation, refunds, and webhook processing.
- Reconcile provider reports with internal payments daily.

## Customer data and uploads

- Collect only data needed for fulfillment, custom production, support, and legal obligations.
- Encrypt data in transit and at rest; separate private reference images, bank proofs, and customer photos from public product media.
- Scan uploads for malware, restrict MIME types and size, strip unsafe metadata where appropriate, and serve via signed URLs.
- Define retention/deletion rules for AI chats, reference images, bank proof, and support messages.
- Provide privacy notice, consent for optional marketing channels, and account data export/deletion workflow subject to legal retention.

## Application security

- Validate all input server-side with typed schemas.
- Use parameterized queries, output encoding, secure headers, dependency scanning, secret scanning, and regular vulnerability review.
- Protect against prompt injection and data exfiltration in AI retrieval/tool calls.
- Keep an immutable audit log for admin, payment, inventory, loyalty, and policy changes.
- Back up the database, test restoration, and document incident response contacts and severity levels.

## Abuse and fraud signals

Monitor repeated payment failures, unusual account creation/OTP activity, rapid reservation cycling, review abuse, coupon abuse, suspicious bank proofs, and high-frequency return patterns. Signals should trigger review or throttling, not silent irreversible account punishment.