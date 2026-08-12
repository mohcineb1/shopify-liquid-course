# Pass 4 — Review

Review the generated unit against its brief and the repo's contracts.

Check and report, as a checklist with pass/fail:

1. Every numbered sub-topic in BRIEF.md is covered, in order, with matching numbers.
2. No topic covered that belongs to another unit (name any that leaked in).
3. No basics re-taught.
4. Every Liquid tag, filter, object and property used actually exists. Flag anything
   doubtful with `[VERIFY]`.
5. Every platform date and limit matches DEPRECATIONS.md verbatim.
6. Terminology matches GLOSSARY.md — no synonyms for existing terms.
7. No solution or structural hint leaked into lesson.md or exercise.md.
8. The exercise is solvable from the lesson alone.
9. Word count is inside 1,800–3,000 (or flagged as needing a split).
10. COVERAGE.md and GLOSSARY.md were updated.

Then apply the fixes. Do not rewrite passing sections.

## Closing the unit

When the checklist passes and fixes are applied:

- Set `<!-- STATUS: final -->` at the top of `lesson.md`, `exercise.md` and `solution.md`
- Set `status: final` in the unit's `BRIEF.md` front matter
- Tick the scope checkboxes in `BRIEF.md` that the lesson actually covers

`scripts/next.py` uses these markers to decide the unit is done. Leave them unset and it
will keep offering the same unit forever.
