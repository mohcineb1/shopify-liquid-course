<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 2 — Solution

## The approach

The cart guard is a small theme feature, not a client component. Its source of truth already exists at the theme render boundary: the cart available for the cart-page request. The section owns the merchant-facing configuration and placement. The snippet owns the repeated heading-and-message markup. The section passes named values into that snippet rather than relying on variables it happened to create nearby.

There is no JavaScript because the exercise asks for truthful initial HTML, not an in-place update after an asynchronous cart action. Liquid makes the server-side choice once for this response. If the buyer changes the cart later without a navigation, browser JavaScript would own the new interaction; that is deliberately outside this answer.

## Walkthrough

### 1. Merchant-configurable cart-page notice

`sections/cart-guard.liquid` is a section with a text setting named `heading` and a preset. The schema makes the setting available in the theme editor; placing the section in a cart template makes it a cart-page notice. The section is responsible for this editor contract, not the snippet.

### 2. Different messages for a non-empty and empty cart

The section checks `cart.item_count` during the theme render. A cart with one or more items receives the ready-to-checkout message; an empty cart receives the add-an-item message. Both messages are rendered in the HTML Shopify sends for that request.

### 3. Current cart state, not invented component state

The two `assign` statements only name the selected message while this Liquid file renders. They do not persist, trigger a re-render, or attempt to mirror cart state in the browser. `cart.item_count` remains the source of truth.

### 4. Reusable markup with explicit input

`snippets/cart-guard-message.liquid` renders the title and message. The section passes `heading`, `heading_id`, and `message` as named parameters. This is the relevant Liquid boundary: the snippet receives a small, visible input surface rather than accessing caller-created variables implicitly.

### 5. No framework or hydration

The implementation contains Liquid, HTML, schema JSON, and a theme stylesheet only. Shopify renders the initial HTML; no framework bundle reconstructs a component tree and no browser code is needed to make the initial notice correct.

### 6. Supplied presentation asset

The section references `cart-guard.css` from `assets/` with the documented asset URL and stylesheet filters. The mirrored CSS file stays unchanged because the starter’s presentation was already sufficient; the exercise was about placing responsibility in the right runtime and theme boundary.

## Full code

### `sections/cart-guard.liquid`

```liquid
{% assign heading_id = 'CartGuard-' | append: section.id %}

{% if cart.item_count > 0 %}
  {% assign message = 'Your cart is ready for checkout.' %}
{% else %}
  {% assign message = 'Your cart is empty. Add an item to continue.' %}
{% endif %}

<section class="cart-guard" aria-labelledby="{{ heading_id }}">
  {% render 'cart-guard-message',
    heading: section.settings.heading,
    heading_id: heading_id,
    message: message
  %}
</section>

{{ 'cart-guard.css' | asset_url | stylesheet_tag }}

{% schema %}
{
  "name": "Cart guard",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Checkout status"
    }
  ],
  "presets": [
    {
      "name": "Cart guard"
    }
  ]
}
{% endschema %}
```

### `snippets/cart-guard-message.liquid`

```liquid
<h2 id="{{ heading_id }}" class="cart-guard__heading">
  {{ heading | default: 'Checkout status' | escape }}
</h2>

<p class="cart-guard__message">{{ message | escape }}</p>
```

### `assets/cart-guard.css`

```css
.cart-guard {
  border: 1px solid currentColor;
  padding: 1.25rem;
}

.cart-guard__heading,
.cart-guard__message {
  margin: 0;
}

.cart-guard__message {
  margin-top: 0.5rem;
}
```

## What people get wrong here

- **Writing a React-style conditional into an output delimiter.** `{{ cart.item_count > 0 ? 'Ready' : 'Empty' }}` is not a Liquid expression. The conditional belongs in Liquid control-flow tags, which select a value before output.
- **Calling the assigned message state.** `message` exists only while this server render runs. It cannot represent a later cart mutation and cannot notify the browser that anything changed.
- **Making the snippet read a caller-created `message` implicitly.** Rendered snippets are isolated from caller-created variables. Passing named parameters makes the dependency valid and inspectable.
- **Adding a browser listener to repair the empty-cart output.** That delays correctness until JavaScript runs and solves a server-rendered condition with the wrong runtime. The first response should already describe the cart accurately.

## Stretch: direction only

An asynchronous cart operation changes browser-side reality after the original Liquid response has completed. A browser-side runtime would need to own the interaction: make the cart request, receive the changed state, and update the relevant DOM safely. Liquid could contribute the next server-rendered response or markup contract, but it cannot observe that later event or update this already-delivered page by itself. Decide the exact client-side pattern in the later client-side theme chapters rather than retrofitting a framework into this focused notice.
