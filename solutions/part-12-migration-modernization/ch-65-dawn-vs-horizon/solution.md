<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 65 — Solution

## The approach

The starter assumes private DOM access is a migration plan. It mixes local blocks with Theme Blocks, treats a guessed Shadow DOM implementation as fact, and selects Horizon because it is newer. The solution instead preserves the product section’s local responsibility, creates one independent editorial Theme Block and compatible parent, replaces selectors with an owned event boundary, scopes CSS to owned markup, and makes the base-theme decision contingent on candidate evidence.

| Concern | Candidate decision |
| --- | --- |
| Product form/variants | Retain parent-owned product section; do not reimplement platform/component internals |
| Editorial content | Use an independent Theme Block with preset and no outer-variable dependency |
| Component boundary | Discover documented public contract; no Shadow DOM scraping |
| Legacy JS/CSS | Inventory and adapt through supported hook/refactor/shim/retirement/blocker path |
| App | Verify actual app target/host/fallback in candidate |
| Base theme | Conditional choice after candidate scorecard and reversal record |

## 1 — Architecture comparison

`records/architecture-comparison.md` compares actual candidate repositories by template, section, block, snippet, asset, config, app host, merchant state, route fixture, and owner. Shopify identifies Theme Block-capable themes—including Horizon-family themes—as the latest architecture version, while OS 2.0 provides sections on every page and dynamic sources.[1] That is a capability distinction, not proof that a selected build has any particular custom element, markup, app target, or public component API.

The ledger classifies the starter’s `product-main` as a local product-context component with form and accessibility responsibilities. `editorial-grid` is a broken mixed block parent. `editorial-tile` is a potential reusable block only after it loses its implicit `product.vendor` dependency. The selector script/CSS, reviews-app host, analytics/test selectors, and merchant custom CSS are integration dependencies—not files to copy blindly.

## 2 — Composition decision

`records/composition-decision.md` retains product form/variant behavior in a focused section. Its content depends on product context, form semantics, state announcements, and selected component behavior `[VERIFY]`. The reusable editorial tile is extracted because it has a complete independent data/style/semantic/preset contract.

<!-- solution/blocks/editorial-tile.liquid -->
```liquid
<article class="editorial-tile editorial-tile--{{ block.settings.tone }}" {{ block.shopify_attributes }}>
  {% if block.settings.heading != blank %}
    <h3>{{ block.settings.heading | escape }}</h3>
  {% endif %}
  {{ block.settings.text }}
</article>

{% schema %}
{
  "name": "Editorial tile",
  "settings": [
    {"type": "text", "id": "heading", "label": "Heading"},
    {"type": "richtext", "id": "text", "label": "Text"},
    {"type": "select", "id": "tone", "label": "Tone", "default": "default", "options": [{"value": "default", "label": "Default"}, {"value": "muted", "label": "Muted"}]}
  ],
  "presets": [{"name": "Editorial tile"}]
}
{% endschema %}
```

A Theme Block can use `block`, its rendering `section`, and global objects, but it cannot access variables created outside it or receive snippet-style parameters.[2] The solution removes the outer product dependency. Actual targeting, dynamic source compatibility, nesting, app inclusion, editor/version behavior, and merchant copy requirements remain `[VERIFY]`.

## 3 — Compatible parent and public component boundary

`editorial-grid` chooses the Theme Block model. It has no local section block schema.

<!-- solution/sections/editorial-grid.liquid -->
```liquid
<section class="editorial-grid" aria-labelledby="editorial-grid-title-{{ section.id }}">
  <h2 id="editorial-grid-title-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
  {% content_for 'blocks' %}
</section>

{% schema %}
{
  "name": "Editorial grid",
  "settings": [{"type": "text", "id": "heading", "label": "Heading", "default": "Editorial highlights"}],
  "blocks": [{"type": "@theme"}, {"type": "@app"}],
  "presets": [{"name": "Editorial grid"}]
}
{% endschema %}
```

Shopify’s Theme Block guidance says a section uses local section blocks or opts into Theme Blocks; it cannot support both.[2] `content_for 'blocks'` renders persisted child blocks in configured order. The `@app` entry is not proof that an installed app works in this particular host; that stays in candidate validation.

`records/component-boundary.md` lists the selected component’s required public element name, documented events/properties/slots/parts, server fallback, lifecycle, focus/error/live updates, browser support, test fixture, owner, and escalation. Every value is `[VERIFY]`. It explicitly rejects `shadowRoot` probing, selector access to private descendants, forced style injection, and a mutation observer that focuses internal controls. If the component exposes no supported extension point, classify the desired feature as blocker, retain an owned section where feasible, or defer the base-theme choice.

## 4 — Compatibility ledger and corrected owned assets

`records/compatibility-ledger.md` assigns a path to every dependency.

| Starter dependency | Adaptation | Gate |
| --- | --- | --- |
| `.product-form__input`/price rewrite | Owned refactor; subscribe only to documented public state/event `[VERIFY]` | Candidate variant/form/fallback test |
| Global mutation observer | Approved retirement | No focus theft; component lifecycle fixture |
| `!important` variant CSS | Approved retirement/blocker unless public styling contract exists | Candidate visual/a11y test |
| Reviews app `.product-main` assumption | Supported contract or blocker `[VERIFY]` | App host/placement/fallback test |
| Analytics/test selectors | Owned refactor to stable owned markers | Events/test contract and no data expansion |
| Merchant custom CSS | Candidate-only mapping or merchant-approved retirement | Output comparison and content-owner sign-off |

<!-- solution/assets/product-port.js -->
```js
(function () {
  const root = document.querySelector('[data-product-integration]');
  if (!root) return;

  root.addEventListener('product-state-change', (event) => {
    // Consume only a documented owned/public event contract [VERIFY].
    const detail = event.detail || {};
    root.dataset.productState = detail.state || 'unknown';
  });
}());
```

<!-- solution/assets/product-port.css -->
```css
.editorial-tile { border: 1px solid currentColor; padding: 1rem; }
.editorial-tile--muted { opacity: 0.8; }
```

The JavaScript is deliberately a placeholder for an owned/public event, not a claim that a specific Horizon event exists. A temporary candidate-only shim must name owner, expiry, review date, fixture, release gate, monitoring condition, rollback, and deletion test. It cannot be a permanent way to reach private implementation.

## 5 — Base-theme selection and validation

`records/base-theme-selection.md` issues a conditional recommendation: choose the lowest-risk candidate that passes the client’s documented editorial, buyer journey, app, accessibility, performance, localization, update, support, timeline/budget, ownership, and reversal gates `[VERIFY]`. A Dawn/OS 2.0 baseline is reasonable if required integrations depend on its existing documented/owned contracts and Theme Block flexibility has no validated client value. A selected Horizon candidate is reasonable if independent reusable/nested content solves a documented workflow and every critical integration passes the public-boundary audit. “Newer” does not pass a gate.

`records/candidate-validation-matrix.md` uses sanitized fixtures for product form/variant behavior, component initial/upgrade/failure states, keyboard/focus/errors/live announcements, no-JavaScript, app host/fallback, CSS/custom CSS, tile add/reorder/duplicate/empty content, routes/locales, performance, update diff, release, and rollback. No private DOM probe, vendor request, customer data, real production theme, or published change is required.

## What people get wrong here

**Theme Blocks replace all local blocks.** They need independent contracts; tightly coupled product components may remain local.

**Shadow DOM requires a clever selector.** It requires documented public integration or a design decision.

**Global CSS is a safe visual patch.** It is usually a private-markup dependency and can damage accessibility or later updates.

**App compatibility is inherited from theme architecture.** Verify the app’s own current host/target and fallback.

## Stretch: direction only

A shim policy admits only a temporary owned adaptation where no public contract is available yet and core client value is documented. It needs security/accessibility/performance review `[VERIFY]`, neutral instrumentation, an expiry, upstream issue/owner, release gate, fallback, and a deletion proof. A shim must never inspect private component internals or turn unknown behavior into a compatibility guarantee.

## References

[1]: https://help.shopify.com/en/manual/online-store/themes/managing-themes/versions "Shopify Help — Theme architecture versions and sources"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start "Shopify — Theme Blocks quick start"
[3]: https://shopify.dev/docs/storefronts/themes/architecture "Shopify — Theme architecture"
