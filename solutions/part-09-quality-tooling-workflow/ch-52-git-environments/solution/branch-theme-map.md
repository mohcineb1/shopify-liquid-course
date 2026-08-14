# Branch → theme map

| Branch | Store / remote theme | Role and preview purpose | Permitted mutation | Owner / expiry / rollback relation |
| --- | --- | --- | --- | --- |
| `feature/banner` | [VERIFY] dev store, unpublished ID | Disposable feature preview | Reviewed feature commits only | Developer/QA; delete after merge; merge to `release/spring` |
| `release/spring` | [VERIFY] review store or unpublished ID | Durable candidate and merchant approval preview | Release-ready deploy commits | Release + merchant owner; promote only after record; rollback source candidate |
| `main` | [VERIFY] live store, published ID | Current production tracking branch | Approved release, approved merchant reconciliation, rollback commits | Release owner; previous verified remote theme is rollback target |
| `campaign/summer` | [VERIFY] campaign theme ID | Time-bounded event preview/live candidate | Campaign-only approved commits | Campaign owner; expires [VERIFY]; republish verified `main` candidate |

Before any mutation, compare this record with the Shopify theme card, connected repository/branch, last saved commit, role, and integration logs. A branch name or storefront URL is not evidence of identity.
