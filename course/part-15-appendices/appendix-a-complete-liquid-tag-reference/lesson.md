<!-- STATUS: final -->
---
id: app-a
title: "Complete Liquid Tag Reference"
part: 15
words: 2401
---

# Appendix A — Complete Liquid Tag Reference

Liquid tags are not functions. They are parser-level instructions: some open a block, some mutate a rendering scope, and some hand control to Shopify’s theme runtime. This appendix is the lookup table you use when you know the job—branch, render, paginate, emit an asset—but need the exact spelling, valid shape, and sharp edge. It covers the Shopify theme variation of Liquid, not the separate Liquid dialects used by notifications, Flow, Order Printer, or packing slips.[1]

## What you’ll be able to do

- Identify every current Shopify theme Liquid tag by category and lifecycle.
- Copy a valid signature before reaching for a search tab or an old theme.
- Distinguish parser syntax, template composition, merchant-managed content, and developer-preview features.
- Avoid the silent failures caused by deprecated `include`, static sections, and misused block render slots.

---

## A.1 Every Liquid tag, grouped by job

The tables are intentionally dense. A closer such as `endif` or `endform` is part of the opening tag’s contract, not an independent capability. Whitespace-control variants—`{%-` and `-%}`—remain valid wherever the untrimmed delimiter appears. The signatures below follow Shopify’s current Liquid reference.[1]

### Control flow

| Tag or branch | Signature | Canonical example | Use it when |
|---|---|---|---|
| `if` | `{% if condition %}…{% endif %}` | `{% if product.available %}In stock{% endif %}` | The positive path is the main case. |
| `elsif` | `{% elsif condition %}` inside `if` or `unless` | `{% if product.available %}Buy{% elsif product.requires_selling_plan %}Subscribe{% endif %}` | You need another ordered branch. |
| `else` | `{% else %}` inside a block tag | `{% if product.available %}Buy{% else %}Sold out{% endif %}` | The remaining path needs output. |
| `unless` | `{% unless condition %}…{% endunless %}` | `{% unless product.available %}Sold out{% endunless %}` | The negative condition reads more directly than `if ... == false`. |
| `case` / `when` | `{% case value %}{% when value %}…{% endcase %}` | `{% case product.type %}{% when 'Tea' %}Steep{% else %}Serve{% endcase %}` | One value selects among named variants. |

`if`, `unless`, and `case` do not turn Liquid into JavaScript. Parentheses are not available for grouping boolean expressions, so give complex predicates names with `assign` before branching. `when` can match multiple values, but it only belongs inside `case`; it is not an independent dispatch tag.[1]

```liquid
<!-- snippets/purchase-state.liquid -->
{%- assign can_buy = product.available and product.selected_or_first_available_variant != blank -%}

{% if can_buy %}
  <span class="purchase-state">Ready to add</span>
{% elsif product.requires_selling_plan %}
  <span class="purchase-state">Subscription required</span>
{% else %}
  <span class="purchase-state">Unavailable</span>
{% endif %}
```

### Iteration

| Tag | Signature | Canonical example | Operational detail |
|---|---|---|---|
| `for` | `{% for item in array %}…{% endfor %}` | `{% for link in menu.links %}{{ link.title }}{% endfor %}` | Accepts `limit`, `offset`, `reversed`, and ranges. |
| `else` in `for` | `{% else %}` before `endfor` | `{% for product in collection.products %}…{% else %}No products{% endfor %}` | Handles an empty collection without a separate size check. |
| `break` | `{% break %}` | `{% if product.available %}{% break %}{% endif %}` | Ends the nearest `for` or `tablerow` loop. |
| `continue` | `{% continue %}` | `{% if product.available == false %}{% continue %}{% endif %}` | Skips to the next loop iteration. |
| `cycle` | `{% cycle 'odd', 'even' %}` | `<li class="row--{% cycle 'odd', 'even' %}">` | Rotates through values per loop context. |
| `tablerow` | `{% tablerow item in array cols: 3 %}…{% endtablerow %}` | `{% tablerow product in collection.products cols: 3 %}{{ product.title }}{% endtablerow %}` | Emits table rows and cells; prefer semantic grid markup for ordinary layout. |

A plain `for` loop renders at most 50 iterations. That is a rendering limit, not a pagination strategy. Use `paginate` for supported large arrays; it has its own page-size and depth constraints.[2]

```liquid
<!-- sections/collection-grid.liquid -->
{% paginate collection.products by 24 %}
  <ul class="product-grid" role="list">
    {% for product in collection.products limit: 24 %}
      <li>{% render 'product-card', product: product %}</li>
    {% else %}
      <li>No products match this collection.</li>
    {% endfor %}
  </ul>

  {{ paginate | default_pagination }}
{% endpaginate %}
```

### Variables and explicit output

| Tag | Signature | Canonical example | Important constraint |
|---|---|---|---|
| `assign` | `{% assign name = value %}` | `{% assign title = product.title | upcase %}` | Creates a variable; never shadow a Shopify object such as `product` or `cart`. |
| `capture` | `{% capture name %}…{% endcapture %}` | `{% capture label %}{{ product.title }} — {{ product.price | money }}{% endcapture %}` | Always captures rendered text, not the source value’s original type. |
| `increment` | `{% increment name %}` | `{% increment card_index %}` | First output is `0`; its counter namespace is separate from `assign` and `capture`. |
| `decrement` | `{% decrement name %}` | `{% decrement countdown %}` | First output is `-1`; it shares its counter with `increment`. |
| `echo` | `{% echo expression %}` | `{% echo product.title | escape %}` | Outputs from inside a `{% liquid %}` block. |

`increment` and `decrement` are not general numeric variables. Their state is local to the layout, template, or section that declares them, shared with snippets rendered from that file, and independent of ordinary assigned variables.[3]

```liquid
<!-- sections/recommendations.liquid -->
{% liquid
  assign visible_count = 0
  for recommendation in recommendations.products
    unless recommendation.available
      continue
    endunless

    assign visible_count = visible_count | plus: 1
    echo '<span class="recommendation-count">'
    echo visible_count
    echo '</span>'
  endfor
%}
```

### Theme composition and Shopify runtime tags

These tags are where a template stops being plain string templating and starts participating in the theme architecture.

| Tag | Signature | Canonical example | Contract |
|---|---|---|---|
| `content_for` | `{% content_for 'blocks' %}` | `{% content_for 'blocks' %}` | Renders the dynamic theme blocks configured for the current section or block. |
| `content_for` static form | `{% content_for 'block', type: 'name', id: 'id'[, key: value] %}` | `{% content_for 'block', type: '_heading', id: 'hero-heading' %}` | Renders one static theme block in a fixed position and can pass named parameters into it. |
| `form` | `{% form 'type'[, object][, return_to: path][, attribute: value] %}…{% endform %}` | `{% form 'product', product, return_to: routes.cart_url %}<button>Add to cart</button>{% endform %}` | Generates the endpoint and required hidden fields for a Shopify form. |
| `include` | `{% include 'filename' %}` | `{% include 'legacy-card' %}` | Deprecated. Read it in legacy code; do not add it. Use `render`. |
| `layout` | `{% layout 'name' %}` | `{% layout 'full-width' %}` | Selects a layout; `{% layout none %}` removes the layout. |
| `paginate` | `{% paginate array by size[, window_size: n] %}…{% endpaginate %}` | `{% paginate search.results by 20, window_size: 1 %}…{% endpaginate %}` | Paginates supported arrays; page size is 1–250, `window_size` controls visible navigation pages, and traversal ends at item 25,000. |
| `render` | `{% render 'filename', key: value %}` | `{% render 'product-card', product: product %}` | Renders an isolated snippet or app block. |
| `section` | `{% section 'name' %}` | `{% section 'newsletter-signup' %}` | Renders a static section. |
| `sections` | `{% sections 'name' %}` | `{% sections 'header-group' %}` | Renders a section group from a layout. |

`content_for` has two deliberately different forms. `'blocks'` gives merchants the order and membership stored in theme data. `'block'` takes an explicit type and developer-provided ID, producing a static block that merchants can customize or hide but cannot remove or reorder.[4] Do not confuse it with `render`: a snippet is a private rendering utility, whereas a theme block is merchant-facing composition.

**Wrong — copied markup through a deprecated, shared-scope call:**

```liquid
<!-- sections/featured-products.liquid -->
{% include 'product-card' %}
```

**Right — pass the dependency explicitly to an isolated snippet:**

```liquid
<!-- sections/featured-products.liquid -->
{% render 'product-card', product: product, show_vendor: true %}
```

`render` has `with`, `for`, and `as` forms when the calling site needs a one-object or collection-oriented API. Variables created outside a snippet do not leak into it; pass what the snippet requires. `include` remains recognized for legacy themes but is deprecated in favor of `render`.[5]

For `form`, the first argument is a required form type. The complete current set is `activate_customer_password`, `cart`, `contact`, `create_customer`, `currency`, `customer`, `customer_address`, `customer_login`, `guest_login`, `localization`, `new_comment`, `product`, `recover_customer_password`, `reset_customer_password`, and `storefront_password`. `cart`, `product`, and `new_comment` take their corresponding object; `customer_address` takes `customer.new_address` or an existing `address`. Every form can take `return_to` and normal HTML attributes. The old `currency` form is deprecated; use `localization` for language and country selection.[6]

### Markup, assets, and authoring tags

| Tag | Signature | Canonical example | Use it when |
|---|---|---|---|
| `style` | `{% style %}…{% endstyle %}` | `{% style %}.hero { color: {{ settings.accent }}; }{% endstyle %}` | Liquid-generated CSS belongs in a `<style data-shopify>` element. |
| `stylesheet` | `{% stylesheet %}…{% endstylesheet %}` | `{% stylesheet %}.card { border-radius: 1rem; }{% endstylesheet %}` | A section or block owns static CSS. Liquid is not rendered inside it. |
| `javascript` | `{% javascript %}…{% endjavascript %}` | `{% javascript %}console.log('section loaded');{% endjavascript %}` | A section or block owns static JavaScript. Liquid is not rendered inside it. |
| `doc` | `{% doc %}…{% enddoc %}` | `{% doc %}@param {product} product - Card resource.{% enddoc %}` | Documents a snippet or block’s public API for people and tooling. |
| `schema` | `{% schema %}…{% endschema %}` | `{% schema %}{ "name": "Promo" }{% endschema %}` | Declares a section or block schema using valid JSON only. |

`style` is different from `stylesheet`: the former can interpolate Liquid and lets the theme editor live-update referenced color settings; the latter is an asset block where Liquid syntax is invalid.[7] Keep structural CSS in `stylesheet` and use `style` only when a rendered setting truly determines the rule.

### Syntax and parser-control tags

| Tag | Signature | Canonical example | What it does |
|---|---|---|---|
| `comment` | `{% comment %}…{% endcomment %}` | `{% comment %}Temporary migration note{% endcomment %}` | Parses enclosed Liquid without executing or outputting it. |
| inline comment | `{% # comment %}` | `{% # Why the value is guarded %}` | Adds a one-line comment; every line of a multiline form needs `#`. |
| `liquid` | `{% liquid … %}` | `{% liquid assign label = product.title\necho label %}` | Holds one Liquid instruction per line without delimiters on each instruction. |
| `raw` | `{% raw %}…{% endraw %}` | `{% raw %}{{ product.title }}{% endraw %}` | Outputs Liquid-looking source as text. |

`comment` is not `raw`. A comment suppresses output and execution; `raw` prints the enclosed source exactly. Use `raw` in documentation, code samples, and client-side templates that must show Liquid delimiters.[8]

### Developer-preview tags — do not treat as stable

| Tag | Signature | Canonical example | Availability |
|---|---|---|---|
| `block` | `{% block 'name' %}…{% endblock %}` | `{% block 'container' %}<h1>{{ page_title }}</h1>{% endblock %}` | Liquid July ’26 developer preview only. |
| `partial` | `{% partial 'name' %}…{% endpartial %}` | `{% partial 'product-grid' %}…{% endpartial %}` | Liquid July ’26 developer preview only. |

`block` renders a reusable theme block directly from a Liquid template, while `partial` names a server-rendered region that JavaScript can fetch and replace without a full page load. Both require the **Liquid July ’26 changes** feature preview; existing JSON-template and section architectures remain supported alongside them.[9]

---

## Gotchas

- **Treating `include` as harmless legacy syntax.** It exposes a different variable model, and a snippet rendered with `render` cannot itself call `include`. Migrate deliberately rather than mixing the two styles.[5]
- **Using `limit` as a performance fix for large collections.** `for limit` reduces output, not necessarily the data fetched. Pair `paginate` with the matching loop limit when query size matters.[2]
- **Putting Liquid into `{% stylesheet %}` or `{% javascript %}`.** Those asset tags do not render Liquid. Put rendered CSS in `{% style %}`, and keep JavaScript data in markup or a deliberate JSON output.
- **Using `{% section %}` for a merchant-composable area.** A static section cannot be added, removed, or reordered like a JSON-template section. Use a JSON template or section group when composition is the requirement.
- **Inventing a generic cache tag.** Shopify theme Liquid exposes the tags in this appendix, not an arbitrary server-cache API. Solve performance through the documented data and rendering model, not copied framework syntax.
- **Shipping preview tags by accident.** `{% block %}` and `{% partial %}` belong behind an explicit developer-preview decision, never in a stable theme by assumption.[9]

---

## Checklist

- [ ] I can choose `render`, `content_for`, `section`, or `sections` based on who owns the composition.
- [ ] I can write a valid `form`, `paginate`, and `render` tag from memory.
- [ ] I know that `capture` returns text and that `increment` is not an assigned number.
- [ ] I recognise `include`, `currency` forms, and Liquid July ’26 tags as migration or preview concerns.
- [ ] I check the tag reference before adding a tag copied from a different Liquid environment.

## Related

- [Chapter 4 — Syntax Fundamentals](../../part-02-the-liquid-language-properly/ch-04-syntax-fundamentals/): delimiters, whitespace, comments, `liquid`, `raw`, and `doc`.
- [Chapter 7 — Control Flow](../../part-02-the-liquid-language-properly/ch-07-control-flow/): conditions and operator traps.
- [Chapter 8 — Iteration](../../part-02-the-liquid-language-properly/ch-08-iteration/): loop semantics, `forloop`, and cost.
- [Chapter 17 — Sections](../../part-03-theme-architecture/ch-17-sections/): section schema and static versus dynamic sections.
- [Chapter 20 — `content_for`](../../part-03-theme-architecture/ch-20-content-for/): block slots and ordering in depth.
- [Chapter 21 — Snippets](../../part-03-theme-architecture/ch-21-snippets/): `render` APIs and the `include` migration.
- [Appendix B — Complete Liquid Filter Reference](../appendix-b-complete-liquid-filter-reference/): every filter used by the examples.

## References

[1]: https://shopify.dev/docs/api/liquid "Shopify — Liquid reference"
[2]: https://shopify.dev/docs/api/liquid/tags/paginate "Shopify — Liquid tags: paginate"
[3]: https://shopify.dev/docs/api/liquid/tags/increment "Shopify — Liquid tags: increment"
[4]: https://shopify.dev/docs/api/liquid/tags/content_for "Shopify — Liquid tags: content_for"
[5]: https://shopify.dev/docs/api/liquid/tags/render "Shopify — Liquid tags: render"
[6]: https://shopify.dev/docs/api/liquid/tags/form "Shopify — Liquid tags: form"
[7]: https://shopify.dev/docs/api/liquid/tags/style "Shopify — Liquid tags: style"
[8]: https://shopify.dev/docs/api/liquid/tags/comment "Shopify — Liquid tags: comment"
[9]: https://shopify.dev/changelog/developer-preview-liquid-block-and-partial-tags "Shopify developer changelog — Liquid templates can now compose pages with blocks and partials"
