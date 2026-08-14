# Configuration ownership

| Surface | Model | Release rule | Reconciliation workflow |
| --- | --- | --- | --- |
| `sections/announcement-stack.liquid` | Code-managed | Change through reviewed developer commit | Theme Check/build/route test; migrate settings compatibly |
| `config/settings_data.json` | Shared | Change only after merchant/release owner decision | Capture both revisions, identify editor intent, diff semantically, retain/backfill/migrate/reverse with approval |
| `templates/index.json` | Shared | Promote only after route impact and composition approval | Compare candidate/live instances/order; test home route; record promotion and reversion decision |

A pull, reset, merge, or push cannot decide ownership. Preserve both revisions until an authorised owner chooses the outcome.
