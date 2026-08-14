<!-- STATUS: draft -->
---
id: ch-06
title: "Variables & Scope"
part: 2
words: 2506
---

# Chapter 6 — Variables & Scope

A Liquid variable is not application state. It does not persist after the render, it does not become a shared service, and it does not cross every file boundary because you gave it a familiar name. It is a value in a particular render scope. Most hard-to-explain theme bugs around “missing” values come from importing the global-variable habit of browser JavaScript into an isolated server-rendered template system. This chapter gives you the boundaries before you build abstractions on top of them.

## What you'll be able to do

- Choose `assign` or `capture` based on whether you need a value or rendered text.
- Use `increment` and `decrement` without confusing their counters with assigned values.
- Map a variable to its template, section, block, snippet, or loop boundary.
- Pass explicit inputs through `render` instead of depending on hidden parent state.
- Avoid accidental reassignment and shadowing in a growing theme.

## 6.1 `assign` and `capture` — value vs rendered-string semantics

`assign` gives a name to the result of a Liquid expression. Use it when the thing you need is already a value: a setting, a property, a filter result, a boolean, or a computed number. It does not render HTML and then turn that markup back into a useful object. It preserves the expression’s practical role for later tags and filters.

```liquid
<!-- sections/product-summary.liquid — product template -->
{% assign product_title = product.title %}
{% assign sale_price = product.price | money %}

<h2>{{ product_title | escape }}</h2>
<p>{{ sale_price }}</p>
```

The names make the later output easier to read, but they are not permanent fields on `product`. `sale_price` is now formatted display text; use the underlying price value, not the formatted label, if later code needs arithmetic. Chapter 5’s type discipline applies even after a value has a helpful local name.

`capture` is different. It renders everything between its opening and closing tags into a string. That is useful when the output itself is the intended value: a small HTML fragment, a constructed URL string, or text that must be assembled from multiple rendered pieces. It also means capture preserves output details such as whitespace unless you deliberately control them.

```liquid
<!-- sections/product-summary.liquid — product template -->
{% capture product_heading %}
  <span class="product-summary__eyebrow">Featured</span>
  {{ product.title | escape }}
{% endcapture %}

<h2 class="product-summary__title">{{ product_heading }}</h2>
```

Here `product_heading` is rendered string content, not a product object and not a safe general-purpose data structure. A captured fragment can be appropriate when one markup boundary has a reason to exist. It is not a substitute for a snippet simply because a file is getting long; component boundaries are addressed in `ch-21-snippets-as-apis`.

```liquid
<!-- Wrong: capture when the next operation needs a number -->
{% capture next_count %}{{ cart.item_count | plus: 1 }}{% endcapture %}

<!-- Right: assign the arithmetic value before rendering it -->
{% assign next_count = cart.item_count | plus: 1 %}
<p>After one item: {{ next_count }}</p>
```

The wrong form may appear to work when printed, but it turns a calculation into rendered text before the theme has finished working with it. Choose `assign` for data flow; choose `capture` for deliberate rendered-string construction.

There is a second maintenance consequence. A capture can hide HTML construction in the middle of what looks like a value-preparation block. That makes escaping ownership hard to inspect: was the title escaped before capture, will it be escaped after capture, or is the captured value deliberately markup? Keep the answer explicit in the variable name and at the output boundary. A name such as `product_heading_html` signals captured markup; `product_title` should remain the source text until the element that renders it. The discipline is less about aesthetics than preventing a second contributor from escaping a string twice or treating markup as resource data.

## 6.2 `increment` / `decrement` and their separate namespace

`increment` and `decrement` manage named counters. They are not assignments, and their names live in a counter namespace separate from values named through `assign` or `capture`. An `assign` called `card_index` does not initialise the `{% increment card_index %}` counter, and a counter does not make `{{ card_index }}` output its current number.

```liquid
<!-- sections/product-summary.liquid -->
{% assign card_index = 10 %}

<p>Assigned value: {{ card_index }}</p>
<p>Counter value: {% increment card_index %}</p>
<p>Next counter value: {% increment card_index %}</p>
```

The page prints the assigned value as `10`, then the counter values `0` and `1`. The matching name is coincidence, not shared storage. This makes counters useful for simple output numbering when their isolated behavior is intentional, but it also makes them a poor way to communicate data between components.

`decrement` has the corresponding isolated sequence in the other direction. It begins below zero on its first output, which can surprise anyone expecting it to mirror an assigned value. Use a normal assigned calculation when you need a known index relative to loop data; use the counter tags only when a stand-alone render counter is genuinely the clearest contract.

> [VERIFY] Before depending on an increment or decrement counter across a specific nesting boundary, confirm that boundary in Shopify’s tag reference. Counter behavior is deliberately distinct from ordinary assigned-variable scope and should not be used as hidden cross-component state.

## 6.3 Scope boundaries: template, layout, section, block, snippet, for-loop

A theme render has nested contexts. A template chooses the main resource context. A layout wraps the rendered page. A section has its section settings and local structure; a block has its own `block` data when it is being rendered; a `for` loop establishes loop-specific names such as its loop variable and `forloop`; and a snippet has its own render boundary. The names you see in one context are not evidence that every other file may safely depend on them.

```liquid
<!-- sections/product-summary.liquid — product template -->
{% assign section_heading = section.settings.heading %}

{% for tag in product.tags %}
  <span>{{ forloop.index }}. {{ tag | escape }}</span>
{% endfor %}
```

`section_heading` describes the section’s configuration. `tag` and `forloop` exist for the loop body. Do not build a later section around a hope that it can use the same loop variable. Name values at the closest boundary that owns them, and pass a needed value deliberately when you cross into another file.

Layout and template responsibilities are not an invitation to create a hidden data bus. A layout may have global page concerns, while a section has merchant-controlled settings and a block has per-block settings. When a value is required by two independent components, decide who owns the source and make the input visible at the call boundary. The more a theme relies on “this happened to be assigned earlier,” the harder it becomes to reorder, preview, or reuse components safely.

The practical review question is: could this component render correctly when the editor previews it in isolation? If the answer depends on a variable assigned in another section, the component has an invisible dependency. Read the required value from a documented object in its own context, expose it as a section setting, or pass it through a render call. Isolated previews are not an edge case; they are a normal way merchants and developers exercise theme components.

## 6.4 The `render` isolation rule and how it kills the "global variable" habit

`render` creates an isolated snippet scope. A snippet does not automatically receive every local variable that the caller has assigned. Pass what the snippet needs as explicit named arguments. This makes the snippet’s input contract visible at the place that uses it and prevents a later caller from accidentally changing its output through an unrelated local assignment.

```liquid
<!-- sections/product-summary.liquid -->
{% assign display_title = product.title %}
{% render 'product-label', title: display_title, available: product.available %}
```

```liquid
<!-- snippets/product-label.liquid -->
{% if available %}
  <p class="product-label">{{ title | escape }}</p>
{% endif %}
```

The caller owns the product traversal; the snippet owns the small output contract. Passing `title` and `available` is more verbose than reaching for a presumed global, but it tells a maintainer exactly what the snippet can rely on. A snippet can be rendered elsewhere with a different value source without changing the snippet’s internals.

```liquid
<!-- Wrong: assuming a caller assignment is a hidden snippet API -->
{% assign display_title = product.title %}
{% render 'product-label' %}

<!-- Right: declare the dependency at the call site -->
{% render 'product-label', title: product.title, available: product.available %}
```

Do not use a snippet to mutate a caller’s local state. Its isolation is the feature: it prevents a reusable file from changing parent variables as a side effect. If two render paths need shared output or data transformation, establish the value in their owning context or design an explicit input/output structure rather than relying on a global-variable habit.

This also changes debugging order. When a snippet renders blank, first inspect its arguments at the render call. Next inspect the snippet’s documented input names. Only after that should you question the source object in the caller. Starting inside the snippet and adding fallback access to parent-looking names creates a component that may appear to work in one place and fail when reused elsewhere.

Treat every render call as a small function signature during review. A reader should be able to point to each argument and say which context owns it, whether it is raw data or formatted display text, and what the snippet will do when it is absent. That is a more reliable contract than a comment saying “uses current product,” because it survives the moment the snippet is called from a collection card, search result, or editor preview rather than the original product section.

## 6.5 Reassignment, shadowing, and mutation traps

Liquid lets you assign the same name again. The later assignment replaces the value used by later code in that scope, which can be useful for a deliberate normalisation step but confusing when the name describes a different type halfway through a file.

```liquid
<!-- sections/product-summary.liquid -->
{% assign label = product.title %}
{% assign label = label | append: ' — seasonal release' %}
<p>{{ label | escape }}</p>
```

This is readable because `label` remains display text. Reassigning `product` to a string, or reusing `title` as a block setting after using it as a product title, makes every later line require historical reconstruction. Prefer a new, more specific name when the meaning changes.

**Shadowing** happens when an inner context uses a name already meaningful in an outer context. A loop variable named `product` inside a section that also uses the current product is technically possible and almost always a maintenance trap. The nearest meaning wins for the reader’s attention even when the runtime boundary is subtle. Choose names that describe the collection member, such as `related_product`, instead of recycling a root object name.

Liquid values are not a mutable JavaScript store. Filters return transformed results; they do not mutate the source object in place. Assign the result you intend to use next, and keep the original value available when both semantics matter. This is why `assign formatted_price = product.price | money` is clearer than pretending `product.price` has become formatted throughout the rest of the section.

A useful refactor rule follows: never change a variable’s name from a resource-like role to a display-like role by reassignment. Preserve `product_price` for the original source value and introduce `formatted_price` for output. The extra name costs one line and removes a class of later bugs where an arithmetic filter is applied to what is now a currency-formatted string. Treat local naming as the lightweight type signal Liquid gives a large theme codebase.

## 6.6 Naming conventions for a codebase that scales

Names are part of a component contract. Use lowercase snake_case for local Liquid names, choose nouns that identify the value’s source or role, and reserve broad names such as `title`, `item`, `data`, or `result` for the smallest possible context. `section_heading`, `product_title`, `related_product`, and `formatted_price` carry ownership and type intent; `value` does not.

Use a consistent suffix when a transformed value needs distinction: `_html` for deliberately captured markup, `_label` for display text, `_count` for a numeric quantity, `_url` for a destination string, and `_settings` only when the value is a settings object. The suffix is not type checking, but it stops a reader from treating an escaped label as a product or a formatted price as a number.

Avoid names that mirror private implementation details of another file. A snippet should receive `product` or `title` according to its public contract, not `caller_product_for_card_2`. At a render call, favor names that explain the snippet’s need over names that explain the caller’s temporary variable. This lets the same snippet be reused without dragging a section’s incidental naming scheme into every consumer.

Consistency pays off during code search as well. If every current resource is named `product`, every explicitly transformed title is named `product_title`, and every merchant setting stays rooted under `section.settings` until assigned for a stated purpose, a reviewer can trace ownership without executing the theme. Do not encode the current template name into every local variable; encode it only when it distinguishes two values that genuinely coexist.

Prefer names that still make sense after a section is copied or its placement changes. `display_title` can describe a component input in many contexts; `homepage_title` bakes an accidental current location into the code. When a location really is part of the contract, put that constraint in the section schema or documentation, not only in a variable name that another caller may inherit without understanding.

## Gotchas

- **Capturing a value that will be calculated later.** Capture makes rendered text; assign the value first.
- **Expecting `increment` to share a name with `assign`.** Counter tags use their own namespace.
- **Calling a variable global because it was assigned earlier.** File and render boundaries still define what is available.
- **Making a snippet depend on unpassed local state.** `render` is isolated; declare named inputs.
- **Reusing a root-object name inside a loop.** Shadowing hides meaning before it breaks a render.
- **Calling a formatted value a price.** Name display strings as labels or formatted values so no one performs later arithmetic on them.

## Checklist

- [ ] I use `assign` for values and `capture` only for intentionally rendered strings.
- [ ] I know counter tags are not assigned variables.
- [ ] I can identify the owner and lifetime of every local name I introduce.
- [ ] I pass snippet inputs through `render` explicitly.
- [ ] I choose names that preserve source, semantic role, and transformed state.

## Related

- `ch-05-types-truthiness-nil` — the values and empty states that local names can hold.
- `ch-07-conditions-and-logic` — condition composition around the values passed here.
- `ch-09-liquid-data-shaping` — capture and transformation patterns at larger scale.
- `ch-17-section-schema` — section settings as a component boundary.
- `ch-21-snippets-as-apis` — explicit snippet contracts and reusable theme functions.

[1]: https://shopify.dev/docs/api/liquid/tags/render "Shopify render tag"
