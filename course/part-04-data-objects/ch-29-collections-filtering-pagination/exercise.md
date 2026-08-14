<!-- STATUS: final -->
# Chapter 29 — Exercise

## Goal
Refactor Atelier North’s catalog page into a collection-owned query interface whose sorting, filtering, pagination, counts, and recovery links remain correct with or without JavaScript.

## Context
The existing catalog template was built around a small launch collection. It hardcodes sort values, derives color filters from product tags, builds URLs by concatenating strings, shows the unfiltered product total after facets are applied, and loops through every collection product before visually limiting the grid. It also includes a “related products” panel that looks up an arbitrary merchant list through `all_products`, with no warning when the lookup cap is exceeded.

The catalog is now large enough for real filtering and merchants configure facets in Search & Discovery. The theme must stop assuming which facets exist, which values they expose, whether a swatch has a color representation, or whether the filter API is available for every collection. The page must be useful before any async enhancement: a customer can sort, activate one or more values, remove an active value, submit a price range, paginate, and recover from an empty result by following actual links.

Plan **55–70 minutes**. Test a collection with at least one configured filter, two sort options, multiple pages, and a combination that yields no results. If the development store lacks a filter type, make its absence part of the test record rather than inserting mock values.

## Requirements

- [ ] Render the collection title and result count from the current collection query state. The number after filters must not be the unfiltered total.
- [ ] Render sort choices from `collection.sort_options` and resolve the selected value from the request sort or merchant default. Changing sort must not silently drop active facets.
- [ ] Render each available Shopify filter from `collection.filters`; list/boolean values need labels, counts, active state, and real transition URLs. Do not derive an alternate filter universe from product tags.
- [ ] Provide appropriate controls for list, boolean, price-range, and swatch-capable filters. A swatch cannot be its only accessible name, and a missing visual swatch must leave a usable text value.
- [ ] Make every filter transition navigable as a link or ordinary GET form. An optional enhancement may update the grid asynchronously, but each `href`/form action must remain valid when scripts fail.
- [ ] Use `{% paginate %}` around the product grid with a page size that you can justify from card cost. Render real pagination controls and maintain an empty-result state with removable facet links.
- [ ] Replace the `all_products` related-product loop with a collection or bounded merchant-owned source. Document the 20 unique-handle cap and the reason the new source has scalable cardinality.
- [ ] Record query-state tests: two facets, sorting while filtered, a price boundary, clear/remove behavior, a later page, empty results, a collection with no returned filters, and a long-value facet.

> [VERIFY] Confirm the exact filter-type properties, filter value display contract, current Section Rendering integration, configured merchant filters, and collection-size behavior for the target theme before shipping.

## Constraints

Do not hardcode `filter.*` URL parameters or sort names. Do not parse `request.path` to discover active filters. Do not add a JavaScript-only control without a native link/form fallback. Do not use the product array on the rendered page to build facets, counts, or availability choices. Do not put all products in a client-side state script, and do not use `all_products` as a collection substitute.

Use the starter paths. Preserve URL-owned query state and do not change the visual grid design merely to satisfy data requirements. Keep pagination scoped to the collection result and ensure an empty response still exposes a route to remove the state that caused it.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/collection-results.liquid` | Legacy grid with hardcoded sort/filter values and no query-safe pagination. |
| `starter/snippets/collection-facets.liquid` | Tag-derived “filters” with custom URL construction. |
| `starter/assets/collection-results.css` | Finished layout and state styles for the catalog shell. |
| `starter/notes.md` | Query-state, fallback, and render-cost evidence. |

These files deliberately render a catalog but do not define a correct collection query boundary. You choose the filter controls, state recovery, pagination budget, and scalable related-content source.

## Done when

Sorting and facet selection preserve Shopify-generated query state. A customer can use the catalog without JavaScript and land on URLs that reproduce the result. Price, list, boolean, and swatch-capable facets are rendered according to data shape and degrade to accessible text/link controls. Pagination constrains the result window, empty results have a recovery route, and the related-product source has a documented cardinality that does not depend on `all_products` beyond its cap.

## Stretch

Add a progressively enhanced filter drawer that fetches and swaps only the catalog section, preserves focus and announcements, cancels stale requests, and reconciles browser history. Describe which interactions must remain ordinary navigation. The solution does not provide this extension.
