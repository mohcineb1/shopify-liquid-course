<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 39 — Solution

## The approach

The solution leaves `main-search` as an ordinary localized GET form, then enhances only when JavaScript runs. It deliberately requests product, collection, and query suggestions with a small all-types cap, but receives their presentation from Shopify-rendered `predictive-search` Liquid rather than JSON/browser templates. The custom element owns input lifecycle, debounce, abort/current-request version, parsing a stable result root, opening/closing state, and keyboard behavior. Liquid owns grouped resource markup, returned URLs, escape/translation policy, and the option IDs that the combobox references.

The result list is a server response, so every request validates HTTP and the incoming root before replacing the slot. Empty input, errors, unavailable locale, throttle, and stale responses close/suppress suggestions while preserving form submit. Focus never leaves the input while navigating options; active selection uses `aria-activedescendant`. This separates an assistive prediction layer from the authoritative full search page.

> [VERIFY] Replace the example section ID/feature assumptions with the target theme’s predictive-search section and test actual buyer locale, Search & Discovery configuration, response root, resource URLs, and 422/417/429 behavior.

## Walkthrough

**1. Native/search resource contract.** The search form uses `routes.search_url`, `q`, a submitted prefix option, and a normal button. The request encodes term/resource types/limit and uses `window.Shopify.routes.root`; returned links are followed untouched. It does not output resource body content.

**2. Liquid display contract.** The section loops over `predictive_search.resources` and produces headings plus unique listbox options. This keeps formatting, escaping, labels, and future merchant theme rules on the server. The browser only replaces the slot contents after parsing a real `#predictive-search-results` root.

**3. Current requests and keyboard.** Debounce reduces pressure; abort plus version makes the latest input the only result eligible to commit. Arrow keys set an active option, Enter follows it or submits native form, Escape closes, and Tab leaves naturally. Every replacement re-queries current options.

## Full code

### `sections/main-search.liquid`

```liquid
<script src="{{ 'predictive-search.js' | asset_url }}" defer></script>
<section class="main-search">
  <predictive-search data-section-id="predictive-search">
    <form action="{{ routes.search_url }}" method="get" role="search">
      <label for="Search">Search</label>
      <input id="Search" name="q" type="search" role="combobox" aria-expanded="false" aria-controls="predictive-search-results" aria-autocomplete="list" aria-haspopup="listbox">
      <input type="hidden" name="options[prefix]" value="last">
      <button type="submit">Search</button>
      <div data-predictive-slot></div>
    </form>
  </predictive-search>
</section>
{% schema %}{ "name": "Main search", "settings": [] }{% endschema %}
```

### `sections/predictive-search.liquid`

```liquid
{%- if predictive_search.performed -%}
  <div id="predictive-search-results">
    {%- assign option_index = 0 -%}
    {%- if predictive_search.resources.queries.size > 0 -%}
      <h2 id="PredictiveQueries">Suggested searches</h2><ul role="listbox" aria-labelledby="PredictiveQueries">
      {%- for query in predictive_search.resources.queries -%}{%- assign option_index = option_index | plus: 1 -%}<li id="PredictiveOption-{{ option_index }}" role="option" aria-selected="false"><a href="{{ query.url }}">{{ query.text | escape }}</a></li>{%- endfor -%}</ul>
    {%- endif -%}
    {%- if predictive_search.resources.collections.size > 0 -%}
      <h2 id="PredictiveCollections">Collections</h2><ul role="listbox" aria-labelledby="PredictiveCollections">
      {%- for collection in predictive_search.resources.collections -%}{%- assign option_index = option_index | plus: 1 -%}<li id="PredictiveOption-{{ option_index }}" role="option" aria-selected="false"><a href="{{ collection.url }}">{{ collection.title | escape }}</a></li>{%- endfor -%}</ul>
    {%- endif -%}
    {%- if predictive_search.resources.products.size > 0 -%}
      <h2 id="PredictiveProducts">Products</h2><ul role="listbox" aria-labelledby="PredictiveProducts">
      {%- for product in predictive_search.resources.products -%}{%- assign option_index = option_index | plus: 1 -%}<li id="PredictiveOption-{{ option_index }}" role="option" aria-selected="false"><a href="{{ product.url }}">{{ product.title | escape }}</a></li>{%- endfor -%}</ul>
    {%- endif -%}
    {%- if option_index == 0 -%}<p>No suggestions. Submit search for all results.</p>{%- endif -%}
  </div>
{%- endif -%}
{% schema %}{ "name": "Predictive search", "settings": [] }{% endschema %}
```

### `assets/predictive-search.js`

```js
class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('[role="combobox"]'); this.slot = this.querySelector('[data-predictive-slot]');
    this.timer = null; this.controller = null; this.version = 0; this.active = -1;
    this.input.addEventListener('input', () => { clearTimeout(this.timer); this.timer = setTimeout(() => this.change(), 250); });
    this.input.addEventListener('keydown', (event) => this.keys(event));
  }
  options() { return [...this.slot.querySelectorAll('[role="option"]')]; }
  close() { this.active = -1; this.input.setAttribute('aria-expanded', 'false'); this.input.removeAttribute('aria-activedescendant'); this.slot.replaceChildren(); }
  async change() {
    const term = this.input.value.trim(); if (!term) return this.close();
    this.controller?.abort(); this.controller = new AbortController(); const mine = ++this.version;
    const url = new URL(`${window.Shopify.routes.root}search/suggest`, window.location.origin);
    url.searchParams.set('q', term); url.searchParams.set('resources[type]', 'product,collection,query');
    url.searchParams.set('resources[limit]', '6'); url.searchParams.set('resources[limit_scope]', 'all');
    url.searchParams.set('section_id', this.dataset.sectionId);
    try {
      const response = await fetch(url, { signal: this.controller.signal }); if (!response.ok) throw new Error(response.status);
      const html = await response.text(); if (mine !== this.version) return;
      const incoming = new DOMParser().parseFromString(html, 'text/html').querySelector('#predictive-search-results');
      if (!incoming) throw new Error('Predictive root missing');
      this.slot.replaceChildren(incoming); this.input.setAttribute('aria-expanded', 'true');
    } catch (error) { if (error.name !== 'AbortError' && mine === this.version) this.close(); }
  }
  keys(event) {
    const options = this.options(); if (event.key === 'Escape') return this.close();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!options.length) return; event.preventDefault();
      this.active = event.key === 'ArrowDown' ? Math.min(this.active + 1, options.length - 1) : Math.max(this.active - 1, 0);
      options.forEach((node, index) => node.setAttribute('aria-selected', index === this.active ? 'true' : 'false'));
      this.input.setAttribute('aria-activedescendant', options[this.active].id);
    }
    if (event.key === 'Enter' && this.active >= 0) { event.preventDefault(); options[this.active].querySelector('a')?.click(); }
    if (event.key === 'Tab') this.close();
  }
}
customElements.define('predictive-search', PredictiveSearch);
```

### `assets/predictive-search.css`

```css
[data-predictive-slot] { display: none; }
[aria-expanded="true"] + input + button + [data-predictive-slot], [data-predictive-slot]:has(#predictive-search-results) { display: block; }
[role="option"][aria-selected="true"] { outline: .15rem solid currentColor; }
```

### `notes.md`

```markdown
# Predictive search contract and evidence

| Concern | Evidence/decision |
| --- | --- |
| Locale URL/feature availability | Root URL and target buyer locale/feature checked. |
| Resource scope/limit | Product, collection, query; cap 6/all scope. |
| Section ID/result root | `predictive-search` and `#predictive-search-results` verified. |
| Empty/pending/open/error states | Empty/error closes; current valid response opens. |
| Debounce/abort/version | 250ms, abort predecessor, current version commits only. |
| 422/417/429 behavior | Close/recover native form; respect throttle guidance. |
| Keyboard/ARIA contract | Input owns active descendant; arrows/Enter/Escape/Tab tested. |
| Pointer/full submit/no-JS | Links/form/natural submit validated. |
```

All five starter paths are mirrored under `solution/`.

## What people get wrong here

- They fetch JSON and rebuild product/body markup in JavaScript. That duplicates escaping, translation, formatting, and merchant display policy.
- They debounce but omit abort/version checks. A slow old response can still overwrite the current term.
- They turn headings or arbitrary links into options. A combobox requires a clear, current selectable option model.
- They close or clear the form on 417/429. Prediction is optional; native full search remains the recovery path.

## Stretch: direction only

Gate query-suggestion rendering on the observed supported locale/resource behavior, omit the group in Liquid when unavailable, then have the browser enumerate only actual option nodes after replacement. The combobox must not assume a group exists.


## Verification and recovery

Test empty input, a no-result term, query/product/collection matches, rapidly changed terms, keyboard paths, full form submission, and JavaScript disabled. Under throttled network, preserve evidence that only the final request opens results; aborted/old requests must not change expanded state. Test the actual locale-prefixed path and a buyer locale where prediction is unavailable. For 422 configuration mistakes, 417 unsupported locale, 429 throttle, missing section root, or 5xx failure, close the enhancement quietly and retain typed input plus ordinary submit. Record response byte size, debounce timing, abort count, and observed active-descendant behavior with assistive technology; prediction improves navigation but must never become a point of failure for search.

Full search always remains available to every buyer.
