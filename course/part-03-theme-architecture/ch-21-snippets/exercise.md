<!-- STATUS: final -->
---
id: ch-21-exercise
title: "Build a documented recursive navigation snippet"
chapter: ch-21
---

# Exercise — Build a documented recursive navigation snippet

A theme uses `{% include 'menu' %}` from several layouts. The partial reads a hidden `menu_links` assignment, changes a caller variable, assumes a two-level hierarchy, and emits unlabelled nested lists. Replace it with an isolated, documented `render` API that can render an explicitly supplied navigation level recursively. The caller owns menu selection; the snippet owns one level of accessible list markup.

## The brief

Complete the starter `menu-list` snippet, its calling section, and the CSS asset. Add a `{% doc %}` block that documents the required `links` parameter, optional `label`, optional `level`, expected link shape, and output behavior for blank input. The section must choose its menu through its own setting and call the snippet with named arguments. Do not use `include`, an ambient assignment, a global menu lookup, or a second rendering API hidden inside CSS or JavaScript.

The snippet must guard `links == blank` before emitting a list. For each link, render an escaped title and URL. When a link has children, recursively call the same snippet with `links: link.links`, a derived label, and an incremented level. The recursion must terminate because the child array becomes blank at leaves. Keep nested `ul`/`li` structure valid and use the supplied label for the outer navigation landmark. Do not promise an interactive disclosure menu; this exercise is server-rendered navigation structure only.

Use `render` named arguments rather than passing a large context object. The caller owns which navigation menu is selected and whether the whole navigation region exists. The snippet receives only values needed to render one level. Styling may target the documented level class but must not use CSS to hide unrendered hierarchy or fake a recursion rule.

## Constraints

| Area | Requirement |
| --- | --- |
| Call boundary | Use `render` with named `links`, `label`, and `level` inputs. |
| Documentation | Describe required/optional params, blank behavior, link shape, and output in `{% doc %}`. |
| Guard | Render no list when `links` is blank. |
| Recursion | Re-render only for nonblank `link.links` with an incremented level. |
| Ownership | Section selects menu; snippet renders supplied level only. |
| Scope | No `{% include %}`, ambient variable, hard-coded two-level limit, client-side menu behavior, product data, or app integration. |

> [VERIFY] Verify current `{% doc %}` support and the current navigation link properties/depth relevant to the target menu before using this exact implementation in production.

## Acceptance criteria

A reviewer can see the complete snippet API at its call site and in its doc block. A blank menu emits no broken wrapper. A one-level menu renders one accessible list; a nested menu recursively renders child lists without duplicate scope assumptions. The caller can invoke the same snippet for another menu by passing different links and labels. No caller-local assignment is necessary for the snippet to work.

In your hand-off, explain why `render` isolation requires named inputs, why data selection belongs in the section, and why menu recursion is appropriate while a fixed two-level menu should not be made recursive merely for abstraction. Distinguish this developer renderer from a merchant-configurable navigation section or an editor-managed block.

## Files to work in

```text
course/part-03-theme-architecture/ch-21-snippets/
├── exercise.md
└── starter/
    ├── assets/section-menu-links.css
    ├── sections/menu-links.liquid
    └── snippets/menu-list.liquid
```

## Self-review

- [ ] Callers pass all required values explicitly through `render`.
- [ ] The snippet documents its API, guards blank input, and has a finite recursive step.
- [ ] Nested markup retains useful navigation/list semantics.
- [ ] Selection remains in the section; rendering remains in the snippet.
- [ ] No legacy scope sharing or hidden data lookup remains.
