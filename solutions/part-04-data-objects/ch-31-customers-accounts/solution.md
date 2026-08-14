<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 31 — Solution

## The approach

The solution gives the theme two deliberately limited roles. In the storefront header, it places Shopify’s supported account component when accounts are enabled and adds a minimal guarded greeting; the component, not a custom dropdown, owns the latest account sheet and sign-in/account workflow. In a legacy `customers/order` template, it renders only buyer-safe historic order data while making no claim that the legacy page is the future account platform.

The wholesale tag changes a message but does not reveal an unprotected trade price list or authorize an action. The real catalog, pricing, document, and action authorization must be owned by Shopify B2B/catalog configuration, a customer account extension, app/backend, or another authenticated service. This is deliberately visible in `notes.md`: the theme is a presentation layer, not a security boundary.

> [VERIFY] Check the store’s current account configuration and confirm the account-component menu ID before deployment. The header’s component path is current, whereas the included customer order template is only a legacy-maintenance path.

## Walkthrough

### 1. Guard customer data and use the supported header surface

The header puts `<shopify-account>` inside the account-enabled guard and exposes it to both layouts through the header section. A conditional customer name is optional decoration; signed-out visitors receive no personal information. The component controls sign-in, signed-in account sheet, and its internal account-page behavior. The theme only selects its documented menu and supplies surrounding layout.

### 2. Name the legacy-account boundary

The solution retains a `customers/order` file only to improve a legacy store that still renders it. It does not build login/register/account functionality or recommend the file as a new customer-account product surface. Notes identify migration to customer account UI extensions/current account surfaces as the owner of new account-page functionality.

### 3. Render buyer-safe order history

Order detail uses `order.name`, date, localized order status labels, historic `item.title`, quantity, final line prices, totals, and guarded addresses. It does not output raw receipt/gateway data, staff tags, or every attribute. An empty/absent value is guarded. Current product titles are not used as the historical purchased title.

### 4. Preserve the authorization boundary

The segment snippet offers informational copy only when a wholesale-tagged customer is present. It says eligibility is determined by Shopify/backend systems and links to a public contact route; it does not make the tag branch a gateway to private price data. Tags are merchant labels useful for UI—but a direct URL, API, file, or price rule needs its own enforced authorization.

### 5. Test account modes and customer states

Test signed-in/out header render, desktop/mobile component availability, a zero-order history, partial/cancelled order labels, tagged and untagged messages, and the actual store account mode. If latest accounts are active, document that a legacy Liquid order page cannot be used as a live test surface and validate its migration owner instead.

## Full code

### `sections/header-account.liquid`

```liquid
<div class="header-account">
  {% if shop.customer_accounts_enabled %}
    <shopify-account menu="{{ section.settings.customer_account_menu }}"></shopify-account>
  {% endif %}
  {% if customer %}
    <span class="header-account__greeting">Hello, {{ customer.first_name | escape }}</span>
  {% else %}
    <span class="visually-hidden">Customer account menu</span>
  {% endif %}
</div>
{% schema %}
{
  "name": "Header account",
  "settings": [
    { "type": "link_list", "id": "customer_account_menu", "label": "Customer account menu", "default": "customer-account-main-menu" }
  ]
}
{% endschema %}
```

### `templates/customers/order.liquid`

```liquid
<section class="account-order page-width">
  <h1>{{ order.name | escape }}</h1>
  <p>Placed {{ order.created_at | date: '%B %d, %Y' }}</p>
  <p class="account-status">Payment: {{ order.financial_status_label | escape }}</p>
  <p class="account-status">Fulfillment: {{ order.fulfillment_status_label | escape }}</p>
  {% if order.cancelled %}<p>Cancellation: {{ order.cancel_reason_label | escape }}</p>{% endif %}
  <ul class="account-order__items">
    {% for item in order.line_items %}
      <li>{{ item.title | escape }} × {{ item.quantity }} — {{ item.final_line_price | money }}</li>
    {% endfor %}
  </ul>
  <p>Order total: {{ order.total_price | money }}</p>
  {% if order.total_refunded_amount > 0 %}<p>Refunded: {{ order.total_refunded_amount | money }}</p>{% endif %}
  {% if order.shipping_address %}<address>{{ order.shipping_address | format_address }}</address>{% endif %}
  <a href="{{ routes.account_url }}">Back to account</a>
</section>
```

### `snippets/customer-segment.liquid`

```liquid
{% if customer and customer.tags contains 'wholesale' %}
  <aside class="customer-segment" aria-label="Account information">
    <p>Wholesale account detected. Eligible catalog access and pricing are determined by Shopify and your account configuration.</p>
    <a href="{{ routes.contact_url }}">Contact trade support</a>
  </aside>
{% endif %}
```

### `assets/account-surfaces.css`

```css
.header-account { display: flex; align-items: center; gap: .75rem; }
.account-order { display: grid; gap: 1rem; }
.account-order__items { list-style: none; margin: 0; padding: 0; }
.account-status { font-weight: 600; }
.customer-segment { border-inline-start: .25rem solid currentColor; padding-inline-start: 1rem; }
```

### `notes.md`

```markdown
# Customer account verification

| Scenario | Observed theme state | Platform / authorization owner |
| --- | --- | --- |
| Signed out | Account component is present; no customer name leaks. | Shopify account component/sign-in. |
| Signed in | Guarded greeting and account component display. | Shopify account sheet/profile. |
| Empty order history | Account surface offers a catalog return. | Current account/account extension. |
| Partial fulfillment | Localized fulfillment label renders. | Shopify order state. |
| Cancelled order | Localized cancellation label is guarded. | Shopify order state. |
| Tagged customer | Informational wholesale message renders. | B2B/catalog/backend rules control access. |
| Untagged customer | No segment message is rendered. | No authorization inference. |
| Account-mode migration | Legacy template inventoried only. | Customer account extension/current account migration. |

Legacy Liquid templates remain relevant only for a store still using legacy accounts. New account-page features belong to current customer accounts and their supported extension/API surfaces.
```

All five files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They test `customer.tags` without first confirming `customer` exists. On anonymous storefront requests, that object can be nil.
- They replace the account component with a hand-built Liquid dropdown. The current account sheet and sign-in flow are Shopify-controlled, not a theme-owned replica.
- They use `item.product.title` for historic order display. Product data can change; `item.title` preserves the purchased-line title in order context.
- They hide a trade catalog link with a tag and call the catalog protected. UI omission is not authorization for direct routes, data, pricing, or files.

## Stretch: direction only

Start with a migration inventory: account configuration, all customer/account links, legacy templates, historic order URLs, installed account extensions, and private-resource owners. Test signed-out/in navigation, account menu focus, historical order link behavior, privacy disclosure, and rollback. The implementation route is a supported customer account extension/current account surface—not a larger legacy Liquid template.


## Verification boundary

The completed files intentionally avoid a theme-level assertion that the customer has access to a private trade resource. During implementation, verify the resource directly while signed out, signed in without the tag, and signed in with the tag. The expected outcome is determined by the catalog, B2B/company, extension, app, or backend policy—not by whether the segment snippet rendered. If the resource is public, the tag message must not call it private; if it is protected, denial must occur before the resource’s sensitive response is delivered.

Likewise, distinguish a buyer’s historical order page from an operational administration view. Customer-facing data should be localized, minimal, and actionable: purchased items, totals, delivery/payment status, and support routes. Transaction receipts, staff-facing annotations, raw gateway values, and internal order tags create privacy and maintenance risk without helping a buyer. The header and legacy template therefore have separate responsibilities, but both follow the same rule: Liquid reflects an already-authorized context and must not become the authorization mechanism.
