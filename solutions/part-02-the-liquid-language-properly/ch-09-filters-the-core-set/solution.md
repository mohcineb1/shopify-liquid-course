<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-09-solution
title: "Solution — Build a safe collection signal panel"
chapter: ch-09
---

# Solution — Build a safe collection signal panel

The finished panel is deliberately small: it transforms data that is already contextual to the collection page and renders each value at the boundary appropriate to its consumer. It does not look up another collection, derive customer eligibility, calculate a price, or run browser behavior. That separation is the point of the exercise. The section owns HTML output and the contextual tag pipeline; the snippet owns a narrow JSON serialization boundary; the stylesheet owns presentation only.

## Final file map

```text
solutions/part-02-the-liquid-language-properly/ch-09-filters-the-core-set/
├── solution.md
└── solution/
    ├── assets/section-collection-signal.css
    ├── sections/collection-signal.liquid
    └── snippets/collection-signal-data.liquid
```

## 1. Establish text values before HTML output

The heading starts as a setting value. `default` supplies a literal display fallback when the setting is blank; `strip` normalizes the resulting string; and `escape` makes the final value appropriate for HTML text. The order expresses a useful type story: text-shaped setting → nonblank display text → normalized display text → HTML-safe output.

```liquid
{% assign panel_heading = section.settings.heading | default: 'Collection signal' | strip %}
<h2>{{ panel_heading | escape }}</h2>
```

`default` is not a collection fallback. It cannot tell us whether a collection exists or whether the section appears in the right template. It is only the correct fallback for this one text display. Leaving the final escape at output also makes the HTML boundary visible to a reviewer.

The description pipeline follows the same principle. `collection.description` may contain merchant-authored markup, but the panel promises an excerpt of readable text. `strip_html` therefore comes first, followed by `strip`, then `truncate: 160`. Truncating first would count markup against the buyer’s character budget and could produce an incoherent excerpt after tags are removed.

```liquid
{% assign description_text = collection.description | strip_html | strip %}
{% if description_text != blank %}
  <p>{{ description_text | truncate: 160 | escape }}</p>
{% endif %}
```

The `if` is based on the cleaned text, so whitespace or markup-only descriptions do not create an empty paragraph. `truncate` remains a display choice; it is not validation or storage normalization.

## 2. Shape tags from the contextual array

The panel’s tag list begins from the products Shopify has already supplied through `collection.products`. `map: 'tags'` yields nested tag arrays, so the solution uses `join: ','`, `split: ','`, and then `compact`, `uniq`, and `sort_natural` to produce one clean array of display values. The intermediate name makes the transformation reviewable rather than repeating it inside markup.

```liquid
{% assign collection_tags = collection.products | map: 'tags' | join: ',' | split: ',' | compact | uniq | sort_natural %}
```

The type transitions are important: product array → array of tag arrays → comma-delimited string → tag string array → clean unique sorted tag array. `join` is a temporary flattening boundary; it is followed immediately by `split` so later filters again receive an array. This is appropriate for the bounded contextual source supplied by the page. It would not justify scanning a global product catalogue.

The wrapper is conditional on `collection_tags.size`. When tags exist, each one is escaped for HTML text inside a list item. When they do not, a paragraph—not an empty `<ul>`—states the panel’s derived empty state. This condition is independent of whether the collection itself has products: products can exist and contribute no usable tags.

> [VERIFY] Verify the current filter behavior for nested tag arrays in the target theme before relying on this flattening pattern for a production taxonomy component. The exercise deliberately confines it to current contextual product tags.

## 3. Use one encoding rule per output boundary

The internal link has two distinct concerns. Its dynamic query component is encoded with `url_encode`; the completed href is then escaped for its HTML attribute boundary. Doing only the latter does not preserve the query structure when a title contains `&`, spaces, or quotes. Doing only URL encoding is not an HTML escaping rule.

```liquid
{% assign search_query = collection.title | url_encode %}
<a href="{{ '/search?q=' | append: search_query | escape }}">Search this collection</a>
```

The display link text is literal, so it needs no dynamic output handling. If the feature later needs a dynamic label, it should be treated as HTML text separately rather than assuming its URL transformation makes it safe everywhere.

The JSON boundary is even narrower. The snippet builds an object from only the declared title and URL values and serializes that object with `json`. It does not construct braces, quotes, or escaped strings manually. The enclosing script has `type="application/json"`, so it carries data for a later browser consumer rather than executable code.

```liquid
{% assign signal_payload = '{"title": "' | append: signal_collection.title | append: '"}' %}
```

The code above is **not** the solution: it breaks as soon as a title contains a quote. The correct solution assigns an object-shaped value through Liquid data and serializes it with `json`, as implemented in the supplied snippet. Never use `raw` to suppress the problem or `inspect` as a customer-facing data format.

## 4. Why the solution excludes other filters

There is no money math because the panel does not own a commerce calculation. There is no date filter because it displays no date. There is no `all_products` lookup or collection sorting because the component’s contract is the current collection. There is also no client-side code: producing stable JSON is a server-rendered handoff, while consuming it belongs in `ch-37-javascript-in-themes`.

This restraint makes each transformation auditable. `default` changes a text fallback. `strip_html`, `strip`, and `truncate` create display text. Array filters make a contextual display array. `url_encode` prepares one URL component. `escape` protects HTML boundaries. `json` serializes declared data. None is presented as a universal safety filter.

## 5. Test the transformed value, not only the source

The useful test fixtures for this component are deliberately awkward. Use a heading setting containing leading spaces and an ampersand to check that normalization happens before the visible HTML boundary. Use a description containing a paragraph and an emphasis tag to check that the excerpt remains readable after `strip_html`. Use repeated tags, blank tags, and human strings such as `Tag 2` and `Tag 10` to confirm that cleaning, de-duplication, and natural ordering happen while the value is still an array.

For the URL test, use a collection title containing an ampersand, spaces, and quotation marks. Inspect the browser-visible href rather than trusting the template source: the entire title must remain one query value, not create a second parameter. For the JSON test, inspect the text content of the non-executing script and parse it in a development environment; it must be valid JSON even when the title contains quotes. `inspect` can help temporarily during authoring, but it is diagnostic output, not a payload format and must not remain in the rendered section.

## Validation matrix

| Scenario | Expected result |
| --- | --- |
| Blank heading setting | The literal fallback heading renders as escaped HTML text. |
| Markup-heavy description | A readable plain-text excerpt is measured after markup removal. |
| Repeated and blank tags | One naturally ordered tag list with no blank or duplicate items. |
| No derived tags | The tag empty-state paragraph renders; no empty list exists. |
| Title containing `&` or quotes | One encoded search query component inside a valid escaped href. |
| Browser data boundary | Valid JSON for the declared title and URL, with no manual quoting. |

## Checklist

- [x] Every pipeline has a named input, intermediate type transition where needed, and final output context.
- [x] Description truncation measures readable text rather than HTML source.
- [x] Tag shaping is contextual, clean, unique, naturally sorted, and has its own empty state.
- [x] URL encoding and HTML escaping are distinct operations.
- [x] JSON serialization is narrow and uses `json`, never a hand-built data string.
- [x] The solution mirror contains runnable section, CSS, and serialization snippet files.
