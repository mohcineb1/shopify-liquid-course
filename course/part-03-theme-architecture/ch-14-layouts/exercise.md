<!-- STATUS: final -->
---
id: ch-14-exercise
title: "Build a minimal but correct alternate layout"
chapter: ch-14
---

# Exercise — Build a minimal but correct alternate layout

A team wants a distraction-reduced campaign frame for one informational template. The original prototype removed most of the normal shell, moved a Shopify placeholder into a snippet, and then duplicated the template output in the body to “make sure the page appears.” Your task is to replace that prototype with a deliberately minimal alternate layout that still respects the document, platform, and accessibility contracts a layout owns.

## The brief

Complete the starter `layout/minimal.liquid`, stylesheet, and landing-page snippet. The layout must contain a valid document frame, one `<head>`, one `<body>`, one `content_for_header` placeholder inside the head, and one `content_for_layout` placeholder in a primary content landmark. Do not capture, filter, render, move, conditionally suppress, or duplicate either placeholder.

The frame may omit the normal theme navigation, but it must retain a language attribute, a skip link that targets the main landmark, a stylesheet loaded through `asset_url` and `stylesheet_tag`, and the supplied compact brand link. The brand link belongs in the layout because it is part of this document frame; the body content of the campaign page belongs in the template render slot. Do not add product or collection queries to the layout.

The supplied snippet is a small campaign callout for template content. Give it an explicit `heading` and `body` API, and keep it free of `content_for_header`, `content_for_layout`, document tags, or global asset delivery. The exercise is not asking for a password layout, gift-card layout, checkout customization, `layout none`, client JavaScript, or a new template. It is specifically a normal alternate frame selected by a template that already owns its page composition.

## Constraints

| Area | Requirement |
| --- | --- |
| Head contract | `content_for_header` appears exactly once, unmodified, inside `<head>`. |
| Render contract | `content_for_layout` appears exactly once inside `<main id="MainContent">`. |
| Layout scope | Language, skip link, compact brand, and frame asset belong in `layout/minimal.liquid`. |
| Snippet scope | The callout accepts explicit heading/body inputs and renders no document or Shopify slots. |
| Resource boundary | No resource-specific Drop traversal, global lookup, checkout work, or browser feature. |
| Delivery | The stylesheet uses a theme asset path, not a hard-coded external URL. |

> [VERIFY] Verify the current supported template use of an alternate layout before assigning `layout 'minimal'` in a production theme. This exercise assumes an existing compatible template selection.

## Acceptance criteria

Inspect the final layout source: the two Shopify placeholders each occur once and have the correct document placement. The main element is the skip-link target. A template rendered through the layout appears only once. The layout remains valid for a route without a product or collection Drop. The callout snippet can be rendered with literal test strings and does not depend on the layout’s context.

Describe in your hand-off why the compact brand link stays in the layout while the campaign callout stays in a snippet. Also state why a cosmetic campaign variation is an alternate document-frame decision here, not a reason to move Shopify placeholders or to modify the normal `theme.liquid` frame for every route.

## Files to work in

```text
course/part-03-theme-architecture/ch-14-layouts/
├── exercise.md
└── starter/
    ├── assets/layout-minimal.css
    ├── layout/minimal.liquid
    └── snippets/campaign-callout.liquid
```

## Self-review

- [ ] One unmodified `content_for_header` is inside head and one unmodified `content_for_layout` is inside main.
- [ ] The alternate layout owns only its document frame, not route-specific data.
- [ ] The main landmark and skip link remain connected.
- [ ] The snippet has an explicit narrow API and no layout responsibility.
- [ ] The component adds no checkout, password, gift-card, or client-runtime behavior.
