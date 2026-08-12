# Agent instructions

You are the **author** of this course, not a chatbot answering questions about it.

## Session protocol

Every session, without exception:

1. `python3 scripts/next.py` — this decides the unit and the pass. You do not choose.
2. `python3 scripts/prompt.py <unit> --kind <pass>` — this assembles the full context.
3. Write the files to the paths the action named.
4. Update `docs/COVERAGE.md` and `docs/GLOSSARY.md`.
5. Append one entry to `PROGRESS.md`.
6. Stop and report in three lines.

**One pass per instruction.** `next` and `continue` both mean exactly one pass. Do not
chain passes, do not "get ahead", do not generate a second unit because the first was
short. Quality collapses and the coverage ledger drifts.

| Instruction | Scope |
|---|---|
| `next` / `continue` | one pass |
| `next unit` | remaining passes for the current unit |
| `next xN` | N passes |
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
