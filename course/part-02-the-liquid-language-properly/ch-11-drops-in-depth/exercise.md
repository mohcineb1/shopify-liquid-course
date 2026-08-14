<!-- STATUS: final -->
---
id: ch-11-exercise
title: "Build a bounded product relation preview"
chapter: ch-11
---

# Exercise — Build a bounded product relation preview

A collection template needs a compact preview that lets customers scan a few current products without turning each card into a broad data dump. The starter provides structure and styling, but it deliberately leaves relationship access, nested bounds, and browser data undefined. Complete it so a reviewer can identify the source Drop, every maximum traversal, and every field exposed to the browser by reading the section.

## The brief

Finish the section, stylesheet, and snippet in `starter/`. Use the contextual `collection.products` source only. Render no more than four product cards. Each card needs the product title and, when a featured image exists, one sized image rendition with product-title alt text. Do not walk the full media list to find the image, and do not introduce `all_products`, a literal handle lookup, filtering, or sorting.

Each card also needs a small preview of its variants. Render at most two variant titles for each product and make that inner bound visible in the loop tag. A product with no variants remains a valid card; it should not render an empty variant-list wrapper. The collection itself may be empty, in which case the starter’s collection-empty message must replace the complete card list.

The preview includes one non-executing JSON data script per card for a future browser enhancement. The payload is public storefront HTML. Serialize only the current product’s `id`, `title`, and `url` with field-level `json`; do not serialize `product | json`, a related collection, variants, media, metafields, cart values, or any guessed private state.

## Constraints

| Area | Requirement |
| --- | --- |
| Outer Drop access | Iterate the contextual `collection.products` with an explicit maximum of four. |
| Direct relationship | Read `product.featured_image` only when rendering the visible image. |
| Nested relationship | Render at most two `product.variants` titles and omit the list when none exist. |
| Empty state | Use the outer loop’s `else` for an empty collection only. |
| JSON boundary | Emit exactly product `id`, `title`, and `url`, each serialized with `json`. |
| Scope | Do not add a broad lookup, nested media traversal, snippets that discover more data, filtering, price logic, or JavaScript. |

> [VERIFY] Before extending this preview with any resource-specific property, verify its current Drop availability, relation cost, and public exposure requirement. The exercise needs no availability, inventory, metafield, or customer data.

## Acceptance criteria

A collection with six products renders exactly four cards. Each card has at most one featured-image representation and two variant labels. A card with no variants remains valid without an empty `<ol>`. An empty collection produces only the supplied empty message. Finally, inspect a rendered data script using a product title with quotation marks: it must parse as JSON and contain exactly three declared keys.

Review the section source as a cost statement. A reviewer must be able to multiply the four outer cards by two inner labels, identify the one direct featured-image relationship, and see that the snippet receives only the current product for its minimal declared payload. No hidden broad relation should be necessary to satisfy the visible output.

## Files to work in

```text
course/part-02-the-liquid-language-properly/ch-11-drops-in-depth/
├── exercise.md
└── starter/
    ├── assets/section-drop-preview.css
    ├── sections/drop-preview.liquid
    └── snippets/drop-preview-data.liquid
```

## Self-review

- [ ] The source, outer limit, inner limit, and collection-empty state are visible in the section.
- [ ] Image and variant relations have a buyer-facing purpose and bounded output.
- [ ] Missing variants do not use the collection-empty branch.
- [ ] JSON is minimal public data, not a convenient Drop dump.
- [ ] The three starter files remain usable in a current theme.
