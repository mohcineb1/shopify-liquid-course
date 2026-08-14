<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 7 — Solution

## The approach

The panel has four independent concerns: product availability, seasonal-tag eligibility, campaign tone, and a merchant-configured notice. The solution establishes eligibility first and only lets tone alter presentation after the product is both available and seasonal. This is the critical ordering rule: tone is not an eligibility override, and a blank notice is not evidence that a product is unavailable.

Rather than placing all rules in one expression, the section assigns a named `is_seasonal` decision, then nests the availability and eligibility branches. This makes the otherwise ungroupable logic visible in the file. The notice has its own `default` fallback because it is a merchant setting, not a source of product state.

## Walkthrough

### 1. Keep the starter component and context

The completed section retains its heading, tone selector, notice setting, shell, and stylesheet. It is enabled only on product templates, where the current `product` object is supplied. The CSS remains unchanged. The task is to repair the data rule, not to disguise a logic error with a different interface.

### 2. Make availability the outer decision

The code begins with a non-eligible seasonal message, then identifies tag membership, then applies availability as the outer requirement. If `product.available` is false, the section always replaces the result with the unavailable message. It does not matter whether the product has the `seasonal` tag or which tone a merchant selected.

```liquid
{% if product.available %}
  {% if is_seasonal %}
    {% assign status_message = 'Eligible for campaign promotion.' %}
  {% endif %}
{% else %}
  {% assign status_message = 'Not eligible: this product is unavailable.' %}
{% endif %}
```

This is deliberately nested. A one-line expression involving `and` and `or` would be evaluated right to left and cannot be regrouped with parentheses. The nesting represents the business order directly: first an available product is required; then seasonal membership permits the promotion.

### 3. Name tag membership before combining it

`is_seasonal` starts as `false` and becomes `true` only when `product.tags contains 'seasonal'`. This flag makes the data contract explicit. It also separates the membership question from the later availability branch, so a reviewer can test each state without mentally parsing an operator chain.

The tag is an exact merchant-managed membership value, not a substring guessed from product description text. A tag with a similar word does not establish eligibility unless it is the exact value the campaign rule requires. If production eligibility relies on another Shopify resource surface, verify that surface before substituting it for the documented tag contract.

### 4. Apply tone only to an eligible product

The `case` block appears inside `if product.available and is_seasonal`. That location prevents a priority tone from producing a campaign message for an unavailable or untagged product. `priority` gets a distinct message. `quiet` and `standard` share the same outcome through a multi-value `when`, and `else` keeps unexpected selector values buyer-safe.

The `and` in this small condition is safe because the intended relationship is direct and needs no alternate `or` group. As a review rule, keep the `case` nested under the established eligibility boundary instead of using tone as a competing branch in the main status decision.

### 5. Keep the notice fallback independent

```liquid
{{ section.settings.campaign_notice | default: 'No campaign notice has been configured.' | escape }}
```

The `default` filter makes blank merchant notice content readable without modifying eligibility. `escape` protects both the configured text and fallback at the output boundary. This is an appropriate fallback because the setting is explicitly optional and the sentence identifies its owner. It would be wrong to use the same fallback for a missing `product` property or an unpassed snippet input, where blank output would indicate a contract defect rather than a normal merchant state.

### 6. Test the state table, not one happy path

Test five combinations: unavailable seasonal product, available seasonal product, available untagged product, priority tone on an eligible product, and blank notice on each of those products. Availability must control the first result. Tag membership controls eligibility only after availability. Tone must alter only an eligible presentation, and a blank notice must alter only the notice region. If any state change affects a different region, the branches have coupled independent concerns.

Also test the uncomfortable combination: an unavailable product carrying the `seasonal` tag with the priority tone selected. It must still render the unavailable result and no priority presentation. That single case proves the implementation did not accidentally treat tag membership or a merchant configuration choice as an override for inventory state. Test it in source as well as in the editor, because the feature is owned by the initial theme response.

Finally, change only the campaign notice while leaving availability, tags, and tone fixed. The status region should not move between branches. This isolates the fallback test from the eligibility test and demonstrates that `default` is serving its narrow presentation role rather than becoming a catch-all rule engine. If that small setting change alters eligibility, the component has merged two independent contracts and should be simplified before it reaches a merchant-facing campaign.

## Full code

### `sections/release-eligibility.liquid`

```liquid
{{ 'release-eligibility.css' | asset_url | stylesheet_tag }}

{% liquid
  assign is_seasonal = false
  assign status_message = 'Not eligible: this product is not in the seasonal campaign.'
  assign tone_message = 'Standard campaign review.'

  if product.tags contains 'seasonal'
    assign is_seasonal = true
  endif

  if product.available
    if is_seasonal
      assign status_message = 'Eligible for campaign promotion.'
    endif
  else
    assign status_message = 'Not eligible: this product is unavailable.'
  endif
%}

<section class="release-eligibility" aria-labelledby="ReleaseEligibility-{{ section.id }}">
  <div class="release-eligibility__inner">
    <p class="release-eligibility__eyebrow">Campaign review</p>
    <h2 id="ReleaseEligibility-{{ section.id }}">{{ section.settings.heading | escape }}</h2>

    <div class="release-eligibility__status" data-release-eligibility-status>
      <p>{{ product.title | escape }} — {{ status_message }}</p>
      {% if product.available and is_seasonal %}
        {% case section.settings.campaign_tone %}
          {% when 'priority' %}
            <p>Priority campaign review is active.</p>
          {% when 'quiet', 'standard' %}
            <p>{{ tone_message }}</p>
          {% else %}
            <p>Standard campaign review.</p>
        {% endcase %}
      {% endif %}
    </div>

    <div class="release-eligibility__notice" data-release-eligibility-notice>
      <p>{{ section.settings.campaign_notice | default: 'No campaign notice has been configured.' | escape }}</p>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Release eligibility",
  "tag": "section",
  "class": "section-release-eligibility",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Release eligibility" },
    { "type": "select", "id": "campaign_tone", "label": "Campaign tone", "default": "standard", "options": [
      { "value": "standard", "label": "Standard" },
      { "value": "priority", "label": "Priority" },
      { "value": "quiet", "label": "Quiet" }
    ] },
    { "type": "textarea", "id": "campaign_notice", "label": "Campaign notice", "default": "" }
  ],
  "presets": [{ "name": "Release eligibility" }],
  "enabled_on": { "templates": ["product"] }
}
{% endschema %}
```

### `assets/release-eligibility.css`

```css
.release-eligibility { margin-block: 2rem; }
.release-eligibility__inner { border: 1px solid rgb(77 44 108 / 22%); border-radius: .75rem; background: #fbf8ff; color: #312044; padding: clamp(1.25rem, 3vw, 2rem); }
.release-eligibility__status, .release-eligibility__notice { border-block-start: 1px solid rgb(77 44 108 / 16%); margin-block-start: 1rem; padding-block-start: 1rem; }
```

## What people get wrong here

- **Putting tone before availability.** A priority setting then appears to make an unavailable product eligible, which violates the business priority.
- **Using parentheses in a combined condition.** Liquid does not support them; the apparent grouping never becomes a valid solution.
- **Appending an `or` to the eligibility line.** Right-to-left precedence can silently change which prerequisite applies. Use nested branches or a named decision.
- **Using the notice fallback as the status fallback.** A blank merchant setting and an unavailable product are different owners and must yield different results.
- **Using description text to determine the campaign.** `contains` works syntactically but does not replace an exact merchant-controlled tag contract.
- **Putting the `case` outside the eligibility boundary.** The tone then produces campaign presentation for a product that the status branch has correctly rejected. Presentation can refine eligibility; it cannot create it.

## Stretch: direction only

Write the candidate conditions as state-table rows before code. Identify the state that must block every promotion result, then nest the remaining prerequisites under it. Introduce a named flag when the same intermediate fact is read by more than one branch. Do not try to reproduce your grouping with parentheses; Liquid’s source should expose it through its structure.
