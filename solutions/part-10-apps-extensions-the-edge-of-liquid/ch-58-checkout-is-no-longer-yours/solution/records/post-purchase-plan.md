# Post-purchase surface plan

| Request | Surface decision | Contract |
| --- | --- | --- |
| Survey | Thank you UI extension `[VERIFY]` | Initial prompt; idempotent submission and minimised data |
| Download | Thank you and/or Order status UI `[VERIFY]` | Revisit-safe entitlement and authenticated delivery design |
| Review request | Order status UI `[VERIFY]` | Revisit-safe; avoid duplicate incentive/action |
| Warranty offer | Eligible post-purchase extension; otherwise Order status information or retire `[VERIFY]` | Define user value, offer/decline path, order action, payment timing, eligibility |
| Conversion measurement | Reviewed pixel/app strategy `[VERIFY]` | Consent/event contract, not page-script loading |

Thank you is initial confirmation and must not assume completed order availability; Order status is revisitable and must be idempotent. A post-purchase extension is a separate specialized flow whose live eligibility/access requires verification. Record page/target, app version, plan/access, order timing, idempotency key, data purpose, consent, configuration, candidate sequence, failure/decline behavior, alternative, release/rollback owner as `[VERIFY]`.
