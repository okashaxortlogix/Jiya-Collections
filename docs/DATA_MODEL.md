# Data Model and ERD

## 1. ERD

```mermaid
erDiagram
  USER ||--o| CUSTOMER_PROFILE : has
  USER ||--o{ ADDRESS : saves
  USER ||--o{ CART : owns
  CART ||--o{ CART_ITEM : contains
  PRODUCT ||--o{ PRODUCT_VARIANT : has
  PRODUCT ||--o{ PRODUCT_MEDIA : shows
  PRODUCT }o--o{ CATEGORY : classified_as
  PRODUCT_VARIANT ||--|| INVENTORY : tracks
  CART_ITEM }o--|| PRODUCT_VARIANT : selects
  CART_ITEM ||--o{ STOCK_RESERVATION : reserves
  USER ||--o{ ORDER : places
  ORDER ||--o{ ORDER_ITEM : contains
  ORDER_ITEM }o--|| PRODUCT_VARIANT : purchased
  ORDER ||--o{ PAYMENT : has
  ORDER ||--o{ SHIPMENT : ships
  ORDER ||--o{ RETURN_REQUEST : may_have
  USER ||--o{ REVIEW : writes
  PRODUCT ||--o{ REVIEW : receives
  USER ||--o{ WISHLIST_ITEM : saves
  USER ||--o{ CUSTOM_REQUEST : submits
  CUSTOM_REQUEST ||--o{ CUSTOM_ASSET : includes
  CUSTOM_REQUEST ||--o{ CUSTOM_MESSAGE : contains
  CUSTOM_REQUEST ||--o{ CUSTOM_QUOTE : receives
  USER ||--o{ LOYALTY_LEDGER : earns
  LOYALTY_LEVEL ||--o{ LOYALTY_LEDGER : explains
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ AUDIT_LOG : generates

  USER { uuid id PK string firebase_uid UK string email string phone string role }
  PRODUCT { uuid id PK string slug UK string name string status decimal list_price }
  PRODUCT_VARIANT { uuid id PK uuid product_id FK string sku UK string color string size string fabric decimal price }
  INVENTORY { uuid variant_id PK int on_hand int reserved int sold int available }
  STOCK_RESERVATION { uuid id PK uuid cart_item_id FK int quantity datetime expires_at string status }
  ORDER { uuid id PK uuid user_id FK string status string payment_status decimal total datetime placed_at }
  ORDER_ITEM { uuid id PK uuid order_id FK uuid variant_id FK int quantity decimal unit_price }
  PAYMENT { uuid id PK uuid order_id FK string method string status string provider_reference UK decimal amount }
  RETURN_REQUEST { uuid id PK uuid order_id FK string type string status string reason datetime delivered_at }
  CUSTOM_REQUEST { uuid id PK uuid user_id FK string status string clothing_type date required_by decimal budget }
  CUSTOM_QUOTE { uuid id PK uuid custom_request_id FK decimal final_price int production_days string status }
```

## 2. Required tables and fields

### Identity and customer

`users`, `customer_profiles`, `addresses`, `notification_preferences`, `payment_method_tokens` (provider token only, never raw card data).

### Catalog

`products`, `product_variants`, `product_media`, `categories`, `product_categories`, `collections`, `product_collections`, `size_guides`, `product_attributes`, `price_rules`, `discounts`, `coupons`.

### Commerce

`carts`, `cart_items`, `stock_reservations`, `inventory`, `inventory_ledger`, `orders`, `order_items`, `payments`, `payment_events`, `shipments`, `shipping_zones`, `shipping_rates`, `order_status_history`.

### Custom design

`custom_requests`, `custom_assets`, `custom_analyses`, `custom_messages`, `custom_quotes`, `custom_status_history`.

### Engagement and operations

`wishlists`, `recently_viewed`, `reviews`, `review_media`, `loyalty_levels`, `loyalty_ledgers`, `notifications`, `notification_deliveries`, `admin_users`, `audit_logs`, `support_conversations`.

## 3. Constraints and indexes

- Unique `sku`, product slug, provider payment reference, and Firebase UID.
- Unique active cart item per cart and variant.
- Unique review per customer per order item unless an admin explicitly reopens it.
- Index variant by product, color, size, availability; order by user and created time; reservations by status and expiry; notifications by user and unread state.
- Store money as integer minor units plus currency code; do not use floating point.
- Store timestamps in UTC and render in Pakistan Standard Time where appropriate.
- Soft-delete catalog entities when historical orders reference them.
- Snapshot product name, SKU, variant attributes, tax, shipping, and price in order items.

## 4. Inventory invariants

`available = on_hand - reserved - sold` is represented by transactionally maintained counters and an append-only inventory ledger. The system must reject any operation that would make available stock negative. Expiry processing is idempotent and safe to rerun.

## 5. Loyalty calculation

Use an append-only ledger rather than mutating only a customer counter. Positive entries are settled eligible item quantities. Valid-reason returns create neutral/exclusion entries; invalid returns create negative entries after review. A projection calculates `eligible_item_count`, rank, sublevel, and discount. Rebuild the projection from ledger history when rules change.