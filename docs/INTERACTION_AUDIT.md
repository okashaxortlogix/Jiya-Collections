# Jiya Collections Interaction Audit

Date: 2026-09-07
Scope: storefront, customer dashboard, admin studio, forms, navigation, responsive bounds.

## Result

All critical browser checks passed after the latest fixes.

- Desktop viewport tested: 1280 x 900
- Samsung Galaxy A05 class viewport tested: 360 x 800 CSS pixels
- Build check: `npm run build` passed
- Horizontal overflow: none detected on tested desktop and mobile layouts

## Role access audit

- Customer session default role: `customer`.
- Customer dashboard does not show an Admin Studio link.
- Admin Studio and catalog management UI require both `userRole === 'admin'` and an authenticated admin session.
- Admin shell and catalog tools are not rendered in the customer DOM.
- Production implementation must replace the prototype guard with Firebase custom claims and server-side authorization checks.

## Storefront checks

| Surface | Action tested | Result |
| --- | --- | --- |
| Search | Search `abaya`, verify filtered result, clear query | PASS |
| Categories | New arrivals and All pieces tabs | PASS |
| Filter and sort | Open modal, change sort, apply result | PASS |
| Product details | Open product detail view from a card | PASS |
| Product detail add | Choose size and add from detail view | PASS |
| Wishlist | Save and unsave a product | PASS |
| Quick add | Add product to bag | PASS |
| Bag drawer | Open, display item and close | PASS |
| Custom request | Fill design request and submit | PASS |
| AI suggestions | Find my size, Eid recommendation | PASS |
| AI free text | Submit a custom assistant question | PASS |
| Newsletter | Submit valid email and show success state | PASS |
| Header navigation | Shop, Custom design, Our story | PASS |
| Footer controls | Shop, custom design, shipping/returns, size guide, contact | PASS |
| Shipping policy | Open dedicated shipping and returns policy | PASS |
| Size guide | Open size table and Jiya help action | PASS |

## Customer dashboard checks

| Surface | Action tested | Result |
| --- | --- | --- |
| Account entry | Open customer dashboard | PASS |
| Orders | Switch to order history | PASS |
| Wishlist | Switch to saved pieces | PASS |
| Addresses | Open saved address view | PASS |
| Edit address | Click and show API-ready feedback | PASS |
| Loyalty | Open progress view | PASS |
| Loyalty benefits | Click and show benefits feedback | PASS |
| Notifications | Open channel preference controls | PASS |
| Admin handoff | Open Admin Studio from account | PASS |
| Close dashboard | Close user panel | PASS |

## Admin Studio checks

| Surface | Action tested | Result |
| --- | --- | --- |
| Overview | Open dashboard metrics and quick controls | PASS |
| Products | Open editable catalog | PASS |
| Product name | Inline edit | PASS |
| Product price | Inline edit | PASS |
| Product stock | Inline edit | PASS |
| Add product | Add draft item from catalog tools | PASS |
| Delete product | Delete added item | PASS |
| Orders | Open operations view | PASS |
| Customers | Open customer operations view | PASS |
| Discounts | Open configurable discount view | PASS |
| Shipping | Open city-rate controls | PASS |
| AI assistant | Open greeting and grounding controls | PASS |
| Settings | Edit brand and assistant settings | PASS |
| Exit studio | Return to storefront | PASS |

## Responsive checks

| Viewport | Result |
| --- | --- |
| 360 x 800 | PASS; no horizontal overflow |
| 390 x 844 | PASS; no horizontal overflow |
| 412 x 915 | PASS; no horizontal overflow |
| 768 x 900 | PASS; no horizontal overflow |
| 1024 x 900 | PASS; no horizontal overflow |
| 1280 x 900 | PASS; no horizontal overflow |

Specific mobile checks:

- Mobile menu opens and closes through navigation.
- Hero image has usable height and uses local `/hero.jpg`.
- Account dashboard stays inside the viewport.
- Admin Studio stays inside the viewport.
- Floating AI trigger stays inside the viewport.
- Product detail and Quick add actions are visible without hover on touch layouts.

## Issues found and fixed

### 1. Silent customer actions

The customer dashboard `Edit address` and `View loyalty benefits` buttons previously had no handlers. They now show explicit feedback and are ready to connect to the address and loyalty APIs.

### 2. Weak catalog operations

Admin Products had inline editing but no complete add/delete flow. Catalog tools now support adding draft items and deleting items, with live storefront state updates.

### 3. Mobile hero sizing

The hero image could collapse inside the mobile flex layout. An explicit mobile image height was added, and the hero photo is now served locally to avoid external-image failure on the first viewport.

### 4. Mobile/tablet overflow risk

Responsive breakpoints were added for 1100px, 760px, and 420px. Admin and customer dashboards were tested at 360px and remain within the viewport.

### 5. Touch-only product actions

Product detail and Quick add controls were previously hover-oriented. They are now visible and usable on touch layouts, with product detail modal sizing adjusted for narrow screens.

### 6. Generic footer destinations

Shipping & returns and Size guide previously opened unrelated generic surfaces. They now open dedicated policy and size-guide content.

## Current limitations, intentionally documented

These are not silent broken buttons, but prototype boundaries that require backend work:

- Product, admin, cart, wishlist, and settings state resets on refresh.
- Authentication is not yet connected to Firebase.
- Admin access is intentionally locked behind a prototype role/session guard; no customer account can open Admin Studio.
- Orders, payments, shipping, returns, loyalty, notifications, and reviews use demo data.
- Shipping policy and size guide are currently local prototype content; they should be connected to admin-managed policy and product-specific size-guide records.
- Product detail is currently a modal rather than a dedicated route/page.
- Address editing currently confirms API readiness rather than persisting an address.
- Admin Orders and Customers screens are operational placeholders until database/API data is connected.
- External product images still depend on remote URLs; the hero image is local and reliable.

## Recommended next test gate

Before production integration, add automated component/E2E tests for:

1. Firebase sign-in and role authorization.
2. Persisted product CRUD and audit logging.
3. Inventory reservation and checkout concurrency.
4. Payment webhooks and idempotency.
5. Return/refund policy and loyalty recalculation.
6. Product-aware size guide and policy pages.
