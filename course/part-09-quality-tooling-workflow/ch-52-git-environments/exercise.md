<!-- STATUS: final -->
# Chapter 52 — Exercise

**Time:** 70–90 minutes · **Type:** configuration-drift release rehearsal

## Goal

Turn an ambiguous set of Git branches and connected Shopify themes into a release model that can survive merchant edits. You will map each branch to a remote theme role, classify `settings_data.json` and JSON-template ownership, compare staging and production composition, choose a live-store branching strategy, and prepare a release/rollback record that preserves merchant agency rather than overwriting it.

## Context

Northstar Outdoors has a connected `main` branch published on the live store, an unpublished `release/spring` candidate, and a campaign theme whose branch name is not written down. Yesterday a merchant reordered the live homepage announcement sections and changed a colour in the theme editor. Shopify created a bot commit on the connected production branch. Meanwhile, the release branch has a developer’s schema migration and a different `templates/index.json`; the developer plans to merge it and “push staging over production” to make the repository clean.

The team must launch a seasonal banner, but cannot yet answer which remote theme belongs to which branch, whether the merchant edit is intentional, which JSON-template differences are expected, or what candidate would restore the storefront after a bad promotion. Build a decision record and safe file plan. Do not connect, publish, reset, or force-push a real store from this lab.

## Requirements

- [ ] 1. Write `branch-theme-map.md` for `feature/banner`, `release/spring`, `main`, and `campaign/summer`: repository/branch, store, theme ID placeholder, role, preview purpose, permitted mutation, owner, and expiry/rollback relation. Use `[VERIFY]` for real remote values.
- [ ] 2. Write `ownership.md` classifying `config/settings_data.json`, `templates/index.json`, and `sections/announcement-stack.liquid` as code-managed, merchant-managed, or shared. State the reconciliation workflow and the condition under which each file may be changed in a release.
- [ ] 3. Compare the starter production and staging JSON templates in `template-drift.md`. Classify every difference as intentional, unconfirmed, or defect; identify route impact, owner, evidence, promotion behavior, and reversion trigger.
- [ ] 4. Produce a branching/release policy that explains how feature, deploy/candidate, production, and temporary campaign branches map to themes; include source-versus-compiled-output treatment if a build pipeline exists.
- [ ] 5. Write a pre-release “merchant edited production” protocol: capture integration log/branch state, freeze or coordinate concurrent edits, review the Shopify commit semantically, reconcile/backfill or reverse only with owner approval, and test an unpublished candidate.
- [ ] 6. Write `release-record.md` with source SHA, candidate and prior-live theme IDs/roles, branch mapping, build/check records, preview URL, named routes, market/account context, approver, release operator, rollback trigger, and post-release evidence.
- [ ] 7. Include the safe use of integration logs and the manual reset-to-last-commit capability as a recovery discussion, while explaining why neither authorises discarding an unexplained merchant edit.
- [ ] 8. Mark store/branch mapping, Shopify commit intent, app/theme-editor state, permissions, customer/market data, candidate ID, and merchant/release approval `[VERIFY]` until observed in an authorised store.

## Constraints

- Do not state that `settings_data.json` is always code or always content; make ownership explicit by surface.
- Do not use a branch name as proof of a remote target or treat a generic storefront URL as candidate evidence.
- Do not create a “sync production to staging” command. A pull, reset, merge, or deploy requires a state/owner decision first.
- Do not erase, force-push, or revert Shopify-authored configuration commits merely because they are unfamiliar.
- Ship actual theme starter files in `assets/`, `sections/`, `templates/`, and `config/` so the drift is inspectable beyond prose.

## Starter

```text
starter/production/templates/index.json       merchant-edited live composition
starter/staging/templates/index.json          candidate composition with unclassified drift
starter/config/settings_data.json             merchant colour and section state
starter/sections/announcement-stack.liquid    schema migration in developer review
starter/assets/seasonal-banner.css            real release asset
starter/branch-state.md                       ambiguous mappings and unsafe action proposal
starter/release-record.md                     untraceable release note
```

Copy the starter into a disposable review directory. Use Git diffs and file history to analyse it, but do not manufacture remote IDs or claim that a static diff reveals merchant intent. Capture actual integration logs and theme card data only in an authorised store.

## Done when

| Concern | Evidence |
| --- | --- |
| Identity | Branch-theme map records remote ID/role placeholders and owners instead of assumptions |
| Ownership | Settings/templates/section state has a documented reconciliation rule |
| Drift | Every staging/production difference has route impact, owner, evidence, promotion, and reversion decision |
| Branches | Feature, candidate, production, and campaign paths have distinct purpose and rollback relationships |
| Release | Candidate, prior-live, approval, market/account routes, and rollback provenance are recorded |
| Merchant edit | Shopify commit is reviewed semantically and preserved/backfilled/reversed only under explicit authority |

## Stretch

Design a machine-readable branch-theme manifest that CI can validate against a protected environment without storing theme credentials. Explain which mapping values can be committed, which require protected configuration, and why the manifest cannot decide the meaning of a merchant editor change.

## Verification protocol

Use an approved non-production theme/store or a local fixture only. Record the production and candidate branch SHAs, theme IDs/roles, Shopify integration-log events, template/settings diffs, and named route screenshots in the appropriate authorised system. Compare the same routes in each intended market/account context. A difference must be classified as source code, generated output, merchant state, app state, theme configuration, route data, or release approval before merging, resetting, or promoting it.
