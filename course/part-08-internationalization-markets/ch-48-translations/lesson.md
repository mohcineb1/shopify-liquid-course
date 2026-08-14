<!-- STATUS: final -->
---
id: ch-48
title: "Translations"
part: 8
---

# Chapter 48 — Translations

A translatable theme does not scatter alternate prose through Liquid files. It gives customer-facing and merchant-facing language an explicit owner, stable keys, context, and a fallback policy. The result is not merely a French button instead of an English button: it is a theme whose layout, plural language, editor labels, reusable sections, and future refactors remain understandable to translators and developers.

## 48.1 `locales/*.json` and `locales/*.schema.json`

Theme locale files live in `locales/` and are JSON catalogs. Shopify distinguishes storefront locale files, ending in `.json`, from schema locale files, ending in `.schema.json`.[1] Storefront files contain language visible to customers; schema files contain language for theme-editor settings. Both types need one default file using `*.default` in the filename, such as `en.default.json` and `en.default.schema.json`.[1]

Locale names follow IETF language tags. A regional English catalog can be `en-GB.json`; French Canadian can be `fr-CA.json`; a language without regional distinction can be `fi.json`.[1] Do not invent names such as `french.json` or use a storefront file as a schema file. A theme needs a corresponding default catalog for each type and should keep language coverage intentional.

```text
locales/
  en.default.json
  fr-CA.json
  en.default.schema.json
  fr-CA.schema.json
```

Catalog structure is nested for context. The first level is a category, the second a group, and the final key is a descriptive message. Shopify recommends enough key context that a phrase can be understood outside its source file.[1] `products.card.add_to_cart` is preferable to a generic `buttons.add`: it tells a translator what the phrase means and lets a future developer find its domain.

```json
{
  "products": {
    "card": {
      "add_to_cart": "Add {{ product_title }} to cart",
      "sold_out": "Sold out"
    }
  }
}
```

Do not use locale JSON as an unstructured dumping ground. Group snippet strings by their product, cart, account, search, or layout responsibility rather than by every physical filename. A shared “See more” may be theme-global; a product-card label belongs in the product category even when a related-products snippet renders it. Shopify currently limits one locale file to 3,400 translations and each value to 1,000 characters, which makes disciplined naming and pruning operational rather than cosmetic.[1]

## 48.2 The `t` filter, interpolation, pluralization rules

The translation filter is commonly written as `t`. It resolves a single-quoted key from the storefront locale for the active language.[2] Use it in layouts, templates, snippets, and Liquid assets instead of hard-coded customer language.[3]

```liquid
<button type="submit">
  {{ 'products.card.add_to_cart' | t: product_title: product.title }}
</button>
```

The interpolation names in the catalog and the arguments in Liquid are a contract. If the string has `{{ product_title }}`, the call passes `product_title:`. A label with two placeholders needs two named arguments. Do not concatenate translated fragments—such as a translated “Add” plus an English product title—because word order, punctuation, grammatical agreement, and direction differ by language.

```json
{
  "cart": {
    "line_count": {
      "one": "You have {{ count }} item",
      "other": "You have {{ count }} items"
    }
  }
}
```

```liquid
{{ 'cart.line_count' | t: count: cart.item_count }}
```

Passing `count` invokes locale-aware plural selection. Shopify supports the CLDR forms `zero`, `one`, `two`, `few`, `many`, and `other`.[3] English often requires only `one` and `other`; another language may require different forms. Do not implement pluralization with a Liquid `{% if count == 1 %}` around two separate keys. The locale engine knows the active language’s rules; the catalog preserves translator control.

Translations are escaped by default. A key ending in `_html` opts out of escaping and is appropriate only when the theme deliberately owns the markup in the translation value.[3] It is not permission to insert unreviewed merchant or user content as HTML. Prefer normal text keys. When HTML is unavoidable, keep markup small, predictable, documented, and tested in every locale.

## 48.3 Translating schema strings with `t:` keys

Schema locale files translate the merchant-facing labels, info text, and descriptions used by the theme editor. Inside a section schema, reference a schema key with the `t:` prefix; it points to the active schema locale catalog rather than a storefront message.

```json
{
  "name": "t:sections.featured_collection.name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "t:sections.featured_collection.settings.heading.label"
    }
  ]
}
```

```json
{
  "sections": {
    "featured_collection": {
      "name": "Featured collection",
      "settings": {
        "heading": { "label": "Heading" }
      }
    }
  }
}
```

Keep storefront and editor strings separate. A customer sees `{{ 'products.card.sold_out' | t }}`; a merchant sees `t:sections.featured_collection.settings.heading.label` in the editor. They may share words but have different audiences and contexts. A merchant label should describe what a setting changes, not simply echo the customer-facing heading.

A section can also define a `locales` object inside its schema. Shopify documents that these keys are accessible through `t` only to that section, which is useful for a portable standalone section; global theme strings belong in the theme `locales/` directory.[2] Schema strings outside that section-local `locales` object are editor text and do not use the `t` filter.[2]

> [VERIFY] Before distributing a portable section, validate the active theme’s section-schema locale format and the intended boundary between section-local and global keys.

## 48.4 Missing-translation behaviour and fallbacks

A missing translation is a product defect, not a cue to hard-code a backup phrase next to every `t` call. Detect it through locale review, Theme Check/local test processes, and storefront/editor inspection. The first fallback is a complete default locale: its key structure is the source catalog against which every supported language is compared. Keep keys aligned deliberately; a French file with old keys may appear “mostly translated” while a newly added cart state fails in a buyer flow.

Choose a fallback policy by audience. A customer-facing missing key must be fixed in the relevant storefront catalog; an editor label must be fixed in schema locale coverage. Do not hide missing strings with opaque keys, arbitrary English literals, or a JavaScript dictionary that disagrees with Liquid. Those tactics create two translation systems and make the failure harder to locate.

Custom date formats need particular care. Shopify documents that a custom `date_formats` entry must exist in all active locale files; if it is missing for the active language, Liquid renders an error.[3] Treat date-format keys like API keys: one definition in the default catalog, equivalent review in every supported locale, and a rendering test that uses a real date.

When a translation has an `_html` suffix, missing-key testing must cover both text and markup. A key can resolve while a translated tag or punctuation change breaks an inline link. Test text direction, lengthy strings, variables, zero/one/many values, and HTML rendering in target locales—not just whether JSON parses.

## 48.5 Keeping a translation catalogue maintainable at scale

Catalogues scale through governance. Establish a key convention, a domain owner, a default-language change review, and a deletion rule. Add a key where the semantic concept lives; do not add a new synonym because an author cannot find the existing phrase. Keep keys stable when English copy changes, unless the concept changed enough to need a new translator context. When retiring a feature, remove its Liquid/schema references and its catalog keys together.

Maintain a translation inventory with key path, audience, source surface, interpolation variables, plural forms, HTML status, and owning feature. This makes a code review ask useful questions: Did this new `t` key appear in every supported storefront file? Is a `t:` schema label present in every schema locale? Did an interpolation variable change name? Did a new plural count receive the `count` argument? A shallow JSON diff cannot answer those questions reliably.

Automate structural checks in CI: valid JSON, one default locale per type, matched default-key trees, required interpolation names, missing/unused key reports, and schema `t:` reference resolution. Keep translation quality review human: legal terminology, product voice, gender/plural rules, truncation, directionality, and contextual screenshots need people who understand the language and surface.

For large themes, avoid one giant generic category. Use domains such as `products`, `cart`, `search`, `customer`, `sections`, and `general`; document exceptions. Keep repeated phrases global only if their meaning remains the same. “Continue” at checkout, account creation, and a carousel may require different translation context, accessibility wording, and future copy ownership.

## Checklist

- [ ] Storefront and schema locale files have valid names and one default each.
- [ ] Customer text uses `t`; editor labels use schema `t:` keys.
- [ ] Interpolation and plural forms are declared in catalog text and tested with values.
- [ ] Missing/default coverage, date formats, and `_html` keys receive explicit review.
- [ ] CI checks catalog structure while human review protects language context.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/locales "Shopify — Locales"
[2]: https://shopify.dev/docs/api/liquid/filters/translate "Shopify — translate"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/locales/storefront-locale-files "Shopify — Storefront locale files"


## Catalogue review in practice

Treat a locale addition as a small API change. A developer first adds the default-language message with a domain-specific key, notes the target surface, and declares every interpolation name and plural behavior. A reviewer then checks that Liquid uses exactly the same names. Translators receive a comment or inventory record explaining whether the string appears on a product card, is announced to screen readers, sits beside a price, or is a theme-editor control. This context is frequently more valuable than a literal English phrase.

For example, a promotional product-card string might need the product title but not HTML:

```json
{
  "products": {
    "card": {
      "quick_add_available": "Quick add {{ product_title }}"
    }
  }
}
```

```liquid
<span class="visually-hidden">
  {{ 'products.card.quick_add_available' | t: product_title: product.title }}
</span>
```

The translation is one sentence, so a locale can place the title where grammar requires. The source is also semantically identified as a screen-reader/product-card concept. If the input variable changes from `product_title` to `title`, update the catalog and every locale together. Leaving an old placeholder in only one locale produces an error that is harder to notice than an obvious missing English phrase.

Plural tests should include values that reveal category selection, not only one and two. Test zero, one, a normal large count, and where relevant a language that has `few` or `many` requirements. The Liquid call remains the same; the active locale decides which catalog branch applies. This keeps conditional logic out of templates and stops one language’s grammar from becoming the theme’s global rule.

Schema review needs the same rigor. A setting label appears in merchant workflows and must describe an action or content field precisely. Do not reuse a customer-facing `products.card.heading` just because both happen to say “Heading.” Store editor language under `sections` or a theme-settings domain, use `t:` in the schema, and check that every `t:` reference resolves in the schema catalog. A theme can render perfectly while its editor shows raw keys, so test both storefront and editor after translation work.

A maintainable catalogue also distinguishes source content from generated or external content. Product titles, descriptions, and merchant-entered rich text often travel through Shopify’s content translation systems rather than theme locale JSON. Locale files should contain stable interface concepts the theme owns. Duplicating mutable catalog product data into theme keys makes translations stale and turns a catalog update into a code deployment problem.

Use an explicit missing-key workflow. A pull request that adds `{{ 'search.empty_state.title' | t }}` must add the default key, add or queue every supported locale, state the temporary policy if coverage is incomplete, and include a screenshot or rendered assertion. A removal does the reverse: search usages, delete all catalog leaves, remove tests, and avoid leaving a misleading orphan. Periodic unused-key reports are valuable only when reviewed against dynamic keys and section-local catalogs; automatic deletion without context can remove a legitimate extension point.

Finally, ensure JSON quality before linguistic review. Valid syntax, matching nested paths, valid IETF filenames, one default file per catalog type, and value-length/key-count headroom are deterministic checks. Then involve qualified reviewers for linguistic quality. A valid JSON file cannot determine whether French text overflows a compact button, whether Arabic punctuation and direction are appropriate, or whether a plural phrase accidentally implies an unsupported business promise. Catalog engineering makes those human checks targeted and repeatable.

## Translation test matrix

| Surface | Structural assertion | Render assertion |
| --- | --- | --- |
| Product card | `t` key and interpolation names exist in storefront catalogs | Long title and translated button remain understandable. |
| Cart count | Required CLDR forms exist for active language | Zero, one, and larger counts choose meaningful grammar. |
| Section editor | Schema `t:` key exists in schema catalogs | Merchant sees label and help text, not a raw key. |
| HTML message | `_html` use is intentional and reviewed | Allowed tags render; no untrusted value becomes markup. |
| Date format | Key appears in every active locale | Date renders without a Liquid error. |

This matrix keeps missing translation behavior visible in the same places that buyers and merchants use the theme.
