# Workflow

## Why the chapter is the generation unit

- A chapter is ~6–10 PDF pages: one focused AI pass, one focused study session.
- Parts (40–95 pages) are too big — the model thins out and drifts halfway through.
- Sub-topics (83 units would become ~600) are too small — you'd get
  83× the boilerplate and no narrative.
- The labs in the index already cluster at chapter level.
- One chapter = one git commit = one reviewable diff.

## The four passes per chapter

| Pass | Produces | Goes to |
|---|---|---|
| 1. Lesson | `lesson.md` | chapter folder |
| 2. Exercise | `exercise.md` + `starter/` files | chapter folder |
| 3. Solution | `solution.md` + `solution/` files | **`solutions/` mirror** |
| 4. Review | corrections, ledger updates | in place |

Run them in order, committing each one before the next begins. That ordering is what
stops the solution leaking into the lesson: `lesson.md` is written and committed before
the solution is ever composed, so it cannot be written backwards from the answer. The
passes may be chained in a single session — the ordering carries the guarantee, not the
session boundary.

The one pass that still needs care is the review. It holds the solution in context while
editing `lesson.md`, so it may correct the lesson but must never anticipate the answer
in it.

## Order of work

Do not generate strictly 1 → 83. Generate in this order:

1. `docs/DEPRECATIONS.md` — fill it in first, by hand or with search. Everything
   downstream depends on it being right.
2. Appendices A–D (tag, filter, object, schema references). They are mostly
   mechanical, and later chapters can link into them instead of restating.
3. Parts I → XIV in order.
4. Front matter last — you can only write "how to read this book" once the book exists.

## Study loop

1. Read `lesson.md`. Take notes in `notes.md` as you go.
2. Do `exercise.md` inside `starter/`, in a real dev store via `playground/`.
3. Get it working, or get properly stuck for 20+ minutes.
4. `python scripts/reveal.py <unit-id>` — then diff your work against the solution.
5. Delete `SOLUTION-REVEALED.md` when you're done. It is git-ignored, so it never
   pollutes the repo or your next pass through the chapter.

## Keeping 83 generations coherent

The three ledgers in `docs/` are the whole trick:

- **COVERAGE.md** — what has been taught. Prevents chapter 31 re-explaining drops.
- **GLOSSARY.md** — agreed terms. Prevents "theme block" / "block file" / "reusable
  block" being three names for one thing across three chapters.
- **DEPRECATIONS.md** — dates and limits. Prevents chapter 58 contradicting chapter 14.

If a generation pass doesn't update the ledgers, reject the output and re-run it.
