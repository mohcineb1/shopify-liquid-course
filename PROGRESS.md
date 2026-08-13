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
