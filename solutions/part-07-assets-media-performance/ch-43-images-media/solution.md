<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 43 — Solution

## The approach

The media panel has two image compositions because mobile requires art direction, not a more aggressive crop of the desktop photograph. Liquid renders a `<picture>` with a merchant-selected mobile source and a desktop fallback. The desktop image uses responsive candidates sized from the actual layout: a roughly half-width desktop panel and a full-width narrow panel. The first image is the primary explanatory visual, so it is eager and receives the only deliberate preload/priority choice. Lower product media remains ordinary type-aware output.

Geometry is established by the media wrapper and `image_tag` dimensions before requests arrive. Cover presentation preserves an emitted focal `object-position` when Shopify has one; CSS provides a center fallback only when that inline positioning is absent. Product media is not forced through an image tag: `media_tag` chooses appropriate markup, while the CSS makes wrappers stable. The compass remains a trusted external theme SVG used decoratively with empty alternative text.

## Walkthrough

**1 — art direction.** A `<picture>` selects the separately configured vertical image below the breakpoint. The desktop source stays the desktop composition; this is a content decision rather than a crop parameter.

**2 — candidate arithmetic.** Desktop CSS can render near half the viewport, while narrow CSS renders the full content column. `sizes` expresses that slot; widths bracket 1x and 2x needs without requesting more than the source maximum.

**3 — first-view priority.** Only the initial editorial image uses eager loading, preload, and high priority. This gives its request a clear role rather than prioritizing every product medium.

**4 — stable layout.** A fixed visual aspect-ratio wrapper reserves space and the emitted intrinsic dimensions preserve image geometry. No script is needed to prevent shift.

**5 — focal behavior.** The `image_tag` output may include focal positioning. CSS does not overwrite it; the fallback center rule applies only without a `style` attribute.

**6 — media type.** `media_tag` produces appropriate hosted/external video or model markup. Its output is preserved inside a stable wrapper instead of reducing all types to preview images.

**7 and 8 — SVG/alt.** The developer-owned compass comes from `asset_url` and is decorative, so it uses empty alt. Editorial media uses merchant alt text rather than filenames.

## Full code

### `sections/field-notes-media.liquid`

```liquid
{{ 'field-notes-media.css' | asset_url | stylesheet_tag }}
<section class="field-notes-media">
  <div class="field-notes-media__hero">
    <picture>
      {% if section.settings.mobile_image != blank %}
        <source media="(max-width: 749px)" srcset="{{ section.settings.mobile_image | image_url: width: 900 }}">
      {% endif %}
      {{ section.settings.desktop_image | image_url: width: 1600 | image_tag: widths: '480, 720, 960, 1280, 1600', sizes: '(min-width: 750px) 50vw, 100vw', loading: 'eager', fetchpriority: 'high', preload: true, alt: section.settings.desktop_image.alt }}
    </picture>
  </div>
  <img src="{{ 'icon-compass.svg' | asset_url }}" alt="" width="16" height="16">
  <div class="field-notes-media__product-media">
    {% for media in product.media %}
      <div class="field-notes-media__item" data-media-type="{{ media.media_type }}">{{ media | media_tag: image_size: '900x' }}</div>
    {% endfor %}
  </div>
</section>
{% schema %}
{"name":"Field notes media","settings":[{"type":"image_picker","id":"desktop_image","label":"Desktop image"},{"type":"image_picker","id":"mobile_image","label":"Mobile image"}],"presets":[{"name":"Field notes media"}]}
{% endschema %}
```

### `assets/field-notes-media.css`

```css
.field-notes-media__hero { aspect-ratio: 16 / 9; overflow: hidden; }
.field-notes-media__hero picture, .field-notes-media__hero img { display: block; width: 100%; height: 100%; }
.field-notes-media__hero img { object-fit: cover; }
.field-notes-media__hero img:not([style]) { object-position: center; }
.field-notes-media__item { aspect-ratio: 16 / 9; }
.field-notes-media__item > * { width: 100%; height: 100%; }
@media (max-width: 749px) { .field-notes-media__hero { aspect-ratio: 4 / 5; } }
```

### `assets/icon-compass.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M10.8 5.2 9 9l-3.8 1.8L7 7l3.8-1.8Z" fill="currentColor"/></svg>
```

## What people get wrong here

**Calling a mobile image a crop.** Different composition needs a different image source. CSS crop cannot create missing safe space or move a subject.

**Using `100vw` for a half-width desktop card.** It causes the browser to choose oversized candidates. `sizes` describes rendered slot width.

**Centering every image in CSS.** It overwrites merchant focal positioning. Provide a fallback only when no focal style is present.

**Rendering every product medium as `<img>`.** Video, external video, and 3D media require type-aware Liquid output.

## Stretch: direction only

Measure one wide image at a fixed viewport and DPR before adding a candidate: record rendered slot, selected source, transferred bytes, and visual result. Add a width only when the current candidate is meaningfully too large or too soft for that observed slot.


## Selection, geometry, and failure review

Start this implementation by measuring the CSS rather than by copying candidate widths from another section. Suppose the desktop content layout gives the hero 50% of a 1440-pixel viewport: the rendered slot is about 720 CSS pixels before container constraints. A 1x display needs a candidate near 720, while a 2x display can reasonably select 1280 or 1600 depending on the actual maximum slot and source dimensions. On a narrow layout, the slot can approach the available content width, so the mobile source offers a smaller but compositionally appropriate set. The candidate list gives the browser choices around those facts; it is not an invitation to request every possible width.

Inspect the finished page at a desktop and narrow viewport. In each case record viewport width, rendered image width, device pixel ratio, `sizes` value, selected `srcset` candidate, and bytes transferred. If a desktop panel selects a near-full-viewport candidate, the `sizes` declaration is probably overstating its slot. If a high-DPR panel looks soft, add or adjust a candidate only after confirming the original has enough pixels. Shopify will not upscale an image beyond its original source dimensions, so a candidate list cannot create detail that the merchant did not provide.

The `<picture>` branch carries a second concern: the mobile `source` has a different file because it may need different subject framing. It is not automatically assigned the desktop image’s alternate text; review the mobile image’s merchant alt text when it conveys different information. If the image is decorative in a specific composition, make that decision explicit rather than inheriting a filename or leaving a redundant description.

For media types, test at least one hosted video, one external video, and one model item. `media_tag` makes the element type appropriate, but CSS cannot assume every child supports the same controls or intrinsic behavior. Verify that controls are visible where required, poster/layout space is stable, and external content does not become the only explanation of the product. Test with JavaScript disabled because the server-rendered media tag must still provide a meaningful baseline.

Finally, make the icon ownership decision visible. The compass SVG is versioned theme code and is referenced by URL, avoiding repeated inline markup. Its empty alt is correct only because nearby copy already communicates the decorative concept. An action icon would instead need an accessible name on its interactive control. Never convert an arbitrary uploaded SVG to inline HTML: SVG markup can carry unexpected executable or styling behavior and needs an explicit trusted source review.

## Recovery checklist

If a first-view image feels slow, verify its rendered slot, candidate selection, and load order before adding more preloads. If the layout shifts, inspect emitted image dimensions and wrapper aspect ratio before adding a JavaScript placeholder. If the subject is clipped, check the merchant focal point and art-direction image choice before forcing a new crop. These checks isolate the correct ownership layer and prevent performance changes from hiding content mistakes.
