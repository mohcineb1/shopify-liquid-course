<!-- STATUS: final -->
# Chapter 48 — Exercise

**Time:** 45–60 minutes · **Type:** translation-catalogue refactor

## Goal

Replace a product-card feature’s hard-coded storefront and editor language with a maintainable locale contract. Customer text uses `t`, merchant labels use schema `t:` keys, and plural/interpolation behavior remains explicit. The feature must be understandable when catalogue coverage changes.

## Context

A home-page “Garden picks” section has English literals in Liquid, repeated text in a JavaScript data attribute, and direct English schema labels. Its French storefront locale uses a different path and omits the zero-item state. A previous contributor appended `<strong>` markup to one translation without documenting an HTML key. The section may be shared with another theme, while marketing also needs a generic “See all” phrase used in product and search contexts.

Refactor the feature so translators can see which strings are customer-facing, merchant-facing, variable-bearing, or truly global. Do not add French literals beside English literals.

## Requirements

- [ ] 1. Create `starter/locales/en.default.json` and `starter/locales/fr-CA.json` with matching storefront key trees for product-card status, plural output, and visible controls.
- [ ] 2. Use single-quoted `t` keys and named interpolation values. Never concatenate translated sentence fragments.
- [ ] 3. Define a plural key with `count` and test zero, one, and larger count. Explain why Liquid must not branch on English-only singular grammar.
- [ ] 4. Create matching `en.default.schema.json` and `fr-CA.schema.json`; replace schema name/label/info with `t:` references.
- [ ] 5. Put a truly section-private storefront message in section-schema `locales` and render it through `t`. Put global “See all” in theme locale files and justify the boundary in `catalogue-map.md`.
- [ ] 6. Rename the HTML-bearing starter key to intentional `_html` or remove its markup. Document allowed tags and why unreviewed values are never inserted as HTML.
- [ ] 7. Write `coverage.md` recording default/French key counts, missing/unused checks, interpolation names, plural forms, date-format policy, and locale-file limits.
- [ ] 8. Test storefront/editor in both locales, a long French string, missing key behaviour, plural forms, and section-private text.

## Constraints

- No JavaScript translation dictionary or hard-coded customer/editor English after refactor.
- Do not treat product title/content translations as locale-file UI strings.
- Do not introduce raw HTML translation merely for styling.
- Do not rename a stable key merely because English copy changes unless meaning changes.

## Starter

```text
starter/sections/garden-picks.liquid          hard-coded customer/editor language
starter/locales/en.default.json                incomplete default storefront catalogue
starter/locales/fr-CA.json                     mismatched French storefront catalogue
```

Create schema locale files and catalogue records yourself. Validate JSON first, then inspect storefront and editor in a development theme.

## Done when

- Storefront strings resolve through matched `t` keys and named variables.
- Plural message handles zero, one, and larger count through active locale.
- Editor labels resolve via schema `t:` in both languages.
- Global and section-local language have documented ownership.
- Coverage and test records make a missing key diagnosable rather than hidden.

## Stretch

Propose CI validation for matching supported key trees, JSON, schema references, and changed interpolation variables without automatically deleting unused keys.


## Validation protocol

Before comparing rendered strings, validate each JSON file and compare its nested path tree to the default catalog. Then render the section in both languages with a product title containing punctuation and a count of zero, one, and several. Inspect the theme editor separately because a correct storefront `t` call does not prove schema `t:` references resolve. Record unresolved keys with route/editor surface and owning catalogue rather than replacing them with emergency hard-coded text.
Preserve screenshots for both customer and editor translation states.
Attach these records to future locale reviews.
Review these surfaces together every release.
