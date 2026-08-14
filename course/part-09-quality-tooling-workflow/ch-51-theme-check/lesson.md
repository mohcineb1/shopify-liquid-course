<!-- STATUS: final -->
# Chapter 51 — Theme Check

Theme Check is not a storefront test runner. It is a static analyser for the Liquid and JSON in a theme (and theme app extensions) that identifies errors and enforces theme/Liquid best practices.[1] That boundary makes it valuable: it can inspect every relevant source file consistently before a reviewer opens a browser. It cannot prove that a buyer sees the correct market catalogue, that an app is configured, that checkout works, or that an image is visually appropriate. A good quality workflow treats its findings as precise code evidence and pairs them with route-level, configuration, accessibility, and merchant acceptance evidence.

## 51.1 Running Theme Check locally and in the editor

Run the checker where its result can change work: while editing, before a commit, and in the merge pipeline. The Shopify CLI command provides on-demand execution; Shopify’s Liquid Visual Studio Code extension includes Theme Check in the editor.[1] These are complementary feedback surfaces, not competing linters.

```sh
shopify theme check
shopify theme check --init
```

The first command analyses the theme directory. The second creates a starting `.theme-check.yml` configuration file.[2] Begin from the generated or recommended configuration, then make every deviation deliberate and reviewable. Do not copy a project-wide ignore file simply to make a noisy repository green.

| Surface | Best question | Useful response time | Cannot establish |
| --- | --- | --- | --- |
| Editor diagnostic | Is this Liquid/JSON construct locally suspect while I write it? | Seconds | A full repository gate or generated-output correctness |
| Local CLI run | Does the actual theme output pass the repository policy? | Before commit/review | Remote store/app/data behavior |
| CI run | Does the proposed merge meet the agreed static quality threshold? | Pull request / merge | Visual, interactive, commercial, or permission approval |

Run against the directory Shopify will consume. If source modules build into `dist/`, the checker must analyse `dist/`, not an unrelated `src/` tree. Otherwise the editor can report excellent source code while the release contains stale or malformed generated Liquid. Make build output, check root, package root, and CLI theme root an explicit contract; chapter 45’s source-versus-output boundary applies here too.

The editor is excellent for early diagnosis, but never assume all developer machines run the identical version or configuration. CI is the shared adjudicator. Capture the command, Theme Check/CLI version, configuration path, and generated-output state in a reproducible failure report. “Works in my editor” is not a merge result.

> [VERIFY] Confirm the currently installed Shopify CLI/Theme Check version and the exact editor extension integration in the project before standardising a team command or CI image.

## 51.2 The full check catalogue: correctness, performance, deprecation, accessibility

The official catalogue is a set of named checks with documented purpose and default severity, not one undifferentiated “lint score”.[3] Read a failure by its check name, source span, and the rule documentation it links to. Then decide whether the code is wrong, the rule needs a bounded exception, or the project policy needs a reviewed change.

**Correctness and structure.** `LiquidHTMLSyntaxError`, `JSONSyntaxError`, `ValidSchema`, `UndefinedObject`, `UnknownFilter`, `MissingAsset`, `MissingTemplate`, `TranslationKeyExists`, and `RequiredLayoutThemeObject` protect basic contracts. A missing asset reference may render a broken production page; an undefined object can fail silently in storefront Liquid; a missing `content_for_header` or `content_for_layout` removes required layout output. Treat these as evidence-led defects, not cosmetic style preferences.[3]

**Composition and schema contracts.** Modern theme work has checks for `content_for` arguments, static block IDs/types, local blocks, schemas, preset block order, LiquidDoc parameters, and required snippet arguments.[3] These checks are particularly useful because a section may render in one preview while carrying an editor, reuse, or migration defect that appears later. They do not replace testing a merchant’s real section instances, but they make the contract visible before that test.

**Performance and delivery.** `PaginationSize`, `ParserBlockingScript`, `AssetSizeCSS`, `AssetSizeJavaScript`, `RemoteAsset`, `AssetPreload`, `CdnPreconnect`, and `ImgWidthAndHeight` reflect common delivery risks.[3] A warning is not permission to ignore the cost. Ask which route loads the resource, who owns it, which field evidence supports it, and whether the proposed fix merely moves the cost. This continues chapter 47’s performance-owner model: a static rule identifies a source pattern; RUM and controlled profiling establish actual user impact.

**Deprecation and platform evolution.** `DeprecatedTag`, `DeprecatedFilter`, the font deprecation checks, and background/lazy-load deprecation checks warn when source keeps an obsolete pattern alive.[3] The remedy is not mechanically replacing every match. Read the documented replacement, inspect the render/output contract, and test the affected route. Theme Check has found a stale API shape; it has not migrated business behavior for you. Cross-check platform-life-cycle facts against `docs/DEPRECATIONS.md`, the course’s current ledger, rather than writing dates from memory.

**Accessibility-adjacent HTML quality.** `ImgWidthAndHeight` and `UnclosedHTMLElement` identify structural risks that can contribute to poor layout stability or broken document structure.[3] They are not a full accessibility audit. A checker cannot establish a useful alt decision, visible focus, keyboard order, contrast under merchant-selected colours, screen-reader announcement behavior, or whether a labelled control has the right business consequence. Use these checks as a floor, then test the rendered product, cart, form, and editor routes with the appropriate manual/accessibility process.

The important classification is **signal, not verdict**. A `ParserBlockingScript` failure is an invitation to assess script ownership and loading behavior, not evidence that blindly adding `defer` preserves initialization order. An `UnusedAssign` warning might reveal dead complexity—or a generated/template convention that deserves a narrow documented exception. Start from the check’s purpose, then preserve the storefront contract.

## 51.3 `.theme-check.yml` configuration and severity tuning

Place `.theme-check.yml` at the theme root to override defaults. It can set a `root`, extend named or local configurations, require custom/third-party check packages, ignore paths, and configure individual checks.[2]

```yaml
root: dist
extends:
  - theme-check:recommended
ignore:
  - 'node_modules/**'
  - 'snippets/*-generated-icon.liquid'

ParserBlockingScript:
  severity: error

TemplateLength:
  enabled: true
  severity: warning
  max_length: 300
```

The sample says three things. First, `root: dist` connects static analysis to deployable output. Second, `extends: theme-check:recommended` names the shared baseline instead of relying on invisible defaults. Third, an exception is narrow and legible: the ignored generated icon pattern is not a blanket exemption for all snippets.

Theme Check accepts `error`, `warning`, and `info` severity strings (equivalent to integer levels 0, 1, and 2); the string form is preferred for readability.[2] Default execution fails with exit code 1 for one or more errors, and CI can select the failure threshold with `--fail-level`.[2] Severity is policy, not a way to disguise debt. Promote a check when the team has a safe, repeatable remediation path and its failures create meaningful regressions. Keep exploratory or migration signals at warning/info with an owner, due date, and trend review. Do not downgrade a correctness error to make one pull request merge.

Configuration composition matters. Multiple `extends` deep-merge objects, concatenate arrays, and allow later entries to take precedence.[2] Review that order like application configuration: a later override can silently weaken an earlier baseline. Likewise, `ignore` excludes files from analysis, so every ignore should name why it is generated, external, obsolete, or otherwise outside the theme contract, and who will remove it.

Inline disabling is a last-resort local exception. Theme Check supports Liquid comments to disable all or named checks for a next line, section, or entire file.[2] Keep the smallest scope and write the explanation beside it:

```liquid
{% # theme-check-disable-next-line UnusedAssign %}
{% assign app_bridge_marker = section.id %}
```

A suppression without a reason transfers comprehension cost to the next maintainer. A file-wide disable is a policy decision requiring review, not a convenient reaction to a noisy file.

## 51.4 Writing a custom check for team conventions

Use a custom check when the convention is stable, machine-observable, repeated enough to justify maintenance, and more precise than a review comment. Shopify’s current documentation describes custom checks in TypeScript, referenced from configuration through `require`; the custom check must also be enabled by name in `.theme-check.yml`.[1][2]

A good candidate is a locally enforceable theme convention: require an explicit `data-section-id` on interactive section roots; forbid a deprecated internal snippet alias; require every third-party script to reference an approved inventory marker; or reject a known legacy CSS class. A poor candidate is “the component looks premium”, “the shipping promise is legally correct”, or “the campaign feels right”. Those require human/business evidence, not static syntax traversal.

Design a custom rule as a product. Write the convention in prose first; list positive and negative fixtures; choose an identifier and diagnostic message that tells a developer what to change; version it with the repository; and test false positives as carefully as failures. Start it at `info` or `warning` while collecting real findings. Promote it to an error only when the team agrees that every applicable failure must block integration and the remediation is safe.

```yaml
require:
  - ./tools/theme-check/team-checks.js

ApprovedScriptInventory:
  enabled: true
  severity: warning
```

Avoid writing a “team style checker” that overlaps broad formatting or invents a parallel source of Shopify API truth. The official catalogue evolves; custom rules should express the team’s additional contract, not fossilize obsolete platform behavior. Review a custom check whenever its protected architecture changes.

## 51.5 Theme Check as a merge gate

A merge gate is an agreed decision rule, not merely a red CI badge. A practical baseline runs the build, checks the generated theme output, preserves the raw report as an artifact, and fails on `error`. It then directs warnings to a triage path with owner and due date. Candidate release checks can add package validation, route smoke evidence, accessibility testing, and configuration/merchant approval; Theme Check remains one layer.

| Stage | Required evidence | Gate outcome |
| --- | --- | --- |
| Local development | Editor/CLI findings addressed or narrowly documented | Author can request review |
| Pull request | Reproducible build plus Theme Check report on theme output | Errors block merge; warnings are triaged |
| Candidate theme | Static pass plus named preview routes and relevant data context | Candidate can receive merchant/QA approval |
| Production promotion | Approved candidate, target record, rollback, route verification | Release owner may promote; a static pass alone is insufficient |

Do not make the gate brittle by checking a dirty generated tree or depending on a developer’s global config. Pin/record tooling according to the team’s build policy, run from a clean checkout, and test the gate itself using a deliberately failing fixture. Output in machine-readable form may help automation, but logs must remain readable enough for a reviewer to identify the file, check, severity, cause, and accepted exception.

The healthy outcome is not zero findings at any cost. It is a repository where every error blocks for a known reason, every warning has a deliberate disposition, every suppression is scoped and explained, and no team member mistakes a static pass for storefront acceptance. Theme Check makes structural quality repeatable; responsible theme delivery supplies the remaining evidence.

## References

[1]: https://shopify.dev/docs/storefronts/themes/tools/theme-check/index "Shopify — Theme Check"
[2]: https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration "Shopify — Theme Check configuration"
[3]: https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks "Shopify — Theme Check checks reference"


## Reading and triaging a finding

A useful finding workflow is deliberately slower than “fix whatever appears first.” Capture the check identifier, severity, file/line, configuration lineage, generated-source status, and a minimal route or schema context. Reproduce locally with the same build output. Read the check documentation before editing, because similar-looking messages can protect different contracts: `MissingAsset` asks whether a named delivered file exists; `RemoteAsset` asks whether an ownership/delivery choice relies on an external domain; `AssetPreload` asks whether preloading is expressed through the expected Liquid mechanism. Replacing all three with a generic asset helper could conceal the reason each rule existed.

| Disposition | When it is appropriate | Required record |
| --- | --- | --- |
| Fix now | The source violates a stable contract and remediation preserves intent | Commit/test evidence and changed route or fixture |
| Configure | The project has a deliberate, broadly applicable policy differing from default | Reviewed YAML change, policy owner, expected affected files |
| Suppress locally | A specific construct is a documented exception | Smallest comment scope, check name, reason, removal trigger |
| Defer | Risk is understood but requires a planned migration or data decision | Owner, due date, tracking issue, severity rationale |
| Escalate | The finding reveals store configuration, app, legal, design, or platform ambiguity | [VERIFY] evidence request and no speculative Liquid workaround |

This table protects the team from two opposite failures. The first is treating every warning as trivial and allowing an ever-growing debt ledger. The second is enforcing a mechanical patch that breaks a merchant-facing contract. For example, `ImgWidthAndHeight` can reveal image markup that needs intrinsic dimensions, but an unfamiliar responsive component may have a deliberate generated-image path. Confirm the selected media contract and rendered geometry before introducing copied width/height values. Static analysis narrows the question; it does not excuse unreviewed changes.

Suppression comments should age visibly. Include a tracker or a condition such as “remove after legacy app embed removal,” not “legacy”. During a quarterly quality review, search for `theme-check-disable`, group them by check, and ask whether the original constraint still exists. A temporary exception that becomes invisible is a hidden baseline change. Prefer removing the obsolete code or refining the custom/generated-file configuration when the exception is systemic.

## What a static pass cannot certify

Theme Check sees source representation. It does not execute a buyer journey, submit a form, await a network response, authenticate a customer, calculate a market price, load an external app, or inspect the final visual hierarchy. This has two important consequences. First, passing checks is necessary code evidence but never a release claim. Second, an empty report does not prove that the checker saw every runtime artifact: generated files, ignored paths, alternate builds, and remote editor changes must be part of the target record introduced in chapter 50.

Pair the merge gate with a compact evidence matrix. For every changed component, identify the code check, source build check, representative route, accessibility/manual interaction, applicable store configuration, and merchant/product owner. The matrix avoids both redundant testing and false certainty. A translation-key check may prove a default catalogue entry exists, while a French market route demonstrates the selected locale and configured content. A schema check may prove syntax, while the editor test proves merchant usability. No single row replaces another.

> [VERIFY] Agree with the project’s release owner which Theme Check warnings may remain open for a candidate and which must be resolved before a production promotion; this threshold is governance specific to the team and store, not a universal Liquid fact.
