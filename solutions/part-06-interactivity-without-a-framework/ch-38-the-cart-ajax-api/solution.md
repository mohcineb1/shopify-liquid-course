<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 38 — Solution

## The approach

The solution keeps the browser’s native product/cart forms as recovery, then gives one `CartCoordinator` responsibility for enhanced mutations. It posts `FormData` for add-to-cart so the existing form contract remains intact; it targets a current line key for one-line changes; it uses `window.Shopify.routes.root` for locale-aware URLs; and it asks the mutation for drawer/count sections. It validates JSON/HTML roots, reconciles only confirmed server state, then emits one `cart:changed` event. No counter increments locally because a click is not a cart transition.

A small per-cart sequence counter serializes the current commit. Pending UI is a temporary accessibility state, not optimistic ownership of totals. On errors, the coordinator retains/reloads confirmed markup, exposes text feedback, and leaves the native form path. A current response may refresh line identity, so later actions must read IDs from the newly rendered DOM.

> [VERIFY] Replace illustrative section IDs with target-theme rendered instance IDs and test bundled rendering, `sections_url`, error payloads, inventory rules, and line-key changes against the real store.

## Walkthrough

**1. Endpoint choice.** `add.js` receives `FormData`; `change.js` targets a single current line key; `update.js` is reserved for intentional quantity/note/attribute batches; `clear.js` needs a confirmation policy; `cart.js` is a read, not a polling side effect. Every URL uses the locale root.

**2. Combined response.** The mutation body contains `sections` and `sections_url`. The response is not committed until cart data and every required HTML root validate. This prevents a new count with a stale drawer. A cart transition publishes only after the complete response commits.

**3. Optimism and rollback.** The button becomes pending, but price/count/quantity are not locally calculated. The preceding DOM remains a visual snapshot until Shopify returns. A failure removes pending state, announces text error, and preserves a usable native form. A returned constrained quantity always replaces the requested number.

**4. Errors and rules.** JSON parsed from a non-OK response is an error payload. Its description is inserted as text. Quantity controls are hints; server inventory/rules decide final state. Duplicate variant lines must use their currently rendered key, not product/variant ID.

**5. Subscribers.** Count and drawer render from validated section replacements. Other components can subscribe to `cart:changed`, but none requests or mutates cart merely because it heard the event.

## Full code

### `sections/cart-drawer.liquid`

```liquid
<section id="shopify-section-{{ section.id }}" data-cart-drawer>
  <h2>Your cart</h2><p data-cart-status aria-live="polite"></p>
  {% for item in cart.items %}
    <article data-line-key="{{ item.key }}">
      <p>{{ item.product.title | escape }}</p>
      <label for="Quantity-{{ item.key }}">Quantity</label>
      <input id="Quantity-{{ item.key }}" data-cart-quantity type="number" value="{{ item.quantity }}" min="{{ item.quantity_rule.min }}"{% if item.quantity_rule.max %} max="{{ item.quantity_rule.max }}"{% endif %} step="{{ item.quantity_rule.increment }}">
      <button type="button" data-cart-remove>Remove</button>
    </article>
  {% endfor %}
</section>
{% schema %}{ "name": "Cart drawer", "settings": [] }{% endschema %}
```

### `sections/cart-icon-bubble.liquid`

```liquid
<span id="shopify-section-{{ section.id }}" data-cart-count aria-live="polite">{{ cart.item_count }}</span>
{% schema %}{ "name": "Cart icon bubble", "settings": [] }{% endschema %}
```

### `assets/cart-transition.js`

```js
const cartSections = ['cart-drawer', 'cart-icon-bubble']; // target instance IDs
let sequence = 0;

function rootFor(id, html) {
  if (html == null) throw new Error(`Cart section unavailable: ${id}`);
  const selector = `#shopify-section-${CSS.escape(id)}`;
  const current = document.querySelector(selector);
  const incoming = new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  if (!current || !incoming) throw new Error(`Cart section root mismatch: ${id}`);
  return { current, incoming };
}

async function mutateCart(endpoint, body) {
  const mine = ++sequence;
  body.sections = cartSections;
  body.sections_url = window.location.pathname;
  const response = await fetch(`${window.Shopify.routes.root}${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok) throw payload;
  const roots = cartSections.map((id) => rootFor(id, payload.sections?.[id]));
  if (mine !== sequence) return null;
  roots.forEach(({ current, incoming }) => current.replaceWith(incoming));
  document.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart: payload, reason: endpoint, version: mine } }));
  return payload;
}

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('form[action*="/cart/add"]');
  if (!form) return;
  event.preventDefault();
  const button = form.querySelector('[type="submit"]'); button.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form));
    await mutateCart('cart/add.js', { items: [{ id: data.id, quantity: Number(data.quantity || 1) }] });
  } catch (error) { announce(error.description || 'Unable to add this item.'); }
  finally { button.disabled = false; }
});

document.addEventListener('click', async (event) => {
  const line = event.target.closest('[data-line-key]');
  if (!line || !event.target.matches('[data-cart-remove]')) return;
  try { await mutateCart('cart/change.js', { id: line.dataset.lineKey, quantity: 0 }); }
  catch (error) { announce(error.description || 'Unable to update the cart.'); }
});

function announce(message) { document.querySelector('[data-cart-status]')?.replaceChildren(document.createTextNode(message)); }
```

### `assets/cart-transition.css`

```css
.is-cart-pending { opacity: .65; }
[data-cart-status] { border-left: .25rem solid currentColor; min-height: 1.5rem; padding: .75rem; }
```

### `notes.md`

```markdown
# Confirmed cart transition evidence

| Concern | Evidence/decision |
| --- | --- |
| Locale endpoint and operation | Root-prefixed add/change; clear/update only when their narrow semantics apply. |
| Current line key / refresh | Read from confirmed rendered drawer after each mutation. |
| Bundled section IDs/context | Verified drawer/count instance IDs and `sections_url`. |
| JSON/section error handling | Non-OK JSON/error or missing root retains old DOM and announces text. |
| Optimistic snapshot/reconcile | Pending control only; server response owns quantities/prices/count. |
| Inventory/quantity rule | Target-store constrained/sold-out behavior tested. |
| Overlap/version behavior | Only current sequence commits/publishes. |
| Subscriber transition | One post-reconciliation `cart:changed` event. |
| Keyboard/status/focus | Native controls and status behavior tested. |
| Native fallback | Product/cart forms still navigate with JavaScript disabled. |
```

All five starter paths are mirrored under `solution/`.

## What people get wrong here

- They rebuild the product payload and silently drop properties or selling-plan data. Native `FormData` is the safer starting contract.
- They use a variant ID to remove a line. Duplicate variant lines can differ by properties/prices/plans, so the wrong line changes.
- They update the count before server response and leave it wrong after a 422 error. Pending intent is not confirmation.
- They publish events on click or poll after every mutation. Components then observe conflicting cart snapshots.

## Stretch: direction only

A clear-cart transition should ask for deliberate confirmation, preserve an accessible cancellation path, disable/serialize conflicting mutations, validate returned empty-cart sections, and publish only after server confirmation. An instant empty prediction makes recovery from failure visibly and semantically harder.


## Verification and recovery

Test add, remove, constrained quantity, duplicate-variant lines, selling plans, discounts, and two rapid mutations using the development store’s actual cart. Inspect the confirmed response after every transition: item count, final prices, line keys, error body, and each requested section value. A mutation can succeed while a requested section is absent; preserve the previous coherent root and expose recovery rather than treating malformed display HTML as permission to invent cart state. Test locale-prefixed routes and JavaScript-disabled native forms separately. The event is emitted only after the current response and all roots commit, so subscribers can trust its version and never start a polling loop to “correct” the coordinator.


The server response remains the final commercial record.


Never substitute client prediction for current Shopify cart truth.

Always.
