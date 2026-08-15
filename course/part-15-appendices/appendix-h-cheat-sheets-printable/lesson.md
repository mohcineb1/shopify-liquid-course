<!-- STATUS: final -->
---
id: app-h
title: "Cheat Sheets (printable)"
part: 15
words: 2250
---

# Appendix H — Cheat Sheets (printable)

These cards are designed for printing or keeping beside an editor. They are retrieval aids, not a replacement for platform documentation or a component/data contract. Copy a pattern only after confirming the Liquid object, route context, data type and current platform support. The verified deprecation/limit ledger is dated 2026-08-13; anything absent from it is `> [VERIFY]`.

## Syntax card

| Need | Liquid pattern | Reminder |
| --- | --- | --- |
| Output | `{{ product.title }}` | Escape or use a context-appropriate filter where required. |
| Assign | `{% assign card_title = product.title %}` | Keep state local and descriptive. |
| Condition | `{% if product != blank %}...{% endif %}` | Blank behavior is a real UI state. |
| Loop | `{% for product in collection.products %}` | Paginate collection output. |
| Capture | `{% capture id %}Card-{{ section.id }}{% endcapture %}` | Useful for stable local identifiers. |
| Comment | `{% comment %} reason {% endcomment %}` | Explain boundary/decision, not syntax. |
| Render | `{% render 'price', price: price %}` | Pass named inputs; `include` is deprecated. |
| Form | `{% form 'product', product %}...{% endform %}` | Verify route/context/selection behavior. |
| Paginate | `{% paginate collection.products by 24 %}` | Collection products are limited to 50 per page.[1] |

```liquid
{% assign selected_sort = collection.sort_by | default: collection.default_sort_by %}
{% if product.featured_image != blank %}
  {{ product.featured_image | image_url: width: 640 | image_tag: loading: 'lazy', alt: product.title }}
{% endif %}
```

## Filter card

| Outcome | Common filter/pattern | Contract |
| --- | --- | --- |
| Store price | `amount | money` | Store formatting is authoritative. |
| Currency price | `amount | money_with_currency` | Use only where presentation calls for it. |
| Image URL | `image | image_url: width: 640` | Source/image presence required. |
| Image element | `... | image_tag: loading: 'lazy', alt: alt` | Caller owns meaningful alt decision. |
| Default | `value | default: fallback` | Do not hide meaningful missing data. |
| Escape | `text | escape` | Use at HTML text/attribute boundary. |
| URL encode | `value | url_encode` | Apply to intended URL parameter values. |
| Handle | `text | handleize` | Do not assume generated handle exists. |
| Strip markup | `html | strip_html` | Presentation transform, not content policy. |
| Truncate | `text | truncate: 80` | Do not truncate critical meaning. |
| Metafield HTML | `field | metafield_tag` | Field type and source must be verified. |
| JSON | `value | json` | Avoid serializing full product/variant data without a scale reason. |

> [VERIFY] Filter availability and output semantics against current Shopify Liquid documentation when a pattern affects a data type not taught in its originating chapter.

## Object map

| Object/context | Use for | Never assume |
| --- | --- | --- |
| `product` | Product title, media, options, context | Every variant is present in `product.variants`; current cap is 250.[2] |
| `collection` | Collection metadata, sort, products | Browser card ordering is collection truth |
| `cart` | Rendered cart context | Global browser cache is cart authority |
| `section` | ID/settings/block context | A section has product context on every route |
| `block` | Block settings/editor attributes | A block is valid outside its declared parent |
| `article`/`blog` | Editorial route content | Author/date policy is universal `[VERIFY]` |
| `customer` | Supported account context | Theme can recreate authentication/data portal |
| `shop` | Store-level presentation data | It supplies operational/legal promises |
| `request` | Route/design-mode context | All request behavior/fields without verification |
| `recommendations` | Recommendation result context | Configuration or results always exist `[VERIFY]` |

## Theme directory map

| Path | Owns | Review question |
| --- | --- | --- |
| `layout/` | Document shell and shared asset boundary | Does it avoid route-specific commerce authority? |
| `templates/` | Route composition/assignments | Is JSON/Liquid architecture intentional? |
| `sections/` | Editor-facing route/global components | Are settings bounded and empty states safe? |
| `blocks/` | Theme Block types | Are parent/depth/inventory contracts documented? |
| `snippets/` | Explicit reusable presentation units | Are inputs named and output narrow? |
| `assets/` | Styles/scripts/media | Who owns load order, lifecycle and deletion? |
| `config/` | Theme-wide settings/data | Are values safe, typed and migratable? |
| `locales/` | Translation keys/content | Is copy owned/tested in alternate locales? |
| `templates/customers/` | Supported classic account routes `[VERIFY]` | Is account mode/store support confirmed? |

## Debugging card

1. **Reproduce:** record candidate revision, route, query, market/locale, fixture, device/browser and expected/actual result.
2. **Locate authority:** decide whether the problem belongs to Liquid data, section schema, content/configuration, CSS, component JavaScript, app/provider, account/checkout or platform behavior.
3. **Reduce:** inspect blank/long/unavailable/empty/error/no-JavaScript states before adding code.
4. **Instrument carefully:** use temporary, non-sensitive output only in authorised preview environments `[VERIFY]`; never expose customer, cart, provider or secret data.
5. **Correct narrowly:** keep caller/snippet, route/component and data/provider boundaries explicit.
6. **Retest:** repeat original state plus accessibility focus/status, route fallback, editor, locale/market and relevant release fixture.
7. **Record:** link evidence, owner, decision, rollback/reconsideration trigger.

| Symptom | First question | Unsafe shortcut |
| --- | --- | --- |
| Blank card | Is explicit input blank or wrong context? | Read a global object in the snippet |
| Sort/filter mismatch | Does URL/full route state match UI? | Reorder rendered cards in JavaScript |
| Cart count stale | Did authorised response/owned fragment update? | Dispatch cached cart globally |
| Editor setting breaks layout | Is schema/default/empty state bounded? | Add arbitrary HTML/CSS setting |
| Locale mismatch | Does route/request preserve selected context? | Hard-code `/` or copy English text |
| Checkout/account gap | Which supported surface owns it? | Inject theme script into unrelated boundary |

## Deprecation card

| Surface | Verified status/date | Replacement/detection |
| --- | --- | --- |
| `{% include %}` | Deprecated; retained, 2019-11-13 | Use `{% render %}`; audit implicit snippet inputs.[3] |
| `checkout.liquid` in-checkout | Unsupported, 2024-08-13 | Checkout Extensibility; verify store/extension context.[3] |
| Thank You/Order Status `checkout.liquid`/additional scripts | Sunset, 2025-08-28 | Checkout UI/Web Pixel extensions; verify task/consent/eligibility.[3] |
| Non-Plus ScriptTags on Thank You/Order Status | Sunset, 2026-08-26 | Web Pixel/UI extensions; do not move checkout script to theme.[3] |
| Shopify Scripts | Published scripts no longer execute, 2026-06-30 | Shopify Functions/suitable app; map business rule first.[3] |
| Liquid July ’26 `block`/`partial` | Developer preview only | Enable preview and verify availability; never teach as stable.[3] |

## Card: component contract

Use this card before extracting or reusing a component.

| Contract field | Ask before rendering |
| --- | --- |
| Caller | Which template/section/component supplies resource context? |
| Inputs | Which named values are required, optional or blank-safe? |
| Output | Does it emit inline text, list item, card, landmark fragment or control? |
| Semantic owner | Who chooses heading level, label, current state and error/status role? |
| Data owner | Is the value platform data, structured content, store setting or provider result? |
| Empty behavior | Omit, show editor cue, show route-owned empty state, or link to recovery? |
| CSS/JS owner | Which asset/component initialises, replaces and removes behavior? |
| Fixture | Which blank/long/error/locale/accessibility state proves the contract? |

A component that cannot answer these fields should remain local until its boundary is known. In particular, do not extract a fragment because the markup repeats while its context differs: a product-card in a collection, recommendation, search result and cart add-on may share visual markup but not heading, form, availability or analytics responsibilities `[VERIFY]`.

## Card: route-state test matrix

Print this matrix beside a release checklist. Add the project’s actual routes and owners; the rows below are prompts rather than results.

| Route | Baseline | Adverse state | Accessibility confirmation | Data/configuration gate |
| --- | --- | --- | --- | --- |
| Home | Intended composition | Blank collection/media/heading | Landmark and heading order | Editor/preset fixture |
| Collection | URL sort/page | Empty/filtered result `[VERIFY]` | Form label, pagination, focus | Filter/sort configuration |
| Product | Gallery/options/form | Unavailable/no selected variant/absent guide | Fieldsets, labels, status | Product/metafield/reference fixture |
| Cart | Full cart page | Network/null-section recovery | Status/focus and cart-page route | Mutation/rendering contract `[VERIFY]` |
| Search | Submitted query | No results | Query label and result navigation | Search configuration `[VERIFY]` |
| Content/location | Structured reading/list | Missing/stale reference | Table/list/link semantics | Content/location owner |
| Account | Supported account route | Login/error/unsupported path | Form/message semantics | Account mode/privacy `[VERIFY]` |

A matrix prevents a successful desktop happy path from becoming the whole test plan. For each row record revision, locale/market, device/browser, test content, observer, raw output and release decision. Do not use a single screenshot as evidence for a focus change, async announcement or an editor workflow.

## Card: safe data access

1. Check the object exists in the current route/component context.
2. Check the field is present and compatible with the intended filter/tag.
3. Decide whether blank data is omitted, explained to an editor, or represented as a route-owned empty state.
4. Escape/present values according to the output context.
5. Confirm market/locale/visibility/privacy requirements where the source is structured or customer/provider data `[VERIFY]`.
6. Add a fixture for missing, long and unexpected data.

```liquid
{% comment %} Safe named reference display {% endcomment %}
{% if guide != blank and guide.title != blank %}
  <aside class="guide-callout" aria-labelledby="GuideTitle-{{ section.id }}">
    <h2 id="GuideTitle-{{ section.id }}">{{ guide.title }}</h2>
    {% if guide.body != blank %}<div>{{ guide.body | metafield_tag }}</div>{% endif %}
  </aside>
{% endif %}
```

This does not prove that `guide` or `guide.body` exists for every definition; validate field names/type/visibility in the actual project before adoption. The card’s value is the blank-safe pattern and explicit boundary, not an assumed metaobject schema.

## Card: handoff and incident note

When a page or component fails after a change, record the following before applying a fast workaround:

| Record | Minimum content |
| --- | --- |
| Candidate | Commit/archive, theme target and time |
| Observation | Expected/actual behavior, route, query, locale/market, fixture |
| Scope | Buyer, editor, support, data and provider impact |
| Reproduction | Device/browser/assistive technology and ordered steps |
| Boundary | Liquid, CSS, JS, content, app, account, checkout or platform owner |
| Decision | Block, fix, configuration correction, exception or investigate |
| Recovery | Safe fallback/rollback artifact and named owner `[VERIFY]` |
| Retest | Original plus cross-route/state checks and evidence link |

A good note is specific enough for another person to reproduce without messaging the original author. Never place secret values, customer data, payment data or unapproved provider payloads in a debugging document.

## Card: printing workflow

Keep card headings, code fences and tables intact when exporting. Use a monospace font for Liquid snippets; print wide tables in landscape or split them intentionally; retain URLs and ledger dates; and include a repository revision/footer. If a card becomes too dense, make two cards rather than shrinking text until syntax/conditions are unreadable. A printable reference must still communicate hierarchy, table headers and code punctuation.

Before distributing a card set, assign an update owner and review date. Limits/deprecations must trace to a dated source. Object/filter cards should link to their originating course chapter and current documentation. A team-specific card may include project conventions, but label those as local policy so they are never mistaken for Shopify platform behavior.

## Printing and use

Print cards with their ledger date and repository revision. Update the deprecation/limits cards when their authoritative source changes; update object/filter cards when a current documentation review contradicts a pattern. A compact card should encourage checking, not create misplaced confidence. Retire a card whose source is unavailable rather than distributing a stale reference as operational guidance. Record the retirement reason and replacement source so teams do not silently restore an obsolete version from a local printout.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/templates/collection "Shopify — Collection template"
[2]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products "Shopify — Support high-variant products"
[3]: ../../docs/DEPRECATIONS.md "Verified deprecations and limits ledger"
