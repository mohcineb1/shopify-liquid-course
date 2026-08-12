#!/usr/bin/env python3
"""Deliberately copy a solution into its chapter folder. Git-ignored."""

import argparse, json, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

ap = argparse.ArgumentParser()
ap.add_argument("unit")
ap.add_argument("--hide", action="store_true", help="remove a revealed solution")
args = ap.parse_args()

for part in M["parts"]:
    for unit in part["units"]:
        if unit["id"] != args.unit.lower():
            continue
        cdir = ROOT / "course" / part["slug"] / unit["slug"]
        sdir = ROOT / "solutions" / part["slug"] / unit["slug"]
        dst, dstdir = cdir / "SOLUTION-REVEALED.md", cdir / "solution-revealed"

        if args.hide:
            dst.unlink(missing_ok=True)
            shutil.rmtree(dstdir, ignore_errors=True)
            print(f"hidden again: {unit['id']}")
            sys.exit(0)

        if not (sdir / "solution.md").exists():
            sys.exit(f"no solution written yet for {unit['id']}")
        shutil.copy2(sdir / "solution.md", dst)
        if (sdir / "solution").exists():
            shutil.copytree(sdir / "solution", dstdir, dirs_exist_ok=True)
        print(f"revealed -> {dst.relative_to(ROOT)}")
        print(f"hide it again with: python scripts/reveal.py {unit['id']} --hide")
        sys.exit(0)

sys.exit(f"unknown unit: {args.unit}")
