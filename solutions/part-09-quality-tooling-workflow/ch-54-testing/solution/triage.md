# Test failure triage

| Signal | Preserve first | First question / likely owners | Escalation or rollback |
| --- | --- | --- | --- |
| Screenshot mismatch | Baseline/current image, metadata, diff | Code, fixture, viewport, browser, dynamic region, or design decision? | Do not accept baseline without reviewer decision |
| Lighthouse regression | Report, SHA, asset/build diff, repeated run | Route/resource/variance/app/fixture change? | Performance owner; candidate rollback if material [VERIFY] |
| Smoke failure | URL, rendered state, cart/session, trace | Buyer transition or setup/configuration drift? | Theme/route/app/config owner; stop promotion |
| Edge-data break | Exact resource/context and safe expectation | Absence/length/cardinality/availability assumption? | Theme/content/catalog/Markets owner |
| Merchant mismatch | Candidate route and approved expectation | Implementation or requirement/configuration ambiguity? | Merchant/release owner decision; preserve candidate evidence |
