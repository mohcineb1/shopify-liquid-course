<!-- STATUS: final -->
# Chapter 32 — Exercise

## Goal
Refactor Atelier North’s editorial and search surfaces into a type-aware, accessible system that preserves merchant rich content, uses server-owned archive/search state, and keeps predictive suggestions as an enhancement rather than a replacement for full search.

## Context
The current theme uses one generic “content card” for products, articles, and pages. It escapes every body field—so article formatting and rich-text callouts disappear—then injects a metafield’s raw value into a JavaScript string to recover formatting in the browser. The blog “filters” only hide cards already rendered on the first page, while its tag URLs are built by guessing parameter syntax. The search template assumes every result has a product price/image and announces “no results” before a query exists. A predictive-search snippet appears in the header but expects `predictive_search` to be populated in a normal page render.

You will restore the content boundaries. Articles, pages, products, and comments need appropriate fields and semantic output. Rich text should use its supported metafield renderer. Editorial tags and full search must have navigable server routes. Predictive results must be scoped to the documented section/API context, grouped by resource type, and give every user a route to complete search results.

Plan **55–70 minutes**. Test an article with an excerpt and one without, a rich text metafield and a blank field, a tag with punctuation, an unperformed search, zero results, article/page/product results, and a predictive response containing more than one resource type. If the development theme does not implement the API/section request, record that limitation rather than faking `predictive_search` data.

## Requirements

- [ ] Render article title, byline/date, excerpt-or-content, optional image, tags, and comment state from their relevant objects. Do not show a comment form/message when comments are disabled.
- [ ] Render a rich text metafield with a type-aware path such as `metafield_tag`. Guard blank fields and never use raw rich/merchant data as a JavaScript string or external HTML insertion shortcut.
- [ ] Replace client-only blog tag filtering with navigable archive/tag links and a paginated content index. Empty archive state must retain a route back to the blog.
- [ ] Build a full search template with separate unperformed, empty-result, and results states. Shape cards based on `object_type`; only product results may use product fields.
- [ ] Preserve the submitted search terms safely, paginate full results, and do not assume filter controls are returned for every result set.
- [ ] Render predictive groups only when `predictive_search.performed` is true in the appropriate section/API request context. Group resources by type and retain a full-search route.
- [ ] Record content/type tests, archive URL behavior, full-search states, predictive-context status, and safe rich-text output decisions in `notes.md`.

> [VERIFY] Confirm the current blog tag route shape, article comment form workflow, supported metafield types, Predictive Search API request/section integration, and localization behavior before release.

## Constraints

Do not use `innerHTML` or an equivalent raw browser injection path for merchant/external content. Do not escape a Shopify-rich body field just to reuse a text-card component. Do not construct a client archive from the cards on one page. Do not use product-only fields without checking result type. Do not treat predictive search as a global Liquid object or its results as comprehensive search.

Keep all work in the starter paths. The purpose is an honest view of server content/query state; client behavior may enhance it later but cannot replace accessible article, archive, or full-search navigation.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/article-content.liquid` | Article surface that erases rich formatting and always displays comments. |
| `starter/templates/search.liquid` | Search surface that assumes product results and confuses unperformed/empty states. |
| `starter/snippets/blog-tags.liquid` | Client-only tag controls built from cards rather than archive state. |
| `starter/snippets/predictive-results.liquid` | Header snippet that expects predictive data outside its API/section context. |
| `starter/assets/content-search.css` | Finished structural styles for content cards and result groups. |
| `starter/notes.md` | Content, archive, full-search, and predictive-context verification. |

The starter files render components, but they do not honor their object context. You must choose the appropriate output contract for each content type and distinguish compact suggestions from a complete search result.

## Done when

Article formatting and type-aware metafield output remain intact without unsafe browser injection. Archive links navigate server content instead of filtering a local subset. Search result cards match the returned object type, and all search states are distinguishable. Predictive content appears only in its valid request context, is grouped clearly, and points to a full-search recovery route.

## Stretch

Add progressive full-search enhancement that requests a scoped section, cancels stale searches, retains keyboard focus, and updates history only after successful replacement. Explain how it preserves native form submission and the complete full-search route. The solution does not implement this extension.
