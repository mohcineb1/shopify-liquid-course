<!-- STATUS: final -->
---
id: ch-34
title: "Metaobjects"
part: 4
---

# Chapter 34 — Metaobjects

When a merchant needs one structured record only once, a metafield can be enough. When they need a reusable, repeatable **thing** with several fields, its own validation, possible references, editor workflow, and perhaps a dedicated webpage, flattening it into product fields or manually duplicated pages becomes fragile. Metaobjects are Shopify-defined entry records: use them to model content entities, keep their fields coherent, expose them safely to the storefront, and choose deliberately whether they are embedded content, a routed page, or a source connected through the editor.

## What you’ll be able to do

- Define metaobject types and entries as structured merchant content.
- Render direct, referenced, and template-context metaobjects in Liquid.
- Build a clear ownership model for metaobject pages and dedicated routes.
- Select metaobjects for real repeated content such as FAQs, ingredients, locations, brand pages, and size guides.
- Distinguish pages, metafields, and metaobjects by their data/lifecycle requirements.

## 34.1 Metaobject definitions and entries

A metaobject **definition** is the reusable schema: a type/identity, field definitions, validation, capabilities, and merchant-facing labels/help. A metaobject **entry** is one record that fills those fields. For example, a `store_location` definition might contain `name`, `address`, `hours`, `map_url`, `image`, `phone`, and an optional related collection; one entry is the actual Soho location. The schema is not a page template, and an entry is not a copy-pasted set of section settings.

Start with an entity boundary. “FAQ item” is a reusable entity with question/answer fields. “Ingredient” can have name, description, image, allergens, and a source reference. “Size guide” can carry a title, chart image, body, and applicable collection/product references. If several resources need the same structured fields, or entries need to be referenced/reordered independently, define a metaobject rather than adding the same flat metafields to every product.

Names matter at three layers: the definition’s type is the machine access path; each field has a stable key; an entry has a unique handle. Treat all three as contracts. Labels can improve as merchants learn the workflow, but changing a type/key affects Liquid, references, dynamic sources, and integrations. Add validation appropriate to the field: reference constraints, required content where a record is invalid without it, allowed content types, and clear editor descriptions. Do not require values merely to hide a theme empty-state; require them because the record cannot have meaning without them.

Metaobjects need storefront access to be displayed as storefront data. If a definition uses the publishable capability, Liquid returns active entries and returns `nil` for draft entries. This is a good release boundary: a merchant can prepare an entry without a theme condition accidentally exposing it. [1]

```liquid
{% assign location = metaobjects.store_location.soho %}
{% if location %}
  <h2>{{ location.name.value | escape }}</h2>
  {{ location.hours | metafield_tag }}
{% endif %}
```

> [VERIFY] Confirm the target definition’s storefront access, publishability, field validation, and handle conventions before relying on direct entry lookup. Draft/published state and merchant permissions are configuration concerns outside the theme.

## 34.2 Rendering metaobjects in Liquid

There are three common ways to receive a metaobject. First, direct lookup uses `metaobjects.type.handle`, or square brackets for dynamic/special names: `metaobjects['store_location']['soho']`. Second, a metafield or setting can return a `metaobject_reference` or a list of entries. Third, a dedicated metaobject template provides the current entry through the `metaobject` object. In each case, fields are accessed by their field keys and typically use the same typed-value/rendering discipline as metafields. [1]

```liquid
{% assign guide = product.metafields.specs.size_guide.value %}
{% if guide %}
  <section class="size-guide">
    <h2>{{ guide.title.value | escape }}</h2>
    {{ guide.chart | metafield_tag }}
    {{ guide.body | metafield_tag }}
  </section>
{% endif %}
```

Do not assume a reference exists, an entry is active, every field is filled, or a field’s raw value is display-ready. Guard the entry and optional fields. Use `metafield_tag` when Shopify’s type-specific element is adequate; manually render a field/reference when a component requires semantic structure, link text, responsive media, a list, or a composite card. Keep raw strings escaped in custom markup; keep rich text through its structured rendering contract.

A direct lookup is appropriate for a globally named entry that the theme deliberately owns, such as a “default size guide” or a single brand story. It is not a substitute for a query system or a way to fetch arbitrary user-selected records. For resource-specific content, a metaobject reference metafield supplies the relationship explicitly. For a merchant-selected shared entry, a compatible metaobject setting/dynamic source is clearer than hard-coding a handle.

## 34.3 Metaobject templates and dedicated routes

A metaobject can become a web page when its definition has Storefront access and its Web pages capability is activated. Shopify’s documented workflow is: create the definition, create entries, enable storefront/web-page options, create a metaobject theme template, then connect fields through sections/blocks or use the current template’s `metaobject` Liquid object. Template configuration also lets the merchant choose fields for page title/meta description and optionally customize the URL handle. [2]

Within a metaobject template, `metaobject` is the entry being rendered. This provides the same conceptual boundary as a product/article template: template architecture is reusable; the object supplies the record. Do not create one Liquid file per entry. A “brand page” template should render every active `brand` entry using the definition’s fields and entry-specific SEO/routing settings. The record owns content; the template owns layout and behavior.

```liquid
<article class="brand-page">
  <h1>{{ metaobject.title.value | escape }}</h1>
  {% if metaobject.hero_image != blank %}{{ metaobject.hero_image | metafield_tag }}{% endif %}
  {{ metaobject.story | metafield_tag }}
</article>
```

Dedicated routes are appropriate when the entry deserves a canonical, linkable, indexable page: location detail, ambassador profile, editorial brand story, a guide, or an FAQ category. An embedded FAQ row or product size guide may need no URL. Turn on web pages because the content needs a public route—not because every entity must become a page. Test draft/active entry behavior, title/meta source, handle collisions, navigation links, and the template’s empty/missing fields.

> [VERIFY] Confirm the current Web pages capability, SEO field configuration, URL behavior, and storefront publication state on the target definition. Web-page availability is defined in admin and can change independently of theme files.

## 34.4 Modelling real content: size guides, ingredients, store locations, brand pages, FAQs

A **size guide** often needs title, content/chart image, measurement notes, applicable audience, and perhaps a product/collection reference. A product can reference one guide; a generic guide might be a global entry. Avoid embedding independent guide copies in every product description.

An **ingredient** is usually a reusable record: name, image, function, sourcing, allergen/claim information, and formatted explanation. Products may hold an ordered list of ingredient references. This keeps ingredient copy consistent and lets editorial updates flow to every product that references it. Do not model an ingredient list as aligned product text fields—names and descriptions will eventually get out of step.

A **store location** needs operational fields—address, hours, phone, map/directions link, pickup capabilities, image, and maybe market/localization context. It can render as an embedded location card on a store finder and as a dedicated location page. A map widget is a presentation concern; the location record remains source-of-truth content.

A **brand page** may be a publishable entry with SEO title/description, hero, story, related products/collections, and featured assets. An **FAQ** has a question and rich answer at minimum; category/order/reference requirements determine whether it lives as a list of FAQ entries, an FAQ-category entry referencing FAQ items, or a simple section block. Favor metaobjects when entries are reused, referenced, or maintained outside a single section’s editorial lifecycle.

| Content need | Good model | Why |
| --- | --- | --- |
| One product’s singular material | Product metafield | One typed fact owned by product. |
| Shared ingredient reused across products | Ingredient metaobject + list reference | Reusable multi-field record and ordered relationships. |
| Store detail with a public URL | Publishable location metaobject | Entry, route, SEO, embedded/card reuse. |
| One marketing landing page with unique layout | Page or a purpose-made template | No repeated entity model is necessary. |
| FAQ items reused in categories/products | FAQ metaobjects + references | One answer record can appear in several places. |

## 34.5 Metaobjects vs pages vs metafields — the modelling decision

Choose **a metafield** for a typed fact belonging to one owner: a product’s warranty date, a variant’s capacity, or a page’s optional callout. Choose **a metaobject** for a named record with several fields that is reusable, referenceable, ordered in relationships, independently governed, or potentially publishable. Choose **a page** for editorial content primarily managed as one standalone document with its own body/layout and no strong reusable data entity.

The wrong model is usually a symptom of shortcutting lifecycle design. Multiple product metafields that repeat a location’s address/hours create update drift. A page per ingredient loses structured relationship fields and can’t be selected as a typed ingredient reference. A metaobject for a one-off heading plus paragraph adds schema/admin overhead without gaining reuse. Ask: Who owns this? Does it vary per resource? Does it have multiple fields? Will it be reused/referenced? Does it need a route? Which merchant role edits it? How is it archived/deleted/migrated?

```liquid
{%- comment -%} Wrong: copied product text cannot maintain a shared ingredient. {%- endcomment -%}
<p>{{ product.metafields.custom.ingredient_one.value | escape }}</p>

{%- comment -%} Right: product holds a relationship; entry owns its fields. {%- endcomment -%}
{% for ingredient in product.metafields.custom.ingredients.value %}
  <a href="{{ ingredient.system.url }}">{{ ingredient.name.value | escape }}</a>
{% endfor %}
```

> [VERIFY] Verify system URL/property availability and intended publishable route behavior for the entry type before using a direct metaobject-link implementation. Link fields/routes should follow the target definition’s enabled storefront capabilities.

## 34.6 Referencing metaobjects from settings

A schema setting of type `metaobject` accepts a compatible `metaobject_reference`; `metaobject_list` accepts a matching list reference. Dynamic sources can connect storefront-visible compatible metaobjects directly or through a resource’s metaobject-reference metafield. A merchant can select an entry/field through the editor instead of a developer hard-coding an entry handle. The setting definition must constrain the expected metaobject type so an FAQ chooser cannot receive a location entry. [3]

```json
{
  "type": "metaobject",
  "id": "featured_location",
  "label": "Featured location",
  "metaobject_type": "store_location"
}
```

```liquid
{% assign location = section.settings.featured_location %}
{% if location %}
  <h2>{{ location.name.value | escape }}</h2>
  {{ location.hours | metafield_tag }}
{% endif %}
```

Settings references are ideal for a merchant-selected shared entry. Template-context dynamic sources are ideal when the product/page/article relationship should select the record automatically. General theme settings are not a replacement for all resource context; choose a direct globally available entry only when a global choice is genuinely desired. List fields can map into compatible block/settings contexts, but always test field-type compatibility, entry storefront access, and merchant usability.

## Gotchas

- You use a metaobject for every single text field and impose unnecessary admin/schema complexity.
- You duplicate a shared entity’s fields on each product instead of storing one entry and relationships.
- You hard-code a handle where a merchant-selected reference or resource relation is required.
- You render draft/non-storefront-access entries as though they must exist.
- You create one template per entry instead of one reusable metaobject template.
- You connect an incompatible field type to a setting and assume the editor will coerce it safely.

## Checklist

- [ ] Every definition names an entity, fields, validations, editor audience, lifecycle, and storefront-access decision.
- [ ] Liquid guards entries/fields and uses type-aware output paths.
- [ ] Direct lookup, resource reference, and template context are selected for distinct reasons.
- [ ] Web pages are enabled only for entries needing canonical public routes.
- [ ] Pages, metafields, and metaobjects are chosen by ownership/reuse/field/route needs.
- [ ] Settings references constrain the intended metaobject type and retain dynamic-source compatibility.

## Related

- `ch-33-metafields` — typed owner facts, references, renderer choices, and dynamic sources.
- `ch-35-data-modeling` — holistic data modeling and lifecycle decisions.
- `ch-32-content-objects` — content templates, rich text, and routable editorial surfaces.
- `ch-56-security-and-compliance` — publication, privacy, and change governance.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/metaobject "Shopify — Liquid object: metaobject"
[2]: https://help.shopify.com/en/manual/custom-data/metaobjects/connecting-to-your-online-store/webpages "Shopify Help — Building web pages with metaobjects"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/settings/dynamic-sources "Shopify — Dynamic data sources"

## Entry governance and lifecycle

A usable metaobject model includes an entry lifecycle: draft preparation, review, active publication, reference checks, scheduled editorial change when relevant, and retirement. Before deleting an entry, identify every product metafield, section setting, menu, and route that points at it. A theme should render an unavailable reference safely, but safe absence is not a substitute for a merchant migration plan. Name the responsible content owner for each definition and record which fields are merchant-edited versus integration-managed.

Test direct lookup, a referenced entry, an active and a draft entry, one partially completed entry, a list with changed order, a public web page, and an embedded presentation. These cases establish whether a record really functions as a reusable entity rather than merely resembling a page form in admin.
