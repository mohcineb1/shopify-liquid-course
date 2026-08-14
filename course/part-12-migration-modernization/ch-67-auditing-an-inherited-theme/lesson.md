<!-- STATUS: draft -->
---
id: ch-67
title: "Auditing an Inherited Theme"
part: 12
words: 2450
---

# Chapter 67 — Auditing an Inherited Theme

An inherited theme is a working system with unknown ownership, hidden merchant data, historical patches, app dependencies, and platform deadlines. An audit is not a code-style critique. It is a bounded evidence-gathering engagement that explains the current architecture, identifies risk without overclaiming, distinguishes unused from unproven, estimates work with assumptions, and gives a client a decision-ready plan.

Do not delete files because a search looks quiet. Theme editor state, alternate templates, app embeds, custom CSS, dynamic sources, unpublished themes, and external integrations can make a seemingly orphaned artifact active. Build an inventory, record evidence and uncertainty, test only on an authorised candidate, and assign an owner and rollback path to every proposed change `[VERIFY]`.

## 67.1 A 30-point audit checklist

Use a checklist to ensure breadth, not to manufacture a score. Every item needs observed evidence, risk/impact, confidence, owner, recommendation, candidate test, and unresolved `[VERIFY]` facts.

| Area | Audit points |
| --- | --- |
| Architecture (1–6) | 1. source/version; 2. architecture generation; 3. templates/routes; 4. layouts/section groups; 5. sections/blocks/snippets; 6. config/locales/assets |
| Merchant state (7–10) | 7. JSON instances; 8. settings/block order; 9. app blocks/embeds; 10. custom CSS/dynamic sources/alternate templates |
| Storefront behavior (11–15) | 11. critical routes; 12. forms/cart; 13. JavaScript failure; 14. focus/errors; 15. locale/market/no-JS |
| Data/content (16–19) | 16. metafields/metaobjects; 17. media/content; 18. empty/error states; 19. editor/source ownership |
| Integrations (20–23) | 20. apps; 21. third-party assets/events; 22. API/secrets/browser data; 23. pixels/consent |
| Quality/risk (24–27) | 24. performance; 25. SEO/head/route output; 26. test/CI/change discipline; 27. security/privacy/accessibility |
| Modernisation (28–30) | 28. deprecated surfaces; 29. dead/orphaned candidates; 30. refactor/cutover/rollback feasibility |

The checklist is an intake framework. It does not prove a file is used, a platform setting is enabled, a customer flow is correct, or a legal/privacy requirement is satisfied. Link every finding to a path, search/output, route fixture, editor observation, app record, platform source, or candidate result. Record absence as “not observed in this audit scope,” never as “does not exist.”

## 67.2 Finding dead code, orphaned sections, and unreferenced blocks

**Dead code** has evidence it is not reachable in the agreed scope. **Orphaned** means an artifact has no currently established parent/reference; it is a hypothesis, not deletion permission. A snippet can be rendered indirectly, a section can be instantiated in JSON editor state, an alternate template can be assigned to one product, and a block can be selectable from a preset while absent from simple source search.

Start with static graph discovery: inventory templates, layouts, section groups, sections, blocks, snippets, assets, locales, config, and app-extension references. Search `render`, `section`, `content_for`, JSON section `type`, JSON block `type`, schema presets, CSS imports, script tags, asset URLs, and known application hooks. Then cross-check dynamic evidence: template assignment, editor instances/settings/order, section groups, app block/embed configuration, alternate-template/resource assignment, locale/market variants, and route output `[VERIFY]`.

| Finding state | Meaning | Safe next step |
| --- | --- | --- |
| Referenced | A known static/dynamic path reaches it | Preserve or refactor with fixtures |
| Candidate orphan | No evidence yet in stated scope | Record search/editor scope; seek owner/candidate proof |
| Unreachable candidate | Evidence says no path in reviewed candidate | Stage removal only with rollback/retest |
| Duplicate behavior | Two artifacts appear to own same outcome | Compare output/owner before consolidation |
| Unknown | Scope/evidence is insufficient | Escalate; do not classify as dead |

Never use a line-count reduction as audit success. A “dead” stylesheet may provide merchant customisation or app fallback; a script might activate after section rendering; a locale key may be selected only in a market. Each removal proposal needs dependency evidence, buyer/merchant impact, candidate test, owner approval, release gate, rollback, and re-check after deployment `[VERIFY]`.

## 67.3 Deprecation sweep

Deprecations are different from untidy code: they have a platform consequence, replacement surface, and urgency. The repository’s verified platform ledger records `{% include %}` as deprecated in favor of `{% render %}`; `checkout.liquid` on in-checkout steps as unsupported; Thank You/Order Status `checkout.liquid` plus additional scripts as sunset; non-Plus Thank You/Order Status ScriptTags as scheduled to sunset on 2026-08-26; and Shopify Scripts as deprecated with published scripts no longer executing after 2026-06-30.[1]

A sweep starts with path and behavior inventory, not mass replacement. Search source and generated assets for `include`, `checkout.liquid`, additional-script copies, ScriptTag references, Ruby Scripts exports, legacy checkout selectors, manual pixels, and checkout/order-status assumptions. For each hit, capture path, owner, surface, buyer/merchant purpose, execution evidence, target replacement, platform deadline, dependency, candidate test, migration/retirement order, rollback, and `[VERIFY]` configuration facts.

`render` is not a textual synonym for `include`: its variable scope/isolation behavior changes how snippets receive data. A checkout legacy file is not necessarily an editable theme surface. A tracking tag may need Web Pixel/consent migration rather than a new theme `<script>`. A Ruby Script rule may need a Function-based replacement or a deliberate business decision. The audit reports this as a risk with validated replacement path, not a promise that one search-and-replace resolves it.

### A proof ladder for audit findings

Not all evidence has equal strength. A static search is a useful starting point, but it cannot establish that a shopper, merchant, app, or platform process never reaches an artifact. Use a proof ladder and write the level into the finding.

| Evidence level | What it supports | What it cannot establish alone |
| --- | --- | --- |
| Repository inventory | File exists; static reference appears or is absent | Editor state, app configuration, runtime path, assigned template |
| Configuration/editor review | JSON instance, app embed, settings, custom CSS, template assignment `[VERIFY]` | All buyer paths or third-party behavior |
| Rendered candidate route | Current fixture output and browser behavior | Other resource, market, locale, account, or merchant state |
| Controlled behavior test | Named interaction/error/no-JS/change outcome | Production traffic/use frequency or vendor-side data behavior |
| Owner confirmation/release record | Intended business/merchant ownership and approved decision | Technical proof without a matching fixture |

For example, an unreferenced snippet found by source search is a **candidate orphan**. If a controlled candidate inventory also finds no direct or indirect render path, no editor/config use, and no app dependency, it becomes a **removal candidate**, not yet dead code. A removal becomes eligible only after an owner accepts the impact, a release gate defines the rollback path, and a post-change fixture confirms expected buyer/merchant output. This language helps a client understand why audit work reduces risk rather than simply reading files.

Use the same ladder for generated assets. A filename may be dynamically selected, referenced from a merchant custom-Liquid field `[VERIFY]`, or loaded by an app. CSS may apply only in a non-default market, while an old JavaScript file may serve a fallback after a Section Rendering response. Record the scope of search patterns, ignored directories, candidate theme/version, routes, data fixtures, editor state, browser/device, and observer. A precise statement such as “not observed in the current product/collection candidate fixtures” is more credible than “unused.”

### Deprecation as a migration portfolio

The deprecation sweep should produce a portfolio, not a flat alert list. Group findings by deadline, buyer/merchant consequence, replacement readiness, dependency, owner, and reversibility. A deprecated `include` may be a low-risk scoped conversion after snippet-contract tests; a legacy checkout/tracking placement may require app/pixel/privacy coordination and an approved overlapping cutover. A Shopify Scripts discovery might identify behavior that has already stopped executing, so the immediate task is discovery/reconciliation, not copying Ruby logic to a theme.

| Portfolio class | Typical treatment |
| --- | --- |
| Immediate platform-risk | Freeze new use, identify owner, make candidate replacement/rollback plan before deadline |
| Safe mechanical candidate | Test a narrow code change with fixtures, then stage in a low-risk release |
| Cross-surface migration | Inventory checkout/pixel/app/consent/function dependencies and agree cutover governance |
| Historical residue | Preserve evidence, determine whether it still affects operations, then retire with approval |
| Unknown capability | Escalate to platform/app/business owner; do not estimate implementation as confirmed |

A report should tell the client which class applies and why. Avoid language such as “the checkout is broken” unless an authorised test proves the specific current surface and buyer impact. Cite the verified deprecation ledger, the discovered path, and the outstanding configuration facts `[VERIFY]`. This turns a platform announcement into an accountable remediation decision.

## 67.4 Estimating a refactor honestly

An honest estimate describes uncertainty. Do not estimate from number of files alone; estimate discovery, decision, implementation, migration, test, merchant reconciliation, release, and contingency separately. A two-line selector override can be higher risk than a new section if it touches checkout, price, accessibility, consent, an app, or unowned custom CSS.

| Workstream | Estimate inputs |
| --- | --- |
| Discovery | Unknown routes, editor state, apps, integrations, ownership, platform facts |
| Refactor | Coupling, data contract, template/block impact, code/tests, accessibility/performance |
| Migration | Merchant settings/content/app/custom CSS/data mapping and acceptance |
| Validation | Candidate fixtures, routes, browsers, locale, no-JS, errors, app/platform contracts |
| Release | Freeze, communications, monitoring, rollback, support, reconciliation |

Express ranges and assumptions. Label a finding **confirmed**, **probable**, or **unknown**; show the evidence that would narrow it. State exclusions such as production data migration, vendor changes, legal/privacy review, plan features, app license work, and store access `[VERIFY]`. Add risk multipliers only with an explained driver. A client can make a decision from a range with assumptions; they cannot rely on a precise number built on uninspected theme/editor state.

## 67.5 Writing the audit report a client will pay for

A paid audit report answers: what exists, why it matters, what should happen first, what decisions the client must make, what it costs/risk to defer, and how change can be released safely. It is not a dump of grep results or an undocumented refactor proposal.

Use this structure: executive decision summary; scope and excluded systems; evidence/method/constraints; architecture and merchant-state map; ranked finding register; deprecation and integration risk; candidate dead-code list; recommended roadmap; estimate ranges/assumptions; client decisions; validation/release/rollback; and appendix of paths/fixtures. Rank findings by buyer/merchant impact, likelihood, platform deadline, exposure, dependency, reversibility, and confidence—not severity adjectives alone.

Each finding should contain one sentence of business impact, technical evidence, confidence, affected surface, remediation options, recommendation, dependencies, owner, estimate range, acceptance test, release gate, and rollback. A good report distinguishes “replace now,” “validate in candidate,” “defer with accepted risk,” and “needs client decision.” It makes the next 30 days actionable while preserving unknowns as `[VERIFY]` rather than disguising them as certainty.

### Prioritisation that a client can act on

Prioritise by combining **impact**, **exposure**, **deadline**, **dependency**, **reversibility**, and **confidence**. Impact asks what buyer, merchant, revenue, operational, privacy, accessibility, or platform outcome is affected. Exposure asks how broadly the candidate evidence suggests the issue may occur; it does not claim traffic data that the audit has not received. Deadline comes from a verified platform sunset or a client release date `[VERIFY]`. Dependency captures whether the task waits for an app, data model, content decision, merchant approval, or external service. Reversibility asks whether a candidate/rollback path is known. Confidence prevents a dramatic recommendation from outrunning the evidence.

A small finding record can therefore say: “High priority because a verified platform deadline intersects a checkout-adjacent artifact; medium confidence because current app/pixel configuration is uninspected; next action is inventory and candidate replacement design; do not delete until owner and rollback are confirmed.” This is more useful than a red/amber/green label with no decision path.

Before report delivery, run a finding-readback meeting with the technical and merchant owners `[VERIFY]`. Confirm terminology, paths, observed output, assumptions, business impact, excluded scope, and whether a recommendation is an approved decision or merely a candidate option. Capture objections and new evidence in the register rather than silently editing the conclusion. The final report should preserve a date, candidate version, evidence window, named reviewers, next decision, and the trigger for a follow-up audit. This turns a one-time investigation into a usable baseline for subsequent refactors and release reviews.

## Gotchas

- **No source reference means dead:** editor/app/alternate-template state can still activate an artifact.
- **Deprecation equals immediate deletion:** first identify behavior, target surface, migration order and rollback.
- **A line count is an estimate:** ownership and test/migration risk dominate effort.
- **An audit report is technical prose only:** it must lead to an owner, decision, acceptance evidence and release plan.

## References

[1]: ../../docs/DEPRECATIONS.md "Verified platform deprecations ledger"
