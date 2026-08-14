<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 52 — Solution

## The approach

The solution refuses the starter’s false choice between “production wins” and “staging wins”. It first identifies connected themes and branch purpose, then classifies state ownership, then promotes only a named candidate after semantic reconciliation. The merchant’s production edit is treated as evidence-bearing configuration work, not as pollution. The release record retains both a source revision and a previously verified remote recovery target.

A branch label is never enough. Every mapping below uses placeholders because the actual store, theme IDs, Shopify commits, permissions, app state, and approval authority must be observed in the authorised store. The workflow begins with GitHub integration logs, theme cards, and branch history; it ends with a tested candidate and a consciously chosen rollback path.

## Walkthrough

**1 — map identity before change.** Feature, release, production, and campaign branches map to distinct remote themes and purposes. The candidate can be reviewed without touching the live storefront; the campaign has an expiry and a reversion target.

**2 — make ownership explicit.** `announcement-stack.liquid` is developer-managed code. `settings_data.json` is shared merchant configuration in this scenario. `index.json` is shared composition. A developer cannot overwrite the latter two merely because a source diff is inconvenient.

**3 — resolve template drift semantically.** Production’s Friday delivery cutoff and sand tone are merchant changes. Staging’s seasonal message, featured heading, and newsletter section are candidate changes. None is automatically promotable: the merchant needs to confirm whether the cutoff must survive, marketing owns the seasonal copy, and the newsletter/app/data behavior needs a named route test.

**4 — choose a branch model.** Short-lived feature branches map to disposable unpublished previews. `release/spring` is a deployable candidate branch. `main` is the controlled production branch connected to the live theme. `campaign/summer` is time-bounded and returns to a named main candidate. If source needs compilation, an explicit deploy branch contains only platform-compatible output and records the source SHA.

**5 — reconcile the merchant edit.** Capture the Shopify-authored commit, current production branch SHA, integration log, and theme-card role. Ask the merchant owner whether the delivery change is intentional/current. Freeze or coordinate concurrent edits, create an unpublished candidate incorporating the approved decision, test routes, and then commit the backfill/migration. A reset-to-last-commit is a recovery mechanism only after the owner decides the current admin state should be discarded.

**6 — release records source and prior live.** A candidate preview ID/URL proves what was reviewed; the prior live ID/SHA proves what can restore service. Both remain `[VERIFY]` until supplied by the authorised store and release owner.

**7 — integration logs aid recovery.** Logs expose push/pull events and a theme can be reset to the last branch commit if it falls out of date. Neither action explains a merchant change or authorises its deletion.

**8 — leave unknowns visible.** Store mapping, bot-commit intent, app block state, customer/market context, permissions, and approval names are not facts discoverable from starter files.

## Full files

### `branch-theme-map.md`

```md
# Branch → theme map

| Branch | Store / remote theme | Role and preview purpose | Permitted mutation | Owner / expiry / rollback relation |
| --- | --- | --- | --- | --- |
| `feature/banner` | [VERIFY] dev store, unpublished ID | Disposable feature preview | Reviewed feature commits only | Developer/QA; delete after merge; merge to `release/spring` |
| `release/spring` | [VERIFY] review store or unpublished ID | Durable candidate and merchant approval preview | Release-ready deploy commits | Release + merchant owner; promote only after record; rollback source candidate |
| `main` | [VERIFY] live store, published ID | Current production tracking branch | Approved release, approved merchant reconciliation, rollback commits | Release owner; previous verified remote theme is rollback target |
| `campaign/summer` | [VERIFY] campaign theme ID | Time-bounded event preview/live candidate | Campaign-only approved commits | Campaign owner; expires [VERIFY]; republish verified `main` candidate |

Before any mutation, compare this record with the Shopify theme card, connected repository/branch, last saved commit, role, and integration logs. A branch name or storefront URL is not evidence of identity.
```

### `ownership.md`

```md
# Configuration ownership

| Surface | Model | Release rule | Reconciliation workflow |
| --- | --- | --- | --- |
| `sections/announcement-stack.liquid` | Code-managed | Change through reviewed developer commit | Theme Check/build/route test; migrate settings compatibly |
| `config/settings_data.json` | Shared | Change only after merchant/release owner decision | Capture both revisions, identify editor intent, diff semantically, retain/backfill/migrate/reverse with approval |
| `templates/index.json` | Shared | Promote only after route impact and composition approval | Compare candidate/live instances/order; test home route; record promotion and reversion decision |

A pull, reset, merge, or push cannot decide ownership. Preserve both revisions until an authorised owner chooses the outcome.
```

### `template-drift.md`

```md
# Home template drift

| Difference | Classification | Route impact / owner | Evidence and promotion behavior | Reversion trigger |
| --- | --- | --- | --- | --- |
| `announcement` → `seasonal` ID/message/tone | Unconfirmed | Home notice; merchant + marketing owner [VERIFY] | Confirm Friday cutoff versus spring campaign; candidate must reflect approved content | Campaign end or merchant rejection |
| `New arrivals` → `Spring trail essentials` | Intentional pending approval | Home merchandising; marketing owner [VERIFY] | Candidate preview and collection route evidence | Merchandising owner reverses |
| `newsletter` added | Unconfirmed | Home form/app/data behavior; marketing/app owner [VERIFY] | Test validation, consent, keyboard behavior, app/config state | App/config failure or owner rejection |
| Order changes | Defect until explained | Home hierarchy; release owner [VERIFY] | Compare rendered order in candidate/live route | Restore prior approved composition |
```

### `release-policy.md`

```md
# Live storefront branch policy

Feature branches obtain isolated unpublished previews and merge only after review. `release/spring` holds deployable candidate output and is connected to an unpublished review theme. `main` represents the controlled production relationship; its connected published theme receives only approved releases, merchant reconciliations, and rollback commits. `campaign/summer` is temporary and has an expiry plus named `main` reversion candidate.

If a build pipeline exists, source branches may contain source/tools, while the connected deploy branch contains only the default Shopify theme structure. Each deploy commit records the source SHA and build/check evidence. Do not connect a branch containing unrelated `src/` and `dist/` directories as though Shopify can choose the runtime tree.
```

### `merchant-edit-protocol.md`

```md
# Merchant edited production protocol

1. Pause or coordinate concurrent admin/Git edits; capture production branch SHA, candidate SHA, theme IDs/roles, integration-log events, and current preview routes [VERIFY].
2. Inspect the Shopify-authored commit and theme-editor context. Ask the merchant owner whether the edit is intentional and current [VERIFY].
3. Classify each changed setting/template as retain, backfill, migrate, or reverse. Record the decision and owner; do not select the newest file automatically.
4. Apply the approved state to an unpublished candidate, run build/static checks, and test the named home/product/collection routes in required market/account context [VERIFY].
5. Obtain candidate approval. Promote only with a prior-live rollback target; after release, capture route results and reconcile source/state follow-up work.

Use integration logs to diagnose sync events. Use reset-to-last-commit only after the owner explicitly approves discarding the current admin state and after capturing it for recovery.
```

### `release-record.md`

```md
# Spring candidate release record

| Field | Record |
| --- | --- |
| Source / deploy SHA | [VERIFY] reviewed commit and source-build provenance |
| Branch mapping | [VERIFY] branch, store, candidate ID/role, live ID/role |
| Candidate preview | [VERIFY] URL tied to the unpublished candidate ID |
| Prior verified live / rollback target | [VERIFY] theme ID, SHA, date, route evidence |
| Build / Theme Check | [VERIFY] clean output, tool versions, report |
| Merchant edit reconciliation | [VERIFY] Shopify commit, owner intent, retain/backfill/migrate/reverse decision |
| Routes / context | [VERIFY] home, product, collection; market, language, account, app state |
| Approval / operator | [VERIFY] merchant/release approver and release operator |
| Trigger and post-release evidence | [VERIFY] rollback criteria and named route results |

Rollback trigger: buyer-facing regression, incorrect target, unapproved composition loss, or approved incident decision. Authority: [VERIFY] release owner. Restore the previously verified remote candidate, record the action, verify the same route matrix, then reconcile the source and merchant-state divergence before closing the incident.
```

### Corrected theme files

The corrected candidate retains both valid theme assets and configuration deliberately. `announcement-stack.liquid` remains the reviewed schema source; `seasonal-banner.css` remains its asset. Do **not** overwrite `settings_data.json` or `index.json` from one environment in the solution: their values require the merchant/marketing decisions recorded above. The exercise’s explicit comparison is the correct deliverable, not a fabricated universal merged JSON file.

## What people get wrong here

**Force-pushing away Shopify commits.** A bot-authored commit can represent an authorised editor setting. Review intent before reverting it.

**Making `settings_data.json` globally ignored.** This avoids one class of merge conflict while making active merchant state invisible. Choose and document an ownership model instead.

**Copying production to staging.** It can erase a controlled candidate; copying staging to production can erase live merchant composition. Both directions need a semantic decision.

**Calling a branch the environment.** A branch is only code history until a store/theme/role mapping and preview target are proven.

**Rolling back by hand-editing live.** An urgent patch without prior-candidate provenance produces another divergence. Restore a known state, then make a reconciled source change.

## Stretch: direction only

A branch-theme manifest can store non-secret branch names, intended role, preview purpose, expiry policy, and owners. Protected CI configuration can supply real store/theme identifiers. The manifest can validate shape and mapping expectations, but it cannot interpret a merchant’s campaign choice; that remains an owner/evidence decision.
