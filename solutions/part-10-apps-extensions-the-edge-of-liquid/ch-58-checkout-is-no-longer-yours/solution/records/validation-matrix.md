# Candidate validation matrix

| Case | Expected result | Sanitized evidence | Owner |
| --- | --- | --- | --- |
| Cart guidance | Accessible notice and normal checkout control remain available | Candidate route, controlled cart, screenshot/a11y observation | Theme `[VERIFY]` |
| Restricted item fails | One clear server-side validation error | Fixture, output/error shape, Function version | Commerce `[VERIFY]` |
| Restricted item passes | No validation error | Fixture/output | Commerce `[VERIFY]` |
| UI proposal | Approved placement/default/error behavior without unused capability | Target class, config state, API/app version | Extension `[VERIFY]` |
| Delivery/payment | Decision record; no DOM selector/hide behavior | Removed asset/source plus feasibility decision | Commerce `[VERIFY]` |
| Scripts retirement | No active legacy reliance; current requirement decision accepted | Report reference, migration/retire approval | Merchant `[VERIFY]` |
| Thank you/Order status | Initial/revisit timing semantics hold | Page sequence, sanitized order-state observation | Post-purchase `[VERIFY]` |
| Post-purchase | Eligibility/access and decline/failure alternative defined | Candidate/plan/access evidence | Post-purchase `[VERIFY]` |
| Tracking | No optional event before allowed consent; semantics unique | Consent state, event name/count/destination class | Privacy `[VERIFY]` |
| Legacy removal | Deprecated sources absent after acceptance | Diff, release ID, rollback target, cleanup date | Release `[VERIFY]` |

Never use real buyer or payment data, production secrets, unrestricted traffic, actual checkout configuration changes, or unapproved store access. Candidate, plan, app/pixel/Function versions, targets, configuration, policy, test state, owners, release window and approval remain `[VERIFY]` until observed.
