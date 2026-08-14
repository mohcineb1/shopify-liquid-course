<!-- STATUS: final -->
# Chapter 66 — Exercise

**Time:** 90–120 minutes · **Type:** source-to-target architecture and data-model mapping

## Goal

Turn a legacy commerce brief into Shopify-native decisions without recreating a server application inside a theme. You will map SFCC/SFRA routes, ISML, cartridges and APIs to appropriate Shopify surfaces; identify equivalent mental models from Magento/WooCommerce/BigCommerce; classify lost/gained authority; translate custom attributes into typed metafields/metaobjects/references; and prepare a frontend-lead re-platforming record.

## Context

Northstar Outdoors is moving a product experience from SFCC. Its `Product-Show` controller reads a custom product attribute, calls an OCAPI endpoint from browser code, and an ISML template conditionally changes a price label. A cartridge writes a “guide” record and uses text IDs as foreign keys. A legacy Magento extension changes eligibility after cart calculation; a WooCommerce plugin adds editorial cards; a BigCommerce script fetches an account/order endpoint from storefront JavaScript. The team asks for a `product.liquid` port and says all source custom attributes can become text metafields.

The actual source code, SCAPI/OCAPI status, Shopify plan, admin access, apps, Function eligibility, customer/order permissions, source data, catalog/media count, URL/SEO, locale/market, privacy, content owner, external system of record, data contract, candidate store, release window, and rollback path are unknown. Work locally only. Do not call source/target APIs, import/export data, publish a theme, change a store, create definitions, access credentials, or claim business/legal compatibility. Mark every source, client, store, API, data, owner, target, candidate, release, and rollback fact `[VERIFY]`.

## Requirements

- [ ] 1. Create `source-to-target-map.md` mapping every starter route/template/cartridge/plugin/extension/API operation to buyer/merchant job, source authority, target surface candidate, data/read/write boundary, enforcement owner, failure, test fixture, disposition, acceptance, rollback, and `[VERIFY]` fact. Distinguish ISML/Liquid, controller/template, cartridge/theme/app/Function/external integration, and OCAPI/SCAPI/Ajax/Storefront API.
- [ ] 2. Create `platform-mental-model.md` translating the Magento extension, WooCommerce plugin, and BigCommerce storefront call into outcome/authority questions rather than file-name equivalents. Identify which needs a theme display, app/extension, Function, external service, revised workflow, retirement, or blocker decision.
- [ ] 3. Create `authority-tradeoff.md` separating source server-side control from Shopify-managed velocity/hosting/upgrade benefits. For price/eligibility, customer/order data, checkout, editorial content, and performance/third-party scripts, document what may not be recreated in Liquid/browser code and the safe target question.
- [ ] 4. Create `data-model.md` and a typed candidate data definition. Map product-specific material to a metafield; map reusable care guides to a metaobject definition; use a typed reference/list reference for relationships; reject legacy text-ID relationships. Define semantic owner, type, cardinality, validation, editor workflow, audience/access `[VERIFY]`, empty state, migration transform, locale/market, test, retirement, and reconciliation evidence.
- [ ] 5. Correct the starter theme output so it renders only a typed product metafield/reference-safe representation and contains no OCAPI/SCAPI credentials, customer/order request, price enforcement, or text-ID relationship parsing. Do not implement a live Storefront/Ajax request.
- [ ] 6. Create `gap-register.md` with target dispositions: Shopify-native workflow, supported integration, external system, defer, retire, or blocker. Include impact, owner, decision date, candidate evidence, release gate, operating fallback, rollback, and re-evaluation.
- [ ] 7. Create `frontend-lead-checklist.md` and `candidate-validation-matrix.md` spanning discovery, data reconciliation, route/redirect/SEO, merchant workflow, apps, APIs/auth, privacy, accessibility, performance, locale, no-JS, errors, cutover communication, monitoring, freeze, rollback, and stabilisation with neutral fixtures.
- [ ] 8. Ship real starter files under `templates/`, `sections/`, `snippets/`, `assets/`, and `notes/`. Do not store actual data exports, secrets, customer/order records, or production screenshots.

## Constraints

- Liquid and browser code do not become a substitute for source controllers, server hooks, price authority, permissions, or backend data writes.
- Ajax API is limited to Shopify-hosted theme interactions/current session; it cannot retrieve customer/order or update store data.
- References must use Shopify typed reference relationships, not plain-text handles or source IDs as relational substitutes.
- Private Storefront API credentials stay server-side; no candidate needs a real token.
- A data import without semantic/type/relationship/access/editor/validation/reconciliation mapping is incomplete.

## Starter

```text
starter/templates/product.isml                  source-template fragment with controller assumptions
starter/controllers/Product.js                  source controller and browser API assumptions
starter/cartridges/guide-cartridge.js           custom guide writer and text-ID relation
starter/sections/product-information.liquid     unsafe target price/data rendering
starter/snippets/care-guide.liquid              plain-text ID relationship lookup
starter/assets/source-port.js                   OCAPI/customer/order/browser request anti-pattern
starter/notes/platform-brief.md                 Magento/Woo/BigCommerce equivalence errors
starter/notes/source-data-notes.md              untyped data/import/cutover assumptions
```

## Done when

| Concern | Evidence |
| --- | --- |
| Platform map | Source mechanisms are translated into target outcomes/authority/surfaces rather than copied |
| Data model | Typed metafield/metaobject/reference decisions include ownership, validation, access and reconciliation |
| Authority | Theme/browser limits, managed-platform benefits and unsupported source assumptions are explicit |
| Operations | Gap, checklist and validation records cover candidate, cutover, support, stabilisation and rollback |
| Safety | No live API, token, export, import, customer/order access or source-system execution is attempted |

## Stretch

Design a controlled content-reconciliation protocol. Specify sanitized source/target counts, key normalization, reference resolution, media/locale checks, exception queue, ownership, acceptance threshold `[VERIFY]`, rollback trigger, and legacy-retirement condition. Do not reconcile actual records.
