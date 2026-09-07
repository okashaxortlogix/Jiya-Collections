# AI and Custom Design Specification

## 1. Grounding contract

The assistant may answer only from a request-scoped context assembled by the application. Context can include published product data, current authorized stock, active prices/discounts, size guides, shipping rates, return policy, order status for the signed-in customer, and approved custom-request messages. The model must never invent stock, price, delivery promise, policy, or order state.

If context is missing or stale, answer with uncertainty and offer built-in chat escalation. Inventory responses should include a retrieval timestamp and use the same inventory service as the storefront.

## 2. AI permissions

| Action | AI allowed? | Control |
| --- | --- | --- |
| Explain catalog/policy | Yes | Retrieval-grounded response |
| Recommend product | Yes | Published catalog only |
| Find size | Advisory only | Show inputs and confidence; customer decides |
| Analyze reference image | Yes | Draft analysis with unknowns and human review |
| Set custom price | No | Admin-only quote action |
| Deduct stock | No | Inventory transaction only |
| Confirm payment/refund | No | Payment/admin workflow |
| Send message | Limited | Customer request or approved template |

## 3. Reference image pipeline

1. Virus and file-type scan upload.
2. Store original in private object storage with short-lived access URLs.
3. Extract visual attributes: silhouette, garment type, colors, fabric cues, embroidery placement, neckline/sleeve/length cues, and visible accessories.
4. Emit structured JSON with `value`, `confidence`, and `needs_confirmation` per attribute.
5. Show analysis to customer/admin as a draft, never as a guaranteed interpretation.
6. Keep original image, prompt/version metadata, analysis, edits, and approval history.

## 4. Custom request state machine

`Draft -> Submitted -> Under review -> Awaiting customer info -> Quote sent -> Change requested -> Approved -> Payment pending -> Paid -> In production -> Ready -> Shipped -> Delivered -> Closed`.

Cancellation is available to the customer at any state according to the locked policy, with any refund/production consequence recorded by an admin decision and communicated clearly.

## 5. Prompt and model governance

- Version every system prompt, retrieval policy, and model.
- Redact secrets and unnecessary personal data before model calls.
- Log request ID, model version, context IDs, safety result, latency, and token/cost metadata; avoid storing raw sensitive content unnecessarily.
- Test prompt injection from product descriptions, images, reviews, and customer messages.
- Use allowlisted tools with typed arguments; no direct database or payment tool access.
- Sample answers for grounding, refusal, language quality, and policy compliance.