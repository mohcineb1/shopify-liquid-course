<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 30 — Solution

## The approach

The cart is rendered as a current Shopify result, not recomputed from product data. Each row receives a current `line_item` and uses its `key` only as current cart identity, its final price fields as purchase prices, its allocation objects for explanations, and `url_to_remove` as the native removal route. The cart summary uses Shopify totals and cart-level applications. The theme intentionally does not add a free gift, change a line price, or decide eligibility; those are backend commerce outcomes that it may display after they arrive.

A cart note and cart attribute are captured at cart scope. An engraving remains a product-form line property, because it identifies one configured item and needs to follow that line. Customer-facing properties are escaped, blank-guarded, and omit underscore-prefixed keys. These display guards do not turn properties into trusted data; customer input remains untrusted and should never control pricing or authorization.

> [VERIFY] Confirm cart-update and Checkout Extensibility component/instruction behavior for the target theme and store. The solution uses stable Liquid contracts for current rendering but does not assume all component capabilities are enabled.

## Walkthrough

### 1. Use current cart totals and context

The section checks `cart.empty?`, renders `items_subtotal_price`, `total_discount`, `total_price`, `currency`, and tax/duty context, and lists `cart_level_discount_applications`. These values describe one state returned by Shopify. The code does not use the deprecated `cart.discounts` property or turn the original subtotal into a final checkout claim.

### 2. Render cart lines from their line state

The row is keyed with `item.key`, not `item.id`: the latter is a variant ID in cart context and multiple personalized lines can share it. The current key is not persisted in a data cache because characteristics such as properties and discounts can change it. Options show only when the product has more than the default variant, while properties use their own guarded list.

### 3. Capture and display personalization safely

The engraving/file fields belong in the product form, where their names use `properties[...]`. The cart only displays the property value delivered on the line. Underscore-prefixed names are not displayed to customers; no property is treated as a permission, discount rule, or secret. The order gift note uses `name="note"`, and the delivery preference uses an `attributes[...]` input in the cart form.

### 4. Explain discounts without recalculation

A row renders `original_line_price` only when it exceeds `final_line_price`, then lists its `discount_allocations`. The summary renders cart-level applications independently. The final line and cart totals remain the source of the amounts paid; allocations explain changes rather than becoming a parallel arithmetic engine.

### 5. Respect promotion and bundle ownership

The section can identify a line that a backend promotion or bundle mechanism returned, but only in an informational way. It must not insert the line, set a zero price, or remove it based on a local subtotal condition. If component lines or instructions are enabled, that integration needs the current platform contract and its own testing before a theme exposes controls for them.

## Full code

### `sections/main-cart.liquid`

```liquid
{{ 'cart.css' | asset_url | stylesheet_tag }}
<section class="main-cart page-width">
  <h1>Cart</h1>
  {% if cart.empty? %}
    <p>Your cart is empty.</p>
    <a href="{{ routes.all_products_collection_url }}">Continue shopping</a>
  {% else %}
    <form action="{{ routes.cart_url }}" method="post">
      {% for item in cart.items %}{% render 'cart-line', item: item %}{% endfor %}

      <label for="GiftNote">Gift note</label>
      <textarea id="GiftNote" name="note">{{ cart.note | escape }}</textarea>
      <label for="DeliveryPreference">Delivery preference</label>
      <input id="DeliveryPreference" name="attributes[Delivery preference]" value="{{ cart.attributes['Delivery preference'] | escape }}">

      <div class="cart-summary">
        <p>Items subtotal: {{ cart.items_subtotal_price | money }}</p>
        {% if cart.total_discount > 0 %}<p>Total savings: -{{ cart.total_discount | money }}</p>{% endif %}
        {% for application in cart.cart_level_discount_applications %}
          <p>{{ application.title | escape }}: -{{ application.total_allocated_amount | money }}</p>
        {% endfor %}
        <p><strong>Total: {{ cart.total_price | money }} {{ cart.currency.iso_code }}</strong></p>
        {% if cart.taxes_included %}<p>Taxes included where applicable.</p>{% endif %}
        {% if cart.duties_included %}<p>Duties included where applicable.</p>{% endif %}
      </div>
      <button type="submit" name="checkout">Checkout</button>
    </form>
  {% endif %}
</section>
{% schema %}
{ "name": "Main cart", "settings": [] }
{% endschema %}
```

### `snippets/cart-line.liquid`

```liquid
<article class="cart-line" data-line-key="{{ item.key }}">
  {% if item.image %}{{ item.image | image_url: width: 240 | image_tag: alt: item.title, loading: 'lazy' }}{% endif %}
  <div>
    <a href="{{ item.url }}">{{ item.title | escape }}</a>
    {% unless item.product.has_only_default_variant %}
      <ul>{% for option in item.options_with_values %}<li>{{ option.name | escape }}: {{ option.value | escape }}</li>{% endfor %}</ul>
    {% endunless %}
    {% if item.selling_plan_allocation %}<p>{{ item.selling_plan_allocation.selling_plan.name | escape }}</p>{% endif %}
    {% if item.properties != blank %}
      <ul class="cart-line__properties">
        {% for property in item.properties %}
          {% assign property_name = property.first %}{% assign property_value = property.last %}
          {% if property_value != blank and property_name | slice: 0 != '_' %}<li>{{ property_name | escape }}: {{ property_value | escape }}</li>{% endif %}
        {% endfor %}
      </ul>
    {% endif %}
    {% if item.original_line_price > item.final_line_price %}<s>{{ item.original_line_price | money }}</s>{% endif %}
    <p>{{ item.final_price | money }} × {{ item.quantity }} = <strong>{{ item.final_line_price | money }}</strong></p>
    {% for allocation in item.discount_allocations %}<p>{{ allocation.discount_application.title | escape }}: -{{ allocation.amount | money }}</p>{% endfor %}
    <a href="{{ item.url_to_remove }}">Remove</a>
  </div>
</article>
```

### `assets/cart.css`

```css
.main-cart { display: grid; gap: 1rem; }
.cart-line { border-block-end: 1px solid currentColor; display: grid; gap: .5rem; grid-template-columns: minmax(5rem, 12rem) 1fr; padding-block: 1rem; }
.cart-line__properties, .cart-summary__discounts { list-style: none; margin: 0; padding: 0; }
.cart-summary { display: grid; gap: .5rem; }
```

### `notes.md`

```markdown
# Cart verification

| Scenario | Observed state | Authority / refresh outcome |
| --- | --- | --- |
| Duplicate personalized variant | Distinct current keys/properties display. | Refresh after mutation; do not cache key. |
| Line-level discount | Final line price and allocation agree. | Final price remains customer-facing amount. |
| Cart-level discount | Summary application and total agree. | Do not add it to line allocations. |
| Empty cart | Empty branch and navigation display. | No summary is inferred. |
| Hidden property | Underscore property omitted. | Hidden is display behavior, not security. |
| Cart note | `note` remains cart scoped. | It survives independently of a line. |
| Cart mutation | Fresh cart response required. | New keys/totals replace old state. |
| Gift unavailable | No local zero-price gift claim. | Backend rule remains owner. |
```

All four files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They use variant ID as the cart-row identity. Two lines with different properties can share that ID, while the current key distinguishes them.
- They output `line_item.price` or `cart.discounts`. Those deprecated fields can omit modern discount effects, so final prices and allocation objects are required.
- They hide a property from the cart and call it secure. Underscore naming changes customer-facing display, not the trustworthiness of browser input.
- They add a free gift when a Liquid subtotal looks high enough. Theme code cannot guarantee price, eligibility, bundles, or checkout outcome.

## Stretch: direction only

After a quantity/removal request, obtain one fresh server cart representation and replace every dependent line and summary surface from it. Store the initiating control, then restore focus to a logical surviving control when the line disappears. Treat changed keys, new promotion gift lines, and removed components as normal server-state differences rather than exceptions to patch locally.
