<!-- STATUS: draft -->
# Chapter 2 — Exercise

## Goal

Build a merchant-configurable cart guard that gives buyers an accurate server-rendered message about the current cart without introducing a client framework, hydration, or component state.

## Context

Northstar Outfitters is preparing a limited-release collection. The merchandising team needs a compact notice on the cart page so buyers can tell whether their cart is ready for checkout. The team wants to change the notice heading in the theme editor, but the result must remain truthful on a first page load, before any browser behavior has run. They do not want a React island or a framework migration for one message.

## Requirements

- [ ] Create a merchant-configurable cart-page notice with a heading that a merchant can change in the theme editor.
- [ ] Render one buyer-facing message when the cart contains items and a different buyer-facing message when it does not.
- [ ] Keep the current cart state as the source of truth for the first render; do not invent or persist component state in Liquid.
- [ ] Put repeated presentational markup behind a reusable boundary and make the data it needs explicit at the call site.
- [ ] Make the notice work in a current Shopify theme without a JavaScript framework, a hydration step, or a build requirement.
- [ ] Load the supplied presentation asset from the theme’s asset directory.

## Constraints

Do not use React, Vue, a client framework, client-side state, browser event listeners, network requests, an app, `{% include %}`, or copied theme code. Do not solve the empty-cart case by hiding the notice after page delivery. Use only current Shopify theme Liquid surfaces covered in this chapter and the appendices.

## Starter

Begin with `starter/assets/cart-guard.css`. The stylesheet supplies the visual treatment only. Decide the implementation boundaries, the relevant theme files, the merchant input, and the server-rendered output yourself.

## Done when

On the cart page, a merchant can change the notice heading in the theme editor. With an item in the cart, the storefront shows the heading and a ready-to-checkout message on initial load. With an empty cart, it shows the heading and a different message on initial load. The generated notice uses the supplied stylesheet, and a reviewer can identify an explicit data boundary for its repeated markup without finding a client framework or browser behavior.

## Stretch

Describe, without implementing it, what would have to change if the notice needed to update immediately after an asynchronous cart operation on the same page. Name the runtime that would own that change and explain why the original Liquid render cannot perform it.
