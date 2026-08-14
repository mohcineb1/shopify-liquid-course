<!-- STATUS: draft -->
---
id: ch-30
title: "Cart & Line Items"
part: 4
---

# Chapter 30 — Cart & Line Items

A cart is not a client-side price calculator with a few products attached. It is Shopify’s current purchasable state: line items can have distinct properties even for the same variant, discounts can apply at different levels, currencies and taxes are contextual, cart notes and attributes have separate scopes, and bundle/free-gift rules may be owned by an app or Shopify Function rather than a theme. A reliable cart renders the state Shopify returns, posts customer intent through supported fields, and avoids promising that theme code can enforce commercial rules.

## What you’ll be able to do

- Render cart totals, currency, note, attributes, shipping/tax context, and discount application data without mixing price levels.
- Identify a cart line item by its appropriate key or ID and display its variant, options, properties, plan, and fulfillment context.
- Capture personalization properties responsibly, including hidden data and uploads.
- Explain savings from the allocation and final/original amounts that actually apply.
- Separate cart-level data from line-level data and recognize when free gifts or bundles exceed theme authority.

## 30.1 The `cart` object: items, totals, discounts, attributes, note, currency

`cart` is the customer’s current cart. It supplies `items`, `item_count`, `empty?`, `attributes`, `note`, `currency`, totals, discount applications, shipping/tax context, and total weight. The most useful money distinctions are `original_total_price` before discounts, `items_subtotal_price` after line-item discounts but before cart discounts/shipping, `total_discount` as all cart savings, `total_price` after discounts, and `checkout_charge_amount` as the amount charged at checkout. All are presentment-currency subunit amounts and should be formatted with money filters. [1]

```liquid
{% if cart.empty? %}
  <p>Your cart is empty.</p>
{% else %}
  <p>{{ cart.item_count }} items</p>
  <p>Items: {{ cart.items_subtotal_price | money }}</p>
  {% if cart.total_discount > 0 %}<p>You save {{ cart.total_discount | money }}</p>{% endif %}
  <p>Total: {{ cart.total_price | money }} {{ cart.currency.iso_code }}</p>
{% endif %}
```

A cart may have multi-currency context; `cart.currency` reflects the customer’s local presentment currency when a store supports it. `taxes_included` and `duties_included` describe price context; show a clear message only when it is true and do not infer tax policy from store-level settings. `requires_shipping` is true when any cart product requires shipping, useful for conditional delivery copy but not a shipping-rate guarantee. [1]

`cart.attributes` are additional customer-provided name/value data. An input inside a cart form named `attributes[name]` captures one. A cart note is distinct: it is captured by `name="note"`, and only one note input should exist on a cart page because the latest DOM instance wins. Cart-level discount applications are separately available through `cart.cart_level_discount_applications`; `cart.discount_applications` represents all cart discount applications. The old `cart.discounts` property is deprecated because it lacks complete discount detail. [1]

> [VERIFY] Confirm the cart form/action and any Ajax update route used by your theme before modifying cart state. Liquid renders the current cart; the request boundary owns updates and validation.

## 30.2 The `line_item` object in full

A `line_item` represents a variant in a cart, checkout, or order. Its context matters. In `cart.items`, `line_item.id` is a variant ID and is not unique when the same variant appears with different properties. `line_item.key` is a cart-specific unique identifier composed from variant ID and characteristics, but it is not stable: properties and discount applications can change it. Use the current key for cart-line operations, then refresh state rather than caching it across mutations. [2]

The display contract includes `title`, `url`, `image`, `product`, `variant`, `variant_id`, `options_with_values`, `quantity`, `properties`, `vendor`, `sku`, `gift_card`, `requires_shipping`, unit-price data, `selling_plan_allocation`, and price fields. For pricing, compare `original_price`/`original_line_price` with `final_price`/`final_line_price`. The final fields include line-level discounts and are what a customer should see as the current purchase result. Deprecated `line_item.price`, `line_price`, `total_discount`, and `discounts` omit discount cases; use final fields and discount allocations instead. [2]

```liquid
{% for item in cart.items %}
  <article data-line-key="{{ item.key }}">
    <a href="{{ item.url }}">{{ item.title | escape }}</a>
    {% unless item.product.has_only_default_variant %}
      <ul>{% for option in item.options_with_values %}<li>{{ option.name | escape }}: {{ option.value | escape }}</li>{% endfor %}</ul>
    {% endunless %}
    <p>{{ item.final_price | money }} × {{ item.quantity }} = {{ item.final_line_price | money }}</p>
    <a href="{{ item.url_to_remove }}">Remove</a>
  </article>
{% endfor %}
```

A line item can expose nested components, parent relationships, instructions, and an error message in supported cart contexts. Do not assume all line items are simple independent variants. Component discount allocations apply to a parent line, and capabilities may be specific to current Checkout Extensibility shops. Render a safe basic path first, then check the current cart/item-component contract before adding bundle-specific UI.

## 30.3 Line item properties: hidden properties, file uploads, personalization

A line item property attaches customer-specific data to one purchased line. Product-form fields use names like `properties[Engraving]`; Shopify captures their value on the cart line. This is appropriate for engraving text, gift recipient information, selected customization choices, or a file reference where the product workflow supports it. The property changes the line’s characteristics, which is one reason two units of the same variant can be distinct cart lines. [2]

```liquid
{% form 'product', product %}
  <label for="Engraving">Engraving</label>
  <input id="Engraving" type="text" name="properties[Engraving]" maxlength="32">
  <label for="Reference">Reference file</label>
  <input id="Reference" type="file" name="properties[Reference file]">
  <button type="submit">Add to cart</button>
{% endform %}
```

Properties whose name begins with an underscore can be hidden from customers at checkout. Hidden does not mean secret, trustworthy, or safe for credentials. Never place sensitive personal data, authorization decisions, internal pricing, or business-rule flags in a browser-submitted line property. It is customer-controlled input and must be validated by the system that relies on it. [2]

When displaying properties, skip blank values and use a customer-appropriate rule for underscore-prefixed keys. A file property can render as a URL or file reference in cart data; do not trust its filename as content or assume an upload exists merely because the input appeared. The product form needs correct multipart behavior for file uploads in the environment; verify current Shopify guidance and test the entire product-to-cart-to-order path.

> [VERIFY] Confirm file-upload behavior, property display rules, and privacy requirements for the target product workflow. Do not infer compliance from the ability to submit a property field.

## 30.4 Discount allocations, automatic discounts, and displaying savings correctly

Savings must be shown at the level where Shopify applies them. `line_item.discount_allocations` describes allocations applied to that line; `line_level_discount_allocations` describes allocations directly applied to it; a discount allocation supplies an amount and discount application. `cart.cart_level_discount_applications` represents cart-specific applications, while `cart.discount_applications` includes cart discount applications generally. [1] [2] [3]

Display the final item price and final line total as authoritative results. If `original_line_price` is greater than `final_line_price`, show the former as comparison and the final as current. Then list named allocations where they add useful explanation. Do not add every allocation amount to a manually recomputed total: automatic discounts, cart-level discounts, order-level conditions, and component lines can make naive aggregation disagree with Shopify’s total.

```liquid
{% if item.original_line_price > item.final_line_price %}
  <s>{{ item.original_line_price | money }}</s>
  <strong>{{ item.final_line_price | money }}</strong>
{% endif %}
{% for allocation in item.discount_allocations %}
  <p>{{ allocation.discount_application.title | escape }}: -{{ allocation.amount | money }}</p>
{% endfor %}
{% for application in cart.cart_level_discount_applications %}
  <p>{{ application.title | escape }}: -{{ application.total_allocated_amount | money }}</p>
{% endfor %}
```

Never call a compare-at product price an applied cart discount. Compare-at is a merchandising price relationship; allocation is an actual cart result. Likewise, do not use deprecated discount arrays because they omit types/details, or assume a discount title tells you whether it was manual, code, automatic, function, or app-owned.

## 30.5 Cart-level vs line-level attributes

Cart attributes, cart note, and cart-level discounts belong to the entire checkout intent. They fit a gift message for an order, delivery instruction, or a preference that applies to every line. Line properties belong to one configuration: engraving on one mug, uploaded art for one print, or a recipient field for one personalized product. The same name used at different scopes is not interchangeable data.

Choose scope by ownership and persistence: if a change to quantity or removal of one item should remove the data, it likely belongs on the line. If it should travel with the cart even when items change, it likely belongs on the cart. Use private cart attributes with a double-underscore prefix only for data that does not affect page rendering; Shopify documents that they cannot be read from Liquid or the Ajax API and can improve caching for non-rendering information. [1]

Avoid writing theme logic that copies a line property into a cart attribute or vice versa merely to make rendering convenient. It creates conflicts when multiple qualifying lines exist and loses the semantic owner of the customer’s input.

## 30.6 Free gifts, bundles, and the limits of theme-side cart logic

A theme can display a free gift line, bundle parent/components, automatic discount, cart error, or instruction returned by Shopify. It can offer an add/remove action using supported cart mechanisms. It cannot reliably enforce commercial eligibility through Liquid or browser checks. A customer can change cart state in another tab, a script can fail, a promotion can have conditions unknown to the page, and backend discount/bundle logic controls the authoritative outcome.

A tempting but incorrect pattern is: “if cart total exceeds X, add a gift variant and set its price to zero in JavaScript.” The theme cannot set a line’s authoritative price, cannot guarantee eligibility or removal, and cannot ensure checkout applies the promised promotion. Put enforcement in Shopify’s discount, bundle, Cart Transform, app, or Function capability as appropriate; make the theme an honest renderer of the resulting cart. [2]

For bundles, distinguish parent and component lines, respect their update/removal instructions where exposed, and do not assume component-level discount allocations. For free gifts, show why the gift is present only when a merchant/backend rule provides a truth source, and avoid deleting a customer’s gift line as a side effect of a visual refresh. Theme-side logic may improve discoverability, but it must fail safely to server/cart truth.

## Gotchas

- You use `cart.discounts` or `line_item.price`/`line_price` despite their documented deprecations.
- You use variant ID as a unique cart-line identifier despite properties creating multiple lines; then cache an unstable key after mutation.
- You display a hidden underscore property as a security mechanism or treat customer input as trusted.
- You sum allocation values manually and contradict the final totals Shopify returns.
- You place an order-wide note on one line item, or item-specific personalization in a cart attribute.
- You attempt to enforce a gift or bundle price solely in Liquid or browser code.

## Checklist

- [ ] Cart totals, currency, taxes/duties, discounts, attributes, and note each use their correct scope and final values.
- [ ] Each line renders current identity, options, price, quantity, properties, allocations, and removal route from the cart state.
- [ ] Personalization is captured as line data with guarded display and no security assumptions.
- [ ] Savings separate product comparisons from applied line and cart discount allocations.
- [ ] Gifts and bundles are rendered as backend-owned commerce results, not theme-enforced promises.

## Related

- `ch-27-products` — product/variant purchase data before the cart transaction.
- `ch-28-variants` — selected variant and option-state contracts.
- `ch-38-ajax-api` — supported cart mutations, refreshes, and state reconciliation.
- `ch-52-theme-app-extensions` — app-owned storefront and commerce integration boundaries.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/cart "Shopify — Liquid object: cart"
[2]: https://shopify.dev/docs/api/liquid/objects/line_item "Shopify — Liquid object: line item"
[3]: https://shopify.dev/docs/api/liquid/objects/discount_allocation "Shopify — Liquid object: discount allocation"

## Cart-state audit before shipping

Test cart rendering with duplicate variants that differ only by properties, a personalized line with an empty optional property, a gift card, a selling-plan line, a line-level discount, a cart-level discount, a cart note, and a cart attribute. Confirm that each row uses its current `key` only for its current cart state, that removal URLs remove the intended row, and that price and savings labels remain readable in the customer’s currency. After any cart mutation, request or render fresh cart state; do not update a cached total and assume a promotion, property, or line key stayed unchanged.

Property display requires an editorial rule as well as a technical guard. Render customer-facing personalization with escaped name/value text and a useful file link when appropriate. Omit empty values. Hide underscore-prefixed internal properties from customer-facing surfaces, but remember that this is a presentation convention, not authorization. Decide separately which fields an order-management workflow needs; storefront presentation should not expose operational identifiers merely because the cart object contains them.

For a cart that has no physical products, shipping language should disappear without implying a different checkout total. For a cart with tax or duty-inclusive prices, describe inclusion rather than guessing exact tax amounts. These contextual outputs make the cart transparent while leaving actual rates, discounts, bundles, and checkout validation to Shopify’s transactional systems.
