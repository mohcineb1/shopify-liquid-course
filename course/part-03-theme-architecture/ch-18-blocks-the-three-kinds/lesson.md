<!-- STATUS: final -->
---
id: ch-18
title: "Blocks: The Three Kinds"
part: 3
words: 2450
---

# Chapter 18 — Blocks: The Three Kinds

Sections let a merchant reorder the regions of a page. Blocks let them compose the inside of a region. That much is obvious from ten minutes in the theme editor. What is not obvious is that "block" means three different things in a Shopify theme, with three different owners, three different lifecycles, and three incompatible sets of rules — and that choosing the wrong one is invisible until the day a merchant asks for the same component on a second page. At that point you are either adding a line to a schema or copy-pasting eighty lines of Liquid into another file. This chapter is about never being in the second situation.

## What you'll be able to do

- Identify which of the three kinds you are looking at in unfamiliar theme code, in about five seconds
- Build a section block, a theme block, and an app-block host section from scratch
- Predict which platform limit a given design will hit first
- Choose the right kind before you write markup, using a decision rule you can defend in code review
- Recognise the refactor that turns duplicated section blocks into one reusable theme block

---

## 18.1 Section blocks — local, simple, limited to their parent

A section block is defined **inside a section's own schema**. It has no file of its own. It exists only for the section that declares it.

```liquid
<!-- sections/logo-list.liquid -->
<div class="logo-list">
  {%- for block in section.blocks -%}
    {%- case block.type -%}
      {%- when 'logo' -%}
        <figure class="logo-list__item" {{ block.shopify_attributes }}>
          {{ block.settings.image | image_url: width: 300 | image_tag: loading: 'lazy', alt: block.settings.alt }}
        </figure>
    {%- endcase -%}
  {%- endfor -%}
</div>

{% schema %}
{
  "name": "Logo list",
  "tag": "section",
  "class": "section-logo-list",
  "max_blocks": 12,
  "blocks": [
    {
      "type": "logo",
      "name": "Logo",
      "limit": 12,
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Logo" },
        { "type": "text", "id": "alt", "label": "Alt text" }
      ]
    }
  ],
  "presets": [
    { "name": "Logo list", "blocks": [{ "type": "logo" }, { "type": "logo" }] }
  ]
}
{% endschema %}
```

Four things to notice, because they carry over to every kind of block:

- **`section.blocks`** is an array in merchant-defined order. You iterate it; you do not index into it.
- **`block.type`** is how you branch. A `{% case %}` on `block.type` is the standard shape, not a stylistic choice — it is what lets one loop render heterogeneous content.
- **`block.settings`** is scoped to that block instance. Two logo blocks have two independent settings objects.
- **`{{ block.shopify_attributes }}`** must appear on the block's outermost element. It is how the theme editor targets, highlights, and reorders the block. Omit it and the merchant's clicks land nowhere. There is no error message.

`max_blocks` caps the section as a whole; `limit` on a block type caps that one type. Both are optional, and both default to the platform ceiling of 50 blocks per section.

Section blocks are the oldest of the three and they are genuinely fine — as long as the component never needs to exist anywhere else. That condition is the whole problem.

---

## 18.2 Theme blocks — files in `blocks/`, reusable across every section

A theme block is a `.liquid` file in the theme's `blocks/` directory. It has its own schema, its own settings, and — this is the point — no owning section. Any section can accept it.

Here is the wrong way to get a component onto a second page, and the right way.

**Wrong.** The merchant asks for the logo list on the product page too, so the markup gets copied:

```liquid
<!-- sections/product-logo-list.liquid -->
{%- for block in section.blocks -%}
  {%- case block.type -%}
    {%- when 'logo' -%}
      <figure class="logo-list__item" {{ block.shopify_attributes }}>
        {{ block.settings.image | image_url: width: 300 | image_tag: loading: 'lazy', alt: block.settings.alt }}
      </figure>
  {%- endcase -%}
{%- endfor -%}
```

Two copies of the markup, two copies of the schema, two places to fix the next bug, and merchant content that cannot move between them. Six months later there are five copies.

**Right.** One file, and every section opts in:

```liquid
<!-- blocks/logo.liquid -->
<figure class="logo-list__item" {{ block.shopify_attributes }}>
  {%- if block.settings.image != blank -%}
    {{ block.settings.image | image_url: width: 300 | image_tag: loading: 'lazy', alt: block.settings.alt }}
  {%- else -%}
    {{ 'image' | placeholder_svg_tag: 'logo-list__placeholder' }}
  {%- endif -%}
</figure>

{% schema %}
{
  "name": "Logo",
  "tag": null,
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Logo" },
    { "type": "text", "id": "alt", "label": "Alt text" }
  ],
  "presets": [{ "name": "Logo" }]
}
{% endschema %}
```

```liquid
<!-- sections/logo-list.liquid -->
<div class="logo-list">
  {% content_for 'blocks' %}
</div>

{% schema %}
{
  "name": "Logo list",
  "tag": "section",
  "blocks": [{ "type": "logo" }, { "type": "@app" }],
  "presets": [{ "name": "Logo list" }]
}
{% endschema %}
```

The section no longer knows or cares what a logo is. It declares a hole and Shopify fills it. `{% content_for 'blocks' %}` renders the section's children in merchant order — Chapter 20 covers it and its sibling `{% content_for 'block' %}` in full; here it is enough to know it replaces the `for` loop.

Five rules distinguish theme blocks from section blocks:

**The filename is the type.** `blocks/logo.liquid` is referenced as `{ "type": "logo" }`. Rename the file and every merchant who placed that block loses their content, because JSON templates store block instances keyed by type. Treat block filenames as a public API.

**An underscore prefix makes the block private.** `blocks/_divider.liquid` has the type `_divider` and is excluded from the `@theme` wildcard. A merchant cannot pick it out of thin air; it appears only where a parent explicitly lists it. This is how you ship internal building pieces without cluttering the block picker.

**`"tag": null` suppresses the generated wrapper.** By default Shopify wraps a theme block in a `div`. Set `tag` to `null` when the surrounding markup dictates the element — a block that must render as an `<li>` inside the section's `<ul>`, for example — and take responsibility for `{{ block.shopify_attributes }}` yourself.

Shopify applies the editor attributes automatically when it generates a block wrapper. With `"tag": null`, there is no wrapper, so the block's single top-level element must output `{{ block.shopify_attributes }}` itself. [Shopify’s block-schema reference](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/schema) makes this distinction explicit.

**Theme blocks accept children; section blocks never do.** A theme block's schema can list other block types, and render them with `{% content_for 'blocks' %}` inside itself. Nesting is allowed up to **8 levels deep, excluding the section level**. What a theme block *cannot* do is define a block type inline the way a section can — its `blocks` array only ever references types that already exist as files, or the `@theme` / `@app` wildcards.

**`@theme` accepts everything public.** `{ "type": "@theme" }` in a section's `blocks` array lets a merchant add any non-private block in the directory, without you updating the schema each time you add one. It is the difference between a theme that composes and a theme that has to be edited for every new layout.

The cost of all this is a ceiling: **a theme may contain at most 300 theme blocks**, and every `.liquid` file in `blocks/` counts — including files no section references and blocks generated by AI in the theme editor. Once you are at 300 you cannot add another until you delete one.

---

## 18.3 App blocks — merchant-installed, third-party

An app block is supplied by an app the merchant has installed, through a theme app extension. You did not write it, you cannot see it at build time, and you cannot style its internals. What you control is whether it is allowed in and what box it lands in.

You opt in with one line:

```json
"blocks": [
  { "type": "logo" },
  { "type": "@app" }
]
```

If your section still uses a `for` loop rather than `content_for`, app blocks need an explicit branch:

```liquid
{%- for block in section.blocks -%}
  {%- case block.type -%}
    {%- when '@app' -%}
      {% render block %}
    {%- when 'logo' -%}
      ...
  {%- endcase -%}
{%- endfor -%}
```

`{% render block %}` — the object, not a quoted snippet name — is what hands rendering to the app.

Two constraints matter architecturally. App blocks only work in sections that are reachable from a **JSON template or a section group**; a section rendered statically with `{% section %}` in a Liquid template cannot host them. And an app block's markup is not yours: your CSS must survive arbitrary child HTML, which in practice means the container sets the box and nothing inside it is styled by descendant selectors.

App *embed* blocks are a different animal — they attach to the theme globally rather than to any section, and need no cooperation from your schema at all. Theme app extensions in full, including embeds and the styling contract, are Chapter 56 (`course/part-10-apps-extensions-the-edge-of-liquid/ch-56-theme-app-extensions/`).

---

## 18.4 The comparison table

|  | Section block | Theme block | App block |
|---|---|---|---|
| Defined in | the parent section's `{% schema %}` | its own file in `blocks/` | the app's theme extension |
| Owned by | you | you | the app developer |
| Reusable in other sections | no | yes | yes, wherever `@app` is allowed |
| Can have children | no | yes, 8 levels deep | no |
| Can be a child of a theme block | no | yes | yes |
| Declares itself in a schema | inline, under `blocks` | in its own file | not in your code |
| Counts toward 50 blocks per section | yes | yes | yes |
| Counts toward 300 theme blocks | no | yes | no |
| Offered by the `@theme` wildcard | no | yes, unless underscore-prefixed | no |
| Works in a statically rendered section | yes | yes | no |
| Survives you renaming things | n/a | no — the filename is the contract | n/a |

Alongside those, the ceilings you are budgeting against: **25 sections per JSON template or section group**, **50 blocks per section**, **300 theme blocks per theme**, **8 nesting levels** below the section.

---

## 18.5 When each kind is the right answer

Work down this list and stop at the first match.

**Does anything need to add, remove, or reorder it in the theme editor?** If no, it is not a block at all — it is a snippet (Chapter 21). Blocks carry real cost: schema surface, picker clutter, and a slice of the 300 ceiling. A component that is always present in exactly one place, configured by section settings, should be a snippet rendered with `{% render %}`.

**Is it supplied by an installed app?** Then it is an app block and your only decision is whether to accept `@app`. Accept it on merchant-facing content surfaces — product pages, cart, home page sections, anywhere a reviews widget or an upsell would plausibly go. Leave it off structural furniture where third-party markup would break the layout.

**Could this component plausibly appear anywhere else, ever?** If yes — and for anything visual the honest answer is almost always yes — make it a theme block. Text, image, button, icon item, divider, spacer, product card: these are theme blocks in any theme built today.

**Is it meaningless outside its parent?** Only then is a section block correct. The honest test is whether the block reads its parent's settings or depends on the parent's layout algorithm to make sense — a slide inside a slideshow that inherits the parent's transition timing, for instance. If you can describe the component without mentioning its parent, it is a theme block.

Two budget rules that follow from the 300 ceiling. Do not create block variants that differ only by styling; create one block with a `select` setting. And do not create a block per content type when a single block with a reference setting will do — one "featured item" block that accepts a product, collection, or page reference beats three near-identical files.

---

## Gotchas

- **Missing `{{ block.shopify_attributes }}`.** The block renders correctly on the storefront and is uneditable in the editor. No warning, no error. This is the single most common block bug.
- **Renaming a block file orphans merchant content.** JSON templates reference blocks by type, and the type is the filename. Renaming `blocks/logo.liquid` silently drops every placed instance. If you must rename, migrate the JSON templates in the same commit and accept that live merchant edits are lost.
- **The 300 ceiling counts files, not usage.** Dead blocks left in `blocks/` from an abandoned design still count. Sweep the directory before you assume you have room.
- **Private blocks vanish from the picker.** If a block you expected to offer is not appearing, check whether the filename starts with an underscore before debugging the schema.
- **App blocks in a static section do nothing.** `{% section 'foo' %}` in a Liquid template cannot host `@app`. If a merchant reports that an app widget will not appear in a region, check how that region is rendered before blaming the app.
- **`{% render block %}` is not `{% render 'block' %}`.** The first renders the block object; the second looks for `snippets/block.liquid` and silently renders nothing.
- **`block.id` is generated by Shopify and is not stable.** Use it to scope CSS and IDs within a single render. Never store it, never key data on it, never write it into a URL.
- **Deep nesting is legal and still a bad idea.** Eight levels is the ceiling, not a target. Every level adds editor tree depth the merchant has to navigate and render cost you pay on every request.

---

## Checklist

- [ ] I can point at a block in an unfamiliar theme and name its kind without reading the schema
- [ ] I know why `"tag": null` exists and when I need it
- [ ] I know which of my blocks are private and why
- [ ] I can state the four platform ceilings from memory
- [ ] I default to theme blocks and can justify every section block I still have
- [ ] Every block I ship outputs `{{ block.shopify_attributes }}`

## Related

- Chapter 17 — Sections (`ch-17-sections/`): the schema this chapter builds on
- Chapter 19 — Theme Blocks in Depth (`ch-19-theme-blocks-in-depth/`): nesting, wildcards, static blocks, the full block schema
- Chapter 20 — `content_for` (`ch-20-content-for/`): the rendering slot used above
- Chapter 21 — Snippets (`ch-21-snippets/`): the alternative when nothing needs to be editable
- Chapter 56 — Theme App Extensions (`ch-56-theme-app-extensions/`): the app side of app blocks
- Appendix E — Platform Limits & Quotas: every ceiling in one table
