<!-- STATUS: final -->
---
id: ch-45
title: "JavaScript Strategy"
part: 7
---

# Chapter 45 — JavaScript Strategy

JavaScript in a Shopify theme is an enhancement layer, not permission to replace native navigation, forms, product selection, or cart submission with a fragile runtime. A buyer must still be able to discover and purchase a product when a module fails, a third-party request is slow, or the theme editor replaces a section. Good strategy therefore begins with ownership: what behavior requires JavaScript, when does it load, which section owns its data and lifecycle, and what is the smallest delivery unit that does not make the rest of the page pay for it.

## 45.1 Loading: `defer`, `async`, `type="module"`, import maps

A parser-blocking external script stops DOM construction while the browser fetches, parses, and executes it. Shopify’s Theme Check identifies such tags and states the practical rule: use `defer` when execution order matters, and `async` when it does not.[1] A theme should not simply remove the warning; it should identify the actual dependency and replace it with a loading model that preserves a functional HTML baseline.

```liquid
<!-- layout/theme.liquid -->
<script src="{{ 'theme.js' | asset_url }}" defer></script>
```

Deferred classic scripts download while HTML parses, execute after parsing, and preserve document order relative to other deferred scripts. Use them where a later script depends on an earlier global or a shared bootstrap must be ready before feature registration. An asynchronous script downloads independently and executes as soon as it is ready, so two `async` scripts must not depend on execution order.

```liquid
<!-- A truly independent measurement script, after consent is established. -->
<script src="https://example.invalid/measurement.js" async></script>
```

`type="module"` changes the unit of execution: module files have lexical scope, support `import` and `export`, and are deferred by default. Use a module for a feature with explicit dependencies instead of attaching constructors to `window`.

```liquid
<script type="module" src="{{ 'product-form.js' | asset_url }}"></script>
```

Import maps associate stable bare specifiers with URLs, letting modules import named dependencies without hard-coding every emitted URL. Shopify Engineering reports that current Shopify themes and app blocks can use modules and multiple import maps without the former inclusion-order collision behavior; Shopify supplies support for browsers lacking native import-map implementation when a map is present.[2] This enables cache-friendly module boundaries, but it does not make an import map a dependency manager or a reason to load modules that no rendered component needs.

> [VERIFY] Confirm browser support policy, current map behavior, and app coexistence in the target theme before adopting bare specifiers as its main module contract.

## 45.2 One bundle vs per-component modules

One small bootstrap file can initialize behavior found on most routes. One large “theme.js” that contains every carousel, map, account widget, and product feature makes a collection page parse code it never uses. Per-component modules solve that waste when a component is optional, expensive, or has a clear section root; they become harmful when every tiny utility creates a separate network and coordination surface. The correct boundary follows route usage and runtime ownership.

```liquid
<!-- sections/product-recommendations.liquid -->
<script type="module" src="{{ 'product-recommendations.js' | asset_url }}"></script>
<section class="product-recommendations" data-recommendations-root>
  <!-- HTML fallback remains useful without the module. -->
</section>
```

A module must be idempotent or attach only to a known root, because editor replacement can insert a new section instance. The base script should not query the entire document and initialize every `.product-recommendations` instance repeatedly. Shopify performance guidance recommends progressively enhancing HTML/CSS and notes a minified JavaScript bundle target of 16 KB or less; use that as a pressure signal to remove unnecessary work rather than a license to ignore route-specific weight.[3]

## 45.3 Passing data from Liquid to JS: `| json`, data attributes, script type=application/json

Liquid renders server state; JavaScript consumes a serialized contract. Use a `data-*` attribute for a small scalar configuration, `| json` for valid JSON encoding, and an inert `application/json` script element for an object that is too large or structured for attributes. Never concatenate merchant text into JavaScript string syntax.

```liquid
<div data-product-root data-variant-id="{{ product.selected_or_first_available_variant.id }}"></div>
```

```liquid
<script type="application/json" data-product-config>
  {{ product | json }}
</script>
```

```js
const config = JSON.parse(document.querySelector('[data-product-config]').textContent);
```

The JSON node is data, not executable code. Scope it to the component root or an unambiguous nearby selector. Serialize only fields the feature needs; sending an entire product object to a button that needs an ID increases parse work and hides the interface contract. Treat all merchant-facing strings as data, even when they originated in a theme setting.

## 45.4 Third-party scripts, app scripts, and the tag-bloat problem

Every third-party tag has a cost beyond its transfer size: connection setup, parse/compile time, main-thread work, privacy and consent obligations, duplicate functionality, and an independent failure mode. App scripts need particular discipline because an app block may arrive on a page where the theme already has similar behavior. Do not load a vendor’s global script because its app is installed; load the smallest supported integration only where the merchant has rendered the app’s block and only after required consent.

Make a script inventory with owner, route trigger, purpose, loading mode, consent condition, bytes, and removal path. Two analytics tags that both claim to measure the same event are not redundancy; they are tag bloat. A third-party widget must not replace the native product form or make checkout-adjacent UI nonfunctional. Keep the user-facing fallback in HTML and ensure the page remains navigable if the remote host fails.

```text
owner: reviews app
route trigger: product template with app block
purpose: buyer review summary
loading: app-controlled deferred/module behavior [VERIFY]
consent: merchant privacy policy and configured consent state
removal: remove app block and confirm no remote request remains
```

> [VERIFY] Verify the app’s current documented loading, consent, and cleanup contract. Theme code must not guess an app’s internal script API.

## 45.5 Build pipelines: Vite/esbuild into `assets/`, source maps, and the CLI watch loop

Vite and esbuild can improve authoring through module resolution, linting, minification, and development rebuilds. They do not alter the runtime rule: Liquid references final theme files under `assets/` using `asset_url`. Source folders are for developers; emitted files are a release interface.

```text
src/js/theme.js                    -> assets/theme.js
src/js/product-form.js             -> assets/product-form.js
src/js/product-form.js.map         -> assets/product-form.js.map [development policy]
```

Use stable semantic output names unless the theme also has a deliberate mapping mechanism for hashed filenames. A generated manifest that Liquid never reads is not a solution. Source maps help diagnose deployed minified code, but publishing them can expose source and increase upload size; choose a documented development/production policy rather than leaving map files accidental.

The watch loop has two independent jobs. The bundler observes source changes and emits final assets. Shopify CLI observes the theme directory and syncs valid theme output to the development store. Run both deliberately, confirm the final asset changed, and inspect the development-store network response. Do not assume a local hot-reload server has updated the theme just because a source file rebuilt.

> [VERIFY] Confirm the current Shopify CLI theme-development command and the project’s Vite/esbuild watch integration before prescribing an exact concurrent command.

## Gotchas

- `async` is not a faster `defer`; it abandons execution ordering.
- A module still needs a component root and editor-safe initialization boundary.
- `| json` serializes data safely; it does not justify exposing unnecessary objects.
- An installed app is not proof that its script belongs on every route.
- A build output must be an asset Liquid can name, not a local bundler artifact.

## Checklist

- [ ] Basic buyer flows work before JavaScript loads.
- [ ] Every external script has a loading mode, owner, trigger, consent condition, and removal path.
- [ ] Module or bundle boundaries match rendered component ownership.
- [ ] Liquid-to-JS data uses a narrow, JSON-safe contract.
- [ ] Bundler output, maps, and CLI syncing have a documented release policy.

## Related

- [Chapter 40 — Web Components in a Liquid Theme](../../part-06-interactivity-without-a-framework/ch-40-web-components-in-a-liquid-theme/) for lifecycle-safe component boundaries.
- [Chapter 42 — Assets & the CDN](../ch-42-assets-the-cdn/) for final asset ownership.
- [Chapter 44 — CSS Strategy](../ch-44-css-strategy/) for equivalent styling delivery decisions.

## References

[1]: https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/parser-blocking-javascript "Shopify — ParserBlockingScript"
[2]: https://shopify.engineering/resilient-import-maps "Shopify Engineering — Resilient Import Maps"
[3]: https://shopify.dev/docs/storefronts/themes/best-practices/performance "Shopify — Theme performance"


## A practical loading decision

Before adding a tag, classify the behavior by four conditions. First, can HTML plus Liquid perform the buyer task? If yes, preserve that route as the baseline and add JavaScript only for speed or convenience. Second, is the behavior present on nearly every route? A small deferred bootstrap may be justified; an optional product comparison panel is not. Third, does it need another module before it runs? Use a deferred ordered script or an explicit module import rather than asynchronous coincidence. Fourth, can it wait for user intent? Search suggestions, a size guide, or a map frequently can load after focus, click, or intersection rather than competing with initial content.

```js
// assets/size-guide-trigger.js
const trigger = document.querySelector('[data-size-guide-trigger]');
trigger?.addEventListener('click', async () => {
  const { openSizeGuide } = await import('./size-guide-dialog.js');
  openSizeGuide();
}, { once: true });
```

This pattern is only correct when the trigger itself and the non-JavaScript alternative exist in the delivered HTML. The feature module needs a failure behavior: if the import rejects, allow a normal link to the size-guide page or announce that the dialog is unavailable. Do not turn an interaction import into an unexplained empty button.

Data shape is equally important. A `data-variant-id` attribute is ideal for one identifier. A configuration object can use an adjacent JSON island. If a component has multiple instances, locate data from the root passed to its initializer instead of calling `document.querySelector` for the first matching configuration. That ownership rule prevents an editor-replaced section from reading configuration belonging to an older instance.

```js
function connectProductForm(root) {
  const node = root.querySelector('[data-product-config]');
  if (!node) return;
  const config = JSON.parse(node.textContent);
  // Bind only controls inside root.
  return () => { /* detach listeners created for this root */ };
}
```

A module does not eliminate cleanup requirements. Maintain a connection boundary, avoid document-wide mutable state, and make a second initialization harmless. This is especially important for sections that are added or replaced in the editor. The server-rendered form remains the authority; JavaScript can change presentation, submit enhanced requests, or render returned state only after it has a confirmed response.

### Third-party review questions

Ask whether a remote script is necessary for the current page, whether the same user value exists through native HTML, whether an app block already owns it, and whether it can be delayed until consent or interaction. Measure the complete request chain, not only the initial tag. A 2 KB loader may fetch multiple SDKs, fonts, images, and trackers after execution. Record failure in the same acceptance test as normal success: block the remote host and confirm product form, navigation, and content remain usable.

Avoid adding generic libraries because an older snippet expected them. Shopify advises native browser features and modern DOM APIs over large framework and utility dependencies.[3] If legacy code really needs a global library, isolate it behind one deferred owner while it is being refactored; do not scatter separate CDNs and inline scripts through sections. The goal is a deletion path, not a permanent exception.

### Build and release review

The final asset directory should be auditable. For every `asset_url` JavaScript include, identify its source entry point, build command, final filename, route owner, and test. For every generated output, identify whether Liquid or another module references it. Delete orphaned chunks rather than uploading a development archive. A build that generates a manifest, source maps, code-split chunks, and CSS must document which of these are production assets, which are excluded, and how Liquid references stable names.

Test the watch loop by changing a source module, observing the generated `assets/` file timestamp or content, allowing the theme tool to sync it, then reloading the development-store preview with cache bypassed. If the browser runs an old module, diagnose the output/sync boundary before changing JavaScript behavior. This separates tooling failures from code failures and keeps the storefront’s final asset contract visible.

## Review checklist

- Does each script have a loading reason rather than a copied attribute?
- Does every interactive enhancement preserve a server/HTML fallback?
- Does each configuration value have a bounded nearby data owner?
- Can a remote vendor fail without blocking a buyer’s core task?
- Can a future developer trace a final asset back to source and release policy?
Document each initialization boundary so replacement, failure, and removal remain testable throughout the theme’s life.
Review these boundaries after every major feature change and deployment.
