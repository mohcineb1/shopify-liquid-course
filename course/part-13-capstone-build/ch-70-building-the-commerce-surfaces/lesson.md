<!-- STATUS: final -->
---
id: ch-70
title: "Building the Commerce Surfaces"
part: 13
words: 2450
---

# Chapter 70 — Building the Commerce Surfaces

A commerce surface is not defined by its visual card or JavaScript widget. It is defined by the buyer task it completes, the Liquid/resource context it receives, the component that owns the interaction, the no-JavaScript or failure path, the accessibility contract, the editor boundary, and the response or data source that remains authoritative. The chapter-68 and chapter-69 records remain in force: no real Northstar market, catalog, plan, apps, data definitions, recommendation configuration, account mode, route, performance baseline, editor lifecycle, or acceptance result can be assumed. Keep each as `> [VERIFY]`.

This chapter deliberately builds a candidate architecture, not a production storefront. It does not configure a collection filter, create a metaobject, publish a search template, call a customer endpoint, add a cart, or alter a store. The code patterns are scoped examples; every candidate implementation needs a route fixture, owner, error behavior, release/rollback decision, and test.

## 70.1 Home page from composable theme blocks

The home page is a composition surface. It should let an editor arrange approved campaign, editorial, collection, product, service, and guidance components without treating the template as unrestricted HTML. A composable block earns its place only when its parent context, input data, heading/landmark behavior, allowed settings, empty state, CSS/JS owner, market policy, and quality cost are known.

A useful home composition might contain a hero, featured collection, editorial story, product-card list, service reassurance, and newsletter/signup surface `[VERIFY]`. That does not mean each is a globally reusable block. A product-card list needs a bounded product/collection input. A hero owns a clear heading/CTA/media contract. A newsletter component must not be silently added without a consent, provider, error, and fallback decision `[VERIFY]`. The template controls page-level ordering; each section or Theme Block controls its local semantics.

| Component decision | Required contract | Avoid |
| --- | --- | --- |
| Hero | Single heading level, media alt/crop/load priority, CTA destination, empty state | Duplicate page `h1`, decorative image announced as content |
| Product rail | Explicit collection/product list, card count, pagination/fallback policy | Fetching arbitrary catalog data in a snippet |
| Editorial story | Typed content reference or bounded editor fields | Global setting as a content database |
| Reassurance card | Verified claim owner and display conditions `[VERIFY]` | Invented delivery/sustainability/business claim |
| Theme Block | Parent, resource context, editor settings, depth and removal rule | Treating every snippet as an editor block |

Theme composition has platform limits. The verified ledger records 25 sections per JSON template, 50 blocks per section, 1,250 merchant-managed blocks per JSON template or section group, 300 block files per theme, and a maximum nested theme-block depth of eight.[1] Those are guardrails, not targets. The editorial contract should set a much smaller, buyer-justified maximum to prevent pages that are difficult to scan, test, translate, and load.

Use sections and blocks to provide editor choice, not to hide required commerce controls. A block should not make the product form optional by changing its parent’s data authority. It should not rely on a `product` object when placed on a home page unless it has an explicit product setting or compatible dynamic connection. The earlier component card tells a builder whether the right unit is a section, section block, Theme Block, snippet, or a deliberately route-specific section.

## 70.2 Collection page with filtering, sorting, pagination

A collection page helps a buyer narrow a set, understand the current subset, browse results, and move between result pages. Its baseline should render through Liquid: collection title/description as appropriate, products, current sort choice, filter form/control, and pagination. JavaScript may enhance the experience, but a URL-driven full-page transition remains a valuable failure and shareability path.

Shopify’s collection template guidance identifies filtering, sorting, and pagination as core collection concerns. Sorting uses the `sort_by` query parameter and the collection object exposes `sort_options`, current `sort_by`, and `default_sort_by`. A collection’s products are limited to 50 per page, so paginate rather than assuming a full catalog array.[2]

```liquid
{% paginate collection.products by 24 %}
  <form class="collection-controls" method="get">
    <label for="SortBy">Sort products</label>
    <select id="SortBy" name="sort_by" onchange="this.form.submit()">
      {% assign selected_sort = collection.sort_by | default: collection.default_sort_by %}
      {% for option in collection.sort_options %}
        <option value="{{ option.value }}" {% if option.value == selected_sort %}selected{% endif %}>{{ option.name }}</option>
      {% endfor %}
    </select>
  </form>

  <ul class="product-grid" role="list">
    {% for product in collection.products %}
      <li>{% render 'product-card', product: product, image_loading: 'lazy' %}</li>
    {% endfor %}
  </ul>
  {{ paginate | default_pagination }}
{% endpaginate %}
```

A candidate filtering enhancement must preserve query parameters, expose current active filters, explain zero results, provide a clear reset, restore sensible focus after a partial replacement `[VERIFY]`, and use locale-aware URLs. Do not create filters from arbitrary JavaScript predicates over currently rendered cards: that produces a false subset, hides pagination, and makes a URL impossible to share. Actual supported filters, filter labels, availability, Search & Discovery configuration, locale behavior, and catalog requirements are `[VERIFY]`.

If enhancing collection results through the Section Rendering API, request only sections the component owns, parse the response defensively, and retain the full-page path. Shopify allows rendering up to five sections per `sections` request; failed individual sections can be `null` even when HTTP status is 200.[3] The request cannot inject different section settings. Query parameters respected by a full page are respected by section rendering, so the URL must remain the source of filter/sort/page state.[3]

## 70.3 Product page: gallery, variant picker, metafield spec tables, related products

A product page joins several distinct responsibilities: media gallery, product identity/price, option selection, purchase form, structured specifications, supporting guidance, and recommendations. Keep them separate enough to test and replace. The product-information section owns the form and selected-product context. A gallery component owns media rendering and current-media enhancement. A variant picker owns option inputs and selected-state feedback. A spec table owns typed field presentation. A related-products surface owns recommendation intent and empty behavior. None should silently become the authority for price, availability, or checkout eligibility.

The product baseline should be useful without rich JavaScript: show title, media with descriptive/empty `alt` as appropriate, selected or available variant state `[VERIFY]`, visible labels for options, an add-to-cart form, and errors/availability feedback. Enhancements can synchronize gallery thumbnails, update a URL, refresh an owned section, or announce a changed state—but must retain focus and communicate changes to assistive technology.

High-variant products require special caution. Shopify documents that `product.variants` returns at most 250 variants, so a hidden input or `product | json` pattern that assumes every variant exists will not scale.[4] Build option UIs from `product.options_with_values` and contextual option values, then use selected option-value state and Section Rendering where needed. A selected option combination might not map to a variant, so code must handle the empty/null result rather than invent a fallback purchase ID.[4]

| Product surface | Data/authority | Accessibility and failure contract |
| --- | --- | --- |
| Gallery | Product media in product section context | Text alternatives; no auto-moving focus; raw image/link fallback |
| Option picker | Product options/selected state | Fieldset/legend or labelled controls; unavailable state explained |
| Product form | Platform form contract | Labelled controls, submit/error/status behavior; no card duplicate |
| Spec table | Typed metafield/reference `[VERIFY]` | Actual table semantics only when data is tabular; empty fields omitted/handled |
| Size guide | Explicit typed guide reference `[VERIFY]` | Link/section fallback; do not scrape product description |
| Related products | Recommendation intent/config `[VERIFY]` | Meaningful heading and empty state; no promise of recommendations |

Recommendations require intent clarity. Shopify distinguishes related products, which can be auto-generated, from complementary products, which require manual configuration through Search & Discovery.[5] A merchant’s actual recommendation setup is unknown. Render a recommendation component only if its source produces products, and record the placement, label, consent/tracking implications `[VERIFY]`, product-card contract, and no-result behavior.

## 70.4 Cart drawer and cart page with Section Rendering API

The cart page is the durable commerce baseline: line items, quantities, update/remove controls, notes or other fields only if their platform/merchant contract is verified, errors, subtotal/disclaimers, and a visible route to checkout. A cart drawer is an enhancement: a dialog-like owned component that gives fast feedback while preserving the cart page as a navigable, recoverable route.

A cart interaction must define the transaction boundary. The component requests an update through an authorised theme/Ajax contract `[VERIFY]`; it receives a response; it replaces only owned fragments; it updates an accessible status; it restores/preserves focus; and it handles network, server, malformed-HTML and unavailable-section errors without pretending success. Do not use a local counter/event as cart authority. Do not send arbitrary item/customer state across a global event bus. Do not modify checkout UI from the theme.

For cart-triggered updates, Shopify recommends considering bundled section rendering.[3] For a general Section Rendering request, use locale-aware `window.Shopify.routes.root` or current page path and treat section IDs as configuration generated by the rendered page rather than hard-coded template names. A request can return HTML for up to five sections, but each returned HTML value may be null; therefore replacement must be conditional and error reporting must remain visible.[3]

```js
async function refreshOwnedSections(sectionIds) {
  const response = await fetch(
    `${window.Shopify.routes.root}?sections=${sectionIds.join(',')}`
  );
  if (!response.ok) throw new Error('Section refresh failed');
  const rendered = await response.json();

  for (const id of sectionIds) {
    if (typeof rendered[id] !== 'string') continue;
    const current = document.querySelector(`[data-section-id="${id}"]`);
    if (current) current.innerHTML = rendered[id];
  }
}
```

This skeleton does not implement cart mutation. It illustrates fragment ownership and null guarding. A production candidate must also handle request ordering, response integrity, focus, announcement, drawer state, reinitialisation, analytics/consent boundaries `[VERIFY]`, and rollback to cart page navigation.

## 70.5 Search, account, blog, and content templates

These templates share foundation patterns but not data authority. Search owns a query, submitted/full-page result path, result state, pagination, empty/no-result language, and optional owned enhancement. It must escape/display the query safely and must not claim that a predictive-search feature or result schema exists until verified `[VERIFY]`.

Account pages are especially boundary-sensitive. Theme templates may present only the account surface supported by the store’s account configuration `[VERIFY]`; they cannot recreate authentication, expose order/customer data outside its context, or assume classic versus new customer accounts. Give a buyer a clear route/empty/error state and refer unsupported portal customization to its correct extension surface. Do not attach a theme DOM script that tries to retrieve customer data.

Blog and content templates should render authors’ structured content in semantic reading order: page/article heading, date/author only where appropriate `[VERIFY]`, body, associated image with an appropriate alternative, pagination/navigation, and related links. They need an editorial empty/preview workflow, not a commerce component hidden in a rich-text field. Every dynamic content block still needs a type, owner, market/locale policy, fallback, and archive decision.

## 70.6 Metaobject-driven size guides and store locator

Size guides and store locators are strong examples of structured reusable content. A guide may include title, body, measurement rows, applicability, image, locale/market relation and product associations `[VERIFY]`. A location may include name, address, hours, contact, map destination, accessibility/service information and an archival status `[VERIFY]`. These are candidate metaobject designs; actual fields, storefront visibility, references, market behavior, privacy implications and store data ownership must be verified before modelling.

Use a typed reference from product or a deliberate section setting to render a guide. Pass it explicitly to `guide-callout`; never assume every product has a guide. If measurement rows are truly tabular, use `table`, `caption`, headers and scope; otherwise use a descriptive list. A store locator starts with a meaningful no-JavaScript list and links to destinations. Any geolocation, map provider, third-party request, distance ranking, consent and API key must be separately authorised `[VERIFY]`; it is not a Liquid requirement.

| Structured content | Core contract | Safe fallback |
| --- | --- | --- |
| Size guide | Explicit reference, fields, product applicability, owner, empty/archival state | Link to guide page or omitted supporting block |
| Spec rows | Typed label/value/unit/order `[VERIFY]` | Omit absent row; no invented text |
| Store location | Published fields, validity, contact/accessibility markers `[VERIFY]` | Static accessible address/contact list |
| Locator enhancement | Consent/provider/error/timeout/ownership `[VERIFY]` | Filterless list and explicit location links |

The capstone does not require every sophisticated commerce feature. It requires surfaces that have clear authority, bounded data, usable baseline behavior and observable failure paths.

## Checklist

| Before chapter 71 | Evidence |
| --- | --- |
| Home components are composable but bounded | Parent/data/heading/editor/quality contracts |
| Collection state survives full page and enhancement | URL/filter/sort/page and null-section fixtures |
| Product page avoids variant overfetch assumptions | Options/empty selection/form/spec/recommendation tests |
| Cart drawer is optional and owned | Cart-page fallback, fragment/focus/error contract |
| Non-commerce templates retain their data boundaries | Search/account/content route and privacy fixtures |
| Reusable structured guides/locations have types and fallbacks | Reference/empty/table/list/consent decisions `[VERIFY]` |

## References

[1]: ../../docs/DEPRECATIONS.md "Verified theme limits ledger"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates/collection "Shopify — Collection template"
[3]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
[4]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products "Shopify — Support high-variant products"
[5]: https://shopify.dev/docs/storefronts/themes/product-merchandising/recommendations "Shopify — Product recommendations"
