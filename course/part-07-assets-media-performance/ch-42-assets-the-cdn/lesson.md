<!-- STATUS: final -->
---
id: ch-42
title: "Assets & the CDN"
part: 7
words: 2100
---

# Chapter 42 — Assets & the CDN

A Shopify theme’s `assets/` directory is not a generic public folder. It is a theme-owned input to Shopify’s delivery system, resolved through Liquid filters and served by the CDN with versioning controlled by the platform. Treating it like a framework build directory causes fragile paths, duplicate files, accidental caching assumptions, and media that cannot be merchant-managed. This chapter establishes the ownership rules before performance work makes those mistakes expensive.

## What you'll be able to do

- Choose the URL filter that matches the owner and location of a file.
- Explain why a theme asset URL is not a stable hand-written path.
- Keep theme assets compatible with Shopify’s flat asset naming constraints.
- Design cache invalidation around changed files and platform-generated versions.

## 42.1 `assets/` and how Shopify serves and versions files

The `assets/` directory belongs to the current theme. It contains code and static theme resources that are deployed with the theme: stylesheets, JavaScript, SVGs, and images that a developer owns as part of the implementation. Liquid does not ask you to construct the CDN hostname or theme-version query string. The `asset_url` filter resolves an asset name to the current theme’s CDN URL. Shopify’s official example includes a version query value; that value is output detail controlled by Shopify, not an API a theme should parse or synthesize.[1]

```liquid
<!-- layout/theme.liquid -->
{{ 'theme.css' | asset_url | stylesheet_tag }}
<script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
```

A theme asset has two identities: the repository filename you edit and the delivery URL Shopify emits. Use the first in source control and the second only through the Liquid filter. This lets a copied theme, a preview theme, a published theme, and an updated asset resolve correctly without source changes.

**Wrong: build a CDN path by hand.**

```liquid
<!-- Wrong: theme ID, host, and cache version are not your contract. -->
<script src="/cdn/shop/t/123/assets/theme.js?v=1"></script>
```

**Right: name the theme asset and let Liquid resolve it.**

```liquid
<!-- layout/theme.liquid -->
<script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
```

The distinction matters during preview and release. A manually copied URL can point to the wrong theme or stale content. An `asset_url` expression names the requested resource in the context where Shopify knows the theme. It is also a clearer code-review signal: readers see that `theme.js` is an implementation asset, rather than mistaking it for merchant-uploaded content.

Do not use `assets/` as a dumping ground for product photographs, campaign PDFs, or merchant-selected content. Assets ship with code and are changed by developers. Buyer-facing content that a merchant must replace belongs in Shopify’s content/media workflows and should be referenced through its appropriate object or Files URL. Ownership determines the right URL source.

> [VERIFY] Confirm the current file-type and per-theme upload rules in Shopify’s theme architecture documentation before adding generated binary artifacts. Theme size and file limits are platform rules, not build-tool defaults.

## 42.2 `asset_url` vs `file_url` vs `shopify_asset_url` vs `global_asset_url`

The similarly named filters resolve files from different owners. The common bug is choosing by extension—“it is an image, so use this image URL filter”—rather than asking who owns the file. A logo checked into the theme and a logo uploaded through Shopify Admin are both images, but they have different lifecycle, access, and authoring contracts.

| Filter | Resolves | Use it for | Do not use it for |
| --- | --- | --- | --- |
| `asset_url` | A file in the current theme’s `assets/` directory.[1] | Theme CSS, JavaScript, developer-owned icons, and implementation imagery. | Merchant-uploaded Files or product media. |
| `file_url` | A file from the Shopify Admin **Files** area.[2] | Merchant-managed PDFs, documents, or uploaded content referenced by filename. | A theme asset that must deploy with code. |
| `shopify_asset_url` | A Shopify-hosted asset identified by Shopify’s asset namespace. | Platform-provided resources only when Shopify documentation explicitly instructs this filter. | Theme files or arbitrary uploaded content. |
| `global_asset_url` | A Shopify global asset identified by Shopify’s global asset namespace. | A documented global Shopify asset. | A convenient-looking substitute for the current theme asset. |

The first two are the everyday distinction. `asset_url` returns the CDN URL for a file in the theme assets directory; `file_url` returns the CDN URL for a file from the Files page in Admin.[1] [2] That is a content-management decision, not a URL-format decision.

```liquid
<!-- sections/terms-download.liquid -->
<a href="{{ 'assembly-guide.pdf' | file_url }}">
  {{ 'products.product.assembly_guide' | t }}
</a>
```

The PDF is merchant-uploaded content. A developer should not copy it to `assets/` merely because a link needs a URL. Conversely, a theme module is not a Files upload merely because it ends in `.js`.

`shopify_asset_url` and `global_asset_url` are deliberately narrower. Their names do not mean “better CDN URL.” They describe Shopify-owned namespaces. A theme must not guess filenames for them or use them to bypass ownership decisions. If a current Shopify instruction does not name the exact platform resource and filter, leave it marked for verification rather than inventing a global path.

```liquid
<!-- assets/theme-icon.svg is owned by this theme. -->
<img src="{{ 'theme-icon.svg' | asset_url }}" alt="">

{%- comment -%}
Use a global or Shopify asset filter only for the named resource in its current
Shopify documentation. Do not substitute it for a theme asset.
{%- endcomment -%}
```

> [VERIFY] Verify the current documented resource names and intended use of `shopify_asset_url` and `global_asset_url` before adding either to a theme. They are namespace-specific contracts, not generic fallbacks.

## 42.3 What you cannot do: no subdirectories, no build output conventions

A source repository can use any organization that helps its build process. The deployed theme `assets/` directory has a different constraint: do not assume a nested public directory convention such as `assets/js/cart/index.js` or `assets/images/icons/logo.svg`. Theme asset names must be treated as a flat namespace. A build setup that emits arbitrary nested trees is therefore incompatible until it flattens or renames its outputs deliberately.

This is where frontend habits can mislead you. Vite, webpack, and application frameworks commonly emit hashed files into subdirectories, use manifest lookups, and rewrite module imports. Shopify Liquid does not automatically understand your build manifest, resolve source maps, or translate a source import graph into `asset_url` expressions. If you introduce a build step, it must produce the exact final asset names the theme will reference and must leave a developer-readable mapping from source to output.

```text
# Source organization can be nested
src/components/cart/drawer.js
src/styles/components/cart-drawer.css

# Theme delivery names are intentional and flat
assets/cart-drawer.js
assets/cart-drawer.css
assets/theme-icon.svg
```

Flat does not mean chaotic. Adopt a naming grammar that states purpose and scope: `component-cart-drawer.js`, `section-hero-banner.css`, `feature-predictive-search.js`. Avoid generic names such as `main.js`, duplicate basenames, and build outputs whose hash changes without a source-level reason. The name is part of the Liquid contract and a debugging tool in a CDN waterfall.

Do not copy a build output directory wholesale into a theme. It can produce unused chunk files, paths Liquid never emits, duplicate runtime code, and accidental references to a nested location Shopify does not expose as you expect. Ship only the assets a theme actually references. Keep source maps and local development artifacts out of the production theme unless a deliberate debugging policy requires them.

## 42.4 Cache behaviour and busting

CDN caching is the reason asset URLs should be resolved rather than hand-built. Browsers and intermediary caches can reuse a response safely when the platform gives changed content a changed resolved version. Your job is to reference the filename through `asset_url`, deploy the changed asset, and test the output in the target theme. Your job is not to append a manual timestamp or random query string to every URL.

```liquid
<!-- snippets/theme-assets.liquid -->
{{ 'component-cart-drawer.css' | asset_url | stylesheet_tag }}
<script src="{{ 'component-cart-drawer.js' | asset_url }}" defer="defer"></script>
```

Manual cache busting such as `?v={{ 'now' | date: '%s' }}` defeats repeat reuse, makes performance debugging noisy, and creates a new URL regardless of whether content changed. It also hides the deployment question: if a buyer still receives old behavior, first confirm the correct theme is published or previewed, the changed filename is deployed, the Liquid expression resolves in that context, and no application-level cache is serving a separate response.

A filename change is occasionally appropriate when two versions must coexist during a controlled migration, but it is not ordinary cache invalidation. If `cart-drawer.js` is replaced in place, retain its stable source name and let the platform-generated resolved URL change. If `cart-drawer-v2.js` exists, document why both files are loaded, when the old reference will be removed, and how duplicate execution is prevented.

| Symptom | First check | Avoid |
| --- | --- | --- |
| Preview shows old JavaScript | Correct preview theme, deployed asset, and emitted `asset_url`. | Adding random query parameters. |
| Published store differs from local | Published theme and actual rendered page source. | Assuming a local filename proves deployment. |
| Two modules both execute | Liquid asset includes and component registration guard. | Keeping old and new assets indefinitely. |
| Merchant wants replaceable content | Whether the content is a theme implementation asset. | Hardcoding the upload as a theme asset. |

Cache behavior is an operational contract. Test once from a cold browser context, once after a deployment, and once on a real buyer route. Record the resolved URL only as diagnostic evidence; do not make its version query part of your application logic.

## Gotchas

- `asset_url` and `file_url` both return CDN URLs, but they encode different content ownership.
- A CDN URL shape is an output, not a path template to copy into source.
- A theme asset name is a flat delivery contract; do not let a build tool impose nested output paths without a translation plan.
- Random cache-busting parameters reduce cache reuse and hide deployment errors.
- Do not use a Shopify/global asset filter merely because its name resembles `asset_url`.

## Checklist

- [ ] Every file is classified by owner before a URL filter is chosen.
- [ ] Theme implementation assets are referenced by filename through `asset_url`.
- [ ] Merchant-uploaded Files use `file_url` rather than a theme deployment path.
- [ ] Build output is deliberately flattened and named for its Liquid references.
- [ ] Cache investigations start with deployment and rendered URL evidence, not random query strings.

## Related

- [Chapter 43 — Images](../ch-43-images/) for media-specific URL and rendering behavior.
- [Chapter 44 — Responsive Images](../ch-44-responsive-images/) for image delivery choices after the asset contract is clear.
- [Chapter 10 — Assets](../../part-02-liquid-fundamentals/ch-10-assets/) for the earlier Liquid asset foundation.

## References

[1]: https://shopify.dev/docs/api/liquid/filters/asset_url "Shopify — asset_url"
[2]: https://shopify.dev/docs/api/liquid/filters/file_url "Shopify — file_url"


## Operational review: deployment, naming, and evidence

Treat an asset change as a release artifact. Before merging a new module, list the source file, final asset filename, Liquid include, route where it loads, condition that suppresses it, and owner responsible for removing it. This small inventory exposes accidental duplication quickly: two sections may both load the same module, an obsolete file may remain in the asset namespace, or a renamed stylesheet may still be emitted by a snippet. The browser network panel then becomes an evidence tool rather than a guessing tool.

A stable final name does not forbid source organization. A project can keep TypeScript, component source, test fixtures, and CSS modules outside the uploaded theme directory. The last build step creates the intentional flat file that Liquid names. If a bundler forces content-hashed filenames, it must also provide a reliable and reviewable way to update every Liquid reference. In many themes, a stable semantic filename plus Shopify’s resolved version is less operationally risky than a custom manifest integration.

Cache debugging should distinguish three conditions. First, confirm the rendered HTML names the expected file through `asset_url`. Second, confirm the requested resolved URL belongs to the theme being previewed or published. Third, compare the asset response and the browser’s execution result after a cold load. Only then investigate service workers, applications, or a client-side state bug. Clearing a browser cache or adding a timestamp can be a temporary diagnostic, but neither repairs a wrong Liquid reference or an unpublished asset.

The same discipline protects rollbacks. If a release needs rollback, restore the Liquid reference and the asset together, then verify the buyer route from a clean browser session. Avoid leaving a “temporary” alternate file permanently included: it increases bytes, can register duplicate custom elements, and obscures which implementation is authoritative. Asset delivery is part of theme architecture, not merely a final upload step.
