# Candidate validation matrix

| Case | Expected result | Sanitized evidence | Owner |
| --- | --- | --- | --- |
| Optional purpose not allowed | No optional transport; no cookie access | Candidate, allowed=`false`, event count `0` | Privacy `[VERIFY]` |
| Optional purpose allowed | Defined target mapping occurs once | Route, fixture, state, event name/count, payload keys only | Analytics `[VERIFY]` |
| Consent changed | Allowed-state is re-evaluated; no consent creation | Before/after result and listener observation | Privacy `[VERIFY]` |
| Standard event | Same-service semantic mapping and identity rule match | Pixel/app version, destination class, unique-event evidence | Pixel `[VERIFY]` |
| `guide_opened` click | One publisher event; no legacy vendor queue | Fixture, `surface`, schema version, event count | Theme/pixel `[VERIFY]` |
| Legacy removal | No SDK, automatic setter, or direct cookie code remains | Diff and asset inventory | Release `[VERIFY]` |

Never capture real buyer records, customer IDs, payment data, vendor secrets, raw full payloads, or unrestricted production traffic. Record candidate, app/pixel version, region, consent status, route, fixture, identity rule, approved evidence location, release decision, rollback target and cleanup deadline as `[VERIFY]` until approved.
