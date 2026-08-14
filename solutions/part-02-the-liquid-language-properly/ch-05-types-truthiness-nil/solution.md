<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 5 — Solution

## The approach

The panel has four states that happen to produce small pieces of text but must not share one generic fallback. Product availability is a boolean owned by the current product. The launch note is merchant text whose useful-content test is `blank`. The featured image is an optional product value whose absence needs an explicit result. The cart count is numeric until it is deliberately turned into presentation text.

The implementation establishes its local values in one `{% liquid %}` group, then gives each state its own visible output. That keeps a reader from confusing “unavailable product,” “no merchant note,” and “no featured image.” The section remains product-template-only, so `product` is a valid contextual root, while `cart` is global cart state. There is no client calculation, lookup, or browser request to repair server-rendered information.

## Walkthrough

### 1. Preserve the starter and its product context

The solution retains the stylesheet include, semantic sections, heading setting, launch-note setting, and preset. Its schema adds an `enabled_on` product-template constraint. That restriction is part of the data contract: the central readiness message and image state depend on the current `product`, so the section should not be addable in a context where that object is not supplied.

The stylesheet is mirrored unchanged. The learner’s work is value classification and output behavior, not CSS. Keeping the same presentation also makes it easier to compare the starter’s two placeholders with the final states that replace them.

### 2. Select a boolean-owned readiness message

`product.available` is a boolean. A normal conditional is therefore the correct test: the code starts with the ready message and changes it inside `unless product.available`. This is distinct from asking whether content is blank. A product can be unavailable while still having a title, image, cart count, and launch note; availability is one product property, not a proxy for every other state.

The title is output with `escape`. The readiness paragraph then combines that safe title with the server-selected message. This is present in the original HTML, so JavaScript being blocked cannot make the readiness result stale or missing.

### 3. Use `blank` for the merchant note

`section.settings.launch_note` is copied into a locally named value, `note_message`. The output checks `note_message == blank`, not a plain `if`. That choice handles an unfilled textarea, empty text, and whitespace-only text as an absent merchant message. The fallback says exactly what happened: no launch note has been configured.

When the note has usable content, it is escaped before it reaches HTML. The branch does not infer product availability, and the product-availability branch does not infer whether a merchant wrote a note. Those independent conditions are why the panel can give a reviewer a useful diagnosis rather than one undifferentiated empty state.

### 4. Treat the featured image as an optional object value

The featured-image branch tests whether `product.featured_image` is absent before reporting its state. It does not output an empty image container and hope a reviewer notices the gap. The available result and missing result are intentionally descriptive, but neither invents an image URL or a product fallback.

> [VERIFY] For a production feature that must distinguish every Shopify image-empty result, verify the relevant product-image object reference and its documented empty behavior. This exercise only needs the documented optional-value guard taught in the chapter.

That verification boundary is important: optional product data and a blank merchant setting may both look empty in output, but they have different owners and may be represented differently by their source contracts.

### 5. Preserve numeric behavior until display

`cart.item_count` starts as a number. `next_cart_count` is assigned with `plus: 1`, so arithmetic happens before the result is inserted into the sentence. The final paragraph creates a display label after both values are ready. A cart with zero items therefore renders `0 items` and a next count of `1`; zero is not treated as an absent state.

This avoids a common drift: appending text to a count and then attempting to reuse that display string as a number. Keep calculation values and output labels separate, even when the feature is as small as one status line.

The zero-item case is the useful review test. In JavaScript, a casual truthiness check around a numeric count might skip a value of `0`. Liquid does not make that shortcut correct or incorrect by itself; the requirement decides whether the panel should display the count, branch on a specific comparison, or present an empty-cart experience. Here the count is information the reviewer needs, so it is always rendered as a number before the sentence supplies its label.

### 6. Keep silent output diagnostic

Every branch here turns a known optional or configuration state into intentional markup. That is different from writing an undocumented property and accepting its blank output. If a future edit makes the title, note, image, or cart line unexpectedly empty, first confirm the render context and documented object path. Do not replace the missing value with unrelated content merely to remove an empty region from a screenshot.

A compact test matrix makes that decision reviewable. Test an available product with a configured note and image, an unavailable product with a configured note, a product with an empty note, and a product without a featured image. Then test the cart-count line at zero. Each case should change only the output owned by that state. If clearing the launch note changes the availability sentence, or an unavailable product removes the cart count, the implementation has coupled states that the data model keeps separate.

## Full code

### `sections/launch-readiness.liquid`

```liquid
{{ 'launch-readiness.css' | asset_url | stylesheet_tag }}

{% liquid
  assign readiness_message = 'Ready for launch review.'
  assign note_message = section.settings.launch_note
  assign next_cart_count = cart.item_count | plus: 1

  unless product.available
    assign readiness_message = 'Unavailable: resolve product availability before publishing.'
  endunless
%}

<section class="launch-readiness" aria-labelledby="LaunchReadiness-{{ section.id }}">
  <div class="launch-readiness__inner">
    <p class="launch-readiness__eyebrow">Merchandising review</p>
    <h2 id="LaunchReadiness-{{ section.id }}">{{ section.settings.heading | escape }}</h2>

    <div class="launch-readiness__status" data-launch-readiness-status>
      <p>{{ product.title | escape }} — {{ readiness_message }}</p>
      <p>Current cart: {{ cart.item_count }} item{% if cart.item_count != 1 %}s{% endif %}. After one item: {{ next_cart_count }}.</p>
    </div>

    <div class="launch-readiness__note" data-launch-readiness-note>
      {% if note_message == blank %}
        <p>No launch note has been configured.</p>
      {% else %}
        <p>{{ note_message | escape }}</p>
      {% endif %}

      {% if product.featured_image != nil %}
        <p>Featured image is available for this product.</p>
      {% else %}
        <p>Featured image has not been supplied for this product.</p>
      {% endif %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Launch readiness",
  "tag": "section",
  "class": "section-launch-readiness",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Launch readiness" },
    { "type": "textarea", "id": "launch_note", "label": "Launch note", "default": "" }
  ],
  "presets": [{ "name": "Launch readiness" }],
  "enabled_on": { "templates": ["product"] }
}
{% endschema %}
```

### `assets/launch-readiness.css`

```css
.launch-readiness { margin-block: 2rem; }
.launch-readiness__inner { border: 1px solid rgb(89 57 19 / 22%); border-radius: .75rem; background: #fffaf2; color: #422b14; padding: clamp(1.25rem, 3vw, 2rem); }
.launch-readiness__status, .launch-readiness__note { border-block-start: 1px solid rgb(89 57 19 / 16%); margin-block-start: 1rem; padding-block-start: 1rem; }
```

## What people get wrong here

- **Using a plain `if` for the launch note.** Empty text is truthy in Liquid, so it can produce an empty-looking branch instead of the intended fallback.
- **Treating a missing image like an empty merchant setting.** The values have different owners and may have different documented empty contracts.
- **Using `cart.item_count` as a truthiness test for an empty cart.** `0` is truthy in Liquid; compare or format according to the actual requirement.
- **Appending text before arithmetic.** A label is display text, not a dependable numeric input for later calculation.
- **Accepting silent output from an undocumented property.** Verify the object and property path before adding a cosmetic fallback.

## Stretch: direction only

For a resource lookup with no result, identify the lookup surface, read its documented empty behavior, and name the buyer-facing state the feature needs. Compare that with a text setting by checking its schema type and whether `blank` represents the intended absence. Record the decision in a source note or a learner note; do not hide the distinction behind one catch-all fallback.
