# Specification schema and verification

| Merchant label | Owner | Namespace/key | Type/validation | Empty policy | Migration action |
| --- | --- | --- | --- | --- | --- |
| Material | Product | `specs.material` | single-line text | Omit row | Split from blob |
| Dimensions | Product | `specs.dimensions` | dimension | Omit row | Split from blob |
| Care | Product | `specs.care` | rich text | Omit row | Replace copied description text |
| Capacity | Variant | `specs.capacity` | volume | Omit row | Move variant-specific value from product |
| Care guide | Product | `specs.guide` | file reference | Omit row | Add reviewed file values |
| Related collection | Product | `specs.related_collection` | collection reference | Omit row | Replace copied URL |
| Fitting guide | Product | `specs.fitting_page` | page reference | Omit row | Replace copied URL |
| Compatible products | Product | `specs.compatible_products` | list.product_reference | Hide group | Replace handle CSV |

| Scenario | Observed output | Contract / decision |
| --- | --- | --- |
| Complete product | Typed rows and links render. | Product facts and variant capacity remain separate. |
| Missing optional data | Complete rows only. | No orphan `dt`. |
| Variant capacity | Selected variant volume renders. | Variant owns option-specific fact. |
| Empty related list | Group omitted. | Reference list uses `count`. |
| File guide | Type-aware link/media output. | Target file must be storefront available. |
| Product dynamic source | Heading can bind in product template. | No general-setting resource source. |
| Liquid-collision key | Bracket access resolves `size`. | Avoid filter ambiguity. |
