# How to work through this course

You are a working frontend developer. This course takes you from "I know JavaScript and
CSS" to "I can build and ship a Shopify theme that another developer is happy to
inherit." It is 83 units — 72 chapters and 10 appendices — with 71 hands-on exercises.

Nothing here explains loops, variables, HTTP or CSS layout. It explains Shopify.

---

## 1. Before your first chapter

Do these once. Skipping them turns the whole course into reading, and reading alone will
not make you competent at Liquid.

1. **Create a Shopify Partner account and a development store.** Free, no card. The
   development store is where every exercise gets tested.
2. **Install the Shopify CLI** and confirm `shopify version` runs.
3. **Pull a reference theme into `playground/`.** Dawn is the standard reference: run
   `shopify theme pull` inside `playground/`, or clone Dawn there. `playground/` is your
   live sandbox and is git-ignored — break it freely.
4. **Read `course/part-00-front-matter/ch-00-front-matter/lesson.md`.** It defines the
   conventions the rest of the book uses. Ten minutes now saves confusion later.
5. **Skim `docs/DEPRECATIONS.md`.** Every dated platform fact in the course is quoted
   from that one file. When Shopify changes something, that file is what gets corrected.

### One convention to understand up front

You will see this marker throughout the book:

> `> [VERIFY]`

It means **this depends on your store, your plan, your apps, or current Shopify docs —
confirm it before you rely on it.** It is not unfinished writing. Theme work breaks when
a tutorial substitutes for a live platform, so the course marks those seams instead of
pretending they do not exist. When you hit one, go and check it in your own store.

---

## 2. The loop for one chapter

Every chapter folder holds the same four things:

```
course/part-XX-.../ch-NN-.../
  lesson.md     what you read
  exercise.md   what you build
  starter/      the files you edit
  notes.md      yours — the course never writes here
```

Work them in this order, every time.

**1. Read `lesson.md`.** Fifteen to twenty-five minutes. Do not skim the code blocks;
each one names the file and template it belongs to, and that context is half the lesson.

**2. Write in `notes.md` as you go.** It is pre-seeded with *What clicked* and *What I
had to look up*. This is not busywork — the second heading becomes your personal
weak-spot list, and it is what you re-read before the capstone.

**3. Do `exercise.md` inside `starter/`.** Each exercise states its own time budget;
most are 60–75 minutes. Run your work in the dev store through `playground/`. The
starter files are deliberately incomplete, or deliberately wrong. That is the exercise.

**4. Get it working, or get properly stuck for twenty minutes or more.** The stuck time
is where the learning happens. Do not reveal the solution to escape discomfort.

**5. Only then, reveal the solution:**

```bash
python scripts/reveal.py ch-08
```

That copies the solution into the chapter folder as `SOLUTION-REVEALED.md`. Diff it
against what you built. The solution explains *why* each decision was made before it
shows the code — read the reasoning, not just the snippet.

**6. Hide it again when you are done:**

```bash
python scripts/reveal.py ch-08 --hide
```

Revealing is a deliberate act you can see in your shell history. That is the point. The
solutions live in a separate `solutions/` mirror precisely so that opening a chapter
folder never puts the answer next to the question.

---

## 3. The route

Go in order, Part 1 through Part 14, chapters 1 to 72. Each chapter records what it
assumes you already know, and skipping forward breaks that chain.

| Part | Title | Units | What you can do after it |
|---|---|---:|---|
| 1 | The Mental Model | 3 | Say exactly where Liquid runs, and what it can and cannot reach |
| 2 | The Liquid Language, Properly | 9 | Write correct Liquid: types, scope, control flow, filters, Drops, debugging |
| 3 | Theme Architecture | 13 | Structure a theme — templates, sections, blocks, snippets, settings |
| 4 | Data & Objects | 9 | Work confidently with products, variants, collections, cart, customers |
| 5 | Forms & Native Interactions | 2 | Use Shopify's native forms instead of reinventing them |
| 6 | Interactivity Without A Framework | 5 | Section Rendering API, Cart AJAX API, web components |
| 7 | Assets, Media & Performance | 6 | Images, CSS, JS and fonts that stay fast on a real storefront |
| 8 | Internationalization & Markets | 2 | Build themes that survive translation and multiple markets |
| 9 | Quality, Tooling & Workflow | 6 | Git, environments, review and release without breaking a live store |
| 10 | Apps, Extensions & The Edge Of Liquid | 5 | Know where the theme ends and an app begins |
| 11 | Accessibility, SEO & Trust | 3 | Ship themes that are usable, findable and compliant |
| 12 | Migration & Modernization | 4 | Take over someone else's theme without rewriting it blindly |
| 13 | Capstone Build | 4 | Build a complete theme end to end |
| 14 | Working As A Liquid Specialist | 1 | Operate as the professional, not just the coder |

**Pace honestly.** A chapter is roughly 1.5 to 2.5 hours done properly. The full course
is on the order of 150 to 200 hours. At one chapter per weekday that is about four
months; at one a week it is well over a year. Pick a rhythm you will actually keep —
this course rewards consistency far more than intensity.

### The appendices are not reading

Part 15 (`app-a` through `app-j`) is reference material. Do not read it front to back.
Use it:

| When you need | Open |
|---|---|
| What a tag does | Appendix A — Complete Liquid Tag Reference |
| What a filter does | Appendix B — Complete Filter Reference |
| What properties an object has | Appendix C — Complete Object Reference |
| What a setting type accepts | Appendix D — Schema & Settings Reference |
| A platform limit or quota | Appendix E — Platform Limits & Quotas |
| Whether something is dead | Appendix F — Deprecated & Removed |
| A pattern you keep rewriting | Appendix G — Snippet Cookbook |
| Something to pin above your desk | Appendix H — Cheat Sheets (printable) |
| A term this course uses precisely | Appendix I — Glossary |
| Where to go next | Appendix J — Resources |

---

## 4. If you cannot do the whole thing

Two shorter routes, both defined in the front matter.

**Job-driven.** You have a specific task at work now. Read Part 1 — three chapters, do
not skip it — then jump to the part covering your task, then do the Part 3 architecture
chapters before you ship anything another person will maintain.

**Migration-driven.** You inherited a theme. Read Part 1, then Part 12 (Migration &
Modernization), then follow its pointers back into whichever chapters cover the surfaces
you actually found. Do not modernize a file just because it looks old.

Both routes leave gaps. That is a trade you are making knowingly, not a shortcut.

---

## 5. Tracking where you are

The repo scripts track *authoring* status, not your reading. Track yourself simply — a
checklist in your own file, or a line in each chapter's `notes.md` when you finish it.

What is worth measuring is not chapters read, but whether you could rebuild the exercise
from an empty folder a week later. If you cannot, that chapter is not finished, whatever
your checklist says.

---

## 6. Rules that make this work

- **Never open `solutions/` directly.** Use `scripts/reveal.py`. The friction is the
  feature.
- **Do every exercise in a real dev store.** Liquid behaves differently against real
  product, cart and market data than against anything you imagine.
- **Chase every `[VERIFY]` in your own store.** That habit — confirming a platform fact
  instead of assuming it — is most of what separates a competent theme developer from a
  merely confident one.
- **Fill in `notes.md`.** Future you is the reader.
- **When the course and Shopify's docs disagree, Shopify wins.** The platform moves.
  `docs/DEPRECATIONS.md` records what was true and when it was checked; re-verify
  anything dated before you depend on it.

---

## 7. Building a PDF

To read offline or print:

```bash
python scripts/build_book.py
pandoc book/shopify-liquid-book.md -o book/shopify-liquid.pdf \
  --toc --toc-depth=3 --number-sections --highlight-style=tango
```

That concatenates all 83 units — roughly 186,000 words — into one document. `book/` is
git-ignored.
