<!-- STATUS: final -->
# Chapter 41 — Exercise

**Time:** 45–60 minutes · **Type:** architecture decision and implementation boundary

## Goal

Decide whether a campaign product configurator should remain a Liquid enhancement or become a Preact island, then implement only the smallest chosen boundary while preserving a purchasable no-JavaScript product form.

## Context

A furniture merchant sells modular shelving. On a product landing page, buyers choose a width, finish, and optional cable tray before adding the selected variant to cart. The current section is Liquid-first: it shows the default variant, price, and normal product form. A previous developer wants to mount a client renderer over the whole section because “components will be easier.” Marketing also wants a visual price summary that updates while buyers compare options.

The product team has not asked for cross-route state, a custom application backend, or a second storefront. Make an honest recommendation, then deliver the smallest enhancement consistent with it. The provided JavaScript contains a full-section mount stub. Treat that as a design smell, not an instruction to follow.

## Requirements

- [ ] 1. Write `decision.md` using the lesson’s framework decision-record fields: buyer task, native baseline, chosen boundary, load trigger, server contract, failure behavior, and removal test.
- [ ] 2. Decide between no framework, Alpine, htmx, Stimulus, or a Preact island. Name an alternative considered and explain why its cost or ownership model is worse here.
- [ ] 3. Keep `starter/sections/modular-shelving.liquid` as the source of the product form, variant input, translated labels, price, and default configuration. It must remain useful without JavaScript.
- [ ] 4. If you use client code, restrict it to `[data-configuration-summary]`. Do not mount over the whole section, render a product card, or reproduce Liquid markup in JavaScript.
- [ ] 5. Load enhancement only after the buyer expresses configuration intent. State the trigger in `decision.md`, and ensure the first interaction remains understandable while the asset is still loading.
- [ ] 6. Give the summary an accessible textual update and retain ordinary keyboard controls. Do not use color, animation, or a canvas as the only selection representation.
- [ ] 7. Document JavaScript-disabled, slow-load, and runtime-removal tests in `notes.md`; name the buyer task that must survive each one.
- [ ] 8. Identify whether a hard headless signal is present. If not, explain why a theme remains the rendering boundary; if yes, name the missing operational responsibility rather than claiming a framework solves it.

## Constraints

- Do not add a framework CDN, package manager, app, or page-wide runtime. Use the provided native module only; a different tool may be recommended hypothetically.
- Do not fetch variants, mutate cart state, or create theme endpoints. The form is the purchase baseline.
- Do not move Liquid data into JavaScript merely to redraw existing HTML.
- Do not edit another unit or copy a production theme configurator.

## Starter

```text
starter/sections/modular-shelving.liquid      Liquid-first form and summary boundary
starter/assets/configuration-summary.js       intentional whole-section mount smell
starter/assets/configuration-summary.css      baseline accessible presentation
```

Copy the files into a development theme and submit the default form with JavaScript disabled before editing. Read the markup contract first: code may enhance the summary only.

## Done when

- `decision.md` explains why the selected runtime earns its cost.
- Removing JavaScript leaves readable product information, labels, controls, price, and native form.
- Keyboard option changes yield a textual summary update when enhancement is available.
- Code loads and initializes only after the stated intent boundary.
- Inspection proves a client renderer has not rebuilt the Liquid section.
- Notes conclude whether the work is a Liquid island or a headless signal.

## Stretch

Design, but do not implement, an experiment comparing an eager runtime with the intent-triggered boundary. Define buyer task, primary metric, guardrail, exposure rule, and why a synthetic score is not conversion proof.
