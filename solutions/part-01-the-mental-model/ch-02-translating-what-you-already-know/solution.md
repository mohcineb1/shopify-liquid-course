<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 2 — Solution

## The approach

The cart guard is a small theme feature, not a client component. Its source of truth already exists at the theme render boundary: the cart available for the cart-page request. The section owns the merchant-facing configuration and placement. The snippet owns the repeated heading-and-message markup. The section passes named values into that snippet rather than relying on variables it happened to create nearby.

There is no JavaScript because the exercise asks for truthful initial HTML, not an in-place update after an asynchronous cart action. Liquid makes the server-side choice once for this response. If the buyer changes the cart later without a navigation, browser JavaScript would own the new interaction; that is deliberately outside this answer.

The design is intentionally smaller than a component-framework solution. It does not create a client abstraction merely to choose between two strings. The merchant-facing title is durable theme configuration; the cart condition is request-specific data; the selected message is a short-lived Liquid variable. Naming those three responsibilities prevents the misleading claim that all named values in a file are “state.” It also gives future work a safe boundary: richer browser behavior can be added later without changing which layer owns the initial render.

## Walkthrough

### 1. Merchant-configurable cart-page notice

`sections/cart-guard.liquid` is a section with a text setting named `heading` and a preset. The schema makes the setting available in the theme editor; placing the section in a cart template makes it a cart-page notice. The section is responsible for this editor contract, not the snippet.

The important distinction is placement versus reuse. The merchant needs an editor-visible unit because the heading belongs to a campaign decision. A reusable file can render the display, but it should not silently become the owner of a theme-editor setting. Keeping the setting at the section boundary means the file a merchant configures is also the file that declares the configuration.

### 2. Different messages for a non-empty and empty cart

The section checks `cart.item_count` during the theme render. A cart with one or more items receives the ready-to-checkout message; an empty cart receives the add-an-item message. Both messages are rendered in the HTML Shopify sends for that request.

This choice is deliberately made before the browser receives markup. There is no hidden fallback state, no data attribute waiting for a client script, and no CSS class that tries to decide whether an empty-cart sentence is visible. A hard refresh against either cart condition remains correct because Shopify supplies the cart object again for the next theme render.

### 3. Current cart state, not invented component state

The two `assign` statements only name the selected message while this Liquid file renders. They do not persist, trigger a re-render, or attempt to mirror cart state in the browser. `cart.item_count` remains the source of truth.

That is why assigning `message` is useful without being React-like state. It improves local readability by letting the markup receive one display value, but it carries no lifecycle. On a later request Liquid evaluates the condition again. On a later browser-only cart mutation, this variable no longer exists at all, which is exactly the runtime boundary the chapter asks you to preserve.

### 4. Reusable markup with explicit input

`snippets/cart-guard-message.liquid` renders the title and message. The section passes `heading`, `heading_id`, and `message` as named parameters. This is the relevant Liquid boundary: the snippet receives a small, visible input surface rather than accessing caller-created variables implicitly.

The input list is also a maintenance aid. A developer opening the snippet can see what it needs without reconstructing its caller’s local variables. The fallback title protects the heading relationship if a merchant later clears the setting, while `escape` keeps the merchant-controlled text and selected message safe for HTML output. Neither safeguard changes the cart decision itself.

### 5. No framework or hydration

The implementation contains Liquid, HTML, schema JSON, and a theme stylesheet only. Shopify renders the initial HTML; no framework bundle reconstructs a component tree and no browser code is needed to make the initial notice correct.

“Without a build requirement” does not mean a theme may never use authoring tools. It means this feature’s correctness does not depend on a bundler, a compiled client module, or a hydration handoff. The section and snippet can be understood and rendered by the current theme model as written, which is the relevant constraint for this small server-side notice.

### 6. Supplied presentation asset

The section references `cart-guard.css` from `assets/` with the documented asset URL and stylesheet filters. The mirrored CSS file stays unchanged because the starter’s presentation was already sufficient; the exercise was about placing responsibility in the right runtime and theme boundary.

Loading an asset from the section does not make CSS responsible for content logic. The asset provides the border, spacing, and typography hooks that the finished markup expects. If the stylesheet fails to load, the HTML still contains the same correct title and cart-specific message. That is a useful test for whether presentation and request truth were actually separated.

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
- **Letting a presentation rule choose the message.** A CSS-only hide/show trick can make a screenshot look correct, but both incompatible statements remain in the response. The cart condition is data-dependent and must be selected before the server sends the markup.

## Stretch: direction only

An asynchronous cart operation changes browser-side reality after the original Liquid response has completed. A browser-side runtime would need to own the interaction: make the cart request, receive the changed state, and update the relevant DOM safely. Liquid could contribute the next server-rendered response or markup contract, but it cannot observe that later event or update this already-delivered page by itself. Decide the exact client-side pattern in the later client-side theme chapters rather than retrofitting a framework into this focused notice.
