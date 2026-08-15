<!-- STATUS: final -->
# Chapter 68 — Exercise

**Time:** 2–3 hours · **Type:** capstone architecture brief

## Goal

Create the decision pack that later capstone chapters will implement: a bounded multi-market apparel brief, a route/content model, semantic settings and tokens, an inventory of sections/blocks/snippets, and quality budgets that can be tested before a storefront exists.

## Context

Northstar Apparel is a fictional durable-clothing brand. It proposes a default market plus a domestic and international market. The team wants a flexible home page, campaign storytelling, collection browsing, product variant selection, reusable care/size guidance, a cart, and market-specific campaign imagery. The starter contains a generic “international” request, product data copied into text fields, global settings attempting to connect dynamic content, a product form repeated in a card, and a performance claim that hides a blocking bundle.

Plan qualification, actual markets/submarkets, languages, currencies, domains, catalog, metaobject definitions, merchant/editor workflow, localization owner, market-specific content, image inventory, analytics, app set, baseline, accessibility status, performance target, test environment, release owner, and rollback are unknown. Work locally only. Do not create a store, configure Markets, upload content, enable a plan feature, contact a merchant, select an app, use customer data, publish a theme, or claim a real target is met. Mark all such facts `[VERIFY]`.

## Requirements

- [ ] 1. Create `client-brief.md` that turns the proposed multi-market apparel request into buyers, merchant jobs, outcomes, exclusions, risks, owners, decisions, assumptions and acceptance evidence. Separate default behavior from market-override hypotheses.
- [ ] 2. Create `information-architecture.md` and `content-decision-record.md` for home, collection, product, guide, campaign/journal and cart routes. Define intent, primary resource, required content, editor composition, fallback, landmark, quality risk, data type, owner, relationship, locale/market policy, empty state and archive rule.
- [ ] 3. Create `settings-contract.md` and correct `config/settings_schema.json`. Define semantic design tokens, bounded global settings, allowed ranges/defaults, consumers, accessibility constraints, performance implications, market policy `[VERIFY]`, and prohibited uses. Do not connect a dynamic source to a general theme setting.
- [ ] 4. Create `component-inventory.md` that identifies sections, blocks and snippets with purpose, permitted parent/context, inputs, output/landmark, editor controls, dynamic data rules, empty state, CSS/JS ownership, accessibility, performance, test and removal contract. Keep the product form parent-owned.
- [ ] 5. Create `market-decision-log.md` and `budget-register.md`. Record market hierarchy/override/fallback/owner/test questions and candidate performance/accessibility rules for routes, progressive enhancement, images, scripts, visual stability, keyboard/focus/forms/dynamic announcements, tools, exception and regression process.
- [ ] 6. Correct starter theme files so a product card is presentational and does not embed an add-to-cart form; a campaign section exposes bounded settings; a guide snippet expects explicit data; and the asset is an IIFE-scoped progressive-enhancement placeholder with no blocking third-party bundle.
- [ ] 7. Create `candidate-validation-matrix.md` covering default/market/market-reset behavior, product data/empty guide, editor composition, navigation/form/cart/no-JS, keyboard/focus/errors, image behavior, asset loading, visual stability, mobile touch targets, and budget exception/rollback using neutral fixtures.
- [ ] 8. Ship real starter files under `config/`, `sections/`, `snippets/`, `assets/`, and `notes/`. Do not use a framework, real store credentials, production assets, hidden business rules, or an actual market deployment.

## Constraints

- General theme settings cannot be used as dynamic source connections.
- A section/product context must not be silently assumed by a reusable card/snippet.
- Settings cannot give editors unbounded CSS/HTML or unsafe global behavior.
- “Fast” and “accessible” require a route, fixture, threshold/process, tool, owner and regression action—not a claim in a readme.
- The product form remains a product-information responsibility; no card or campaign block duplicates purchase authority.

## Starter

```text
starter/config/settings_schema.json             unbounded global styling/data settings
starter/sections/campaign-hero.liquid            global/market and editor-boundary anti-patterns
starter/sections/main-product.liquid             parent-owned form reference
starter/snippets/product-card.liquid             duplicated product form in a reusable card
starter/snippets/guide-callout.liquid            implicit product/guide dependency
starter/assets/capstone.js                       blocking global third-party script anti-pattern
starter/notes/client-request.md                  ambiguous market/client request
starter/notes/content-inventory.md               flattened editorial/product data assumptions
```

## Done when

| Concern | Evidence |
| --- | --- |
| Brief | Market/default/owner/exclusion/acceptance decisions are explicit and unknowns remain `[VERIFY]` |
| Content | Routes and typed content relationships have editor/fallback/lifecycle contracts |
| Settings | Tokens and bounded controls preserve semantics, accessibility and quality limits |
| Components | Sections, blocks and snippets have clear contexts and one authoritative product form |
| Budgets | Candidate route/fixture/metric/tool/owner/exception/retest evidence exists without claiming live results |

## Stretch

Draft a change-review template for one proposed market campaign. Include default inheritance, override reason, content/data ownership, language review `[VERIFY]`, image crop/alt/priority, component setting, route fixture, quality budget impact, acceptance owner, reset path and removal date. Do not create the market customization.
