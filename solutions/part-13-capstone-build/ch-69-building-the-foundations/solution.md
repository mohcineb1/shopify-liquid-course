<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 69 — Solution

## The approach

The starter turns the layout into a product page, uses a global settings file as a data store, allows arbitrary markup/styles, and uses JavaScript as a global customer/cart application. The solution restores boundaries. The layout owns document structure and global groups; settings own stable semantic choices; snippets own small presentational contracts; CSS owns tokens/utilities/component roots; and JavaScript owns optional enhancement only.

| Starter failure | Foundation correction |
| --- | --- |
| Product form in global layout | Main product section remains the sole purchase-form owner |
| Remote parser-blocking bundle | Deferred owned asset with no required framework |
| Arbitrary/global resource settings | Semantic stable color/density settings only |
| Implicit product snippets | Explicit render inputs and negative contracts |
| Global customer/cart variables | Local component lifecycle and minimal notifications |
| Broad CSS/focus removal | Scoped components and visible focus utility |

## 1 — Layout, groups, settings and schemes

The layout exposes a document shell, skip link, main focus target, two deliberate section groups and owned baseline assets. Actual group names, navigation, app blocks, locale/market behavior, installed apps and editor configuration remain `[VERIFY]`.

<!-- solution/layout/theme.liquid -->
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    {{ content_for_header }}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'theme-events.js' | asset_url }}" defer></script>
    <script src="{{ 'theme-element.js' | asset_url }}" defer></script>
  </head>
  <body class="color-{{ settings.color_scheme }} density-{{ settings.layout_density }}">
    <a class="skip-link" href="#MainContent">Skip to content</a>
    {% sections 'header-group' %}
    <main id="MainContent" tabindex="-1">{{ content_for_layout }}</main>
    {% sections 'footer-group' %}
  </body>
</html>
```

No checkout script, remote framework, global product form, customer state or route-specific content remains in this layout. Section groups are global composition boundaries, not template containers. Shopify’s verified limits allow 20 section groups per theme and 25 sections per group; the capstone therefore maintains a minimal, documented header/footer set.[1]

<!-- solution/config/settings_schema.json -->
```json
[
  {
    "name": "Design system",
    "settings": [
      {"type": "select", "id": "color_scheme", "label": "Color scheme", "default": "surface", "options": [
        {"value": "surface", "label": "Surface"},
        {"value": "quiet", "label": "Quiet"}
      ]},
      {"type": "select", "id": "layout_density", "label": "Layout density", "default": "standard", "options": [
        {"value": "compact", "label": "Compact"},
        {"value": "standard", "label": "Standard"},
        {"value": "roomy", "label": "Roomy"}
      ]}
    ]
  }
]
```

`records/foundation-layout-contract.md` and `records/settings-and-color-contract.md` specify document/global ownership, setting role/default/consumer/fallback, contrast/focus review `[VERIFY]`, responsive behavior, market/app policy `[VERIFY]`, editor boundaries and release/rollback. Dynamic resource data is not moved into these general settings because Shopify does not make dynamic sources available there.[2]

## 2 — Snippet library

Every snippet is rendered with explicit inputs. `render` replaces the deprecated `include` tag.[3] The library describes required/optional arguments, semantic output, escaping, empty state, CSS ownership, accessibility/load behavior, callers/tests and negative responsibility.

<!-- solution/snippets/product-card.liquid -->
```liquid
{% if product != blank %}
  <article class="product-card">
    <a class="product-card__link" href="{{ product.url }}">
      <h2>{{ product.title | escape }}</h2>
      {% render 'price', product: product %}
    </a>
  </article>
{% endif %}
```

<!-- solution/snippets/price.liquid -->
```liquid
{% if product != blank %}
  <p class="price">{{ product.price | money }}</p>
{% endif %}
```

<!-- solution/snippets/icon.liquid -->
```liquid
{% if name == 'close' %}
  <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13"/></svg>
{% endif %}
```

<!-- solution/snippets/guide-callout.liquid -->
```liquid
{% if guide != blank %}
  <aside class="guide-callout" aria-labelledby="guide-title-{{ section.id }}">
    <h2 id="guide-title-{{ section.id }}">{{ guide.title | escape }}</h2>
    {{ guide.instructions | metafield_tag }}
  </aside>
{% endif %}
```

The product card does not add to cart. Price does not calculate discounts. The icon is decorative only; callers must label the containing control. The guide receives `guide` explicitly and has no hidden product lookup. Exact price/sale/guide data model details remain `[VERIFY]`.

## 3 — CSS, component and event contracts

<!-- solution/assets/base.css -->
```css
:root { --color-surface: #fff; --color-text: #151515; --focus-ring: #005fcc; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: 1rem; top: 1rem; outline: 3px solid var(--focus-ring); }
.product-card { color: var(--color-text); }
.product-card__link:focus-visible { outline: 3px solid var(--focus-ring); outline-offset: 3px; }
```

`records/foundation-css-contract.md` assigns semantic tokens, utilities, layout primitives and component classes to owners. It removes broad selectors and never removes focus outline. Actual color contrast and component styles require candidate review `[VERIFY]`.

<!-- solution/assets/theme-element.js -->
```js
class ThemeElement extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.abortController = new AbortController();
    this.onConnect();
  }

  disconnectedCallback() {
    this.abortController?.abort();
    this.initialized = false;
  }

  onConnect() {}

  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  }
}

window.ThemeElement = ThemeElement;
```

<!-- solution/assets/theme-events.js -->
```js
window.themeEvents = new EventTarget();

window.themeEvents.emit = (name, detail = {}) => {
  window.themeEvents.dispatchEvent(new CustomEvent(name, { detail }));
};
```

`records/component-and-event-contract.md` defines `northstar:cart:changed` only as a candidate notification, with named producer/consumer, non-sensitive detail, no-JS fallback, error behavior, fixture and deprecation rule `[VERIFY]`. The emitted event is not cart/customer truth and cannot prove an action succeeded. Components query inside their root, connect once and clean listeners through the abort signal; actual editor re-render events remain `[VERIFY]`.

## 4 — Candidate validation

`records/candidate-validation-matrix.md` checks global layout/group empty states, setting/color fallback, long localized label, snippet absent/invalid inputs, native product/card/form behavior without JavaScript, skip/focus keyboard route, connect/disconnect, event absence/consumer failure, editor rerender, asset loading and rollback. No store, customer, cart, checkout, app or remote script is touched.

### Foundation review before interaction work

Before chapter 70 introduces cart or product enhancements, review the foundation with a candidate fixture. Confirm the layout has no product or checkout authority; section groups do not contain route page composition; settings cannot masquerade as data; every snippet call supplies its declared input; CSS focus remains visible; and every optional event has a consumer-free fallback. Test a disconnect/reconnect cycle, a long localized label, a blank guide, no JavaScript, and a route where no cart indicator exists `[VERIFY]`. The result should be recorded against the component and event contract, not corrected with a broad document selector, an undocumented timing delay, or a second global variable.

### Graceful degradation check

If a component cannot initialise, its server-rendered content remains visible, native controls retain their expected behavior, and no global listener should throw because the component is absent. Record that expected degraded path with the same fixture as the enhanced path. This makes failure behavior a designed foundation outcome rather than an accidental blank state.

## What people get wrong here

**A global layout is a convenient product shell.** It must remain a document/global composition boundary.

**Explicit snippet data is verbose.** It makes reuse, tests and failures visible.

**An event bus replaces authoritative state.** It only notifies owned enhancement consumers.

**Focus styling is decorative.** It is a keyboard interaction contract and cannot be globally removed.

## Stretch: direction only

A `northstar:*` event deprecation record should name version, producer notice, migration window `[VERIFY]`, consumer fixture, fallback, removal owner and release evidence. Do not emit an obsolete event simply to preserve an undocumented listener.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/limits "Shopify — Theme limits"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"
[3]: ../../docs/DEPRECATIONS.md "Verified platform deprecations ledger"
