<!-- STATUS: final -->
# Chapter 38 — Exercise

## Goal
Refactor a conflicting cart drawer, header count, and product add interaction into one **authoritative, locale-aware cart transition** that requests bundled sections, reconciles server state, offers controlled optimistic feedback, and publishes only confirmed cart changes.

## Context
Atelier North has a product form, a cart drawer, and a header item count. Three scripts own the cart independently: product code posts JSON to a hard-coded `/cart/add.js`, immediately increments the header count, then requests the drawer later; the drawer changes quantity by variant ID and assumes the key stays constant; the header polls `/cart.js` after every click. On slow network, a product with an engraving property can produce two seemingly identical variant lines, the wrong line updates, a sold-out error leaves the count higher, and the drawer displays a stale price. Each component dispatches its own `cart:changed` event before the server reply.

Create one coordinator that enhances the existing native product/cart forms. A cart mutation must use a locale-aware endpoint and treat the response as authority. Request the drawer and icon/count sections in the same cart mutation where supported; validate returned section HTML before replacing roots. Let the product button show a pending state, but do not let a local count/total prediction outlive reconciliation. Emit a single confirmed cart transition for subscribers after server state and requested sections are accepted.

Plan **60–75 minutes**. Test valid add, two same-variant lines with different properties, quantity change/removal, a sell-out/inventory error, quantity-rule boundary, a selling-plan or discounted line if available, double-click/overlap, locale-prefixed route, drawer/count consistency, JavaScript disabled, and a bundled-section failure. Record actual endpoint payloads, returned keys, errors, status/focus behavior, and response bytes.

## Requirements

- [ ] Keep native add-to-cart and cart form behavior functional without JavaScript; enhance product submission with `FormData`, not a separately recreated item contract.
- [ ] Build every Ajax URL from `window.Shopify.routes.root`. Identify which operation uses `cart.js`, `add.js`, `change.js`, `update.js`, or `clear.js`, and use the narrowest one.
- [ ] Use a current line key for a targeted existing-line quantity change, refresh identity from confirmed response, and explain key volatility in `notes.md`.
- [ ] Request verified drawer and icon/count sections in the mutation response where bundled rendering is supported. Validate response/roots before DOM replacement, and describe safe recovery if a section value is absent.
- [ ] Implement a coordinator that serializes or versions overlapping cart transitions, has explicit pending state, reconciles server cart/sections, and rolls back/recovers after failure.
- [ ] Handle JSON error responses—including sold-out, inventory-limited, invalid/quantity-rule cases—as accessible cart feedback. Do not render server description as HTML or retain rejected optimistic values.
- [ ] Publish one confirmed `cart:changed` transition after reconciliation. Header count and drawer are subscribers; neither starts an independent polling/mutation loop.
- [ ] Record endpoint choice, locale path, sections/context, current key, response/error shape, optimistic snapshot, overlap behavior, subscriber evidence, and native fallback in `notes.md`.

> [VERIFY] Confirm target-store cart endpoint response shapes, actual line keys after property/discount/plan changes, bundled-section support/section IDs/`sections_url`, quantity rules, inventory errors, and section null behavior before release.

## Constraints

Do not use the Cart AJAX API on a custom storefront. Do not hard-code `/cart/`, construct totals/discounts locally, use a variant ID where duplicate lines make targeting ambiguous, publish click intent as confirmed state, or fetch count/drawer in separate uncoordinated requests after mutation. Do not add a framework. Keep all work within these starter paths.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/cart-drawer.liquid` | Drawer markup with line keys and replaceable section root. |
| `starter/sections/cart-icon-bubble.liquid` | Header count root that currently assumes local increments. |
| `starter/assets/cart-transition.js` | Three competing unsafe cart behaviors. |
| `starter/assets/cart-transition.css` | Finished pending, status, and error presentation styles. |
| `starter/notes.md` | Endpoint, response, reconciliation, race, accessibility, and fallback evidence. |

## Done when

The native cart/form baseline works without JavaScript. A successful current cart mutation commits server-confirmed state and matching validated drawer/count sections; duplicate variant lines target the intended current key; a rejected mutation produces an accessible recovery and no stale optimistic count; and subscribers render one confirmed transition without generating further cart requests.

## Stretch

Design a clear-cart transition with confirmation, cancellation, current-request protection, and coordinated drawer/count/cart-page recovery. Explain why an empty prediction is riskier than a confirmed response. Do not implement it.
