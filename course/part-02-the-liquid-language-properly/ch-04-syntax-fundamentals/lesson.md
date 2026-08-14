<!-- STATUS: final -->
---
id: ch-04
title: "Syntax Fundamentals"
part: 2
words: 2412
---

# Chapter 4 — Syntax Fundamentals

Most Liquid defects are not algorithmic. They are delimiter defects: an author asks Liquid to print a control-flow tag, trims a newline that separates readable HTML, leaves template syntax inside a browser template literal, or writes documentation in a form that the renderer exposes to buyers. This chapter gives you the small set of syntactic boundaries that make a theme file predictable. Read delimiters as a statement of intent: output, execute, suppress, preserve, or document.

## What you'll be able to do

- Choose output markup or tag markup without trying to turn one into the other.
- Trim whitespace deliberately and inspect the HTML you actually ship.
- Use the right comment form for a note, a block of disabled Liquid, or a short tag-local annotation.
- Group dense tag-only logic with `{% liquid %}` without hiding presentation markup.
- Preserve literal Liquid syntax inside a JavaScript template or documentation example.
- Add `{% doc %}` blocks that explain reusable Liquid files without appearing in storefront output.

## 4.1 Output markup `{{ }}` vs tag markup `{% %}`

Liquid has two primary delimiter families. **Output markup**, `{{ ... }}`, evaluates a value and puts its rendered result into the response. **Tag markup**, `{% ... %}`, performs Liquid work: it assigns a value, selects a branch, starts or ends a loop, renders another file, or changes the rendering context. A tag may cause later output to change, but a tag delimiter does not print its own expression result.

```liquid
<!-- sections/product-title.liquid — product template -->
<h1>{{ product.title | escape }}</h1>
```

The `product.title` value is output. The `escape` filter transforms that value before it enters HTML. The surrounding heading is ordinary HTML; Liquid only owns the interpolation.

```liquid
<!-- sections/product-title.liquid — product template -->
{% if product.available %}
  <p>Available to order</p>
{% else %}
  <p>Sold out</p>
{% endif %}
```

The `if`, `else`, and `endif` tags choose which HTML belongs in the response. They do not produce text themselves. This distinction makes mixed HTML and Liquid much easier to read: output delimiters belong where a value should appear; tag delimiters belong where Liquid controls the rendering process.

The common wrong move comes from carrying an expression-first syntax model into Liquid.

```liquid
<!-- Wrong: control-flow tags are not output expressions -->
<p>{{ if product.available }}Available{{ endif }}</p>
```

```liquid
<!-- Right: tags control the branch; output markup prints a value when needed -->
{% if product.available %}
  <p>{{ product.title | escape }} is available</p>
{% endif %}
```

A useful review question is: *if Liquid removed its delimiters, is this location supposed to contain a value or control the surrounding markup?* If it contains a value, use `{{ }}`. If it changes what Liquid does, use `{% %}`. Do not write JavaScript-style comparisons, callback calls, or ternaries inside output markup; branching and assignment belong to the tag language. Branch design and boolean operators are developed in `ch-06-conditions-and-logic`.

Output is also not permission to expose every value you can reach. Chapter 3’s object graph still applies: `{{ product.title }}` works because the current context supplies `product`; changing braces cannot make an unavailable object appear.

This distinction pays off during a code review. Start at an output delimiter and ask what value crosses into HTML, then trace back to the tag that selected or prepared it. Start at a tag delimiter and ask whether it controls flow, establishes a local name, or delegates rendering. A file becomes easier to change when the answer is visible in the delimiter instead of hidden in an oversized expression. If you find yourself stacking filters, conditions, and alternative output into one line, separate the control decision from the output rather than forcing the line to imitate a component expression.

## 4.2 Whitespace control (`{%-`, `-%}`) and why your HTML output is full of blank lines

Liquid preserves the literal whitespace around tags unless you tell it otherwise. The indentation and line breaks that make a `.liquid` file pleasant to edit can therefore become text nodes and empty lines in the delivered HTML. That is normally harmless between block elements, but it can create noisy source output, affect inline formatting, and make a captured fragment or attribute unexpectedly contain whitespace.

A hyphen directly inside the opening or closing delimiter trims adjacent whitespace. `{%-` removes whitespace before the tag; `-%}` removes whitespace after the tag. The same rule applies to output markup: `{{-` and `-}}` trim around an output expression.

```liquid
<ul class="product-tags" role="list">
  {% for tag in product.tags %}
    <li>{{ tag | escape }}</li>
  {% endfor %}
</ul>
```

This is readable and valid. Whether you trim it is a rendering decision, not a style contest. If the line breaks between list elements are useful while inspecting page source and do not affect output, leave them. Whitespace control earns its place when the literal text is materially unwanted.

```liquid
{%- capture product_label -%}
  {{ product.vendor | escape }}
  —
  {{ product.title | escape }}
{%- endcapture -%}
<p>{{ product_label }}</p>
```

Here trimming the `capture` boundaries prevents the indentation and boundary newlines from becoming part of the captured label. Notice the narrower claim: it does not remove all whitespace inside the capture. The intentional spaces and line break between the two output values remain content unless you structure the markup differently.

Do not add hyphens mechanically to every delimiter. They can join text that needs a space or make an inline sentence run together.

```liquid
<!-- Wrong: trimming can erase the intended separator -->
<span>{{ product.vendor | escape -}}</span>
<span>{{- product.title | escape }}</span>
```

```liquid
<!-- Right: write the intended separator as content -->
<span>{{ product.vendor | escape }} — {{ product.title | escape }}</span>
```

Inspect both browser output and page source when whitespace matters. The template’s indentation is not the product; the rendered HTML is. A practical rule is to trim at a boundary whose surrounding whitespace has no semantic job: a captured value, an optional block that otherwise leaves blank lines, or a known formatter boundary. Preserve whitespace when it separates human-readable inline words or intentional text nodes. Detailed output shaping and capture patterns belong in `ch-09-liquid-data-shaping`.

## 4.3 Comments: inline, block, and the `# ` shorthand

A Liquid comment is for authors, not buyers. `{% comment %}` starts a block comment and `{% endcomment %}` ends it. Liquid does not render the block or evaluate Liquid markup inside it, which makes the form useful for a multi-line explanation or temporarily disabling a Liquid fragment while you investigate a problem.

```liquid
{% comment %}
  This section expects a product template context.
  Keep title output escaped because it is merchant-authored text.
{% endcomment %}
```

Use HTML comments, `<!-- ... -->`, only when you intentionally want a comment to reach the browser. They are visible in page source and may be useful as a narrow integration marker, but they are not a safe place for private notes, credentials, internal URLs, or an explanation that buyers should not see.

The `{% liquid %}` tag provides a concise `#` comment shorthand inside its multi-line body. The hash comments out the rest of that line of Liquid source.

```liquid
{% liquid
  # Use the context-supplied resource; do not look it up again.
  assign title = product.title
%}
<h2>{{ title | escape }}</h2>
```

This shorthand belongs to a Liquid-only block. It is not an HTML comment and it is not a universal replacement for a block comment. Keep a comment close to the decision it explains; a comment that restates obvious syntax becomes stale before it becomes helpful. A good temporary comment records why the current rendering choice exists and what would invalidate it. Delete a debugging comment once the condition it reports is no longer part of the file’s contract. Use `{% doc %}` for the public contract of a reusable snippet or block, as covered in section 4.6.

## 4.4 `{% liquid %}` — multi-line tag syntax and when to prefer it

`{% liquid %}` lets you place multiple Liquid tags in one tag block, one operation per line. Inside its body, omit `{%` and `%}` around individual lines. This makes a short run of assignments and control flow easier to scan without interleaving repeated delimiters.

```liquid
{% liquid
  assign active_variant = product.selected_or_first_available_variant
  assign show_compare_price = false

  if active_variant.compare_at_price > active_variant.price
    assign show_compare_price = true
  endif
%}

<p class="product-price">{{ active_variant.price | money }}</p>
{% if show_compare_price %}
  <p class="product-price__compare">{{ active_variant.compare_at_price | money }}</p>
{% endif %}
```

The example keeps Liquid preparation together, then returns to ordinary HTML for the presentation. That division is the reason to prefer `{% liquid %}`: the reader can find the small decision pipeline before reading the markup that consumes it.

Do not put HTML inside a `{% liquid %}` block. It is tag syntax, not a compressed template mode. Likewise, do not use it for a single tag merely to appear advanced. One ordinary `{% assign %}` is clearer when there is only one operation.

```liquid
<!-- Wrong: HTML is not a Liquid tag line -->
{% liquid
  assign title = product.title
  <h2>{{ title }}</h2>
%}
```

```liquid
<!-- Right: end the Liquid-only preparation before writing HTML -->
{% liquid
  assign title = product.title
%}
<h2>{{ title | escape }}</h2>
```

Use the normal tag form when markup and decisions alternate closely. Use `{% liquid %}` when a compact, tag-only prelude improves the file’s shape. It does not create a new scope, make variables persistent, or change which objects the current render supplies. That last point matters in shared theme files: grouping assignments into a multi-line tag can improve local readability, but it cannot turn a contextual product value into a value a different template will receive.

## 4.5 `{% raw %}` and escaping Liquid inside JS templates

Sometimes a theme file needs to show the characters `{{` or `{%` literally. The classic case is a JavaScript template string, a code sample, or a third-party syntax fragment that uses braces which Liquid would otherwise parse. `{% raw %}` tells Liquid to leave everything inside the block untouched until `{% endraw %}`.

```liquid
{% raw %}
<template id="shipping-message-template">
  <p>Hello, {{ customerName }}.</p>
</template>
{% endraw %}
```

The browser receives `{{ customerName }}` literally. That does not make Liquid and JavaScript share a variable. It prevents Liquid from trying to interpret JavaScript’s placeholder syntax while the page is rendered.

Use the smallest raw region that solves the conflict. A large raw block can accidentally freeze Liquid output that really should be evaluated, and a raw block is not a security boundary. If merchant data enters JavaScript, choose an appropriate serialization and output strategy in the client-side chapters, especially `ch-37-javascript-and-theme-data`.

When you only need a literal delimiter in prose or an isolated string, output the brace characters rather than wrapping unrelated template content in `raw`.

```liquid
<p>Liquid output begins with {{ '{{' }} and ends with {{ '}}' }}.</p>
```

This technique asks Liquid to output string values that contain braces. It keeps the surrounding paragraph normal Liquid and makes the literal intent visible to the next reader.

## 4.6 `{% doc %}` — documenting snippets and blocks for humans, editors, and AI tooling

`{% doc %}` attaches documentation to a Liquid file without rendering that documentation to the storefront. Use it for a reusable snippet or block’s purpose, expected parameters, output contract, and examples. Unlike an ordinary comment, a doc block is structured documentation that Shopify tooling can use to surface file information to humans and supporting tools.

```liquid
{% doc %}
  Renders a product price for a supplied product.

  @param {product} product - The product whose price is displayed.
  @example
  {% render 'product-price', product: product %}
{% enddoc %}

<p class="product-price">{{ product.price | money }}</p>
```

Put the doc block near the top of the file so the contract is visible before implementation details. Describe actual inputs, not values the snippet happens to reach through a current caller. A good doc block makes a hidden dependency conspicuous: if you cannot state the parameter, the snippet boundary may be too implicit.

Doc blocks are not storefront copy and they do not validate a snippet at runtime. They cannot make `product` available, escape output, or replace schema documentation for merchant-facing settings. Use them to improve maintenance and discovery; use Liquid, schema, and tests to make behavior correct. Keep examples short enough to be true and update them with a changed parameter contract; a precise one-line example is more useful than a broad narrative that no longer matches the file. Section and block documentation conventions deepen in `ch-17-sections-as-editor-contracts` and `ch-21-snippet-apis`.

## Gotchas

- **Using `{{ }}` for a tag.** Output markup prints a value; it does not host `if`, `assign`, or `render` control syntax.
- **Trimming without inspecting the response.** Hyphens remove adjacent whitespace, including spaces a sentence or inline element may require.
- **Using an HTML comment for a private author note.** Browser source receives HTML comments; use a Liquid comment or doc block for implementation notes.
- **Putting markup inside `{% liquid %}`.** Its body accepts Liquid tag lines, not HTML.
- **Wrapping too much in `{% raw %}`.** Preserve only the literal syntax Liquid must not parse.
- **Treating `{% doc %}` as runtime validation.** It documents a contract; it does not enforce one.

## Checklist

- [ ] I can point to each delimiter in a file and say whether it outputs, executes, preserves, or documents.
- [ ] I add whitespace control only after identifying whitespace the response should not contain.
- [ ] I choose Liquid comments for author-only notes and HTML comments only for intentional browser-visible markers.
- [ ] I keep `{% liquid %}` blocks tag-only and narrow.
- [ ] I use `{% raw %}` only around literal template syntax and leave data handling to the appropriate runtime.
- [ ] I can document a reusable file’s inputs without making undocumented caller context part of its contract.

## Related

- `ch-03-the-shopify-object-graph` — which objects are legal to use once syntax is correct.
- `ch-05-variables-and-types` — values, assignments, and basic Liquid types.
- `ch-06-conditions-and-logic` — branches and boolean expressions.
- `ch-09-liquid-data-shaping` — capture and output shaping after syntax fundamentals.
- `ch-17-sections-as-editor-contracts` — schema and editor-facing configuration.
- `ch-21-snippet-apis` — explicit reusable snippet contracts.
- `ch-37-javascript-and-theme-data` — safely crossing into browser-owned behavior.

[1]: https://shopify.dev/docs/api/liquid "Shopify Liquid reference"
