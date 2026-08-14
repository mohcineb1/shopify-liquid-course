<!-- STATUS: final -->
---
id: ch-12-exercise
title: "Build a guarded section diagnostic"
chapter: ch-12
---

# Exercise — Build a guarded section diagnostic

A merchant reports that a collection spotlight sometimes renders without cards. You need a diagnostic that distinguishes an empty contextual collection from a missing setting or an accidental client-side assumption, without dumping a broad collection or product Drop into public HTML. The starter provides a small spotlight section, a debug snippet, and CSS. Complete the work as a reproducible development diagnostic, not as a permanent customer feature.

## The brief

Finish the three starter files. The section must render a normal collection spotlight only when its selected collection setting is present. Its diagnostic output must be guarded by the supplied `settings.enable_theme_debug` condition. When the guard is off, the rendered section must contain neither `<pre>` debug output nor a diagnostic JSON script.

Inside the guard, render the supplied `debug` snippet with explicit inputs only. The snippet must display a human label and a minimal JSON-shaped payload showing the selected collection’s title and current product count. Do not pass the entire collection Drop, `collection.products | json`, arbitrary section settings, a cart, customer data, or `inspect` output. The debugging question is deliberately small: “did a collection arrive, and how many contextual products can this section see?”

Keep the normal component separate from its diagnostic state. A selected collection with zero products should retain its ordinary customer-facing empty message. A missing selected collection should render the starter’s configuration message. Neither state is a syntax error. Do not use client JavaScript, a broad lookup, URL parameter logic, or an editor-only workaround to decide these states.

## Constraints

| Area | Requirement |
| --- | --- |
| Normal source | Use only `section.settings.collection`; do not introduce a literal handle or `all_products`. |
| Empty states | Distinguish a missing collection setting from a selected collection with zero products. |
| Guard | Place all diagnostic output under `settings.enable_theme_debug`. |
| Snippet API | Pass an explicit label, title value, and count value; the snippet must not discover data itself. |
| Diagnostic payload | Serialize only title and count with `json` in readable static JSON structure. |
| Scope | Do not add browser code, runtime profiling claims, a full collection dump, customer/cart data, or production-facing debug copy. |

> [VERIFY] Before adopting a team debug guard, verify its real settings ownership and ensure it is disabled in a normal storefront response. This exercise does not establish a secret environment or permission model.

## Acceptance criteria

With no selected collection, the configuration message appears and no spotlight list is rendered. With a selected empty collection, the regular empty message appears. With a selected collection and debug disabled, the normal spotlight appears without any diagnostic markup. With debug enabled, the snippet renders exactly a label, title, and count payload; a title containing quotation marks must preserve valid JSON.

## Files to work in

```text
course/part-02-the-liquid-language-properly/ch-12-errors-debugging-observability/
├── exercise.md
└── starter/
    ├── assets/section-debug-spotlight.css
    ├── sections/debug-spotlight.liquid
    └── snippets/debug.liquid
```

## Self-review

- [ ] I can reproduce and distinguish the missing-setting and selected-empty states.
- [ ] Debug output has a narrow explicit snippet API and a disabled-by-default guard.
- [ ] No broad Drop data is rendered, even while diagnostics are enabled.
- [ ] The normal storefront response has no debug markup when the guard is false.
- [ ] All three starter files remain usable in a current theme.

Record the exact collection setting, guard state, and rendered response used during testing. This establishes a reproducible diagnostic state rather than a one-off visual observation.
