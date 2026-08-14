<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-10-solution
title: "Solution — Build a Shopify-aware product signal card"
chapter: ch-10
---

# Solution — Build a Shopify-aware product signal card

The completed card is intentionally a product-context component, not a product-data engine. It uses the current `product` value already supplied to the template and lets Shopify-specific filters establish each representation: `t` supplies locale-owned UI copy, `money` formats the price, `image_url` plus `image_tag` renders the featured image, `metafield_tag` renders the typed material value, and `json` serializes only the two browser-data fields the card declares. The section owns semantic structure and conditional wrappers; the filters own platform-specific output boundaries.

## Final file map

```text
solutions/part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/
├── solution.md
└── solution/
    ├── assets/section-product-signal-card.css
    ├── sections/product-signal-card.liquid
    └── snippets/product-signal-data.liquid
```

## 1. Keep the customer-facing heading locale-owned

The heading has no hard-coded shopper text. It resolves one locale key using `t` inside the already semantic `<h2>`. This makes the locale file responsible for language, grammar, and future translation work, while the section remains responsible for the heading’s placement and identity.

```liquid
<h2 id="ProductSignalHeading-{{ section.id }}" class="product-signal-card__heading">
  {{ 'products.product.product_information' | t }}
</h2>
```

A translation key is not an excuse to omit the locale entry. If the key is missing, fix the locale contract; do not recover by building an English sentence with `append`. Interpolated translation values should likewise be named inputs to `t`, rather than a concatenated copy fragment. The exercise needs no interpolation, which keeps the card’s language boundary deliberately narrow.

## 2. Let Shopify format the price

The price begins as `product.price`, a Shopify money amount, and ends at a single money filter. The section never parses it, divides it, adds a symbol, or tries to hide an assumed decimal representation.

```liquid
<p class="product-signal-card__price">{{ product.price | money }}</p>
```

`money` is correct because the component promises one normal storefront price representation. A product card elsewhere might choose `money_with_currency` if its visual context needs an explicit currency label, but adding both representations here would make the component’s price contract ambiguous. Compare-at logic, selling plans, market price behavior, and discount authority are intentionally absent; they belong to the specific commerce component that owns those requirements.

> [VERIFY] Confirm the active market and theme money-format policy before replacing `money` with any alternate money filter in a production component.

## 3. Render the image from its object contract

The featured image is optional. The `if` protects the markup boundary: when no image exists, no empty image element is created. When it does exist, `image_url` asks Shopify for a bounded rendition and `image_tag` produces image markup. The product title is passed as alternate text because the card uses the image as a representation of that product.

```liquid
{% if product.featured_image %}
  {{ product.featured_image | image_url: width: 480 | image_tag: alt: product.title }}
{% else %}
  <p class="product-signal-card__fallback">{{ 'products.product.image_unavailable' | t }}</p>
{% endif %}
```

The chain has a clear type transition: image object → sized image URL → image element. CSS can size the resulting element in layout, but it does not replace the server-side request choice. Do not use a legacy image URL filter or invent a CDN path from product data. More complete responsive image decisions, media types, and accessibility policies belong in the product-media chapters.

> [VERIFY] Confirm the image filter’s supported width and `image_tag` option contract for the active theme before expanding this component with loading, focal-point, or responsive-source behavior.

## 4. Preserve the typed metafield boundary

The material fact is optional and is rendered only when `product.metafields.custom.material` is present. The wrapper is component markup; `metafield_tag` is the typed representation of the value inside it.

```liquid
{% if product.metafields.custom.material != blank %}
  <div class="product-signal-card__fact">
    {{ product.metafields.custom.material | metafield_tag }}
  </div>
{% endif %}
```

Using `metafield_tag` is safer than assuming the material field will always remain a plain string. A future definition change could make direct text output misleading or invalid. The section should not supply a guessed material label when the value is absent: absence is an allowed state and the correct card output contains no empty fact wrapper. Metafield definition, validation, and content modeling are deferred to `ch-33-metafields`.

## 5. Serialize declared browser data only

The snippet’s output is inside `type="application/json"`, so it is a data boundary, not executable JavaScript. It emits exactly a title and URL. Each dynamic string passes through `json`; the JSON punctuation is static structure, not manually quoted dynamic data.

```liquid
{
  "title": {{ signal_product.title | json }},
  "url": {{ signal_product.url | json }}
}
```

This remains valid when a product title contains quotation marks, an ampersand, or a line break. By contrast, the following looks compact but breaks the JSON contract as soon as a dynamic title includes a quote:

```liquid
{"title": "{{ signal_product.title }}"}
```

Do not fix the wrong version with `raw`, `escape`, or a string replacement chain. `json` is the serialization boundary. Do not dump the complete product object either: a browser feature should receive the smallest declared payload it needs. Consumption of this data belongs in `ch-37-javascript-in-themes`.

## 6. Validate the rendered states

Test the card against object states rather than relying on the ordinary product preview. A product with a featured image should have exactly one image element whose request derives from the image object and whose alt text reflects the product title. A product without a featured image should render only the translated fallback paragraph. A product with a material metafield should have the typed representation inside the fact wrapper; a product without it should not have the wrapper at all.

Inspect source for the remaining boundaries. The price should be filter output, not a manually constructed string. The heading and fallback should resolve translation keys. The data script should parse as JSON and contain exactly the declared title and URL, including for punctuation-heavy test titles. Those checks are valuable because a component can look correct while still relying on a brittle image path, price string, or serialization method.

## 7. Read ownership from the final source

The rendered source should make the ownership chain visible. The stylesheet comes from the theme’s `assets/` home through `asset_url`. The displayed price comes from Shopify money formatting. The image request comes from `product.featured_image`, not a guessed file name. The material representation comes from its typed metafield contract. The heading and fallback are locale keys, while the JSON payload contains only fields the future browser feature is allowed to consume.

This makes later change safer. If a merchant replaces the image, changes the material definition, chooses a different market, or adds a locale, the component uses the corresponding Shopify-owned boundary rather than preserving a stale theme-side approximation. If a requirement later asks for payments, inventory, variant selection, schema-controlled media options, or browser behavior, add that work in the chapter that owns those contracts instead of growing this small card into an unreviewable integration surface.

## Validation matrix

| Scenario | Expected result |
| --- | --- |
| Featured image exists | A 480-wide derived image rendition is rendered with title-derived alt text. |
| Featured image absent | The translated fallback paragraph appears; no image element appears. |
| Normal price | One platform-formatted `money` representation appears. |
| Material metafield present | A typed metafield representation appears in the fact wrapper. |
| Material metafield absent | No fact wrapper appears. |
| Title with quotation marks | The data script remains valid JSON with only title and URL keys. |

## Checklist

- [x] The locale key owns shopper-facing UI copy.
- [x] Shopify formats the final price representation.
- [x] Image output begins with the current image object and has a missing-image branch.
- [x] The metafield wrapper is conditional and the value uses `metafield_tag`.
- [x] JSON uses field-level serialization rather than manual dynamic quoting.
- [x] The solution mirror includes runnable section, CSS, and snippet files.
