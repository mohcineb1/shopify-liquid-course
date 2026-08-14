<!-- STATUS: final -->
# Chapter 47 — Exercise

**Time:** 60–80 minutes · **Type:** evidence-led performance refactor

## Goal

Take a deliberately bloated home-page section from an untrusted low score toward a measured, repeatable performance improvement. Identify server, network, DOM, and ownership costs before editing. Preserve visible merchandising and accessible structure; do not win by deleting the merchant feature.

## Context

A featured-collection page combines hero, grid, review badges, and recommendation strip. It renders every collection product although eight cards are visible, sorts inside every card loop, looks up related items repeatedly through `all_products`, includes a large analytics snippet as a section, and emits separate mobile and desktop card markup. Its JavaScript is parser-blocking and its hero is lazy-loaded despite appearing above the fold.

The merchant sees a mobile Lighthouse score near 40, but no controlled baseline exists. The Shopify dashboard report is delayed after an app install. Turn that ambiguity into an engineering report and a small set of owned changes. Do not promise a score; make an 85+ outcome plausible, reproducible, and explainable with Lab 18 evidence.

## Requirements

- [ ] 1. Create `baseline.md` with home, product, collection routes; test data; cache/device rule; LCP candidate; and synthetic versus RUM evidence.
- [ ] 2. Refactor sorting once outside the product loop, bound visible card count, and remove repeated `all_products` lookup from the card loop.
- [ ] 3. Preserve first-view hero priority and stable media dimensions. Remove inappropriate lazy loading from above-fold media.
- [ ] 4. Replace parser-blocking local JavaScript with non-blocking enhancement. Keep links/content usable when it fails.
- [ ] 5. Render one responsive card representation instead of duplicate mobile/desktop trees. Retain semantic structure and editor attributes where applicable.
- [ ] 6. Write `profile-notes.md` with Theme Inspector hypothesis, node/repetition evidence, sandwich-view interpretation, changed lines, and post-change profile result.
- [ ] 7. Write `dom-inventory.md` explaining each remaining wrapper and removed duplicate/hidden nodes.
- [ ] 8. Add draft `.github/workflows/lighthouse-ci.yml` with secret placeholders. In `budget.md`, state audited routes, decimal threshold, baseline reason, exception owner/expiry, and remeasurement rule.
- [ ] 9. Keep `change-log.md` rows for route, owner, before/after evidence, buyer benefit, tradeoff, and rollback signal.

## Constraints

- Do not claim the dashboard updates immediately; RUM reports lag.
- Do not delete all reviews/analytics just to improve a synthetic score. Assign ownership and describe loading/removal decision.
- Do not use hidden markup as a substitute for responsive layout.
- Do not add speculative preloads or remote performance tools.
- Record measured results only; never promise a fictional final score.

## Starter

```text
starter/sections/featured-performance-grid.liquid  repeated Liquid and oversized/duplicated markup
starter/assets/featured-performance-grid.js         parser-blocking global enhancement
starter/assets/featured-performance-grid.css        layout with unnecessary presentation wrappers
```

Copy the files to a development theme. Capture the baseline before editing and use representative collection data, not an empty preview.

## Done when

- Section has no repeated sort or `all_products` work inside card loop.
- One semantic card tree serves responsive layouts and first-view media is not lazy-loaded.
- Product links work with blocked JavaScript; enhancement does not block parsing.
- Baseline, profile, DOM, budget, and change records distinguish evidence from assumption.
- CI workflow is a safe draft without real secret values.

## Stretch

Make a case for a nonvisual analytics dependency: identify owner, route/consent trigger, interaction or idle loading candidate, buyer value, and conditions for removal rather than deferral.


## Evidence discipline

Run each synthetic route at least three times under the same device and cache conditions, then report the median and the range rather than the most flattering run. Timestamp the baseline and follow-up. For RUM, preserve the report window, percentile, page dimension, and deployment/app events visible on the timeline. A changed score without these controls is a clue, not a causal conclusion.
