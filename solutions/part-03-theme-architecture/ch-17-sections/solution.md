<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-17-solution
title: "Solution — Build a constrained, merchant-ready feature section"
chapter: ch-17
---

# Solution — Build a constrained, merchant-ready feature section

The finished feature list has one merchant task: present a short, editable set of service promises. Its schema exposes a heading and up to four feature blocks. It does not become a universal content builder, access a product or collection, or rely on a template-specific condition to determine whether it belongs on a page. The section type is reusable; each rendered instance receives its own ID, settings, blocks, and editor attributes.

## 1. Make repeated instances safe

The section builds the outer ID and heading relationship from `section.id`. Two instances of the same section type can therefore render on the same page without duplicate `id` attributes or broken `aria-labelledby` references. The component’s JavaScript uses the same unique outer selector to mark only the rendered instances it finds.

```liquid
<section class="feature-list" id="FeatureList-{{ section.id }}" aria-labelledby="FeatureListHeading-{{ section.id }}">
  {% if section.settings.heading != blank %}
    <h2 id="FeatureListHeading-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
  {% endif %}
</section>
```

`section.id` is instance identity, not a merchant label or business key. It makes DOM relationships local to one configured occurrence. The section remains safe if a merchant adds a second instance, moves either instance, or changes their headings.

## 2. Define a focused block contract

The section loops through `section.blocks`, then renders each feature block’s heading and body with `block.shopify_attributes`. Those attributes allow Shopify’s editor to identify and manipulate the actual rendered block element. The block type represents a repeatable feature item, so four blocks is a product choice: a concise set of promises remains scan-friendly and prevents the feature list from becoming an arbitrary long-form content builder.

```liquid
<ul class="feature-list__items">
  {% for block in section.blocks %}
    <li class="feature-list__item" {{ block.shopify_attributes }}>
      <h3>{{ block.settings.heading | escape }}</h3>
      <p>{{ block.settings.body | escape }}</p>
    </li>
  {% endfor %}
</ul>
```

The schema’s `max_blocks: 4` expresses the editor limit before the merchant attempts to add a fifth item. It is clearer than rendering an arbitrary number of blocks and silently hiding excess output. The section does not need product context because service promises are configured content, not product-specific data.

## 3. Localize the schema, not just storefront text

The schema uses `t:` keys for its name, setting labels, block name, and feature-setting labels. These keys are editor-facing strings. They live in the locale resource so a merchant can understand the component in the theme editor’s language. Customer-facing feature headings and bodies remain block settings supplied by the merchant; they are not schema labels.

```json
{
  "name": "t:sections.feature_list.name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:sections.feature_list.heading",
      "default": "t:sections.feature_list.default_heading"
    }
  ]
}
```

The solution localizes the default heading alongside the editor strings. Do not expose internal identifiers such as `feature_body` to merchants merely because they exist in the schema. The editor label is product copy and deserves the same review as a customer-visible instruction.

## 4. Restrict placement and choose composition deliberately

`enabled_on` expresses that the section is intended for selected page-oriented templates. This helps keep it out of incompatible editor contexts before rendering. The restriction is not a substitute for testing, but it is a better architecture guardrail than checking a template type in Liquid and producing an empty section after placement.

Use dynamic JSON placement when merchants should arrange the feature list among other allowed page regions. Use a static `{% section %}` call only when the feature list has a fixed structural position that merchants should not move. In both cases, the section schema controls its configuration; placement ownership determines whether its instance is template/group composition or fixed Liquid code.

> [VERIFY] Confirm current `enabled_on`, schema localization, and static/dynamic section rules before applying this exact configuration to a production theme.

## 5. Treat section resources as aggregate page cost

The `{% stylesheet %}` block contains only the list’s local spacing and layout rules. The `{% javascript %}` block adds a harmless instance marker, scoped through the unique section ID or a per-instance selector. It does not create a feature requirement: the heading and all block content remain complete without JavaScript.

Shopify aggregates these resource blocks for sections rendered on the page, but the review remains practical: two feature-list instances should not create duplicate initialization side effects; a globally mounted section would contribute on many more pages than a product-template section; and a third-party dependency would enlarge the aggregate payload. Use a normal theme asset when behavior is genuinely shared; use section resources when the ownership and lifecycle are specific to this section.

## 6. Validate the merchant and shopper interfaces

In the editor, add the section twice and verify each instance has its own heading ID and its own four-block maximum. Reorder feature blocks and confirm markup order follows the editor order. Test default, blank-heading, and configured-heading states. Attempt to add the section in an excluded location and confirm the placement restriction is visible in the editor.

In the storefront, test with JavaScript disabled and confirm all feature content remains usable. Then inspect the aggregate page output with two instances to ensure both receive the marker once and no duplicate ID occurs. This validates the full contract: schema for merchants, markup for shoppers, localized editor copy, safe instance identity, and narrow resource ownership.

## Validation matrix

| Test | Expected behavior |
| --- | --- |
| Two section instances | Unique outer/heading IDs and independent content. |
| Four feature blocks | All blocks render in merchant-defined order. |
| Fifth block attempt | Editor limit prevents addition. |
| No JavaScript | Heading and feature list remain complete. |
| Localized editor | `t:` keys resolve section and setting labels. |
| Placement | Section is available only in schema-approved contexts. |

## Checklist

- [x] Section and block instances have explicit, repeat-safe DOM/editor identity.
- [x] Four blocks expresses the content task rather than a generic builder limit.
- [x] Schema labels and default values are localized for merchants.
- [x] Placement restrictions express intended composition before runtime.
- [x] Section resources are narrow, progressive, and reviewed as aggregate page cost.

## 7. Review the section at both scales

The section must be reviewed as one instance and as a repeated component. One instance checks the merchant task: heading, four feature blocks, clear labels, default copy, and placement restrictions. Two instances check the implementation boundary: IDs remain unique, section-scoped JavaScript does not assume a singleton, CSS selectors do not depend on a specific template, and each block list remains owned by its own section instance.

This two-scale review prevents a common theme failure: a component works in a single preview but breaks when a merchant adds a second instance or moves it beside another section. The schema’s focused limits, the `section.id` DOM identity, and the block attributes work together to make duplication a supported editor action rather than an accidental edge case.

## 8. Release decision

Before release, validate the schema against current Shopify documentation, test the allowed templates in the editor, and inspect the page with and without JavaScript. If the component later needs product-specific content, do not append a hidden product setting or infer context from its location. Create a product-focused section contract or place the feature in product composition deliberately. The current section succeeds precisely because its data, editor task, placement, resources, and accessibility baseline remain narrow and explicit.
