<!-- STATUS: final -->
# Chapter 34 — Exercise

## Goal
Replace Atelier North’s copied location-page and product-footer content with a **store-location metaobject** model that supports reusable embedded cards, optional public location pages, product-selected pickup/location context, and a merchant-friendly entry lifecycle.

## Context
The retailer has six stores. Every location has an address, hours, phone, directions URL, image, pickup note, and a selection of locally featured products. The current theme contains six manually copied page templates plus a `location_name`, `location_hours`, and `location_map` text setting inside product sections. When opening hours change, staff update some copies but miss the product footer. Marketing now wants an index of location cards and a canonical page for each store. They also need a product template to display a merchant-selected pickup location without hard-coding a location handle in Liquid.

The solution is not “make every text field a metaobject.” A store is a repeated, multi-field entity that needs references, potentially a route, and reuse across several templates. Model the entity, define an active/draft process, render it safely in cards and a detail-template context, and identify which content remains a page/metafield/section setting instead.

Plan **55–70 minutes**. Create the proposed definition and two entries in a development store. Test an active entry, draft/unavailable entry, an entry missing optional pickup note/image, a product with/without a location reference, an editor-selected location setting, a direct location page, and the location index. Document every path you cannot verify in the actual store.

## Requirements

- [ ] Propose a `store_location` definition in `notes.md` with field key, type, required/optional state, validation, merchant label/help, storefront-access/publication decision, and content owner.
- [ ] Replace the copied-location approach with one reusable location-card snippet. It must render a referenced/selected entry only when present and avoid empty image, phone, directions, hours, or pickup-note markup.
- [ ] Add a location index section that uses entries deliberately and distinguishes unavailable/draft state from an empty store list. Do not use one page template per location.
- [ ] Sketch/render a location detail template context using the `metaobject` object. State the Web pages/storefront capability and SEO/handle configuration required for a canonical public route.
- [ ] Add a product-template-compatible setting that accepts a `store_location` metaobject reference, then document when a product `metaobject_reference` metafield is the better automatic relationship.
- [ ] Explain why product pages, an ordinary Page, direct metafields, a section block, or a metaobject are each appropriate/inappropriate for the location data in this scenario.
- [ ] Provide active/draft, missing-field, missing-reference, index, detail page, editor setting, and migration tests in `notes.md`.

> [VERIFY] Confirm the target definition’s Storefront access, publishable/Web pages capability, current entry status behavior, metaobject setting schema, dynamic-source type compatibility, and SEO/URL configuration before release.

## Constraints

Do not hard-code a location entry handle in a component intended for merchant selection. Do not duplicate every location field on product records. Do not emit a public URL for a draft/non-storefront entry. Do not create six location-specific Liquid templates. Do not make dynamic-source assumptions in a setting whose type/context cannot support the metaobject. Keep the solution in this unit’s starter paths.

Do not solve a generic store finder, maps integration, geolocation, inventory, or client-side filtering problem. The work is data modeling and correct server rendering of entry/reference/template contexts.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/location-index.liquid` | Copied hard-coded location tiles and no entry-state guards. |
| `starter/sections/product-pickup-location.liquid` | Product footer with repeated text settings instead of a location relationship. |
| `starter/snippets/location-card.liquid` | Unsafe location card with assumed fields and hard-coded URLs. |
| `starter/assets/location.css` | Finished location card/index/detail presentation styles. |
| `starter/notes.md` | Definition design, lifecycle, route, settings, model choice, and tests. |

The starter shows the symptoms of duplicated content. Your task is to choose an entity model that lets content editors update one store record and see consistent output in every eligible surface.

## Done when

A merchant can create/update one active location entry, connect it to a product or setting where appropriate, and see the same guarded card/detail data without copying field values. Location pages are a reusable metaobject template path, not duplicated template files. Draft/missing states remain honest, and notes make the entry lifecycle plus page/metafield/metaobject decision explicit.

## Stretch

Design a `location_service` or `pickup_window` metaobject related to a location. Explain whether it should be an embedded list, a public page, or a product relationship; include ordering and retirement behavior. Do not implement it in this exercise.
