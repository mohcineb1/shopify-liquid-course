<!-- STATUS: final -->
# Chapter 64 — Exercise

**Time:** 90–120 minutes · **Type:** candidate theme modernization and content preservation

## Goal

Convert a small Vintage product-template architecture into a JSON-template candidate without deleting merchant state. You will classify the generation, relocate template responsibility into sections, define a JSON composition, decide which local block may become a reusable Theme Block, introduce `content_for 'blocks'` only in a compatible parent, and deliver a content-preservation rehearsal/rollback record.

## Context

Northstar Outdoors has `templates/product.liquid`, where `product-main` and `product-recommendations` are section tags but a hardcoded size-guide panel remains in template markup. The main section has local `heading` and `text` blocks. A second editorial section needs the same text content, so a stakeholder asks to “move every block to `/blocks` and make all sections draggable.” The team has not inventoried active templates, merchant settings/block order, custom CSS, dynamic sources, app blocks, alternate templates, product fixtures, theme editor state, content owner, published theme, or rollback path.

Work locally. Do not upload, publish, delete a live Liquid template, transform `settings_data.json`, alter editor content, configure an app, or migrate a merchant store. All actual theme, template, data, app, editor, content, candidate, owner, release, and rollback facts remain `[VERIFY]`.

## Requirements

- [ ] 1. Write `architecture-inventory.md` classifying every starter template/section/block by generation signal, current responsibility, local/merchant state, data/context dependency, app/dynamic-source/custom-CSS risk, candidate fixture, and `[VERIFY]` fact.
- [ ] 2. Replace the Vintage template only in your candidate output: relocate remaining size-guide markup to a named section, remove the legacy Liquid template from the candidate mapping, and create a valid `product.json` with unique section IDs, valid types, and explicit order. Do not keep `product.liquid` and `product.json` under the same candidate template path.
- [ ] 3. Write `template-migration-map.md` mapping each legacy section tag, template markup, setting, block, asset/snippet, route/context expectation, and test to mapped/retained/replaced/merchant-action/approved-retired outcome.
- [ ] 4. Convert only the reusable editorial text block to a Theme Block with an independent `block`/`section`/global-object contract, schema, and preset. Create `theme-block-decision.md` explaining why product-local blocks remain local or are not currently eligible. Do not depend on variables assigned outside a block.
- [ ] 5. Create a new compatible editorial parent section that opts into `@theme`, renders `{% content_for 'blocks' %}`, has a preset, and does not retain the old local block model. Explain the block-model fork in `parent-contract.md`; app targeting/current capability facts remain `[VERIFY]`.
- [ ] 6. Write `content-preservation-ledger.md` for section settings, local/theme block IDs/types/settings/order, app placement, custom CSS, dynamic sources, media, locales, alternate template, disabled state, content owner, before/after capture, acceptance, rollback, and unresolved mapping.
- [ ] 7. Write `candidate-validation-matrix.md` covering JSON parse, section type existence, editor add/remove/reorder/preset, product context/form, size-guide output, app/dynamic/custom-CSS state, repeated/empty content, alternate template, accessibility, no-JS, candidate release, and rollback. Use sanitized fixtures only.
- [ ] 8. Mark template/app/editor/data/content/release facts `[VERIFY]`. Ship real starter files in `templates/`, `sections/`, `blocks/`, `snippets/`, and `assets/`; do not provide production migration automation.

## Constraints

- JSON templates orchestrate sections; they do not host arbitrary Liquid markup between sections.
- A template name may exist as Liquid **or** JSON, not both, in the same candidate architecture.
- A parent uses local section blocks **or** opts into Theme Blocks; do not mix both contracts in one migrated section.
- Theme Blocks cannot receive outer variables like snippets. Keep hidden parent dependency local or redesign its data contract.
- Merchant configuration is data: no deletion, bulk rewrite, or “recreate it later” assumption.

## Starter

```text
starter/templates/product.liquid              Vintage section tags plus template-owned size-guide markup
starter/sections/product-main.liquid          local heading/text blocks and parent-variable dependency
starter/sections/product-recommendations.liquid current sibling section
starter/sections/editorial-stack.liquid       local-block parent incorrectly trying to use content_for
starter/blocks/editorial-text.liquid          incomplete reusable block without schema contract
starter/snippets/size-guide.liquid            template-owned guide markup helper
starter/assets/product-migration.css          selector tied to legacy template output
starter/merchant-content-notes.md             unowned settings/order/app/custom-CSS/dynamic-source assumptions
```

## Done when

| Concern | Evidence |
| --- | --- |
| Generation | Inventory distinguishes Vintage, JSON and Theme Block signals from visual assumptions |
| JSON conversion | Candidate maps every legacy template responsibility to sections/JSON order without type collision |
| Block design | Only a reusable independent component moves to `/blocks`; parent/local context is not smuggled in |
| `content_for` | New parent has one compatible block model and editor-ready preset/schema |
| Merchant content | Ledger and candidate matrix preserve/review editor state and make unsupported mappings explicit |
| Safety | Candidate-only rehearsal includes owner acceptance, rollback, and no live store operation |

## Stretch

Design a nested Theme Block proposal for a two-column editorial group. Define parent/child block targeting, semantic heading responsibility, depth/budget `[VERIFY]`, preset composition, merchant editing constraints, dynamic-source compatibility, app placement decision, content migration mapping, and candidate test. Do not implement the block or change live editor data.
