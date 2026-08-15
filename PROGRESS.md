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
## 2026-08-14 · ch-27 · review
- reviewed: passed all nine numbered product topics in order; no out-of-scope chapter content or solution implementation leaked into the lesson or exercise.
- verified: retained current Shopify references and explicit `[VERIFY]` guards for option-value, media, allocation, quantity, and metafield details requiring store-level confirmation.
- decided: applied final status markers only; no pedagogical material derived from the solution was added during review.
- next: ch-28 lesson
## 2026-08-14 · ch-28 · lesson
- wrote: `course/part-04-data-objects/ch-28-variants/lesson.md` covering variant objects, high-variant matching, combined listings, framework-free rendering, and browser serialization.
- verified: consulted current Shopify high-variant, variant-object, and product-variant references; cited their 250-variant and option-value contracts.
- decided: treated unresolved selections and sibling-product transitions as explicit server-owned states rather than browser fallbacks.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-28 exercise
## 2026-08-14 · ch-28 · exercise
- wrote: `course/part-04-data-objects/ch-28-variants/exercise.md` with section, client script, CSS, JSON-state, and test-notes starter files for Lab 11.
- flagged: `[VERIFY]` for Section Rendering API, high-variant option values, combined-listing URLs, and accessible status behavior.
- decided: required an explicit no-variant state and server-recovery path instead of a complete variant cache or local fallback.
- next: ch-28 solution
## 2026-08-14 · ch-28 · solution
- wrote: `solutions/part-04-data-objects/ch-28-variants/solution.md` with mirrored picker section, script, styles, state payload, and verification notes.
- verified: preserved the documented high-variant option-value flow, explicit null-variant state, and combined-listing sibling-product boundary.
- decided: replaced the full surface atomically so price, form ID, media, availability, quantity and plan data cannot originate from different selections.
- next: ch-28 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-28 · review
- reviewed: passed all four numbered variant topics in order, scope boundaries, source flags, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained explicit `[VERIFY]` treatment for integration-level request, option-value, combined-listing, focus, and announcement details.
- decided: applied final markers only; no solution-derived implementation was moved into the lesson or exercise.
- next: ch-29 lesson
## 2026-08-14 · ch-29 · lesson
- wrote: `course/part-04-data-objects/ch-29-collections-filtering-pagination/lesson.md` covering sorting, filtering, facets, pagination, all_products, and performance.
- verified: consulted current official Shopify collection, storefront-filtering, paginate, and all_products references; cited their relevant limits and URL behavior.
- decided: framed collection behavior as server-owned query state with link-first transitions and bounded page/facet cost.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-29 exercise
## 2026-08-14 · ch-29 · exercise
- wrote: `course/part-04-data-objects/ch-29-collections-filtering-pagination/exercise.md` with collection section, facets snippet, CSS, and query-verification starter files.
- flagged: `[VERIFY]` for current filter types, display properties, Section Rendering integration, and merchant configuration behavior.
- decided: required all catalog interactions to keep a URL-native fallback and made empty-result recovery part of the definition of done.
- next: ch-29 solution
## 2026-08-14 · ch-29 · solution
- wrote: `solutions/part-04-data-objects/ch-29-collections-filtering-pagination/solution.md` with mirrored collection section, facets snippet, CSS, and query-verification notes.
- verified: retained current Shopify result-count, filter URL, pagination, all_products-cap, and collection-filter availability contracts.
- decided: used Shopify transition URLs and a collection-owned related source so the catalog preserves query state without a client-side reimplementation.
- next: ch-29 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-29 · review
- reviewed: passed all seven numbered collection topics in order, scope limits, source flags, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained current Shopify contracts for filters, result counts, pagination, render limits, and the `all_products` handle cap.
- decided: applied final markers only; no worked-solution construction was added to the lesson or exercise.
- next: ch-30 lesson
## 2026-08-14 · ch-30 · lesson
- wrote: `course/part-04-data-objects/ch-30-cart-line-items/lesson.md` covering cart context, line items, properties, discounts, data scope, gifts, and bundles.
- verified: consulted current official Shopify cart, line-item, and discount-allocation object references; cited current final-price and deprecation contracts.
- decided: treated backend commerce rules as the authority while teaching the theme to render and capture customer intent honestly.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-30 exercise
## 2026-08-14 · ch-30 · exercise
- wrote: `course/part-04-data-objects/ch-30-cart-line-items/exercise.md` with cart section, cart-line snippet, styles, and cart-state verification starter files.
- flagged: `[VERIFY]` for cart form/update behavior, component/instruction support, property uploads, discount display, and backend gift/bundle configuration.
- decided: required the exercise to preserve Shopify cart authority, distinguish cart and line scope, and prohibit browser-controlled gift pricing.
- next: ch-30 solution
## 2026-08-14 · ch-30 · solution
- wrote: `solutions/part-04-data-objects/ch-30-cart-line-items/solution.md` with mirrored cart section, row snippet, styles, and verification notes.
- verified: used current final prices, allocation objects, cart-level applications, line keys, and scope boundaries rather than deprecated cart/line discount fields.
- decided: left gift and bundle eligibility/pricing with backend commerce rules and treated the theme as an honest current-state renderer.
- next: ch-30 review; do not add solution-derived details to the lesson or exercise.
## 2026-08-14 · ch-30 · review
- reviewed: passed all six numbered cart topics in order, scope limits, official-source flags, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained uncertainty flags for cart integration, component support, property uploads, and backend commerce configuration.
- decided: applied final markers only; no solution-derived implementation was transferred into lesson or exercise content.
- next: ch-31 lesson
## 2026-08-14 · ch-31 · lesson
- wrote: `course/part-04-data-objects/ch-31-customers-accounts/lesson.md` covering customer data, account surfaces, templates, orders, transactions, and tag-gating limits.
- verified: consulted current Shopify customer/order/transaction docs plus 2026 legacy-account deprecation and account-component requirements.
- decided: framed legacy Liquid account pages as maintenance-only and tags strictly as presentation—not authorization.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-31 exercise
## 2026-08-14 · ch-31 · exercise
- wrote: `course/part-04-data-objects/ch-31-customers-accounts/exercise.md` with header, legacy order, segment, style, and verification starter files.
- flagged: `[VERIFY]` for account mode, account-component/menu support, legacy template activation, extension ownership, and B2B authorization.
- decided: required a supported latest-account header integration and defined tags as presentation-only instead of access control.
- next: ch-31 solution
## 2026-08-14 · ch-31 · solution
- wrote: `solutions/part-04-data-objects/ch-31-customers-accounts/solution.md` with mirrored header, legacy order, segment, styles, and account-mode verification files.
- verified: preserved current account-component ownership, buyer-safe order history, and a strict tag-presentation/authorization boundary.
- decided: kept latest account work on Shopify component/extension surfaces while retaining the order template only for legacy maintenance.
- next: ch-31 review; do not add solution-derived implementation to the lesson or exercise.
## 2026-08-14 · ch-31 · review
- reviewed: passed all five numbered customer-account topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained the 2026 legacy-account deprecation and account-component boundary without overclaiming Liquid control over latest account pages.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-32 lesson
## 2026-08-14 · ch-32 · lesson
- wrote: `course/part-04-data-objects/ch-32-content-objects/lesson.md` covering content objects, rich text, archives, full search, and predictive search.
- verified: consulted current official Shopify article, search, predictive-search, and metafield_tag references; cited their type, pagination, and context limits.
- decided: treated content/search output as type-aware server state with a full-search recovery path rather than a generic client data cache.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-32 exercise
## 2026-08-14 · ch-32 · exercise
- wrote: `course/part-04-data-objects/ch-32-content-objects/exercise.md` with article, search, archive, predictive, styles, and verification starter files.
- flagged: `[VERIFY]` for tag routes, comment workflow, metafield support, Predictive Search request context, and localization behavior.
- decided: required server-navigable archive/search behavior and prevented raw rich content from crossing into browser injection paths.
- next: ch-32 solution
## 2026-08-14 · ch-32 · solution
- wrote: `solutions/part-04-data-objects/ch-32-content-objects/solution.md` with mirrored article, full-search, archive, predictive, style, and verification files.
- verified: used type-aware rich text, object-type branches, server archive state, and predictive section context with a full-search route.
- decided: kept browser interaction out of the answer and retained complete server-rendered content/search recovery surfaces.
- next: ch-32 review; do not add solution-derived implementation to the lesson or exercise.
## 2026-08-14 · ch-32 · review
- reviewed: passed all five numbered content-object topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained documented `metafield_tag`, search, and predictive-search context boundaries; no raw merchant/external HTML path was introduced.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-33 lesson
## 2026-08-14 · ch-33 · lesson
- wrote: `course/part-04-data-objects/ch-33-metafields/lesson.md` covering definitions, every requested type family, lists, references, rendering choices, dynamic sources, and maintainable schema design.
- verified: consulted current Shopify metafield object, renderer filters, and dynamic-source documentation, including list and binding limits.
- decided: centered the lesson on typed owner contracts and merchant workflow rather than treating metafields as unstructured page-slot text.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-33 exercise
## 2026-08-14 · ch-33 · exercise
- wrote: `course/part-04-data-objects/ch-33-metafields/exercise.md` and substantive product-specifications, spec-row, styles, and schema-verification starter files for Lab 12.
- flagged: `[VERIFY]` for definition validation, reference/file availability, selected-variant context, dynamic-source compatibility, and locale/market behavior.
- decided: required replacement of delimiter parsing with typed product/variant definitions and an explicit merchant-maintainable inventory.
- next: ch-33 solution
## 2026-08-14 · ch-33 · solution
- wrote: `solutions/part-04-data-objects/ch-33-metafields/solution.md` with mirrored specification section, guarded row snippet, styles, and a definition/test inventory.
- verified: separated product from variant ownership, used reference-list `count`, bracket access for a collision key, type-aware output, and contextual dynamic-source guidance.
- decided: modeled the table as typed definitions rather than a delimiter format and directed reusable multi-field rows toward metaobjects.
- next: ch-33 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-33 · review
- reviewed: passed all seven numbered metafield topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained modern metafield versus deprecated-type distinction, list count/size behavior, filter support boundaries, and contextual dynamic-source limits.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-34 lesson
## 2026-08-14 · ch-34 · lesson
- wrote: `course/part-04-data-objects/ch-34-metaobjects/lesson.md` covering definitions/entries, Liquid rendering, routes/templates, content models, modeling choices, settings references, and lifecycle governance.
- verified: consulted current Shopify metaobject Liquid, Web pages, dynamic-source, storefront-access, and publication behavior documentation.
- decided: treated metaobjects as reusable entities with ownership and lifecycle rather than generic page replacements.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-34 exercise
## 2026-08-14 · ch-34 · exercise
- wrote: `course/part-04-data-objects/ch-34-metaobjects/exercise.md` with location-index, product pickup, card, styles, and definition/lifecycle verification starter files.
- flagged: `[VERIFY]` for storefront access, Web pages capability, entry status, settings compatibility, and SEO/route configuration.
- decided: framed locations as reusable entities with a single model rather than copied pages and product-level field duplication.
- next: ch-34 solution
## 2026-08-14 · ch-34 · solution
- wrote: `solutions/part-04-data-objects/ch-34-metaobjects/solution.md` with mirrored location index, product pickup, card, dedicated metaobject template, style, and lifecycle-definition files.
- verified: guarded entry and field availability, used resource relation versus merchant setting deliberately, and retained admin-owned Web pages/entry publication configuration.
- decided: separated reusable entity content from page layout and directed routes through one metaobject template rather than copied files.
- next: ch-34 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-34 · review
- reviewed: passed all six numbered metaobject topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained storefront-access, publishable-entry, dedicated-template, and compatible-setting boundaries without overclaiming route availability.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-35 lesson
## 2026-08-14 · ch-35 · lesson
- wrote: `course/part-05-forms-native-interactions/ch-35-the-form-tag/lesson.md` covering native generation, return states, translated accessible errors, and HTML/return-path attributes.
- verified: consulted the current Shopify form tag, form object, and form_errors references, including the deprecated currency-form replacement.
- decided: made the generated native form the implementation baseline and treated error/success output as a server-state accessibility concern.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-35 exercise
## 2026-08-14 · ch-35 · exercise
- wrote: `course/part-05-forms-native-interactions/ch-35-the-form-tag/exercise.md` with native-contact, feedback, style, and verification starter files.
- flagged: `[VERIFY]` for contact validation, translated server errors, delivery workflow, rendered fields, and focus behavior in the target store.
- decided: required a server-confirmed accessible native-form baseline rather than a click-driven visual confirmation.
- next: ch-35 solution
## 2026-08-14 · ch-35 · solution
- wrote: `solutions/part-05-forms-native-interactions/ch-35-the-form-tag/solution.md` with mirrored scoped contact section, translated feedback snippet, styles, and native-protocol verification record.
- verified: preserved native generated fields, server-confirmed success/error state, scoped error associations, safe value restoration, and no-JavaScript recovery.
- decided: treated form transport as Shopify-owned and limited the theme contract to accessible controls, presentation, and minimal enhancement hooks.
- next: ch-35 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-35 · review
- reviewed: passed all four numbered native-form topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained documented generated-field, form-state, translated-error, deprecated-currency, and attribute boundaries.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-36 lesson
## 2026-08-14 · ch-36 · lesson
- wrote: `course/part-05-forms-native-interactions/ch-36-every-form-type/lesson.md` covering every required native form family, form context, data scopes, account-mode caveats, localization, and gift-card recipients.
- verified: consulted current Shopify form, email-consent, gift-card recipient, template, and legacy-account references.
- decided: organized implementation choice around intended server outcomes and native recovery testing rather than visual form patterns.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-36 exercise
## 2026-08-14 · ch-36 · exercise
- wrote: `course/part-05-forms-native-interactions/ch-36-every-form-type/exercise.md` with legacy-account login/register/address, newsletter, feedback, style, and form-evidence starter files for Lab 13.
- flagged: `[VERIFY]` for account mode, legacy templates, guest flow, account errors, address selectors, and migration plan.
- decided: constrained the exercise to verified legacy account maintenance and made latest-account migration a documented boundary.
- next: ch-36 solution
## 2026-08-14 · ch-36 · solution
- wrote: `solutions/part-05-forms-native-interactions/ch-36-every-form-type/solution.md` with mirrored legacy login/register/address, newsletter, feedback, styles, and native form/migration evidence files.
- verified: separated account, recovery, guest, address, and newsletter form contexts; kept passwords non-restored and legacy-account deployment conditional.
- decided: made a verified no-JavaScript legacy maintenance baseline the prerequisite for an eventual account-component migration.
- next: ch-36 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-36 · review
- reviewed: passed all nine numbered native-form topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained product/cart data scope, legacy-account constraints, contextual address behavior, localization replacement, and gift-card recipient limits.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-37 lesson
## 2026-08-14 · ch-37 · lesson
- wrote: `course/part-06-interactivity-without-a-framework/ch-37-the-section-rendering-api/lesson.md` covering request forms, context, filters/cart/pagination, response/root swapping, stale safety, and cost model.
- verified: consulted current Shopify Section Rendering, Cart API, and storefront-filtering documentation for response/null/limit/locale contracts.
- decided: framed partial updates as a progressive, URL-driven transaction with cancellation and coherent fallback rather than an unstructured fetch-and-innerHTML pattern.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-37 exercise
## 2026-08-14 · ch-37 · exercise
- wrote: `course/part-06-interactivity-without-a-framework/ch-37-the-section-rendering-api/exercise.md` with facets/grid, unsafe update script, styles, and response-contract verification starter files.
- flagged: `[VERIFY]` for real dynamic IDs, published response behavior, locale root, form URL, and null sections in the target theme.
- decided: required coherent current-state commits and native navigation fallback instead of unrelated innerHTML updates.
- next: ch-37 solution
## 2026-08-14 · ch-37 · solution
- wrote: `solutions/part-06-interactivity-without-a-framework/ch-37-the-section-rendering-api/solution.md` with mirrored facets/grid, race-safe request script, styles, and response-contract verification record.
- verified: retained URL/context fidelity, full response/root validation, coherent commits, locale awareness, cancellation/token guards, history timing, and cart boundary.
- decided: used full validated root replacement with native navigation fallback rather than partial unvalidated DOM injection.
- next: ch-37 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-37 · review
- reviewed: passed all five Section Rendering API topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained current section response shapes, null handling, locale/context behavior, race guards, and partial-render cost boundary.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-38 lesson
## 2026-08-14 · ch-38 · lesson
- wrote: `course/part-06-interactivity-without-a-framework/ch-38-the-cart-ajax-api/lesson.md` covering every Cart API endpoint, bundled sections, optimistic reconciliation, errors/rules, and confirmed cart pub/sub.
- verified: consulted current Shopify Ajax and Cart API documentation for locale, endpoint, line-key, JSON-error, and server-authority contracts.
- decided: made the mutation response the sole reconciliation point and constrained pub/sub to confirmed server transitions.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-38 exercise
## 2026-08-14 · ch-38 · exercise
- wrote: `course/part-06-interactivity-without-a-framework/ch-38-the-cart-ajax-api/exercise.md` with cart drawer/count, competing behavior, styles, and transition-evidence starter files.
- flagged: `[VERIFY]` for target cart payloads, key changes, bundled sections/context, quantity/inventory errors, and null sections.
- decided: required one coordinator to publish confirmed server transitions after response/section reconciliation.
- next: ch-38 solution
## 2026-08-14 · ch-38 · solution
- wrote: `solutions/part-06-interactivity-without-a-framework/ch-38-the-cart-ajax-api/solution.md` with mirrored drawer/count, locale-aware bundled mutation coordinator, styles, and confirmed-transition verification record.
- verified: retained native form fallback, current line-key targeting, response/root validation, error reconciliation, server-authoritative cart state, and confirmed subscriber publication.
- decided: assigned all cart writes to one coordinator and treated bundled response handling as the commit boundary.
- next: ch-38 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-38 · review
- reviewed: passed all five Cart AJAX API topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained endpoint, bundled-section, server-reconciliation, error/quantity, and confirmed-pub/sub boundaries.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-39 lesson
## 2026-08-14 · ch-39 · lesson
- wrote: `course/part-06-interactivity-without-a-framework/ch-39-search-suggest-apis/lesson.md` covering predictive resources, Liquid section rendering, suggestion lifecycle, request control, and combobox keyboard/accessibility behavior.
- verified: consulted current Shopify Predictive Search, theme implementation, and storefront search documentation for resources, limits, response/errors, locale, and server-rendering contracts.
- decided: kept server-rendered Liquid as the suggestion display boundary and native search submission as the universal recovery path.
- updated: `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
- next: ch-39 exercise
## 2026-08-14 · ch-39 · exercise
- wrote: `course/part-06-interactivity-without-a-framework/ch-39-search-suggest-apis/exercise.md` with native search, predictive section, unsafe script, styles, and predictive-contract starter files.
- flagged: `[VERIFY]` for feature/locales, discovery settings, resource URLs, section root, errors, and target throttling behavior.
- decided: made Liquid rendering and native submit the durable suggestion/fallback boundary.
- next: ch-39 solution
## 2026-08-14 · ch-39 · solution
- wrote: `solutions/part-06-interactivity-without-a-framework/ch-39-search-suggest-apis/solution.md` with mirrored localized search, Liquid suggestions, debounced combobox controller, styles, and verification record.
- verified: retained server-rendered resource/URL formatting, current-request guards, ARIA active-descendant interaction, throttle/error recovery, and native search fallback.
- decided: made the server section the display authority and kept browser code limited to lifecycle and interaction orchestration.
- next: ch-39 review; do not add solution-derived implementation to lesson or exercise content.
## 2026-08-14 · ch-39 · review
- reviewed: passed all three Predictive Search topics in order, source flags, scope limits, exercise solvability, terminology, calibration floor, and starter/solution parity.
- verified: retained resource/section separation, locale/error recovery, debounced current-request behavior, and accessible combobox boundaries.
- decided: applied final markers only; no solution implementation was transferred into lesson or exercise content.
- next: ch-40 lesson
## 2026-08-14 · ch-40 · lesson
- wrote: section-bound custom-element architecture, lifecycle/editor distinction, Shadow DOM decision criteria, Liquid attribute configuration, base class, and no-JS islands.
- verified: grounded editor event statements in current Shopify theme-editor guidance and retained inline verification flags for browser/app-specific contracts.
- decided: used light DOM as the extensibility default and treated the editor as a narrow adapter rather than a global initializer.
- next: ch-40 exercise.
## 2026-08-14 · ch-40 · exercise
- wrote: a Room-ready picks quick-add island brief with section-safe lifecycle, light-DOM integration, typed Liquid settings, fallback behavior, and editor verification.
- shipped: starter section, custom-element JavaScript skeleton, and scoped accessibility CSS.
- decided: constrained enhancement to local confirmation behavior so cart mutation remains explicitly deferred.
- next: ch-40 solution.
## 2026-08-14 · ch-40 · solution
- wrote: a mirrored quick-add custom-element solution with local typed configuration, abortable lifecycle, scoped editor refresh, light-DOM styles, and verification evidence.
- verified: preserved native product-form fallback and constrained cart transport outside this chapter.
- decided: used a per-instance abort signal and a target-scoped editor adapter rather than global card initialization.
- next: ch-40 review; do not transfer solution implementation into lesson or exercise.
## 2026-08-14 · ch-40 · review
- reviewed: passed all six scoped topics in order, source flags, terminology, starter/solution paths, no-JavaScript fallback, and calibration floor.
- verified: lesson distinguishes DOM lifecycle from editor events and keeps Shadow DOM, cart transport, and apps within their appropriate boundaries.
- decided: applied final markers with no solution-derived structural additions to course files.
- next: ch-41 lesson.
## 2026-08-14 · ch-41 · lesson
- wrote: a framework decision model covering Alpine, htmx, Stimulus, Preact, conversion-path bundle cost, and concrete headless signals.
- verified: retained sources for server-rendered enhancement tools and marked versioned library and headless-platform claims for verification.
- decided: required a buyer-task decision record and runtime removal test before adopting client infrastructure.
- next: ch-41 exercise.
## 2026-08-14 · ch-41 · exercise
- wrote: a framework-decision practice brief for a modular-shelving configurator with a Liquid-first purchase path and intent-triggered enhancement boundary.
- shipped: a starter section, intentionally problematic global JavaScript stub, and accessible summary styles.
- decided: constrained implementation to a local summary so framework choice remains evidence-led and cart work stays deferred.
- next: ch-41 solution.
## 2026-08-14 · ch-41 · solution
- wrote: a no-framework configurator solution with a Liquid-first purchase path, intent-triggered local module, decision record, and fallback evidence.
- verified: avoided client reconstruction of server markup and concluded that no hard headless signal is present.
- decided: selected native local enhancement because it eliminates the stated complexity without adopting a runtime.
- next: ch-41 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-41 · review
- reviewed: passed all three framework and headless topics in order, source flags, terminology, exercise solvability, calibration, and mirror integrity.
- verified: course files remain decision-focused and disclose no solution-specific implementation structure.
- decided: applied final markers only; the local enhancement remains deliberately separate from cart and headless implementation.
- next: ch-42 lesson.
## 2026-08-14 · ch-42 · lesson
- wrote: asset ownership, CDN URL filter selection, flat output constraints, and cache-version operational guidance.
- verified: grounded `asset_url` and `file_url` in official Shopify documentation and flagged narrower namespace filters for source confirmation.
- decided: treated resolved URL versions as platform output and rejected arbitrary cache-busting parameters.
- next: ch-42 exercise.
## 2026-08-14 · ch-42 · exercise
- wrote: an asset delivery refactor for a campaign with ownership classification, Liquid URL filters, flat naming, and cache-debug evidence.
- shipped: a brittle Liquid starter plus real CSS and JavaScript theme assets.
- decided: made developer deployment and merchant Admin Files distinct, with no invented Shopify/global namespace usage.
- next: ch-42 solution.
## 2026-08-14 · ch-42 · solution
- wrote: an ownership-first asset delivery solution with current-theme URLs, Admin Files PDF, flat output inventory, and cache recovery evidence.
- verified: removed copied CDN paths and arbitrary cache busting while retaining a usable static campaign.
- decided: left Shopify/global namespaces unused and marked any such resource as verification-required.
- next: ch-42 review; do not transfer solution-specific paths into course files.
## 2026-08-14 · ch-42 · review
- reviewed: passed all four asset/CDN topics in order, official filter facts, ownership terminology, starter/solution parity, and calibration floors.
- verified: retained explicit uncertainty for Shopify/global namespace use and avoided solution-specific migration structure in the course.
- decided: applied final markers only; cache behavior remains platform-led rather than query-string-led.
- next: ch-43 lesson.
## 2026-08-14 · ch-43 · lesson
- wrote: image transformation, responsive candidate arithmetic, geometry/CLS, focal point/art direction, media-type, and SVG rendering guidance.
- verified: used official image and media filter documentation and retained verification flags for policy-dependent priority and focal-point workflows.
- decided: framed responsive delivery around actual CSS slots and treated media type plus ownership as the rendering boundary.
- next: ch-43 exercise.
## 2026-08-14 · ch-43 · exercise
- wrote: a responsive editorial-media implementation brief spanning art direction, candidate arithmetic, geometry, focal points, media types, and SVG ownership.
- shipped: a flawed Liquid media section, CSS geometry starter, and trusted external compass SVG.
- decided: prohibited client-side media generation and required supported type-aware Liquid rendering.
- next: ch-43 solution.
## 2026-08-14 · ch-43 · solution
- wrote: an art-directed, slot-sized, type-aware product-media solution with stable geometry and trusted external SVG handling.
- verified: retained focal point output, first-view priority discipline, responsive candidate evidence, and server media rendering.
- decided: used a separate mobile composition rather than conflating art direction with crop behavior.
- next: ch-43 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-43 · review
- reviewed: passed all seven scoped image/media topics in order, source-backed filters, terminology, starter/solution mirrors, and calibration floors.
- verified: course content keeps art direction, focal points, media types, and SVG trust boundaries distinct without solution leakage.
- decided: applied final markers only and kept uncertain priority/workflow claims explicitly flagged.
- next: ch-44 lesson.
## 2026-08-14 · ch-44 · lesson
- wrote: CSS delivery choices, critical CSS discipline, build-output contracts, local design tokens, and section-root scoping.
- verified: retained uncertainty flags for stylesheet-tag behavior and current tooling workflow.
- decided: treated stylesheets as named responsibilities and merchant values as bounded local tokens.
- next: ch-44 exercise.
## 2026-08-14 · ch-44 · exercise
- wrote: a CSS ownership and scoping refactor with base/section classification, local tokens, critical removal evidence, and two-instance checks.
- shipped: a flawed section plus base and local CSS starters.
- decided: scoped merchant values to the section root and prohibited specificity escalation as a leak fix.
- next: ch-44 solution.
## 2026-08-14 · ch-44 · solution
- wrote: a section-root token solution with separated base/local responsibilities, instance-safe CSS, stable media geometry, and delivery/removal evidence.
- verified: removed page-global token ownership and duplicate base inclusion from the section boundary.
- decided: reused one stylesheet rule set while carrying per-instance values as bounded root properties.
- next: ch-44 review; do not transfer solution structure into course files.
## 2026-08-14 · ch-44 · review
- reviewed: passed all five CSS strategy topics in order, source flags, terminology, starter/solution parity, and calibration floors.
- verified: course content isolates delivery, build, token, and section-root concerns without solution leakage.
- decided: applied final markers only; retained current-platform verification flags for stylesheet and CLI behavior.
- next: ch-45 lesson.
## 2026-08-14 · ch-45 · lesson
- wrote: load-mode, module-boundary, JSON data, third-party tag, and final-asset pipeline guidance.
- verified: used current Shopify documentation for parser blocking, progressive enhancement, import maps, and JS performance.
- decided: treated scripts as optional owned enhancements with explicit route and removal contracts.
- next: ch-45 exercise.
## 2026-08-14 · ch-45 · exercise
- wrote: a progressive JavaScript delivery refactor covering load mode, local data, two-root safety, vendor governance, and build/sync evidence.
- shipped: a blocking Liquid section plus global and local JavaScript starters.
- decided: kept native product selection/submission as the required fallback.
- next: ch-45 solution.
## 2026-08-14 · ch-45 · solution
- wrote: a module-scoped product-form enhancement with inert JSON data, native fallback, script inventory, and build/sync contract.
- verified: removed parser blocking, global mutable helper, unsafe data interpolation, and vendor inclusion from the section.
- decided: kept transaction authority on the native form and routed external dependencies through owned records.
- next: ch-45 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-45 · review
- reviewed: passed all five JavaScript strategy topics in order, current source facts, terminology, starter/solution parity, and calibration floors.
- verified: lesson maintains progressive enhancement, explicit vendor uncertainty, and narrow build/CLI claims without solution leakage.
- decided: applied final markers only and retained explicit verification flags where platform/app behavior depends on current policy.
- next: ch-46 lesson.
## 2026-08-14 · ch-46 · lesson
- wrote: Shopify font settings and variants, custom-font delivery/FOUT policy, and bounded variable-font guidance.
- verified: used current Shopify font object, font modify, and assets versus Admin Files documentation.
- decided: made typography an owned rendering contract with explicit fallback and axis checks.
- next: ch-46 exercise.
## 2026-08-14 · ch-46 · exercise
- wrote: a typography delivery refactor spanning Shopify font settings, variant fallback, custom-font ownership, preload discipline, and variable-weight bounds.
- shipped: incomplete font tokens, overloaded custom font declarations, and an unbounded recipe-heading starter.
- decided: treated font failure and fallback as explicit acceptance criteria.
- next: ch-46 solution.
## 2026-08-14 · ch-46 · solution
- wrote: an owned Shopify-font token system with guarded variants, deliberate self-hosted display delivery, measured preload policy, and bounded variable-weight section settings.
- verified: preserved readable fallback paths and removed eager static variant loading.
- decided: exposed only a verified semantic weight range rather than arbitrary variable-font axis strings.
- next: ch-46 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-46 · review
- reviewed: passed all three typography topics in order, official font facts, terminology, starter/solution parity, and calibration floors.
- verified: course content keeps Shopify font selection, custom resource delivery, FOUT policy, and variable-axis uncertainty distinct without solution leakage.
- decided: applied final markers only and retained explicit verification flags for preload and variable-font contracts.
- next: ch-47 lesson.
## 2026-08-14 · ch-47 · lesson
- wrote: Core Web Vitals ownership, RUM/Lighthouse evidence, Liquid profiling, DOM reduction, CI budgets, and Lab 18 methodology.
- verified: used current Shopify reports, Theme Inspector, Lighthouse CI, and performance guidance.
- decided: treated score movement as evidence requiring route/resource ownership rather than a goal to game.
- next: ch-47 exercise.
## 2026-08-14 · ch-47 · exercise
- wrote: Lab 18 as a controlled route baseline, Liquid/DOM/media/script refactor, Theme Inspector record, and CI budget exercise.
- shipped: a deliberately repeated Liquid section, global blocking starter script, and duplicate responsive markup styles.
- decided: required evidence and buyer-value ownership before declaring any score gain.
- next: ch-47 solution.
## 2026-08-14 · ch-47 · solution
- wrote: a bounded collection refactor with one responsive DOM tree, normal-priority first-view hero, optional module behavior, and performance evidence records.
- verified: removed repeated sort/all_products work, parser blocking, duplicate card markup, and score-only reasoning.
- decided: kept CI as an enforceable measured policy with documented exceptions rather than a guaranteed score claim.
- next: ch-47 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-47 · review
- reviewed: passed all six performance topics in order, official RUM/Inspector/CI facts, terminology, starter/solution parity, and calibration floors.
- verified: lesson distinguishes buyer metrics, controlled lab signals, server profiling, DOM responsibility, and budget ownership without solution leakage.
- decided: applied final markers only and retained an explicit verification flag for store-report availability.
- next: ch-48 lesson.
## 2026-08-14 · ch-48 · lesson
- wrote: locale file taxonomy, t filter contracts, plural/interpolation behavior, schema translation, missing-key discipline, and catalogue governance.
- verified: used current Shopify locale and translate documentation including limits and section-local distinction.
- decided: made default-key alignment and structural CI checks the primary missing-translation prevention strategy.
- next: ch-48 exercise.
## 2026-08-14 · ch-48 · exercise
- wrote: a storefront/schema locale refactor covering key alignment, interpolation, pluralisation, private/global boundaries, HTML policy, and catalogue coverage.
- shipped: hard-coded section and divergent English/French locale starters.
- decided: made default-key alignment and explicit ownership the exercise’s missing-translation defense.
- next: ch-48 solution.
## 2026-08-14 · ch-48 · solution
- wrote: aligned storefront/schema catalogues, interpolation/plural contracts, local/global translation boundaries, and coverage governance.
- verified: removed hard-coded English, mismatched locale paths, English-only plural logic, and unreviewed HTML translation behavior.
- decided: made the default catalogue the structural source of truth and retained explicit language-surface records.
- next: ch-48 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-48 · review
- reviewed: passed all five translation topics in order, official locale/filter facts, terminology, starter/solution parity, and calibration floors.
- verified: course content distinguishes storefront/schema/local section language, plural and HTML boundaries, fallback policy, and catalogue governance without solution leakage.
- decided: applied final markers only and retained a verification flag for portable section locale contracts.
- next: ch-49 lesson.
## 2026-08-14 · ch-49 · exercise
- wrote: a localization-form, market-price, regional-content, and international SEO refactor with route-level evidence.
- shipped: cosmetic conversion, unsafe market section, and duplicate hreflang starter files.
- decided: made configuration ownership and no-JavaScript form behavior mandatory for every market change.
- next: ch-49 solution.
## 2026-08-14 · ch-49 · solution
- wrote: a native localization form, active-market money output, bounded regional content, unavailable-product fallback, and a single SEO annotation owner.
- shipped: solution section, optional progressive-enhancement script, clean layout, market test matrix, and responsibility decision log.
- verified: removed client-side currency rewriting and duplicate manual hreflang while preserving no-JavaScript submission.
- decided: Markets configuration owns destinations, catalogues, prices, and SEO routing; the theme owns transparent presentation and evidence capture.
- next: ch-49 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-49 · review
- reviewed: passed all five Markets, price, regional-content, and international-SEO topics in scope order, plus the starter/solution file parity.
- verified: course material keeps real localization forms, active-market price rendering, merchant-owned notices, catalog boundaries, and a single `content_for_header` SEO source without solution leakage.
- decided: applied final markers and retained `[VERIFY]` boundaries for configured market/catalog/policy outcomes.
- next: ch-50 lesson.
## 2026-08-14 · ch-50 · lesson
- wrote: command-direction discipline for Shopify CLI, hot-reload boundaries, named `shopify.theme.toml` environments, preview lifecycle, and safe real-store operations.
- verified: aligned command, environment, preview, and packaging facts with current official Shopify CLI references.
- decided: made target identity, code-versus-merchant state, and rollback evidence preconditions for all destructive or release actions.
- next: ch-50 exercise.
## 2026-08-14 · ch-50 · exercise
- wrote: a controlled CLI promotion rehearsal covering environments, target evidence, hot-reload limits, durable candidate previews, ownership, packaging, and rollback.
- shipped: unsafe TOML/ignore/release-record starters plus a minimal real section, stylesheet, and layout theme output.
- decided: prohibited production publication and credentials in the lab while requiring route-level candidate evidence and explicit merchant-state treatment.
- next: ch-50 solution.
## 2026-08-14 · ch-50 · solution
- wrote: a three-environment CLI workflow with command direction, hot-reload boundaries, durable staging candidate evidence, state ownership, packaging, and authorised rollback.
- shipped: corrected TOML and ignore files, command matrix, release record, and mirror theme section, stylesheet, and layout.
- verified: retained `[VERIFY]` markers for store-specific IDs, permissions, approvals, and market/account route context rather than inventing release evidence.
- decided: release safety rests on explicit remote identity and a prior verified candidate, never an implicit default or a generic preview URL.
- next: ch-50 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-50 · review
- reviewed: passed all five CLI topics in scope order, the official command/environment facts, target-safety constraints, starter/solution parity, and calibration floors.
- verified: the course distinguishes development feedback, durable unpublished candidates, preview evidence, environment precedence, and real-data safety without importing solution-only workflow detail.
- decided: applied final markers and retained `[VERIFY]` boundaries for client-specific targets, permissions, test contexts, policy, and approval.
- next: ch-51 lesson.
## 2026-08-14 · ch-51 · lesson
- wrote: Theme Check execution surfaces, catalogue interpretation, YAML severity policy, custom rule design, finding triage, static-analysis limits, and merge-gate evidence.
- verified: aligned the lesson with current official Theme Check and configuration references.
- decided: positioned Theme Check as a reproducible static gate paired with route, configuration, accessibility, and merchant evidence.
- next: ch-51 exercise.
## 2026-08-14 · ch-51 · exercise
- wrote: a Theme Check policy lab covering checked build output, finding dispositions, severity, narrow suppression, custom team convention, and merge-gate evidence.
- shipped: misconfigured YAML, deployable `dist` fixtures, custom-check placeholder, triage table, and unsafe gate starter documents.
- decided: made static analysis one evidence layer while requiring separate route, configuration, accessibility, merchant, and release validation.
- next: ch-51 solution.
## 2026-08-14 · ch-51 · solution
- wrote: a `dist`-rooted Theme Check policy, source fixes, narrow suppression, custom-rule contract, triage decisions, and a layered merge gate.
- shipped: corrected YAML, deployable layout/section/assets, custom-check contract, triage matrix, and release gate mirror files.
- verified: retained `[VERIFY]` boundaries for version-specific custom-check APIs, route ordering, team ownership, store state, and release policy.
- decided: static analysis must reduce uncertainty about source contracts without claiming authority over runtime or merchant outcomes.
- next: ch-51 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-51 · review
- reviewed: passed all five Theme Check topics in scope order, official static-analysis facts, starter/solution parity, calibration, and the anti-leak boundary.
- verified: the course distinguishes local/editor/CI feedback, check categories, YAML policy, custom conventions, and merge gating from runtime/store acceptance.
- decided: applied final markers and retained `[VERIFY]` boundaries for tool versions, custom-check integration, store behavior, and release policy.
- next: ch-52 lesson.
## 2026-08-14 · ch-52 · lesson
- wrote: connected branch-to-theme mappings, configuration ownership, settings/template drift, live-store branching, and merchant-edit-aware release/rollback practice.
- verified: aligned the branch synchronization and conflict/recovery behavior with current official Shopify GitHub integration documentation.
- decided: made semantic reconciliation and prior-candidate provenance mandatory before configuration-bearing theme releases.
- next: ch-52 exercise.
## 2026-08-14 · ch-52 · exercise
- wrote: a branch/theme mapping, configuration-ownership, template-drift, merchant-edit reconciliation, candidate release, and rollback rehearsal.
- shipped: production/staging JSON fixtures, merchant settings state, schema-migration section, real CSS asset, ambiguous branch state, and unsafe release note starters.
- decided: prohibited blind synchronization and required semantic configuration decisions with owner, route impact, evidence, and reversion trigger.
- next: ch-52 solution.
## 2026-08-14 · ch-52 · solution
- wrote: a branch/theme identity map, configuration ownership contract, template-drift classification, merchant-edit reconciliation protocol, release policy, and rollback provenance record.
- shipped: decision-log mirrors plus an announcement section and stylesheet that preserve the deployable theme boundary.
- verified: retained `[VERIFY]` for store IDs, bot-commit intent, app/context state, permissions, approval, and real recovery targets.
- decided: never select a configuration winner by timestamp or branch name; release only a semantically reconciled unpublished candidate.
- next: ch-52 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-52 · review
- reviewed: passed all five Git/environments topics in scope order, current integration facts, starter/solution parity, calibration, and anti-leak boundaries.
- verified: the course covers branch identity, shared configuration reconciliation, template drift, live-store branching, and merchant-edit-aware rollback without treating Git as commercial authority.
- decided: applied final markers and retained `[VERIFY]` requirements for connected targets, merchant intent, app/state context, permissions, and release approval.
- next: ch-53 lesson.
## 2026-08-14 · ch-53 · lesson
- wrote: scalable naming, component and utility contracts, handoff documentation, internal API evolution, and multi-brand theme governance.
- verified: maintained settings/configuration migration and deployment boundary discipline from preceding workflow chapters.
- decided: treated reusable theme surfaces as owned, versioned internal contracts rather than broad abstractions or folders of convenience.
- next: ch-53 exercise.
## 2026-08-14 · ch-53 · exercise
- wrote: a library-governance refactor for naming, explicit price-snippet reuse, utility boundaries, handoff contracts, setting migration, and multi-brand variation.
- shipped: ambiguous card/price/helper snippets, purchase/campaign sections, shared CSS, and stale handoff starters for a real refactor target.
- decided: required evidence of a second consumer before extraction while treating persisted setting IDs and brand variation as owned migration contracts.
- next: ch-53 solution.
## 2026-08-14 · ch-53 · solution
- wrote: explicit product-price and utility contracts, setting migration constraints, component extraction criteria, naming/handoff records, and multi-brand base strategy.
- shipped: solution snippets, purchase-panel section, CSS artifact, and standard-library manifest as real mirror files.
- verified: retained `[VERIFY]` for product/brand owners, live configured instances, consumer routes, and shared-base adoption evidence.
- decided: extracted only the two-consumer price behavior and left the campaign feature local until independent contract evidence exists.
- next: ch-53 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-53 · review
- reviewed: passed all five code-organisation topics in scope order, library/utility boundaries, handoff quality, multi-brand ownership, starter/solution parity, and calibration.
- verified: the course keeps setting migrations, brand decisions, and reusable contracts explicit without importing implementation-specific solution shortcuts.
- decided: applied final markers and retained `[VERIFY]` requirements for live configuration inventory, brand owners, route evidence, and shared-base adoption.
- next: ch-54 lesson.
## 2026-08-14 · ch-54 · lesson
- wrote: testable theme boundaries, visual/preset regression coverage, Lighthouse CI gates, buyer-journey smoke tests, edge-data fixtures, and failure governance.
- verified: aligned Lighthouse CI, controlled performance data, static checks, no-JavaScript baseline, and Theme Store testing guidance with official Shopify references.
- decided: made every test result a bounded evidence claim with a fixture, context, owner, and explicit runtime/configuration limit.
- next: ch-54 exercise.
## 2026-08-14 · ch-54 · exercise
- wrote: a layered candidate-testing lab covering evidence matrix, deterministic visuals, Lighthouse policy, smoke journeys, edge fixtures, and failure triage.
- shipped: brittle purchase-panel Liquid/CSS, no-image and long-title fixtures, unsafe test plan, and exposed-secret CI notes as real correction targets.
- decided: prohibited static/preview overclaims and required every test signal to preserve context, artifact, owner, non-coverage, and escalation path.
- next: ch-54 solution.
## 2026-08-14 · ch-54 · solution
- wrote: a bounded test-evidence matrix, deterministic visual contract, controlled Lighthouse policy, smoke journeys, edge catalogue, corrected purchase panel, and failure triage.
- shipped: solution section/CSS plus visual, performance, smoke, edge, matrix, and triage mirror records.
- verified: retained `[VERIFY]` for candidate/store identity, handles, tools, secrets, thresholds, app/market/account state, and approval.
- decided: a green candidate is a layered set of observed claims, never an automated certification of payment, policy, merchant content, or production truth.
- next: ch-54 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-54 · review
- reviewed: passed all five Testing topics in scope order, official performance/testing facts, starter/solution parity, calibration, and anti-leak boundaries.
- verified: the course distinguishes static, visual, lab performance, journey, edge-data, configuration, accessibility, and merchant evidence without overclaiming checkout or production truth.
- decided: applied final markers and retained `[VERIFY]` requirements for tools, candidate identity, fixtures, store/account/market state, thresholds, and approval.
- next: ch-55 lesson.
## 2026-08-14 · ch-55 · lesson
- wrote: current-reference Dev MCP usage, bounded agent workflows, `{% doc %}`/schema context, review guardrails, agent-readable architecture, and autonomy governance.
- verified: aligned Dev MCP, Liquid search/validation, and AI Toolkit capability boundaries with current official Shopify references.
- decided: framed AI as evidence-accelerating assistance under explicit context and human release authority, never as a merchant/store authority substitute.
- next: ch-55 exercise.
## 2026-08-14 · ch-55 · exercise
- wrote: a hardened agent-task lab for current-reference research, explicit contracts, Theme Check dispositions, review gates, and Dawn dependency inventory.
- shipped: opaque promo section/snippet, owned CSS, unclassified check report, dangerous prompt, and copy-first Dawn notes as real correction targets.
- decided: kept all store access, secrets, market claims, publishing, and protected operations outside the task envelope and under named human approval.
- next: ch-55 solution.
## 2026-08-14 · ch-55 · solution
- wrote: a bounded agent-task envelope, current-reference record, explicit promo contract, Theme Check dispositions, Dawn dependency inventory, review record, and escalation discipline.
- shipped: solution section/snippet/CSS plus an auditable task-envelope mirror.
- verified: retained `[VERIFY]` for tool/store/candidate/context/permission/market/approval facts and prohibited unsupported protected operations.
- decided: an agent must stop and escalate on ambiguous platform/configuration facts, secret needs, or protected operations rather than creating certainty by inference.
- next: ch-55 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-55 · review
- reviewed: passed all five AI-assisted theme-development topics in scope order, official current-reference facts, starter/solution parity, calibration, and anti-leak boundaries.
- verified: the course keeps current documentation, explicit contracts, Theme Check loops, machine-readable context, and protected-operation review distinct from agent authority.
- decided: applied final markers and retained `[VERIFY]` requirements for tool policy, store/candidate context, configuration, permissions, markets, reviewers, and release approval.
- next: ch-56 lesson.
## 2026-08-14 · ch-56 · lesson
- wrote: app-block/embed decisioning, merchant editor control, `@app` section/wrapper contracts, third-party containment, and integration evidence/removal governance.
- verified: aligned extension types, app-block support, wrapper rules, app-embed activation/context, and schema constraints with current official Shopify references.
- decided: assigned themes the outer layout boundary and merchant placement while preserving app-owned inner behavior, data, lifecycle, privacy, and update contracts.
- next: ch-56 exercise.
## 2026-08-14 · ch-56 · exercise
- wrote: an app-integration boundary refactor for placement choice, valid `@app` hosting, Apps wrapper, outer containment, merchant flow, and candidate evidence.
- shipped: invalid product/apps sections, unsafe CSS/layout injection, and unowned placement notes as real correction targets.
- decided: prohibited layout script pasting, app-block limits, static-section claims, and visual clipping in favor of editor-controlled extension surfaces.
- next: ch-56 solution.
## 2026-08-14 · ch-56 · solution
- wrote: app block/embed placement, valid JSON `@app` host, Apps wrapper, outer containment, merchant flow, candidate evidence, and state/removal checks.
- shipped: solution product/apps sections, neutral CSS, clean layout, and placement decision mirror.
- verified: retained `[VERIFY]` for app/extension/theme/editor/resource/market/styling/privacy/performance/release facts and ownership.
- decided: treated integration version and editor state as independent release evidence; theme removal must remain clean without app-internal assumptions.
- next: ch-56 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-56 · review
- reviewed: passed all four Theme App Extensions topics in scope order, official current facts, starter/solution parity, calibration, and anti-leak boundaries.
- verified: the course distinguishes inline app blocks from global app embeds, preserves merchant editor control, and contains third-party output without taking app ownership.
- decided: applied final markers and retained `[VERIFY]` requirements for extension/theme/editor/resource/styling/privacy/performance/release context.
- next: ch-57 lesson.
## 2026-08-14 · ch-57 · lesson
- wrote: script-tag migration framing, Web Pixel sandbox/event design, Customer Privacy allowed-state loading, consent-aware tracking, and legacy analytics cutover governance.
- verified: aligned pixel sandbox/consent behavior, Customer Privacy API loading/allowed methods, and official migration facts with current Shopify references.
- decided: made theme code a minimal custom-event publisher where justified and moved vendor collection, consent mediation, and duplication governance into managed pixel boundaries.
- next: ch-57 exercise.
## 2026-08-14 · ch-57 · exercise
- wrote: a privacy-aware pixel migration brief covering inventory, owner/destination choice, custom-event publisher, Customer Privacy allowed-state gating, sandbox boundaries, deduplication, and release evidence.
- shipped: a legacy theme layout, direct queue/cookie/automatic-consent anti-patterns, guide interaction, and unowned pixel/checkout notes as real correction targets.
- decided: prohibited real traffic, secrets, customer data, privacy-setting changes, and legal conclusions; retained `[VERIFY]` for all store/vendor/purpose/region/configuration/approval facts.
- next: ch-57 solution.
## 2026-08-14 · ch-57 · solution
- wrote: an inventory, app/custom-pixel decision record, minimal `guide_opened` publisher, consent plan, strict/lax sandbox analysis, cutover/rollback plan, and candidate validation matrix.
- shipped: a clean solution layout, publisher and consent assets, plus auditable pixel, migration, consent, sandbox, and validation records in the solution mirror.
- verified: removed direct vendor transport, personal identifier, automatic consent, and Shopify-cookie manipulation from the corrected implementation; retained `[VERIFY]` where merchant/vendor/pixel/privacy/release facts require authorised observation.
- next: ch-57 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-57 · review
- reviewed: passed all four Script Tags, Web Pixels/sandboxes, Customer Privacy consent, and legacy analytics migration topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course makes the theme a minimal custom-event publisher, retains platform-managed pixel/consent boundaries, and requires same-service semantic/uniqueness evidence before legacy removal.
- decided: applied final markers and preserved `[VERIFY]` gates for pixel/app/version, endpoint/CORS, configuration, regional purpose, candidate/checkout state, traffic evidence, owners, approvals, and rollback.
- next: ch-58 lesson.
## 2026-08-14 · ch-58 · lesson
- wrote: checkout retirement timelines; Checkout UI Extension target/capability/plan reasoning; Functions for discounts, delivery, payments, and validation; Scripts migration; pre-checkout theme limits; and Thank you, Order status, and post-purchase selection.
- verified: grounded deprecations and current checkout/Functions/post-purchase distinctions in the course ledger and official Shopify documentation; calibration passed at 3,023 words.
- decided: assigned theme code to cart/pre-checkout experience, checkout UI to approved presentation, Functions to durable commerce decisions, and pixels to approved collection; retained `[VERIFY]` for all store/plan/target/capability/configuration/privacy/release facts.
- next: ch-58 exercise.
## 2026-08-14 · ch-58 · exercise
- wrote: a checkout triage exercise covering dated legacy inventory, surface authority, validation Function specification, UI capability discipline, Scripts migration, honest cart guidance, and post-purchase separation.
- shipped: legacy checkout Liquid/DOM tracking/payment hiding, a retired shipping Script, cart CSS/section anti-patterns, and ambiguous customization/post-purchase notes as real correction targets.
- decided: prohibited live checkout changes, buyer/payment data, installation, configuration, target/plan inference, and browser enforcement; retained `[VERIFY]` for all platform/store/app/policy/release facts.
- next: ch-58 solution.
## 2026-08-14 · ch-58 · solution
- wrote: an inventory, surface-decision matrix, UI proposal, server-side validation contract, Scripts transition plan, corrected theme cart boundary, post-purchase plan, and candidate validation record.
- shipped: accessible cart-section/CSS corrections plus auditable retirement, Function, UI, Scripts, post-purchase, and validation records in the solution mirror.
- verified: removed the false checkout-block claim, hidden checkout control, legacy DOM payment assumption, legacy Script fallback, and one-shot confirmation assumptions from the corrected architecture.
- next: ch-58 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-58 · review
- reviewed: passed all six checkout retirement, UI extension, Function, Scripts, theme-boundary, and post-purchase topics in scope order, official-source alignment, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course distinguishes presentation, commerce enforcement, event collection, initial confirmation, revisitable order status, and conditional post-purchase behavior without assigning checkout ownership to themes.
- decided: applied final markers and retained `[VERIFY]` gates for plan, target, API, app/version, configuration, payment/delivery, protected data, pixel/consent, candidate, release, cleanup, and rollback facts.
- next: ch-59 lesson.
## 2026-08-14 · ch-59 · lesson
- wrote: current versus legacy customer-account architecture; the hosted portal/theme boundary; supported configuration and account-extension targets/capabilities; B2B company/location context; and account migration/analytics/headless decision records.
- verified: grounded sign-in, account migration, customization limits, target classes, protected-data boundary, and B2B considerations in current official Shopify sources; calibration passed at 2,380 words.
- decided: retained the theme as a storefront doorway, reserved account portal behavior for native controls/extensions/headless architecture, and marked account mode, plan, target, domain, identity, data, B2B, pixel, candidate, and release facts `[VERIFY]`.
- next: ch-59 exercise.
## 2026-08-14 · ch-59 · exercise
- wrote: an account migration exercise covering legacy inventory, theme doorway correction, account-extension and B2B scope, migration alternatives, and candidate validation.
- shipped: legacy account entry, portal DOM/data scrape, CSS/JS assumptions, and ambiguous B2B/account requests as real correction targets.
- decided: prohibited live account, identity, customer-data, B2B, app, pixel, and consent operations; retained `[VERIFY]` for all platform/store/data/release facts.
- next: ch-59 solution.
## 2026-08-14 · ch-59 · solution
- wrote: account inventory, surface decision, safe storefront doorway, B2B extension/data boundary, migration plan, and candidate validation record.
- shipped: solution section/CSS plus account, extension, B2B, migration, and validation records in the solution mirror.
- verified: removed hardcoded legacy account assumptions and portal DOM/customer-data scraping; kept customer/company/location data and account authority explicitly bounded.
- next: ch-59 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-59 · review
- reviewed: passed all three current-versus-legacy account, theme-boundary, and customer-account extension/B2B topics in scope order, source alignment, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course assigns account identity/portal ownership to Shopify, keeps theme code at the storefront doorway, and requires scoped extension/data/B2B decisions.
- decided: applied final markers and retained `[VERIFY]` gates for mode, plan, domain, identity, target/API, data approval, B2B context, pixels, candidate, release, cleanup, and rollback.
- next: ch-60 lesson.
## 2026-08-14 · ch-60 · lesson
- wrote: Ajax versus Storefront API boundaries, Liquid-shell API islands, Hydrogen/Oxygen decision criteria, shared-cart/headless migration records, and lifecycle team/maintenance realities.
- verified: aligned theme-only Ajax limits, Storefront GraphQL/authentication, Hydrogen/Oxygen roles, and official migration considerations with current Shopify sources; calibration passed at 2,239 words.
- decided: required named buyer outcomes, explicit authority/data/credential/fallback/performance contracts, measured alternatives, and full operational ownership before expanding a theme into hybrid or headless architecture; retained `[VERIFY]` for store/runtime/plan/integration/release facts.
- next: ch-60 exercise.
## 2026-08-14 · ch-60 · exercise
- wrote: a runtime-decision exercise for Ajax/Storefront API selection, bounded cart islands, evidence-led Hydrogen/Oxygen evaluation, migration registration, and lifecycle maintenance.
- shipped: a cart-island Liquid shell, unsafe hardcoded Ajax/token/client-state anti-patterns, minimal CSS, and headless/integration request notes as real correction targets.
- decided: prohibited token/API/runtime provisioning, live store interaction, and framework-first migration; retained `[VERIFY]` for all API/store/platform/operational/release facts.
- next: ch-60 solution.
## 2026-08-14 · ch-60 · solution
- wrote: API decision, corrected locale-aware Ajax island, island contract, headless decision, migration register, maintenance model, and candidate validation record.
- shipped: solution section/assets plus auditable API, island, decision, migration, maintenance, and validation records in the solution mirror.
- verified: removed token exposure, customer/global assumptions, hardcoded cart route, client-total authority, and client-only cart hiding from the corrected implementation.
- next: ch-60 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-60 · review
- reviewed: passed all four Ajax/Storefront, hybrid island, Hydrogen/Oxygen decision, and maintenance topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course uses theme-safe Ajax for bounded current-session interaction, reserves GraphQL/headless for explicit storefront contracts, and makes ongoing operational ownership a go/no-go condition.
- decided: applied final markers and retained `[VERIFY]` gates for API/auth/token, runtime/host/plan, integration, domain, publication, metrics, team, cost, candidate, release, cleanup, and rollback.
- next: ch-61 lesson.
## 2026-08-14 · ch-61 · lesson
- wrote: semantic Liquid output, focus management through dynamic updates, accessible contracts for variant/facet/carousel/modal/announcement patterns, merchant-content limits, and layered automated/manual audit practice.
- verified: grounded theme guidance, keyboard/focus handling, dynamic component expectations, WCAG 2.2 framing, and WAI-ARIA pattern use in current Shopify/W3C references; calibration passed at 2,747 words.
- decided: made semantic output and focus ownership explicit component contracts, reserved live regions for bounded feedback, and required manual keyboard/candidate evidence alongside automation; retained `[VERIFY]` for configuration, content, state, tool, candidate, and release facts.
- next: ch-61 exercise.
## 2026-08-14 · ch-61 · exercise
- wrote: an accessibility repair brief covering semantic Liquid output, variants, drawer focus, bounded announcements, merchant-content limits, and layered keyboard-led evidence.
- shipped: generic product cards, faux variant controls, global dynamic update/focus loss, hidden focus CSS, an unnamed drawer, and scan-only/content anti-pattern notes as real correction targets.
- decided: prohibited live-theme/content/accessibility claims and retained `[VERIFY]` for component data, lifecycle, content, tool, candidate, reviewer, exception, and release facts.
- next: ch-61 solution.
## 2026-08-14 · ch-61 · solution
- wrote: semantic card/list output, native variant contract, named drawer and return-focus policy, concise announcement map, merchant boundary, and layered audit/keyboard records.
- shipped: solution section/snippet/assets plus semantic, focus, announcement, merchant, keyboard, and audit mirrors.
- verified: removed faux controls, global cart live region, missing image semantics, hidden focus, and unowned drawer focus behavior from the corrected architecture.
- next: ch-61 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-61 · review
- reviewed: passed all five semantic output, focus/rerender, widget/announcement, merchant-content, and audit topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course treats focus and semantic output as explicit contracts and combines automation with keyboard, content, and candidate evidence rather than score-only acceptance.
- decided: applied final markers and retained `[VERIFY]` gates for product/variant, section lifecycle, content, tools, browser/assistive technology, candidate, exception, reviewer, and release facts.
- next: ch-62 lesson.
## 2026-08-14 · ch-62 · lesson
- wrote: head metadata and Open Graph patterns; JSON-LD claim inventories for Product, Offer, BreadcrumbList, Organization, Article and FAQ; canonicals/pagination/filter route analysis; robots/sitemap governance; and duplicate-output verification.
- verified: grounded Shopify metadata and robots behaviors plus Google structured-data visible-content, JSON-LD, validation, and rich-result limitations in current official references; calibration passed at 2,273 words.
- decided: required one owner per schema claim/template, `canonical_url` output inspection instead of string-built canonicals, narrow reversible robots changes, and rendered-route evidence rather than ranking/indexing promises; retained `[VERIFY]` for all store/search/configuration/state/release facts.
- next: ch-62 exercise.
## 2026-08-14 · ch-62 · exercise
- wrote: a template-level SEO exercise covering metadata, visible-page JSON-LD ownership, duplicate-route records, narrow robots/sitemap governance, and rendered-output validation.
- shipped: duplicate head/canonical output, global hand-built schema, static broad robots directives, and route/app-schema assumptions as real correction targets.
- decided: prohibited live search/store operations and retained `[VERIFY]` for every route, domain, market, content, app, crawler, validator, owner, candidate, release and rollback fact.
- next: ch-62 solution.
## 2026-08-14 · ch-62 · solution
- wrote: one head contract, template-scoped product schema, claim and metadata inventories, URL decision record, default-preserving robots proposal, and rendered-output matrix.
- shipped: solution layout/snippet/robots/CSS plus metadata, claim, URL, robots and validation records in the solution mirror.
- verified: removed duplicate canonicals, invisible global Product/FAQ claims, hand-built JSON, static broad robots blocks, and unowned app-schema duplication from the corrected architecture.
- next: ch-62 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-62 · review
- reviewed: passed title/description/Open Graph, JSON-LD object scope, canonical/pagination/filter, robots/sitemap, and duplicate-route topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course makes visible current content, single schema ownership, rendered route evidence, and reversible crawler controls mandatory before claims are released.
- decided: applied final markers and retained `[VERIFY]` gates for all store/search/domain/locale/app/content/route/crawler/tool/candidate/owner/release facts.
- next: ch-63 lesson.
## 2026-08-14 · ch-63 · lesson
- wrote: Customer Privacy API loading and purpose-specific Allowed-method gates; accessible, performance-bounded consent interfaces; theme versus merchant/legal responsibilities; policy/accessibility page patterns; and processing/change-state test records.
- verified: grounded API loading, allowed processing, consent-event, visitor interaction, banner, and privacy-setting behavior in current Shopify documentation; calibration passed at 2,240 words.
- decided: prohibited cookie manipulation, automatic consent, local boolean authorization, duplicate banner providers, and legal/ranking-style claims; required optional-asset registers, neutral fixtures, and `[VERIFY]` gates for all business/configuration/jurisdiction/release facts.
- next: ch-63 exercise.
## 2026-08-14 · ch-63 · exercise
- wrote: a consent-gated theme exercise covering API purpose checks, banner accessibility/performance, privacy processing inventory, technical/legal boundaries, trust-page records, and neutral-fixture validation.
- shipped: pre-consent vendor includes, automatic local/cookie consent, inaccessible popup CSS/markup, unsupported trust claims, and unowned processing/page notes as real correction targets.
- decided: prohibited live privacy/vendor/policy operations and all legal claims; retained `[VERIFY]` for purpose, region, configuration, vendor, data, policy, candidate, owner, approval, release and rollback facts.
- next: ch-63 solution.
## 2026-08-14 · ch-63 · solution
- wrote: asset processing register, allowed-purpose Customer Privacy loader, consent-change contract, preference entry, theme/legal boundary, trust-page record, and neutral validation matrix.
- shipped: solution layout/assets/section plus processing, consent, boundary, trust-page and validation mirrors.
- verified: removed pre-consent vendor tags, local/cookie authorization, automatic consent, unsupported compliance copy, hidden focus, and scan-only/ungoverned implementation assumptions.
- next: ch-63 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-63 · review
- reviewed: passed Customer Privacy gating, banner performance/accessibility, GDPR-adjacent theme boundary, and legal/accessibility-page topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course makes Allowed-method checks, visitor interaction, optional-asset inventory, accessible trust surfaces, neutral evidence, and merchant/legal ownership explicit.
- decided: applied final markers and retained `[VERIFY]` gates for all jurisdiction, merchant, region, vendor, data, policy, configuration, candidate, owner, approval, release and rollback facts.
- next: ch-64 lesson.
## 2026-08-14 · ch-64 · lesson
- wrote: theme-generation inventory; Liquid-to-JSON conversion; local versus Theme Block decision; `content_for 'blocks'` migration boundary; merchant-content ledger; and candidate rehearsal/rollback protocol.
- verified: grounded template coexistence, section migration sequence, JSON schema/limits, Theme Block reuse/nesting/variable boundary, and `content_for`/`@theme` behavior in current Shopify documentation; calibration passed at 2,249 words.
- decided: required copy-first candidate migration, one template type per name, one compatible parent block model, explicit data outcomes, editor/buyer comparison, content-owner acceptance, and rollback evidence; retained `[VERIFY]` for current theme/editor/data/app/release facts.
- next: ch-64 exercise.
## 2026-08-14 · ch-64 · exercise
- wrote: a candidate modernization exercise covering generation inventory, JSON conversion, Theme Block extraction decisions, compatible `content_for`, merchant-content preservation, and rollback validation.
- shipped: a Vintage template, local product blocks, invalid mixed parent, incomplete Theme Block, template-owned guide, CSS selector, and merchant-state assumptions as real correction targets.
- decided: prohibited live template/editor/settings migration; required explicit mapping outcomes, candidate-only evidence, content-owner acceptance, and `[VERIFY]` gates for all theme/editor/data/app/release facts.
- next: ch-64 solution.
## 2026-08-14 · ch-64 · solution
- wrote: candidate JSON product composition, section-owned size guide, independent editorial Theme Block, compatible Theme Block parent, migration map, preservation ledger, rehearsal protocol, validation and rollback records.
- shipped: JSON/section/block/assets plus architecture, mapping, parent, preservation and validation files in the solution mirror.
- verified: removed Liquid/JSON template collision, template-owned residual markup, outer-variable Theme Block dependency, mixed local/Theme Block parent model, and unowned merchant-data reset assumptions.
- next: ch-64 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-64 · review
- reviewed: passed theme-generation, JSON conversion, Theme Block conversion, `content_for` parent, and merchant-content preservation topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course requires copy-first architecture inventory, one template type per name, explicit block-model choice, independent block contracts, candidate editor proof, content-owner acceptance, and rollback.
- decided: applied final markers and retained `[VERIFY]` gates for all theme, template, editor, settings, blocks, apps, dynamic sources, candidate, owner, release, and rollback facts.
- next: ch-65 lesson.
## 2026-08-14 · ch-65 · lesson
- wrote: file-by-file Dawn/Horizon architecture comparison; local versus Theme Block composition; Web Component/Shadow DOM boundary reasoning; app/DOM/CSS compatibility audit; and evidence-led base-theme selection.
- verified: grounded architecture-version, OS 2.0, Theme Block and standard-directory facts in current Shopify Help/developer documentation; calibration passed at 2,144 words.
- decided: treated all exact Horizon/component/Shadow DOM/app/version behavior as `[VERIFY]`; required actual candidate inventories, public-contract adaptation paths, component UX tests, compatibility ledger, and reversible selection record.
- next: ch-65 exercise.
## 2026-08-14 · ch-65 · exercise
- wrote: a Dawn-versus-Horizon candidate audit covering file/ownership comparison, local versus Theme Block composition, component boundaries, compatibility paths, and a conditional base-theme selection.
- shipped: a Dawn-like product form, mixed block parent, outer-variable Theme Block, selector/observer script, global CSS, and unsupported app/component/client assumptions as real correction targets.
- decided: prohibited private DOM access, live theme/app changes and unqualified compatibility claims; required `[VERIFY]` gates, candidate fixtures, public boundaries, owned adaptation paths, expiry-bound shims, and reversal evidence.
- next: ch-65 solution.
## 2026-08-14 · ch-65 · solution
- wrote: architecture comparison, independent editorial tile, compatible Theme Block parent, component-boundary record, adaptation ledger, scoped owned assets, conditional base-theme selection, and candidate matrix.
- shipped: solution sections/blocks/assets plus comparison, composition, boundary, compatibility, selection and validation records.
- verified: removed global selector/observer coupling, private Shadow DOM assumptions, global variant CSS overrides, outer-variable block dependency, mixed parent model, and “newer wins” selection logic.
- next: ch-65 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-65 · review
- reviewed: passed architecture comparison, monolithic versus nested blocks, Web Component/Shadow DOM boundaries, app/DOM/CSS risk, and new-client base-theme selection in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course requires actual repository/version evidence, independent blocks, public component contracts, compatibility ownership/expiry, candidate UX checks, and reversible selection.
- decided: applied final markers and retained `[VERIFY]` gates for all selected-Horizon, component, app, CSS, client, candidate, owner, release, and rollback facts.
- next: ch-66 lesson.
## 2026-08-14 · ch-66 · lesson
- wrote: SFCC/SFRA, Magento/WooCommerce/BigCommerce mental-model translation; Ajax/Storefront API boundaries; managed-platform trade-offs; metafield/metaobject/reference data modeling; and frontend-lead gap/cutover governance.
- verified: grounded Ajax, Storefront API, metafield/metaobject/reference, and current SCAPI/OCAPI direction in official Shopify/Salesforce documentation; calibration passed at 2,104 words.
- decided: required authority/source-to-target/gap records, typed relationship mapping, candidate evidence, owner-approved disposals, privacy-safe reconciliation, communication/rollback contracts, and `[VERIFY]` gates for all source/target/client/release facts.
- next: ch-66 exercise.
## 2026-08-14 · ch-66 · exercise
- wrote: a re-platforming exercise covering source-to-target/authority maps, SFCC/API translation, Magento/Woo/BigCommerce outcome mapping, typed data modeling, gaps, validation and cutover operations.
- shipped: ISML/controller/cartridge fragments, unsafe target Liquid, text-ID relationship, source API/customer-order browser request, and platform/data assumptions as real correction targets.
- decided: prohibited all source/target API calls, imports, exports, credentials, store changes and compatibility claims; required typed relationships, candidate evidence, operations records and `[VERIFY]` gates for all source/target/client facts.
- next: ch-66 solution.
## 2026-08-14 · ch-66 · solution
- wrote: source-to-target/mental-model/authority records, typed product/material/care-guide rendering, gap register, lead checklist, reconciliation boundaries and candidate validation.
- shipped: corrected solution section/snippet/asset plus mapping, authority, data, gap, checklist and matrix records.
- verified: removed source API/token/customer-order access, browser price authority, ISML/controller emulation, text-ID relationships, untyped imports and ungoverned cutover assumptions.
- next: ch-66 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-66 · review
- reviewed: passed SFCC/SFRA translation, other-platform mental models, managed-platform trade-offs, metafield/metaobject modeling, and frontend-lead checklist topics in scope order, calibration, practical-file parity, and anti-leak boundaries.
- verified: the course requires authority mapping, typed relationships, safe API boundaries, gap disposition, candidate reconciliation, communications and rollback before cutover.
- decided: applied final markers and retained `[VERIFY]` gates for all source system, Shopify plan/surface, data, client, owner, candidate, release and rollback facts.
- next: ch-67 lesson.
## 2026-08-14 · ch-67 · lesson
- wrote: 30-point evidence-led inherited-theme audit; dead/orphan proof ladder; verified-deprecation portfolio; honest refactor ranges; and decision-ready client audit report.
- verified: grounded the deprecation sweep in the local verified ledger; calibration passed at 2,106 words.
- decided: required evidence levels, candidate/owner/release/rollback records and `[VERIFY]` gates before classifying anything as unused, deprecated remediation-ready or estimated.
- next: ch-67 exercise.
## 2026-08-14 · ch-67 · exercise
- wrote: an inherited-theme audit exercise covering breadth, dependency evidence, deprecations, estimate, report, safe helper and validation matrix.
- shipped: legacy layout analytics, include section, candidate block, unsafe deletion helper, Ruby Script export and uncertain checkout/editor notes as real correction targets.
- decided: prohibited deletion, production/app/checkout actions, live data, vendor contact and unsupported claims; required evidence, owners, candidate tests, cutover/rollback and `[VERIFY]` boundaries.
- next: ch-67 solution.
## 2026-08-14 · ch-67 · solution
- wrote: audit checklist/inventory/proof records, a non-destructive helper, report status snippet, deprecation portfolio, transparent estimate, client report and candidate validation matrix.
- shipped: corrected solution layout/snippet/asset plus all audit, dependency, portfolio, estimate, report and matrix records.
- verified: removed deletion network behavior, unqualified dead-code conclusions, direct tracking migration, checkout assumption and fixed-price estimate claims.
- next: ch-67 review; do not transfer solution implementation into course files.
## 2026-08-14 · ch-67 · review
- reviewed: passed audit checklist, orphan/dead-code proof, include/script/checkout/Scripts deprecations, honest estimation, and client-report topics in scope order, calibration, practical-file parity and anti-leak boundaries.
- verified: the course requires local evidence to be bounded, deprecations to be behavior-led, estimates to declare uncertainty, and reports to supply owners, decisions, acceptance and rollback.
- decided: applied final markers and retained `[VERIFY]` gates for all theme/editor/app/configuration/client/release/rollback facts.
- next: ch-68 lesson.
## 2026-08-15 · ch-68 · lesson
- wrote: multi-market apparel brief translation, information architecture/content modeling, design-token/settings contract, component inventory, market decision log, and quality-budget governance.
- verified: grounded markets, dynamic-source, performance and accessibility facts in current Shopify documentation; calibration passed at 2,224 words.
- decided: preserved `[VERIFY]` gates for plan/market/catalog/editor/owner/baseline/target facts; required typed content decisions, component cards and budget-register evidence before implementation.
- next: ch-68 exercise.
## 2026-08-15 · ch-68 · exercise
- wrote: a capstone architecture exercise covering multi-market brief, content decisions, bounded settings/tokens, component inventory, market log, budgets and candidate validation.
- shipped: real config, section, snippet, asset and notes starters that expose unsafe global data/settings, duplicated product forms, hidden guide dependencies and blocking global JavaScript.
- decided: prohibited store/market deployment, production content, unbounded settings and asserted targets; required `[VERIFY]` gates, one product-form authority, typed content records and route/fixture quality budgets.
- next: ch-68 solution.
## 2026-08-15 · ch-68 · solution
- wrote: capstone brief, architecture/content decisions, semantic global settings, presentational card, explicit guide, bounded campaign section, market log, budget register and candidate matrix.
- shipped: corrected config/sections/snippets/asset plus all capstone decision and validation records.
- verified: removed arbitrary CSS/HTML/data settings, implicit product dependencies, duplicated card purchase form, parser-blocking external bundle and untestable quality claims.
- next: ch-68 review; do not transfer solution implementation into course files.
## 2026-08-15 · ch-68 · review
- reviewed: passed multi-market brief, information/content architecture, token/settings contract, component inventory and quality-budget topics in scope order, calibration, practical-file parity and anti-leak boundaries.
- verified: the capstone starts with bounded owners, typed content, semantic controls, component cards, candidate fixture budgets and explicit uncertainties rather than a theme implementation.
- decided: applied final markers and retained `[VERIFY]` gates for plan, markets, data, editor, owner, baseline, target, release and rollback facts.
- next: ch-69 lesson.
