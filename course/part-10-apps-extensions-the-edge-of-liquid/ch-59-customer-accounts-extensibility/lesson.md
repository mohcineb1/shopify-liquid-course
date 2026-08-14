<!-- STATUS: final -->
# Chapter 59 — Customer Accounts Extensibility

A customer account is no longer automatically a Liquid template inside the Online Store theme. Shopify’s current customer-account experience is a hosted, authenticated product surface connected to checkout and account infrastructure. That change matters architecturally: a theme may provide account entry points and storefront context, but it does not own the account portal’s markup, session model, order data, or internal navigation.

The engineering question is not “how do we restyle `customers/account.liquid`?” It is “which account version is active, what buyer outcome is required, and which bounded Shopify surface owns it?” A safe answer may be a built-in setting, an app/UI extension, a pixel, a theme account component/link, a headless Customer Account API implementation, or deliberate non-customization. It is never a reason to paste account-page DOM code into `theme.liquid`.

> **Account UX is an identity and customer-data surface. Theme presentation, app extensions, account APIs, tracking, and B2B policies therefore have separate owners and separate trust boundaries.**

## 59.1 New customer accounts vs classic — the architectural difference

Shopify now calls the older model **legacy customer accounts**. It uses email/password authentication and was historically rendered through theme account templates. The current model is **customer accounts**: a centralized Shopify-hosted account experience with passwordless sign-in by a six-digit email code, optional Google/Facebook social sign-in, and—on Shopify Plus—an option to connect an external identity provider.[1] Legacy customer accounts are deprecated; Shopify advises upgrading to the current version and notes a 30-day reversion window.[2]

| Dimension | Customer accounts (current) | Legacy customer accounts |
| --- | --- | --- |
| Sign-in | Passwordless email code; supported social sign-in | Email and password |
| Account creation | A new email sign-in can create a customer profile | Separate registration page or account invite first |
| Primary architecture | Shopify-hosted, centralized portal | Theme/Liquid-oriented account pages |
| Branding source | Checkout and accounts settings/editor | Online Store theme settings |
| Customization family | Built-in options and app-based extensions | Theme Liquid customization |
| Customer features | Saved payment methods, returns, store credit, Buy again, B2B, Markets | More limited feature set |
| Identity integration | OAuth 2.0/OIDC provider for eligible Plus stores | Multipass model; no equivalent SSO support |

The difference is more than login UX. In the current model, successful sign-in creates a durable account session and customer data can prefill checkout.[1] The portal is not delivered by the theme’s normal Liquid rendering pipeline, so its HTML/CSS/JS is not a theme asset contract. A theme developer who assumes the old `customer` object, page URL, password flow, form, or DOM structure still owns the account experience will build an integration that is brittle at best and unsafe at worst.

Customer accounts deliberately connect to current platform features. Shopify lists self-serve returns, saved payment methods, store credit, Buy again, B2B, and Markets as current-account capabilities not shared by legacy accounts.[2] This is a product-capability comparison, not permission to expose data or enable a feature. Verify active account version, plan, identity-provider setup, Markets/B2B configuration, policy, customer-data permissions, migration timing, and account-owner approval `[VERIFY]` before proposing a live change.

Migration begins with an outcome inventory. Record every legacy account template, snippet, JavaScript hook, CSS override, custom form, Multipass/identity flow, app widget, return/subscription/loyalty integration, analytics tag, navigation link, and support process. For each, ask whether it remains a requirement, which actor owns it, which data it uses, and whether the new portal supplies it natively. “Our old account page had it” is history, not a business requirement.

| Legacy capability | First question | Potential current direction |
| --- | --- | --- |
| Password registration/login | Is a password/registration experience required or merely familiar? | Current sign-in/account component; Plus identity provider only if verified |
| Account CSS/layout | Is it branding, missing content, or a UI feature? | Checkout/accounts editor, extension, or headless—not theme selectors |
| Return/subscription/order action | Is native/account-app support sufficient? | Native feature, reviewed app, or account UI extension |
| Account tracking | What event/purpose/consent contract exists? | Approved pixel/account-pixel configuration `[VERIFY]` |
| Private dashboard | Does it truly need complete frontend ownership? | Bounded full-page extension or headless Customer Account API `[VERIFY]` |

Do not equate “current” with universally available. Store plan, account version, domain, sign-in options, app distribution, API version, protected-customer-data approval, account-editor configuration, and precise eligibility are operational facts `[VERIFY]`. Preserve alternatives: native feature, reviewed app, deferral, or a real headless account program when hosted extension slots cannot satisfy the requirement.

## 59.2 What you can and cannot theme

The Online Store theme still owns **the storefront**. It can render a header account affordance, an account component where supported, a sign-in link, links to account pages, pre-authentication explanatory content, cart/product/collection experiences, and visual consistency on theme-controlled pages. It does not own the current customer-account portal’s document structure or its internal defaults.

| Need | Theme may own | Theme must not assume |
| --- | --- | --- |
| Account entry | Link/component placement, accessible label, storefront context | Portal markup, password form, or account-session internals |
| Branding | Theme pages around sign-in/account journey | Arbitrary CSS/JS injection into hosted account pages |
| Default account copy | Theme copy where the theme renders it | That account portal text is a Liquid locale string |
| Account page content | Link to account/app surface | Hiding/replacing built-in content with selectors |
| Customer data workflow | Explain purpose and route to approved feature | Read/emit private account data from browser globals |
| Feature navigation | Storefront-to-account navigation | Hardcoded portal DOM/URL assumptions |

For customer accounts, Shopify provides account branding and content controls through checkout and account settings/editor; it says default customer-account wording can be edited in the Customer accounts tab of theme content, while app-block wording depends on app-provided settings.[3] That does not grant Liquid control over the portal. The distinction between **content configuration** and **document ownership** protects the account from theme updates, arbitrary scripts, and inaccessible browser hacks.

Several limits are particularly important. Shopify says custom text/content blocks on the sign-in page are unsupported; passwords are unsupported in the default current sign-in experience; requiring a registration form before sign-in/checkout is unsupported; and built-in account content cannot be hidden based on customer data.[3] A developer should respond with a product decision, not an imitation. For example, onboarding explanation can live on a storefront page or supported account/app surface; custom fields can be collected after sign-in through an appropriate app/extension; B2B access requests use a supported B2B registration process. Verify merchant policy and current eligibility `[VERIFY]`.

The theme may participate in cross-surface navigation, but it makes no privacy/authentication claim it cannot prove. An account link needs a clear accessible name and safe fallback. A signed-in state indicator in theme Liquid, where available, is not permission to expose private account data to JavaScript or to infer a hosted portal’s current state. Customer identity, session duration, external identity provider, profile merge/edit behavior, consent status, and data-protection approvals are not theme settings; confirm them with authorised owners `[VERIFY]`.

A custom domain needs its own record. Current guidance says customer accounts can use a single subdomain of the store’s primary domain, while market-specific customer-account domains are unsupported.[3] Do not hardcode an account host into theme or extension code. Record approved domain, redirect behavior, locale/market, identity provider, audience, test account, fallback, owner, and rollback `[VERIFY]`.

When requirements demand complete markup/layout/control rather than defined hosted slots, the option is not “more Liquid.” Shopify identifies the Customer Account API as the headless route for fully bespoke authenticated account experiences.[3] That is a separate application/security program with identity, customer-data, backend, consent, support, accessibility, and operations ownership. Choose it only after showing why built-in features and extensions cannot safely meet the need.

## 59.3 Extension points and B2B considerations

Customer account UI extensions are app-based components at documented targets. They combine a target, target APIs, and Shopify UI web components; the runtime exposes a `shopify` global with target-scoped capabilities rather than portal DOM.[4] Start with buyer outcome, then choose target type.

| Target type | Best use | Merchant/control implication |
| --- | --- | --- |
| Block | Independent content at an editor-selected location | Merchant places it through checkout/accounts editor; up to three extensions may share a block location |
| Full page | Dedicated journey such as loyalty dashboard or subscription management | A page target can enter account navigation; order-specific pages remain contextual |
| Static | Feature-bound UI such as an order action or announcement | Renders only where the associated feature exists |

Exact target identifier, page availability, API version, placement, app type, and plan/distribution eligibility must be verified in current documentation `[VERIFY]`.[4] Do not invent a target because it resembles an old template position. An order-context component belongs at a relevant order target; an account-wide dashboard can be a full page; simple contextual explanation can be a block. If no supported slot works, redesign or evaluate headless—not DOM scraping.

Capabilities are deliberate requests. Current customer-account extension capabilities include `api_access`, `network_access`, and `collect_buyer_consent`.[4] `api_access` permits Storefront API queries; `network_access` enables external backend calls and requires authentication/CORS design; consent collection must map to an actual approved policy/purpose. If an extension accesses customer data, Shopify requires protected-customer-data approval before go-live.[4] Start with no capability and add only what the user outcome needs. A help card might need none; a loyalty balance from an app backend could need network access and session-token handling; both need data minimization, errors, ownership, and privacy review `[VERIFY]`.

Metafields are an explicit contract, not a way to dump account data into an extension. Current account extensions can use declared metafields across customer, order, company, company location, product, variant, cart, and shop; app-owned metafields use the `$app` form and belong only to the parent app.[4] Define namespace/key, owner, reader/writer, type, allowed values, lifecycle, locale/market/B2B scope, fallback, retention, and protected-data classification. Request only keys actually needed.

B2B changes the meaning of “customer account.” Customer accounts are compatible with Shopify B2B, while legacy accounts are not.[2] Authority may be a company and company location as well as a customer. Shopify identifies B2B-specific Profile targets and market-based editor configuration including B2B company locations.[3] Therefore, do not assume every signed-in account is a consumer, every order has the same policy, or an account-level setting applies to every company location.

| B2B question | Required decision |
| --- | --- |
| Audience | Consumer, all B2B contacts, or a company/location subset? `[VERIFY]` |
| Data | Is customer, company, or company-location data approved and minimized? `[VERIFY]` |
| Placement | Is a B2B Profile target or market/location configuration appropriate? `[VERIFY]` |
| Action | Is it explanatory, account operation, checkout rule, or Admin workflow? Assign the correct surface |
| Failure | What is shown when company context, permission, or configuration is absent? |
| Release | Which company/location candidate, market, version, reviewer, and rollback record prove behavior? `[VERIFY]` |

For example, displaying a reseller credit policy may be company/location-scoped account explanation; changing a payment term is not automatically a UI-extension action. “Request wholesale access” has a supported B2B registration path; it is not a theme registration form bolted onto passwordless accounts.[3] Separate display from authority and keep company data out of broad browser payloads.

Customer-account analytics needs the same discipline. Shopify says pixel support for customer accounts requires a custom account subdomain; after that, installed pixel apps can track `page_viewed` across account pages.[3] This is not a direction to activate tracking. Verify purpose, consent, custom domain, pixel state, event contract, regional settings, data exposure, and owner `[VERIFY]`. An extension must not add unreviewed third-party script loading merely to meet an analytics request.

The sustainable architecture is compositional: the theme provides a safe doorway; Shopify hosts identity and the portal; native settings solve native needs; extensions fill approved slots; B2B adds company/location context; pixels collect only approved events; and headless is a separate full-ownership decision. Each layer needs a named owner, current-reference check, data boundary, candidate fixture, and rollback plan.

### Account migration review: a practical sequence

A good account migration is a sequence of evidence, not a theme deployment. First, capture a sanctioned legacy baseline: account entry paths, authenticated/anonymous state, return/subscription/loyalty outcomes, support processes, B2B company/location variants, branded content, analytics purpose, and the actual customer task each old template served. Use controlled test accounts only. Do not put customer email addresses, order data, identity-provider configuration, cookies, account session tokens, or private screenshots in the repository.

Second, classify each desired outcome. Built-in capability wins when it meets the requirement without custom data or lifecycle ownership. A reviewed app or customer-account UI extension is appropriate when the need fits a documented slot and target API. A theme change is limited to the storefront doorway and pre-authentication experience. A headless implementation is justified only when the product explicitly needs full frontend ownership and accepts the corresponding authentication, backend, privacy, accessibility, and operational obligations. Retirement is a valid outcome when the old behavior cannot be named, approved, or tested.

Third, write the account integration record before code. It should identify the active account mode, target/target class, app and API version, merchant placement, account domain, intended audience, required capability, minimal data inputs and output, customer/company/company-location scope, sensitive-data classification, consent purpose, loading/error/empty state, navigation behavior, test fixture, owner, release state, removal path, and rollback. Every production-specific value remains `[VERIFY]` until observed by an authorised owner.

Finally, validate by task rather than screenshot. Exercise a signed-out route, successful current-account sign-in, expected account navigation, unavailable optional data, an account with no orders, an order context where applicable, a B2B company-location context where applicable, translated/long content, and a customer-data denial/error path. Confirm that theme pages never depend on portal DOM, that extensions disclose only needed data, that network calls fail safely, and that a disabled or removed app leaves the core account usable. This turns “the account page looks branded” into a testable account contract.

## References

[1]: https://help.shopify.com/en/manual/customers/customer-accounts "Shopify Help — Customer accounts"
[2]: https://help.shopify.com/en/manual/customers/customer-accounts/upgrade/compare-features "Shopify Help — Customer accounts and legacy customer accounts"
[3]: https://help.shopify.com/en/manual/customers/customer-accounts/upgrade/customization-options "Shopify Help — Customization options for upgrading customer accounts"
[4]: https://shopify.dev/docs/api/customer-account-ui-extensions/latest "Shopify — Customer account UI extensions"
