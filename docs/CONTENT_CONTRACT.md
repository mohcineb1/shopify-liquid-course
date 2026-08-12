# Content contract

The required shape of each generated file. Deviating breaks the build script and
the study loop.

## `lesson.md`

```markdown
<!-- STATUS: draft -->
---
id: ch-18
title: "Blocks: The Three Kinds"
part: 3
words: 2400
---

# Chapter 18 — Blocks: The Three Kinds
...body per STYLE_GUIDE.md...
```

Front matter is required — `scripts/build_book.py` reads it.

## `exercise.md`

```markdown
<!-- STATUS: draft -->
# Chapter 18 — Exercise

## Goal
One sentence. What exists at the end that didn't before.

## Context
The scenario. A real merchant problem, not "make a component".

## Requirements
- [ ] Numbered, checkable, unambiguous
- [ ] Each maps to something taught in this chapter

## Constraints
What you may NOT use (usually: no JS framework, no app, no copying Dawn).

## Starter
Which files in `starter/` to begin from.

## Done when
Observable acceptance criteria — what you can see in the theme editor / storefront.

## Stretch
Optional, harder, unsolved in the solution file.
```

Rules:
- The exercise must be **doable from the lesson alone**. No new API surface.
- No hints that give away the structure of the answer.
- Estimated time: 20–60 minutes for a practice unit, 2–4 hours for a capstone unit.

## `solutions/.../solution.md`

```markdown
<!-- STATUS: draft -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 18 — Solution

## The approach
Why this shape, before any code.

## Walkthrough
Requirement-by-requirement, matching the exercise's numbering.

## Full code
Complete files, not fragments.

## What people get wrong here
The 3–4 near-misses and why they fail.

## Stretch: direction only
A paragraph of guidance. Never the full answer.
```

## `starter/` and `solution/`

Real theme files at real theme paths, e.g. `starter/sections/featured-grid.liquid`.
Mirror the same paths in `solution/` so a diff is meaningful.

## Ledger entries

Append to `docs/COVERAGE.md`:

```markdown
### ch-18 — Blocks: The Three Kinds
**Taught:** section blocks vs theme blocks vs app blocks; the blocks/ directory;
schema differences; when to use each.
**Introduced terms:** theme block, app block, static block, block picker.
**Assumed known from earlier:** section schema (ch-17), snippets (ch-21 — forward ref).
**Deliberately deferred:** nesting depth and @theme wildcard -> ch-19.
```
