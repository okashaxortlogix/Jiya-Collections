# QA, Observability, and Release Plan

## Test layers

- Unit: pricing, discount stacking, loyalty ledger, policy eligibility, state transitions, stock labels.
- Integration: database transactions, reservation expiry, payment adapters, Firebase claims, object storage, notification providers.
- Contract: provider webhooks, API schemas, admin permissions, AI response source metadata.
- End-to-end: browse to purchase for every payment method, bank-proof review, delivery updates, review submission, return/refund, custom quote approval.
- Concurrency: two customers attempting the last variant, duplicate payment webhook, reservation expiry during payment, repeated refund request.
- Security: authorization matrix, upload scanning, rate limits, secret exposure, prompt injection, webhook replay.
- Accessibility: keyboard, screen reader labels, focus order, contrast, responsive layouts, reduced motion.

## Release gates

1. Migrations are reviewed and reversible or have a documented forward recovery.
2. Critical unit/integration/E2E suites pass.
3. No open critical security issue.
4. Payment and inventory reconciliation checks pass in staging.
5. Admin can handle payment failure, stockout, return, and notification retry.
6. Monitoring dashboards and alerts exist before production traffic.
7. Rollback owner and customer communication plan are assigned.

## Observability

Track request ID across web, API, jobs, payment events, and notifications. Measure API latency/error rate, checkout conversion, reservation expiry, oversell attempts, payment success, webhook lag, queue depth, notification delivery, AI grounded-answer rate, escalation rate, and image-analysis failures.

Alert on negative inventory, unprocessed payment events, growing dead-letter queue, webhook signature failures, refund mismatch, database backup failure, and abnormal authentication/OTP activity.

## Environments

- Local: emulators/mocks, seeded catalog, fake payments.
- Staging: sandbox providers, synthetic customer data, production-like migration and observability checks.
- Production: separate credentials, protected admin, backups, incident runbook, and feature flags for risky workflows.