<!-- STATUS: final -->
---
id: ch-66
title: "Arriving from Another Platform"
part: 12
words: 2450
---

# Chapter 66 — Arriving from Another Platform

Re-platforming is not “translating templates.” It replaces an execution model, data model, customization surface, hosting boundary, API contract, operational workflow, and merchant editor. Experienced frontend engineers arrive with useful instincts from SFCC, Magento, WooCommerce, or BigCommerce, but must first discard assumptions about owning the server, controlling checkout markup, querying arbitrary database tables, or making a template call business logic.

The goal is a Shopify-native design that preserves required buyer/merchant outcomes. It is not a visual clone of a legacy storefront or an attempt to recreate the old platform’s internals inside Liquid. Every source-system customisation, data field, integration, redirect, analytics event, app, access rule, and cutover condition is `[VERIFY]` until it has an owner and candidate evidence.

## 66.1 SFCC/SFRA → Shopify

SFCC/SFRA is often understood as templates plus controllers, cartridges, server-side models/hooks, and commerce APIs. Shopify hosted themes center on Liquid-rendered markup, JSON templates/sections/blocks, theme configuration, and platform-managed commerce behavior. The translation is architectural, not lexical.

| SFCC/SFRA concept | Shopify theme-oriented analogue | Boundary |
| --- | --- | --- |
| ISML template | Liquid layout/template/section/snippet | Liquid renders storefront data; it is not a general server runtime |
| Controller/route | Shopify route/template/context plus supported form/Ajax/extension behavior | Do not recreate controllers in client JS |
| Cartridge | Theme code, app extension, app, Function, or external service depending on responsibility | Select surface by authority, not folder similarity |
| Content slot | Section/block/template configuration | Map merchant ownership and editor behavior explicitly |
| Custom attribute | Metafield on resource or metaobject/reference model | Preserve type, validation, relation, access and display contract |
| OCAPI/SCAPI shopper flow | Ajax API for hosted-theme interactions or Storefront API for custom storefronts | API scope/storefront model must be chosen deliberately |

ISML can look familiar because both systems interpolate data and branch/loop. The analogy stops at execution. Liquid is a constrained theme language that renders platform-provided context. Move business enforcement to supported Shopify surfaces: an app/extension, Shopify Function, platform setting, Admin workflow, external integration, or a revised requirement `[VERIFY]`. Never put authorization, price calculation, inventory authority, secret operations, customer/order access, or transaction truth in a Liquid template or browser script.

Controllers need decomposition. Identify each SFRA route’s input, domain decision, data dependencies, cache/session behavior, response type, side effects, error behavior, permissions, observability, and owning team. Then map the buyer outcome—not controller code—to a Shopify surface. A server-rendered product page may map to a template/section. A theme cart interaction may map to the Ajax API. A truly custom storefront could map to the Storefront API. A protected administrative or data-write workflow belongs outside the theme and needs an authorised backend/app path.

Shopify’s Ajax API is for Shopify-hosted themes only. It provides lightweight REST endpoints for theme interactions; it can read the current cart/some product data and mutate current-session cart state, but cannot read customer/order data or update store data.[1] It should use `window.Shopify.routes.root` for locale-aware URLs.[1] It is not an OCAPI/SCAPI replacement.

The Storefront API is the GraphQL foundation for custom storefronts, with commerce primitives for product/collection/cart/contextual pricing and more.[2] Its tokenless and token-based access have distinct limits and permitted resources; private tokens remain server-side.[2] Do not move a hosted Liquid theme to headless merely because an SFCC team is accustomed to APIs. First demonstrate the buyer requirement that demands a custom storefront and account for the operating cost.

> [VERIFY] Salesforce currently marks OCAPI deprecated and directs migration planning toward SCAPI in its documentation, but exact endpoint, authentication, hook, cartridge, pricing, personalisation, cache, and release mapping must be verified against the source implementation and supported target design.[3]

## 66.2 Magento/WooCommerce/BigCommerce mental-model mapping

Magento, WooCommerce, and BigCommerce commonly encourage assumptions that a frontend repository can reach plugins/modules, theme files, database-shaped attributes, server routes, or a broad API. Shopify has different extension/merchant ownership boundaries.

| Source instinct | Shopify-native question |
| --- | --- |
| Magento module/observer/plugin | Is this merchant configuration, theme display, app/extension behavior, server-side Function, external integration, or unsupported? |
| WooCommerce PHP hook/filter | Is there a supported theme/app/checkout/Function surface with correct authority? |
| WordPress custom post type | Is it a page/blog/resource attribute, metaobject definition/entry, or external system of record? |
| BigCommerce stencil/theme API call | Is the target a Liquid object, Ajax endpoint, Storefront API query, or app-backed service? |
| Database custom table/column | Is it a standard resource/metafield, metaobject definition/field, reference, or external data? |
| Server plugin business rule | Who is authoritative, when is it enforced, and can Shopify-supported surfaces own it? |

Avoid renaming legacy concepts and calling the work done. A WooCommerce hook that changes a cart total after calculation may describe a business rule, not a theme concern. A Magento attribute set might contain a mix of true product facets, editorial content, operational controls, legacy artifacts, and relationships. A BigCommerce front-end customisation might depend on a particular API response rather than a visible UI need. Classify every item by commerce authority, data owner, audience, editing workflow, read/write path, failure impact, privacy sensitivity, and target surface.

A useful migration map has columns for source identifier and owner, buyer/merchant job, source data type/value examples, dependency graph, target model, display surface, write path, access, validation, migration transform, SEO/URL implication, test fixture, acceptance owner, rollback, and `[VERIFY]`. The rows that have no safe target are the most important: they force a requirement decision rather than inviting a hidden workaround.

## 66.3 What you lose and what you gain

You lose some direct server-side control: arbitrary backend execution in a theme, private database joins, unrestricted filesystem/process access, raw checkout control, and the ability to patch platform internals on a whim. You also lose the false comfort that every historical customization deserves identical reproduction.

You gain a managed commerce platform, hosted theme delivery, a constrained rendering model, structured merchant customization, supported extension surfaces, platform-upgrade safety when public contracts are used, and potentially faster delivery for standard storefront needs. These are trade-offs, not guarantees. Velocity falls if a team recreates custom server behavior in browser code; upgrade safety falls if CSS/scripts scrape private markup; hosting savings can be offset by apps or external services `[VERIFY]`.

| Need | Bad port | Better target question |
| --- | --- | --- |
| Price/eligibility rule | Liquid `if` or browser override | Which supported authoritative enforcement surface owns it? |
| Customer/order data | Ajax call or embedded JSON | Which authorised app/API/backend flow is required? |
| Editorial content | Hardcoded template copied from CMS | Which resource, metafield, metaobject and editor workflow owns it? |
| Checkout modification | Theme script/legacy injection | Which checkout extension/Function/post-purchase/pixel surface is appropriate? |
| Page performance | Copy all legacy tags/plugins | Which buyer outcome justifies each asset and consent/performance cost? |

The frontend lead must make constraints visible early. Write an **authority map**: for each source feature, record enforcement authority, render authority, data owner, mutation path, integration owner, permission/privacy boundary, operational fallback, monitoring, removal condition, and `[VERIFY]`. It prevents the theme from becoming an accidental shadow backend.

## 66.4 Data modelling translation: custom attributes → metafields/metaobjects

Model target data by its relationship to Shopify core commerce rather than by copying source tables. A **metafield** adds a typed field to a standard resource; a **metaobject** defines a custom reusable entity. Shopify’s data-modeling guidance compares metafields to new columns on built-in resources and metaobjects to custom tables; references model relationships.[4]

| Source shape | Shopify candidate | Example |
| --- | --- | --- |
| Product-specific scalar attribute | Product metafield | Fabric, care note, delivery message |
| Reusable structured record | Metaobject definition/entry | Size chart, ingredient, designer profile |
| One-to-one relationship | Typed single reference | Product → size-chart metaobject |
| One-to-many relationship | Typed list reference | Product → highlight metaobjects |
| Relationship with own attributes | Intermediate metaobject | Recipe ingredient plus quantity/order |
| Operational/private external record | External system or app model | ERP allocation/audit record `[VERIFY]` |

Do not store handles or legacy IDs in plain text to simulate relationships. Use reference types so Shopify can resolve typed connections in Liquid/API.[4] Define semantics, type, validation, cardinality, source ownership, editor workflow, storefront/headless access, privacy classification, migration transform, locale/market effects, empty/fallback behavior, API consumers, and deletion/archive policy. A `single_line_text_field` is not a relational database escape hatch.

For a Liquid theme, metafields/metaobjects can be rendered when exposed in relevant context; public Storefront API access is separately controlled when headless consumes data.[4] That distinction matters: do not expose a field publicly merely because it is visible in a theme. Verify definition access and actual audience `[VERIFY]`.

## 66.5 Re-platforming checklist for a frontend lead

A frontend lead owns the translation of outcomes into a testable storefront architecture. Start with discovery: source routes/templates/components, content/data schema, custom attributes/relationships, apps/integrations, analytics/privacy, SEO/redirects, localisation/markets, accessibility, performance, buyer journeys, merchant workflows, release calendar, and source/target owners. Never treat a content export as a complete migration plan.

Then make decisions in a candidate architecture record. Assign every source capability to standard Shopify, theme, app extension, Function, external integration, headless, retire, or blocker; record why. Build an information architecture/URL and redirect inventory; a data mapping; API/auth boundary; event/pixel register; app compatibility list; component/asset audit; content preservation plan; accessibility/performance fixture list; and cutover/rollback plan. Each must name an accountable owner, acceptance evidence, time-bound unknowns, and `[VERIFY]` facts.

| Phase | Frontend-lead exit evidence |
| --- | --- |
| Discovery | Source/system inventory and ownership map, sanitised fixtures, unknowns |
| Mapping | Feature/data/API/render/authority dispositions and explicit blockers |
| Candidate | Routes, templates, data models, integrations, content/editor flows, buyer flows built/tested |
| Validation | SEO/redirect, app, consent, a11y, performance, locale, no-JS, error and data-reconciliation evidence |
| Cutover | Approved freeze, communications, monitoring, rollback decision/path, named owners `[VERIFY]` |
| Stabilisation | Reconciliation, defect triage, legacy retirement conditions, documentation/update ownership |

A re-platform is successful when the target can be operated and safely changed—not only when pages look familiar. Preserve merchant jobs and buyer outcomes; deliberately retire obsolete source behavior; and reject undeclared server authority in the theme.

### Governing source-to-target gaps

A useful migration plan has an explicit **gap register**, not a hidden backlog. Each gap identifies a source capability, the buyer or merchant outcome it served, its current authority, source dependencies, target candidates, evidence that the target can support it, risk if it is absent, disposition, owner, decision date, candidate fixture, release gate, rollback, and re-evaluation trigger. The allowed dispositions are clear: *adopt a Shopify-native workflow*, *build a supported extension/integration*, *keep an external system of record*, *defer with approved impact*, *retire*, or *block the cutover*. “Rebuild later” has no meaning unless an owner, date, impact and temporary operating process are documented.

Separate **data migration** from **data-model migration**. Importing a value says nothing about its type, relationship, validation, editorial ownership, storefront exposure, historical reconciliation, or deletion behavior. Before loading a candidate, test source normalization: duplicate/blank identifiers, invalid option combinations, rich text/media files, locale variants, product/variant relationship, repeated records, reference resolution, and obsolete attributes. Record counts and reconciliation rules with authorised, sanitised evidence `[VERIFY]`; do not place customer/order exports or credentials in theme source control.

A frontend lead also needs a cutover communication contract. Merchants require a content-change freeze window, known editor differences, mapping/reconfiguration instructions, escalation contact, and post-launch ownership. Support requires routes, known gaps, browser/device expectations, fallback behavior, and an issue triage path. Engineering requires the candidate version, feature flags/configuration `[VERIFY]`, monitoring signals, rollback threshold, and a defined point at which legacy systems may be retired. These operational surfaces are as important as a correct Liquid template because they determine whether a successful candidate survives a real release, remains supportable, can be reversed safely, and leaves a clear durable operating record.

## Gotchas

- **ISML and Liquid are interchangeable:** they share presentation syntax ideas but not server authority.
- **Ajax API replaces any commerce API:** it is limited to Shopify-hosted theme interactions/current-session cart and product data.
- **Every attribute is a metafield:** reusable entities and relationship data often need metaobjects/references.
- **Headless is the default for SFCC teams:** choose it only for verified custom-storefront needs.
- **Visual parity means migration completeness:** data ownership, URLs, apps, privacy, editor workflows, and rollback remain.

## References

[1]: https://shopify.dev/docs/api/ajax "Shopify — Ajax API"
[2]: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api "Shopify — Building with the Storefront API"
[3]: https://developer.salesforce.com/docs/commerce/commerce-api/guide/why-use-scapi.html "Salesforce — Why use SCAPI"
[4]: https://shopify.dev/docs/apps/build/metaobjects/data-modeling-with-metafields-and-metaobjects "Shopify — Data modeling with metafields and metaobjects"
