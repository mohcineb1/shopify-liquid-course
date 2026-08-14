<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-19-solution
title: "Solution — Design a governed theme-block container"
chapter: ch-19
---

# Solution — Design a governed theme-block container

The completed editorial host exposes one governed public entry point: `editorial-stack`. The stack is a public parent block because merchants need to add a vertically arranged editorial region. `editorial-card` is a public child because it is a meaningful editor item that can be added and reordered in that flow. `_editorial-divider` is private because it is structural implementation detail, not a merchant choice. This small library makes visibility match capability.

## 1. Define public and private files intentionally

The public files use descriptive block type names and have a clear parent relationship. A merchant can recognize an editorial stack and an editorial card in a compatible editor region. The underscore-prefixed divider is deliberately not offered as an addable child. If the parent needs it, the parent controls its fixed position as a structural element.

```text
blocks/
├── editorial-stack.liquid      # public parent
├── editorial-card.liquid       # public dynamic child
└── _editorial-divider.liquid   # private internal detail
```

Private does not mean unused or unimportant. Before deleting the divider, search direct references from parent block files. Before deleting either public block, search parent section schemas, direct child lists, presets, static declarations, and open acceptance contracts that may make the type valid. All three files count toward the verified 300-theme-block ceiling even if a file is no longer currently rendered, so leaving an experiment in `blocks/` is not neutral.[1]

## 2. State the parent contract before accepting children

`editorial-stack` has a specific editorial-flow contract: its children are displayed in one vertical content region beneath the optional stack heading. The parent owns the outer semantic container, spacing, width, and any empty-state decision. That role is broad enough to support compatible theme blocks and app blocks, so the schema may accept `@theme` and `@app`.

```liquid
<section class="editorial-stack" {{ block.shopify_attributes }}>
  <h2>{{ block.settings.heading | escape }}</h2>
  <div class="editorial-stack__children">
    {%- comment -%} Render accepted children in their configured order here. {%- endcomment -%}
  </div>
</section>
```

The parent’s openness is not a promise that every imaginable child works. It is limited by the established flow: a child must fit the vertical region, preserve reasonable heading semantics, avoid assumptions about product context, and render meaningfully without a specialized data source. The parent should decide what to render when the child region is empty rather than silently relying on a missing child to make the whole component disappear.

A product action bar would make a different decision. It has a compact, tightly structured interaction area where arbitrary app or theme blocks could break button order, accessible labeling, sizing, or commerce semantics. It should accept a focused list of compatible action types rather than an open wildcard.

> [VERIFY] Confirm current wildcard syntax, theme/app block eligibility, and public/private block visibility rules before using this exact acceptance contract in production.

## 3. Preserve the editor contract on public roots

Every public rendered block receives `block.shopify_attributes` once on its root representation. The attributes let the editor associate visible markup with the configured block instance. The editorial stack has them on its outer section; each editorial card has them on its article root.

```liquid
<article class="editorial-card" {{ block.shopify_attributes }}>
  <h3>{{ block.settings.heading | escape }}</h3>
  <p>{{ block.settings.body | escape }}</p>
</article>
```

The private divider is not an independent merchant-edited block surface, so it does not pretend to be one. The parent owns its structural placement. This is the difference between static/private structure and a dynamic child: cards may be reordered because ordering changes editorial content; a divider is fixed because its role is structural continuity.

## 4. Keep nesting shallow

The composition uses one intentional relationship: host section → stack parent → direct card child. The editor can show which container owns each card and a merchant can predict the result of reordering a card. The technical eight-level maximum is irrelevant to the design goal; adding a chain of wrapper blocks would make the editor hierarchy harder to navigate without improving this vertical flow.

If the stack later needs a different content pattern such as tabs, cards with image regions, or actions, evaluate whether it needs a focused parent type instead of adding child-after-child nesting. Shallow composition produces better editor affordance, clearer data boundaries, and easier accessibility review.

## 5. Verify lifecycle and output

In the editor, add an editorial stack, add several cards, reorder them, and confirm the markup follows the editor order. Verify the public roots remain selectable through their rendered attributes. Confirm that the divider is not offered as a direct type. Test an empty stack and a stack with an app block only if the parent’s current wildcard contract has been verified.

For lifecycle, inventory public parents that accept the stack, references to the private divider, direct card types, and wildcard regions. Before removal, migrate or remove configured instances and test affected compositions. Before adding another public block, name the merchant capability and parent contract it needs; if it has neither, avoid adding another file to the block library.

## Validation matrix

| Test | Expected behavior |
| --- | --- |
| Public block chooser | Shows editorial stack/card only in compatible contexts. |
| Private implementation | Does not expose divider as a direct merchant choice. |
| Stack composition | Cards render in configured vertical order. |
| Editor selection | Stack and card roots contain `block.shopify_attributes`. |
| Wildcard review | Theme/app child accepted only when it fits editorial-flow semantics. |
| Library cleanup | Unreferenced files are still inventoried against the 300-block ceiling. |

## Checklist

- [x] Public and private filenames map to actual merchant capability.
- [x] Wildcard acceptance follows a defined layout, data, and fallback contract.
- [x] Public block roots support editor selection exactly once.
- [x] Static/private detail and dynamic editorial content have different ownership.
- [x] Nesting, references, and file count are reviewed as lifecycle concerns.

[1]: ../../../docs/DEPRECATIONS.md

## 6. Editor and maintenance review

Review the container with both editorial and operational states. In the editor, add an editorial stack, create two cards, reorder them, and verify the root attributes let Shopify select the exact stack and card instances. Confirm that the private divider never appears as an independently addable choice. Test the empty parent state and decide whether the parent renders a neutral wrapper, an editor placeholder, or no storefront markup; do not leave this behavior accidental.

Then review the file inventory. Search for the public stack and card type in section schemas, direct block lists, presets, and any parent that accepts wildcard children. Search for the private divider where the parent statically renders it. An unreferenced file still contributes to the block ceiling, so delete obsolete prototypes only after confirming there is no direct or wildcard composition that relies on them. Block governance is continuous maintenance, not a one-time schema decision.

## 7. Composition decision

The stack uses one parent-child level because that is enough for a vertical editorial flow. A deeper model would add editor navigation without adding meaningful capability. If a later feature requires a different visual grammar, create a focused parent contract instead of layering wrappers until the technical maximum is reached. This preserves a readable tree, stable semantics, and a clear relationship between each file and the merchant task it supports.
