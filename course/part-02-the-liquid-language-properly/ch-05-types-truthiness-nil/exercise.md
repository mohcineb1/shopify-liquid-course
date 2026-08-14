<!-- STATUS: draft -->
# Chapter 5 — Exercise

**Time:** 45–60 minutes · **Type:** data-state repair

## Goal

Complete a product-page launch-readiness panel that distinguishes product availability, an empty merchant announcement, and an absent optional product value without hiding these states behind silent Liquid output.

## Context

Northstar Tea’s launch team uses a small panel on product pages before a seasonal release. It should say whether the current product can be published, display the merchant’s optional launch note when one exists, and make a missing optional product image visible to the internal team without turning a normal empty setting into an error. The previous version treated every empty-looking value alike. An empty text setting entered a branch unexpectedly, a product with no image produced an unexplained blank area, and a numeric item count was concatenated into a label before another developer tried to use it as a number.

The merchandising lead needs a truthful server-rendered result, not a browser calculation or a catalogue lookup. The panel must explain the actual state of the current product and merchant configuration to a reviewer who tests it with different products and theme-editor values. Its source must also let a future developer see whether a fallback addresses unavailable data, empty content, or boolean state.

## Requirements

- [ ] Add the supplied section to a product template and preserve its existing heading setting, launch-note setting, semantic shell, stylesheet include, and editor preset.
- [ ] Replace the status placeholder with a server-rendered readiness statement that changes when the current product is available versus unavailable. Do not use browser JavaScript to decide that state.
- [ ] The status includes the current product title as safe text and remains correct in page source with JavaScript disabled.
- [ ] Replace the merchant-note placeholder with the configured launch note only when it contains usable content. An empty or whitespace-only setting must render a clear fallback instead of an empty paragraph.
- [ ] Display an internal-facing result for the product’s optional featured image: distinguish an available image from an absent image rather than emitting unexplained empty output.
- [ ] Make each fallback truthful about its owner. Do not use a missing merchant note to imply that a product is unavailable, and do not use product availability to infer that a note was configured.
- [ ] Include one visible cart-count statement that keeps numeric behavior separate from its final display label. The statement must be correct when the cart contains zero items.
- [ ] Keep the component within the supplied section and asset. Do not fetch data, call a product lookup, use an app proxy, add a client framework, or replace the page with a headless storefront.
- [ ] Product titles and merchant notes containing punctuation or markup-like characters render as text, not injected HTML.

## Constraints

Use only Liquid values, comparisons, filters, and control flow covered in this chapter and earlier units. Do not rely on JavaScript truthiness, an output-expression ternary, or a generic fallback that makes all missing values look identical. Do not alter the supplied stylesheet. Every requested state belongs to the theme render and must remain understandable with JavaScript disabled.

Do not turn an implementation note into buyer-facing copy. The storefront should describe the current data state, not expose internal debugging detail or raw object inspection. If the exact missing-value behavior of a Shopify object changes the design, record `> [VERIFY]` in learner notes and consult the object documentation rather than guessing.

## Starter

```text
starter/sections/launch-readiness.liquid  runnable section shell, settings, and placeholders
starter/assets/launch-readiness.css        finished presentation; leave unchanged
```

Copy both files into a development theme, add the section to a product template, and test an available product, an unavailable product, an empty launch note, and a product without a featured image. The starter deliberately leaves the state classification, comparisons, and fallback copy to you.

## Done when

Changing product availability produces a different server-rendered readiness result without a page reload. A configured launch note renders as escaped text; an empty or whitespace-only note shows a purposeful fallback. The panel makes the optional image’s state visible rather than leaving a blank region, and its cart-count line remains meaningful at zero.

Viewing page source shows the product title, readiness result, note result, image-state result, and cart-count statement in the initial HTML. The source contains no network dependency or browser-owned replacement of a server-owned fact. The theme editor still exposes the supplied settings, and the stylesheet remains unchanged.

## Stretch

Write a short learner note describing how you would distinguish a resource lookup that returns no result from a setting that contains an empty string. State the evidence you would collect from the object reference and schema contract before selecting a guard. Do not add a lookup or a second component file.
