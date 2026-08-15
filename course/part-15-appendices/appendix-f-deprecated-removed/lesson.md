<!-- STATUS: final -->
---
id: app-f
title: "Deprecated & Removed"
part: 15
words: 2400
---

# Appendix F — Deprecated & Removed

Deprecation work is forensic work before it is migration work. You need to know which repository, published theme, app, checkout configuration, account mode, market and release path you are examining; which source establishes the date and replacement; who owns the affected surface; and how a change will be verified and rolled back. The project ledger was verified on **2026-08-13 (GMT+2)** and is the only source of dates/statuses repeated here. A search hit is not proof that the corresponding behavior is active in a store. Mark the actual store, configuration, entitlement, app, account-mode, checkout and release facts `> [VERIFY]`.

## `include`

Shopify deprecated `{% include %}` on **2019-11-13**. It remains on the platform, but `{% render %}` is the replacement.[1] Treat this as a maintainability migration rather than a blind string replacement: `render` has an isolated scope, so a snippet that accidentally relied on ambient variables can change behavior when converted.

Start with a repository scan for `{% include`, then classify each result by template/section/snippet path, arguments, values read inside the snippet, output contract, route fixture, owner and test. The migration normally makes the input contract visible:

```liquid
{%- comment -%} Legacy {%- endcomment -%}
{% include 'product-card' %}

{%- comment -%} Candidate migration {%- endcomment -%}
{% render 'product-card', product: product, image_loading: 'lazy' %}
```

Do not “fix” missing context by passing every global object. Pass only the named inputs the snippet owns. Test blank data, repeated rendering, caller variable isolation and relevant route output. An include can exist in a dormant template or alternate theme; record which candidate is deployed before claiming completion `[VERIFY]`.

## `checkout.liquid`

The Information, Shipping and Payment steps of `checkout.liquid` became unsupported on **2024-08-13**. Checkout Extensibility is the published replacement.[2] On 2025-08-28, `checkout.liquid` and additional scripts for Thank You/Order Status were sunset; Checkout UI extensions and Web Pixel extensions are the documented paths.[2]

A theme developer must not treat checkout as another Liquid template. Theme code cannot restore unsupported checkout surfaces, and a front-end workaround that injects checkout behavior merely obscures a migration risk. Inventory repository files, historical branches, theme configuration, ScriptTags, additional scripts and app/extension ownership—but do not infer actual checkout behavior from the theme alone.

| Detection question | Evidence to collect | Safe next step |
| --- | --- | --- |
| Does the repository contain `layout/checkout.liquid`? | Candidate/theme version and source path | Record as migration risk; identify checkout owner `[VERIFY]` |
| Are historical scripts/extensions referenced? | Admin/app/extension evidence `[VERIFY]` | Map each buyer task to an approved extension surface |
| Is content on Thank You/Order Status required? | Business/analytics/consent requirement `[VERIFY]` | Verify Web Pixel/UI extension eligibility and implementation owner |
| Does the theme merely link to checkout? | Route/form behavior fixture | Preserve theme boundary; do not modify checkout UI |

The replacement is not a code-search substitution. It is a product/operations decision involving extension type, permissions, privacy/consent, deployment, test checkout, analytics, fallback and ownership `[VERIFY]`.

## ScriptTags

ScriptTags on Thank You and Order Status pages for non-Plus stores are sunset on **2026-08-26**; the ledger points to Web Pixel extensions or UI extensions as replacements.[3] This is a deadline, not a guarantee that an arbitrary script can be reproduced by a theme or by either replacement. Classify each script by functional intent: analytics, consent, tracking, UI, fulfillment/support, third-party provider or unknown. Then establish data collection, buyer impact, consent/legal owner, replacement capability, test evidence and retirement plan `[VERIFY]`.

Avoid a common error: moving a checkout script into `theme.liquid`. That changes the surface, timing, consent boundary and possibly the data exposed. A storefront theme script cannot stand in for checkout extensibility. If the task has no supported replacement, document the gap and escalate rather than quietly keeping a deprecated mechanism.

## Shopify Scripts

Shopify Scripts (Ruby) are deprecated, and published scripts no longer execute as of **2026-06-30**. The ledger identifies Shopify Functions or a suitable Functions-based app as replacement directions.[4] A Script may encode discount, shipping or payment logic; the migration must first describe the business rule and its exceptions, inputs/outputs, priority/conflicts, merchant ownership, customer-visible messages, reporting and test cases. Do not translate Ruby line by line before establishing that the replacement surface supports the policy `[VERIFY]`.

Create an inventory row for each legacy rule. Capture its source, active/published status, intended audience, market/customer/product/cart conditions, financial/operational owner, observed checkout behavior, replacement decision, acceptance evidence and rollout/rollback plan. Pricing, eligibility, tax and discount policy are not theme decisions. A theme can explain a promotion only after the commerce rule and copy are approved `[VERIFY]`.

## Vintage section behaviour

Vintage theme architecture should be treated as a compatibility condition, not a vague synonym for “old code.” It may use Liquid templates, static section placement, historical settings/data conventions and editor behavior that differs from JSON-template and section-group workflows. The actual theme architecture, compatibility requirements, upgrade path and merchant data risk need verification per store `[VERIFY]`.

Detection starts with structure: inspect `templates/` for Liquid versus JSON template files; inspect section placement and schema; identify `content_for` usage; inventory layout/template/section/snippet relationships; and record editor workflows that depend on a static section. Do not convert every template mechanically. A JSON-template migration changes editor configuration, template data, ordering, settings, page assignments, app-block behavior and release/rollback risk.

| Vintage signal | Migration question | Evidence needed |
| --- | --- | --- |
| Liquid template | Is dynamic section composition required and compatible? | Existing template assignment/editor fixture `[VERIFY]` |
| Static section | Does placement/order form part of merchant workflow? | Content/reorder/empty-state test |
| Legacy settings | Can values map to bounded settings/data without loss? | Schema/data backup and migration plan `[VERIFY]` |
| Historical snippet coupling | Are inputs implicit or route-specific? | Explicit-contract refactor and route tests |

The safe rule is incremental: take an inventory and backup `[VERIFY]`, choose a bounded route, preserve a reversible artifact, migrate one contract, test buyer/editor behavior, document changes, then decide whether the next route merits conversion. A theme does not become maintainable merely because files have JSON extensions.

## Legacy customer accounts

Customer account behavior is configuration and platform-bound. A theme may render classic customer account templates only where the store supports that model; it cannot recreate authentication, customer portal data or new account experiences with arbitrary Liquid/DOM code. The store’s account mode, supported extension surface, routes, redirects, customer data/privacy requirements and migration plan are all `[VERIFY]`.

Search for customer template files, `{% form 'customer' %}` usage, `customer` object assumptions, account/login/recover/register URLs, customer-specific navigation and scripts that read or send customer data. Classify findings by buyer task and supported account context. Preserve useful storefront links and messages, but do not promise that a theme change can modify account platform behavior.

A migration record needs current mode, target mode, affected routes/tasks, data/privacy owner, support/communications owner, fixture accounts `[VERIFY]`, accessibility coverage, redirect/error/fallback behavior, release plan and rollback/incident plan. Customer data is especially unsuitable for a global custom event or browser cache. When evidence is missing, show a neutral route-level fallback and escalate the platform decision.

## Migration evidence and failure modes

A deprecation issue is rarely isolated to code. Its risk can move between theme, checkout, app, content, merchant workflow and support. Before changing a line, make a dependency map that names the user task, implementation surface, data involved, external owner, failure fallback and evidence needed. This prevents a technically successful source migration from silently removing a measurement, support action, consent control or customer message.

| Migration failure | Why it happens | Preventive evidence |
| --- | --- | --- |
| Code search treated as proof of production use | Dormant branches, unpublished themes and duplicate files exist | Published target/version and configuration evidence `[VERIFY]` |
| Replacement selected by name alone | An extension/Functions path has different capability, ownership or eligibility | Requirements-to-capability matrix and owner decision `[VERIFY]` |
| Deprecated script moved into theme code | Storefront and checkout have different context, timing and consent boundaries | Surface/data/privacy review and supported replacement decision |
| Legacy template mechanically converted | Editor data, ordering and assignments were not modelled | Backup, route/editor fixture and reversible artifact `[VERIFY]` |
| Customer flow recreated in JavaScript | Authentication and data authority are outside theme ownership | Supported account-mode/route/privacy confirmation `[VERIFY]` |
| Deletion closes the ticket too early | No buyer/editor/operations replacement test was retained | Acceptance and rollback/observation record |

Write an impact statement in plain language before a migration begins. It should identify what a buyer, merchant, support colleague or reporting system expects today, what is being retired, what must remain true, and how an exception appears. This makes it possible to test a migration without relying on the original author’s memory. It also exposes work that does not belong to the theme team: extension provisioning, app ownership, consent/legal decisions, financial policy, account configuration and release permissions.

### Detection patterns

Repository search is necessary but insufficient. Use a layered investigation. First search current source and theme archives for literal paths, tags, asset names, templates and comments. Then inspect configuration references and documentation. Finally, where authorised, confirm the published theme and operational surface through store/app/extension evidence `[VERIFY]`. Preserve negative evidence too: “search found no checkout layout in the candidate repository” is useful, but it is not proof that a different published theme or app has no checkout customization.

Keep search queries simple and auditable. Record the exact candidate revision, directories included/excluded, date, person, and results. For `include`, search markup and note snippets that use variables not passed explicitly. For checkout/script surfaces, search source but also ask the authorised checkout/app owner for platform evidence. For Scripts, identify business rules before inspecting code style. For vintage behavior, inspect template file formats and current editor use. For customer accounts, inspect route/template assumptions while treating actual mode and data behavior as store-owned verification.

A migration plan should state what is deliberately **not** migrated. A client may accept retirement of an obsolete tracking event, an old account message, a block variation or a historical script rather than recreating it. That decision needs business/operations ownership and communication `[VERIFY]`; otherwise it will reappear after launch as an unexplained regression.

### Preserve reversibility without preserving unsupported behavior

Reversibility does not mean restoring a deprecated production mechanism. It means keeping a known candidate artifact, source history, configuration/data backup where appropriate, release notes, incident contact and a safe fallback route. For example, a customer-facing cart flow may fall back to the cart page; a missing guide may be omitted; a checkout customization gap may require a documented operational response rather than a theme hack. The rollback target itself must remain supported and verified.

At release, observe the replacement task, not only the absence of the old code. Check route errors, buyer completion, accessibility status/focus, merchant editing, known locale/market states, analytics/consent only where authorised `[VERIFY]`, and support reports. Record findings against the migration’s acceptance matrix. If an unforeseen failure emerges, pause/roll back through the verified release process and reassess the replacement boundary rather than reinstalling deprecated code by default.

Before any migration is declared complete, conduct a closure review with the platform/source reference, implementation owner, operational owner and acceptance evidence in the same record. A closed code ticket is not a closed deprecation unless the replacement task, support path and retained audit evidence are also explicit.

## A repeatable migration workflow

1. **Discover.** Search code, configuration and verified operational sources; preserve revision/date/path/evidence.
2. **Classify.** Separate active/deployed use `[VERIFY]` from historical/dormant source; identify platform, theme, app, data and business owners.
3. **Map the replacement.** Use the dated published replacement; do not assume feature parity or entitlement.
4. **Define acceptance.** Name buyer/editor/operations task, fixtures, accessibility, locale/market, failure and rollback evidence.
5. **Implement narrowly.** Preserve explicit component/data boundaries; avoid global shims and cross-surface script relocation.
6. **Release deliberately.** Record approval, target, communication, observation, incident and rollback owner `[VERIFY]`.
7. **Retire evidence safely.** Remove deprecated artifacts only after the replacement and recovery path are verified; retain an audit record.

## Checklist

| Before closing a deprecation item | Evidence |
| --- | --- |
| Status/date/replacement is current | Dated authoritative source and reviewed ledger |
| Actual use is established | Candidate version/store/configuration evidence `[VERIFY]` |
| Replacement fits the platform boundary | Owner, entitlement, privacy and task mapping |
| Migration preserves buyer/editor quality | Route/state/accessibility/market fixture matrix |
| Release is reversible and observable | Approval, artifact, communication and observation record |

## References

[1]: ../../docs/DEPRECATIONS.md "`include` deprecation ledger"
[2]: ../../docs/DEPRECATIONS.md "Checkout Liquid and Thank You/Order Status ledger"
[3]: ../../docs/DEPRECATIONS.md "ScriptTag sunset ledger"
[4]: ../../docs/DEPRECATIONS.md "Shopify Scripts ledger"
