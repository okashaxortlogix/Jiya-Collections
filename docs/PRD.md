# Product Requirements Document

## 1. Product summary

Build a modern, affordable, single-brand clothing ecommerce platform for customers in Pakistan. The store sells ready-to-wear modest/formal clothing and accepts custom design requests. The experience combines fast product discovery, trustworthy stock and delivery information, a grounded AI shopping assistant, and a high-touch admin-assisted custom-order workflow.

## 2. Goals

- Let customers discover, compare, purchase, review, and return products with low friction.
- Make variant availability and checkout inventory accurate in real time.
- Help customers choose products and sizes using catalog-backed AI.
- Convert custom design conversations into structured, priceable production jobs.
- Give admins one operational surface for catalog, orders, inventory, customers, payments, shipping, loyalty, and AI oversight.
- Establish an affordable brand experience that is polished, fast, accessible, and mobile-first.

## 3. Non-goals for launch

- International shipping.
- Multiple brands or multi-vendor marketplace behavior.
- COD.
- Automatic courier-rate calculation or courier API dependency.
- Autonomous AI pricing, order approval, refunds, or inventory changes.
- Loyalty based on monetary spend.

## 4. Personas

| Persona | Need |
| --- | --- |
| Guest shopper | Browse, search, use AI, and decide whether to create an account |
| Registered customer | Buy, track, review, return, manage loyalty, and revisit AI history |
| Custom customer | Describe a design, upload references, review a quote, and coordinate production |
| Admin/operator | Maintain accurate catalog and run every order and customer operation |
| Production/fulfillment operator | See approved specifications, deadlines, payment state, and shipping state |

## 5. Core requirements

### Discovery and merchandising

- Home page combines brand identity, products, AI guide, and personalized recommendations.
- Search supports product name, category, fabric, color, and collection.
- Filters: price, size, color, fabric, availability, discount, collection, rating, new, and best seller.
- Sort options: recommended, newest, price ascending/descending, highest rated, most popular, biggest discount, and best selling.
- Product pages show media, pricing, variants, size guide, stock state, material, description, delivery estimate, returns, reviews, customer photos, wishlist, cart, buy now, recommendations, and AI product questions.

### Accounts and checkout

- Guests can browse and use AI; guest AI history is not saved.
- Checkout requires an account with verified email and verified phone.
- Checkout steps: address, delivery, payment, review, confirmation.
- Payment methods: card, Easypaisa, JazzCash, and bank transfer.
- Bank transfer supports proof upload and admin verification.

### Orders and inventory

- Cart lines identify a product variant, quantity, unit price snapshot, discounts, and reservation state.
- A variant reservation lasts 30 minutes while checkout is active.
- Successful payment converts reserved stock into deducted stock.
- Failed or abandoned payment releases the reservation.
- Customer stock labels are `In Stock`, `Only N left`, or `Out of Stock`.
- Ready-to-wear cancellation is not allowed after order placement.
- Custom orders can be cancelled by the customer at any time, including after production starts; refund implications are reviewed by policy/admin.

### Custom design

- Collect clothing type, color, fabric, embroidery/design, measurements, budget, reference images, required-by date, and instructions.
- AI may analyze a reference image into structured design details, with uncertainty clearly marked.
- Admin sees the original image, AI analysis, and customer requirements.
- Admin reviews and sets the final price and production estimate.
- Customer can approve, request a change, or continue the conversation.
- Payment is collected only after customer approval.

### Loyalty and reviews

- Rank sequence: Regular, Silver, Platinum, Gold, Diamond, Crown, Premium, VIP.
- Each major rank has configurable sublevels, initially modeled as levels 1-5.
- Every 10 valid purchased items advances one level.
- Valid-reason returns do not reduce progress; invalid/no-valid-reason returns remove the item count after admin review.
- Discounts and VIP treatment are configurable in admin.
- Verified purchasers can submit star ratings, written reviews, and customer photos.
- Reviews require moderation before publication.

### Returns, shipping, and notifications

- Pakistan-only standard delivery at launch.
- City/area shipping rates are configured manually by admin.
- Returns and exchanges are allowed within 3 days after delivery, including custom orders.
- Eligibility: unused/unworn with original tags/packaging, or defective/wrong item.
- Customer pays return shipping.
- Customer chooses original payment method or store credit for refunds.
- Qualifying requests are automatically approved; refund processing starts immediately after approval.
- Notifications can be sent through website, email, WhatsApp, and SMS. Customers manage channel preferences.

## 6. Important state rules

| Area | Rule |
| --- | --- |
| Inventory | Never trust client quantity; reserve atomically on the server |
| Payment | Order is paid only after a verified provider event or verified bank transfer |
| Custom quote | AI cannot set the final amount |
| Loyalty | Count only settled/eligible purchased items; recalculate after reviewed returns |
| Reviews | Only eligible completed purchases receive verified status |
| Returns | Policy eligibility is evaluated against delivery timestamp and item condition |

## 7. Success metrics

- Search-to-product click-through rate.
- Product-view-to-cart conversion.
- Checkout completion rate.
- Payment success rate by method.
- Reservation oversell incidents: target zero.
- Return request processing time.
- Custom request to approved quote conversion.
- AI answer grounding rate and escalation rate.
- Repeat purchase rate and loyalty progression.
- Review submission and moderation turnaround.

## 8. Accessibility and experience requirements

- Mobile-first responsive UI with keyboard navigation and visible focus states.
- WCAG 2.2 AA target for text contrast, form labels, error states, and non-color status indicators.
- Product media has meaningful alt text; videos provide captions where applicable.
- Every async operation has loading, success, empty, and recoverable error states.
- Prices, stock, delivery, return terms, and payment status are explicit before confirmation.

## 9. Acceptance baseline

A release is product-complete when a verified customer can purchase an in-stock variant through each supported payment method, inventory cannot be oversold under concurrent checkout, an admin can fulfill and ship the order, the customer can receive tracking/status notifications, and eligible return/refund flows work end to end. Custom design is complete when a customer can submit a request and reference image, an admin can analyze/review/price it, and the customer can approve, pay, and see the resulting production status.