<!-- STATUS: final -->
---
id: ch-28
title: "Variants"
part: 4
---

# Chapter 28 — Variants

A product page stops being correct the moment it treats a variant picker as a list of labels rather than a state machine. The customer selects option values, Shopify determines whether that combination maps to a variant, that variant may live on a sibling product in a combined listing, and every purchase surface must then agree on a single result. High-variant products make the old shortcut—serializing every variant and searching it in the browser—both slow and incomplete. Build around the contextual option-value API, server-rendered selection state, and a narrow client data contract.

## What you’ll be able to do

- Read a variant as an accountable purchasable state rather than a collection of option strings.
- Model valid, unavailable, and nonexistent combinations without guessing a fallback.
- Support high-variant and combined-listing choices without relying on a complete `product.variants` array.
- Build a progressive variant experience from Liquid markup and small browser behavior.
- Serialize only the data the client needs, using JSON-safe output and an explicit source of truth.

## 28.1 The `variant` object in full

A `variant` is the purchasable combination of a product’s option values. Its core transaction properties are `id`, `title`, `available`, `price`, `compare_at_price`, `sku`, `barcode`, `requires_selling_plan`, `selling_plan_allocations`, `quantity_rule`, `quantity_price_breaks`, `inventory_management`, `inventory_policy`, `inventory_quantity`, `incoming`, `next_incoming_date`, `requires_shipping`, `taxable`, and `unit_price` with its measurement. It also connects to media through `featured_media`/`featured_image`, to the parent through `product`, and to selection through `selected` and `url`. [1]

Do not read every property into the UI. A product form needs an ID, availability, price, purchase rules, relevant selling-plan allocations, and perhaps a media target. An operational dashboard might need SKU or incoming inventory, but an ordinary storefront should not expose internal identifiers or inventory signals without a merchant-approved reason. The important architectural rule is that a component must name which variant fields it owns and must update all of them from the same selected variant.

`available` is Shopify’s purchasability result. It is more reliable than a quantity comparison because policy may permit sales at zero inventory and inventory tracking may be absent. `inventory_policy` is `continue` or `deny`; `inventory_management` can be `nil`. `inventory_quantity` has a special meaning when inventory is not tracked, so it is not a generic “items remaining” value. [1]

Variants expose `options` as product-option-value objects. Legacy `option1`, `option2`, and `option3` are deprecated; they encode a positional assumption that the current option APIs replace. A variant URL takes the form `/products/[handle]?variant=[id]`, but it should be generated from the variant/object state rather than hand-built whenever a contextual URL is already available. [1]

> [VERIFY] Verify variant property availability and storefront exposure for your exact theme target before showing SKU, incoming stock, pickup, tax, or unit-price information. The Liquid object is broad; an appropriate customer-facing surface is narrower.

## 28.2 Variant matching, combined listings, unavailable combinations

Variant matching is not simply comparing three strings. The current option values form a selection in product order. A valid combination may map to a variant that is purchasable or unavailable. A combination can also have no associated variant. For a product URL with `option_values`, Shopify expects one option-value ID per product option in that exact order. If the combination does not map to a variant, both `product.selected_variant` and `product.selected_or_first_available_variant` return `null`. That null is meaningful: do not replace it with the last valid variant. [2] [3]

High-variant products expose why old picker implementations fail. `product.variants` returns at most 250 variants without pagination, so a hidden select or `product | json` cache that assumes every variant exists can be incomplete. Shopify recommends option-level data: `product.options_with_values`, each `product_option_value`, option-value IDs, and incremental server requests when further state is needed. [2]

`product_option_value.available` offers a top-down availability model: a value is available when some purchasable path exists below it, given earlier choices. `product_option_value.variant` can provide the combination’s variant where one exists, while `variant.available` supports an adjacent model that asks whether a particular node is purchasable. Pick a model deliberately and communicate it with more than color. An unavailable value may stay visible but disabled; a nonexistent combination needs an explicit state and cannot be added to cart. [2]

Combined listings add another axis: an option value can point at a sibling product. `product_option_value.product_url` tells the theme that choosing it should load that product’s information—not merely replace one variant ID. The replacement must update product-owned content such as title, description, media, price, and options, then preserve focus on the selected control. Treat this as navigation between related products, not as a local swatch repaint. [2]

```liquid
{% for option in product.options_with_values %}
  {% for option_value in option.values %}
    <input
      type="radio"
      name="option-{{ option.position }}"
      value="{{ option_value | escape }}"
      data-option-value-id="{{ option_value.id }}"
      data-product-url="{{ option_value.product_url }}"
      {% if option_value.selected %}checked{% endif %}
      {% unless option_value.available %}disabled{% endunless %}
    >
  {% endfor %}
{% endfor %}
```

## 28.3 Variant-aware rendering without a JS framework

A framework is not the source of variant correctness. Start with server-rendered semantics: fieldsets and legends for each option, radio buttons or native selects, labels, a form carrying the selected `id`, and a submit button that reflects the initial variant. JavaScript then enhances selection; it does not replace the basic form contract. Shopify no longer requires themes to support users who have disabled JavaScript for high-variant products, but a clear rendered state and ordinary form semantics still make the component reliable and understandable. [2]

The wrong pattern loads every variant, keeps a mutable lookup table, and treats the first matching title as truth:

```js
// Incorrect: incomplete for high-variant products and ambiguous by title.
const current = variants.find((variant) => variant.title === chosenLabels.join(' / '));
```

The right pattern reads selected option-value IDs, retains the product URL from the chosen value, then requests a fresh section state with `option_values`. The server produces the next availability state in the same context as the product. The client swaps the appropriate picker markup, restores focus, and updates dependent surfaces from the returned section. If `product_url` changed, replace the product section rather than pretending the old product still owns the result. [2]

```js
const ids = [...picker.querySelectorAll('input:checked')]
  .map((input) => input.dataset.optionValueId)
  .filter(Boolean);
const url = new URL(changedInput.dataset.productUrl || window.location.href, window.location.origin);
url.searchParams.set('section_id', picker.dataset.sectionId);
url.searchParams.set('option_values', ids.join(','));
const response = await fetch(url);
```

The response must be scoped. A section request that replaces the picker must also refresh price, availability, media, quantity rules, and plan allocation if they depend on the selected state. Do not update only a label and leave an old hidden variant ID in the form. Use an `AbortController` or request sequence so a slow previous selection cannot overwrite a later choice. Announce the changed state when it affects purchase availability, and restore focus to the control the customer used after replacement.

Progressive enhancement does not mean duplicate business logic. Liquid establishes the initial selected state and client code asks Shopify to calculate subsequent state. The browser orchestrates interaction and DOM replacement; it does not determine purchase eligibility from a stale copied dataset.

> [VERIFY] Confirm Section Rendering API response format, current section IDs, and the exact focus/announcement behavior required by your theme’s picker. The detail belongs to `ch-37-client-side-javascript`; this chapter defines the data boundary.

## 28.4 Serialising variant data to the browser safely

Serialization is appropriate only when the browser genuinely needs a bounded, client-side view of state. A small product with a limited picker might safely expose an explicit projection of selected properties. A high-variant product should not serialize the whole product or every variant: Shopify specifically recommends auditing `product | json` and `product.variants` usages to prevent overfetching and incomplete assumptions. [2]

Project fields, not objects. The client may need `id`, `available`, `price`, `compare_at_price`, `featured_media.id`, `quantity_rule`, or plan allocation IDs depending on the interaction. It does not need descriptions, metafields, admin-identifying information, or every image just because an object serializer makes that easy. Keep the projection versioned by its `data-*` location or script identifier, document the fields, and validate that the consumer cannot mistake formatted strings for money values.

Use a non-executable JSON container or a Liquid JSON filter in a context designed for data. Avoid interpolating raw handles, titles, or tags into JavaScript strings: escaping for HTML is not the same as serializing JavaScript. Keep output adjacent to the component that consumes it so another product form does not accidentally read the first data block on the page.

```liquid
{% assign current_variant = product.selected_or_first_available_variant %}
<script type="application/json" data-product-state>
  {
    "productId": {{ product.id | json }},
    "variant": {
      "id": {{ current_variant.id | json }},
      "available": {{ current_variant.available | json }},
      "price": {{ current_variant.price | json }},
      "mediaId": {{ current_variant.featured_media.id | json }}
    }
  }
</script>
```

This example describes only the current state. It is not a promise that all variants are serialized or that `current_variant` always exists. Guard a null selection before emitting nested properties in a production implementation. When a user chooses an option, prefer a server-rendered update that returns the new state for high-variant and combined-listing paths. If a bounded projection is retained for a fast local interaction, declare it a cache and recover to the server whenever it cannot resolve a selection.

A data script is not trusted input. It is rendered by the server, but client code must still parse defensively, limit selectors to the owning component, handle malformed or missing values, and never turn a browser-side variant result into authority for price or checkout. The cart form and Shopify remain the transaction boundary.

## Gotchas

- You enumerate `product.variants` and assume the array contains every variant on a high-variant product.
- You map a combination by concatenated titles or use deprecated `option1`–`option3` fields.
- You treat an unavailable value as a nonexistent combination, or invent a fallback when no variant exists.
- You update price but leave the selected form ID, media, quantity rule, or plan allocation stale.
- You treat `product_url` from a combined listing as an image URL instead of a sibling-product transition.
- You serialize `product | json` by default and expose an oversized, incomplete client cache.

## Checklist

- [ ] One selected state owns every dependent purchase surface.
- [ ] The picker uses option values and IDs in product order, with an explicit valid/unavailable/nonexistent distinction.
- [ ] High-variant and combined-listing paths avoid complete-variant assumptions and can request fresh server state.
- [ ] Replacement restores focus, communicates material availability changes, and protects against stale responses.
- [ ] Browser data is minimal, JSON-safe, component-scoped, and never treated as transaction authority.

## Related

- `ch-27-products` — product-level versus selected-variant state, pricing, media, and purchase rules.
- `ch-29-collections` — collection context and resource navigation.
- `ch-37-client-side-javascript` — interaction lifecycle, requests, and DOM orchestration.
- `ch-38-ajax-api` — storefront request contracts and cart-side authority.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/variant "Shopify — Liquid object: variant"
[2]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products "Shopify — Support high-variant products"
[3]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants "Shopify — Support product variants"

## State transitions worth testing

A picker has more than a selected label. Test a product with one option, a product with several options, a selection that stays on the same product, a selection that leads to a combined-listing sibling, an available combination, an unavailable combination, and an option-value combination with no corresponding variant. For each transition, inspect the URL, selected controls, hidden form ID, add-to-cart state, price, compare-at price, media target, quantity rule, plan allocation, and live feedback. These surfaces may all be correct on first render and still drift after a client replacement if they are updated from different sources.

Selection ordering matters when building the `option_values` query. The array must reflect the product’s option order, not document order after a responsive redesign, DOM order after a component moves, or alphabetical order of labels. Gather IDs from an explicit picker structure that retains the order, and do not send a partially composed combination as though it were a valid variant request. If a UI permits an incomplete selection, describe it as incomplete and postpone an add-to-cart state until the server resolves it.

A combined-listing transition has an additional content boundary. The component must replace information that belongs to the sibling product—not merely picker markup—while preserving an accessible focus target. Page title, canonical presentation, history behavior, and any product-specific complementary sections deserve an explicit decision. Replacing only a swatch can leave a page showing the title and description of one product with the price and image of another. The feature is therefore a product transition presented through an option control, not a variant lookup optimization.

## A narrow data contract

Before serializing any value, make a table with four columns: consumer, field, update trigger, and recovery strategy. For example, a media controller may need only media ID and type after a local selection; a price display may need raw money plus compare-at value; a cart form needs a real variant ID and plan ID. If a field is not read by a browser behavior, it does not belong in the payload. If the client cannot resolve an updated choice using the bounded payload, its recovery is a server request, not an inferred substitute.

Treat money as raw localized presentment-currency values and let the selected rendering strategy format it consistently. Do not serialize `"$20.00"` and then parse it to decide whether a promotion exists. Do not trust a browser projection as permission to add an unavailable combination; the checkout/cart path validates the transaction independently. JSON is a transport format for display coordination, not a second commerce engine.
