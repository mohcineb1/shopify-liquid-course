<!-- STATUS: final -->
# Chapter 43 — Exercise

**Time:** 50–60 minutes · **Type:** responsive media implementation

## Goal

Build a product-story media panel whose image candidates reflect real layout slots, whose geometry is stable before loading, and whose image, video, external media, model, and SVG decisions preserve the correct accessible boundary.

## Context

A travel camera merchant is launching a “Field notes” story on a product page. Desktop displays a wide editorial image beside product information; narrow screens use a vertical composition selected by the merchant. The existing section requests an oversized source, claims `100vw` for a half-width card, lazy-loads its only introductory image, and collapses while media loads. It also treats every product media item as an image and inlines an icon copied from an unknown source.

Marketing wants visual impact without wasting transfer or hiding the photographer’s intended subject. The merchant can set focal points on images and wants product video, external video, and a 3D model to remain supported. Refactor the panel from the lesson only; do not build a JavaScript gallery.

## Requirements

- [ ] 1. Render desktop and mobile editorial image choices responsively. Explain in `notes.md` why this is art direction, not merely crop adjustment.
- [ ] 2. Use `image_url` with a deliberate source maximum and `image_tag` with `widths` plus `sizes` values that describe real desktop and narrow CSS slots.
- [ ] 3. Keep the first content image eager and make a deliberate priority/preload decision; lower media must not compete by default. Record the rationale.
- [ ] 4. Reserve stable media geometry with intrinsic dimensions and/or an explicit CSS aspect-ratio wrapper. Test without JavaScript.
- [ ] 5. Preserve merchant focal points for cover rendering. Do not overwrite them with blanket centering; state a fallback when none exists.
- [ ] 6. Render product media by type: image, hosted video, external video, and 3D model. Use supported Liquid media filters and understandable playback controls.
- [ ] 7. Replace copied inline SVG with a trusted reviewed inline icon or external theme asset. State ownership and accessibility decision.
- [ ] 8. Give informative media useful alternative text and use empty alt only for decoration. Never use a filename as meaningful copy.

## Constraints

- No JavaScript framework, gallery library, or client-generated `srcset`.
- Do not request images above original source size or invent a focal-point coordinate API.
- Do not autoplay audible video or turn external media into a hand-written iframe URL.
- Do not inline unreviewed merchant-uploaded SVG markup.

## Starter

```text
starter/sections/field-notes-media.liquid  flawed media rendering and responsive claims
starter/assets/field-notes-media.css        incomplete geometry and object-fit rules
starter/assets/icon-compass.svg             trusted developer-owned external icon
```

Copy the files to a development theme, assign suitable images, and inspect first-view selection at desktop and mobile widths before editing.

## Done when

- First image occupies a stable box before download and is not lazy-loaded.
- Browser inspection shows a `srcset` candidate matching the rendered slot.
- A different mobile image can be selected without pretending it is the same crop.
- Products with hosted/external video or model media render supported elements rather than broken image tags.
- Compass icon is accessible or hidden according to its meaning.
- `notes.md` records slot arithmetic, candidate widths, priority rationale, focal-point fallback, and SVG ownership.

## Stretch

For a wide source image, write a measurement plan that assesses whether one more candidate reduces meaningful high-DPR transfer. Include viewport, DPR, rendered slot, selected candidate, bytes, and quality criterion; do not decide from a synthetic score alone.


## Review evidence

Capture one desktop and one narrow-viewport inspection before marking the work complete. For each, record rendered CSS slot width, device pixel ratio, selected source candidate, and whether the media box remained stable before the request completed. This is the evidence that the `sizes` claim is true rather than copied from another section.
