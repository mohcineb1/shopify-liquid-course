# Agent instructions

You are the **author** of this course, not a chatbot answering questions about it.

## Session protocol

Every session, without exception:

1. `python3 scripts/next.py` — this decides the unit and the pass. You do not choose.
2. `python3 scripts/prompt.py <unit> --kind <pass>` — this assembles the full context.
3. Write the files to the paths the action named.
4. Update `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
5. Append one entry to `PROGRESS.md`.
6. **Commit and push every completed pass to `main`.** Stage only the files produced or updated by the pass, create a descriptive commit, and push it to `main` before reporting. Do not open a feature branch or a PR: every session reads repo state from `main` via `scripts/next.py`, so a pass left on a branch is invisible to the next session and will be handed out again as if it never happened. Never start the next pass with uncommitted work from a completed pass.
7. Go back to step 1 and run the next pass, unless a stop condition below applies.
   When you do stop, report in three lines.

**Run continuously.** `next` and `continue` mean: keep running passes until you hit one
of the stop conditions below. Do not pause between passes for approval, do not ask
whether to carry on, and do not stop because a pass came out short. Chain all four
passes of a unit, then roll straight into the next unit.

**The stop conditions are the only reasons to stop:**

1. **Context is nearly exhausted.** Finish the current pass, commit it, then stop and
   say so. State lives in the files, so a fresh session resumes with nothing lost.
2. `status`, or an explicit instruction from me.

**Commit each pass before starting the next.** That ordering is what makes chaining
safe: `lesson.md` is written and committed before the solution is ever composed, so the
solution cannot be written backwards into the lesson. Never carry two passes' work in
the tree at once.

**The review pass must not leak the solution.** By pass 4 you are holding the solution
in context while editing `lesson.md`. Correct what is genuinely wrong there — errors,
gaps against the `BRIEF.md`, stale platform facts — but never add, sharpen or foreshadow
anything merely because you now know the answer. If an edit would make the exercise
easier, it does not belong in the review.

**Never stop on uncertainty.** Do not pause to ask about a filter, a limit, or an API
you are unsure of. Flag it inline with `> [VERIFY]` per hard rule 6 and keep going. An
unresolved flag is a correct result; a guess is not, and neither is a halt.

| Instruction | Scope |
|---|---|
| `next` / `continue` | run passes until a stop condition |
| `one pass` / `next x1` | exactly one pass, then stop |
| `next unit` | remaining passes for the current unit |
| `status` | report only, change nothing |
| `redo <unit> <pass>` | regenerate that pass, log it as a redo |

If `PROGRESS.md` and `scripts/next.py` disagree, trust `next.py` and note it in the log.

## Before writing anything

Read, in this order:

1. `docs/CONTENT_CONTRACT.md` — the required shape of every file you produce
2. `docs/STYLE_GUIDE.md` — voice, level, code conventions
3. `docs/DEPRECATIONS.md` — the platform facts every chapter must agree on
4. `docs/COVERAGE.md` — what previous chapters already taught (do not re-teach it)
5. The unit's own `BRIEF.md` — the scope contract for this chapter

## The reference implementation

Chapter 18 (`course/part-03-theme-architecture/ch-18-blocks-the-three-kinds/` and its
mirror in `solutions/`) is a complete, calibrated unit. Read all four files before your
first pass. Match its depth, structure, code density and length. Where a contract is
ambiguous, do what chapter 18 did. Calibration: lesson ~2,450 words, exercise ~700,
solution ~1,350.

**Re-read the matching chapter 18 file at the start of every exercise pass and every
solution pass** — not only before your first unit. Calibration decays over a long run,
and the exercise and the solution are what thin out first: the lesson carries the
explanation, so those two feel finished sooner than they are. They are not finished.
The exercise has to give the reader enough to build something real, and the solution
has to show the whole build with the reasoning behind it.

**Floor.** Never ship an exercise under 600 words or a solution under 1,150. Falling
below that means the task is under-specified or the walkthrough was cut short. Go back
and finish it; do not lower the target to match what you already wrote.

## Hard rules

1. **Scope is the contract.** Cover every numbered sub-topic in `BRIEF.md`, in order,
   reusing its numbering. Do not add topics that belong to another chapter — link to
   that chapter's folder instead.
2. **Never write a solution into `course/`.** Solutions go to the mirrored path under
   `solutions/`. If you are about to put an answer in a chapter folder, stop.
3. **Never re-teach the basics.** The reader is a working frontend developer. No
   explanations of loops, variables, HTTP, CSS layout, or "what is an API".
4. **One source of truth for dates and limits.** Anything in `docs/DEPRECATIONS.md`
   is quoted from there, never restated from memory.
5. **Update the ledgers.** After each unit, append to `docs/COVERAGE.md` and add any
   new terms to `docs/GLOSSARY.md`. This is what keeps 83 separate generations
   reading like one book.
6. **Flag uncertainty inline** with `> [VERIFY]` rather than inventing an API,
   a filter name, or a limit. A wrong Liquid filter is worse than a gap. Never resolve
   a `[VERIFY]` by guessing; either check a real source or leave the flag.
7. **Set the status markers.** Replace `<!-- STATUS: not generated -->` with
   `<!-- STATUS: draft -->` on any file you write, and `status: draft` in `BRIEF.md`.
   The review pass sets `final`. `scripts/next.py` reads these; if you skip them it will
   offer you the same unit forever.
8. **Never edit `index/`, `manifest.json`, or another unit's files** as a side effect.
   If the index is wrong, say so in the log and leave it alone.
