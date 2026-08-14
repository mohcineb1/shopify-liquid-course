<!-- STATUS: final -->
# Chapter 53 — Exercise

**Time:** 70–90 minutes · **Type:** component-library governance refactor

## Goal

Turn a collection of copied product fragments, ambiguous names, hidden global assumptions, and stale handoff notes into a small internal theme library with explicit contracts. You will name components consistently, extract only a proven shared price renderer, define safe utility boundaries, document ownership and migration, and choose a multi-brand variation strategy without embedding brand identity in Liquid conditions.

## Context

Northstar Outdoors and Coastline Camp share a product-card foundation, but their repositories have grown in opposite directions. Each has a `card.liquid`, a `price.liquid`, an `icon.liquid`, and a `helpers.liquid`; some read `product`, others `card_product`, and one uses global `settings` without an argument. A developer renamed `show_price` to `show_compare_at_price` in a section schema without checking configured instances. Marketing wants Coastline’s palette and wording to vary, while the purchase and price contracts must remain consistent.

The team has evidence that the product-price fragment has two genuine consumers—product card and purchase panel—but the campaign badge is still unique. A handoff note says “updated cards”; nobody can tell which theme surface owns the current contract, how to add a third consumer, or what brand differences may become settings instead of branches. Refactor the library boundary, not every piece of markup in the theme.

## Requirements

- [ ] 1. Write `naming.md` that defines filename, block/private, snippet, asset, and setting-ID conventions. Include a migration plan for the starter’s `show_price` rename and an inventory requirement before a live rename.
- [ ] 2. Replace the two duplicated price fragments with a single `snippets/product-price.liquid` whose call sites pass explicit inputs. Document required/optional inputs, output boundary, supported consumers, non-goals, and owner in `{% doc %}` or `component-contract.md`.
- [ ] 3. Keep the campaign badge local to its section. Explain in `component-contract.md` why it is not yet a shared component and what evidence would justify extraction.
- [ ] 4. Add a minimal standard-library manifest for `icon`, `visually-hidden`, and `product-price`, identifying responsibility, inputs, safe output boundary, consumers, owner, and deprecation/replacement policy.
- [ ] 5. Replace the starter’s broad `helpers.liquid` behaviour with one narrowly named utility or documented removal plan. It must not silently choose product data, price conversion, alternative text, or global campaign policy.
- [ ] 6. Write `handoff.md` covering build/output location, component ownership, editor-setting responsibilities, verification routes, known migration, and update triggers. Avoid a diary-style changelog.
- [ ] 7. Write `brand-strategy.md` that distinguishes brand configuration/data from code divergence for Northstar and Coastline. Prohibit `shop.name` branches and state when separate repositories or a shared base are justified.
- [ ] 8. Include a consumer inventory and migration/rollback note for any changed snippet argument, root markup, class, or setting ID. Mark live configuration, brand owner, and route evidence `[VERIFY]`.

## Constraints

- Do not build a universal card abstraction, extract the unique campaign badge, or add speculative parameters for an imagined third brand.
- Do not read hidden `product`, `card_product`, `section.settings`, or `settings` inside the shared price snippet.
- Do not rename a persisted setting ID as a cosmetic cleanup without a compatibility/reconciliation plan.
- Do not use `if shop.name == ...` or copy the full theme merely to change palette/copy.
- Ship real starter theme files across `assets/`, `sections/`, and `snippets/`; documentation alone is not the deliverable.

## Starter

```text
starter/snippets/card.liquid                     ambiguous product card input
starter/snippets/price.liquid                    product-card price copy
starter/sections/product-purchase-panel.liquid   second price copy and migrated setting risk
starter/sections/campaign-badge.liquid           unique local feature, not a library candidate yet
starter/snippets/helpers.liquid                  hidden global helpers
starter/assets/product-surfaces.css              shared style artifact
starter/handoff.md                               stale implementation diary
```

Copy the starter into a disposable development theme. Identify consumers before editing. Test the product-card and purchase-panel routes after refactoring; do not claim a static file search proves active merchant settings or a brand’s operational ownership.

## Done when

| Concern | Evidence |
| --- | --- |
| Discovery | Naming registry and consumer inventory reveal each contract and owner |
| Reuse | Product card and purchase panel call the same explicit price snippet |
| Restraint | Campaign badge remains local, with a documented extraction threshold |
| Utilities | Standard-library entries have narrow inputs/outputs and deprecation policy |
| Handoff | Engineering and merchant/release responsibilities point to routes and update triggers |
| Brands | Variation is configuration/data or an explicit shared-base/repository decision, never store-name branching |

## Stretch

Design a `shared-base` upgrade record for a third brand that adopts the product-price contract. Include base version, expected API compatibility, candidate routes, merchant configuration checks, rollback revision, and owner. Do not create a third consumer or a new brand condition in the starter.

## Verification protocol

Run Theme Check/build output checks appropriate to the project, then inspect the product card, product purchase panel, and campaign route in an authorised development context. Capture the exact product, market/language, price state, brand configuration, editor instance, and route behavior. Assign any mismatch to snippet contract, caller, schema migration, CSS/JavaScript owner, merchant configuration, brand data, or deployment target before adding another helper or conditional.
