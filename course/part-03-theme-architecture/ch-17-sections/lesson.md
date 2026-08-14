<!-- STATUS: final -->
---
id: ch-17
title: "Sections"
part: 3
words: 2500
---

# Chapter 17 — Sections

A section is Shopify’s core unit of merchant-configurable storefront composition. It combines render markup with a schema that defines its editor interface, placement rules, block contract, and defaults. A section is more than a Liquid file with a settings object: it is a platform-recognized component whose file shape is read by Shopify, whose instances are placed by templates or groups, and whose merchant-facing controls must remain deliberate as the theme grows.

## 17.1 Section file anatomy: markup + `{% schema %}` + `{% stylesheet %}` + `{% javascript %}`

A section file can contain ordinary Liquid markup and a required `{% schema %}` block containing JSON. The markup renders the configured instance. The schema declares how merchants configure it. A section can also include `{% stylesheet %}` and `{% javascript %}` blocks for component-scoped code that Shopify aggregates for rendered sections.

```liquid
<section class="feature-panel" id="FeaturePanel-{{ section.id }}">
  <h2>{{ section.settings.heading | escape }}</h2>
</section>

{% schema %}
{ "name": "Feature panel", "settings": [{ "type": "text", "id": "heading", "label": "Heading" }] }
{% endschema %}
```

The markup and schema have different consumers. Browsers receive the markup. Shopify’s editor reads the schema. A merchant changes a schema-backed setting, and the section instance exposes that value through `section.settings`. Do not hide an editor requirement in hard-coded Liquid merely because it is faster to type; if a merchant needs to configure it, define the appropriate schema contract.

`stylesheet` and `javascript` blocks are not generic build tooling. They are Shopify-recognized section resources. Use them for code with a clear section ownership and test their aggregate delivery effect. A small section does not need a new client script merely because the file supports one.

## 17.2 The `section` object: `id`, `settings`, `blocks`, `index`, `location`

Every rendered section instance receives a `section` object. `section.id` identifies that instance and is useful for unique DOM IDs and scoped relationships. `section.settings` contains configured values allowed by the schema. `section.blocks` provides the ordered blocks configured in that instance. `section.index` indicates the section’s ordinal position within its containing composition. `section.location` identifies the section’s current placement context.

```liquid
<section id="Newsletter-{{ section.id }}">
  {% for block in section.blocks %}
    <div {{ block.shopify_attributes }}>{{ block.settings.text | escape }}</div>
  {% endfor %}
</section>
```

Use `section.id` to avoid duplicate DOM IDs when the same type appears twice. Treat `section.settings` as schema-owned input, not an unrestricted object. `section.blocks` is instance composition, not a promise that every section has blocks. `index` and `location` can inform context-sensitive behavior, but do not use positional metadata as a substitute for a stable component API.

> [VERIFY] Verify the current availability and exact semantics of `section.index` and `section.location` for the relevant section placement before using them as production logic.

## 17.3 Schema attributes: `name`, `tag`, `class`, `limit`, `settings`, `blocks`, `max_blocks`, `presets`, `default`, `locales`, `enabled_on`, `disabled_on`

The schema `name` is merchant-facing component identity. `tag` chooses the outer element Shopify renders for the section wrapper; `class` supplies wrapper classes. `limit` controls how many instances of the section may be added in a composition. `settings` declares merchant controls. `blocks` declares allowed block definitions; `max_blocks` places an instance-level ceiling. `presets` makes a section available for addition in appropriate editor contexts and can define default block/setup state.

`default` appears within individual setting definitions to supply an initial value. `locales` supplies section schema translations. `enabled_on` and `disabled_on` restrict where a section can be added, helping express placement intent in the editor rather than relying on blank output after an incorrect placement.

| Attribute | Primary job |
| --- | --- |
| `name` | Identify the component to merchants. |
| `tag` / `class` | Define Shopify-generated wrapper structure. |
| `limit` | Cap instances of this section type. |
| `settings` | Define configured section inputs. |
| `blocks` / `max_blocks` | Define allowed repeatable content and its instance limit. |
| `presets` | Enable intentional editor addition/default setup. |
| `locales` | Translate schema-facing labels and messages. |
| `enabled_on` / `disabled_on` | Express allowed composition locations. |

Schema is an interface design exercise. Every control creates a merchant decision and a long-term support obligation. Prefer a small set of named, purposeful settings over a generic settings panel that tries to make one section act like every possible component.

## 17.4 Static sections via `{% section %}` vs dynamic sections in JSON templates

A static section is rendered by a Liquid template or layout using `{% section 'name' %}`. Its placement is defined in code and is not merchant-reordered through JSON template composition. A dynamic section is declared as an instance in a JSON template or section group, where the merchant can configure and order it within the permitted composition.

```liquid
{% section 'static-newsletter' %}
```

Static does not mean unconfigurable: its schema can still expose settings. It means the placement is fixed by the calling Liquid file. Dynamic does not mean universally addable: its schema, presets, and placement restrictions govern where and how a merchant may add it. Choose static placement for a truly fixed structural requirement; choose JSON composition when merchants need controlled page arrangement.

Do not render a dynamic section by adding a second `{% section %}` call “for convenience.” That creates a separate static instance with different ownership. Let the template or group own the dynamic instance and let the section schema define its capabilities.

## 17.5 The 25-section / 50-block ceiling and how to design within it

A JSON template has a maximum of 25 sections, and a section has at most 50 blocks unless `max_blocks` lowers the ceiling. These verified limits should shape page composition before a page becomes a catalogue of tiny, independently configured fragments.[1]

Use sections for coherent page regions and blocks for repeatable items inside a section’s single purpose. A feature grid might be one section with several feature blocks; it should not become one section per card merely to expose a color toggle. Conversely, do not force unrelated content types into a single “universal content” section to avoid section count; that creates an incoherent editor API and fragile markup.

`limit` and `max_blocks` are product decisions as well as safeguards. A single hero may have `limit: 1`; a carefully designed menu may use a lower block maximum than 50 because more entries would harm usability. State the intended merchant outcome first, then encode the constraint in schema.

## 17.6 `{% stylesheet %}` and `{% javascript %}` — how Shopify aggregates them and the real performance cost

Shopify aggregates section `{% stylesheet %}` and `{% javascript %}` content for the sections rendered on a page. This avoids treating each section resource block as an independent network file, but aggregation does not make code free. Every rendered section can contribute CSS or JavaScript to the page payload; duplicate rules, large selectors, unused behavior, and repeated initialization still affect parse, style, and execution cost.

Put stable global styles in a deliberate theme asset and section-specific styles in the section block only when the ownership is clear. Keep JavaScript optional and progressive: a rendered section should remain understandable without a client script where possible. Measure representative pages; a component loaded on every page through a group has a larger aggregate cost than one rendered only on a product template.

> [VERIFY] Verify current aggregation, deduplication, ordering, and caching behavior of section stylesheet/javascript blocks before using them to make performance claims or delivery guarantees.

## 17.7 Section naming, `t:` translated schema strings, and merchant-facing copy

Section names, setting labels, help text, and presets are editor-facing product copy. Name sections by the merchant task they support, not by internal implementation jargon. `t:` translation keys in schema-facing strings let a theme localize the editor interface through locale resources rather than hard-coding one language into the component definition.

```json
{
  "name": "t:sections.feature_panel.name",
  "settings": [
    { "type": "text", "id": "heading", "label": "t:sections.feature_panel.heading" }
  ]
}
```

Separate merchant schema translation from storefront copy. A locale key used as a schema label helps an editor understand a control; customer-facing text rendered in the section has its own copy contract and fallback decision. Do not expose raw implementation IDs such as `card_gap_sm` as merchant labels when a meaningful phrase such as “Card spacing” is required.

## Gotchas

- **Treating schema as optional metadata.** It is the editor contract for the section.
- **Using `section.id` as business data.** It is an instance identity, not a product or content identifier.
- **Adding every option as a setting.** Each setting is a merchant decision and support surface.
- **Confusing static placement with static configuration.** Static sections can still have schema settings.
- **Evading 25 sections with one universal section.** Coherence matters as much as count.
- **Assuming aggregation removes performance cost.** Rendered CSS and JS still affect page weight and execution.

## Checklist

- [ ] My section markup, schema, and optional resources have distinct owners and purposes.
- [ ] I use the `section` object only through its documented contextual contract.
- [ ] Schema controls correspond to real merchant tasks and appropriate placement restrictions.
- [ ] I choose static or dynamic placement based on ownership, not convenience.
- [ ] I design section/block ceilings for usable editor composition.
- [ ] I treat schema labels and customer copy as separate localized interfaces.

## Related

- `ch-15-templates` — JSON template section composition.
- `ch-16-section-groups` — persistent section composition.
- `ch-18-blocks-the-three-kinds` — block architecture.
- `ch-24-theme-settings` — theme-level settings and localization.

[1]: ../docs/DEPRECATIONS.md

## Designing a section as a constrained product interface

A section schema should begin with an editor task, not with every Liquid value the developer could expose. Ask what a merchant is trying to accomplish: choose a heading, select an image, arrange a small number of features, change alignment, or control whether a secondary label appears. Each task should have a clear setting name, understandable label, safe default, and visible effect in the rendered section.

Avoid false flexibility. A setting that permits a merchant to select any resource or arbitrary style combination can turn a focused section into a hard-to-test mini page builder. If a different content pattern needs different markup, accessibility semantics, or data dependencies, make a different section or a deliberately defined block type. The editor experience should explain valid decisions rather than ask merchants to reconstruct the developer’s component architecture.

Placement restrictions are part of that interface. `enabled_on` and `disabled_on` can express where a section makes sense before a merchant adds it to an incompatible template or group. This is better than allowing an invalid placement to render blank markup. Schema restrictions do not replace runtime review, but they move obvious architectural guardrails into the editor where the placement choice occurs.

## Section instance identity and repeated use

The section file defines a **type**, but `section.id` identifies one rendered **instance** of that type. A template can place two instances of a promotion section with different settings. Their DOM IDs, label associations, disclosure controls, and client initialization targets must not collide merely because both use the same file. Build IDs from `section.id` when an element needs instance uniqueness.

The same rule applies to blocks. A section’s block schema defines permitted block types; the section instance owns the configured `section.blocks` collection. A block’s settings belong to that block instance. Do not use a block loop merely as a generic array substitute when the editor model does not match repeatable merchant content. Blocks should create a meaningful item-level editing experience within one section’s purpose.

Treat `section.index` and `section.location` carefully. Position can be useful for progressive-loading hints or placement-aware presentation only when the behavior remains valid as merchants reorder sections. It should never become a secret business rule such as “the third section is always a promotion.” Merchants control composition, so code must remain stable when the order changes.

## Aggregate delivery does not erase ownership

Section stylesheet and JavaScript blocks make it possible to keep component resources near component markup, but they need the same cost review as any other delivery path. A globally mounted header group renders across many routes, so a script placed in a header section becomes effectively site-wide. A product-only section has a narrower contribution. Evaluate code by the pages that render the section, the byte cost of its resources, and the work its initialization performs.

Avoid adding one behavior file per visual micro-feature. Shared behavior may belong in a deliberate theme asset if multiple sections genuinely need it. Section-scoped behavior is appropriate when the DOM contract and lifecycle belong only to one section type. In either case, protect against repeated initialization when multiple instances occur, and do not assume aggregation removes parse or execution costs.

## Schema localization review

Merchant-facing localization should be reviewed in context. A `t:` schema key should name the editor control in the language and tone merchants expect. It is different from a storefront translation key, which appears to customers at render time. Keep keys organized by component and purpose so a translator can distinguish a section name, a setting label, an information tooltip, and a visible customer message.

Before release, inspect the editor with a representative section instance. Confirm that the section name, presets, setting labels, defaults, help text, and placement restrictions explain the component’s intended use. Then inspect the storefront with empty, default, and configured states. The schema is successful only when both consumers—the merchant and the shopper—receive a coherent interface.
