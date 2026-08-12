<!-- STATUS: draft -->
# Chapter 18 — Exercise

**Time:** 45–60 minutes · **Type:** refactor

## Goal

Turn a duplicated, section-block-based component into a single set of reusable blocks that serves two different sections, accepts app content, and keeps one element permanently in place.

## Context

A skincare merchant has a "Why buy from us" bar on their home page: a heading, then a row of icon-and-text items separated by thin dividers. It was built as a section with section blocks.

Marketing now wants the same row of items on the product page, so a previous developer copy-pasted the whole thing into a second section with a different wrapper class. Both files are in `starter/sections/`.

Three new requests have landed in the same sprint:

1. The merchant wants to build the same row on a landing page next month, and does not want to file another ticket to do it.
2. They have installed a reviews app and want its badge widget to sit in the row, between the items.
3. Their brand guidelines say the heading is mandatory. It must always be at the top of the bar. A merchant may hide it for a seasonal campaign, but must not be able to delete it or drag it into the middle of the row.

## Requirements

- [ ] 1. The icon-and-text item's markup and schema exist in exactly one place in the theme.
- [ ] 2. Both `trust-bar` and `product-highlights` render that item, and a merchant can add, remove, and reorder items independently in each.
- [ ] 3. A merchant who is building a third section can add the item there without a developer editing that section's schema for each new block type.
- [ ] 4. The divider is usable inside these two sections but is **not** offered to merchants as a standalone choice in the block picker.
- [ ] 5. Both sections accept blocks from installed apps.
- [ ] 6. The heading renders at the top of the bar, above the row, in both sections. It can be hidden but not deleted, and cannot be reordered among the items.
- [ ] 7. The items render as `<li>` elements inside the section's `<ul>` — no extra wrapper elements between the list and its items.
- [ ] 8. Every block is selectable and highlightable in the theme editor.
- [ ] 9. Write one line per element in `notes.md` naming which of the three kinds you chose and why. If you kept anything as a section block, justify it against the decision rule.

## Constraints

- No JavaScript.
- No app, no third-party code.
- Do not copy Dawn or Horizon source. Read them if you like; type your own.
- Nothing outside Chapter 18 and earlier. If you find yourself needing an API this chapter did not cover, you are overbuilding.
- The visual result must be unchanged. `starter/assets/trust-bar.css` is finished and should not need edits — if you are rewriting CSS, your markup has drifted.

## Starter

```
starter/sections/trust-bar.liquid          the home page version
starter/sections/product-highlights.liquid the copy-pasted version
starter/assets/trust-bar.css               done, leave it alone
```

Copy all three into your dev theme and confirm the bar renders before you change anything.

## Done when

In the theme editor, on a dev store:

- Adding an item to the trust bar leaves the product highlights bar untouched, and vice versa.
- The item appears in the block picker for both sections; the divider appears only after you are inside one of them.
- The heading sits above the row in both sections and offers a hide control, not a delete control.
- Clicking any item in the editor highlights that item on the canvas.
- Inspecting the DOM shows `<li>` elements as direct children of `<ul class="trust-bar__list">`.
- Deleting the second section file entirely would not break the first.

## Stretch

Let a merchant nest a button inside an icon item, so a single item can carry its own call to action — without the item hardcoding what a button is. Get it working, then explain in `notes.md` what stops you from allowing unlimited nesting depth.

The solution file does not answer the stretch.
