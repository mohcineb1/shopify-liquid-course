<!-- STATUS: final -->
# Chapter 54 — Exercise

**Time:** 75–90 minutes · **Type:** layered theme-test design

## Goal

Turn a “looks fine on my product page” release note into a bounded test program for a theme candidate. You will define what static, visual, performance, smoke, edge-data, configuration, and merchant tests can each establish; create deterministic visual/edge fixtures; design a controlled Lighthouse CI gate; and keep checkout/account/market claims within their real owners.

## Context

Northstar Outdoors has a new purchase-panel update. The developer previewed one product on desktop, took a screenshot of the live home page, and declared testing complete. CI runs Theme Check but no visual or performance evidence. A marketing campaign added a long title, France has a product unavailable in its catalog, and an app makes the homepage recommendation row dynamic. An attempted smoke test used a staff member’s saved cart and tried to automate payment completion.

The release owner needs a candidate test plan that makes regressions visible without pretending all outcomes are Liquid-controlled. Build a fixture catalogue and evidence matrix around a test store/candidate, not around the current live storefront. Ship minimal theme files representing the purchase panel and its controlled no-image/long-title states so the test design has a concrete target.

## Requirements

- [ ] 1. Write `test-matrix.md` that assigns claim, method, route/state, fixture, owner, evidence artifact, and non-coverage for static analysis, visual regression, Lighthouse, buyer smoke tests, accessibility/manual checks, configuration, and merchant approval.
- [ ] 2. Write `visual-baselines.md` for home, product, collection/search, cart, and account/form surfaces. Include viewport, route, data/preset, market/language/customer state, dynamic-region treatment, reviewer, and baseline-update rule.
- [ ] 3. Add `lighthouse-policy.md` specifying a dedicated test store, controlled product/collection handles, secrets boundary, repeated-run/variance policy, performance/accessibility threshold owner, report retention, and field/RUM limitation. Do not place credentials in the repository.
- [ ] 4. Add `smoke-tests.md` for add-to-cart, cart update/remove, checkout entry, account entry, and one form. Give each a test fixture, clean state/reset, buyer-visible assertion, owner, and explicit checkout/payment/account limitation.
- [ ] 5. Add `edge-fixtures.md` for no images, long titles, 100 variants, empty collection/search, unavailable-in-market product, long cart property, and missing editorial data. Define expected safe behavior without inventing catalog/market policy.
- [ ] 6. Implement a minimal purchase-panel section, stylesheet, and two fixtures/notes that demonstrate a no-image/long-title-friendly rendering contract. Do not use fake client-side currency conversion or a live-store dependency.
- [ ] 7. Write `triage.md` for screenshot mismatch, Lighthouse regression, smoke-test failure, edge-data break, and merchant mismatch. Preserve original evidence and name the first classification question, likely owners, and rollback/escalation rule.
- [ ] 8. Mark exact tool/browser versions, store handles, customer/account credentials, market/catalog state, app behavior, score thresholds, and release approval `[VERIFY]` until confirmed in an authorised test environment.

## Constraints

- Do not say a static check proves visual, accessibility, merchant, market, or checkout correctness.
- Do not auto-accept a new screenshot baseline, lower a performance threshold, retry a flaky test until green, or mutate an edge fixture to hide a failure without a documented decision.
- Do not automate payment completion or use real buyer accounts/carts in a course fixture.
- Do not use a dynamic live homepage as a baseline; identify controlled data or an approved masked dynamic region.
- Ship real starter files in `assets/`, `sections/`, and `fixtures/`, not a prose-only testing plan.

## Starter

```text
starter/sections/purchase-test-panel.liquid      assumes every product has image and short title
starter/assets/purchase-test-panel.css            brittle one-line title layout
starter/fixtures/no-image-product.md              empty fixture note with no expected behavior
starter/fixtures/long-title-product.md            unbounded title fixture with no route/state record
starter/test-plan.md                              “one preview passed” release note
starter/ci-notes.md                               live-store credentials and an unowned score target
```

Copy the starter into a disposable test theme. Do not run destructive, payment, account-credential, or production-store steps. Record actual test-store/theme/branch identity in the approved release system rather than committing it to this course repository.

## Done when

| Concern | Evidence |
| --- | --- |
| Scope | Matrix distinguishes each layer’s claim from its non-coverage |
| Visuals | Baselines specify deterministic route, fixture, state, viewport, reviewer, and update rule |
| Performance | Controlled Lighthouse policy uses secrets and retains reports without equating lab score to field performance |
| Journeys | Clean smoke fixtures assert buyer-visible cart/entry transitions and stop at platform boundaries |
| Edges | Catalogue makes absent, long, large, empty, unavailable, and optional-data behavior explicit |
| Triage | Failures preserve artifacts and are classified before changing baselines, thresholds, source, or fixtures |

## Stretch

Design a CI artifact policy that links every screenshot, Lighthouse report, smoke trace, and edge-data result to a candidate SHA/theme ID without storing buyer data or secrets. Explain which artifacts may be retained, access-controlled, or redacted, and which merchant/release decisions remain outside automation.

## Verification protocol

Run static/build checks against deployable theme output, then create an unpublished candidate in an authorised test store. Capture fixture identity, browser/viewport, route URL, market/language/customer context, theme ID, commit, and result for every baseline or smoke assertion. For a mismatch, preserve the original artifact and classify source/build, fixture, dynamic app region, theme configuration, catalog/Markets state, browser/accessibility behavior, or approval before remediation. A green candidate is a collection of bounded evidence, not a claim that payment, legal policy, or live merchandising has been certified.
