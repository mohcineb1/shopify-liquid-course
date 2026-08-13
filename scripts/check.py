#!/usr/bin/env python3
"""Fail on any generated file that falls below the chapter 18 calibration floor."""

import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # unit titles contain UTF-8; Windows consoles default to cp1252

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

# ~85% of the calibration targets in CLAUDE.md (lesson 2,450 / exercise 700 / solution 1,350)
FLOOR = {"lesson": 2100, "exercise": 600, "solution": 1150}


def words(path):
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    if "STATUS: not generated" in text[:200]:
        return None
    return len(text.split())


def main():
    rows = []
    for part in M["parts"]:
        for unit in part["units"]:
            c = ROOT / "course" / part["slug"] / unit["slug"]
            s = ROOT / "solutions" / part["slug"] / unit["slug"]
            targets = [("lesson", c / "lesson.md")]
            if unit["has_exercise"]:
                targets += [("exercise", c / "exercise.md"), ("solution", s / "solution.md")]
            for kind, path in targets:
                n = words(path)
                if n is not None and n < FLOOR[kind]:
                    rows.append((unit["id"], kind, n, FLOOR[kind]))

    if not rows:
        print("calibration OK — every generated file is at or above its floor.")
        return 0

    print(f"{len(rows)} file(s) below the chapter 18 calibration floor:\n")
    for uid, kind, n, floor in rows:
        print(f"  {uid:7s} {kind:9s} {n:5d} words  (floor {floor}, short by {floor - n})")
    print("\nRedo these passes: python3 scripts/prompt.py <unit> --kind <pass>")
    return 1


if __name__ == "__main__":
    sys.exit(main())
