<!-- STATUS: final -->
# Chapter 55 — AI-Assisted Theme Development

AI can accelerate theme work by proposing a section, tracing repeated markup, searching documentation, generating migration scaffolds, or interpreting a linter report. It cannot own a storefront. A theme is coupled to merchant configuration, catalog data, localization, customer state, app behavior, release authority, and buyer trust. The productive model is not “ask an agent to build a theme”; it is **give an agent current context, a constrained task, an observable validation loop, and a human owner for every contextual decision.**

## 55.1 The Shopify Dev MCP server: current docs and schemas instead of stale model memory

A model’s general Liquid memory is an unreliable source of platform truth. Shopify’s AI Toolkit gives AI coding tools access to developer documentation, API schemas, code validation, and supported CLI store-management tasks through authenticated context under user control.[1] The local Dev MCP server can connect an agent to Shopify developer resources without authentication; the current toolkit documentation shows it running through `npx -y @shopify/dev-mcp@latest`.[1]

The value is not that an agent becomes infallible. The value is a better evidence path. Before generating code involving a Liquid object, filter, schema feature, extension surface, CLI option, or API field, ask the agent to retrieve the relevant current reference, state the source/context, and distinguish documented fact from store-specific unknown. Shopify added Liquid support to Dev MCP so an assistant can search the complete Liquid API reference and use built-in Theme Check integration to identify syntax and best-practice issues before deployment.[2]

| Question | Weak agent behavior | Better MCP-assisted behavior | Remaining owner |
| --- | --- | --- | --- |
| Which Liquid object/filter exists? | Invents a plausible name from training data | Retrieves current Liquid documentation and names context availability | Developer validates use in the target render context |
| Which schema shape is allowed? | Copies an old or unrelated example | Queries current schema/docs and validates generated code | Theme author tests editor behavior and migration |
| Which CLI command should run? | Suggests a broad production operation | Looks up current command/flags and proposes a dry, named target workflow | Release owner approves execution/target |
| Which API field is available? | Guesses field/type/version | Queries schema/reference before generation | App/store owner validates permissions and semantics |
| What should be changed in a live store? | Treats code as commercial authority | Marks data/policy/approval facts `[VERIFY]` | Merchant/release/configuration owner decides |

Keep a research record in the pull request or task: source URL/tool query, date/version where relevant, returned contract, generated change, tests run, unresolved verification flags, and responsible approver. This lets a reviewer evaluate whether an agent used current information rather than accepting polished prose as evidence.

The Dev MCP server is not a credential bypass. Its locally available docs/search/validation context does not grant authority to edit a store. Store management remains a supported CLI action in authenticated store context, with the user choosing when it executes.[1] Do not place a store password, Theme Access secret, API token, customer data, or production configuration in an agent prompt merely to improve an answer. Use approved secret mechanisms and minimise the data an agent needs.

> [VERIFY] Confirm the current AI tool, Dev MCP/toolkit version, enabled capabilities, data-retention policy, store permissions, and organisation-approved agent configuration before connecting it to a client project.

## 55.2 Agent workflows: generating sections, migrating Dawn markup, running Theme Check fix loops

Agent workflows work best as small, inspectable loops. An agent should receive a precise task contract, relevant current documents, the target files, constraints, expected output, and allowed validation commands. It should write to a candidate branch/theme directory, run checks, summarize changes and residual failures, then stop for review. A large prompt asking for “a complete modern Shopify theme” creates too much surface area to validate and encourages fabricated assumptions.

**Generating a section.** Give the agent a numbered brief: section purpose, consumer route, schema settings, merchant editor behavior, known objects, accessibility behavior, CSS/JavaScript boundaries, no-JavaScript baseline, asset owner, translation keys, edge fixtures, and done criteria. Ask it to cite the current schema/object reference when it uses a feature not already established in the repository. Then review the full Liquid/schema pair, run Theme Check, preview a configured candidate route, and test the editor. The agent may generate markup; the theme owner decides whether the editor, output, and buyer experience are coherent.

**Migrating Dawn markup.** Dawn is a reference implementation, not a paste source or a compatibility contract for every theme. Decompose a migration into inventory, semantic comparison, target-theme boundary, and incremental adaptation. Identify which part is generic markup, which relies on Dawn snippets/assets/classes/settings, which belongs to a modern Shopify platform surface, and which conflicts with the target component contract. Ask the agent to produce a dependency inventory and a migration plan before it writes code. Preserve the target theme’s naming, editor settings, assets, and progressive behavior; do not import a large class graph simply because a screenshot resembles Dawn.

**Theme Check fix loop.** An agent can run a valuable loop: execute Theme Check; group findings by check; link each to documentation; propose the smallest source/configuration correction; rerun; and show the diff. The loop must distinguish a fix from a suppression. For an `UnusedAssign` warning, an agent may identify dead code or a narrow documented exception. For `ParserBlockingScript`, it must assess dependency order rather than automatically adding `defer`. For a `MissingAsset`, it must decide whether the reference or file is wrong. Require a disposition record for every disabled/ignored check and stop the agent from globally silencing rules to create green output.

| Workflow stage | Agent may do | Human/release owner must do |
| --- | --- | --- |
| Discover | Read scoped files, docs, schemas, check output, component contracts | Grant least necessary repository/store context |
| Propose | Draft code, migration plan, tests, documentation, clear diff summary | Check architecture, business intent, migration impact |
| Validate | Run approved static/build/unit-like commands; report failures | Interpret runtime/store/app/merchant results and authorise target operations |
| Preview | Prepare candidate files/route checklist | Inspect editor, visual/a11y behavior, data context, buyer claims |
| Release | Prepare release record/rollback checklist | Approve and perform protected deployment/promotion |

Use an agent as a reviewer too, but not as the only reviewer. It can compare a diff against a brief, search for duplicated patterns, list unsafe global assumptions, identify undeclared snippet inputs, or generate an edge-data test checklist. Ask it to return evidence and uncertainty, not only a verdict. “No issue found” is weak; “I checked these files and rules, could not verify this market/app condition, and recommend this route test” is actionable.

## 55.3 `{% doc %}` and schema clarity as machine-readable context

Good context is a theme’s most durable agent tool. `{% doc %}` blocks, explicit `{% render %}` arguments, stable filenames, schema labels, clear setting IDs, local CSS/JavaScript ownership, and component records reduce the need for an agent to infer invisible architecture. This is also good human engineering: a reviewer can understand a snippet contract without reconstructing every caller.

Use `{% doc %}` to state required parameters, types where supported by the convention, output contract, supported contexts, owner, non-goals, side effects, and migration/deprecation notices. Place it beside the snippet/block/section it documents. Keep it truthful: documentation that declares a `product` input while code reads a global `card_product` is worse than no documentation because an agent will trust the contract.

```liquid
{% doc %}
  Renders an active product price.

  @param {product} product - Required product-like input.
  @param {boolean} show_compare_at - Optional display policy.

  Does not determine availability, currency conversion, or purchase eligibility.
  Owner: product-surface team [VERIFY].
{% enddoc %}
{% render 'product-price', product: product, show_compare_at: true %}
```

Schema clarity is likewise operational context. A good setting ID is stable and scoped; a label explains merchant effect; help text names limitations; defaults are safe; a dynamic source is deliberately supported; and migrations have an owner. An agent that sees `show_compare_at_price` with a documented purpose can preserve behavior. An agent that sees `flag`, `theme_option`, and a vague label is forced to guess, which can corrupt persisted editor state.

Machine-readable does not mean agent-only. Prefer a small manifest/table for components, assets, external scripts, translation keys, test fixtures, and release routes where the repository has repeated surfaces. Record owner, inputs, output/boundary, consumers, test route, and retirement trigger. Keep secrets, buyer data, and transient store IDs outside tracked context unless approved by the project’s security policy.

## 55.4 Guardrails: what you must review before it ships

Every agent change requires the same review categories as a human change, plus a check for hidden assumptions introduced by incomplete context. Review the diff, not just the final rendering. Ask what files changed, what contracts moved, what source was used, which tests ran, and which facts remain unresolved.

| Review area | Questions before shipping |
| --- | --- |
| Platform correctness | Did the agent use current documented tags, filters, objects, schema/CLI behavior? Are unknowns explicitly flagged? |
| Architecture | Does the change preserve snippet inputs, section/block/editor boundaries, asset ownership, naming, and migration plans? |
| Merchant configuration | Does it preserve active settings/templates and avoid treating configuration as code to overwrite? |
| Buyer experience | Are semantic HTML, labels, errors, focus, no-JavaScript baseline, localization, price, availability, and empty states still coherent? |
| Security/privacy | Did prompts, logs, generated files, or comments expose credentials, personal data, internal URLs, or sensitive policies? |
| Performance | Did it add assets, remote scripts, broad loops, DOM, or parser-blocking work? Are budgets/owners updated? |
| Tests/release | Did it run approved checks against deployable output and named fixtures? Is there candidate/rollback/approval evidence? |

Do not let an agent execute irreversible or sensitive actions based on an ambiguous request. Store connection, publish, payment, customer-data changes, destructive deletion, force push, and external publication require explicit human confirmation in the project’s approved workflow. An agent may prepare commands and explain target effects; the release owner verifies the exact store/theme/branch, permissions, candidate, and rollback before action.

Guardrails also protect against intellectual and editorial drift. Review copied code licenses/attribution where applicable, accessibility claims, legal/shipping/price wording, translations, and app integration terms. An agent can generate plausible policy language that has no merchant authorization. Treat buyer claims as content governed by a real owner, not as implementation filler.

## 55.5 Why Shopify's newer Liquid features are being designed for agent readability

Agent readability is not a separate programming language. It is the same movement toward explicit, local, composable contracts that benefits human maintainers: structured documentation, clear input boundaries, current schema validation, predictable file ownership, and machine-checkable relationships. Shopify’s Dev MCP Liquid support can search current Liquid objects, tags, and filters and run Theme Check validation, making explicit code/documentation more useful to an assistant.[2]

Recent theme architecture patterns reinforce this direction. Theme blocks give a file/schema-backed unit a clear type and editor contract. `{% content_for %}` makes block rendering/placement more declarative. `{% doc %}` lets a snippet or block record parameter intent near implementation. Theme Check can validate many schema, argument, asset, object, and structural relationships. These features reduce the amount of implicit repository lore an agent—or a new developer—must reconstruct.

That does not make a complex theme automatically safe for automation. Agent-readable code still needs controlled data, owner decisions, and runtime testing. A schema can reveal an input setting but cannot decide a merchant’s campaign; a component doc can identify an explicit product parameter but cannot tell whether a catalog is eligible in France; a linter can identify a deprecated tag but cannot perform a business-safe migration. The design goal is a more inspectable boundary between facts a tool can verify and decisions a human/context owner must make.

Use newer features where they improve the real component contract, not as decorative metadata for an agent. A well-scoped `doc` block, meaningful setting name, explicit render call, and short decision record provide high-value context. A giant generated architecture file that duplicates stale assumptions only gives an agent more confident misinformation. Keep context close to source, versioned, reviewed, and tied to validation routes.

The result is a disciplined partnership. The agent retrieves current information, drafts bounded changes, and accelerates repetitive analysis. Theme code exposes contracts clearly enough to inspect and validate. Humans retain authority over merchant data, buyer claims, protected operations, and releases. That partnership makes AI assistance faster precisely because it refuses to let fluent generated output substitute for evidence.

## References

[1]: https://shopify.dev/docs/apps/build/ai-toolkit "Shopify — AI Toolkit"
[2]: https://shopify.dev/changelog/dev-mcp-now-supports-liquid "Shopify — Dev MCP now supports Liquid"
[3]: https://shopify.dev/docs/api/liquid "Shopify — Liquid reference"


## Designing agent tasks for reviewability

The quality of an agent result is constrained by the quality of its task envelope. A reviewable envelope states the repository/output directory, exact files in scope, authoritative references, non-goals, permitted commands, test fixtures, expected change summary, and stop condition. It explicitly says what the agent must not infer: store IDs, real product data, customer state, brand policy, permissions, release approval, or payment behavior. This converts a vague request into a bounded engineering change.

| Autonomy level | Suitable work | Required review boundary |
| --- | --- | --- |
| Read and explain | Documentation lookup, code inventory, contract extraction, check-report grouping | Verify sources, omissions, and context relevance |
| Draft | Section/snippet/schema proposal, migration checklist, test matrix, documentation | Review full diff, compatibility, and current platform reference |
| Validate | Run approved lint/build/test commands and summarize artifacts | Confirm command target, fixture identity, and result interpretation |
| Prepare operation | Generate a candidate release checklist or command with explicit target placeholders | Release owner confirms identity, approval, rollback, and execution |
| Execute protected operation | Only under separately approved, auditable workflow | Human confirmation for sensitive, irreversible, financial, customer, or public effects |

Separate **context acquisition** from **change authority**. An agent may search Shopify documentation through Dev MCP, inspect a local theme, and compare a candidate diff. That does not make it entitled to trust comments as fact, reveal secrets to a remote service, or act on a production store. Feed it the smallest necessary sanitized context, then ask it to cite the files/documents it used. When an agent needs more information, prefer a structured `[VERIFY]` question in the change record over a guessed implementation.

Evaluate an agent proposal against a counterfactual: could another developer reproduce the decision without the agent conversation? If not, capture the relevant source link, contract, fixture, and rationale in the repository or pull request. A good agent workflow leaves the codebase easier to understand after it runs. It should not create a dependency on re-prompting the same model to explain an opaque generated subsystem.

Finally, measure agent effectiveness by defect reduction and review speed—not raw lines produced. Useful signals include fewer Theme Check regressions, smaller focused diffs, faster documentation discovery, clearer `[VERIFY]` boundaries, stable fixture coverage, and fewer production reversions. “The agent generated the entire feature in one turn” is not a quality metric if the resulting change expands the reviewer’s uncertainty. The right outcome is a more inspectable theme and a release owner with more evidence, not less responsibility.
