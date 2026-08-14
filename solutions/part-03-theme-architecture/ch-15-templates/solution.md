<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-15-solution
title: "Solution — Compose a merchant-assignable product alternate"
chapter: ch-15
---

# Solution — Compose a merchant-assignable product alternate

`product.promo.json` is a product-template alternate. Its base type remains `product`, so Shopify renders it for a product resource and its main product section receives product context. The suffix `promo` identifies a durable merchant-selectable composition. It does not create a different product type, expose additional product fields, or change the product’s underlying data.

## 1. Define two schema-backed section instances

The JSON template declares the two approved section instances under stable instance IDs. `main` points to the product-specific section and uses its supported `show_vendor` setting. `promo_callout` points to the reusable callout and uses only its schema-defined message setting. The template does not invent block data or settings absent from the supplied schemas.

```json
{
  "sections": {
    "main": {
      "type": "main-product-promo",
      "settings": {
        "show_vendor": true
      }
    },
    "promo_callout": {
      "type": "promo-callout",
      "settings": {
        "message": "Selected products include this limited promotion."
      }
    }
  },
  "order": ["main", "promo_callout"]
}
```

The IDs are template instance names; the `type` values correspond to section files. The `order` array renders the main product region first and the callout second. The section object and order array work together: an instance without a listed ID is not part of the intended rendered sequence, and an order ID without a matching section instance is invalid composition.

## 2. Separate template context from section contracts

`main-product-promo` is explicitly product-context-specific. It renders `product.title` because the template family is product. The callout section does not read `product`; it has a heading fallback derived from its locale key and a merchant-controlled message setting. This prevents a reusable promotional region from becoming silently dependent on product context.

```liquid
<section class="main-product-promo">
  <h1>{{ product.title | escape }}</h1>
</section>
```

```liquid
<section class="promo-callout">
  <h2>{{ section.settings.heading | default: 'sections.promo_callout.default_heading' | t }}</h2>
  <p>{{ section.settings.message | escape }}</p>
</section>
```

The first section belongs in the product composition because it requires the product Drop. The second can be configured through its schema and rendered without relying on product data. This difference is architectural, not merely a guard condition: the callout’s API is its settings; the main section’s placement supplies its context.

> [VERIFY] Verify current section schema behavior, JSON-template restrictions, and the exact product-alternate assignment workflow before using this file in a production store.

## 3. Keep customer defaults in locales and styles in assets

The fallback heading is not hard-coded into JSON. The locale file owns the default customer copy under `sections.promo_callout.default_heading`; the callout resolves it with `t` when no merchant heading is supplied. This lets a localized storefront translate the default without changing the template composition.

The callout stylesheet is a theme asset loaded from the callout section. The product JSON template does not embed CSS or choose external URLs. This keeps page composition, component asset delivery, and customer copy in their appropriate contracts: template, section/asset, and locale respectively.

## 4. Manage merchant assignment deliberately

Preview `product.promo` against representative products before assigning it. Choose products that genuinely need the promo composition and confirm the main section has product data while the callout settings read clearly in the editor. In admin, assignment selects the composition for a product; it does not duplicate the product or change its base resource contract.

Before deleting or renaming the alternate, inventory the products assigned to it and move them to a replacement base or alternate template. Preview the replacement, confirm that no required promotion content is lost, then remove the obsolete template. This assignment lifecycle matters because a template filename is a merchant-facing operational surface, not an internal implementation detail.

## 5. Verify composition rather than only markup

Inspect the JSON first: two section entries, two matching order IDs, and only schema-supported settings. Then inspect the editor: the product alternate should expose the allowed section settings but no invented control. Finally, render a product route and confirm the product title appears once in the main section, the promotion follows it, and the default heading resolves from the locale when the merchant heading is blank.

The solution deliberately excludes a literal product handle, `all_products`, cart logic, Liquid-template branching, blocks, JavaScript, and checkout behavior. None is required to change the page composition for a selected product. Adding them would obscure whether the alternate template itself is correct.

## Validation matrix

| Test | Expected behavior |
| --- | --- |
| JSON structure | Two schema-backed section instances and matching ordered IDs. |
| Product route | Main section receives and renders current product context. |
| Promo section | Reads explicit settings, not `product`. |
| Blank heading | Locale-backed default heading renders. |
| Assignment | Merchant sees `promo` as a product composition alternate. |
| Removal plan | Assigned products are migrated before the template is deleted. |

## Checklist

- [x] The base type, suffix, section types, instance IDs, and order are explicit.
- [x] Each configured setting exists in the corresponding section schema.
- [x] Product context stays inside the product-specific main section.
- [x] Locale defaults, section assets, and template JSON retain separate owners.
- [x] Assignment and removal are handled as merchant-facing lifecycle decisions.

## 6. Read the JSON as page composition

The solution’s JSON does not contain product HTML, translations, CSS, or a lookup rule. It declares which already-defined sections form the page and which allowed values configure those instances. This makes the alternate readable at a glance: the product’s main content appears first, then the promotional component. If a new region is needed, the correct next question is whether an existing approved section can be configured for it or whether a new section contract is required. Editing arbitrary JSON fields is not a shortcut around schema design.

The distinction matters in the theme editor. A merchant can understand that the alternate has two visible regions with settings owned by their respective sections. The merchant cannot use the template JSON to change the product object, invent a data source, or add an unapproved block type. Shopify’s section and block schemas remain the capability boundary for the composition manifest.

## 7. Validate context with representative assignments

Preview the alternate with at least two representative products: one ordinary product and one product selected for promotion. In both cases, the main section should render the current product title because the route is a product route. The callout should render only its configured heading and message, not product-specific output. This confirms the section split is intentional rather than an accidental dependency on page context.

In the editor, test a blank callout heading so the locale default appears. Then supply a merchant heading and verify it replaces the default without changing the template file. This demonstrates the three ownership layers: the template places the instance, the section schema exposes the setting, and the locale supplies the default customer string.

## 8. Maintain the suffix as a business surface

Write down the business rule for assignment, for example: products included in a recurring promotion use `promo`; ordinary catalog products use the base product template. This prevents staff from treating the suffix as a mysterious one-off route trick. When the rule changes, migrate assignments first, validate replacement pages, then remove any obsolete alternate. The template file and the admin assignment are one operational contract.

## Implementation checklist

- [x] The JSON manifest has only two valid, schema-backed instances in intentional order.
- [x] Page context and reusable settings remain separate section contracts.
- [x] Customer defaults come from the locale and styling from the section asset.
- [x] Product assignment and template removal are planned as merchant operations.
- [x] The alternate does not add undocumented data access or non-theme responsibilities.
