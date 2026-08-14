<!-- STATUS: final -->
# Chapter 52 — Git & Environments

Git controls a history of files. A Shopify theme is also a living configuration surface: merchants edit sections, apps add state, campaigns change templates, and a published theme serves buyers while the repository advances. A reliable theme workflow does not deny that tension. It states which branch maps to which remote theme, who owns configuration files, how drift is detected, and how a release returns to a known candidate when a merchant has edited production.

The Shopify GitHub integration synchronises connected theme code with a repository branch in both directions. A branch update updates its connected theme; edits made through the Shopify admin are committed to that branch so branch and connected theme match.[1] This is powerful, but it means Git history can include merchant/editor changes. It also means “Git is the source of truth” is incomplete until a team defines the process by which merchant state enters, is reviewed, backfilled, or is deliberately separated.

## 52.1 The GitHub integration: branch → theme mapping

A connected branch is not an abstract deployment environment. It maps to a particular Shopify theme in a particular store. The mapping should be recorded as a small operational contract: repository, branch, store, theme ID, theme role, intended data context, owners, and permitted mutations. Shopify allows one or more branches from a repository to be connected for feature/campaign development and testing; connected themes may be unpublished or published.[1]

| Branch purpose | Connected theme role | Permitted work | Evidence before changing it |
| --- | --- | --- | --- |
| Feature branch | Unpublished disposable preview | Isolated implementation and developer/QA review | Branch name, remote theme ID, preview URL, test data context |
| Staging/release branch | Unpublished durable candidate | Cross-functional review and release preparation | Candidate commit, owner, routes, approvals, rollback candidate |
| Production/deploy branch | Published theme or publishable candidate | Only approved release/rollback commits | Theme role, current commit, merchant-edit status, release owner |
| Campaign branch | Temporarily published or unpublished event theme | Time-bounded campaign changes | Start/end time, reversion target, merchandising owner |

The official integration updates the admin theme whenever the connected branch changes and creates Shopify-authored commits when an owner, staff member, collaborator, theme editor, code editor, or installed theme app saves connected theme changes.[1] Treat those commits as operational events. Review their diff, author, timing, affected configuration files, and business owner; then decide whether to retain, backfill, revert, or move the resulting merchant configuration according to the team’s model. Never rewrite or force-push a branch merely to remove an unfamiliar `shopify` commit before understanding what storefront setting it represents.

A connected repository branch must match the default Shopify theme folder structure. Folders outside that structure are ignored by the integration.[1] For a build pipeline, the branch connected to Shopify must therefore contain deployable theme output, not a `src/` plus `dist/` project that Shopify cannot interpret. Shopify recommends separating source and compiled code using branches when a build pipeline is required, so that a dedicated deploy branch contains platform-compatible output.[2]

The most important daily check is identity, not synchronization speed. Before editing in the admin, opening a preview, or merging a branch, confirm the theme card’s repository, branch, last commit, store, and role. Before a release, compare the Git SHA in the candidate branch with the connected theme’s last saved commit. If those facts are not recorded, a “staging” label is only a guess.

> [VERIFY] Confirm the actual connected-branch/theme mappings, staff permissions, app access, and Shopify integration logs in the authorised store; source code alone cannot establish those operational facts.

## 52.2 The `settings_data.json` conflict problem and how teams solve it

`config/settings_data.json` is theme code in the technical sense—it resides in the theme filesystem—but it commonly holds merchant customizer choices. It may encode global settings and section configuration that a code release can overwrite. JSON templates can carry the same tension: they are versionable layout declarations, yet merchants may edit their section composition and block data through the editor. The conflict is not a malformed JSON problem; it is an ownership problem.

A team must choose a model per file/surface rather than applying one rule to every theme. The table is a decision aid, not a universal Shopify requirement.

| Model | Code owner | Merchant owner | Safe workflow | Main risk |
| --- | --- | --- | --- | --- |
| Code-managed | Developers/release owner | Limited to approved settings workflows | Version review and deploy every change | Treating live customisation as disposable |
| Merchant-managed | Merchant/content team | Active configuration and content | Exclude/transfer through a defined handoff, record changes | Configuration drifts from reproducible previews |
| Shared with import/review | Both, by surface | Both, with named approver | Pull/export, diff, classify, backfill or merge deliberately | Silent overwrite during an urgent release |

With the GitHub integration, theme-editor customizations are stored in setting files and are automatically committed to the connected branch.[1] That gives a connected workflow useful auditability but not automatic semantic reconciliation. A commit can be valid JSON and still replace a campaign section, change a homepage order, introduce a merchant-only setting, or conflict with an in-flight developer migration. Review it like an application configuration change: identify intent, owner, affected routes, preview result, and rollback path.

Do not solve a `settings_data.json` conflict by declaring whichever copy is newest to be correct. First freeze concurrent edits when possible. Capture both revisions, identify the related editor change and business owner, compare semantic sections/settings rather than raw line order, and reproduce the candidate on an unpublished theme. Then make a committed decision: retain merchant state, migrate it to the new schema, backfill it into source/deploy output, or revert it with owner approval. The record matters because the next theme push can otherwise reintroduce the “lost” configuration.

Schema changes need an explicit compatibility plan. Removing or renaming a setting may make a historic `settings_data.json` value inert, fail a contract, or change the editor experience. Add the new setting first, preserve a read/migration path where feasible, test old configured section instances, then remove deprecated configuration only after the merchant/release owner confirms its status. Static checks can catch schema syntax or key problems; they cannot decide which campaign state is commercially current.

## 52.3 JSON template drift between staging and production

A JSON template is both a deployable file and a composition record: section types, instance settings, block order, and page structure may vary between environments. A staging template that looks correct does not prove production has the same merchant composition, app blocks, or referenced content. Conversely, copying production’s entire template over staging can destroy a controlled test state. Name this condition **template drift** and inspect it intentionally.

| Drift source | Symptom | First evidence | Appropriate response |
| --- | --- | --- | --- |
| Merchant editor change | Production layout differs from candidate | Shopify/Git commit and theme-editor history | Classify owner, backfill or recreate intentionally |
| Campaign branch | Seasonal section exists only in event theme | Branch/theme mapping and campaign brief | Time-bound migration/reversion plan |
| App installation/configuration | Blocks differ across themes | Theme app state and rendered route | Test/store configuration owner, not a Liquid workaround |
| Incomplete deploy build | Candidate uses stale output | Build manifest/commit versus connected branch | Rebuild and re-check output |
| Manual code-editor change | Branch has unexpected code commit | Integration log and Git diff | Review, merge/revert under owner control |

Drift review should be route-led. For every candidate release, compare the relevant production and candidate JSON templates and then view the affected home, product, collection, cart, and policy routes in appropriate market/account context. Do not reduce the check to a large text diff: it must answer whether a buyer-facing composition changed, which owner approved it, and how it reverts.

Keep environment-only data out of arbitrary duplicated templates where possible. Use stable code contracts, merchant-managed content systems, and documented configuration injection rather than forking the entire homepage for one test. When a difference is intentional, write its reason, owner, expiry/review date, and promotion behavior. “Staging is different” is a state, not an explanation.

## 52.4 Branching strategy for a live storefront

A live storefront needs a branching strategy that optimises recovery as well as feature throughput. Shopify’s guidance suggests connecting main/master to a store and publishing the resulting theme so the published theme stays current with merged work; it also notes that non-main branches can support temporary sales/event themes that are republished back to main after the event.[2] A team can adapt that pattern, but it must make the mapping and release authority explicit.

A pragmatic model has three durations: short-lived feature branches, a durable candidate/deploy branch, and a production branch/theme relationship. Feature branches have their own unpublished previews and are deleted after merge/rejection. The candidate branch contains only release-ready deployable output and maps to an unpublished theme for QA. The production branch maps to the published theme—or is the carefully controlled branch from which the approved candidate is promoted. The key property is not the branch names; it is that one commit and one remote candidate can be identified at release time.

Avoid long-lived feature branches that silently diverge from production theme configuration. Rebase or merge frequently, and test integration in the candidate branch before asking a merchant to approve. Limit emergency hotfix branches to a small, reviewable change with an explicit back-merge/backfill plan. A hotfix that exists only in the published theme is an untracked future regression.

For build pipelines, source and deploy branches must be distinguishable. Shopify documents that a branch connected to the integration cannot contain `src` and `dist` folders; it must match the theme structure.[2] Record the source SHA used to generate each deploy commit. That trace lets a team reproduce a release rather than accepting a compiled diff with no source provenance.

## 52.5 Release, rollback, and the "merchant edited production" reality

Production edits are not necessarily mistakes. A merchant may correct campaign copy, reorder a section, install/configure a theme app, or react to an operational need. The risk begins when a developer deploys as though no such change occurred. The release process must therefore include a merchant-edit reconciliation step before the deploy and a known recovery option after it.

| Release moment | Required question | Evidence | Owner |
| --- | --- | --- | --- |
| Before candidate | What deploy commit and generated output are being tested? | Clean build, Git SHA, Theme Check report | Developer/release engineer |
| Before promotion | Has production changed since candidate preparation? | Connected-branch commits, admin/integration logs, merchant confirmation | Release owner + merchant owner |
| At promotion | Which remote theme becomes live, and what was live before? | Theme IDs/roles, preview, approval, rollback target | Release owner |
| After promotion | Do named routes retain expected code and configuration behavior? | Route matrix, market/account context, monitoring/owner sign-off | QA + merchant owner |
| On incident | Which verified candidate restores service? | Prior theme/commit, incident decision, post-rollback check | Incident/release owner |

Shopify exposes version-control logs on the theme card and offers a manual reset to the last branch commit if a connected theme falls out of date.[1] These are recovery tools, not permission to discard an unexplained merchant change. Before reset or rollback, capture the current branch/theme state and get the business owner’s decision. If the change was intentional, merge/backfill it; if it was erroneous, record why reverting is safe. The same discipline applies when the published theme is still connected: publishing an unpublished connected theme retains its branch connection.[1]

A rollback should favour a previously verified remote candidate or commit, not a hurried edit to live. Record the trigger, approver, source/candidate theme ID, target published theme ID, operator, time, and verification routes. Then create a follow-up task to reconcile the divergent source, merchant configuration, and incident cause. A rollback that restores buyers but leaves the repository pointing at the defect is only half complete.

The mature theme team accepts that configuration is live work. Git provides durable history, connected branches make admin edits observable, candidate themes make review safer, and a release record makes recovery possible. The goal is not to forbid merchant agency. It is to make every code/configuration change attributable, reviewable, testable, and reversible.

## References

[1]: https://shopify.dev/docs/storefronts/themes/tools/github "Shopify — GitHub integration for themes"
[2]: https://shopify.dev/docs/storefronts/themes/best-practices/version-control "Shopify — Version control for Shopify themes"
