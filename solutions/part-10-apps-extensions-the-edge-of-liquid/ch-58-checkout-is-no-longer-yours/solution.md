<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 58 — Solution

## The approach

The starter fails because it treats all buyer-facing commerce behavior as theme JavaScript. The fix is not to translate the same selectors into a newer framework. Each requirement needs a decision about **authority**:

| Requirement | Correct owner | Why |
| --- | --- | --- |
| Restricted-item purchase rule | Cart and Checkout Validation Function `[VERIFY]` | A server-side validation can consistently enforce the defined rule across supported cart/checkout surfaces |
| Helpful restricted-item warning | Theme cart | The theme can explain the rule before checkout but cannot enforce it |
| Payment-method change | Payment customization Function only if current API/eligibility supports it `[VERIFY]` | Browser DOM hiding is neither durable nor authoritative |
| VIP delivery treatment | Delivery customization / reviewed Function-based app if current requirement exists `[VERIFY]` | Delivery decisions belong to a bounded commerce decision surface |
| Buyer-facing checkout information | Checkout UI Extension | The target and API expose controlled presentation/interaction, not checkout DOM |
| Conversion collection | App/custom pixel strategy `[VERIFY]` | Measurement is not a Thank you-script responsibility |
| Warranty offer | First define user value; eligible post-purchase extension or Order status UI, otherwise retire/simplify `[VERIFY]` | Thank you, Order status, and post-purchase have different timing and order actions |

The solution intentionally does **not** build an app, edit a checkout configuration, or supply a real Function target. That would make unobserved plan, app, current API, merchant configuration, payment, privacy, and release facts look settled. Instead it produces enough concrete records for an authorised implementation to proceed safely.

## 1 — Dated retirement inventory

`records/retirement-inventory.md` begins with the platform timeline, then records every source. The important discovery is that source *location* and product *purpose* are separate fields.

```md
# Retirement inventory

| Source | Surface / status | Actual claimed purpose | Replacement decision | Exit condition |
| --- | --- | --- | --- | --- |
| `layout/checkout.liquid` | In-checkout; unsupported after 2024-08-13 | Payment method DOM suppression plus remote tracking | Delete; decide payment rule separately and move measurement to pixel review | Candidate confirms no active dependency/approved release |
| `assets/checkout-hacks.js` | Legacy in-checkout/confirmation behavior | DOM hiding plus vendor conversion event | Delete; payment Function feasibility and pixel mapping assessed independently | No selector/queue request in candidate evidence |
| Additional-script-like confirmation tracker `[VERIFY]` | Thank you/Order status sunset 2025-08-28 | Conversion tracking | Pixel/app migration, not UI script | Same-service event definition/consent validation accepted |
| Non-Plus page ScriptTag `[VERIFY]` | Scheduled sunset 2026-08-26 | Unknown | Inventory and remove/migrate | Current store plan/date/configuration verified |
| `scripts/vip-shipping.rb` | Shopify Scripts; deactivated/no longer working after 2026-06-30 | VIP delivery pricing | Confirm current requirement, then reviewed Function-based app or retire | Function/app or retirement acceptance |
| `sections/main-cart-footer.liquid` | Theme cart, still valid surface | Explanation of restricted-item rule | Keep explanatory guidance only | Warning and normal checkout route tested |
| `post-purchase-notes.md` | Conflated post-payment request | Warranty, survey, download, edit, tracking | Split by page/action authority | Separate approved plans/retirements |
```

The date facts come from the course ledger and Shopify’s current checkout documentation: in-checkout `checkout.liquid` became unsupported on 13 August 2024; Thank you/Order status `checkout.liquid` and additional scripts sunset on 28 August 2025; non-Plus ScriptTags on those pages sunset on 26 August 2026.[1] Shopify Scripts were deprecated and published Scripts deactivated on 30 June 2026.[2] Store plan, whether a legacy source exists, exact configuration state, and every owner remain `[VERIFY]`.

A source is only deleted after its replacement has a named owner, candidate evidence, accepted semantics, release decision, bounded monitoring, rollback target, and cleanup record. The rollback points to an approved configuration/previous version; it is not “put the unsafe browser hack back.”

## 2 — UI proposal and capability discipline

The buyer-facing informational need is: explain that restricted items are reviewed by a server-side rule and direct the buyer to adjust the cart if the rule fails. The proposed extension has a **block target class**, so a merchant can choose an approved placement in the checkout editor. The exact target, plan eligibility, app type, API version, merchant placement, and configuration are `[VERIFY]` against the current reference—not guessed from a CSS selector.

`records/checkout-ui-proposal.md` contains this contract:

| Contract field | Decision |
| --- | --- |
| Purpose | Explain a defined restriction and next action; do not decide eligibility |
| Target class | Block `[VERIFY]` exact current target/eligibility |
| Data | Minimal configuration/message and sanctioned checkout context only `[VERIFY]` |
| Capability | No network, consent collection, or progress blocking requested for this informational version |
| Merchant control | Placement and safe optional message setting; usable default when unset |
| Boundary | No checkout DOM, payment data, browser selector, secret, or customer-data transfer |
| Failure state | Keep core checkout usable; show concise neutral fallback or no extra content |
| Test | Candidate placement, unset config, narrow/mobile layout, unavailable optional data, accessible reading order |

This has no `network_access` because it does not need a remote vendor. It has no `block_progress` because explanation must not become enforcement. If a later requirement needs either capability, create a separate request that explains the business need, data path, error behavior, privacy/security review, plan availability, and owner `[VERIFY]`. Checkout UI extensions are isolated and cannot access sensitive payment data or checkout HTML, so porting `querySelector('[data-payment-method]')` is categorically wrong.[3]

## 3 — Validation Function specification

A restricted-item rule that must hold at checkout is a **Cart and Checkout Validation Function** candidate. Shopify describes validation Functions as server-side logic that can block checkout progress when the defined conditions fail.[4] The Function should request only input fields needed to identify the controlled product/quantity/configuration; the exact schema and target are `[VERIFY]` from the current Function API.

```md
# Restricted-item validation contract

## Rule
A cart containing a product in the approved restricted set must meet the approved eligibility condition before purchase can complete. Product set, condition, markets, and exceptions: `[VERIFY]`.

## Inputs
Only cart lines, merchandise/configuration identifiers, quantities, and the minimum sanctioned context necessary for the rule `[VERIFY]`. Do not request buyer identity, payment data, or broad address data unless the approved rule/documentation requires it.

## Output
A localized, buyer-safe validation error that says what to change, without exposing internal policy or eligibility data. Exact message/locale behavior: `[VERIFY]`.

## Fixtures
- Restricted line that fails the approved condition -> one clear error.
- Restricted line that meets the condition -> no error.
- Unrestricted line -> no error.
- Mixed cart / quantity boundary / absent configuration -> documented safe behavior.
- Same fixtures on supported cart and checkout paths `[VERIFY]`.

## Governance
Business owner, Function/app version, configuration record, input query, combination/conflict behavior, accessibility/localization reviewer, candidate evidence, rollout, monitoring, and rollback: `[VERIFY]`.
```

This replaces the fake theme claim “Checkout is blocked.” It does not imply that all validation Functions work in every plan, market, payment context, or custom configuration. Confirm current availability and feature entitlement before implementation `[VERIFY]`. A UI extension may show an explanation; it must not substitute for the Function. Conversely, do not block a buyer merely because an optional merchant preference can be explained safely.

## 4 — Scripts report and delivery rule migration

The shipping Ruby file is a historical input to discovery, not executable fallback code. Shopify’s Scripts customizations report lists relevant pre-deprecation payment, shipping, and product-discount customizations and links to migration resources.[2] The correct first question is whether the VIP shipping outcome is still desired, not how to reproduce Ruby syntax.

`records/scripts-migration.md` makes the paths explicit:

| Discovery question | Decision if confirmed | Evidence |
| --- | --- | --- |
| Does “VIP” still define a delivery benefit? | Model the current policy, not the old tag check | Business owner and written policy `[VERIFY]` |
| Can the current delivery Function API express the required hide/reorder/rename or price behavior? | Build/review the documented Function route or a reviewed Function-based app | Current API, plan, configuration, multi-delivery-group fixtures `[VERIFY]` |
| Is a maintained Function-based app suitable? | Review/install only through authorised merchant workflow | Vendor, permissions, data, cost, activation, rollback `[VERIFY]` |
| Is the rule obsolete or unsupported? | Retire/simplify it | Stakeholder acceptance and reporting/process impact |

A delivery option decision must tolerate multiple delivery groups/methods rather than assume one shipping rate for a whole order.[5] The payment-method DOM hack is independently retired. If an actual payment rule remains, evaluate the current payment customization Function documentation and eligibility `[VERIFY]`; no cart CSS or checkout JavaScript is a replacement.

## 5 — Corrected theme boundary

The cart now provides useful guidance while preserving a normal checkout route. The only authoritative statement is that final eligibility is validated by checkout—not that the theme has prevented anything.

```liquid
{{ 'cart-boundary.css' | asset_url | stylesheet_tag }}

<div class="cart-boundary" role="status">
  <p class="cart-boundary__notice">
    Some items have purchase restrictions. Final eligibility is validated at checkout.
  </p>
  <a class="cart-boundary__checkout" href="{{ routes.cart_url }}">
    Review cart and continue to checkout
  </a>
</div>
```

The actual theme should use its documented cart/checkout form route rather than blindly copying the simplified starter URL `[VERIFY]`. Crucially, the CSS no longer hides the action and there is no script that inspects protected checkout state. The theme can also display a non-authoritative explanation based on its own documented cart data, but the validation Function is still required to enforce a real rule across supported paths.

```css
.cart-boundary {
  border-inline-start: 0.25rem solid currentColor;
  padding: 1rem;
}

.cart-boundary__notice { margin-block: 0 0.75rem; }
.cart-boundary__checkout { display: inline-block; }
```

## 6 — Thank you, Order status, post-purchase, and measurement

The starter conflates four distinct surfaces. The **Thank you** page is initial confirmation; an extension there cannot assume the order is already created, though its order ID is available. **Order status** is revisitable and has order availability, so its content must be repeat-safe. Shopify UI extensions cannot directly mutate an order; a specialized eligible post-purchase flow may be considered when the action must change the completed purchase.[6]

| Request | Decision | Rationale and safety condition |
| --- | --- | --- |
| Survey | Thank you UI extension `[VERIFY]` | Initial confirmation prompt; record submission idempotently and minimise data |
| Digital download link | Thank you and/or Order status UI `[VERIFY]` | Revisit-safe entitlement and authenticated delivery design required |
| Product review prompt | Order status UI `[VERIFY]` | Revisit-safe request, no duplicate incentive/action |
| Warranty upsell | Post-purchase only if approved/eligible; otherwise Order status informational content or retire `[VERIFY]` | Do not promise order mutation from a basic page UI extension |
| Conversion tracking | Reviewed web pixel/app mapping `[VERIFY]` | Collection is separate from page UI and subject to consent/event contract |

The current post-purchase offer guide is beta and says live stores require access approval.[7] That makes it a conditional option, not the default answer. The plan records user value, target eligibility, payment/order timing, idempotency key, consent/data purpose, merchant configuration, page revisit behavior, failure/decline route, candidate evidence, release owner, and alternative (Order status content, public app, simplification, or retire) `[VERIFY]`.

## 7 — Candidate validation matrix

`records/validation-matrix.md` uses controlled fixtures only. It checks that the cart notice remains accessible and checkout navigation is available; the validation Function produces one clear error only for failing restricted fixtures; the UI block works with absent config and no unrequested capability; delivery/payment are decisions rather than DOM hacks; legacy files/scripts are absent after acceptance; Thank you and Order status prove correct timing/revisit behavior; and a pixel sends no optional event without its allowed consent state. Capture only candidate, version, route, fixture, plan/configuration state, sanitized output/event shape/count, owner decision, release window, rollback target, and cleanup date.

## What people get wrong here

**Treating deprecated artifacts as requirements.** A checkout Liquid file or Script has no inherent business value. Recover the requirement, then choose a current surface—or deliberately retire it.

**Replacing a payment decision with CSS.** It can look correct in a screenshot while leaving other checkout paths unchanged. A payment rule needs a documented commerce decision surface, current eligibility, and tests.

**Calling every post-payment page “Thank you.”** Thank you timing, revisitable Order status, specialized post-purchase order changes, and pixel collection are different contracts. Conflation creates duplicate events and invalid order-state assumptions.

**Over-requesting extension capabilities.** A simple informational component should not request network access, buyer consent collection, or progress blocking merely because those permissions exist.

## References

[1]: ../../../docs/DEPRECATIONS.md "Course deprecation ledger — verified 2026-08-13"
[2]: https://help.shopify.com/en/manual/checkout-settings/script-editor/transitioning-to-functions "Shopify Help — Transitioning from Shopify Scripts to Shopify Functions"
[3]: https://shopify.dev/docs/api/checkout-ui-extensions/latest "Shopify — Checkout UI extensions"
[4]: https://shopify.dev/docs/apps/build/checkout/cart-checkout-validation "Shopify — Cart and checkout validation"
[5]: https://shopify.dev/docs/apps/build/checkout/delivery-shipping "Shopify — Delivery and shipping functions"
[6]: https://shopify.dev/docs/apps/build/checkout/thank-you-order-status "Shopify — Thank you and Order status customization"
[7]: https://shopify.dev/docs/apps/build/checkout/product-offers/build-a-post-purchase-offer "Shopify — Build a post-purchase product offer"
