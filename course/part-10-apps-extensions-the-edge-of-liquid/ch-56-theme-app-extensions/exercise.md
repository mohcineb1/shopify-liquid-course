<!-- STATUS: final -->
# Chapter 56 — Exercise

**Time:** 70–90 minutes · **Type:** app-integration boundary refactor

## Goal

Turn a product-details section that rejects app content and a global script proposal into a merchant-controlled theme-app integration boundary. You will choose app block versus app embed placement, admit and render `@app` safely in a JSON-template section, create a valid top-level Apps wrapper, and apply only outer layout containment around unknown third-party markup.

## Context

Northstar Outdoors installed a reviews app and a chat app. A developer plans to paste the reviews script into `theme.liquid`, place a fixed-height wrapper around it, and add an `@app` block with a `limit` of one to the product section. The merchant wants to position reviews beneath the product price, remove it during a campaign, and keep chat globally available. The theme has no `apps.liquid`; top-level app content receives inconsistent spacing. The reviews app’s inner markup, loading/error states, and CSS API are unknown.

Build a theme-side integration plan. The exercise does not create or deploy an app extension, activate an app embed, install an app, modify a store, or make consent/legal claims. Work only with the local theme starter and record all app/store-dependent facts as `[VERIFY]`.

## Requirements

- [ ] 1. Write `placement-decision.md` that chooses app block or app embed for reviews and chat. Include placement, merchant action, context, activation/installation state, performance/privacy owner, removal path, and `[VERIFY]` facts.
- [ ] 2. Refactor `product-details.liquid` to accept and render `@app` alongside the starter’s native detail block. Do not put `limit` on `@app`; preserve valid DOM/editor behavior and document why the section must be JSON-template rendered.
- [ ] 3. Add a valid `apps.liquid` wrapper with `@app` support and a preset. Give it a theme-owned spacing setting only; do not use a `templates` constraint or manually render the wrapper elsewhere.
- [ ] 4. Create `containment.md` that separates outer theme layout responsibility from app-owned inner markup, scripts, accessibility, loading/error state, data, and consent behavior. State why fixed height, clipping, internal selectors, and `!important` are unsafe defaults.
- [ ] 5. Create `merchant-flow.md` describing installation versus editor add/preview/save for an app block, and installation versus Theme settings → App embeds activation for an app embed. Keep deep links as a merchant-guidance concept, not automatic publishing.
- [ ] 6. Add `integration-test.md` with candidate route, app/version, block/embed activation, selected product/market/language, desktop/mobile/zoom, long/error/loading/absent state, keyboard focus, performance/privacy evidence, removal test, owner, and rollback path—all actual values `[VERIFY]`.
- [ ] 7. Preserve the reviews app as app-rendered content; do not copy app markup or invent app API/data output. The starter CSS may style the outer wrapper only.
- [ ] 8. Mark app schema/version, extension state, theme/route, resource context, app markup/styling API, consent/legal basis, asset behavior, merchant decision, candidate/release/rollback approval `[VERIFY]` until observed in an authorised environment.

## Constraints

- Do not paste app scripts into `theme.liquid` as a substitute for a theme app extension.
- Do not promise dynamic-source/resource behavior for an app embed block.
- Do not add `limit` to an `@app` block schema entry or claim static sections accept it.
- Do not use fixed height, clipping, undocumented app selectors, or `!important` to make third-party markup resemble a screenshot.
- Ship actual starter section, wrapper, CSS, and layout files; this is not a prose-only integration exercise.

## Starter

```text
starter/sections/product-details.liquid    product section with invalid `@app` limit and unsafe app slot
starter/sections/apps.liquid               invalid Apps wrapper with template restriction/no preset
starter/assets/app-slot.css                fixed-height/clipping/internal-selector styling
starter/layout/theme.liquid                manually pasted global reviews script
starter/placement-notes.md                 unowned reviews/chat integration plan
```

Copy the starter into an unpublished local/candidate theme directory. The real app’s documentation, block output, editor state, consent behavior, app version, and store identity are out of scope until an authorised owner verifies them.

## Done when

| Concern | Evidence |
| --- | --- |
| Placement | Reviews/chat choice matches inline/global purpose and merchant control |
| Host section | `@app` has valid schema/rendering and avoids DOM/editor assumptions |
| Top-level content | Apps wrapper admits app blocks, has a preset, and only owns theme spacing |
| Containment | Theme styles outer boundary; app internals and dynamic state remain app-owned |
| Merchant flow | Installation, editor placement/activation, preview, save, disable/remove are distinguished |
| Candidate proof | Integration test matrix records real contextual evidence and a removal/rollback path |

## Stretch

Design an app-integration register that tracks extension version, block/embed type, intended routes/slots, merchant activation, outer container, styling contract, performance/privacy owner, test matrix, and removal/rollback path. Explain why a theme commit alone cannot prove the deployed app integration state.

## Verification protocol

In an authorised candidate store, confirm JSON-template/static-section status, installed app/version, block or embed availability, target theme, editor state, selected resource, market/language, and app docs. Add/preview/save an app block or activate an embed only with merchant/release approval. Test mobile/desktop, zoom, keyboard focus, long/error/loading/absent states, asset load/performance, consent expectations, and clean removal. Preserve candidate/theme/app version evidence and verify the same route matrix after rollback or disablement.
