<!-- STATUS: final -->
# Exercise — Build a release-evidence packet

The candidate theme is ready for a stakeholder review, but its `starter/records/` documents contain score claims without routes, an accessibility pass with no failure states, unowned market copy, unsafe merchant defaults, and a deployment checklist with no rollback or monitoring owner. Build a **candidate release-evidence packet** that makes these gaps visible and actionable. Do not run tools, publish translations, change a store, configure monitoring, deploy a theme, or make product/legal/market claims.

## Goal

Produce a coherent review packet that connects every release assertion to a version, route/state/fixture, owner, evidence location, decision and `[VERIFY]` gate.

## Requirements

- [ ] Replace `starter/records/quality-evidence.md` with a route-state matrix for home, collection, product, cart, search/account/content, guide/locator and failure states. Distinguish Theme Check, lab performance, automated scanning and manual accessibility evidence.
- [ ] Create a literal inventory that classifies customer-visible text/data and assigns each item a translation/market/content owner and fallback. Record locale-aware async route behavior as `[VERIFY]`.
- [ ] Repair the starter home section schema so a merchant cannot publish an invented commerce claim through a free-form default. Provide a bounded preset/empty-state/onboarding note instead.
- [ ] Write a role-based handoff and training record for merchant/editor, developer, support/operations and release approver. Include version/artifact, settings/data boundaries, known issues, escalation and rollback evidence.
- [ ] Replace the deployment record with pre-release, preview, release, observation and iteration gates. Each gate needs an owner, evidence, abort/response condition and `[VERIFY]` where real workflow/permission/analytics facts are unknown.
- [ ] Add a triage record whose findings include severity, reproduction, affected route/state/market, evidence, owner, decision, expiry where applicable and retest requirement.

## Evidence rules

Treat each quality statement as a claim that needs a reproducible record. A route name without a fixture is incomplete; a score without the tool configuration and environment is incomplete; an accessibility result without keyboard, focus, error and replacement states is incomplete. Mark unknown platform, store, permission, legal, consent, market, translation, analytics and operational facts with `> [VERIFY]`. Preserve the bad starter claims only as before/after context; do not repeat them as results.

For manual review, name the task rather than a vague visual inspection. Examples include changing a collection sort through a URL, reaching and using every product-option control by keyboard, recovering from a missing rendered section, reading a no-results state, and locating an intentionally blank structured-content surface. The packet need not execute those tasks, but it must make the expected fixture, result and owner unambiguous. Include the repository revision or candidate archive identifier in every record, and identify where raw outputs, screenshots or session notes would be retained for later review.

## Constraints

Do not fabricate Theme Check/Lighthouse/a11y results, numeric thresholds, production URLs, market availability, translated copy, analytics events, consent, monitoring access, release permissions or rollback success. Do not silence an issue by deleting a rule. Do not alter checkout. The packet must describe a testable process, not claim a completed release.

## Starter

Begin with `starter/sections/home-promise.liquid` and the records under `starter/records/`. Preserve the real theme paths. Add only records and files that demonstrate a handoff/review practice.

## Done when

The work remains reviewable without access to a live storefront and does not conceal unknown operational facts behind generic completion language.

A reviewer can identify the exact evidence still needed for every release claim, an editor can see which home setting is safe to configure, and an operator can identify the release owner, abort rule, rollback artifact and observation action without guessing.

## Stretch

Define a time-bounded exception template that prevents an accepted risk from becoming permanent technical debt; describe the template but do not invent an actual approved exception.
