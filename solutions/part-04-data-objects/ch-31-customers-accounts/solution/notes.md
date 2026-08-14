# Customer account verification

| Scenario | Observed theme state | Platform / authorization owner |
| --- | --- | --- |
| Signed out | Account component is present; no customer name leaks. | Shopify account component/sign-in. |
| Signed in | Guarded greeting and account component display. | Shopify account sheet/profile. |
| Empty order history | Account surface offers a catalog return. | Current account/account extension. |
| Partial fulfillment | Localized fulfillment label renders. | Shopify order state. |
| Cancelled order | Localized cancellation label is guarded. | Shopify order state. |
| Tagged customer | Informational wholesale message renders. | B2B/catalog/backend rules control access. |
| Untagged customer | No segment message is rendered. | No authorization inference. |
| Account-mode migration | Legacy template inventoried only. | Customer account extension/current account migration. |

Legacy Liquid templates remain relevant only for a store still using legacy accounts. New account-page features belong to current customer accounts and their supported extension/API surfaces.
