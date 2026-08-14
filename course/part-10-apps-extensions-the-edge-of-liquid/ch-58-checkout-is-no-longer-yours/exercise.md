<!-- STATUS: final -->
# Chapter 58 — Exercise

**Time:** 90–120 minutes · **Type:** checkout-customization triage and migration design

## Goal

Turn a pile of theme-owned checkout hacks into a bounded migration plan. You will identify which legacy implementation belongs to a checkout UI extension, a Shopify Function, a web pixel, a native setting, the theme cart, or retirement. You will not build, install, publish, or configure a checkout app. The deliverable is an evidence-backed decision record and a corrected *pre-checkout* theme experience that does not pretend to enforce checkout rules.

## Context

Northstar Outdoors has an old Plus-era `checkout.liquid`, an Additional scripts-style confirmation tracker, a Script Editor rule for VIP free shipping, and a cart drawer that disables checkout for a restricted item. A stakeholder says: “restore all of it exactly; the cart warning should block payment, hide the wrong payment method with JavaScript, show a warranty offer after payment, and keep our confirmation tracking.” No one has recorded the plan, checkout configuration, app version, target availability, merchant settings, customer-data exposure, or required business outcomes.

The dates in the brief matter. In-checkout `checkout.liquid` support ended in August 2024; Thank you/Order status `checkout.liquid` and additional scripts sunset in August 2025; non-Plus ScriptTags on those pages sunset in August 2026. Use the course deprecation ledger as the platform-fact source. Record actual store plan, current date/status, legacy locations, current configuration, requirement owner, target/API availability, pixel/app state, policy, and release approval as `[VERIFY]` rather than making a live-store determination.

## Requirements

- [ ] 1. Write `retirement-inventory.md`. Classify every starter customization by page/surface, business purpose, buyer impact, data/processes involved, retirement status, current owner, replacement family, dependency, test fixture, rollback, deletion condition, and `[VERIFY]` facts. Distinguish in-checkout, Thank you, Order status, ScriptTag, Scripts, theme cart, and post-purchase; do not call all of them “checkout code.”
- [ ] 2. Write `surface-decision.md` that assigns each requirement to **native setting**, **Checkout UI Extension**, **Shopify Function**, **web pixel**, **post-purchase extension**, **theme cart/pre-checkout**, or **retire**. State why the chosen surface has authority and why the rejected alternatives do not. Include an explicit decision for the warranty request and confirmation measurement.
- [ ] 3. Create `function-spec.md` for the restricted-item rule. Specify a Cart and Checkout Validation Function contract: business owner, supported inputs, exact failure and non-failure fixtures, buyer-safe error, scope across cart/checkout, localization/accessibility, configuration, conflict behavior, version, candidate test evidence, and rollback. Do not write browser enforcement, a payment DOM hack, or an invented Function target. Mark undocumented API/plan/configuration details `[VERIFY]`.
- [ ] 4. Create `checkout-ui-proposal.md` for one buyer-facing informational need. Name the intended target *class* (block/static/runnable), merchant placement/configuration, minimal data, extension capability need or deliberate absence, no-DOM/no-sensitive-payment boundary, error state, plan requirement, and candidate test. Use a concrete target identifier only after current-reference verification `[VERIFY]`.
- [ ] 5. Replace the starter cart’s fake enforcement with honest pre-checkout guidance. Keep a clear accessible message and a normal checkout control; explain that server-side validation is authoritative. Do not use CSS/JavaScript to disable checkout or infer final payment/delivery eligibility.
- [ ] 6. Write `scripts-migration.md` using the Scripts customizations report as discovery evidence, then choose retain-by-rebuild, install reviewed Function-based app, simplify/retire, or no-action for the legacy shipping rule. Include the condition that published Scripts are no longer a fallback and that an old rule is not recreated until its current requirement is confirmed.
- [ ] 7. Write `post-purchase-plan.md` that distinguishes Thank you (initial confirmation), Order status (revisitable), post-purchase offer (separate post-payment flow), and pixel collection. Include timing/idempotence, order availability assumptions, user value, target eligibility, consent/data boundary, and an alternative if the requested post-purchase surface is not available.
- [ ] 8. Create `validation-matrix.md` covering cart guidance, restricted-item failure/pass, checkout UI placement/error, Function configuration/version, delivery/payment rule decision, legacy retirement, Thank you/Order status revisit behavior, post-purchase eligibility, and no-consent tracking. Evidence must be candidate-only and sanitized; do not use real buyer/payment data, secrets, production traffic, or live checkout changes.

## Constraints

- Do not edit `checkout.liquid`, Additional scripts, Shopify Admin settings, checkout branding, payment configuration, pixels, or Script Editor in a live store.
- Do not claim a Checkout UI Extension target, capability, plan entitlement, Function API, payment/delivery operation, or post-purchase availability without `[VERIFY]` current-reference and merchant/store evidence.
- Do not turn a theme cart warning, DOM selector, disabled button, CSS hide, or client-side check into claimed enforcement.
- Do not assume a Thank you page runs once, an order is fully available there, Order status is a one-time completion event, or a post-purchase extension is universally available.
- Do not retain old and replacement tracking/discount/shipping logic without a bounded comparison, ownership, uniqueness/semantic test, cleanup date, and rollback record.
- Ship real starter files. The layout and Script Editor samples are *anti-pattern evidence*; the cart section/CSS are the only theme surface you should correct.

## Starter

```text
starter/layout/checkout.liquid                legacy in-checkout Liquid, payment DOM hook, vendor script
starter/assets/checkout-hacks.js              DOM payment hiding and confirmation tracking stub
starter/scripts/vip-shipping.rb               retired Scripts-style shipping rule
starter/sections/main-cart-footer.liquid      theme cart that claims to block checkout
starter/assets/cart-boundary.css              styling that hides the checkout control
starter/checkout-customizations.md            unowned request/legacy-placement notes
starter/post-purchase-notes.md                conflated Thank you, Order status, and upsell request
```

Copy the starter to a local candidate directory. You may edit only `sections/main-cart-footer.liquid` and `assets/cart-boundary.css` for the theme correction. Keep all IDs, vendor names, plan names, endpoints, customer fields, payment methods, specific targets, app configuration, and store state fictional or `[VERIFY]`.

## Done when

| Concern | Evidence |
| --- | --- |
| Retirement | Every legacy location has a dated status, owner, surface distinction, replacement/retire decision, and deletion condition |
| Authority | A decision matrix explains why UI, Function, pixel, theme, native, post-purchase, or retirement owns each requirement |
| Enforcement | The restricted-item rule has a server-side validation specification; the theme only gives honest preparatory guidance |
| UI | A checkout extension proposal specifies target class, capability discipline, plan verification, configuration, and safe error behavior |
| Scripts | The report is discovery evidence and the old shipping logic has a deliberate current-state migration decision |
| Post-purchase | Thank you, revisitable Order status, post-purchase, and measurement are separated by timing and action authority |
| Testing | Candidate fixtures prove failures, allowed paths, removal, consent, semantic uniqueness, release, and rollback without buyer data |

## Stretch

A B2B manager asks for a buyer-facing “account eligibility” explanation and a rule that rejects restricted SKU quantities above an approved limit. Extend your surface decision without adding customer data or a live API call. State which information can safely be explanatory in UI, which condition must be enforced server-side, what happens if configuration is absent, and what protected-data/plan/Function input facts require `[VERIFY]`.

## Verification protocol

For an authorised candidate only, record the legacy/source hash, candidate/store/plan context, current checkout configuration, target/API version, app/pixel/Function version, merchant setting, route and controlled cart fixture, selected delivery/payment context, sanitized output/error, event name/count/destination class, consent state, page revisit sequence, owner decision, release window, rollback target, and cleanup date. Compare the same service and same event definition during any tracking cutover. All actual values are `[VERIFY]` until observed and approved.
