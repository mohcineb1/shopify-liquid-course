<!-- STATUS: final -->
---
id: ch-43
title: "Images & Media"
part: 7
words: 2240
---

# Chapter 43 — Images & Media

Images and media are not decorative files added after the UI is complete. They determine layout geometry, bandwidth selection, buyer comprehension, and whether a product page remains usable on constrained devices. Shopify’s image and media filters let Liquid describe the intended asset and presentation contract; the browser then selects an appropriate candidate. The hard part is not memorizing parameters. It is preserving the relationship between rendered CSS size, source candidates, crop decisions, loading priority, and accessible fallback.

## What you'll be able to do

- Generate image URLs with deliberate dimensions, crops, formats, and padding.
- Use `image_tag` to emit responsive candidates, meaningful sizing, loading behavior, and alternative text.
- Derive `srcset` widths from actual rendered layout rather than device folklore.
- Reserve media space before bytes arrive and distinguish focal-point preservation from art direction.
- Render product video, external video, and 3D media through the appropriate Liquid media filter.
- Handle SVGs as implementation assets without turning untrusted markup into inline DOM.

## 43.1 `image_url` parameters: width, height, crop, format, pad_color

`image_url` returns a CDN URL for an image object or supported image-bearing object. It requires at least a `width` or `height`; omitting both is an error.[1] A request can never enlarge an image past its original dimensions, and requested width or height has a documented maximum of 5760 pixels.[1] Those are delivery constraints, not reasons to request the largest value by default.

```liquid
<!-- snippets/product-card-image.liquid -->
{{ product.featured_image | image_url: width: 720 }}
```

A single dimension preserves the source aspect ratio. Request both dimensions only when the presentation requires a different aspect ratio and you have made a content decision about the excess. `crop` selects the part retained for mismatched aspect ratios: `top`, `center`, `bottom`, `left`, `right`, or `region`; the documented default is `center`.[1]

```liquid
<!-- sections/editorial-hero.liquid -->
{{ section.settings.image | image_url: width: 1600, height: 900, crop: 'center' }}
```

Crop is not a styling shortcut. It discards visual information. Center crop is acceptable only when the composition is known to tolerate it; a portrait whose face is high in the frame can be damaged by a generic center crop. Use a merchant-set focal point where the same original image must keep its subject visible across responsive crop boxes. Use separate image choices when the mobile composition should be materially different; that is art direction, not focal-point positioning.

`crop: 'region'` is the surgical option. It requires defined crop coordinates and dimensions, with optional output width and height.[1] It is useful for a deliberate editorial extraction, not for guessing where a merchant’s product detail sits.

`format` accepts `jpg` or `pjpg`; Shopify still performs client-capability-aware format selection and considers the requested format’s properties.[1] Do not force an old format because you expect a particular bytes-on-wire extension. `pad_color` accepts hexadecimal `hex3` or `hex6` values and fills mismatched aspect-ratio space rather than cropping.[1]

```liquid
<!-- snippets/catalog-tile.liquid -->
{{ product.featured_image | image_url: width: 600, height: 600, pad_color: 'f7f5f2' }}
```

Padding preserves the product’s entire composition at the cost of empty space; crop fills the box at the cost of source content. Choose between them as a merchandising decision.

## 43.2 `image_tag`: `widths`, `sizes`, `loading`, `fetchpriority`, `preload`, `alt`, `class`

`image_tag` turns an image URL into an `<img>` element. By default it emits width and height according to the image URL’s dimensions and aspect ratio, which is valuable layout information rather than cosmetic metadata.[2] It can also create a responsive `srcset`; Shopify supplies a default set unless you specify `widths`.[2]

```liquid
<!-- snippets/product-card-image.liquid -->
{{ product.featured_image
  | image_url: width: 1000
  | image_tag:
    widths: '240, 360, 480, 640, 800, 1000',
    sizes: '(min-width: 990px) 25vw, (min-width: 750px) 33vw, 50vw',
    loading: 'lazy',
    alt: product.featured_image.alt,
    class: 'product-card__image'
}}
```

`widths` tells the browser which source widths actually exist. `sizes` tells it the rendered slot width under layout conditions. The browser combines its viewport and device pixel ratio with `sizes` to choose a candidate. The two lists are not independent decoration; a false `sizes` value makes the browser download a too-large candidate or display a too-soft image.

`loading` should reflect visual importance. Shopify documents that `image_tag` automatically sets `loading="lazy"` for images in lower sections when `preload` is not applied, and advises against lazy loading images above the fold.[2] Explicit logic can use the section’s position when the theme knows it. A product-card image far below the first viewport can be lazy; the primary visual that explains the page should not wait for scroll detection.

`preload: true` sends a Link preload resource hint, including matching `imagesrcset` and `imagesizes` where available; it does not alter the HTML `<img>` directly.[2] Use it sparingly for genuinely critical imagery. Preloading several images asks the network to prioritize all of them and can compete with the single element that matters most. `fetchpriority` is an HTML attribute you may pass through `image_tag`, but it is an explicit prioritization decision, not a default for every hero.

```liquid
<!-- sections/hero.liquid -->
{{ section.settings.image
  | image_url: width: 1800
  | image_tag:
    widths: '750, 1100, 1500, 1800',
    sizes: '100vw',
    loading: 'eager',
    fetchpriority: 'high',
    preload: true,
    alt: section.settings.image.alt,
    class: 'hero__image'
}}
```

Alternative text comes from media alt text by default for images, but `alt` can override it.[2] Preserve meaningful product or editorial description; use `alt: ''` only for a truly decorative image whose information is already conveyed in text. `class` is a normal HTML class contract, not an excuse to remove intrinsic dimensions and rely on JavaScript to measure a picture.

> [VERIFY] Confirm support and appropriate use of `fetchpriority` for the theme’s browser policy and critical rendering path. Use it only after observing an actual priority problem.

## 43.3 Responsive images done correctly — the srcset arithmetic

The arithmetic begins with the layout, not source image dimensions. Determine the widest CSS slot the image can occupy at each breakpoint. Multiply that slot by realistic device pixel ratios you intend to serve, then select a small candidate set that brackets those needs without asking for candidates above the original image’s width.

For a three-column product grid whose card can be 320 CSS pixels wide, a 1x display needs roughly 320 pixels and a 2x display needs roughly 640. Candidate widths such as 320, 480, 640, and 800 allow the browser useful choices. A `sizes` value that says `100vw` would be wrong: it tells a 2x mobile browser to consider a full viewport slot even when CSS renders half a viewport, producing unnecessary transfer.

```liquid
<!-- snippets/collection-card-image.liquid -->
{{ product.featured_image
  | image_url: width: 960
  | image_tag:
    widths: '240, 320, 480, 640, 800, 960',
    sizes: '(min-width: 1200px) 320px, (min-width: 750px) calc((100vw - 6rem) / 3), calc((100vw - 3rem) / 2)',
    loading: 'lazy',
    alt: product.featured_image.alt
}}
```

Do not confuse the `image_url` width with the `width` HTML attribute. The URL width is the maximum source candidate generated by Shopify; `image_tag: width:` controls the output attribute and can override or suppress it.[2] Usually allow Shopify to output intrinsic width and height. The aspect ratio encoded by those attributes lets the browser reserve the correct geometry before the response arrives.

Test arithmetic in the rendered page: inspect the actual `sizes`, compare the selected candidate in browser tooling, resize across breakpoints, and observe real device pixel ratios. Candidate sets are a hypothesis about layout. They must be revised when CSS grid, container width, or card count changes.

## 43.4 Aspect ratio, CLS prevention, and placeholder strategies

Cumulative layout shift is a geometry failure: content changes position because space was not known when a resource arrived. Intrinsic `width` and `height` on an image provide an aspect ratio the browser can reserve. When a design needs a fixed crop box, CSS should state its ratio while the image fills it predictably.

```css
/* assets/component-product-card.css */
.product-card__media { aspect-ratio: 1 / 1; overflow: hidden; }
.product-card__media img { display: block; width: 100%; height: 100%; object-fit: cover; }
```

```liquid
<!-- snippets/product-card-image.liquid -->
<div class="product-card__media">
  {{ product.featured_image | image_url: width: 800 | image_tag: loading: 'lazy', alt: product.featured_image.alt }}
</div>
```

The wrapper’s aspect ratio establishes visual geometry; the image’s intrinsic attributes preserve source facts. Do not use a transparent placeholder merely to hide an unknown layout. A color, skeleton, or low-detail preview is valid only if the final dimensions are already reserved and the placeholder does not misrepresent availability. For an absent merchant image, render a purposeful textual or graphical fallback with stable dimensions instead of an empty box that shifts when content changes.

## 43.5 Focal points and art direction

Shopify’s `image_tag` automatically emits an `object-position` style when the image has focal-point coordinates.[2] That is helpful when the same image enters different CSS crop boxes: `object-fit: cover` can preserve the merchant’s intended subject. Do not overwrite it with a blanket `object-position: center` rule, which discards merchant curation.

Focal point answers “which part of this one image survives a crop?” Art direction answers “is this the same image for this context?” A wide lifestyle photograph might require a different vertical image on mobile, with different text-safe space and subject framing. That requires an explicit second image choice and a responsive `<picture>` or conditional media strategy, not a more aggressive crop parameter. Keep art-direction choices visible in schema and content review.

> [VERIFY] Verify the current theme support and merchant workflow for focal points before making a design dependent on their availability; provide a safe center-crop fallback.

## 43.6 Video, external video, and 3D model rendering

Product media has types. `media_tag` generates the appropriate HTML element for a media object, including external video and hosted video.[3] It is a good generic renderer when the theme’s UI can treat media types uniformly. `video_tag` is appropriate when the object is specifically a hosted video and you need video attributes such as controls, autoplay, muted, loop, or loading.[4]

```liquid
<!-- snippets/product-media.liquid -->
{% for media in product.media %}
  <div class="product-media" data-media-type="{{ media.media_type }}">
    {{ media | media_tag: image_size: '900x' }}
  </div>
{% endfor %}
```

```liquid
<!-- snippets/product-video.liquid -->
{% for media in product.media %}
  {% if media.media_type == 'video' %}
    {{ media | video_tag: controls: true, preload: 'metadata', image_size: '900x' }}
  {% endif %}
{% endfor %}
```

Shopify documents that uploaded MP4 video gets an additional `m3u8` HLS source; unsupported HLS falls back to MP4, while looped video does not use HLS to enable progressive download caching.[4] Do not autoplay audible media. Use controls where the buyer needs agency, include a meaningful poster strategy, and test the product page’s keyboard and reduced-motion expectations. For a 3D model, use `model_viewer_tag` on the media object rather than inventing a raw model-viewer element with guessed sources.[5]

## 43.7 SVG handling and inlining strategies

An SVG used as a theme icon is usually a developer-owned asset. Referencing it with `asset_url` makes it cacheable and keeps markup outside the page DOM.

```liquid
<!-- snippets/icon-arrow.liquid -->
<img src="{{ 'icon-arrow.svg' | asset_url }}" alt="" width="16" height="16">
```

Inline SVG is appropriate only when the theme owns the exact trusted markup and needs to control paint properties, labels, or animation directly. It should be a reviewed snippet, not arbitrary content copied from a merchant field or upload. Inline an accessible icon with a label when it conveys meaning; hide decorative SVGs from assistive technology. Never use Liquid’s `asset_url` output as though it were SVG markup—it is a URL.

```liquid
<!-- snippets/icon-close.liquid -->
<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16">
  <path d="M2 2 14 14M14 2 2 14" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
```

Avoid inlining large illustration files on every card or injecting unreviewed SVG text. External SVG delivery is usually the right caching boundary; trusted inline SVG is a deliberate UI primitive.

## Gotchas

- `image_url` needs width or height and cannot upscale past the original image.[1]
- `sizes` must describe CSS slot width, not image source width or the viewport by habit.
- Do not lazy-load the sole above-the-fold image that explains the route.[2]
- Crop, focal point, and art direction solve different content problems.
- `media_tag` is type-aware; do not force all product media through an image-only template.
- SVG files are URLs when referenced by `asset_url`, not safe markup to inject.

## Checklist

- [ ] Every image has a deliberate URL dimension and a rendered-slot sizing model.
- [ ] `widths` and `sizes` agree with actual responsive CSS.
- [ ] Intrinsic or CSS aspect ratio reserves layout space before media arrives.
- [ ] Priority, preload, and lazy loading correspond to buyer-visible importance.
- [ ] Crop and focal-point choices preserve a reviewed subject; art direction uses a separate image when needed.
- [ ] Video, external media, models, and SVGs each use a type-appropriate, accessible boundary.

## Related

- [Chapter 42 — Assets & the CDN](../ch-42-assets-the-cdn/) for delivery ownership and URL filters.
- [Chapter 44 — Responsive Images](../ch-44-responsive-images/) for deeper responsive-image implementation and measurement.
- [Chapter 45 — Fonts](../ch-45-fonts/) for another critical rendering resource with delivery trade-offs.

## References

[1]: https://shopify.dev/docs/api/liquid/filters/image_url "Shopify — image_url"
[2]: https://shopify.dev/docs/api/liquid/filters/image_tag "Shopify — image_tag"
[3]: https://shopify.dev/docs/api/liquid/filters/media_tag "Shopify — media_tag"
[4]: https://shopify.dev/docs/api/liquid/filters/video_tag "Shopify — video_tag"
[5]: https://shopify.dev/docs/api/liquid/filters/model_viewer_tag "Shopify — model_viewer_tag"
