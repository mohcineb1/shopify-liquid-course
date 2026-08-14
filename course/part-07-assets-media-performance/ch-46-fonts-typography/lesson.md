<!-- STATUS: final -->
---
id: ch-46
title: "Fonts & Typography"
part: 7
---

# Chapter 46 — Fonts & Typography

Typography is a rendering dependency and a merchant-facing design system. A font choice changes line breaks, fallback geometry, loading behavior, accessibility, and the amount of asset work a page must do before its text settles. A Shopify theme should expose legitimate design choice while retaining a stable reading experience when a selected font is slow, absent, missing a requested variant, or replaced by a system fallback.

## What you’ll be able to do

- Connect a `font_picker` setting to Shopify-hosted font declarations and CSS tokens.
- Request weight/style variants with `font_modify` while handling missing variants safely.
- Decide when a self-hosted font, preload, and `font-display` policy are justified.
- Build a settings-driven variable-font strategy without pretending every font supports every axis.

## 46.1 `font_picker`, `font_face`, `font_modify` — Shopify-hosted fonts

A `font_picker` setting returns a Liquid font object. Shopify documents properties including `family`, `fallback_families`, `weight`, `style`, `variants`, `baseline_ratio`, and `system?`.[1] This is a configuration object, not merely the CSS name of a typeface. Use it to generate the declaration required by the selected resource and to expose a bounded family token for theme styles.

```json
// config/settings_schema.json
[
  {
    "name": "Typography",
    "settings": [
      {
        "type": "font_picker",
        "id": "type_body_font",
        "label": "Body font",
        "default": "assistant_n4"
      }
    ]
  }
]
```

The `font_face` filter inserts the default `@font-face` declaration for the selected Shopify font.[2] Emit it in the layout’s font ownership boundary, then set the family and fallback values in CSS custom properties. If the merchant chooses a system font, `system?` tells you whether a corresponding downloadable declaration is needed.[1]

```liquid
<!-- snippets/type-tokens.liquid -->
{% unless settings.type_body_font.system? %}
  {{ settings.type_body_font | font_face }}
{% endunless %}

<style>
  :root {
    --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
    --font-body-weight: {{ settings.type_body_font.weight }};
    --font-body-style: {{ settings.type_body_font.style }};
  }
</style>
```

```css
body {
  font-family: var(--font-body-family);
  font-weight: var(--font-body-weight);
  font-style: var(--font-body-style);
}
```

Keep font declarations separate from component CSS. The selected body face is a theme-wide resource; a product card should consume the token rather than repeat an `@font-face` rule. This prevents duplicated declarations and makes a merchant font change observable in one place.

`font_modify` requests another variant of the same family. Its first argument is a property such as `weight` or `style`; its second is a requested value. Shopify documents weight values from 100 through 900, named variants such as `bold`, and style values such as `normal`, `italic`, and `oblique`.[3]

```liquid
{% assign body_bold = settings.type_body_font | font_modify: 'weight', 'bold' %}
{% assign body_italic = settings.type_body_font | font_modify: 'style', 'italic' %}

{{ settings.type_body_font | font_face }}
{% if body_bold %}{{ body_bold | font_face }}{% endif %}
{% if body_italic %}{{ body_italic | font_face }}{% endif %}
```

A requested variant can be unavailable; `font_modify` returns `nil` in that case.[3] Do not blindly emit a nil-derived declaration or claim a font weight exists because CSS accepts a number. Use a conditional or `default` fallback to a known available variant.

```liquid
{% assign desired_heading = settings.type_body_font | font_modify: 'weight', '700' | default: settings.type_body_font %}
```

This preserves family consistency where possible and makes the fallback explicit. Loading every value in `font.variants` “just in case” is delivery waste. Request the normal face and the variants actually used by visible CSS; verify bold, italic, and non-Latin text with the selected merchant font.

## 46.2 Self-hosted fonts, preloading, `font-display`, and FOUT control

Shopify’s library includes system fonts and a selection of Google fonts provided in WOFF and WOFF2. System fonts are already installed on the customer device and therefore avoid a font download.[2] They are a performance option, not an inferior placeholder. When brand requirements need a custom face, decide first who owns its license, files, supported character sets, weight/style variants, and revision process.

For themes delivered by CLI, ZIP, GitHub integration, or Theme Store distribution, Shopify directs developers to place custom font files in the theme `assets/` directory and use `asset_url` inside `@font-face`.[2] When modifying an existing theme through the Shopify admin code editor, Shopify’s current guidance uses Admin Files and `file_url`, noting that some font uploads to theme assets through that editor can corrupt.[2] These are two distinct ownership paths; do not copy a local URL or third-party CDN merely because it works in development.

```liquid
<!-- assets/custom-fonts.css.liquid -->
@font-face {
  font-family: "Northline Sans";
  src: url("{{ 'northline-sans.woff2' | asset_url }}") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

`font-display: swap` permits immediate fallback text followed by a face swap when the resource arrives. That produces a FOUT—flash of unstyled text—but preserves readable text. `block` can hide text while waiting, which is generally a poor default for commerce. `optional` may accept fallback permanently under constrained conditions. The right value follows typography importance, fallback metric similarity, and measured first-view behavior; it is not a universal brand setting.

A fallback stack is part of the design. Select a fallback family with comparable width and x-height when possible, then test headings, price strings, translation expansion, and line wrapping. A page with an elegant final font but drastic navigation movement after swap has a visual-stability problem. Adjust line-height and measure a realistic fallback; do not solve every mismatch by preloading every font file.

Preload only a genuinely critical first-view font resource and only after verifying the exact URL, format, and route need. Shopify’s performance documentation says resource hints should be used sparingly, with up to two per template, and focuses on key render-blocking resources.[4] A preload that names a font never used on that route competes with images and CSS. A heading-only display face below the fold should normally load through its ordinary declaration.

```liquid
<!-- layout/theme.liquid; only after measurement justifies it -->
<link rel="preload" href="{{ 'northline-sans.woff2' | asset_url }}" as="font" type="font/woff2" crossorigin>
```

> [VERIFY] Confirm the current theme’s response headers, cross-origin requirements, and template resource-hint budget before adding a custom font preload.

FOUT control is not “eliminate every swap.” It is making the fallback readable, limiting layout movement, loading only needed weights, and observing cold-cache rendering. Check network initiator, decoded font, visual state during throttle, and whether a failed resource still leaves coherent text.

## 46.3 Variable fonts in a settings-driven theme

A variable font can contain a range of values—often weight—inside one font resource. It does not mean every slider value is safe, licensed, or visually appropriate. First inspect the supplied font’s supported axes, ensure its `@font-face` descriptor advertises the applicable range, and constrain theme settings to a meaningful subset. A merchant should not be offered arbitrary axis strings through a free-text field.

```liquid
<section
  class="editorial-heading"
  style="--heading-weight: {{ section.settings.heading_weight }};"
>
  <h2>{{ section.settings.heading | escape }}</h2>
</section>

{% schema %}
{
  "name": "Editorial heading",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "New arrivals" },
    { "type": "range", "id": "heading_weight", "label": "Heading weight", "min": 400, "max": 700, "step": 50, "default": 600 }
  ]
}
{% endschema %}
```

```css
.editorial-heading h2 {
  font-family: var(--font-heading-family, sans-serif);
  font-weight: var(--heading-weight);
}
```

The range is safe only after the actual font supports 400–700. If a fallback font has discrete weights, browsers will choose the closest supported fallback; test that outcome and retain reasonable hierarchy. Weight is usually more portable than exposing arbitrary `font-variation-settings`, whose axis tags and ranges vary by font. A settings-driven theme should provide semantic choices—body emphasis, heading strength, compact display—rather than raw typographic internals.

> [VERIFY] Verify the exact axis range, italic availability, language coverage, and license for every self-hosted variable font before exposing a merchant setting.

## Gotchas

- A `font_picker` returns a font object, not a guaranteed family of every possible variant.
- `font_modify` can return `nil`; fallback deliberately.[3]
- System fonts are legitimate performance choices.
- Custom-font delivery path depends on how the theme is managed.[2]
- Preload only a measured critical face; font-display changes perceived behavior, not font bytes.
- Variable settings must match actual supported axes and bounded merchant choices.

## Checklist

- [ ] Font declarations have one documented layout ownership point.
- [ ] Selected Shopify fonts and needed variants are loaded conditionally.
- [ ] Fallback stacks and font-display behavior are cold-cache tested.
- [ ] Custom files use the correct Shopify-owned delivery path.
- [ ] Variable ranges are verified and settings remain semantic and bounded.

## Related

- [Chapter 42 — Assets & the CDN](../ch-42-assets-the-cdn/) for theme assets and Admin Files ownership.
- [Chapter 44 — CSS Strategy](../ch-44-css-strategy/) for token and stylesheet responsibility.
- [Chapter 45 — JavaScript Strategy](../ch-45-javascript-strategy/) for another first-view delivery dependency.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/font "Shopify — font object"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts "Shopify — Fonts"
[3]: https://shopify.dev/docs/api/liquid/filters/font_modify "Shopify — font_modify"
[4]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Performance"


## Measuring the typography contract

A font choice must be tested as a rendered system, not as a specimen in a design tool. Begin with a cold-cache route that contains navigation, a long product title, a price, a button, and body copy. Record first text paint, the initial fallback, the arrival of the chosen face, and whether the page moves. Repeat at a narrow viewport and with the store’s enabled languages. The selected font’s character coverage can be incomplete even when an English mockup looks correct; fallback may change for a price symbol, accented character, or a translated product title.

The most useful distinction is between resource correctness and typographic correctness. Resource correctness asks whether the right WOFF2 request occurred, whether it was served from the expected Shopify path, and whether it loaded only once. Typographic correctness asks whether the expected family, weight, style, line height, and fallback are applied in computed styles. A declaration can load successfully while CSS asks for an unavailable 700 italic and the browser synthesizes an appearance that the brand never approved. Inspect computed font family and weight rather than assuming the network response proves the visual result.

For a Shopify-selected face, define the normal body variant first. Then list actual CSS uses: navigation may need 600 or 700, editorial copy may need italic, and headings may use a distinct picker. Use `font_modify` to request precisely those variants; guard each result because a family may not provide the requested weight/style. A robust theme is comfortable with an available 600 fallback when the merchant’s selected family has no true 700, provided hierarchy remains readable. It is less robust to generate an empty declaration and hope browser synthesis makes the difference invisible.

```liquid
{% assign heading_font = settings.type_heading_font | font_modify: 'weight', 'bold' | default: settings.type_heading_font %}
{% unless heading_font.system? %}
  {{ heading_font | font_face }}
{% endunless %}
<style>
  :root {
    --font-heading-family: {{ heading_font.family }}, {{ heading_font.fallback_families }};
    --font-heading-weight: {{ heading_font.weight }};
  }
</style>
```

Avoid a font picker for each minor component. More settings can create incoherent type hierarchy, expand delivery variants, and make merchant decisions impossible to review. Prefer a small semantic system: body, heading, perhaps accent/display. Components consume those tokens. If a campaign section needs a special display face, it should have a clear local ownership boundary and a stated loading impact rather than silently changing every heading in the store.

Self-hosting requires a release inventory. Record the family’s license, vendor, source file, formats, Unicode coverage, weights, styles, output location, and fallback stack. A font file in `assets/` is part of the theme artifact and should be reviewed like JavaScript or CSS. If it is hosted through Shopify Admin Files, its URL ownership and update workflow differ; do not use a hard-coded CDN URL copied from a browser session. The filter (`asset_url` or `file_url`) makes that source-of-truth choice visible in Liquid.

Preload is a specific network intervention, not a quality badge. Before adding it, verify that the font is needed before first meaningful text, that the declared `@font-face` uses the same URL and format, and that a cold trace shows a material gain. Then test with and without it on constrained conditions. If the preload pushes an LCP image or stylesheet later, remove it. A system-font choice can outperform a carefully optimized custom face for a utility-heavy storefront; preserve that choice in the merchant interface instead of forcing every brand through downloaded typography.

Variable fonts add an extra measurement: examine whether intermediate weights actually look distinct and stable at the sizes used by the theme. A range slider with steps of 50 can be sensible for a verified weight axis, but a raw `font-variation-settings` text field gives merchants axis tags they cannot safely understand. Do not assume a font has optical size, width, slant, or italics merely because another variable font did. The font file and license define the contract. If the selected font lacks an axis, use ordinary bounded CSS properties or hide that control.

## Release review

Before publishing a typography change, use a table to review its user-facing outcome.

| Question | Evidence |
| --- | --- |
| Does readable text appear when the font request fails? | Cold/throttled screenshot with fallback visible. |
| Are all requested weights real variants? | `font_modify` guards and computed-style inspection. |
| Is the resource owner correct? | Theme asset versus Admin Files workflow documented. |
| Does a preload help the first route? | Compared network and visual trace, not intuition. |
| Are variable settings supported? | Verified axes, bounds, and merchant-safe labels. |

This review keeps typography from becoming a hidden asset dependency and lets performance, editorial, and merchant-facing configuration evolve together.
