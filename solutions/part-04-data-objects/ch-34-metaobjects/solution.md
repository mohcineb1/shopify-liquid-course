<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 34 — Solution

## The approach

The solution models each shop as a `store_location` entry instead of an edited page copy or three product text fields. The definition owns the record’s fields, a reusable card owns the presentation of an entry, the index owns a deliberate collection of active entries, and a metaobject template owns a location’s canonical detail layout. A product either carries a `metaobject_reference` to its default pickup location—when the relationship is inherent to that product—or a section setting lets a merchant choose a location for a particular placement.

The essential decision is lifecycle, not syntax. Locations are prepared as entries, reviewed, activated for storefront output, referenced from product/template settings, and retired after their references/routes/navigation are audited. Draft or non-storefront entries render as unavailable, not as broken links. A standalone Page is not used for each shop because locations are a repeated multi-field entity; a direct metafield is not used for the same reason.

> [VERIFY] Confirm the store’s `store_location` definition capabilities, active/draft behavior, Storefront access, Web pages configuration, metaobject-setting schema, dynamic-source availability, and SEO/handle choices before release.

## Walkthrough

### 1. Define one real entity

The proposed definition has `name` (required single-line text), `address` (required rich/multiline address content), `hours` (rich text), `phone` (single-line text), `directions` (URL), `image` (file reference), `pickup_note` (rich text), and `featured_products` (list product reference). It receives Storefront access. Enable publishable entries and the Web pages capability only because each active shop needs a canonical location page. Operations own address/hours and publish state; merchandising owns featured product selection; web/content staff own page SEO copy/handle governance.

### 2. Render one guarded card

The card is passed a `location` entry from an index, product reference, or section setting. It guards the entry, then guards each optional field. It never invents a `/pages/{{ handle }}` route: when the location is configured as a published web page, it uses the entry’s system URL in the dedicated link branch. If routes are not enabled, the card can remain embedded without promising a detail page.

### 3. Separate index, detail template, and product relation

The index receives a merchant-selected location list through a `metaobject_list` setting, preserving the curation order. A location detail template uses the built-in `metaobject` context and works for every active entry; it is not duplicated six times. The product pickup section uses either `product.metafields.fulfillment.pickup_location.value` for an automatic product relationship or a constrained `metaobject` section setting for a merchandising choice. Those are different business decisions and should not be conflated.

### 4. Model pages correctly

Web pages are activated in the definition only after Storefront access is enabled, entries exist, and the team needs canonical routes. Configure title/meta description fields and handles in admin, then create one metaobject template. A location card should be useful even if the route is disabled: address/hours/directions are still valid embedded content. A direct Page would be appropriate for a unique campaign landing page with no repeated location entity; it is not the source of record for six structured shops.

### 5. Test the lifecycle

Test an active entry, a draft entry, each optional field missing, an absent product reference, the ordered selected list, a detail page, and a setting-selected entry. Before deleting a location, locate product references, index lists, settings, menus, and links. The theme handling absence safely is a fallback, not a replacement for reference migration.

## Full code

### `sections/location-index.liquid`

```liquid
{{ 'location.css' | asset_url | stylesheet_tag }}
{% assign locations = section.settings.locations %}
<section class="location-index page-width">
  <h1>{{ section.settings.heading | escape }}</h1>
  {% if locations != blank %}
    <div class="location-grid">
      {% for location in locations %}{% render 'location-card', location: location %}{% endfor %}
    </div>
  {% else %}
    <p>No locations are available at this time.</p>
  {% endif %}
</section>
{% schema %}
{
  "name": "Location index",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Our stores" },
    { "type": "metaobject_list", "id": "locations", "label": "Locations", "metaobject_type": "store_location" }
  ]
}
{% endschema %}
```

### `sections/product-pickup-location.liquid`

```liquid
{% assign location = product.metafields.fulfillment.pickup_location.value | default: section.settings.location %}
{% if location %}
  <section class="product-pickup-location page-width">
    <h2>Pickup location</h2>
    {% render 'location-card', location: location %}
  </section>
{% endif %}
{% schema %}
{
  "name": "Pickup location",
  "settings": [
    { "type": "metaobject", "id": "location", "label": "Fallback location", "metaobject_type": "store_location" }
  ]
}
{% endschema %}
```

### `snippets/location-card.liquid`

```liquid
{% if location %}
  <article class="location-card">
    {% if location.image != blank %}{{ location.image | metafield_tag }}{% endif %}
    <h2>{{ location.name.value | escape }}</h2>
    {% if location.address != blank %}<div>{{ location.address | metafield_tag }}</div>{% endif %}
    {% if location.hours != blank %}<div>{{ location.hours | metafield_tag }}</div>{% endif %}
    {% if location.phone != blank %}<p><a href="tel:{{ location.phone.value | remove: ' ' | escape }}">{{ location.phone.value | escape }}</a></p>{% endif %}
    {% if location.directions != blank %}<p><a href="{{ location.directions.value }}">Get directions</a></p>{% endif %}
    {% if location.pickup_note != blank %}{{ location.pickup_note | metafield_tag }}{% endif %}
    {% if location.system.url %}<a href="{{ location.system.url }}">Location details</a>{% endif %}
  </article>
{% endif %}
```

### `templates/metaobject/store_location.liquid`

```liquid
{{ 'location.css' | asset_url | stylesheet_tag }}
<article class="location-detail page-width">
  {% render 'location-card', location: metaobject %}
  {% if metaobject.featured_products != blank and metaobject.featured_products.value.count > 0 %}
    <section><h2>Featured locally</h2><ul>{% for product in metaobject.featured_products.value %}<li><a href="{{ product.url }}">{{ product.title | escape }}</a></li>{% endfor %}</ul></section>
  {% endif %}
</article>
```

### `assets/location.css`

```css
.location-index, .location-detail { display: grid; gap: 1rem; }
.location-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
.location-card { border: 1px solid currentColor; display: grid; gap: .75rem; padding: 1rem; }
.location-card img { height: auto; max-width: 100%; }
```

### `notes.md`

```markdown
# Store location model and verification

| Field | Type | Required? | Validation/help | Publication/owner |
| --- | --- | --- | --- | --- |
| Name | single-line text | Yes | Public store name | Operations |
| Address | rich/multi-line text | Yes | Formatted physical address | Operations |
| Hours | rich text | Yes | Include holiday-update process | Operations |
| Phone | single-line text | No | Contact number | Operations |
| Directions | URL | No | Approved destination | Operations |
| Image | file reference | No | Storefront-available media | Content |
| Pickup note | rich text | No | Buyer guidance | Operations |
| Featured products | list.product_reference | No | Ordered local curation | Merchandising |

| Scenario | Observed output | Lifecycle or model decision |
| --- | --- | --- |
| Active entry | Card/detail can render. | Active storefront entry only. |
| Draft entry | Treated as unavailable. | Publish after review. |
| Missing optional field | Field markup omitted. | No empty wrapper/link. |
| Missing product reference | Pickup section omitted. | Product relation optional. |
| Location index | Selected entries preserve order. | Merchant-curated list. |
| Detail web page | One template renders current `metaobject`. | Web pages/SEO/handle configured in admin. |
| Editor-selected setting | Fallback location renders. | Constrained `store_location` setting. |
| Migration | References/pages/menus audited before retirement. | One entry replaces copied fields/pages. |
```

All five files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They make a Page for each location. Pages duplicate the location schema and do not give product/template settings a typed location relationship.
- They hard-code `metaobjects.store_location.soho` in a reusable pickup component. That prevents merchants from selecting the relevant store and breaks reuse.
- They assume every entry has a web URL. Embedded entries can be valid without a Web pages route, while drafts/non-storefront entries must not be linked publicly.
- They duplicate address/hours on product metafields. That creates update drift instead of one source-of-truth location entry.

## Stretch: direction only

A `location_service` or `pickup_window` should become a related structured record when it has its own fields, ordering, and retirement process. Use an embedded list for contextual service information, a public route only when buyers need a canonical page, and a product relationship when availability genuinely varies by product. Record how changing/removing services updates all location references.
