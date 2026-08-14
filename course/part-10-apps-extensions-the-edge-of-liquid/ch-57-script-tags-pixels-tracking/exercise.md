<!-- STATUS: final -->
# Chapter 57 — Exercise

**Time:** 75–90 minutes · **Type:** privacy-aware analytics migration

## Goal

Replace a scattered legacy tracking implementation with an evidence-driven migration plan. You will inventory scripts and events, distinguish standard from custom events, select app/custom pixel or theme publisher responsibilities, gate legacy browser loading through the Customer Privacy API when it is still required during transition, and design a cutover that detects duplicates, gaps, and consent errors without logging buyer data.

## Context

Northstar Outdoors has a Meta-like SDK in `theme.liquid`, a product-card click handler that calls a vendor queue, a checkout-era note, and a marketing request to “make France tracking work.” An app pixel may already capture page and purchase events, but nobody owns the event map. The old code reads a cookie directly, loads the vendor library before consent, and records a custom “guide_opened” event from a theme interaction. The team wants a migration that retains useful measurement without retaining theme-owned vendor collection.

Work with local starter files only. Do not connect a pixel, send an event, change Customer privacy settings, inspect real buyer traffic, use a token, or decide legal consent requirements. Record every store/vendor/purpose/region/permission/approval fact as `[VERIFY]`.

## Requirements

- [ ] 1. Write `pixel-inventory.md` covering each SDK/event/location: business purpose, standard/custom/unknown classification, trigger, payload minimization, destination, consent purpose, owner, current replacement, duplicate risk, and cleanup state.
- [ ] 2. Write `migration-plan.md` selecting app pixel, custom pixel, or a theme `Shopify.analytics.publish()` custom-event publisher for each starter measurement. Include cutover order, overlap policy, deduplication, comparison window, rollback, and cleanup deadline.
- [ ] 3. Replace the starter’s direct vendor queue call with a minimal custom event publisher for `guide_opened`. Define stable name, trigger meaning, minimal payload, non-goals, and pixel-side subscription responsibility; do not add endpoint or vendor code to the theme.
- [ ] 4. Create `consent-plan.md` describing Customer Privacy API feature loading, allowed-state checks, consent-change behavior, purpose mapping ownership, the prohibition on direct Shopify-cookie manipulation, and the boundary that Web Pixel extensions honor consent but cannot call the Customer Privacy API.
- [ ] 5. Create `sandbox-notes.md` comparing strict app-pixel worker constraints and lax custom-pixel iframe constraints. Explain why DOM scraping/writing and top-frame assumptions are not migration strategies.
- [ ] 6. Create `validation-matrix.md` for controlled candidate routes and consent states. Include expected event uniqueness, sanitized network evidence, same-service comparison, standard/custom semantic check, app/version state, no-consent behavior, owner, and no-real-buyer-data rule.
- [ ] 7. Remove direct legacy SDK loading from the starter layout once its migration is represented in records. Keep no fake vendor stub, remote script, secret, or customer identifier in solution code.
- [ ] 8. Mark pixel/app/version, Customer privacy configuration, region, vendor endpoint/CORS, consent/legal purpose, existing event definitions, candidate/store/checkout state, traffic comparison, and release/rollback approval `[VERIFY]` until observed through authorised systems.

## Constraints

- Do not treat `currentVisitorConsent()` alone as permission; plan around the appropriate allowed-state method.
- Do not set consent on page load, read/modify Shopify cookies, or collect data before permission merely to preserve counts.
- Do not use DOM scraping or `window.document` as an app-pixel sandbox workaround.
- Do not keep old and new event tracking indefinitely or compare different analytics services as cutover evidence.
- Ship actual starter layout, theme event publisher, and consent script files; this is not a prose-only migration.

## Starter

```text
starter/layout/theme.liquid                  manually loaded legacy vendor SDK
starter/assets/guide-tracking.js             vendor queue custom event and direct cookie read
starter/assets/consent-loader.js             consent set automatically on page load
starter/sections/guide-card.liquid           theme interaction with ambiguous tracking contract
starter/pixel-notes.md                       unowned pixel/France migration request
starter/checkout-notes.md                    legacy placement reminder with no inventory
```

Copy the starter into a local candidate directory. Use no real vendor endpoint, token, customer identity, traffic report, checkout, privacy setting, or merchant account. Authorised testing later must use controlled candidate data and privacy/release owner approval.

## Done when

| Concern | Evidence |
| --- | --- |
| Inventory | Every old SDK/event/location has purpose, owner, classification, consent, replacement, and cleanup decision |
| Architecture | Theme publishes only the justified custom event; pixel owns vendor mapping/transport |
| Consent | Allowed-state loading and consent-change policy replace automatic consent/cookie manipulation |
| Sandboxes | Strict/lax limitations rule out DOM/top-frame workaround designs |
| Cutover | Parallel/sequence, uniqueness, comparison, rollback, and deadline are measurable and owned |
| Validation | Candidate matrix tests semantics/consent/uniqueness with sanitized artifacts and no real buyer data |

## Stretch

Design an event contract registry for a second vendor that needs a subset of the same events. State whether it can subscribe to the existing standard/custom events, how payload minimization and consent purpose differ, how duplicate transport is avoided, and which owner approves its data-processing purpose. Do not add a second vendor SDK to the theme.

## Verification protocol

In an authorised candidate, capture theme/app/custom-pixel versions, candidate identity, route/fixture, consent allowed-state, event name/count, destination class, sanitized payload shape, and owner decision. Exercise no-consent, consent granted, consent changed, standard event, custom guide event, and post-removal states. Compare only the same analytics service and same definition/context. Before promotion, confirm privacy configuration, vendor documentation, pixel activation, checkout surface, merchant/legal approval, release owner, prior state, and rollback target `[VERIFY]`.
