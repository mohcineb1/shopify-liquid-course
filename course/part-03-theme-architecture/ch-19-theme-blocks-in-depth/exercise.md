<!-- STATUS: final -->
---
id: ch-19-exercise
title: "Design a governed theme-block container"
chapter: ch-19
---

# Exercise — Design a governed theme-block container

A theme has accumulated dozens of public block files. Merchants can add internal wrappers directly, parent containers accept children without a documented layout contract, and an editable card block lacks `block.shopify_attributes`. The editor looks flexible but is difficult to use and approaching the theme-block ceiling. Your task is to replace one small part of that library with a governed editorial container: one public container block, one public card block, and one private helper block.

## The brief

Complete the three starter files under `blocks/` and the parent section that hosts them. The public `editorial-stack` block represents a vertical editorial flow. Its schema must declare a merchant-facing name, a heading setting, a `tag`, a `class`, a preset, and an explicit child-block contract that accepts `@theme` and `@app` only because the parent has a documented generic flow role. Render `block.shopify_attributes` once on the root element and use a unique block-derived heading relationship when needed.

The public `editorial-card` block must render a heading and body from settings with `block.shopify_attributes` on its root. It is a dynamic child that a merchant may add or reorder in the stack. The underscore-prefixed `_editorial-divider` file is a private block. It may be rendered as a fixed structural detail by the parent, but it must not appear as an independently addable public type. Do not use it as a concealed merchant feature.

The parent section must explain its role: it provides an editorial stack that can host compatible theme and app blocks in a vertical flow. It must not read product, collection, or cart data. Keep nesting shallow: container → direct child is enough for this exercise. Do not create a deeper wrapper chain, a generic page builder, a product action bar with open acceptance, or a new app integration.

## Constraints

| Area | Requirement |
| --- | --- |
| Public types | `editorial-stack` and `editorial-card` are named public block capabilities. |
| Private type | `_editorial-divider` is an internal block dependency, not merchant-addable. |
| Parent contract | The stack documents and renders a vertical editorial child region with controlled `@theme`/`@app` acceptance. |
| Editor identity | Every rendered public block root carries `block.shopify_attributes` exactly once. |
| Nesting | Use only one parent-to-child relationship; do not approach the eight-level technical maximum. |
| Scope | No product context, arbitrary data lookup, checkout behavior, external dependency, or unreferenced experimental block. |

> [VERIFY] Verify the current block-file conventions, underscore visibility, child-block syntax, wildcard rules, static-block behavior, and app-block eligibility before applying this structure in a production theme.

## Acceptance criteria

A merchant can add and reorder editorial cards in the stack while the stack preserves its vertical semantic flow. The private divider remains unavailable as a direct editor choice. Each visible public block is selectable in the editor through its root attributes. The parent can accept a compatible app block only because its layout contract supports a generic editorial flow; explain why the same wildcard would be unsafe in a tightly structured product action region.

In your hand-off, identify the likely direct and wildcard references that must be searched before deleting any of the three files. State why a block file that is no longer directly rendered may still count against the verified 300-block ceiling. Explain why an eighth nesting level being allowed does not make it an appropriate target for this component.

## Files to work in

```text
course/part-03-theme-architecture/ch-19-theme-blocks-in-depth/
├── exercise.md
└── starter/
    ├── blocks/_editorial-divider.liquid
    ├── blocks/editorial-card.liquid
    ├── blocks/editorial-stack.liquid
    └── sections/editorial-host.liquid
```

## Self-review

- [ ] Public/private block visibility maps to real editor capability.
- [ ] The parent’s wildcard acceptance has explicit semantics, layout, and fallback reasoning.
- [ ] Public roots expose `block.shopify_attributes`; nesting remains shallow.
- [ ] Static/private structure does not masquerade as an editor-controlled content item.
- [ ] File lifecycle and 300-block accounting are considered before addition or deletion.
