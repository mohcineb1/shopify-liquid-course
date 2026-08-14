<!-- STATUS: final -->
# Chapter 51 — Exercise

**Time:** 60–80 minutes · **Type:** static-analysis policy refactor

## Goal

Turn a Theme Check report that is either ignored or silenced wholesale into a useful team quality contract. You will configure a checked theme-output root, classify findings, make narrowly justified exceptions, add one custom team convention, and describe a merge gate that blocks genuine errors without pretending to certify runtime behavior.

## Context

Northstar Outdoors builds source assets into `dist/`, but its existing Theme Check configuration inspects the repository root and ignores every snippet. The previous team responded to an `UnusedAssign` warning by disabling all checks in an entire layout. Meanwhile, a missing asset reference and parser-blocking script are buried among warnings. CI calls the checker but accepts every exit code, and the pull-request template claims “Theme Check passed” without recording the configuration, generated output, or warning disposition.

Marketing’s new campaign banner has a real section and stylesheet. Your team wants its release path to reject broken Liquid/JSON and unsafe delivery patterns, while retaining an auditable way to handle generated icons and one intentional assignment convention. A custom convention should require a `data-section-id` attribute on an interactive section root. This lab asks for a policy and small fixture, not a claim that static analysis proves checkout, accessibility, or merchant acceptance.

## Requirements

- [ ] 1. Add `.theme-check.yml` that checks `dist/`, extends a named Shopify baseline, excludes only the generated icon fixture, and sets explicit severity for at least one correctness, performance, and team rule.
- [ ] 2. Write `triage.md` classifying each starter finding as **fix**, **configure**, **scoped suppress**, **defer**, or **escalate**. For every classification, name evidence, owner, and removal/review trigger.
- [ ] 3. Correct the intentionally missing asset and parser-blocking script in the starter’s deployable theme output. Do not turn off their checks.
- [ ] 4. Retain one intentional `UnusedAssign` only with the smallest valid Theme Check comment scope and a written explanation. Do not disable all checks in a file.
- [ ] 5. Add a TypeScript custom-check module and configuration entry for the `data-section-id` convention. Include a positive and negative fixture or documented test case; do not invent a Shopify platform check.
- [ ] 6. Write `gate.md` that specifies local/editor feedback, reproducible build output, CI command/fail level, warning triage, route verification, store configuration evidence, and merchant/release approval as separate layers.
- [ ] 7. Identify at least one check from each category: correctness/structure, performance/delivery, deprecation, and accessibility-adjacent HTML quality. Explain what it can detect and one thing it cannot certify.
- [ ] 8. Mark exact command versions, baseline configuration, custom-check API details, store data, visual/a11y results, and release policy facts `[VERIFY]` where they cannot be established from the starter.

## Constraints

- Do not globally disable a check, use a blanket `snippets/**` ignore, or downgrade an error solely to get a green run.
- Do not claim Theme Check validates checkout, apps, permission scopes, inventory, Markets, final contrast, keyboard behavior, or merchant content accuracy.
- Do not make a custom rule a substitute for Shopify’s documented checks; it must represent a stable team-owned convention.
- Do not add secrets, store targets, or production deployment commands.
- Preserve a valid deployable theme output in `dist/assets`, `dist/layout`, `dist/sections`, and `dist/templates`.

## Starter

```text
starter/.theme-check.yml                      root mismatch and broad ignores
starter/dist/layout/theme.liquid              broad disable, parser-blocking script, missing asset reference
starter/dist/sections/campaign-banner.liquid  interactive root without team inventory marker
starter/dist/assets/campaign-banner.css        real stylesheet output
starter/tools/team-checks.ts                  custom-rule placeholder
starter/triage.md                             unowned findings list
starter/gate.md                               empty merge-gate template
```

Copy the whole starter into a disposable theme-output project. Run the checker locally and in the editor before editing. Capture the unmodified report in a private exercise note, then make each changed rule/finding traceable to a policy decision rather than merely chasing a lower count.

## Done when

| Concern | Evidence |
| --- | --- |
| Checked target | Config points to the emitted `dist/` theme tree and avoids broad runtime ignores |
| Findings | Missing asset and parser-blocking delivery are fixed; the intentional assignment has only a local, explained suppression |
| Severity | Error/warning/info decisions map to a written merge consequence |
| Team rule | Custom check, configuration, diagnostic intent, and positive/negative case are documented |
| Gate | CI static analysis is paired with route, configuration, accessibility, and merchant/release evidence |
| Exceptions | Every exception has scope, owner, and removal/review trigger |

## Stretch

Add a small fixture runner or CI job design that runs the custom rule on a failing and a passing section fixture before it is enabled as a warning. Explain why the rule should not become an error until the team has measured false positives across existing themes.

## Verification protocol

Use an approved non-production theme-output directory. Record the CLI/Theme Check version, configuration path, `dist/` build command, check report, and exit behavior. Open the section route after the static fixes, then evaluate its keyboard interaction, visual layout, relevant market/account state, and merchant settings separately. A green static report is evidence about source contracts only; classify every remaining discrepancy as source, build, theme target, store configuration, app, data, accessibility/manual behavior, or release approval before choosing a remediation.
