<!-- STATUS: final -->
# Chapter 58 — Checkout Is No Longer Yours

Checkout is no longer a place where a theme developer can treat the DOM as an editable canvas. It is a hosted commerce flow with payment, identity, address, delivery, fraud, accessibility, performance, and regulatory responsibilities. That constraint is valuable: a customization that uses Shopify’s approved extension points and server-side decision surfaces is upgrade-safe in a way that a copied checkout snippet never was. The job has changed from *editing checkout* to assigning each requirement to the smallest appropriate platform surface.

A useful rule frames this whole chapter:

> **The theme prepares a cart and communicates pre-checkout intent. Shopify checkout owns payment and order completion. Extensions render approved UI; Functions make bounded commerce decisions.**

The restriction is not merely technical. Checkout UI extensions run in an isolated environment and do not access checkout HTML, sensitive payment information, or arbitrary page assets.[2] A Function is a server-side decision program, not a browser hook. Neither is a license to rebuild checkout, collect data indiscriminately, or bypass merchant, plan, privacy, payment, or release controls.

## 58.1 The `checkout.liquid` timeline: in-checkout steps (Aug 2024), Thank You/Order Status (Aug 2025), non-Plus script tags (Aug 2026)

The old `checkout.liquid` model placed theme-controlled Liquid, markup, CSS, and often JavaScript directly into an unusually sensitive surface. Its retirement happened in stages, so migration work must inventory the *page and customization type*, not merely search a repository for the filename.

| Surface | Status and date | Modern replacement direction |
| --- | --- | --- |
| Information, Shipping, Payment steps | `checkout.liquid` unsupported from **13 August 2024** | Checkout UI extensions, Functions, branding, supported payment extensions |
| Thank you and Order status pages | `checkout.liquid` and additional scripts sunset **28 August 2025** | Checkout UI extensions and web pixel/app integrations |
| Thank you and Order status ScriptTags on Plus | Sunset **28 August 2025** | Approved extensions/pixels rather than injected scripts |
| Thank you and Order status ScriptTags on non-Plus | Sunset **26 August 2026** | Approved extensions/pixels rather than injected scripts |

These dates describe platform policy, not an instruction to delete code blindly. Shopify’s checkout migration guidance calls for a report of current customizations, then a mapping to public apps or custom extensions.[2] The deprecation ledger in this course is the local source of truth for the dates and replacement families.[1] Before any live change, confirm store plan, current checkout configuration, version/activation state, legacy placement, installed apps, customer-event integrations, merchant intent, and release approval `[VERIFY]`.

A complete inventory includes more than `checkout.liquid`: additional scripts, ScriptTags, Preferences, pixels, tag managers, app blocks/embeds, app configuration, custom fonts/branding, checkout settings, and old Script Editor logic. For each item, state its business purpose, buyer-facing effect, decision effect, data it observes or sends, owner, target surface, replacement, test method, rollback, and deletion deadline. “It was pasted by an agency” is provenance, not a business requirement.

Do not infer that every old customization has a one-to-one modern equivalent. Some should become a native setting, an app, a small extension, a Function, a web pixel, or nothing at all. For example, a third-party conversion tag belongs in a reviewed pixel strategy—not in an Order status-page script; a discount decision may belong in a Function, while a cart progress message belongs in the theme; a visual explanation may belong in a checkout UI extension but cannot make the payment decision by itself.

A migration should be staged around a controlled candidate. Capture the legacy behavior with sanitized fixtures; map it; create the new implementation; test its allowed cases and failures; obtain named acceptance; remove the old implementation; and observe the release for the bounded period. Do not test against real buyer identities, payment data, secrets, or unrestricted production traffic. Exact candidate/store, plan eligibility, required checkout configuration, app review, privacy purpose, migration report, and rollback owner are `[VERIFY]`.

## 58.2 Checkout UI Extensions: extension points, capabilities, plan requirements

A Checkout UI Extension is app code rendered at a documented **target**, with documented target APIs and Shopify-provided UI components. It adds a bounded interaction or explanation to checkout rather than granting access to checkout markup. Shopify groups targets into three forms:[3]

| Target form | How it behaves | Design consequence |
| --- | --- | --- |
| Block | Merchant places it in the checkout and accounts editor | Design for valid placement and merchant configuration rather than a fixed DOM selector |
| Static | Renders in a defined, fixed checkout location | It appears at that approved location; it is not freely repositioned |
| Runnable | Responds to a platform event and may return data/functionality without rendering UI | Treat it as a narrowly scoped behavior, not a hidden storefront script |

The extension configuration declares the target and module in `shopify.extension.toml`. A separate module per target makes the placement contract visible in review. The current reference shows `purchase.checkout.block.render` and `purchase.thank-you.block.render` as examples, but a real target must be chosen from the API version’s current target reference `[VERIFY]`.[3] Never invent a target identifier because a location sounds plausible.

UI extensions use a Shopify-provided `shopify` global and the APIs exposed by their target. They use platform web components rather than importing a theme stylesheet or querying page elements. This means a delivery-instruction component might read sanctioned checkout context and update a cart attribute through the applicable API; it must not look for a checkout input by CSS selector, mutate an arbitrary form, or assume the DOM is stable. Change APIs can be rate limited during a buyer session, so batch only necessary independent changes and make success/failure visible.[3]

Capabilities are explicit permission requests, not feature flags to add “just in case.” Current examples include `api_access`, `network_access`, `collect_buyer_consent`, and `block_progress`.[3] Each capability requires a specific product reason, least-data design, user experience, error path, policy/security review, and current plan/availability verification. `network_access` is not permission to send all checkout data to a vendor; it creates a review point for endpoint, authentication, CORS, data minimization, retries, availability, logging, and consent `[VERIFY]`. `block_progress` deserves especially high scrutiny: it can prevent a buyer proceeding, so only use it for a genuine requirement with accessible copy and a non-dead-end failure design.

Plan requirements are surface-specific. The current UI extension documentation states that Information, Shipping, and Payment-step UI extensions are available only to **Shopify Plus** stores.[3] Thank you and Order status capabilities and other extension categories evolve, so do not extrapolate that one plan rule to every target. Verify store plan, extension target eligibility, distribution/app type, checkout configuration, API version, merchant editor placement, protected-customer-data approvals, market/payment context, and release owner `[VERIFY]`. An app’s apparent installation is not evidence that its target is active or valid in the customer’s actual checkout.

The merchant remains an operator. Settings must work safely when unconfigured, content must remain understandable in the platform’s responsive checkout, and the extension must tolerate unavailable optional data. UI handles **interaction and presentation**, but it cannot secretly substitute for durable commerce enforcement. That distinction becomes important when a brief says “prevent checkout,” “calculate a discount,” “remove a payment option,” or “rename shipping.”

## 58.3 Shopify Functions: discounts, delivery, payment, cart validation

Shopify Functions run backend logic within a defined Function API. Shopify invokes them with only the input fields requested by the Function’s input query; the Function returns permitted operations rather than manipulating browser markup. They execute on Shopify’s infrastructure, which makes them the right category for rules that must hold across supported commerce surfaces—not merely appear to work when a particular checkout page loads.[4]

| Requirement | Appropriate Function family | What it decides | What it is not |
| --- | --- | --- | --- |
| Conditional savings | Discount Function | Candidate product, order, and/or delivery savings under the configured discount | A theme price rewrite or a UI-only promise |
| Delivery option treatment | Delivery customization | Hide, reorder, or rename available delivery options | A theme-controlled shipping form |
| Payment option treatment | Payment customization | Approved changes to eligible payment options | A DOM hide/show trick for a payment method |
| Hard cart/order rule | Cart and checkout validation | Returns validation errors that can block progress when rules fail | Client-only validation a buyer can bypass |

The unified Discount Function API can apply savings across product, order, and shipping discount classes from one Function extension; its current documentation also notes a maximum of 25 active discount functions per store and concurrent execution without awareness of one another.[5] This has direct design implications. A discount Function cannot coordinate through shared in-memory state with other active Functions, and “run another Function first” is not a safe ordering strategy. Request only needed fields, declare the applicable discount behavior through the proper Function target/configuration, and test combinations as configured in Admin `[VERIFY]`.

Delivery customization is about the choices Shopify presents: hide, reorder, or rename delivery options. A checkout/order can have more than one delivery method or delivery group, so implementation and testing cannot assume that one order equals one shipping mode.[6] Payment customization likewise belongs to its documented Function surface, not a CSS removal or script that tries to disable payment UI. Verify which operations, payment methods, regions, plans, APIs, and app configurations are currently available before designing a specific rule `[VERIFY]`.

Cart and checkout validation is the durable answer to a real enforceable restriction. Shopify describes validation Functions as server-side rules that can stop checkout progress when requirements fail; they are available across online-store carts, custom-storefront carts, and checkout.[7] A rule such as “this restricted product cannot ship to this location” should be expressed as a bounded validation with a clear error—not merely a theme warning. Conversely, do not turn every merchandising preference into a blocking rule. A warning, UI extension, cart message, native setting, or no change may be more appropriate.

Function configuration is commerce policy. Keep a declarative rule record: business owner; required inputs; excluded cases; buyer-facing message; Function version; merchant settings/metafields; target surface; expected outputs; accessibility/localization; test fixtures; conflict/combination behavior; privacy implications; and rollout/rollback approval. Do not put secrets into Function input configuration or assume arbitrary live network requests. Exact API version, Function target, fetch/network eligibility, plan, protected-data scope, limits, configuration location, and approval are `[VERIFY]` against the current reference.

## 58.4 Shopify Scripts retirement and the Functions migration path

Shopify Scripts were Ruby-like customizations historically managed through Script Editor for areas such as product discounts, shipping, and payment. They are not a current safety net: Shopify states that as of **30 June 2026**, Scripts are deprecated, and published Scripts were deactivated and no longer work.[8] The migration question is therefore not “when should we rewrite the Script?” It is “which business behavior still deserves a supported replacement?”

Shopify’s Scripts customizations report is a useful discovery artefact. It records customizations active before deprecation and can identify payment gateways, shipping, and product-discount categories with relevant Function documentation or app links.[8] Treat the report as a starting inventory, not proof of current behavior. A Script may have become obsolete, have depended on stale product/customer data, conflict with another rule, or lack an exact modern equivalent.

| Old Script concern | Migration decision | Evidence before release |
| --- | --- | --- |
| Product/order/shipping discount | Review existing Function-based app or build a Discount Function | Input/output fixtures, discount combination behavior, merchant configuration |
| Shipping treatment | Delivery customization Function if current API expresses the rule | Multiple delivery groups, markets, addresses, pickup/local delivery cases |
| Payment selection rule | Payment customization Function if current API expresses the rule | Eligible payment methods, region/market/plan, buyer-visible outcome |
| Cart/order restriction | Validation Function if it is a genuine enforceable rule | Blocking and non-blocking cases, accessible message, cart + checkout surfaces |
| No continuing requirement | Retire it | Owner approval and absence of dependent reports/processes |

A Function-based app is installed and configured through app/Admin surfaces rather than by copying code into each store. Shopify’s migration guidance notes that custom Function-based apps must be created through the Partner Dashboard and connected to the store; custom apps created only in Shopify Admin do not support Shopify App Bridge for that path.[8] Confirm current distribution rules and app architecture `[VERIFY]`; do not treat a course example as instructions to create, install, publish, or modify an app.

A correct migration also accepts changed implementation boundaries. A Script that reads a wide implicit object graph may need a smaller requested input query, explicit configuration, or a different feature split. Do not recreate its accidental behavior—especially customer-data exposure, undefined ordering, opaque global state, or UI dependency—merely because an old report contains it.

## 58.5 What still belongs in your theme: cart page, cart drawer, pre-checkout logic

The theme still has an important role, but it ends before hosted checkout. It owns storefront composition: cart page and cart drawer markup, product recommendations, transparent merchandising, accessibility, performance, non-authoritative validation feedback, cart attributes where supported, and the explanation of what will happen after the buyer starts checkout.

| Need before checkout | Theme responsibility | Checkout/Function boundary |
| --- | --- | --- |
| Cart presentation and editing | Render cart/drawer, line-item controls, accessible errors, optimistic UI safely | Must tolerate server/cart changes and never assume it controls checkout |
| Helpful rule explanation | Explain eligibility, progress, or restriction before checkout | Only a Function can enforce a rule across supported cart/checkout surfaces |
| Collection of optional intent | Use documented cart attributes/metafields/app flows with clear purpose | A UI extension/Function consumes only authorised supported inputs |
| Delivery/payment preview | Present non-authoritative guidance | Shopify checkout and Functions calculate actual eligible options |
| Promotion | Merchandising content and clearly scoped UI | Discount Function/native discount makes the actual pricing decision |

The theme must not fake authority. Hiding a checkout button, changing a displayed subtotal, suppressing a payment option in CSS, or declaring shipping eligibility from a static Liquid condition is not durable enforcement. It creates contradictions when a cart changes, when Shop Pay or an accelerated flow is used, when the buyer reaches checkout through a different surface, or when Shopify recomputes the commerce state. The theme should tell the truth about its boundary: “estimated,” “subject to checkout validation,” or “availability confirmed at checkout” where applicable.

A theme can prepare good Function input indirectly through deliberate merchant configuration and supported cart state, but that is an explicit contract. Document the attribute/metafield namespace/key, writer, reader, allowed values, lifecycle, privacy classification, default/failure behavior, and cleanup. Verify whether a target supports the chosen data surface, whether customer input is appropriate, and whether the rule needs server enforcement `[VERIFY]`. Never use a hidden theme field as a security mechanism.

## 58.6 Order status and post-purchase surfaces today

The final checkout pages serve different moments. The **Thank you** page is the initial purchase confirmation immediately after checkout. If the buyer returns later or checks status, Shopify shows the **Order status** page.[9] Order status can be revisited during order creation and fulfilment, including from a confirmation-email link; it is not a single-fire page-load event.

| Surface | Suitable use | Important boundary |
| --- | --- | --- |
| Thank you UI extension | Confirmation-adjacent content such as a survey or social prompt | The order may not yet be created, though an order ID is available |
| Order status UI extension | Repeat-safe information, review request, downloads, fulfilment-adjacent content | Order is available; design for revisits and current order state |
| Post-purchase extension | A controlled offer between payment and Thank you where eligible | It is a separate specialized flow, not arbitrary Order status DOM access |
| Web pixel | Approved event collection | It is not buyer-facing UI and follows its own consent/event boundary |

Thank you and Order status UI extensions can add custom content, but Shopify documents no UI-extension API that directly mutates an order. If a use case needs a change to the order being created, evaluate the post-purchase extension surface instead—and verify eligibility, access, payment behavior, app review, merchant configuration, and rollback `[VERIFY]`.[9] The post-purchase offer tutorial is currently marked beta and says live-store use requires access approval, so it must never be assumed available in a merchant plan or production store.[10]

The Thank you page’s timing matters. Shopify says the order is not yet created when a Thank you extension renders, even though it provides an order ID. Code should not assume order data is immediately complete; use the documented confirmation/order APIs and a defined, authenticated app flow where truly necessary. On Order status, the order is available, but repeated visits mean content and events need idempotence. A review request can be safely repeat-aware; a one-time financial operation cannot be hidden behind page refresh behavior.

Migration design should separate three often-confused requirements: **displaying content**, **changing commerce state**, and **recording an event**. The first may be a UI extension; the second may require a documented specialized checkout/app surface; the third may be a consent-aware web pixel. Record the precise target, actor, data, idempotency key, failure behavior, privacy purpose, version, merchant setting, candidate fixture, and owner. Verify page target, surface eligibility, order/API timing, authentication, app/pixel activation, privacy configuration, and release approval `[VERIFY]`.

The durable outcome is a checkout that the theme does not pretend to own: merchandising stays honest in the cart, enforcement is expressed in Functions, buyer-facing checkout content uses targets, pixels collect approved events, and post-purchase work respects page timing and the customer’s ability to return.

## References

[1]: ../../../docs/DEPRECATIONS.md "Course deprecation ledger — verified 2026-08-13"
[2]: https://shopify.dev/docs/apps/build/checkout "Shopify — Apps in checkout"
[3]: https://shopify.dev/docs/api/checkout-ui-extensions/latest "Shopify — Checkout UI extensions"
[4]: https://shopify.dev/docs/apps/build/functions "Shopify — About Shopify Functions"
[5]: https://shopify.dev/docs/api/functions/latest/discount "Shopify — Discount Function API"
[6]: https://shopify.dev/docs/apps/build/checkout/delivery-shipping "Shopify — Delivery and shipping functions"
[7]: https://shopify.dev/docs/apps/build/checkout/cart-checkout-validation "Shopify — Cart and checkout validation"
[8]: https://help.shopify.com/en/manual/checkout-settings/script-editor/transitioning-to-functions "Shopify Help — Transitioning from Shopify Scripts to Shopify Functions"
[9]: https://shopify.dev/docs/apps/build/checkout/thank-you-order-status "Shopify — Thank you and Order status customization"
[10]: https://shopify.dev/docs/apps/build/checkout/product-offers/build-a-post-purchase-offer "Shopify — Build a post-purchase product offer"
