#!/usr/bin/env python3
"""Fail on any generated file that falls below the chapter 18 calibration floor."""

import json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")  # unit titles contain UTF-8; Windows consoles default to cp1252

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

# the calibration targets in CLAUDE.md; the floor is ~85% of each and is a rejection
# threshold, not a goal — landing on it means the pass stopped as soon as it could.
TARGET = {"lesson": 2450, "exercise": 700, "solution": 1350}
FLOOR = {"lesson": 2100, "exercise": 600, "solution": 1150}
THIN = 0.95  # at or above floor but under this share of target: written to the threshold


def words(path):
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    if "STATUS: not generated" in text[:200]:
        return None
    return len(text.split())


def scaffold(directory):
    """Real files in a starter/ or solution/ tree, ignoring the .gitkeep placeholder."""
    if not directory.exists():
        return 0
    return sum(1 for p in directory.rglob("*") if p.is_file() and p.name != ".gitkeep")


def main():
    short, thin, bare = [], [], []
    for part in M["parts"]:
        for unit in part["units"]:
            c = ROOT / "course" / part["slug"] / unit["slug"]
            s = ROOT / "solutions" / part["slug"] / unit["slug"]
            targets = [("lesson", c / "lesson.md")]
            if unit["has_exercise"]:
                targets += [("exercise", c / "exercise.md"), ("solution", s / "solution.md")]
            for kind, path in targets:
                n = words(path)
                if n is None:
                    continue
                if n < FLOOR[kind]:
                    short.append((unit["id"], kind, n))
                elif n < TARGET[kind] * THIN:
                    thin.append((unit["id"], kind, n))

                # docs/WORKFLOW.md: the exercise pass ships starter/ files, the
                # solution pass ships solution/ files. Prose alone is not the pass.
                if kind == "exercise" and not scaffold(c / "starter"):
                    bare.append((unit["id"], "exercise", f"course/{part['slug']}/{unit['slug']}/starter/"))
                if kind == "solution" and not scaffold(s / "solution"):
                    bare.append((unit["id"], "solution", f"solutions/{part['slug']}/{unit['slug']}/solution/"))

    if short:
        print(f"FAIL — {len(short)} file(s) below the calibration floor:\n")
        for uid, kind, n in short:
            print(f"  {uid:7s} {kind:9s} {n:5d} words  (floor {FLOOR[kind]}, short by {FLOOR[kind] - n})")

    if thin:
        print(f"\nTHIN — {len(thin)} file(s) clear the floor but sit under target:\n")
        for uid, kind, n in thin:
            pct = n / TARGET[kind] * 100
            print(f"  {uid:7s} {kind:9s} {n:5d} words  ({pct:.0f}% of target {TARGET[kind]})")
        print("\nThe floor is where a pass is rejected, not where it is finished.")
        print("Write to the target; a file parked just above the floor is under-written.")

    if bare:
        print(f"\nFAIL — {len(bare)} pass(es) shipped prose with no working files:\n")
        for uid, kind, where in bare:
            print(f"  {uid:7s} {kind:9s} {where} is empty")
        print("\ndocs/WORKFLOW.md: the exercise pass produces exercise.md AND starter/")
        print("files; the solution pass produces solution.md AND solution/ files.")

    if short or bare:
        print("\nRedo these passes: python3 scripts/prompt.py <unit> --kind <pass>")
        return 1
    if not thin:
        print("calibration OK — every generated file is at or near its target.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
