<!-- STATUS: final -->
# Chapter 67 — Exercise

**Time:** 90 minutes · **Type:** evidence-led inherited-theme audit

## Goal

Produce a client-ready audit pack for a theme that has accumulated uncertain snippets, sections, blocks, scripts, legacy checkout remnants, and merchant configuration. The result distinguishes evidence from assumption, proposes no live deletion, provides an honest refactor range, and translates technical findings into decisions a client can approve.

## Context

Harbor & Pine has a long-lived theme with a copied `include` snippet, a product section not found by the first source search, an empty-looking promo block, an old cart script, a legacy `checkout.liquid` note, a Ruby Script export, and an analytics tag in the layout. The previous agency says “delete all unused files and modernize checkout in two days.” The merchant says an old landing page, custom CSS, an app embed, and an alternate product template may still be important. No candidate theme/editor state, app inventory, template assignment, source/version, traffic data, buyer data, production configuration, owner, deadline, budget, release window, or rollback plan has been supplied.

Work locally only. Do not delete code, enable/disable apps or embeds, publish a theme, inspect production data, access checkout/admin settings, modify scripts, contact a vendor, estimate commercial price, or claim a file is unused. Mark all environment, route, editor, app, owner, platform-configuration, buyer-impact, budget, release, and rollback facts `[VERIFY]`.

## Requirements

- [ ] 1. Create `audit-checklist.md` with all 30 audit points grouped by architecture, merchant state, storefront behavior, data/content, integrations, quality/risk, and modernisation. Give each point an evidence field, confidence, impact, owner, next test, disposition, and `[VERIFY]` boundary.
- [ ] 2. Create `artifact-inventory.md` and `dependency-evidence.md` for every starter file. Classify each as referenced, candidate orphan, unreachable candidate, duplicate behavior, or unknown. Record static searches plus the dynamic/editor/app/route evidence still needed; no artifact may be labeled dead code.
- [ ] 3. Create `deprecation-portfolio.md` that inventories `include`, script tags, checkout remnants, additional-script assumptions, and legacy Ruby Scripts. State observed path/purpose, verified platform consequence, target-surface candidate, dependency, urgency, owner, candidate test, cutover/rollback condition, and `[VERIFY]` facts. Do not perform replacements.
- [ ] 4. Create `refactor-estimate.md` using discovery, decision, refactor, merchant/content migration, validation, release, contingency, dependencies, exclusions, uncertainty range, evidence needed to narrow the range, and blocked decisions. Do not give a fixed commercial quote.
- [ ] 5. Write `client-audit-report.md` with an executive summary, scope/exclusions, methods/evidence limits, architecture/merchant-state summary, ranked findings, deprecation and integration portfolio, roadmap, assumptions/range, client decisions, validation/release/rollback, and appendix. Every finding must include impact, evidence, confidence, option, recommendation, owner, acceptance, and rollback.
- [ ] 6. Correct the starter’s dangerous audit helper into a non-destructive inventory helper that only gathers named paths from an in-memory list. Create a report layout snippet that presents audit status and does not load analytics or mutate checkout.
- [ ] 7. Create `candidate-validation-matrix.md` covering alternate templates, editor instances/settings, custom CSS, app blocks/embeds, route/market/locale, forms/cart/no-JS, accessibility, asset loading, deprecated-surface replacement, release, monitoring, and rollback with neutral fixtures.
- [ ] 8. Ship real starter files under `layout/`, `sections/`, `blocks/`, `snippets/`, `assets/`, `scripts/`, and `notes/`. No production exports, secrets, screenshots, account data, or app credentials.

## Constraints

- “No static reference found” is an audit observation, not proof of deletion eligibility.
- A platform deprecation must be mapped to behavior, replacement surface, ownership, candidate test, sequence, and rollback—not a global search-and-replace.
- An estimate must state uncertainty, assumptions, excluded work, evidence required to narrow it, and release risk.
- A client report cannot infer traffic, revenue, legal compliance, merchant approval, or app compatibility without supplied evidence `[VERIFY]`.
- The exercise must not trigger analytics, checkout code, production network requests, app changes, or deletion.

## Starter

```text
starter/layout/theme.liquid                     layout analytics and historic script assumptions
starter/sections/product-legacy.liquid          candidate-unreferenced section
starter/blocks/promo-legacy.liquid              candidate orphan block
starter/snippets/legacy-card.liquid             deprecated include target
starter/assets/audit-helper.js                  destructive “unused” deletion anti-pattern
starter/scripts/shipping-rule.rb                legacy Script artifact
starter/notes/checkout-legacy.md                checkout/additional-script assertions
starter/notes/merchant-state.md                 unknown alternate/app/editor/custom-CSS state
```

## Done when

| Concern | Evidence |
| --- | --- |
| Audit breadth | All 30 points have evidence, confidence, owner, disposition and next check |
| Dead-code safety | Every artifact is a bounded hypothesis with static/dynamic evidence needs and no deletion claim |
| Deprecations | Behavior, deadline evidence, replacement candidate, dependencies and cutover/rollback are separated |
| Estimate/report | Range/assumptions and decision-ready finding register replace false certainty |
| Validation | Candidate fixtures cover merchant, app, route, buyer, quality and release outcomes without production action |

## Stretch

Define an audit evidence-retention policy. Specify which search outputs, rendered fixtures, editor observations, owner confirmations, screenshots `[VERIFY]`, issue links, and release records are retained; who can view them; how long; how changes are versioned; and how sensitive data is excluded. Do not collect any real evidence.
