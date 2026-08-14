<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 4 — Solution

## The approach

The audit is a single product-template section with two kinds of output: facts Shopify already supplies during the theme render, and one literal browser template that Liquid must leave alone. The solution makes the server-side decision before writing the report markup. That keeps the visible product title and availability message truthful in page source, works with JavaScript disabled, and leaves the browser template as a preserved literal rather than a second source of product state.

The syntax choices are deliberately narrow. `{% liquid %}` groups the decision-only preparation. Output markup prints the title and selected message. Whitespace trimming is used only on the message boundary, where the exercise asks to remove indentation-only blank lines. `{% comment %}` holds the private maintenance note, `#` documents the local decision inside the Liquid block, `{% raw %}` preserves a browser placeholder, and `{% doc %}` records the reusable section contract without becoming storefront content.

## Walkthrough

### 1. Keep the runnable starter boundary

The final file retains the stylesheet include, semantic section shell, heading setting, preset, and product-template placement. The schema now constrains the section to `product` templates because every visible product fact relies on the current product context. This is a context contract, not a styling preference: allowing the same file everywhere would make the product output ambiguous or blank.

The CSS is mirrored unchanged. The exercise is about syntax and rendering boundaries, so altering presentation would hide whether the completed Liquid stayed within the starter component.

### 2. Render the title and audit message in the first response

`{{ product.title | escape }}` writes the current merchant-controlled title as text. It is output markup because a value belongs at that position in HTML. `escape` prevents title characters such as `<`, `&`, or quotes from becoming browser markup.

The availability-specific message is selected before the report markup. It appears in the same initial document as the title; no client request or browser state is needed to make it correct. An available product receives the launch-review message, while an unavailable product receives the publish-warning message.

### 3. Put control flow in tags, not an output expression

The section uses `assign` and `unless` inside tag syntax. Liquid chooses the string first, then output markup renders the chosen string later. This avoids a JavaScript-style ternary or an `if` tag incorrectly placed inside `{{ }}`. The separation is useful even for this small branch: a reviewer can see the decision in one place and the report output in another.

The code starts with the available message, then changes it only when the product is unavailable. The result is readable because it describes the normal state first without forcing an extra HTML branch around the report paragraph.

### 4. Use a compact tag-only preparation group

`{% liquid %}` is the right boundary for the three preparation operations: a comment, an assignment, and an `unless` branch. The block contains no HTML. The section returns to normal markup immediately after preparation, which makes the file easy to scan: first decide the report value, then render it.

The `#` line records why the section uses `product` directly. It is a local implementation annotation and does not render. The product template already supplies the resource, so an additional lookup would duplicate the object-graph work and obscure the context contract taught in Chapter 3.

### 5. Trim only the requested report boundary

`{{- audit_message -}}` trims whitespace directly adjacent to the output value. It prevents the indentation around that message from becoming a stray blank line in the report. The surrounding paragraph remains ordinary HTML, and no broad source minification is used.

The important discipline is scope. Whitespace control can remove an intended word separator as easily as an unwanted newline. Here the audit message is the complete text node of its paragraph, so trimming its boundaries does not join independent buyer-facing words.

### 6. Keep private notes out of browser output

The multi-line `{% comment %}` explains why the availability choice remains server-rendered. It does not enter the response and does not evaluate its body. That makes it appropriate for a maintenance decision that shoppers should not see. An HTML comment would fail this requirement because browser source would expose it.

The private note and the `#` shorthand have different jobs. The block comment is a file-level maintenance note; the hash comment is attached to the nearby Liquid preparation. Neither replaces the `{% doc %}` block, which documents the public file contract.

### 7. Preserve the literal browser template

The `<template>` element is wrapped in `{% raw %}` because its browser placeholder uses `{{ auditStatus }}`. Liquid therefore delivers those exact brace characters to the browser instead of trying to resolve an object named `auditStatus`. The raw region is deliberately small: the section’s own heading, title, and audit message still require normal Liquid rendering.

This literal template does not make the browser responsible for the audit message. It is only an intact browser-side template source. The server-rendered facts remain the truthful initial state.

### 8. Document the contract without rendering it

The `{% doc %}` block names the section’s purpose, product-context expectation, heading input, and editor usage example. It appears near the top of the file, so a developer sees the contract before implementation details. Shopify tooling can use this structured documentation, but it is absent from storefront output.

Documentation does not validate the product context or escape a title. The schema and Liquid output do that work. A doc block is valuable because it makes a reusable boundary explicit, not because it changes runtime behavior.

## Full code

### `sections/syntax-audit.liquid`

```liquid
{% doc %}
  Renders a product-context syntax audit with an escaped title and availability message.

  @param {product} product - The current product supplied by a product template.
  @example
  Add the Syntax audit section to a product template in the theme editor.
{% enddoc %}

{% comment %}
  Keep the audit decision server-rendered so source inspection and JavaScript-disabled
  output agree with the storefront.
{% endcomment %}

{% liquid
  # Product context already supplies this resource; do not perform a second lookup.
  assign audit_message = 'Product is ready for launch review.'

  unless product.available
    assign audit_message = 'Product is unavailable; review launch messaging before publishing.'
  endunless
%}

{{ 'syntax-audit.css' | asset_url | stylesheet_tag }}

<section class="syntax-audit" aria-labelledby="SyntaxAudit-{{ section.id }}">
  <div class="syntax-audit__inner">
    <p class="syntax-audit__eyebrow">Launch quality check</p>
    <h2 id="SyntaxAudit-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
    <p class="syntax-audit__intro">Current product: {{ product.title | escape }}</p>

    <div class="syntax-audit__report" data-syntax-audit-report>
      <p>{{- audit_message -}}</p>
      {% raw %}
      <template id="syntax-audit-browser-template">
        <p>Browser preview: {{ auditStatus }}</p>
      </template>
      {% endraw %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Syntax audit",
  "tag": "section",
  "class": "section-syntax-audit",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Theme syntax audit"
    }
  ],
  "presets": [{ "name": "Syntax audit" }],
  "enabled_on": { "templates": ["product"] }
}
{% endschema %}
```

### `assets/syntax-audit.css`

```css
.syntax-audit { margin-block: 2rem; }
.syntax-audit__inner { border: 1px solid rgb(41 54 88 / 20%); border-radius: .75rem; background: #f8f9fd; color: #18213b; padding: clamp(1.25rem, 3vw, 2rem); }
.syntax-audit__report { border-block-start: 1px solid rgb(41 54 88 / 16%); margin-block-start: 1.25rem; padding-block-start: 1.25rem; }
.syntax-audit__report p { margin-block: 0; }
```

## What people get wrong here

- **Writing an `if` inside output markup.** Output delimiters print values; they do not host Liquid flow control. Select the value in tags, then output it.
- **Using an HTML comment for the private note.** It looks harmless in a template file but appears in browser source. Use a Liquid comment for author-only maintenance context.
- **Wrapping the whole section in `raw`.** That preserves the browser placeholder and also stops the title and audit message from rendering. Raw must cover only the literal conflicting syntax.
- **Applying hyphens everywhere.** Global trimming can collapse intended spaces. Trim a known response boundary, then inspect the rendered result.
- **Treating the doc block as a test.** It records the contract for readers and tooling; schema placement and Liquid code still enforce behavior.

## Stretch: direction only

For a snippet receiving both a product and a variant, document the two named inputs, the relationship the snippet expects between them, the HTML it renders, and one explicit `{% render %}` call. Keep the documentation beside the snippet and make no assumption that a caller-created local variable will cross the render boundary. The snippet API chapter develops that design work further.
