<!-- STATUS: final -->
---
id: ch-71
kind: solution
title: "Build a release-evidence packet — worked answer"
words: 1320
---

# Chapter 71 — Solution: Build a release-evidence packet

The repaired packet does not claim a clean check, a performance score, accessibility conformance, market readiness or a successful release. It creates the records that make those claims testable. This distinction is the answer: quality operations fail when a document reports a conclusion without identifying the candidate version, route, fixture, environment, raw output, reviewer, decision and unresolved conditions.

The solution leaves every actual store, tool, permission, market, consent, analytics, legal, release and rollback outcome as `> [VERIFY]`. It offers structures for evidence; it does not invent evidence.

## 71.1 Theme Check clean, Lighthouse targets hit, a11y pass

`solution/records/quality-evidence.md` replaces three bare assertions with a route-state matrix. The record treats static analysis, lab performance, automated scans and manual accessibility review as different evidence streams. Each row has a target or expected behavior, but never fabricates a numeric threshold or result.

| Route/state | Evidence required | Fixture/environment | Owner and decision |
| --- | --- | --- | --- |
| Home/default and empty rail | Theme Check, lab run, keyboard/landmark review | Revision + desktop/mobile/network `[VERIFY]` | QA/release approver `[VERIFY]` |
| Collection/sort/page/empty | URL preservation, pagination, focus/error review | Declared collection fixture `[VERIFY]` | QA/content owner `[VERIFY]` |
| Product/options/unavailable/absent guide | Form labels/status, media, typed-content fallback | Product/guide fixtures `[VERIFY]` | QA/data owner `[VERIFY]` |
| Cart/section-null/network failure | Recovery via cart page, status/focus behavior | Named failure simulation `[VERIFY]` | QA/operations `[VERIFY]` |
| Search/account/content/locator | Query/no-results, supported account surface, reading/list semantics | Route/configuration fixture `[VERIFY]` | QA/store owner `[VERIFY]` |

A row links raw output location rather than copying a score. It records tool configuration, commit/archive, timestamp, browser/device/network, person, exception and release disposition. A Theme Check finding can be source evidence; it cannot prove a keyboard cart recovery. A scan can identify rule violations; it cannot prove that a replacement announces change correctly. The solution therefore requires a manual task script for keyboard order, visible focus, headings/landmarks, form labels/errors, asynchronous status, motion/media and failure states.

The key repair is triage. A failure is not erased to make a report clean. It becomes a blocker, configuration/content defect, documented false positive, time-bounded exception, or post-release improvement with owner and retest. The exception form needs risk, approver, compensating control, expiry and reopening event `[VERIFY]`.

## 71.2 Multi-market and translation pass

`solution/records/literal-inventory.md` classifies every visible candidate string and data display rather than declaring that text “works globally.” The inventory includes Liquid copy, schema labels/defaults, JavaScript statuses, accessible names, errors, empty states, media alternatives, content reference fields and external destinations. It assigns a translation, content or operational owner and a fallback decision.

```markdown
| Literal/data surface | Classification | Owner | Fallback/evidence |
| --- | --- | --- | --- |
| Collection sort label | Translatable interface copy | Translation owner `[VERIFY]` | Test selected locale and long label |
| Cart refresh status | Translatable async status | Theme owner `[VERIFY]` | Verify announcements and missing translation |
| Product availability | Store data, not theme copy | Catalog owner `[VERIFY]` | Test market/product availability fixture |
| Size-guide unit/table | Structured content/locale policy | Content owner `[VERIFY]` | Verify reference, units and absent guide |
| Location address/hours | Published operational data | Location owner `[VERIFY]` | Verify market visibility and staleness |
```

The route record notes that any Section Rendering request must use a locale-aware base. Shopify documents `window.Shopify.routes.root` for this purpose.[1] The solution does not convert currencies, infer market availability, publish translations, or declare account/search behavior. It lists an explicit market/locale route matrix and a missing/unavailable fixture as release evidence `[VERIFY]`.

## 71.3 Merchant onboarding defaults and presets

The starter’s free-form promise default is removed because it makes an unsupported delivery claim look like safe onboarding. `solution/sections/home-promise.liquid` retains a neutral heading and an optional bounded body, while a design-mode empty notice tells an editor what information is missing. It does not offer a free-form operational guarantee.

```liquid
<section class="home-promise" aria-labelledby="PromiseTitle-{{ section.id }}">
  {% if section.settings.heading != blank %}<h2 id="PromiseTitle-{{ section.id }}">{{ section.settings.heading }}</h2>{% endif %}
  {% if section.settings.message != blank %}<p>{{ section.settings.message }}</p>{% elsif request.design_mode %}<p>Choose approved editorial copy before publishing this section.</p>{% endif %}
</section>
{% schema %}
{"name":"Home information","settings":[{"type":"text","id":"heading","label":"Heading","default":"Shop with confidence"},{"type":"text","id":"message","label":"Approved message"}],"presets":[{"name":"Home information"}]}
{% endschema %}
```

The accompanying onboarding record identifies prerequisites, safe edits, intentionally blank references, preview/test tasks, escalation and removal/reordering behavior. Local limits should be intentional and remain well below verified platform limits; the record does not urge a merchant to consume maximum sections or blocks.[2]

## 71.4 Documentation, handoff, and training

`handoff.md` is role-specific. The merchant/editor receives a settings/content guide with empty-state meaning and prohibited edits. The developer receives theme structure, source version, component/data boundaries and how to add evidence. Support/operations receives routes, known risks, escalation and incident inputs. The release approver receives the evidence matrix, exception register, rollback artifact and decision record.

The training agenda is task-based: choose approved copy, recognise a blank guide/location state, preview a nominated route/market `[VERIFY]`, report a defect with revision/route/state/device/steps, and locate the rollback/escalation process. It avoids an unsafe claim that “the merchant can edit everything.” Handoff always distinguishes documentation of a candidate process from actual access or store training completion.

## 71.5 Deploy, monitor, iterate

The corrected deploy record uses gates rather than a publish instruction.

| Gate | Required evidence | Abort/response | Owner |
| --- | --- | --- | --- |
| Pre-release | Candidate version, checked findings, route-state matrix, exception register, rollback artifact | Missing required decision/evidence blocks release | Release approver `[VERIFY]` |
| Preview | Named buyer/editor/failure/market tasks against fixtures | Record defect and retest corrected state | QA/content `[VERIFY]` |
| Release | Target, time, communication, approval, abort rule | Execute verified rollback procedure if abort condition occurs | Release owner `[VERIFY]` |
| Observation | Baseline and declared signals, incident channel, response time | Triage unexpected signal with raw evidence | Operations owner `[VERIFY]` |
| Iteration | Validated finding, route/state, hypothesis, risk, metric and retest | Add bounded backlog item, not a retrospective score claim | Theme/product owner `[VERIFY]` |

The packet never says “watch conversion.” An observable hypothesis assigns signal, baseline, threshold, privacy/consent decision, owner and response. Actual metrics, events, consent, dashboard and alert settings are explicitly pending verification. A rollback artifact is a known prior version/procedure with an owner, not confidence that rollback has worked.

## Full solution files

The mirror contains `sections/home-promise.liquid` and five records: quality evidence, literal inventory, handoff/training, release gates, and triage. They provide a meaningful diff from every starter path. The records do not need a live API or browser to remain valuable; their function is to force unknown inputs into visible release gates.

## What people get wrong here

**Publishing aspirational results.** “Clean,” “100,” and “passed” without raw evidence are not concise reporting; they erase the information a release reviewer needs.

**Treating translation as a copy task.** Route context, availability, data visibility, long labels, units, error messages and fallback states change whether a buyer can use a surface.

**Using defaults as marketing promises.** A default is production content until changed. If it cannot be substantiated for every relevant market, make it neutral, optional, or visibly incomplete.

**Calling a rollback plan a rollback artifact.** A sentence telling someone to revert is not an identified version, authority and validated procedure.

## Stretch: direction only

Create an exception template only after the project’s risk policy is verified. It should establish a bounded exception with evidence, owner, approver, compensating control, expiry and retest—but it must never manufacture approval or substitute for a release blocker.

## References

[1]: https://shopify.dev/docs/api/ajax/section-rendering "Shopify — Section Rendering API"
[2]: ../../docs/DEPRECATIONS.md "Verified theme limits ledger"
