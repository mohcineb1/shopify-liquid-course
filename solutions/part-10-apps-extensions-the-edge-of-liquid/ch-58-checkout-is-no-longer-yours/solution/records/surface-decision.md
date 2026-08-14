# Surface decision

| Requirement | Chosen surface | Authority rationale | Rejected alternative |
| --- | --- | --- | --- |
| Restricted purchase rule | Cart and Checkout Validation Function `[VERIFY]` | Server-side rule can enforce documented criteria | Theme warning/disabled control is not enforcement |
| Restricted-item explanation | Theme cart + optional UI extension `[VERIFY]` | Theme prepares buyer; UI presents approved checkout context | DOM checkout script cannot own rule |
| Payment-method policy | Payment customization Function only if supported `[VERIFY]` | Commerce decision occurs in documented payment surface | CSS/selector hiding is cosmetic |
| VIP delivery policy | Delivery Function/reviewed Function app if still required `[VERIFY]` | Delivery treatment is bounded platform logic | Retired Script is not fallback |
| Confirmation measurement | Approved pixel/app mapping `[VERIFY]` | Event collection separated from page UI | Thank you ScriptTag is retired surface |
| Warranty offer | Eligible post-purchase extension, Order status info, or retire `[VERIFY]` | Depends on action/timing/eligibility | Basic UI page extension cannot mutate order |
| Survey/download | Thank you/Order status UI `[VERIFY]` | Content matched to timing/revisits | One-run confirmation script is unsafe |

Exact targets, app type, store plan, APIs, capabilities, policies, owner approval and activation are `[VERIFY]`.
