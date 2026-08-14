<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 50 — Solution

## The approach

This solution makes the remote target explicit before it makes any change. `development` is for `theme dev` feedback, `staging` is an unpublished candidate with a durable preview, and `production` identifies a future release target but is never default, credential-bearing, or automatically published. The workflow starts with inspection, keeps a release candidate separate from the ephemeral development theme, and turns real-store validation into a record of context and evidence.

The key design choice is that a CLI environment is **convenience configuration**, not permission control. The target record, least-privilege access, reviewer approval, and rollback candidate remain separate controls. A named environment helps a developer avoid typo-driven targeting; it cannot authorise a broad push or resolve a merchant editor conflict.

## Walkthrough

**1 — three named environments, no secret.** The corrected TOML contains environments for development, staging, and production. It does not set `[environments.default]`, so a developer has to name a context. Store names and theme IDs below are placeholders: replace them only in a private authorised project context.

```toml
[environments.development]
store = "northstar-dev"

[environments.staging]
store = "northstar-review"
theme = "STAGING_THEME_ID"

[environments.production]
store = "northstar"
theme = "PRODUCTION_THEME_ID"
```

Do not add a Theme Access password, app token, `allow-live`, or `force` to this committed file. Environment variables and the approved secret store are the right home for credentials. Command-line flags override environment variables, which override TOML settings, so each mutation still begins with the resolved target in the terminal output.

**2 — command sequence, not a magic deploy command.** `commands.md` treats `list` and `info` as mandatory reconnaissance. The local source is inspected with Git and its build before `dev` uploads it to a temporary development theme. Only a clean, reviewed commit becomes a candidate with a `push` to the staging environment. `pull` is recovery/import work with an explicit decision about local state. `package` creates a ZIP from the reviewed release commit. `publish` is documented as a later approved promotion category and is not executed in this lab.

**3 — hot reload has a boundary.** `theme dev` offers fast feedback for CSS and section changes, with a possible page refresh for other file changes. It does not prove checkout, app configuration, source compilation, inventory, customer-account behaviour, Markets setup, or merchant settings migration. The route record makes those separate tests visible rather than treating one refreshing page as evidence for every surface.

**4 — a durable candidate is not a development theme.** Development themes are temporary and can disappear after logout. An unpublished remote staging theme holds the review candidate and produces the preview link sent to the merchant. That link is recorded with its remote theme ID, Git SHA, routes, and data context. A generic storefront URL is never a candidate identifier.

**5 — release evidence.** The release record includes the operator, approver, source revision, CLI/build versions, target ID and role, preview, routes, and result. A value that must come from a real client store remains `[VERIFY]`, rather than being invented to make a sample look executable.

**6 — configuration ownership.** The theme section file is code-managed. JSON templates and `settings_data.json` can embody merchant choice, so their owner must be decided before transfer. If a pull exposes a conflict, preserve both sides for review; do not overwrite remote configuration to restore a clean working tree.

**7 — rollback.** A rollback selects a previously verified candidate and requires an authorised decision. The record deliberately contains a symbolic identifier, not a fabricated live theme ID. The exact command and approval path depend on the store’s release policy.

**8 — narrow ignores.** Ignore local documentation and `*.local` files, not `assets/` or `sections/`. The CLI still receives the actual theme output.

**9 — verification flags.** Permissions, source theme IDs, market/account route state, merchant approval, and policy are specific to the authorised store. They belong in the evidence record with `[VERIFY]` until obtained.

## Full files

### `shopify.theme.toml`

```toml
[environments.development]
store = "northstar-dev"

[environments.staging]
store = "northstar-review"
theme = "STAGING_THEME_ID"

[environments.production]
store = "northstar"
theme = "PRODUCTION_THEME_ID"
```

### `.shopifyignore`

```text
# Local engineering notes are not theme runtime files.
notes/
# Local-only configuration must not ship.
*.local
# Preserve assets/, sections/, config/, layout/, locales/, snippets/, templates/.
```

### `commands.md`

```md
# Candidate workflow

| Step | Command category | Source → target | Evidence before/after | Unsafe shortcut |
| --- | --- | --- | --- | --- |
| Identify | `theme list`, `theme info` | Store metadata → terminal | [VERIFY] store URL, remote ID, role, account | Guessing from a theme name |
| Develop | `theme dev --environment development` | Reviewed output → temporary dev theme | Development URL; product + collection route result | Calling this the approval candidate |
| Recover | `theme pull --environment staging` | Named remote target → local workspace | Clean/stashed Git state; owner decision for settings | Pulling over unknown local/merchant state |
| Candidate | `theme push --environment staging --strict` | Clean reviewed commit → unpublished staging theme | Theme ID, preview URL, route/matrix results | Pushing to production or using broad live flags |
| Package | `theme package` | Reviewed release commit → ZIP | Commit, checksum, artifact location | Packaging a dirty directory |
| Promote | `theme publish` | Approved unpublished candidate → live role | Approver, rollback target, final verification | Running it from this lab or with `--force` |

`theme dev` hot reload is evidence for CSS/section iteration only. Test build output, checkout, apps, store data, customer/account state, inventory, Markets, and configuration through their appropriate routes/surfaces.

`.shopifyignore` excludes `notes/` and `*.local` because neither is deployable theme output. It must not exclude `assets/` or `sections/`; those are needed by the release banner.
```

### `release-record.md`

```md
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

Trigger: verified buyer-facing regression, wrong remote target, failed named route, or approved incident decision. Authority: [VERIFY] release owner. Target: [VERIFY] previously verified candidate/theme ID and Git SHA. Record the chosen promotion or re-push operation, its target, time, operator, and post-rollback route result before closing the incident.
```

## What people get wrong here

**Making production the default.** It feels efficient until one omitted `--environment` turns an exploratory command into a real-store operation. Defaults should minimise blast radius.

**Treating `pull` as Git sync.** Remote files do not carry your local review history or settle whether an editor change is merchant state. Pull only after deciding how its diff will be reconciled.

**Approving a development URL.** A development theme is an iteration surface with a short lifetime. A stable reviewer needs a named unpublished candidate and a recorded preview URL.

**Calling hot reload a test suite.** Reload validates that a particular theme output appears on a route. It does not validate deployment credentials, checkout, market configuration, inventory, apps, or the external build chain.

**Inventing the rollback target.** A plausible numeric ID is worse than a `[VERIFY]` marker. The release owner must select and test a real previously verified candidate.

## Stretch: direction only

A CI job can package a reviewed commit and target staging only when its protected environment supplies the credential. TOML store/theme metadata can be reviewed in code; credentials belong in protected secrets; candidate approval, live promotion, and rollback authority remain human release controls unless the organisation has explicitly designed and audited their automation.
