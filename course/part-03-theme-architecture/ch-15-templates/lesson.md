<!-- STATUS: final -->
---
id: ch-15
title: "Templates"
part: 3
words: 2500
---

# Chapter 15 — Templates

A template answers a route-level question: *which page composition should Shopify render for this resource?* It is not a reusable component, a global layout, or a database query. A template establishes a page type and its contextual object surface, then either directly renders Liquid or, more commonly in an Online Store 2.0 theme, declares a merchant-composable set of sections in JSON.

## 15.1 The full template type list: index, product, collection, list-collections, page, blog, article, cart, search, customers/*, 404, password, gift_card, metaobject

The principal template types map to storefront routes and resource families. `index` is the storefront home page. `product`, `collection`, `page`, `blog`, and `article` frame their corresponding content resources. `list-collections` presents collection discovery. `cart` frames the cart page. `search` frames search output. `404` handles an unresolved route. `password` serves a password-protected storefront state. `gift_card` serves a gift-card page. `metaobject` renders an eligible web-facing metaobject route.

Customer templates live under the `customers/` namespace and cover account-related routes such as account, login, register, activate account, reset password, addresses, and order. Their context and access assumptions differ from product and collection pages. Do not infer that a resource Drop is available merely because a template filename sounds related; template-scoped availability is a contract of the specific route.

| Template family | Primary page concern | Typical contextual surface |
| --- | --- | --- |
| `product` | One sellable product page | `product` |
| `collection` | One selected collection | `collection` |
| `blog` / `article` | Publishing index or entry | `blog` / `article` |
| `cart` | Current shopper cart | `cart` |
| `search` | Current search response | `search` |
| `customers/*` | Customer account flow | customer/account-specific objects |
| `404`, `password`, `gift_card` | Special storefront state | special route contract |

The table is a routing model, not permission to use every possible object in every template. Consult the object reference when a component depends on a resource-specific property.

> [VERIFY] Verify the current template-type and object-availability contracts for the storefront route you are extending, especially customer and metaobject surfaces.

## 15.2 JSON templates vs Liquid templates — capabilities, trade-offs, and when Liquid is still correct

A JSON template declares section composition as data. It gives merchants Theme Editor control over section order and settings for a compatible resource page. A Liquid template renders Liquid directly and can use template-level control flow as its primary composition mechanism. Neither is “more powerful” in every respect; they assign control to different owners.

JSON templates are normally correct when a merchant needs to arrange approved sections on a standard resource page. They make composition visible, structured, and editable. Liquid templates remain correct when a resource type, special page, legacy theme contract, or route-level composition requires Liquid-only behavior that JSON templates cannot represent directly. They are also used for some special template surfaces whose platform contract is not merchant-composed JSON.

The trade-off is intentionality. JSON moves page arrangement into structured configuration; Liquid keeps arrangement in code. Do not use a Liquid template simply to avoid defining a reusable section contract, and do not use JSON to hide page-specific logic that belongs in a section or in a supported non-theme surface.

> [VERIFY] Verify current JSON-template support and restrictions for a specific template type before converting a Liquid template or introducing a new alternate.

## 15.3 Alternate templates and suffix routing

An alternate template is a variant of a base template type identified by a suffix. For example, `product.promo.json` is an alternate product template, while `collection.editorial.json` is an alternate collection template. The base type establishes the route/resource contract; the suffix names the composition variant.

A suffix is not an arbitrary URL feature flag. It is a template assignment or routing selection recognized by Shopify. Keep suffix names descriptive of a stable page intent: `promo`, `preorder`, `editorial`, or `landing` are understandable when their composition differs. Avoid suffixes named after temporary campaigns, implementation experiments, or individual products unless the underlying assignment will be maintained as a durable merchant choice.

```text
templates/
├── product.json
├── product.promo.json
├── collection.json
└── collection.editorial.json
```

A base product template and a `promo` alternate can share sections, but each template owns its order and settings. Do not copy a whole product template merely to change one card color; change a section setting or component style when the page composition is the same.

## 15.4 Anatomy of a JSON template: `sections`, `order`, `settings`, `blocks`

A JSON template has a top-level `sections` object and an `order` array. Each section entry supplies a section `type`, optional `settings`, and sometimes `blocks` and a block `order`. The `order` array determines which section IDs render and in what sequence. The section type points to a file in `sections/`; the IDs are template composition identifiers, not filenames.

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": { "show_vendor": true }
    },
    "recommendations": {
      "type": "product-recommendations",
      "settings": {}
    }
  },
  "order": ["main", "recommendations"]
}
```

`settings` are values for that section instance, constrained by the section schema. `blocks` are instance data for blocks the section schema permits; their order belongs to the section instance. A template does not invent arbitrary section properties. Its JSON shape must match the configuration contract declared by each section and block.

The major review question is simple: can a merchant understand which page regions this template composes, and can Shopify resolve every declared type and setting? If not, the problem is not solved by adding more JSON—it is a missing section, schema, or architecture contract.

## 15.5 Template-scoped objects and what is available where

The template type determines the primary resource context. A product template is where `product` is expected; a collection template is where `collection` is expected; a cart template is where `cart` is central; an article template owns the article context. Global values and settings may remain available across templates, but a section reused across several page types cannot assume a page-specific Drop exists.

Write reusable sections defensively through explicit setting and block contracts. A section intended for multiple template types should not quietly assume `product` exists. If it is product-specific, express that through its intended placement and schema rather than allowing a blank output on unrelated pages to become its behavior.

```liquid
{% if product != blank %}
  <h1>{{ product.title | escape }}</h1>
{% endif %}
```

The guard avoids an error-like outcome but does not make the section resource-agnostic. The correct architectural question is whether the section belongs on a product template at all. Object availability comes from the rendering context, not from a section filename.

## 15.6 Merchant-assignable templates and product/collection template suffixes

Merchants can assign appropriate templates to products and collections in Shopify’s admin, selecting from the available template variants for that resource type. This is the business value of alternate templates: a merchant can choose a durable page composition without code edits. A `product.promo` template can support a campaign-oriented product composition; a `collection.editorial` template can support a different collection story.

Assignment does not turn a template suffix into product data or create a new object surface. The selected product remains a product; the selected collection remains a collection. The template determines composition, while resource data and section settings determine the content rendered inside that composition. Document assignment intent so a merchant knows when to choose the base template and when to choose an alternate.

Review all merchant-assignable alternates for lifecycle. If a campaign ends, either retain the template as a reusable promotion pattern or migrate assigned resources before removing it. Deleting an alternate that remains assigned creates broken page composition. The suffix is therefore a content-model and operational decision, not simply a file naming convention.

## Gotchas

- **Treating a template as a reusable component.** Templates establish route composition; sections and snippets own reusable rendering.
- **Assuming every Drop exists everywhere.** Primary objects follow the active template context.
- **Using a suffix for a one-line cosmetic variation.** Change section settings when page composition is unchanged.
- **Editing JSON without matching section schema.** Template settings and blocks must fit declared contracts.
- **Deleting an assigned alternate template.** Assignment lifecycle is a merchant-facing operational concern.
- **Confusing customer templates with normal storefront resource templates.** Their route and access contracts differ.

## Checklist

- [ ] I can identify the base template type and its primary route context.
- [ ] I choose JSON for merchant composition and Liquid only where its template-level contract is necessary.
- [ ] My alternate suffix names a durable composition intent.
- [ ] Each JSON section, setting, block, and order entry has a corresponding schema contract.
- [ ] I make template assignment and removal safe for merchant-managed resources.

## Related

- `ch-13-anatomy-of-a-theme` — special directory and file contracts.
- `ch-14-layouts` — the frame surrounding template output.
- `ch-16-section-groups` — persistent group composition.
- `ch-17-sections` — section schema and settings.
- `ch-27-product-collection` — resource-specific page data.

[1]: https://shopify.dev/docs/storefronts/themes/architecture/templates "Shopify template architecture"

## Template selection is a routing decision

Start template work from the resource route, not from a desired visual result. A product is routed through a product template family; a collection through a collection template family; a page through a page template family. The chosen template tells Shopify how to compose the page for the resource already selected by the route. It does not query a different product, convert a collection into a page, or provide a way to bypass the normal resource contract.

This perspective prevents duplicated architecture. If two products need different marketing emphasis but share the same underlying product resource, an alternate product template can be appropriate. If every product merely needs one optional badge, the page composition probably does not differ and the choice belongs in a section setting or resource data. The template boundary should be reserved for a real change in page-level composition, section order, or intended merchant editing surface.

Template names should also communicate resource family. `product.promo` makes the base type, alternate intent, and assignment surface clear. A name like `summer-final-2` carries little meaning once the campaign ends. Durable suffixes reduce the risk that a merchant assigns an obsolete template because it was the only vaguely recognizable option in admin.

## JSON instances are configuration, not source code

In a JSON template, the `sections` object describes **instances** of section types. Two entries can share the same type but have different IDs and settings because they are distinct page regions. The `order` array controls only the instances listed within it. A section entry that exists in `sections` but is absent from `order` is not part of the normal rendered sequence. Read the JSON as a composition manifest rather than as a substitute for Liquid control flow.

For section blocks, the same ownership applies at a smaller scale. The section schema defines which block types and settings are allowed; the JSON instance configures allowed blocks and their order. A template cannot give a block a setting absent from its schema and expect Shopify to invent an editor control. If a merchant need cannot be expressed by the current schema, change the section/block contract deliberately rather than patching arbitrary fields into template JSON.

This division supports safe review. The section file answers “what can this component do?” The template answers “where does this configured instance appear on this page?” The merchant editor answers “which allowed values should this instance use?” Conflating the three produces JSON that is difficult to validate and a theme that is difficult to evolve.

## Context-aware reusable sections

A section’s placement determines the data context it receives, but reusable code should never treat an accidental context as a universal API. A product-specific main section can reasonably expect a product template placement. A promotional section intended for product and collection pages should choose explicit settings and blocks rather than assuming both `product` and `collection` exist. The more contexts a section supports, the more its own input contract must state what is required and what is optional.

When debugging blank output, identify the active template and section placement before adding guards. A `product` check may prevent empty markup, but it does not establish that a section belongs on a product page. Correct placement and a documented section contract are preferable to silent generic behavior. The object graph chapter explains value availability; template architecture explains why a given page composition receives that context.

## Assignment lifecycle review

Merchant assignment makes template deletion an operational change. Before renaming or removing an alternate, list the products, collections, or pages using it and decide their replacement template. Test the replacement in a preview with representative resource data. If an alternate is a recurring business pattern, document the purpose and ownership in the theme so a merchant can choose it confidently. If it was a one-time campaign, migrate assignments and remove the obsolete surface deliberately.

The same review applies when converting a Liquid template to JSON. Confirm the new template type supports the intended merchant editing experience, map the old composition into valid sections and settings, and verify assignments after conversion. Platform compatibility and editor behavior must be verified from current documentation rather than inferred from an existing legacy file.
