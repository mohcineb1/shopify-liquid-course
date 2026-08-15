<!-- STATUS: final -->
---
id: ch-70
kind: solution
title: "Repair the commerce-surface boundary — worked answer"
words: 1350
---

# Chapter 70 — Solution: Repair the commerce-surface boundary

This solution repairs the starter by reducing each surface to the authority it can honestly own. It is a candidate theme implementation, not a store configuration or a cart/account/map integration. The files never create a collection filter, recommendation, metaobject definition, customer session, location record, consent decision, provider request or checkout behavior. Those remain implementation decisions with explicit `> [VERIFY]` records.

The important change is architectural: Liquid remains the server-rendered page truth, URLs represent collection state, the product section owns the only form, structured snippets receive named inputs, the cart page remains durable, and enhancement replaces only a fragment it owns. A browser cache, a product card, `window.cart`, an external map script, or a generic rich-text field is not allowed to become hidden business authority.

## 70.1 Home page from composable theme blocks

`solution/sections/home-commerce-rail.liquid` is a bounded home section rather than a catalog query. Its `collection` setting explicitly selects the source; it renders nothing promotional when the source is blank; it passes `product` and image behavior as named inputs to `product-card`; and its heading is section-local. The block is not used as a substitute for a page template or an unbounded merchandising system.

```liquid
{% assign source_collection = section.settings.collection %}
<section class="home-commerce-rail" aria-labelledby="HomeRail-{{ section.id }}">
  {% if section.settings.heading != blank %}
    <h2 id="HomeRail-{{ section.id }}">{{ section.settings.heading }}</h2>
  {% endif %}
  {% if source_collection != blank and source_collection.products_count > 0 %}
    <ul class="product-grid" role="list">
      {% for product in source_collection.products limit: section.settings.products_to_show %}
        <li>{% render 'product-card', product: product, image_loading: 'lazy' %}</li>
      {% endfor %}
    </ul>
  {% elsif request.design_mode %}
    <p class="home-commerce-rail__empty">Choose a collection with products to populate this rail.</p>
  {% endif %}
</section>
```

A production editor/design-mode policy is `[VERIFY]`; the candidate empty message merely makes the blank selection observable. The schema uses a collection picker and narrow numeric range rather than a generic rich-text payload. The chapter-69 section/block limits still apply, but a capstone should use an editorially justified local maximum rather than design at the platform maximum.

## 70.2 Collection page with filtering, sorting, pagination

The collection source corrects the starter’s browser-only reorder. A collection has a real URL state, and Shopify’s collection guidance exposes `collection.sort_options`, `collection.sort_by` and `collection.default_sort_by`; its products need pagination because only 50 are available per page.[1] The `<form method="get">` sends `sort_by` through a complete request; changing the select with JavaScript remains optional because submission works without it.

```liquid
{% paginate collection.products by 24 %}
  {% assign selected_sort = collection.sort_by | default: collection.default_sort_by %}
  <section class="collection-grid" data-section-id="{{ section.id }}" data-owned-fragment="collection-results">
    <h1>{{ collection.title }}</h1>
    <form method="get" class="collection-grid__controls">
      <label for="SortBy-{{ section.id }}">Sort products</label>
      <select id="SortBy-{{ section.id }}" name="sort_by" onchange="this.form.submit()">
        {% for option in collection.sort_options %}
          <option value="{{ option.value }}" {% if option.value == selected_sort %}selected{% endif %}>{{ option.name }}</option>
        {% endfor %}
      </select>
      <noscript><button type="submit">Apply</button></noscript>
    </form>
    <div data-owned-replacement="collection-results">
      <ul class="product-grid" role="list">
        {% for product in collection.products %}
          <li>{% render 'product-card', product: product, image_loading: 'lazy' %}</li>
        {% else %}
          <li>No products match this collection state.</li>
        {% endfor %}
      </ul>
      {{ paginate | default_pagination }}
    </div>
  </section>
{% endpaginate %}
```

It intentionally does not output a filter object. Supported filters, configuration, query shape, accessibility language and availability are store facts that must be verified. Any later enhancement must preserve all query parameters, request the actual resource URL, retain full-page navigation and provide active-filter, zero-result, focus and failure behavior.

## 70.3 Product page: gallery, variant picker, metafield spec tables, related products

The product section is now the sole form owner. `product-card` is display-only, preventing duplicate form semantics and conflicting purchase state. The solution builds option controls from `product.options_with_values`; it neither serializes `product | json` nor assumes `product.variants` contains every variant. Shopify documents a maximum of 250 returned variants and recommends contextual option-value patterns for high-variant products.[2]

```liquid
{% form 'product', product, id: product_form_id %}
  {% for option in product.options_with_values %}
    <fieldset class="product-options__group">
      <legend>{{ option.name }}</legend>
      {% for option_value in option.values %}
        {% capture input_id %}Option-{{ section.id }}-{{ option.position }}-{{ forloop.index0 }}{% endcapture %}
        <input id="{{ input_id }}" type="radio" name="{{ option.name | escape }}"
          value="{{ option_value | escape }}" {% if option_value.selected %}checked{% endif %}
          {% unless option_value.available %}disabled{% endunless %}>
        <label for="{{ input_id }}">{{ option_value }}</label>
      {% endfor %}
    </fieldset>
  {% endfor %}
  <button type="submit">Add to cart</button>
{% endform %}
```

Exact form field and selection behavior is `[VERIFY]`, particularly when a combination has no selected variant: Shopify notes that selected-variant values can be `null` in that situation.[2] A real high-variant enhancement should use contextual option-value IDs and an owned Section Rendering request; it must not rebuild an availability matrix from a truncated array.

`product-specs` accepts `specifications:` by name and exits if it is blank. It uses `table`, `caption`, headers and values only for genuinely tabular candidate records. `guide-callout` accepts `guide:` by name, renders nothing if blank, and never interprets the product description as a size guide. The related-products placeholder is conditional and calls out the source/intent configuration as `[VERIFY]`; Shopify distinguishes related (auto-generated) from complementary (manually configured) recommendations.[3]

## 70.4 Cart drawer and cart page with Section Rendering API

The exercise does not mutate cart data. `refreshOwnedSections` only demonstrates safe, locale-aware fragment replacement after an already-authorised interaction. It starts from `window.Shopify.routes.root`, asks for no more than the supplied IDs, rejects non-OK responses, accepts that an individual rendered section can be `null`, and replaces content only inside a matching owned wrapper. Shopify supports up to five IDs in a `sections` request and warns that a failed section can be null even where the HTTP response is 200.[4]

```js
export async function refreshOwnedSections(sectionIds, statusElement) {
  const ids = sectionIds.slice(0, 5);
  const query = new URLSearchParams({ sections: ids.join(',') });
  try {
    const response = await fetch(`${window.Shopify.routes.root}?${query}`);
    if (!response.ok) throw new Error('Section refresh failed');
    const rendered = await response.json();
    let updated = 0;
    for (const id of ids) {
      if (typeof rendered[id] !== 'string') continue;
      const target = document.querySelector(`[data-section-id="${CSS.escape(id)}"] [data-owned-replacement]`);
      if (!target) continue;
      const parsed = new DOMParser().parseFromString(rendered[id], 'text/html');
      const replacement = parsed.querySelector('[data-owned-replacement]');
      if (!replacement) continue;
      target.replaceWith(replacement);
      updated += 1;
    }
    if (statusElement) statusElement.textContent = updated ? 'Cart display updated.' : 'Cart display could not be refreshed.';
    return updated;
  } catch (error) {
    if (statusElement) statusElement.textContent = 'Cart display could not be refreshed. Use the cart page to review your order.';
    return 0;
  }
}
```

No global event leaks cart/customer/checkout state. The cart page link is the recovery path. Bundled rendering, mutation response shape, request ordering, focus management, drawer dialog behavior, analytics, consent and cart error content all remain `[VERIFY]` before any production implementation.

## 70.5 Search, account, blog, and content templates

The route record explicitly says search has a submitted full-page query/result/pagination/empty baseline; account templates present only the store-supported account surface; and blog/content render structured reading order. There is no theme client code that retrieves a customer, impersonates authentication or assumes a predictive-search/account mode. Search endpoint/schema, account setup, content model, privacy and localization behavior are `[VERIFY]`. That is a correction: absence of a data contract must make a feature smaller, not make its assumed data global.

## 70.6 Metaobject-driven size guides and store locator

The store locator becomes an accessible static list of candidate locations and explicit links. It loads no third-party script and contains no provider key. The record requires published fields, source ownership, staleness/archival handling, consent, localization/market behavior and fallback decisions before a map/geolocation enhancement exists.

The same discipline applies to a size guide. The reference is explicit; fields are not implied by product prose; absent content omits the callout; table semantics are reserved for measurements. Actual metaobject definition, storefront visibility, reference type, fields, permissions and market rules remain `[VERIFY]`.

## What people get wrong here

**Treating a partial response as a transaction receipt.** Replacing a counter after a successful HTTP status is not cart truth. A null section, missing target, parse error, out-of-order response or mutation failure needs a local recovery path.

**Making a universal component by removing its inputs.** A card, guide or locator that reaches into globals is fragile. Named inputs and absent-data behavior make reuse testable.

**Confusing editor flexibility with data authority.** An editor can choose approved content. That does not permit the theme to create product data, filter capabilities, recommendations, customer state or provider access.

## Verification record

The mirrored `records/commerce-surface-contract.md` identifies each owner, full-page/static fallback, error behavior, fixture, release gate and outstanding verification. Do not turn its `[VERIFY]` items into comments that a future builder overlooks; make them acceptance gates.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/templates/collection "Shopify — Collection template"
[2]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products "Shopify — Support high-variant products"
[3]: https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations "Shopify — Product recommendations"
[4]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
