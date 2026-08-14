# Checkout UI proposal

| Field | Decision |
| --- | --- |
| Purpose | Explain the defined restriction and next action; never decide eligibility |
| Target class | Block `[VERIFY]` exact target, API version, availability and merchant placement |
| Data | Minimal configured message and sanctioned target context only `[VERIFY]` |
| Capabilities | None requested: no network access, consent collection, or progress blocking |
| Merchant configuration | Optional message/placement with safe default when unset |
| Boundary | No checkout DOM, selector, payment data, secret, or customer-data transfer |
| Failure behavior | Core checkout remains usable; concise fallback/no supplemental content |
| Candidate test | Placement, absent config, mobile/narrow layout, unavailable optional data, accessible reading order |

If later scope requires network access or blocking progress, it needs a separate authorised design with business purpose, exact data path, privacy/security review, error/rollback behavior, plan eligibility, configuration, and owner `[VERIFY]`.
