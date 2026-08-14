<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 6 — Solution

## The approach

The release brief has one owner for each value. The section owns the current product traversal and merchant settings because it is rendered on a product template. The loop owns the numeric `check_number`. The snippet owns only one check’s markup and receives its values through named render arguments. The captured summary is deliberately rendered HTML, so its name says so; it is not used later as a product or numeric value.

That partition avoids the failure the exercise describes. Nothing in the snippet assumes a parent assignment. Nothing reuses `product` or `section` as a local label. The final HTML is fully server-rendered, so editor previews and JavaScript-disabled visits receive the product title, configured audience, and ordered checks directly from the theme render.

## Walkthrough

### 1. Preserve the real component boundary

The solution keeps the section, snippet, and CSS file from the starter. The section remains the page-level component: it owns schema, context restriction, and the ordered list. The snippet remains a small list-item component. Copying the list item three times into the section would satisfy visual output while failing the reuse requirement. Moving the entire feature into a snippet would hide the section’s merchant settings and template placement contract.

The schema restricts the section to product templates because the summary reads the current `product`. That makes the data root explicit rather than relying on what happens to be available at one insertion point. The CSS is copied unchanged because the task is about value and scope boundaries, not presentation.

### 2. Prepare source values with `assign`

The first `{% liquid %}` block gives names to the current product title, merchant audience label, and numeric check count. `assign` is appropriate because these are values the rest of the section will still use as values. `check_count` remains numeric so the range loop can consume it without first turning it into rendered output.

`product_title` and `audience_label` also reveal ownership. A reviewer can trace the first to the product context and the second to a section setting. Neither name claims to be a global variable. If the section moves to another product template, the same sources still apply; if it moves to a non-product context, the schema prevents an ambiguous render.

### 3. Capture only deliberate rendered markup

The summary contains a bold product title plus audience text, so it is intentionally captured as a rendered fragment. The name `release_summary_html` records that it now represents markup. Its source values are escaped inside the capture, before the fragment is printed in the summary container.

This is the narrow use case for `capture`: the final unit of value is the assembled markup. The solution does not capture `check_count`, `check_number`, or `product_title` merely to print them later. Turning those values into rendered strings early would make the loop and the snippet contract harder to reason about.

### 4. Use the loop for deterministic ordered inputs

The `(1..check_count)` range creates three numeric check positions. On each iteration, `check_number` is the loop-owned input, while `check_label` is an explicitly constructed display string. The section passes both to the snippet. The visible ordinal therefore comes from a numeric value, and the human-readable label is a separate presentation value.

The solution deliberately does not use `increment`. A loop already supplies the correct sequence and scopes it to the ordered checks. A named counter would add a separate namespace without improving the local contract, and would invite a later reader to wonder whether another component relies on the same counter name.

### 5. Declare the snippet API at each render call

```liquid
{% render 'release-check', ordinal: check_number, label: check_label, product_title: product_title %}
```

This line is the snippet’s complete input contract. The snippet receives `ordinal`, `label`, and `product_title`; it does not reach back into the section for `audience_label`, `check_count`, or any caller local. A second caller can supply a different title and label without editing the snippet or recreating its parent’s variable names.

Inside the snippet, the same names are used only for its own output. The title and label are escaped at the output boundary. The snippet does not mutate anything in the caller, and the caller cannot rely on a snippet assignment changing its values after the render returns. That isolation is the reuse guarantee, not a limitation to work around.

### 6. Review the output by ownership

Test the section on a product template with an audience label that contains punctuation or markup-like characters. The summary should output it as text. Change the heading and audience label in the editor; only the section-owned summary changes. Inspect page source: three `<li>` elements should appear in increasing order, each carrying the product title supplied at its render call.

If a check renders blank, start at the render call. Confirm each named argument exists in the section context, then inspect the snippet’s expected names. Do not add parent-looking fallbacks inside the snippet. That would make one caller appear to work while concealing an incomplete input contract for the next caller.

A practical reuse test is to render the same snippet from a second temporary component with a literal ordinal, a different label, and a known product title. If the output remains correct without copying the original section’s assignments, the snippet depends on its declared arguments rather than an invisible ambient scope. Remove the temporary test after verification; its purpose is to validate the API boundary, not to create a second competing component. This test also makes an accidental parent dependency visible before it reaches a template where a merchant or a future author discovers it only as unexplained blank output.

## Full code

### `sections/release-brief.liquid`

```liquid
{{ 'release-brief.css' | asset_url | stylesheet_tag }}

{% liquid
  assign product_title = product.title
  assign audience_label = section.settings.audience_label
  assign check_count = 3
%}

{% capture release_summary_html %}
  <p><strong>{{ product_title | escape }}</strong> is being reviewed by {{ audience_label | escape }}.</p>
{% endcapture %}

<section class="release-brief" aria-labelledby="ReleaseBrief-{{ section.id }}">
  <div class="release-brief__inner">
    <p class="release-brief__eyebrow">Release coordination</p>
    <h2 id="ReleaseBrief-{{ section.id }}">{{ section.settings.heading | escape }}</h2>

    <div class="release-brief__summary" data-release-brief-summary>
      {{ release_summary_html }}
    </div>

    <ol class="release-brief__checks" data-release-brief-checks>
      {% for check_number in (1..check_count) %}
        {% assign check_label = 'Release check ' | append: check_number %}
        {% render 'release-check', ordinal: check_number, label: check_label, product_title: product_title %}
      {% endfor %}
    </ol>
  </div>
</section>

{% schema %}
{
  "name": "Release brief",
  "tag": "section",
  "class": "section-release-brief",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Release brief" },
    { "type": "text", "id": "audience_label", "label": "Audience label", "default": "Store team" }
  ],
  "presets": [{ "name": "Release brief" }],
  "enabled_on": { "templates": ["product"] }
}
{% endschema %}
```

### `snippets/release-check.liquid`

```liquid
<li class="release-brief__check">
  <strong>{{ ordinal }}. {{ label | escape }}</strong>
  <span>{{ product_title | escape }} has an explicit release-review input.</span>
</li>
```

### `assets/release-brief.css`

```css
.release-brief { margin-block: 2rem; }
.release-brief__inner { border: 1px solid rgb(20 79 69 / 22%); border-radius: .75rem; background: #f4fbf8; color: #123c35; padding: clamp(1.25rem, 3vw, 2rem); }
.release-brief__checks { border-block-start: 1px solid rgb(20 79 69 / 16%); margin-block: 1.25rem 0; padding-block-start: 1.25rem; }
```

## What people get wrong here

- **Calling `render` with no arguments because the parent assigned the values.** Snippet isolation makes that an incomplete API, not a shortcut.
- **Using `capture` for every intermediary.** Captured content is rendered string output; calculations and source objects should remain assigned values.
- **Using `increment` to share an index with another component.** Its counter namespace is separate from ordinary data flow and obscures ownership.
- **Calling a captured fragment `summary`.** The `_html` suffix warns reviewers that the value is markup, not resource data.
- **Shadowing `product` inside the loop.** A name such as `check_number` says exactly what the inner value means and leaves the root object readable.

## Stretch: direction only

A snippet that receives both a product and a formatted display label should keep those roles in separate arguments, such as `product` and `price_label`. The caller owns both transformations and passes them explicitly. If the snippet renders blank, inspect the named render arguments first, then the snippet’s documented contract, then the caller’s object context. Do not add a fallback that reaches for an unpassed parent variable.
