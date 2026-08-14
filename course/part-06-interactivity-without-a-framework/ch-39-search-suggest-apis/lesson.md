<!-- STATUS: final -->
---
id: ch-39
title: "Search & Suggest APIs"
part: 6
---

# Chapter 39 — Search & Suggest APIs

Predictive search is an assistive view of the real search journey, not a replacement for it. A buyer types a partial query, the theme requests suggestions from Shopify’s locale-aware Predictive Search API, and a server-rendered Liquid section presents products, collections, pages, articles, and query suggestions in the store’s current language and rules. Correctness requires more than fetching results: choose resources deliberately, preserve native search submission, render merchant-controlled HTML on the server, control request frequency and arrival order, and implement a complete keyboard/listbox interaction rather than a decorative dropdown.

## What you’ll be able to do

- Request predictive resources and interpret their type, limit, availability, locale, and error contracts.
- Render suggestions with `predictive_search` in a Liquid section rather than reproducing server presentation in browser templates.
- Build a debounced, cancellation-safe accessible combobox/listbox layer around an ordinary search form.

## 39.1 The Predictive Search API and its resource types

`GET /{locale}/search/suggest.json?q=…` returns predictive resources for a query. Accepted `resources[type]` values are `product`, `page`, `article`, `collection`, and `query`; the documented default is `query,product,collection,page`. The result is grouped in `resources.results` arrays. [1]

```js
const query = 'bag';
const url = new URL(`${window.Shopify.routes.root}search/suggest.json`, window.location.origin);
url.searchParams.set('q', query);
url.searchParams.set('resources[type]', 'product,collection,query');
url.searchParams.set('resources[limit]', '6');
const response = await fetch(url);
if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);
const data = await response.json();
```

Choose types based on the job. Products help a buyer select merchandise; collections help them browse; pages/articles support editorial discovery; query suggestions refine terms. Do not request every type because “more results” sounds useful: suggestion density, relevance, available screen space, and merchant search configuration determine whether a resource class helps. The full search result page still owns broader search/pagination/filtering behavior; see `ch-32-content-objects` and `ch-29-collections`.

`resources[limit]` accepts **1 through 10**, defaulting to 10. `resources[limit_scope]` is `all` by default or `each` to apply the limit per resource type. Product availability can be `show`, `hide`, or `last` (default); these are search configuration/UI choices, not local inventory truth. [1]

The JSON response includes URLs and product/resource data. Use returned URLs rather than constructing handles. Do not output `body` content from resource objects in a multilingual store: Shopify warns that it can contain a combination of translated content. Variant-specific query matches can alter returned product URL/media to match the relevant variant, so preserve the supplied URL rather than guessing a product route. [1]

Predictive requests can fail with 422 invalid parameter, 417 unsupported buyer locale, 429 throttling (with `Retry-After`), or 5xx responses. Treat these as a quiet close/recovery of suggestions while keeping the search form ready for ordinary submit. A 429 is not a reason to retry instantly; reduce request pressure and respect the response’s recovery direction.

> [VERIFY] Confirm target-store Search & Discovery settings, enabled predictive-search language, resource availability policy, returned URLs, and real error responses. The `shopify-features` signal and an actual locale route establish whether prediction is available for a buyer session. [1]

## 39.2 Rendering suggestions with a Liquid section instead of client templates

The JSON endpoint is useful for custom data consumers, but a theme predictive UI normally benefits from `GET /{locale}/search/suggest?...&section_id=predictive-search`. Shopify renders that section with the `predictive_search` object populated for the query and returns HTML. The section owns grouping, image/price formatting, escaping, translated labels, merchant content, availability presentation, and result links; JavaScript requests/parses/swaps its output. [1]

```liquid
{%- if predictive_search.performed -%}
  <div id="predictive-search-results">
    {%- if predictive_search.resources.products.size > 0 -%}
      <h2 id="PredictiveProducts">Products</h2>
      <ul role="listbox" aria-labelledby="PredictiveProducts">
        {%- for product in predictive_search.resources.products -%}
          <li id="PredictiveOption-{{ forloop.index }}" role="option"><a href="{{ product.url }}">{{ product.title | escape }}</a></li>
        {%- endfor -%}
      </ul>
    {%- endif -%}
  </div>
{%- endif -%}
```

This is not merely a templating preference. A Liquid section maintains one display policy for first render, predictive update, language/market context, merchant-controlled settings, and future theme changes. Browser code does not need to replicate money formatting, HTML escaping, image markup, resource taxonomy, or translation logic. It needs a stable outer slot, validates the response, and restores behavior after replacement.

```js
const html = await response.text();
const documentFragment = new DOMParser().parseFromString(html, 'text/html');
const incoming = documentFragment.querySelector('#predictive-search-results');
if (!incoming) throw new Error('Predictive result root missing');
results.replaceChildren(...incoming.childNodes);
```

Use the endpoint’s real section ID, not a section type guessed from a dynamic page instance. A failed section request has its own HTTP error behavior—404 if section not found; 417, 422, 429, or 5xx in other cases—so keep old results until a valid current response arrives, or close the list without destroying the input/form. The broader partial-update response/root discipline belongs to `ch-37-the-section-rendering-api`.

## 39.3 Debouncing, keyboard navigation, ARIA combobox pattern

Start from a native form with `action="{{ routes.search_url }}"`, a search input named `q`, and a real submit path. `routes.search_url` preserves locale-aware routing; an optional hidden `options[prefix]` can preserve full-search partial-word behavior. JavaScript enhances input events only when prediction is supported and query text is meaningful.

```liquid
<form action="{{ routes.search_url }}" method="get" role="search">
  <label for="Search">Search</label>
  <input id="Search" name="q" type="search" role="combobox" aria-expanded="false" aria-controls="predictive-search-results" aria-haspopup="listbox" aria-autocomplete="list">
  <input type="hidden" name="options[prefix]" value="last">
  <button type="submit">Search</button>
</form>
```

Debounce prevents a request on every keystroke; it does not establish ordering. Use an `AbortController` for superseded requests plus a sequence token so a late response for `sh` cannot replace current `shirt` results. Clear/close on empty input. On throttle or failure, close suggestions and preserve submission rather than repeatedly retrying.

```js
let controller; let version = 0;
async function suggest(term) {
  controller?.abort(); controller = new AbortController();
  const mine = ++version;
  const response = await fetch(buildSuggestionUrl(term), { signal: controller.signal });
  if (!response.ok) throw new Error(response.status);
  const html = await response.text();
  if (mine !== version) return;
  renderCurrentResults(html);
}
```

The input is the combobox; suggestions are a controlled listbox/option collection. On open, set `aria-expanded="true"`; on close, false. Down/Up move an active index through enabled options; expose the active option with `aria-activedescendant` when focus remains in the input. Enter follows the active option when one is selected, otherwise submits the native form. Escape closes and clears active selection. Tab generally exits naturally without trapping focus; click/touch activation follows the target link. Recompute options after every server-rendered replacement; never keep node references/indexes from an old list.

Keep headings/group labels available to assistive technology, distinguish “no suggestions” from failure when useful, and avoid announcing every keystroke/result replacement through an aggressive live region. Announce meaningful state changes after debounce/current response. Test with keyboard, touch, screen reader, JavaScript disabled, a slow network, empty query, result-free query, and a locale where prediction is unavailable.

## Gotchas

- Replacing ordinary search with suggestions and leaving no full-search form submit.
- Requesting or rendering resource bodies that corrupt multilingual content.
- Asking for the default maximum on every short keystroke without debounce/cancellation.
- Treating a delayed old response as current results.
- Inserting raw JSON into client templates that drift from theme formatting/translation policy.
- Using `role="combobox"` without expanded state, controlled list, active descendant, Escape, Enter, and arrow-key behavior.
- Retrying 429 responses immediately and increasing throttle pressure.

## Checklist

- [ ] The native localized search form submits useful full results without JavaScript.
- [ ] Resource type, limit/scope, availability policy, and returned URL usage are intentional.
- [ ] A Liquid predictive section renders `predictive_search`; browser code validates/safely swaps its stable slot.
- [ ] Debounce, abort, and token checks protect request cost and current state.
- [ ] Combobox/listbox roles, active option, keyboard paths, failure/empty behavior, and focus are tested.

## Related

- `ch-29-collections` — filters and navigation query state.
- `ch-32-content-objects` — full search/article/page content rendering.
- `ch-37-the-section-rendering-api` — server-rendered response/root replacement.
- `ch-40-browser-state` — durable browser-side state and event boundaries.

## References

[1]: https://shopify.dev/docs/api/ajax/reference/predictive-search "Shopify — Predictive Search API reference"
[2]: https://shopify.dev/docs/storefronts/themes/navigation-search/search/predictive-search "Shopify — Add predictive search to your theme"
[3]: https://shopify.dev/docs/storefronts/themes/navigation-search/search "Shopify — Storefront search"

## Selecting suggestion scope deliberately

A predictive panel has a finite attention budget. Start with the query types that answer the buyer’s likely next action, then establish a presentation budget for each group. For example, a product-focused retail search may show a small number of products plus query refinements; a content-led brand might show articles/pages beside products. `limit_scope=all` shares a result cap across requested types, while `each` may multiply visible content by returning up to the limit for every type. Neither is automatically better. Test a short query, a long specific query, a zero-result query, and a query that matches a product variant title. The panel should help the buyer decide whether to select a suggestion or submit a fuller search, not become a second unscannable result page.

Returned data has server meaning that presentation must respect. A product suggestion may point at a matching variant URL; follow that URL rather than rewriting it to a base product page. Collection title matching follows its own language constraints, and query suggestions have their own availability restrictions. Resource order/content can change with Search & Discovery configuration, availability settings, market, and buyer locale. That is why a Liquid section has a better long-term boundary: it can render empty groups conditionally and retain one theme policy as merchant settings evolve.

The full search form should preserve its query options independently of predictive request options. A store can choose different scoped resources or availability treatment for suggestions and full results, but this must be intentional and documented. The dropdown must never claim that it has searched the whole catalog if it is deliberately limited to a few predictive resource types.

## Predictive-search interaction state

Model the component as explicit states rather than scattered DOM classes: **idle** (empty/closed), **pending** (meaningful query after debounce), **open** (current valid results), **empty** (current valid response without selectable results), **error/unavailable** (close suggestions but preserve form), and **committed navigation** (a link or form submit takes over). The input value and request version identify state; server-rendered markup identifies the current options. A pending request for an old term may never open or close the list after the user has changed/cleared input.

A practical lifecycle is: trim input; if empty abort/close/reset active option; otherwise schedule debounce; when scheduled work begins increment version and abort predecessor; build a locale-aware URL with encoded query/resource settings/section ID; request response; on success compare version and input term; parse target result root; replace slot; enumerate selectable options; open only if a current term and usable response remain; on known errors close and leave native search intact. Every transition sets `aria-expanded` consistently and clears `aria-activedescendant` when no option is active.

```js
function closeSuggestions(input, results) {
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
  results.replaceChildren();
}

function setActive(input, options, index) {
  options.forEach((option, position) => option.setAttribute('aria-selected', position === index ? 'true' : 'false'));
  input.setAttribute('aria-activedescendant', options[index].id);
}
```

The server section should assign stable unique option IDs for the current response. Client code should query actual `[role="option"]` elements after each replacement rather than trusting a numeric result count or matching link text. If results have grouped headings, headings label their group/list and must not be mistaken for options. A no-results response may remain visually open with a concise text message, but it has zero active options; Down/Up and Enter must then follow their documented neutral behavior.

## Keyboard and assistive-technology acceptance criteria

Arrow Down from input opens current results and selects the first option; Arrow Up selects the previous option or last option only under a deliberate documented wrap policy. Home/End are optional additions only when they do not interfere with expected text-input editing. Escape closes the list and removes active descendant without erasing the buyer’s typed query. Enter follows selected suggestion if one exists; otherwise native form submission remains. Tab closes or allows natural exit without trapping focus. Pointer click follows the selected result. Ensure the option is communicated through the combobox’s active descendant and that visual active styling does not rely solely on color.

Do not focus a freshly injected list element on every input: the user is still typing in the search field. Keep focus in input and update active-descendant for arrow navigation. Announce only meaningful results/no-results/error state after debounce; chatty per-keystroke live output makes typing unusable. Test browser speech/keyboard behavior against the actual screen reader/browser combinations the storefront supports, and preserve a visible submit button for no-JavaScript, unsupported-locale, throttled, or failed prediction paths.

## Load, throttle, and failure discipline

Debounce timing is a product decision: too short makes unnecessary calls; too long makes suggestions feel detached. Measure request count, abort count, 429 responses, response bytes, request-to-render time, and late responses under realistic typing. Set a minimum meaningful query threshold only if it serves product/search quality; do not confuse a client threshold with a platform rule. On 429, close or maintain a quiet retry-later state and respect `Retry-After`; repeating immediate requests worsens service. On 417 unsupported locale, keep full search functional and avoid presenting prediction as broken. On 422, log/configure the invalid parameter rather than concealing it with repeated retries.
