# Candidate release record

| Field | Record |
| --- | --- |
| Git SHA / branch | [VERIFY] reviewed commit |
| CLI and build version | [VERIFY] captured terminal/build output |
| Environment / store | staging / [VERIFY] authorised store URL |
| Candidate remote ID / role | [VERIFY] unpublished theme ID and role from `theme info` |
| Preview URL | [VERIFY] staging candidate preview, not generic storefront URL |
| Operator / approver | [VERIFY] named accountable people |
| Routes and context | [VERIFY] product, collection; market, language, customer state as relevant |
| Outcome | [VERIFY] expected banner and no regressions |

## State ownership

| Surface | Owner | Transfer rule |
| --- | --- | --- |
| `sections/release-banner.liquid` | Repository/code review | Push from the approved commit |
| JSON template | [VERIFY] team/merchant agreement | Diff and approve before pull/push |
| `config/settings_data.json` | [VERIFY] usually merchant/editor state | Never overwrite to resolve a local conflict |

## Rollback

Trigger: verified buyer-facing regression, wrong remote target, failed named route, or approved incident decision. Authority: [VERIFY] release owner. Target: [VERIFY] previously verified candidate/theme ID and Git SHA. Record the selected promotion or re-push operation, target, time, operator, and post-rollback route result before closing the incident.
