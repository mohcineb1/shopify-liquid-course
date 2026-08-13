<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 1 — Solution

## The approach

The panel has three different owners, so the solution keeps three different kinds of work apart. The current product title exists while Shopify renders the product template; render it in Liquid and escape it as text. A dispatch preference is only a local, non-authoritative preview; browser JavaScript can change that sentence after the HTML arrives. Discount eligibility is a commerce decision, not a theme decision; render an honest static statement instead of simulating a discount engine.

That split is more important than the few lines of code. The section must still communicate its product and platform facts if JavaScript fails, is blocked, or has not loaded. The script therefore changes exactly one element—the browser-owned preview—and does not fetch, calculate a discount, or alter server-owned content.

## Walkthrough

### 1. Add the section in product context

The completed schema uses `enabled_on` with the `product` template type. That makes the component available where its `product` object is meaningful instead of letting a merchant add it to an arbitrary page. The schema preserves the starter’s preset so the section can be added through the theme editor.

### 2. Render the product title before JavaScript

`{{ product.title | escape }}` is the server-rendered value. It exists in the delivered HTML, so viewing source or disabling JavaScript still shows the product identity. `escape` matters because a title can include `&`, angle brackets, quotes, or non-ASCII characters; the browser should receive text, not merchant-authored markup.

### 3. Update the local dispatch preview in the browser

The script reads only the radio inputs in this section and writes one of two fixed messages into `data-dispatch-preview`. It has no network request and it does not mutate the product title. The default standard message is already in the Liquid response; JavaScript only changes the sentence after the buyer selects another option.

### 4. Show the owner of each responsibility

The three labels make the split inspectable in the storefront: **Theme render** for the current product, **Browser** for the transient preference preview, and **Shopify platform rule** for discount eligibility. The labels are not decorative. They prevent a future maintainer from adding a backend-like operation to a theme section merely because an adjacent interaction uses JavaScript.

### 5. Keep discount eligibility out of the theme

The section explicitly says that it does not calculate discount eligibility. A theme can render a merchant-configured explanation, but it cannot become the authority for a checkout rule by updating a sentence in the DOM. The correct implementation path depends on the commerce behavior required, but it is not this section and it is not browser-side arithmetic.

### 6. Avoid requests and runtime dependencies

The JavaScript has no `fetch`, imported package, app client, or external endpoint. It uses the DOM APIs the browser already provides. Liquid has no equivalent runtime request in the first place, so the architecture remains valid without making the initial render dependent on an unavailable operation.

### 7. Preserve text output for unusual titles

The product title stays in an ordinary text node. Liquid’s `escape` filter encodes special HTML characters without changing ordinary Unicode characters, so a title such as `Été & Oolong <Reserve>` appears as readable text rather than injecting markup.

## Full code

### `solutions/part-01-the-mental-model/ch-01-where-liquid-actually-sits/solution/sections/runtime-brief.liquid`

```liquid
{{ 'runtime-brief.js' | asset_url | script_tag }}

<section class="runtime-brief" data-runtime-brief>
  <div class="runtime-brief__inner">
    <p class="runtime-brief__eyebrow">Launch team briefing</p>
    <h2>Where this feature runs</h2>

    <dl class="runtime-brief__owners">
      <div class="runtime-brief__row">
        <dt>Current product</dt>
        <dd data-product-title>{{ product.title | escape }}</dd>
        <dd class="runtime-brief__owner" data-product-owner>Theme render</dd>
      </div>

      <div class="runtime-brief__row">
        <dt>Dispatch preview</dt>
        <dd data-dispatch-preview>Standard dispatch usually leaves our studio within two business days.</dd>
        <dd class="runtime-brief__owner" data-dispatch-owner>Browser</dd>
      </div>

      <div class="runtime-brief__row">
        <dt>Discount eligibility</dt>
        <dd data-discount-rule>Discount eligibility is a Shopify platform rule; this theme section does not calculate it.</dd>
        <dd class="runtime-brief__owner" data-discount-owner>Shopify platform rule</dd>
      </div>
    </dl>

    <fieldset class="runtime-brief__choices">
      <legend>Dispatch preference</legend>
      <label>
        <input type="radio" name="dispatch-{{ section.id }}" value="standard" checked>
        Standard dispatch
      </label>
      <label>
        <input type="radio" name="dispatch-{{ section.id }}" value="priority">
        Priority dispatch
      </label>
    </fieldset>
  </div>
</section>

{% schema %}
{
  "name": "Runtime brief",
  "tag": "section",
  "class": "section-runtime-brief",
  "settings": [],
  "presets": [{ "name": "Runtime brief" }],
  "enabled_on": { "templates": ["product"] }
}
{% endschema %}
```

### `solutions/part-01-the-mental-model/ch-01-where-liquid-actually-sits/solution/assets/runtime-brief.js`

```js
(() => {
  const brief = document.querySelector('[data-runtime-brief]');

  if (!brief) return;

  const preview = brief.querySelector('[data-dispatch-preview]');
  const choices = brief.querySelectorAll('input[name^="dispatch-"]');

  const messages = {
    standard: 'Standard dispatch usually leaves our studio within two business days.',
    priority: 'Priority dispatch moves this order to the next available packing window.',
  };

  for (const choice of choices) {
    choice.addEventListener('change', () => {
      if (!choice.checked) return;
      preview.textContent = messages[choice.value];
    });
  }
})();
```

## What people get wrong here

**Putting the product title in JavaScript.** If the script starts from an empty placeholder and obtains product data asynchronously, the initial response is less useful and the exercise no longer demonstrates the Liquid boundary. The product-template context already supplies the title during rendering.

**Calling an endpoint to change a local sentence.** A network call adds latency, failure modes, and authorization questions to a two-option UI preference. The dispatch preview has no authoritative state, so a local event listener is the correct scope.

**Calculating a discount in the browser.** Even if a client-side formula looks correct, the browser is not the authority that applies the price. It will diverge from platform rules and is vulnerable to tampering. Leave the rule outside the theme section.

**Querying the whole document without component scope.** A global selector such as `document.querySelector('[data-dispatch-preview]')` makes multiple instances interfere with each other. Starting at `brief` scopes both inputs and output to one section instance.

## Stretch: direction only

Treat personalized delivery pricing as an ownership exercise before you choose a technology. Identify whether the price is authoritative, which checkout or cart moment needs it, what store data it reads, whether the decision must be enforced, and which supported Shopify extension point owns that decision. Document the selection criteria and hand the actual implementation to the system that owns the rule; do not turn the preview section into a pricing engine.
