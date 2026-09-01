<!-- STATUS: final -->
---
id: app-g
title: "Snippet Cookbook"
part: 15
words: 2400
---

# Appendix G — Snippet Cookbook

A production snippet is a small contract, not a copy/paste fragment. It names its inputs, owns a narrow output, handles blank values deliberately, avoids hidden caller scope, does not mutate global state, and stays inside the platform/data authority available to a theme. Use `{% render %}`, never `{% include %}`; the latter is deprecated.[1] The recipes below assume current Liquid objects where stated. If a product/metafield/review/market/app/data definition is not known in a store, preserve the fallback or mark it `[VERIFY]` rather than inventing output.

## Invocation conventions

Pass named inputs. Give snippets semantic names and let a component decide whether its output belongs in a landmark, list, table or inline context. Do not make `product-card` also own a product form; do not make an icon snippet decide navigation; do not embed external provider keys or customer data.

```liquid
{% render 'price', price: product.selected_or_first_available_variant.price, compare_at_price: product.selected_or_first_available_variant.compare_at_price %}
{% render 'responsive-image', image: product.featured_image, widths: '320,640,960', loading: 'lazy', alt: product.title %}
```

## Money and price recipes

| # | Snippet | Inputs | Contract |
| ---: | --- | --- | --- |
| 1 | `money` | `amount` | Prints `amount \| money` only when nonblank. |
| 2 | `money-with-currency` | `amount` | Uses `money_with_currency`; store formatting remains authoritative. |
| 3 | `price` | `price`, `compare_at_price` | Renders current/compare price with a sale state only if compare exceeds current. |
| 4 | `unit-price` | `variant` | Outputs unit-price presentation only when platform data is present `[VERIFY]`. |
| 5 | `price-range` | `product` | Displays min/max only when a real range is needed; no full variant array assumption. |
| 6 | `sold-out-label` | `available` | Emits meaningful unavailable text, not color alone. |
| 7 | `tax-note` | `text` | Outputs approved translatable/store copy; never invents tax/legal claims. |
| 8 | `discount-percent` | `price`, `compare_at_price` | Computes only with nonzero valid inputs and labels as a candidate display. |

```liquid
{% comment %} snippets/price.liquid {% endcomment %}
{% if price != blank %}
  <span class="price{% if compare_at_price > price %} price--sale{% endif %}">
    <span class="price__current">{{ price | money }}</span>
    {% if compare_at_price > price %}<s class="price__compare">{{ compare_at_price | money }}</s>{% endif %}
  </span>
{% endif %}
```

## Image and media recipes

| # | Snippet | Inputs | Contract |
| ---: | --- | --- | --- |
| 9 | `responsive-image` | `image`, `widths`, `loading`, `alt` | Produces an image only if source exists; caller owns meaningful alt. |
| 10 | `image-placeholder` | `label` | Visible non-production/editor fallback without fake media. |
| 11 | `media-thumb` | `media`, `width` | Link/button ownership stays with caller. |
| 12 | `decorative-image` | `image`, `width` | Uses empty alt only for genuinely decorative media. |
| 13 | `image-aspect-box` | `image`, `ratio` | Layout wrapper with explicit ratio policy `[VERIFY]`. |
| 14 | `video-poster` | `media` | Renders poster/fallback only; no assumed provider behavior. |
| 15 | `media-alt-note` | `alt` | Editor-visible reminder when source alt is blank `[VERIFY]`. |

```liquid
{% comment %} snippets/responsive-image.liquid {% endcomment %}
{% if image != blank %}
  {% assign requested_widths = widths | default: '320,640,960' | split: ',' %}
  <img src="{{ image | image_url: width: 640 }}" srcset="{% for width in requested_widths %}{{ image | image_url: width: width }} {{ width }}w{% unless forloop.last %}, {% endunless %}{% endfor %}" sizes="(min-width: 990px) 33vw, 100vw" loading="{{ loading | default: 'lazy' }}" alt="{{ alt | escape }}" width="{{ image.width }}" height="{{ image.height }}">
{% endif %}
```

## Icons, navigation and text recipes

| # | Snippet | Inputs | Contract |
| ---: | --- | --- | --- |
| 16 | `icon` | `name`, `size`, `title` | Whitelisted SVG symbol; title only when meaningful. |
| 17 | `icon-chevron` | `direction` | Decorative direction mark with caller-owned label. |
| 18 | `visually-hidden` | `text` | Supplies text for an existing control, not a duplicate label. |
| 19 | `breadcrumb` | `items` | Ordered navigation list; caller supplies current-page policy. |
| 20 | `skip-link` | `target_id`, `text` | Requires a real focusable main target. |
| 21 | `pagination` | `paginate` | Uses pagination object and clear navigation label. |
| 22 | `truncate-text` | `text`, `length` | Presentation truncation only; do not hide required legal/product data. |
| 23 | `external-link-label` | `text` | Adds explicit destination/context where needed. |
| 24 | `empty-state` | `heading`, `body` | Route-owned fallback with no fabricated recovery action. |

```liquid
{% comment %} snippets/breadcrumb.liquid {% endcomment %}
{% if items != blank %}<nav aria-label="Breadcrumb"><ol>{% for item in items %}<li>{% if item.url != blank %}<a href="{{ item.url }}">{{ item.title }}</a>{% else %}<span aria-current="page">{{ item.title }}</span>{% endif %}</li>{% endfor %}</ol></nav>{% endif %}
```

## Product, collection and badge recipes

| # | Snippet | Inputs | Contract |
| ---: | --- | --- | --- |
| 25 | `product-card` | `product`, `image_loading` | Display-only card with explicit product input. |
| 26 | `product-title` | `product`, `heading_level` | Caller chooses appropriate heading level. |
| 27 | `product-vendor` | `product` | Displays vendor only if approved for surface `[VERIFY]`. |
| 28 | `product-badges` | `product`, `variant` | Delegates to narrow badge conditions; no invented claim. |
| 29 | `sale-badge` | `price`, `compare_at_price` | Shows only calculated sale condition. |
| 30 | `availability-badge` | `available` | Textual availability state with no stock promise. |
| 31 | `collection-card` | `collection` | Blank-safe image/title/link card. |
| 32 | `collection-count` | `collection` | Displays count only where it is meaningful/current `[VERIFY]`. |
| 33 | `sort-select` | `collection`, `id` | URL form control based on `sort_options`. |
| 34 | `filter-summary` | `filters` | Storefront filtering availability is `[VERIFY]`; blank-safe output. |

## Content, metafield and structured-data recipes

| # | Snippet | Inputs | Contract |
| ---: | --- | --- | --- |
| 35 | `metafield-text` | `field` | Prints only present field value; type/context verified by caller. |
| 36 | `metafield-richtext` | `field` | Uses `metafield_tag` only for a compatible field `[VERIFY]`. |
| 37 | `spec-table` | `specifications` | Emits table semantics only for typed tabular rows. |
| 38 | `guide-callout` | `guide` | Explicit reference; omitted when blank. |
| 39 | `json-ld-product` | `product` | Candidate structured data only after schema/content validation `[VERIFY]`. |
| 40 | `json-ld-breadcrumb` | `items` | Serializes only named safe values; verify schema/version. |
| 41 | `article-byline` | `article` | Displays approved date/author policy `[VERIFY]`. |
| 42 | `share-link` | `url`, `title` | Escapes named values; provider/share endpoint is `[VERIFY]`. |
| 43 | `rating-stars` | `rating`, `count` | Requires a verified rating source; text alternative required. |
| 44 | `store-location` | `location` | Static published location data; no provider/geolocation assumption. |

```liquid
{% comment %} snippets/metafield-text.liquid {% endcomment %}
{% if field != blank and field.value != blank %}<span class="metafield-text">{{ field.value }}</span>{% endif %}

{% comment %} snippets/spec-table.liquid {% endcomment %}
{% if specifications != blank %}<table><caption>Specifications</caption><tbody>{% for item in specifications %}<tr><th scope="row">{{ item.label }}</th><td>{{ item.value }}</td></tr>{% endfor %}</tbody></table>{% endif %}
```

## Patterns for integrating recipes

A recipe needs a caller contract. The snippets are intentionally small so the section or template retains responsibility for resource context, heading hierarchy, landmark placement, form ownership and error state. This prevents the apparently convenient snippet from becoming the place where page-level decisions vanish.

For example, a product section can call `product-card` for recommendations, but it must not use the same card to submit the selected product form. A collection section can call `sort-select` inside its real GET form, but the caller must preserve other query state and retain pagination. A guide section can call `guide-callout` with an explicit reference, but the caller owns the decision that a particular product/context receives that guide. A location section can call `store-location`, but the location source, data freshness and map/provider decision remain outside the snippet.

| Recipe family | Caller must own | Snippet must own |
| --- | --- | --- |
| Price/badge | Product/variant selection and commerce message policy | Formatting and narrow conditional output |
| Image/media | Content priority, surrounding link/control and alt decision | Blank-safe image markup and stated loading input |
| Navigation | Landmark, current-page and destination policy | List/link semantics from supplied items |
| Product/collection | Route/resource context and form/pagination state | Display-only fragment with explicit object input |
| Structured content | Definition/reference/visibility and empty-state policy | Typed presentation without invented data |
| JSON-LD/rating | Source validity, schema approval and consent/privacy review | Narrow serialization only after verification |

### Accessibility test cases

Recipe code that parses as Liquid is not necessarily accessible. Test a rendered recipe in the context where it is used. A decorative icon needs an empty/hidden accessible treatment; an icon-only button needs a text label from its caller. A truncated title must not make the only available product name ambiguous. A price sale treatment needs text and semantic difference, not only colour or a strikethrough. Breadcrumbs need a navigation label and a current-page treatment. Pagination needs an understandable destination/current state. An image requires an alternative appropriate to its role, not a filename copied blindly.

For table recipes, test that the data is actually tabular. A `spec-table` with a single promotional sentence is worse than a paragraph because it communicates a false relationship. For rating recipes, test that the text alternative explains rating scale/count and that a missing review source omits the widget. For a JSON-LD recipe, validate the emitted output against the agreed current schema only after product/content data is established `[VERIFY]`; invisible markup can still create visible search/discovery problems.

### CSS and JavaScript ownership

A snippet should usually emit stable, narrow class names; it should not load a global stylesheet, attach a document-level listener, alter focus, register a custom element, or dispatch commerce data by itself. The caller or a named component owns assets and lifecycle. This keeps a simple `price` or `icon` render safe in a cart drawer, editor preview, recommendation surface or static page without duplicate assets or event handlers.

If a snippet needs enhancement, document the progressive baseline first. A gallery thumbnail can remain a link; a truncation control can remain expanded text; a pagination enhancement can preserve full links; a rating component can render plain text. Then name the owning JavaScript component, initialization/replacement behavior, error path and test fixture. A shared snippet never becomes an excuse for a hidden global event bus.

### Recipe lifecycle

Cookbooks decay when no one owns removal. Give every adopted recipe a source path, callers, data contracts, CSS/JS dependencies, accessibility fixture, market/locale considerations and an owner. When a product data definition changes, search its recipe callers before changing output. When an icon is renamed, preserve or deliberately migrate callers. When a component is deleted, remove unused snippets/assets and update the catalogue. The 300 Theme Block file limit and overall file count are reminders that an unused file is still inventory, not harmless documentation.[2]

Do not version a snippet solely by suffixing files (`price-new`, `price-final`, `price-final-2`). Version behavior through an explicit migration, caller inventory, fixtures and release record. Where compatibility is temporarily required, identify the compatibility window and removal trigger `[VERIFY]`. This makes a cookbook a maintained library rather than a fossilized folder.

## Cookbook review rules

The forty-four recipes are a catalogue, not a mandate to add forty-four files. Adopt a recipe only when its input, output, route, accessibility semantics, blank behavior, CSS/JS owner and fixture are real. A snippet that reaches into `cart`, `customer`, `product`, global settings or a provider response without receiving it by contract is not reusable; it is coupled code with a friendly filename.

For JSON-LD, ratings, metafields, filters, unit prices, markets, recommendations and location data, source type/visibility/schema/version/consent or configuration can change. Verify the current platform/data contract before use. Avoid generated “universal” schema snippets that emit invalid structured data when fields are absent.

## Checklist

| Before adding a cookbook recipe | Evidence |
| --- | --- |
| Inputs and blank behavior are named | Render call and empty fixture |
| Output has correct semantics | Keyboard/screen-reader/content review |
| No hidden authority is assumed | Product/cart/customer/provider/data boundary review |
| Data-dependent recipe has a verified source | Definition/configuration/market/privacy evidence `[VERIFY]` |
| Recipe improves ownership | Component, CSS/JS and test responsibility is explicit |

## References

[2]: ../../docs/DEPRECATIONS.md "Verified theme file and block limits ledger"
[1]: ../../docs/DEPRECATIONS.md "`include` deprecation and `render` replacement"
