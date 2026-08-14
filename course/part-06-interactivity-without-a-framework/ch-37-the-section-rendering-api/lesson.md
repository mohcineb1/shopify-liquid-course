<!-- STATUS: final -->
---
id: ch-37
title: "The Section Rendering API"
part: 6
---

# Chapter 37 — The Section Rendering API

A theme does not need a client framework to feel immediate, but a fast interaction still needs a correct source of truth. The Section Rendering API asks Shopify to render a small set of real theme sections in the correct URL/resource context, then lets the browser replace only the corresponding DOM region. That preserves Liquid, storefront filters, locale behavior, pricing rules, and merchant section settings. The hard part is not `fetch`; it is defining the response contract, preserving URL state, swapping safely, cancelling obsolete work, restoring behavior, and understanding what each re-render costs.

## What you’ll be able to do

- Choose `?sections=` or `?section_id=` and request server-rendered partials in the intended page context.
- Re-render filter/product lists, cart UI, and pagination without reproducing Shopify logic in JavaScript.
- Parse the two response shapes and replace DOM roots without invalid nested markup or lost behavior.
- Prevent stale responses from overwriting newer UI state.
- Budget server render, transfer, parse, swap, and reinitialization work.

## 37.1 `?sections=` and `?section_id=` — server-rendered partial updates

Use `?sections=` to request up to **five** sections by ID. Shopify returns a JSON object whose keys are section IDs and whose values are rendered HTML strings. Use `?section_id=` when one section’s direct HTML response is the right contract. Both render in the Liquid context of the requested URL: request a product URL for product data, a collection URL for collection/filter state, or the current page/root as appropriate. [1]

```js
const url = new URL(window.location.href);
url.searchParams.set('sections', 'main-collection-product-grid,facets');

const response = await fetch(url);
if (!response.ok) throw new Error(`Section request failed: ${response.status}`);
const sections = await response.json();
```

The URL is not an incidental transport detail. Shopify applies query parameters respected by full-page rendering—such as `q` or `page`—when it renders requested sections. A filter update should therefore derive from the filter form’s serialized URL/search parameters rather than constructing a second browser-only interpretation of active filters. Storefront filtering is URL state: filters combine with AND logic, multiple values within one filter combine with OR logic. [2]

The two response shapes are deliberately different:

| Request | Response | Best use |
| --- | --- | --- |
| `?sections=a,b` | JSON `{ "a": "<html>", "b": "<html>" }` | Coordinated grid/facets/count/cart surfaces. |
| `?section_id=a` | Direct HTML text | One isolated section. |

A section requested with `sections` can return `null` even on HTTP 200 when it cannot render, including a missing section in the published theme. A missing `section_id` returns 404. Handle both: HTTP success is not proof that every requested section is safe to swap. [1]

Section IDs can be read from `section.id` or the wrapper `id="shopify-section-[section-id]"`. JSON templates/section groups assign dynamic IDs; static section IDs correspond to the file name. Do not request a section *type* when the API needs the rendered instance ID.

> [VERIFY] Inspect IDs in the target published theme and test a request against the exact product/collection/cart URL. A preview/editor instance and published theme can differ in section composition.

## 37.2 Re-rendering filters, cart drawers, and pagination

Filtering and pagination are strong candidates because Shopify already owns result/query semantics. Start with ordinary links/forms that fully navigate without JavaScript. Enhancement intercepts a submitted filter form or pagination link, requests the same destination with the needed sections, replaces grid/facets/count, and updates browser URL/history only after a successful current response. The non-JavaScript page remains the recovery path.

```js
async function renderCollection(url) {
  const requestUrl = new URL(url, window.location.origin);
  requestUrl.searchParams.set('sections', 'main-collection-product-grid,facets');
  const payload = await fetch(requestUrl).then((response) => response.json());
  replaceSection('main-collection-product-grid', payload['main-collection-product-grid']);
  replaceSection('facets', payload.facets);
  history.pushState({}, '', new URL(url, window.location.origin));
}
```

A cart drawer also needs server-rendered truth after cart state changes. For cart mutations, Shopify recommends considering **bundled section rendering** with the Cart API rather than issuing unrelated cart mutation and section-render requests. That couples the cart change with returned rendered sections and reduces state gaps. This chapter focuses on generic section retrieval; request mechanics and cart mutation details continue in `ch-38-ajax-api`. [1]

Pagination is an ordinary destination URL with `page` preserved. You can replace the product grid and pagination controls, or use a deliberate append strategy, but never append a new response without a clear state model for duplicate products, focus, URL/history, loading announcement, and Back navigation. Infinite scroll is not free pagination; links remain a necessary accessible recovery and discovery mechanism.

Use locale-aware URL bases. Shopify documents `window.Shopify.routes.root` for root-relative localized requests and `window.location.pathname` for current-page context. Hard-coding `/collections/...` can lose a visitor’s chosen locale/market route. [1]

## 37.3 Response shape, parsing, and DOM swapping strategies

Treat response HTML as a server-rendered fragment with an explicit root contract. The simplest robust strategy is replacement of the complete existing section wrapper with the response’s equivalent wrapper. Find the old root using the real section ID, parse response into a detached document/template, find the same root, check both exist, then replace. Do not assign a partial inner fragment to a parent whose structural wrapper is part of the returned output.

```js
function replaceSection(sectionId, html) {
  if (html == null) throw new Error(`Section ${sectionId} did not render`);
  const current = document.getElementById(`shopify-section-${sectionId}`);
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const incoming = parsed.getElementById(`shopify-section-${sectionId}`);
  if (!current || !incoming) throw new Error(`Section root mismatch: ${sectionId}`);
  current.replaceWith(incoming);
}
```

`DOMParser` gives an inspectable document; a `<template>` can be useful when you control the fragment contract. Either way, do not inject request-derived strings into selectors, labels, or `innerHTML` outside the returned trusted same-store response boundary. A Section Rendering API response is server-rendered theme HTML, but it can still contain merchant content and changes document nodes, so preserve your theme’s output escaping/semantic rules.

Choose replacement granularity intentionally. Whole-section replacement is less fragile and includes new settings markup, but destroys descendant event listeners, focus, local open states, and embedded component instances. Narrow replacement preserves more local state but couples JavaScript to inner markup. A hybrid contract names each replaceable root with stable data attributes and provides an initializer/disposer boundary for behavior that is rebuilt.

After swapping, restore focus thoughtfully. Do not move focus for a silent cart count update; move it to an error/status/updated-results heading only when the action and user expectation justify it. Announce loading/results with an appropriate live region and preserve keyboard reachability of filter/pagination controls.

## 37.4 Race conditions, request cancellation, and stale responses

As soon as interactions overlap, response arrival order is not request order. A user can select color, then size, then navigate pagination while a slow first request returns last. Without a guard, the obsolete response replaces correct newer results. This is a state correctness bug, not merely a visual flicker.

Use `AbortController` to cancel an in-flight request when a newer state supersedes it, and use a monotonically increasing request token as the final stale-response guard. Abortion is an optimization; a response can complete near cancellation, so token comparison remains necessary.

```js
let activeController;
let requestVersion = 0;

async function updateSections(url) {
  activeController?.abort();
  activeController = new AbortController();
  const version = ++requestVersion;
  try {
    const response = await fetch(url, { signal: activeController.signal });
    const payload = await response.json();
    if (version !== requestVersion) return;
    replaceSection('main-collection-product-grid', payload['main-collection-product-grid']);
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
  }
}
```

Tie loading UI to the current version, not simply `finally`: an older request must not remove the loading state belonging to a newer request. Disable only controls whose concurrent behavior is genuinely invalid; do not make the whole page inert for every filter choice. On network/render failure, retain the last coherent DOM, clear only the current request’s pending state, expose a recovery message, and leave ordinary navigation/form submission available.

## 37.5 Cost model: what a section re-render actually costs you

A partial update does not make rendering free. Shopify still resolves the requested URL’s context and executes Liquid/rendering for each requested section; the browser transfers response bytes, parses HTML, allocates/replaces nodes, recalculates styles/layout, potentially loads new assets, then reinitializes behavior. Requesting five large sections on every input event can cost more than a full navigation while adding race/focus complexity.

Think in a pipeline:

| Stage | Cost/control |
| --- | --- |
| URL/context + server Liquid | Request only necessary section instances; avoid render-heavy duplicate surfaces. |
| Network transfer | Keep markup/payload focused; batch related sections but do not over-batch. |
| Parse and DOM replacement | Replace stable roots; avoid needless full-page or repeated nested swaps. |
| Browser layout/assets | Preserve dimensions/loading behavior; avoid injecting unnecessary media. |
| Reinitialization | Use idempotent initialization and disposal; avoid duplicate listeners. |
| Interaction concurrency | Debounce noisy input, cancel obsolete work, reject stale responses. |

Measure representative slow network/device flows. Start from full navigation, add one enhanced transition, and compare correctness, latency, accessibility, server work, and maintenance burden. A form submit button may need immediate rendering; a text search input may need debouncing. Debounce does not replace cancellation: it reduces request frequency, while cancellation/token checks preserve ordering when requests overlap.

## Gotchas

- Requesting a section type rather than its dynamic rendered instance ID.
- Treating HTTP 200 as success when a requested `sections` value is `null`.
- Forgetting that a product/collection section inherits the **requested URL’s** context.
- Replacing markup without disposing/reinitializing behavior or preserving justified focus/state.
- Letting an older response overwrite a newer filter/page choice.
- Hard-coding unlocalized paths and resetting market/language context.
- Rendering every possible section on every keystroke because it “avoids a page reload.”

## Checklist

- [ ] Full navigation/form behavior works before enhancement.
- [ ] Request URL, dynamic section IDs, query state, locale base, response shape, and null handling are explicit.
- [ ] DOM root replacement is validated before mutation and behavior/focus recovery is intentional.
- [ ] Abort/token logic protects the latest state; errors preserve coherent existing UI.
- [ ] Request scope, debounce, assets, reinitialization, and server/browser cost are measured.

## Related

- `ch-29-collections` — filter/pagination URL semantics and collection rendering.
- `ch-30-cart-line-items` — cart state/display boundary.
- `ch-38-ajax-api` — cart requests and response workflows.
- `ch-39-web-components` — durable component lifecycle around DOM replacement.

## References

[1]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
[2]: https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering "Shopify — Storefront filtering"
[3]: https://shopify.dev/docs/api/ajax/reference/cart "Shopify — Cart API reference"

## The partial-update transaction

A reliable partial update has a lifecycle: identify the intended URL state; declare the section IDs and DOM roots that represent it; start one current request; show a bounded pending state; validate HTTP and individual section values; parse all incoming roots before changing any DOM; commit the replacements as one coherent update; restore component behavior; update history/focus/announcements; then clear only the current request’s pending state. Thinking in this sequence avoids a common failure where facets update but the grid fails, history changes before rendering succeeds, or an obsolete response clears a newer spinner.

A useful contract object makes this explicit:

```js
const updateContract = {
  sections: ['facets', 'main-collection-product-grid'],
  roots: {
    facets: 'shopify-section-facets',
    'main-collection-product-grid': 'shopify-section-main-collection-product-grid'
  },
  url: new URL(window.location.href)
};
```

Build a complete next DOM map before committing. If one requested section is `null`, its root is absent, or parsing fails, retain the previous coherent interface and provide a retry/full-navigation route instead of creating a half-new state. For coordinated interfaces, an all-or-nothing swap is usually easier to reason about than silently replacing whichever responses happened to parse.

Interactions also need history semantics. A successful filter or pagination transition should update `history.pushState` with the normalized target URL. Listen for `popstate` and re-render or allow navigation according to the same URL state, so Back/Forward do not show a grid that disagrees with address-bar filters. Do not push history for a transient loading state or cart count update that has no navigation meaning.

## Measuring before scaling

Instrument what users experience: time from input to current section commit, number of requests started/aborted/stale, response byte size, null/error count, long tasks during parse/swap, and server/render timing where available. Use browser performance marks around fetch and commit, then compare a normal navigation against an enhanced interaction on low-end devices and slow networks. A partial update is a product of five systems—server Liquid, network, HTML parsing, DOM layout, and component lifecycle—not a universal performance guarantee.

When measurement shows repeated work, reduce request scope first. Avoid requesting a header, drawer, count, grid, and filters when only the grid changed. Cache only with a clear URL/locale/customer/cart invalidation model; a wrong cached cart or filter state is worse than a short render delay. Prefer native navigation for rare or high-risk paths, and reserve Section Rendering API complexity for interactions where the improved continuity survives correctness, accessibility, and cost review.
