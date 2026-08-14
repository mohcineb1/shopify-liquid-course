<!-- STATUS: final -->
---
id: ch-17-exercise
title: "Build a constrained, merchant-ready feature section"
chapter: ch-17
---

# Exercise — Build a constrained, merchant-ready feature section

A team has a generic “content builder” section with dozens of settings, unbounded blocks, hard-coded English editor labels, duplicate DOM IDs when added twice, and an inline script copied into every template. Replace it with a focused feature-list section that gives merchants a clear task: introduce a short list of product-agnostic service promises. The section must be understandable in the editor, safe to add more than once, and intentionally limited in both blocks and delivery behavior.

## The brief

Complete the starter section, CSS resource block, JavaScript resource block, and locale file. The markup must use `section.id` to make its heading and list relationship unique per instance. It must render the section heading setting when present and loop only through the allowed feature blocks. Each block must include `block.shopify_attributes` and render a heading plus body from its own settings.

The schema must supply a merchant-facing `t:` section name and `t:` setting/block labels, a `tag`, a `class`, heading settings, a feature block definition, `max_blocks: 4`, a preset, a default heading value, section-schema `locales`, and an `enabled_on` restriction suitable for ordinary page templates. Do not create a universal content builder, expose resource pickers, use `product` or `collection`, add a `limit` merely as a substitute for coherent block design, or make placement restrictions a hidden Liquid condition.

Use `{% stylesheet %}` for narrowly owned presentation and `{% javascript %}` only for the starter’s harmless instance marker. The JavaScript must select the rendered section by its unique ID and must remain valid when two instances exist. Do not claim the blocks create separate network files or add a third-party library. The section must remain readable without JavaScript.

## Constraints

| Area | Requirement |
| --- | --- |
| Instance identity | Build heading/list IDs from `section.id`; two instances must not collide. |
| Schema | Use localized `t:` labels, clear name/tag/class, settings, feature blocks, `max_blocks: 4`, preset, default, locales, and `enabled_on`. |
| Block contract | Render only defined feature blocks with `block.shopify_attributes`. |
| Placement | Use the schema restriction; do not put template-routing logic in the section. |
| Resources | Scope CSS/JS to this component and keep the markup useful without JS. |
| Scope | No product data, broad settings surface, arbitrary block types, external dependencies, or manual asset URLs. |

> [VERIFY] Verify the current section schema syntax and allowed `enabled_on`, `locales`, stylesheet, and JavaScript resource-block behavior before applying this exact section to a production theme.

## Acceptance criteria

A merchant sees a section named in their editor language, can edit a heading, and can add at most four named feature blocks. Two instances on one page render unique landmarks and receive only their own blocks. Reordering blocks in the editor changes the display order without changing the section code. With JavaScript disabled, heading and feature content remain complete. The section cannot be added where its schema placement restriction disallows it.

In the hand-off, name the merchant task this schema supports, explain why four blocks is a product constraint rather than an arbitrary technical ceiling, and distinguish the schema-localized editor strings from customer-facing feature text. State the page types that should use dynamic JSON placement versus any case where a static `{% section %}` call would be appropriate.

## Files to work in

```text
course/part-03-theme-architecture/ch-17-sections/
├── exercise.md
└── starter/
    ├── locales/en.default.json
    └── sections/feature-list.liquid
```

## Self-review

- [ ] The schema expresses a focused merchant task with localized labels and appropriate placement.
- [ ] Section/block instance IDs and editor attributes remain correct when repeated or reordered.
- [ ] The block maximum supports content quality rather than a generic builder.
- [ ] Section CSS/JS have narrow ownership and preserve a useful no-JS render.
- [ ] The implementation avoids accidental resource context and unsupported schema assumptions.
