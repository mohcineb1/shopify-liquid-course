<!-- STATUS: final -->
# Chapter 33 — Exercise

## Goal
Build **Lab 12**, a product specification-table component driven entirely by typed metafields. The table must preserve product/variant ownership, render type-aware values, handle optional rows and ordered lists, and remain understandable for a merchandising team that will add specifications without editing Liquid.

## Context
Atelier North’s product pages have a “Specifications” table maintained by developers. The existing section uses one `specs_blob` text metafield containing lines such as `Material: recycled aluminum|Capacity: 650 ml|Care: ...`, then splits values in Liquid. A variant-specific capacity is stored on the product, a warranty sentence is copied into product description and theme settings, and “compatible accessories” is a comma-separated handle list. A new merchant asks for an optional care callout, a link to a related collection, a downloadable care guide, an ordered list of compatible products, and specifications that adapt to selected variants without duplicating universal product facts.

The business team must be able to maintain the schema and values in Shopify admin. They should not need to learn delimiter syntax, update a parallel label/value/unit array, or decide how a Liquid filter parses an old blob. The theme should render valid blank states and use the contract for the definition that owns each fact.

Plan **60–75 minutes**. Create the proposed definitions in a development store before wiring the section. Test a product with complete data, a product missing optional values, a product with a selected variant that differs in capacity, an empty related-products list, a file reference that is not an image, a rich text care field, and the dynamic source connection in the product template editor.

## Requirements

- [ ] Replace the delimiter-based blob with a documented set of typed product and variant metafield definitions. In `notes.md`, state owner, namespace/key, type, validation, display label, empty policy, and migration action for every definition.
- [ ] Render a semantic `<dl>` specification table containing product facts and the currently selected variant’s applicable facts. Do not leave orphaned `<dt>` labels when values are blank.
- [ ] Use a type-aware rendering path for rich text, money, measurements, dates, boolean, and files/references where the component needs Shopify’s generated semantics; manually render references where a deliberate card/link layout needs target fields.
- [ ] Model compatible products as an ordered product-reference list. Iterate it correctly, preserve merchant order, and use the documented reference-list length check.
- [ ] Include one `collection_reference`, one `page_reference`, and one `file_reference` behavior with safe absent/unavailable handling. Explain when a metaobject reference would replace a group of flat fields.
- [ ] Add a section setting that can be connected to a compatible product metafield via a dynamic source in the product template. Do not attempt to add a resource-specific dynamic source to general theme settings.
- [ ] Demonstrate the correct access strategy for a key that could collide with Liquid (`size`, `first`, or `last`).
- [ ] Preserve a plain, useful page when no specifications exist; do not output debug type/value data to customers.

> [VERIFY] Confirm current definition validation options, target-store file/reference storefront availability, the selected-variant contract in the chosen product section, dynamic-source compatibility, and merchant locale/market behavior before launch.

## Constraints

Do not use comma-, pipe-, or newline-delimited text as an ersatz table schema. Do not use old deprecated `integer`, `json_string`, or `string` definitions for new work. Do not infer a unit from a number; use a measurement/money type. Do not use `metafield_tag` for a list it does not support. Do not duplicate the same fact on product and variant merely to avoid an empty-state branch.

Keep the work inside this unit’s starter files. The component must read values only; definitions/values are created by merchant/admin or app workflows, never by Liquid. Model reusable multi-field specification records for `ch-34-metaobjects` rather than overbuilding this single table.

## Starter

| File | Purpose |
| --- | --- |
| `starter/sections/product-specifications.liquid` | Delimiter-based product-only table with unguarded fields. |
| `starter/snippets/spec-row.liquid` | Generic row that assumes all values are scalar text. |
| `starter/assets/product-specifications.css` | Finished table/card layout styles. |
| `starter/notes.md` | Definition inventory, ownership, migration, dynamic-source, and test record. |

The starter intentionally encodes a data model into Liquid string parsing. Replace the model, not merely the delimiter character.

## Done when

A merchant can see and understand the intended definitions in `notes.md`, add valid values in admin, and receive a coherent table without changing code. Product and variant facts render at the correct scope. Rich/measurement/reference/list output follows type contracts, blank fields disappear as complete rows, and the dynamic source appears only in a compatible product-template setting.

## Stretch

Design a `specification` metaobject for reusable, ordered specification rows with label, kind, value/reference, and optional help content. Explain which fields belong to that record and which remain direct product/variant metafields. Do not implement the metaobject in this exercise.
