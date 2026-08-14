<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-13-solution
title: "Solution — Map a theme component to the right homes"
chapter: ch-13
---

# Solution — Map a theme component to the right homes

The collection highlight is deliberately split by Shopify runtime responsibility. The section owns merchant settings, resource-state branching, and component placement. The snippet owns one reusable product-card shape through an explicit `product` input. The CSS file is a theme asset loaded through `asset_url`. The locale file owns customer-facing fallback copy. None of the files needs a new template, block, app, browser feature, or broad data lookup.

## File map and ownership

| File | Owner and reason |
| --- | --- |
| `sections/collection-highlight.liquid` | A configurable editor component with schema and selected collection setting. |
| `snippets/collection-highlight-card.liquid` | Reusable markup called with an explicit current product. |
| `assets/section-collection-highlight.css` | Theme-delivered styles resolved through the theme asset path. |
| `locales/en.default.json` | Customer-facing fallback copy resolved with translation keys. |

The directory contract makes the composition graph visible: a template can place the section; the section reads its setting; the bounded loop passes one product into the snippet; and the browser receives styling from the declared asset. The snippet cannot silently read `section` or `collection`, because it receives only `product`.

## 1. Keep configuration and content states distinct

The section first checks whether `section.settings.collection` is present. If it is missing, it uses the locale-backed configuration message. If it exists, the `for` loop reads only that selected collection’s products. The loop’s `else` then represents a selected collection that has no products. This ordering prevents merchant configuration absence from becoming customer-facing empty-content logic.

```liquid
{% if section.settings.collection != blank %}
  {% for product in section.settings.collection.products limit: 3 %}
    {% render 'collection-highlight-card', product: product %}
  {% else %}
    <p>{{ 'sections.collection_highlight.empty_collection' | t }}</p>
  {% endfor %}
{% else %}
  <p>{{ 'sections.collection_highlight.select_collection' | t }}</p>
{% endif %}
```

The outer bound is `limit: 3`, because this is a small highlight rather than a second collection page. The section owns the list wrapper; the snippet owns each direct list item. This produces valid list structure while keeping the reusable card API small.

## 2. Resolve styles and copy through their owners

The section includes its CSS with the current theme asset route:

```liquid
{{ 'section-collection-highlight.css' | asset_url | stylesheet_tag }}
```

This is not a merchant-uploaded file URL and not a hard-coded CDN path. The locale file supplies the two fallback keys, so copy can be translated without editing Liquid. The section heading setting remains merchant configuration; it is escaped at output. These boundaries make each later change discoverable: copy changes in `locales/`, styles in `assets/`, settings in section schema, and reusable markup in `snippets/`.

> [VERIFY] Verify the current locale-file naming and translation-key conventions of the target theme before adding the locale entry to an existing production locale tree.

## 3. Respect theme architecture limits

The component consumes one section, one snippet, one asset, and one locale entry. It does not add a theme block file, which avoids increasing the 300 theme-block-file count. Its section has no merchant-managed blocks, so it stays far from the 50-block section ceiling. The architecture remains small as the theme grows because the section’s responsibility is focused and its product list is bounded.

The relevant verified limit is not a reason to place every component in a giant shared file. It is a reason to use stable responsibilities and delete abandoned architecture surfaces. A new block or section should appear only when it creates a real editor or composition contract, not because a developer wants another folder-level abstraction.

## 4. Exclude responsibilities the theme does not own

No fetch call is needed because the merchant-selected collection is already a contextual setting value. No npm package or build pipeline is needed because theme assets are delivered through `assets/`. No checkout behavior, application persistence, private API access, or product-policy decision belongs in this highlight. If a later feature asks for those capabilities, select an app, extension, API, or browser architecture deliberately rather than adding hidden work to this section.

## Validation matrix

| State | Expected output |
| --- | --- |
| Missing setting | Locale-backed configuration message only. |
| Selected empty collection | Locale-backed content-empty message. |
| Three or more products | Exactly three snippet-rendered cards. |
| Card render | Product value is explicit; no implicit section or collection read. |
| Asset delivery | CSS path resolves through `asset_url` and `stylesheet_tag`. |

## Checklist

- [x] Every file is in the platform-recognized home that owns its responsibility.
- [x] Schema, locale copy, asset delivery, and snippet API stay separate.
- [x] Missing configuration and empty selected-content states are distinct.
- [x] The product preview is contextual and bounded.
- [x] No unsupported theme responsibility was introduced.

## 5. Read the component through its consumers

The section is the only file that needs editor settings, so the heading and collection picker live in its schema. A template or section-group can place it later, but neither needs to know the internal card markup. The section reads the selected collection once, owns the list wrapper and its two empty states, and passes each current product to the snippet. This gives the merchant one recognizable editor surface and gives the developer one place to review the bounded collection relationship.

The snippet has an intentionally small API. It receives `product` and renders one direct list item. It does not choose a collection, inspect section settings, include CSS, or translate section-level fallback messages. Those responsibilities would make a supposedly reusable fragment dependent on hidden caller state. Passing the input explicitly lets the snippet be tested with any appropriate current product and prevents collection traversal from becoming invisible inside a helper.

The locale file is the home for strings whose grammar may vary by storefront language. The configuration and empty-content messages are not strings the section should manufacture through `append` or condition branches. The section chooses which state exists; the locale key supplies customer-facing wording. This division means a translation change does not require a Liquid change and a resource-state change does not require copying text across files.

## 6. Verify scale and release behavior

Inspect the editor and storefront together. The editor should show only the two settings the section owns. A missing collection should produce the configuration message without an empty list. A selected empty collection should produce the content-empty message. A populated collection should render exactly three cards, each from the snippet, inside one ordered list. Trace the stylesheet request to the theme asset include rather than an uploaded Files URL.

This feature remains below relevant scaling pressures because it adds no block file, no block nesting, and no unbounded editor collection. If the team later needs per-card merchant settings, decide whether a section block or theme block genuinely creates an editor contract before adding it. Do not add a block merely to avoid passing an explicit product into a snippet; that would consume a different architecture surface without solving a merchant need.

## Implementation checklist

- [x] Section schema, snippet API, asset delivery, and locale copy have distinct owners.
- [x] The selected collection setting is the only product source and is bounded to three cards.
- [x] Missing configuration and selected-empty content are separate states.
- [x] Customer-facing fallback text comes from locale keys.
- [x] The component adds no block, API, checkout, persistence, or build-system responsibility.
