<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 37 — Solution

## The approach

The native collection form and pagination links remain the source of recovery. Enhancement creates a target URL from that native destination, adds two verified **instance** IDs to `sections`, then requests server-rendered facets and collection results together. It validates every response/root before changing DOM, so a null section or parse failure leaves the old coherent collection intact. The script uses both an `AbortController` and monotonically increasing version: cancellation reduces wasted work, while the version proves that an almost-complete old response cannot win.

The update does not fetch or mutate cart state. Collection filter state belongs to the target URL; a cart mutation should instead use the appropriate Cart API/bundled-section rendering workflow. The solution’s `notes.md` makes these boundaries and actual theme IDs part of the release contract.

> [VERIFY] Replace the illustrative IDs below with the actual instance IDs read from the target collection page’s `shopify-section-*` wrappers. Test the response against the published theme and its locale/market path.

## Walkthrough

**1. Native navigation remains intact.** The `submit` handler is attached only after the browser loads the JavaScript. If parsing/requesting/validation fails, it does not clear old results and announces a link-based recovery. Pagination can be routed through the same `requestUpdate` function, while unhandled links preserve navigation.

**2. URL, locale, and two coordinated sections.** `new URL(form.action)` plus `FormData` retains Shopify-owned filter query names. It uses `window.Shopify.routes.root` only as the locale-aware fallback base and requests the facets/grid IDs in one `sections` call. Two response regions form one collection state.

**3. Parse then commit.** The code first reads JSON, rejects `null`, parses each HTML string with `DOMParser`, and verifies that both current/incoming wrapper roots exist. Only after this validation does it replace both roots. It never assigns complete section markup to the grid’s inner HTML.

**4. Current request wins.** Every update aborts its predecessor and captures an incremented version. Error/loading cleanup checks that version, avoiding an older request turning off the newer pending state. `AbortError` is expected; a real error exposes recovery without destroying navigation.

**5. Cost and history.** The script requests two necessary sections, measures response bytes, and changes history only after a current coherent commit. `popstate` reloads the URL state through the same contract. The notes record byte size and cancelled/stale outcomes before scaling to more sections.

## Full code

### `sections/facets.liquid`

```liquid
<section id="shopify-section-{{ section.id }}" data-section-id="{{ section.id }}" class="facets">
  <form action="{{ collection.url }}" method="get" data-filter-form>
    {% for filter in collection.filters %}
      <details><summary>{{ filter.label }}</summary>
        {% for value in filter.values %}<label><input type="checkbox" name="{{ value.param_name }}" value="{{ value.value }}"{% if value.active %} checked{% endif %}>{{ value.label }}</label>{% endfor %}
      </details>
    {% endfor %}
    <button type="submit">Apply filters</button>
  </form>
  <p class="collection-update-status" data-collection-status aria-live="polite"></p>
</section>
{% schema %}{ "name": "Facets", "settings": [] }{% endschema %}
```

### `sections/main-collection-product-grid.liquid`

```liquid
<section id="shopify-section-{{ section.id }}" data-section-id="{{ section.id }}" class="collection-results">
  <h2 tabindex="-1" data-results-heading>{{ collection.products_count }} products</h2>
  {% paginate collection.products by 24 %}
    <div data-product-grid>{% for product in collection.products %}<article>{{ product.title | escape }}</article>{% endfor %}</div>
    {{ paginate | default_pagination }}
  {% endpaginate %}
</section>
{% schema %}{ "name": "Collection grid", "settings": [] }{% endschema %}
```

### `assets/collection-sections.js`

```js
const contract = {
  sections: ['facets', 'main-collection-product-grid'], // replace with target instance IDs
  selector(id) { return `#shopify-section-${CSS.escape(id)}`; }
};
let controller;
let version = 0;

function targetUrl(form) {
  const url = new URL(form.action, window.location.origin);
  const data = new FormData(form);
  url.search = new URLSearchParams(data).toString();
  url.searchParams.set('sections', contract.sections.join(','));
  return url;
}

function parsedRoots(payload) {
  return contract.sections.map((id) => {
    if (payload[id] == null) throw new Error(`Section unavailable: ${id}`);
    const current = document.querySelector(contract.selector(id));
    const incoming = new DOMParser().parseFromString(payload[id], 'text/html').querySelector(contract.selector(id));
    if (!current || !incoming) throw new Error(`Section root mismatch: ${id}`);
    return { current, incoming };
  });
}

async function requestUpdate(destination, push = true) {
  controller?.abort();
  controller = new AbortController();
  const mine = ++version;
  document.documentElement.classList.add('is-loading');
  try {
    const response = await fetch(destination, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const roots = parsedRoots(JSON.parse(text));
    if (mine !== version) return;
    roots.forEach(({ current, incoming }) => current.replaceWith(incoming));
    const committed = new URL(destination); committed.searchParams.delete('sections');
    if (push) history.pushState({}, '', committed);
    document.querySelector('[data-collection-status]')?.replaceChildren(document.createTextNode('Results updated.'));
    document.querySelector('[data-results-heading]')?.focus();
    console.info('collection sections bytes', text.length);
  } catch (error) {
    if (error.name !== 'AbortError' && mine === version) {
      document.querySelector('[data-collection-status]')?.replaceChildren(document.createTextNode('Could not update results. Use Apply filters to load the page.'));
    }
  } finally {
    if (mine === version) document.documentElement.classList.remove('is-loading');
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-filter-form]');
  if (!form) return;
  event.preventDefault(); requestUpdate(targetUrl(form));
});
window.addEventListener('popstate', () => requestUpdate(new URL(window.location.href), false));
```

### `assets/collection-sections.css`

```css
.facets, .collection-results { display: grid; gap: 1rem; }
.is-loading .collection-results { opacity: .65; }
.collection-update-status { border-left: .25rem solid currentColor; padding: .75rem; min-height: 1.5rem; }
```

### `notes.md`

```markdown
# Section response contract and evidence

| Concern | Contract/evidence |
| --- | --- |
| Target URL and locale base | Filter form action/current locale route; never hard-code collection path. |
| Requested instance IDs | Inspect current `shopify-section-*` wrappers; maximum five API sections. |
| Expected wrapper roots | Each JSON key must contain its matching wrapper ID. |
| JSON/null/HTTP handling | HTTP and every value/root validate before commit; null retains prior DOM. |
| Commit/history/popstate | Two roots replace together; history after success; popstate re-renders URL. |
| Abort/version behavior | New input aborts predecessor; version rejects late completion. |
| Failure/native recovery | Existing form/link navigation stays usable. |
| Requested sections/bytes | Facets + grid only; record bytes/latency. |
| Keyboard/status/focus | Live status then results heading focus after explicit submit. |
| Cart boundary | No cart fetch here; use cart/bundled section workflow for mutations. |
```

All five starter paths are mirrored under `solution/`.

## What people get wrong here

- They request `facets` and `main-collection-product-grid` as section types without inspecting dynamic instance IDs. The API then returns null/mismatched content.
- They call `innerHTML` on the grid with full section HTML. The DOM becomes structurally wrong and leaves related facets/count/pagination stale.
- They rely on `abort()` alone. A near-complete earlier response can still arrive; version comparison is the committed-state guard.
- They push history before parsing/committing. Back/Forward then points at a URL the visible grid never successfully rendered.

## Stretch: direction only

An append strategy needs a separate contract: identify the next-page URL, deduplicate products, retain the normal pagination link, announce count/new items, decide focus, and define how Back navigates an appended sequence. Do not treat it as simple `insertAdjacentHTML`.


## Release verification

Test a rapid filter sequence under throttled network and retain the network log: the only committed DOM must correspond to the last selected URL, while earlier requests show abort or harmless stale completion. Test a missing/`null` requested section and an HTTP failure; previous facets/grid remain usable and the native form still navigates. Test a localized collection URL, selected filters, pagination, Back/Forward, keyboard submit, and status/focus behavior. Record response byte sizes for the exact two-section request before adding any further sections; rendering a cart count here would create cost and inconsistency without a cart mutation.
