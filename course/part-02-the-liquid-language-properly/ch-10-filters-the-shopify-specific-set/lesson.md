<!-- STATUS: final -->
---
id: ch-10
title: "Filters: The Shopify-Specific Set"
part: 2
words: 2500
---

# Chapter 10 — Filters: The Shopify-Specific Set

The filters in this chapter are not general string utilities. They turn Shopify-owned values—money, media objects, theme assets, metafields, localization data, fonts, payment objects, and hosted files—into output that depends on a current theme runtime. The safe question is never merely “which filter produces the markup I want?” It is “which Shopify object owns this value, which output boundary does the filter establish, and which parts of this representation are safe to customize?”

## What you'll be able to do

- Format Shopify money values without reconstructing currency presentation.
- Choose the current URL and media path for theme assets, files, and media objects.
- Let Shopify-owned filters create complex media, payment, font, metafield, and localization output.
- Treat color, font, cart, customer, and hosted-file helpers as contracts with an owning object.
- Identify legacy filter surfaces that need verification before production use.

## 10.1 Money filters: `money`, `money_with_currency`, `money_without_trailing_zeros`, `money_without_currency`

Money filters format a Shopify money amount using the store’s active formatting configuration. `money` is the normal storefront choice. `money_with_currency` adds an explicit currency designation; `money_without_trailing_zeros` removes display-only zero decimals where the format permits it; `money_without_currency` omits the currency label. They are formatting decisions made **after** a money amount has been established.

```liquid
<p class="product-price">{{ product.price | money }}</p>
```

Do not add a currency symbol with `append`, divide a rendered price string, or assume a decimal separator. Price values are commerce data, and the money filter owns their final customer-facing representation. The correct filter depends on the surrounding UI: a standalone price may need a currency label while a tightly grouped price component may already establish the currency context.

```liquid
<span>{{ product.price | money_with_currency }}</span>
<span class="visually-hidden">{{ product.price | money }}</span>
```

The second example is not a universal accessibility pattern; it shows why a display choice must be deliberate. Use one consistent price contract per component rather than emitting several competing price representations.

A theme should normally receive a price from Shopify, choose a documented display variant, and leave currency conversion, market pricing, rounding policy, compare-at presentation, and discounts to their authoritative data contracts. The theme can decide where a price component sits in the hierarchy; it should not become a second pricing engine. This is the same boundary that protected money math in `ch-09-filters-the-core-set`: formatting is not authority.

> [VERIFY] Verify the active market and money-format contract before choosing a no-currency or no-trailing-zero presentation for production pricing.

## 10.2 URL filters: `asset_url`, `asset_img_url`, `file_url`, `file_img_url`, `shopify_asset_url`, `global_asset_url`, `link_to`, `within`

URL filters resolve a Shopify-managed location; they do not make an arbitrary string safe as a URL component. `asset_url` resolves a file in the theme’s `assets/` directory and is the usual boundary for a theme stylesheet or script.

```liquid
{{ 'component-product-card.css' | asset_url | stylesheet_tag }}
{{ 'product-form.js' | asset_url | script_tag }}
```

`file_url` resolves a file uploaded through Shopify’s Files area. `shopify_asset_url` and `global_asset_url` address Shopify-provided asset locations when the platform documents a specific asset contract. `link_to` creates an anchor around a title/value and URL; `within` produces a resource URL scoped to a collection context.

```liquid
{{ product.title | link_to: product.url }}
<a href="{{ product.url | within: collection }}">{{ product.title | escape }}</a>
```

Older image URL filters such as `asset_img_url`, `file_img_url`, `article_img_url`, and `collection_img_url` appear in legacy theme code. Prefer the current image-object route discussed in 10.3 whenever an image object is available.

Keep resolution separate from output. `asset_url` provides a resource address; `stylesheet_tag` or `script_tag` turns a known address into markup; a hand-written element may be correct when the component requires attributes the helper does not own. In every case, the filter should make the resource home visible. A file uploaded by a merchant is not a theme asset, and a platform-provided asset is not a customer-controlled Files URL.

> [VERIFY] Confirm the current status and replacement path of `asset_img_url`, `file_img_url`, `shopify_asset_url`, and `global_asset_url` in Shopify’s filter reference before introducing them into a new theme.

## 10.3 Media filters: `image_url`, `image_tag`, `external_video_url`, `external_video_tag`, `video_tag`, `model_viewer_tag`, `media_tag`, `article_img_url`, `collection_img_url`

Media filters are strongest when they receive a media object rather than a guessed filename. `image_url` derives a transformed image URL; `image_tag` produces an image element with Shopify-aware image behavior and should receive explicit presentational information appropriate to the component.

```liquid
{% if product.featured_image %}
  {{ product.featured_image | image_url: width: 720 | image_tag: alt: product.title }}
{% endif %}
```

The chain is intentional: the image object becomes a sized URL, then markup. Do not output an image object as if it were already a URL, and do not set an image size solely in CSS when the server can request an appropriate rendition. The complete responsive-image and accessibility policy belongs in the media chapters.

`external_video_url` and `external_video_tag` serve supported external video representations; `video_tag` serves Shopify-hosted video; `model_viewer_tag` renders compatible 3D media; and `media_tag` dispatches based on the media object type. Choose the narrowest filter that matches the known object, or use `media_tag` only when the component deliberately supports heterogeneous media.

Media output has an interaction contract as well as a source contract. A video may need controls, a poster, a caption strategy, and a loading decision; a model viewer has an entirely different interaction surface. The convenience of a tag filter does not remove those design responsibilities. Keep media options close to the component that owns the buyer experience, and verify the supported option names instead of copying an old theme’s filter chain.

> [VERIFY] Confirm the media object type, supported options, and required accessibility controls before shipping `external_video_tag`, `video_tag`, `model_viewer_tag`, or `media_tag` output. Legacy `article_img_url` and `collection_img_url` need a current-reference check before new use.

## 10.4 HTML filters: `stylesheet_tag`, `script_tag`, `preload_tag`, `img_tag`, `highlight`, `time_tag`, `class_list`

HTML-producing filters output markup, so they are not a replacement for an HTML contract. `stylesheet_tag` and `script_tag` turn resolved asset URLs into the corresponding elements. `preload_tag` declares an eligible resource preload; use it only after confirming that the resource is actually critical and that its attributes match the browser request.

`img_tag` is a lower-level image-markup helper; prefer the current object-oriented `image_tag` route when working with an image object. `highlight` marks matching query text for search-result display; its resulting markup belongs in a controlled display context. `time_tag` wraps a formatted time value in semantic `<time>` markup. `class_list` constructs a class attribute from conditional values without hand-concatenating whitespace.

Generated markup still needs a host element and a semantic reason to exist. A `time_tag` should represent an actual date or time relevant to the reader, not decorate arbitrary copy. A `highlight` result should remain inside a search-result context where emphasis is meaningful. `class_list` should describe explicit component states, not become a hidden policy engine full of unrelated business conditions. Let filters solve output mechanics while the template keeps the component’s semantic hierarchy visible.

```liquid
{% assign card_classes = 'card' | class_list: 'card--sold-out', product.available == false %}
<div class="{{ card_classes }}"></div>
```

> [VERIFY] Verify `class_list` argument syntax and current `preload_tag` resource requirements before relying on either in production. Do not feed user-authored HTML into markup-producing filters without an explicit safety policy.

## 10.5 Metafield filters: `metafield_tag`, `metafield_text`

A metafield carries a type contract. `metafield_tag` renders type-aware HTML for a metafield value, while `metafield_text` produces plain-text representation. Choose based on the component’s required output boundary, not based on whichever output happens to look right in a quick preview.

```liquid
{% if product.metafields.custom.material != blank %}
  <div class="product-material">
    {{ product.metafields.custom.material | metafield_tag }}
  </div>
{% endif %}
```

The visible wrapper is your component’s markup; the metafield filter owns the typed representation inside it. Do not assume every namespace/key carries the same value type or safe HTML behavior. Metafield modeling and resource-specific display contracts are covered in `ch-33-metafields` and `ch-34-metaobjects`.

This division matters when a merchant changes the metafield definition. A hard-coded Liquid chain that assumes text may cease to represent a reference, rich text, measurement, or list correctly. Keep the theme’s component contract narrow—“render this typed metafield here”—and make a change to the definition a reason to verify both the resource data and the rendering boundary.

## 10.6 Localization filters: `t`, `currency_selector`, `translate`

`t` resolves a theme-locale translation key and accepts named interpolation arguments. `translate` is its documented alias. Translation keys express UI ownership more clearly than hard-coded customer-facing strings.

```liquid
{{ 'products.product.add_to_cart' | t }}
```

`currency_selector` emits a currency selector for the active localization context. It is an output helper with surrounding form and localization requirements, not a generic select-control generator. Use Shopify’s localization contracts rather than inventing a list of markets or currencies in Liquid.

Translations are data-driven UI copy. Keep the key stable, pass named values rather than building sentences through `append`, and let a locale file own grammar, ordering, and plural-sensitive phrasing. A theme can put a translated string in a semantic element and provide a clear interpolation value; it should not force every locale through an English sentence template.

> [VERIFY] Confirm the active locale schema, available `currency_selector` form context, and translation interpolation contract before production use.

## 10.7 Color filters: `color_to_rgb`, `color_to_hsl`, `color_modify`, `color_mix`, `color_lighten`, `color_darken`, `color_saturate`, `color_contrast`, `color_difference`, `brightness_difference`, `color_extract`

Color filters transform a color setting or color value into another color representation or measurement. `color_to_rgb` and `color_to_hsl` expose CSS-ready forms; `color_modify`, `color_mix`, `color_lighten`, `color_darken`, and `color_saturate` derive a visual variation. `color_contrast`, `color_difference`, and `brightness_difference` help compare colors; `color_extract` selects a channel or component.

```liquid
{% assign button_text = settings.button_background | color_contrast: '#ffffff', '#000000' %}
<style>
  :root { --button-text: {{ button_text }}; }
</style>
```

Derived color is not proof of accessible contrast under every font, size, opacity, image, and state. Treat it as a design-system input and test the rendered component. Do not rebuild an entire color scheme through dense inline pipelines when named settings or CSS custom properties communicate the intent better.

## 10.8 Font filters: `font_face`, `font_modify`, `font_url`

Font filters work with Shopify font settings. `font_face` emits an `@font-face` declaration; `font_modify` derives an available style or weight; `font_url` returns the hosted font resource URL.

```liquid
{% assign heading_font = settings.type_header_font | font_modify: 'weight', '700' %}
<style>
  {{ heading_font | font_face: font_display: 'swap' }}
</style>
```

A requested modification may not exist for the selected font. Confirm the returned result and preserve a CSS fallback stack. Font loading is performance-sensitive, so treat preloading and font-display decisions as a measured delivery concern, not an automatic filter recipe.

The font setting is merchant-configurable data, but it should not force every section to emit its own font declaration. Establish typography in one intentional delivery layer, use component CSS for application, and test the fallback state before the remote resource has loaded. The filter provides a platform-correct font resource representation; it does not decide which components deserve a custom loading strategy.

> [VERIFY] Verify the selected font’s available modifications and the supported `font_face` options before shipping a font-loading strategy.

## 10.9 Cart & customer filters: `item_count_for_variant`, `line_items_for`, `payment_type_svg_tag`, `payment_button`, `customer_login_link`

These filters produce cart, payment, or customer-specific output from the objects and contexts Shopify provides. `item_count_for_variant` answers a cart quantity question for a variant; `line_items_for` selects relevant line items for a resource; `payment_type_svg_tag` outputs a supported payment icon; `payment_button` produces Shopify’s dynamic checkout button; and `customer_login_link` provides the platform-owned account-login link.

```liquid
{{ 'visa' | payment_type_svg_tag }}
{{ form | payment_button }}
```

The second line only belongs in an appropriate product-form context. Do not construct checkout behavior, payment marks, or customer account routes manually when Shopify offers an owning helper. Cart and customer workflow details belong in `ch-30-cart` and `ch-31-customers`.

> [VERIFY] Confirm the required object/form context and current behavior of `line_items_for`, `payment_button`, and `customer_login_link` before implementation.

## 10.10 Hosted-file and structured-data helpers

Hosted-file helpers resolve Shopify-hosted resources rather than guessing CDN paths. Use the documented file object or filter, then let the consumer determine whether it needs an HTML, URL, preload, or JSON boundary. Structured-data helpers should serialize declared values with `json` instead of using string assembly; do not dump an entire resource merely because a browser feature needs two fields.

The same restraint applies to generated structured data. A product page can use a documented product-specific helper when Shopify provides one, but a generic script tag is not a license to emit unrelated fields, duplicate page entities, or invent commerce claims. Treat generated JSON as a public integration surface: validate its syntax, confirm its page relevance, and avoid mixing it with executable JavaScript.

```liquid
<script type="application/ld+json">
  {{ product | structured_data }}
</script>
```

> [VERIFY] Confirm the current structured-data helper name, input contract, and whether its output is already JSON before adding it to a production page. Structured data must be valid for the resource and page, not merely syntactically present.

## Gotchas

- **Formatting money with strings.** Use Shopify’s money filters after the amount is established.
- **Using an old image URL filter in new code.** Prefer current image-object filters and verify legacy paths.
- **Treating markup-producing filters as safety filters.** They solve an output contract, not arbitrary trust.
- **Assuming a metafield’s type from its key.** Render through its type-aware contract or verify its value shape.
- **Using a derived color as an accessibility guarantee.** Test real component states and contrast.
- **Hand-building payment, customer, or localization controls.** Use the owning Shopify context and helper.
- **Putting unverified structured data into a script tag.** Validate the helper output and page-level semantic contract.

## Checklist

- [ ] I know which Shopify object owns each value before selecting a Shopify-specific filter.
- [ ] I format money and media through their current object-aware helpers.
- [ ] I separate URL resolution, markup creation, and escaping responsibilities.
- [ ] I treat metafield, localization, font, cart, and payment filters as context-bound contracts.
- [ ] I use `[VERIFY]` for legacy or context-specific filters before production adoption.

## Related

- `ch-09-filters-the-core-set` — generic transformations and safety boundaries.
- `ch-27-products-and-variants` — product prices, media, and variant contracts.
- `ch-30-cart` — cart line items and dynamic checkout contexts.
- `ch-33-metafields` — metafield types and rendering decisions.
- `ch-37-javascript-in-themes` — JSON handoff to browser code.

[1]: https://shopify.dev/docs/api/liquid/filters "Shopify Liquid filters"
