<!-- STATUS: draft -->
---
id: ch-11
title: "Drops in Depth"
part: 2
words: 2500
---

# Chapter 11 — Drops in Depth

Liquid makes Shopify data look like ordinary objects, but a `product`, `collection`, `cart`, `customer`, or `section` value is usually a **Drop**: a controlled presentation proxy over platform data rather than a JavaScript object you own in memory. That distinction explains why a property can be unavailable in one context, why a related collection can be expensive to traverse, and why `| json` is an API design choice rather than a harmless debugging shortcut.

## What you'll be able to do

- Recognize a Drop as a controlled, contextual data interface.
- Treat relationship access as work that may be deferred until the template asks for it.
- Keep loops and related-property reads bounded and locally comprehensible.
- Separate cheap scalar output from potentially expensive relationship traversal.
- Serialize only declared public browser data, never a convenient broad Drop dump.

## 11.1 What a drop really is under the hood

A Drop is Shopify’s Liquid-facing wrapper around data and behavior the platform decides a theme may access. It exposes a documented property surface, controls how values render, and prevents templates from receiving arbitrary database models, private services, or unrestricted application code. In theme code, the important rule is practical rather than implementation-specific: a Drop is an interface with a context, not a free-form object.

```liquid
<h1>{{ product.title | escape }}</h1>
<p>{{ product.vendor | escape }}</p>
```

`product` is a product Drop in a product context. `title` and `vendor` are documented properties exposed through that interface. You can traverse documented relationships such as `product.variants` or `collection.products`, but you cannot infer that every backend field, relation, or customer attribute becomes Liquid-visible merely because the underlying commerce system might contain it.

This is why `nil`, blank output, and EmptyDrop behavior matter. A missing relationship may render as nothing rather than throw an exception; a Drop available on one template may be absent on another. The object graph from `ch-03-the-shopify-object-graph` tells you where a Drop can be supplied. This chapter tells you why each accessed property should be reviewed as an interface call with a cost and exposure surface.

The abstraction also protects theme authors from implementation coupling. A Liquid property is a documented storefront capability, not a promise about Shopify database tables, GraphQL fields, or a stable serialization layout. Code that asks for `product.title` through the Drop can remain within the supported rendering interface; code designed around guessed backend structure cannot. When you need data a Drop does not expose, revisit the architecture decision instead of attempting to force an undocumented traversal through template code.

> [VERIFY] Verify the exact availability and property contract of any resource Drop in the relevant Shopify object reference before relying on a value outside the current template’s established context.

## 11.2 Lazy evaluation: accessing a property can trigger a query

A Drop can defer work until the template asks for a property or relation. This lazy evaluation lets Shopify avoid materializing every related value for every request, but it means that code which looks like a harmless dot access can create additional platform work. A scalar property such as a current product title is often already close to the render context. A related collection, media list, metafield, or nested object can involve resolution work when you traverse it.

```liquid
{% for product in collection.products limit: 4 %}
  <h2>{{ product.title | escape }}</h2>
{% endfor %}
```

The loop is legible: it renders a bounded set from the page’s contextual collection. Compare it with a component that, inside each product card, reaches into variants, media, collection membership, metafields, and snippets that reach further relationships. The rendered HTML may still be small, while the chain of property access has become difficult to estimate.

Lazy evaluation is not a reason to avoid all relationships. It is a reason to make them purposeful. Read a relationship access as a request: *what does this component need from this Drop, how many parent items can trigger it, and is the result visible to the buyer?* If the answer is “only one label,” select and bound the smallest relationship that produces it.

Cache-like assumptions are particularly risky in template review. Reading the same property twice may be optimized by the runtime, but a theme author should not depend on an undocumented memoization behavior to justify repeated traversal. Assign a small scalar or prepared collection when it improves clarity, pass it as an explicit snippet input when appropriate, and profile the real storefront template. The goal is not to outsmart Shopify’s runtime; it is to make the data demand legible and bounded.

```liquid
{% if product.featured_image %}
  {{ product.featured_image | image_url: width: 320 | image_tag: alt: product.title }}
{% endif %}
```

This has a clear visible purpose. In contrast, walking `product.media` just to discover whether a featured image exists would create a larger relationship contract than the component needs.

> [VERIFY] Shopify does not publish a universal per-property query-cost table for every theme Drop. Treat a relationship or nested resource traversal as potentially more expensive than a scalar read, then profile representative storefront pages when cost matters.

## 11.3 Which property accesses are cheap and which are expensive

“Cheap” is not a permanent promise attached to a property name. It is a review label based on context, cardinality, nested traversal, filter work, and the number of times an access repeats. A property already supplied by the current Drop and rendered once is generally lower-risk than a relationship whose members trigger further property reads inside an unbounded loop.

| Access shape | Typical review label | Why |
| --- | --- | --- |
| `product.title` rendered once | Lower-risk scalar | A single display property of the current contextual Drop. |
| `product.featured_image` for one visible card | Bounded relationship | A direct purpose with one visible media request. |
| `collection.products` with `limit` | Bounded collection | Maximum rendered members are evident in the tag. |
| `product.variants` inside every collection card | Multiply reviewed | Parent and child cardinalities combine. |
| Broad lookup or repeated relation in snippets | Higher-risk | Source, repetition, and hidden work are hard to audit. |

The labels are not a substitute for measurement. They make code review honest before measurement is available. Count the maximum visible parent members, then the maximum child members, then the render boundaries inside the body. Four product cards with two variants each have an obvious ceiling of eight child iterations. Four product cards that each render a snippet which walks all media and all variants do not.

Visible output is not the only signal. A component with four visible cards may still be expensive when each card derives several unrelated relations, serializes large data to JSON, or performs repeated transformations of the same collection. Conversely, one deliberate image relationship per bounded card can be exactly the correct cost for the buyer experience. Review access shape and purpose together; do not optimize away data a component genuinely needs merely because the relation looks more complex than a scalar.

```liquid
{% for product in collection.products limit: 4 %}
  {% for variant in product.variants limit: 2 %}
    <span>{{ variant.title | escape }}</span>
  {% endfor %}
{% endfor %}
```

This is not inherently wrong. It documents an upper bound and a buyer-facing purpose. Put resource-specific surfaces in the chapters that own them and use `ch-08-iteration` for loop mechanics, but retain the cost review whenever relationships nest.

## 11.4 Iterating drops safely

Safe iteration starts with the right source, an explicit bound, a member-level purpose, and an empty state. A Drop collection is not an invitation to render every relationship because it is exposed. Use contextual collections first, use `limit` for a known display maximum, and treat `forloop` metadata as a description of the bounded rendering window rather than a global resource count.

```liquid
{% for product in collection.products limit: 6 %}
  <article>
    <h2>{{ product.title | escape }}</h2>
  </article>
{% else %}
  <p>No products are available in this collection.</p>
{% endfor %}
```

The `else` represents an empty input collection. It does not mean every product’s nested relationship was empty or that a later `continue` removed all visible members. Keep those states separate. If you need to skip members based on a resource-specific rule, decide whether the buyer needs a distinct post-filter empty state and establish it deliberately rather than relying on loop `else`.

Avoid hidden repeated traversal. A snippet called from a loop should receive the small values it needs, or its contract should state which current Drop relationship it reads. `render` isolation from `ch-06-variables-scope` helps make inputs explicit, but isolation does not make an expensive Drop traversal free. Review the snippet body with the same parent-times-child cost question.

A practical review pass is to write the maximum work in a comment or feature note before implementation: *six products, one featured image each, two variants per card, one small JSON payload*. Then compare the final code with that promise. If an added snippet starts traversing all media or serializing an entire product, the difference becomes visible immediately. This is not a performance benchmark; it is a way to stop unbounded data demand from hiding behind compact Liquid syntax.

A useful safe-iteration checklist is: source is contextual; outer and inner limits are visible; markup has an empty state; nested data is needed by the buyer; and the same relationship is not re-read by several sibling components. If filtering, grouping, or sorting is necessary, make the transformed collection explicit as taught in `ch-09-filters-the-core-set` rather than burying it in template nesting.

## 11.5 Serialising drops with `| json` for the browser — and what leaks

`json` serializes a Liquid value into JSON text. Used inside a non-executing `<script type="application/json">`, it creates a browser-data boundary. It does not grant a browser new server permissions, but it **does** make the serialized representation available to anyone who can view the storefront response. Treat it as an intentionally public payload.

```liquid
<script type="application/json" data-product-card>
  {
    "title": {{ product.title | json }},
    "url": {{ product.url | json }}
  }
</script>
```

This is preferable to manual dynamic quoting because each field is serialized correctly. It also demonstrates payload minimization: the browser feature receives two declared fields, not a broad `product | json` dump. Large or broad serialized Drops can leak information that was not needed for the interaction, expose merchant-facing metadata or internal taxonomy, increase HTML weight, and couple client code to an accidental server representation.

**Wrong — broad serialization because it is convenient:**

```liquid
<script type="application/json" data-product>
  {{ product | json }}
</script>
```

**Right — declare the public contract:**

```liquid
<script type="application/json" data-product>
  { "id": {{ product.id | json }}, "available": {{ product.available | json }} }
</script>
```

The right version is not a universal payload. It is a pattern: name the consumer, list the fields it needs, serialize each dynamic field with `json`, and review whether every field belongs in public response HTML. Never use `inspect` as data format, and never assume a JSON script is private just because it does not execute.

Payload size is also a rendering cost. A broad Drop dump can add HTML weight to every page view even when the browser feature reads only one field. It can make cache behavior and client coupling harder to reason about, particularly if a later theme change alters object representation. A narrow handoff is easier to audit, easier to test, and easier to remove when the interaction changes. In this course, JSON becomes useful only after the client-side consumer has a stated contract.

Test the contract with awkward values. A product title containing quotation marks, an ampersand, and a line break should still produce parseable JSON when each dynamic field uses `json`. A test product with many variants should still respect the visible traversal limit. A product with missing related values should choose its explicit fallback or omit its optional wrapper without causing surrounding markup to collapse. These are interface tests for the Drop boundary, not merely snapshot tests for attractive HTML.

> [VERIFY] Before serializing a Drop or relation in production, verify the exact fields the JSON filter emits for that object and review the payload in rendered storefront HTML. Treat customer, cart, order, metafield, and merchant-maintained data as sensitive to exposure even when a template can access a related value.

## Gotchas

- **Thinking a Drop is a local JavaScript object.** It is a controlled Shopify interface with contextual availability.
- **Treating dot access as free.** Relationship and nested accesses can add deferred work and multiply in loops.
- **Using `forloop.length` as a catalogue total.** It describes the current bounded traversal.
- **Calling a relationship-heavy snippet inside an unbounded loop.** Isolation does not remove parent-times-child cost.
- **Using loop `else` for a post-filter empty state.** It handles an empty input collection only.
- **Dumping `product | json` for convenience.** A JSON script is public response data and creates a coupling and exposure surface.

## Checklist

- [ ] I can name the owning Drop, current context, and visible reason for every relationship access.
- [ ] I label nested or repeated access as a potential cost, then bound and profile it when appropriate.
- [ ] My loops identify source, maximum output, empty state, and nested relationship ceiling.
- [ ] Browser data uses a minimal declared JSON payload, not a broad Drop dump.
- [ ] I review serialized output as public storefront content before shipping.

## Related

- `ch-03-the-shopify-object-graph` — where Drops are available and how relationships are traversed.
- `ch-08-iteration` — loop parameters, metadata, and nested cost curves.
- `ch-09-filters-the-core-set` — shaping arrays and serializing data intentionally.
- `ch-21-snippets-as-apis` — explicit reusable component inputs.
- `ch-37-javascript-in-themes` — consuming JSON in browser code.

[1]: https://shopify.dev/docs/api/liquid/objects "Shopify Liquid objects"
