#!/usr/bin/env python3
"""Assemble the full prompt for one unit and one pass."""

import argparse, json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # the assembled prompt is UTF-8; Windows consoles default to cp1252

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

KINDS = ("lesson", "exercise", "solution", "review")

def find(unit_id):
    for part in MANIFEST["parts"]:
        for unit in part["units"]:
            if unit["id"] == unit_id:
                return part, unit
    return None, None

def read(rel):
    p = ROOT / rel
    return p.read_text(encoding="utf-8") if p.exists() else ""

def tail(text, n):
    lines = [l for l in text.splitlines() if l.strip()]
    return "\n".join(lines[-n:])


def terms(glossary):
    """Compact the glossary to `term (first used)` pairs.

    The glossary is injected into every prompt and grows with every unit, so the
    full definition column would crowd out the unit's own material by the later
    parts. Its job here is to stop a second name being coined for a concept that
    already has one, and the term list alone does that. Full definitions stay in
    docs/GLOSSARY.md for when a pass needs to check wording.
    """
    out = []
    for line in glossary.splitlines():
        if not line.startswith("|"):
            continue
        # Take the first and last cells, never the middle: the definition column
        # legitimately contains pipes (the `|` filter operator is itself a term).
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3 or cells[0] == "Term" or set(cells[0]) <= {"-", ":"}:
            continue
        out.append(f"{cells[0]} ({cells[-1]})")
    if not out:
        return "_(no terms yet)_"
    return (
        "Terms already agreed — reuse these exactly, never coin a synonym. "
        "Full definitions in `docs/GLOSSARY.md`.\n\n" + "; ".join(out)
    )

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("unit", help="unit id, e.g. ch-18 or app-c")
    ap.add_argument("--kind", choices=KINDS, default="lesson")
    ap.add_argument("--out", help="write to file instead of stdout")
    args = ap.parse_args()

    part, unit = find(args.unit.lower())
    if not unit:
        sys.exit(f"unknown unit: {args.unit}")

    cdir = Path("course") / part["slug"] / unit["slug"]
    sdir = Path("solutions") / part["slug"] / unit["slug"]

    chunks = [
        read("prompts/_system.md"),
        "\n\n---\n\n# Repo contracts\n\n",
        read("docs/CONTENT_CONTRACT.md"),
        "\n\n---\n\n",
        read("docs/STYLE_GUIDE.md"),
        "\n\n---\n\n",
        read("docs/DEPRECATIONS.md"),
        "\n\n---\n\n",
        terms(read("docs/GLOSSARY.md")),
        "\n\n---\n\n# Already taught (do not re-teach)\n\n",
        tail(read("docs/COVERAGE.md"), 60) or "_(nothing yet — this is the first unit)_",
        "\n\n---\n\n",
        read(f"prompts/{args.kind}.md"),
        "\n\n---\n\n# The unit\n\n",
        f"Course folder: `{cdir}`\n",
        f"Solution folder: `{sdir}`\n\n",
        read(str(cdir / "BRIEF.md")),
    ]

    if args.kind in ("exercise", "solution", "review"):
        lesson = read(str(cdir / "lesson.md"))
        if "STATUS: not generated" in lesson:
            print(f"!! lesson.md for {unit['id']} is not generated yet", file=sys.stderr)
        chunks += ["\n\n---\n\n# The generated lesson\n\n", lesson]

    if args.kind in ("solution", "review"):
        chunks += ["\n\n---\n\n# The generated exercise\n\n",
                   read(str(cdir / "exercise.md"))]

    out = "".join(chunks)
    if args.out:
        Path(args.out).write_text(out, encoding="utf-8")
        print(f"wrote {args.out} ({len(out):,} chars)", file=sys.stderr)
    else:
        print(out)

if __name__ == "__main__":
    main()
