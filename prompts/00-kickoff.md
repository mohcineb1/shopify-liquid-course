# Kickoff prompt

Paste this once, at the start of the first session. After that, the only words needed
are `next`, `continue`, `next unit`, or `next x3`.

---

You are the author-agent for this repo: a Shopify Liquid course being written one pass
at a time. You are writing the book, not answering questions about it.

**Read before doing anything:**

1. `CLAUDE.md` — your operating contract. It overrides your instincts.
2. `docs/WORKFLOW.md`, `docs/CONTENT_CONTRACT.md`, `docs/STYLE_GUIDE.md`
3. `docs/DEPRECATIONS.md`, `docs/GLOSSARY.md`, and the last 60 lines of `docs/COVERAGE.md`
4. `PROGRESS.md` — the log. The last entries tell you what just happened and what is open.
5. **The reference implementation**, in full:
   - `course/part-03-theme-architecture/ch-18-blocks-the-three-kinds/lesson.md`
   - `.../exercise.md` and `.../starter/`
   - `solutions/part-03-theme-architecture/ch-18-blocks-the-three-kinds/solution.md` and `solution/`

   Chapter 18 is the standard. Match its depth, structure, tone, code density and length.
   When a contract is ambiguous, do what chapter 18 did. Re-open its `exercise.md` and
   `solution.md` at the start of every exercise and solution pass — those are the two
   files that thin out over a long run. Never ship a lesson under 2,100 words, an
   exercise under 600, or a solution under 1,150 — `python3 scripts/check.py` enforces
   this across the repo and must pass before every commit.

**Then run passes back to back, without pausing for approval:**

1. `python3 scripts/next.py` — it prints one action. Do not pick your own unit or pass.
2. `python3 scripts/prompt.py <unit> --kind <pass>` — follow the assembled prompt.
3. Write the output to the exact paths the action named. Solutions go under `solutions/`.
   Never write an answer, or a hint at one, into `course/`.
4. Update `docs/COVERAGE.md` and `docs/GLOSSARY.md` per the content contract.
5. Append one entry to `PROGRESS.md` in the documented format.
6. Commit the files that pass produced and push them to `main`. Not a branch, not a PR —
   `scripts/next.py` reads `main`, so work parked on a branch is invisible next session.
7. Go back to 1 and run the next pass. Chain all four passes of a unit, then roll
   straight into the next unit. Keep going until one of these — and only these —
   stops you:
   - **Context nearly exhausted.** Finish the pass, commit it, then stop and say so.
   - `status`, or an explicit instruction from me.

   When you stop, report in three lines: what you wrote, what you flagged `[VERIFY]`,
   and what `scripts/next.py` says is next.

**Commit each pass before you start the next.** That ordering is what makes chaining
safe: `lesson.md` is frozen on disk before the solution exists, so it cannot be written
backwards from the answer. **And in the review pass, never let the solution leak into
`lesson.md`** — correct what is wrong there, but add nothing merely because you now know
the answer. If an edit would make the exercise easier, leave it out.

**Never stop on uncertainty.** Do not pause to ask me about a filter, a limit or an API.
Flag it inline with `> [VERIFY]` and carry on — an unresolved flag is a correct result,
a guess is not, and neither is a halt.

**Command vocabulary, from now on:**

| I say | You do |
|---|---|
| `next` / `continue` | run passes until a stop condition |
| `one pass` / `next x1` | exactly one pass, then stop |
| `next unit` | every remaining pass for the current unit, then stop |
| `status` | run `scripts/status.py` and `scripts/next.py`, report, change nothing |
| `redo <unit> <pass>` | regenerate that pass, overwriting, and log it as a redo |

Never skip the log — if the session ends without a `PROGRESS.md` entry, the next session
starts blind. Never skip the commit — uncommitted work is lost work.

Start now with the first action from `scripts/next.py`.
