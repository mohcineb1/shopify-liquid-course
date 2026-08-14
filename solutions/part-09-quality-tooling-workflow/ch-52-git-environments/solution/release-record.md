# Spring candidate release record

| Field | Record |
| --- | --- |
| Source / deploy SHA | [VERIFY] reviewed commit and source-build provenance |
| Branch mapping | [VERIFY] branch, store, candidate ID/role, live ID/role |
| Candidate preview | [VERIFY] URL tied to the unpublished candidate ID |
| Prior verified live / rollback target | [VERIFY] theme ID, SHA, date, route evidence |
| Build / Theme Check | [VERIFY] clean output, tool versions, report |
| Merchant edit reconciliation | [VERIFY] Shopify commit, owner intent, retain/backfill/migrate/reverse decision |
| Routes / context | [VERIFY] home, product, collection; market, language, account, app state |
| Approval / operator | [VERIFY] merchant/release approver and release operator |
| Trigger and post-release evidence | [VERIFY] rollback criteria and named route results |

Rollback trigger: buyer-facing regression, incorrect target, unapproved composition loss, or approved incident decision. Authority: [VERIFY] release owner. Restore the previously verified remote candidate, record the action, verify the same route matrix, then reconcile the source and merchant-state divergence before closing the incident.
