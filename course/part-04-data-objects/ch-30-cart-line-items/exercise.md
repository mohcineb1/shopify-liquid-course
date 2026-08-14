<!-- STATUS: final -->
# Chapter 30 — Exercise

## Goal
Refactor Atelier North’s cart into an honest view of Shopify cart state: personalized lines remain distinct, final prices and allocations explain actual savings, order-wide fields keep their scope, and gift/bundle UI does not claim theme-side authority it does not have.

## Context
The cart was created for standard products and now supports engraved bottles, custom label uploads, subscriptions, automatic promotions, and a free sample provided by a backend promotion. Its legacy markup uses variant ID as the row identifier, prints `line_item.price`, reads deprecated discount arrays, emits every property including internal fields, and writes the order gift note into a property on the first product. A small script adds/removes a “free sample” based on a visual subtotal threshold, even though the theme cannot establish the price, eligibility, or bundle relationship at checkout.

Your task is not to implement a cart engine. It is to render the cart Shopify gives you, capture customer intent at the correct scope, display applied savings without recalculating promotions, and make boundaries visible to a future maintainer. The result must still work if a customer has two lines of the same variant with different engravings, a product requires a selling plan, a discount changes line characteristics, or an internal property is present.

Plan **50–65 minutes**. Use a development cart containing at least a personalized line, an item with a discount, and an empty/standard line. If a free gift, component line, or subscription is unavailable in the test store, write down the missing scenario and do not manufacture its result in Liquid.

## Requirements

- [ ] Render cart state using current totals, item count, currency, shipping/tax/duty context, note, attributes, and cart-level discount applications. Do not use deprecated cart discount data.
- [ ] Identify cart rows with current line-item keys where row-specific mutation/display needs identity, while recognizing that a key can change after cart characteristics change.
- [ ] Render line title, options when meaningful, quantity, image/link, original versus final prices, line-level allocations, selling-plan context, and a real remove URL.
- [ ] Display customer-facing line properties with blank-value guards and omit underscore-prefixed internal properties. Capture an engraving and a file reference on the product-facing starter surface without treating either property as trusted authorization data.
- [ ] Put an order-wide gift note and any appropriate delivery preference at cart scope, not on a product line. Explain one example of data that must remain line-scoped.
- [ ] Show savings from final amounts and actual allocations. Distinguish a product compare-at price from a cart discount and do not manually recompute the cart total from allocation labels.
- [ ] Render backend-provided gift or component state when it exists, but remove the theme-side rule that claims to create, price, or enforce a gift/bundle. Document the backend owner needed for eligibility.
- [ ] Verify duplicate-variant personalization, cart-level and line-level discounts, empty cart, hidden property, cart note, a cart mutation refresh, and an unavailable free-gift condition.

> [VERIFY] Confirm current cart-form behavior, line-item component/instruction properties, property upload rules, discount display expectations, and the backend promotion/bundle capability used by the target store before production release.

## Constraints

Do not use `cart.discounts`, `line_item.discounts`, `line_item.price`, `line_item.line_price`, or a cached row key after cart mutation. Do not show underscore-prefixed properties to customers. Do not put secrets, price controls, authorization flags, or unvalidated business rules in properties or attributes. Do not use JavaScript to set a free-gift price or decide whether checkout is entitled to a bundle.

Do not write a solution under `course/`. Keep the cart as a server-rendered form and preserve ordinary navigation/removal behavior. The starter files should be treated as an incomplete view layer; the cart endpoint and promotion engine retain transactional authority.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/main-cart.liquid` | Cart shell that uses deprecated prices/discounts, a wrong note scope, and a theme-side gift claim. |
| `starter/snippets/cart-line.liquid` | Incomplete cart row that leaks properties and conflates variant ID with cart identity. |
| `starter/assets/cart.css` | Finished layout for cart rows, totals, properties, and status. |
| `starter/notes.md` | Cart-state and commerce-authority evidence. |

The starter renders a cart, but it does not decide which data belongs to Shopify, a line, the full cart, or a backend promotion. Make those boundaries explicit.

## Done when

Two personalized instances of the same variant remain distinguishable. The cart shows final purchase prices, line and cart discount explanations, and a total that matches Shopify. Properties are customer-safe, note and cart attributes are order-wide, and a free gift is displayed only as a result delivered by a backend rule. The test notes identify the current cart state after mutations and do not treat browser logic as pricing authority.

## Stretch

Design an asynchronous cart-refresh contract that obtains a fresh server cart after a quantity or removal action, replaces all dependent row/summary surfaces, restores focus, and handles a changed line key. State what must happen when a backend gift rule adds or removes a component line. The solution does not implement this extension.
