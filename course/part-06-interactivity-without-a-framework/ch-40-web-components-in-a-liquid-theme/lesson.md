<!-- STATUS: draft -->
---
id: ch-40
title: "Web Components in a Liquid Theme"
part: 6
words: 2180
---

# Chapter 40 — Web Components in a Liquid Theme

Liquid produces server-owned, section-sized markup, while a buyer encounters controls that need local state, cleanup, and keyboard behavior. A native custom element is a useful boundary between those jobs: Liquid owns the initial document, translations, URLs, and merchant settings; the element owns only interaction after that document exists. This is not component architecture for fashion. It is how interaction survives section replacement and merchant editing without a framework runtime competing with Liquid.

## What you'll be able to do

- Place a custom element at a section-sized interaction boundary.
- Separate browser connection lifecycle from theme-editor intent.
- Make a deliberate, integration-aware Shadow DOM decision.
- Pass escaped Liquid settings through small typed HTML attributes.
- Share lifecycle discipline through a small theme base class.
- Build islands that complete the buyer task with JavaScript unavailable.

## 40.1 Why custom elements are the native fit for section-based markup

A section is a server-owned island. Shopify can add, remove, or re-render it in the theme editor without reloading the page. A page-global initializer such as `document.querySelectorAll(...).forEach(init)` assumes page load is the only time nodes arrive. That is where people get burned: an editor replacement leaves new markup without behavior and can leave old listeners pointed at discarded nodes.

A custom element lets the browser bind behavior to the DOM boundary that owns it. `connectedCallback()` runs when that particular element enters the document, and `disconnectedCallback()` runs when it leaves. Liquid still renders the useful baseline; the browser upgrades the element after its definition loads. That makes a custom element a fit for a cart drawer, quick add, facet panel, or media gallery—interactions that have a local lifecycle—not for a decorative wrapper.

```liquid
<!-- sections/quick-add.liquid -->
<quick-add-card data-section-id="{{ section.id }}">
  <form method="post" action="{{ routes.cart_add_url }}">
    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
    <button type="submit" {% unless product.available %}disabled{% endunless %}>
      {{ 'products.product.add_to_cart' | t }}
    </button>
  </form>
</quick-add-card>

{% schema %}
{ "name": "Quick add", "settings": [] }
{% endschema %}
```

An unknown `quick-add-card` still contains a working form. After registration the browser upgrades existing instances and calls the lifecycle callback. The enhancement never becomes the sole route to cart creation.

```js
// assets/quick-add-card.js
class QuickAddCard extends HTMLElement {
  connectedCallback() {
    this.addEventListener('submit', this.handleSubmit);
  }

  disconnectedCallback() {
    this.removeEventListener('submit', this.handleSubmit);
  }

  handleSubmit(event) {
    // Enhance only after the baseline form exists.
  }
}

if (!customElements.get('quick-add-card')) {
  customElements.define('quick-add-card', QuickAddCard);
}
```

The registry guard prevents an exception if a theme asset is evaluated twice. It does not make setup idempotent: one element can connect again, so per-instance listeners and state still require cleanup.

> [VERIFY] Confirm the storefront browser support policy before requiring custom-element enhancement. Its children render before upgrade, which is the useful baseline, but audience policy is theme-specific.

## 40.2 Component lifecycle vs theme editor events

`connectedCallback()` answers a DOM question: “this element joined the document.” It does not mean a merchant selected a section. Editor events answer editor questions. Shopify’s theme-editor guidance says sections and blocks can be dynamically added, removed, or re-rendered without a full page reload; page-load JavaScript does not run again. Its editor events bubble and cannot be cancelled.[1]

In particular, `shopify:section:load` targets a section added or re-rendered and should re-execute behavior required by that section. `shopify:section:unload` is the cleanup point. `shopify:section:select` and `shopify:block:select` should keep selected content visible. The section ID is available as `event.detail.sectionId`; block selection also identifies its block.[1]

A properly scoped component already receives connection and disconnection callbacks during DOM replacement. Listen for an editor event only when a merchant action has additional meaning, such as revealing a selected media block or resetting preview state. Keep the document-level adapter small and translate it into a public component method.

```js
// assets/theme-editor-components.js
function galleryIn(section) {
  return section.querySelector('product-media-gallery');
}

document.addEventListener('shopify:section:load', (event) => {
  galleryIn(event.target)?.refreshFromMarkup();
});

document.addEventListener('shopify:block:select', (event) => {
  event.target.closest('product-media-gallery')?.revealBlock(event.detail.blockId);
});
```

**Wrong: reinitialize the entire document whenever one section changes.**

```js
// assets/theme-editor-components.js
// Wrong: surviving nodes may receive duplicate listeners.
document.addEventListener('shopify:section:load', () => {
  document.querySelectorAll('facet-panel').forEach((panel) => panel.initialize());
});
```

**Right: scope work to the replaced subtree and rely on reversible component setup.**

```js
// assets/theme-editor-components.js
document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelector('facet-panel')?.refreshFromMarkup();
});
```

Use `request.design_mode` when Liquid needs editor-only markup and `Shopify.designMode` when runtime code needs an editor branch.[1] Do not put editor checks throughout buyer behavior. The component should work normally; the editor adapter is an exception with a clear purpose.

## 40.3 Shadow DOM: what it breaks (apps, global CSS, third-party scripts) and when to avoid it

Shadow DOM provides selector and style encapsulation, not free component architecture. In an application you control end to end, that can be worthwhile. A theme has additional participants: global stylesheet rules, merchant custom CSS, app blocks, accessibility tests, analytics integration, and third-party scripts. A selector that formerly found a descendant cannot cross a shadow boundary. An app expecting to decorate a product-form button may no longer find it. A closed root makes deliberate inspection and extension harder still.

```js
// assets/product-media-gallery.js
class ProductMediaGallery extends HTMLElement {
  connectedCallback() {
    // Avoid this as the default for theme UI.
    // this.attachShadow({ mode: 'closed' });
  }
}
```

Prefer light DOM for theme components. Keep semantic descendants rendered by Liquid, document stable classes and data attributes, and scope CSS from the custom tag.

```css
/* assets/component.css */
product-media-gallery [data-media-panel][hidden] { display: none; }
product-media-gallery [data-media-thumbnail][aria-current="true"] {
  outline: 0.15rem solid currentColor;
  outline-offset: 0.2rem;
}
```

This limits local styling while keeping extensions possible. Consider a shadow root only for a genuinely self-contained interaction with a designed styling API, proven accessible focus behavior, and representative app testing. It is usually a poor default for product forms, cart controls, merchant content, or app-block-adjacent markup.

> [VERIFY] Validate each third-party integration’s selector and event expectations before moving its target beneath a shadow boundary; an app contract cannot be inferred from the theme alone.

## 40.4 Attribute-driven configuration from Liquid settings

Liquid should serialize settings into HTML, not executable JavaScript strings. Attributes are visible in developer tools, travel with replacement markup, and remain local to the component that consumes them. Keep each value small, semantic, escaped, and intentionally parsed.

```liquid
<!-- sections/media-gallery.liquid -->
<product-media-gallery
  data-section-id="{{ section.id }}"
  data-autoplay="{{ section.settings.autoplay }}"
  data-announce-label="{{ 'products.product.media_changed' | t | escape }}"
>
  <p data-media-status class="visually-hidden" aria-live="polite"></p>
  {{ product.featured_media | image_url: width: 1200 | image_tag: loading: 'eager' }}
</product-media-gallery>

{% schema %}
{
  "name": "Media gallery",
  "settings": [
    { "type": "checkbox", "id": "autoplay", "label": "Autoplay video", "default": false }
  ]
}
{% endschema %}
```

```js
// assets/product-media-gallery.js
class ProductMediaGallery extends HTMLElement {
  get autoplay() { return this.dataset.autoplay === 'true'; }
  get announceLabel() { return this.dataset.announceLabel || 'Media changed'; }
}
```

Do not embed an object as an unescaped JavaScript literal. It makes translation, quotes, and re-rendering failures opaque. A `script[type="application/json"]` child can be suitable for real structured data; scalar settings are clearer as attributes. Absence and malformed values are normal states: choose a default, disable optional enhancement, or retain the baseline.

## 40.5 A component base class for a whole theme

The useful base class is boring. It standardizes abortable listeners, reconnection safety, host-scoped queries, and an explicit refresh boundary. It must not conceal theme rendering or invent a global state store.

```js
// assets/theme-component.js
export class ThemeComponent extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.onConnect();
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.onDisconnect?.();
  }

  listen(target, type, listener, options = {}) {
    target.addEventListener(type, listener, { ...options, signal: this.controller.signal });
  }

  refreshFromMarkup() { this.onRefresh?.(); }
}
```

```js
// assets/facet-panel.js
import { ThemeComponent } from './theme-component.js';

class FacetPanel extends ThemeComponent {
  onConnect() {
    this.listen(this, 'click', (event) => {
      const trigger = event.target.closest('[data-facet-trigger]');
      if (!trigger) return;
      this.toggleAttribute('data-open');
      trigger.setAttribute('aria-expanded', String(this.hasAttribute('data-open')));
    });
  }

  onRefresh() { this.removeAttribute('data-open'); }
}

if (!customElements.get('facet-panel')) customElements.define('facet-panel', FacetPanel);
```

The abort signal makes listener ownership visible and prevents memory leaks through repeated replacement. Do not put cart truth, request routing, selectors shared only by accident, or a rendering engine in this base class. A base that dictates markup has become a framework in disguise.

## 40.6 Islands, progressive enhancement, and no-JS fallbacks

An island attaches interaction only where it pays for its bytes and complexity. Liquid renders useful initial content; the component enhances it after its asset loads. The no-JavaScript experience is not an inert snapshot of the enhanced UI. It is an operational buyer path using forms, links, controls, and readable content.

A facet panel starts as a labeled form and submit button. JavaScript may add in-place behavior but cannot remove submission as the only route. A media gallery starts with a featured image and meaningful media links. Quick add starts with a cart form. A cart drawer starts with a cart link.

```liquid
<!-- sections/facet-panel.liquid -->
<facet-panel>
  <form action="{{ routes.search_url }}" method="get">
    <label for="FacetQuery-{{ section.id }}">{{ 'general.search.search' | t }}</label>
    <input id="FacetQuery-{{ section.id }}" name="q" value="{{ search.terms | escape }}">
    <button type="submit">{{ 'general.search.search' | t }}</button>
  </form>
</facet-panel>
```

Disable JavaScript before writing the controller, then test slow loading, section replacement, repeated add/remove cycles, keyboard flow, and a representative app block beside the island. A component succeeds when failing to load cannot take the buyer task with it.

## Gotchas

- Register a name once, but expect each instance to connect and disconnect repeatedly.
- Scope editor work to `event.target`; `shopify:section:load` is not page load.[1]
- Abort timers, document listeners, observers, and requests at disconnect.
- Do not use Shadow DOM to hide unexamined extension contracts.
- Parse `dataset` values as strings deliberately; HTML attributes are not booleans.
- Do not make enhancement the only control path.

## Checklist

- [ ] Each element owns one section-local interaction boundary.
- [ ] Setup is idempotent and cleanup aborts owned work.
- [ ] Editor events express editor intent rather than replace lifecycle.
- [ ] Liquid settings are escaped and intentionally typed at the boundary.
- [ ] Light DOM is the explicit default for extensible theme UI.
- [ ] Every island completes its buyer task with JavaScript disabled.

## Related

- [Chapter 39 — Search & Suggest APIs](../ch-39-search-suggest-apis/) for a server-rendered search interaction.
- [Chapter 41 — Product & Media Interactions](../ch-41-product-and-media-interactions/) for media UI built on these boundaries.
- [Chapter 42 — Cart Interactions](../ch-42-cart-interactions/) for cart-specific behavior and recovery.
- [Chapter 17 — Section Schema](../../part-03-theme-architecture/ch-17-section-schema/) for settings rendered as configuration.

## References

[1]: https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks "Shopify — Integrate sections and blocks with the theme editor"


## Boundary review: state, events, and replacement

A component boundary also gives you a review question: **which state is still meaningful after Liquid replaces this node?** Local presentation state—whether a facet disclosure is open, which thumbnail is visually current, whether a dialog has focus—belongs to the component and can be reconstructed from replacement markup. Durable commerce state does not. The cart, selected variant represented by a submitted form, and search URL remain server or request concerns. Do not make a component an alternate source of truth merely because it has fields.

The distinction changes event design. Dispatch a custom event only when another independently owned region needs to react, and document its name, detail shape, and bubbling behavior. For example, a product component might announce that its visible media changed; it should not dispatch an opaque catch-all event that forces headers, drawers, and apps to inspect its private DOM. Prefer semantic native controls and native events inside the island. A custom element is a lifecycle boundary, not permission to replace platform behavior.

Observe attribute changes only when the browser can change a declared public attribute after connection. Do not add `observedAttributes` pre-emptively to turn every `data-*` value into reactive state. In a Liquid theme, section replacement normally supplies a new element with fresh attributes. A small `refreshFromMarkup()` hook is clearer for editor-specific reconciliation because it states why the update occurs.

When testing, use the editor to add a section, change a setting, reorder it, select a block, and remove it; then perform the same buyer action before and after each operation. Watch the Event Listener pane or add temporary counters to prove a click produces one response, not one response per edit. Test a component that has an outstanding request or an animation while it is disconnected. Cleanup is correct only if the stale completion cannot mutate either the detached element or a newly connected successor.

Keep asset loading equally local in intention. An asset can be loaded globally once, but its initialization must occur per element. Do not use section IDs as JavaScript object keys without considering replacement: an ID can identify the server region, while the actual element instance is the lifecycle owner. If a module must coordinate two islands, make that coordination explicit and narrowly scoped rather than quietly restoring a page-wide singleton.

Finally, inspect the un-upgraded DOM in a browser with a slow script. Labels must still name controls, headings must retain document structure, and `hidden` content must not conceal the only route to product information. The strongest proof of progressive enhancement is mundane: links work, forms submit, and readable content remains when the enhancement is absent.
