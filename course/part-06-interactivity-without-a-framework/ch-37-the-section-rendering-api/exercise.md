<!-- STATUS: final -->
# Chapter 37 — Exercise

## Goal
Turn a full-navigation collection filtering experience into a **progressively enhanced, race-safe Section Rendering API update** that keeps the URL authoritative, replaces validated server-rendered roots, preserves the native fallback, and avoids unnecessary work.

## Context
Atelier North’s collection page has a normal filter form, product grid, result count, and pagination. It works without JavaScript. A recent enhancement intercepts every filter change, fetches a hard-coded `/collections/all` URL, inserts the returned response with `innerHTML`, and starts a new request on every input without cancellation. On a market-prefixed route it resets locale context; fast changes regularly leave facets showing “Size M” while the grid shows the earlier “Color red” response. A failed render clears the grid, browser Back has unreliable state, and the cart count is fetched separately during every filter update even though the cart did not change.

Keep full navigation as the functional baseline. Enhance only a verified collection page by requesting the exact target collection URL plus the minimal coordinated section IDs. Treat filters, grid, result count, and pagination as a partial-update transaction; treat cart updates as a separate concern. The user should see either a complete newer collection state or the previous coherent state with a usable recovery path—never a mixed state.

Plan **60–75 minutes**. Test with JavaScript disabled, changing two filters quickly, browser Back/Forward, pagination, locale/market-prefixed routes, a null/missing section response, slow network, screen-reader/keyboard navigation, and a failure/retry path. Record real section instance IDs from the development theme rather than assuming a file name.

## Requirements

- [ ] Preserve ordinary filter-form and pagination-link navigation when JavaScript is unavailable or enhancement fails.
- [ ] Build the request URL from the submitted form/pagination destination, retain its query state, use a locale-aware base, and request no more than the necessary coordinated sections via `sections`.
- [ ] Define a section-response contract in `notes.md`: requested IDs, expected wrapper IDs, response type, null handling, replacement order, focus/history behavior, and recovery route.
- [ ] Parse the JSON response, validate that every required section HTML value and matching root exists, then commit a coherent grid/facets/count/pagination update. Do not clear valid old content before validation completes.
- [ ] Implement both `AbortController` cancellation and a request-version guard so a stale response cannot change current UI or loading state.
- [ ] Update browser history only after a successful current response, and define a `popstate` strategy that restores URL-consistent collection state.
- [ ] Keep cart rendering out of this filter transaction; explain when bundled cart section rendering belongs instead.
- [ ] Document request count, response bytes, sections requested, cancellation/stale behavior, and loading/error accessibility evidence in `notes.md`.

> [VERIFY] Confirm the target theme’s exact dynamic section IDs, wrapper contract, published-theme response behavior, locale root, selected filter form URL, and whether a requested section can return `null` under the store’s configuration.

## Constraints

Do not query section types when instance IDs are required. Do not use `section_id` if your update needs multiple coordinated regions. Do not hard-code `/collections/all`, overwrite the current URL before successful commit, or silently accept HTTP 200 with a null section. Do not turn a cart-count refresh into a side effect of collection filters. Do not add a framework or asynchronous cart mutation in this exercise.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/facets.liquid` | Filter form and results controls with native action/link baseline. |
| `starter/sections/main-collection-product-grid.liquid` | Grid/count/pagination wrapper with replaceable roots. |
| `starter/assets/collection-sections.js` | Unsafe hard-coded, unordered update attempt. |
| `starter/assets/collection-sections.css` | Finished pending/status/error presentation styles. |
| `starter/notes.md` | Response contract, race, history, cost, and accessibility evidence. |

## Done when

A normal collection request remains usable without JavaScript. With enhancement enabled, each successful current interaction commits matching server-rendered facets/grid/count/pagination for the target URL, Back/Forward has a defined URL-consistent recovery, stale responses cannot win, a null/error response leaves existing UI intact, and cart display is not unnecessarily fetched.

## Stretch

Design an append-pagination variant that retains keyboard orientation, avoids duplicate products, reports newly loaded content, and can fall back to the original page link. Explain why it needs a different DOM/history contract from complete section replacement. Do not implement it.
