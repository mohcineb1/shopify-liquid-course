<!-- STATUS: final -->
---
id: ch-15-exercise
title: "Compose a merchant-assignable product alternate"
chapter: ch-15
---

# Exercise — Compose a merchant-assignable product alternate

A merchandising team wants a durable **promo** page composition for selected products. The product data itself does not change; the page needs a different arrangement of approved sections that a merchant can assign in admin. The starter has a product alternate JSON template, two compatible section shells, a locale file, and a CSS asset. Complete the composition without turning the template into a product-data implementation or using a suffix as a temporary URL trick.

## The brief

Finish `templates/product.promo.json`. It must declare a main product section instance and a promo callout section instance in `sections`, then render those two IDs in that order in `order`. The main instance needs only settings supported by its starter schema. The promo callout must use a locale-backed default heading and a merchant-editable message setting. Do not add an unknown section type, arbitrary setting key, block type, resource lookup, Liquid tag, or a second product template.

The section files in the starter are deliberately small. The main product section is product-context-specific and may render the current `product` title. The promo callout is reusable only through its own explicit settings; it must not assume a product exists. Keep that distinction visible. A product assigned `product.promo` should receive the alternate page composition while remaining the same product resource and using the same underlying product data.

## Constraints

| Area | Requirement |
| --- | --- |
| Template identity | Use `product.promo.json`; `product` is the base type and `promo` is a durable assignment suffix. |
| JSON shape | Use `sections` and `order`; configure only known section types and schema-defined settings. |
| Composition order | Render the main-product instance first and the promo callout second. |
| Context | Only the main-product section may use the product-specific context. |
| Copy | Promo default copy comes from the supplied locale key; do not hard-code customer text in template JSON. |
| Scope | No Liquid template, literal product handle, global lookup, cart logic, JS, blocks, or checkout behavior. |

> [VERIFY] Verify the current JSON-template support and merchant-assignment workflow for product alternates before assigning this template in a production store.

## Acceptance criteria

The completed JSON parses as an object with exactly the intended section instances and order. A merchant can understand that `promo` is a product template alternate, not a different product type. The main section renders on a product template because it uses `product`; the promo callout still renders meaningful configured output without accessing `product`. A reviewer can trace every JSON setting to a section schema and every default customer string to the locale file.

Plan the assignment lifecycle. In the hand-off, state which products should receive the promo alternate, how to preview it before assignment, and what must happen to assignments before deleting the alternate after a campaign. Do not claim that a template suffix grants access to new product fields or turns the composition into a private route.

## Files to work in

```text
course/part-03-theme-architecture/ch-15-templates/
├── exercise.md
└── starter/
    ├── assets/section-promo-callout.css
    ├── locales/en.default.json
    ├── sections/main-product-promo.liquid
    ├── sections/promo-callout.liquid
    └── templates/product.promo.json
```

## Self-review

- [ ] The template base type, suffix, two section instances, and order are explicit.
- [ ] Every template setting is supported by its section schema.
- [ ] Product-specific context remains in the main product section only.
- [ ] Default customer copy is locale-backed and merchant assignment has a removal plan.
- [ ] The alternate is a durable page-composition choice, not a URL or data-access shortcut.
