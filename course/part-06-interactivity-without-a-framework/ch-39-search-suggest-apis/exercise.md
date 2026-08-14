<!-- STATUS: final -->
# Chapter 39 — Exercise

## Goal
Refactor a visually attractive but inaccessible client-templated autocomplete into a **server-rendered, locale-aware predictive search** component with deliberate resource scope, debounced/current requests, native search fallback, and a complete combobox/listbox keyboard contract.

## Context
Atelier North’s header search submits a useful full search form without JavaScript. An enhancement was added later: every input event requests `/search/suggest.json`, injects product titles with `innerHTML`, and opens a `<div>` that looks like a menu. It hard-codes the route, does not ask for collections or query refinements, renders product body HTML into the dropdown, retains results after input is cleared, and has no keyboard behavior. On a slow connection, an older “co” response often overwrites newer “coat” results. A shopper cannot escape it, arrow through options, or distinguish a 429/unsupported-locale failure from no results.

Preserve full search submission. Enhance with a server-rendered `predictive-search` section so Liquid owns grouped resources, escaping, translated labels, images, URLs, and empty results. JavaScript should own only input state, debouncing, locale-aware request construction, current-response protection, safe slot replacement, open/close behavior, and accessible keyboard interaction. Write a small response and state contract before coding.

Plan **60–75 minutes**. Test JavaScript disabled, empty input, short/long queries, product/collection/query results, result-free query, rapid typing, slow network, 422/417/429 behavior if observable, locale-prefixed routes, Tab/Escape/Up/Down/Enter, pointer activation, and a full ordinary form submit.

## Requirements

- [ ] Keep a localized native form using `routes.search_url`, `q`, a visible submit path, and any deliberate full-search options; do not require predictive search for search to work.
- [ ] Request a documented, intentional resource scope and limit; explain product, collection, and query suggestion roles and why returned resource URLs are used unchanged.
- [ ] Render all suggestions through `predictive_search` in a Liquid section requested by `section_id`; do not recreate product/body/translation markup in a browser template or output resource body content.
- [ ] Build a suggestion lifecycle: idle, pending, current open/empty, unavailable/error, and committed navigation. Empty input cancels/closes and removes active selection.
- [ ] Debounce input and implement both cancellation and current-request/version protection. A stale response cannot replace the latest input’s results or loading state.
- [ ] Implement combobox/listbox behavior: accurate expanded/controls/autocomplete semantics, active descendant, selectable server-rendered options, Down/Up, Enter, Escape, Tab, and pointer paths. Keep typing focus in input.
- [ ] Handle response/root/HTTP failure without clearing the native form. Treat throttle/unsupported-locale states as prediction recovery, not a failed search page.
- [ ] Record locale URL, resource parameters, section ID/root, errors, state transitions, request/abort counts, keyboard observations, and no-JS/full-search evidence in `notes.md`.

> [VERIFY] Confirm target-store predictive-search feature availability, buyer locale support, Search & Discovery settings, actual resource/variant URLs, response section ID/root, parameter errors, and throttling behavior before release.

## Constraints

Do not hard-code `/search`, inject raw JSON/resource HTML, render `body` in a multilingual store, request empty terms, immediately retry 429, or trap Tab. Do not use an external search service or framework. Do not treat a result heading as a keyboard-selectable option. Keep all work in the listed starter paths.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/main-search.liquid` | Native form with a decorative but semantically incomplete suggestion slot. |
| `starter/sections/predictive-search.liquid` | Product-only/incomplete section without a stable option model. |
| `starter/assets/predictive-search.js` | Unsafe JSON injection and unordered request behavior. |
| `starter/assets/predictive-search.css` | Finished suggestion/pending/active presentation styles. |
| `starter/notes.md` | Resource, response, state, keyboard, failure, and fallback evidence. |

## Done when

Search submits normally without JavaScript. With enhancement, only a current valid server-rendered response can open results; keyboard and pointer users can reach/activate suggestions or retain native submission; empty/failure/throttle/unsupported states recover without trapping the buyer; and the recorded resource/render/accessibility contract matches the development store.

## Stretch

Design a query-suggestion group that remains useful only in a buyer locale where that resource is supported. Explain how the Liquid section can omit unavailable groups while the combobox option model remains correct. Do not implement it.
