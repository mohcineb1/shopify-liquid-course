<!-- STATUS: final -->
---
id: ch-20-exercise
title: "Compose a fixed heading with an editorial child flow"
chapter: ch-20
---

# Exercise — Compose a fixed heading with an editorial child flow

A marketing section currently hard-codes three cards, manually loops a legacy block collection, and uses CSS order to make the title appear before the cards. Merchants cannot reliably reorder the cards, and a later developer cannot tell which content is structural versus editorial. Rebuild the section as a composable editorial flow: a fixed title block occupies the invariant heading position; dynamic child blocks render in the merchant’s configured order; a wrapper snippet receives rendered child content through an explicit API.

## The brief

Complete the starter parent section, the fixed `_flow-title` block, the public `flow-card` block, and the `group` snippet. The parent must render its declared static title with `{% content_for 'block', type: '_flow-title', id: 'title' %}` inside the section heading region. It must render dynamic children exactly once with `{% content_for 'blocks' %}`. The dynamic slot must be captured before invoking `render 'group'`, passing the captured output as `content` and a supplied class name.

The public card block is the editor-managed content item. It must render its root with `block.shopify_attributes`, use only its own heading/body settings, and remain valid when reordered. The fixed title is structural: it can be configured according to its schema, but merchants must not move it below the editorial child flow. Do not loop children manually, inspect their JSON order, use a literal card count, or create a second source of ordering in Liquid or CSS.

The wrapper snippet accepts `content` and `class` only. It must produce a meaningful group wrapper without retrieving block context, product data, or section settings itself. It should tolerate empty content. The parent belongs to generic page-like composition, not to product-specific data; do not access product, collection, cart, or customer objects.

## Constraints

| Area | Requirement |
| --- | --- |
| Fixed structure | Render `_flow-title` once through the singular static `content_for` call. |
| Dynamic composition | Render children once through `{% content_for 'blocks' %}` inside captured content. |
| Order | Shopify JSON/editor state is the only source of dynamic child order. |
| Snippet API | Pass pre-rendered `content` and `class`; the snippet performs no child lookup. |
| Editor identity | The dynamic public card root carries `block.shopify_attributes`. |
| Scope | No manual block loop, CSS reordering, resource-specific data, JavaScript, app behavior, or hidden extra wrapper contract. |

> [VERIFY] Verify current static-block declaration, `content_for` slot eligibility, and capture/render behavior for this section model before shipping the pattern in a production theme.

## Acceptance criteria

A merchant can edit the fixed heading but cannot move it beneath the cards. They can add and reorder eligible flow cards, and the visible/DOM order follows the editor order without code changes. The group snippet can be read as a small API: it receives already-rendered child output and a class, then wraps it. A reviewer can find exactly one dynamic slot and exactly one fixed static-block call in the parent.

In the hand-off, describe why the title is static while the cards are dynamic. Explain why JSON, rather than Liquid source order, controls cards. Explain why the wrapper snippet must not access `block` or `section` itself. Test empty, one-card, several-card, reordered-card, and repeated-parent states before sign-off.

## Files to work in

```text
course/part-03-theme-architecture/ch-20-content-for/
├── exercise.md
└── starter/
    ├── blocks/_flow-title.liquid
    ├── blocks/flow-card.liquid
    ├── sections/editorial-flow.liquid
    └── snippets/group.liquid
```

## Self-review

- [ ] Static and dynamic child positions have different explicit rendering forms.
- [ ] The configured editor order is never reconstructed or overridden in Liquid/CSS.
- [ ] The wrapper snippet receives content by explicit API rather than hidden context.
- [ ] Public dynamic children retain editor attributes and repeat-safe markup.
- [ ] Empty and reordered states preserve valid parent semantics.
