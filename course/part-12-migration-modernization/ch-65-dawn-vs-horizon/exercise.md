<!-- STATUS: final -->
# Chapter 65 — Exercise

**Time:** 90 minutes · **Type:** architecture comparison and compatibility decision

## Goal

Audit a proposed port from a familiar Dawn-like theme to a selected Horizon-family candidate without assuming that identical buyer output means identical integration behavior. You will compare files and ownership, decide which content should remain local versus become a Theme Block, identify custom-element/Shadow DOM risks, replace unsupported DOM/CSS/app assumptions with a governed compatibility ledger, and issue an evidence-led base-theme recommendation.

## Context

Northstar Outdoors has a Dawn-derived product page whose script finds `.product-form__input` globally, rewrites a price node after each click, and attaches a `MutationObserver` to a product container. A global stylesheet uses `!important` against variant controls. A reviews app expects a class-based host. The content team wants reusable editorial tiles on product and landing pages. A new Horizon candidate allegedly uses custom elements and Shadow DOM for “the new variant picker,” but its precise version, repository, components, shadow-root mode, public events/parts/slots, app host, browser behavior, candidate output, performance, editor behavior, source/support status, client requirements, and migration scope are unknown.

Work locally. Do not install/replace a theme, inspect or pierce a component’s private DOM, modify an app, publish CSS/JavaScript, move merchant content, contact a vendor, or make a vendor/browser/compatibility claim. Mark all exact candidate, theme version, component, Shadow DOM, app, selector, event, CSS, editor, client, performance, accessibility, owner, release, and rollback facts `[VERIFY]`.

## Requirements

- [ ] 1. Write `architecture-comparison.md` comparing the supplied Dawn-like and prospective Theme Block-capable architecture file by file: templates, sections, blocks, snippets, assets, config, merchant state, app hosts, public contract, route fixtures, and unknowns. Separate documented capability from candidate-specific fact.
- [ ] 2. Write `composition-decision.md` that retains product-local form/variant content where parent context matters and proposes one independent editorial tile Theme Block. Define data, semantic, style, preset, parent/child, editor, dynamic-source/app, test, and removal contracts; all exact availability remains `[VERIFY]`.
- [ ] 3. Create a `component-boundary.md` for the supposed variant-picker component: public API/events/slots/parts, server fallback, lifecycle, focus/error/live-state behavior, browser support, shadow mode, test fixture, owner, and escalation path are `[VERIFY]`. Explicitly reject selector scraping or mutation of private internals.
- [ ] 4. Create `compatibility-ledger.md` for the legacy script, observer, CSS override, reviews app host, analytics/test selectors, and merchant custom CSS. Assign each a supported-contract, owned-refactor, candidate-only shim, approved retirement, or blocker path with evidence, test, owner, release gate, rollback, and expiry for any shim.
- [ ] 5. Correct the starter by replacing global Dawn selectors/automatic DOM rewrites with an owned event boundary placeholder; scope CSS to an owned editorial component; and create an editor-ready Theme Block parent that uses only the Theme Block model. Do not implement an actual Horizon component integration or shadow-root access.
- [ ] 6. Write `base-theme-selection.md` that compares both candidates against client editorial needs, buyer journeys, apps, customization constraints, accessibility, performance, update/support ownership, team skills, budget/timeline `[VERIFY]`, acceptance gates, and reversal path. Make a conditional recommendation, not an unqualified winner.
- [ ] 7. Create `candidate-validation-matrix.md` covering product form/variant behavior, component upgrade/failure, keyboard/focus/errors, no-JS, app host/fallback, CSS/custom CSS, editorial block add/reorder/duplicate/empty state, route/localization, performance, update diff, release, and rollback using sanitized fixtures.
- [ ] 8. Ship real starter files under `sections/`, `blocks/`, `assets/`, and `notes/`. Do not use live customer data, credentials, vendor requests, or production theme/app state.

## Constraints

- A Theme Block cannot use a variable created outside its own block boundary as though it were a snippet parameter.
- A section chooses local section blocks or the Theme Block model; do not retain local blocks while adding `@theme` and `content_for` to the same parent.
- A custom element/Shadow DOM boundary is an inventory/test requirement, not permission to query private descendants or force styles into it.
- A compatibility shim needs an owner, expiry/review date, fixture, release gate, and removal test.
- No architecture is “better” without client-specific candidate evidence.

## Starter

```text
starter/sections/product-main.liquid          Dawn-like local product markup and legacy event hook
starter/sections/editorial-grid.liquid         incompatible local blocks plus content_for
starter/blocks/editorial-tile.liquid           Theme Block with hidden outer-variable dependency
starter/assets/product-port.js                 global selectors, DOM rewrites and observer
starter/assets/product-port.css                global important override against variant controls
starter/notes/app-and-component-notes.md       unsupported app/component assumptions
starter/notes/client-brief.md                  incomplete client needs and base-theme claim
```

## Done when

| Concern | Evidence |
| --- | --- |
| Comparison | Files, ownership, documented capability, candidate unknowns and fixtures are distinct |
| Composition | Local product dependency remains bounded; reusable editorial content has independent Theme Block contract |
| Component | Public boundary, fallback, accessibility/lifecycle tests, and escalation replace private DOM access |
| Compatibility | Every script/CSS/app/test/custom-CSS coupling has adaptation path, owner, release/rollback evidence |
| Selection | Conditional base-theme recommendation connects client needs to candidate results and reversal path |

## Stretch

Define a one-release compatibility-shim policy. Specify admission criteria, security/accessibility/performance review `[VERIFY]`, documentation, instrumentation without visitor data, expiry, upstream issue/owner, deletion proof, and fallback if the selected component has no supported public extension point. Do not add a shim.
