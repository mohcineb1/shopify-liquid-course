<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 66 — Solution

## The approach

The starter copies server assumptions into a theme: an ISML/controller pair becomes an imagined Liquid controller, an OCAPI customer/order request ships from the browser, price authority is rewritten in DOM, and a textual guide ID stands in for a relationship. The solution maps buyer and merchant outcomes to Shopify-native surfaces, retains unknown implementation facts as `[VERIFY]`, and treats typed modeling and release evidence as work products.

| Source item | Outcome | Target disposition |
| --- | --- | --- |
| `Product-Show` controller | Display product plus guide | Template/section/snippet display; no controller recreation |
| ISML conditional guide | Present approved product-linked guide | Typed product metafield/reference and safe Liquid rendering |
| OCAPI browser call | Access account/order data | Blocker for theme; authorised app/backend flow only `[VERIFY]` |
| Price-label adjustment | Eligibility/pricing rule | Authoritative supported business surface, not Liquid/JS `[VERIFY]` |
| Guide cartridge/text ID | Create/reuse guide relationship | Metaobject definition plus typed reference/list reference |
| Magento/Woo/BigCommerce changes | Preserve named business outcome | Theme/app/Function/external/revise/retire/blocker after authority map |

## 1 — Source-to-target map

`records/source-to-target-map.md` decomposes every source artifact into job, authority, data, read/write boundary, failure, target candidate, fixture, owner, acceptance and rollback. It does not claim file-name equivalence.

| Source model | Shopify mapping | Explicit exclusion |
| --- | --- | --- |
| ISML template | Liquid template/section/snippet presentation | General server-side execution |
| SFRA controller | Route/context plus correct platform/app/service ownership | Browser-side controller recreation |
| Cartridge | Theme display, app/extension, Function, external service, or revised process | A “cartridge” directory in a theme |
| OCAPI/SCAPI | Source API inventory to resolve independently | Automatic Ajax replacement |
| Hosted theme interaction | Ajax API, if its documented scope fits | Customer/order/admin/store data access |
| Custom storefront need | Storefront API after custom-storefront justification | Client-side private token |

Shopify’s Ajax API is for hosted themes, current-session cart and some product interactions; it cannot read customer/order data or update store data.[1] The Storefront API is for custom storefronts and its token model/access must be selected deliberately; private tokens are server-side secrets.[2] A theme should not contain source API endpoints, credentials, or a customer/order data workaround.

Salesforce’s current documentation says OCAPI is deprecated and points customers toward SCAPI; that is a source modernization fact, not an instruction to make a Shopify theme emulate SCAPI.[3] Exact source endpoints, authentication, cache, hook, price, personalisation, deployment and cutover mapping remain `[VERIFY]`.

## 2 — Mental model and authority map

`records/platform-mental-model.md` converts each legacy mechanism to a question. The Magento eligibility observer describes an enforcement outcome; it needs a supported authoritative decision, not a Liquid include. The WooCommerce editorial-card plugin may become a section/block plus metafield/metaobject workflow if that meets the merchant job. The BigCommerce account/order storefront call is not an Ajax candidate because the hosted theme API boundary excludes that data; it needs an approved account/app/backend design `[VERIFY]`.

`records/authority-tradeoff.md` records what changes: arbitrary server execution, database joins, raw checkout markup and private browser data operations are not theme authority. Managed hosting, structured editor workflows, platform routes, supported extensions and public contracts can increase delivery/update safety—but only if private markup, browser secrets and unsupported logic are avoided.

## 3 — Typed data model

The source `guide_id` is not modeled as a text field. A product’s material is an attribute of a standard resource and becomes a typed product metafield. A care guide is a reusable entity and becomes a metaobject definition/entry. A product-to-guide link is a typed `metaobject_reference` or list reference according to required cardinality `[VERIFY]`.

<!-- solution/sections/product-information.liquid -->
```liquid
<section class="product-information">
  <h1>{{ product.title }}</h1>

  {% if product.metafields.details.material != blank %}
    <p class="product-material">
      <span class="visually-hidden">Material:</span>
      {{ product.metafields.details.material.value | escape }}
    </p>
  {% endif %}

  {% render 'care-guide', product: product %}
</section>

{% schema %}
{"name":"Product information","settings":[]}
{% endschema %}
```

<!-- solution/snippets/care-guide.liquid -->
```liquid
{% assign guide = product.metafields.details.care_guide.value %}
{% if guide != blank %}
  <aside class="care-guide" aria-labelledby="care-guide-title">
    <h2 id="care-guide-title">{{ guide.title.value | escape }}</h2>
    {{ guide.instructions | metafield_tag }}
  </aside>
{% endif %}
```

Shopify models metafields as extra typed fields on standard resources and metaobjects as custom entities; typed references represent relationships.[4] Do not use text handles/IDs as foreign keys. The exact namespaces/keys, definition fields, validation, list/single cardinality, access, storefront visibility, editor workflow, content ownership, locale/market behavior, source transform, archive, and migration state are `[VERIFY]`.

`records/data-model.md` records these contracts and refuses a `guide_id` text import. It also records empty guide/material behavior and the display/data owner. It does not grant public headless access merely because a Liquid theme can render an approved resource; access is an audience decision.

## 4 — Corrected theme asset and gap register

The solution has no source endpoint, token, account/order request, client-side price rewrite, or text-ID parser.

<!-- solution/assets/source-port.js -->
```js
// No source-platform API, credential, customer/order request, or pricing authority
// belongs in this hosted-theme migration artifact.
```

`records/gap-register.md` assigns every source capability one of: Shopify-native workflow, supported integration, external system of record, defer with approved impact, retire, or blocker. Each row has impact, owner, decision date, source/target evidence, operating fallback, candidate fixture, release gate, rollback and re-evaluation. A gap that needs server/customer/order authority is not solved by an optimistic theme TODO.

## 5 — Frontend-lead operations and validation

`records/frontend-lead-checklist.md` covers discovery, source ownership, routes/redirects/SEO, data model/import readiness, merchant editor workflow, apps, API/auth, privacy, accessibility, performance, locale/markets, no-JS, errors, release freeze, communication, support, monitoring, rollback, reconciliation and legacy retirement. `records/candidate-validation-matrix.md` uses sanitized fixtures and never stores exports, secrets, customer/order data, real endpoints or production screenshots.

A controlled reconciliation protocol compares authorised source/target counts, normalized keys, reference resolution, media, locales, required/blank states and exception queue `[VERIFY]`. It defines acceptance owner and threshold, release/rollback trigger, and later legacy retirement condition. It does not import records from this exercise or invent a production approval.

## What people get wrong here

**Liquid replaces ISML plus controllers.** Liquid is presentation in a constrained platform context; controller authority must be re-homed or retired.

**Ajax is a generic private data API.** It is hosted-theme/current-session interaction API and cannot access customer/order/admin/store data.

**Every custom attribute is text.** Types, references, validation, access and editor workflow are semantics that must survive migration.

**The legacy implementation defines target architecture.** Preserve buyer/merchant outcomes, not accidental source mechanics.

## Stretch: direction only

A reconciliation protocol should establish sanitized fixture identities, source/target count and normalization rules, typed-reference resolution, media/locale checks, exception ownership, threshold `[VERIFY]`, rollback trigger, and legacy-retirement evidence. Treat unresolved records as a governed queue; do not silently coerce them into text fields or perform a production import.

## References

[1]: https://shopify.dev/docs/api/ajax "Shopify — Ajax API"
[2]: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api "Shopify — Building with the Storefront API"
[3]: https://developer.salesforce.com/docs/commerce/commerce-api/guide/why-use-scapi.html "Salesforce — Why use SCAPI"
[4]: https://shopify.dev/docs/apps/build/metaobjects/data-modeling-with-metafields-and-metaobjects "Shopify — Data modeling with metafields and metaobjects"
