<!-- STATUS: final -->
---
id: ch-19
title: "Theme Blocks in Depth"
part: 3
words: 2500
---

# Chapter 19 — Theme Blocks in Depth

Theme blocks are reusable, editor-configurable component files that sections can accept, arrange, and nest. They are not section blocks defined inline in one section schema; they have their own file identity under `blocks/`, their own schema, their own placement rules, and their own count against the theme-block ceiling. This chapter examines the contract that makes theme blocks composable without making a theme editor impossible to reason about.

## 19.1 File conventions, the underscore prefix, and private blocks

Theme block files live in `blocks/` and use a `.liquid` extension. Their file name provides the block type available to compatible parent sections or blocks. A normal block file such as `blocks/promo-card.liquid` exposes a block type intended for editor composition. A filename beginning with an underscore creates a **private block**: it can be referenced from another block implementation but is not an editor-addable public building block.

Private blocks are useful for stable internal structure. They allow a public block to compose implementation details without exposing every wrapper, icon row, or formatting primitive as a merchant decision. The underscore is not a security boundary or a way to hide product features from shoppers; it is an editor capability and architecture signal.

Do not proliferate block files merely to avoid a small snippet. Use a theme block when the file needs a block schema, editor identity, or nested block contract. Use a snippet for explicit reusable rendering that does not need to be an independently configured block surface.

## 19.2 Block schema: settings, `presets`, `tag`, `class`, and the rules that differ from sections

A theme block schema defines the block’s merchant-facing name, settings, optional presets, outer wrapper `tag` and `class`, and any nested child-block contract. It resembles a section schema but belongs to a block file, not a top-level section. A block does not own section-level composition or independently appear in a template; a compatible parent must permit it.

```liquid
<div {{ block.shopify_attributes }}>
  <h3>{{ block.settings.heading | escape }}</h3>
</div>

{% schema %}
{ "name": "Promo card", "settings": [{ "type": "text", "id": "heading", "label": "Heading" }] }
{% endschema %}
```

`tag` and `class` determine Shopify-generated wrapper structure when used. `presets` enable a meaningful initial block configuration for a merchant. Keep settings narrow: each setting should correspond to a real block-level task rather than letting one block impersonate a full page builder. Unlike a section, a block is always nested within a parent capability and should communicate its parent expectations.

> [VERIFY] Verify current theme-block schema attributes and differences from section schemas before using a block-specific field or assuming section capabilities apply unchanged.

## 19.3 Nesting: children, up to 8 levels deep, and how deep is too deep

Theme blocks can accept children through their schema contract, allowing structured recursive composition. Shopify permits nesting up to eight levels deep beyond the section. That is a technical maximum, not a design target. Every nesting level adds editor indentation, parent/child data dependencies, rendering complexity, and a harder path for a merchant to understand what they are changing.[1]

A good block tree follows visible content structure: a container can contain cards; a card can contain a small action or media child when the editing relationship is clear. A weak tree uses nesting merely to create arbitrary flexibility. If a merchant cannot predict the result of adding a child block, flatten the editor model or make a focused parent section instead.

Review nesting at three levels: visual hierarchy, data ownership, and editor workflow. A child should inherit only what the parent intentionally owns; it should not silently require route-specific data. Keep common compositions shallow even though deeper nesting is supported. The 8-level maximum is a safety ceiling; many practical component trees should use far fewer levels.

## 19.4 The `@theme` and `@app` wildcards — accepting any block without hardcoding

A parent block or section can use `@theme` and `@app` wildcard entries in a block acceptance contract to permit compatible theme blocks or app blocks without hard-coding every type name. `@theme` supports extensible theme-block composition; `@app` allows app-provided blocks where the parent is designed to host app content.

Wildcards are capability decisions, not shortcuts around a parent API. Before accepting any block, define the parent’s layout, semantics, width constraints, data assumptions, and fallback behavior. A generic container may reasonably accept multiple child types. A tightly structured price card probably should not accept arbitrary app blocks because its markup and accessibility contract may not support them.

> [VERIFY] Verify the exact current wildcard syntax, eligibility rules, and editor behavior for `@theme` and `@app` before adopting an open block-acceptance contract.

## 19.5 Static theme blocks: fixed position, hideable but not deletable

A static theme block is declared in its parent’s implementation at a fixed position. A merchant can typically hide or configure it where the block contract permits, but cannot delete or reorder the structural position the parent owns. Static blocks are appropriate for stable component subregions such as a required title area or a fixed action region whose position should remain predictable.

Use static blocks to protect structure, not to overrule all merchant choice. If a content item truly needs reordering, addition, or deletion, it should be part of a dynamic child-block composition. The distinction makes editorial intent visible: fixed structural elements stay fixed; optional repeatable content is editor-managed.

## 19.6 The 300-theme-block ceiling and unreferenced-file accounting

A theme can contain at most 300 theme block files. The limit counts block files, including files not currently referenced by a section, template, or another block. An abandoned prototype, a copied experiment, and a private block all count. Repository hygiene is therefore architectural: delete obsolete block files instead of leaving them as harmless-looking dead code.[1]

The ceiling encourages a block inventory. Before adding a block, ask whether a section block, snippet, existing public block, or private helper is the correct surface. Before removing one, trace public usage and dynamic/wildcard acceptance contracts. Count is not the only design metric, but a large ungoverned block library makes editor choice and maintenance worse before it reaches a platform limit.

## 19.7 `block.shopify_attributes` and the theme editor contract

`block.shopify_attributes` belongs on the rendered root element representing that block instance. It lets Shopify’s theme editor associate the visible output with the configured block so merchants can select, inspect, reorder, and edit it reliably. A block that omits the attributes may look correct in the storefront yet provide a degraded editor experience.

```liquid
<article class="promo-card" {{ block.shopify_attributes }}>
  <h3>{{ block.settings.heading | escape }}</h3>
</article>
```

Use the attribute once on the root representation of the block, not scattered across descendants. If a block has a conditional output path, ensure the editor still has a meaningful rendered element when it is intended to be selectable. Treat this as a platform integration point, not decoration.

## Gotchas

- **Exposing every private implementation detail as a block.** Use underscore-prefixed private blocks or snippets where editor control is not needed.
- **Assuming section schema fields work identically in theme blocks.** Verify the block-specific contract.
- **Building to eight nesting levels.** The maximum is not an editor usability goal.
- **Accepting `@theme` or `@app` without a parent layout contract.** Openness still needs boundaries.
- **Leaving experimental blocks unreferenced.** They still count toward the 300-file ceiling.
- **Omitting `block.shopify_attributes`.** Storefront markup can work while editor selection breaks.

## Checklist

- [ ] Public and private block files have intentional editor visibility.
- [ ] Each block schema names a focused merchant task and parent expectation.
- [ ] Child nesting is shallow enough to remain understandable in the editor.
- [ ] Wildcard acceptance is an explicit parent capability decision.
- [ ] Static block positions and dynamic child positions express real editorial constraints.
- [ ] The block library is inventoried, referenced, and cleaned against the verified ceiling.

## Related

- `ch-17-sections` — section schemas and editor contracts.
- `ch-18-blocks-the-three-kinds` — the three block models.
- `ch-20-blocks-composition` — composition patterns and trade-offs.
- `ch-21-snippets-as-apis` — choosing snippets rather than editor surfaces.

[1]: ../docs/DEPRECATIONS.md

## Block files are editor-facing capability surfaces

A public theme block should exist because a merchant needs to add, configure, or nest that component within a parent that explicitly accepts it. Its filename becomes an editor-visible type identity, so it deserves the same naming discipline as a section. Name a block for its merchant role, not for a temporary CSS treatment. A block called `promo-card` can be understood in an editor; a block called `card-v4-alt` leaves the merchant guessing which composition it belongs to.

Private underscore-prefixed blocks make the opposite choice intentionally. A public parent may need a stable internal child that renders a fixed visual subregion or keeps nested structure manageable. The private file lets the theme author reuse that detail without inviting the merchant to insert it independently in unrelated parent contexts. Before creating either kind, ask whether the capability needs editor identity at all. If not, a snippet with explicit inputs is usually the clearer contract.

This choice also affects change management. Renaming a public block type can affect existing instances and parent acceptance lists. Deleting a private block can still break a public parent that references it. Treat every block file as a dependency with an owner, usage inventory, and lifecycle rather than as a disposable fragment of markup.

## Parent contracts must be more specific than “accepts blocks”

A parent that supports child blocks needs to establish the semantics of its child region. Is it a vertical list, a grid, a rich-text flow, a navigation group, or a stack of actions? Which element owns the list or landmark semantics? What width, alignment, media, and heading hierarchy may a child assume? Which child types are compatible with that visual and accessibility model? These questions remain necessary even when `@theme` makes the acceptance list open.

For example, a generic editorial container may accept compatible theme and app blocks because its job is to arrange varied content in an established flow. A product action bar should accept only the small action types that preserve its semantics and predictable interaction model. Wildcard acceptance without such a parent contract produces editor freedom that may lead to invalid nesting, conflicting headings, or app content that does not fit the region.

The parent must also choose a fallback. An open child area can be empty; it may need an editor-facing placeholder, a default private child, or no storefront markup until configured. Do not rely on a missing child to silently collapse a critical component without deciding whether the merchant can understand the resulting state.

## Keep nesting shallow for the editor, not only for code

Nesting depth is experienced by merchants as editor navigation. At each level they need to know which parent they are selecting, what a child affects, and whether moving it changes local or global content. A deeply nested tree may be technically legal but create an opaque editor where a heading block lives inside a card inside a tab inside a stack inside a section. If the merchant cannot see the hierarchy in the page preview and understand it in the sidebar, simplify the composition.

Prefer one clear parent-child relationship per component layer. A container can organize several cards; each card can organize a limited set of card details. Additional structural layers should have a strong visual and editorial reason. If a change would add another nested child only to expose one option, consider a setting on the existing parent or a different focused block type instead.

## Static and dynamic block operations

Static blocks protect an invariant position. A fixed product title subregion may be hideable for a particular design but should not be draggable beneath unrelated details. Dynamic child blocks support editorial arrangement where ordering is meaningful and safe. This distinction should match the component’s visual grammar rather than a preference for maximum configurability.

When reviewing a static block, test both visible and hidden states: the parent’s markup, labels, and remaining children must still form a coherent component. When reviewing dynamic blocks, test empty, one-child, many-child, and reordered-child states. The editor contract includes all of these states, not only the filled example the developer first designed.

## Block library governance

The 300-file ceiling makes an inventory necessary, but governance improves quality even below the limit. Record public block types, their intended parents, private dependencies, wildcard eligibility, and deprecation status. Search usage before deleting a block and distinguish direct references from wildcards that may permit the type. Remove abandoned experiments rather than allowing the editor and repository to accumulate ambiguous choices.

A small, well-named library gives merchants confidence. A large uncurated library creates more choices but less usable capability. Block architecture succeeds when each file earns its editor surface, its parent contract, and its place in the maintenance inventory.
