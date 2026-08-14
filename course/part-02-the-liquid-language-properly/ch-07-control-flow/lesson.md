<!-- STATUS: draft -->
---
id: ch-07
title: "Control Flow"
part: 2
words: 2504
---

# Chapter 7 — Control Flow

Liquid conditions are where a familiar syntax becomes risky. You can write an `if` that looks like JavaScript, Ruby, or Twig, see it render once, and still encode the wrong business rule because Liquid has no parentheses and evaluates logical operators from right to left. In a theme, that usually becomes a badge shown to the wrong customer, a fallback that hides a configuration error, or an unavailable product presented as purchasable. The remedy is not cleverer one-line logic. It is a disciplined way to choose branches and make precedence visible.

## What you'll be able to do

- Select `if`, `unless`, or `case` for the shape of a storefront decision.
- Compare Shopify values with Liquid’s supported operators.
- Read compound conditions with Liquid’s right-to-left precedence.
- Replace ungroupable boolean expressions with named intermediate decisions.
- Use ternary-style assignments and `default` without hiding a legitimate value.

## 7.1 `if` / `elsif` / `else` / `unless`

`if` chooses markup when a condition is true. `elsif` adds an ordered alternative; `else` owns the remaining state. The order matters: Liquid stops at the first matching branch, so write the most specific condition before the broad fallback. A theme reader should be able to read the branches as a merchant rule, not as a compact programming puzzle.

```liquid
<!-- sections/product-status.liquid — product template -->
{% if product.available == false %}
  <p class="product-status product-status--unavailable">Unavailable</p>
{% elsif product.price == 0 %}
  <p class="product-status product-status--free">Available at no cost</p>
{% else %}
  <p class="product-status product-status--available">Available now</p>
{% endif %}
```

The first branch establishes the non-purchasable state before price messaging. Reversing those conditions would let an unavailable zero-price product receive the “available” copy. The condition sequence is part of the feature contract, not an incidental implementation detail.

A useful way to review an `elsif` chain is to write a small state table before reading code. List the possible combinations that matter, then identify the first branch each one reaches. For this panel, an unavailable product must reach the first branch regardless of price; an available zero-price product reaches the second; remaining available products reach the final branch. If two rows should produce different buyer-facing outcomes but reach the same branch, the rule needs a new condition or a different branch order. This method catches logic errors before the markup distracts you.

`unless` is a readable negative branch: it renders when its condition is false. Use it when the ordinary reader-facing sentence is naturally negative, such as “unless a merchant has supplied a note.” Do not turn it into a double-negative obstacle merely to avoid writing `if`.

```liquid
<!-- sections/product-status.liquid -->
{% unless section.settings.notice == blank %}
  <p>{{ section.settings.notice | escape }}</p>
{% endunless %}
```

This says exactly what the component needs: render the notice unless its setting is blank. It is clearer than `if section.settings.notice != blank` when no `else` branch follows. When a condition has several positive and negative alternatives, use `if` rather than nesting `unless` around more logic.

## 7.2 `case` / `when` with multiple values

Use `case` when one expression determines a small, closed set of variants. It is a better fit than an `elsif` ladder when the question is “which known value is this?” rather than “which independently evaluated predicate is true?” Common theme examples include product type labels, template suffixes, or a configured presentation style.

```liquid
<!-- sections/product-status.liquid -->
{% case section.settings.tone %}
  {% when 'calm', 'neutral' %}
    <p class="product-status product-status--quiet">Review ready</p>
  {% when 'urgent' %}
    <p class="product-status product-status--urgent">Action required</p>
  {% else %}
    <p class="product-status">Standard review</p>
{% endcase %}
```

A single `when` can list multiple literal values separated by commas. That groups variants with the same result without duplicating markup. Keep each value explicit; a `when` is not a place for a range test or an arbitrary boolean expression. If the rule depends on availability *and* tags, it is not a one-value dispatch problem and belongs in an `if` structure.

Include an `else` when the setting or object can produce a value outside your expected list. A fallback is not evidence that the input was valid; it is a deliberate buyer-facing behavior for an unhandled state. During development, make unexpected values observable rather than silently mapping every unknown state to a reassuring message.

`case` also keeps change review small. Adding a new permitted tone is a new `when` value near the other supported values, rather than a new condition embedded inside a longer availability decision. If two variants start acquiring different prerequisites, split them back into conditions. A case block expresses value dispatch; stretching it to encode unrelated facts makes the merchant rule harder to test and obscures which value actually selected the output.

## 7.3 Operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `or`, `and`, `contains`

Liquid conditions use comparison operators for equality and ordering, plus `and` and `or` for logical composition. `contains` asks whether a string contains a substring or an array contains an exact member. It is not a general object search, and it does not replace a loop for structured records.

```liquid
<!-- sections/product-status.liquid — product template -->
{% if product.tags contains 'seasonal' and product.available %}
  <p>Seasonal item available now.</p>
{% endif %}

{% if cart.item_count >= 3 %}
  <p>Cart review is required.</p>
{% endif %}
```

The first condition combines an array-membership check with a boolean property. The second compares a numeric count. Keep the operands compatible with the question you are asking. A money-formatted label is presentation text, not a price for an ordering comparison; an unfilled text setting should usually be tested against `blank`, as Chapter 5 established.

`contains` can be especially tempting with strings because it looks concise. Treat it as a literal membership or substring question, not semantic classification. For example, a product tag named `summer-sale` contains `summer`, but a free-text description containing “summer” does not make the product part of a merchant-defined collection. Use the object surface that owns the business classification instead of a broad text search when one exists.

Before adding `contains`, name the exact left-hand value and the exact member or substring that counts. `product.tags contains 'gift-ready'` is a contract a merchant can manage and a reviewer can inspect. `product.description contains 'gift'` is a linguistic guess that can change when copywriters revise prose. The operator is correct in both syntactic forms; the data contract determines whether it is correct for the storefront decision.

```liquid
<!-- Wrong: presentation text is not a reliable business category -->
{% if product.description contains 'gift' %}
  <p>Gift wrapping is included.</p>
{% endif %}

<!-- Right: a merchant-controlled tag expresses the intended category -->
{% if product.tags contains 'gift-ready' %}
  <p>Gift wrapping is included.</p>
{% endif %}
```

## 7.4 **No parentheses**: operator precedence is right-to-left — the classic senior-dev trap

Liquid does not allow parentheses to group `and` and `or` conditions. It evaluates compound logic from **right to left**. Do not import JavaScript precedence, where `and`-like operators are commonly resolved before `or`-like operators. A line can look perfectly legible to a senior developer and still mean a different rule in Liquid.

```liquid
<!-- Liquid reads this from right to left -->
{% if product.available or product.tags contains 'staff-pick' and cart.item_count > 0 %}
  <p>Eligible for the release panel.</p>
{% endif %}
```

Read the rightmost group first: `product.tags contains 'staff-pick' and cart.item_count > 0`, then combine that result with `product.available`. If the business rule is not exactly that grouping, do not try to force it into one condition. Parentheses are not an option and comments do not change evaluation.

```liquid
<!-- Wrong: parentheses are not supported in Liquid conditions -->
{% if (product.available or product.tags contains 'staff-pick') and cart.item_count > 0 %}
  <p>Eligible for the release panel.</p>
{% endif %}

<!-- Right: represent the intended groups with nested branches -->
{% if cart.item_count > 0 %}
  {% if product.available or product.tags contains 'staff-pick' %}
    <p>Eligible for the release panel.</p>
  {% endif %}
{% endif %}
```

The nested form says what the rule means: a non-empty cart is required, then either availability or a staff-pick tag is acceptable. It is longer and safer. When a condition has multiple independent ideas, name them rather than preserving a compact line whose grouping another reviewer must reconstruct.

The rule applies to `elsif` conditions too. Each branch condition has its own right-to-left evaluation, and branch order then determines which matching result wins. Do not assume that writing a more “obvious” expression fixes precedence. Make the required condition outermost, then nest the alternatives it gates. The resulting indentation is not cosmetic; it is the grouping Liquid actually executes.

## 7.5 Emulating complex boolean logic with `assign` and `capture`

Liquid has no boolean-expression builder with parentheses, so establish intermediate decisions in ordered code. An assigned flag is useful when it represents a named business condition and remains a boolean-like value. Start with the normal state, then assign the exception after its prerequisites are checked.

```liquid
<!-- sections/product-status.liquid -->
{% assign show_release_note = false %}

{% if product.available %}
  {% if product.tags contains 'seasonal' %}
    {% assign show_release_note = true %}
  {% endif %}
{% endif %}

{% if show_release_note %}
  <p>Seasonal release note applies.</p>
{% endif %}
```

The flag turns the compound requirement into a readable name. It also creates one place to test the final decision while leaving the prerequisite branches obvious. Avoid assigning `true` to a vague name such as `valid`; the name should say which user-visible behavior it controls.

For a more involved decision, write each prerequisite as a short branch close to the source that owns it. A collection-membership condition belongs near tags; a merchant setting guard belongs near the setting; an availability check belongs near the current product. Combining them only after their meanings are clear reduces the chance that a future change adds a new `or` to the wrong side of a right-to-left expression.

`capture` is appropriate only when the decision’s final product is rendered string content. You might capture a composed status fragment and print it once, but do not capture the text `true` or `false` as a substitute for a boolean flag. Captured output is string content; Chapter 6 explains why that distinction matters for later conditions and filters.

> [VERIFY] When a condition depends on an object-specific property or an exact tag contract, verify that surface in the relevant Shopify object reference. Do not use a broad `contains` test to guess a business state the data model does not define.

## 7.6 Ternary-style patterns and the `default` filter as a fallback operator

Liquid has no JavaScript ternary expression. The dependable ternary-style pattern is to assign a default value, then replace it in the branch that changes it. This is especially useful when the final result is a label or class that will be rendered in one place.

```liquid
<!-- sections/product-status.liquid -->
{% assign status_label = 'Available now' %}

{% unless product.available %}
  {% assign status_label = 'Unavailable' %}
{% endunless %}

<p>{{ status_label }}</p>
```

The code is direct: choose the ordinary label, then override it for the exception. It does not conceal a branch inside output markup. For more than two variants, use `case` or a clearly ordered `if` chain instead of accumulating assignments that make it hard to know which branch won.

Keep fallback construction close to the value it protects. A default label should be assigned where its source state is evaluated, not several files away in a layout or an unrelated snippet. That locality lets a reviewer answer two questions together: what did this component expect, and what does a buyer see when that expectation is not met? It also prevents an accidental generic fallback from erasing a more useful state message chosen by a specific branch.

When a condition grows after a merchant request, re-read the branch order rather than merely appending an `or`. A new eligibility exception may belong inside an existing prerequisite, before a broad fallback, or in a new `case` value. The smallest textual change is not always the smallest semantic change in Liquid. Reconstruct the state table, name the intended grouping, and choose a nested branch or assigned flag when the one-line expression no longer makes the outcome obvious.

That review discipline is particularly valuable for promotional rules. A condition that seems to add one harmless exception can expose an offer to unavailable products or hide a message from an eligible customer if it lands on the wrong side of a logical operator. The code should make a merchandiser’s priority order inspectable without mentally simulating undocumented precedence.

The `default` filter provides a presentation fallback when a value is blank. It is useful for a merchant-controlled text value when a component has a sensible displayed alternative.

```liquid
<!-- sections/product-status.liquid -->
<p>{{ section.settings.notice | default: 'No release note has been configured.' | escape }}</p>
```

This is a fallback operator, not a validation system. It can make a blank setting buyer-safe, but it should not hide a misspelled object property or a missing input to a snippet. When `false` is a meaningful configuration value, check the filter’s `allow_false` option before applying `default`; otherwise the fallback may erase an intentional false state. Use an explicit branch when the difference between false, blank, and absent is business-significant.

A good fallback sentence remains honest about the owner of the absence. “No release note has been configured” is appropriate for a blank merchant setting. “No product was found” should not be emitted merely because a misspelled property rendered blank. The first is a designed state; the second is a code or context problem that needs verification before it becomes storefront copy.

## Gotchas

- **Writing JavaScript-style parentheses.** Liquid does not support them in conditions.
- **Assuming `and` wins before `or`.** Liquid compound conditions are evaluated right to left.
- **Using `contains` as a general search engine.** It tests string substrings or array membership, not object structure.
- **Replacing every branch with `default`.** A fallback filter cannot explain which state was absent or invalid.
- **Capturing boolean text.** Use an assigned flag for a decision and capture only intentional rendered output.
- **Putting a broad branch before a specific one.** `elsif` ordering is part of the storefront rule.

## Checklist

- [ ] I can state the exact merchant rule each branch represents.
- [ ] I choose `case` only for a single expression with known literal variants.
- [ ] I read `and` and `or` from right to left and never attempt parentheses.
- [ ] I split compound decisions into named or nested checks when grouping matters.
- [ ] I use `default` for buyer-facing blank fallbacks, not to conceal a broken contract.

## Related

- `ch-05-types-truthiness-nil` — blank, false, and missing-value behavior used by conditions.
- `ch-06-variables-scope` — explicit local values and rendered-string boundaries.
- `ch-08-iteration-and-collections` — collection traversal beyond membership tests.
- `ch-09-liquid-data-shaping` — transformed values and capture at larger scale.
- `ch-21-snippets-as-apis` — input validation and explicit reusable-component contracts.

[1]: https://shopify.dev/docs/api/liquid/tags/if "Shopify Liquid if tag"
