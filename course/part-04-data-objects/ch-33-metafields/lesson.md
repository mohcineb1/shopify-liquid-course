<!-- STATUS: final -->
---
id: ch-33
title: "Metafields"
part: 4
---

# Chapter 33 — Metafields

A metafield is not a spare text box. It is a typed, merchant-managed contract attached to a specific resource, and the theme succeeds only when that contract remains legible in admin, valid in Liquid, compatible with its renderer, and resilient as the catalog grows. When developers model an arbitrary feature as a string, then split it later in Liquid, they create an unsearchable, unvalidated schema that merchants cannot maintain. Use definitions to name intent, types to constrain values, references to preserve relationships, and a deliberate rendering path to retain semantics.

## What you’ll be able to do

- Design definitions with stable namespace/key paths and an explicit owning resource.
- Select and render scalar, rich, measurement, JSON, money, and reference types.
- Iterate lists without confusing reference count with array size.
- Choose `metafield_tag`, `metafield_text`, or manual output by the UI contract.
- Bind compatible dynamic sources to section/block settings without making general settings resource-dependent.

## 33.1 Definitions, namespaces, keys, and ownership types

A metafield definition gives a value a name, owner type, content type, validation, and merchant-facing meaning. The owner is the parent resource—for example product, variant, collection, customer, order, article, page, blog, shop, or a metaobject. A definition attached to products does not become a variant definition just because a product page renders a selected variant. Choose the resource that owns the business fact: overall material belongs to a product, option-specific dimensions belong to a variant, delivery copy may belong to a collection or product depending on how it varies.

Liquid access has two layers: namespace and key.

```liquid
{% assign warranty = product.metafields.specs.warranty_period %}
{% if warranty != blank %}
  <p>Warranty: {{ warranty.value | escape }}</p>
{% endif %}
```

A namespace prevents collisions between unrelated domains such as `specs`, `editorial`, `compliance`, or an app-owned namespace. A key is a stable machine identifier, not a translated merchant label. Treat `specs.warranty_period` as a public theme/data API: renaming or changing its type later can break templates, dynamic source bindings, exports, and integrations. Prefer a small taxonomy of clearly owned definitions over duplicate near-synonyms such as `material`, `fabric`, `composition`, and `main_material` with no model.

If a key is named `size`, `first`, or `last`, use bracket notation: `product.metafields.specs['size']`. Dot notation can collide with built-in Liquid filters if the key is missing. Liquid cannot create metafields; the merchant/admin or an app creates values/definitions. [1]

> [VERIFY] Confirm owner support, access permissions, validation choices, and storefront visibility for the target definition before a production rollout. Store configuration and app-managed definitions can impose requirements beyond a theme’s read path.

## 33.2 Every metafield type: single-line text, multi-line, rich text, integer, decimal, boolean, date, date_time, JSON, URL, color, rating, dimension, volume, weight, money, and every reference type

The content type selects the value model—not just an editor widget. `single_line_text_field` is concise atomic text such as a fabric composition label. `multi_line_text_field` holds line breaks but not a rich document. `rich_text_field` supports structured formatted text. `number_integer` and `number_decimal` store numeric values; do not format them as prices without a money model. `boolean` represents true/false. `date` and `date_time` are temporal values; format them through an appropriate date presentation path.

`json` yields a JSON object from `.value`, useful when one purposeful structured payload belongs to a resource, but it is not a substitute for a queryable content model. `url`/`url_reference` stores a URL. `color` returns a color object. `rating` returns a rating object. `dimension`, `volume`, and `weight` return measurement objects with value and unit. `money` returns a money object in the customer’s presentment context. Use the type-aware renderer or its documented object fields rather than guessing the serialization.

Reference types preserve a relationship: `product_reference`, `variant_reference`, `collection_reference`, `page_reference`, and `file_reference` resolve to their corresponding resource objects. A `file_reference` can resolve to generic file/media depending on its attached file. `metaobject_reference` relates a resource to an entry of a defined structured record. References should be rendered as links/media/cards using the target’s own fields, not copied title strings that drift from the target resource.

The older types `integer`, `json_string`, and `string` are deprecated implementations. They return their values directly and lack the modern metafield-object properties/filter compatibility; do not choose them for new definitions. [1]

```liquid
{% assign size = product.metafields.specs.dimensions %}
{% if size != blank %}
  <dt>Dimensions</dt><dd>{{ size | metafield_tag }}</dd>
{% endif %}
{% assign related = product.metafields.editorial.related_collection %}
{% if related != blank %}<a href="{{ related.value.url }}">{{ related.value.title | escape }}</a>{% endif %}
```

A type table is valuable in a definition inventory:

| Need | Prefer | Avoid |
| --- | --- | --- |
| Short factual label | single-line text | rich text used as a scalar |
| Formatted editorial explanation | rich text | HTML encoded in a text string |
| Quantified physical data | weight/volume/dimension | number plus a duplicated unit field |
| Currency value | money | decimal formatted with a currency symbol |
| Related resource | a reference type | copied handle/title text |
| Repeating homogeneous values | a list type | delimiter-separated string |
| Repeating structured records | metaobject reference/list | unrelated parallel metafields |

## 33.3 List-type metafields and iteration

A list metafield is a typed sequence, not text split on commas. Its `.list?` property is true and `.value` is iterated. A list of `single_line_text_field` values returns an array. A list of references returns a reference list whose length uses `count`, whereas a non-reference list’s length uses `size`. This distinction prevents a correct list from appearing empty because code measured it with the wrong property. [1]

```liquid
{% assign benefits = product.metafields.specs.key_benefits %}
{% if benefits != blank and benefits.value.size > 0 %}
  <ul>{% for benefit in benefits.value %}<li>{{ benefit | escape }}</li>{% endfor %}</ul>
{% endif %}

{% assign companions = product.metafields.editorial.companions %}
{% if companions != blank and companions.value.count > 0 %}
  <ul>{% for companion in companions.value %}<li><a href="{{ companion.url }}">{{ companion.title | escape }}</a></li>{% endfor %}</ul>
{% endif %}
```

List ordering is merchant data. Do not alphabetize it accidentally unless the definition’s purpose is an index rather than intentional sequence. Guard blank/missing values, give an empty-state decision, and keep list presentation bounded when its items load media or nested content. `metafield_tag` and `metafield_text` have limited list support: among list types, Shopify documents `list.single_line_text_field` and `list.metaobject_reference`; iterate unsupported lists manually. [2] [3]

## 33.4 Reference metafields: product, variant, collection, page, file, metaobject

A reference gives the theme a live object, which is powerful and context-sensitive. Product and variant references can link to merchandising surfaces; collection references can establish a curated destination; page references can supply an editorial/legal route. Do not assume the referenced object is published, complete, or appropriate for every visitor—guard the value and honor Shopify’s storefront availability.

File references need type-aware output. A file may be an image, video, or generic file, and its output/access requirements differ. `metafield_tag` can produce suitable markup for supported file references; manual rendering is useful only when you need a specific layout, alt strategy, responsive image behavior, video controls, or download semantics and have verified the resolved object shape.

A metaobject reference points to a structured entry rather than a loose pile of fields. It is ideal for a reusable supplier, material, care instruction, or specification record; chapter `ch-34-metaobjects` develops its definition and lifecycle. A `list.metaobject_reference` preserves an ordered set of entries. Do not model a table as three independent lists of labels, values, and units: rows will desynchronize. Use one record/reference per row.

> [VERIFY] Confirm storefront visibility, field types, file/media resolution, and publication state for references in the target store. A valid admin reference does not remove a theme’s need to guard empty/unavailable storefront output.

## 33.5 `metafield_tag` vs manual rendering vs `| metafield_text`

Choose output based on what the interface needs. `metafield_tag` asks Shopify for type-specific HTML: rich text, links for common references, localized date/money formatting, measurement markup, file/media handling, and type-specific classes. It is the default for a simple display surface where Shopify’s generated element is semantically sufficient.

`metafield_text` produces a text representation. Use it for a concise sentence, accessible label, plain-text search metadata, or a sentence-form list where documented—not as a substitute for an interactive product/file reference card. Manual rendering is correct when the design needs target-specific markup, a `dl` row, media responsive behavior, multiple target fields, custom link wording, or controlled empty-state structure.

```liquid
{%- comment -%} Wrong: rich text flattening loses formatting and context. {%- endcomment -%}
<p>{{ product.metafields.editorial.care.value | escape }}</p>

{%- comment -%} Right: rich-text definition owns supported formatting. {%- endcomment -%}
{% assign care = product.metafields.editorial.care %}
{% if care != blank %}<div class="care-copy">{{ care | metafield_tag }}</div>{% endif %}
```

Neither filter supports every list type. For `metaobject_reference`/`list.metaobject_reference`, a filter field parameter is restricted to a `single_line_text_field`; use manual rendering for richer nested fields. For JSON, decide whether the UI genuinely needs a JSON script payload or a subset rendered manually. Do not output JSON to visible markup just because it exists. [2] [3]

## 33.6 Metafields in section settings via dynamic sources

Dynamic sources let merchants bind compatible resource attributes, metafields, and visible metaobject fields to **section and block settings** in the theme editor. They are unavailable for general theme settings. Availability depends on the template resource, resource-setting context, compatible field types, storefront-visible metaobjects, brand data, and market custom data. A section in a product template can offer product sources; a section with a product setting can offer fields from that selected product. [4]

The setting type must be compatible: an `image_picker` accepts a file reference, a `product` setting a product reference, a `richtext` setting many text/measurement/date/rich text-compatible fields, and a `metaobject` setting a matching metaobject reference type. Do not configure a dynamic default for a product field in a section that can render outside product context without an explicit product source; the default may resolve to nothing. Additional Liquid around a dynamic default is invalid. [4]

Shopify documents limits of 100 dynamic sources in a JSON template, general settings, or section group, and 50 in a single setting or static section. These are information-architecture constraints: a section with dozens of optional dynamic bindings is not flexible, it is unintelligible. [4]

## 33.7 Designing a metafield schema a merchant can actually maintain

Start from decisions a merchant makes, not from page slots. Write the owner, question, type, validation, label/help, namespace/key, display treatment, dynamic-source compatibility, empty behavior, and migration owner for each definition. Group related definitions under a stable namespace; use merchant labels that explain the outcome, such as “Care instructions” rather than “PDP RTE 4.”

Choose validation that prevents nonsense at entry time: reference constraints, measurement units, allowed metaobject definitions, list limits, and descriptive help. Avoid encoding variants, regions, languages, or multiple records into a single text field. If data must be reused, queried, ordered as records, or governed independently, use references/metaobjects rather than expanding a product’s flat metafield collection indefinitely.

| Schema decision | Merchant outcome |
| --- | --- |
| Explicit owner/type | Data appears where it varies and accepts valid input. |
| Stable namespace/key | Theme and app access paths survive label changes. |
| Helpful label/description | Editors choose values without reading Liquid. |
| One structured row model | Tables do not desynchronize across parallel fields. |
| Empty/rendering policy | Blank data fails gracefully instead of leaving labels or broken cards. |
| Sunset/migration plan | Deprecated definitions are removed deliberately, not silently orphaned. |

Document which surfaces consume the definition, then test missing values, locale/market contexts, target references, and merchant editor flow. The model is successful when a future editor can safely add content without knowing the original page implementation.

## Gotchas

- You attach a fact to product when it varies by variant, then compensate with fragile Liquid conditions.
- You read a `size`/`first`/`last` key with dot notation and receive a Liquid filter result after a missing-value edge case.
- You use `value.size` for a reference list instead of its documented `value.count`.
- You turn a product reference into copied title text and lose the relationship/target URL.
- You rely on `metafield_tag` for an unsupported list type rather than iterating it deliberately.
- You wire a product dynamic default into a context where no product exists, or use dynamic sources in general settings.
- You design dozens of unexplained values instead of a merchant-maintainable data model.

## Checklist

- [ ] Each definition states an owner, namespace/key, type, validation, empty policy, and intended renderer.
- [ ] Scalar, rich, measurement, money, JSON, and reference values use their typed `.value` or filter path deliberately.
- [ ] Lists use iteration and the correct count/size contract.
- [ ] References preserve live target relationships and guard storefront absence.
- [ ] Dynamic sources use compatible section/block settings in an available resource context.
- [ ] Merchant labels, documentation, and migration plans are part of the schema rather than afterthoughts.

## Related

- `ch-32-content-objects` — type-aware rich content and content-object output.
- `ch-34-metaobjects` — reusable structured records and metaobject definitions.
- `ch-35-data-modeling` — schema architecture across resources and content domains.
- `ch-56-security-and-compliance` — privacy, trusted data boundaries, and release governance.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/metafield "Shopify — Liquid object: metafield"
[2]: https://shopify.dev/docs/api/liquid/filters/metafield_tag "Shopify — Liquid filter: metafield_tag"
[3]: https://shopify.dev/docs/api/liquid/filters/metafield_text "Shopify — Liquid filter: metafield_text"
[4]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"
