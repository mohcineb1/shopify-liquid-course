<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 48 — Solution

## The approach

The solution gives each language surface one owner. Customer-facing Garden picks strings live in matched storefront locale files and resolve through `t`. Merchant-facing name and setting labels live in matched schema locale files and resolve through schema `t:` references. A section-private customer message remains in the section schema’s `locales` object; the reusable “See all” message is theme-global because product and search can share it. Plural selection stays in the locale catalog, and the section passes `count` rather than encoding English grammar in Liquid.

The record files make the fallback policy visible. The default English catalog is the structural source of truth; every supported storefront/schema locale must match its relevant key tree. `_html` is used only for reviewed static markup and never merges unreviewed dynamic content. Product titles remain content data, not copied UI translations.

## Walkthrough

**1 — matched storefront files.** `en.default.json` and `fr-CA.json` contain the same Garden picks and global paths.

**2 — interpolation.** Liquid calls single-quoted keys with named variables. The full sentence belongs to the active locale.

**3 — plurals.** `count` selects `zero`, `one`, or `other` as the locale requires.

**4 — schema locale.** Merchant labels use `t:` keys and the `.schema.json` catalogs have matching paths.

**5 — ownership.** Theme-global “See all” lives in `locales/`; the portable section’s private alert lives in its own `locales` schema object.

**6 — HTML.** The key has an `_html` suffix and contains only reviewed theme-owned `<strong>` markup.

**7 and 8 — coverage.** Structural checks and rendered customer/editor tests find a missing key before a hard-coded emergency fallback does.

## Full code

### `locales/en.default.json`

```json
{
  "general": { "see_all": "See all" },
  "garden_picks": {
    "heading": "Garden picks",
    "items_remaining": {
      "zero": "No garden picks remaining",
      "one": "{{ count }} garden pick remaining",
      "other": "{{ count }} garden picks remaining"
    },
    "note_html": "Spend <strong>more</strong> time outside"
  }
}
```

### `locales/fr-CA.json`

```json
{
  "general": { "see_all": "Voir tout" },
  "garden_picks": {
    "heading": "Suggestions du jardin",
    "items_remaining": {
      "zero": "Aucune suggestion du jardin restante",
      "one": "Il reste {{ count }} suggestion du jardin",
      "other": "Il reste {{ count }} suggestions du jardin"
    },
    "note_html": "Passez <strong>plus</strong> de temps dehors"
  }
}
```

### `sections/garden-picks.liquid`

```liquid
<section class="garden-picks">
  <h2>{{ 'garden_picks.heading' | t }}</h2>
  <p data-status>{{ 'garden_picks.items_remaining' | t: count: collection.products_count }}</p>
  <p>{{ 'garden_picks.note_html' | t }}</p>
  <a href="{{ collection.url }}">{{ 'general.see_all' | t }}</a>
  <span class="visually-hidden">{{ 'garden_picks.private_notice' | t }}</span>
</section>
{% schema %}
{
  "name": "t:sections.garden_picks.name",
  "settings": [{ "type": "text", "id": "heading", "label": "t:sections.garden_picks.settings.heading.label" }],
  "locales": {
    "en": { "garden_picks": { "private_notice": "Garden picks section" } },
    "fr-CA": { "garden_picks": { "private_notice": "Section Suggestions du jardin" } }
  }
}
{% endschema %}
```

### `locales/en.default.schema.json`

```json
{ "sections": { "garden_picks": { "name": "Garden picks", "settings": { "heading": { "label": "Heading" } } } } }
```

### `locales/fr-CA.schema.json`

```json
{ "sections": { "garden_picks": { "name": "Suggestions du jardin", "settings": { "heading": { "label": "Titre" } } } } }
```

## What people get wrong here

**Using English conditionals for plural forms.** It breaks locale grammar. Pass `count` and let the active locale decide.

**Putting editor labels in storefront JSON.** Customers and merchants are different audiences; use `.schema.json` plus `t:` for editor text.

**Making every string section-local.** Shared UI concepts then duplicate and drift. Keep global concepts in theme locales.

**Using `_html` to bypass normal review.** The suffix only marks intentionally rendered static markup; it is not an injection escape hatch.

## Stretch: direction only

Compare key trees and interpolation names against the default catalog, resolve schema `t:` paths, and report unused candidates for human review. Do not automatically delete a key merely because static search cannot see a dynamic extension point.


## Coverage and failure analysis

Start the implementation review with the default catalog, not with a rendered English page. The default file defines the intended key tree, interpolation vocabulary, and plural shape. Compare each supported storefront file to it path by path. A French catalog does not need identical English words, but it needs the same concept slots when the feature requires them. The same rule applies separately to schema locale files. A customer-facing `t` key can resolve while a merchant still sees a raw `t:sections...` reference in the editor if schema coverage was omitted.

The Garden picks call demonstrates why interpolation is part of the interface. `items_remaining` receives only `count`; the locale owns surrounding grammar and position. Test zero, one, and a larger number in each locale. English might render an ordinary `one`/`other` distinction, while other languages may select different CLDR categories. A Liquid conditional that writes separate English singular/plural messages would work visually in one preview yet block translators from expressing their language’s rules.

The `_html` suffix is deliberately limited. The note includes one small strong tag owned by the theme, so its appearance is reviewed as markup in both languages. The solution does not interpolate product title, rich text, or merchant input into that HTML string. If a link, user value, or complex nested markup becomes necessary, prefer a composition of safe template markup and ordinary translations rather than broadening the unescaped surface. Escaping by default is the baseline; `_html` is a documented exception.

The private notice shows the narrow use for section-schema `locales`: the portable Garden picks component can render its own implementation-specific storefront phrase without polluting every theme’s global catalog. In contrast, “See all” is a theme-global concept because product and search contexts can reuse it. This boundary prevents two opposite failures: duplicating universal UI text into every section, and turning every component detail into a global translation liability.

A release check has two layers. Structural automation validates JSON, IETF/default file naming, matched key trees, schema `t:` references, required interpolation names, and a report of possible unused keys. Human review renders long French content, zero/one/many counts, editor labels, fallback behavior, right-to-left or other supported language needs, and translated markup. Record missing keys with their affected surface and owner. Do not hide them with an English literal: that creates a second translation system and makes a catalogue mismatch harder to repair.

When the feature evolves, retain a stable key if only copy tone changes. Introduce a new key when semantic intent, variable contract, or markup meaning changes enough that existing translations would mislead. Remove keys only after searching theme references, schema references, section-local catalogs, and extension documentation. Static unused-key reports guide the review but cannot prove a key is dead in a configurable theme. This lifecycle practice keeps catalogue size within platform constraints while protecting translators from unexplained churn.
Keep this ownership record alongside every translation change and release review.
Test this policy on both storefront and editor surfaces before every supported-locale release.
Use documented owners, context, and renderer checks for every catalogue change.
Keep these checks mandatory and visible during future releases.
Maintain these checks continuously.
