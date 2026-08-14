# Store location model and verification

| Field | Type | Required? | Validation/help | Publication/owner |
| --- | --- | --- | --- | --- |
| Name | single-line text | Yes | Public store name | Operations |
| Address | rich/multi-line text | Yes | Formatted physical address | Operations |
| Hours | rich text | Yes | Include holiday-update process | Operations |
| Phone | single-line text | No | Contact number | Operations |
| Directions | URL | No | Approved destination | Operations |
| Image | file reference | No | Storefront-available media | Content |
| Pickup note | rich text | No | Buyer guidance | Operations |
| Featured products | list.product_reference | No | Ordered local curation | Merchandising |

| Scenario | Observed output | Lifecycle or model decision |
| --- | --- | --- |
| Active entry | Card/detail can render. | Active storefront entry only. |
| Draft entry | Treated as unavailable. | Publish after review. |
| Missing optional field | Field markup omitted. | No empty wrapper/link. |
| Missing product reference | Pickup section omitted. | Product relation optional. |
| Location index | Selected entries preserve order. | Merchant-curated list. |
| Detail web page | One template renders current `metaobject`. | Web pages/SEO/handle configured in admin. |
| Editor-selected setting | Fallback location renders. | Constrained `store_location` setting. |
| Migration | References/pages/menus audited before retirement. | One entry replaces copied fields/pages. |
