# Shopify Liquid Programming — Course Repo

A self-study course built one chapter at a time by an AI author, from a fixed index,
into a repo where **course**, **exercise** and **solution** live in separate places.

- **16 parts · 83 generation units · 71 exercises**
- Generation unit: **one chapter**
- Source of truth for scope: `index/shopify-liquid-course-index.md`
- Machine-readable plan: `manifest.json`

## Layout

```
course/            what you read and work in
  part-03-theme-architecture/
    ch-18-blocks-the-three-kinds/
      BRIEF.md     <- input for the AI author (scope contract)
      lesson.md    <- generated course chapter
      exercise.md  <- generated exercise
      starter/     <- starter files you edit
      notes.md     <- your own notes
solutions/         mirrored tree — NEVER opened while working
  part-03-theme-architecture/
    ch-18-blocks-the-three-kinds/
      solution.md
      solution/
docs/              style guide, content contract, coverage log, glossary, deprecations
prompts/           the prompt templates the AI author runs on
scripts/           prompt assembly, status, reveal, book build
index/             the original course index
playground/        your Shopify dev theme (CLI working directory)
book/              generated — the whole course concatenated for PDF export
```

## The rule that makes this work

`solutions/` is a **mirror tree, not a subfolder**. Working inside a chapter folder
never puts a solution file in front of you. When you genuinely want it:

```bash
python scripts/reveal.py ch-18
```

That copies the solution into the chapter folder as `SOLUTION-REVEALED.md`,
which is git-ignored. Revealing is a deliberate act you can see in your shell history.

## Daily loop

```bash
python scripts/status.py                      # what's done, what's next
python scripts/prompt.py ch-18 --kind lesson  # assemble the prompt -> paste into Claude
# ...paste the generated lesson.md into the chapter folder (or let Claude Code write it)
python scripts/prompt.py ch-18 --kind exercise
python scripts/prompt.py ch-18 --kind solution
```

Then: read the lesson → do the exercise in `starter/` → only then reveal.

## Driving the coding agent

Paste `prompts/00-kickoff.md` once. After that the whole vocabulary is:

```
next          run passes until a stop condition
one pass      exactly one pass, then stop
next unit     finish the current unit
status        report only
redo ch-18 lesson
```

State lives in the files, not in the chat. `scripts/next.py` reads the status markers
and prints exactly one action; `PROGRESS.md` carries the narrative between sessions.
Closing a laptop mid-chapter costs nothing.

```bash
make next     # what am I doing?
make status   # 83-row progress table
```

## Building the PDF

```bash
python scripts/build_book.py            # -> book/shopify-liquid-book.md
pandoc book/shopify-liquid-book.md -o book/shopify-liquid.pdf \
  --toc --toc-depth=3 --number-sections --highlight-style=tango
```

**Working through the course as a learner? Start with [`STUDY.md`](STUDY.md).**

See `docs/WORKFLOW.md` for the full method and `CLAUDE.md` for the agent contract.
