<!-- STATUS: final -->
---
id: ch-64
title: "Vintage → OS 2.0 → Theme Blocks"
part: 12
words: 2450
---

# Chapter 64 — Vintage → OS 2.0 → Theme Blocks

A migration is not a file-extension rename. A Vintage theme, an Online Store 2.0 theme, and a Theme Block-enabled theme make different promises about where page composition lives, how merchants customize pages, and what configuration Shopify persists. Moving code without first mapping those contracts can erase section settings, reorder merchant content, strand app placement, or create a beautiful JSON file that the editor cannot safely use.

The safe approach is additive and evidence-led: classify the existing architecture, create a candidate copy, identify all code-owned and merchant-owned state, move template markup into sections, replace the template with JSON only after its Liquid counterpart is removed, modernize blocks only where reuse and nesting justify it, and test editor persistence before retirement. Shopify’s OS 2.0 migration guide begins with a backup and warns that a Liquid and JSON template of the same type cannot coexist.[1]

## What you’ll be able to do

- Identify Vintage, JSON-template, and Theme Block capability signals without guessing from visual design.
- Convert a Liquid template into a JSON template while preserving section responsibilities.
- Decide whether section-defined blocks should remain local or become reusable Theme Blocks.
- Use `content_for 'blocks'` only in a section/block contract that accepts Theme Blocks.
- Record merchant settings, block order, app placement, custom CSS, and content as migration data rather than disposable configuration.

## 64.1 Identifying which generation a theme belongs to

Generation is detected from repository architecture and rendered/editor capability, not from a theme’s release date or its use of modern CSS. A Vintage theme commonly has Liquid templates with `{% section %}` tags and static page composition. OS 2.0 uses JSON templates that declare sections and their settings/order, letting merchants add, remove, and reorder eligible sections in the editor.[2] Theme Blocks add theme-level reusable block files under `/blocks`, can nest, and are rendered through `content_for 'blocks'` from a section or parent Theme Block.[3]

| Signal | Likely implication | Do not infer |
| --- | --- | --- |
| `templates/product.liquid` with section tags | Vintage/static template composition | That all content is code-owned or safe to delete |
| `templates/product.json` | JSON-template composition and section instances | That every section is merchant-removable; presets/schema matter |
| `/blocks/*.liquid` with Theme Block schema | Reusable block capability | That every section already accepts Theme Blocks |
| Section schema local `blocks` types | Section-defined local blocks | That they can be reused elsewhere |
| `{% content_for 'blocks' %}` | Parent renders Theme/App Block children | That arbitrary outer variables can be passed into blocks |
| `@theme` schema target | Section/block accepts Theme Blocks | That local section blocks can coexist in same parent |

Start with an **architecture inventory**. For every template, record type (`.liquid` or `.json`), layout, section references, markup remaining outside sections, static and dynamic settings, local block definitions, app blocks, dynamic sources, alternate templates, section groups, custom CSS, assets/snippets, content dependencies, editor-visible instances, and current output fixture `[VERIFY]`. Also count platform limits before broad conversion: current documentation lists up to 1,000 JSON templates per theme, 25 sections per JSON template, and 50 blocks per section; the repository’s verified limits ledger has further Theme Block limits.[2]

Do not convert every section because “blocks are new.” A product form, cart operation, or stable compliance surface may be deliberately code-owned. A reusable editorial unit across multiple parent sections may benefit from a Theme Block. The migration decision is about ownership and variation: what can the merchant safely select/reorder, what must stay structurally fixed, what needs a reusable contract, and what has a documented removal/rollback path.

## 64.2 Converting Liquid templates to JSON templates

A JSON template is data: it lists section instances, their configuration, and render order. It has no arbitrary markup between sections. Shopify renders sections in the `order` sequence; the root needs `sections` and `order`, IDs must be unique, and the section files referenced must exist.[2] Therefore, remaining template Liquid must first move into an existing or new section.

Shopify’s prescribed migration sequence is reliable: back up/copy; identify section tags; remove those references; move remaining template code to a section; delete the Liquid template; create the JSON replacement; add former referenced sections to JSON; and test in the editor.[1] Never create `product.json` beside `product.liquid`: one template type only is permitted for that type/name.[1]

<!-- templates/product.liquid — Vintage before -->
```liquid
{% section 'product-main' %}
{% section 'product-recommendations' %}
```

If `product-main` already contains the product markup, the JSON replacement expresses the same composition:

<!-- templates/product.json -->
```json
{
  "sections": {
    "main": {
      "type": "product-main"
    },
    "recommendations": {
      "type": "product-recommendations"
    }
  },
  "order": ["main", "recommendations"]
}
```

The IDs (`main`, `recommendations`) are instance identifiers; `type` names the section filename without `.liquid`. If the Vintage template contains markup outside a section, do not paste that markup into JSON. Move it into a section whose context, schema, semantic wrapper, assets, editor ownership, and tests can be defined. A section cannot contain a reference to another section, so preserve prior relationships by listing sibling sections in the JSON template rather than nesting section tags.[1]

A section needs a preset to be addable through the editor; without one it can still be coded into JSON but is not a removable/addable merchant candidate.[2] That distinction protects core functionality from accidental removal. `enabled_on`/`disabled_on` should constrain genuinely inappropriate template placements rather than act as decorative metadata `[VERIFY]`.

```liquid
<!-- sections/product-main.liquid -->
<section class="product-main" data-section-id="{{ section.id }}">
  {% render 'product-form', product: product %}
</section>

{% schema %}
{
  "name": "Product information",
  "settings": [],
  "presets": [{"name": "Product information"}]
}
{% endschema %}
```

Test both storefront and editor behavior after every slice: resource context, headings/landmarks, layout, product form, app block, dynamic source, merchant settings, disabled state, alternate template, error state, asset loading, and no-JavaScript route. A structurally valid JSON file can still render the wrong section context or discard meaningful configuration.

## 64.3 Converting section blocks to Theme Blocks

Section-defined blocks live only in their parent section schema. Theme Blocks are Liquid files at `/blocks`, reusable across parents and capable of nesting.[3] This is a change of variable/data boundary: Theme Blocks receive their own `block`, the section that rendered them, and global objects; they cannot access variables created outside the block or accept snippet-style parameters.[3] Extract only when the block can have an explicit independent contract.

| Keep section-defined blocks when | Convert to a Theme Block when |
| --- | --- |
| Block only makes sense in one section | Same editorial/component contract is needed by multiple parents |
| Parent passes local loop/context logic | Block can use `block`, `section`, and documented globals only |
| Structure must remain tightly constrained | Merchant needs reusable picker/nesting capability |
| Migration would lose settings/order without gain | Preset, target, data, style, and content contract are stable |

A Theme Block file includes markup and schema. Its preset makes it selectable by merchants. Avoid copying a section block into `/blocks` and hoping outer assignments work; replace hidden dependencies with setting/dynamic-source/global-object decisions, or leave it local.

<!-- blocks/editorial-text.liquid -->
```liquid
<div class="editorial-text editorial-text--{{ block.settings.alignment }}" {{ block.shopify_attributes }}>
  {{ block.settings.text }}
</div>

{% schema %}
{
  "name": "Editorial text",
  "settings": [
    {"type": "richtext", "id": "text", "label": "Text"},
    {"type": "text_alignment", "id": "alignment", "label": "Alignment", "default": "left"}
  ],
  "presets": [{"name": "Editorial text"}]
}
{% endschema %}
```

Theme Blocks can nest, but nesting is not free complexity. The repository’s verified limits include 300 block files and a maximum nesting depth of eight excluding section level. Keep block taxonomy small, name contracts clearly, preserve semantic heading levels, and test editor reordering/duplication. `[VERIFY]` exact target availability, dynamic source compatibility, app inclusion, and theme version/feature behavior before a production conversion.

## 64.4 Introducing `content_for` into existing sections

A parent renders Theme Blocks with `{% content_for 'blocks' %}`. The section schema opts into them with `{"type": "@theme"}`; it can additionally opt into app blocks with `{"type": "@app"}` where supported. Shopify’s Theme Block guidance is explicit: a section may define local blocks **or** opt in to Theme Blocks, but cannot support both at once.[3] This is the migration fork that causes most accidental editor breakage.

<!-- sections/editorial-stack.liquid -->
```liquid
<section class="editorial-stack" aria-label="{{ section.settings.label | escape }}">
  {% content_for 'blocks' %}
</section>

{% schema %}
{
  "name": "Editorial stack",
  "settings": [{"type": "text", "id": "label", "label": "Accessible label", "default": "Editorial content"}],
  "blocks": [{"type": "@theme"}, {"type": "@app"}],
  "presets": [{"name": "Editorial stack"}]
}
{% endschema %}
```

`content_for` is not a generic replacement for `render`, a way to inject arbitrary Liquid, or a safe refactor for a parent that still relies on local block types. It renders persisted child block content in the order stored in the JSON/template state.[3] Before changing a parent, record its existing block IDs/types/settings/order, app placements, dynamic sources, CSS selectors, anchors, merchant instructions, and current output. Decide whether to retain local blocks, migrate them with a mapping, or create a new sibling section. Never mix contracts halfway through a release.

## 64.5 Preserving merchant content through the migration

Merchant content is production data. Section settings, block settings/order, app placements, custom CSS, locale strings, dynamic-source connections, images/files, metafield references, alternate-template assignment, and editor-disabled state can all be more valuable than the template code. A migration that preserves rendering but resets a merchant’s configured blocks is a failure.

Create a **content preservation ledger** before code moves. For each candidate template/section instance, capture candidate theme/version `[VERIFY]`, route/resource fixture, section ID/type, settings, local block IDs/types/settings/order, app block locations, custom CSS, dynamic sources, media references, locales, visibility/disabled status, output capture, merchant owner, acceptance criteria, rollback, and post-migration comparison. Do not copy customer data, orders, secrets, or private production screenshots into source control.

| Migration phase | Content protection |
| --- | --- |
| Discovery | Inventory code-owned versus merchant-owned state and select sanitized candidate fixtures |
| Design | Write type/setting/block mapping and declare unsupported/retired configuration |
| Candidate build | Add new sections/blocks without deleting legacy source or data record |
| Editor validation | Compare settings, order, app placements, custom CSS, dynamic sources, output, accessibility, and no-JS behavior |
| Cutover | Approved content owner signs off; publish only candidate/release plan `[VERIFY]` |
| Rollback | Restore known theme/configuration path; preserve evidence and record divergence |

Do not use a script to blindly transform `settings_data.json` because it looks JSON-shaped. Its persistence and editor semantics need an approved migration plan. If a configuration cannot be safely mapped, state that it requires merchant reconfiguration, describe the effect, obtain approval, and leave the legacy path intact until the cutover plan accepts it `[VERIFY]`.

### A migration rehearsal, not a one-way conversion

Run the migration first against a controlled candidate copy. Capture a before-state inventory and render screenshots/data only where authorised, then build the new JSON/section/block architecture alongside the preservation ledger. Assign a migration outcome to every legacy setting and block: **mapped**, **retained in a static/core section**, **replaced by a documented new configuration**, **requires merchant action**, or **retired with approval**. “Not present in the new schema” is never a valid outcome by itself.

Then compare buyer-facing and editor-facing behavior. Buyer checks include route/resource context, content order, semantic headings, product/cart behavior, dynamic data, application embeds, localization, performance, and no-JavaScript recovery. Editor checks include whether the intended section can be added/removed, whether a core section remains protected, block picker eligibility, reordering, duplication, preset creation, saved settings, app placement, custom CSS, dynamic sources, alternate templates, and rollback visibility. Record the actual theme editor/version and all specific platform behavior `[VERIFY]`.

A release plan names the cutover window, candidate theme identifier, content owner, signer, test evidence, monitoring route, freeze window for merchant changes, exact rollback theme/configuration path, and reconciliation work if merchant edits occur during the candidate period. Do not discard the Vintage implementation or its configuration inventory merely because the JSON candidate renders correctly once. The migration is complete only when the content owner can perform their intended edit safely and the team can return to a known state without guessing.

## Gotchas

- **Keeping `.liquid` and `.json` templates together:** Shopify permits one template type for the same template name.
- **Moving markup into JSON:** JSON orchestrates section data; it does not host arbitrary Liquid/HTML.
- **Extracting a block with hidden parent variables:** Theme Blocks cannot receive outer variables like snippets.
- **Mixing local blocks and `@theme`:** the parent chooses one block model; map existing content deliberately.
- **Deleting before editor comparison:** merchant state is data, not a side effect to recreate from memory.

## Checklist

| Question | Evidence |
| --- | --- |
| Is each template generation identified by files and editor capability? | Architecture inventory `[VERIFY]` |
| Does every JSON replacement name existing sections with unique IDs/order? | Parsed JSON plus rendered/editor fixture |
| Does each Theme Block have an independent data/style/preset contract? | Block inventory and target test |
| Does every `content_for` parent use one compatible block model? | Schema, editor order, app/Theme Block evidence |
| Is merchant state mapped, compared, approved, and rollbackable? | Content preservation ledger and candidate sign-off |

## Related

- [ch-17 — Sections and Schema](../../part-03-theme-architecture/ch-17-sections-and-schema/)
- [ch-18 — Blocks: The Three Kinds](../../part-03-theme-architecture/ch-18-blocks-the-three-kinds/)
- [ch-56 — Theme App Extensions](../../part-10-apps-extensions-the-edge-of-liquid/ch-56-theme-app-extensions/)

## References

[1]: https://shopify.dev/docs/storefronts/themes/os20/migration "Shopify — Migrating templates to Online Store 2.0"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates "Shopify — JSON templates"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start "Shopify — Theme Blocks quick start"
