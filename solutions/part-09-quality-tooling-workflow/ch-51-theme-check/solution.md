<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 51 — Solution

## The approach

The solution turns Theme Check into a narrow but dependable static-quality layer. It points at the actual `dist/` theme output, retains a documented Shopify baseline, fixes source defects instead of hiding them, and models exceptions as short-lived, named decisions. The custom rule expresses one team-owned convention; it does not reimplement Shopify’s checks or claim runtime authority. The merge gate is deliberately multi-layered: a clean static run permits code integration, while route, configuration, accessibility, and merchant evidence decide candidate and production readiness.

Every requirement follows one rule: **the checker must see the code that ships, and every ignored signal must retain an owner and a removal condition.** The starter’s broad ignores and file-wide suppression produce a superficially quiet report by making the report less trustworthy. The correction makes the report smaller by eliminating defects and scoping the lone intentional exception.

## Walkthrough

**1 — emitted output and named baseline.** `root: dist` ensures that the checker analyses the same directory the theme CLI should upload. `theme-check:recommended` is an explicit Shopify baseline. The only ignore is a generated icon pattern; it does not hide all snippets or all build output. The configuration promotes missing assets and parser-blocking delivery to errors and enables the local team rule as a warning.

**2 — triage is a decision record.** A finding is not “fixed” because its count changed. Missing CSS is fixed by removing the false reference. The parser-blocking asset receives `defer` only after preserving its route/init contract. The intentional assignment receives a single-line `UnusedAssign` suppression with its reason and review trigger. Generated icons are configured as an owned generated surface. The custom-rule result begins as a warning with fixture evidence. Any project/store facts remain `[VERIFY]`.

**3 — correctness and delivery defects.** `missing-release.css` is removed: shipping a reference to an absent asset is not a policy exception. `campaign-tracker.js` is loaded with `defer`; the solution also supplies the file so the asset contract is coherent. A real implementation must test script ordering and app behavior in the target route—static analysis does not execute it.

**4 — the smallest suppression.** The section keeps one assignment whose value is intentionally made available to a controlled downstream integration convention. The only suppression is immediately before that assignment and names `UnusedAssign`. It is not a layout-wide blindfold. If the integration disappears, remove both the assignment and comment.

**5 — custom convention.** The TypeScript module contains a named rule contract and a diagnostic specification for interactive section roots without `data-section-id`. The exact Theme Check visitor API is a versioned dependency, so the module marks its integration seam `[VERIFY]`; the configuration and fixtures state the product behavior without inventing a stable API. Positive/negative fixture evidence is recorded before severity promotion.

**6 — gate boundaries.** CI builds `dist/`, runs Theme Check with a defined failure level, archives the report, and blocks errors. Warnings cannot be ignored; they need triage owner/disposition. Separate candidate evidence covers a rendered route, keyboard/visual checks, relevant Markets/account/configuration state, and merchant/release approval.

**7 — category coverage.** The gate calls out `MissingAsset` as correctness, `ParserBlockingScript` as delivery performance, `DeprecatedTag` as deprecation, and `UnclosedHTMLElement`/`ImgWidthAndHeight` as accessibility-adjacent structure. Each is a static signal with a named runtime limit.

**8 — uncertainty.** Tool versions, baseline contents, custom API adapter, store state, and release policy are explicit `[VERIFY]` values. A transparent unknown is safer than a plausible command that silently weakens the gate.

## Full files

### `.theme-check.yml`

```yaml
root: dist
extends:
  - theme-check:recommended
ignore:
  - 'snippets/*-generated-icon.liquid'

MissingAsset:
  enabled: true
  severity: error

ParserBlockingScript:
  enabled: true
  severity: error

ApprovedSectionInventory:
  enabled: true
  severity: warning

require:
  - ./tools/team-checks.js
```

The `require` path is a build-output contract: compile the TypeScript tool to the referenced JavaScript path before running Theme Check.

### `dist/layout/theme.liquid`

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  {{ content_for_header }}
  {{ 'campaign-banner.css' | asset_url | stylesheet_tag }}
  <script src="{{ 'campaign-tracker.js' | asset_url }}" defer></script>
</head>
<body>
  {{ content_for_layout }}
</body>
</html>
```

### `dist/sections/campaign-banner.liquid`

```liquid
<section class="campaign-banner" data-section-id="{{ section.id }}" tabindex="-1">
  {% # theme-check-disable-next-line UnusedAssign %}
  {% assign campaign_trace = section.id %}
  <a class="campaign-banner__link" href="{{ section.settings.link }}">{{ section.settings.label }}</a>
</section>

{% schema %}
{
  "name": "Campaign banner",
  "settings": [
    { "type": "url", "id": "link", "label": "Link" },
    { "type": "text", "id": "label", "label": "Label", "default": "Explore the collection" }
  ],
  "presets": [{ "name": "Campaign banner" }]
}
{% endschema %}
```

Add a nearby code comment in a real project explaining the integration that consumes `campaign_trace` and its removal trigger. The example retains the scoped checker instruction so the contrast with the starter is visible.

### `dist/assets/campaign-tracker.js`

```js
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.campaignTracker = 'ready';
});
```

The `defer` attribute changes execution timing; test any actual dependency sequence on the affected route before applying it to a production tracker.

### `tools/team-checks.ts`

```ts
/**
 * ApprovedSectionInventory
 * Report interactive section roots that do not expose data-section-id.
 * [VERIFY] Implement against the Theme Check custom-check visitor API
 * supported by the pinned project version, then compile to team-checks.js.
 */
export const ApprovedSectionInventory = {
  name: 'ApprovedSectionInventory',
  message: 'Interactive section roots must expose data-section-id for the team inventory.',
};
```

The essential lesson is the rule contract, not an invented AST API. Add test fixtures before wiring the version-specific visitor: `campaign-banner.liquid` without the attribute must report; the corrected file must not. A production custom-check package should export a tested adapter compatible with the pinned Theme Check release.

### `triage.md`

```md
# Finding triage

| Finding | Disposition | Evidence / owner | Review or removal trigger |
| --- | --- | --- | --- |
| `MissingAsset` for `missing-release.css` | Fix | Reference removed; code owner | Every release check |
| `ParserBlockingScript` | Fix | Deferred script plus route-order test [VERIFY] | App/loader dependency change |
| `UnusedAssign` `campaign_trace` | Scoped suppress | Integration owner [VERIFY] | Remove when integration no longer consumes it |
| Generated icon fixture | Configure | Build owner [VERIFY]; narrow ignored pattern | Generated-file pipeline change |
| `ApprovedSectionInventory` | Defer/promote | Passing/failing fixtures and team owner [VERIFY] | Promote after false-positive review |
| `DeprecatedTag` | Escalate | Platform migration owner [VERIFY] | Current deprecation ledger/release plan |
| `ImgWidthAndHeight` | Escalate | Rendered media and accessibility owner [VERIFY] | Responsive media contract review |
```

### `gate.md`

```md
# Theme Check merge gate

1. Build the deployable `dist/` output from a clean checkout. Record build and tool versions [VERIFY].
2. Run Theme Check against `.theme-check.yml`; archive the report. CI fails at `error` severity.
3. Every warning has a triage row with disposition, owner, and review/removal trigger. No blanket ignore or file-wide disable is accepted.
4. Verify a named candidate route after upload: source/build output, section render, and asset delivery.
5. Verify keyboard/focus/visual behavior, relevant market/account/store data, app behavior, and merchant settings separately [VERIFY].
6. Require candidate approval, target record, and rollback owner before production promotion [VERIFY].

| Check category | Static signal | It cannot certify |
| --- | --- | --- |
| Correctness | `MissingAsset` | Remote asset/cache or merchant outcome |
| Performance | `ParserBlockingScript` | Field performance or safe dependency order |
| Deprecation | `DeprecatedTag` | Migration behavior on every route |
| Accessibility-adjacent | `UnclosedHTMLElement`, `ImgWidthAndHeight` | Keyboard order, contrast, useful alternative text |
```

## What people get wrong here

**Checking the repository root instead of deployable output.** A checker can only protect files it receives. If CI packages `dist/` while checks inspect source, the gate protects the wrong artifact.

**Solving warnings with broad ignores.** A broad suppression lowers visibility rather than lowering risk. Generated output deserves a narrow path exception plus a build owner; unknown snippets deserve analysis.

**Treating `defer` as a mechanical performance fix.** It addresses parser blocking but can change execution order. Validate dependencies and state on the route that loads the script.

**Making the custom check an immediate error.** A team convention needs fixtures and false-positive evidence. Begin with a visible warning and promote only after the migration/remediation path is proven.

**Equating green CI with production acceptance.** Theme Check cannot observe the merchant editor, a Market’s catalogue, customer context, checkout, visual regression, legal promise, or release authority. The gate must name those other evidence owners.

## Stretch: direction only

In CI, compile the custom TypeScript rule, run its positive/negative fixtures, build `dist/`, run Theme Check, then archive its report. Protect only the credential required for a non-production candidate upload. Keep policy-approved promotion and rollback as release-owner decisions until the organisation has designed their automation and audit trail.
