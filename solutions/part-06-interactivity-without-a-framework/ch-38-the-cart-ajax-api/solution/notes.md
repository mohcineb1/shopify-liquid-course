# Confirmed cart transition evidence

| Concern | Evidence/decision |
| --- | --- |
| Locale endpoint and operation | Root-prefixed add/change; clear/update only when their narrow semantics apply. |
| Current line key / refresh | Read from confirmed rendered drawer after each mutation. |
| Bundled section IDs/context | Verified drawer/count instance IDs and `sections_url`. |
| JSON/section error handling | Non-OK JSON/error or missing root retains old DOM and announces text. |
| Optimistic snapshot/reconcile | Pending control only; server response owns quantities/prices/count. |
| Inventory/quantity rule | Target-store constrained/sold-out behavior tested. |
| Overlap/version behavior | Only current sequence commits/publishes. |
| Subscriber transition | One post-reconciliation `cart:changed` event. |
| Keyboard/status/focus | Native controls and status behavior tested. |
| Native fallback | Product/cart forms still navigate with JavaScript disabled. |
