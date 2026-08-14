<!-- STATUS: final -->
# Chapter 28 — Exercise

## Goal
Build an accessible, dependency-free variant picker that represents valid, unavailable, and nonexistent selections honestly, supports high-variant product data, and can transition to a sibling product in a combined listing.

## Context
Atelier North sells a configurable travel bottle. A customer can choose a finish, capacity, and cap type. Some combinations are not sold, some are sold out, and one finish belongs to a separate sibling product in a combined listing because it needs distinct media and description. The present picker serializes every `product.variants` entry, uses concatenated option labels as lookup keys, and updates only a price label. It works on the small demo product but is not safe for a product with more than 250 variants, and it can leave a hidden cart ID, media, and availability state out of sync.

You will replace it with a small progressive component. The first render must be semantically usable and show the Shopify-selected state. A change must gather option-value IDs in product order, request a fresh section state, prevent an earlier response from winning, and restore keyboard focus. If a selected value points to another product, treat it as a sibling-product transition: replace the appropriate product surface and retain the user’s intent. If no variant exists, do not choose a nearby one.

Plan **60–75 minutes**. Use a development product with multiple options; if you cannot test a combined listing or high-variant product, record which assertions remain unverified rather than emulating the behavior with hardcoded product data.

## Requirements

- [ ] Render one accessible control group per product option using `options_with_values`; labels, selected state, unavailable state, and control IDs must remain meaningful without a CSS-only or color-only signal.
- [ ] Preserve the initial server selection and submit a resolved variant ID only when a real variant exists. An unavailable variant is distinct from a nonexistent option combination.
- [ ] Do not iterate a complete `product.variants` array or serialize `product | json` as the picker’s source of truth. Use option-value IDs and a deliberately small component data contract.
- [ ] On a changed value, gather selected IDs in **product option order**, build a scoped server request, and replace the refreshed picker plus all purchase surfaces that depend on the selected state.
- [ ] Protect against racing requests and restore focus to the changed input after replacement. Expose a useful loading or status state without disabling unrelated page controls.
- [ ] When an option value identifies a different `product_url`, replace the sibling product’s information rather than treating the change as a variant ID update on the old product.
- [ ] Ensure price, compare-at price, media, selected cart ID, availability, quantity constraints, and selling-plan allocation all originate from the same returned selection state.
- [ ] Include a compact JSON projection only if your client behavior reads it. It must be component-scoped, JSON-safe, explicit about null state, and not treated as cart or checkout authority.
- [ ] Test: available same-product selection; unavailable selected variant; nonexistent combination; rapid changes; keyboard change; and a combined-listing sibling when available. Record failures and the server recovery path in `notes.md`.

> [VERIFY] Confirm the current Section Rendering API request shape, high-variant option-value properties, combined-listing `product_url` behavior, and accessible announcement expectations in the target theme before shipping.

## Constraints

Use no framework, dependency, or client-side complete-variant table. Do not select another variant as a fallback when Shopify reports a nonexistent combination. Do not update only price while leaving the form, media, quantity, and purchase-plan state stale. Do not interpolate unescaped Liquid strings into JavaScript; use JSON serialization in a non-executable data container. Do not turn browser data into transaction authority.

Do not edit another chapter’s files. The starter CSS deliberately provides only layout and status styles; focus and state meaning must come from real controls and attributes. Keep the picker scoped to its product section so a quick view or another product on the same page cannot consume its data accidentally.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/variant-picker.liquid` | Incomplete section with a legacy variant lookup and stale purchase surfaces. |
| `starter/assets/variant-picker.js` | Event handler that assumes a full variant list and does not guard racing requests. |
| `starter/assets/variant-picker.css` | Finished structural styles for fieldsets, status, and media. |
| `starter/snippets/variant-state.liquid` | Incomplete component-scoped state container. |
| `starter/notes.md` | Test evidence, transitions, and recovery decisions. |

The files are intentionally insufficient. You must decide the component boundary, section replacement strategy, data projection, no-variant behavior, and focus restoration.

## Done when

The picker exposes Shopify’s initial selected state, works by keyboard, and never invents a purchasable variant. A change updates all dependent surfaces from one returned state and cannot be overwritten by a stale response. A high-variant product does not rely on a complete client-side array. A sibling-product choice replaces product-owned content as a product transition. The notes document test evidence and identify any unverified platform behavior.

## Stretch

Add history integration that preserves the selected option-value URL state across back/forward navigation while preventing loops between `popstate` and your own request path. Explain the accessibility implications of a history-driven product replacement. The solution does not provide this extension.
