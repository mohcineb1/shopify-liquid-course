<!-- STATUS: final -->
---
id: ch-71
title: "Hardening & Shipping"
part: 13
words: 2380
---

# Chapter 71 — Hardening & Shipping

A theme is not ready because its happy path looks finished in a desktop browser. It is ready to propose for release only when a named person can reproduce its quality evidence, review its explicit exceptions, configure it safely, understand its operating boundaries, and recover from a failed release. This chapter turns the capstone from a candidate implementation into a delivery package. It still does not run Theme Check, Lighthouse, an accessibility audit, translations, market configuration, deployment, monitoring, analytics, or a live release. Those are environment and store facts, so every result is `[VERIFY]` until captured against a named theme/version, date, route, device/network, tester and owner.

The central rule is simple: **a target is not a result**. “Theme Check clean,” “fast,” “accessible,” “translated,” “merchant ready,” and “monitored” are hypotheses until evidence connects them to a route, configuration and decision. The release record should make the difference impossible to hide.

## 71.1 Theme Check clean, Lighthouse targets hit, a11y pass

Start by separating automated signals from quality claims. Theme Check can identify theme-source issues under a declared configuration; it cannot prove a buyer can complete an interaction. A Lighthouse run describes one measured page under one tool/browser/environment; it does not establish all-market or all-device performance. An accessibility scan can find certain violations; it cannot replace keyboard, focus, semantics, screen-reader and content review. Each signal is useful precisely because its boundary is explicit.

A delivery evidence row should specify the command or tool configuration `[VERIFY]`, theme commit/archive, route, locale/market, test fixture, device/network/browser, timestamp, raw output location, owner, threshold/exception and release decision. Do not paste a score into a handoff document without the conditions that produced it.

| Evidence type | What it can establish | What it cannot establish alone |
| --- | --- | --- |
| Theme Check | Source findings for the checked theme/configuration | Correct merchant settings, buyer flows or live runtime behavior |
| Lighthouse | Measured lab values for a declared route/environment | Real-user performance across devices, markets and content |
| Automated accessibility scan | Detectable rule violations in rendered states | Keyboard order, meaningful labels, task completion or all dynamic states |
| Manual assistive review | A scripted interaction on stated technologies | Universal assistive-technology compatibility |
| Content/editor review | A configured fixture’s visible content and constraints | That production data matches the fixture |

Define targets before running tools. The target record needs metric, route class, device/network, budget, allowed variation, owner and action if missed. Exact thresholds and mandated score policy are project requirements `[VERIFY]`, not values to invent from a generic tutorial. A reasonable release gate may distinguish blocking errors, triaged exceptions with expiry, and informational findings. It must never silence a rule merely to achieve “clean.”

Accessibility hardening needs a route-and-state matrix. Review header/navigation, home composition, collection sorting/filtering/pagination, product options/media/form, cart page/drawer, search/no-result, account surface `[VERIFY]`, article/page, guide, locator and error/empty states. For each, test keyboard operation, visible focus, logical focus after replacement, heading/landmark structure, form labels/errors/status, contrast, touch target policy `[VERIFY]`, motion/media behavior and meaningful text alternatives. The Section Rendering API’s possibility of a null section response makes its error/fallback state an accessibility test, not merely a JavaScript test.

This is where people get burned: a passing build paired with a focus trap after a cart refresh is still a release blocker. Quality exists at the boundary between source, runtime state and buyer task.

## 71.2 Multi-market and translation pass

Internationalisation is not a final text-replacement step. It changes routes, selected country/language, currency/price formatting, product/collection availability, legal or shipping copy, images, dates, storefront content, navigation labels, layout expansion and support expectations. The candidate theme must use platform-provided, locale-aware routes rather than hard-code the root. Shopify documents `window.Shopify.routes.root` as a locale-aware base for Section Rendering API requests.[1]

The pass begins with an inventory rather than a browser sweep. List every customer-facing literal in Liquid, JavaScript, schema setting, accessibility name, empty state, error/status message, email/documentation link and image alternative. Classify each as translatable copy, merchant-configurable content, data value, legal/operational claim, external provider response, or code token. A text key is not automatically safe: the translation can be missing, an interpolated value can change word order, and a UI can overflow or become ambiguous.

| Surface | Market/translation question | Required evidence |
| --- | --- | --- |
| URLs and async requests | Does the request preserve selected language/country context? | Locale-aware-route fixture `[VERIFY]` |
| Product/collection | Are availability, names, prices and filter labels data-backed? | Market/content configuration and fallback decision `[VERIFY]` |
| Media and layout | Does alternative text, crop and long copy remain usable? | Narrow/large viewport review in each selected locale |
| Forms/status | Are labels, errors and asynchronous announcements clear? | Keyboard/error state review, not only static screenshots |
| Guides/location | Are data visibility, units, address/hours and provider rules local? | Content-owner and market/locale record `[VERIFY]` |

Do not infer that every product, guide or location is available everywhere. Do not convert a currency/market representation yourself in theme JavaScript. Do not use a translated string as a CSS selector, event name or data key. Do not claim legal or delivery meaning whose market rules have not been approved. Those questions need a merchant, legal/operations and store-configuration owner `[VERIFY]`.

Test a nominated market/locale matrix, including an unavailable or untranslated state. Include URL generation, navigation, home, collection, product, cart, search, content/guide/location and any partial-rendering path. Record fixture content, expected fallback, screenshots/notes, open defects and release decision. “Looks fine in English” is not evidence about another market.

## 71.3 Merchant onboarding defaults and presets

Merchant onboarding is a safety feature. A fresh installation should expose a useful but honest baseline, make required decisions visible, and prevent a missing setting from producing a broken layout, fake claim or inaccessible control. A preset should demonstrate intent; it is not a substitute for content governance.

Audit every section and block for default copy, default media, empty behavior, setting labels/help, permitted ranges, block limits, dynamic-source/reference assumptions and destructive/reordering risk. The verified platform ledger caps a JSON template at 25 sections and a section at 50 blocks, among other caps; local product/design limits should remain intentionally smaller.[2] Do not make merchant onboarding rely on approaching platform limits.

| Onboarding item | Good default | Unsafe default |
| --- | --- | --- |
| Hero/media | Neutral, removable content with explicit alt/crop guidance | Claiming a promotion, stock or delivery promise |
| Product rail | Blank/visible editor state until collection is chosen | A hidden arbitrary catalog query |
| Guide/location | Omitted until typed reference/published data exists | Product description/map placeholder presented as real data |
| Component settings | Narrow, labelled choices with predictable output | Free-form CSS/HTML or opaque switches |
| Preset | A bounded arrangement that can be safely edited | An assumed store/market/content configuration |

Write an onboarding runbook: prerequisites; what a merchant edits; what is intentionally blank; how to select/test a section; how to remove/reorder a block; how to validate desktop/mobile/accessibility; which settings must be approved; how to preview markets `[VERIFY]`; and escalation routes. Use screenshots only when the relevant editor/version is verified. The record should also identify whether sections belong in templates, groups or individual routes.

## 71.4 Documentation, handoff, and training

Handoff is an operational interface, not a folder full of implementation notes. It must answer four questions quickly: what is delivered, what can be changed safely, what remains unverified/unsupported, and who owns the next decision. Write for merchant/editor, internal developer, support/operations and release approver separately; their required details differ.

A delivery package should include a version/commit or archive identifier, installation/preview route `[VERIFY]`, environment boundaries, theme structure map, component/setting guide, content/data dictionary, market/translation matrix, accessibility/performance evidence, known issues/accepted exceptions, support contacts, change process, rollback procedure, release checklist and training agenda. Link raw evidence rather than transcribing it. Do not present candidate snippets as store-specific instructions.

Training should be task based: edit an approved home rail; choose a collection; change a product-facing setting without hiding essential information; recognise a missing reference; preview an alternate locale/market `[VERIFY]`; read an empty/error state; report a defect with route/device/steps; and follow rollback/escalation. A training attendee should know what **not** to edit. That boundary is more valuable than a generic tour of the editor.

## 71.5 Deploy, monitor, iterate

Deployment is a decision gate, not a button in the theme UI. Define a release owner, target theme/version, review/approval evidence, preview criteria, production-window constraints `[VERIFY]`, communication, abort conditions, rollback artifact, rollback owner and post-release observation interval. Never imply that theme code can modify checkout surfaces or that a deploy succeeds without store permissions and platform workflow verification.

Monitoring needs an observable hypothesis. A metric/alert without an owner, baseline, threshold, response time and action is a dashboard decoration. Candidate observations might cover fatal client errors, failed cart/update flows `[VERIFY]`, no-result/search patterns, performance regressions, accessibility defect reports, content/editor errors and support tickets. Actual analytics events, privacy/consent, retention, identifiers, dashboard access and alert configuration require approval `[VERIFY]`.

| Phase | Decision and evidence | Owner |
| --- | --- | --- |
| Pre-release | Checked source, approved exception list, route/market/content matrix, rollback artifact | Release approver `[VERIFY]` |
| Preview | Test named buyer/editor tasks against fixtures and failure states | QA/content/merchant roles `[VERIFY]` |
| Release | Record target, time, decision, communication and abort rule | Release owner `[VERIFY]` |
| Observation | Compare declared metrics/support signals to baseline; triage incidents | Operations owner `[VERIFY]` |
| Iteration | Convert a validated finding into a bounded backlog item and retest | Product/theme owner `[VERIFY]` |

Iteration is disciplined learning. A report that says “improve conversion” is not actionable; a finding that names route, user task, evidence, affected market/device, hypothesis, owner, risk and validation method is. Preserve release artifacts so the next team can distinguish a regression from an untested state.

### Triage is part of hardening

Hardening produces findings, not an automatic release/no-release answer. Triage turns them into accountable decisions. For each finding, preserve the original evidence and classify its severity against a declared buyer/editor/business impact. Capture the affected route and state, reproducibility, market/locale, device/browser or assistive technology, content fixture, owner, proposed remedy, verification method, due date and release disposition. An exception must say why the risk is acceptable, who accepted it, when it expires, and which event reopens it. “Known issue” without those fields is deferred work disguised as a decision.

| Finding outcome | Minimum record | Next action |
| --- | --- | --- |
| Release blocker | Reproduction, impact, owner and retest requirement | Correct before release and rerun affected evidence |
| Time-bounded exception | Risk, approver, expiry, compensating control and tracking reference | Release only when the exception policy is approved `[VERIFY]` |
| Configuration/content defect | Merchant/data owner, safe interim state and fixture | Correct configuration/content then revalidate route state |
| Tooling false positive | Raw result, reason, reviewed scope and configuration | Keep a documented suppression only where supported `[VERIFY]` |
| Follow-up improvement | Evidence, hypothesis, priority and metric | Place in backlog; do not represent as current quality |

Triage must also check interactions between findings. A translated label overflow, for example, may become a keyboard or touch-target defect rather than a copy-only issue. A missing guide reference may be an editorial/data workflow failure, not a Liquid rendering bug. A performance change may be safe for a home route but unacceptable for a product route with large media. Re-test the full route-state matrix after a cross-cutting correction; never close an issue solely because its original screenshot changed.

When evidence cannot be reproduced, record that fact as a release risk. Do not average contradictory results, select the most flattering run, or close the finding because the target cannot be tested. Escalate the missing environment, fixture, permission or tool-access decision to its named owner `[VERIFY]`.

## Checklist

| Before proposing release | Evidence |
| --- | --- |
| Quality targets are measurable and contextual | Raw check/lab/manual evidence, not score claims |
| Buyer and failure states are accessible | Keyboard/focus/status/semantic route matrix |
| Locale/market assumptions are surfaced | Literal inventory, fixture matrix and verified fallbacks |
| New merchants cannot accidentally publish a false or broken surface | Defaults/presets/empty-state/onboarding runbook |
| Handoff makes boundaries and ownership clear | Version, data/settings guide, risks, change and rollback paths |
| Release is reversible and observable | Approval, artifact, monitoring and incident/iteration record |

## References

[1]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
[2]: ../../docs/DEPRECATIONS.md "Verified theme limits ledger"
