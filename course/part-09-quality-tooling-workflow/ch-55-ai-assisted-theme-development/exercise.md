<!-- STATUS: final -->
# Chapter 55 — Exercise

**Time:** 70–90 minutes · **Type:** agent workflow hardening

## Goal

Turn an over-permissive AI request into a reviewable theme-change workflow. You will require current reference retrieval rather than model memory, give an agent a narrow section task, expose the component contract through `{% doc %}` and schema clarity, separate safe validation from protected operations, and build a human review record before anything can reach a candidate theme.

## Context

A teammate pasted this into an AI coding tool: “Copy the latest Dawn promo banner into our live theme, fix all Theme Check errors, update the France price, and publish it. Use whatever credentials are in the repo.” The returned patch adds an opaque section, reads `settings` implicitly in a snippet, suppresses Theme Check warnings globally, includes a store URL in a comment, and claims that it has verified the French market.

The actual request is smaller: create an unpublished-candidate promotional message section for a currently configured collection page. The team needs an agent task envelope, current Liquid/schema evidence, a `doc` contract, an allowed validation loop, and a review/approval boundary. The exercise uses local starter files only; do not connect an agent to a store, paste secrets, publish a theme, or execute a production command.

## Requirements

- [ ] 1. Write `agent-task.md` defining the exact section purpose, target directory, in-scope/out-of-scope files, current-reference questions, permitted commands, prohibited operations, expected artifacts, fixtures, stop condition, and required change summary.
- [ ] 2. Write `research-record.md` with official current documentation queries/URLs for each platform-specific Liquid/schema claim. Distinguish retrieved facts from `[VERIFY]` store/market/app/permission/approval facts.
- [ ] 3. Replace the starter’s implicit snippet contract with a section/snippet contract using `{% doc %}`, explicit render arguments, stable setting IDs, meaningful labels, safe defaults, and stated non-goals.
- [ ] 4. Create `theme-check-dispositions.md` that groups the starter findings, proposes the smallest correction, names documentation/evidence, and forbids global suppression or automatic deferral without dependency review.
- [ ] 5. Create `review-record.md` covering source/platform correctness, architecture/editor compatibility, merchant configuration, buyer experience/accessibility/localization, privacy/security, performance, tests, candidate identity, rollback, and protected-operation approval.
- [ ] 6. Write `dawn-migration-plan.md` that inventories copied dependencies before adapting any reference markup. Explain why screenshot similarity is insufficient and preserve the target theme’s contracts rather than importing a class graph.
- [ ] 7. Mark documentation/tool version, candidate theme/store, collection data, market eligibility, translations, app behavior, credentials, permissions, reviewer, release/rollback owner, and promotion outcome `[VERIFY]` until observed through approved channels.
- [ ] 8. Ship real starter Liquid, CSS, and check-report files that an agent/reviewer could inspect locally; no store connection or secret belongs in them.

## Constraints

- Do not claim an agent has verified a market price, buyer eligibility, checkout, app behavior, or merchant configuration from source files alone.
- Do not place store URLs, passwords, tokens, customer data, real candidate IDs, or copied proprietary/theme source in prompts, comments, records, or commits.
- Do not ask the agent to publish, force-push, delete, pay, or modify protected production state.
- Do not replace a focused Theme Check correction with a disabled global rule.
- Do not copy Dawn source. Treat it as a dependency/reference inventory only.

## Starter

```text
starter/sections/agent-promo.liquid        opaque section with unclear schema contract
starter/snippets/promo-copy.liquid          implicit settings/global input
starter/assets/agent-promo.css               real owner-bound CSS asset
starter/theme-check-report.md                unclassified findings and global suppression proposal
starter/agent-request.md                     dangerous open-ended prompt and secret request
starter/dawn-notes.md                        unowned markup-copy instruction
```

Copy the starter into a local review directory. Apply only safe source/document changes. Any command that needs an authenticated store must stay a documented `[VERIFY]` step for an approved operator, not an action in this exercise.

## Done when

| Concern | Evidence |
| --- | --- |
| Current facts | Research record separates official source claims from store-specific unknowns |
| Agent scope | Task envelope limits files, actions, commands, output, and stop condition |
| Contracts | Section/snippet expose inputs, setting meaning, ownership, and non-goals locally |
| Checks | Every Theme Check signal has a minimal correction/disposition and no blanket suppression |
| Review | Record exposes all pre-release categories and names protected approval/rollback boundaries |
| Migration | Dawn-like reference work begins with a dependency inventory, not copied markup |

## Stretch

Write a machine-readable component manifest for the promo surface that an AI tool can read without granting it store access. Include component name, input contract, schema IDs, asset owner, known routes, fixture IDs, non-goals, review owner, and source-reference update trigger. Explain why this manifest cannot authorise a publish action.

## Verification protocol

Run only approved local static checks against the exact candidate source/output. Preserve prompt/task version, documentation links, tool version, source diff, check output, fixture references, unresolved `[VERIFY]` facts, and reviewer decision. Before an authorised store preview or release, a human confirms the target theme/branch/store, merchant settings/configuration, required routes/market/account context, app behavior, approval, and rollback target. The agent may prepare the evidence packet; it must not infer or execute the protected operation.
