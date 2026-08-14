<!-- STATUS: draft -->
---
id: ch-08
title: "Iteration"
part: 2
words: 2500
---

# Chapter 8 — Iteration

A Liquid loop is not free just because it looks like a small `for` block. It may traverse a collection Shopify has already placed in context, walk relationships from each item, repeatedly render an expensive fragment, or hide an empty state because the template never states what happens when there is nothing to render. The senior-level loop decision is therefore not “how do I repeat markup?” It is “what collection is already appropriate, how much of it does the buyer need, and what does this component promise when the collection is empty?”

## What you'll be able to do

- Bound and order a `for` loop with its supported parameters.
- Use `forloop` metadata for position, total length, and nested-loop context.
- Stop, skip, or handle an empty loop without confusing those behaviors.
- Alternate output with `cycle` and recognize when a table is the actual requirement.
- Estimate the cost of nested loops and avoid broad expensive sources.

## 8.1 `for` and its parameters: `limit`, `offset`, `reversed`, `range`

A `for` loop renders once for each member of a collection or a numeric range. Start from a collection that belongs to the current context. On a product page, `product.variants` is an appropriate relationship when the feature genuinely needs variant data. On a collection page, `collection.products` is an appropriate collection. Do not begin with a global lookup merely because it is familiar.

```liquid
<!-- sections/product-variants.liquid — product template -->
<ul role="list">
  {% for variant in product.variants limit: 3 %}
    <li>{{ variant.title | escape }}</li>
  {% endfor %}
</ul>
```

`limit` caps the number of members rendered. It is a presentation boundary and a performance boundary: a preview that needs three variants should not render every variant and hide the rest with CSS. `offset` skips a number of leading members. Together, they can create sequential windows when that is truly the intended server-rendered view.

```liquid
<!-- sections/product-variants.liquid — product template -->
<ul role="list">
  {% for variant in product.variants limit: 3 offset: 3 %}
    <li>{{ variant.title | escape }}</li>
  {% endfor %}
</ul>
```

`reversed` changes traversal order without forcing you to manufacture a second collection. Use it only when reverse ordering is the business requirement, such as showing the latest supplied collection members first. It does not replace deliberate sort rules, which belong with data shaping in `ch-09-liquid-data-shaping`.

```liquid
<!-- sections/product-variants.liquid — product template -->
{% for variant in product.variants reversed %}
  <p>{{ variant.title | escape }}</p>
{% endfor %}
```

A range iterates integers rather than object members. It is useful for a fixed, visible count or for pairing an existing ordered structure with a numeric position. Do not create a range merely to simulate a resource collection you have not loaded.

A loop parameter is part of the component contract, so review it with the same care as a section setting. `limit: 4` tells a merchant and a reviewer that this component promises four visible members at most. An unexplained `limit: 4` after a broad lookup is less useful: it hides whether the source was already curated or whether the component is discarding work. State the source and the maximum output together in code and in the feature brief.

```liquid
<!-- sections/product-variants.liquid -->
{% for step in (1..3) %}
  <span class="product-variants__step">Step {{ step }}</span>
{% endfor %}
```

## 8.2 The `forloop` object in full: `index`, `index0`, `rindex`, `first`, `last`, `length`, `parentloop`

Inside a loop, Liquid supplies `forloop`, an object describing the current traversal. `index` is one-based; `index0` is zero-based. `rindex` counts from the end starting at one; `rindex0` counts from the end starting at zero. `first` and `last` are booleans. `length` is the loop’s total member count after the loop’s configured collection boundary. These are safer than recreating positional arithmetic in markup.

```liquid
<!-- sections/product-variants.liquid -->
{% for variant in product.variants limit: 3 %}
  <article data-position="{{ forloop.index0 }}">
    {% if forloop.first %}<p>First visible option</p>{% endif %}
    <h3>{{ forloop.index }}. {{ variant.title | escape }}</h3>
    {% if forloop.last %}<p>{{ forloop.length }} visible options</p>{% endif %}
  </article>
{% endfor %}
```

Use the index that matches the consumer. A human label normally needs `index`; a zero-based data attribute normally needs `index0`. `rindex` is useful when copy refers to remaining positions, but it should not be used to fake pagination or a resource count outside the loop’s actual bounded set.

`forloop.length` also describes the loop that actually runs, not an abstract catalog total. With a bounded loop, use it for statements such as “3 visible options,” not “3 variants exist” unless the loop’s source and parameters genuinely cover every variant. This keeps UI copy from accidentally turning a display window into a product-data claim.

Nested loops expose `parentloop` from the inner loop. This is valuable when inner markup genuinely needs an outer position, such as a variant position inside a product card. Name the loop members clearly so a parent index is not the only clue to which collection is being traversed.

```liquid
<!-- sections/collection-grid.liquid — collection template -->
{% for product in collection.products limit: 4 %}
  {% for variant in product.variants limit: 1 %}
    <p>Product {{ forloop.parentloop.index }}, variant {{ forloop.index }}</p>
  {% endfor %}
{% endfor %}
```

## 8.3 `break`, `continue`, `else`

`break` stops the current loop immediately. `continue` skips the remaining work for the current member and moves to the next member. Neither is a substitute for selecting the right collection in the first place. Use them when a loop has a clear, local early-exit or skip rule that preserves the reader’s ability to predict output.

```liquid
<!-- sections/product-variants.liquid -->
{% for variant in product.variants %}
  {% unless variant.available %}
    {% continue %}
  {% endunless %}
  <p>{{ variant.title | escape }}</p>
  {% if forloop.index == 3 %}{% break %}{% endif %}
{% else %}
  <p>No variants are available.</p>
{% endfor %}
```

The `else` belongs to the `for` tag and renders when the collection has no members. It is the explicit empty-state contract. It does not render merely because `continue` skipped every item: those members still existed in the collection. If the buyer needs a message when no member passes a filter-like condition, establish that condition or result deliberately rather than assuming loop `else` will cover it.

A `break` based on `forloop.index` is often a signal that `limit` would express the intent more directly. Prefer `limit` for a known display count; reserve `break` for a condition discovered during traversal that cannot be declared in the loop parameters.

If `continue` removes members based on a business rule, inspect the resulting empty experience separately. The source collection may be non-empty while the visible output is empty. A component that promises “available variants” must either select available variants before the loop or establish a deliberate flag or count for its post-filter state. Do not let a bare container stand in for an empty-state contract.

## 8.4 `cycle` for alternating output

`cycle` alternates through a declared list each time it is called within a loop. Its legitimate use is presentational repetition: alternating a row class, a visual rhythm token, or another stable pattern tied to display position.

```liquid
<!-- sections/collection-grid.liquid — collection template -->
{% for product in collection.products limit: 6 %}
  <article class="collection-grid__card collection-grid__card--{% cycle 'odd', 'even' %}">
    <h3>{{ product.title | escape }}</h3>
  </article>
{% endfor %}
```

Use a named cycle group when two independent alternations appear in the same loop. Without a group, calls share their sequence and can interfere with one another as the markup changes.

```liquid
<!-- sections/collection-grid.liquid -->
{% for product in collection.products limit: 6 %}
  <article class="card--{% cycle 'card-tone': 'odd', 'even' %}">
    <span class="badge--{% cycle 'badge-tone': 'light', 'dark' %}">New</span>
  </article>
{% endfor %}
```

Do not use `cycle` to assign business status. Availability, inventory, and campaign eligibility belong to explicit conditions. A positional alternation is not a data model.

## 8.5 `tablerow` and its legitimate uses

`tablerow` emits table rows and cells around loop output. It exists for an actual data table: a comparison matrix, a size chart, or an administrative tabular view where row and column relationships are semantic. It is not a grid-layout shortcut for product cards; use normal list or section markup with CSS for that.

```liquid
<!-- sections/size-chart.liquid -->
<table>
  <tbody>
    {% tablerow size in product.options_with_values cols: 2 %}
      {{ size.name | escape }}
    {% endtablerow %}
  </tbody>
</table>
```

The tag gives its own loop metadata through `tablerowloop`. Before using it, confirm that the repeated content is truly tabular and that the generated cell structure matches the required accessible table semantics. A responsive card layout presented through table markup makes both the source and assistive-technology experience worse.

The legitimate question is whether each cell has meaning only at its row-and-column intersection. A product card does not: it is an independent content unit with its own heading, price, and action. A size comparison can: the reader needs to relate one measurement to a label in its row or column. Start with the semantic relationship, then choose `tablerow`; never start with a desired visual grid.

> [VERIFY] Verify `tablerow` output structure and metadata against Shopify’s tag reference before using it for a production table with headers, scopes, or custom cell requirements.

## 8.6 Nested loops and the cost curve

A nested loop multiplies work. Four products with five variants each create up to twenty inner iterations before filters, snippets, images, and property traversal add their own costs. This does not make nested loops forbidden; it makes their bounds and output purpose part of the review.

```liquid
<!-- sections/collection-grid.liquid — collection template -->
{% for product in collection.products limit: 4 %}
  <article>
    <h3>{{ product.title | escape }}</h3>
    {% for variant in product.variants limit: 2 %}
      <p>{{ variant.title | escape }}</p>
    {% endfor %}
  </article>
{% endfor %}
```

The visible maximum is eight variant lines, not “all variants for each product.” That gives a reviewer a concrete cost ceiling. Add another loop only when the buyer needs the combination, not because all related data is technically reachable. If a component needs filtering, sorting, grouping, or cross-collection preparation, move the data-shaping work to `ch-09-liquid-data-shaping` rather than building a dense loop nest.

Count render boundaries as well as iteration bodies. Rendering a snippet inside an inner loop, accessing nested media, or performing repeated lookup-like work can make two loops materially heavier than the count alone suggests. The remedy is usually to reduce the source, cap visible children, or move a summary decision outside the inner loop—not to make the markup more compact.

## 8.7 Iterating over `all_products`, collections, and other expensive sources

Prefer contextual collections and explicit section settings over broad lookups. `collection.products` expresses the collection page’s current resource. A merchant-selected collection expresses a component contract. Repeated `all_products` access, broad collection traversal, and nested related-resource loops should trigger a cost review before they become a template pattern.

> [VERIFY] Confirm the current Shopify limits and lookup behavior for `all_products` from the official object reference before depending on a count, dynamic handle pattern, or repeated lookup in production. Treat it as an explicit lookup tool, not a catalogue-wide iterator.

The practical question is not “can Liquid reach this collection?” but “does the buyer need this many members in this response?” Use `limit`, select a smaller source, and render only the properties the component needs. A section showing four curated products should accept a curated collection or explicit products rather than scan an unrelated large collection and discard most of it in the loop.

This distinction changes the maintenance story. A contextual source evolves with the page the customer is viewing. A merchant-selected source makes a configurable module’s dependency visible in the editor. A literal handle lookup couples the template to a named catalogue resource and should be reserved for the exceptional case where that coupling is the actual product requirement. When content needs a different resource or an explicit API-shaped contract, the appropriate design may be a setting or a separate section, not another loop.

Pagination is also a source-and-boundary decision, not a cosmetic use of `offset`. A page that promises navigation through a large customer-facing collection needs a deliberate pagination design and its associated context; it should not approximate page navigation by repeatedly skipping members in several independent modules. Keep the loop’s job narrow: render the appropriate current window. Related resource architecture, collection navigation, and their customer-facing performance consequences are developed further in `ch-11-rendering-performance`.

When reviewing an expensive source, trace the whole body rather than only the tag line. Does each iteration traverse variants, media, metafields, or nested collections? Does it call a snippet whose contract is larger than the visible card needs? Does the component repeat the same lookup in several loops? The best improvement is frequently structural: put data in the right contextual source once, establish a small visible maximum, and make the simple loop responsible only for output. That keeps Liquid readable as well as bounded.

## Gotchas

- **Using a loop `else` after `continue` skips every member.** `else` means the input collection was empty, not that no member passed later conditions.
- **Using `break` for a fixed display count.** Prefer `limit` when the bound is known before traversal.
- **Confusing `index` and `index0`.** Human labels and zero-based data attributes need different positions.
- **Using `cycle` for business state.** It alternates presentation; it does not describe data.
- **Nesting unbounded loops.** The iteration count multiplies before each body’s own work begins.
- **Treating `all_products` as a catalogue iterator.** Verify the current lookup contract and use contextual sources first.

## Checklist

- [ ] I can state the source, maximum visible members, and empty state of every loop.
- [ ] I choose `forloop` properties that match the consumer’s indexing convention.
- [ ] I use `limit` and contextual sources before relying on `break` or broad traversal.
- [ ] I make nested-loop bounds visible in code and review their multiplied output.
- [ ] I reserve table markup and `tablerow` for genuinely tabular data.

## Related

- `ch-07-control-flow` — conditions that decide whether a member is rendered.
- `ch-09-liquid-data-shaping` — filtering, sorting, grouping, and prepared collections.
- `ch-11-rendering-performance` — render cost and production profiling.
- `ch-21-snippets-as-apis` — reusable output boundaries inside iterated components.

[1]: https://shopify.dev/docs/api/liquid/tags/for "Shopify Liquid for tag"
