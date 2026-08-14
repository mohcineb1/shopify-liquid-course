<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 33 — Solution

## The approach

The solution removes the `specs_blob` entirely. It gives every fact an owner and type: universal facts live on the product; an option-specific capacity lives on the variant; a related collection/page/file is a live reference; compatible products are an ordered `list.product_reference`; and a rich care callout remains rich text. The section renders a `<dl>` only when it has actual rows, so no label survives without a value.

The definitions are intentionally part of the deliverable. A Liquid table is only as maintainable as the data entry model behind it. The notes record namespace/key, owner, type, validation direction, empty behavior, migration from the legacy blob, and which renderer consumes each value. The component reads data only; a merchant/admin or app owns definition and value creation.

> [VERIFY] Confirm actual definition validation, file publication, product-section selected variant behavior, and dynamic-source choices in the target store. The schema below is a maintainable proposal; the store configuration is the final authority.

## Walkthrough

### 1. Replace string parsing with definitions

The `specs` namespace creates stable product facts: `material` (single-line text), `care` (rich text), `dimensions` (dimension), `warranty_until` (date), `guide` (file reference), `related_collection` (collection reference), `fitting_page` (page reference), `compatible_products` (list product reference), and `size` (a collision-key example). The variant owns `specs.capacity` as a volume because it varies by selected option. Validation should limit references to useful resource types and guide merchants with labels/help rather than delimiter conventions.

### 2. Render complete semantic rows

`spec-row` receives a label and metafield object. It emits neither `dt` nor `dd` if the object is blank. Generic type-aware values use `metafield_tag`; the component therefore retains rich text, date, measurement, money, reference, and file semantics where Shopify’s renderer is sufficient. A manual branch is reserved for the related-product list because its card/link layout needs target titles/URLs in merchant order.

### 3. Treat lists and references as objects

A reference list is not an array of handles. The solution checks `compatible.value.count`, then loops the actual product objects. The code does not alphabetize the list: ordering is the merchant’s curation decision. A missing file, page, or collection renders no broken row/link. A metaobject reference becomes appropriate when a specification row needs multiple independently structured fields; it is not needed for a single scalar fact.

### 4. Add a compatible dynamic source

The heading remains a section `text` setting and can be bound to a compatible product source in a product template. Dynamic sources are available to section/block settings, not general theme settings. The section itself remains useful with its default heading and without a binding. Do not place product-dependent defaults in a context where a product cannot exist.

### 5. Preserve a useful empty state

The section counts rendered specification content by guarding values before building the table. When no product/variant facts and no companion resources exist, the section returns an empty-state message instead of a debug dump or an empty definition list. This gives merchandising a clear missing-data signal without exposing field internals to buyers.

## Full code

### `sections/product-specifications.liquid`

```liquid
{{ 'product-specifications.css' | asset_url | stylesheet_tag }}
{% assign material = product.metafields.specs.material %}
{% assign dimensions = product.metafields.specs.dimensions %}
{% assign care = product.metafields.specs.care %}
{% assign capacity = product.selected_or_first_available_variant.metafields.specs.capacity %}
{% assign guide = product.metafields.specs.guide %}
{% assign collection = product.metafields.specs.related_collection %}
{% assign page = product.metafields.specs.fitting_page %}
{% assign companions = product.metafields.specs.compatible_products %}

<section class="product-specifications page-width">
  <h2>{{ section.settings.heading | escape }}</h2>
  {% if material != blank or dimensions != blank or care != blank or capacity != blank or guide != blank or collection != blank or page != blank or companions != blank %}
    <dl>{% render 'spec-row', label: 'Material', field: material %}{% render 'spec-row', label: 'Dimensions', field: dimensions %}{% render 'spec-row', label: 'Capacity', field: capacity %}{% render 'spec-row', label: 'Care', field: care %}{% render 'spec-row', label: 'Guide', field: guide %}{% render 'spec-row', label: 'Related collection', field: collection %}{% render 'spec-row', label: 'Fitting guide', field: page %}</dl>
    {% if companions != blank and companions.value.count > 0 %}
      <section class="product-specifications__related"><h3>Compatible products</h3><ul>{% for companion in companions.value %}<li><a href="{{ companion.url }}">{{ companion.title | escape }}</a></li>{% endfor %}</ul></section>
    {% endif %}
  {% else %}<p class="product-specifications__empty">Specifications will appear when product data is available.</p>{% endif %}
</section>
{% schema %}
{ "name": "Product specifications", "settings": [{ "type": "text", "id": "heading", "label": "Heading", "default": "Specifications" }] }
{% endschema %}
```

### `snippets/spec-row.liquid`

```liquid
{% if field != blank %}
  <dt>{{ label | escape }}</dt>
  <dd>{{ field | metafield_tag }}</dd>
{% endif %}
```

The collision-key access pattern is explicit in a consumer where it is needed:

```liquid
{% assign labeled_size = product.metafields.specs['size'] %}
{% if labeled_size != blank %}{{ labeled_size | metafield_text }}{% endif %}
```

### `assets/product-specifications.css`

```css
.product-specifications { display: grid; gap: 1rem; }
.product-specifications dl { display: grid; grid-template-columns: minmax(10rem, 1fr) 2fr; gap: .75rem 1rem; margin: 0; }
.product-specifications dt { font-weight: 700; }
.product-specifications dd { margin: 0; }
.product-specifications__related { display: grid; gap: .5rem; }
.product-specifications__empty { border: 1px solid currentColor; padding: 1rem; }
```

### `notes.md`

```markdown
# Specification schema and verification

| Merchant label | Owner | Namespace/key | Type/validation | Empty policy | Migration action |
| --- | --- | --- | --- | --- | --- |
| Material | Product | `specs.material` | single-line text | Omit row | Split from blob |
| Dimensions | Product | `specs.dimensions` | dimension | Omit row | Split from blob |
| Care | Product | `specs.care` | rich text | Omit row | Replace copied description text |
| Capacity | Variant | `specs.capacity` | volume | Omit row | Move variant-specific value from product |
| Care guide | Product | `specs.guide` | file reference | Omit row | Add reviewed file values |
| Related collection | Product | `specs.related_collection` | collection reference | Omit row | Replace copied URL |
| Fitting guide | Product | `specs.fitting_page` | page reference | Omit row | Replace copied URL |
| Compatible products | Product | `specs.compatible_products` | list.product_reference | Hide group | Replace handle CSV |

| Scenario | Observed output | Contract / decision |
| --- | --- | --- |
| Complete product | Typed rows and links render. | Product facts and variant capacity remain separate. |
| Missing optional data | Complete rows only. | No orphan `dt`. |
| Variant capacity | Selected variant volume renders. | Variant owns option-specific fact. |
| Empty related list | Group omitted. | Reference list uses `count`. |
| File guide | Type-aware link/media output. | Target file must be storefront available. |
| Product dynamic source | Heading can bind in product template. | No general-setting resource source. |
| Liquid-collision key | Bracket access resolves `size`. | Avoid filter ambiguity. |
```

All four files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They replace the pipe with a comma but retain a text blob. The schema is still unvalidated and impossible to maintain as fields multiply.
- They put variant capacity on product because the page begins with a product object. Option-specific data then becomes wrong after selection changes.
- They call `size` on a reference list. Shopify documents `count` for reference lists; `size` is for non-reference arrays.
- They add a dynamic product source to general settings. Dynamic sources are section/block contextual bindings, not a global data system.

## Stretch: direction only

A `specification` metaobject should own a row label, kind/display contract, optional rich help, and one structured value/reference strategy. The product would hold an ordered list of those records. Keep direct product/variant metafields for facts that are singular, strongly owned, and not reusable as independent rows. Chapter `ch-34-metaobjects` provides the definition/lifecycle model.
