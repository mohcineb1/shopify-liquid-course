<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 60 — Solution

## The approach

The cart animation is a performance hypothesis, not a headless business case. The starter exposes a token, assumes a global customer object, uses a non-locale-aware cart path, hides all content until JavaScript completes, and calculates a total in the browser. The correct first move is a bounded theme repair: Liquid supplies useful baseline content, the Ajax API supplies current-session cart data in a Shopify-hosted theme, and a small island owns only its visible interaction state. Hydrogen remains a decision candidate, not the implementation.

| Question | Decision |
| --- | --- |
| Does the current theme cart need a new GraphQL client? | No. Current-session cart behavior fits Ajax API `[VERIFY]` actual need |
| Can browser JavaScript calculate commerce truth? | No. Shopify cart response is authoritative |
| Can Ajax read customer/order records? | No; it is not that API surface |
| Is Storefront API needed for this theme island? | No; reserve it for a real custom storefront/data contract |
| Is headless approved because animation is slow? | No; measure baseline, attempt scoped repair, then decide against explicit outcomes |

## 1 — API decision

`records/api-decision.md` captures the reasoned choice:

| Task | Correct surface | Reason | Rejected surface |
| --- | --- | --- | --- |
| Read/update current theme cart | Ajax API | Shopify-hosted theme, current-session cart, locale-aware route | Storefront API adds token/query/operation ownership without needed outcome |
| Render cart link/count baseline | Liquid | Server-rendered current cart is immediately useful | Client-only shell makes failure blank |
| Customer/account/order data | Approved account/app/API architecture `[VERIFY]` | Ajax cannot read it | `window.customer`/cart script inference |
| Fully custom storefront | Storefront API/Hydrogen after decision | Custom platform needs GraphQL commerce contract | Ajax unavailable outside Shopify-hosted theme |

The Ajax API is unauthenticated, returns JSON, and supports current cart read/update in hosted themes; use `window.Shopify.routes.root` to preserve selected locale/market path context.[1] Do not expose a Storefront token “for later,” and do not move a cart drawer to GraphQL simply because GraphQL exists. Storefront API tokenless and token-based modes, GraphQL complexity, query shape, buyer context, caching, and error handling belong to a custom-storefront design record `[VERIFY]`.[2]

## 2 — Corrected Liquid shell and island

The section retains an accessible server-rendered link. It exposes no token, customer value, or local total. A tiny config node communicates only the endpoint needed by the island.

```liquid
{{ 'cart-island.css' | asset_url | stylesheet_tag }}
{{ 'cart-island.js' | asset_url | script_tag }}

<div class="cart-island" data-cart-island aria-live="polite">
  <a class="cart-island__link" href="{{ routes.cart_url }}">
    Cart (<span data-cart-count>{{ cart.item_count }}</span>)
  </a>
  <p class="cart-island__status" data-cart-status hidden></p>
</div>
<script type="application/json" data-cart-island-config>
  {"cart_url":"{{ routes.cart_url }}"}
</script>
```

> [VERIFY] In production, use a context-safe JSON serialization strategy for values that can contain quotes or customer-controlled text; the limited starter URL example is not a general JSON-construction pattern.

The JavaScript reads the config, uses the locale-aware root exposed by Shopify, treats the response as truth, and displays a recoverable error. It does not create global application state, calculate totals, or hide the link before JavaScript works.

```js
(function () {
  const island = document.querySelector('[data-cart-island]');
  if (!island || !window.Shopify || !window.Shopify.routes) return;

  const count = island.querySelector('[data-cart-count]');
  const status = island.querySelector('[data-cart-status]');
  let requestId = 0;

  async function refreshCart() {
    const activeRequest = ++requestId;
    island.setAttribute('aria-busy', 'true');
    status.hidden = true;

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart.js`);
      if (!response.ok) throw new Error('cart-read-failed');
      const cart = await response.json();
      if (activeRequest !== requestId) return;
      count.textContent = String(cart.item_count);
    } catch (error) {
      if (activeRequest !== requestId) return;
      status.textContent = 'Cart details could not be refreshed. Open your cart to continue.';
      status.hidden = false;
    } finally {
      if (activeRequest === requestId) island.removeAttribute('aria-busy');
    }
  }

  refreshCart();
}());
```

An actual add/update flow also disables the triggering control while pending, reads user-facing `description`/error information safely, announces success/failure, rejects stale responses, and refreshes the right theme region. The existing cart page and link remain the no-JavaScript and error fallback.

```css
.cart-island { border: 1px solid currentColor; padding: 1rem; }
.cart-island__status { margin-block: .5rem 0; }
```

## 3 — Island contract

`records/island-contract.md` records the boundary before the component grows:

| Field | Contract |
| --- | --- |
| Mount | One `[data-cart-island]` shell on an approved theme surface |
| Owner | Theme team `[VERIFY]` |
| Input | Server-rendered count and minimal locale-aware cart configuration |
| Data source | Ajax current-session cart response |
| Authority | Presentation only; Shopify response owns cart state, totals, inventory, eligibility, checkout |
| Lifecycle | Idempotent initialization; request versioning rejects stale response; cleanup if theme editor/navigation lifecycle needs it `[VERIFY]` |
| States | Baseline link, pending busy state, success count, recoverable error, no-JS fallback |
| Accessibility | Semantic link, `aria-busy`, concise live status, keyboard path preserved |
| Budget | Named JS/request/interaction budget measured on representative fixtures `[VERIFY]` |
| Removal | Delete asset/config without breaking cart link/page |

The contract prevents the common hybrid failure: an “island” that gradually owns routing, pricing, customer identity, checkout behavior, and every page. When that happens, reassess architecture; do not keep expanding an unowned client runtime.

## 4 — Headless decision and migration register

`records/headless-decision.md` does not select Hydrogen. It compares three options against a named buyer outcome and measured baseline.

| Criterion | Theme repair | Hybrid island | Hydrogen/Oxygen |
| --- | --- | --- | --- |
| Proven cart animation issue | Fix asset/render/event bottleneck first | Use only if scoped client state solves measured issue | Not justified by animation alone |
| Merchant editing | Existing sections/settings | Existing shell retains editor | Requires custom content/editor integration |
| Apps/accounts/checkout/pixels | Existing compatibility assessed | Same, plus island contract | Re-verify every critical integration |
| Operations | Theme release workflow | Theme plus small asset budget | React Router/GraphQL/SSR/cache/runtime/env/CI/CD/incident ownership |
| Go/no-go | Measured improvement and no regression | Same plus island value proof | Named new storefront outcome, funded team, migration/rollback evidence |

Hydrogen is a React Router app with Shopify utilities; Oxygen offers edge hosting, environments, caching, CDN integration, and worker-runtime constraints.[3] Those are valuable capabilities only when the team owns them. Actual plan, Oxygen/runtime limits, host, environments, secrets, deployment, monitoring, app compatibility, performance target, operating cost, and approval are `[VERIFY]`.

The candidate migration register includes shared-cart continuity, products published in both channels, Shopify-hosted checkout/subdomain, route redirects/canonicals, feeds, notification URLs, accounts/auth, pixels/consent, apps, Markets/B2B, SEO, observability, release and rollback. Shopify documents shared Online Store/Storefront API carts, conditioned on product publication in both channels, as well as checkout subdomain and redirect work when migrating to Hydrogen.[4] This supports a controlled vertical slice; it does not make the rest of a theme portable automatically.

## 5 — Maintenance model and validation

`records/maintenance-model.md` separates one-time build from ongoing ownership: API version upgrades, GraphQL query/cost/caching, bundle and SSR budgets, hosting environments/secrets, CI/CD, logs/alerts/incidents, dependency retirement, content workflow, SEO/redirect monitoring, support, test fixtures, and route/app ownership. A headless proposal without accountable owners for these rows is incomplete.

`records/validation-matrix.md` tests locale-aware root, cart success/failure/repeated actions, no-JS link fallback, payload minimization, island removal, theme/app compatibility, baseline/target performance, and—only if approved—a candidate headless slice with shared cart, hosted checkout, redirect/SEO, release, and rollback evidence. No real buyer data, token, production traffic, publishing, store configuration, or live deployment belongs in the exercise.

## What people get wrong here

**Treating Storefront API as a modern Ajax API.** It is GraphQL commerce infrastructure for custom storefronts, with different authentication, query, cache, version, and runtime obligations.

**Hydrating away the fallback.** If the cart link disappears until JavaScript succeeds, a minor interaction enhancement becomes a purchase-path outage.

**Calling a global widget an island.** A real island has a bounded mount, data source, authority, lifecycle, performance budget, and removal path.

**Estimating headless only as a build.** The recurring ownership of routes, APIs, environments, content, SEO, apps, monitoring, incidents, and upgrades is the architecture cost.

## References

[1]: https://shopify.dev/docs/api/ajax "Shopify — Ajax API"
[2]: https://shopify.dev/docs/api/storefront "Shopify — Storefront API"
[3]: https://shopify.dev/docs/storefronts/headless/hydrogen/fundamentals "Shopify — Hydrogen and Oxygen fundamentals"
[4]: https://shopify.dev/docs/storefronts/headless/hydrogen/migrate "Shopify — Migrate from Online Store to Hydrogen"
