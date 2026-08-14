<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-11-solution
title: "Solution — Build a bounded product relation preview"
chapter: ch-11
---

# Solution — Build a bounded product relation preview

The preview is built from the contextual `collection.products` Drop, bounded at four cards. Each card has one direct optional image relationship, at most two variant-title reads, and a three-field public JSON payload. The boundaries are visible in the section rather than hidden in a broad snippet or global lookup.

## Implementation decisions

The outer loop uses `limit: 4` and its `else` renders only when the input collection is empty. The inner variant list appears only when variants exist and uses `limit: 2`; it does not change the outer empty state. `product.featured_image` is read only to produce the visible card image. The data snippet accepts the current product and serializes exactly `id`, `title`, and `url` through `json`.

> [VERIFY] Verify any later property addition for Drop availability, relation cost, and whether exposing it in storefront JSON is necessary.

## Cost contract

| Access | Bound |
| --- | --- |
| Contextual products | Four cards maximum |
| Featured image | One optional direct relation per card |
| Variants | Two visible labels per card, eight maximum |
| Browser data | Three declared public fields per card |

The code deliberately excludes broad lookups, all-media traversal, metafields, inventory, and a `product | json` dump. Each exclusion keeps the payload and rendering demand aligned with the visible feature.

## Validation

A collection with six products creates four cards. A product with no image emits its text fallback. A product with no variants keeps its card and emits no empty list. An empty collection emits only the outer message. A title containing quotation marks still results in parseable JSON because every dynamic field uses `json`.

## Checklist

- [x] Contextual Drop source and traversal limits are explicit.
- [x] Related image and variant access are bounded by visible output.
- [x] Collection-empty and variant-absent states remain distinct.
- [x] JSON is an intentional three-field public contract.
- [x] The solution mirror supplies a section, stylesheet, and snippet.

## Why the outer source stays contextual

`collection.products` is already the resource relationship the collection page promises. The solution does not use a literal handle or `all_products`, because those would add a different data source without improving the preview. `limit: 4` is declared on the outer loop, so the maximum number of cards is visible before the loop body is read. The `else` is tied to that same input collection: it means no products were supplied to the collection view, not that some later card-level relationship was absent.

A product card reads only the properties that have a visible purpose. `product.title` supplies its heading. `product.featured_image` supplies the card media if present. `product.variants` supplies no more than two customer-visible labels. The result is a reviewable access shape: four parent Drops, one optional media relation per parent, and no more than eight child variant labels. This is not a claim that every access has identical runtime cost; it is an explicit ceiling that makes a later storefront profile interpretable.

## Keep optional relationships local

An absent featured image and an absent variant list are both card-local states. The image is wrapped in an `if` so the section never emits an empty image element. Variants are wrapped separately, so a product remains a valid card when it has no variants. Neither state triggers the outer loop’s `else`; products still exist in the contextual collection. Keeping the conditions separate prevents an empty relationship from being misrepresented as an empty collection.

The section deliberately does not walk `product.media`, inspect inventory, access metafields, or call a data-hungry nested snippet. Those may be valid requirements in another component, but they would change this preview’s cost and public contract. Add a relation only after naming the buyer-facing output that requires it and adding a visible bound where its cardinality can grow.

## JSON is public output

The rendered script is non-executing data, but it is still part of storefront HTML. The snippet serializes the current product’s `id`, `title`, and `url` individually with `json`. Individual field serialization keeps quotation marks, line breaks, and special characters valid without manual string escaping. It also prevents a convenient `product | json` dump from silently exposing an oversized representation or coupling browser code to properties the feature never declared.

Test the data script with punctuation-heavy product titles and parse the rendered text as JSON. Test a collection with more than four products, a product with more than two variants, and a product without image or variants. These tests validate the Drop interface contract: source, bounds, optional relations, and public payload are all deliberate.

## Implementation checklist

- [x] The outer collection source and four-card maximum are explicit.
- [x] Image output uses only the visible `featured_image` relationship.
- [x] Variant output is locally optional and limited to two members.
- [x] The collection-empty branch is distinct from optional child relations.
- [x] The snippet serializes exactly three public fields using `json`.
- [x] No broad lookup, Drop dump, inventory, cart, customer, or metafield relation was added.

## Validation matrix

| Test state | Expected behavior |
| --- | --- |
| Six products | Four cards at most. |
| Product without image | No image element; card heading remains. |
| Product without variants | No variant list; card remains. |
| Empty collection | Only the collection-empty message renders. |
| Quoted product title | The three-field script remains parseable JSON. |

## Review method

Read the section from the outside in. First identify the contextual source and outer `limit`. Next identify every relation in the card body, whether its use is visible to the buyer, and whether it has a local bound or optional wrapper. Finally, inspect the JSON script as if it were a small public API: its consumer, fields, and serialization rule must all be obvious. This review order catches the common failure mode where a compact Liquid template hides increasing work in a nested relation or a snippet call.

Do not use an optimization claim as a substitute for this contract. The runtime may resolve some values efficiently, but the theme remains easier to maintain when its maximum relationship work is explicit. If later requirements need more data, revise the source, bounds, payload, and page-level measurement together rather than adding one unreviewed property access to every card.

The final implementation therefore favors a small declared surface over a clever implicit one. Its cost is not guessed from markup size: it is read from the bounded source, bounded child loop, optional direct image relation, and minimal serialized fields.
 This makes the section’s relationship demand, public payload, and maintenance boundary explicit to every reviewer.
 It is intentional, bounded, testable, public, and maintainable.
