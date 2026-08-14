<!-- STATUS: final -->
---
id: ch-29
title: "Collections, Filtering & Pagination"
part: 4
---

# Chapter 29 — Collections, Filtering & Pagination

A collection page is a server-owned query result, not a fixed array that the theme can freely sort, filter, or expand. Shopify determines the collection’s applicable filters, sort options, current query parameters, matching product context, and pagination window. When a theme reconstructs that logic from tags or an in-memory product list, it becomes slow, loses deep links, and fails on catalog scale. Render the result Shopify gives you, generate URLs from filter objects, and make every progressive enhancement preserve the ordinary navigable page.

## What you’ll be able to do

- Separate collection defaults, request sorting, and the available sort contract.
- Render filter objects and their URLs rather than constructing filter syntax by hand.
- Handle list, boolean, price-range, and swatch facets as distinct UI/data shapes.
- Build links-first filtering that can be enhanced without losing navigation.
- Choose a page size consciously, respect pagination and `all_products` caps, and manage facet render cost.

## 29.1 The `collection` object, sorting, `sort_by`, `default_sort_by`

`collection` contains page-owned content and query state: title, description, image, handle, URL, products, product counts, filters, tags, sort options, template suffix, metafields, and collection navigation context. `collection.all_products_count` counts the unfiltered collection; `collection.products_count` counts products in the current view. Use the latter when explaining the filtered result, because a count that ignores the active query is misleading. [1]

The merchant owns `default_sort_by` in the collection admin. The request owns `sort_by`: it reflects the `sort_by` URL parameter and is `nil` when the parameter is absent. Resolve the UI’s selected value with `collection.sort_by | default: collection.default_sort_by`. Render the actual `collection.sort_options` available to this collection instead of copying a familiar list of sort strings; options can include context-specific choices such as relevance. [1]

```liquid
{% assign active_sort = collection.sort_by | default: collection.default_sort_by %}
<form method="get">
  <label for="SortBy">Sort products</label>
  <select id="SortBy" name="sort_by" onchange="this.form.submit()">
    {% for option in collection.sort_options %}
      <option value="{{ option.value }}" {% if option.value == active_sort %}selected{% endif %}>{{ option.name | escape }}</option>
    {% endfor %}
  </select>
  <noscript><button type="submit">Apply</button></noscript>
</form>
```

A sort form must preserve active filter parameters. A plain GET form that only submits `sort_by` can erase a customer’s facets. The exact preservation mechanism depends on the form and current theme URL strategy; test the resulting URL in a collection with several applied values. The collection response should remain the source of product order, counts, and product URLs.

> [VERIFY] Confirm all sort options your current collection context exposes before presenting names or promises in a custom UI. `sort_options` is the allowed surface; hard-coded arrays age badly.

## 29.2 Storefront filtering: the `filter`, `filter_value`, `filter_value_display` objects

Storefront filtering is Shopify’s recommended filtering method for collections and search. Merchants configure the filters; Liquid receives only filters relevant to the current collection. Filters are applied with AND logic across filters and OR logic among values of the same filter. Applied values appear in the URL, which makes results shareable and allows back/forward navigation to retain query state. [2]

A `filter` describes a facet: label, type, active values, values, and URL behaviors. A `filter_value` describes a selectable result: label, count, active state, URL to activate or remove it, and display information. A `filter_value_display` conveys presentation data such as a swatch. These objects are important because they do not ask the theme to reverse-engineer filter parameter names, escaping rules, pagination reset, or combined selected values.

```liquid
{% for filter in collection.filters %}
  <section>
    <h2>{{ filter.label | escape }}</h2>
    <ul>
      {% for value in filter.values %}
        <li>
          <a href="{{ value.url_to_add }}" {% if value.active %}aria-current="true"{% endif %}>
            {{ value.label | escape }} ({{ value.count }})
          </a>
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
```

A filter URL is an API output. It knows whether to add, remove, or clear a value and removes pagination parameters when appropriate. Treat it as a complete navigation destination. A theme may improve the interaction with a form or section request, but it should retain these URLs for no-script navigation, copy/paste, and recovery from client failures.

## 29.3 Price-range filters, boolean filters, list filters, swatch filters

Filter type determines control shape. A list filter offers discrete `filter_value` entries; it can be rendered as checkboxes within a GET form or plain links. A boolean filter has two semantic values and benefits from a label that says what true/false means rather than showing raw tokens. A price range has minimum and maximum fields with URL parameter names supplied by the filter object; do not create a slider that guesses the current shop currency or URL syntax. [2]

A swatch filter still needs text. `filter_value_display` can provide a swatch representation, but color alone cannot identify a value, communicate selection, or remain usable in high contrast. Keep the filter value label in the accessible name, expose active and unavailable states, and have a text fallback when a swatch display is absent. The data representation is a decoration of the filter value, not its identity.

```liquid
{% if filter.type == 'price_range' %}
  <label>Minimum <input name="{{ filter.min_value.param_name }}" value="{{ filter.min_value.value }}"></label>
  <label>Maximum <input name="{{ filter.max_value.param_name }}" value="{{ filter.max_value.value }}"></label>
{% elsif filter.type == 'boolean' or filter.type == 'list' %}
  {% for value in filter.values %}
    <label><input type="checkbox" {% if value.active %}checked{% endif %}> {{ value.label | escape }} ({{ value.count }})</label>
  {% endfor %}
{% endif %}
```

> [VERIFY] Verify the current `filter.type` values and the precise properties exposed for price range, boolean, list, and swatch display objects before branching on them. Their shape is a storefront filtering contract, not a general Liquid convention.

## 29.4 Building filter UI that degrades to plain links

The baseline filter UI is navigation: filter value URLs are anchors, active chips use `url_to_remove`, and a clear-all link uses the filter/collection URL supplied by Shopify. It works without JavaScript, preserves URL state, and leaves the server responsible for product matching. A refinement can intercept the anchor, request an updated section, swap product grid and facets, then update history only after a successful response. The original `href` remains the error recovery and assistive-technology destination.

The wrong pattern is a set of visual toggles with no href or form action, backed by JavaScript that constructs `filter.v.option.color` strings. It fails for spaces, metafields, option scopes, price constraints, multiple selected values, locales, and future filter types. It also has no useful behavior when script fails.

```liquid
<!-- Incorrect: the theme assumes URL syntax and loses existing state. -->
<a href="?filter.v.option.color={{ value.label | handleize }}">{{ value.label }}</a>

<!-- Correct: Shopify supplies a complete transition URL. -->
<a href="{{ value.url_to_add }}">{{ value.label | escape }}</a>
```

When enhancing links, scope `aria-busy` to the grid/facets that change, preserve or deliberately move focus, and announce a result-count change. Abort an older fetch if a later filter action wins. Do not trap keyboard users in an updated drawer or silently discard an applied selection after the grid replacement. Detailed request and DOM lifecycle patterns appear in `ch-37-client-side-javascript` and `ch-38-ajax-api`.

## 29.5 `{% paginate %}`, the `paginate` object, page sizes, and limits

Liquid `for` loops are limited to 50 iterations per page. `{% paginate collection.products by page_size %}` establishes a page window and provides the `paginate` object or `default_pagination` filter for navigation. A page size is between 1 and 250, while pagination can reach the 25,000th item and no further; beyond that, filter the array before paginating. [3]

```liquid
{% paginate collection.products by 24 %}
  <p>{{ collection.products_count }} products</p>
  <ul>
    {% for product in collection.products %}
      <li>{% render 'product-card', product: product %}</li>
    {% endfor %}
  </ul>
  {% if paginate.pages > 1 %}
    {{ paginate | default_pagination }}
  {% endif %}
{% endpaginate %}
```

Choose page size from the cost of product cards, media, metafields, filters, and expected viewport—not from an arbitrary “load everything” instinct. `for limit` limits iteration but does not reduce the default data fetch in the same way. Shopify documents that wrapping a matching `limit` within `paginate` can reduce the data queried; include both when deliberately rendering fewer than the paginate size. [3]

Pagination links are part of the query state. Filtering generally resets a page because page N of an old result set may not exist in the new one. Do not manufacture page parameters in filter code; use the URLs produced by filters and paginate.

## 29.6 The `all_products` object and its hard cap

`all_products` is a handle lookup, useful for a small, known set of products: `all_products['love-potion']`. It returns a product when found and `empty` otherwise. It has a hard cap of **20 unique handles per page**. For more products, Shopify directs themes to use a collection. [4]

This cap makes `all_products` unsuitable for a related-products engine, catalog grid, search implementation, or arbitrary merchant list. A small curated content block can use it with a presence guard; a merchant-configured product-list setting or collection is usually a better data model when cardinality grows. Do not hide the cap behind a helper that silently returns fewer cards than the configuration requests.

## 29.7 Facet performance and render cost

Facets are query results, not free decorations. `collection.filters` is empty for collections with more than 5,000 products. Shopify also limits a storefront to 25 filters, while merchants can face filters with many values; a filter has a maximum of 100 displayed values. These constraints should influence the design: tolerate no filters, avoid assuming every intended facet is returned, and make long lists searchable or progressively disclosed without rendering an enormous custom control. [1] [2]

A collection card can pull product images, price, vendor, variant contexts, metafields, and snippets. Multiply that by page size and then add every filter value, active chip, count, and swatch. Measure server render time and transferred markup in the largest applicable collection, not merely the demo catalog. Use `paginate` to limit query size, avoid re-rendering components unrelated to a filter transition, and do not repeatedly compute the same card data in nested loops.

Performance is also interaction correctness. Slow filtering needs an observable pending state and response ordering; no-filter collections must still show products; empty results need a clear state with a way to remove applied filters. A fast-looking client shell that returns mismatched count, URL, or product state is worse than a plain full-page link.

## Gotchas

- You show `all_products_count` as the number after filters instead of `products_count`.
- You hard-code sort values or filter parameter strings instead of consuming current objects and URLs.
- You use color alone for swatch facets or hide the selected state from assistive technology.
- You paginate with an oversized page because cards look cheap in a small test catalog.
- You use `all_products` as a product-list API and pass its 20-handle cap silently.
- You assume `collection.filters` always exists, even though it is empty above the documented collection threshold.

## Checklist

- [ ] Sort UI chooses from `sort_options` and resolves request sort versus merchant default.
- [ ] Filter links, active values, counts, price inputs, and swatches come from the appropriate filter objects.
- [ ] No-script navigation preserves URL-owned query state.
- [ ] Pagination constrains fetch and render cost, with a page size justified by card complexity.
- [ ] `all_products` is a guarded small lookup, while large catalog and facet work is collection-owned.

## Related

- `ch-27-products` — product cards, product URLs, and resource-level state.
- `ch-28-variants` — filter-relevant variants and variant-aware collection results.
- `ch-32-content-pages-blogs-search` — search result filtering context.
- `ch-37-client-side-javascript` — focus, races, and progressive enhancement lifecycle.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/collection "Shopify — Liquid object: collection"
[2]: https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering "Shopify — Storefront filtering"
[3]: https://shopify.dev/docs/api/liquid/tags/paginate "Shopify — Liquid tag: paginate"
[4]: https://shopify.dev/docs/api/liquid/objects/all_products "Shopify — Liquid object: all_products"

## Query-state audit

Before shipping a collection surface, test a URL that combines two values from one list filter, a value from a second filter, a price boundary, a sort selection, and a later pagination page. Then change one filter, change sort, clear an active value, and navigate backward. The expected result is not simply a different grid: each action must preserve the parts of query state it does not own and allow Shopify’s URL contract to reset the parts that become invalid. This audit exposes the common bug where a sort form silently removes selected facets or a clear button returns to a page number beyond the filtered result.

Empty results deserve a first-class state. Keep the collection heading and an understandable result message, list the active values as removable links, and offer the collection’s unfiltered destination as recovery. Do not hide the facet controls merely because the grid is empty; doing so turns the state that caused the empty result into an unfixable dead end. A progressive request can refine this behavior, but the link-based route should remain correct without the client enhancement.

Facet cost is data-dependent. A low-cardinality boolean can be expanded safely, while a tag or metafield filter can have a long value list. Define a display budget, offer disclosure/search where appropriate, and never derive an extra client-side facet universe by scanning the products shown on only one pagination page. Shopify’s returned filter values remain the canonical current query surface.
