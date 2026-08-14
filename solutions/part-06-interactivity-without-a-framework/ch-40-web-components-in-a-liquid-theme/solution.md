<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 40 — Solution

## The approach

The product form stays authoritative. The custom element owns only local feedback that is possible after the baseline markup exists; it does not become a second cart API. This preserves useful HTML before upgrade and prevents this exercise from leaking into the cart-interaction chapter. Each product card owns one `quick-add-card`, so its listener, presentation state, and cleanup follow its particular DOM instance rather than a page-global initializer.

Liquid renders the local configuration as attributes and renders the confirmation copy as HTML. The browser parses the scalar boolean deliberately, establishes a listener owned by one abort signal, and toggles only its own existing status region. Shopify editor replacement disconnects the old element and connects the new one. The editor adapter is consequently narrow: it searches only the event target and asks cards there to clear transient feedback. Light DOM is intentional: a form, its button, and an app-adjacent badge remain available to merchant CSS and integrations.

> [VERIFY] Before intercepting a real product form to do an actual cart add, verify the intended cart API and error/recovery contract; this exercise confines itself to local presentation and keeps ordinary native submission as its safe baseline.

## Walkthrough

**1 — usable markup first.** Every product retains an ordinary form with `method="post"`, `routes.cart_add_url`, its selected variant ID, and a native button. The un-upgraded custom tag does not hide or replace that form.

**2 — typed boundary configuration.** `section.id` and `show_confirmation` are Liquid attributes. The component compares `dataset.showConfirmation` to `'true'`; attributes are strings, so a bare truthiness check would make `'false'` accidentally enable the behavior.

**3 — status in server markup.** The translated confirmation is a `role="status"` paragraph that begins hidden. The component exposes it locally, preserving both the native button and understandable non-color feedback.

**4 — lifecycle cleanup.** A new connection aborts any preceding controller, then binds one submit listener. Disconnection aborts it. This eliminates listener accumulation across replacement or reinsertion.

**5 — editor scope.** The bubbled `shopify:section:load` event targets the changed section. The adapter limits its selector to `event.target` and calls a public refresh method; it never reinitializes the document.

**6 and 7 — light-DOM extension surface.** There is no Shadow DOM. Scoped CSS begins at the element name and preserves ordinary descendants for theme CSS, apps, and debugging.

**8 — evidence.** The verification record tests first load, editor setting changes, removal/re-addition, JavaScript disabled, keyboard submission, and an adjacent app badge.

## Full code

### `sections/room-ready-picks.liquid`

```liquid
{{ 'quick-add-card.css' | asset_url | stylesheet_tag }}
<script src="{{ 'quick-add-card.js' | asset_url }}" defer="defer"></script>

<section class="room-ready-picks" data-section-id="{{ section.id }}">
  {% if section.settings.heading != blank %}<h2>{{ section.settings.heading | escape }}</h2>{% endif %}
  <div class="room-ready-picks__grid">
    {% for product in collections[section.settings.collection].products limit: 4 %}
      <article class="room-ready-picks__card">
        {{ product.featured_image | image_url: width: 720 | image_tag: loading: 'lazy' }}
        <h3><a href="{{ product.url }}">{{ product.title }}</a></h3>
        <p>{{ product.price | money }}</p>
        <quick-add-card data-section-id="{{ section.id }}" data-show-confirmation="{{ section.settings.show_confirmation }}">
          <form method="post" action="{{ routes.cart_add_url }}">
            <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
            <button type="submit" {% unless product.available %}disabled{% endunless %}>{{ 'products.product.add_to_cart' | t }}</button>
          </form>
          <p data-confirmation role="status" hidden>{{ 'products.product.added_to_cart' | t }}</p>
        </quick-add-card>
        <div class="room-ready-picks__app-slot" data-app-badge-slot></div>
      </article>
    {% else %}<p>Choose a collection with products.</p>{% endfor %}
  </div>
</section>

{% schema %}
{
  "name": "Room-ready picks",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Room-ready picks" },
    { "type": "collection", "id": "collection", "label": "Collection" },
    { "type": "checkbox", "id": "show_confirmation", "label": "Show add confirmation", "default": true }
  ],
  "presets": [{ "name": "Room-ready picks" }]
}
{% endschema %}
```

### `assets/quick-add-card.js`

```js
class QuickAddCard extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.form = this.querySelector('form');
    this.confirmation = this.querySelector('[data-confirmation]');
    this.showConfirmation = this.dataset.showConfirmation === 'true';
    this.form?.addEventListener('submit', (event) => this.handleSubmit(event), {
      signal: this.controller.signal,
    });
  }

  disconnectedCallback() { this.controller?.abort(); }

  handleSubmit(event) {
    if (!this.showConfirmation || !this.confirmation) return;
    event.preventDefault();
    this.confirmation.hidden = false;
  }

  refreshFromMarkup() { this.confirmation?.setAttribute('hidden', ''); }
}

if (!customElements.get('quick-add-card')) customElements.define('quick-add-card', QuickAddCard);

document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelectorAll('quick-add-card').forEach((card) => card.refreshFromMarkup());
});
```

### `assets/quick-add-card.css`

```css
quick-add-card { display: block; margin-block-start: 1rem; }
quick-add-card [data-confirmation][hidden] { display: none; }
quick-add-card [data-confirmation] {
  border-inline-start: 0.25rem solid currentColor;
  margin-block-start: 0.75rem;
  padding-inline-start: 0.75rem;
}
quick-add-card button:focus-visible { outline: 0.2rem solid currentColor; outline-offset: 0.2rem; }
```

### `notes.md`

```md
# Verification record

| Evidence | Expected result |
| --- | --- |
| First load | One listener per upgraded card and hidden confirmation. |
| Setting edit | Fresh markup reads its setting with no duplicate response. |
| Remove/re-add | Disconnected listener aborts and new card responds once. |
| JavaScript disabled | Form posts with the selected variant ID. |
| Keyboard submission | Native button is reachable; status has text and a border cue. |
| App badge | Adjacent badge stays in light DOM and remains styleable. |
```

## What people get wrong here

**One document-level listener.** It looks concise on first load and becomes a duplicate-response bug after editor replacements. Lifecycle ownership belongs to the component instance, not a selector over all cards.

**A Shadow DOM reflex.** It hides descendants that merchant CSS and app integrations may expect to find. A product-card extension surface should stay light DOM until isolation has a concrete, tested advantage.

**Truthiness for a data attribute.** The string `'false'` is truthy. Parse the setting at its attribute boundary or the merchant cannot reliably disable it.

**A JavaScript-only button.** It destroys the ordinary form route and smuggles cart behavior into an unrelated unit. Enhancement must add to the form, never replace it.

## Stretch: direction only

Treat a custom event as an explicit contract. Choose a name that reports a completed local confirmation, keep `detail` small and serializable, and decide whether bubbling is needed for a separately owned cart indicator. The receiving component should subscribe at its own boundary and neither component should query the other’s private markup. Do not add cart mutation or rendering here.


## Behavior checks and recovery boundary

The important test is not whether the status can become visible once; it is whether its ownership remains correct after the DOM changes. Load the page, submit from one card, and confirm no sibling status changes. In the editor, toggle the merchant setting several times and submit from the newly rendered card after each replacement. A single action must cause one local state transition. Remove the section while a card is focused, then re-add it and ensure no retained document listener responds to the new button.

When the setting is false, the handler deliberately does not prevent submission. The buyer follows the native form route instead of receiving an incomplete enhancement. The same applies when the status node is missing: no local feedback is preferable to breaking a purchase path. In a production quick-add implementation, a successful asynchronous cart operation would reveal the message only after the cart response is verified, while failure would keep the form usable and describe recovery. That transport and recovery policy is intentionally deferred; this component establishes the lifecycle and markup contract required to add it safely later.

Use browser developer tools to inspect the resulting DOM. The custom tag is a selector anchor, not an opaque container. The form, button, status region, and nearby app badge remain visible to theme extensions. Test keyboard activation of the button and a forced slow script load. Before component registration, the form must still retain its target, hidden input, labelable submit control, and product context. This proves progressive enhancement rather than merely demonstrating a JavaScript interaction.
