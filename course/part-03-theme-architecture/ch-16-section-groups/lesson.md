<!-- STATUS: final -->
---
id: ch-16
title: "Section Groups"
part: 3
words: 2500
---

# Chapter 16 — Section Groups

A section group gives merchants a configurable, ordered collection of sections that belongs to a persistent region of the storefront rather than to one route template. It solves the awkward choice between hard-coding global header/footer markup in `theme.liquid` and copying the same sections into every page template. The layout owns the persistent region; a JSON group owns the merchant-editable composition inside it.

## 16.1 What a section group solves

Before section groups, a theme often had two poor choices for shared storefront regions. It could hard-code header and footer details directly in the layout, making editor configuration difficult and component ownership unclear. Or it could repeat those details in templates, creating drift: an announcement, navigation change, or footer update had to be repeated across every page composition.

A section group creates a named composition boundary for a persistent region. The group is configured with JSON, contains instances of allowed sections, and can be rendered from the layout once. The same merchant-managed group then appears on the routes using that layout. This preserves the layout’s document-frame role while moving configurable region content into the editor-compatible structure that owns it.

A group is not a generic replacement for templates or sections. It does not make every page region global. It is appropriate when a region is persistent across the document frame: a site header, a footer, or a globally mounted overlay region. A product information area, collection grid, article body, or page-specific promotion normally remains template-level composition because it belongs to that route’s page contract.

> [VERIFY] Verify which section-group types and placement rules are currently supported by the target theme architecture before creating a new global composition surface.

## 16.2 `header-group.json`, `footer-group.json`, `aside-group.json`

Section-group configuration lives under `sections/` as a specially named JSON group file. A common theme uses `header-group.json` for the persistent header region and `footer-group.json` for the persistent footer region. An `aside-group.json` can represent a global ancillary or overlay-adjacent region, depending on its intended layout placement and the theme’s documented structure.

Like a JSON template, a group declares section instances and an order. The difference is ownership: the group belongs to the persistent region selected by the layout, while a template belongs to one route-level page composition. The group’s section entries must use types whose schemas permit the intended placement and configuration.

```json
{
  "sections": {
    "announcement": { "type": "announcement-bar", "settings": {} },
    "header": { "type": "header", "settings": {} }
  },
  "order": ["announcement", "header"]
}
```

The JSON is a composition manifest, not a new document frame. It does not contain `<html>`, head slots, or `content_for_layout`. The layout decides where the group renders; the group decides which approved sections render within that region and in which order.

## 16.3 Wiring groups into `theme.liquid` with `{% sections %}`

A layout renders a group with the `sections` tag. This tag is distinct from `render`: it tells Shopify to render the named section-group composition, including its editor-managed section instances. A normal pattern puts the header group near the start of the body and the footer group after the primary template render slot.

```liquid
<body>
  {% sections 'header-group' %}
  <main id="MainContent" role="main">
    {{ content_for_layout }}
  </main>
  {% sections 'footer-group' %}
</body>
```

The layout still includes `content_for_header` once in the head and `content_for_layout` once in the main content region. Groups complement those slots; they do not replace them. Do not call a group inside a page-specific snippet just because the group contains reusable sections. Its layout position is part of the persistent-region contract.

The group name in `{% sections 'header-group' %}` corresponds to the group configuration without the `.json` extension. Keep calls singular. Rendering the same group twice duplicates the persistent content and can create repeated navigation landmarks, duplicate announcement content, or confusing editor behavior.

> [VERIFY] Verify current syntax and group-file naming in Shopify’s documentation before introducing or renaming a `{% sections %}` call in a production layout.

## 16.4 Group-level vs template-level composition

The governing question is **persistence**. Group-level composition is for content that should be present in a shared layout region across the routes using that frame. Template-level composition is for content that belongs to one resource route or merchant-assigned alternate page. The same section type may be technically usable in multiple contexts, but placement should follow content ownership rather than convenience.

| Decision | Group-level | Template-level |
| --- | --- | --- |
| Owner | Layout region shared by a document frame | A specific route/template composition |
| Typical content | Header, footer, global announcement | Product main, collection grid, article content |
| Rendered from | `{% sections %}` in a layout | JSON template or Liquid template |
| Merchant effect | Changes every route using the group | Changes assigned/current page composition |
| Review question | Should this persist across the frame? | Does this belong to this resource page? |

A newsletter signup may be footer-group content if it is a site-wide footer element. The same signup may belong to a template if it is a campaign-specific conversion block with product or editorial context. Do not decide by visual similarity; decide by the routes, context, editor ownership, and lifecycle that the component needs.

Groups also help prevent global data leakage. A header group should not quietly read a product-specific object merely because it happens to render during a product request. Its sections should rely on global or explicitly configured data. If a group component needs route-specific content, revisit whether it belongs in the group at all.

## 16.5 Overlay/aside groups: drawers, popups, announcement layers

An aside or overlay group can provide a persistent mount point for controlled global UI such as a navigation drawer, cart drawer shell, announcement layer, modal infrastructure, or promotional popup. The layout may render the group near the end of `body` so the markup remains a persistent sibling of main content while CSS and JavaScript manage presentation.

```liquid
{% sections 'aside-group' %}
</body>
```

This does not mean every popup should become a global group section. A persistent overlay needs a defined trigger, focus behavior, escape behavior, dismissal policy, content ownership, and data boundary. A product-only size guide, for example, normally belongs in product template composition. A global announcement layer may belong to an aside group because it must be available independent of the route.

Groups make editor placement possible; they do not solve accessibility or client behavior automatically. A drawer must still have accessible labeling and focus management. A popup must avoid turning merchant configuration into an always-on interruption. A global overlay section should not serialize broad route-specific data merely because it is mounted on every page. Later browser and accessibility chapters develop these implementation concerns; here, decide whether the overlay is truly persistent and group-owned.

## Gotchas

- **Using a group for a page-specific section.** Persistent regions and route composition have different owners.
- **Rendering a group with `render`.** Use `{% sections %}` so Shopify owns group composition.
- **Replacing `content_for_layout` with a group.** Groups supplement the page render slot; they do not contain the active template output.
- **Calling the same group twice.** It duplicates navigation, announcements, or overlays.
- **Reading product data in a header group.** Global mounting does not make route-specific context a stable API.
- **Treating an overlay group as an accessibility implementation.** Persistent placement does not provide focus, dismiss, or trigger behavior.

## Checklist

- [ ] I use a section group only for a region that persists across the relevant layout frame.
- [ ] Group JSON owns ordered section instances; the layout owns the group’s document position.
- [ ] `content_for_header`, `content_for_layout`, and each group render preserve their distinct roles.
- [ ] I choose template composition when a component needs route or resource-specific context.
- [ ] An overlay group has a defined global ownership reason before it gains client behavior.

## Related

- `ch-14-layouts` — document frames and global render slots.
- `ch-15-templates` — route-level JSON composition.
- `ch-17-sections` — section schemas and editor contracts.
- `ch-37-javascript-in-themes` — client behavior for global overlay surfaces.

[1]: https://shopify.dev/docs/storefronts/themes/architecture/section-groups "Shopify section groups"

## Read a group as a persistent composition boundary

A group has three distinct owners. Shopify recognizes and validates the group file as a special composition resource. The layout chooses the document position where the group renders. The merchant uses the editor to arrange the allowed section instances in that region. Keeping these owners distinct avoids a frequent mistake: treating the header group as if it were a global snippet that any template can call at will.

The header group is a site shell region because the layout says it is. The group JSON does not decide that it belongs above the main content; its layout call does. Conversely, the layout should not enumerate the individual header sections in Liquid. That would pull editor composition back into code and make reordering or enabling an announcement bar a layout edit instead of a merchant configuration change.

A useful trace is: route selects template; template output enters `content_for_layout`; layout calls header/footer/aside groups at durable document positions; each group expands its ordered section instances; sections render their own schema-defined configuration. Each level owns one decision. If a change requires editing several levels, check that the desired change is actually persistent rather than page-specific.

## Group choice affects merchant operations

Group membership changes all pages sharing the relevant layout, so it needs a stronger editorial rule than template placement. Adding a section to `header-group.json` is not merely enabling one component on one landing page; it creates an all-routes expectation for navigation, announcement, or supporting content. Before allowing a group section, document its audience, absence behavior, copy ownership, and whether it must remain available in password, special, or alternate layout contexts.

Similarly, removing a group section has global impact. A merchant may assume a header announcement has disappeared from every relevant page after disabling it in the editor. A developer should not leave a duplicate hard-coded announcement in a layout or a template, because that breaks the group’s ownership promise. One persistent feature should have one persistent composition owner.

Groups are especially useful for delegation. A merchant can manage an ordered header announcement and navigation region without editing a template. A developer can change the underlying section schema without reworking every template. But delegation succeeds only when the group does not become a dumping ground for unrelated content. Retain a narrow persistent-region purpose for each group.

## Global overlays need lifecycle and accessibility contracts

An aside group may be mounted globally, but global mounting does not make a component suitable for all routes. For a navigation drawer or announcement layer, specify where the trigger lives, how the open state is conveyed, where focus moves, how escape and outside interaction behave, and whether a dismissed state persists. The group provides a consistent DOM home; it does not replace the client architecture or accessibility design.

Avoid using an aside group to make product-specific dialogs globally available by default. That risks serializing or reading route-specific data in a region rendered on search, cart, article, and customer pages. If the overlay content requires the current product, its natural home is usually product template composition. If it is an account-wide or site-wide utility, group-level composition can be right once its behavior and data boundary are explicit.

## Review method

Review a proposed section group by asking four questions. Is the region present across the layout’s intended routes? Is the order merchant-managed rather than code-managed? Does every member use global or explicit configuration rather than accidental page context? Does the global component still need a separate behavior and accessibility design? A yes to all four suggests a group. Otherwise, use template composition, a local section, or a different Shopify surface.
 This method keeps global composition intentional, editor-friendly, route-safe, and compatible with the document frame that mounts it across the storefront.
 The resulting persistent composition remains bounded by one layout position, explicit editor ownership, stable data requirements, and a separate accessibility contract for any interactive overlay.
 This makes the storefront’s shared regions predictable, maintainable, editor-configurable, and safe to evolve without contaminating route-specific template composition.
 Every group therefore has a visible purpose, a bounded document mount, a merchant-editable composition, and a reviewable distinction from page templates.
 This consistency reduces duplicated page code, prevents accidental global data assumptions, and keeps editor changes within the shared region they are meant to govern.
 Clear ownership, stable placement, explicit composition, and disciplined scope remain the durable principles.
 Durable, clear, shared, bounded, and reviewable.
