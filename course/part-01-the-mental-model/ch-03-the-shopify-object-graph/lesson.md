<!-- STATUS: draft -->
---
id: ch-03
title: "The Shopify Object Graph"
part: 1
words: 1947
---

# Chapter 3 — The Shopify Object Graph

Liquid failures that look like missing syntax are usually missing context. A developer sees an object in one template, assumes it is ordinary application data, then tries to read it from a different template, a snippet, or an asset. Shopify has not handed Liquid a database connection or a generic JSON payload. It has handed the current theme render a documented graph of objects. You need to know what arrives with the request, what is reachable from it, and where a traversal becomes expensive.

## What you'll be able to do

- Separate data Shopify has already supplied to a theme render from data that belongs behind another runtime boundary.
- Predict whether an object is global, template-scoped, or scoped to a local rendering unit.
- Treat a Drop as a lazy Shopify proxy rather than as a plain JavaScript object.
- Sketch the day-to-day paths from a page context to products, collections, cart items, settings, and local section data.

## 3.1 The data you are handed vs the data you must request

A **theme render** begins with a render context. Shopify chooses the route, template, and resource, then makes the objects documented for that context available to Liquid. A product template can receive `product`; a cart template can receive `cart`; a collection template can receive `collection`. Liquid reads and formats that supplied data while Shopify produces HTML.

That is different from an application server that starts with credentials and decides which database query to run. A theme has no arbitrary fetch, ORM, GraphQL client, or `await`. The fact that you can write `{{ product.title }}` does not imply that Liquid can ask Shopify for any product, customer, order, or external service on demand. The object exists because the current render makes it available.

```liquid
<!-- sections/product-summary.liquid — use in a product template -->
<h1>{{ product.title | escape }}</h1>
<p>{{ product.price | money }}</p>
```

On a product template, this is the normal path: the template context supplies `product`, and Liquid traverses properties already documented on that object. It is not a request you authored from the section.

The wrong instinct is to treat Liquid output as a data-fetching expression.

```liquid
<!-- Wrong: Liquid cannot call an arbitrary storefront endpoint -->
<p>{{ fetch('/products/trail-pack').title }}</p>
```

There is no `fetch` function in Liquid. If a requirement needs data that is not part of the render context, decide which runtime owns it. A buyer-side interaction may require browser JavaScript and a documented HTTP surface. A custom storefront may require the Storefront API in a headless application. A theme request cannot become a general backend merely because it contains commerce objects.

The right first question is not “how do I query this?” It is “is this object documented here?” The Liquid reference describes an object’s access class: global, template-specific, or returned by another object.[1] Use that information before building a conditional around a value that may be `blank` because the context can never provide it.

Some paths are handed indirectly. A cart render supplies `cart`, and cart exposes its line items; a collection render supplies `collection`, and the collection exposes products for the current page. This is **traversal access**: reading an associated object or collection from the current object rather than inventing a new query. It is powerful, but it is still bounded by the object graph Shopify documents.

## 3.2 Global objects, template-scoped objects, and scoped objects

Classify an object before you use it. The classification tells you where an example can run, where a snippet can reasonably expect it, and what a refactor might accidentally remove.

| Access class | What it means | Representative examples | Design implication |
|---|---|---|---|
| **Global object** | Shopify makes it available broadly across theme Liquid files. | `shop`, `request`, `settings` | Useful for store-wide and request-wide presentation, but still subject to each object’s documentation. |
| **Template-scoped object** | Shopify supplies it only for a matching page or resource context. | `product`, `collection`, `cart`, `article` | Guard the context; do not copy the code blindly into another template. |
| **Scoped object** | A parent rendering unit provides it locally. | `section`, `block`, loop item values | It exists because the enclosing section, block, or tag created that local scope. |

A global object is not “all Shopify data.” `shop` describes the current shop; `request` describes the current request; `settings` exposes theme settings. They are global in the access sense, not a universal gateway. The properties and values available still follow the documented object contract.[1]

A template-scoped object has stronger meaning. `product` is meaningful in a product-template render because Shopify knows which product the buyer is viewing. A generic snippet rendered somewhere else might still be able to access a contextual object that the caller can access, but you should not make that hidden context its API. Shopify documents that snippets cannot directly access variables created outside the snippet, while documented global or contextual objects can remain available.[2] Pass the specific input a reusable snippet needs.

```liquid
<!-- sections/product-summary.liquid — use in a product template -->
{% render 'product-price', product: product %}
```

```liquid
<!-- snippets/product-price.liquid -->
<p class="product-price">{{ product.price | money }}</p>
```

The named parameter says that this snippet renders a product price. It is safer than coupling the file to whatever template happened to render it first.

Scoped objects are easy to overlook because their names are ordinary. In a section, `section` represents that section instance and its settings. In a loop, the loop variable represents one current item. In block-rendering code, `block` represents the current block. Those values do not travel as global state. When you move markup out of its parent, preserve the required input explicitly or keep it in the scope where Shopify provides it. Detailed section and block contracts belong in `ch-17-sections-as-editor-contracts` and `ch-18-blocks-the-three-kinds`.

## 3.3 Drops: lazy proxies, not plain objects — and why that matters for performance

A **Drop** is Shopify’s lazy proxy representation of data in Liquid. It resembles an object because you use dot notation, but it is not a plain JavaScript record already materialized in memory. Reading a property, following a relationship, or iterating a collection can require Shopify to resolve more data for the render. The exact cost depends on the object and access path, so do not invent latency numbers; treat each traversal as a deliberate operation.

```liquid
<!-- sections/product-summary.liquid — use in a product template -->
{% assign featured_variant = product.selected_or_first_available_variant %}
<p>{{ featured_variant.price | money }}</p>
```

This is readable because the code names the relationship once, then reads the needed property. The goal is not to fear every dot. The goal is to avoid writing as if a rich Shopify object were a free, local JSON blob that can be walked repeatedly without consequence.

The costly pattern is often accidental repetition across markup.

```liquid
<!-- Less clear: repeats the same relationship traversal -->
<p>{{ product.selected_or_first_available_variant.price | money }}</p>
<p>{{ product.selected_or_first_available_variant.compare_at_price | money }}</p>
```

```liquid
<!-- Better: name the traversal once for this render -->
{% assign featured_variant = product.selected_or_first_available_variant %}
<p>{{ featured_variant.price | money }}</p>
<p>{{ featured_variant.compare_at_price | money }}</p>
```

The improvement is partly an authoring benefit: the chosen variant has a name and one source. It also makes you inspect the relationship you are traversing. If a value is needed only conditionally, put the traversal behind the condition. If a loop only needs a title and URL, do not follow additional relationships merely because a product Drop exposes them.

This is where people get burned: they serialize or dump huge object trees, build nested loops over relationships they do not display, then blame Liquid for being slow. A Drop lets Shopify defer work until you ask for it. Your template determines how often and how widely it asks. `ch-09-liquid-data-shaping` covers transformation and repetition patterns; `ch-11-performance-and-render-cost` will return to cost with measurements and larger-page strategy.

Do not confuse a Drop with a promise. Liquid does not expose an asynchronous handle you can schedule, cache in browser state, or await. “Lazy” describes Shopify’s server-side object resolution, not an API you control in the template.

## 3.4 A visual map of the graph you will use daily

The useful graph starts at the request context, not at a catalog table. The route and template establish the resource context; global objects describe the shop and request; local scopes describe the current section, block, or iteration. From those roots, follow only the relationships the current markup needs.

```text
Current storefront request
├── global objects
│   ├── shop
│   ├── request
│   └── settings
├── template-scoped object (depends on the template)
│   ├── product → selected_or_first_available_variant → price
│   ├── collection → products → product
│   ├── cart → items → line item → product / variant
│   └── article → author / image
└── local rendering scope
    ├── section → settings / blocks
    ├── block → settings
    └── loop item → its documented properties
```

Read the map from top to bottom when debugging. First identify the template and current resource. Next identify the object Shopify supplies for it. Then locate the relationship that produces the value you need. Finally identify whether a reusable snippet needs an explicit named input. That sequence prevents the two common mistakes: guessing that a contextual object is global, and turning a missing context into increasingly complex Liquid.

For example, cart presentation often begins at `cart`, then follows `cart.items` to a line item, then follows the line item’s product or variant relationship only if the markup needs it. A product page begins at `product`; a section inside it still has section settings, but those settings are not product properties. Store-wide configuration belongs under `settings`; it does not belong on every product object. The graph is a responsibility map as much as a data map.

The map also tells you when to stop. If the needed value is not reachable from the documented root, Liquid is not the place to fabricate a query. Return to the runtime-boundary decision in `ch-01-where-liquid-actually-sits`, then choose the surface that can lawfully obtain the data.

## Gotchas

- **Treating object access as a query language.** Liquid reads the documented render context; it does not expose arbitrary fetching.
- **Assuming `product` exists everywhere.** It is template-scoped, so validate the template and render context first.
- **Using hidden contextual dependencies in snippets.** Prefer named parameters for reusable snippet inputs.
- **Treating Drops as local JSON.** Repeated traversal and broad iteration can add avoidable render work.
- **Confusing a section setting with a product property.** They have different roots in the graph and different owners.

## Checklist

- [ ] I can identify the root object supplied by a product, cart, and collection template.
- [ ] I can distinguish a global object from a template-scoped or locally scoped object.
- [ ] I know that a Drop is a lazy proxy and can name a traversal I should avoid repeating.
- [ ] I can decide whether a snippet should receive a value explicitly rather than assume caller context.
- [ ] I stop and choose another runtime when the required data is not in the documented graph.

## Related

- `ch-01-where-liquid-actually-sits` — why a theme render cannot become an arbitrary data client.
- `ch-02-translating-what-you-already-know` — why explicit inputs beat assumed component context.
- `ch-09-liquid-data-shaping` — transforms and iteration choices after you have the correct object.
- `ch-11-performance-and-render-cost` — measuring and managing render cost.
- `app-c-complete-object-reference` — the current object-by-object access reference.

[1]: https://shopify.dev/docs/api/liquid "Shopify Liquid reference"
[2]: https://shopify.dev/docs/api/liquid/tags/render "Shopify Liquid render tag"
