<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 67 — Solution

## The approach

The starter treats missing static references as permission to delete, makes a network request intended to remove files, retains `include`, assumes a layout tag is a valid analytics migration, and describes checkout/Script remnants as harmless historical text. The solution makes the audit deliberately non-destructive. It records evidence level, uncertainty, owner, client decision, candidate validation, release gate, and rollback before any change is proposed.

| Starter concern | Audit disposition |
| --- | --- |
| `product-legacy` absent from first search | Candidate orphan; inspect template/editor/app/route evidence `[VERIFY]` |
| `promo-legacy` seemingly empty | Unknown until schema/preset/editor/merchant evidence is reviewed |
| `legacy-card` used through `include` | Verified deprecated syntax; map behavior before scoped `render` conversion |
| Layout analytics tag | Integration/consent candidate; do not copy into a replacement layout |
| `checkout.liquid`/Additional scripts note | Cross-surface deprecation portfolio item |
| Ruby Script export | Historical behavior/reconciliation item; execution and replacement `[VERIFY]` |

## 1 — Audit checklist and artifact evidence

`records/audit-checklist.md` contains the 30-point checklist grouped into architecture, merchant state, storefront behavior, data/content, integrations, quality/risk, and modernisation. Every row has observation/evidence, confidence, impact, owner, next test, disposition and unknowns. The audit is explicit about its scope: local starter inspection rather than store/editor/app/checkout/production access.

`records/artifact-inventory.md` and `records/dependency-evidence.md` apply a proof ladder. Static source searches establish paths and obvious references only. Candidate configuration/editor inspection can establish JSON instances, app embed/block state, settings, alternate-template assignments and custom CSS `[VERIFY]`. Rendered candidate and controlled fixture evidence can then test route/buyer behavior. Owner confirmation establishes intended workflow but does not replace technical testing.

| Artifact | Current classification | Required evidence before action |
| --- | --- | --- |
| `sections/product-legacy.liquid` | Candidate orphan | JSON/template assignment, alternate template, editor state, app/route fixture, owner approval |
| `blocks/promo-legacy.liquid` | Unknown | Parent targeting/preset/editor instance, content-owner workflow, output fixture |
| `snippets/legacy-card.liquid` | Referenced | `include` call and all candidate call paths; conversion fixture |
| `assets/audit-helper.js` | Referenced but unsafe | Layout/asset loading fixture; replace with non-destructive helper |
| `scripts/shipping-rule.rb` | Historical residue/unknown execution | Script status, business owner, behavior reconciliation, supported target `[VERIFY]` |
| Checkout notes | Cross-surface risk record | Current configuration, purpose, surface ownership, migration/cutover plan `[VERIFY]` |

No row says “dead.” A deletion becomes a separate candidate change only after dependency evidence, buyer/merchant impact, named owner, accepted release gate, rollback, and post-change validation are available.

## 2 — Non-destructive helper and report layout

The corrected helper merely creates an in-memory inventory. It performs no network request and makes no statement about reachability.

<!-- solution/assets/audit-helper.js -->
```js
(function () {
  const candidatePaths = [
    'sections/product-legacy.liquid',
    'blocks/promo-legacy.liquid',
    'snippets/legacy-card.liquid',
    'scripts/shipping-rule.rb'
  ];

  window.themeAuditInventory = candidatePaths.map((path) => ({
    path,
    classification: 'unknown',
    evidence: 'local starter inventory only',
    next: 'verify candidate/editor/app/route evidence'
  }));
}());
```

<!-- solution/snippets/audit-status.liquid -->
```liquid
<aside class="audit-status" role="status">
  <p>{{ message | escape }}</p>
</aside>
```

The snippet does not load analytics, mutate checkout, inspect production configuration, or claim an audit result. It is a report-only display helper. In a real report, all external activity and report rendering context remain `[VERIFY]`.

## 3 — Deprecation portfolio

`records/deprecation-portfolio.md` separates observed repository facts from platform behavior. The repository’s verified deprecation ledger lists `include` as deprecated in favor of `render`; in-checkout `checkout.liquid` as unsupported; Thank You/Order Status `checkout.liquid` plus Additional scripts as sunset; non-Plus ScriptTags on Thank You/Order Status as scheduled for sunset on 2026-08-26; and Shopify Scripts as deprecated, with published scripts no longer executing after 2026-06-30.[1]

| Finding | Portfolio class | Next safe decision |
| --- | --- | --- |
| `include 'legacy-card'` | Safe mechanical candidate | Discover call contract, convert in candidate, validate output/scope, rollback |
| Layout analytics script | Cross-surface migration | Inventory vendor/pixel/consent/owner, test approved target, cutover with de-duplication |
| Checkout/additional-script note | Immediate platform-risk or historical residue `[VERIFY]` | Verify configuration and buyer purpose; decide extension/pixel/retirement target |
| Ruby shipping Script | Historical residue or business blocker `[VERIFY]` | Reconcile desired rule and supported authoritative replacement before retirement |

The solution never copy-pastes tracking into a layout or turns Ruby logic into JavaScript/Liquid. It names the behavioral outcome, replacement candidate, dependencies, owner, candidate test, release order, rollback, and unknowns.

## 4 — Honest estimate and report

`records/refactor-estimate.md` uses ranges, not price. It splits work into discovery, decision, implementation, merchant/content migration, validation, release, and contingency. It records dependencies such as candidate access, template assignments, apps, custom CSS, content owner, platform surface, source business rule and release calendar `[VERIFY]`. Exclusions include commercial pricing, vendor changes, actual data migration, legal/privacy review, production deployment and unprovided store access.

`records/client-audit-report.md` begins with a decision summary: no deletion or checkout/pixel conversion is approved from this local audit. It states scope, methods, evidence limits, architecture/merchant-state observations, ranked findings, deprecation/integration portfolio, roadmap, estimate assumptions, required client decisions, candidate validation, release/rollback, and appendix paths. Every finding gives business impact, evidence, confidence, options, recommendation, owner, acceptance and rollback.

## 5 — Candidate validation matrix

`records/candidate-validation-matrix.md` covers alternate templates, editor instances/settings, custom CSS, app blocks/embeds, route/market/locale, forms/cart/no-JS, accessibility, asset loading, replacement behavior, release, monitoring and rollback. Fixtures are neutral and no production configuration, customer data, app credential, checkout/admin access, screenshot, vendor request, or deletion is performed.

### Prioritisation and client decision protocol

The report prioritises findings by platform deadline, buyer/merchant impact, exposure in the observed scope, dependency, reversibility and confidence. A deadline from the verified ledger can increase urgency, but it does not establish that the discovered file is active in the client’s current configuration. A high-impact unknown becomes a short discovery decision with a named owner, not an invented remediation. A low-confidence candidate orphan stays in the inventory until route/editor/app evidence changes its classification.

Before delivery, conduct a finding readback with technical and merchant owners `[VERIFY]`. Confirm the evidence window, candidate version, paths, business language, exclusions, option versus approved recommendation, acceptance fixture, release gate and rollback owner. Put disagreements and new evidence into the register. This makes the report a baseline for a later candidate refactor rather than a one-time collection of source-search observations and ambiguous conclusions.

## What people get wrong here

**A missing grep hit proves deletion safety.** It only starts the evidence chain.

**A deprecation is a global search-and-replace.** It has behavior, authority, target, dependency, cutover and rollback implications.

**An estimate should sound precise.** Honest ranges explain what evidence will narrow them.

**A client report should hide uncertainty.** It should make uncertainty, owners, decisions and release gates actionable.

## Stretch: direction only

An evidence-retention policy should identify approved artifact classes (sanitized search outputs, fixture results, named owner confirmations, links and release records), access/retention/versioning rules, and explicit exclusion of customer data, secrets and unapproved screenshots `[VERIFY]`. It should support re-audit without silently collecting production evidence.

## References

[1]: ../../docs/DEPRECATIONS.md "Verified platform deprecations ledger"
