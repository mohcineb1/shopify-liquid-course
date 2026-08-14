# Scripts migration plan

The Scripts customizations report is discovery evidence for the inactive VIP shipping rule; it is not a fallback runtime.

| Question | Path | Evidence required |
| --- | --- | --- |
| Is a VIP delivery benefit still a current requirement? | Obtain current policy or retire | Business owner/policy/reporting impact `[VERIFY]` |
| Can current Function APIs express the required treatment? | Review/build documented delivery customization route | API, plan, configuration, delivery-group and market fixtures `[VERIFY]` |
| Is a maintained Function-based app appropriate? | Authorised merchant review/install decision | Vendor, scopes, data, cost, activation, rollback `[VERIFY]` |
| Is behavior obsolete/unsupported? | Simplify/retire | Acceptance and cleanup owner `[VERIFY]` |

Never recreate the Ruby logic until the current requirement, input data, multi-delivery behavior, Function/app route, plan eligibility, merchant configuration, and approval are verified.
