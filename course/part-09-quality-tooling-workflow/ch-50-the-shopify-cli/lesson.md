<!-- STATUS: final -->
# Chapter 50 — The Shopify CLI

A theme repository is source code; a Shopify theme is a remotely hosted, merchant-configured runtime. The Shopify CLI is the boundary between them. It can upload local files into a development or library theme, retrieve remote files, package a release artifact, and select a store/theme context. It does not make a remote theme a second Git working tree, and it does not turn a successful upload into approval to publish.

For an experienced frontend developer, the operational question matters more than a command mnemonic: **what is the source, what is the remote target, which state may change, and how will we recover?** Treat those four facts as part of every theme operation. Shopify documents the Theme command family as the interface for development, retrieval, upload, publication, listing, and packaging.[1]

## 50.1 `theme dev`, `pull`, `push`, `publish`, `list`, `package`

Start by naming the job of each command, not by treating every command as “deploy”.

| Command | Direction or action | Appropriate use | Risk to acknowledge first |
| --- | --- | --- | --- |
| `shopify theme dev` | Local files → temporary development theme | Interactive implementation and data-aware preview | A development representation is not a production deploy |
| `shopify theme pull` | Remote theme → local directory | Intentional recovery or authorised remote baseline | Local files can be replaced |
| `shopify theme push` | Local directory → named remote theme | Uploading a reviewed revision to an unpublished target | The remote target is overwritten |
| `shopify theme publish` | Unpublished remote theme → live role | Approved release promotion | The public storefront changes |
| `shopify theme list` | Store state → terminal | Identifying IDs, names, and roles before an operation | Similar names do not establish identity |
| `shopify theme package` | Local directory → ZIP artifact | Producing a handoff/release package | A ZIP does not prove it was tested |

`shopify theme dev` uploads the current valid theme structure to a development theme and gives a local preview address, an editor link, and a shareable preview link.[2] It is useful because the preview renders against the connected store’s data while remaining separate from the live theme by default. Run it from the directory containing the final theme output: `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, and `templates/` are expected directories.[3] If a build tool produces those files in `dist/`, run the command from there or configure the output path. Pointing the CLI at unbuilt source modules is not build integration.

```sh
shopify theme info
shopify theme dev --environment development
```

Use `theme info` as a preflight. It shows the currently selected store/theme configuration, which is cheap evidence against the expensive mistake of assuming the terminal is connected to a sandbox when it targets a client store. Do not add `--allow-live` because a safe command appears inconvenient. That flag removes a boundary; a release process should make the target explicit instead.

`theme pull` retrieves files from the chosen remote theme.[4] It is suitable when an authorised remote edit must become a reviewed local change, when initially adopting a legacy theme, or when restoring a known remote baseline. It is not a continuous synchronisation strategy. Before pulling, inspect `git status`, record the remote theme ID and role with `theme list` or `theme info`, and decide whether local changes should be committed, stashed, or discarded. A pull that fixes a conflict by silently replacing local work has produced no reliable history.

```sh
# Establish the intended remote target before retrieving it.
shopify theme list --environment staging
shopify theme pull --environment staging
# Review the imported state before committing it.
git diff -- config/settings_data.json templates/
```

`theme push` uploads local theme files and overwrites the selected remote target.[5] It is therefore a delivery command, not an editing shortcut. Point it at an unpublished review theme by environment or ID. Use Theme Check as a quality gate: the CLI’s `--strict` option requires Theme Check to pass without errors before it pushes.[5] This validates code rules, not merchant data, Markets configuration, consent, visual hierarchy, or business claims.

```sh
shopify theme push --environment staging --strict
shopify theme push --environment staging --only "sections/promo-banner.liquid"
```

A narrow `--only` upload can diagnose an isolated presentation fix, but it can also leave a remote theme in a mixed revision that never existed locally. Use it only with a documented reason, explicit remote target, and a follow-up full deployment of the reviewed commit. Likewise, deletion behaviour requires intent. Choose `--nodelete` only when preserving remote-only files is actually part of the state model—not because the flag name sounds safer. Safety means knowing which state wins and how to reconstruct it.

`theme publish` promotes an **unpublished remote theme** to the live role; a local theme must be pushed first.[6] It asks for confirmation unless forced. That confirmation is a valuable human gate, not a workflow annoyance to suppress. Before promotion, record the candidate theme ID, Git commit, approver, verification URLs, and rollback theme. `theme push --publish` combines upload and promotion, but it shortens the review interval for the remote candidate. Reserve such a shortcut for an explicitly approved, automated release procedure.

```sh
# A reviewed library theme is promoted only after preview approval.
shopify theme publish --environment production --theme 123456789
```

`theme list` is reconnaissance. It lists themes and their IDs/statuses,[1] so capture its output or store the selected ID in the release record. Do not infer that a familiar title is unique, unpublished, or connected to the intended store. Stores can hold archived, duplicated, client-managed, and campaign themes with similar names.

`theme package` produces a ZIP from the local theme directory for manual upload.[7] Only default theme folders are included; the archive name derives from the theme name and version configured in `settings_schema.json`.[7] Package from the exact release commit after checks, not from a directory containing generated debris or uncommitted experiments. Retaining a checksum and the ZIP beside the release record makes a handoff traceable.

> [VERIFY] Before a destructive pull, broad push, or publication in a client store, confirm the current CLI version, account, store URL, theme ID, permissions, and agreed rollback owner in that store’s release runbook.

## 50.2 Hot reload: what it reloads and what it doesn't

Hot reload reduces iteration time; it does not alter server truth. With `theme dev`, the default live-reload mode hot reloads **local CSS and section changes**. Shopify documents a full-page refresh when another changed file requires it; `--live-reload full-page` refreshes for every modification, and `off` disables live reload.[2] The distinction is practical: “the browser updated” does not establish whether CSS was replaced in place or a whole route was rendered again.

| Change being tested | Treat hot reload as | Verify separately |
| --- | --- | --- |
| Section markup/CSS | Fast local feedback | Required settings, editor state, responsive result |
| Liquid changing a route | A possible full-page refresh | Route/data context and alternate templates |
| JSON templates/settings | A file upload event, not a data migration | Existing merchant section instances and `settings_data.json` impact |
| Locale content | A useful visual update | Fallback, completeness, actual market/language route |
| App, checkout, inventory, Markets configuration | No substitute for platform testing | Admin configuration and real route behaviour |

The local address is a development proxy, not a sealed clone of production. It renders against store data, which is exactly why it is valuable and risky. Product availability, customer session, localization context, apps, and merchant settings can make identical Liquid render differently between routes. When behavior changes after saving a file, establish whether the expected request happened, then test the named route deliberately. Do not retry-edit a Liquid condition until you know whether the defect belongs to the theme, the configured data, or browser/cache state.

Hot reload does not preview checkout customizations at the local development address.[2] Validate checkout on its supported surface and include it in a distinct release record. It also does not run an external bundler, rewrite uncompiled TypeScript, reconcile a database, or push a Git branch. If source needs a build, make the build a named prerequisite that emits the theme directory. Avoid watcher loops where the CLI uploads intermediate artifacts.

A reliable local loop is bounded: change source; run or observe the controlled build; inspect the generated-theme diff; let `theme dev` deliver it to the development theme; test the named storefront route; record unexpected data/configuration conditions. The loop is rapid precisely because it has these boundaries.

## 50.3 Theme environments and `shopify.theme.toml`

An environment is a named set of CLI command configuration, such as store, theme, password, ignore patterns, or output preferences. It avoids copy-pasting target strings and makes development/staging/production context visible in review. Shopify CLI reads environments from `shopify.theme.toml` at the project root.[8]

```toml
[environments.development]
store = "northstar-dev"

[environments.staging]
store = "northstar-review"
theme = "123456789"

[environments.production]
store = "northstar"
theme = "987654321"
# Never commit a long-lived production secret in an example.
```

Select that context explicitly:

```sh
shopify theme dev --environment development
shopify theme push --environment staging --strict
shopify theme list --environment production
```

The file is configuration, not access control. A developer can still supply command-level `--store` or `--theme`; command flags override environment variables, which override TOML settings.[8] That precedence helps during a controlled exception but creates risk if an old shell alias silently provides a target. Print resolved context before a mutating command and make CI log it.

A table named `[environments.default]` supplies the default environment.[8] Do not make `production` default merely to reduce typing. A safe default is a development store or a command context that cannot affect the live theme. The TOML file can set most Theme command flags, but `environment`, `path`, and `verbose` are ignored inside it.[8] Shared flags can also have different meanings across commands, so do not add broad values such as `force` to a reusable environment without checking every inheriting command.[8]

Secrets need stronger handling than identifiers. A store URL, environment name, and theme ID are reviewable deployment metadata; a Theme Access password or custom app token must never enter version control, screenshots, terminal recordings, or copied examples. Shopify supports Shopify-account login, Theme Access passwords, and custom app access tokens for theme work.[3] Keep credentials in the approved secret store/environment variables, grant only necessary access, rotate them under organisation policy, and treat failed authentication as an operational event—not a reason to share a token in chat.

## 50.4 Development themes, unpublished themes, and preview links

These concepts look alike because each is previewable before release. Their lifetime and delivery meaning differ.

| Surface | Lifetime and role | Good for | Not sufficient for |
| --- | --- | --- | --- |
| Development theme | Temporary hidden theme connected by `theme dev` | Daily implementation against real store data | Durable approval after logout or a formal release candidate |
| Unpublished library theme | Stored remote theme, not live | QA, merchant approval, stable candidate preview | Proof it matches a Git commit unless recorded |
| Preview link | URL to inspect a particular remote theme | Sharing a named candidate | Replacing functional, accessibility, data, and route verification |

Development themes do not count toward the store’s theme limit and are deleted after seven days of inactivity; logging out also deletes the connected development theme.[3][2] This is good for short-lived feedback and wrong for a long approval cycle. If a preview must survive logout or serve as a durable candidate, push to an unpublished theme or use the supported share workflow.[2][3] Document who can view a password-protected preview and whether its store data is appropriate for that audience.

A preview URL is evidence about one remote theme instance. Put its theme ID and Git SHA in the review ticket; state store and market/account context; list exact product, collection, cart, and localization routes tested. If a reviewer reports a defect from a generic storefront URL, first establish whether it is the candidate or the live theme. This prevents teams approving different artifacts under the same campaign name.

## 50.5 Working against real store data safely

The CLI’s benefit is access to data that makes a theme behave like a storefront rather than a mocked static page. Its hazard is that the data can be commercial, personal, mutable, and configuration-dependent. Build a safety protocol around it.

First, choose the lowest-risk store and theme that can answer the question. A development store or controlled development theme is appropriate for normal section behavior. Use minimal non-production products, customer accounts, and test orders where possible. Do not seed live-looking personal data just to make a screenshot persuasive. For Markets, translations, apps, subscriptions, inventory, customer accounts, or catalog availability, record configuration context beside visual evidence; another store may make the same code look wrong or right for unrelated reasons.

Second, separate **code state** from **merchant state**. Git owns templates, Liquid, CSS, JavaScript, locale source, and review history. Merchants may own navigation, products, metafields, content, configuration, and customizer state. Files such as `config/settings_data.json` and JSON templates can bridge these concerns. Before pull or push, decide whether they are code-managed, merchant-managed, or synchronised under an explicit process. Never use indiscriminate upload as a cure for editor drift: replacing remote configuration may remove a merchant’s current section composition.

Third, make mutating commands reviewable. A useful release note contains repository commit, build version, CLI version, environment/store/theme ID, command and significant flags, remote preview URL, named test routes, operator, approver, time, and rollback target. On rollback, promote or re-push a previously verified candidate rather than improvising a live patch. This is not bureaucracy; it turns a storefront incident into a reversible, observable operation.

Finally, use permissions and preview scope deliberately. A collaborator/staff account needs the relevant Themes permission; API access needs appropriate theme scopes.[3] Do not borrow an owner credential to bypass missing permission. Request least privilege, then confirm the CLI sees the intended account/store before work begins. Production is a particular environment with a release owner, not a harmless TOML label.

The CLI is most effective when speed is paired with explicit ownership: Git reviews local source, merchant configuration is respected, development themes provide fast feedback, unpublished themes hold candidate state, and publication is deliberate promotion. That model lets a theme team use real storefront data without letting a terminal command become an untraceable production change.

## References

[1]: https://shopify.dev/docs/api/shopify-cli/theme "Shopify — CLI Theme commands"
[2]: https://shopify.dev/docs/api/shopify-cli/theme/theme-dev "Shopify — `theme dev`"
[3]: https://shopify.dev/docs/storefronts/themes/tools/cli "Shopify — Shopify CLI for themes"
[4]: https://shopify.dev/docs/api/shopify-cli/theme/theme-pull "Shopify — `theme pull`"
[5]: https://shopify.dev/docs/api/shopify-cli/theme/theme-push "Shopify — `theme push`"
[6]: https://shopify.dev/docs/api/shopify-cli/theme/theme-publish "Shopify — `theme publish`"
[7]: https://shopify.dev/docs/api/shopify-cli/theme/theme-package "Shopify — `theme package`"
[8]: https://shopify.dev/docs/storefronts/themes/tools/cli/environments "Shopify — Theme environments for Shopify CLI"
