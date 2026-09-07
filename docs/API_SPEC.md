# API Specification

## 1. Conventions

- Base path: `/api/v1`.
- JSON request and response bodies.
- Firebase ID token in `Authorization: Bearer <token>`.
- Cursor pagination: `?limit=20&cursor=...`.
- Errors use `{ "error": { "code": "...", "message": "...", "requestId": "..." } }`.
- Mutating requests accept `Idempotency-Key` where payment, reservation, order, refund, or notification duplication is possible.
- Money is `{ "amount": 129900, "currency": "PKR" }`.

## 2. Customer endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/products` | Search, filter, sort, and paginate products |
| GET | `/products/{slug}` | Product details, variants, stock, reviews, recommendations |
| GET | `/products/{id}/stock` | Current authorized stock labels/quantities |
| POST | `/carts` | Create or retrieve active cart |
| POST | `/carts/{id}/items` | Add a variant and quantity |
| PATCH | `/carts/{id}/items/{itemId}` | Change quantity or variant |
| POST | `/carts/{id}/reserve` | Reserve cart inventory for 30 minutes |
| POST | `/checkout/validate` | Validate account verification, cart, delivery, and discount |
| POST | `/orders` | Create pending order from validated cart |
| POST | `/orders/{id}/payments` | Start selected payment method |
| GET | `/orders` | Customer order history |
| GET | `/orders/{id}` | Order details and status history |
| POST | `/orders/{id}/return-requests` | Request return or exchange |
| POST | `/reviews` | Submit review for eligible order item |
| POST | `/custom-requests` | Create custom design request |
| POST | `/custom-requests/{id}/messages` | Send customer/admin conversation message |
| POST | `/custom-requests/{id}/approve-quote` | Approve a quote and create payment intent |
| POST | `/assistant/sessions/{id}/messages` | Ask grounded shopping assistant |
| GET | `/me/loyalty` | Loyalty progress and eligible item count |
| PUT | `/me/notification-preferences` | Update channel preferences |

## 3. Admin endpoints

Admin routes require an admin claim and permission checked per operation.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| CRUD | `/admin/products` | Manage products, variants, media, and publishing |
| POST | `/admin/inventory/adjustments` | Audited stock adjustment |
| GET/PATCH | `/admin/orders/{id}` | Operate order and fulfillment state |
| POST | `/admin/orders/{id}/refunds` | Create controlled refund |
| CRUD | `/admin/shipping/rates` | Configure Pakistan city/area rates |
| GET/PATCH | `/admin/custom-requests/{id}` | Review request and set quote |
| POST | `/admin/custom-requests/{id}/analysis` | Request or confirm AI analysis |
| CRUD | `/admin/loyalty/levels` | Configure levels and discounts |
| GET/PATCH | `/admin/reviews/{id}` | Moderate review |
| GET | `/admin/audit-logs` | Search immutable admin actions |

## 4. Webhooks

- `POST /webhooks/payments/{provider}`
- `POST /webhooks/notifications/{provider}`
- `POST /webhooks/shipping/{provider}` when a courier integration is added later.

Verify signature, persist raw event metadata safely, reject replay or process it idempotently, and return quickly before asynchronous handling.

## 5. Core response examples

### Variant stock

```json
{
  "variantId": "var_123",
  "sku": "BLACK-M",
  "label": "Only 2 left",
  "available": 2,
  "asOf": "2026-09-07T10:00:00Z"
}
```

### Assistant answer metadata

```json
{
  "message": "Black in Medium has 2 available right now.",
  "sources": [{ "type": "inventory", "variantId": "var_123" }],
  "requiresEscalation": false,
  "conversationId": "ai_123"
}
```