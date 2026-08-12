#!/usr/bin/env python3
"""Resolve the single next action. The agent runs this instead of choosing."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

DONE = {"draft", "final"}
PLACEHOLDER = "_(date + what you checked against)_"


def state(path):
    if not path.exists():
        return "todo"
    head = path.read_text(encoding="utf-8")[:200]
    for marker in ("not generated", "draft", "final"):
        if f"STATUS: {marker}" in head:
            return "todo" if marker == "not generated" else marker
    return "draft"


def ordered_units():
    index = {u["id"]: (p, u) for p in M["parts"] for u in p["units"]}
    ids = [f"app-{c}" for c in "abcd"]
    ids += [f"ch-{n:02d}" for n in range(1, 73)]
    ids += [f"app-{c}" for c in "efghij"]
    ids += ["ch-00"]
    return [index[i] for i in ids if i in index]


def pending(part, unit):
    c = ROOT / "course" / part["slug"] / unit["slug"]
    s = ROOT / "solutions" / part["slug"] / unit["slug"]
    L = state(c / "lesson.md")
    E = state(c / "exercise.md") if unit["has_exercise"] else "final"
    S = state(s / "solution.md") if unit["has_exercise"] else "final"

    if L == "todo":
        return "lesson", L
    if E == "todo":
        return "exercise", L
    if S == "todo":
        return "solution", L
    if "final" not in (L,) or L != "final" or E != "final" or S != "final":
        return "review", L
    return None, L


def main():
    dep = (ROOT / "docs" / "DEPRECATIONS.md").read_text(encoding="utf-8")
    if PLACEHOLDER in dep:
        print("NEXT:  gate — verify platform facts")
        print("PASS:  deprecations")
        print("DO:    check every row of docs/DEPRECATIONS.md against the current")
        print("       Shopify developer changelog and theme docs. Correct anything wrong,")
        print("       add anything missing, then replace the 'Verified on' placeholder")
        print("       with today's date and what you checked.")
        print("WRITE: docs/DEPRECATIONS.md")
        print("THEN:  append to PROGRESS.md, then stop.")
        print("\nEverything downstream quotes this file. Nothing else runs until it is verified.")
        return

    units = ordered_units()
    started, fresh = None, None
    for part, unit in units:
        p, lesson_state = pending(part, unit)
        if p is None:
            continue
        if lesson_state != "todo" and started is None:
            started = (part, unit, p)
        if fresh is None:
            fresh = (part, unit, p)

    target = started or fresh
    if not target:
        print("NEXT:  nothing — every unit is final.")
        print("DO:    python3 scripts/build_book.py")
        return

    part, unit, p = target
    cdir = Path("course") / part["slug"] / unit["slug"]
    sdir = Path("solutions") / part["slug"] / unit["slug"]
    out = {
        "lesson": cdir / "lesson.md",
        "exercise": f"{cdir / 'exercise.md'} and files under {cdir / 'starter'}/",
        "solution": f"{sdir / 'solution.md'} and files under {sdir / 'solution'}/",
        "review": "corrections in place, then STATUS: final on all three files",
    }[p]

    print(f"NEXT:  {unit['id']} — {unit['title']}  (part {part['number']}: {part['title']})")
    print(f"PASS:  {p}")
    print(f"RUN:   python3 scripts/prompt.py {unit['id']} --kind {p}")
    print(f"BRIEF: {cdir / 'BRIEF.md'}")
    print(f"WRITE: {out}")
    if p == "solution":
        print("       ^ solutions mirror only. Nothing about the answer goes in course/.")
    print("THEN:  update docs/COVERAGE.md + docs/GLOSSARY.md, append to PROGRESS.md, stop.")

    todo = sum(1 for pt, u in units if pending(pt, u)[0] is not None)
    print(f"\n{len(units) - todo}/{len(units)} units complete.")


if __name__ == "__main__":
    main()
