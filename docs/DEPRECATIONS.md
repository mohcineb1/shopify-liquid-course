# Platform facts, dates and limits

> **Verify this ledger against the Shopify developer changelog and theme documentation before generating a chapter.** Every chapter quotes this file rather than restating platform facts from memory. Anything unverified stays marked `[VERIFY]`.

## Removed / deprecated

| Thing | Status | Date | Replacement | Source |
|---|---|---:|---|---|
| `{% include %}` | Deprecated; retained on the platform | 2019-11-13 | `{% render %}` | [1] [2] |
| `checkout.liquid` — Information, Shipping, and Payment steps | Unsupported | 2024-08-13 | Checkout Extensibility | [3] [4] |
| `checkout.liquid` + additional scripts — Thank You / Order Status | Sunset | 2025-08-28 | Checkout UI extensions / Web Pixel extensions | [4] [5] |
| ScriptTags — Thank You / Order Status, non-Plus stores | Sunset | 2026-08-26 | Web Pixel extensions / UI extensions | [4] [5] |
| Shopify Scripts (Ruby) | Deprecated; published scripts no longer execute | 2026-06-30 | Shopify Functions or a suitable Functions-based app | [6] [7] |

## Limits

### Templates, section groups, and blocks

| Limit | Value | Notes | Source |
|---|---:|---|---|
| JSON templates per theme | 1,000 | | [8] [9] |
| Sections per JSON template | 25 | | [8] [9] |
| Section groups per theme | 20 | | [8] |
| Sections per section group | 25 | | [8] [10] |
| Blocks per section | 50 | `max_blocks` can reduce the limit. | [8] [9] |
| Merchant-managed blocks per JSON template or section group | 1,250 | Includes app blocks and theme blocks; statically rendered blocks do not count. | [8] |
| Theme block files in `blocks/` per theme | 300 | Every `.liquid` file in `blocks/` counts, whether referenced or not. | [8] [11] |
| Theme block nesting depth | 8 levels | Excludes the section level. | [8] |

### File and theme size

| Limit | Value | Notes | Source |
|---|---:|---|---|
| JSON template file | 512 KB | | [8] |
| Section group file | 512 KB | | [8] |
| `settings_schema.json` | 512 KB | | [8] |
| `settings_data.json` | 1.5 MB | | [8] |
| Locale file | 1.5 MB | | [8] |
| Other Liquid file (section, snippet, layout) | 256 KB | Replaces the obsolete 20 MB single-file entry. | [8] |
| Content in one `liquid` setting | 50 KB | | [8] |
| Uploaded theme package, compressed | 50 MB | | [8] |
| Total code, excluding assets | 250 MB | | [8] |
| Files per theme | 100,000 | | [8] |

### Naming

| Limit | Value | Source |
|---|---:|---|
| Theme name | 50 characters | [8] |
| Section or block schema `name` attribute | 25 characters | [8] |
| Merchant-customized section or block name | 100 characters | [8] |

## Preview-track (teach as preview, never as stable)

| Feature | Introduced | Notes | Source |
|---|---|---|---|
| `{% block %}` / `{% partial %}` Liquid tags | Liquid July '26 developer preview (2026-07-21) | `{% block %}` composes pages directly in Liquid templates; `{% partial %}` marks server-rendered regions that JavaScript can refresh without a full page reload. Use only when the **Liquid July '26 changes** feature preview is selected. | [12] [13] [14] |

## Verified on

**2026-08-13 (GMT+2).** Checked every row against the current Shopify developer changelog and theme documentation. The former 20 MB individual-file claim was incorrect and has been replaced with Shopify's current per-file limits. The missing template, section-group, block, naming, and aggregate-theme limits were added.

## References

[1]: https://shopify.dev/docs/api/liquid/tags/include "Shopify — Liquid tags: include"
[2]: https://shopify.dev/changelog/deprecating-the-include-liquid-tag-and-introducing-the-render-tag "Shopify developer changelog — Deprecating the include Liquid tag and introducing the render tag"
[3]: https://shopify.dev/changelog/checkout-liquid-will-no-longer-work-for-in-checkout-pages-starting-august-13-2024 "Shopify developer changelog — checkout.liquid will no longer work for in-checkout pages"
[4]: https://shopify.dev/docs/storefronts/themes/architecture/layouts/checkout-liquid "Shopify — checkout.liquid"
[5]: https://shopify.dev/docs/apps/build/online-store/blocking-script-tags "Shopify — ScriptTag functionality to be blocked"
[6]: https://shopify.dev/changelog/shopify-scripts-will-be-deprecated-on-june-30-2026 "Shopify developer changelog — Shopify Scripts will be deprecated on June 30, 2026"
[7]: https://help.shopify.com/en/manual/checkout-settings/script-editor/transitioning-to-functions "Shopify Help Center — Transitioning from Shopify Scripts to Shopify Functions"
[8]: https://shopify.dev/docs/storefronts/themes/architecture/limits "Shopify — Theme limits"
[9]: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates "Shopify — JSON templates"
[10]: https://shopify.dev/docs/storefronts/themes/architecture/section-groups "Shopify — Section groups"
[11]: https://shopify.dev/docs/storefronts/themes/architecture/blocks "Shopify — Blocks"
[12]: https://shopify.dev/changelog/developer-preview-liquid-block-and-partial-tags "Shopify developer changelog — Liquid templates can now compose pages with blocks and partials"
[13]: https://shopify.dev/docs/storefronts/themes/getting-started/developer-preview/block "Shopify — Block tag developer preview"
[14]: https://shopify.dev/docs/storefronts/themes/getting-started/developer-preview/partial "Shopify — Partial tag developer preview"
