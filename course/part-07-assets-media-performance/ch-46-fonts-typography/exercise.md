<!-- STATUS: final -->
# Chapter 46 — Exercise

**Time:** 45–60 minutes · **Type:** typography delivery refactor

## Goal

Turn a hard-coded heading face and over-eager custom font load into a settings-driven typography system that loads needed variants, preserves readable fallbacks, and exposes a verified variable-weight choice safely.

## Context

A specialty food theme loads four weights and two italics of a custom display font on every route. It uses a `font_picker` body setting, but emits only a family name with no `font_face` declaration or fallback stack. Heading CSS asks for 700 italic whether that variant exists or not. A previous developer preloaded every font file, causing collection imagery and body text to compete for initial bandwidth. The launch team wants a flexible editorial recipe heading without a raw CSS field in the editor.

Refactor the typography boundary. Merchants choose Shopify body and heading fonts. The recipe section selects a bounded weight only when the configured display font supports it. The storefront remains readable when resources are delayed or fail.

## Requirements

- [ ] 1. Add body and heading `font_picker` settings and emit Shopify-hosted declarations from one documented typography boundary.
- [ ] 2. Use `font_modify` for requested heading weight/style, but guard a missing variant with a known fallback.
- [ ] 3. Set semantic CSS tokens for family, fallback families, weight, and style. Components consume tokens rather than repeat face declarations.
- [ ] 4. Write `font-inventory.md` naming each retained resource, owner, source path, weight/style, Unicode/locale review, and fallback stack. Delete unnecessary variant loads.
- [ ] 5. If a self-hosted display font remains, use correct Shopify-owned path and `@font-face` with deliberate `font-display`. Record theme-assets versus Admin Files ownership.
- [ ] 6. Preload at most one measured first-view custom face and justify it in `notes.md`; do not preload a below-fold display face by habit.
- [ ] 7. Give recipe heading a bounded weight setting on a verified variable axis. Never expose arbitrary `font-variation-settings` input.
- [ ] 8. Test cold cache, blocked font response, missing modified variant, long translated title, two font-picker choices, and recipe fallback behavior.

## Constraints

- No external web-font service or copied third-party CDN URL.
- Do not load every `font.variants` entry.
- Do not assume a `font_modify` result exists; do not use a free-text axis tag.
- Keep font declarations and preloads inside the provided ownership files.

## Starter

```text
starter/snippets/type-tokens.liquid          incomplete Shopify font declarations
starter/assets/custom-fonts.css.liquid       excessive self-hosted face declarations
starter/sections/recipe-heading.liquid       unbounded variable-font setting
```

Copy the files to a development theme and capture cold-cache network evidence before editing. Test both system-font and non-system selections where available.

## Done when

- Body and heading selections yield usable CSS family/fallback tokens and required declarations.
- A missing bold/italic variant falls back intentionally rather than generating invalid output.
- Only documented font resources load on the relevant route.
- Recipe heading weight remains in a verified axis range and falls back legibly.
- `font-inventory.md` and `notes.md` record ownership, fallback, preload, and failure evidence.

## Stretch

Propose a metric test for a long multilingual product title. Record primary face, fallback face, line count, control height, loading state, and the acceptance threshold for layout movement.


## Evidence capture

For each chosen font, capture the requested resource URL, computed family, weight, style, fallback rendering, and line wrapping at both a narrow and wide viewport. Throttle once and block the font once. The comparison should show whether text remains readable before loading, whether fallback changes button or heading geometry, and whether the retained preload demonstrably improves the critical route rather than merely adding another request.
Keep this comparison in release records.
