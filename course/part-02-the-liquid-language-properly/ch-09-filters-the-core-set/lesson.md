<!-- STATUS: final -->
---
id: ch-09
title: "Filters: The Core Set"
part: 2
words: 2500
---

# Chapter 9 — Filters: The Core Set

Filters are Liquid’s small transformation language: they reshape the value already on the left of a pipe, but they do not fetch data, create side effects, or make an unclear source contract safe. Senior theme work depends on reading a pipeline as precisely as a function call—what enters it, what type leaves each stage, whether it is still safe for its output context, and whether an earlier transformation has destroyed information needed later.

## What you'll be able to do

- Read a filter chain as a left-to-right value transformation.
- Choose string, array, math, date, and debugging filters by their input and output contracts.
- Escape at the point an untrusted value enters markup, URL, or JSON context.
- Avoid precision and integer-division errors in price-adjacent calculations.
- Keep filtering and shaping separate from resource-selection and rendering contracts.

## 9.1 How filters chain, and why order changes output

A filter receives the value immediately to its left and passes its result to the next filter. Read pipes from left to right, exactly as the value changes. This makes chains useful for short, declarative normalization, but it means order is observable behavior.

```liquid
{{ product.title | strip | downcase | handleize }}
```

The title is first trimmed, then lowercased, then transformed into a handle-like string. Reversing those operations may produce a different result because one filter can remove or replace characters the next filter would otherwise see. Do not compress a pipeline merely because it can be one line. If the reader cannot name the intermediate value, use `assign` and give it a contract-bearing name.

```liquid
{% assign normalized_title = product.title | strip | downcase %}
{{ normalized_title | handleize }}
```

This is especially important when a transformation changes type. `split` returns an array; `join` returns a string; `map` turns an array of objects into an array of property values; `json` serializes a value into JSON text. A later filter must accept what the preceding filter actually produced, not what the original object used to be.

**Wrong — truncate before removing markup:**

```liquid
{{ article.content | truncate: 120 | strip_html }}
```

**Right — remove markup before measuring display text:**

```liquid
{{ article.content | strip_html | strip | truncate: 120 }}
```

The wrong chain counts HTML characters as part of the truncation budget and can leave an unhelpful excerpt. The right chain establishes plain text first, normalizes whitespace, then limits the visible copy.

## 9.2 String filters: case, trim, truncate, split, replace, append/prepend, slice, strip_*, handleize/handle

String filters are presentation tools, not substitutes for a resource model. `upcase`, `downcase`, and `capitalize` change casing for display. `strip`, `lstrip`, and `rstrip` remove leading and/or trailing whitespace; `strip_newlines` removes line breaks; `newline_to_br` converts line breaks into `<br>` markup. Use the latter only when a stored plain-text value is intentionally allowed to control line breaks in an HTML context.

```liquid
{% assign label = section.settings.eyebrow | strip | upcase %}
{% if label != blank %}
  <p class="eyebrow">{{ label | escape }}</p>
{% endif %}
```

`truncate` limits by characters and accepts an optional omission string; `truncatewords` limits by words. They are display limits, not data validation. `split` creates an array using a delimiter, while `replace`, `replace_first`, `remove`, and `remove_first` replace or remove known literal text. `append` and `prepend` construct text around a value, and `slice` selects a position or short segment. Keep delimiters and units explicit.

```liquid
{% assign labels = product.tags | join: ',' | split: ',' %}
{% assign first_label = labels | first | strip %}
<p>{{ first_label | truncatewords: 3 | escape }}</p>
```

`handleize` turns text into a handle-like slug; `handle` is its alias. It is appropriate when deriving a conventional token from text, such as an HTML id fragment or a predictable key. It does not prove that a generated handle identifies an existing Shopify resource. Do not derive a collection lookup from human copy and assume that lookup is valid.

> [VERIFY] Before using a transformed string as a resource handle, verify the actual resource ownership and handle contract. `handleize` normalizes text; it does not validate a resource relationship.

## 9.3 Escaping and safety: `escape`, `escape_once`, `strip_html`, `url_encode`, `json`

Output context determines the safety transformation. In ordinary HTML text or attribute content, escape dynamic values close to output:

```liquid
<h2>{{ product.title | escape }}</h2>
<a href="/search?q={{ search.terms | url_encode }}">Search</a>
```

`escape` encodes HTML-significant characters. `escape_once` avoids re-escaping entities that are already escaped; use it when a value may contain entities from an upstream contract, not as a vague substitute for knowing whether the source is raw or already encoded. `strip_html` removes markup before a plain-text display transformation; it does not make an arbitrary value correct for every context.

`url_encode` encodes a component placed in a URL query or path context. It is not HTML escaping, so an encoded query must still be escaped if it is later emitted into HTML markup. `json` serializes a Liquid value as JSON, making it the correct boundary for data passed to browser JavaScript rather than manual quote construction.

```liquid
<script type="application/json" data-product-config>
  {{ product | json }}
</script>
```

Treat a JSON script element as data, then parse it intentionally in JavaScript. Browser data handoff belongs in `ch-37-javascript-in-themes`; do not interpolate unescaped dynamic strings into executable JavaScript.

## 9.4 Number and math filters: `plus`, `minus`, `times`, `divided_by`, `modulo`, `round`, `ceil`, `floor`, `abs`, `at_least`, `at_most`

Math filters are useful for counts, layout decisions, and bounded display calculations. `plus`, `minus`, `times`, `divided_by`, and `modulo` perform arithmetic. `round`, `ceil`, and `floor` choose a rounding behavior; `abs` removes a sign; `at_least` and `at_most` clamp a value to a minimum or maximum.

```liquid
{% assign columns = section.settings.columns | at_least: 2 | at_most: 4 %}
{% assign remainder = forloop.index0 | modulo: columns %}
<div data-column="{{ remainder }}"></div>
```

A clamp communicates a boundary in the value itself, while `modulo` is appropriate for a repeating mathematical position. Do not use math filters to hide an invalid schema or resource assumption. Settings constraints belong in schema, and resource eligibility belongs with the relevant resource chapter.

Filter arguments are values too. If a settings value may be blank or text-shaped, establish a clear default and numeric representation before calculating. Avoid dense arithmetic chains that make rounding and type conversion invisible; assign an intermediate value when a later reviewer must understand the quantity.

Rounding is a policy decision. `round` selects the nearest allowed representation, `ceil` always moves upward, and `floor` always moves downward. None of these can decide which policy a discount, shipping estimate, or inventory display should use. Document the business rule first, then make the filter express it. `abs` is similarly narrow: it can remove a sign for a display-oriented magnitude, but it should not erase a sign that carries meaning in the underlying data.

## 9.5 Integer division gotchas and money math correctness

`divided_by` can produce an integer result when its divisor is an integer. That is a serious distinction when the desired result is fractional.

```liquid
{{ 20 | divided_by: 7 }}
```

This produces an integer-style result, while a decimal divisor preserves a fractional result:

```liquid
{{ 20 | divided_by: 7.0 }}
```

Use that distinction deliberately for counts and columns. For prices, however, the correct response is usually not to perform display currency arithmetic in a template. Shopify money values are represented in minor units for Liquid calculations; preserve that integer representation, apply only clearly specified integer transformations, then pass the result to the appropriate money-formatting filter. Never parse a localized price string, divide it as if it were a decimal amount, and concatenate a currency symbol yourself.

```liquid
{% assign discounted_minor_units = product.price | times: 90 | divided_by: 100 %}
{{ discounted_minor_units | money }}
```

This example is only correct if the business rule defines the displayed discount as integer minor-unit arithmetic and accepts its rounding behavior. Tax, currency conversion, market pricing, and discount authority are commerce concerns, not a theme-side approximation. Forward those requirements to Shopify’s pricing data and the chapters that own commerce presentation.

> [VERIFY] Verify the current money representation and required money filter for the target theme and market before making a production price calculation. Do not infer currency precision from a rendered money string.

## 9.6 Array filters: `map`, `where`, `find`, `find_index`, `has`, `reject`, `sort`, `sort_natural`, `uniq`, `compact`, `concat`, `join`, `first`, `last`, `size`, `sum`, `reverse`

Array filters shape an array already in memory. `map` extracts one property from each member. `where` retains members matching a property and optional value; `reject` removes matching members. `find` returns the first matching member, while `find_index` returns its position and `has` tests for a matching property/value condition. These filters clarify intent when the array is small and contextual; they do not authorize broad resource traversal.

```liquid
{% assign product_titles = collection.products | map: 'title' | compact | sort_natural %}
{{ product_titles | first | escape }}
```

`sort` orders values using regular sort behavior; `sort_natural` applies natural ordering for human-readable text. `uniq` removes duplicates, `compact` removes blank or nil-like entries, `concat` combines arrays, `join` creates display text, `first` and `last` select endpoints, `size` measures a collection, `sum` totals a numeric property, and `reverse` returns reverse order. Read the chain’s type transitions: `map` returns an array, `join` returns a string, and after `join` an array filter is no longer appropriate.

Prefer a short assigned pipeline when an array is used more than once. It both avoids repeating the same shaping work in markup and makes the component’s collection contract reviewable. For example, assign a cleaned tag array once, check its `size`, and use that same array for the final display. Do not, however, turn every small chain into a temporary variable; use a name when it expresses a reusable intermediate decision, not when it merely restates the filter syntax.

```liquid
{% assign tags = product.tags | compact | uniq | sort_natural %}
{% if tags.size > 0 %}
  <p>{{ tags | join: ', ' | escape }}</p>
{% endif %}
```

> [VERIFY] Confirm `find`, `find_index`, `has`, and `sum` support for the exact array element shape in a production theme. Their utility depends on property availability and the current Shopify Liquid filter contract.

## 9.7 Date filters and strftime formatting, timezones, and locale-aware dates

The `date` filter formats a date-like value with strftime-style directives. For example, `%Y` represents a year and `%B` represents a month name in the formatting environment.

```liquid
<time datetime="{{ article.published_at | date: '%Y-%m-%d' }}">
  {{ article.published_at | date: '%B %-d, %Y' }}
</time>
```

Keep machine-readable and human-readable output separate: an ISO-like `datetime` attribute has a different audience from page copy. Theme code should not silently assume that a server time, a customer’s local time, and a shop’s configured timezone are interchangeable. If a requirement is genuinely locale-aware, use the theme’s localization and translation conventions rather than hard-coding a single English date sentence. Localization design belongs in the relevant later internationalization chapters.

Do not use a visible date string as a value you later parse or compare in Liquid. Format late, at the display boundary, and keep the original date-like value for any preceding decision. This is the same pipeline principle as HTML stripping before truncation: a display representation is often lossy and should not become the next stage’s data source.

> [VERIFY] Confirm the date source’s timezone behavior and the current locale-aware date pattern mechanism before shipping time-sensitive or translated customer-facing dates.

## 9.8 `default`, `json`, `inspect`, `raw`

`default` provides a fallback for a blank value, but it does not validate data ownership or establish business eligibility. Give it a specific display purpose. A fallback also has to match the output context: an ordinary text heading can safely receive another text heading, while a JSON consumer needs a serialized JSON value and a URL consumer needs an encoded component. Do not use one convenient fallback string across incompatible rendering boundaries.

```liquid
{{ section.settings.heading | default: 'Featured products' | escape }}
```

`json` is serialization for browser data, as shown earlier. `inspect` is a development-time diagnostic representation that helps reveal an object or transformed value while debugging; do not leave it in storefront output. `raw` is a Liquid tag, not a filter: it preserves its enclosed Liquid-looking text rather than evaluating it. It is useful for documentation examples and should never be used as an escape bypass for untrusted dynamic content.

A useful review question for all four tools is: **does this operation change a value, make it safe for one boundary, or merely help me see it?** `default` changes a display fallback; `json` serializes a boundary value; `inspect` exposes diagnostic representation; and `raw` protects literal template syntax from interpretation. Conflating those purposes is how debugging output, invalid JSON, or unsafe interpolation reaches a storefront.

```liquid
{% raw %}{{ product.title | escape }}{% endraw %}
```

## Gotchas

- **Treating filter order as cosmetic.** Each filter receives the previous filter’s result, including its changed type.
- **Escaping for the wrong context.** HTML text, URL components, and JSON data need different transformations.
- **Applying `default` as validation.** It supplies display fallback; it does not prove the original source was correct.
- **Accidentally taking integer division.** Use a decimal divisor only when a fractional result is intended and safe.
- **Doing commerce math on formatted money strings.** Preserve minor units and hand final presentation to money formatting.
- **Joining an array and then treating it as an array.** `join` returns a string.
- **Using `raw` to render dynamic HTML.** It is for literal Liquid preservation, not trust elevation.

## Checklist

- [ ] I can name the input and output type at every meaningful stage of a filter pipeline.
- [ ] I escape values for their actual final context.
- [ ] I keep price calculations in minor units and verify money representation before production use.
- [ ] I use array filters on a bounded contextual array, then verify the collection has members before rendering wrappers.
- [ ] I treat dates, timezones, and locale patterns as explicit requirements rather than formatting accidents.

## Related

- `ch-08-iteration` — bounded traversal of the arrays that filters transform.
- `ch-10-capture-and-string-building` — composing rendered strings deliberately.
- `ch-11-rendering-performance` — measuring the render cost of data access and transformation.
- `ch-37-javascript-in-themes` — safely consuming JSON rendered for browser code.

[1]: https://shopify.dev/docs/api/liquid/filters "Shopify Liquid filters"
