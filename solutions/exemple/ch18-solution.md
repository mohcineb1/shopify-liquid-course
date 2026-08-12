<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 18 — Solution

## The approach

Every requirement in this exercise is really the same question asked five ways: *who owns this piece of markup, and who is allowed to move it?*

- The icon item is owned by the theme and must live in many places → **theme block**, public.
- The divider is owned by the theme, is meaningless on its own, and should not clutter the picker → **theme block**, private (underscore-prefixed).
- The heading is owned by the theme, must exist, and must not move → **theme block**, private, rendered **statically** by the section.
- The reviews widget is owned by an app → **app block**, admitted with `@app`.
- Nothing here is meaningless outside its parent, so **zero section blocks survive**.

Requirement 3 — a merchant adding these to a future section without a schema edit per block type — is what forces `@theme` rather than listing `icon-item` explicitly. Requirement 7 — `<li>` as a direct child of `<ul>` — is what forces `"tag": null` on every block. Those two constraints are the whole design.

The result is three small files in `blocks/` and two sections that are almost empty.

## Walkthrough

**1 & 2 — one definition, two consumers.** `blocks/icon-item.liquid` holds the markup and schema that were previously duplicated in both sections. Each section renders it through `{% content_for 'blocks' %}`, and block instances are stored per section in the JSON template, so the two bars stay independent with no work from you.

**3 — no schema edit per block type.** The sections declare `{ "type": "@theme" }`, which admits every non-private block in `blocks/`. A new block file is immediately available in both sections and in any future section that does the same.

**4 — the divider is private.** The filename is `_divider.liquid`, so its type is `_divider` and the `@theme` wildcard skips it. To make it available inside these two sections, they list it explicitly alongside the wildcard:

```json
"blocks": [
  { "type": "@theme" },
  { "type": "@app" },
  { "type": "_divider" }
]
```

That combination — wildcard plus named private block — is the idiom worth memorising.

**5 — app content.** `{ "type": "@app" }`. Because both sections are reachable from JSON templates, the app block will render. Nothing else is required; `content_for 'blocks'` renders app children the same way it renders yours, so there is no `{% render block %}` branch to write.

**6 — the fixed heading.** It is a private theme block rendered by the section itself:

```liquid
{% content_for 'block', type: '_bar-heading', id: 'bar-heading' %}
```

A statically rendered block sits exactly where the code puts it. The merchant gets a hide control and no delete control, and it cannot be dragged into the row because it is not part of the row. The two sections pass different `id` values so their headings hold separate content.

Note what this replaced: the starter had `heading` as a *section setting*. Moving it to a static block is what buys the hide control and the editor targeting — a section setting has neither.

**7 — no wrapper elements.** Every block sets `"tag": null`, so Shopify generates no wrapping `div` and the `<li>` in each block file lands directly inside the section's `<ul>`.

**8 — editor targeting.** Because `tag` is `null`, there is no generated wrapper to carry the editor attributes, so each block outputs `{{ block.shopify_attributes }}` on its own root element.

**9 — the justification.** See "What people get wrong here", third item.

## Full code

### `blocks/icon-item.liquid`

```liquid
<li class="trust-bar__item" {{ block.shopify_attributes }}>
  {%- if block.settings.icon != blank -%}
    {{ block.settings.icon | image_url: width: 96 | image_tag: loading: 'lazy', alt: '', class: 'trust-bar__icon' }}
  {%- endif -%}
  <p class="trust-bar__title">{{ block.settings.title }}</p>
  <div class="trust-bar__text">{{ block.settings.text }}</div>
</li>

{% schema %}
{
  "name": "Icon item",
  "tag": null,
  "settings": [
    { "type": "image_picker", "id": "icon", "label": "Icon" },
    { "type": "text", "id": "title", "label": "Title", "default": "Free returns" },
    { "type": "richtext", "id": "text", "label": "Text", "default": "<p>Within 30 days, no questions asked.</p>" }
  ],
  "presets": [{ "name": "Icon item" }]
}
{% endschema %}
```

### `blocks/_divider.liquid`

```liquid
<li class="trust-bar__divider" aria-hidden="true" {{ block.shopify_attributes }}></li>

{% schema %}
{
  "name": "Divider",
  "tag": null,
  "settings": []
}
{% endschema %}
```

### `blocks/_bar-heading.liquid`

```liquid
{%- if block.settings.heading != blank -%}
  <h2 class="trust-bar__heading" {{ block.shopify_attributes }}>{{ block.settings.heading }}</h2>
{%- endif -%}

{% schema %}
{
  "name": "Heading",
  "tag": null,
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Why buy from us" }
  ]
}
{% endschema %}
```

### `sections/trust-bar.liquid`

```liquid
{{ 'trust-bar.css' | asset_url | stylesheet_tag }}

<div class="trust-bar" style="--trust-bar-gap: {{ section.settings.gap }}px;">
  {% content_for 'block', type: '_bar-heading', id: 'bar-heading' %}

  <ul class="trust-bar__list" role="list">
    {% content_for 'blocks' %}
  </ul>
</div>

{% schema %}
{
  "name": "Trust bar",
  "tag": "section",
  "class": "section-trust-bar",
  "max_blocks": 9,
  "settings": [
    { "type": "range", "id": "gap", "label": "Gap", "min": 8, "max": 64, "step": 4, "unit": "px", "default": 32 }
  ],
  "blocks": [
    { "type": "@theme" },
    { "type": "@app" },
    { "type": "_divider" }
  ],
  "presets": [
    {
      "name": "Trust bar",
      "blocks": [
        { "type": "icon-item" },
        { "type": "_divider" },
        { "type": "icon-item" }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/product-highlights.liquid`

Identical, with `"name": "Product highlights"`, `"class": "section-product-highlights"`, the `trust-bar--compact` modifier on the wrapper, and `id: 'highlights-heading'` on the static block. That the second file is now a near-empty variant of the first — rather than eighty duplicated lines — is the point of the exercise.

> [VERIFY] Preset syntax for nested children. The flat `"blocks": [{ "type": "..." }]` array used above is correct for a section's direct children. If you later need a preset that places children *inside* a block, check whether the object form with explicit ids and `block_order` is required. Confirm against the current section-schema docs before shipping presets with nesting.

## What people get wrong here

**Keeping the heading as a section setting.** It renders in the right place and looks finished, so it is tempting to leave it. But a section setting cannot be hidden independently, cannot be selected in the editor, and gives the merchant a text field in the sidebar rather than an element on the canvas. Requirement 6 asked for a hide control, and only a block has one.

**Listing `icon-item` explicitly instead of using `@theme`.** This passes requirements 1, 2, 4, 5, 6, 7 and 8 and fails requirement 3. It also fails the spirit of the chapter: a section that names every block type it accepts has to be edited every time the theme grows a block. The wildcard is the whole reason theme blocks are more than section blocks with extra steps.

**Making the divider public.** Drop the underscore and it works, and it also shows up in the block picker on every section in the theme that uses `@theme` — where a bare `<li>` with a border will render into markup that has no idea what to do with it. Private blocks are how you keep the picker honest.

**Forgetting `{{ block.shopify_attributes }}` after setting `"tag": null`.** These two decisions are linked and the failure is silent: the storefront is perfect, and the merchant cannot click anything. If you set `tag` to `null`, output the attributes in the same edit.

**Leaving `blocks/` cluttered from experiments.** Not a functional failure today, but every file in that directory counts against the 300-block ceiling whether a section references it or not. Delete the ones you abandoned.

## Stretch: direction only

You want an icon item that can contain a button, without `icon-item` knowing what a button is.

Three things to work out, in this order: what a theme block has to declare in its own schema before it is allowed children; which tag renders those children from inside a block file rather than from inside a section; and where in the item's markup that render slot has to sit so the CSS still holds. Once it works, look at the nesting ceiling in the chapter and ask what the merchant's editor sidebar looks like at level six.

Chapter 19 answers all of it.
