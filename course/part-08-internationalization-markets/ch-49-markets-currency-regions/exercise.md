<!-- STATUS: final -->
# Chapter 49 — Exercise

**Time:** 60–75 minutes · **Type:** market-aware storefront refactor

## Goal

Turn a header’s cosmetic currency switcher into an accessible localization form that uses Shopify’s configured countries and languages. Refactor a product promotion so price, catalog, and regional content are represented honestly, then audit the head for a single owner of international SEO annotations.

## Context

A merchant sells in Canada, the United States, France, and Belgium. A previous update added three problems: JavaScript changes `$` to `€` without changing storefront context; a product card multiplies price by an embedded exchange rate; and the header prints hard-coded hreflang links beside Shopify’s head output. Marketing asks for a Canadian delivery message, while the France catalog excludes one featured product.

Build a small Market desk that displays active context and a selector. Keep default storefront behavior useful everywhere, show Canadian content only with a business owner, and never present unavailable inventory as purchasable. The deliverable is a refactor plus route-level evidence, not a claim that any value is universal.

## Requirements

- [ ] 1. Render current country, language, and market using `localization`; never hard-code available option lists.
- [ ] 2. Implement selection as real `{% form 'localization' %}` markup with labelled controls, selected states, and no-JavaScript submit.
- [ ] 3. If adding automatic-submit enhancement, preserve button, labels, keyboard operation, and changed-state feedback.
- [ ] 4. Replace exchange-rate calculation and symbol rewriting with active Shopify money output; use currency-aware price presentation.
- [ ] 5. Add one merchant-owned Canadian delivery notice with bounded condition and meaningful no-match fallback. Explain in `ownership.md` why this is presentation, not catalog configuration.
- [ ] 6. Make featured product rendering safe when active market does not make it available. Never invent price, enabled purchase, or availability promise.
- [ ] 7. Preserve `content_for_header`, remove duplicate manual hreflang, and use `canonical_url`. Do not manually generate alternates without a documented single-owner replacement.
- [ ] 8. Write `market-test.md` for CA/en, FR/fr, BE/fr: context, URL, price, catalog result, notice, no-JS selector, canonical, hreflang evidence.
- [ ] 9. Add `decision-log.md` with market/config owner, theme owner, buyer claim, evidence source, and rollback signal.

## Constraints

- Do not use handwritten locale prefixes or assume translated handles match default handles.
- Do not use browser exchange rates, geolocation scripts, or flag-only controls.
- Do not turn off automatic hreflang merely to simplify a screenshot.
- Mark unresolved market/currency policy facts `[VERIFY]`; do not guess.

## Starter

```text
starter/sections/market-desk.liquid       cosmetic selector and unsafe regional card
starter/assets/market-desk.js             local symbol/exchange-rate rewriting
starter/layout/theme.liquid               duplicate manual hreflang output
```

Copy files into a development theme and inspect the rendered head for each configured test route before editing.

## Done when

- Options derive from localization and submit through a real localization form.
- Prices use active market output consistently with product/cart context.
- Regional content and unavailable-product behavior have owner and fallback.
- Head has one hreflang source and self-referencing canonical path.
- Test record distinguishes configured evidence from assumption.

## Stretch

Design market notice configuration that lets a merchant author regional editorial text without encoding legal or catalog eligibility into arbitrary country branches.


## Verification protocol

Run the same product and collection routes under each configured market context rather than comparing unrelated pages. Capture the requested URL, returned localized URL, active country/language, currency-coded price, purchasability, notice state, and rendered head tags. Repeat the selector with JavaScript disabled. A mismatch must be assigned to configuration, catalog, route, theme, or SEO owner before writing a Liquid workaround; otherwise a local patch can conceal a market setup error and regress another region.
