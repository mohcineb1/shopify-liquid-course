<!-- STATUS: final -->
---
id: ch-44
title: "CSS Strategy"
part: 7
words: 2120
---

# Chapter 44 — CSS Strategy

A Shopify theme can make CSS either a stable rendering contract or an untraceable collection of files that load twice, leak across sections, and fight merchant settings. The right strategy is not a universal bundle size rule. It is a deliberate answer to five questions: which styles are needed on every route, which styles belong to an optional section, which declarations must appear before first paint, how source tooling maps to final assets, and how a merchant-configured section gets local values without becoming a global override.

## What you'll be able to do

- Choose between a baseline stylesheet, section CSS, and `{% stylesheet %}` from route and reuse evidence.
- Keep critical CSS small and verifiable without requiring a full build system.
- Use a build pipeline without exporting its directory conventions into a theme.
- Turn safe theme settings into CSS custom properties at the section boundary.
- Scope a section instance by `section.id` without causing global selector leakage.

## 44.1 Single bundle vs per-section stylesheets vs `{% stylesheet %}`

A single bundle is attractive because it is easy to include, cache, and reason about on first launch. It becomes harmful when it collects the complete styling for optional sections, seldom-used templates, and experiments that most routes never render. Conversely, one stylesheet per component can create repeated network and maintenance overhead when the same visual primitives appear nearly everywhere. Decide from rendered routes and reuse, not ideology.

A useful theme shape has a small base asset for global foundations—reset, typography baseline, layout primitives, shared controls—and a section asset for rules that cannot be reused outside that section. The section includes its asset only when its markup appears.

```liquid
<!-- sections/editorial-callout.liquid -->
{{ 'section-editorial-callout.css' | asset_url | stylesheet_tag }}
<section class="editorial-callout">
  <h2>{{ section.settings.heading | escape }}</h2>
</section>
```

The include is an ownership signal: deleting the section should make its CSS include disappear. Do not place a whole design system in each section file merely because the section can load independently.

`{% stylesheet %}` is a theme code boundary for CSS associated with a section, block, or snippet. Use it when its current compilation and injection behavior supports the component boundary you need; do not assume it has the same caching and file-inspection characteristics as a named asset. A named `assets/` file remains useful when multiple sections intentionally share a stylesheet, when source tooling emits a final file, or when you need an explicit network resource in diagnostics.

> [VERIFY] Verify the current `{% stylesheet %}` compilation, ordering, and supported file contexts in Shopify’s theme documentation before making it the theme’s primary CSS distribution mechanism.

**Wrong: load a page-wide CSS archive from every section.**

```liquid
<!-- Wrong: repeated inclusion and unrelated rules travel with every section. -->
{{ 'all-components.css' | asset_url | stylesheet_tag }}
```

**Right: load shared foundations once and local rules at their rendering boundary.**

```liquid
<!-- layout/theme.liquid -->
{{ 'base.css' | asset_url | stylesheet_tag }}

<!-- sections/editorial-callout.liquid -->
{{ 'section-editorial-callout.css' | asset_url | stylesheet_tag }}
```

Record the decision per file: base, shared feature, local section, or experimental. A stylesheet with no named responsibility will eventually become an accidental bundle.

## 44.2 Critical CSS in a theme without a build step

Critical CSS is the minimum declaration set needed to render the initial buyer-visible structure without waiting for a delayed stylesheet. It is not “all CSS above the fold,” and it is not an excuse to duplicate a complete base file inline. Include only stable layout geometry, key typography fallback behavior, and a small amount of first-view visibility protection. Anything interactive or decorative belongs in the ordinary stylesheet unless measurement proves otherwise.

Without a build step, keep the policy manual and small. Place a reviewed block in the layout, document which route shapes it protects, and make the ordinary stylesheet the source of truth for the broader design. The danger is divergence: when inline declarations and external declarations both evolve independently, a bug is fixed in one path but not the other.

```liquid
<!-- layout/theme.liquid -->
<style>
  .site-header { min-height: 4rem; }
  .main-content { min-height: 50vh; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
{{ 'base.css' | asset_url | stylesheet_tag }}
```

Do not inline a section’s merchant-specific CSS simply because the section may appear near the top. That increases HTML response size for every request and makes caching worse. First establish whether a section is actually common, first-view, and layout-blocking. Then reduce its external CSS rather than copying its whole file into HTML.

Critical CSS also needs a removal test. Disable the inline block in a preview: does the page merely become less polished while waiting for base CSS, or do navigation, content order, and layout collapse? If the second is true, simplify the external dependency or make the small critical rule set intentional. Test with a cold cache and a throttled connection; a warm development browser hides the delivery problem.

## 44.3 Using a build step anyway: SCSS/PostCSS/Tailwind pipelines that ship to `assets/`

A build step can give a theme nesting, linting, autoprefixing, token transforms, utility generation, and CSS minification. It does not give the uploaded theme a general web application public directory. Source may be organized under `src/`, but the output must be a deliberately named file in the theme `assets/` directory, exactly as Chapter 42 established.

```text
src/styles/base.css              -> assets/base.css
src/styles/sections/callout.css  -> assets/section-editorial-callout.css
src/styles/features/search.css   -> assets/feature-predictive-search.css
```

SCSS is useful when it improves source authoring, not when it restores an unbounded global namespace. PostCSS is useful when it provides required transformations with a documented browser target. Tailwind can be appropriate when the team has a disciplined component vocabulary and purge/content configuration that understands Liquid files. None of these changes the theme runtime: Liquid still references final files with `asset_url`.

```liquid
<!-- layout/theme.liquid -->
{{ 'base.css' | asset_url | stylesheet_tag }}
```

A pipeline must have a release contract: source inputs, final filenames, generated file ownership, and a check that every referenced output is uploaded. Do not commit arbitrary chunk folders, source maps by accident, or a hash manifest that Liquid cannot read. If filenames are content-hashed, add a deliberate translation layer; a stable semantic name plus Shopify’s resolved CDN version often has a clearer theme workflow.

> [VERIFY] Confirm the current Theme Check, CLI, and deployment workflow before adding a source build pipeline; project tooling changes independently of Liquid’s asset contract.

## 44.4 Design tokens from theme settings → CSS custom properties

Theme settings are merchant inputs; CSS custom properties are a good local delivery mechanism for values such as color, spacing, radius, and alignment. Emit a value on the section root, then let local CSS consume it. This gives each instance its own configuration without creating global utility classes or JS mutation.

```liquid
<!-- sections/editorial-callout.liquid -->
<section
  id="EditorialCallout-{{ section.id }}"
  class="editorial-callout"
  style="--callout-bg: {{ section.settings.background }}; --callout-gap: {{ section.settings.gap }}px;"
>
  <h2>{{ section.settings.heading | escape }}</h2>
</section>

{% schema %}
{
  "name": "Editorial callout",
  "settings": [
    { "type": "color", "id": "background", "label": "Background", "default": "#f4f1eb" },
    { "type": "range", "id": "gap", "label": "Spacing", "min": 8, "max": 64, "step": 4, "unit": "px", "default": 24 },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Field notes" }
  ],
  "presets": [{ "name": "Editorial callout" }]
}
{% endschema %}
```

```css
/* assets/section-editorial-callout.css */
.editorial-callout { background: var(--callout-bg); padding: var(--callout-gap); }
```

The schema limits the value domain: color controls yield color values and range controls yield bounded numbers. Do not place arbitrary rich text, URLs, or unvalidated CSS fragments inside a `style` attribute. Tokens are a configuration API, so name them by semantic role (`--callout-bg`) rather than transient appearance (`--beige-2`).

## 44.5 Scoping styles to `section.id` without leaking

The theme editor allows several instances of one section. A selector such as `.editorial-callout h2` may be sufficient when the class is truly unique, but an instance ID makes it possible to target a merchant-configured section without affecting another instance. Render the ID once and scope declarations from that stable root.

```liquid
<!-- sections/editorial-callout.liquid -->
<section id="EditorialCallout-{{ section.id }}" class="editorial-callout">
  <div class="editorial-callout__inner">{{ section.settings.copy }}</div>
</section>
```

```css
/* assets/section-editorial-callout.css */
#EditorialCallout-SECTION_ID .editorial-callout__inner { max-width: 65ch; }
```

Do not literally ship `SECTION_ID` in a shared stylesheet. The better pattern is a class-scoped stylesheet plus instance values emitted through custom properties, as above. Use an ID selector only when a section-specific rule must be emitted with the section and has a known lifecycle. If every merchant option generates a new `<style>` block, you have created a caching and ordering problem instead of a token system.

A section rule must not reach outside its boundary. Avoid selectors like `.editorial-callout + .product-grid`, universal element selectors, or a global custom property named `--spacing` that another section may reinterpret. The selector contract starts at the section root and ends inside it. This is where people get burned: CSS feels global even when sections look isolated in the editor.

## Gotchas

- A single bundle can be too broad; per-section files can be too fragmented. Use route evidence.
- Critical CSS that duplicates whole external files is a caching regression, not a performance strategy.
- Source folders and build chunks are not theme delivery paths; final assets must be intentional.
- Theme settings should emit bounded semantic tokens, not arbitrary CSS text.
- `section.id` is an instance boundary, not a reason to generate a unique stylesheet for every setting.

## Checklist

- [ ] Every stylesheet has a named base, feature, section, or build-output responsibility.
- [ ] First-view critical CSS is small, tested cold, and has an external-source-of-truth plan.
- [ ] Build output maps predictably to flat final files under `assets/`.
- [ ] Merchant settings become bounded local custom properties.
- [ ] Selectors and variables start at the section root and do not affect siblings.

## Related

- [Chapter 42 — Assets & the CDN](../ch-42-assets-the-cdn/) for final theme asset delivery.
- [Chapter 40 — Web Components in a Liquid Theme](../../part-06-interactivity-without-a-framework/ch-40-web-components-in-a-liquid-theme/) for local interactive CSS boundaries.
- [Chapter 45 — Fonts](../ch-45-fonts/) for a resource whose loading strategy also affects first paint.


## Operational review: ordering, duplication, and editor replacement

CSS strategy has a lifecycle just as JavaScript does. A section can be added, moved, re-rendered, or removed in the theme editor. If a section includes a named stylesheet, browsers may already have the resource cached, but the rendered HTML still determines whether its rules are needed. Do not rely on an editor session to expose ordering defects: test a clean buyer route where the base file, feature files, and section includes appear in the same order as production. Inspect the cascade when two sections share a primitive. The shared rule belongs in a documented base or feature asset; the local rule should use a component class or token rather than increasing selector specificity until it wins by accident.

Duplicate style delivery is often hidden. A shared feature stylesheet might be emitted from a layout snippet and again from each section that uses it. The UI looks correct because CSS is idempotent, but the HTML has repeated link elements and later debugging cannot tell which owner is responsible. Pick one inclusion point. If only a subset of routes needs a feature, give one renderer or section group responsibility for its include. If every route needs it, promote it into the base bundle deliberately and remove local copies.

Tokens also require a fallback strategy. A section root can declare `--callout-gap`, while CSS should offer `var(--callout-gap, 1.5rem)` if the markup can ever be rendered outside its normal section context. That fallback is not a substitute for schema validation: a bounded range remains the correct way to prevent nonsensical values. Avoid global variables like `--color-primary` emitted by individual section instances, because whichever section appears last can silently change a sibling’s presentation.

A practical CSS review asks four questions: which route renders this file, which root owns each selector, which settings may change its values, and how is the file removed when the feature disappears? If the answers are not visible in source, the theme is accumulating styling infrastructure faster than it can safely evolve.


When a visual defect appears, inspect the owning stylesheet and section root before adding an override. A permanent override without an owner is future technical debt.
Delete obsolete selectors with the feature itself; a dead rule can still alter future markup that reuses its class name.
Keep section ownership visible in code review, release notes, and removal work.
