# Cart verification

| Scenario | Observed state | Authority / refresh outcome |
| --- | --- | --- |
| Duplicate personalized variant | Distinct current keys/properties display. | Refresh after mutation; do not cache key. |
| Line-level discount | Final line price and allocation agree. | Final price remains customer-facing amount. |
| Cart-level discount | Summary application and total agree. | Do not add it to line allocations. |
| Empty cart | Empty branch and navigation display. | No summary is inferred. |
| Hidden property | Underscore property omitted. | Hidden is display behavior, not security. |
| Cart note | `note` remains cart scoped. | It survives independently of a line. |
| Cart mutation | Fresh cart response required. | New keys/totals replace old state. |
| Gift unavailable | No local zero-price gift claim. | Backend rule remains owner. |
