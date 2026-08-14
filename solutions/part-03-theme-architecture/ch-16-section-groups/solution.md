<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-16-solution
title: "Solution — Mount a merchant-managed persistent shell"
chapter: ch-16
---

# Solution — Mount a merchant-managed persistent shell

The completed shell moves persistent composition out of templates and out of hard-coded layout markup. `header-group.json` owns the merchant-editable order of the announcement and site-header sections. `aside-group.json` owns one globally mounted cart-drawer shell. The layout owns the only document positions where those groups appear: header before main and aside after main. The active template still enters the page exactly once through `content_for_layout`.

## 1. Define the group manifests

The header group contains two section instances. Its order makes the announcement visible before the site header. The aside group contains one drawer-shell instance. These are group composition manifests, so the JSON names only approved section types, instance IDs, and allowed setting values.

```json
{
  "sections": {
    "announcement": { "type": "announcement-bar", "settings": {} },
    "header": { "type": "site-header", "settings": {} }
  },
  "order": ["announcement", "header"]
}
```

```json
{
  "sections": {
    "drawer": { "type": "cart-drawer-shell", "settings": {} }
  },
  "order": ["drawer"]
}
```

The instance IDs are local composition identities; the `type` values identify section files. No product or collection data is stored in the group. The header has a global purpose, so its members read schema settings, locale values, and global store values only. A product size guide would not belong here because it requires product-specific context and should appear in product template composition.

## 2. Mount each group once in the layout

The layout fragment gives each persistent region one explicit document mount. The header group sits before the primary template landmark. The aside group sits after it, near the end of the body. The normal template render slot remains singular and independent.

```liquid
<body>
  {% sections 'header-group' %}
  <main id="MainContent" role="main">
    {{ content_for_layout }}
  </main>
  {% sections 'aside-group' %}
</body>
```

`sections` is the platform tag for a group composition. `render` would call a snippet and would not expose the group’s editor-managed instances. Repeating a group call would duplicate the entire persistent region. Replacing `content_for_layout` with group output would remove the active page composition. The three calls have separate owners and should remain visually distinct in the layout.

> [VERIFY] Verify current group-file names, supported group section types, and `{% sections %}` usage before introducing this exact pattern in a production layout.

## 3. Keep group members context-safe

The announcement bar uses a schema text setting and locale fallback. The header uses `shop.name` and `routes.root_url`, which are global storefront values. Neither assumes a current `product`, `collection`, article, search response, or customer page context. This lets the header group render consistently across product, collection, page, search, and other routes that use the layout.

```liquid
<section class="announcement-bar">
  {{ section.settings.text | default: 'sections.announcement.default_text' | t }}
</section>
```

The locale file owns default customer text. The section schema owns the optional merchant override. The group JSON only places the section instance. This separation makes a header announcement editable without template edits and translatable without embedding strings in layout Liquid.

## 4. Mount an aside shell without promising behavior

The drawer section is globally mounted because a cart utility can need a stable DOM home across routes. But this exercise implements only a labeled shell with locale-backed empty copy. It does not claim to implement cart state, open/close controls, focus trapping, keyboard escape handling, data serialization, or checkout behavior. Those are separate browser and accessibility contracts.

A global mount is not a reason to read route-specific data. The drawer’s future cart interaction should use a deliberately designed cart/browsing data boundary, not a product Drop accidentally present on product routes. The aside group solves persistent placement; it does not solve client behavior or commerce policy.

## 5. Validate across route types

Render a product, a collection, and an ordinary page using the layout. In each case, the announcement and header should appear once, the main template content should appear once, and the drawer shell should appear after main. Change the announcement setting in the editor and confirm it affects the shared header region rather than one template. Search the layout for duplicate group calls and hard-coded announcement markup before hand-off.

This test makes the composition ownership observable: group JSON governs ordering; layout governs location; section schema governs settings; locale governs default copy; template composition governs route-specific content. A failure in one layer should be fixed in that layer, not patched by duplicating another layer’s output.

## Validation matrix

| Test | Expected result |
| --- | --- |
| Header group JSON | Announcement then site header, using valid section types. |
| Layout | Header group once before main; aside group once after main. |
| Template slot | One unmodified `content_for_layout` in main. |
| Cross-route render | Group sections work without product or collection context. |
| Drawer shell | Present and labeled, but no client/cart behavior claimed. |
| Copy | Locale defaults resolve; section settings remain optional overrides. |

## Checklist

- [x] Persistent group order lives in group JSON, not duplicated layout or template code.
- [x] The layout gives each group a single persistent document mount.
- [x] Group members use global or explicit data rather than route-specific assumptions.
- [x] The aside shell has placement and copy, not premature interactive behavior.
- [x] Template composition remains in the singular `content_for_layout` slot.

## 6. Keep the layout and editor responsibilities separate

The layout is intentionally short because it should express document position, not editor composition. Its first `sections` call establishes the persistent header region. Its main landmark preserves the template’s page composition. Its final `sections` call establishes the persistent aside region. A developer reviewing this file can identify all shared shell mounts without opening every template or every individual header section.

The group manifests remain equally focused. `header-group.json` decides the merchant-managed ordering of announcement and site identity; it does not own the main landmark or a page-specific offer. `aside-group.json` decides that the drawer shell exists in the global overlay region; it does not decide which product page invoked a dialog or how client state is managed. This separation makes each later change local: reorder header members in group JSON, change section copy/settings in a section, and change document position only in the layout.

## 7. Verify global behavior without assuming global data

Test the group mounts with product, collection, search, cart, article, and ordinary page routes. The header should use only `shop`, `routes`, settings, and locale values that remain meaningful across those contexts. If a section renders blank on one route because it expected a product or collection, move it to the appropriate template or change its contract to explicit configuration. A group is persistent location, not universal access to every route’s primary object.

For the aside region, confirm the shell is present once and has an accessible label. Then stop: lack of JavaScript behavior is correct in this exercise. Later work may supply triggers, dialog semantics, focus management, cart state, and dismissal rules, but those additions must be designed and tested as client behavior rather than assumed from the group mount.

## 8. Operational review

In the editor, reorder the header announcement and header section only if the group schema and intended UX allow it; then confirm the change affects all routes using the layout. Disable an announcement and ensure no hard-coded duplicate remains in templates or layout Liquid. Before removing a group member, search for its role in all shared contexts and provide a replacement if merchants rely on the global region. Persistent composition is an operational contract as well as a file structure.

## Implementation checklist

- [x] Group JSON controls only approved persistent section instances and their order.
- [x] Layout Liquid mounts each group once and preserves one main template slot.
- [x] Header members use global or configured inputs across route types.
- [x] The aside region supplies placement and copy without premature client/cart behavior.
- [x] Group changes are reviewed as cross-route merchant operations.
