# Product Decision Log

This log records decisions that affect product scope or system behavior. The source specification supplied by the product owner is the baseline for the initial entries.

| ID | Decision | Status | Impact |
| --- | --- | --- | --- |
| D-001 | Single brand/store; Pakistan manufacturing; Pakistan-only launch shipping | Locked | Catalog, shipping, tax, and operations are single-market first |
| D-002 | Ready-to-wear plus custom design orders | Locked | Requires separate custom request, quote, conversation, and production states |
| D-003 | AI is catalog/inventory grounded and cannot set prices or mutate commerce state | Locked | AI is advisory/orchestration only; domain services remain authoritative |
| D-004 | Variant-level inventory with a 30-minute checkout reservation | Locked | Requires atomic reservation, expiry worker, and payment idempotency |
| D-005 | Loyalty uses purchased item count; every 10 items increases one level | Locked | Requires append-only loyalty ledger and return adjustment rules |
| D-006 | Account plus verified email and phone required for checkout | Locked | Firebase providers are supported; guest browsing/AI remain available |
| D-007 | Card, Easypaisa, JazzCash, and bank transfer; no COD | Locked | Provider adapter and bank-proof operations are required |
| D-008 | Standard delivery with manually configured city/area prices | Locked | Courier rate API is out of launch scope |
| D-009 | Returns and exchanges within 3 days after delivery, including custom orders | Locked | Policy engine and return/refund workflow are launch-critical |
| D-010 | Customer always pays return shipping; refund to original method or store credit | Locked | Checkout and return UI must disclose this before purchase |
| D-011 | Ready-to-wear cancellation is not allowed; custom orders can be cancelled anytime | Locked | Cancellation policy branches by order type |
| D-012 | Automatic approval for requests meeting the return policy | Locked | Basic policy validation can be automated; inspection and loyalty outcomes remain auditable |

## Pre-production configuration decisions

These are not product-policy changes; they are operational values that must be selected and recorded before launch:

- Payment provider names, settlement process, and webhook contracts.
- Legal entity, tax treatment, privacy/terms/return copy, and retention periods.
- Final city/area delivery rates and delivery estimate rules.
- Notification providers and approved WhatsApp/SMS templates.
- AI provider/model, language support, evaluation thresholds, and cost budget.
- Measurement format and custom garment measurement validation rules.
- Production cancellation/refund treatment for custom orders.