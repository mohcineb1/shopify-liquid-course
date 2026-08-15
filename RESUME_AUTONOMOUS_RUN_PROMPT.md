# Prompt de reprise après interruption — terminer tout le cours

The user’s last instruction was effectively:

> “If there is still work, do not come back to me until you finish.”

A previous autonomous run started before chapter 51 and was working through the course without requesting interim approval. It reached chapter 51 (Theme Check) at approximately **54/83 units complete**, then continued through later chapters. The run stopped because the session/usage limit interrupted it, **not** because the course was complete and **not** because the user changed the instruction.

Your task is to resume that interrupted run and finish **all remaining work** in `mohcineb1/shopify-liquid-course` on `main`. Do not return after a chapter, appendix, pass, checkpoint, or progress update. Do not ask for approval. Return only after the entire book is finished, fully validated, committed, and pushed, unless continuation is genuinely impossible.

## First: recover the actual state instead of trusting an old progress message

The old chapter-51 message is historical context only. Do **not** restart chapter 51 or redo completed chapters just because the earlier interruption occurred there. Begin by checking the current repository state:

```bash
cd /home/ubuntu/shopify-liquid-course
git pull origin main
git status --short
python3 scripts/next.py
python3 scripts/check.py
```

Then read `CLAUDE.md`, `prompts/00-kickoff.md`, `docs/WORKFLOW.md`, `docs/CONTENT_CONTRACT.md`, `docs/STYLE_GUIDE.md`, and `docs/DEPRECATIONS.md`. These repository files are authoritative.

## Verified historical progress

The latest pushed checkpoint on `origin/main` is:

```text
05ab4db Complete chapters 49 through 66 and begin chapter 67
```

The repository already contains completed earlier work through **Appendices A–D** and **chapters 1–66**. The pushed checkpoint includes all four passes for chapters 49–66 and the draft lesson/ledger/progress work for chapter 67.

A preserved local worktree may also contain completed but uncommitted chapter-67 exercise, solution, review, starter files, solution mirror, final markers, and progress entries. Therefore use `git status --short` and `python3 scripts/next.py` as the source of truth:

| State you find | Correct continuation point |
| --- | --- |
| Fresh clone / clean worktree at `05ab4db` | `ch-67 exercise` |
| Preserved local worktree containing finalized ch-67 files | `ch-68 lesson` |

Do not delete or overwrite preserved local chapter-67 work. Do not duplicate its lesson entries in `docs/COVERAGE.md` or `docs/GLOSSARY.md`.

## Remaining units

From the pushed checkpoint, 13 course units remained: chapter 67, chapters 68–72, Appendices E–J, and `ch-00` front matter. If the local finalized chapter 67 work is present, 12 units remain: chapters 68–72, Appendices E–J, and `ch-00`.

The mandatory order is already encoded in `scripts/next.py`. Do not choose your own sequence. The expected remaining sequence is:

1. Finish chapter 67 if necessary: exercise → solution → review.
2. Complete chapters 68, 69, 70, 71, and 72: lesson → exercise → solution → review for each.
3. Complete Appendices E–J in the order selected by `scripts/next.py`.
4. Complete `ch-00` front matter last.
5. Run full validation, commit every accumulated change directly to `main`, push, and report completion.

## Non-negotiable pass loop

For every pass, without exception:

```bash
python3 scripts/next.py
python3 scripts/prompt.py <unit> --kind <pass>
# write only to the exact paths named by the prompt
python3 scripts/check.py
```

A `FAIL` in `scripts/check.py` must be repaired immediately in the same pass. Treat `THIN` as a warning that should normally be expanded toward the target; do not treat the floor as the desired length.

Write to these targets:

| File | Minimum | Target |
| --- | ---: | ---: |
| `lesson.md` | 2,100 words | approximately 2,450 words |
| `exercise.md` | 600 words | approximately 700 words |
| `solution.md` | 1,150 words | approximately 1,350 words |

Every exercise must ship real relevant files under `starter/`, typically in actual theme paths such as `assets/`, `sections/`, `snippets/`, `layout/`, `blocks/`, or `templates/`. Every solution must ship a real, matching implementation under the `solutions/` mirror’s `solution/` tree. Solutions never go into `course/`.

Before every exercise, re-read the chapter 18 exercise reference. Before every solution, re-read the chapter 18 solution reference. The review pass may correct genuine scope or factual issues in course material, but must never transfer answer-specific content from the solution into the lesson or exercise.

## Course-quality and safety rules

Cover every numbered item from each unit’s `BRIEF.md`, in order. Do not teach another chapter’s material; link to it where appropriate. Update `docs/COVERAGE.md`, `docs/GLOSSARY.md`, and `PROGRESS.md` as required by the current pass and repository convention. Never edit `index/`, `manifest.json`, or unrelated units.

Use `docs/DEPRECATIONS.md` for verified Shopify platform facts. If an object, filter, API, surface, deadline, limit, app capability, client configuration, or version-specific fact is uncertain, add an inline `> [VERIFY]` marker and continue. Never invent certainty and never stop due solely to uncertainty.

Use only local/candidate/sanitized fixtures. Do not publish a theme, alter an app, access customer data, change checkout, trigger tracking, make payments, contact vendors, use credentials, or perform production actions.

## Git behavior

The user wants continuous work without interim reports. Do not make an interim checkpoint commit unless the user explicitly asks or the current execution context is genuinely about to end. If that happens, finish the current pass, run checks, commit all accumulated changes directly to `main`, push to `origin/main`, and report only the commit hash(es) and exact next action.

At final completion, run `python3 scripts/check.py` successfully across the repository. Review `git status`, commit all remaining changes directly to `main`, push to `origin/main`, and report a concise completion summary with commit hash and the final unit count.

## Start now

Recover the real state using the commands above. If the local chapter-67 completion exists, start with:

```bash
python3 scripts/next.py
# expected: ch-68 lesson
```

Then keep running until **all 83 units are complete**. Do not come back early.
