<!-- STATUS: final -->
---
id: ch-36
title: "Every Form Type"
part: 5
---

# Chapter 36 — Every Form Type

Every native Shopify form solves a particular server-side workflow. A product form is not a generic purchase form; a customer email form is not account registration; a localization form is not a currency-only selector; gift-card recipient data is not arbitrary order metadata. Choosing the right type, resource argument, field names, response state, and merchant configuration is what keeps a theme aligned with Shopify’s transactional authority. This chapter maps the form family so you can build a complete native baseline without inventing endpoints.

## 36.1 `product` — add to cart, quantity, properties, selling plans

`{% form 'product', product %}` creates the native add-to-cart form for a product. It must submit the selected variant’s `id`; quantity is conventionally `quantity`; line item properties use `properties[Name]`; and selling-plan inputs must represent the selected plan according to the current product/selling-plan UI contract. The product argument is required. Shopify generates the native cart-add endpoint and supporting hidden fields; your UI selects valid purchase inputs. [1]

```liquid
{% form 'product', product, id: 'ProductForm-' | append: section.id %}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  <label for="Quantity-{{ section.id }}">Quantity</label>
  <input id="Quantity-{{ section.id }}" name="quantity" type="number" min="1" value="1">
  <label for="Engraving-{{ section.id }}">Engraving</label>
  <input id="Engraving-{{ section.id }}" name="properties[Engraving]" type="text">
  <button type="submit">Add to cart</button>
{% endform %}
```

A property changes the cart line’s buyer-supplied context; it does not validate price, grant entitlement, or replace a product/variant/plan selection. Use inputs only when the merchant has a real fulfillment requirement and show relevant properties in cart/order context. Selling plans and selected variants have their own current data contracts: preserve a no-JavaScript purchase path, guard unavailable variants, and do not infer plan availability from a label. Product/variant UI architecture belongs with `ch-27-products` and `ch-28-variants`.

## 36.2 `cart` — update, note, attributes, checkout

`{% form 'cart', cart %}` creates the native cart form. It supports quantity updates, cart notes, cart attributes, and the checkout action. It requires `cart`; do not reimplement its endpoint. Line quantities are addressed by the cart’s documented line/key controls, not a product handle. A cart note belongs in `note`; cart-wide context uses `attributes[Name]`; line-level context belongs to the original product form’s `properties[Name]`. [1]

```liquid
{% form 'cart', cart %}
  {% for item in cart.items %}
    <label for="Updates-{{ item.key }}">Quantity for {{ item.product.title }}</label>
    <input id="Updates-{{ item.key }}" name="updates[{{ item.key }}]" type="number" min="0" value="{{ item.quantity }}">
  {% endfor %}
  <label for="CartNote">Order note</label>
  <textarea id="CartNote" name="note">{{ cart.note | escape }}</textarea>
  <input name="attributes[Delivery instruction]" value="{{ cart.attributes['Delivery instruction'] | escape }}">
  <button name="update" type="submit">Update cart</button>
  <button name="checkout" type="submit">Checkout</button>
{% endform %}
```

Cart attributes and notes are buyer inputs, not access-control fields or trusted commerce logic. Their availability/visibility across checkout and integrations must be tested. The detailed cart/object boundary is in `ch-30-cart-line-items`; asynchronous cart interaction is deferred to `ch-38-ajax-api`.

## 36.3 `customer_login`, `create_customer`, `recover_customer_password`, `reset_customer_password`, `activate_customer_password`

These forms belong to legacy customer-account template workflows: login, account registration, recovery request, password reset, and account activation. They each create a distinct server transaction and must not be merged into one guessed endpoint. `customer_login` accepts customer credential fields; `create_customer` registers an account; recovery asks Shopify to begin password recovery; reset and activation are token/template-bound workflows. [1]

```liquid
{% form 'customer_login', return_to: routes.root_url %}
  <label for="CustomerEmail">Email</label>
  <input id="CustomerEmail" name="customer[email]" type="email" autocomplete="email" required>
  <label for="CustomerPassword">Password</label>
  <input id="CustomerPassword" name="customer[password]" type="password" autocomplete="current-password" required>
  <button type="submit">Sign in</button>
{% endform %}
```

> [VERIFY] Legacy customer account templates are deprecated and latest customer accounts operate independently of themes. Confirm the store’s active account mode before implementing or extending legacy login/register/recovery/reset/activation templates. Use the account component where Shopify’s current customer-account experience owns the surface. [2]

Never restore passwords after error, and do not describe a registration/login form as an authorization layer for arbitrary storefront data. The account/access boundary and current account component are covered in `ch-31-customers-accounts`.

## 36.4 `customer_address` — country/province selectors

`{% form 'customer_address', customer.new_address %}` creates a new address form; pass an existing `address` to edit it. The form carries returned address values such as first name, address fields, city, country, province, phone, and postal code. Use Shopify’s country/province selector helpers/contract rather than hard-coded jurisdiction lists, because available provinces depend on country and account context. [1]

```liquid
{% form 'customer_address', customer.new_address %}
  <label for="AddressCountryNew">Country</label>
  <select id="AddressCountryNew" name="address[country]" data-default="{{ form.country }}">{{ all_country_option_tags }}</select>
  <label for="AddressProvinceNew">Province</label>
  <select id="AddressProvinceNew" name="address[province]" data-default="{{ form.province }}"></select>
  <button type="submit">Save address</button>
{% endform %}
```

> [VERIFY] Confirm the current country/province selector initialization and legacy address-template support in the target account mode. The native form alone does not guarantee a custom select UI updates provinces without the documented helper/enhancement path.

## 36.5 `contact` and `customer` (newsletter)

`contact` sends a merchant contact submission. `customer` creates a customer record without registering an account, which makes it the appropriate newsletter/email-consent form. A newsletter form needs an email input named `contact[email]`; Shopify documents that this flow creates the customer and sets `accepts_marketing` true. [3] Treat marketing consent, copy, privacy language, and regional requirements as merchant/legal configuration, not an inferred theme decision.

```liquid
{% form 'customer' %}
  <label for="NewsletterEmail">Email</label>
  <input id="NewsletterEmail" type="email" name="contact[email]" autocomplete="email" required>
  <button type="submit">Subscribe</button>
{% endform %}
```

Use the state/error structure from `ch-35-the-form-tag`; do not use account-registration form merely to collect a newsletter email.

## 36.6 `new_comment`

`{% form 'new_comment', article %}` submits a comment to the current article and therefore needs the article object. Comment settings, moderation, and whether the form is useful are merchant/store configuration. Render returned errors and values, use labels for author/email/body, and avoid promising immediate publication if moderation can intervene. [1]

```liquid
{% form 'new_comment', article %}
  <label for="CommentBody">Comment</label>
  <textarea id="CommentBody" name="comment[body]">{{ form.body | escape }}</textarea>
  <button type="submit">Post comment</button>
{% endform %}
```

## 36.7 `localization` — country and language selectors

`{% form 'localization' %}` lets buyers choose country and/or language so storefront language/currency context can update. It replaces the deprecated `currency` form. Its native output includes localization-specific infrastructure, so preserve it and make selection labels clear. Use `localization.available_countries` and available languages in the documented localization context; do not offer a country/language the shop does not make available. [1]

```liquid
{% form 'localization' %}
  <label for="Country">Country</label>
  <select id="Country" name="country_code">{% for country in localization.available_countries %}<option value="{{ country.iso_code }}"{% if country.iso_code == localization.country.iso_code %} selected{% endif %}>{{ country.name | escape }}</option>{% endfor %}</select>
  <button type="submit">Update preferences</button>
{% endform %}
```

## 36.8 `guest_login`, `storefront_password`

`guest_login` belongs to legacy customer-login flow and directs a buyer back to checkout as a guest; it is not an alternate generic sign-in button. `storefront_password` submits access to a password-protected storefront. Both forms have narrow configuration/template context, so expose them only when that native workflow is active. [1]

```liquid
{% form 'storefront_password' %}
  <label for="StorefrontPassword">Password</label>
  <input id="StorefrontPassword" name="password" type="password" required>
  <button type="submit">Enter store</button>
{% endform %}
```

## 36.9 Gift card recipient forms

Gift-card recipient inputs live **inside** the product form and are line item properties. Required recipient handling includes `properties[Recipient email]` plus `properties[__shopify_send_gift_card_to_recipient]` with value `true`; optional name, message, and `Send on` use documented property names. Send date uses `yyyy-mm-dd`; the optional timezone offset requires browser `Date().getTimezoneOffset()` and otherwise the shop timezone is used. [4]

```liquid
{% form 'product', product %}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
  {% if product.gift_card? %}
    <label for="RecipientEmail">Recipient email</label>
    <input id="RecipientEmail" name="properties[Recipient email]" type="email">
    <input type="hidden" name="properties[__shopify_send_gift_card_to_recipient]" value="true">
  {% endif %}
  <button type="submit">Add to cart</button>
{% endform %}
```

Recipient validation does not support accelerated checkout buttons; use the normal Add to Cart path. Shopify documents limits of 255 characters for recipient name, 200 for message, and scheduling no more than 90 days ahead. Surface returned errors and display recipient properties appropriately in cart. [4]

## Gotchas

- You use a generic form type because it happens to accept an email field.
- You treat cart attributes, notes, or line properties as trusted authorization/price data.
- You extend deprecated legacy account templates without checking the active account mode.
- You hard-code country/province values instead of respecting the selector contract.
- You offer a standalone gift-card recipient form outside the product form or alongside accelerated checkout.
- You build a currency-only form instead of the current localization form.

## Checklist

- [ ] Each native form type matches its server workflow and receives required resource/context arguments.
- [ ] Product/cart values use the correct scope: variant, quantity, property, attribute, note, or checkout action.
- [ ] Account forms are limited to verified active account-mode surfaces.
- [ ] Contact/newsletter/comment/localization states use accessible native error/success patterns.
- [ ] Gift-card recipient data is an in-product-form, validated line-property flow with documented limits.

## Related

- `ch-35-the-form-tag` — generated form protocol, returned state, errors, and attributes.
- `ch-30-cart-line-items` — cart state and transactional authority boundary.
- `ch-31-customers-accounts` — account mode, legacy templates, and account component.
- `ch-37-client-side-javascript` and `ch-38-ajax-api` — enhancement after native form behavior is correct.

## References

[1]: https://shopify.dev/docs/api/liquid/tags/form "Shopify — Liquid tag: form"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates "Shopify — Theme templates and legacy customer accounts"
[3]: https://shopify.dev/themes/customer-engagement/email-consent "Shopify — Email consent"
[4]: https://shopify.dev/docs/storefronts/themes/product-merchandising/gift-cards "Shopify — Gift card recipient form"

## A decision matrix before implementation

Form selection starts with the server-side result, then the resource context, and only then the UI. Write those three facts before creating fields. If the desired result is “add one selected variant,” use `product`; if it is “modify this cart and proceed to checkout,” use `cart`; if it is “collect marketing email without account creation,” use `customer`; if it is “authenticate in an enabled legacy account flow,” use the relevant customer form. A similar visual shape does not mean two flows share a protocol.

| Intended outcome | Native type | Required context | Key implementation question |
| --- | --- | --- | --- |
| Add selected merchandise | `product` | `product` | Which variant, quantity, properties, and plan are valid? |
| Change/order cart | `cart` | `cart` | Is data line-level, cart-level, or checkout intent? |
| Sign in or recover access | customer account forms | Legacy customer template/token context | Is this surface active for the store’s account mode? |
| Add/edit address | `customer_address` | New/existing address | Are country/province controls correctly connected? |
| Merchant inquiry | `contact` | None | What safe values/errors return after server validation? |
| Email marketing signup | `customer` | None | Is this consent copy/workflow approved? |
| Publish comment | `new_comment` | `article` | Can moderation alter publication timing? |
| Change market preference | `localization` | Localization context | Which country/language choices are available? |
| Gift-card delivery | `product` | Gift-card product | Are recipient properties inside Add to Cart only? |

Use this as an architectural check, not as a shortcut for field names. Each documented form type may expose different returned form properties. Test the actual type in the intended template with realistic settings; copying a working field name across types can produce an input that looks polished but is ignored by the endpoint.

## Safe submitted-data boundaries

Native form inputs are not interchangeable storage. A product property is buyer-visible transaction context. A cart attribute applies to the cart. A cart note is an order instruction. Contact/comment/newsletter submissions enter merchant workflows. Address and account information are personal data. The theme should collect only what the merchant workflow needs, label it honestly, and avoid exposing it through browser logs, CSS data attributes, analytics selectors, or unescaped output.

This distinction also prevents accidental policy claims. A checkbox or text input does not itself prove consent, identity, age, fulfillment eligibility, authorization, or regulatory compliance. Where a merchant needs such a decision, keep the theme presentation aligned with the platform’s documented workflow and obtain product/legal guidance rather than fabricating a Liquid condition.

## Form-family test plan

For every native form, test its ordinary path, invalid path, empty/absent-resource path, keyboard path, and no-JavaScript path. Inspect actual rendered markup to verify the generated native infrastructure remains intact. For resource-bound forms, test a different product/cart/article/address instance; for repeatable sections, test two instances; for localization, test at least available choices and current selection; for recipient data, test Add to Cart, cart display, validation, date boundary, and accelerated-checkout exclusion.

Record form type, required argument, field names, merchant prerequisites, errors observed, success/redirect behavior, and recovery state. This turns a fragile collection of snippets into a maintained interface to Shopify’s server contracts.

Do not treat a successful visual preview as acceptance. Submit the exact form type against the intended storefront configuration and preserve a short evidence record. Native contracts evolve with account mode, markets, payment paths, and merchant settings; a release check catches the contextual mismatch that static Liquid review cannot.

Document results, owners, and recovery decisions clearly.
