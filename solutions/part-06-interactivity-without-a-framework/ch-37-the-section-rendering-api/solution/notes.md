# Section response contract and evidence

| Concern | Contract/evidence |
| --- | --- |
| Target URL and locale base | Filter form action/current locale route; never hard-code collection path. |
| Requested instance IDs | Inspect current `shopify-section-*` wrappers; maximum five API sections. |
| Expected wrapper roots | Each JSON key must contain its matching wrapper ID. |
| JSON/null/HTTP handling | HTTP and every value/root validate before commit; null retains prior DOM. |
| Commit/history/popstate | Two roots replace together; history after success; popstate re-renders URL. |
| Abort/version behavior | New input aborts predecessor; version rejects late completion. |
| Failure/native recovery | Existing form/link navigation stays usable. |
| Requested sections/bytes | Facets + grid only; record bytes/latency. |
| Keyboard/status/focus | Live status then results heading focus after explicit submit. |
| Cart boundary | No cart fetch here; use cart/bundled section workflow for mutations. |
