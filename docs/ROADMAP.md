# Delivery Roadmap

## Phase 0: Foundation

- Confirm brand, legal copy, tax treatment, measurement conventions, payment provider contracts, and city-rate table.
- Create design system, accessibility tokens, repository, environments, CI, database migrations, Firebase project, storage, and observability.
- Definition of done: deployable shell, authenticated user, admin role, migration pipeline, and audit logging.

## Phase 1: Commerce core

- Catalog, variants, media, categories, search/filter/sort, product page, wishlist, cart, addresses, city shipping rates.
- Reservation engine, checkout, card/payment adapters, bank proof workflow, order state machine, email notifications.
- Definition of done: verified customer can buy a ready-to-wear item without oversell in staging concurrency tests.

## Phase 2: Operations and trust

- Admin order/inventory/customer modules, refunds, shipping updates, returns/exchanges, reviews, moderation, notification preferences.
- Loyalty ledger, configurable levels, VIP discount application, analytics baseline.
- Definition of done: operator can fulfill, return, refund, adjust stock with audit trail, and reconcile payments.

## Phase 3: AI and custom design

- Grounded assistant, product Q&A, size guidance, comparison, escalation, signed-in history.
- Custom request form, private reference uploads, image analysis, admin review, quote, change request, approval, payment, production status.
- Definition of done: AI cannot fabricate catalog/inventory facts in evaluation set and a custom request reaches paid production.

## Phase 4: Personalization and optimization

- Recommendations, recently viewed, behavior-based merchandising, campaign tools, funnel analytics, performance tuning, richer WhatsApp/SMS automation.
- Definition of done: personalized features are measurable, consent-aware, reversible, and do not degrade core purchase performance.

## Decisions still needed before production launch

The product choices in the source specification are locked. Operational values still need explicit configuration before go-live: exact payment providers and settlement terms, tax rules, legal/privacy copy, final shipping rates, return inspection procedure, notification provider accounts, AI model/provider, retention periods, and initial catalog/discount data.