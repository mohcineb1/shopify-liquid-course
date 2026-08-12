#!/usr/bin/env python3
"""Progress report across all units."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

def state(path):
    if not path.exists():
        return "-"
    head = path.read_text(encoding="utf-8")[:200]
    if "STATUS: not generated" in head:
        return "todo"
    if "STATUS: draft" in head:
        return "draft"
    if "STATUS: final" in head:
        return "final"
    return "??"

DONE = {"draft", "final"}
rows, tally = [], {"lesson": 0, "exercise": 0, "solution": 0, "total": 0}

for part in M["parts"]:
    for unit in part["units"]:
        c = ROOT / "course" / part["slug"] / unit["slug"]
        s = ROOT / "solutions" / part["slug"] / unit["slug"]
        L, E, S = state(c / "lesson.md"), state(c / "exercise.md"), state(s / "solution.md")
        tally["total"] += 1
        for k, v in (("lesson", L), ("exercise", E), ("solution", S)):
            if v in DONE:
                tally[k] += 1
        rows.append((unit["id"], unit["title"][:44], unit["type"][:9], L, E, S))

print(f"{'id':7s} {'title':44s} {'type':9s} {'lesson':8s} {'exercise':9s} {'solution':8s}")
print("-" * 92)
for r in rows:
    print(f"{r[0]:7s} {r[1]:44s} {r[2]:9s} {r[3]:8s} {r[4]:9s} {r[5]:8s}")

t = tally["total"]
print("-" * 92)
print(f"lessons {tally['lesson']}/{t} · exercises {tally['exercise']}/{t} · "
      f"solutions {tally['solution']}/{t}")

nxt = next((r[0] for r in rows if r[3] == "todo"), None)
if nxt:
    print(f"\nnext: python scripts/prompt.py {nxt} --kind lesson")
