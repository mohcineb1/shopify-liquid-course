<!-- STATUS: final -->
# Chapter 42 — Exercise

**Time:** 40–55 minutes · **Type:** asset-delivery refactor

## Goal

Turn a brittle campaign section that hardcodes CDN paths, treats merchant uploads as theme code, and relies on random cache busting into a theme-owned asset contract that resolves correctly in preview and production.

## Context

A luggage merchant is preparing a “Travel light” campaign. The page contains a developer-owned stylesheet, a small enhancement module, a theme icon, and a merchant-uploaded packing-list PDF. The section was copied from staging and contains an old `/cdn/shop/t/...` path, timestamp query parameter, and PDF link that assumes a theme repository file. A build tool also emits nested output names that developers paste into Liquid.

It renders on one preview, but a copied theme makes manual URL assumptions untrustworthy. Refactor it so every file is classified by owner before it receives a URL. This is not a bundler or byte-optimization exercise; it is an explainable delivery contract.

## Requirements

- [ ] 1. Replace every hardcoded CDN hostname, theme ID, and manual version query with the correct Liquid URL filter.
- [ ] 2. Reference developer-owned CSS, JavaScript, and icon from current-theme `assets/` with `asset_url`.
- [ ] 3. Reference the merchant-uploaded packing-list PDF through `file_url`; do not copy it into theme assets.
- [ ] 4. Replace nested build-output references with deliberate flat delivery names. State source and final names in `notes.md`.
- [ ] 5. Load the enhancement module without blocking initial content, and retain readable campaign content before it runs.
- [ ] 6. Remove arbitrary cache-busting. In `notes.md`, give this debugging order: correct preview/published theme, emitted URL, deployed asset, cold-load behavior.
- [ ] 7. In `asset-inventory.md`, classify every file as theme-owned, Admin Files-owned, or Shopify/global namespace-owned. Use `[VERIFY]` for any uncertain platform/global resource.
- [ ] 8. Retain an accessible PDF link and an image with appropriate alternative text.

## Constraints

- Do not create a public subdirectory tree below `assets/` or paste a bundler output path into Liquid.
- Do not add timestamps, cache-busting helpers, apps, or a third-party CDN.
- Do not use `shopify_asset_url` or `global_asset_url` unless an official source names the exact resource; none is required here.
- Do not rewrite campaign copy to avoid ownership decisions.

## Starter

```text
starter/sections/travel-light-campaign.liquid  brittle references
starter/assets/campaign-travel-light.js         developer-owned module
starter/assets/campaign-travel-light.css        developer-owned styles
```

Copy these files into a development theme before editing. The module is intentionally small: it proves that a resolved URL targets the current theme rather than a copied host.

## Done when

- Page source has no copied theme ID or random `?v=` value.
- Stylesheet, module, and icon resolve from the theme; PDF resolves from Admin Files.
- A copied preview theme needs no Liquid path edits.
- Content and PDF link remain usable with JavaScript disabled.
- The inventory explains ownership and flat names; notes contain a real debug sequence.

## Stretch

Design a build-output check that rejects unused uploaded assets and Liquid `asset_url` names missing from the upload set. Describe its evidence and why it must not invent cache-version query strings.


## Evidence to capture

Before declaring the refactor complete, inspect the rendered HTML in both a preview theme and the intended published-theme context. Record the filter expression in source, the resolved URL observed in the browser, and the asset owner that justified the choice. Do not record a version query as a reusable value: it is diagnostic output. Change one developer-owned asset, deploy it through the normal theme workflow, and repeat a cold-load check. Then verify that the same source behaves in a copied preview without editing a hostname or theme identifier. This evidence distinguishes a correct asset contract from a page that happened to work from one warm browser cache.
