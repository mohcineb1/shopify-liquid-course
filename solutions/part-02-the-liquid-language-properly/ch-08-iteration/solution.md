<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-08-solution
title: "Solution — Build a bounded collection digest"
chapter: ch-08
---

# Solution — Build a bounded collection digest

This implementation is a small editorial preview of the **current** collection, rather than a second catalogue grid. Its outer loop has one contextual source, `collection.products`, and a visible maximum of four members. Its inner loop has one related source, the current product’s variants, and a visible maximum of two members. Those are explicit component contracts: a reviewer can calculate the maximum visible work from the tags without tracing control flow through several files.

The section owns collection traversal and the collection-empty state. The stylesheet owns the presentation of alternating card tones. The snippet receives an already selected text value and renders it; it never discovers a product, variant, or collection for itself. That narrow input contract prevents a presentational helper from becoming a hidden data traversal.

## Final file map

```text
solutions/part-02-the-liquid-language-properly/ch-08-iteration/
├── solution.md
└── solution/
    ├── assets/section-collection-digest.css
    ├── sections/collection-digest.liquid
    └── snippets/collection-digest-variant-note.liquid
```

## 1. Select the source and declare the outer boundary

The source is `collection.products`, not `all_products` and not a literal collection handle. On a collection template, the contextual collection is already the page’s data contract. A literal handle would make a preview silently unrelated to the collection the customer is viewing. A global lookup would introduce a dependency that this component does not need.

```liquid
{% for product in collection.products limit: 4 %}
  <!-- one digest card -->
{% else %}
  <!-- collection-empty state -->
{% endfor %}
```

`limit: 4` is preferable to a `break` after the fourth card. The maximum is known before traversal, so the loop parameter communicates it directly. Six products produce four cards; one product produces one card. The loop’s `else` renders only when the input collection is empty, exactly the condition that should replace the whole card list with an empty message.

The count label uses `forloop.length` inside the loop because it describes the digest window, not a catalogue total outside that window. A short singular/plural assignment keeps copy truthful without asserting how many products exist beyond the four visible members.

## 2. Match `forloop` metadata to its consumer

Each card has two positions. `forloop.index` is one-based and is therefore appropriate for the visible “Product 1” label. `forloop.index0` is zero-based and becomes the `data-digest-index` hook for client code or tests that expect zero origin. These values remain correct if the display limit changes, unlike manually maintained arithmetic.

```liquid
<li data-digest-index="{{ forloop.index0 }}">
  <p>Product {{ forloop.index }} of {{ forloop.length }}</p>
  <h3>{{ product.title | escape }}</h3>
</li>
```

The card also receives a named `cycle` result. Naming the group makes the card alternation independent: a later alternating detail inside the card cannot consume positions from the card sequence. `cycle` is presentation-only. It cannot establish availability, product type, or promotional eligibility, because those are data properties rather than positions in a loop.

```liquid
<li class="collection-digest__card collection-digest__card--{% cycle 'digest-card-tone': 'odd', 'even' %}">
```

## 3. Bound the nested variant preview

The inner loop exists because each card genuinely needs a small variant preview. Its `limit: 2` is visible in the tag. Four cards multiplied by two labels gives an upper bound of eight variant notes. That is a defensible ceiling compared with rendering every variant for every visible product and hiding surplus output with CSS.

The ordered list exists only when the product has variants. This condition is not the collection-empty state: a product can have no variants while the outer collection still has products, and its card should remain valid. The two states are deliberately separate.

```liquid
{% if product.variants.size > 0 %}
  <ol class="collection-digest__variants">
    {% for variant in product.variants limit: 2 %}
      <li>{% render 'collection-digest-variant-note', text: variant.title %}</li>
    {% endfor %}
  </ol>
{% endif %}
```

The snippet accepts `text` and escapes it itself. Passing the selected title rather than the full `variant` keeps its API narrow and makes a second traversal in the presentational body unnecessary. `ch-21-snippets-as-apis` develops reusable snippet contracts in depth; here, the narrow contract protects the loop boundary.

> [VERIFY] If production copy needs a variant property other than the supplied `title`, verify that property’s current Shopify object contract before adding it. Do not infer availability or inventory status from loop position.

## 4. Render a real collection-empty state

The `for` tag’s `else` sits where the card list would otherwise be. It outputs a paragraph associated with the heading through `aria-describedby`, with no empty `<ol>` wrapper. This is semantic as well as visual: an empty list says a list exists with no entries; the paragraph explains that the collection currently has no products to preview.

Do not use loop `else` to cover a collection in which every product lacks variants. The outer loop still has members in that case. The optional inner-list condition keeps each product card valid without confusing a missing related preview with an empty source collection.

## 5. Keep unrelated iteration features out

`tablerow` is not suitable here. A digest card is an independent content item, not data defined by a row-and-column intersection; a normal list communicates that relationship. `offset`, `reversed`, `break`, and `continue` are also unnecessary: this component promises the first contextual preview in its supplied order, with known bounds and no product-specific business rule.

The solution deliberately avoids filtering, sorting, pagination, and `all_products`. Each would change either the data contract or the section’s responsibility. Data shaping belongs in `ch-09-liquid-data-shaping`; resource-specific selection rules belong in their resource chapters; render measurement belongs in `ch-11-rendering-performance`.

## 6. Read the markup as an output contract

The section opens the outer ordered list only after the first product exists, then closes it when `forloop.last` is true. That structure avoids an empty list in the collection-empty path while keeping every product card as a direct list item. It also gives the count sentence a precise placement: the count is emitted once, before the list, while `forloop.length` is available for the bounded traversal. This is a valid use of `first` and `last` because they describe structural work tied to the outer loop’s guaranteed cardinality.

The variant preview uses an ordered list because the visible labels are displayed in the product’s supplied variant order. The nested wrapper is emitted only when the current product has at least one variant. It is intentionally not an outer-loop `else`: the absence of a related list should not erase the parent product card. If the design later needs a distinct per-product explanatory message, make that local condition explicit rather than borrowing the collection-empty copy.

The final code has no `parentloop` because the inner variant markup does not need an outer index. That absence is a design choice, not an omission. Reach for `parentloop` only when the inner item needs an outer-loop value for a real output consumer. Adding it merely to demonstrate access makes nested code harder to audit and obscures the useful part of the contract: four product cards, two variant notes per card, and no global catalogue lookup.

## Validation matrix

| Scenario | Expected output |
| --- | --- |
| Six collection products | Four cards, indexed 1–4 for people and 0–3 in data hooks. |
| One collection product | One card; the count label uses singular copy. |
| Product with five variants | The card contains two variant notes at most. |
| Product with no variants | The card remains and contains no empty ordered list. |
| Empty collection | No card-list wrapper; the heading-associated empty message renders. |

## Checklist

- [x] The source is contextual and the outer `limit` is explicit.
- [x] `forloop.index`, `forloop.index0`, and `forloop.length` serve distinct consumers.
- [x] The named cycle group controls only card presentation.
- [x] The nested variant loop has an explicit maximum and optional wrapper.
- [x] The collection-empty branch is distinct from a product with no variants.
- [x] The solution mirror contains a runnable section, stylesheet, and snippet.
