<!-- STATUS: final -->
# Chapter 44 — Exercise

**Time:** 45–60 minutes · **Type:** CSS architecture refactor

## Goal

Refactor a merchant-configurable promotional section so its CSS has a clear delivery owner, its values are local tokens, and two instances coexist without leaking into one another.

## Context

A homewares theme accumulated `theme.css`, `all-sections.css`, and a copied inline style block in every promotional section. The “Seasonal edit” section appears on a home page and campaign landing page with different background, spacing, and image alignment settings. Changing the home page alters the landing page because the previous developer emits a global variable and a selector that reaches outside the section. The editor also shows duplicated stylesheet links.

Create a delivery design with a small base responsibility, a section responsibility, and a bounded first-view rule. The merchant controls color, spacing, and alignment through settings without entering arbitrary CSS. Do not add a framework or elaborate build system: this is an ownership and scoping problem.

## Requirements

- [ ] 1. Write `style-plan.md` classifying each starter stylesheet as base, feature, section, or obsolete. State one inclusion point for every retained file.
- [ ] 2. Move Seasonal edit rules into a section-owned stylesheet or documented `{% stylesheet %}` boundary. Do not include a global all-components file from the section.
- [ ] 3. Keep a minimal critical rule set in the layout-facing starter only if it protects initial geometry. Document a removal test; do not duplicate the section file inline.
- [ ] 4. Emit merchant background, gap, and alignment as semantic custom properties on the section root, using schema types that bound values.
- [ ] 5. Scope every selector from the Seasonal edit root. Two instances must render independently, and the section must not style a following sibling.
- [ ] 6. Use `section.id` as an inspection identifier where useful, but do not generate a unique uploaded CSS file per instance.
- [ ] 7. Reserve stable image/media geometry without JavaScript.
- [ ] 8. Write cold-load, two-instance, editor replacement, duplicate-link, and removal checks in `notes.md`.

## Constraints

- No Tailwind, SCSS, PostCSS, or package tooling is required; a future pipeline may be described only as a contract in `style-plan.md`.
- Do not put rich text, URLs, or unbounded merchant input in a `style` attribute.
- Do not solve leakage using selector escalation or `!important`.
- Do not edit another unit’s CSS.

## Starter

```text
starter/sections/seasonal-edit.liquid       global-token and duplicate-include problems
starter/assets/base.css                     shared base responsibility
starter/assets/section-seasonal-edit.css    local file with incomplete scope
```

Copy the files to a development theme and add two instances with different color and gap settings. Inspect rendered style attributes and stylesheet links before editing.

## Done when

- Two instances display independent background, gap, and alignment values.
- Section CSS loads from exactly one documented owner.
- Removing the section leaves no global rule changing unrelated content.
- Critical CSS is small, cold-load tested, and not a copied bundle.
- `style-plan.md` and `notes.md` let another developer remove or extend the section safely.

## Stretch

Sketch an SCSS/PostCSS output contract mapping nested source files to two flat final theme assets. State how review detects missing uploaded output or an asset reference without a final file.


## Inspection evidence

For each section instance, capture the root ID, its emitted token values, matched local selectors, and loaded stylesheet URL. Then remove one instance in the editor and confirm the remaining instance and adjacent content retain their own computed styles. This proves isolation rather than merely matching a screenshot.
Keep this evidence with the section’s delivery notes for future maintenance.
Review it carefully.
