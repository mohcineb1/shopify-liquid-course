<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 28 — Solution

## The approach

The solution never uses a complete `product.variants` list as a browser database. Liquid renders `product.options_with_values` and contextual option-value properties. A change collects the checked value IDs in fieldset order, requests the owning section with `option_values`, and replaces the returned product surface. Shopify then computes the next availability state in the request context. The returned section owns the selected variant ID, price, media, quantity rule, availability, and selling-plan allocations together.

The picker distinguishes three outcomes. An available resolved variant enables purchase. An unavailable resolved variant remains selected and shows an unavailable purchase state. A selection that has no variant emits no cart ID, disables purchase, and states that the combination is unavailable. A combined-listing value carries `product_url`; its request can return sibling-product content, so the code replaces the full product surface rather than only updating a label.

> [VERIFY] Confirm the target theme’s Section Rendering API URL shape, the section markup selector, and the current `product_option_value` contract before using this pattern. The example preserves the documented high-variant strategy but intentionally keeps integration-specific selectors local.

## Walkthrough

### 1. Render initial selection in Liquid

The section begins with `product.selected_or_first_available_variant`. This respects a variant deep link. The option controls use `options_with_values`, carry option-value IDs and product URLs, and mark `selected`/`available` from Shopify. The rendered form ID is omitted when no variant is resolved; the button state therefore cannot accidentally submit the last successful combination.

### 2. Avoid complete-variant matching

No hidden select loops over every `product.variants`; no `product | json` payload is emitted. This avoids the 250-variant limit and does not force the client to invent the combination-matching algorithm. The limited state JSON identifies the currently rendered product/variant and is useful only for component initialization or diagnostics. The request path, not that JSON, resolves the next state.

### 3. Make one scoped request

The script listens inside one picker. It orders inputs by fieldset DOM order, creates a URL from the newly selected option value’s `product_url` or the current component product URL, and supplies its section ID plus comma-separated option IDs. An `AbortController` cancels the previous request. The loading state lives on the product section and a local live status reports a material state change without disabling the rest of the page.

### 4. Replace atomically and restore focus

The returned document is parsed; the matching product section replaces the old one as a whole. This single operation keeps form, media, price, quantity, plan allocations, and picker state from different render snapshots out of the DOM. The new corresponding input receives focus by its stable option-value ID. If no result or request arrives, the old valid surface remains and the status explains the failure.

### 5. Verify all outcomes

Use the notes table for available, unavailable, no-variant, rapid-change, keyboard, and sibling-product cases. Check that the request URL preserves option order. A combined-listing choice must change all product-owned content, while a same-product choice can still use the same replacement boundary for correctness and simpler state management.

## Full code

### `sections/variant-picker.liquid`

```liquid
{{ 'variant-picker.css' | asset_url | stylesheet_tag }}
{% assign current_variant = product.selected_or_first_available_variant %}
<section class="variant-picker" data-product-surface data-product-url="{{ product.url }}" data-section-id="{{ section.id }}" aria-busy="false">
  <h1>{{ product.title | escape }}</h1>
  <p class="variant-picker__status" data-picker-status aria-live="polite"></p>

  {% if current_variant %}
    <p data-variant-price>{{ current_variant.price | money }}{% if current_variant.compare_at_price > current_variant.price %} <s>{{ current_variant.compare_at_price | money }}</s>{% endif %}</p>
  {% endif %}

  <div data-option-picker>
    {% for option in product.options_with_values %}
      <fieldset data-option-position="{{ option.position }}"><legend>{{ option.name | escape }}</legend>
        {% for option_value in option.values %}
          {% assign input_id = section.id | append: '-' | append: option.position | append: '-' | append: option_value.id %}
          <input id="{{ input_id }}" type="radio" name="option-{{ option.position }}" value="{{ option_value | escape }}" data-option-value-id="{{ option_value.id }}" data-product-url="{{ option_value.product_url }}" {% if option_value.selected %}checked{% endif %} {% unless option_value.available %}disabled{% endunless %}>
          <label for="{{ input_id }}">{{ option_value | escape }}{% unless option_value.available %} — unavailable{% endunless %}</label>
        {% endfor %}
      </fieldset>
    {% endfor %}
  </div>

  <form method="post" action="{{ routes.cart_add_url }}">
    {% if current_variant %}<input type="hidden" name="id" value="{{ current_variant.id }}">{% endif %}
    {% if current_variant and current_variant.quantity_rule %}
      <label for="Quantity-{{ section.id }}">Quantity</label>
      <input id="Quantity-{{ section.id }}" type="number" name="quantity" value="{{ current_variant.quantity_rule.min }}" min="{{ current_variant.quantity_rule.min }}" step="{{ current_variant.quantity_rule.increment }}" {% if current_variant.quantity_rule.max != nil %}max="{{ current_variant.quantity_rule.max }}"{% endif %}>
    {% endif %}
    {% if current_variant and current_variant.selling_plan_allocations != blank %}
      <fieldset><legend>Purchase option</legend>{% for allocation in current_variant.selling_plan_allocations %}<label><input type="radio" name="selling_plan" value="{{ allocation.selling_plan.id }}" {% if allocation.selling_plan.selected %}checked{% endif %}>{{ allocation.selling_plan.name | escape }} — {{ allocation.price | money }}</label>{% endfor %}</fieldset>
    {% endif %}
    <button type="submit" {% unless current_variant and current_variant.available %}disabled{% endunless %}>{% if current_variant and current_variant.available %}Add to cart{% else %}Unavailable{% endif %}</button>
  </form>

  {% if current_variant and current_variant.featured_media %}<div class="variant-picker__media">{{ current_variant.featured_media | media_tag }}</div>{% endif %}
  {% render 'variant-state', product: product, current_variant: current_variant %}
</section>
<script src="{{ 'variant-picker.js' | asset_url }}" defer></script>
{% schema %}
{ "name": "Variant picker", "settings": [] }
{% endschema %}
```

### `assets/variant-picker.js`

```js
let activeRequest;

document.addEventListener('change', async (event) => {
  const changed = event.target.closest('[data-option-value-id]');
  if (!changed) return;
  const surface = changed.closest('[data-product-surface]');
  const picker = surface?.querySelector('[data-option-picker]');
  if (!surface || !picker) return;

  activeRequest?.abort();
  activeRequest = new AbortController();
  const selectedIds = [...picker.querySelectorAll('fieldset input:checked')]
    .map((input) => input.dataset.optionValueId)
    .filter(Boolean);
  const url = new URL(changed.dataset.productUrl || surface.dataset.productUrl, window.location.origin);
  url.searchParams.set('section_id', surface.dataset.sectionId);
  url.searchParams.set('option_values', selectedIds.join(','));

  const focusId = changed.id;
  const status = surface.querySelector('[data-picker-status]');
  surface.setAttribute('aria-busy', 'true');
  if (status) status.textContent = 'Updating product options…';
  try {
    const response = await fetch(url, {signal: activeRequest.signal});
    if (!response.ok) throw new Error('Variant section request failed');
    const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
    const nextSurface = documentFragment.querySelector('[data-product-surface]');
    if (!nextSurface) throw new Error('Variant section missing from response');
    surface.replaceWith(nextSurface);
    const restored = document.getElementById(focusId);
    restored?.focus();
    const nextStatus = nextSurface.querySelector('[data-picker-status]');
    if (nextStatus) nextStatus.textContent = nextSurface.querySelector('input[name="id"]') ? 'Product options updated.' : 'This option combination is unavailable.';
  } catch (error) {
    if (error.name !== 'AbortError' && status) status.textContent = 'Product options could not be updated. Try again.';
  } finally {
    surface.setAttribute('aria-busy', 'false');
  }
});
```

### `assets/variant-picker.css`

```css
.variant-picker { display: grid; gap: 1rem; }
.variant-picker fieldset { display: flex; flex-wrap: wrap; gap: .5rem; }
.variant-picker [aria-busy="true"] { opacity: .65; }
.variant-picker__status { min-block-size: 1.5rem; }
.variant-picker__media img, .variant-picker__media video, .variant-picker__media model-viewer { display: block; max-inline-size: 100%; }
.variant-picker input:disabled + label { cursor: not-allowed; opacity: .6; text-decoration: line-through; }
```

### `snippets/variant-state.liquid`

```liquid
<script type="application/json" data-variant-state>
{
  "productId": {{ product.id | json }},
  "variant": {% if current_variant %}{
    "id": {{ current_variant.id | json }},
    "available": {{ current_variant.available | json }},
    "price": {{ current_variant.price | json }},
    "mediaId": {{ current_variant.featured_media.id | json }}
  }{% else %}null{% endif %}
}
</script>
```

### `notes.md`

```markdown
# Variant picker verification

| Scenario | Observed state | Server recovery / outcome |
| --- | --- | --- |
| Available selection | Price, form ID, media, quantity and plan match returned variant. | Fresh section replaces the component. |
| Unavailable variant | Selection remains visible; submit is disabled. | No fallback variant is selected. |
| Nonexistent combination | No form ID; unavailable message is rendered. | Server returns explicit null-variant state. |
| Rapid changes | Earlier request is aborted. | Most recent response owns the surface. |
| Keyboard selection | Focus returns to the stable option-value control. | Live status announces the update. |
| Combined-listing sibling | Product title/media/options can change together. | `product_url` fetch replaces full surface. |
```

All five files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They use `product.variants` as complete client state. High-variant products can return only a partial array.
- They map variants with display labels. Labels can be translated, repeated, reordered, or not correspond to a valid combination.
- They update price after a change but retain an old cart ID. The UI then promises one configuration while submitting another.
- They treat a combined listing as a local option mutation. Its sibling product owns a different content surface and must replace product state.

## Stretch: direction only

Define a history owner before adding `pushState`. A user-initiated selection can write the canonical option-value URL after successful section replacement; a `popstate` handler can request the URL state without writing another entry. Preserve focus and announce the resulting product transition, but do not create a history entry for an aborted or unresolved selection.
