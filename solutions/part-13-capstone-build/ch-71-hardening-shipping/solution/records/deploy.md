# Release gates — candidate

| Gate | Evidence | Abort/response | Owner |
| --- | --- | --- | --- |
| Pre-release | Version, matrix, exceptions, rollback artifact | Block if required evidence missing | Approver `[VERIFY]` |
| Preview | Buyer/editor/failure/market task fixtures | Log defect, correct, retest | QA/content `[VERIFY]` |
| Release | Target/time/communication/approval | Verified rollback if abort condition met | Release owner `[VERIFY]` |
| Observation | Baseline/signals/incident channel | Triage raw evidence | Operations `[VERIFY]` |
| Iteration | Hypothesis/route/risk/metric/retest | Bounded backlog item | Theme owner `[VERIFY]` |

> [VERIFY] Actual permissions, production targets, consent, analytics, alerts and rollback execution are not established by this record.
