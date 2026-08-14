<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 44 — Solution

## The approach

The completed section has one global foundation and one local style owner. `base.css` remains a layout-wide responsibility and is included from the layout, not from this section. `all-sections.css` is obsolete because it has no specific owner. `section-seasonal-edit.css` is included by the section exactly once and contains only rules that begin at `.seasonal-edit`.

Merchant configuration becomes bounded custom properties on each section root. The section ID exists for inspection and editor-specific diagnostics, but CSS does not require a per-instance uploaded file or an interpolated ID selector. A color setting provides the background value, a range produces a bounded pixel gap, and a select provides a known alignment value. The section’s CSS consumes semantic variables and contains its media geometry locally. This lets two instances have different values without using `:root`, a page-global CSS variable, or selectors that target a following sibling.

Critical CSS is deliberately tiny and stays in the layout-owned base responsibility: only the structural minimum necessary for first-view stability. The section does not duplicate its stylesheet inline. Its removal test checks a cold load with and without the small layout rule, while the regular section asset remains the complete visual source.

## Walkthrough

**1 — inventory.** `base.css` is retained as base; `section-seasonal-edit.css` is retained as section; `all-sections.css` is obsolete. The plan names the one include owner for each retained file.

**2 — one local delivery boundary.** The section emits its named stylesheet once. It does not also include base CSS, and it does not import a generic archive whose unrelated selectors become its responsibility.

**3 — critical discipline.** A few layout-safe declarations can protect base geometry in a layout include. They are not a copy of visual component rules. Disable them in a cold preview to prove what they protect.

**4 — settings as tokens.** The root style attribute contains only output from bounded color, range, and select settings. It uses names such as `--seasonal-edit-bg`, not global visual guesses.

**5 and 6 — instance boundary.** `.seasonal-edit` is both a component namespace and an individual root. `section.id` makes the instance inspectable, while values differ through variables. No selector reaches sibling content.

**7 — stable media.** The local media wrapper establishes `aspect-ratio`; CSS then fills the predictable box without JavaScript.

**8 — operational evidence.** The notes test cold delivery, two instances, editor replacement, link duplication, and removal.

## Full code

### `sections/seasonal-edit.liquid`

```liquid
{{ 'section-seasonal-edit.css' | asset_url | stylesheet_tag }}
<section
  id="SeasonalEdit-{{ section.id }}"
  class="seasonal-edit"
  style="--seasonal-edit-bg: {{ section.settings.background }}; --seasonal-edit-gap: {{ section.settings.gap }}px; --seasonal-edit-align: {{ section.settings.alignment }};"
>
  <div class="seasonal-edit__media"></div>
  <div class="seasonal-edit__content">
    <h2>{{ section.settings.heading | escape }}</h2>
  </div>
</section>
{% schema %}
{"name":"Seasonal edit","settings":[{"type":"color","id":"background","label":"Background","default":"#f4f1eb"},{"type":"range","id":"gap","label":"Gap","min":8,"max":64,"step":4,"unit":"px","default":24},{"type":"select","id":"alignment","label":"Alignment","options":[{"value":"start","label":"Start"},{"value":"center","label":"Center"}],"default":"start"},{"type":"text","id":"heading","label":"Heading","default":"Seasonal edit"}],"presets":[{"name":"Seasonal edit"}]}
{% endschema %}
```

### `assets/base.css`

```css
*, *::before, *::after { box-sizing: border-box; }
.seasonal-edit { min-height: 1px; }
```

### `assets/section-seasonal-edit.css`

```css
.seasonal-edit {
  background: var(--seasonal-edit-bg);
  display: grid;
  gap: var(--seasonal-edit-gap);
  padding: var(--seasonal-edit-gap);
  text-align: var(--seasonal-edit-align);
}
.seasonal-edit__media { aspect-ratio: 16 / 9; background: color-mix(in srgb, var(--seasonal-edit-bg), black 8%); }
.seasonal-edit__content { max-width: 65ch; }
```

### `style-plan.md`

```md
# Style plan

| File | Classification | Inclusion owner | Decision |
| --- | --- | --- | --- |
| `base.css` | Base | `layout/theme.liquid` once | Shared box sizing and minimal geometry. |
| `section-seasonal-edit.css` | Section | `sections/seasonal-edit.liquid` once | Section-root rules and tokens only. |
| `all-sections.css` | Obsolete | None | Remove after references are deleted. |

A future build may map nested source styles to these same two flat final asset names; output remains theme-compatible.
```

### `notes.md`

```md
# Verification record

| Check | Expected evidence |
| --- | --- |
| Cold load | Minimal layout rule prevents structural collapse; full visual rules come from section asset. |
| Two instances | Each root has different emitted token values and independent computed styles. |
| Editor replacement | New root emits one section stylesheet include and fresh local tokens. |
| Duplicate links | Page source contains one `base.css` layout include and one section include per rendered instance. |
| Removal | Deleting section removes its local rule ownership without changing siblings. |
```

## What people get wrong here

**Emitting tokens on `:root`.** The last rendered section wins, making merchant settings page-global. Tokens belong on the instance root.

**Including base CSS from the section.** It duplicates a page-wide responsibility for each section instance. The layout owns base delivery.

**Generating a unique CSS asset per ID.** Values vary per instance; the rules do not. Use custom properties, not an uploaded stylesheet explosion.

**Fixing leaks with specificity.** `!important` or longer selectors retain the wrong ownership model. Remove external selectors and start rules at the section root.

## Stretch: direction only

A future pipeline should accept nested source files, generate only `base.css` and `section-seasonal-edit.css`, and compare the generated upload set with Liquid `asset_url` references. Fail when a reference has no final file or an output has no declared owner; do not turn build hashes into paths Liquid must guess.


## Isolation and lifecycle review

Test the completed section with two instances in the same template before accepting the source shape. Give one a small gap and light background, the other a larger gap and dark background. Inspect the root `style` attributes and computed values: each must resolve `--seasonal-edit-bg`, `--seasonal-edit-gap`, and `--seasonal-edit-align` from its own root. If the second section changes the first one, search for `:root`, document-level style injection, unscoped class selectors, and variables inherited from an ancestor outside the component. Do not repair the symptom with a longer selector; remove the global ownership mistake.

Then exercise the theme editor lifecycle. Add an instance, change all three settings, duplicate it, reorder it, and remove the first instance. The re-rendered root should carry fresh values and its single section stylesheet include should remain understandable in the DOM. Removing it must not leave a style block or global variable that affects the surviving instance. This is why the CSS file contains shared rules and the root carries per-instance values: rules are reusable, configuration is local.

For delivery, inspect the page source in a cold browser profile. `base.css` should be included from the layout’s one stable ownership point. The section should include only `section-seasonal-edit.css`; a document that repeats base links because it contains two sections is evidence of the starter’s old architecture. If a page-wide feature stylesheet is later needed by several different sections, promote it to one named feature owner rather than having every section import it opportunistically.

The critical CSS removal test is deliberately narrow. Disable the few layout rules in preview under a cold, throttled load. If the initial page only loses a small geometry safeguard while full CSS arrives, the boundary is working. If essential section visuals disappear or the page becomes unreadable, the inline block has absorbed too much responsibility. Move the necessary stable structure into a reviewed base rule or reduce the external dependency instead of cloning the entire section file into HTML.

Finally, removal is part of the solution. A developer deleting Seasonal edit removes its local include, its section CSS file, and any dead selectors in the same review. The base file remains because it has an independent documented purpose. The inventory and evidence file make this safe months later, when the original author is no longer available to explain why a selector existed.
