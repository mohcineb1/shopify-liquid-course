<!-- STATUS: final -->
---
id: app-b
title: "Complete Filter Reference"
part: 15
words: 2899
---

# Appendix B — Complete Filter Reference

A filter is the small transformation between Shopify data and the string, URL, HTML fragment, or structured value your theme must output. The hard part is not remembering that `upcase` exists; it is knowing whether a filter accepts an array, a drop, a string, or a number, which filters are context-bound, and which familiar-looking legacy image helpers should not enter new code. This appendix is the compact reference for the Shopify theme variation of Liquid. Filters chain **left to right**, so the output type of one stage must be a valid input for the next.[1]

## What you’ll be able to do

- Select a current Shopify filter by input type and required output.
- Recognise context-bound filters for carts, customers, resources, localization, and payments.
- Replace deprecated image URL helpers with the current `image_url` API.
- Read a filter chain as a typed pipeline instead of trial-and-error markup.

---

## B.1 All filters by category

The notation `string → string` means the filter receives a rendered Liquid string and returns a string. `array<T> → array<T>` means the collection survives with elements added, removed, ordered, or selected. `object → HTML` means Shopify emits safe, ready-to-place markup; do not escape that output a second time. The signatures and categories below follow Shopify’s current Liquid filter reference.[1]

### String, format, and default filters

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `append`, `prepend` | string → string | `{{ handle \| append: '-sale' }}` | Coerces the argument to text. |
| `camelize`, `capitalize`, `downcase`, `upcase` | string → string | `{{ label \| camelize }}` | Transform text only; they do not translate or sanitize it. |
| `handleize` | string → string | `{{ product.title \| handleize }}` | Produces a handle-shaped string; do not assume the result is a resource that exists. |
| `lstrip`, `rstrip`, `strip`, `strip_newlines` | string → string | `{{ text \| strip }}` | `strip` removes surrounding whitespace, not interior whitespace. |
| `remove`, `remove_first`, `remove_last` | string → string | `{{ title \| remove: '™' }}` | Matching is literal and case-sensitive. |
| `replace`, `replace_first`, `replace_last` | string → string | `{{ label \| replace: '-', ' ' }}` | Supply both target and replacement. |
| `slice` | string or array → string or array | `{{ title \| slice: 0, 12 }}` | A negative start counts from the end. |
| `split` | string → array<string> | `{% assign tags = text \| split: ',' %}` | The delimiter is removed; trim the resulting items if source whitespace matters. |
| `truncate`, `truncatewords` | string → string | `{{ excerpt \| truncate: 120 }}` | `truncate` counts the omission string in the limit; `truncatewords` counts words. |
| `newline_to_br` | string → HTML-like string | `{{ address \| newline_to_br }}` | It adds `<br />`; escape untrusted text before this stage when appropriate. |
| `pluralize` | number → string | `{{ cart.item_count \| pluralize: 'item', 'items' }}` | It only chooses a supplied singular or plural string. |
| `default` | any → same-or-fallback | `{{ section.settings.heading \| default: 'Featured' }}` | Uses Liquid’s blank semantics; do not use it where `false` is a meaningful deliberate value. |
| `date` | date-like value → string | `{{ article.published_at \| date: '%B %-d, %Y' }}` | The format follows `strftime`; pass a real timestamp or a supported date string. |
| `json` | value → JSON string | `{{ product \| json }}` | Use inside a `<script type="application/json">` context; it is not an HTML escape filter. |
| `highlight`, `highlight_active_tag` | string or tag → HTML | `{{ search.terms \| highlight: search.terms }}` | The output contains markup; do not escape it after filtering. |

### Math, counting, and collection filters

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `abs`, `ceil`, `floor`, `round` | number → number | `{{ price \| divided_by: 100.0 \| round: 2 }}` | Use a decimal operand such as `100.0` when you require non-integer division. |
| `at_least`, `at_most` | number → number | `{{ columns \| at_least: 2 }}` | Returns the constrained value, not a Boolean. |
| `plus`, `minus`, `times`, `divided_by`, `modulo` | number → number | `{{ quantity \| times: unit_price }}` | `divided_by` follows the operand types; integer inputs can produce integer division. |
| `sum` | array<object> → number | `{{ cart.items \| sum: 'quantity' }}` | The property must be numeric on the members you sum. |
| `size`, `first`, `last` | string or array → number or member | `{{ collection.products \| size }}` | `size` is also available through dot notation; use the filter when chaining. |
| `compact`, `uniq`, `reverse` | array → array | `{{ values \| compact \| uniq }}` | `compact` removes `nil`, not every blank-looking string. |
| `concat` | array + array → array | `{% assign all = primary \| concat: secondary %}` | It joins arrays; it is not string concatenation. |
| `join` | array → string | `{{ product.tags \| join: ', ' }}` | Convert an array to text only at the output boundary. |
| `map` | array<object> → array<value> | `{% assign titles = products \| map: 'title' %}` | Missing properties become empty values. |
| `where`, `reject` | array<object> → array<object> | `{% assign available = products \| where: 'available', true %}` | Filter by property equality; use `reject` for the inverse selection. |
| `find`, `find_index`, `has` | array<object> → object, number, or Boolean | `{% assign red = options \| find: 'name', 'Color' %}` | `find_index` returns an index; `has` answers whether a matching value exists. |
| `sort`, `sort_natural`, `sort_by` | array or collection → ordered array or URL | `{{ products \| sort: 'title' }}` | `sort_by` generates a collection URL for a supported sort option; it does not sort an arbitrary array. |
| `slice` | array → array | `{{ products \| slice: 0, 4 }}` | It has the same positional form as string `slice`. |

### URL, links, tags, and hosted files

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `url_encode`, `url_decode`, `url_escape`, `url_param_escape` | string → string | `{{ query \| url_param_escape }}` | Encode data before placing it in a URL; do not use it as an HTML escaping substitute. |
| `url_for_type`, `url_for_vendor` | string → URL string | `{{ product.vendor \| url_for_vendor }}` | Generates the current store’s vendor or product-type path. |
| `within` | product → URL string | `{{ product \| within: collection }}` | Preserves the collection context in a product URL. |
| `link_to`, `link_to_type`, `link_to_vendor` | string → HTML | `{{ product.vendor \| link_to_vendor }}` | Emits an anchor; do not wrap the result in another anchor. |
| `link_to_tag`, `link_to_add_tag`, `link_to_remove_tag` | tag string → HTML | `{{ tag \| link_to_add_tag: tag }}` | Context-bound to a blog or collection page. |
| `asset_url`, `global_asset_url`, `shopify_asset_url` | asset name → CDN URL string | `{{ 'base.css' \| asset_url }}` | Select the namespace intentionally: theme asset, shared global asset, or Shopify asset. |
| `file_url`, `file_img_url` | file name → CDN URL string | `{{ 'guide.pdf' \| file_url }}` | Files come from Shopify’s Files area, not the theme `assets/` directory. |
| `inline_asset_content` | theme asset name → inline content | `{{ 'icons.svg' \| inline_asset_content }}` | Use only assets designed for safe inlining; it returns their contents, not a URL. |
| `preload_tag` | URL string → HTML | `{{ 'base.css' \| asset_url \| preload_tag: as: 'style' }}` | Choose an accurate `as` value so the browser can prioritize correctly. |

### Images, media, and markup helpers

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `image_url` | supported image object → CDN URL string | `{{ product.featured_image \| image_url: width: 720 }}` | Requires `width` or `height`; neither is optional. Maximum requested dimension is 5760 px.[2] |
| `image_tag` | image URL or object → HTML | `{{ product.featured_image \| image_url: width: 720 \| image_tag: alt: product.title }}` | Supply meaningful `alt`; this is the current responsive helper. |
| `img_tag` | image URL or supported image object → HTML | `{{ product.featured_image \| img_tag: product.title }}` | Deprecated; replace it with `image_url` followed by `image_tag`.[7] |
| `media_tag`, `video_tag`, `external_video_tag`, `model_viewer_tag` | media object → HTML | `{{ product.media.first \| media_tag }}` | Only use with the corresponding media object type. |
| `external_video_url` | external video object → URL string | `{{ media \| external_video_url: autoplay: true }}` | Produces a provider URL, not a complete player element. |
| `placeholder_svg_tag` | placeholder name → SVG HTML | `{{ 'product-1' \| placeholder_svg_tag: 'placeholder' }}` | Use for empty-editor states, not production product imagery. |
| `article_img_url`, `asset_img_url`, `collection_img_url`, `file_img_url` | legacy image source → CDN URL string | `{{ 'banner.jpg' \| asset_img_url: 'large' }}` | Retained helpers with older size conventions; prefer `image_url` for resource images. |
| `img_url`, `product_img_url` | legacy image object → CDN URL string | `{{ product.featured_image \| img_url: '480x' }}` | Both are deprecated and replaced by `image_url`.[3] |

**Wrong — a deprecated image URL helper with a named size:**

```liquid
{{ product.featured_image | img_url: 'large' }}
```

**Right — state the required current dimension and build accessible markup:**

```liquid
{{ product.featured_image | image_url: width: 720 | image_tag: alt: product.title, loading: 'lazy' }}
```

### HTML, pagination, and storefront presentation

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `escape`, `escape_once`, `strip_html` | string → string | `{{ product.title \| escape }}` | Escape text at the HTML boundary; `escape_once` avoids double-escaping existing entities. |
| `default_errors` | form errors → HTML | `{{ form.errors \| default_errors }}` | Renders Shopify’s default error list; pair it with accessible field-level feedback. |
| `default_pagination` | paginate object → HTML | `{{ paginate \| default_pagination }}` | Only valid inside a `{% paginate %}` block. |
| `script_tag`, `stylesheet_tag` | asset URL → HTML | `{{ 'theme.js' \| asset_url \| script_tag }}` | Shopify emits the element; do not add a second manual tag around it. |
| `time_tag` | date-like value → HTML | `{{ article.published_at \| time_tag: format: 'date' }}` | Produces a semantic `<time>` element. |
| `payment_button` | product-form `form` → HTML | `{{ form \| payment_button }}` | Must be called on `form` inside a product form. |
| `payment_terms` | product- or cart-form `form` → HTML | `{{ form \| payment_terms }}` | Must be called on `form` inside a product or cart form. |
| `payment_type_img_url`, `payment_type_svg_tag` | payment type → URL or HTML | `{{ type \| payment_type_svg_tag }}` | Use for supported payment-type objects only. |

### Money, localization, customers, carts, and product measurements

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `money`, `money_with_currency`, `money_without_currency`, `money_without_trailing_zeros`, `money_amount` | money integer → formatted string | `{{ product.price \| money }}` | Let Shopify apply the store’s configured money format; never hand-format minor units. |
| `currency_selector` | form or currency context → HTML | `{{ form \| currency_selector }}` | Belongs to the legacy `currency` form; use a `localization` form for new multi-market selectors. |
| `translate` / `t` | locale key string → translated string | `{{ 'products.product.add_to_cart' \| t }}` | `t` is the common alias of `translate`; keys can come from theme or section locales.[4] |
| `avatar`, `customer_login_link`, `customer_logout_link`, `customer_register_link`, `login_button`, `format_address` | customer or address context → HTML | `{{ customer.default_address \| format_address }}` | Require the relevant customer or address object and should not be called from unrelated templates. |
| `item_count_for_variant` | cart + variant ID → number | `{{ cart \| item_count_for_variant: product.selected_or_first_available_variant.id }}` | Counts all cart quantity for the specified variant ID. |
| `line_items_for` | cart + product or variant → array<line_item> | `{% assign items = cart \| line_items_for: product %}` | Returns only cart lines containing that product or variant. |
| `unit_price_with_measurement` | number or formatted money + measurement → string | `{{ line_item.unit_price \| unit_price_with_measurement: line_item.unit_price_measurement }}` | Preserve Shopify’s localized unit formatting instead of concatenating values yourself. |
| `weight_with_unit` | number → formatted string | `{{ variant.weight \| weight_with_unit: variant.weight_unit }}` | Uses the store’s weight unit unless an override is supplied. |

### Color and font filters

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `color_to_rgb`, `color_to_hex`, `color_to_hsl`, `color_to_oklch` | color → string | `{{ settings.accent \| color_to_oklch }}` | Returns a CSS color representation; keep color tokens in settings. |
| `color_brightness`, `brightness_difference`, `color_difference`, `color_contrast` | color(s) → number | `{{ settings.foreground \| color_contrast: settings.background }}` | Contrast-related outputs are measurements, not a full accessibility verdict. |
| `color_lighten`, `color_darken`, `color_saturate`, `color_desaturate` | color → color string | `{{ settings.accent \| color_lighten: 12 }}` | Use deliberately; derived colors can undermine a merchant’s palette. |
| `color_mix`, `color_modify`, `color_extract`, `hex_to_rgba` | color → color / value string | `{{ settings.accent \| color_mix: '#ffffff', 20 }}` | `color_modify` changes one named component; `color_extract` returns one component. |
| `font_face`, `font_modify`, `font_url` | font object → CSS / font object / URL | `{{ settings.body_font \| font_face: font_display: 'swap' }}` | `font_modify` returns a derived font object for a subsequent `font_face` or `font_url` call. |

### Metafields, data, cryptography, and event helpers

| Filter | Input → output | Signature / canonical use | Edge case or constraint |
|---|---|---|---|
| `metafield_tag`, `metafield_text` | metafield → HTML or text | `{{ product.metafields.specs.material \| metafield_tag }}` | `metafield_tag` chooses markup by metafield type; use `metafield_text` when you need plain output. |
| `structured_data` | product or article → JSON-LD string | `{{ product \| structured_data }}` | Use inside a JSON-LD script element; products with variants become `ProductGroup` data.[5] |
| `standard_event_data` | product, collection, or cart → JSON string | `{{ product \| standard_event_data: 'view', context: 'page' }}` | Only `view` is supported; permitted contexts depend on the source object.[6] |
| `base64_encode`, `base64_decode`, `base64_url_safe_encode`, `base64_url_safe_decode` | string → string | `{{ value \| base64_url_safe_encode }}` | Encoding is reversible; it is not secrecy. |
| `md5`, `sha1`, `sha256`, `blake3` | string → hash string | `{{ payload \| sha256 }}` | Hashes identify a value but do not authenticate a request. |
| `hmac_sha1`, `hmac_sha256` | string + secret → hash string | `{{ payload \| hmac_sha256: secret }}` | Keep secrets out of theme source and rendered markup; prefer platform-managed integrations for sensitive work. |

---

## Gotchas

- **Escaping too early.** Run transformations first, then `escape` at the HTML-text boundary. Escaping a URL or JSON string is not the same operation as URL encoding or JSON serialization.
- **Assuming every filter works on every object.** `payment_button`, cart filters, `format_address`, and media filters need their documented context; a syntactically valid chain can still render nothing in the wrong template.
- **Using image filters without dimensions.** `image_url` rejects calls that provide neither `width` nor `height`, while old helpers silently encouraged named-size strings.[2]
- **Confusing `t` with an arbitrary lookup.** It reads locale keys, including a section’s own schema locales, not strings supplied by a merchant setting.[4]
- **Treating hashes or Base64 as browser security.** Theme Liquid renders to the client. Never put a secret or a security decision into a filter chain.
- **Copying legacy image code from old themes.** `img_url`, `product_img_url`, and `img_tag` are retained but deprecated; new code should use `image_url` and `image_tag`.[3] [7]

---

## Checklist

- [ ] I can identify whether the next filter expects a string, array, number, object, or URL.
- [ ] I use `image_url` with a width or height, then hand the resulting URL to `image_tag` when markup is needed.
- [ ] I use Shopify’s money, unit-price, translation, and address filters instead of recreating locale formatting in JavaScript.
- [ ] I treat URL, HTML, JSON, Base64, and cryptographic filters as different transformations with different safety boundaries.
- [ ] I check a context-bound filter’s object requirement before moving code into a shared snippet.

## Related

- [Appendix A — Complete Liquid Tag Reference](../appendix-a-complete-liquid-tag-reference/): the tags that control the surrounding pipeline.
- [Chapter 9 — Filters: The Core Set](../../part-02-the-liquid-language-properly/ch-09-filters-the-core-set/): strings, arrays, number math, safety, and chaining in depth.
- [Chapter 10 — Filters: The Shopify-Specific Set](../../part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/): Shopify resource, media, localization, and commerce filters in depth.
- [Chapter 33 — Metafields](../../part-04-data-objects/ch-33-metafields/): modelling and rendering custom data.
- [Appendix C — Complete Object Reference](../appendix-c-complete-object-reference/): inputs accepted by context-bound filters.

## References

[1]: https://shopify.dev/docs/api/liquid "Shopify — Liquid reference"
[2]: https://shopify.dev/docs/api/liquid/filters/image_url "Shopify — Liquid filters: image_url"
[3]: https://shopify.dev/docs/api/liquid/filters/img_url "Shopify — Liquid filters: img_url"
[4]: https://shopify.dev/docs/api/liquid/filters/translate "Shopify — Liquid filters: translate"
[5]: https://shopify.dev/docs/api/liquid/filters/structured_data "Shopify — Liquid filters: structured_data"
[6]: https://shopify.dev/docs/api/liquid/filters/standard_event_data "Shopify — Liquid filters: standard_event_data"
[7]: https://shopify.dev/docs/api/liquid/filters/img_tag "Shopify — Liquid filters: img_tag"
