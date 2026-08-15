<!-- STATUS: final -->
---
id: ch-00
title: "Front Matter & Course Setup"
part: 0
words: 2400
---

# Front Matter — Front Matter & Course Setup

This book teaches Shopify Liquid theme work to experienced frontend developers. It assumes that you can already reason about HTML semantics, CSS, browser behavior, JavaScript, HTTP, source control and a terminal. The value here is not repeating those foundations. It is learning the boundaries Shopify themes add: server-rendered Liquid context, template/section/editor architecture, commerce data, structured content, accessibility, markets, app/checkout/account edges, platform change and operational evidence.

Treat every code sample as a contract to inspect in its route and store context. The course uses `> [VERIFY]` whenever a fact depends on current Shopify documentation, a developer preview, a store configuration, an app/provider, an entitlement, data definition, market, account mode or release process. That marker is not unfinished teaching. It is a reminder that theme work fails when a tutorial substitutes for a live platform or merchant decision.

## F.1 How to Read This Book

The book is deliberately layered. A chapter starts with the problem and mental model, moves into runnable/current-theme-oriented code, names gotchas, then gives a lab or a bounded practice/solution workflow where appropriate. You should not merely collect snippets. Read for authority: which component owns data, form submission, editor settings, styles, enhancement, error handling and fallback; which platform surface supplies the behavior; and what happens when the expected input is absent.

### Three reading paths: linear, reference-only, migration-driven

**Linear path.** Read Parts 1 through 15 in order if you are moving from general frontend work into theme specialization. The sequence establishes Liquid, data/context, templates, sections/blocks, editor architecture, commerce surfaces, performance/accessibility, operational delivery and professional practice. Complete exercises with real starter files before opening solution mirrors. This path is best when you need a coherent mental model rather than an answer to a single source problem.

**Reference-only path.** Use the table of contents, glossary, appendices and chapter checklists when you already work in themes and need a current pattern or a precise boundary. Begin with the route/component/data question, locate its chapter, read the surrounding gotchas and verification notes, then confirm platform/store details from the linked sources. A reference chapter is not permission to bypass prerequisites: a cart drawer pattern still depends on product/cart, accessibility, event and release boundaries.

**Migration-driven path.** Start from an inherited theme or an active platform risk. Inventory the candidate source and deployed/configured state `[VERIFY]`; identify deprecated, unsupported, implicit or unowned surfaces; then read only the chapters that supply the replacement architecture. Keep a migration record with source/date, active-use evidence, owner, buyer/editor task, replacement decision, fixture, release plan and rollback artifact. Do not modernize every file because it looks old. Migrate a bounded contract, preserve behavior evidence, and reassess the next risk.

| Path | Start here | Primary output | Common trap |
| --- | --- | --- | --- |
| Linear | Part 1 and each chapter in order | Durable cross-layer mental model | Skipping labs and assuming code familiarity is architecture mastery |
| Reference-only | Glossary/appendix/index, then source chapter | Bounded implementation or review answer | Copying an isolated recipe without its data/failure contract |
| Migration-driven | Inventory plus deprecation/architecture chapters | Evidence-backed replacement plan | Treating a source search as proof of deployed behavior |

### Chapter anatomy: concept → mental model → code → gotchas → lab

A **concept** names the Shopify-specific problem: for example, a JSON template, a section setting, variant selection, dynamic source, Section Rendering response, or platform deprecation. The **mental model** locates its authority and failure boundary. **Code** demonstrates a narrow pattern with a real path and explicit inputs. **Gotchas** describe near-misses that compile or look correct but fail in editor, route, data, accessibility, market or operational conditions. The **lab** asks you to apply the lesson against an intentionally bounded starter; a solution, when present, belongs only in the `solutions/` mirror.

Code follows these conventions:

| Convention | Meaning |
| --- | --- |
| `sections/example.liquid` | Relative theme file path above/near a code sample |
| `{% render 'name', value: value %}` | Named-input snippet call; `include` is deprecated |
| `<!-- STATUS: draft/final -->` | Course authoring state, not Shopify theme code |
| `> [VERIFY]` | A current platform/store/configuration fact needing external confirmation |
| `candidate` | Deliberately non-production code/process that must not claim a live outcome |
| `starter/` | Real files for a learner to change during an exercise |
| `solutions/` | Worked-answer mirror; never copy into course material |
| `records/` | Evidence/contract matrices used to expose assumptions and ownership |

Use fenced language identifiers (`liquid`, `json`, `js`, `css`, `bash`) and preserve file paths when trying examples. Do not paste a theme snippet into checkout/account/app code because it is syntactically similar. File path, route context and platform boundary are part of the example.

## F.2 What This Course Assumes You Already Know

You should be comfortable with **semantic HTML**: headings, landmarks, forms, labels, controls, lists, tables and text alternatives. The course expects you to recognize why a button is not a link, why keyboard/focus behavior matters, and why an accessible fallback is a product requirement. It teaches Shopify-specific contexts and verification, not the basics of document semantics.

You should know **modern CSS**: cascade, specificity, layout, responsive sizing, custom properties, media queries, focus styles and debugging. The book addresses theme CSS ownership, asset boundaries and editor/route interactions; it does not reteach flexbox, grid or CSS selectors.

You should know **ES2020+ and DOM APIs**: modules, events, async/await, `fetch`, DOM selection, form behavior, URL/query APIs, parsing/replacing DOM responsibly and error handling. The course uses these skills to explain progressive enhancement, component lifecycle, Section Rendering, focus and local error boundaries. It does not teach JavaScript syntax, promises or the DOM from first principles.

You should know **HTTP basics**: URL paths/query parameters, request/response, status codes, cookies/session concepts, caching as a concept and browser/server distinction. You need this to reason about server-rendered routes, full-page fallback, Ajax requests and why an HTTP 200 can still contain an invalid/null rendered section.

Finally, you should use **Git, npm, terminal and JSON** comfortably. You will read diffs, create branches in your own projects, inspect JSON templates/schema, install or run approved tooling, search source, retain candidate revisions and use reproducible commands. The course does not teach Git commits, package management, shell navigation, JSON syntax, loops as a programming concept, CSS layout, JavaScript fundamentals or “what is an API.” Learn those separately before using a theme migration or production task as your classroom.

## F.3 What This Course Deliberately Excludes

This is a theme/Liquid course. It references [Hydrogen](https://hydrogen.shopify.dev/) and React storefronts only to help you distinguish architecture. It does not teach React/Hydrogen storefront implementation, Storefront API application architecture, deployment, caching or component ecosystems. A headless project creates different editorial, operations and performance responsibilities; do not assume a Liquid pattern transfers unchanged.

It also does not teach app development in Remix. Apps and extensions appear only at the theme boundary: app blocks, provider/extension ownership, checkout extensibility, Functions-based replacement direction, permissions, data/privacy/consent and integration failure modes `[VERIFY]`. Building app backends, OAuth, billing, webhooks, database schemas, tenancy, security architecture and app support are separate disciplines.

The course does not operate a Shopify admin or perform merchandising for a merchant. It does not create products, collections, discounts, customers, markets, data definitions, translations, account modes, apps, analytics, taxes, shipping rules or store settings. It teaches how a theme should expose explicit configuration/data boundaries and how to document decisions; it never treats a theme as authority for commercial, legal or operational facts.

## F.4 Environment Setup Checklist

Set up a safe, disposable development context before changing a real merchant theme. Account/store access, roles, partner eligibility, development-store availability, preview workflow, authentication and data policies are external facts `[VERIFY]`. Do not test with customer data, payment data, private tokens or a production theme unless the project’s authorised workflow explicitly permits it.

| Setup item | What good looks like | Verification boundary |
| --- | --- | --- |
| Partner/development context | Authorised account/store and documented owner | Eligibility/access/roles `[VERIFY]` |
| Preview data | Non-sensitive products, collections, media, content and route fixtures | Store data/market visibility `[VERIFY]` |
| Shopify CLI/tooling | Current supported major/configuration for the project | Install/auth commands and version `[VERIFY]` |
| Node baseline | Project-approved runtime/package manager | Exact version/toolchain `[VERIFY]` |
| Authentication | Approved least-privilege flow; no secrets in source | Organisation/security workflow `[VERIFY]` |
| Editor setup | Liquid language support, Theme Check, syntax highlighting and formatting | Extension/version/team conventions `[VERIFY]` |
| Reference themes | Pinned Dawn/Horizon revision for study | Repository license/version and target compatibility `[VERIFY]` |

Clone a reference theme for side-by-side study rather than copying files into a merchant theme. Trace template → section → snippet → asset → data contract. Compare the reference revision to your candidate architecture. Dawn is a useful current reference; Horizon availability/role/version must be verified before relying on it `[VERIFY]`. Use source search and diffs to learn why a component exists, then write your own explicit contract and fixture.

Set a small editor/tooling baseline: format consistently, keep a Liquid-aware syntax/highlighting environment, run approved static checking, view route output in a browser, inspect focus/network/DOM behavior, and record the candidate revision for each meaningful test. Tool success is evidence about its defined scope, not a production release decision.

## F.5 Version Note & How to Keep This Book Current

The stable baseline is current Shopify Liquid/theme architecture as documented in the linked official sources. The course does not represent developer previews as stable. The project ledger lists `{% block %}` and `{% partial %}` as a **Liquid July ’26 developer preview**, introduced 2026-07-21 and usable only when that feature preview is selected.[1] Do not build required storefront behavior on a preview without verifying availability, exit path, owner and project approval.

Read the developer changelog as a discipline. Each relevant entry becomes an impact question: what changed, when, which code/configuration/data surface is affected, who owns it, what fixture tests it, whether to adopt/defer/ignore, and what event triggers review. The deprecation map at the time of writing records `{% include %}` as deprecated; in-checkout `checkout.liquid` as unsupported from 2024-08-13; Thank You/Order Status `checkout.liquid` plus additional scripts as sunset 2025-08-28; non-Plus ScriptTags on those pages as sunset 2026-08-26; and Shopify Scripts as deprecated with published scripts no longer executing from 2026-06-30.[2]

Those dates are not a migration plan. For every actual project, reconfirm the current source and deployed/configured use, map the published replacement to the buyer/merchant/operations task, preserve accessibility/consent/data boundaries, define acceptance evidence and release reversibly. Maintain a small dependency/risk register rather than trying to read every announcement.

### Before you begin: establish a working agreement

A strong setup includes a working agreement, even when you are the only developer. State which repository/theme/version is in scope, where candidate work may run, who approves content/configuration changes, which accounts or data are off-limits, how evidence is retained, and how a release can be reversed. This is not bureaucracy added after code exists. It prevents a harmless local experiment from becoming an untraceable production change.

For an inherited theme, add a short discovery pass before implementation: list route/template architecture, active sections, snippets with implicit context, asset entry points, structured-data references, apps/extensions at the boundary `[VERIFY]`, deprecations, key buyer tasks and known editor pain. Do not rewrite the inventory into a solution proposal. Its function is to decide what must be verified and what can be safely changed first.

| Preparation question | Useful evidence |
| --- | --- |
| What exactly is the candidate? | Repository commit/theme archive, target branch and owner |
| What data may be used? | Sanitised fixture policy and source owner `[VERIFY]` |
| Which paths are forbidden? | Checkout/account/admin/app/security boundaries and escalation contact |
| How is quality observed? | Route-state matrix, static checks, browser/manual review and raw output location |
| What is the recovery plan? | Previous artifact, cart/page fallback or verified release/rollback process |

This agreement makes later chapters faster: when a pattern says `[VERIFY]`, you know where verification belongs and who can provide it. When a result is uncertain, you can record the boundary instead of guessing or blocking a learning task.

## Setup checklist

| Before beginning a chapter or real theme task | Confirm |
| --- | --- |
| Reading mode | Linear learning, reference lookup or evidence-backed migration |
| Current source | Official docs/changelog/deprecation ledger and date |
| Candidate context | Theme version, route, store/data/market/account assumptions `[VERIFY]` |
| Scope boundary | Theme versus app, checkout, account, admin or operational responsibility |
| Test fixture | Normal, blank, error, accessibility and relevant locale/market state |
| Recovery | Owner, evidence record, rollback or route fallback |

## References

[1]: ../../../docs/DEPRECATIONS.md "Liquid July ’26 developer preview ledger"
[2]: ../../../docs/DEPRECATIONS.md "Verified deprecation ledger"
