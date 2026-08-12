#!/usr/bin/env python3
"""Concatenate every generated lesson into one markdown file for PDF export."""

import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
OUT = ROOT / "book"
OUT.mkdir(exist_ok=True)

def body(text):
    text = re.sub(r"^<!--.*?-->\s*", "", text, flags=re.S)
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            text = text[end + 4:]
    return text.strip()

book, missing = [
    "---",
    'title: "Shopify Liquid Programming"',
    'subtitle: "Server-Rendered Storefronts for Frontend Engineers"',
    "toc: true",
    "toc-depth: 3",
    "numbersections: true",
    "---",
    "",
], []

for part in M["parts"]:
    book.append(f"\n\\newpage\n\n# Part {part['number']}: {part['title']}\n")
    if part.get("meta"):
        book.append(f"*{part['meta']}*\n")
    for unit in part["units"]:
        p = ROOT / "course" / part["slug"] / unit["slug"] / "lesson.md"
        text = p.read_text(encoding="utf-8") if p.exists() else ""
        if not text or "STATUS: not generated" in text:
            missing.append(unit["id"])
            continue
        book.append("\n\\newpage\n")
        book.append(body(text))
        book.append("")

target = OUT / "shopify-liquid-book.md"
target.write_text("\n".join(book), encoding="utf-8")
words = len(target.read_text(encoding="utf-8").split())
print(f"wrote {target.relative_to(ROOT)} — ~{words:,} words, ~{words // 450} pages")
if missing:
    print(f"skipped {len(missing)} unwritten units: {', '.join(missing[:12])}"
          + (" ..." if len(missing) > 12 else ""))
print("\npandoc book/shopify-liquid-book.md -o book/shopify-liquid.pdf \\\n"
      "  --toc --toc-depth=3 --number-sections --highlight-style=tango")
