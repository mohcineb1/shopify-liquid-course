<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 41 — Solution

## The approach

This configurator is not a hard headless signal. It has local, temporary state inside one section; Liquid can render the product, price, labels, default variant, and purchase form; and the brief provides no cross-route workflow or custom backend requirement. Mounting Preact over the section would reproduce server-owned markup merely to update one sentence. The correct decision is **no framework**: a small native module enhances the existing summary after a buyer changes an option. It is registered only after that intent, while the native form stays valid if the code never loads.

The implementation is intentionally constrained. It does not pretend the radio value is a cart variant ID, fetch product data, or mutate the cart. It reflects the selected option in a `role="status"` region that Liquid already renders. A real advanced configurator may later prove that a contained rendering library pays its cost; this exercise records the evidence required before making that leap.

## Walkthrough

**1 — decision record.** The record names the buyer task, baseline, localized enhancement boundary, change-triggered loading, server ownership, fallback, and removal test. It makes the decision reviewable rather than treating “small library” as an argument.

**2 — comparison.** Alpine would make a small local update possible but adds directive syntax without reducing the current complexity. htmx would require a server response boundary for a change that has no server work. Stimulus could be reasonable in a theme already standardized on it, but a single native module is clearer. Preact is rejected because it would redraw Liquid output.

**3 — Liquid stays authoritative.** The section keeps title, price, translated legend, radio controls, hidden variant input, and cart form. JavaScript can disappear without making a product unpurchasable.

**4 and 5 — narrow delayed code.** The inline bootstrap listens for the first `change` inside the configuration fieldset. Only then does it import the module and pass the already-rendered summary node. The module does not query or mount the overall section.

**6 — accessible update.** The summary remains text inside an `aria-live="polite"` / `role="status"` region. Radio inputs retain their keyboard semantics; the message says which option is active instead of relying on a visual swatch.

**7 — behavioral evidence.** Notes define the buyer task for disabled JavaScript, delayed module download, and deleting the runtime. Every case preserves the native form.

**8 — headless conclusion.** No durable cross-route state, private application backend, multi-channel frontend, or independent routing requirement exists. The theme is still the correct rendering boundary.

## Full code

### `sections/modular-shelving.liquid`

```liquid
{{ 'configuration-summary.css' | asset_url | stylesheet_tag }}
<section class="modular-shelving" data-configurator-section>
  <h1>{{ product.title }}</h1>
  <p data-product-price>{{ product.selected_or_first_available_variant.price | money }}</p>
  <form method="post" action="{{ routes.cart_add_url }}">
    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
    <fieldset data-configuration-controls>
      <legend>{{ 'products.product.variant' | t }}</legend>
      {% for variant in product.variants %}
        <label><input type="radio" name="shelf_option" value="{{ variant.title | escape }}" {% if variant == product.selected_or_first_available_variant %}checked{% endif %}> {{ variant.title }}</label>
      {% endfor %}
    </fieldset>
    <button type="submit">{{ 'products.product.add_to_cart' | t }}</button>
  </form>
  <aside data-configuration-summary role="status" aria-live="polite"><p>{{ product.selected_or_first_available_variant.title }}</p></aside>
</section>
<script>
  document.querySelector('[data-configuration-controls]')?.addEventListener('change', async (event) => {
    const { enhanceSummary } = await import('{{ 'configuration-summary.js' | asset_url }}');
    enhanceSummary(event.currentTarget, document.querySelector('[data-configuration-summary]'));
    event.currentTarget.dispatchEvent(new Event('configuration-ready'));
  }, { once: true });
</script>
{% schema %}
{"name":"Modular shelving","settings":[],"presets":[{"name":"Modular shelving"}]}
{% endschema %}
```

### `assets/configuration-summary.js`

```js
export function enhanceSummary(controls, summary) {
  if (!summary || controls.dataset.enhanced === 'true') return;
  controls.dataset.enhanced = 'true';
  const update = () => {
    const selected = controls.querySelector('input:checked');
    if (selected) summary.textContent = `Selected configuration: ${selected.value}`;
  };
  controls.addEventListener('change', update);
  update();
}
```

### `assets/configuration-summary.css`

```css
[data-configuration-summary] { border-inline-start: .25rem solid currentColor; margin-block: 1rem; padding-inline-start: .75rem; }
.modular-shelving input:focus-visible, .modular-shelving button:focus-visible { outline: .2rem solid currentColor; outline-offset: .2rem; }
```

### `decision.md`

```md
# Framework decision record

| Field | Decision |
| --- | --- |
| Buyer task | Compare local shelf options before native cart submission. |
| Native baseline | Liquid labels, checked default, price, and cart form. |
| Chosen boundary | Native module updates the existing summary only. |
| Load trigger | First option change. |
| Server contract | Liquid owns markup, translation, variant input, and form. |
| Failure behavior | Buyer uses the native controls and form. |
| Removal test | Delete the module; default purchase remains possible. |
```

### `notes.md`

```md
# Verification record

| Test | Required buyer task |
| --- | --- |
| JavaScript disabled | Read default option and submit the product form. |
| Slow module | Change radios and still understand selected control before text updates. |
| Runtime removed | Choose default configuration and add to cart. |
| Headless review | No hard signal: no cross-route app state, backend workflow, channel, or routing requirement. |
```

## What people get wrong here

**Mounting an application over the section.** It replaces markup Liquid already owns and causes drift in translation, price, schema, and editor behavior. The summary is the only interaction boundary.

**Loading eagerly.** The buyer may never change a configuration option; paying runtime cost before that intent is unnecessary. The first change is a deliberate boundary.

**Using a framework name as the decision.** “Preact is small” does not state a buyer task, failure mode, or removal test. A decision record does.

**Calling this headless.** A local dynamic summary has none of the rendering or operational signals that justify separate storefront ownership.

## Stretch: direction only

Define the experiment before shipping: randomize only eligible traffic, compare eager with intent-triggered code, use completed configurable purchase as the primary outcome, and keep error rate plus interaction latency as guardrails. Interpret synthetic performance metrics as diagnostics, not evidence of conversion causality.


## Delivery and recovery review

The load trigger must be observable in a network trace. On initial navigation, no configuration module should be requested merely because the section is present. After the buyer changes an option, the page can import the small module and update the pre-existing status node. If the import is delayed or fails, the radio itself still exposes the selected value and the native form retains the default Shopify submission route. Do not hide the button, replace the form action, or require the summary sentence before purchase.

The module also has a deliberately narrow data contract: a controls element and a summary element. It does not receive a serialized product object, page container, or a renderer callback. That prevents accidental growth into a client copy of Liquid. If requirements later add dependent pricing, inventory validation, cross-route saved configurations, account-specific rules, or an application-owned backend, write a new decision record. Those changes may justify a separately tested island or expose a real headless signal; they do not retroactively make today’s local text update a framework problem.

Review the implementation with the asset removed, with a throttled connection, and after an editor section replacement. The buyer must still read the option labels, see which control is checked, and submit the form. The enhancement is acceptable only if it is additive under all three conditions.
