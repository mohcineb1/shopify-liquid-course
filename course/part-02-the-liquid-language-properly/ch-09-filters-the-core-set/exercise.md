<!-- STATUS: draft -->
---
id: ch-09-exercise
title: "Build a safe collection signal panel"
chapter: ch-09
---

# Exercise — Build a safe collection signal panel

A collection page needs a small “signal panel” above its grid. It summarizes the current collection for a customer, exposes a stable data payload for a future enhancement, and deliberately avoids becoming a second filtering system. The starter has markup, a section schema, and a stylesheet; it does **not** establish the transformation contracts. Complete it by making every output pipeline readable, context-safe, and bounded by the data already supplied to the collection page.

## The brief

Finish the section, stylesheet, and data snippet in `starter/`. Use the contextual `collection` object only. The visible heading must use the section setting when it is meaningful and a literal fallback when it is blank. Normalize the selected heading before output and escape it for HTML. Do not use the fallback to hide a missing collection or to make a resource-selection decision.

The panel needs a plain-text collection description excerpt. Start from `collection.description`, remove any stored markup, normalize leading and trailing whitespace, then truncate the visible result at a stated character count. The order matters: the display budget must apply to text a buyer can read, not to HTML source. Render the excerpt only when the resulting source description has usable content; do not output a visual empty paragraph.

Add a “tags at a glance” list derived from the products already in the current collection. Build the list with array filters so it contains clean, unique, naturally sorted tag values before rendering. The list must have an honest empty state. Do not use `all_products`, a literal collection handle, or a nested unbounded resource lookup. This is a small contextual summary, not catalogue-wide faceted navigation.

The panel also needs an internal search link. Its query parameter must contain the current collection title transformed for a **URL component**, while the surrounding attribute remains valid HTML. Do not manually concatenate a query with raw customer-facing text. Finally, complete the supplied JSON data boundary so the page can expose the collection’s title and current URL to future browser code without building JSON strings by hand. The JSON belongs in a non-executing `application/json` script element and is data, not behavior.

## Constraints

| Area | Requirement |
| --- | --- |
| Heading | Use `default` for a literal display fallback, then normalize and HTML-escape the final heading. |
| Description | Apply `strip_html`, whitespace normalization, and truncation in an order that measures readable text. |
| Array | Derive clean, unique, naturally sorted tags from `collection.products`; render the wrapper only when it has members. |
| URL | Encode the dynamic query component and preserve valid HTML attribute output. |
| JSON | Serialize the provided collection values with `json`; no manually quoted JavaScript object. |
| Scope | Do not add price arithmetic, date formatting, a client-side feature, broad lookup, sorting of the collection itself, or resource-specific eligibility logic. |

> [VERIFY] Verify the exact tag and collection-property contract before extending this panel beyond `collection.title`, `collection.description`, `collection.url`, and contextual product tags. This exercise does not need inferred product state.

## Acceptance criteria

A blank setting heading must render the literal fallback, escaped for HTML. A description containing stored markup must render a readable, bounded excerpt without tag fragments. A collection with repeated or blank tag values must render a clean, naturally ordered list with no duplicates; a collection whose derived tag list is empty must show the supplied empty-state message and no empty `<ul>`.

The search link must safely preserve a collection title containing spaces, ampersands, or quotation marks as one query value, rather than changing the URL’s query structure. Inspect the data script: it must contain valid serialized JSON and no hand-built property quotation. The section’s output should make the filter order legible enough that a reviewer can name the value type at the major stages.

## Files to work in

```text
course/part-02-the-liquid-language-properly/ch-09-filters-the-core-set/
├── exercise.md
└── starter/
    ├── assets/section-collection-signal.css
    ├── sections/collection-signal.liquid
    └── snippets/collection-signal-data.liquid
```

The snippet is intentionally a narrow serialization boundary. It receives one collection object and should serialize only the fields the panel declares. It must not use `inspect`, `raw`, or a broad object dump in customer-facing output.

## What to submit

Submit the completed section, stylesheet, and snippet. In the hand-off, identify the type transition at each main pipeline, the empty state for the derived tag list, and the two distinct output-context transformations used for the URL and JSON boundaries. Do not submit a prose-only answer.

## Self-review

- [ ] The heading fallback, description excerpt, tags, URL query, and JSON data each have a clear output contract.
- [ ] Filter order preserves readable text before truncation and array semantics before display joining.
- [ ] Dynamic HTML, URL, and JSON values use the right boundary transformation.
- [ ] No broad lookup, manually built JSON, unbounded related traversal, or unrelated business rule was introduced.
- [ ] All three starter files remain usable in a current theme.
