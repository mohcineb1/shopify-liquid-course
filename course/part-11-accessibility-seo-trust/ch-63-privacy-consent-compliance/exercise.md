<!-- STATUS: final -->
# Chapter 63 — Exercise

**Time:** 75–90 minutes · **Type:** consent-gated theme and trust-surface audit

## Goal

Replace a theme’s automatic tracking and decorative cookie popup with a purpose-gated, accessible technical plan. You will classify processing, design a Customer Privacy API loading and change-state contract, bound banner performance/focus behavior, separate developer work from merchant/legal decisions, and prepare policy/accessibility page evidence without making a compliance claim.

## Context

Northstar Outdoors loads analytics, attribution, and a heat-map script in `theme.liquid` before any consent check. A second app banner appears after the theme popup, the popup stores “accepted” in `localStorage` on page load, the close icon is not keyboard reachable, and an accessibility page says “100% compliant.” The current merchant privacy settings, configured regions, customer location, approved vendors/purposes, pixels, app-banner behavior, policy owner, content version, legal advice, performance baseline, browser/support matrix, candidate store, and release plan are unknown.

Work locally. Do not set or alter consent, Shopify cookies, privacy settings, customer data, pixels, apps, banners, legal pages, tracking vendors, live theme assets, or customer privacy records. Do not make legal, compliance, jurisdiction, indexing, or vendor claims. Mark all actual merchant, region, purpose, vendor, configuration, data, policy, candidate, tool, owner, approval, release, and rollback facts `[VERIFY]`.

## Requirements

- [ ] 1. Create `processing-register.md` that inventories every starter script/event/storage/request by technical owner, purpose proposed by accountable owner, essential/optional status `[VERIFY]`, allowed-purpose method, data fields/destination, initial state, consent-change behavior, failure state, test fixture, removal path, and release approval.
- [ ] 2. Correct the starter privacy loader. Load `consent-tracking-api` with `window.Shopify.loadFeatures`, use relevant Allowed methods rather than `currentVisitorConsent()` or local storage as authorization, keep optional code off on API failure, and listen for `visitorConsentCollected`. Do not call `setTrackingConsent` automatically or manipulate Shopify cookies.
- [ ] 3. Create `consent-change-contract.md` for no-choice, decline, accept, later-change, region/banner display, data-sale opt-out, API failure, duplicate provider, pixel, and vendor-stop behavior. State unresolved platform/vendor facts `[VERIFY]` rather than guessing.
- [ ] 4. Replace the popup markup/CSS with an accessible banner or preference-entry proposal: semantic name, keyboard path, visible focus, purpose text, choices, preference access, logical focus policy, no duplicate provider, and LCP/INP/CLS/no-JS test criteria. Do not claim it is a legally sufficient banner.
- [ ] 5. Create `theme-boundary.md` distinguishing theme safeguards (minimal browser payload, guarded optional assets, accessible controls, release records) from merchant/legal/operations ownership (lawful purpose, region, notice, contract, retention, requests, policy approval). Keep it informational, not advice.
- [ ] 6. Create `trust-page-record.md` for privacy/cookie, accessibility-statement, terms/returns, and preference-entry surfaces. Include stable route/link, heading/content structure, content version, locale/market, support contact, accessibility evidence, policy owner, update cadence, known limitation/exception, and `[VERIFY]` fields. Remove unsupported “100% compliant” language.
- [ ] 7. Create `privacy-validation-matrix.md` covering fresh/no-choice, decline, accept, later preference change, API failure, optional-script network state, pixel/event state, keyboard/zoom, no-JS fallback, LCP/INP/CLS, rich-text/legal-page readability, duplicate-banner prevention, and release/rollback evidence using neutral fixtures only.
- [ ] 8. Ship real starter layout, JavaScript, CSS, privacy/policy section, and inventory notes. Do not build a vendor SDK, run a third-party request, or use real visitor/customer/order/cookie/consent/secret data.

## Constraints

- Consent is recorded only through an explicit visitor interaction; a local boolean is not processing authorization.
- `currentVisitorConsent()` does not combine merchant settings and visitor location; use purpose-specific Allowed methods.
- Do not read, write, copy, or delete Shopify cookies directly.
- Do not treat a cookie banner or statement as proof of legal compliance, and do not give jurisdiction-specific advice.
- Essential storefront behavior must remain available if privacy capability, optional vendor, or JavaScript fails.

## Starter

```text
starter/layout/theme.liquid                     pre-consent analytics/marketing/heat-map includes
starter/assets/privacy-loader.js                auto-consent, cookie/localStorage authorization, duplicate loading
starter/assets/privacy-banner.css               hidden focus and layout-shifting popup style
starter/sections/privacy-notice.liquid          unnamed inaccessible banner and unsupported statement
starter/processing-notes.md                     unowned purpose/vendor/data assumptions
starter/trust-page-notes.md                     unversioned legal/accessibility page claims
```

## Done when

| Concern | Evidence |
| --- | --- |
| Consent | Privacy API load, purpose checks, change state, failure, and no automatic recording are explicit |
| Banner | UI is accessible, non-duplicative, performance-bounded, and does not replace essential storefront flow |
| Boundary | Theme and merchant/legal responsibilities are separately owned and marked where unresolved |
| Trust pages | Routes, content/version/locale, contact, accessibility, exception, owner, and update evidence exist |
| Validation | Neutral-fixture matrix covers choice, change, network, pixel, accessibility, performance, fallback, release, rollback |

## Stretch

Design an authorised vendor retirement record. Define how a team identifies every theme/app/pixel placement, maps each to a declared purpose, proves no request/event after decline or removal, handles vendor-side shutdown with its accountable owner `[VERIFY]`, and confirms that product/cart/navigation functionality survives. Do not contact a vendor or execute the retirement.
