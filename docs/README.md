# Clothing Commerce Platform Documentation

This folder is the working product and engineering specification for the single-brand Pakistan-first clothing ecommerce platform.

## Document map

| Document | Purpose |
| --- | --- |
| [PRD](PRD.md) | Product goals, scope, requirements, and acceptance criteria |
| [Architecture](ARCHITECTURE.md) | System shape, service boundaries, integrations, and operational flows |
| [Data model and ERD](DATA_MODEL.md) | Core entities, relationships, constraints, and inventory rules |
| [User flows](USER_FLOWS.md) | Customer, admin, custom-order, checkout, and return journeys |
| [API specification](API_SPEC.md) | Versioned API conventions and endpoint contracts |
| [AI and custom design](AI_CUSTOM_DESIGN.md) | Grounded shopping assistant and custom design workflow |
| [Admin panel](ADMIN_PANEL.md) | Admin modules, permissions, and operating procedures |
| [Security](SECURITY.md) | Authentication, authorization, privacy, payments, and abuse controls |
| [QA and release](QA_RELEASE.md) | Testing strategy, observability, environments, and release gates |
| [Roadmap](ROADMAP.md) | Phased delivery plan and definition of done |
| [Decision log](DECISIONS.md) | Locked decisions and pre-production configuration items |

## Locked product decisions

- Single brand and single store.
- Products are primarily Shalwar Qameez, Abayas, and similar modest/formal clothing.
- Ready-to-wear and custom design orders are supported.
- Manufacturing is in Pakistan; launch shipping is Pakistan only.
- Account is required for checkout. Guest browsing and guest AI usage are allowed.
- Email/password, phone OTP, and Google sign-in are supported through Firebase Authentication.
- Email and phone must both be verified before checkout.
- Card, Easypaisa, JazzCash, and bank transfer are supported. COD is excluded.
- Standard delivery only; shipping rates are configured by city/area in the admin panel.
- Inventory is variant-level with a 30-minute checkout reservation.
- Returns and exchanges are available within 3 days after delivery, including custom orders.
- Customer pays return shipping. Refund may go to the original method or store credit.
- Custom pricing is set by an admin, never autonomously by AI.
- Loyalty is based on purchased item count: every 10 valid items increases one level.

## How to use these documents

1. Product, design, and engineering should use the PRD as the scope baseline.
2. Engineering should implement the data model and API contracts together; both are intentionally explicit about state transitions.
3. Any change to a locked decision should be recorded in a decision log and reviewed for impact on payments, inventory, fulfillment, and customer messaging.