<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 64 — Solution

## The approach

The migration preserves responsibilities before it changes file types. `product.liquid` is Vintage because it composes section tags and template-owned guide markup. The candidate moves the guide into a section, deletes the candidate Liquid template, and creates `product.json`. It does **not** migrate the product main’s local blocks: they depend on product-specific parent composition. Only an independent editorial text unit becomes a Theme Block. A new editorial parent uses the Theme Block model; the old local-block parent is not half-converted.

| Legacy item | Candidate outcome |
| --- | --- |
| `product.liquid` section tags | Mapped to JSON section instances/order |
| Template-owned size guide | Mapped to dedicated `product-size-guide` section |
| `product-main` local heading/text | Retained local pending independent-contract review |
| Reusable editorial text | New `/blocks/editorial-text.liquid` Theme Block |
| Editorial stack local blocks | Replaced by Theme Block-compatible parent |
| Merchant/editor state | Preservation ledger and candidate comparison; no automatic production rewrite |

## 1 — Architecture inventory

`records/architecture-inventory.md` identifies `templates/product.liquid` as a Vintage composition surface, `product-main` local section blocks as parent-scoped, the size-guide snippet as template-owned presentation, and `editorial-stack` as an invalid mixed model. It records existing settings, IDs/types/order, app positions, dynamic sources, custom CSS, assets, alternate templates, route fixtures, content owner, current theme/editor facts, candidate, and rollback as `[VERIFY]`.

A theme is not classified by how modern it looks. JSON-template generation is evidenced by `.json` template data referencing section types/order. Theme Block capability is evidenced by independently schema-backed `/blocks/*.liquid`, a parent accepting `@theme`, and `{% content_for 'blocks' %}`. A local section block does not become reusable merely because its markup is short.

## 2 — Candidate Liquid-to-JSON conversion

The candidate template mapping contains **only** `templates/product.json`; it deliberately has no `templates/product.liquid`. Shopify permits a given template as Liquid or JSON, not both.[1]

<!-- solution/templates/product.json -->
```json
{
  "sections": {
    "main": {
      "type": "product-main"
    },
    "size_guide": {
      "type": "product-size-guide"
    },
    "recommendations": {
      "type": "product-recommendations"
    }
  },
  "order": ["main", "size_guide", "recommendations"]
}
```

The instance keys are unique; the `type` values refer to existing section files. JSON has no residual HTML/Liquid markup between sections. Shopify renders the declared sections in `order`; a JSON template can render up to 25 sections and each section up to 50 blocks under current documentation.[2]

<!-- solution/sections/product-size-guide.liquid -->
```liquid
<section class="product-size-guide" aria-labelledby="size-guide-title-{{ section.id }}">
  <h2 id="size-guide-title-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
  {% if product.metafields.details.size_guide != blank %}
    <div class="product-size-guide__content">
      {{ product.metafields.details.size_guide | metafield_tag }}
    </div>
  {% endif %}
</section>

{% schema %}
{
  "name": "Product size guide",
  "settings": [
    {"type": "text", "id": "heading", "label": "Heading", "default": "Size guide"}
  ],
  "presets": [{"name": "Product size guide"}]
}
{% endschema %}
```

The new section owns the semantic wrapper and product-context dependency. Its actual metafield definition, dynamic-source applicability, blank behavior, content owner, core/merchant removability, and current output are `[VERIFY]`. The local `product-main` can remain a JSON-referenced section without becoming a picker-reorderable editorial surface.

`records/template-migration-map.md` maps the old `product-main` tag to JSON `main`, the size-guide render to `size_guide`, and recommendations to `recommendations`. It lists each settings/block/asset/snippet/context/test outcome as mapped, retained, replaced, merchant action, or approved retired. No legacy item is silently omitted.

## 3 — Theme Block decision

The starter editorial text references `{{ eyebrow }}`, assigned in a parent product section. That violates a Theme Block boundary: Theme Blocks cannot receive outer variables like snippets. The candidate Theme Block therefore contains only its independent block settings and supported section/global context.

<!-- solution/blocks/editorial-text.liquid -->
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

`records/theme-block-decision.md` retains product-local heading/text blocks because their product form/headline hierarchy and migration mapping need separate candidate proof `[VERIFY]`. It converts editorial text because its markup, settings, style, semantic responsibility, preset, and data boundary are reusable. It records block file count, nesting/target availability, dynamic sources, app interaction, editor/version, and output fixture as `[VERIFY]`.

## 4 — Compatible `content_for` parent

The candidate creates a new editorial-stack section rather than mixing old local block definitions and `@theme`. Shopify documents that a section supports local section blocks **or** opts into Theme Blocks, not both.[3]

<!-- solution/sections/editorial-stack.liquid -->
```liquid
<section class="editorial-stack" aria-labelledby="editorial-stack-title-{{ section.id }}">
  <h2 id="editorial-stack-title-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
  {% content_for 'blocks' %}
</section>

{% schema %}
{
  "name": "Editorial stack",
  "settings": [
    {"type": "text", "id": "heading", "label": "Heading", "default": "Editorial content"}
  ],
  "blocks": [{"type": "@theme"}, {"type": "@app"}],
  "presets": [{"name": "Editorial stack"}]
}
{% endschema %}
```

`content_for 'blocks'` renders persisted child content in the configured order.[3] The schema/preset enables the editor path, but `@app` support, app availability, targeting, dynamic-source behavior, and exact current editor feature state remain `[VERIFY]`. `records/parent-contract.md` records that the old local text block data has no automatic in-place migration; it requires a mapped candidate configuration or explicit merchant action/approval.

## 5 — Content preservation and rehearsal

`records/content-preservation-ledger.md` records for every affected candidate: theme/version, route/resource fixture, section IDs/types/settings, local or theme block IDs/types/settings/order, app locations, custom CSS, dynamic sources, media, locales, alternate template, disabled state, output capture, owner, outcome, acceptance, rollback, and re-test. No customer/order/private data is copied into source control.

`records/candidate-validation-matrix.md` checks JSON parse, section-file existence, route/product context, product form, size-guide blank/populated state, recommendations, editor add/remove/reorder/preset, local versus Theme Block picker behavior, app/dynamic/custom-CSS state, repeated/empty content, alternate template, semantics/accessibility, no-JavaScript, candidate release and rollback. A content owner approves after a candidate comparison; production state is not bulk transformed.

### Candidate mapping protocol

The ledger is used in a strict order. First, record the legacy configuration without editing it: a settings value has an identifier, source section, resource context, visible output, owner, and test fixture; a block also has its type and order; an app placement has its host and expected output. Second, decide its migration outcome. A heading that remains in `product-main` is **retained**. The guide becomes **mapped** into `product-size-guide`. A local editorial text block becomes **replaced** only after its Theme Block preset and parent contract are confirmed. A configuration that cannot be reproduced is **merchant action** with an explicit visible effect and approval. Nothing becomes “retired” without a named owner and rollback condition.

Third, rehearse an editor change. Add the candidate section where it is allowed, create a Theme Block from its preset, reorder it, duplicate it, configure long and blank content, save, reload, and compare the persisted configuration/output to the ledger `[VERIFY]`. If a core product section must remain fixed, confirm that the candidate does not expose it as an accidental remove/reorder operation. Test application placements and custom CSS separately; a DOM selector that matched the Vintage template may no longer match a section wrapper or Theme Block output.

Finally, make rollback concrete. The release record points to the preserved candidate/legacy theme configuration, lists edits that occurred during a change freeze, identifies the content owner responsible for reconciliation, and defines observable signals for reverting: missing size guide, broken product form, lost merchant blocks, misplaced app output, invalid JSON, or editor persistence mismatch. The goal is not to automate production data movement from this exercise. It is to prove that the migration team understands every state it must preserve before any irreversible store action.

## What people get wrong here

**Creating JSON beside Liquid.** The conflict is structural; delete/retire the candidate Liquid template only after its responsibilities are represented.

**Moving every local block to `/blocks`.** A hidden parent variable or unique product behavior means the block is not independent yet.

**Adding `content_for` to a parent with local blocks.** This creates an incompatible editor contract. Choose the model and map content.

**Treating `settings_data` as disposable JSON.** Editor configuration is merchant data. Inventory it, map outcomes, compare it on a candidate, and retain rollback evidence.

## Stretch: direction only

For a two-column nested Theme Block, first define semantic responsibilities, permitted child targets, preset composition, depth/file-budget limits `[VERIFY]`, dynamic-source/app policy, and the data migration outcome for each local block. Test editor order, headings, empty children, duplicates, and rollback in a candidate before building it in a merchant’s active configuration.

## References

[1]: https://shopify.dev/docs/storefronts/themes/os20/migration "Shopify — Migrating templates to Online Store 2.0"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates "Shopify — JSON templates"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start "Shopify — Theme Blocks quick start"
