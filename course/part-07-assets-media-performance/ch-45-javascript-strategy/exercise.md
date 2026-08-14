<!-- STATUS: final -->
# Chapter 45 — Exercise

**Time:** 50–65 minutes · **Type:** JavaScript delivery refactor

## Goal

Replace a parser-blocking global product-helper script with a progressively enhanced module boundary that reads narrowly serialized Liquid data, preserves the native form, and records third-party/build delivery ownership.

## Context

A product page loads `theme.js` synchronously in its head. The file queries every product form, reads a manually concatenated JavaScript object from a setting, and exposes `window.ProductHelper`. A reviews vendor loader is copied into the same section even where no reviews block appears. The bundle is built locally from `src/`, but nobody can identify final `assets/` output or prove development reload synced it.

The only required enhancement is a local selected-variant status when an existing native variant input changes. The form must still choose and submit a variant when JavaScript is unavailable. Refactor delivery and data ownership, not checkout behavior or remote review integration.

## Requirements

- [ ] 1. Replace the blocking include with an appropriate deferred or module load. Explain why it is ordered or independent.
- [ ] 2. Keep a small global bootstrap only with a documented route-wide responsibility; move product status behavior into a component-owned module.
- [ ] 3. Pass only status data using a `data-*` value or nearby `application/json` node rendered with `| json`. Never concatenate merchant content into executable JavaScript.
- [ ] 4. Bind from a product-form root, avoid global mutable state, and make the initializer safe for two forms.
- [ ] 5. Preserve native form and variant inputs so selection/submission work when the module fails.
- [ ] 6. Write `tag-inventory.md` documenting the reviews script’s owner, route trigger, consent condition, loading behavior, and removal test. Do not load it from the product section.
- [ ] 7. Write `build-contract.md` mapping source entry to a final `assets/` file, source-map policy, and separate bundler/CLI watch checks.
- [ ] 8. Record cold-load, module-failure, two-root, editor-replacement, vendor-block, and final-asset-sync tests in `notes.md`.

## Constraints

- No framework, global `window.ProductHelper`, or client replacement of native form submission.
- Do not load a remote reviews script in this exercise.
- No parser-blocking external scripts or hand-built JSON interpolation.
- Do not invent an exact CLI/Vite command; mark current tooling detail `[VERIFY]` in the build contract.

## Starter

```text
starter/sections/product-variant-status.liquid  blocking include and unsafe configuration
starter/assets/theme.js                          document-wide global helper
starter/assets/product-variant-status.js         incomplete local behavior
```

Copy the files to a development theme, block JavaScript once, and confirm native variant selection and Add to cart work before editing.

## Done when

- Page has no parser-blocking external theme script.
- Two form roots show independent selected status.
- A blocked module leaves the product form usable.
- Vendor ownership is recorded instead of copied into the section.
- Build contract identifies final output and a reproducible sync check.

## Stretch

Design an interaction-loaded size-guide module with a link fallback. State trigger, module boundary, failure behavior, and evidence that it did not compete with first-view product content.


## Evidence capture

For each test, note the route, script URL, selected loading attribute, component root, and observed fallback. Disable JavaScript and block the remote vendor host separately; these are different failures. After changing a source module, record the final asset filename, rebuild time, theme-sync observation, and cache-bypassed network response. This separates code behavior from bundler or store-preview delivery mistakes.
Repeat the comparison after an editor section replacement, because a valid initial load does not prove a new root receives the correct local configuration or listeners.
Preserve screenshots and network evidence alongside the implementation review.
Keep the recorded evidence available for future regression review.
