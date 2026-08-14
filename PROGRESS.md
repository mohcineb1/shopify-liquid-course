# Progress log

Append-only. One entry per completed pass, newest last. Never rewrite an old entry.

**Ground truth for "where am I" is `python3 scripts/next.py`**, which reads the actual
files. This log is the narrative that the file states cannot capture: judgement calls,
open flags, and anything the next session needs to know. If the two disagree, trust
`next.py` and record the discrepancy here.

Entry format:

```
## YYYY-MM-DD · <unit-id> · <pass>
- wrote: <paths>
- flagged: <[VERIFY] items, or none>
- decided: <judgement calls worth remembering, or none>
- next: <what scripts/next.py printed afterwards>
```

---

## 2026-08-13 · setup · repo scaffolded
- wrote: whole repo — 83 units generated from `index/shopify-liquid-course-index.md`
- decided: generation unit is one chapter; solutions live in a mirror tree, never in `course/`
- next: gate — verify `docs/DEPRECATIONS.md`

## 2026-08-13 · ch-18 · lesson
- wrote: `course/part-03-theme-architecture/ch-18-blocks-the-three-kinds/lesson.md` (2,467 words)
- flagged: [VERIFY] whether editor attributes are auto-applied to a generated block wrapper
- decided: this chapter is the **reference implementation**. Match its depth, structure,
  tone and length. When the contract is ambiguous, copy chapter 18.
- next: ch-18 exercise

## 2026-08-13 · ch-18 · exercise
- wrote: `.../exercise.md` (696 words) + `starter/sections/trust-bar.liquid`,
  `starter/sections/product-highlights.liquid`, `starter/assets/trust-bar.css`
- flagged: none
- decided: starter ships the duplicated section deliberately — the smell is the lesson
- next: ch-18 solution

## 2026-08-13 · ch-18 · solution
- wrote: `solutions/part-03-theme-architecture/ch-18-blocks-the-three-kinds/solution.md`
  (1,346 words) + `solution/blocks/{icon-item,_divider,_bar-heading}.liquid`,
  `solution/sections/{trust-bar,product-highlights}.liquid`
- flagged: [VERIFY] preset object form with `block_order` for nested children
- decided: stretch goal left unanswered by design, per the content contract
- next: ch-18 review

## 2026-08-13 · gate · deprecations
- wrote: `docs/DEPRECATIONS.md`
- flagged: none
- decided: replaced the obsolete 20 MB individual-file claim with Shopify's current per-file limits; added the missing template, section-group, block, naming, and aggregate-theme limits; retained `{% block %}` / `{% partial %}` as developer-preview-only material.
- next: ch-18 review

## 2026-08-13 · ch-18 · review
- wrote: `course/part-03-theme-architecture/ch-18-blocks-the-three-kinds/{lesson.md,exercise.md,BRIEF.md}` and `solutions/part-03-theme-architecture/ch-18-blocks-the-three-kinds/solution.md`
- flagged: none
- decided: resolved the wrapper-attribute and nested-preset questions against current Shopify documentation; completed the second solution section; retained the existing ch-18 coverage and glossary entries because they already match the final unit.
- next: app-a lesson

## 2026-08-13 · app-a · lesson
- wrote: `course/part-15-appendices/appendix-a-complete-liquid-tag-reference/lesson.md` (2,351 words)
- flagged: none
- decided: treated `{% block %}` and `{% partial %}` as Liquid July '26 developer-preview-only; documented `include` and the `currency` form as deprecated; added canonical glossary entries for Liquid tag, static section, and snippet.
- next: app-a review

## 2026-08-13 · app-a · review
- wrote: finalised `course/part-15-appendices/appendix-a-complete-liquid-tag-reference/{lesson.md,BRIEF.md}`
- flagged: none
- decided: review checklist passed 10/10; verified preview-tag syntax, completed the form-type inventory, and documented `paginate` and static `content_for` parameters.
- next: app-b lesson

## 2026-08-13 · app-b · lesson
- wrote: `course/part-15-appendices/appendix-b-complete-filter-reference/lesson.md` (2,781 words)
- flagged: none
- decided: reconciled the reference against all 153 current Shopify filter pages; marked `img_url` and `product_img_url` as deprecated in favour of `image_url`.
- next: app-b review

## 2026-08-13 · app-b · review
- wrote: finalised `course/part-15-appendices/appendix-b-complete-filter-reference/{lesson.md,BRIEF.md}`
- flagged: none
- decided: review checklist passed 10/10; corrected the documented contexts for payment, cart, measurement, and deprecated `img_tag` filters.
- next: app-c lesson

## 2026-08-13 · app-c · lesson
- wrote: `course/part-15-appendices/appendix-c-complete-object-reference/lesson.md` (2,382 words)
- flagged: none
- decided: reconciled the reference against all 138 current Shopify Liquid object pages; labelled access classes as authoring guidance rather than platform latency guarantees and recorded the 20-handle `all_products` ceiling.
- next: app-c review

## 2026-08-13 · app-c · review
- wrote: finalised `course/part-15-appendices/appendix-c-complete-object-reference/{lesson.md,BRIEF.md}`
- flagged: none
- decided: review checklist passed 10/10; corrected the deprecated `theme` object, the line-item property surface, and the constrained availability of the `checkout` object.
- next: app-d lesson

## 2026-08-13 · app-d · lesson
- wrote: `course/part-15-appendices/appendix-d-schema-settings-reference/lesson.md` (2,399 words)
- flagged: none
- decided: verified all 33 current input-setting types, including theme-only color palettes and color-scheme groups, and documented their JSON and validation boundaries.
- next: app-d review

## 2026-08-13 · app-d · review
- wrote: finalised `course/part-15-appendices/appendix-d-schema-settings-reference/{lesson.md,BRIEF.md}`
- flagged: none
- decided: review checklist passed 10/10; repaired the wrong-then-right wrapperless-block example so its code now demonstrates the documented editor failure and correction.
- next: ch-01 lesson

## 2026-08-13 · ch-01 · lesson
- wrote: `course/part-01-the-mental-model/ch-01-where-liquid-actually-sits/lesson.md` (2,255 words)
- flagged: none
- decided: verified the execution-boundary matrix against current Shopify Liquid, Functions, Storefront API, and Hydrogen/Oxygen documentation.
- next: ch-01 exercise

## 2026-08-13 · ch-01 · exercise
- wrote: `course/part-01-the-mental-model/ch-01-where-liquid-actually-sits/exercise.md` and its `starter/` section and JavaScript asset
- flagged: none
- decided: the exercise keeps the runtime-boundary decision as the learner’s work; it introduces no API surface beyond the lesson and requires no network call.
- next: ch-01 solution — stop before this pass because ch-01 lesson and exercise were written in this context; solution must run in a fresh session.

## 2026-08-13 · ch-01 · solution
- wrote: `solutions/part-01-the-mental-model/ch-01-where-liquid-actually-sits/solution.md` and mirrored `solution/` section and JavaScript asset
- flagged: none
- decided: the answer preserves the runtime boundary by server-rendering product identity, limiting JavaScript to a local preview, and keeping discount authority outside the theme.
- next: ch-01 review; do not add solution-derived structure or hints to `course/`.

## 2026-08-13 · ch-01 · review
- wrote: finalised `course/part-01-the-mental-model/ch-01-where-liquid-actually-sits/{lesson.md,exercise.md,BRIEF.md}` and its mirrored solution status
- flagged: none
- decided: review checklist passed 10/10; only status markers changed, so no solution-derived detail was added to `lesson.md` or `exercise.md`.
- next: ch-02 lesson

## 2026-08-13 · ch-02 · lesson
- wrote: `course/part-01-the-mental-model/ch-02-translating-what-you-already-know/lesson.md` (2,327 words)
- flagged: none
- decided: covered the five contractual translations without turning an SSR comparison into framework instruction; added only hydration, build step, and bundler as new canonical terms.
- next: ch-02 exercise

## 2026-08-13 · ch-02 · exercise
- wrote: `course/part-01-the-mental-model/ch-02-translating-what-you-already-know/exercise.md` and `starter/assets/cart-guard.css`
- flagged: none
- decided: the starter contains presentation only; the learner must decide the theme boundaries, explicit inputs, server-rendered cart truth, and editor configuration from the lesson.
- next: ch-02 solution

## 2026-08-13 · ch-02 · solution
- wrote: `solutions/part-01-the-mental-model/ch-02-translating-what-you-already-know/solution.md` and mirrored `solution/{sections/cart-guard.liquid,snippets/cart-guard-message.liquid,assets/cart-guard.css}`
- flagged: none
- decided: the cart request supplies the initial truth; the section owns editor configuration, the snippet owns repeated markup with named inputs, and the stretch remains direction-only for post-render cart updates.
- next: ch-02 review; do not add solution-derived structure or hints to `course/`.

## 2026-08-14 · ch-02 · review
- wrote: finalised `course/part-01-the-mental-model/ch-02-translating-what-you-already-know/{lesson.md,exercise.md,BRIEF.md}` and its mirrored solution status
- flagged: none
- decided: review checklist passed 10/10; the exercise and solution were expanded solely to meet the new chapter-18 calibration floors (705 and 1,270 words) without adding solution structure to the lesson or exercise.
- next: ch-03 lesson

## 2026-08-14 · ch-03 · lesson
- wrote: `course/part-01-the-mental-model/ch-03-the-shopify-object-graph/lesson.md` (1,947 words)
- flagged: none
- decided: taught the object graph as contextual data access, not an arbitrary query surface; used named snippet input and repeated traversal as the concrete bridge from familiar frontend models.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md` with object graph, global object, and scoped object.
- next: ch-03 exercise

## 2026-08-14 · ch-01 · exercise · redo
- wrote: expanded `course/part-01-the-mental-model/ch-01-where-liquid-actually-sits/exercise.md` to 751 words
- flagged: none
- decided: added merchant context, degradation checks, and observable acceptance criteria without revealing the solution’s file or code structure.
- next: ch-01 solution redo

## 2026-08-14 · ch-01 · solution · redo
- wrote: expanded `solutions/part-01-the-mental-model/ch-01-where-liquid-actually-sits/solution.md` to 1,271 words
- flagged: none
- decided: deepened the ownership, degradation, and component-scope rationale while keeping the implemented answer unchanged.
- next: ch-03 lesson redo

## 2026-08-14 · ch-03 · lesson · redo
- wrote: expanded `course/part-01-the-mental-model/ch-03-the-shopify-object-graph/lesson.md` to 2,100 words
- flagged: none
- decided: added a context-root diagnostic procedure and reportable debugging sequence without widening the chapter’s object-graph scope.
- next: ch-03 exercise

## 2026-08-14 · ch-03 · exercise
- wrote: `course/part-01-the-mental-model/ch-03-the-shopify-object-graph/exercise.md` (789 words)
- flagged: none
- decided: the exercise makes absence meaningful across product, collection, and cart contexts; it avoids a data dump or arbitrary query so the learner must reason from documented graph roots.
- next: ch-03 solution

## 2026-08-14 · ch-03 · lesson · calibration redo
- wrote: expanded `course/part-01-the-mental-model/ch-03-the-shopify-object-graph/lesson.md` to 2,375 words
- flagged: none
- decided: deepened the root/relationship/context decision test, explicit scoped-input refactoring, and traversal-intent discipline without adding object surfaces beyond this chapter.
- next: ch-03 solution

## 2026-08-14 · ch-03 · solution
- wrote: `solutions/part-01-the-mental-model/ch-03-the-shopify-object-graph/solution.md` (1,426 words) and mirrored `solution/sections/context-probe.liquid`
- flagged: none
- decided: the solution treats unavailable template objects as diagnostic evidence, separates request, template, and section roots, and avoids browser or network behavior so the initial render remains authoritative.
- next: ch-03 review; do not add solution-derived structure or hints to `course/`.

## 2026-08-14 · ch-03 · exercise · starter redo
- wrote: added `starter/assets/context-probe.css` and updated the exercise starter guidance
- flagged: none
- decided: supplied presentation only, leaving the Liquid boundary, schema, template placement, and object-graph reasoning as the learner’s real work.
- next: ch-03 review

## 2026-08-14 · ch-03 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses
- flagged: corrected a genuine classification error during review: `cart` is global cart state, not a template-scoped object.
- decided: checklist passed after aligning the graph map, exercise expectations, implementation, and walkthrough with the canonical object reference; no solution-derived structure was added to the lesson or exercise.
- next: ch-04 lesson

## 2026-08-14 · ch-04 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-04-syntax-fundamentals/lesson.md` (2,412 words)
- flagged: none
- decided: taught delimiters as explicit rendering boundaries, keeping later topics such as conditions, data shaping, component contracts, and browser serialization deferred to their assigned chapters.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md` with the chapter’s syntax terms.
- next: ch-04 exercise

## 2026-08-14 · ch-04 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-04-syntax-fundamentals/exercise.md` (823 words) with `starter/sections/syntax-audit.liquid` and `starter/assets/syntax-audit.css`
- flagged: none
- decided: the starter provides a runnable section and finished presentation while leaving every syntax boundary, source-only note, literal browser template, and documentation choice to the learner.
- next: ch-04 solution

## 2026-08-14 · ch-04 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-04-syntax-fundamentals/solution.md` (1,409 words) with mirrored `solution/sections/syntax-audit.liquid` and `solution/assets/syntax-audit.css`
- flagged: none
- decided: separated the server-rendered availability decision from the preserved browser-template literal, and mapped each required syntax form to a narrowly scoped responsibility.
- next: ch-04 review; never let its completed answer sharpen the lesson or exercise.

## 2026-08-14 · ch-04 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses
- flagged: none
- decided: checklist passed 10/10; review corrected no scope or platform gaps and did not add solution-derived structure to the lesson or exercise.
- next: ch-05 lesson

## 2026-08-14 · ch-05 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-05-types-truthiness-nil/lesson.md` (2,491 words)
- flagged: `[VERIFY]` for object-specific EmptyDrop outcomes and comparison coercion contracts; the lesson directs readers to verify the relevant object or filter reference rather than assuming a universal result.
- decided: separated missing data, empty content, collection emptiness, and invalid property paths so silent output remains diagnosable instead of being papered over with generic fallbacks.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-05 exercise

## 2026-08-14 · ch-05 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-05-types-truthiness-nil/exercise.md` (800 words) with `starter/sections/launch-readiness.liquid` and `starter/assets/launch-readiness.css`
- flagged: the learner brief directs object-specific empty-result uncertainty to `> [VERIFY]` and the documented object reference.
- decided: the starter removes presentation but leaves the state classification, guards, fallback copy, and numeric-display separation as the learner’s actual implementation work.
- next: ch-05 solution

## 2026-08-14 · ch-05 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-05-types-truthiness-nil/solution.md` (1,371 words) with mirrored `solution/sections/launch-readiness.liquid` and `solution/assets/launch-readiness.css`
- flagged: `[VERIFY]` retained for product-image empty-result behavior when a production feature needs more granular source-specific handling.
- decided: separated availability, blank merchant content, optional image absence, and numeric cart state into independent outputs and test cases.
- next: ch-05 review; do not add solution-derived details to the lesson or exercise.

## 2026-08-14 · ch-05 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses
- flagged: retained `[VERIFY]` for source-specific EmptyDrop and product-image empty-result behavior; no unsupported universal claim was added.
- decided: checklist passed after confirming the six scope items, target lengths, starter/solution parity, terminology, and strict separation between review corrections and solution knowledge.
- next: ch-06 lesson

## 2026-08-14 · ch-06 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-06-variables-scope/lesson.md` (2,506 words)
- flagged: `[VERIFY]` for any counter behavior relied upon across a specific nesting boundary; the lesson keeps counters out of hidden component state.
- decided: framed `render` arguments as explicit function signatures and local names as type-and-ownership signals rather than informal global state.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-06 exercise

## 2026-08-14 · ch-06 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-06-variables-scope/exercise.md` (802 words) with starter section, snippet, and CSS asset
- flagged: the brief directs any unverified counter behavior across a nesting boundary to `> [VERIFY]` instead of a hidden scope assumption.
- decided: starter files establish a real section-to-snippet boundary but leave value ownership, explicit inputs, ordering strategy, and rendered-string choice to the learner.
- next: ch-06 solution

## 2026-08-14 · ch-06 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-06-variables-scope/solution.md` (1,368 words) with mirrored section, snippet, and CSS files
- flagged: `[VERIFY]` retained for any counter behavior whose nesting-boundary semantics become part of a production contract.
- decided: used a loop-local ordinal instead of a named counter and treated every `render` call as the complete, reusable snippet API.
- next: ch-06 review; do not let the solution sharpen the lesson or exercise.

## 2026-08-14 · ch-06 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses
- flagged: retained `[VERIFY]` for production reliance on counter behavior across a particular nesting boundary.
- decided: checklist passed after confirming scope coverage, calibrated lengths, three-file starter and solution parity, terminology, and review isolation from the completed answer.
- next: ch-07 lesson

## 2026-08-14 · ch-07 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-07-control-flow/lesson.md` (2,504 words)
- flagged: `[VERIFY]` for object-specific properties or tag contracts that would otherwise be inferred through broad `contains` logic.
- decided: converted no-parentheses precedence into nested and named decisions, and kept default fallbacks honest about their data owner.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-07 exercise

## 2026-08-14 · ch-07 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-07-control-flow/exercise.md` (743 words) with starter section and CSS asset
- flagged: the brief directs any unverified object-specific eligibility surface to `> [VERIFY]` rather than broad text classification.
- decided: starter preserves a merchant-facing priority panel while leaving the nested grouping, intermediate decisions, tone dispatch, and fallback ownership to the learner.
- next: ch-07 solution

## 2026-08-14 · ch-07 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-07-control-flow/solution.md` (1,358 words) with mirrored section and CSS files
- flagged: `[VERIFY]` retained for any object-specific production eligibility surface substituted for the explicit seasonal-tag contract.
- decided: made availability the outer gate, used a named membership decision, and nested tone presentation under established eligibility.
- next: ch-07 review; do not add solution-derived details to the lesson or exercise.

## 2026-08-14 · ch-07 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses
- flagged: retained `[VERIFY]` for any production replacement of the explicit seasonal-tag contract by an object-specific eligibility surface.
- decided: checklist passed after confirming all six scope items, target lengths, starter and solution parity, right-to-left precedence guidance, and review isolation from solution knowledge.
- next: ch-08 lesson
## 2026-08-14 · ch-08 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-08-iteration/lesson.md` (target-calibrated) covering bounded traversal, loop metadata, controls, `cycle`, `tablerow`, nested-loop cost, and costly sources.
- flagged: `[VERIFY]` for production `tablerow` structure and metadata requirements, and for current `all_products` lookup limits and behavior.
- decided: treated source selection, visible bounds, and collection-empty output as one loop contract; deferred data shaping to ch-09 and performance profiling to ch-11.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-08 exercise
## 2026-08-14 · ch-08 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-08-iteration/exercise.md` (874 words) with a section, stylesheet, and narrow presentation snippet under `starter/`.
- flagged: `[VERIFY]` for any added variant property beyond the explicit contextual collection and title contract.
- decided: used a bounded collection digest to require contextual sourcing, loop metadata, named visual alternation, nested-loop limits, and a distinct collection-empty state without introducing data shaping.
- next: ch-08 solution
## 2026-08-14 · ch-08 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-08-iteration/solution.md` (1,332 words) with mirrored section, stylesheet, and narrow variant-note snippet.
- flagged: `[VERIFY]` for any production expansion beyond the explicit variant-title contract.
- decided: bounded the output at four contextual products and two variant notes per product, separated collection absence from per-product variant absence, and kept the named cycle presentation-only.
- next: ch-08 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-08 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for production use of `tablerow`, `all_products`, and any expanded variant-property surface.
- decided: the review confirmed every scope item, target-calibrated files, three-file starter and solution parity, bounded contextual traversal, and isolation of the lesson from solution-derived additions.
- next: ch-09 lesson
## 2026-08-14 · ch-09 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-09-filters-the-core-set/lesson.md` (2,412 words) covering filter pipelines, strings, output-context safety, math, money, arrays, dates, and diagnostics.
- flagged: `[VERIFY]` for derived resource handles, money representation, property-sensitive array filters, and timezone or locale-aware production date formatting.
- decided: treated every filter chain as a typed transformation contract and kept commerce, localization, and browser handoff at their owned boundaries.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-09 exercise
## 2026-08-14 · ch-09 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-09-filters-the-core-set/exercise.md` (843 words) with a section, stylesheet, and JSON-boundary snippet under `starter/`.
- flagged: `[VERIFY]` for any expansion beyond the supplied contextual collection and tag property contract.
- decided: made the learner establish distinct HTML, URL, and JSON boundaries while keeping all derived tags contextual, clean, unique, and naturally ordered.
- next: ch-09 solution
## 2026-08-14 · ch-09 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-09-filters-the-core-set/solution.md` (1,344 words) with mirrored section, stylesheet, and narrow JSON serialization snippet.
- flagged: `[VERIFY]` for production reliance on nested tag-array flattening and any expansion beyond the declared collection title, URL, description, and contextual tags.
- decided: made each output boundary explicit—HTML escaping, query-component URL encoding, and field-level JSON serialization—while keeping the panel contextual and non-behavioral.
- next: ch-09 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-09 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for derived resource handles, money representation, array-property behavior, and production timezone or locale assumptions.
- decided: checklist passed after confirming all eight scope items, calibrated prose, starter/solution parity, output-context separation, and review isolation from the completed answer.
- next: ch-10 lesson
## 2026-08-14 · ch-10 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/lesson.md` (2,358 words) covering Shopify-specific filter categories and their owning data contexts.
- flagged: `[VERIFY]` for legacy URL/image filters and context-sensitive media, localization, font, payment, customer, and structured-data helper behavior.
- decided: distinguished resource resolution from markup output, delegated commerce and market authority to Shopify data contracts, and treated generated HTML or JSON as explicit integration boundaries.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-10 exercise
## 2026-08-14 · ch-10 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/exercise.md` with a product section, CSS, and narrow product-data snippet under `starter/`.
- flagged: `[VERIFY]` for the chosen metafield type and production image-filter options.
- decided: constrained the card to Shopify-owned money, image, translation, metafield, and JSON boundaries without adding price authority or product eligibility logic.
- next: ch-10 solution
## 2026-08-14 · ch-10 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-10-filters-the-shopify-specific-set/solution.md` (1,319 words) with mirrored section, stylesheet, and narrow product-data snippet.
- flagged: `[VERIFY]` for market money policy, image options, and any change to the declared metafield type or component scope.
- decided: used Shopify-owned boundaries for locale copy, price, image, typed metafield, and field-level JSON while leaving commerce and browser behavior to their specialized chapters.
- next: ch-10 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-10 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for legacy URL/image filters and context-sensitive media, font, localization, payment, customer, and structured-data output.
- decided: checklist passed after confirming all ten scope items, calibrated files, starter/solution parity, platform-owned filter boundaries, and review isolation from the completed answer.
- next: ch-11 lesson
## 2026-08-14 · ch-11 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-11-drops-in-depth/lesson.md` covering Drop interfaces, deferred relations, cost review, safe iteration, and minimal public JSON.
- flagged: `[VERIFY]` for production Drop availability, runtime property cost, and exact fields emitted when serializing any Drop or relation.
- decided: treated every relationship access as a bounded public-data and rendering-cost decision rather than an ordinary local object read.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-11 exercise
## 2026-08-14 · ch-11 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-11-drops-in-depth/exercise.md` with a bounded-drop section, stylesheet, and minimal JSON snippet under `starter/`.
- flagged: `[VERIFY]` for any expanded Drop relationship, its runtime cost, and its public exposure need.
- decided: made the learner state four outer products, two inner variants, one visible image relationship, and a three-field public payload.
- next: ch-11 solution
## 2026-08-14 · ch-11 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-11-drops-in-depth/solution.md` with mirrored section, stylesheet, and three-field JSON snippet.
- flagged: `[VERIFY]` for every future Drop relation’s availability, cost, and public exposure requirement.
- decided: bounded the implementation at four contextual products, two variants per card, one direct image relation, and a minimal public payload.
- next: ch-11 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-11 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for Drop availability, relation cost, and public JSON exposure before production expansion.
- decided: checklist confirmed all five scope items, starter/solution parity, bounded access shapes, and review isolation from the solution.
- next: ch-12 lesson
## 2026-08-14 · ch-12 · lesson
- wrote: `course/part-02-the-liquid-language-properly/ch-12-errors-debugging-observability/lesson.md` covering error classes, minimal diagnostics, URL/editor workflows, guards, and flame profiles.
- flagged: `[VERIFY]` for current URL-parameter behavior, environment signals, and serialized Drop field surfaces.
- decided: treated every debugging output as a minimal public boundary and every performance change as a comparable measured hypothesis.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-12 exercise
## 2026-08-14 · ch-12 · exercise
- wrote: `course/part-02-the-liquid-language-properly/ch-12-errors-debugging-observability/exercise.md` with a guarded diagnostic section, CSS, and minimal debug snippet under `starter/`.
- flagged: `[VERIFY]` for actual debug-guard ownership and the current exposure surface of any serialized value.
- decided: separated missing-setting, selected-empty, and normal states while making the debug API explicit and disabled by default.
- next: ch-12 solution
## 2026-08-14 · ch-12 · solution
- wrote: `solutions/part-02-the-liquid-language-properly/ch-12-errors-debugging-observability/solution.md` with mirrored section, CSS, and guarded minimal debug snippet.
- flagged: `[VERIFY]` for debug-guard ownership and any expansion of the public diagnostic payload.
- decided: kept configuration absence, selected-empty state, normal output, and guarded diagnostics as distinct, reproducible contracts.
- next: ch-12 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-12 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for URL diagnostic behavior, guard ownership, and serialized payload exposure.
- decided: checklist confirmed all six scope items, starter/solution parity, distinct debug states, and review isolation from the completed answer.
- next: ch-13 lesson
## 2026-08-14 · ch-13 · lesson
- wrote: `course/part-03-theme-architecture/ch-13-anatomy-of-a-theme/lesson.md` covering directory contracts, special files, verified limits, and theme runtime boundaries.
- flagged: `[VERIFY]` for current special-file schema and placement rules before creating architecture surfaces.
- decided: used verified limits as component-design signals and separated theme rendering responsibilities from application, API, and checkout work.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-13 exercise
## 2026-08-14 · ch-13 · exercise
- wrote: `course/part-03-theme-architecture/ch-13-anatomy-of-a-theme/exercise.md` with section, snippet, CSS, and locale starter files.
- flagged: `[VERIFY]` for current locale and section-schema file-shape requirements before production use.
- decided: made directory placement, explicit snippet input, locale-owned copy, and bounded section preview observable in one small component.
- next: ch-13 solution
## 2026-08-14 · ch-13 · solution
- wrote: `solutions/part-03-theme-architecture/ch-13-anatomy-of-a-theme/solution.md` with mirrored section, snippet, asset, and locale files.
- flagged: `[VERIFY]` for production locale and section-schema conventions before merging into a target theme.
- decided: separated editor schema, selected-collection state, bounded snippet rendering, theme asset delivery, and locale copy into their owning homes.
- next: ch-13 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-13 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for current production locale and schema conventions.
- decided: checklist confirmed all four scope items, file-home parity, verified platform limits, and review isolation from the completed answer.
- next: ch-14 lesson
## 2026-08-14 · ch-14 · lesson
- wrote: `course/part-03-theme-architecture/ch-14-layouts/lesson.md` covering layout slots, alternate frames, special layouts, and checkout migration boundaries.
- flagged: `[VERIFY]` for alternate-layout, layout-none, and special-layout behavior before production use.
- decided: treated the layout as a singular document frame with one platform head slot and one template render slot.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-14 exercise
## 2026-08-14 · ch-14 · exercise
- wrote: `course/part-03-theme-architecture/ch-14-layouts/exercise.md` with minimal layout, CSS, and explicit campaign-callout starter files.
- flagged: `[VERIFY]` for current template compatibility before selecting an alternate production layout.
- decided: made the document frame, single Shopify slots, skip-link target, and snippet/layout boundary observable in the starter.
- next: ch-14 solution
## 2026-08-14 · ch-14 · solution
- wrote: `solutions/part-03-theme-architecture/ch-14-layouts/solution.md` with mirrored minimal layout, asset, and explicit campaign-callout snippet.
- flagged: `[VERIFY]` for compatible production template selection of the alternate layout.
- decided: preserved singular Shopify slots, document-level accessibility, and the boundary between frame concerns and template content.
- next: ch-14 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-14 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for alternate-layout compatibility before production selection.
- decided: checklist confirmed all six scope items, starter/solution parity, singular layout slots, and review isolation from the completed answer.
- next: ch-15 lesson
## 2026-08-14 · ch-15 · lesson
- wrote: `course/part-03-theme-architecture/ch-15-templates/lesson.md` covering template families, JSON/Liquid trade-offs, suffix routing, JSON anatomy, contextual objects, and assignments.
- flagged: `[VERIFY]` for current JSON-template support and object availability by target template type.
- decided: treated template suffixes as durable merchant composition choices and JSON entries as schema-constrained section instances.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-15 exercise
## 2026-08-14 · ch-15 · exercise
- wrote: `course/part-03-theme-architecture/ch-15-templates/exercise.md` with a JSON product alternate plus section, asset, locale, and template starter files.
- flagged: `[VERIFY]` for current JSON-template and merchant assignment support before production use.
- decided: made product-specific versus reusable section context, JSON instance ordering, locale copy, and suffix lifecycle explicit.
- next: ch-15 solution
## 2026-08-14 · ch-15 · solution
- wrote: `solutions/part-03-theme-architecture/ch-15-templates/solution.md` with mirrored JSON template, sections, asset, locale, and assignment lifecycle guidance.
- flagged: `[VERIFY]` for current production JSON-template and product-alternate assignment support.
- decided: kept template instance configuration, product context, section settings, locale defaults, and merchant assignment as separate contracts.
- next: ch-15 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-15 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for JSON-template and alternate-assignment support in production contexts.
- decided: checklist confirmed all six scope items, starter/solution parity, merchant lifecycle coverage, and review isolation from the completed answer.
- next: ch-16 lesson
## 2026-08-14 · ch-16 · lesson
- wrote: `course/part-03-theme-architecture/ch-16-section-groups/lesson.md` covering persistent groups, layout mounts, group/template distinction, and overlays.
- flagged: `[VERIFY]` for current group type, naming, placement, and `{% sections %}` syntax support.
- decided: assigned persistent composition to layout-owned groups while preserving resource-specific content for template composition.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-16 exercise
## 2026-08-14 · ch-16 · exercise
- wrote: `course/part-03-theme-architecture/ch-16-section-groups/exercise.md` with header/aside group JSON, layout fragment, sections, CSS, and locale starter files.
- flagged: `[VERIFY]` for current group naming, group-member eligibility, and layout mount syntax.
- decided: made global header and aside ownership explicit while deferring drawer behavior and route-specific data.
- next: ch-16 solution
## 2026-08-14 · ch-16 · solution
- wrote: `solutions/part-03-theme-architecture/ch-16-section-groups/solution.md` with mirrored group manifests, sections, layout fragment, asset, and locale files.
- flagged: `[VERIFY]` for current group member eligibility, names, and layout mount support.
- decided: separated persistent group ordering, singular layout mounting, global data discipline, and deferred interactive drawer behavior.
- next: ch-16 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-16 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for group syntax, naming, and member eligibility in current Shopify theme architecture.
- decided: checklist confirmed all five scope items, starter/solution parity, persistent ownership, and review isolation from the completed answer.
- next: ch-17 lesson
## 2026-08-14 · ch-17 · lesson
- wrote: `course/part-03-theme-architecture/ch-17-sections/lesson.md` covering anatomy, section object, schema controls, placement, limits, resources, and localization.
- flagged: `[VERIFY]` for current `section.index`/`location` semantics and section resource aggregation behavior.
- decided: treated schema as a constrained merchant product interface and resource aggregation as delivery rather than free performance.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-17 exercise
## 2026-08-14 · ch-17 · exercise
- wrote: `course/part-03-theme-architecture/ch-17-sections/exercise.md` with a localized feature-list section and locale starter files.
- flagged: `[VERIFY]` for current schema, placement, and section resource-block behavior.
- decided: constrained the editor task to four feature blocks, instance-safe IDs, schema localization, and progressive enhancement.
- next: ch-17 solution
## 2026-08-14 · ch-17 · solution
- wrote: `solutions/part-03-theme-architecture/ch-17-sections/solution.md` with mirrored localized section and explicit section/block contract guidance.
- flagged: `[VERIFY]` for current schema placement, localization, and resource aggregation behavior.
- decided: kept section identity, block limits, merchant schema, placement, and progressive resources as separate reviewable contracts.
- next: ch-17 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-17 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for current schema, placement, and aggregated resource behavior.
- decided: checklist confirmed all seven scope items, starter/solution parity, editor contract coverage, and review isolation from the completed answer.
- next: ch-19 lesson
## 2026-08-14 · ch-19 · lesson
- wrote: `course/part-03-theme-architecture/ch-19-theme-blocks-in-depth/lesson.md` covering file visibility, schema, nesting, wildcards, static blocks, limits, and editor attributes.
- flagged: `[VERIFY]` for current theme-block schema, wildcard, nesting, and editor-behavior rules.
- decided: treated block files as governed editor capability surfaces with explicit parent contracts and shallow composition.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-19 exercise
## 2026-08-14 · ch-19 · exercise
- wrote: `course/part-03-theme-architecture/ch-19-theme-blocks-in-depth/exercise.md` with public/private block and governed parent-contract starter files.
- flagged: `[VERIFY]` for current block visibility, wildcard, static-child, and app-block eligibility rules.
- decided: made public editor capability, private implementation, shallow nesting, and wildcard governance explicit.
- next: ch-19 solution
## 2026-08-14 · ch-19 · solution
- wrote: `solutions/part-03-theme-architecture/ch-19-theme-blocks-in-depth/solution.md` with mirrored public/private block and governed parent-contract files.
- flagged: `[VERIFY]` for current block visibility, wildcard, app eligibility, and static-child behaviors.
- decided: separated public capability, private structure, parent semantics, shallow nesting, and library lifecycle governance.
- next: ch-19 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-19 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for theme/app block wildcard, visibility, static-child, and nesting rules.
- decided: checklist confirmed all seven scope items, starter/solution parity, block governance, and review isolation from the completed answer.
- next: ch-20 lesson
## 2026-08-14 · ch-20 · lesson
- wrote: `course/part-03-theme-architecture/ch-20-content-for/lesson.md` covering dynamic/static slots, JSON ordering, capture/render wrappers, and composable parent contracts.
- flagged: `[VERIFY]` for current dynamic/static `content_for` eligibility and static block declaration rules.
- decided: kept Shopify composition order authoritative while assigning semantics and acceptance boundaries to the parent.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-20 exercise
## 2026-08-14 · ch-20 · exercise
- wrote: `course/part-03-theme-architecture/ch-20-content-for/exercise.md` with static/dynamic block, section, and wrapper-snippet starter files.
- flagged: `[VERIFY]` for current static/dynamic content_for and capture/render support.
- decided: separated fixed title placement, JSON-owned dynamic ordering, and explicit wrapper snippet input.
- next: ch-20 solution
## 2026-08-14 · ch-20 · solution
- wrote: `solutions/part-03-theme-architecture/ch-20-content-for/solution.md` with mirrored static/dynamic block, section, and explicit wrapper files.
- flagged: `[VERIFY]` for current static/dynamic content_for and declaration rules.
- decided: enforced singular static placement, JSON-owned child order, and a wrapper snippet without hidden Shopify context.
- next: ch-20 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-20 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for dynamic/static content_for eligibility and declaration rules.
- decided: checklist confirmed all five scope items, starter/solution parity, explicit composition ownership, and review isolation from the completed answer.
- next: ch-21 lesson
## 2026-08-14 · ch-21 · lesson
- wrote: `course/part-03-theme-architecture/ch-21-snippets/lesson.md` covering render isolation, include deprecation, parameter APIs, recursion, docs, and surface choice.
- flagged: `[VERIFY]` for current render scope, navigation recursion, and doc-tag tooling behavior.
- decided: assigned data selection to callers and explicit rendering contracts to snippets.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-21 exercise
## 2026-08-14 · ch-21 · exercise
- wrote: `course/part-03-theme-architecture/ch-21-snippets/exercise.md` with a recursive navigation snippet, section, CSS, and documentation starter files.
- flagged: `[VERIFY]` for current doc-tag support and navigation link depth/properties.
- decided: made render isolation, caller-owned selection, finite recursion, and documented input contracts explicit.
- next: ch-21 solution
## 2026-08-14 · ch-21 · solution
- wrote: `solutions/part-03-theme-architecture/ch-21-snippets/solution.md` with mirrored recursive snippet, calling section, and CSS files.
- flagged: `[VERIFY]` for current doc-tag and navigation object/depth support.
- decided: kept menu selection in the section and one-level rendering in an explicit recursive snippet API.
- next: ch-21 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-21 · review
- wrote: finalised the chapter’s lesson, exercise, brief, and solution statuses.
- flagged: retained `[VERIFY]` for current render, navigation, and doc-tag behavior.
- decided: checklist confirmed all seven scope items, starter/solution parity, explicit API coverage, and review isolation from the completed answer.
- next: ch-22 lesson
## 2026-08-14 · ch-22 · lesson
- wrote: `course/part-03-theme-architecture/ch-22-settings-architecture/lesson.md` covering schema ordering, input/sidebar types, `visible_if`, merchant-owned configuration state, presets, schemes, and settings UX.
- flagged: retained `[VERIFY]` for currently supported settings types, attributes, limits, and valid contexts.
- decided: treated global setting IDs and defaults as a durable versioned API, and kept configuration ownership distinct from local section and block decisions.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-22 exercise
## 2026-08-14 · ch-22 · exercise
- wrote: `course/part-03-theme-architecture/ch-22-settings-architecture/exercise.md` plus realistic global schema, promotion section, and CSS starter files.
- flagged: `[VERIFY]` for current settings-type, `visible_if`, persistence, and context behavior.
- decided: made the reader design a small token-led merchant interface rather than expose raw visual properties.
- next: ch-22 solution
## 2026-08-14 · ch-22 · solution
- wrote: `solutions/part-03-theme-architecture/ch-22-settings-architecture/solution.md` with mirrored global schema, promotion section, and CSS files.
- flagged: `[VERIFY]` for the current `color_scheme` contract, theme scheme classes, `visible_if` syntax, and accepted setting attributes.
- decided: kept state ownership global, guarded the hidden-but-persisted destination in Liquid, and selected a governed surface rather than individual colors.
- next: ch-22 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-22 · review
- reviewed: passed the seven numbered brief items in order, exercise solvability, terminology alignment, ledger updates, calibration floor, and starter/solution mirrors.
- flagged: retained `[VERIFY]` where settings-type support, `visible_if`, color schemes, and persistence behavior require current Shopify documentation.
- decided: no solution-derived structures were added to the lesson or exercise; only completion markers were applied.
- next: ch-23 lesson
## 2026-08-14 · ch-23 · lesson
- wrote: `course/part-03-theme-architecture/ch-23-the-theme-editor-contract/lesson.md` covering editor identity, lifecycle events, live reordering, dynamic sources, and onboarding defaults.
- flagged: `[VERIFY]` for current editor event payloads, `shopify_attributes` placement, and dynamic-source compatibility.
- decided: isolated behavior to stable instance roots and made editor lifecycle behavior additive rather than a prerequisite for the customer storefront.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-23 exercise
## 2026-08-14 · ch-23 · exercise
- wrote: `course/part-03-theme-architecture/ch-23-the-theme-editor-contract/exercise.md` with realistic section, CSS, and JavaScript starter files.
- flagged: `[VERIFY]` for editor-event payloads, dynamic sources, and `shopify_attributes` rules.
- decided: required instance-local behavior, lifecycle cleanup, source fallbacks, and non-destructive onboarding without exposing a solution structure.
- next: ch-23 solution
## 2026-08-14 · ch-23 · solution
- wrote: `solutions/part-03-theme-architecture/ch-23-the-theme-editor-contract/solution.md` with mirrored section, JavaScript, and CSS files.
- flagged: `[VERIFY]` for current editor-event targets/payloads and compatible dynamic-source and richtext contracts.
- decided: used a stable instance root, idempotent mounting, symmetric cleanup, and editor-only transient selection state.
- next: ch-23 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-23 · review
- reviewed: passed six numbered brief items in order, exercise solvability, terminology, ledger updates, calibration floor, and starter/solution parity.
- flagged: retained `[VERIFY]` for live event contracts, editor attributes, source compatibility, and typed richtext rendering.
- decided: no solution-derived structure was added to the lesson or exercise; only final markers and brief completion were applied.
- next: ch-24 lesson
## 2026-08-14 · ch-24 · lesson
- wrote: `course/part-03-theme-architecture/ch-24-ai-generated-blocks/lesson.md` covering merchant generation, `@theme`/`@app`, block slots, `_blocks.liquid`, and design-system governance.
- verified: consulted current Shopify documentation for wrapper preconditions, generation lifecycle, and app-block compatibility; cited those sources in the lesson.
- decided: treated generated blocks as maintained theme code constrained by an intentional parent contract and review protocol.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-24 exercise
## 2026-08-14 · ch-24 · exercise
- wrote: `course/part-03-theme-architecture/ch-24-ai-generated-blocks/exercise.md` plus starter surfaces, wrapper, CSS, and code-review register.
- flagged: `[VERIFY]` for live wrapper preconditions, generic block acceptance, and generation availability.
- decided: made the reader own the composition contract and generated-code review rather than merely prompting an AI.
- next: ch-24 solution
## 2026-08-14 · ch-24 · solution
- wrote: `solutions/part-03-theme-architecture/ch-24-ai-generated-blocks/solution.md` with mirrored open surface, valid wrapper, wrapper CSS, and review register.
- verified: aligned wrapper preconditions and generic block categories with the Shopify documentation gathered for the lesson.
- decided: placed visual governance in the wrapper and preserved generated blocks as independently rendered child code.
- next: ch-24 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-24 · review
- reviewed: passed four numbered brief items, verified wrapper claims against current Shopify documentation, exercise solvability, terminology, ledger updates, calibration floor, and starter/solution parity.
- decided: applied only completion markers; no solution-derived implementation was transferred into the lesson or exercise.
- next: ch-25 lesson
## 2026-08-14 · ch-25 · lesson
- wrote: `course/part-03-theme-architecture/ch-25-on-the-horizon-block-and-partial/lesson.md` covering the Liquid July ’26 preview, direct blocks, partials, Liquid-first composition, coexistence, and experiment discipline.
- verified: consulted current Shopify developer-preview documents and cited all preview-specific claims.
- decided: taught the capability only as an explicitly reversible preview track, never as a replacement promise for JSON templates or section groups.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-25 exercise
## 2026-08-14 · ch-25 · exercise
- wrote: `course/part-03-theme-architecture/ch-25-on-the-horizon-block-and-partial/exercise.md` with preview-only template, block, JavaScript, and evaluation starter files.
- flagged: `[VERIFY]` for feature-preview activation, tag syntax, and partial-rendering package contract.
- decided: required an isolated and reversible experiment rather than a migration of the stable JSON or section-group architecture.
- next: ch-25 solution
## 2026-08-14 · ch-25 · solution
- wrote: `solutions/part-03-theme-architecture/ch-25-on-the-horizon-block-and-partial/solution.md` with mirrored preview template, block, partial-refresh script, and evaluation file.
- verified: retained the feature-preview restriction and partial refresh behavior from Shopify’s current developer-preview references.
- decided: isolated direct-block composition and partial refresh behind an explicit withdrawal decision rather than a stable migration claim.
- next: ch-25 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-25 · review
- reviewed: passed six numbered preview topics in order, cited current preview facts, exercise solvability, terminology, ledger updates, calibration floor, and starter/solution parity.
- decided: applied final markers only; no solution-derived implementation was transferred to the lesson or exercise, and all preview code remains explicitly non-production.
- next: ch-26 lesson
## 2026-08-14 · ch-26 · lesson
- wrote: `course/part-04-data-objects/ch-26-global-objects/lesson.md` covering shop, request, routes, global context objects, localization, and link trees.
- verified: consulted current official Shopify object references for `shop`, `request`, `routes`, and `localization`, and cited them in the lesson.
- decided: framed global reads as ownership and context contracts, including documented shop-property deprecations.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-26 exercise
## 2026-08-14 · ch-26 · exercise
- wrote: `course/part-04-data-objects/ch-26-global-objects/exercise.md` with footer, navigation snippet, and CSS starter files.
- flagged: `[VERIFY]` for current global-object, localization-form, menu, route, and link-property contracts.
- decided: made the reader replace every hardcoded context assumption with the owner-specific global object and a safe absent state.
- next: ch-26 solution
## 2026-08-14 · ch-26 · solution
- wrote: `solutions/part-04-data-objects/ch-26-global-objects/solution.md` with mirrored footer, navigation snippet, and CSS files.
- verified: based object, route, localization, payment, and deprecation claims on the current Shopify references used in the lesson.
- decided: limited `request.design_mode` to a non-functional analytics guard while keeping all merchant and customer content contextually faithful.
- next: ch-26 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-26 · review
- reviewed: passed six numbered object topics, source-backed deprecation claims, exercise solvability, terminology, ledgers, calibration floor, and starter/solution parity.
- decided: applied final markers only; no solution-specific construction was added to the lesson or exercise.
- next: ch-27 lesson
## 2026-08-14 · ch-27 · lesson
- wrote: `course/part-04-data-objects/ch-27-products/lesson.md` covering product summaries, variant selection, pricing, inventory, media, subscriptions, metafields, and metadata.
- verified: consulted current official Shopify references for product, variant, product-variant support, and selling-plan contracts; cited them in the lesson.
- decided: made the selected variant the explicit source for transactional state while reserving product properties for range and resource summaries.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-27 exercise
## 2026-08-14 · ch-27 · exercise
- wrote: `course/part-04-data-objects/ch-27-products/exercise.md` with main-product, media, and CSS starter files.
- flagged: `[VERIFY]` for current option-value, media, quantity, selling-plan, and metafield contracts.
- decided: required the reader to preserve deep-linked variant truth and model all purchase state around a deliberate current variant.
- next: ch-27 solution
## 2026-08-14 · ch-27 · solution
- wrote: `solutions/part-04-data-objects/ch-27-products/solution.md` with mirrored main-product, media, and CSS solution files.
- verified: retained selected variant, availability, media, quantity, plan, and metafield contracts from the current Shopify references.
- decided: established one current-variant source for every transactional display and future client synchronization surface.
- next: ch-27 review; do not add solution-derived details to the lesson or exercise.
