<!-- STATUS: draft -->
---
id: ch-08-exercise
title: "Build a bounded collection digest"
chapter: ch-08
---

# Exercise — Build a bounded collection digest

A collection page needs a compact editorial digest above its normal product grid. The digest is not a second product grid: it should make the first few products easier to scan, expose a small amount of variant context, and say something useful when the collection contains no products. The starter is intentionally structural rather than complete. Make its Liquid traversal honest about what it can render and how much work it performs.

## The brief

Finish `sections/collection-digest.liquid` and `assets/section-collection-digest.css`. The section is designed for a collection template and must use the contextual `collection.products` source. Do **not** replace it with `all_products`, a hard-coded collection handle, or client-side data fetching. The component has a narrow responsibility: render an editorial preview of the current collection, not a catalogue-wide search tool.

The digest must render at most four products. Its output must make the display position comprehensible to a reader and expose the number of products that the digest itself is rendering, rather than claiming a catalogue total it has not traversed. Use the supplied heading setting as the section heading and retain its escape filter. Keep every product title escaped as well.

Each visible product needs a small ordered list of variant labels beneath it. The list is a preview, so give the inner traversal a deliberate visible maximum. A variant list may be absent for a product, and the surrounding product card should still remain valid. Do not introduce another resource lookup just to fill this preview. The exercise assesses whether you can state and enforce a bounded nested-loop contract.

The cards need a presentational alternating treatment. Use Liquid’s loop-oriented alternation mechanism rather than trying to derive availability, category, or another business status from a card’s position. The supplied CSS defines the two modifier classes; apply them from Liquid in a way that remains stable when the digest count changes.

When `collection.products` has no members, render the starter’s empty-state message in place of the card list. The message must be associated with the section heading in a meaningful way. An empty input collection and an individual product that has no variants are different states; do not accidentally handle both with one branch.

## Constraints

| Area | Requirement |
| --- | --- |
| Source | Use `collection.products`; do not introduce `all_products` or a literal-handle collection lookup. |
| Outer traversal | Render no more than four products and give the component an explicit empty branch. |
| Position | Use `forloop` metadata for a human-facing position and a machine-facing zero-based hook. |
| Inner traversal | Render a bounded preview of the current product’s variants; do not loop over an unbounded related source. |
| Alternation | Use a named `cycle` group for the card modifier classes. |
| Markup | Keep product cards in a list, preserve heading hierarchy, and retain the supplied accessible empty state. |
| Scope | Do not add sorting, filtering, pagination, snippets, resource-specific eligibility logic, or JavaScript. |

> [VERIFY] Before adopting an object-specific variant property beyond the supplied title and collection relationship, verify the current Shopify object contract. This exercise needs no inferred inventory or eligibility surface.

## Acceptance criteria

Review rendered states, not just the happy path. A collection with six products must produce exactly four cards. Its first card must have a human-readable position of one and a zero-based data hook of zero. A collection with one product must produce one card and no misleading plural or total claim. A product with more variants than the preview allows must show only the stated preview. A product with no variants must retain its card without an empty list. Finally, an empty collection must render the supplied empty-state content and no empty card-list wrapper.

The complete outer loop should be legible enough that another developer can identify the source, maximum product count, empty behavior, position metadata, and alternating class without tracing several files. The inner loop should be equally legible about its maximum. Avoid `break` where an explicit loop parameter tells the reader the contract more directly.

## Files to work in

```text
course/part-02-the-liquid-language-properly/ch-08-iteration/
├── exercise.md
└── starter/
    ├── assets/section-collection-digest.css
    ├── sections/collection-digest.liquid
    └── snippets/collection-digest-variant-note.liquid
```

The supplied snippet is a deliberately narrow presentational boundary. It receives a text value only and must not be expanded into a second data traversal. Leave its input contract explicit if you use it.

## What to submit

Submit the completed section, stylesheet, and supplied snippet. In your hand-off, state the maximum outer and inner iteration counts, identify the empty state, and name the `forloop` properties you used. Do not submit a prose-only answer.

## Self-review

- [ ] The component uses the contextual `collection.products` source and has an explicit maximum of four cards.
- [ ] The empty collection path replaces the card list rather than leaving an empty wrapper.
- [ ] Position, data hook, and bounded list semantics use appropriate loop metadata and parameters.
- [ ] The nested variant preview and `cycle` treatment are bounded and presentation-only.
- [ ] The three starter files remain usable, and no unverified resource-specific business rule was added.
