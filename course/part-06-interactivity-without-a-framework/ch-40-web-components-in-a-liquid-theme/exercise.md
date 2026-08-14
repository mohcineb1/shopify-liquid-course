<!-- STATUS: final -->
# Chapter 40 — Exercise

**Time:** 45–60 minutes · **Type:** implementation

## Goal

Build a reusable quick-add interaction island whose product form works without JavaScript and whose custom-element enhancement survives theme-editor section replacement without duplicate behavior.

## Context

A home-goods merchant uses a “Room-ready picks” product grid on the home page and on campaign landing pages. Each card currently submits a normal product form, which is correct but gives no feedback until navigation. Merchandising wants a local confirmation state after an add attempt, while maintaining the existing non-JavaScript route for buyers and allowing the merchant to enable or disable that message per section.

The previous developer used one document-level click listener that queries every card whenever the page loads. In the theme editor, repeated setting changes result in duplicate confirmation messages. The merchant also has an app badge beside some cards, so markup and CSS must remain extensible. Replace that approach with a small custom element and an explicit editor reconciliation boundary.

## Requirements

- [ ] 1. Create a `quick-add-card` custom element around each card’s existing product form. Its un-upgraded HTML must retain a usable `method="post"` form, variant input, and submit button.
- [ ] 2. Render `section.id` and the merchant’s “Show add confirmation” setting as escaped `data-*` attributes on each component. Parse the setting deliberately as a boolean in JavaScript.
- [ ] 3. On a successful local enhancement path, expose a visible confirmation message whose text is rendered by Liquid. Do not replace the normal button or make the message the only accessibility feedback.
- [ ] 4. Implement a connection lifecycle that never stacks handlers when a component disconnects and reconnects. Use a component-owned `AbortController` or equivalent cleanup.
- [ ] 5. Provide a small `refreshFromMarkup()` method. A `shopify:section:load` listener may call it only for the event target’s subtree; it must not reinitialize the whole document.
- [ ] 6. Keep component descendants in light DOM. The product form, button, confirmation, and app-adjacent markup must remain styleable through documented selectors.
- [ ] 7. Scope the supplied CSS from `quick-add-card`, including a hidden confirmation state and a visible state that does not rely on color alone.
- [ ] 8. Write `notes.md` with the lifecycle evidence you checked: first load, changing a section setting, section removal/re-addition, JavaScript disabled, keyboard submission, and a card with an app badge adjacent to it.

## Constraints

- Do not use a framework, external library, app API, or a global product-card initializer.
- Do not fetch cart data, replace cart behavior, or introduce APIs from later chapters. A normal form submission remains the safe baseline.
- Do not attach a shadow root. The merchant and apps require ordinary descendants to remain reachable.
- Do not put Liquid values into executable JavaScript strings. Configuration belongs in markup attributes and message text belongs in Liquid-rendered HTML.
- Do not edit files outside this exercise directory. You may add no more than the listed starter paths.

## Starter

```text
starter/sections/room-ready-picks.liquid  incomplete Liquid section and merchant setting
starter/assets/quick-add-card.js          incomplete custom-element lifecycle
starter/assets/quick-add-card.css         scoped presentation baseline
```

Copy the three files into the matching paths in a development theme. Confirm that the form and card content render before adding behavior. Read the Liquid setting in the markup rather than hardcoding its value in the JavaScript file.

## Done when

In a development theme and the theme editor:

- With JavaScript disabled, a card still displays product context and submits its normal add form.
- With JavaScript enabled, each card can show its own Liquid-rendered confirmation without changing another card.
- Changing the setting causes the replaced section to have one working handler per card, not accumulating feedback after multiple edits.
- Removing and re-adding the section leaves no stale visible state or listener-driven duplicate response.
- Inspection shows `quick-add-card` as the local CSS boundary; its form and app-adjacent content remain in ordinary light DOM.
- Keyboard users can reach and submit the native button, and the confirmation has a non-color state cue.

## Stretch

Add a documented custom event that reports a successful local confirmation to an independently owned cart indicator without either component querying the other’s private DOM. In `notes.md`, describe the event name, `detail` shape, whether it bubbles, and why it is necessary. Do not implement cart mutation or cart rendering; that belongs to the later cart-interaction chapter.
