<!-- STATUS: final -->
---
id: app-d
title: "Schema & Settings Reference"
part: 15
words: 2420
---

# Appendix D — Schema & Settings Reference

A schema is the public API of a theme component. It determines which values a merchant can store, where a section may be added, which blocks it admits, and which values Liquid may read. Most schema failures are not rendering failures: they are invalid JSON, duplicate IDs, a default of the wrong type, or a setting declared in the wrong schema. This reference lists every current input type and the validation rules that keep section, block, and theme settings reliable.[1]

## What you’ll be able to do

- Choose an input type from the value the merchant must provide, rather than from its editor control alone.
- Write valid section, theme-block, and theme-settings JSON with correct defaults and limits.
- Recognize where resource, list, color, media, and rich-content settings differ from basic scalar settings.
- Keep schema placement, editor constraints, and Liquid access paths consistent.

---

## D.1 All section, block, and theme setting input types with full JSON examples and validation rules

### The three schema homes

A **section schema** lives in one `{% schema %}` tag in a file under `sections/`; it declares the section’s editor contract. A local block inside its `blocks` array uses the same input-setting types, but its values are read through `block.settings`. A **theme block** in `blocks/` has its own one-and-only schema and uses the same inputs, while its `blocks` array can admit other theme or app blocks. A **theme setting** belongs in a category of `config/settings_schema.json` and is read through `settings`.[2] [3] [4]

```liquid
<!-- sections/promo-band.liquid -->
<section class="promo-band" style="--promo-gap: {{ section.settings.gap }}px;">
  <h2>{{ section.settings.heading }}</h2>
  {% for block in section.blocks %}
    <p {{ block.shopify_attributes }}>{{ block.settings.text }}</p>
  {% endfor %}
</section>

{% schema %}
{
  "name": "Promo band",
  "tag": "section",
  "class": "promo-band-section",
  "limit": 1,
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Good news" },
    { "type": "range", "id": "gap", "label": "Gap", "min": 8, "max": 48, "step": 4, "unit": "px", "default": 16 }
  ],
  "max_blocks": 3,
  "blocks": [
    {
      "type": "message",
      "name": "Message",
      "limit": 3,
      "settings": [
        { "type": "text", "id": "text", "label": "Message", "default": "Free shipping over $75" }
      ]
    }
  ],
  "presets": [{ "name": "Promo band", "blocks": [{ "type": "message" }] }],
  "enabled_on": { "templates": ["*"], "groups": ["footer"] }
}
{% endschema %}
```

The rule behind that example is simple: `type`, `id`, and `label` are the normal setting contract; `default` and `info` are optional unless a type says otherwise. IDs must be unique in their own scope—section IDs within the section, and setting IDs within a given block. A section accepts one schema tag only, and its contents must be valid JSON, not JSON-with-comments or Liquid interpolation.[1] [2]

| Schema surface | Required or constrained attributes | Validation rule |
|---|---|---|
| Section | `name`; optional `tag`, `class`, `limit`, `settings`, `blocks`, `max_blocks`, `presets`, `default`, `locales`, `enabled_on`, `disabled_on` | `tag` is one of `article`, `aside`, `div`, `footer`, `header`, `section`; `limit` is 1 or 2; `enabled_on` and `disabled_on` are mutually exclusive. |
| Local section block | `type`, `name`; optional `limit`, `settings` | Block names and types are unique in the section. |
| Theme block | `name`; optional `settings`, `blocks`, `presets`, `tag`, `class` | It cannot declare local block definitions. `tag` is any string up to 50 characters, or `null`. |
| Theme settings category | `name`, `settings` | Each `settings_schema.json` top-level entry is a JSON category. `color_palette` and `color_scheme_group` belong here, not in a section or block schema. |
| Theme metadata | `name: "theme_info"`, name/author/version/documentation fields and one support channel | Include **one** of `theme_support_email` or `theme_support_url`, not both. |

A section can admit at most 50 merchant-managed blocks; static blocks do not count. A theme block with `"tag": null` must render one top-level HTML element bearing `{{ block.shopify_attributes }}` so the editor can move and identify it.[2] [3]

### Basic scalar input settings

Each object below is a complete, valid setting definition. Insert it in a section/block `settings` array or a theme-settings category’s `settings` array.

| Type | Complete JSON example | Value and validation |
|---|---|---|
| `checkbox` | `{ "type": "checkbox", "id": "show_badge", "label": "Show badge", "default": true }` | Boolean; omitted default becomes `false`. |
| `number` | `{ "type": "number", "id": "columns", "label": "Columns", "default": 3, "placeholder": "3" }` | Number or `nil`; default is numeric, never quoted. `placeholder` appears only in theme settings. |
| `radio` | `{ "type": "radio", "id": "align", "label": "Alignment", "options": [{ "value": "left", "label": "Left" }, { "value": "center", "label": "Center" }], "default": "left" }` | Requires `options` of `value`/`label`; omitting default selects the first option. |
| `range` | `{ "type": "range", "id": "gap", "label": "Gap", "min": 0, "max": 64, "step": 4, "unit": "px", "default": 16 }` | Requires numeric `min`, `max`, and `default`; `step` defaults to 1. Off-step input rounds; out-of-range input clamps. |
| `select` | `{ "type": "select", "id": "size", "label": "Size", "options": [{ "value": "s", "label": "Small" }, { "value": "l", "label": "Large" }], "default": "s" }` | Requires `options`; optional option `group`; omitted default is first option. |
| `text` | `{ "type": "text", "id": "heading", "label": "Heading", "default": "Featured" }` | String or empty value; `placeholder` is theme-settings only. Text settings are not updated when switching presets. |
| `textarea` | `{ "type": "textarea", "id": "message", "label": "Message", "default": "Made to order." }` | Multiline string or empty value; `placeholder` is theme-settings only. |

### Resource, content, and selection settings

Resource values are objects in Liquid, not merely handles. Direct output of legacy resource settings can produce the handle for compatibility, but property access (`section.settings.collection.title`) is the durable pattern. Resource selections that are missing, deleted, or not visible are `blank`.[1]

| Type | Complete JSON example | Validation and Liquid value |
|---|---|---|
| `article` | `{ "type": "article", "id": "story", "label": "Featured story" }` | Published article picker; no `default`; returns `article` or `blank`. |
| `article_list` | `{ "type": "article_list", "id": "stories", "label": "Stories", "limit": 6 }` | Published articles only; `limit` defaults to and cannot exceed 50; returns paginable article array. |
| `blog` | `{ "type": "blog", "id": "journal", "label": "Journal" }` | No `default`; returns `blog` or `blank`. |
| `collection` | `{ "type": "collection", "id": "collection", "label": "Collection" }` | No `default`; returns `collection` or `blank`. |
| `collection_list` | `{ "type": "collection_list", "id": "collections", "label": "Collections", "limit": 4 }` | `limit` defaults to and cannot exceed 50; returns paginable collection array. |
| `page` | `{ "type": "page", "id": "page", "label": "Page" }` | Returns `page` or `blank`; use a handle only where a legacy API demands it. |
| `product` | `{ "type": "product", "id": "product", "label": "Product" }` | Returns `product` or `blank`; no resource default. |
| `product_list` | `{ "type": "product_list", "id": "products", "label": "Products", "limit": 8 }` | Returns paginable product array; use a bounded `limit` appropriate to the component. |
| `link_list` | `{ "type": "link_list", "id": "menu", "label": "Menu" }` | Returns `linklist` or `blank`; render its `links`, not a hardcoded navigation path. |
| `metaobject` | `{ "type": "metaobject", "id": "feature", "label": "Feature", "metaobject_type": "feature" }` | Requires an allowed definition type; returns selected metaobject or `blank`. |
| `metaobject_list` | `{ "type": "metaobject_list", "id": "features", "label": "Features", "metaobject_type": "feature", "limit": 6 }` | Requires `metaobject_type`; returns a bounded array of entries. |

### Presentation, rich content, and media settings

| Type | Complete JSON example | Validation and Liquid value |
|---|---|---|
| `color` | `{ "type": "color", "id": "text_color", "label": "Text color", "default": "#1f2937" }` | Returns `color` or `blank`. A palette reference may be the default; a cleared setting is not transparent. |
| `color_background` | `{ "type": "color_background", "id": "background", "label": "Background", "default": "linear-gradient(180deg, #ffffff, #eef2ff)" }` | CSS background string; image-related background properties are unsupported. |
| `color_palette` | `{ "type": "color_palette", "id": "colors", "default": { "primary": "#1f2937", "accent": "#4f46e5" } }` | Theme settings only; exactly one palette; keys begin with a letter and use letters/digits/underscores; colors are hex without alpha. |
| `color_scheme` | `{ "type": "color_scheme", "id": "scheme", "label": "Color scheme", "default": "scheme-1" }` | Selects a theme color scheme; use the returned scheme/settings rather than duplicating color tokens. |
| `color_scheme_group` | `{ "type": "color_scheme_group", "id": "color_schemes", "definition": [{ "type": "color", "id": "background", "label": "Background", "default": "" }, { "type": "color", "id": "text", "label": "Text", "default": "" }, { "type": "color", "id": "button", "label": "Button", "default": "" }, { "type": "color", "id": "button_label", "label": "Button label", "default": "" }, { "type": "color", "id": "secondary_button_label", "label": "Secondary button label", "default": "" }], "role": { "background": "background", "text": "text", "primary_button": "button", "on_primary_button": "button_label", "primary_button_border": "button", "secondary_button": "background", "on_secondary_button": "secondary_button_label", "secondary_button_border": "secondary_button_label", "links": "secondary_button_label", "icons": "text" } }` | Theme settings only. `definition` contains `header`, `color`, and/or `color_background` inputs; `role` maps the required preview roles. |
| `font_picker` | `{ "type": "font_picker", "id": "heading_font", "label": "Heading font", "default": "helvetica_n4" }` | Returns a font object or `blank`; default is a Shopify font handle. |
| `image_picker` | `{ "type": "image_picker", "id": "image", "label": "Image" }` | Returns image or `blank`; use `image_url` then `image_tag`. |
| `video` | `{ "type": "video", "id": "video", "label": "Hosted video" }` | Returns Shopify-hosted video or `blank`. |
| `video_url` | `{ "type": "video_url", "id": "video_url", "label": "YouTube or Vimeo URL", "accept": ["youtube", "vimeo"] }` | Requires `accept` provider list; invalid/non-accepted URL is rejected. |
| `html` | `{ "type": "html", "id": "embed", "label": "Embed HTML" }` | Merchant HTML value; render only where the component deliberately permits markup. |
| `inline_richtext` | `{ "type": "inline_richtext", "id": "eyebrow", "label": "Eyebrow", "default": "New arrival" }` | Inline rich text; supports translation. |
| `richtext` | `{ "type": "richtext", "id": "body", "label": "Body", "default": "<p>Describe the collection.</p>" }` | Rich HTML-like content; supports translation; default must be valid rich-text markup. |
| `liquid` | `{ "type": "liquid", "id": "custom_liquid", "label": "Custom Liquid" }` | Liquid source rendered at runtime; its stored value is not available in Translate & Adapt. |
| `text_alignment` | `{ "type": "text_alignment", "id": "alignment", "label": "Text alignment", "default": "center" }` | Constrained text-alignment control returning its alignment value. |
| `url` | `{ "type": "url", "id": "link", "label": "Link" }` | Store-relative or absolute URL selected in the editor; returns a URL string or blank. |

> **Rule of thumb:** use `richtext` for structured merchant copy, `inline_richtext` when markup must stay inline, `liquid` only for a consciously extensible integration point, and `html` only when the component is meant to accept raw markup. See `course/part-02-the-liquid-language-properly/ch-13-capture-whitespace-and-html/` for output discipline.

### Theme settings and metadata

`config/settings_schema.json` is an array of categories, not a `{% schema %}` block. Its settings use the same input types, while sidebar types such as `header` and `paragraph` are informational only and store no value. Theme choices are persisted in `settings_data.json` and are read through `settings`.[4]

```json
[
  {
    "name": "Layout",
    "settings": [
      { "type": "checkbox", "id": "show_breadcrumbs", "label": "Show breadcrumbs", "default": true },
      { "type": "color", "id": "accent", "label": "Accent", "default": "#4f46e5" }
    ]
  },
  {
    "name": "theme_info",
    "theme_name": "Northstar",
    "theme_author": "Example Studio",
    "theme_version": "1.0.0",
    "theme_documentation_url": "https://example.com/docs",
    "theme_support_url": "https://example.com/support"
  }
]
```

### Placement and editor validation

`presets` make a section or theme block addable in the editor; a static section instead uses `default`. Preset entries require `name` and can supply `category`, `settings`, and child `blocks`. Restrict addability with `enabled_on` *or* `disabled_on`, never both. The former accepts page-template types and section groups such as `header`, `footer`, `aside`, or `custom.<name>`; `"*"` means all valid locations.[2] [3]

**Wrong:** two top-level elements are emitted, and neither carries `block.shopify_attributes`. Shopify cannot treat that output as one draggable, editor-addressable block.

```liquid
<!-- blocks/heading.liquid -->
<h2>{{ block.settings.heading }}</h2>
<p>Optional supporting copy</p>

{% schema %}
{
  "name": "Heading",
  "tag": null,
  "settings": [{ "type": "text", "id": "heading", "label": "Heading", "default": "A clear message" }]
}
{% endschema %}
```

**Right:** one top-level element carries the editor attributes, so the wrapperless block remains movable and selectable in the editor.

```liquid
<!-- blocks/heading.liquid -->
<h2 {{ block.shopify_attributes }}>{{ block.settings.heading }}</h2>

{% schema %}
{
  "name": "Heading",
  "tag": null,
  "settings": [{ "type": "text", "id": "heading", "label": "Heading", "default": "A clear message" }],
  "presets": [{ "name": "Heading", "category": "Text" }]
}
{% endschema %}
```

Also prefer the IDs `heading`, then `title`, then `text` for an informative editor sidebar label; that is the documented title precedence for blocks.[2] [3]

---

## Gotchas

- **JSON is not Liquid.** Never put `{{ }}` or `{% %}` into the schema to calculate a default. JSON has literals only, and duplicate IDs are errors rather than last-write-wins configuration.
- **Do not quote numeric defaults.** `"default": "16"` is wrong for `number` and `range`; `min`, `max`, `step`, and a range default are numeric values.
- **Do not use `templates` as the placement attribute.** Use `enabled_on` or `disabled_on`, and never both.
- **A picker can be blank.** Guard a selected resource before accessing `.title`, `.url`, or media properties.
- **Do not hardcode product, collection, or article handles as resource defaults.** Resource picker defaults are not supported in the way scalar defaults are.
- **Do not skip editor attributes for wrapperless blocks.** `tag: null` transfers that responsibility to your one top-level element.

---

## Checklist

- [ ] Every setting has a type, unique local ID, and merchant-facing label unless its documented exception says otherwise.
- [ ] Every scalar default has the same JSON type as the returned value.
- [ ] I use section, block, and theme schemas in their respective locations.
- [ ] I use a resource object’s properties only after guarding `blank`.
- [ ] I have chosen either `enabled_on` or `disabled_on`, and my preset/default matches how the component is installed.

## Related

- [Appendix A — Complete Liquid Tag Reference](../appendix-a-complete-liquid-tag-reference/): the `{% schema %}`, `{% form %}`, and rendering tags referenced by schemas.
- [Appendix B — Complete Filter Reference](../appendix-b-complete-filter-reference/): `image_url`, `image_tag`, and value-formatting filters.
- [Appendix C — Complete Object Reference](../appendix-c-complete-object-reference/): `settings`, `section`, and `block` values in Liquid.
- [Chapter 17 — Section Schema](../../part-03-theme-architecture/ch-17-section-schema/), [Chapter 18 — Blocks: The Three Kinds](../../part-03-theme-architecture/ch-18-blocks-the-three-kinds/), and [Chapter 19 — Block Schema](../../part-03-theme-architecture/ch-19-block-schema/): architecture in depth.
- [Chapter 20 — Rendering Blocks](../../part-03-theme-architecture/ch-20-rendering-blocks/) and [Chapter 24 — Settings & the Theme Editor](../../part-03-theme-architecture/ch-24-settings-theme-editor/): rendering and editor behavior.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings "Shopify — Input settings"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema "Shopify — Section schema"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema "Shopify — Theme block schema"
[4]: https://shopify.dev/docs/storefronts/themes/architecture/config/settings-schema-json "Shopify — settings_schema.json"
