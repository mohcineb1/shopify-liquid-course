<!-- STATUS: final -->
---
id: ch-70
kind: exercise
title: "Repair the commerce-surface boundary"
---

# Exercise — Repair the commerce-surface boundary

You inherit the candidate theme files in `starter/`. The brief looks polished in a local browser, but its commerce surfaces make claims the theme does not own: it hides collection state in JavaScript, serializes all product variants, uses a product card as a form owner, treats a cart counter as authority, and makes a map/provider assumption. Your job is to produce an auditable **candidate** implementation. You are not configuring a store, app, customer account, collection filter, recommendation, metaobject definition, cart mutation, map, consent tool, or deployment.

The acceptance evidence for the exercise is static source review plus a no-JavaScript route walkthrough. Preserve the existing file paths, make the smallest coherent changes, and mark unknown platform/store/configuration facts with `> [VERIFY]` in `records/commerce-surface-contract.md`. Do not solve a missing assumption by inventing it.

## Starting point

`starter/sections/main-collection-product-grid.liquid` filters visible cards in the browser and discards URL state. `starter/sections/main-product.liquid` loops `product.variants`, puts an add-to-cart form inside the shared card, and gives the page no option control semantics. `starter/assets/commerce-surfaces.js` replaces an arbitrary cart fragment after a fake request and dispatches local cart state globally. `starter/sections/store-locator.liquid` inserts an unverified third-party map and places a size-guide body in a generic content field. The remaining template files intentionally do not give you a production implementation; they establish the candidate routes and component owners you must preserve.

## Your brief

### 1. Repair the home and collection contracts

Create `starter/sections/home-commerce-rail.liquid` as a bounded home composition surface. It must accept an explicit collection setting, render a visible empty state when no collection exists, call the existing `product-card` with named arguments, and use a section heading without assuming it is the page `h1`. Keep it within the established section/block model; do not turn it into an arbitrary catalog query.

Rewrite the collection section so its form submits `sort_by` through the URL and preserves a server-rendered product list inside `{% paginate collection.products by 24 %}`. Render `collection.sort_options`, defaulting selection to `collection.default_sort_by`, and keep pagination visible. You may describe real storefront filter configuration only as `[VERIFY]`; do not fabricate filter objects or browser-only predicates. Add a small section wrapper and an explicit owned replacement target for a future enhancement, but retain the full-page request path.

### 2. Repair the product contract

Make `main-product.liquid` the single product-form owner. Render an accessible option picker from `product.options_with_values`, with fieldsets, legends, labels, selected state, and unavailable state. Do not serialize `product | json` or loop every variant to construct an availability matrix; the verified platform record says `product.variants` is capped at 250. Keep an explicit candidate purchase selection/error branch and mark exact form/variant behavior `[VERIFY]` where the starter lacks enough context.

Add a `product-specs` snippet that accepts a named, explicit `specifications` input and only emits table semantics when it is present. Add a `guide-callout` snippet that accepts an explicit guide reference, has an empty/omitted state, and does not scrape a product description. Add a related-products placeholder that explains the recommendation intent/configuration as `[VERIFY]` instead of promising results.

### 3. Repair cart, search, content, and location boundaries

Refactor the JavaScript so `refreshOwnedSections(sectionIds)` uses `window.Shopify.routes.root`, only attempts to replace matching `[data-section-id]` fragments, tolerates a `null` section response, and reports a local error/status state. It must not dispatch a complete cart, customer, or checkout object. It also must not claim that it performs a cart mutation. Document the cart page as the durable fallback and bundled/cart section behavior as `[VERIFY]`.

Replace the map-first store locator with an accessible static location list and explicit location links. Refactor the size-guide presentation to use a typed candidate reference, then record the fields, storefront visibility, locale/market, consent/provider, account/search and release assumptions that still require verification. Keep search/account/blog routes as content/route contracts; do not implement authentication or customer retrieval.

## Deliverables

| Path | Required evidence |
| --- | --- |
| `starter/sections/home-commerce-rail.liquid` | Explicit collection setting, named card rendering and empty state |
| `starter/sections/main-collection-product-grid.liquid` | URL sort, server rendering, pagination and owned target |
| `starter/sections/main-product.liquid` | Gallery/form/option/spec/guide/recommendation boundaries |
| `starter/snippets/product-specs.liquid` and `guide-callout.liquid` | Explicit typed inputs and empty-state behavior |
| `starter/sections/store-locator.liquid` | Semantic static list, no assumed provider |
| `starter/assets/commerce-surfaces.js` | Locale-aware, guarded fragment refresh and local error channel |
| `starter/records/commerce-surface-contract.md` | Authority, fallback, test and `[VERIFY]` decisions for all six scope items |

## Constraints and acceptance checks

Do not edit checkout, request customer/account data, create filters from rendered cards, use `{% include %}`, add external scripts, hard-code a locale root, or expose a fake data-provider credential. The full collection/page form and cart-page link must remain usable with JavaScript absent or a section response missing. The home rail, product, collection, cart/search/content, guide and locator components must each name their owner and fallback in the contract record.

This is where people get burned: a section refresh that returns HTTP 200 is not proof that every requested section rendered. Your code must treat a `null` fragment as an expected failure state, not inject the string `null` or silently declare the cart current.

## Self-review

- [ ] I can trace filter/sort/page state through a full URL request.
- [ ] I did not depend on the full `product.variants` array or duplicate the product form in a card.
- [ ] I left product/cart/search/account/provider/store facts unclaimed unless evidenced or marked `[VERIFY]`.
- [ ] I preserved an accessible full-page/static fallback for every enhancement.
- [ ] My contract record identifies authority, fallback, error path, test and release owner for all six topics.

## Related

Read [chapter 69](../ch-69-building-the-foundations/) for component/event boundaries, [chapter 54](../../part-10-advanced-liquid/ch-54-ajax-api-and-cart-interactions/) for earlier Ajax concepts, and [chapter 64](../../part-12-production-operations/ch-64-structured-content-and-editorial-data/) for structured-content governance. The worked answer belongs only in the `solutions/` mirror.
