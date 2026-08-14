<!-- STATUS: final -->
---
id: ch-13-exercise
title: "Map a theme component to the right homes"
chapter: ch-13
---

# Exercise — Map a theme component to the right homes

A team has received a rough “collection highlight” feature from a prototype. The prototype mixes markup, CSS, customer copy, configuration, and a reusable product fragment in one file. Your task is to turn it into a small Shopify-theme component whose files live in the correct platform-recognized homes. The exercise is about architecture, not visual novelty: every file must have an owning runtime consumer.

## The brief

Complete the starter structure for a merchant-configurable collection highlight. The section belongs in `sections/`, uses a schema-owned collection setting and heading setting, and renders a bounded contextual preview of the selected collection. Its reusable product markup belongs in a snippet with an explicit `product` input. Its stylesheet belongs in `assets/` and is included through the theme asset path. Customer-facing fallback copy must use a locale key; do not hard-code it into the section.

The section must distinguish a missing collection setting from a selected collection with no products. A missing setting is an editor configuration message. A selected empty collection is a storefront content state. Keep the product preview bounded to three cards, and do not create a new template, block, app integration, URL fetch, checkout behavior, or browser feature. The component is deliberately small enough to fit cleanly in the existing directory contract.

## File-placement contract

| Concern | Required home and contract |
| --- | --- |
| Merchant-configurable wrapper | `sections/collection-highlight.liquid` with a valid section schema. |
| Reusable card markup | `snippets/collection-highlight-card.liquid` with an explicit `product` input. |
| Component styles | `assets/section-collection-highlight.css`, loaded using `asset_url` and `stylesheet_tag`. |
| Customer fallback copy | A new locale key under `locales/`, resolved with `t`. |
| Collection composition | The section setting supplies the collection; no literal handle or global product lookup. |

> [VERIFY] Verify the exact locale-file shape and section-schema placement rules in the target theme before adding production files. This exercise requires no new special top-level directory or block file.

## Acceptance criteria

A reviewer should identify the runtime owner of every supplied file from its path. The section schema offers the heading and collection setting. When the setting is missing, the locale-backed configuration message appears. When the selected collection is empty, a different locale-backed storefront message appears. When it has products, at most three card snippets render. The snippet must not read `collection`, `section`, or an implicit caller variable.

The submitted component should not solve a capability a theme does not own. It should not add fetch calls, private application data, a checkout customization, an npm dependency, a new theme block, or a fake bundler pipeline. Explain in your hand-off why each file lives where it does and name the verified platform limit most relevant to keeping this convention small.

## Files to work in

```text
course/part-03-theme-architecture/ch-13-anatomy-of-a-theme/
├── exercise.md
└── starter/
    ├── assets/section-collection-highlight.css
    ├── locales/en.default.json
    ├── sections/collection-highlight.liquid
    └── snippets/collection-highlight-card.liquid
```

## Self-review

- [ ] Every file has a Shopify-recognized home and one clear runtime owner.
- [ ] Settings belong to the section schema; reusable markup has an explicit snippet API.
- [ ] Missing configuration, selected-empty content, and normal preview states remain distinct.
- [ ] Customer copy resolves through locale keys and styles through theme assets.
- [ ] No architecture surface outside the theme’s rendering responsibility was introduced.

Before hand-off, trace one rendered card from template state through section setting, snippet input, locale key, and asset include. This verifies the composition graph rather than only the visual result.
