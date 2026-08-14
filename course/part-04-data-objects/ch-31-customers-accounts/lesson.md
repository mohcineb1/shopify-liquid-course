<!-- STATUS: final -->
---
id: ch-31
title: "Customers & Accounts"
part: 4
---

# Chapter 31 — Customers & Accounts

Customer-facing account work fails when a theme confuses a logged-in customer object with an authorization system, assumes all account pages are Liquid-owned, or displays order/payment information without respecting the account surface that owns it. Shopify now differentiates the latest customer accounts, which Shopify controls and extends through components/extensions, from legacy Liquid account templates that are deprecated. Build personalization as a guarded storefront enhancement, use the customer/order data Shopify exposes in the appropriate context, and treat tags as presentation signals—not security.

## What you’ll be able to do

- Render customer identity, orders, addresses, and tags only in valid customer contexts.
- Identify the boundary between legacy theme account templates and the current customer-account experience.
- Recognize the roles of the `customers/*` templates without designing new work around deprecated surfaces.
- Present order, fulfillment, line-item, and transaction information accurately and safely.
- Use a customer tag for cosmetic/personalized content while refusing to treat it as access control.

## 31.1 The `customer` object, `customer.orders`, addresses, tags

The global `customer` object is available when a customer is logged in. It is also defined in `customers/account`, `customers/addresses`, and `customers/order` contexts, plus customer-bearing checkout, gift-card, and order objects. Outside those contexts, it returns `nil` when no customer is logged in. Always guard it before using personal fields in general storefront surfaces. [1]

```liquid
{% if customer %}
  <p>Welcome back, {{ customer.first_name | escape }}.</p>
  <a href="{{ routes.account_url }}">View account</a>
{% else %}
  <a href="{{ routes.account_login_url }}">Sign in</a>
{% endif %}
```

Useful customer data includes `id`, name/email/phone fields, `accepts_marketing`, `has_account`, `addresses`, `addresses_count`, `default_address`, `orders`, `orders_count`, `last_order`, `tags`, `total_spent`, and B2B/company context where supported. That breadth does not justify exposing all of it: a header may need a name and account link, while an account history needs dates/status/totals. The theme should select the smallest appropriate projection of personal data.

`customer.orders` is paginable, with Shopify documenting up to 20 orders per page; `customer.addresses` is also paginable up to 20 at a time. Use `{% paginate %}` rather than assuming an account list is small. A customer’s `tags` is an array of merchant/admin labels. It can support a visible welcome message or navigation cue, but tag presence alone proves only the current Liquid data, not entitlement to a protected resource. [1]

```liquid
{% paginate customer.orders by 10 %}
  <ul>
    {% for order in customer.orders %}
      <li><a href="{{ order.customer_url }}">{{ order.name | escape }}</a> — {{ order.total_price | money }}</li>
    {% endfor %}
  </ul>
  {{ paginate | default_pagination }}
{% endpaginate %}
```

> [VERIFY] Confirm availability of customer fields, B2B company context, payment methods, and store-credit data in the account mode and market you support. The `customer` object is context-sensitive, and account capability is not a reason to expose personal data by default.

## 31.2 Classic customer accounts vs new customer accounts — what still lives in your theme

The platform boundary changed materially in 2026. Shopify announced on February 26, 2026 that legacy customer accounts are deprecated, unavailable to new stores and existing stores not using them, with a final sunset date to be announced later in 2026. Shopify recommends upgrading to the latest customer accounts; theme developers should no longer include legacy customer-account Liquid files. A legacy store that upgrades to a theme without those files is automatically upgraded to the latest customer-account experience. [2]

The latest account experience is not a theme Liquid account portal. Customer account pages are Shopify-owned and can be extended through customer account UI extensions. A theme can now include `<shopify-account>` in its header. When active customer accounts are used, this component opens an account sheet; signed-out customers see sign-in options, while signed-in customers see an avatar and account navigation. Shopify controls the component and may update it independently, so a theme may apply supported styling but cannot take ownership of the sheet’s internal experience. [3]

```liquid
{% if shop.customer_accounts_enabled %}
  <shopify-account menu="customer-account-main-menu"></shopify-account>
{% endif %}
```

On July 30, 2026 Shopify made the component a Theme Store requirement for new themes and updates, visible on desktop and mobile. That is a distribution requirement, not a promise that every storefront build can restyle account pages like a legacy Liquid template. For new customer-account capabilities, route rich account-page work to customer account UI extensions or the Customer Account API for custom storefronts. [4]

| Surface | Theme owns | Shopify / extension owns |
| --- | --- | --- |
| Storefront header | Placement, surrounding layout, supported component styling | Account sheet behavior and sign-in/account flows |
| Legacy `customers/*` pages | Existing Liquid files only on legacy configurations | Legacy lifecycle; no new-theme investment path |
| Latest account pages | Links/menu choice through supported component integration | Order list/details, profile experience, UI extensions |
| Protected/customer actions | Cosmetic content only | Authentication, authorization, account APIs, secure actions |

## 31.3 The `customers/*` templates and their objects

Legacy customer accounts historically used account, login, register, activate-account, reset-password, addresses, and order templates under `customers/*`. The customer object documents `customers/account`, `customers/addresses`, and `customers/order` as customer-aware contexts. These files still matter when maintaining a legacy store, but they are not the default foundation for new account work after the deprecation. [1] [2]

The `customers/account` surface lists account history and customer data. `customers/addresses` manages address presentation and forms. `customers/order` renders an authenticated order detail. Login/register/activation/password-reset pages serve legacy account authentication flow. Do not link arbitrary visitors to a Liquid order object or assume that a copied legacy template creates entitlement; route/account authorization remains Shopify-owned.

When maintaining an existing legacy template, retain form tags and current route objects rather than hard-coded `/account` paths. Keep account templates free of general catalog concerns and use `customer`/`order` data only in their intended scope. When modernizing, inventory any code that depends on these files, then move new account-specific functionality to the customer-account extension/platform path instead of adding more Liquid coupling.

> [VERIFY] Confirm whether a target store is still on legacy customer accounts before editing or relying on `customers/*` Liquid files. The current account configuration determines whether those templates are a live surface.

## 31.4 Order, order line items, fulfillment, transaction objects

An `order` is a post-purchase record, not a mutable cart. It exposes identity/date, line items, shipping/billing addresses, note and attributes, discounts, taxes/duties, subtotal and total fields, payment/fulfillment status and their localized labels, fulfillment data, and transactions. The order `total_price` is before refunds; `total_net_amount` is after refunds. Use the localized `financial_status_label`, `fulfillment_status_label`, and `cancel_reason_label` for customer-facing output rather than raw enum values. [5]

```liquid
<h1>{{ order.name | escape }}</h1>
<p>Placed {{ order.created_at | date: '%B %d, %Y' }}</p>
<p>Payment: {{ order.financial_status_label | escape }}</p>
<p>Fulfillment: {{ order.fulfillment_status_label | escape }}</p>
{% for item in order.line_items %}
  <p>{{ item.title | escape }} × {{ item.quantity }} — {{ item.final_line_price | money }}</p>
{% endfor %}
<p>Total: {{ order.total_price | money }}</p>
```

Order line items preserve purchased-line context, but historic order display needs care. `line_item.title` in an order is the title at order time, while `line_item.product.title` and `variant.title` can reflect current product data after edits/deletion. Prefer the order line’s title for purchase history. Selling-plan allocation information also has documented limits in order contexts; do not promise current subscription configuration based on partial historic fields. [5]

Fulfillment status describes fulfillment state, not a tracking experience by itself. If an order has fulfillment records, render the information Shopify exposes and guard absent data. Transactions represent payment events with `amount`, `kind`, `status`, localized `status_label`, gateway display name, and potentially pending-payment instructions. A customer-facing account should not dump raw transaction receipts or gateway internals. Render status/pending instructions only where Shopify documents them for the buyer, escaping labels and avoiding invented payment advice. [6]

## 31.5 Gating content by customer tag (and why it isn't security)

A tag branch is useful for **presentation**: greeting wholesale buyers, showing an invite to a loyalty area, or switching a banner for a known segment. It is not authentication or authorization. Liquid renders an HTTP response after Shopify’s customer/session resolution; a tag gate cannot protect direct URLs, APIs, downloads, checkout rules, price logic, or data that must remain confidential. Any security-sensitive decision must be enforced by the resource owner—Shopify account settings, app/backend authorization, a customer account extension/API, or another authenticated server boundary.

The wrong pattern treats a tag check as a private-content wall:

```liquid
{% if customer.tags contains 'wholesale' %}
  {% render 'wholesale-price-list' %}
{% endif %}
```

The right pattern uses the tag only for optional storefront presentation, while the underlying price list/resource applies an independent authorization rule:

```liquid
{% if customer and customer.tags contains 'wholesale' %}
  <p>Wholesale account detected. Your eligible catalog and pricing are determined by Shopify.</p>
{% endif %}
```

This distinction is important because tags can change, theme code can be bypassed, caches and links can expose assumptions, and a customer object can be absent or differ by account context. Do not place wholesale pricing, personal order records, confidential downloads, or feature eligibility solely behind a Liquid branch. Make the UI accurate about what it knows; make the backend responsible for what it must guarantee.

## Gotchas

- You access `customer.email` or tags on a general page without guarding a nil customer.
- You build new functionality into legacy `customers/*` templates despite their current deprecation/lifecycle boundary.
- You assume the theme owns the latest account sheet or can restyle its internal account pages freely.
- You display current product titles in order history when purchase-time line titles are required.
- You show gateway receipts or raw payment data instead of localized customer-safe status.
- You treat a customer tag branch as protection for prices, documents, or account actions.

## Checklist

- [ ] Customer data is context-guarded, minimal, escaped, and paginated where the object requires it.
- [ ] Header/account integration distinguishes the current component surface from legacy Liquid templates.
- [ ] Order history uses order-context data, localized statuses, and current/final totals deliberately.
- [ ] Transaction/fulfillment details are buyer-appropriate and guarded for absence.
- [ ] Tags drive optional presentation only; secure access is enforced outside Liquid.

## Related

- `ch-30-cart-line-items` — cart-state versus completed-order data and customer input scope.
- `ch-32-content-pages-blogs-search` — content/navigation surfaces independent of account authorization.
- `ch-52-theme-app-extensions` — extension ownership and app/platform integration boundaries.
- `ch-56-security-and-compliance` — access control, privacy, and theme-layer safety constraints.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/customer "Shopify — Liquid object: customer"
[2]: https://shopify.dev/changelog/legacy-customer-accounts-are-deprecated "Shopify — Legacy customer accounts are deprecated"
[3]: https://shopify.dev/docs/storefronts/themes/customer-engagement/account-component "Shopify — Account component"
[4]: https://shopify.dev/changelog/the-shopify-account-component-for-customer-accounts-is-now-a-theme-store-requirement "Shopify — Account component Theme Store requirement"
[5]: https://shopify.dev/docs/api/liquid/objects/order "Shopify — Liquid object: order"
[6]: https://shopify.dev/docs/api/liquid/objects/transaction "Shopify — Liquid object: transaction"

## Account-surface migration audit

Before changing account behavior, inventory the store’s account configuration, theme header, legacy `customers/*` files, account links, and any app code that assumes those Liquid routes exist. A legacy template can continue to render for an existing configuration while a new theme submission is expected to include the account component. These are different maintenance decisions. Document the store’s current account mode and choose one owner for every capability: theme header integration, Shopify account sheet, customer account extension, backend/customer-account API, or legacy maintenance. An unowned capability is where accidental broken links and duplicate sign-in flows appear.

Test the account entry point from desktop and mobile, signed out and signed in. The component’s account menu must remain reachable in the layout; its appearance and behavior can be controlled by Shopify independently of theme deployment. If a merchant needs a different menu, expose the documented menu selection rather than duplicating Orders/Profile navigation in a brittle custom popover. This preserves a coherent path when Shopify changes sign-in methods or account experience.

## Order-history disclosure discipline

Order history is private customer data even when the object is available in an authenticated template. Render only buyer-relevant information: order reference, dates, localized fulfillment/financial state, purchased item summary, totals, and buyer-safe status links. Avoid receipt payloads, processor diagnostics, staff tags, or operational annotations. If a product has changed since purchase, preserve the ordered line title as the historic record and avoid promising that today’s product page recreates an old configuration.

An empty order history needs a direct catalog return; a cancelled or partially fulfilled order needs wording driven by its localized fields, not a raw status-code lookup. When order/account work needs actions beyond rendered information—returns, profile management, subscription controls, or protected downloads—identify the appropriate Shopify account or app/extension surface rather than making a theme tag branch appear authoritative.

Treat these reviews as ongoing account governance, not a one-time template audit: account settings, extensions, menus, privacy expectations, and Shopify-owned screens can evolve independently of a theme release.
