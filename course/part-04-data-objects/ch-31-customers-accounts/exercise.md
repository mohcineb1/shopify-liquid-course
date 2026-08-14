<!-- STATUS: final -->
# Chapter 31 — Exercise

## Goal
Refactor Atelier North’s account touchpoints so that storefront personalization is context-guarded, the latest Shopify account surface is represented correctly in the header, legacy order content is buyer-safe, and a customer tag never masquerades as access control.

## Context
The theme header contains a hand-built “Account” dropdown that assumes `customer` always exists and links to copied legacy routes. A promotional “Trade catalog” link is hidden only by a `wholesale` customer tag, even though the destination itself has no backend restriction. The repository also has an old `customers/order` page that prints raw financial and fulfillment enum values, shows gateway receipt data, uses current product titles instead of purchased line titles, and exposes every order attribute.

The merchant is migrating to the latest customer accounts. The theme must include the appropriate Shopify account component in the header, but it cannot replace Shopify-owned account pages with another Liquid portal. The legacy order template remains only as a maintenance exercise for a store that has not migrated; its content must be clearly buyer-oriented and must not suggest that its availability is a new-feature path.

Plan **50–65 minutes**. Test signed-out and signed-in header behavior on desktop/mobile, a customer with no orders, an order with partial fulfillment, and a tagged customer. If the development store runs latest accounts, record which legacy-template checks cannot be exercised rather than pretending a Liquid page is live.

## Requirements

- [ ] Guard every customer reference in storefront/header code. Render a useful signed-out state and do not emit personal data when `customer` is absent.
- [ ] Use the current supported account component when customer accounts are enabled. Keep it reachable in both header layouts and do not attempt to recreate the account sheet’s controlled behavior.
- [ ] Inventory the legacy `customers/*` surface in `notes.md`: name its maintenance role, the store condition under which it remains relevant, and the migration owner for new account-page functionality.
- [ ] Render a buyer-safe legacy order view: purchased line titles, quantities, current order totals, localized financial/fulfillment/cancellation labels, and guards for absent addresses or fulfillment data.
- [ ] Do not output raw transaction receipts, gateway diagnostics, staff/order tags, or every customer/order field merely because an object contains them.
- [ ] Replace the tag-only trade gate with optional customer-facing messaging. Document the independent backend/account authorization owner that must protect the catalog, pricing, documents, or actions.
- [ ] Paginate customer orders/addresses where shown and distinguish an empty history from a failed customer lookup.
- [ ] Verify signed-out, signed-in, empty-order history, partial fulfillment, cancelled order, tagged customer, untagged customer, and an account-mode migration scenario.

> [VERIFY] Confirm the target store’s account mode, `shopify-account` availability/menu integration, current legacy-template behavior, customer-account extension owner, and any B2B authorization requirements before release.

## Constraints

Do not build a new legacy Liquid account portal. Do not hardcode the latest account sheet behavior. Do not use `customer.tags` as authorization for pricing, files, account actions, or an API route. Do not reveal raw transaction receipt or payment gateway details. Do not make a redirect/missing customer branch look like an authenticated account result.

Work only in this unit’s starter paths. Use Shopify customer/order objects for current presentation but assume secure actions need a Shopify, extension, app, or backend authorization boundary. Keep theme code about navigation, minimal personalization, and buyer-safe history.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/header-account.liquid` | Header account UI that assumes legacy routes and leaks customer state. |
| `starter/templates/customers/order.liquid` | Legacy order view with unsafe/raw data and inaccurate purchase history. |
| `starter/snippets/customer-segment.liquid` | Tag-only trade catalog “gate.” |
| `starter/assets/account-surfaces.css` | Finished layout styles for account/header/order surfaces. |
| `starter/notes.md` | Account-mode, authorization, and buyer-disclosure verification. |

The files intentionally conflate presentation with account ownership. Decide where the theme should stop and the current account platform or backend must begin.

## Done when

The header is useful before and after sign-in without exposing anonymous customer data. Latest account integration is a supported component, while legacy templates are described as maintenance-only. The order page displays buyer-safe historic information with contextual guards. The tag branch changes messaging only, and notes identify the actual authorization owner for protected trade resources.

## Stretch

Sketch a migration test plan for replacing the legacy order page with a customer account UI extension or current customer-account surface. Include navigation, historical order links, accessibility, privacy, and rollback criteria. Do not implement the extension in this exercise.
