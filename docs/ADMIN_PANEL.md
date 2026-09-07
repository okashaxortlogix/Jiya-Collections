# Admin Panel Specification

## 1. Navigation

`Overview | Orders | Products | Inventory | Customers | Discounts | Reviews | Shipping | Payments | AI Assistant | Analytics | Settings`

## 2. Modules

- Overview: revenue, orders, payment failures, low stock, custom queue, returns, review queue, notification failures.
- Orders: filter by state/payment/date, inspect timeline, internal notes, fulfillment actions, customer contact.
- Products: draft/publish catalog, variants, media, size guides, fabrics, collections, recommendations.
- Inventory: variant stock, reservations, low-stock threshold, ledger, audited adjustments.
- Customers: profile, verification status, orders, loyalty ledger, preferences, support history.
- Discounts: coupons, VIP rules, campaigns, eligibility, start/end dates, stacking rules.
- Reviews: moderation, customer photo review, verified purchase state, report handling.
- Shipping: city/area rates, delivery estimate text, serviceability.
- Payments: provider status, bank proofs, reconciliation, refunds, failed webhook queue.
- AI Assistant: grounded context health, unanswered questions, escalations, prompt/model versions, cost and quality metrics.
- Analytics: funnel, product performance, stockouts, repeat purchases, returns, custom conversion.
- Settings: policies, notification templates, roles, feature flags, loyalty levels, tax configuration.

## 3. Roles and permissions

Start with one Admin role in the product UI, but enforce permission scopes in the backend so roles can be split later: `catalog.write`, `inventory.adjust`, `orders.operate`, `payments.refund`, `custom.quote`, `loyalty.configure`, `reviews.moderate`, `settings.write`, and `analytics.read`.

## 4. Guardrails

- Destructive actions require confirmation and reason.
- Price, stock, refund, loyalty, and policy changes create audit events with before/after values.
- No admin action should expose raw payment credentials.
- Bulk operations preview affected records and produce a downloadable result report.
- Sensitive customer assets use least-privilege access and expire from the browser.