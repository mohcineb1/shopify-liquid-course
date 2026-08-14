# Candidate workflow

| Step | Command category | Source → target | Evidence before/after | Unsafe shortcut |
| --- | --- | --- | --- | --- |
| Identify | `theme list`, `theme info` | Store metadata → terminal | [VERIFY] store URL, remote ID, role, account | Guessing from a theme name |
| Develop | `theme dev --environment development` | Reviewed output → temporary dev theme | Development URL; product + collection route result | Calling this the approval candidate |
| Recover | `theme pull --environment staging` | Named remote target → local workspace | Clean/stashed Git state; owner decision for settings | Pulling over unknown local/merchant state |
| Candidate | `theme push --environment staging --strict` | Clean reviewed commit → unpublished staging theme | Theme ID, preview URL, route/matrix results | Pushing to production or using broad live flags |
| Package | `theme package` | Reviewed release commit → ZIP | Commit, checksum, artifact location | Packaging a dirty directory |
| Promote | `theme publish` | Approved unpublished candidate → live role | Approver, rollback target, final verification | Running it from this lab or with `--force` |

`theme dev` hot reload is evidence for CSS/section iteration only. Validate build output, checkout, apps, store data, customer/account state, inventory, Markets, and configuration through their appropriate routes or surfaces.

`.shopifyignore` excludes `notes/` and `*.local` because neither is deployable theme output. It must not exclude `assets/` or `sections/`; those directories contain the release-banner output.
