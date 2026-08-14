<!-- STATUS: final -->
---
id: ch-16-exercise
title: "Mount a merchant-managed persistent shell"
chapter: ch-16
---

# Exercise — Mount a merchant-managed persistent shell

A theme has a header hard-coded in `theme.liquid`, an announcement copied into several templates, and a cart-drawer shell placed inside a product section. Merchants cannot reorder the header content, the announcement drifts across page types, and the drawer disappears outside product pages. Your task is to create a clear persistent-composition boundary: a header group for shared header content and an aside group for a globally mounted drawer shell.

## The brief

Complete the starter group JSON files, layout fragment, header sections, aside section, stylesheet, and locale file. `header-group.json` must declare an announcement section followed by a site-header section. The layout must render the header group once, before the main template slot, using `{% sections 'header-group' %}`. It must preserve one `content_for_layout` in the main landmark; do not replace it with group output or enumerate the header sections directly in layout Liquid.

`aside-group.json` must declare a single cart-drawer shell. Mount it once near the end of the layout body, after the main content. The starter drawer is only a persistent markup shell: it needs clear labeling and a locale-backed empty-state message, but it must not add cart logic, product context, JSON data dumps, JavaScript, focus behavior, or a checkout implementation. The point is to establish document ownership before later client behavior is added.

The announcement and header sections must use explicit settings and locale-backed defaults. Neither may read `product`, `collection`, or another route-specific object. A section group renders across the layout frame; it must be useful without accidental page context. Keep the normal template composition inside `content_for_layout` and do not add a page-specific promotion to the header group.

## Constraints

| Area | Requirement |
| --- | --- |
| Header composition | `header-group.json` orders announcement first, then site header. |
| Layout mount | Render the header group once before main and aside group once after main with `{% sections %}`. |
| Template slot | Preserve exactly one `content_for_layout` inside the main landmark. |
| Aside scope | The drawer shell is global markup only; no cart behavior, product data, or browser code. |
| Data discipline | Group sections use settings, locale strings, and global values only. |
| Ownership | Do not add a template, resource lookup, hard-coded duplicate header, or page-specific section to either group. |

> [VERIFY] Verify current section-group names, allowed group section types, and `{% sections %}` layout syntax before adding this pattern to a production theme.

## Acceptance criteria

A reviewer can trace the persistent shell from the layout mount to ordered group JSON and then to schema-backed sections. The announcement and header render on a product, collection, and page route without relying on route-specific Drops. The main template output still renders once. The aside drawer shell appears after main content as a globally mounted region, but it contains no product-only markup or client behavior. Customer-facing default text resolves from the locale file.

In your hand-off, explain why the announcement belongs to the header group while a product size guide does not. State why a cart drawer shell may have a global mount even though its interactive behavior, focus management, and cart data policy remain deferred to later work.

## Files to work in

```text
course/part-03-theme-architecture/ch-16-section-groups/
├── exercise.md
└── starter/
    ├── assets/section-group-shell.css
    ├── locales/en.default.json
    ├── sections/announcement-bar.liquid
    ├── sections/cart-drawer-shell.liquid
    ├── sections/header-group.json
    ├── sections/site-header.liquid
    ├── sections/aside-group.json
    └── layout/theme-fragment.liquid
```

## Self-review

- [ ] Group JSON owns ordered instances; layout owns a single mount for each persistent region.
- [ ] Header and aside members avoid route-specific data assumptions.
- [ ] The template render slot remains singular and distinct from group composition.
- [ ] Default copy is locale-backed; member settings are schema-defined.
- [ ] The aside shell is mounted globally without prematurely adding client or checkout behavior.
