<!-- STATUS: final -->
# Chapter 56 — Theme App Extensions

A merchant should not need to edit a theme’s Liquid files to install a review widget, loyalty element, analytics integration, consent control, or product-specific app feature. Theme app extensions provide a platform contract for that boundary: an app publishes blocks, embeds, assets, snippets, and editor settings; the theme provides safe places where merchant-selected app content can render. The theme does not own the app’s markup or business logic, and the app does not get permission to rewrite the theme. Good integration is a coexistence design.

## 56.1 App blocks vs app embed blocks

Theme app extensions include **app blocks** and **app embed blocks**, plus their app-owned assets and snippets.[1] The first question is placement and context—not implementation preference.

An app block is inline page content. Its schema `target` is `section`; a merchant can add it inside a compatible JSON-template section or as a top-level wrapped app section.[3] Use it for content whose page position matters: product ratings, reviews, recommendations, subscriptions, pickup information, forms, or product-related data. App blocks can use resource settings with `autofill`, allowing Shopify to point an app block at an appropriate dynamic source when it is added in a compatible parent context.[3]

An app embed block is a global/injected extension. Its schema target is `head`, `body`, or, only where necessary, `compliance_head`; Shopify injects it before the corresponding closing tag.[3] Use it for floating/overlay UI, analytics, tracking, or other behavior not anchored in a merchant-selected content slot. App embeds work in vintage and Online Store 2.0 themes because they do not depend on JSON-template sections; however, they have Global Liquid scope only and cannot point to dynamic sources.[3]

| Decision | App block | App embed block |
| --- | --- | --- |
| Main placement | Merchant-selected inline/content position | Theme document head/body injection |
| Typical use | Review, product, rating, reusable visual content | Chat bubble, pixel, overlay, global integration |
| Editor action | Add/remove/reorder/configure in a compatible section or Apps wrapper | Activate/configure under Theme settings → App embeds |
| Theme dependency | JSON template and accepted `@app` location | Works in vintage and OS 2.0 themes |
| Context | Can use configured/resource-aware app-block design | Global Liquid scope; no dynamic sources |
| Default after install | Merchant chooses placement | Merchant activation is required by default |

Do not choose an embed merely to bypass a theme’s layout contract. A floating chat control belongs at an injected boundary; a rating component beside product price belongs in an app block slot. Likewise, avoid using an app block to inject unavoidable global tracking. Correct placement makes merchant control, performance review, accessibility, teardown, and support clearer.

`compliance_head` is not a general “load earlier” optimization. It is ordered before other head content and Shopify documents it for necessary cases such as cookie-consent banners.[3] Treat it as a compliance-owned exception with legal/privacy review. A more aggressive loading location is not evidence that tracking is authorised.

> [VERIFY] Confirm the app’s current extension type, app-block/embed schema, activation state, consent requirements, supported themes, asset behavior, and merchant intent in the authorised store/app documentation before designing placement.

## 56.2 How merchants add app content without touching your code

Theme app extensions expose integration surfaces in the theme editor rather than asking merchants to paste scripts or modify templates. Shopify states that theme app extensions let merchants add dynamic app elements without interacting with Liquid/code; the extensions are editor-visible, versioned, and can use Shopify CDN-hosted assets.[1] This protects both sides: merchants retain placement/configuration control and app developers can update their extension without theme-file surgery.

For an app block, a merchant uses the editor’s Apps experience to add the block in a compatible theme section or as a new app section. By default an app installation does not insert app blocks into the theme automatically; the merchant selects the placement.[3] An app can offer a deep link after installation to guide a merchant to an editor preview, but the merchant still reviews and saves the addition. A deep link is onboarding assistance, not permission to make a buyer-facing content decision silently.

Top-level app blocks need a wrapper because an app block is not itself a theme section. Shopify’s wrapper selection is significant:

1. If the theme supplies `sections/apps.liquid`, Shopify uses it for top-level app blocks.
2. Otherwise, Shopify looks for `sections/_blocks.liquid`, which can admit both theme and app blocks.
3. Otherwise, Shopify uses a platform-generated `apps.liquid` wrapper.[2]

A theme-supplied `apps.liquid` must admit `@app` blocks and include a preset; otherwise the editor reports an invalid/unsupported Apps section and merchants cannot use it.[2] It is special: it cannot be rendered manually with `{% section 'apps' %}`, it is not an ordinary section a merchant adds directly, and its schema cannot use `templates` constraints.[2] The wrapper should provide theme-consistent horizontal rhythm, width, and optional spacing—not impose assumptions about the app’s internal markup.

For app embeds, the merchant activates the integration in **Theme settings → App embeds** after installation by default.[3] This activation model distinguishes app installation from storefront injection. Teach merchants and support teams to check installed app, app embed state, target theme, and preview/published distinction separately. “The app is installed” does not prove an embed is active; “the embed is active” does not prove it is appropriate for every market, consent state, or route.

## 56.3 Designing sections that accept `@app` blocks gracefully

If a section belongs to a JSON template, Shopify recommends that it support blocks of type `@app`.[2] This is an intentional theme capability: add the generic schema entry and render app-block output in the section’s block rendering flow.

```json
"blocks": [
  { "type": "@app" }
]
```

The generic type does not take a `limit`; adding one produces an error.[2] A section that also has section-defined blocks must distinguish app block type and render it appropriately. Shopify’s documented pattern is `{% render block %}` for an `@app` block while rendering the theme’s own block types through their intended branch.[2] Theme-block architecture can instead use `{% content_for 'blocks' %}` to handle rendering, including app blocks, where that is the section’s established contract.[2]

```liquid
{% for block in section.blocks %}
  {% case block.type %}
    {% when '@app' %}
      {% render block %}
    {% when 'feature' %}
      {% render 'feature-item', block: block %}
  {% endcase %}
{% endfor %}
```

The theme’s job is to provide a stable structural slot: a meaningful landmark/list where appropriate, safe gap/width behavior, predictable editor placement, and no assumption that the app output contains a particular tag/class/height. Do not wrap an app block in an element that violates the parent’s DOM model. For example, if a section’s child elements must be direct `<li>` values, an arbitrary app block may not be structurally suitable there; provide a different app-capable slot rather than creating invalid list markup.

Sections accepting app blocks have a specific settings constraint: they can contain only one resource setting of each type at section level, to avoid ambiguity with app-block autofill.[2] This is an architectural signal. Do not add two product pickers casually to a section that should host resource-aware app blocks; split responsibilities, use another composition strategy, or verify a supported alternative. Treat the section schema as an app-facing API.

Static sections cannot support `@app` blocks.[2] Do not promise app-block placement in a hard-coded `{% section %}` region simply because an editor screenshot looks similar. Identify whether the target is a JSON-template instance, section group, or static layout before choosing an integration design.

## 56.4 Styling and containing third-party markup

Third-party markup is not a license to abandon visual quality, nor is it safe to restyle as though it belongs to the theme. The theme can own the **outer layout boundary**: container width, grid position, spacing, neutral background, safe responsive behavior, and an opt-in wrapper setting. The app owns its inner DOM, content semantics, scripts, data fetching, error states, and updates unless it explicitly documents a stable styling integration.

| Theme may own | App should own | Require evidence before changing |
| --- | --- | --- |
| Section width, gap, layout placement, outer padding/margins | Internal classes, controls, semantics, app data, script lifecycle | App styling API, version contract, merchant approval |
| Neutral responsive containment | Accessibility behavior inside app component | Keyboard/focus/assistive tech test in candidate |
| Wrapper landmark only when it adds real structure | Network loading, consent logic, analytics purpose | Privacy/legal/performance owner decision |
| Theme-level color context only through documented tokens/variables | Error/empty/loading content | App documentation and route/edge-state evidence |

Avoid CSS selectors that crawl into an app’s undocumented internal classes, use `!important` to win a contest, or assume a precise output root. An app update can change its markup and break the theme invisibly. Instead, use a neutral wrapper, documented CSS variables/custom properties if the app provides them, and a visible integration test on the routes where the merchant placed the block. If the app has an iframe or shadow boundary, ordinary theme CSS cannot control its contents; do not promise otherwise.

Containment must not hide a broken app. Fixed heights, `overflow: hidden`, broad `display: none`, or clipping may make one screenshot look clean while removing consent text, validation messages, purchase options, or focus. Test long content, error state, mobile width, zoom, keyboard focus, no-JavaScript baseline where relevant, and the app’s absent/loading state. The safe fallback may be a stable empty slot or no slot at all, depending on merchant/app contract; it is not a fake theme substitute for app-owned commerce behavior.

Review performance and privacy at the integration boundary. An app embed can add global scripts; an inline app block can load its assets only where it appears. The extension configuration supports assets through schema or asset filters, and repeated references to the same configured app asset can be included once on a page.[3] This is helpful but not a blanket performance approval. Record routes, size/loading behavior, consent dependency, owner, and rollback/removal path. A merchant should be able to disable/remove an app block or embed cleanly without leaving theme code debris.

A durable app-ready theme is generous with valid placement and strict about boundaries. It admits merchant-selected app content where the document model allows it; explains when an embed is the appropriate global surface; preserves configuration/editor authority; styles the container rather than guessing app internals; and validates the configured candidate rather than an abstract integration story.

## References

[1]: https://shopify.dev/docs/apps/build/online-store/theme-app-extensions "Shopify — About theme app extensions"
[2]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks "Shopify — App blocks for themes"
[3]: https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration "Shopify — Configure theme app extensions"


## Designing the Apps wrapper as a theme boundary

A custom `apps.liquid` wrapper is worthwhile when the platform default cannot express the theme’s ordinary content width, vertical rhythm, or editor experience. It should remain intentionally boring: iterate/render app blocks, provide a neutral outer container, and expose only theme-owned spacing/alignment decisions. Its purpose is not to become an app marketplace, a conditional router, or a replacement layout system for every extension.

```liquid
<div class="apps-wrapper{% if section.settings.include_padding %} apps-wrapper--padded{% endif %}">
  {% for block in section.blocks %}
    {% render block %}
  {% endfor %}
</div>

{% schema %}
{
  "name": "App wrapper",
  "settings": [
    {
      "type": "checkbox",
      "id": "include_padding",
      "label": "Use theme content spacing",
      "default": true
    }
  ],
  "blocks": [{ "type": "@app" }],
  "presets": [{ "name": "App wrapper" }]
}
{% endschema %}
```

This follows Shopify’s wrapper requirements: a theme-provided `apps.liquid` needs an `@app` block type and a preset.[2] Do not add a `templates` restriction to this special wrapper.[2] The setting controls only theme-owned space; it must not promise to alter the app component itself. A wrapper’s CSS should tolerate an app output root with unknown dimensions, dynamic text, its own styling, or no output.

Integration testing should be a route-and-state matrix, not “the app appeared once.”

| Test | Evidence to capture | Boundary/owner |
| --- | --- | --- |
| Editor placement | Compatible JSON section, top-level Apps wrapper, or app-embed panel state [VERIFY] | Merchant/theme owner |
| Reorder/remove | Merchant moves/removes block; no orphan theme layout or script state | Theme/app owner |
| Width and responsive state | Narrow/wide viewport, zoom, long app text, mobile toolbar | Theme container/app markup owner |
| Product/resource context | App block inside expected product/collection section with selected resource [VERIFY] | App/configuration owner |
| Error/loading/absence | App’s documented unavailable state remains visible and understandable | App owner; theme does not fake its state |
| Accessibility | Keyboard focus, labels, errors, heading/landmark relationships | Shared evidence, inner behavior app-owned |
| Embed privacy/performance | Target pages, asset load, consent state, removal/disable path [VERIFY] | App/privacy/performance owner |

App blocks are also versioned app artifacts. An app release can alter its Liquid, assets, settings, or merchant-facing behavior without a repository change in the theme. That makes candidate checks after app updates essential for high-impact storefront locations. Record app/extension version, enabled block/embed state, target theme, route, configured settings, selected resource, locale/market, viewport, and owner decision. A theme commit cannot be the sole provenance record for an integration result.

When an app block moves from one section to another, reevaluate the surrounding DOM and resource context. A review app may work below product details but not inside a list of products; a subscription block may require a product form/variant relationship; a content block can need full-width Apps wrapper placement. Never solve a context mismatch by adding invisible theme glue or hard-coding app-specific checks into shared sections. Prefer the app’s documented supported location, a safe compatible slot, or a merchant-facing limitation.

Finally, make removal a first-class operation. Verify that disabling an embed or removing an app block leaves no broken headings, empty decorative box, stale loading UI, orphaned CSS selector, or buyer promise. The merchant controls the app relationship, so the theme must degrade from **app present** to **app absent** without requiring a developer cleanup. This is the practical measure of a durable integration boundary.


A concise integration register helps operational ownership survive: app/extension version, block or embed type, intended route/slot, merchant activation state, outer theme container, app-owned styling contract, consent/performance owner, verification matrix, and removal/rollback path. Keep it beside the release evidence rather than hard-coding it into the theme. This record makes it possible to distinguish an app update, a merchant placement change, a theme regression, and an ordinary configuration difference during support or incident review.
