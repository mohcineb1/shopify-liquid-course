<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 56 — Solution

## The approach

Reviews are inline, product-adjacent content that a merchant wants to position and remove, so the theme supports them as an **app block** in a JSON-template product section. Chat is a floating/global behavior, so it belongs to an **app embed block** activated by the merchant in Theme settings. The theme does not insert either app’s script manually. It supplies valid app-block slots and a neutral Apps wrapper; the app extension supplies the app output, assets, data, and lifecycle.

## Walkthrough

**1 — placement.** The reviews app block is added/reordered/removed by the merchant in the product section or an Apps wrapper. Chat is an app embed, normally activated in Theme settings → App embeds after installation. Neither installation nor a deep link proves merchant approval, activation, consent, or route suitability.

**2 — host section.** `@app` has no `limit`. The product section keeps one resource setting of a given type to avoid autofill ambiguity, iterates blocks, and renders `@app` with `{% render block %}`. It must be rendered from a JSON template; static sections do not support app blocks.

**3 — wrapper.** `apps.liquid` admits `@app`, includes a preset, and offers only theme spacing. It has no `templates` constraint and is not manually rendered.

**4 — containment.** CSS targets `.app-slot` and `.apps-wrapper`, not undocumented app classes. The theme does not clip, set a fixed height, or style an app’s controls. App internal semantics, loading/error output, scripts, app data, and consent remain app-owned.

**5 — merchant flow.** App installation, app-block placement, preview/save, app-embed activation, disable/removal, and publish/candidate state are distinct actions.

**6 — candidate proof.** The record preserves app/extension version, theme/candidate, route, resource/market/language, editor state, responsive/accessibility/edge checks, privacy/performance evidence, owner, and rollback/removal path as `[VERIFY]`.

**7 — no invented integration.** The solution contains no review markup, external script URL, app API response, or claim about app styling support.

**8 — configuration unknowns.** Actual theme, app, merchant, privacy, performance, resource, release, and rollback facts require authorised observation.

## Full files

### `sections/product-details.liquid`

```liquid
{{ 'app-slot.css' | asset_url | stylesheet_tag }}

<section class="product-details">
  <h1>{{ product.title }}</h1>

  {% for block in section.blocks %}
    {% case block.type %}
      {% when 'detail' %}
        <p {{ block.shopify_attributes }}>{{ block.settings.text }}</p>
      {% when '@app' %}
        <div class="app-slot" {{ block.shopify_attributes }}>
          {% render block %}
        </div>
    {% endcase %}
  {% endfor %}
</section>

{% schema %}
{
  "name": "Product details",
  "settings": [
    { "type": "product", "id": "product_source", "label": "Product source" }
  ],
  "blocks": [
    {
      "type": "detail",
      "name": "Detail",
      "settings": [{ "type": "text", "id": "text", "label": "Text" }]
    },
    { "type": "@app" }
  ],
  "presets": [{ "name": "Product details" }]
}
{% endschema %}
```

The `app-slot` is an outer layout boundary, not a promise about review markup. It is appropriate only in a JSON-template product section whose document model permits a generic block. If the real product section uses a list/table/form structure, choose a valid sibling slot instead of wrapping arbitrary app output into invalid children.

### `sections/apps.liquid`

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
      "default": true,
      "label": "Use theme content spacing"
    }
  ],
  "blocks": [{ "type": "@app" }],
  "presets": [{ "name": "App wrapper" }]
}
{% endschema %}
```

Shopify selects this special wrapper for top-level app blocks when it exists. Do not render it manually and do not add `templates`; the platform needs it available across templates.

### `assets/app-slot.css`

```css
.app-slot { min-width: 0; }

.apps-wrapper {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.apps-wrapper--padded { padding-block: 1.5rem; }
```

No height, clipping, app internal selector, `!important`, or assumed button/DOM style appears here. If an app documents a stable custom property or integration class, verify its version/contract before using it.

### `layout/theme.liquid`

```liquid
<!doctype html>
<html>
  <head>
    {{ content_for_header }}
  </head>
  <body>
    {{ content_for_layout }}
  </body>
</html>
```

Removing the manually pasted reviews script restores the extension boundary. The reviews extension is responsible for its own block assets. Chat’s app embed is responsible for its configured injected assets after merchant activation; it is not a theme-layout script.

### `placement-decision.md`

```md
# Placement decision

| Integration | Choice / merchant action | Context and owner | Removal / unknowns |
| --- | --- | --- | --- |
| Reviews | App block; merchant adds/reorders/removes in compatible product section or Apps wrapper | Product-adjacent resource context; merchant/app/theme owner [VERIFY] | Remove block and verify layout; app/version/resource/market/styling API [VERIFY] |
| Chat | App embed; merchant activates under Theme settings → App embeds | Global/floating behavior; app/privacy/performance owner [VERIFY] | Disable embed and verify asset/UI removal; consent/routes/version [VERIFY] |

Installation is not activation or placement. A post-install deep link can guide a merchant to preview, but does not replace review/save approval.
```

### `containment.md`

```md
# Third-party containment

Theme owns outer placement, content width, neutral spacing, responsive min-width, and an optional wrapper setting. App owns inner DOM, controls, scripts, data, loading/error/empty state, accessibility semantics, consent, and version updates. Avoid fixed height, overflow clipping, undocumented internal selectors, and `!important`: each can conceal content, focus, errors, or updates. Use a documented app styling API only after version/route evidence [VERIFY].
```

### `merchant-flow.md`

```md
# Merchant flow

1. Confirm app installation and target candidate theme [VERIFY].
2. For reviews, open editor, add app block in a compatible slot or Apps section, preview placement, configure app settings, and save only with merchant decision [VERIFY].
3. For chat, open Theme settings → App embeds, activate/configure the app embed, preview, and save only with consent/merchant decision [VERIFY].
4. Test remove/disable on the same candidate; confirm no empty theme artifact or stale script/UI remains.
5. Promote/rollback only under release owner approval [VERIFY].
```

### `integration-test.md`

```md
# Candidate integration evidence

Record [VERIFY]: app/extension version; block/embed state; candidate/store/theme/branch; product/resource; market/language/customer context; desktop/mobile/zoom; long/loading/error/absent app state; keyboard focus; asset/load/performance report; consent/privacy evidence; merchant/app/theme/release owners; removal test; prior candidate and rollback path.

A theme commit alone cannot prove this state because the app extension version, merchant editor placement, activation, and store configuration can change independently.
```

## What people get wrong here

**Adding a global script for an inline app.** This removes merchant placement/control and creates a theme-owned update/performance boundary for an app-owned integration.

**Limiting `@app`.** App blocks are merchant-selectable and `@app` does not accept `limit`; choose a safer UI slot if multiplicity is a problem.

**Treating app output as theme markup.** A selector may work until the app updates. Style the outer container and use a documented API only when verified.

**Confusing installed with active.** An app block must be placed; an app embed is normally activated; both require target-theme and merchant-context evidence.

**Clipping the widget.** A fixed-height screenshot can hide errors, consent, controls, or focus. Contain layout without hiding content.


## State and removal checks

The integration should be tested as a sequence of merchant-controlled states rather than as a permanent code feature. Start with the app installed but no app block/embed active; add the review block to the product candidate; move it; preview/save; test its long, loading, error, and absent states; remove it; then disable the chat embed and verify that its UI/assets no longer affect the route. Preserve the app extension version and candidate/theme identity on each observation. This reveals whether a theme wrapper leaves empty spacing, whether a global embed survives a supposed disablement, and whether app output changes after an extension update.

| Change | Expected theme behavior | Evidence owner |
| --- | --- | --- |
| App block is removed | Slot disappears without orphan wrapper, semantics, or CSS dependency | Theme/merchant owner [VERIFY] |
| App embed is disabled | No global app UI/script effect remains on tested routes | App/privacy/performance owner [VERIFY] |
| App output grows or errors | Container expands naturally; error/focus/message is not clipped | App owner with theme route evidence [VERIFY] |
| Extension updates | Theme boundary remains valid; app-version change is retested in candidate | App/release owner [VERIFY] |
| Rollback occurs | Prior app/theme candidate restores the same route matrix | Release owner [VERIFY] |

This is why an outer boundary is more durable than internal styling. The theme can safely retain its layout contract across a merchant’s placement or app version change; it does not need to predict how the app will render tomorrow.
