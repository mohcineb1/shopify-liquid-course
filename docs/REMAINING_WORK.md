# Remaining work

All 83 units are written and marked `final`. `scripts/next.py` reports nothing left to
generate and `scripts/check.py` exits 0. **Authoring is done; none of the work below is
authoring.** Do not re-author chapters and do not regenerate anything that exists.

Counts verified 2026-09-08. Re-measure before you start — do not trust these numbers
after the first batch lands.

---

## 1. Seven units are written in French

The highest-severity defect, because a reader simply cannot read those chapters. It is
invisible to `check.py`, which counts words without inspecting language, which is why
all 19 files are marked `final` and pass every check.

| Unit | Affected files |
|---|---|
| ch-20 content-for | lesson |
| ch-22 settings-architecture | lesson, exercise, solution |
| ch-23 the-theme-editor-contract | lesson, exercise, solution |
| ch-24 ai-generated-blocks | lesson, exercise, solution |
| ch-25 on-the-horizon-block-and-partial | lesson, exercise, solution |
| ch-26 global-objects | lesson, exercise, solution |
| ch-27 products | lesson, exercise, solution |

Nineteen files across seven consecutive units — one authoring run that drifted language
and was never caught. Translate them into the course's English voice per
`docs/STYLE_GUIDE.md`; do not paraphrase or re-teach, and hold the existing structure so
the `COVERAGE.md` ledger stays true. The code blocks are already language-neutral.

Note that `ch-21` is *not* affected, so the run was not contiguous — check each file
rather than assuming a range.

Detect them again with a stopword ratio, not by eye:

```bash
grep -rlE '\b(vous|votre|cette|lorsque|chaque)\b' course/ solutions/ --include=*.md
```

---

## 2. `[VERIFY]` contamination

**1,071 markers across 266 files.** Find them with:

```bash
grep -rn "\[VERIFY\]" course/ solutions/ --include=*.md
```

Per `CLAUDE.md` rule 6, `[VERIFY]` means "I could not confirm this Shopify fact and
refuse to guess." It is a blockquote flag on its own line. It is **not** a fill-in
placeholder.

Most current uses are wrong — they sit inside table cells standing in for values the
reader supplies, e.g. `Accessibility owner [VERIFY]`. Fix each one as follows:

- **Reader-supplied value** → replace with a placeholder the reader understands, e.g.
  `<your published theme ID>`. Never leave a `[VERIFY]` token in a table.
- **Genuine uncertainty** → check it against shopify.dev now. If you can confirm it,
  state the fact and cite the page. If you cannot, keep it as a proper blockquote
  `[VERIFY]` flag on its own line, outside tables.

Work in batches of about five files, committing each batch.

---

## 3. Files under target

```bash
python scripts/check.py
```

It prints a `THIN` list: **112 files** that clear the floor but sit under 95% of target
(lesson 2,450 words / exercise 700 / solution 1,350). Several sit within a few words of
the floor, which means the pass stopped the moment the check went green.

Chapter 18 is the reference and sits at 102–106% on all three files. Read
`course/part-03-theme-architecture/ch-18-blocks-the-three-kinds/` and its `solutions/`
mirror before you start, then bring `THIN` files up by adding real teaching — worked
examples, edge cases, failure modes — never padding.

---

## 4. Rebuild and confirm

```bash
python scripts/build_book.py
grep -c "\[VERIFY\]" book/shopify-liquid-book.md
```

Report the final word count and the remaining `[VERIFY]` count, which should be zero or
only genuine unresolved flags you can name individually.

---

## Working rules

These were broken during the authoring run and are what made the mess above possible.

- **One logical change per commit.** A previous session pushed a single commit of 310
  files spanning 18 chapters. That is what let seven French units through unreviewed.
- Commit and push to `main` after each batch. Never a branch, never a PR — every session
  reads repo state from `main`.
- `scripts/check.py` must exit 0 before every commit. It is necessary, not sufficient:
  it did not catch the language drift.
- Solutions live only in the `solutions/` mirror, never in `course/`.
- Append one entry to `PROGRESS.md` per batch.
- If you are unsure about a Shopify object, filter or limit, verify it against
  shopify.dev. Do not guess, and do not paper over it with a `[VERIFY]` token.
