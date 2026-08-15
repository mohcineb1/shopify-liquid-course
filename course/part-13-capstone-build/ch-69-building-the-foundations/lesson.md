<!-- STATUS: final -->
---
id: ch-69
title: "Building the Foundations"
part: 13
words: 2450
---

# Chapter 69 — Building the Foundations

The foundation is the small set of contracts every later capstone feature depends on. It is not a universal `utils.js`, a massive layout file, or a global component registry. A durable theme foundation gives pages a predictable document shell, merchants controlled global editing surfaces, components explicit rendering/data contracts, and JavaScript a narrow enhancement channel that does not become commerce authority.

Northstar Apparel’s chapter-68 records remain the source of truth: markets, plan, section-group configuration, actual navigation, color values, apps, component names, content, browser support, and performance baseline are `> [VERIFY]`. This chapter provides an implementation shape for a candidate theme, not a claim about a live storefront.

## 69.1 Layout, section groups, global settings, color schemes

A layout owns the document-level shell: `<!doctype html>`, language, viewport, head integrations that belong to the theme, a skip link, the primary content target, global header/footer section groups, and `content_for_layout`. It should not contain route-specific product markup, custom checkout code, buyer-data logic, or a growing collection of app/analytics scripts. Those choices have separate authority, consent, and migration contracts.

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    {{ content_for_header }}
    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'theme.js' | asset_url }}" defer></script>
  </head>
  <body class="color-{{ settings.color_scheme }}">
    <a class="skip-link" href="#MainContent">Skip to content</a>
    {% sections 'header-group' %}
    <main id="MainContent" tabindex="-1">{{ content_for_layout }}</main>
    {% sections 'footer-group' %}
  </body>
</html>
```

This is a candidate pattern. Verify the selected theme’s supported section-group names, locale context, app requirements, existing document structure, asset strategy, skip-link copy, market behavior, and accessibility test result before adoption. The `main` target and skip link make keyboard navigation testable; they do not by themselves prove conformance.

A **section group** is a merchant-editable JSON container rendered from the layout, commonly for global header/footer regions. Its purpose is structural composition, not a route-specific dumping ground. Document which section types belong in it, what may be reordered, app-block policy `[VERIFY]`, market override policy `[VERIFY]`, maximum composition complexity, empty state, owner, and candidate fixture. Shopify’s architecture limits a theme to 20 section groups and 25 sections in a section group; the capstone should use few intentional global surfaces rather than treat the group as limitless.[1]

| Layer | Owns | Does not own |
| --- | --- | --- |
| `theme.liquid` | Document shell, global target, layout groups, baseline assets | Product form, campaign data, checkout hacks, business rules |
| Header/footer group | Global navigation/content composition | Route-specific page layouts or private app assumptions |
| JSON template | Route section ordering and route composition | Global document markup |
| Section | Bounded landmark/editor module | Unrelated global data or hidden cross-route state |
| Global setting | Stable design/system choice | Resource-scoped product or campaign data |

Global settings should express stable design roles: typography choices, color schemes, layout density, logo, and perhaps controlled display defaults. They are not a content database. Dynamic sources are unavailable for general theme settings, so a product title, care guide, or market-specific product fact cannot be honestly modeled as a global settings connection.[2] Put route/resource data in an appropriate section/block context or a typed record with a deliberate consumer.

A **color scheme** is a semantic set of roles such as surface, text, accent, and border. It should describe relationships, not a bag of brand hex values. The scheme contract includes default/fallback roles, approved pairings, focus/error/sale state, contrast review process `[VERIFY]`, component consumers, dark/high-contrast behavior `[VERIFY]`, and editor restrictions. A component receives `color-{{ section.settings.color_scheme }}` or another bounded role; it does not receive arbitrary inline CSS. That makes a later card, modal, or product section predictable and prevents one merchant setting from breaking focus visibility or page hierarchy.

| Setting decision | Safe contract | Unsafe alternative |
| --- | --- | --- |
| Surface color | Named scheme role with approved text/border/focus pair | Per-section arbitrary background/text overrides |
| Layout density | Three documented tokens with responsive behavior | Free-form pixels injected into CSS |
| Logo | Image setting with alt/fallback/size boundary | URL string with no ownership or display rule |
| Heading scale | Curated type role | Arbitrary HTML heading selector |
| Campaign data | Section setting or typed dynamic data | General global setting pretending to be resource data |

The foundation must protect merchant flexibility, not eliminate it. Editors can arrange intended sections/blocks, choose a documented scheme, and provide approved content. They cannot create a new form authority, bypass accessible controls, add remote script tags, or override component internals through an “advanced” field. When flexibility is genuinely required, document the scope, owner, test fixture, quality impact, rollback, and `[VERIFY]` configuration before widening the contract.

## 69.2 The theme's standard library of snippets

A snippet library provides small, explicit building blocks. The standard is not “reuse everything”; it is **reuse with an input contract**. Each snippet names expected parameters, accepted types, output semantics, empty behavior, escaping/sanitisation needs, CSS class ownership, accessibility obligations, performance cost, caller contexts, and tests. A snippet should not silently reach into a parent’s arbitrary variables, assume a `product` exists, or open/close page landmarks that only a section can own.

```liquid
{% comment %}
  Renders a linked product card.
  Requires: product (Product)
  Optional: image_loading ('eager' or 'lazy')
{% endcomment %}
{% if product != blank %}
  <article class="product-card">
    <a class="product-card__link" href="{{ product.url }}">
      {% if product.featured_image != blank %}
        {{ product.featured_image | image_url: width: 800 | image_tag: loading: image_loading, alt: product.featured_image.alt }}
      {% endif %}
      <h2>{{ product.title | escape }}</h2>
      <p>{{ product.price | money }}</p>
    </a>
  </article>
{% endif %}
```

The caller makes context visible:

```liquid
{% render 'product-card', product: product, image_loading: 'lazy' %}
```

Use `{% render %}`, not deprecated `{% include %}`. The repository’s verified ledger identifies `include` as deprecated and records `render` as the replacement.[3] This is more than syntax: render’s isolated scope makes inputs explicit, which protects reuse and makes audits possible.

Northstar’s candidate standard library can include: `icon`, `visually-hidden`, `skip-link`, `product-card`, `price`, `media`, `button`, `pagination`, `form-errors`, `loading-state`, `guide-callout`, and `empty-state`. It should not ship every possible component in advance. Start with a need from the route/component inventory and add a snippet only when its contract is clearer than the duplication it replaces.

| Snippet | Required input | Responsibility boundary |
| --- | --- | --- |
| `icon` | Named supported icon | Decorative or labelled icon markup; no button action |
| `price` | Product/variant price context `[VERIFY]` | Present price/status; no price calculation |
| `product-card` | Explicit product | Linked presentation; no product form authority |
| `media` | Image/media and load policy | Responsive dimensions/alt/loading behavior |
| `form-errors` | Form errors | Error summary/field linking; no validation authority |
| `guide-callout` | Explicit guide | Structured supporting content; no hidden product lookup |
| `empty-state` | Message/action contract | Meaningful absence state, not route control |

A library needs **negative contracts** too. `price` must not calculate discounts. `product-card` must not add to cart unless its component card explicitly authorises an interaction in a later chapter. `media` must not lazy-load a designated above-fold asset. `icon` must not be the only signal for a destructive action. A generic `button` should preserve its semantic `a` versus `button` distinction: navigation is a link; in-page action is a button. If a caller needs a new behavior, it either composes existing primitives or earns a new documented component.

### Foundation CSS ownership

The foundation’s CSS contract is as important as its Liquid contract. Put reset, token declarations, focus treatment, visually-hidden utility, layout primitives and component-local classes in deliberate ownership layers. A global selector such as `.product-card h2` or `.button svg` feels convenient, but couples unrelated components and makes later Theme Block, app block, or section changes unpredictable. Prefer a component root and a documented modifier: `.product-card`, `.product-card__link`, `.product-card--featured`. Keep the class names in the file that owns their markup or direct render tree so stylesheet subsetting and later audits can reason about them `[VERIFY]`.

Define CSS custom properties as semantic roles rather than implementation measurements: `--color-surface`, `--color-text`, `--space-3`, `--content-width`, `--focus-ring`. Do not let a snippet silently redefine a global token for all later siblings. A section can establish scoped component values if its component card names the consumers and fallback. Every visual default should tolerate the editor’s empty text/image state and a long localized string `[VERIFY]`. This turns a color scheme selection into a consistent consumer contract instead of a collection of ad-hoc declarations.

## 69.3 Base web component class and event bus

JavaScript belongs to progressive enhancement. A no-JavaScript buyer should still navigate, view product content, submit supported forms, and complete basic commerce flows through native/theme platform behavior. A base Web Component class and event bus can coordinate owned enhancements, but they are not a second application framework and do not make the DOM a global data store.

A small base class can establish lifecycle conventions: acquire elements only in the component root, bind listeners idempotently, listen for section-editor events `[VERIFY]`, expose a cleanup method, and guard optional capabilities. It should not query private child internals, hold singleton customer/cart/product truth, write rules into HTML attributes, or require every section to become a custom element.

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
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail
    }));
  }
}
```

The **event bus** is an agreed event vocabulary, not an unrestricted global `window` event soup. Prefer a local owned root event when producer and consumer share a component boundary. If cross-component communication is necessary, use one documented `EventTarget` with namespaced events, minimal serializable detail, producer/consumer list, ordering assumption, error behavior, test, and deprecation rule.

```js
const themeEvents = new EventTarget();

themeEvents.dispatchEvent(new CustomEvent('northstar:cart:changed', {
  detail: { source: 'product-form' }
}));

themeEvents.addEventListener('northstar:cart:changed', (event) => {
  // Enhance an owned cart indicator; fetch/state semantics remain [VERIFY].
});
```

Do not put private customer data, arbitrary HTML, secret values, or business-authoritative cart/price state in event detail. An event says something happened; it is not a guarantee that an operation succeeded. For example, `northstar:cart:changed` may cause an owned indicator to refresh, but the authoritative cart response and error handling remain in the component/API contract `[VERIFY]`.

| Rule | Foundation decision |
| --- | --- |
| Component root | Query inside `this`, not broad document selectors |
| Lifecycle | Connect once, use an abort signal, clean up on disconnect |
| Event names | Namespace by theme/domain; name completed observable change |
| Detail | Minimal, non-sensitive, documented and non-authoritative |
| Consumers | Named owned components; no hidden global listeners |
| Failure | Native markup/form remains usable; enhancement handles absence/error |
| Editor/re-render | Verify actual section lifecycle events and reinitialise safely `[VERIFY]` |

The right foundation is intentionally boring. Its contracts let chapter 70 add commerce interactions without introducing a framework or duplicate authority; chapter 71 can test editor/app/quality boundaries; and chapter 72 can hand over a theme whose global behavior is understandable.

Treat the event vocabulary as versioned public theme behavior. When a producer or payload changes, update its event record, callers, fixtures, fallback and deprecation path rather than making consumers guess. A consumer must tolerate an absent optional enhancement and should not fire a second conflicting operation merely because it observed an event. This is especially important when sections are dynamically rendered or a merchant previews a component in the editor `[VERIFY]`. Small explicit contracts make later feature work safer than a sophisticated but undocumented global bus.

### Foundation contract review

Before the first interactive feature is approved, review the foundation as a dependency graph. Confirm that the layout’s global assets are deliberate, every section group has a bounded purpose, every settings value has a semantic owner, every snippet call supplies required inputs, and each component event has known producer/consumer/fallback behavior. Test an empty editor state, a long localized label, no JavaScript, a keyboard-only route and a component reconnect fixture `[VERIFY]`. Any failure should update the foundation contract before a downstream chapter compensates with a duplicate selector, hidden markup or second source of truth.

## Checklist

| Before chapter 70 | Evidence |
| --- | --- |
| Layout has a bounded document/global responsibility | Layout and section-group contract |
| Global settings are semantic and not dynamic resource data | Settings/color-scheme contract |
| Snippets require explicit inputs and preserve semantics | Snippet inventory and caller fixtures |
| JavaScript is optional and lifecycle-bound | No-JS route fixture and component test |
| Cross-component events are minimal/documented | Event vocabulary, owner, consumer and fallback `[VERIFY]` |

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/limits "Shopify — Theme limits"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"
[3]: ../../docs/DEPRECATIONS.md "Verified platform deprecations ledger"
