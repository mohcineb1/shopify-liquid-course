<!-- STATUS: final -->
---
id: ch-38
title: "The Cart AJAX API"
part: 6
---

# Chapter 38 — The Cart AJAX API

An interactive cart is not a client-side shopping database. It is a view of the current-session cart that Shopify owns: inventory, price, discounts, selling plans, bundled/remote lines, keys, quantity rules, and checkout eligibility can all change server-side. The Cart AJAX API lets a Shopify-hosted theme read and mutate that session without full navigation, but correct UX means treating every response as authoritative, pairing mutations with rendered cart surfaces when needed, reconciling optimistic hints, explaining errors, and broadcasting one confirmed cart state to independent components.

## What you’ll be able to do

- Select the narrow Cart API endpoint for a cart read, add, one-line change, bulk update, or clear action.
- Use bundled section rendering to return cart state and affected UI together.
- Design optimistic feedback that reconciles with server truth and rolls back safely.
- Turn structured errors, inventory limits, and quantity rules into recoverable UI.
- Publish confirmed cart transitions to independently owned cart count, drawer, cart page, and product controls.

## 38.1 Every endpoint: `/cart.js`, `/cart/add.js`, `/cart/change.js`, `/cart/update.js`, `/cart/clear.js`

The Ajax API is available to Shopify-hosted themes, not custom storefronts. It uses locale-aware URLs built from `window.Shopify.routes.root`; API responses are JSON. Use GET for the cart read and POST for cart mutation. It is unauthenticated, but it is not a route around Shopify’s commerce authority or a way to read customer/order data. [1]

| Endpoint | Method | Purpose | Primary caution |
| --- | --- | --- | --- |
| `cart.js` | GET | Read current session cart. | Display state can already be stale by the next mutation. |
| `cart/add.js` | POST | Add one/multiple variant items. | Same variant can split into distinct lines for properties/pricing/plans. |
| `cart/change.js` | POST | Change a specific existing line. | Use current line key/identity; reconcile response. |
| `cart/update.js` | POST | Update quantities, note, or attributes. | Variant IDs can be ambiguous; it can add an unmatched variant. |
| `cart/clear.js` | POST | Empty current cart. | Confirm intent and reconcile all cart surfaces. |

```js
const root = window.Shopify.routes.root;
const cart = await fetch(`${root}cart.js`).then((response) => {
  if (!response.ok) throw new Error(`Cart read failed: ${response.status}`);
  return response.json();
});
```

Use `add.js` with the native product form’s `FormData` when enhancing add-to-cart, so valid variant, quantity, properties, and selling-plan fields remain aligned with the no-JavaScript form. Do not convert a form into a handwritten item payload unless you own every field/validation boundary. Successful add responses describe the added line items, not necessarily every cart display surface; fetch/re-render/reconcile the complete state your UI needs. [2]

```js
async function addFromForm(form) {
  const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
    method: 'POST', body: new FormData(form)
  });
  const payload = await response.json();
  if (!response.ok) throw payload;
  return payload;
}
```

For an existing line change, use current line identity and server response. `update.js` accepts quantity updates, note, and attributes, but Shopify documents that duplicate lines can share a variant ID when their properties, prices, or selling plans differ. Prefer a line key to target the intended line; remember a key can change when line characteristics change, so refresh it from authoritative cart/rendered response. [2]

## 38.2 Sections parameter on cart endpoints — the combined pattern

A cart mutation can request bundled section rendering: include the required section IDs with the cart request so the response carries updated cart data and HTML for affected cart surfaces. This is stronger than “mutate cart, then launch unrelated cart and Section Rendering requests”: one response represents one server-side cart transition and reduces windows where a drawer, count, and cart page disagree. [2]

```js
const response = await fetch(`${window.Shopify.routes.root}cart/change.js`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: lineKey,
    quantity: nextQuantity,
    sections: ['cart-drawer', 'cart-icon-bubble'],
    sections_url: window.location.pathname
  })
});
const payload = await response.json();
```

Treat returned section HTML like the contract in `ch-37-the-section-rendering-api`: validate each required section before swapping its root, handle null/missing values, and initialize/recover behavior after replacement. The relevant context may matter for a cart-related section; `sections_url` makes that context explicit. [2]

> [VERIFY] Confirm target-theme section instance IDs, response keys, section context/`sections_url`, null-section behavior, and bundled-rendering support for every cart endpoint used. Inspect actual mutation responses rather than assuming a generic JSON shape.

The wrong approach is a cart mutation followed by three independent requests that each render a different snapshot:

```js
// Wrong: unrelated responses can commit in a different order.
await fetch('/cart/change.js', { method: 'POST', body: JSON.stringify({ id: lineKey, quantity: 2 }) });
fetch('/cart.js').then(renderCount);
fetch('/?sections=cart-drawer').then(renderDrawer);
```

The right approach makes one mutation response the reconciliation point, then publishes its confirmed cart state and validated sections.

## 38.3 Optimistic UI and rollback

Optimistic UI means a temporary local prediction, not a claim that the cart changed. A quantity stepper might immediately show the requested number and pending state, but must retain a snapshot of confirmed cart/UI state, disable or serialize conflicting actions, and replace the prediction with the server response. If the request fails or returns a different allowed quantity, restore/reconcile to server truth, announce what happened, and leave a usable retry/native path.

```js
const previous = readConfirmedLine(lineKey);
showPendingLine(lineKey, nextQuantity);
try {
  const result = await changeLine(lineKey, nextQuantity);
  reconcileCart(result); // server price, line key, quantity, sections
} catch (error) {
  restoreLine(previous);
  announceCartError(describeCartError(error));
}
```

Never optimistically calculate final totals, discounts, shipping eligibility, inventory acceptance, or line keys from a local arithmetic model. Server responses can apply constraints or transforms. For high-risk mutations such as clear cart, confirmation and a non-optimistic pending state can be better than an instantly empty drawer that must be rebuilt after failure.

Concurrency still matters. Serialize per-cart mutation work or use a cart transition version/queue. A plus click, then remove click, can otherwise return out of order and restore an obsolete line. A confirmed response that changes keys invalidates pending work addressed to the old key; cancel/rebase it deliberately rather than replaying blindly.

## 38.4 Error shapes, sold-out handling, quantity rules

Cart failures are JSON errors, not only transport failures. Shopify documents 422 examples with `status`, `message`, and `description` when inventory is sold out or requested quantity exceeds available stock. An attempt above stock can produce a server-adjusted maximum; the UI must use returned cart state, show a human-readable message, and restore controls to the confirmed quantity rather than retaining the visitor’s rejected value. [2]

```js
async function changeLine(id, quantity) {
  const response = await fetch(`${window.Shopify.routes.root}cart/change.js`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, quantity })
  });
  const payload = await response.json();
  if (!response.ok) throw payload;
  return payload;
}
```

Render server-provided messages as text, not trusted HTML. Connect the message to the affected line/control, use a status/alert appropriate to severity, and do not promise an automatic retry for semantic errors such as sold-out inventory. Quantity controls should honor currently rendered `quantity_rule` minimum/maximum/increment where available, but their client-side constraints are hints; Shopify validates the final request. When an item has properties, a plan, discounts, or bundles, request/compare the complete server representation before assuming a price or line identity survived.

> [VERIFY] Test stock limits, sell-out, quantity rules, discount changes, selling plans, remote/bundled items, and malformed identifiers on the target store. Error descriptions and permitted transitions should be observed per configuration.

## 38.5 Cart state as a pub/sub layer across components

A header count, cart drawer, cart page, product add button, and free-shipping indicator should not independently poll and mutate their own idea of the cart. Define a small cart store/event boundary: a mutation coordinator performs the request; it validates/reconciles the response; it publishes a **confirmed transition** containing canonical cart data, request version, changed sections, and a reason; components subscribe and render their own region. The store does not authorize commerce or compute prices—it distributes Shopify’s confirmed result.

```js
const cartEvents = new EventTarget();
function publishCart(cart, reason) {
  cartEvents.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart, reason } }));
}
cartEvents.addEventListener('cart:changed', ({ detail }) => {
  document.querySelectorAll('[data-cart-count]').forEach((node) => { node.textContent = detail.cart.item_count; });
});
```

Subscribers must tolerate a replaced drawer DOM and avoid duplicate listeners. Publish after current-response reconciliation, not when the button is clicked. Give a component one input contract—cart data, validated section HTML, or both—and document who owns focus, announcements, and errors. For server-rendered component lifecycle patterns see `ch-39-web-components`; for native full-page cart behavior see `ch-30-cart-line-items`.

## Gotchas

- Building `/cart/...` URLs without `window.Shopify.routes.root`, thereby losing market/locale routing.
- Using variant ID in `update.js` when duplicate cart lines make the target ambiguous.
- Assuming a line key is permanent after property/discount/plan changes.
- Treating a 422 JSON body as a successful cart response because JSON parsing worked.
- Calculating discounts/totals locally and letting an optimistic prediction persist after server reconciliation.
- Publishing button-click state as if it were confirmed cart state.
- Refetching separate drawer/count snapshots after a mutation instead of requesting coordinated bundled sections.

## Checklist

- [ ] Each interaction chooses the narrow endpoint and uses a locale-aware URL.
- [ ] FormData/native product semantics survive add-to-cart enhancement.
- [ ] Mutation response reconciles cart/sections before subscriber publication.
- [ ] Optimistic state has a snapshot, pending policy, server reconciliation, rollback, and accessible error path.
- [ ] Quantity/error/line-key transitions are validated against target-store behavior.
- [ ] Components subscribe to confirmed cart transitions without duplicating transactional ownership.

## Related

- `ch-30-cart-line-items` — cart and line-item data semantics.
- `ch-35-the-form-tag` and `ch-36-every-form-type` — native product/cart form baseline.
- `ch-37-the-section-rendering-api` — response/root replacement and race-safe rendering.
- `ch-39-web-components` — lifecycle-safe components after cart DOM changes.

## References

[1]: https://shopify.dev/docs/api/ajax "Shopify — About the Ajax API"
[2]: https://shopify.dev/docs/api/ajax/reference/cart "Shopify — Cart API reference"

## A cart transition protocol

Name the mutation before writing UI. An add transition has form data, requested cart sections, a pending control, response validation, a confirmed cart payload, optional rendered roots, a subscriber event, and an error/retry path. A line-change transition additionally has the current server line key and a policy for competing changes. A clear transition has explicit user confirmation and replaces every dependent cart surface only after server confirmation. This vocabulary prevents components from emitting informal “cart changed” signals that mean different things.

| Transition stage | Required decision |
| --- | --- |
| Intent | Which endpoint and current server identity are appropriate? |
| Pending | Which control is busy, which actions are serialized, and what remains usable? |
| Request | Which locale-aware URL, body, sections, and context are sent? |
| Response | Is HTTP successful; are cart payload and required sections valid? |
| Commit | Which roots/state replace together, and which stale work is invalidated? |
| Notify | Which confirmed cart version/reason do subscribers receive? |
| Failure | What server message, rollback, focus/status, retry, or native fallback applies? |

This protocol also distinguishes operations that look similar. A “remove” action is normally a line change to quantity zero, while clear changes the entire cart. A cart note update is not an item quantity update. An attribute update does not establish authorization. Pick the narrowest operation so response/retry semantics remain understandable.

## Reconciliation test matrix

Test each mutation against real products and the target theme: one simple item; two lines of the same variant with different properties; a selling-plan line; a discounted line; an inventory-limited item; an empty cart; and any remote/bundle behavior used by the storefront. Verify locale-aware URLs on an international route, returned current quantities/prices/keys, drawer/count/cart-page consistency, error announcement, focus, and no-JavaScript form fallback. Trigger two quick mutations to verify the coordinator does not publish an obsolete state. Test a failed bundled section value separately from mutation success: cart data can be authoritative even when a UI surface needs a safe recovery rendering.

Use browser network records to establish whether bundled sections reduce or merely shift work. Measure requested HTML size, number of parsing/swaps, and time from action to confirmed count/drawer update. Do not optimistically replace expensive whole-cart HTML simply because a single count needs feedback; equally, do not rebuild prices from a small local fragment when the server response supplies the cart truth.

A cart pub/sub layer should be small enough to test. Publish immutable or treated-as-immutable confirmed payloads, include a transition identifier/reason, and make subscribers idempotent. Components may request a fresh server render when their own root is replaced, but no subscriber should mutate cart state as a side effect of hearing its own event. That keeps the mutation coordinator the only transactional writer and makes later component changes less likely to create loops or duplicate requests.

Server reconciliation always wins.
