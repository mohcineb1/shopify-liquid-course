<!-- STATUS: final -->
---
id: app-c
title: "Complete Object Reference"
part: 15
words: 2425
---

# Appendix C — Complete Object Reference

Liquid objects are not a global ORM you can query at will. Shopify hands a template a context-shaped graph: a product page receives `product`, a collection page receives `collection`, a section receives `section`, and a cart exists even when its contents are empty. The expensive bugs are therefore usually availability bugs—reading a contextual object in the wrong template—or lookup bugs—turning a local render into a large global traversal. This appendix is the map from object name to property surface, availability, and access cost.[1]

## What you’ll be able to do

- Identify which object a template actually exposes before you design its Liquid.
- Distinguish direct scalar access from relationship traversal and global lookups.
- Find the property family for product, cart, customer, content, localization, and editor work.
- Avoid hardcoded paths and `all_products` lookups where the current template already supplies the resource.

---

## C.1 Every object, property surface, cost, and template exposure

**Cost labels are authoring guidance, not Shopify latency guarantees.** **Cheap** means a scalar or already-supplied property of the current object. **Traverse** means an associated object or collection, so keep loops bounded and avoid repeated property paths. **Lookup** means an indexed/global collection, a search result, or a rendering-context response; cache it in an `assign`, guard it, and do not mistake it for a free field read. **Global** means any theme Liquid file; a named template means that template and its sections/blocks; **local** means a section, block, form, loop, or specialized rendering context.

### Global storefront, request, and configuration objects

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `shop` | `name`, `description`, `domain`, `secure_url`, `url`, `permanent_domain`, `email`, `phone`, `address`, `brand`, `currency`, `money_format`, `money_with_currency_format`, `enabled_currencies`, `enabled_payment_types`, `policies`, individual policy properties, `types`, `vendors`, `search_types`, `published_locales`, `metafields`, counts, account flags | Cheap scalars; traverse arrays and `metafields` | Global |
| `request` | `design_mode`, `visual_preview_mode`, `host`, `origin`, `path`, `page_type`, `locale` | Cheap | Global; request-shaped templates |
| `routes` | Named paths such as `root_url`, `cart_url`, `cart_add_url`, `account_url`, `search_url`, `collections_url`, `all_products_collection_url`, policy and localization routes | Cheap | Global |
| `settings` | Every `settings_schema.json` setting by ID, including resource references | Cheap scalar; traverse selected resource | Global, including Liquid assets where documented |
| `theme` | `id`, `name`, `role` | Legacy/contextual | Global, but deprecated in Liquid because its values can change; do not build new theme logic on it.[6] |
| `template` | `name`, `suffix`, `directory` | Cheap | Global |
| `canonical_url`, `page_title`, `page_description`, `page_image`, `powered_by_link` | Render-ready URL, title, description, image, or HTML string | Cheap | Global |
| `handle`, `current_page`, `current_tags` | Current handle, pagination number, and applied tags | Cheap | `current_tags` is collection/blog context; other values are global where relevant |
| `content_for_header`, `content_for_layout`, `content_for_index`, `content_for_additional_checkout_buttons`, `additional_checkout_buttons` | Shopify-injected or layout-rendered HTML | Lookup/render context | The matching layout/index/cart context; do not reproduce their markup |
| `robots`, `sitemap` | Crawler directives and sitemap rendering context | Cheap/contextual | `robots.txt.liquid` and `sitemap.xml.liquid` respectively |
| `app`, `scripts`, `script` | App identity/metafields and ScriptTag records where Shopify exposes them | Traverse/contextual | App and legacy script contexts; do not use as a replacement for theme app extensions |

Use `routes`, rather than building a storefront path yourself: its properties follow locale and market routing.[2]

```liquid
<!-- sections/main-product-title.liquid — product template only -->
{%- assign tea = all_products['lunar-tea'] -%}
<h1>{{ tea.title }}</h1>
```

**Wrong when this section is already on that product’s template:** it spends one of the global lookup budget on data the template has supplied.

```liquid
<!-- sections/main-product-title.liquid — product template only -->
<h1>{{ product.title }}</h1>
```

**Right:** `product` is the current resource. `all_products[handle]` is global, returns `empty` for an unknown handle, and is limited to **20 unique handles per page**; use a collection for a larger set.[3]

### Localization, navigation, and global resource indexes

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `localization` | `country`, `language`, `market`, `available_countries`, `available_languages`, `available_markets` | Cheap current selection; traverse available lists | Global |
| `country`, `currency`, `shop_locale`, `market` | Country: `name`, `iso_code`, `currency`, `market`, `available_languages`, `unit_system`; currency: `iso_code`, `name`, `symbol`; locale/market identify current published context | Cheap; traverse nested locale/currency objects | Global via localization/request/shop |
| `all_country_option_tags`, `country_option_tags` | Shopify-generated country option markup | Render context | Address/localization forms |
| `linklists`, `linklist`, `link` | Index by handle; list `title`, `handle`, `links`; link `title`, `url`, `active`, `child_active`, `current`, `levels`, `links`, `object`, `type` | Lookup for index; traverse menu tree | `linklists` global; children local to a menu |
| `collections`, `pages`, `blogs`, `articles`, `images` | Handle-indexed resource collections; `article` index is blog-scoped | Lookup; one access then assign | Global where documented |
| `metaobjects`, `metaobject_definition`, `metaobject`, `metaobject_system` | `metaobjects[type][handle]`; definition entries/values; entry `id`, `handle`, `type`, `fields`, `system`, `seo`; system timestamps/URL | Lookup then traverse | `metaobjects` global; `metaobject` on metaobject templates or references |
| `all_products` | Handle index returning a `product` or `empty` | Lookup; 20 unique handles/page | Global |
| `closest` | Closest `product`, `collection`, `article`, `blog`, `page`, or `metaobject` inherited from the render context | Traverse/contextual | Theme blocks and nested contexts only |

### Product, collection, and merchandising objects

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `product` | Identity/content: `id`, `handle`, `title`, `description`/`content`, `type`, `vendor`, `url`, `template_suffix`, timestamps, `tags`, `category`; price state: `price`, `price_min`, `price_max`, `price_varies`, `compare_at_price`, `compare_at_price_min`, `compare_at_price_max`, `compare_at_price_varies`; media: `featured_image`, `featured_media`, `images`, `media`; variants/options: `variants`, `variants_count`, `options`, `options_by_name`, `options_with_values`, selected/first-available variants and selling-plan allocations; commerce: `available`, `gift_card?`, `requires_selling_plan`, quantity-break state, `selling_plan_groups`, `collections`, `metafields` | Cheap scalar; traverse variants, media, plans, collections, metafields | Product template; collection/search/recommendation cards; resource settings/references |
| `variant` | `id`, `title`, `sku`, `barcode`, `url`, `product`, `options`, `selected?`, `available`, `price`, `compare_at_price`, inventory fields, `featured_image`, `featured_media`, `image`, `weight`, `weight_unit`, `requires_shipping`, `taxable`, `unit_price`, `unit_price_measurement`, `quantity_rule`, `quantity_price_breaks`, selling-plan fields, `store_availabilities`, `metafields` | Cheap scalar; traverse product, availability, allocations | Product and product-derived contexts |
| `product_option`, `product_option_value` | Option `name`, `position`, `values`, `selected_value`; value `name`, `selected`, `available`, `variant`, swatch and product-url state | Traverse from `product.options_with_values` | Product context |
| `collection` | `id`, `handle`, `title`, `description`, `url`, `image`, `featured_image`, `template_suffix`, timestamps; result state: `products`, `products_count`, `all_products_count`, `tags`, `all_tags`, `all_types`, `all_vendors`, `filters`, `sort_by`, `default_sort_by`, `sort_options`, `current_type`, `current_vendor`, next/previous product, `metafields` | Cheap scalar; traverse products, tags, filters, sort options | Collection template; product context for previous/next; collection settings |
| `filter`, `filter_value`, `filter_value_display`, `sort_option` | Filter `label`, `type`, `param_name`, `values`, `active_values`, `false_value`, `min_value`, `max_value`, `url_to_remove`; value `label`, `value`, `count`, `active`, URLs and display; sort option `name`, `value` | Traverse; guard empty filters on large collections | Collection and search results |
| `recommendations` | `products`, `performed?`, `intent` | Lookup/render response | A section rendered through Product Recommendations/Section Rendering APIs |
| `remote_product`, `remote_shop`, `remote_details` | Remote product identity, availability, price/media, remote shop URL/name and marketplace details | Traverse/contextual | Remote product/card contexts |
| `taxonomy_category`, `swatch`, `store_availability`, `location`, `quantity_rule`, `quantity_price_break` | Taxonomy `id`, `name`, parent; swatch color/image; availability `title`, `pick_up_enabled`, `available`, location; quantity and price-break limits/prices | Traverse from product/variant | Product context |

A product card can be rendered in a collection or search result, but never assume the product page’s selected variant or all media state is present. Use the current card’s documented properties, and move selection UX to `course/part-04-data-objects/ch-27-products/` and `ch-28-variants/`.

### Cart, checkout, customers, and order objects

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `cart` | `items`, `item_count`, `attributes`, `note`, `currency`, `requires_shipping`, `taxes_included`, `duties_included`, `total_price`, `original_total_price`, `items_subtotal_price`, `total_discount`, `total_weight`, `checkout_charge_amount`, discount applications | Cheap totals; traverse line items/discount arrays | Global cart state; cart template |
| `line_item` | `product`, `variant`, `title`, `url`, `quantity`, `original_price`, `original_line_price`, `final_price`, `final_line_price`, `discount_allocations`, `properties`, `selling_plan_allocation`, `unit_price`, `unit_price_measurement`, `image`, `featured_media`, `sku`, `vendor`, `gift_card`, `requires_shipping` | Traverse from cart/order; properties may be merchant/customer supplied. Legacy `discounts`, `price`, and `line_price` are deprecated. | Cart, checkout, order contexts |
| `discount_application`, `discount_allocation`, `discount` | Application `title`, `type`, `value`, `value_type`, target fields, `total_allocated_amount`; allocation `amount`, `discount_application`; legacy discount details | Traverse | Cart, line item, checkout, order |
| `customer` | `id`, `name`, first/last names, `email`, `phone`, `tags`, `accepts_marketing`, `orders`, `orders_count`, `default_address`, `addresses`, `last_order`, `total_spent`, `metafields`, B2B company fields | Cheap identity; traverse orders/addresses | Global only when logged in; customer templates |
| `address`, `company`, `company_location`, `company_address`, `customer_payment_method`, `store_credit_account` | Address names, lines, city, province, country, codes, zip, phone; company/location identity, addresses, tax/shipping data; payment/store-credit context | Traverse/contextual | Customer account, B2B, payment contexts |
| `order`, `fulfillment`, `transaction`, `transaction_payment_details`, `shipping_method`, `tax_line` | Order identity, dates, line items, addresses, discounts, shipping, taxes, transactions; fulfillment tracking/status; transaction amount/status/gateway; shipping/tax labels/rates | Traverse; sensitive account state | Customer order and order-status contexts |
| `checkout` | Cart-like checkout lines, addresses, email, discounts, taxes, shipping, payments, order/transaction state | Contextual/legacy | Order status pages and, for Shopify Plus, `checkout.liquid`; the in-checkout Information, Shipping, and Payment surfaces are deprecated. Do not build new checkout customizations with Liquid.[4] |
| `gift_card`, `recipient`, `pending_payment_instruction_input`, `instructions` | Gift-card code/balance/expiry and recipient delivery data; payment instruction and nested-cart relationships | Contextual | Gift-card, payment, or nested-cart contexts |

`cart.discounts` is deprecated in favour of `cart.discount_applications`; new checkout work belongs in Checkout Extensibility, not `checkout.liquid`.[4]

### Content, search, media, and files

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `article`, `blog`, `comment` | Article/blog `id`, `handle`, `title`, `url`, `content`, excerpts, images, tags, timestamps, author/user, comments, moderation state, adjacent entries, `metafields`; comment author/content/email/status/date/url | Cheap scalar; traverse comments/articles | Article, blog, content card contexts |
| `page`, `policy` | `title`, `handle`, `url`, `content`/`body`, `template_suffix`, timestamps, `metafields`; policy title/body/url | Cheap | Page/policy template; policy via `shop` |
| `search`, `predictive_search`, `predictive_search_resources` | Search `terms`, `performed`, `results`, `results_count`, `types`; predictive `performed`, `terms`, resources for products, collections, pages, articles, queries | Lookup/result traversal | Search template and predictive-search section response |
| `media`, `image`, `image_presentation`, `video`, `video_source`, `external_video`, `model`, `model_source`, `generic_file`, `focal_point` | Shared media identity/type/position/preview; image `src`, dimensions, alt, aspect ratio, presentation/focal point; video/external source URLs and dimensions; model sources; generic-file URL/mime | Cheap scalar; traverse source arrays | Product/collection/article/media settings and references |
| `font`, `color`, `color_scheme`, `color_scheme_group`, `brand`, `brand_color` | Font family/style/weight; color RGB/HSL/OKLCH components; scheme ID/settings/group; brand name/logo/cover/color assets | Cheap settings data; traverse scheme settings | Theme settings, section/block settings, `shop.brand` |
| `rating`, `measurement`, `unit_price_measurement`, `money` | Rating value/scale; measurement quantity/unit; unit-price reference/base units; money amount/currency representation | Cheap leaf data | Product, variant, metafield, and commerce parents |

### Sections, blocks, loops, forms, selling plans, and leaf Drops

| Object | Properties and object surface | Cost | Exposed in |
|---|---|---|---|
| `section`, `block` | Section `id`, `settings`, `blocks`, `index`, `index0`, `location`; block `id`, `type`, `settings`, `shopify_attributes` | Cheap local scalars; traverse child blocks | Section/block files only. `section.index` can be `nil` for static sections, editor renders, and Section Rendering API responses.[5] |
| `form`, `form_errors` | Form `id`, `action`, `method`, `errors`, posted/success fields; errors keyed by field/global message | Local/render context | Inside `{% form %}` only |
| `forloop`, `tablerowloop`, `paginate` | Loop `index`, `index0`, `rindex`, `first`, `last`, `length`, parent loop; paginate page parts, current page, previous/next, total items/pages | Cheap local state | Corresponding `{% for %}`, `{% tablerow %}`, `{% paginate %}` body |
| `selling_plan`, `selling_plan_group`, `selling_plan_option`, `selling_plan_group_option`, `selling_plan_allocation`, `selling_plan_allocation_price_adjustment`, `selling_plan_price_adjustment`, `selling_plan_checkout_charge` | IDs/names/options, recurring policy, price adjustments, checkout charge, allocation price/compare price/per-delivery price and selling-plan link | Traverse | Product/variant/line-item subscription contexts |
| `metafield`, `parent_relationship`, `part`, `group`, `rule`, `self` | Metafield `namespace`, `key`, `type`, `value`, `list?`; parent/part/group/rule/self model relationships | Traverse/contextual | Metafield, metaobject, and component-specific contexts |
| `user`, `user_agent` | User profile identity/contact/image; bot directive/value | Cheap/contextual | Article/comment author and `robots.txt.liquid` contexts |

The source inventory includes **every currently documented object** in the Shopify theme Liquid reference; leaf Drops above inherit availability from their parent. When Shopify’s object page says “directly accessible in,” trust that page over a copied example.[1]

---

## Gotchas

- **A global name is not a global resource.** `all_products`, `collections`, `pages`, `linklists`, and `metaobjects` are available globally, but their handle access is still a lookup. Assign once, test for `blank`, and do not turn a navigation loop into a product-query engine.
- **A template object is not guaranteed inside a shared section.** A section can be placed in different templates. Guard `product`, `collection`, `article`, and similar contextual objects before reading them, or constrain the section’s intended placement.
- **Do not treat `section.id` or `block.id` as durable business keys.** JSON-template IDs are generated, and editor identity is not a product handle or customer ID.
- **Traversal can hide work.** `product.variants`, `collection.products`, `cart.items`, `customer.orders`, search results, metafields, and metaobject entries are data collections. Paginate and bound them instead of assuming a small store.
- **Current customer context changes money, tax, market, availability, and URLs.** Use `cart`, `localization`, `request`, and `routes` rather than a shop-wide property or hardcoded storefront path when the output is customer-facing.
- **Do not revive retired checkout Liquid.** The checkout object may appear in documentation for legacy surfaces; it does not make `checkout.liquid` a valid extension point now.[4]

---

## Checklist

- [ ] I can name the template or local context that supplies every object I render.
- [ ] I mark collection/relationship reads as traversals and reserve global indexes for bounded, intentional lookups.
- [ ] I use `routes` and request/localization context for storefront URLs.
- [ ] I guard contextual objects in reusable sections rather than assuming a product or collection exists.
- [ ] I know that a leaf Drop inherits the availability of its parent object.

## Related

- [Appendix A — Complete Liquid Tag Reference](../appendix-a-complete-liquid-tag-reference/): tags that create local scopes and render contexts.
- [Appendix B — Complete Filter Reference](../appendix-b-complete-filter-reference/): transformations applied to the values listed here.
- [Chapter 3 — The Shopify Object Graph](../../part-01-the-mental-model/ch-03-the-shopify-object-graph/): the conceptual model and lazy Drops.
- [Chapter 11 — Drops in Depth](../../part-02-the-liquid-language-properly/ch-11-drops-in-depth/): lazy evaluation, safe iteration, and serialization boundaries.
- [Chapter 26 — Global Objects](../../part-04-data-objects/ch-26-global-objects/): global object behavior in depth.
- [Chapter 27 — Products](../../part-04-data-objects/ch-27-products/), [Chapter 28 — Variants](../../part-04-data-objects/ch-28-variants/), and [Chapter 30 — Cart & Line Items](../../part-04-data-objects/ch-30-cart-line-items/): resource-specific rendering patterns.

## References

[1]: https://shopify.dev/docs/api/liquid/objects "Shopify — Liquid objects"
[2]: https://shopify.dev/docs/api/liquid/objects/routes "Shopify — Liquid object: routes"
[3]: https://shopify.dev/docs/api/liquid/objects/all_products "Shopify — Liquid object: all_products"
[4]: https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid "Shopify — checkout.liquid"
[5]: https://shopify.dev/docs/api/liquid/objects/section "Shopify — Liquid object: section"
[6]: https://shopify.dev/docs/api/liquid/objects/theme "Shopify — Liquid object: theme"
