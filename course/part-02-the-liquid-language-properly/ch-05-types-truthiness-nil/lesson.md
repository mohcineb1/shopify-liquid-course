<!-- STATUS: final -->
---
id: ch-05
title: "Types, Truthiness & Nil"
part: 2
words: 2491
---

# Chapter 5 — Types, Truthiness & Nil

Liquid rarely interrupts a render to tell you that an assumption was wrong. A missing property often becomes empty output; an empty string can enter a branch you expected to skip; and a value that looks numeric may be transformed as text until a filter coerces it. That is not Liquid being inconsistent. It is a consequence of a small template language that keeps rendering under incomplete storefront data. You need a precise model of the values you receive before you add a fallback or blame a condition.

## What you'll be able to do

- Identify the Liquid value categories that matter in theme code.
- Predict a branch when a value is `false`, `nil`, an empty string, or an empty collection.
- Distinguish absent data from an empty collection-like value.
- Choose `blank` or `empty` based on the contract you are checking.
- Recognise where filters coerce values and where output fails silently.

## 5.1 The type list: string, number, boolean, nil, array, object/drop

Liquid does not expose a JavaScript-style type system, but theme code still operates on recognizable value categories. A **string** is text such as a product title or a setting. A **number** is a numeric value such as `cart.item_count` or a price in subunits. A **boolean** is `true` or `false`. `nil` represents an absent value. An **array** is an ordered collection such as `product.tags` or `cart.items`. An **object** is a Shopify-supplied value with documented properties; in Liquid it is commonly represented by a Drop.

```liquid
<!-- sections/product-facts.liquid — product template -->
<p>{{ product.title | escape }}</p>
<p>{{ cart.item_count }}</p>
<p>{{ product.available }}</p>
```

The first line outputs a string, the second a number, and the third a boolean. The delimiters do not expose their types to the browser; all three become text in HTML. Type still matters before output, because Liquid tags and filters decide what they can compare, iterate, or transform.

A Drop is not a generic map you assembled in the theme. `product` is a Shopify object with a documented property surface. Its `title` property is a string-like value; `variants` is a collection-like relationship; a missing property access can produce no visible output. Chapter 3 explains why that distinction affects availability and traversal.

```liquid
<!-- sections/product-facts.liquid — product template -->
{% assign product_title = product.title %}
{% assign item_count = cart.item_count %}

<p>{{ product_title | escape }}</p>
<p>{{ item_count }}</p>
```

`assign` names the current value for this render. It does not declare a static type, persist a value, or turn a string into a number. When you read a theme setting, resource property, or filter result, check the object reference and schema contract rather than trusting the way a value looks in a rendered page.

That is especially important around settings. A text setting that contains `12` is still merchant-entered text until a documented transformation gives it another role. A product resource selected through a picker is an object-like value or `blank`, not a handle string you should concatenate into a lookup. The safest authoring habit is to name the source category in the requirement itself: “a merchant text setting,” “the current product,” or “the cart item count.” That language tells you whether the next operation should be output, a content-presence check, a traversal, or an explicit conversion.

## 5.2 Truthiness rules that differ from JavaScript (empty string is truthy)

Liquid’s condition model has one rule worth memorising before any other: only `false` and `nil` are falsy. An empty string is truthy. An empty array is truthy. The number `0` is truthy. This differs from JavaScript, where `''` and `0` are falsy, and it makes a casual “does this setting have content?” condition unreliable.

```liquid
<!-- sections/product-facts.liquid -->
{% assign note = '' %}

{% if note %}
  <p>This renders because an empty string is truthy in Liquid.</p>
{% endif %}
```

The wrong translation from JavaScript is to use a plain `if` when the requirement is about meaningful content.

```liquid
<!-- Wrong: an empty text setting still enters this branch -->
{% if section.settings.notice %}
  <p>{{ section.settings.notice | escape }}</p>
{% endif %}
```

```liquid
<!-- Right: `blank` asks whether the setting has usable content -->
{% unless section.settings.notice == blank %}
  <p>{{ section.settings.notice | escape }}</p>
{% endunless %}
```

The second example is not “more defensive JavaScript.” It asks a different Liquid question. `blank` covers values that are absent or content-empty; section 5.4 explains its full scope. Use a plain condition when you truly mean boolean state, such as `product.available`. Use a `blank` test when a text, collection, or selection must contain something useful before you render dependent markup.

Do not use JavaScript mental shortcuts like `!value`, `||`, or a ternary inside output markup. Liquid’s logical operators and condition grammar are covered in `ch-06-conditions-and-logic`; here, the important fact is that an empty-looking value has not necessarily failed a condition.

A useful debugging sequence follows from that rule. First output or inspect the value in a safe development context. Next decide whether the requirement is about boolean state, missing data, or usable content. Only then choose a branch condition. Starting with `{% if value %}` because it resembles a familiar JavaScript idiom reverses the reasoning: you have picked the test before saying what counts as a valid value. In Liquid, that shortcut is exactly how an empty announcement field produces an empty paragraph instead of a fallback.

## 5.3 `nil` and `EmptyDrop`: the two flavours of "nothing"

`nil` means Liquid has no value for an expression. A missing optional setting, an unavailable property path, or a lookup with no result can lead to `nil`-like absence. It is falsy and it renders as nothing. That quiet output is useful when optional markup is intentionally absent, but dangerous when it hides a misspelled property or a context error.

An **EmptyDrop** is different. Shopify can return an object-shaped empty result for some resource lookups rather than `nil`. It behaves as an empty value in the contexts Shopify documents, but it still signals that you are dealing with a resource-shaped result, not simply an unassigned variable. Do not invent a fake product title merely because a lookup produced no resource; test the documented result and make an intentional fallback decision.

> [VERIFY] Check the specific object reference when a feature depends on whether a failed lookup produces `nil`, `empty`, or an EmptyDrop. The correct guard follows that object’s contract, not a universal assumption about all Shopify lookups.

```liquid
<!-- sections/product-facts.liquid — product template -->
{% if product.featured_image != nil %}
  {{ product.featured_image | image_url: width: 960 | image_tag: loading: 'lazy', alt: product.title }}
{% endif %}
```

This check asks whether the optional image is absent. It does not claim that every unavailable resource uses the same sentinel. For a section setting that may deliberately be unfilled, `blank` usually expresses the reader-facing intent better than `nil`; for a boolean setting, a `nil` test and a `false` test are not interchangeable.

Keep the distinction visible in fallback copy. “No image has been selected” describes an optional configuration state. “This product has no image” may be a merchandising problem. “The image property is unavailable here” is a context problem. All three can result in no image output, but they require different next actions. Liquid’s quiet rendering makes those meanings easy to collapse, so write the guard and the fallback around the actual ownership of the missing value.

## 5.4 `blank` vs `empty` — the distinction that causes real bugs

`blank` and `empty` are special comparison values, not JavaScript methods. Use `blank` when a value should count as absent for presentation: `nil`, `false`, an empty string, whitespace-only text, an empty array, and Shopify empty values belong to that broader practical category. Use `empty` when the contract is specifically an empty collection or string, rather than missing or false state.

```liquid
<!-- sections/product-facts.liquid -->
{% if product.tags == empty %}
  <p>No product tags are available.</p>
{% endif %}

{% if section.settings.notice == blank %}
  <p class="product-facts__fallback">No launch note has been configured.</p>
{% endif %}
```

The first branch is about a collection’s count. The second is about whether a merchant has supplied presentation content. Substituting one comparison for the other changes the contract. A boolean set to `false` is blank but is not an empty array; an absent setting is blank but may not be the kind of collection question `empty` was written to answer.

A common bug is to use `empty` to decide whether to output optional rich or text content. It can miss a whitespace-only value or encode the wrong intent for an unset setting. Conversely, using `blank` when a collection’s emptiness carries a distinct business meaning can blur “no items” with a missing value. State the desired meaning in prose first, then choose the comparator that matches it.

For example, an empty cart item list can be a normal buyer state worth rendering as an empty-cart experience. A blank merchant announcement field is a configuration state worth omitting or replacing with a default. A missing product property in a product template is neither of those until you verify the documented object surface. These cases all look like “nothing” in an unguarded output, but their correct fallback owners differ: cart experience, merchant configuration, and code correction. Naming that owner prevents a broad `blank` guard from quietly hiding the wrong defect.

```liquid
<!-- Wrong: this does not express a merchant-content fallback clearly -->
{% if section.settings.notice == empty %}
  <p>No launch note has been configured.</p>
{% endif %}

<!-- Right: the question is whether a usable notice exists -->
{% if section.settings.notice == blank %}
  <p>No launch note has been configured.</p>
{% endif %}
```

## 5.5 Type coercion in comparisons and filters

Liquid filters can transform the apparent type of a value. The `append` filter turns its input into string output; `plus` is commonly used when numeric arithmetic is required; money filters format numeric price values for display. Do not infer a value’s safe comparison behavior from the characters it currently renders as.

```liquid
<!-- sections/product-facts.liquid -->
{% assign stock_label = cart.item_count | append: ' items in cart' %}
{% assign next_item_count = cart.item_count | plus: 1 %}

<p>{{ stock_label }}</p>
<p>After one item: {{ next_item_count }}</p>
```

`stock_label` is display text. `next_item_count` is the arithmetic result. Keep those roles separate. Comparing a merchant-entered text setting to a number because it “usually contains digits” makes a fragile contract; validate the setting type in schema or transform it deliberately before arithmetic.

> [VERIFY] Before depending on coercion for a specific comparison, check the tag or filter reference and the source object’s documented value type. Prefer an explicit filter transformation over relying on an incidental string-to-number conversion.

The same discipline applies to output. A price can be numeric in Liquid and still need `money` for storefront formatting; a value that has passed through `append` is now intended as text and should not become an arithmetic input later in the file.

Avoid using coercion as validation. If a filter accepts an unexpected merchant value, a resulting number or string may still be semantically wrong for the storefront. A schema type, resource picker, or explicit fallback is where you define acceptable input; a filter transforms a value after it enters the template. Keeping validation and transformation separate makes later changes safer, especially when a merchant setting moves from a free-text field to a structured configuration surface.

## 5.6 Silent failure: why Liquid prints nothing instead of throwing

Liquid is designed to keep a storefront render moving. When output evaluates to a missing value, it commonly produces no visible characters rather than a runtime exception. That protects a buyer from a raw stack trace, but it moves responsibility to the theme author: distinguish optional output from a mistake that happened to look empty.

```liquid
<!-- sections/product-facts.liquid — product template -->
<p>{{ product.launch_message }}</p>
```

This may render an empty paragraph because `launch_message` is not a documented product property. The absence is not proof that the theme has no launch message; it may be a typo, the wrong object, or a value that belongs in a setting or metafield. Liquid did not throw because it cannot decide which recovery you intended.

A better pattern is to guard an optional documented value and leave a visible development fallback while you establish the contract. During investigation, keep the fallback close to the output whose absence you are explaining. A distant generic error panel may prove that something failed, but it does not tell a future reader whether the missing value was a setting, a contextual object, or a collection result. Once the contract is confirmed, retain only the buyer-facing empty state that the feature genuinely needs.

```liquid
<!-- sections/product-facts.liquid — product template -->
{% if section.settings.notice != blank %}
  <p>{{ section.settings.notice | escape }}</p>
{% else %}
  <p>No launch note has been configured.</p>
{% endif %}
```

Do not add a fallback that masks a misspelled object or silently substitutes unrelated data. First confirm the render context and documented property path. Then decide whether blank output is a valid buyer experience, a merchant configuration state, or a development defect. In a development theme, a temporary explicit fallback can make the distinction observable; in a production component, choose a buyer-facing fallback only when the empty state is part of the feature’s contract. Debugging object availability belongs in `ch-03-the-shopify-object-graph`; disciplined fallback design appears again in `ch-24-settings-ux`.

## Gotchas

- **Treating an empty string as falsy.** In Liquid it is truthy; use a `blank` comparison for content presence.
- **Using `nil` as a universal missing-resource test.** Shopify objects may document different empty results; check the specific object contract.
- **Using `empty` for every optional field.** `empty` asks a narrower collection-or-string question than `blank`.
- **Performing arithmetic on display text.** A filter chain can make a number into a string-like label.
- **Accepting silent output as evidence that a property is valid.** Confirm the object, context, and property before treating an empty render as intentional.

## Checklist

- [ ] I can name the value category I expect before I compare or format it.
- [ ] I know that only `false` and `nil` are falsy in Liquid.
- [ ] I use `blank` for presentation absence and `empty` for a specific empty collection or string contract.
- [ ] I make a filter transformation explicit before I rely on numeric or text behavior.
- [ ] I investigate silent output through the documented object graph instead of inventing a fallback.

## Related

- `ch-03-the-shopify-object-graph` — object availability, Drops, and contextual data roots.
- `ch-04-syntax-fundamentals` — delimiters that output or control the values described here.
- `ch-06-conditions-and-logic` — boolean operators and branch composition.
- `ch-09-liquid-data-shaping` — capture, filtering, and output shaping.
- `ch-24-settings-ux` — merchant-facing configuration and presentation fallbacks.

[1]: https://shopify.dev/docs/api/liquid/basics "Shopify Liquid basics"
