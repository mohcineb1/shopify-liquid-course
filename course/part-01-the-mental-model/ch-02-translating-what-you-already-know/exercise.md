<!-- STATUS: final -->
# Chapter 2 — Exercise

## Goal

Build a merchant-configurable cart guard that gives buyers an accurate server-rendered message about the current cart without introducing a client framework, hydration, or component state.

## Context

Northstar Outfitters is preparing a limited-release collection. The merchandising team needs a compact notice on the cart page so buyers can tell whether their cart is ready for checkout. The team wants to change the notice heading in the theme editor because campaign language changes by release, but the result must remain truthful on a first page load, before any browser behavior has run.

The cart team has made the constraint explicit: this notice is not a live inventory monitor, a checkout integration, or a client application. It answers only the state Shopify supplied for the cart-page request. A buyer who reaches the page with items should not see an empty-cart message while waiting for JavaScript, and a buyer with an empty cart should not see a ready-to-checkout claim that a later script needs to repair. The team does not want a React island or a framework migration for one message. They want a small theme feature whose responsibility remains legible to the next developer.

## Requirements

- [ ] Create a merchant-configurable cart-page notice with a heading that a merchant can change in the theme editor.
- [ ] Render one buyer-facing message when the cart contains items and a different buyer-facing message when it does not.
- [ ] Keep the current cart state as the source of truth for the first render; do not invent or persist component state in Liquid.
- [ ] Put repeated presentational markup behind a reusable boundary and make the data it needs explicit at the call site.
- [ ] Make the notice work in a current Shopify theme without a JavaScript framework, a hydration step, or a build requirement.
- [ ] Load the supplied presentation asset from the theme’s asset directory.
- [ ] Make the finished code distinguish editorial input controlled by the merchant from request-specific cart truth, so a reviewer can explain why neither is client component state.

## Constraints

Do not use React, Vue, a client framework, client-side state, browser event listeners, network requests, an app, `{% include %}`, or copied theme code. Do not solve the empty-cart case by hiding the notice after page delivery, by placing both messages in the DOM and masking one with CSS, or by inventing a browser-side mirror of the cart. Use only current Shopify theme Liquid surfaces covered in this chapter and the appendices.

Do not change the supplied stylesheet to encode the state decision. Its job is presentation, not truth management. You may choose the buyer-facing wording, provided that the two outcomes are unambiguous and the ready outcome does not imply that checkout, inventory, or a discount has been independently validated.

## Starter

Begin with `starter/assets/cart-guard.css`. The stylesheet supplies the visual treatment only. Decide the implementation boundaries, the relevant theme files, the merchant input, and the server-rendered output yourself.

## Done when

On the cart page, a merchant can change the notice heading in the theme editor and preview the change in the normal theme workflow. With an item in the cart, the storefront shows the heading and a ready-to-checkout message on initial load. With an empty cart, it shows the heading and a different message on initial load. Refreshing either state must remain correct without relying on an already-running script.

The generated notice uses the supplied stylesheet. A reviewer can identify an explicit data boundary for its repeated markup without finding a client framework or browser behavior, and can point to the request-specific cart truth separately from the merchant-controlled title. The final feature should be understandable as a theme render even when the CSS asset is temporarily unavailable.

## Stretch

Describe, without implementing it, what would have to change if the notice needed to update immediately after an asynchronous cart operation on the same page. Name the runtime that would own that change and explain why the original Liquid render cannot perform it. Your answer should separate the original response from the later browser event; do not turn the stretch into a framework-selection exercise.
