<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 46 — Solution

## The approach

Typography has one layout-owned declaration boundary. The solution reads two `font_picker` values, loads only non-system selected faces, then requests a bold heading variant only when `font_modify` returns one. CSS consumes family, fallback, weight, and style through semantic custom properties. No component creates its own Shopify `@font-face` rules.

The optional self-hosted display font has a named source ownership path and one useful face declaration. Its `font-display: swap` leaves text visible while the resource arrives; it is not preloaded by default. A preload is only retained after a cold-route measurement demonstrates that this exact first-view resource helps rather than delays other critical work. The recipe section uses a range setting for a verified weight axis; it passes a number through a local property instead of accepting arbitrary `font-variation-settings` text.

## Walkthrough

**1 — picker boundary.** Body and heading settings create a predictable font-object contract. `font_face` emits only required non-system faces from one typography snippet.

**2 — variant fallback.** The heading’s requested bold variant is assigned through `font_modify` and falls back to the selected heading font if missing. This avoids a nil declaration and preserves a legitimate family/weight combination.

**3 — tokens.** The snippet emits the selected family, fallback families, weight, and style once. CSS components consume those values without duplicating resource declarations.

**4 — inventory.** The written inventory distinguishes Shopify-selected faces from self-hosted display assets and records locale/fallback review.

**5 and 6 — custom resource discipline.** The display file belongs in `assets/` for a distributed theme and uses `asset_url`. It loads with `swap`; no preload is present until a first-view trace proves it should be.

**7 — variable boundary.** The recipe section exposes a range of 400–700 only after the owned display font’s `wght` support is verified. CSS uses `font-weight`, not a raw axis-string setting.

**8 — test.** Cold cache, blocked requests, missing variants, long translations, system choice, and recipe fallback prove the visual contract.

## Full code

### `snippets/type-tokens.liquid`

```liquid
{% assign heading_bold = settings.type_heading_font | font_modify: 'weight', 'bold' | default: settings.type_heading_font %}
{% unless settings.type_body_font.system? %}{{ settings.type_body_font | font_face }}{% endunless %}
{% unless settings.type_heading_font.system? %}{{ settings.type_heading_font | font_face }}{% endunless %}
{% if heading_bold and heading_bold != settings.type_heading_font %}{{ heading_bold | font_face }}{% endif %}
<style>
  :root {
    --font-body-family: {{ settings.type_body_font.family }}, {{ settings.type_body_font.fallback_families }};
    --font-body-weight: {{ settings.type_body_font.weight }};
    --font-body-style: {{ settings.type_body_font.style }};
    --font-heading-family: {{ heading_bold.family }}, {{ heading_bold.fallback_families }};
    --font-heading-weight: {{ heading_bold.weight }};
  }
</style>
```

### `assets/custom-fonts.css.liquid`

```liquid
@font-face {
  font-family: "Recipe Display";
  src: url("{{ 'recipe-display-variable.woff2' | asset_url }}") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}
```

### `sections/recipe-heading.liquid`

```liquid
<section class="recipe-heading" style="--recipe-heading-weight: {{ section.settings.heading_weight }};">
  <h2>{{ section.settings.heading | escape }}</h2>
</section>
{% schema %}
{"name":"Recipe heading","settings":[{"type":"text","id":"heading","label":"Heading","default":"Slow pantry dinners"},{"type":"range","id":"heading_weight","label":"Heading weight","min":400,"max":700,"step":50,"default":600}],"presets":[{"name":"Recipe heading"}]}
{% endschema %}
```

```css
.recipe-heading h2 { font-family: "Recipe Display", var(--font-heading-family); font-weight: var(--recipe-heading-weight); font-display: swap; }
```

### `font-inventory.md`

```md
# Font inventory

| Resource | Owner/path | Variants | Fallback/locale review |
| --- | --- | --- | --- |
| Body picker | Shopify font library | Selected default only | `fallback_families`; test chosen locale strings. |
| Heading picker | Shopify font library | Default plus available bold | Fallback to default when bold is unavailable. |
| Recipe Display | Theme `assets/recipe-display-variable.woff2` | Verified weight 400–700 | Heading picker/system fallback; test title wrapping. |
```

### `notes.md`

```md
No preload is retained until cold-route evidence proves the Recipe Display face is first-view critical. `swap` keeps text readable. Test blocked resources, missing modified variants, translated long titles, system choices, and recipe weight fallback. For Admin-code-editor work, re-evaluate whether Admin Files plus `file_url` is the correct ownership path [VERIFY].
```

## What people get wrong here

**Using a picker family name without `font_face`.** A non-system face then has no declaration or resource contract. Emit the selected font conditionally.

**Assuming bold exists.** `font_modify` can return nil. Use a default/check and test computed weight.

**Preloading every face.** Preloads compete with CSS, images, and body text. Retain only measured first-view value.

**Offering a raw variation string.** The setting can name unsupported or unusable axes. Constrain an actual verified numeric range.

## Stretch: direction only

Compare a long multilingual title in the primary and fallback face at narrow and wide widths. Record line count, control height, visual movement, and chosen threshold before adjusting fallback metrics or preload policy.


## Resource, fallback, and axis review

Verify the typography boundary on a cold route before considering the code complete. With a non-system body selection, inspect that the emitted `@font-face` request corresponds to the selected font and that the computed `font-family`, `font-weight`, and `font-style` match the root tokens. Switch to a system selection and confirm the snippet does not emit an unnecessary downloadable declaration. A system option is a first-class merchant choice because it removes a network dependency; do not treat it as a failure to use the theme’s type system.

Next test the requested heading variant. Pick a font with a documented bold variant, then one without the requested style or weight. The `default` fallback is intentional: the heading retains an available selected face instead of flowing through a nil value. Inspect the computed style and visual hierarchy, including a long translated heading. The goal is not to force a synthetic 700 or italic shape at all costs; it is to leave readable, predictable typography when the merchant’s family does not include the requested variant.

The custom Recipe Display face has separate ownership. In a distributed theme, its font file lives in `assets/`, and its declaration uses `asset_url`; that makes it part of the theme artifact and its versioned delivery path. A store editor workflow may require an Admin Files path instead, which is why the solution records the ownership decision rather than hard-coding an arbitrary CDN URL. Before changing the source, review license, format, Unicode coverage, actual weight range, and locale needs. A font that only covers a design prototype’s alphabet is not a complete storefront resource.

`font-display: swap` is a readability decision. Under a slow request, the fallback appears immediately; when the face arrives, the page can swap. Capture the initial and final layouts with a cold cache. If title or button geometry shifts too far, improve the fallback stack and metrics, reconsider the custom face’s role, or reduce its first-view use. Do not respond by adding a preload for every variant. A preload competes with CSS, imagery, and body text, and must be retained only when a measured route proves this exact resource is essential above the fold.

The variable weight slider is safe only because the known Recipe Display resource supports the `wght` range 400–700. Its range schema keeps the value numeric and bounded; CSS’s `font-weight` uses that value without handing raw OpenType syntax to a merchant. Test the endpoints, intermediate steps, and fallback family. If a replacement font does not support the axis, hide or replace the control rather than allowing an editor value to claim a visual capability that the resource lacks.

Finally, remove dead declarations alongside old assets. If the inventory says only the variable display face is retained, delete static regular, bold, and italic declarations and make sure no template still preloads them. A clean network trace should show just the required selected Shopify variants and the custom face on the routes where it is truly used. This is the practical proof that typography has an ownership boundary instead of being a collection of historical font experiments.
