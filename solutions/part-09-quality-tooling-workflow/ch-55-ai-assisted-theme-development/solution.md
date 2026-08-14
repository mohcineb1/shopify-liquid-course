<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 55 — Solution

## The approach

The starter fails because it grants an agent broad authority and weak context at the same time. The solution narrows the task to one candidate section, retrieves current platform facts before writing Liquid, makes the section/snippet contract explicit, turns lint output into investigated dispositions, and stops before any authenticated or protected store operation. The agent prepares evidence; a human owner verifies context and acts.

## Walkthrough

**1 — task envelope.** The task names only the promo section, snippet, CSS, research record, check dispositions, and review record. It excludes publishing, credentials, store writes, price/market claims, customer data, and unrelated refactors.

**2 — current evidence.** The research record links to the current Liquid reference, Dev MCP/AI Toolkit documentation, and project contracts. It treats exact theme/store ID, collection content, France eligibility, translations, app behavior, permissions, and approval as `[VERIFY]`.

**3 — explicit contract.** `promo-copy` accepts a required `copy` argument. It no longer reads global `settings` or `section`. `{% doc %}` records input/output/non-goals. The section uses a stable `message` setting ID and clear label; it does not claim localization or market eligibility.

**4 — Theme Check loop.** Findings are grouped, linked to evidence, corrected minimally, rerun, and recorded. A disabled check requires a bounded documented exception, never a global greenwashing rule.

**5 — review record.** The record covers architecture, editor/configuration preservation, accessibility/localization, security/privacy, performance, test evidence, candidate identity, rollback, and protected-operation approval.

**6 — Dawn migration.** Reference work begins with a dependency inventory. Screenshot resemblance never establishes that a target theme needs Dawn’s snippets, class graph, assets, JavaScript, schema, or accessibility implementation.

**7 — visible unknowns.** Environment facts stay `[VERIFY]`; no source file is allowed to manufacture them.

**8 — real files.** The corrected section, snippet, and CSS are mirrored below, alongside the procedural documents.

## Full files

### `sections/collection-promo.liquid`

```liquid
{% doc %}
  Candidate promotional message section.

  Renders a merchant-authored message on an approved collection context.
  It does not determine collection eligibility, market pricing, legal claims,
  translation policy, or release approval.
  Owner: collection-content team [VERIFY].
{% enddoc %}

{{ 'collection-promo.css' | asset_url | stylesheet_tag }}

{% if section.settings.message != blank %}
  <section class="collection-promo" {{ section.shopify_attributes }}>
    <p>{% render 'promo-copy', copy: section.settings.message %}</p>
  </section>
{% endif %}

{% schema %}
{
  "name": "Collection promotion",
  "settings": [
    {
      "type": "text",
      "id": "message",
      "label": "Promotional message",
      "default": "Explore the collection"
    }
  ],
  "presets": [{ "name": "Collection promotion" }]
}
{% endschema %}
```

### `snippets/promo-copy.liquid`

```liquid
{% doc %}
  Outputs an explicit promotional-copy input.

  @param {string} copy - Required merchant-authored message.
  Output: escaped inline text only.
  Non-goals: global settings lookup, translation choice, price/market policy.
{% enddoc %}

{{ copy }}
```

### `assets/collection-promo.css`

```css
.collection-promo {
  padding: 1.5rem;
  background: #173f35;
  color: #fff;
}

.collection-promo p { max-width: 65ch; }
```

### `agent-task.md`

```md
# Agent task envelope — collection promotion

## Objective
Create a source-only candidate `collection-promo` section and `promo-copy` snippet for an approved collection route. Produce a diff, research record, Theme Check dispositions, and review packet.

## Scope
May read/write: `sections/collection-promo.liquid`, `snippets/promo-copy.liquid`, `assets/collection-promo.css`, and the named records. May run approved local source/build/Theme Check commands [VERIFY].

## Current-reference questions
Retrieve current documentation for Liquid `{% doc %}`, `{% render %}`, section schema, and Theme Check checks before using them. Record URL/query/date and the exact contract used.

## Prohibited operations
No store connection, credentials/secrets/customer data, publishing, CLI push/pull, force push, deletion, payment, checkout/account changes, price conversion, market eligibility assertion, or external posting.

## Output and stop condition
Return changed-file list, source citations, commands/results, unresolved `[VERIFY]` facts, tests required in an authorised candidate, and review questions. Stop after local validation; do not infer or execute promotion.
```

### `research-record.md`

```md
# Current-reference record

| Claim | Current official source / evidence | Store-specific unknown |
| --- | --- | --- |
| Liquid objects/tags/filters are contextual | Shopify Liquid reference: https://shopify.dev/docs/api/liquid | Collection context and actual data [VERIFY] |
| AI Toolkit/Dev MCP provides current docs/schema/validation context | https://shopify.dev/docs/apps/build/ai-toolkit | Tool version/capability and organisation policy [VERIFY] |
| Dev MCP supports Liquid documentation and Theme Check validation | https://shopify.dev/changelog/dev-mcp-now-supports-liquid | Candidate check configuration/version [VERIFY] |

France price, product eligibility, translations, app output, theme/store ID, permissions, credentials, merchant owner, reviewer, release, and rollback remain `[VERIFY]`.
```

### `theme-check-dispositions.md`

```md
# Theme Check dispositions

| Finding | Investigate / minimal correction | Evidence and disposition |
| --- | --- | --- |
| `MissingTemplate` | Locate actual reference and route; remove/repair only the invalid reference | Record check version/file/line and rerun [VERIFY] |
| `ParserBlockingScript` | Identify dependency order and use an appropriate loading strategy only if behavior remains correct | Do not apply global defer/async or disable rule |
| `UnusedAssign` | Confirm every render/context before deleting a genuinely dead assignment | Review consumer/search evidence |
| `MissingAsset` | Restore the owned asset or correct the reference | Never create empty assets to silence the report |

A disabled check requires scope, rationale, owner, expiry, affected route, evidence, and re-evaluation trigger. No global suppression is part of this solution.
```

### `dawn-migration-plan.md`

```md
# Reference migration inventory

Before adaptation, inventory the reference markup, snippets/render inputs, assets, CSS classes/tokens, JavaScript modules/events, schema/settings, translation keys, accessibility behavior, editor behavior, test routes, licenses/attribution, and external dependencies. For each item, classify reuse, adaptation, target-theme equivalent, or rejection with owner/evidence.

A matching screenshot proves only a visual intent. It does not prove structural, asset, schema, script, performance, accessibility, or editor compatibility. Implement the target theme’s explicit component contract; do not copy an upstream class graph.
```

### `review-record.md`

```md
# Candidate review record

| Category | Review evidence / owner |
| --- | --- |
| Platform/current source | Docs and current check output cited; unresolved platform claim [VERIFY] |
| Architecture/editor | Explicit snippet input, stable schema ID, target file/asset ownership |
| Merchant configuration | Existing instances/settings assessed by authorised owner [VERIFY] |
| Buyer experience | Semantic output, copy meaning, no-JS/route/a11y/localization checks [VERIFY] |
| Security/privacy | No credentials, customer data, internal URLs, or sensitive policy in prompt/diff/logs |
| Performance | Asset/loading and route impact reviewed [VERIFY] |
| Tests | Approved local results plus candidate route/fixture matrix [VERIFY] |
| Candidate/rollback | Branch/theme/store ID, prior state, approver, operator, rollback target [VERIFY] |
| Protected operation | Release owner explicitly confirms target and execution; agent does not perform it [VERIFY] |
```

## What people get wrong here

**Using current docs as a substitute for review.** MCP improves platform context, but it cannot see merchant intent or certify a configured store.

**Letting a linter write architecture.** Theme Check reports a signal; it does not decide whether an asset, script order, data contract, or exception is correct.

**Adding `{% doc %}` after the fact.** Documentation must agree with actual explicit inputs. A comment hiding global context is an agent trap.

**Calling a generated diff “tested.”** A local check is evidence about a local contract. Candidate routes, settings, markets, apps, buyers, and approval are separate evidence layers.

**Equating prepare with execute.** An agent can draft commands and release records; protected store/publish/financial/customer actions remain human-authorised operations.


## Evidence and escalation discipline

A useful agent transcript is not the deliverable; a compact provenance record is. Preserve the task-envelope revision, local commit/diff, files read, documentation references, check command/version, output, fixtures named, assumptions rejected, and unresolved `[VERIFY]` items. This makes a review independent of the particular model or chat history. If an agent cannot obtain a current reference, cannot parse a check finding, sees ambiguous editor/configuration state, needs a secret, or proposes a protected operation, its correct behavior is to stop and escalate with the smallest concrete question.

| Agent situation | Required response | Never do |
| --- | --- | --- |
| Documentation conflicts or is unavailable | Cite both/record gap; request owner decision or later verification | Invent a platform fact from a similar API |
| Linter fix changes script/asset behavior | Explain dependency and route impact; require candidate test | Disable the check or mass-edit attributes to get green |
| Existing merchant configuration is unknown | Preserve state and request authorised inventory | Rename/remove persisted setting IDs as cleanup |
| Prompt contains secret/customer/production request | Redact and route to approved secret/protected-operation process | Copy sensitive data into files, comments, or model context |
| Candidate operation is ready | Produce target/rollback/approval checklist | Publish, delete, force-push, pay, or modify buyers autonomously |

This escalation protocol is a feature, not an agent failure. It protects the storefront from fabricated certainty while letting the team receive useful analysis, code, and evidence quickly.
