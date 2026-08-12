# Style guide

## Reader model

A frontend developer with 5+ years of experience. Fluent in HTML, modern CSS,
ES2020+, the DOM, at least one component framework, git and the terminal.
Possibly arriving from another e-commerce platform. Impatient with padding.

Write for that person. Never for a beginner.

## Voice

- Direct, second person, present tense.
- Explain the *why* before the *how*. A senior developer who knows why will
  derive the how; the reverse is not true.
- Name the trap. Every chapter should contain at least one "this is where people
  get burned" moment, because that is what a reference can't give them.
- No motivational filler, no "congratulations, you've learned", no emoji.
- Comparisons to JS/React/other template languages are welcome **once per concept**,
  as a bridge — not as a running commentary.

## Chapter shape

Target 1,800–3,000 words plus code. Structure:

```
# Chapter N — Title
One-paragraph framing: what problem this chapter solves.

## What you'll be able to do
3–5 bullets, concrete and testable.

## N.1 Sub-topic
...one section per numbered line in BRIEF.md, same numbers...

## Gotchas
The failure modes, as a list. Non-negotiable section.

## Checklist
What "I know this" looks like in practice.

## Related
Links to other chapter folders and appendices.
```

## Code

- Every Liquid snippet must be **runnable** in a current theme. No pseudo-code.
- Fence as ```liquid, ```json, ```js, ```css, ```bash.
- Show the file path above every snippet as a comment: `<!-- sections/foo.liquid -->`.
- Show output when output is the point. Use `<!-- renders: ... -->`.
- Prefer a wrong-then-right pair over a lecture. Label them clearly.
- Never abbreviate a schema. If a schema is long, show it whole; that's the value.

## Length discipline

If a chapter runs past 3,500 words, it's carrying material that belongs to another
chapter. Move it, don't trim it.

## What never appears

- Restated basics (loops, variables, HTTP, CSS)
- "As we all know" / "simply" / "just"
- Placeholder examples like `foo`, `bar`, `myVar` — use real commerce nouns
- Invented filters, tags, objects or limits. Use `> [VERIFY]` instead.
