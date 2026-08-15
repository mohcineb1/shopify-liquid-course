# Continuation prompt — Shopify Liquid Course

You are continuing the repository **`mohcineb1/shopify-liquid-course`** on branch **`main`**. Your task is to complete the entire 83-unit Shopify Liquid course autonomously. Do **not** ask for approval or return interim progress. Return only when the full course is complete, all checks pass, the final work is committed and pushed, or continuation is genuinely impossible.

## Authoritative operating rules

Read `CLAUDE.md`, `prompts/00-kickoff.md`, `docs/WORKFLOW.md`, `docs/CONTENT_CONTRACT.md`, `docs/STYLE_GUIDE.md`, and `docs/DEPRECATIONS.md` before changing the next course unit. The repository contract is authoritative.

Run `python3 scripts/next.py` before every pass. It alone chooses the unit and pass. Then run `python3 scripts/prompt.py <unit> --kind <lesson|exercise|solution|review>`. Follow its paths exactly. Never choose a different unit, edit another unit, alter `index/` or `manifest.json`, or write a solution into `course/`.

Every lesson must cover every numbered BRIEF scope item in order and must target approximately **2,450 words** (minimum 2,100). Every exercise targets approximately **700 words** (minimum 600) and includes real, relevant files under `starter/`, normally across actual theme paths such as `assets/`, `sections/`, `snippets/`, `layout/`, `blocks/`, or `templates/`. Every solution targets approximately **1,350 words** (minimum 1,150), lives only under the `solutions/` mirror, and includes corresponding real files under `solution/`. The review pass may correct factual/scope issues in the lesson but must never add implementation knowledge derived from the solution.

Use `docs/DEPRECATIONS.md` for platform facts. Flag uncertain object/filter/platform/limit/version facts inline as `> [VERIFY]` and continue; never stop merely because a platform fact is uncertain. Re-read chapter 18’s `exercise.md` before every exercise and chapter 18’s solution reference before every solution. Update `docs/COVERAGE.md`, `docs/GLOSSARY.md`, and append to `PROGRESS.md` as required by the pass contract. Run `python3 scripts/check.py` after each pass; a `FAIL` must be corrected immediately. The `THIN` output is not a failure but signals content below the target and should normally be expanded.

Use candidate/local/sanitized fixtures. Do not make production store, checkout, app, customer-data, payment, tracking, browser, or vendor changes. Keep responsibilities, consent, privacy, accessibility, performance, app boundaries, and rollback explicit. Do not claim unverified client/store/configuration facts.

## Git and continuity behavior

Work continuously through all remaining passes with no interim report. The user has previously requested no commit until completion, but has also explicitly requested a checkpoint commit. The currently pushed checkpoint is described below. From here, do not create another checkpoint unless the user explicitly requests it or the context/session is genuinely about to end; then finish the current pass, run checks, commit accumulated work directly to `main`, push, and report only the commit hash(es) and exact next action.

At final completion, run the full `python3 scripts/check.py`, review `git status`, commit all accumulated files directly to `main`, push to `origin/main`, then report completion with the commit hash and a concise validation summary.

## Pushed state — source of truth for a fresh continuation

The remote `origin/main` is at:

```text
05ab4db Complete chapters 49 through 66 and begin chapter 67
```

This checkpoint includes **all four passes for chapters 49–66**, plus the **draft lesson, coverage/glossary entry, and progress entry for chapter 67**. It does **not** include chapter 67’s exercise, solution, review, starter files, solution mirror, or final status.

Earlier work already pushed includes Appendices A–D and chapters 1–48. Thus a fresh clone starts at:

```bash
python3 scripts/next.py
# Expected: ch-67 exercise
```

For a fresh clone, finish chapter 67 in this order:

1. `ch-67 exercise`: write the practical audit brief and real starter files.
2. `ch-67 solution`: create solution mirror and worked audit answer.
3. `ch-67 review`: finalise statuses/BRIEF, run check, append progression.

Do not duplicate the chapter 67 lesson entries already present in `docs/COVERAGE.md` and `docs/GLOSSARY.md`.

## Current local workspace state — use only if the workspace was preserved

In the original workspace, chapter 67 has already been completed locally but remains **uncommitted** after `05ab4db`:

- `ch-67` lesson, exercise, solution, review, `BRIEF.md`, starter tree, solution tree, and `PROGRESS.md` updates are present and final.
- `python3 scripts/next.py` returns **`ch-68 lesson`**.
- The local worktree therefore begins the remaining course at chapter 68. Do not discard or overwrite the local chapter 67 work.

Before deciding the true next action, always run:

```bash
git status --short
python3 scripts/next.py
```

If the worktree is clean and the remote checkpoint is the basis, resume `ch-67 exercise`. If the local chapter 67 changes exist, resume `ch-68 lesson`.

## Remaining course units

There are **13 unfinished units** from the remote checkpoint, or **12 units after locally completed chapter 67**:

| Order | Unit | Required work |
| --- | --- | --- |
| 1 | ch-67 — Auditing an Inherited Theme | Exercise, solution, review only on a fresh clone; complete locally but uncommitted in preserved workspace |
| 2 | ch-68 — Brief & Architecture | Lesson, exercise, solution, review |
| 3 | ch-69 — Core Templates & Sections | Lesson, exercise, solution, review |
| 4 | ch-70 — Commerce & Interactivity | Lesson, exercise, solution, review |
| 5 | ch-71 — Editor, Apps & Quality | Lesson, exercise, solution, review |
| 6 | ch-72 — Launch & Handover | Lesson, exercise, solution, review |
| 7 | Appendix E | All passes directed by `scripts/next.py` |
| 8 | Appendix F | All passes directed by `scripts/next.py` |
| 9 | Appendix G | All passes directed by `scripts/next.py` |
| 10 | Appendix H | All passes directed by `scripts/next.py` |
| 11 | Appendix I | All passes directed by `scripts/next.py` |
| 12 | Appendix J | All passes directed by `scripts/next.py` |
| 13 | ch-00 — Front matter | All passes directed by `scripts/next.py`; this is last |

The intended generation order is Appendices A–D, chapters 1–72, Appendices E–J, then ch-00. Do not reorder it; rely on `scripts/next.py`.

## Recent chapter context

Chapter 67 is an evidence-led inherited-theme audit. Its final local content covers: a 30-point checklist; a proof ladder for candidate orphans/dead code; a deprecation portfolio for `include`, ScriptTags, checkout remnants/additional scripts, and legacy Shopify Scripts; transparent estimation; and a decision-ready client report. Its practical files intentionally contain unsafe deletion, legacy `include`, checkout/tracking assumptions and Ruby Script artifacts so the solution can replace them with inventory and governance—not execution. The verified facts are recorded in `docs/DEPRECATIONS.md`.

Chapter 68 begins the capstone. Its scoped topics are: 68.1 multi-market apparel client brief; 68.2 information architecture and content modeling; 68.3 design tokens and settings contract; 68.4 component inventory (sections, blocks, snippets); 68.5 performance and accessibility budgets agreed up front. Read its BRIEF and prompt before writing.

## Execution loop

Repeat without user interruption:

```bash
python3 scripts/next.py
python3 scripts/prompt.py <unit> --kind <pass>
# write only the exact requested files
python3 scripts/check.py
# fix every FAIL immediately
```

Continue all the way to ch-00 and final repository validation. Never stop after a lesson, exercise, solution, chapter, appendix, or natural-looking checkpoint. Only final completion—or a genuinely impossible blocker—justifies reporting back.

## Final success criteria

The course is complete only when every unit through ch-00 is final; lessons/exercises/solutions meet their minimum calibration; starters and solution mirrors exist; BRIEF scope boxes are completed; coverage, glossary, and progress are current; `scripts/check.py` exits successfully; git is clean after the final commit; and `origin/main` contains the completed work.
