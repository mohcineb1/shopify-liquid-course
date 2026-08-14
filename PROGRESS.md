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
