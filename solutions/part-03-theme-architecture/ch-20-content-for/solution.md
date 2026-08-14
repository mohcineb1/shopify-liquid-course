<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
---
id: ch-20-solution
title: "Solution — Compose a fixed heading with an editorial child flow"
chapter: ch-20
---

# Solution — Compose a fixed heading with an editorial child flow

The completed `editorial-flow` section has two visibly different composition rules. `_flow-title` is a declared static block rendered once in the heading region because the heading is structural. `flow-card` instances are dynamic editorial children rendered through the child slot because merchants need to add and reorder them. The wrapper snippet receives already-rendered child markup rather than trying to discover section or block context itself.

## 1. Render the fixed title at its invariant position

The static title belongs in the header. The parent calls the singular `content_for` form with the exact declared block type and stable ID. This preserves the component’s semantic order: heading first, editorial content second. The title may have settings or be hideable according to its own schema, but it is not available for drag-and-drop placement below cards.

```liquid
<header class="editorial-flow__header">
  {% content_for 'block', type: '_flow-title', id: 'title' %}
</header>
```

The call is not a lookup by product data, an indirect file include, or a request to render all blocks of a given type. It names the static component instance the parent owns. Use this form whenever position is a structural invariant. If the section instead used a dynamic slot for the title, a merchant could produce an unclear page hierarchy by moving it after unrelated content.

> [VERIFY] Confirm the current declaration and matching requirements for static blocks before using this singular `content_for` form in production.

## 2. Delegate dynamic children to Shopify

The dynamic cards are rendered once by the slot. No Liquid loop reads a block collection; no CSS `order` property reconstructs editorial order; no literal card count is embedded in code. Shopify’s configured JSON/editor state is the source of truth for which eligible children exist and where they appear.

```liquid
{% capture child_content %}
  {% content_for 'blocks' %}
{% endcapture %}
```

A merchant can add one card, add several, or reorder them. The parent stays correct because it owns a vertical flow, not the individual card positions. The DOM sequence follows the configured sequence, which also keeps keyboard and assistive-technology reading order aligned with the merchant’s intended content order.

The card block carries its own editor identity on its root element:

```liquid
<article class="flow-card" {{ block.shopify_attributes }}>
  <h3>{{ block.settings.heading | escape }}</h3>
  <p>{{ block.settings.body | escape }}</p>
</article>
```

This lets Shopify associate the rendered card with its configured instance. The card uses only block settings, so it remains valid if the section appears on a generic page and cards are moved by the merchant.

## 3. Wrap rendered output through a small snippet API

After the slot is captured, the parent calls the group wrapper with explicit arguments.

```liquid
{% render 'group',
  content: child_content,
  class: 'editorial-flow__cards'
%}
```

The snippet’s job is deliberately small:

```liquid
<div class="{{ class }}">{{ content }}</div>
```

It receives output, not hidden Shopify context. It does not use `section.blocks`, inspect a block ID, retrieve product data, or decide ordering. This makes the wrapper reusable with any compatible caller that can supply rendered content and a class. It also keeps the composition boundary testable: the parent owns the slot; the snippet owns only the grouping wrapper.

A wrapper should tolerate empty `content`. Whether it emits an empty wrapper or is guarded by the parent is a component decision, but it must be intentional. The wrapper must not add a duplicate heading, landmark, or list role that conflicts with parent semantics. It should provide a real reusable grouping responsibility, not hide a trivial `<div>` merely for abstraction’s sake.

## 4. Complete parent implementation

The section combines the fixed heading, the dynamic child slot, and the explicit wrapper while keeping the outer document structure simple.

```liquid
<section class="editorial-flow">
  <header class="editorial-flow__header">
    {% content_for 'block', type: '_flow-title', id: 'title' %}
  </header>

  {% capture child_content %}
    {% content_for 'blocks' %}
  {% endcapture %}

  {% render 'group',
    content: child_content,
    class: 'editorial-flow__cards'
  %}
</section>
```

The parent’s schema should expose the fixed title declaration and a compatible child contract. It should not read `product`, `collection`, cart, or customer data because the editorial flow’s purpose is generic page composition. If a future parent needs product information, create a product-specific parent contract rather than quietly adding route-sensitive conditions around this generic slot.

## 5. Validate the two ownership models

Test the section in the editor with no cards, one card, and several cards. Reorder cards and confirm both visual and DOM order change without a code edit. Confirm that the title remains in the header despite card changes. Add a second editorial-flow section and check that each card remains selected by the editor as its own instance. Render a card with no JavaScript and verify the content is complete, since this composition needs no client behavior.

Then inspect the source for exactly one static call and exactly one dynamic slot. A second manual loop or a second slot would create duplicate output. Search the wrapper snippet for hidden block or section reads; it should expose only its explicit input API. These tests distinguish a composition that merely renders from one that remains understandable after merchants exercise the flexibility the schema promises.

## Validation matrix

| Test | Expected result |
| --- | --- |
| Fixed title | Renders once in the header and cannot be moved by card reordering. |
| Dynamic cards | Render once in current Shopify JSON/editor order. |
| Wrapper | Receives captured content and class, with no child lookup. |
| Editor identity | Each card root carries `block.shopify_attributes`. |
| Empty state | Parent and wrapper retain intentional valid structure. |
| Repeated parent | Instances remain independent and order-safe. |

## Checklist

- [x] A singular static-block call owns the invariant heading position.
- [x] One dynamic slot delegates configured child rendering and order to Shopify.
- [x] Captured output crosses into the wrapper through an explicit snippet API.
- [x] The public card remains editor-selectable and independent of resource context.
- [x] Empty, reordered, and repeated states were reviewed as part of the parent contract.

## 6. Revue de frontière de composition

La solution se vérifie en séparant les responsabilités plutôt qu’en jugeant seulement le HTML final. Le parent doit avoir un appel statique unique pour le titre invariant, un slot dynamique unique pour les cards configurées, et un seul passage explicite vers le wrapper. Le parent ne doit pas parcourir une collection d’enfants après le slot, ni appliquer un ordre CSS susceptible de contredire l’ordre JSON. Le snippet ne doit contenir aucune lecture de `section`, `block`, produit ou configuration Shopify cachée.

Cette séparation permet de faire évoluer les trois éléments indépendamment. Le parent peut modifier sa sémantique de layout. Le wrapper peut améliorer un groupe partagé. Les cards peuvent gagner des réglages compatibles. Le marchand peut modifier l’ordre dynamique. Aucun de ces changements ne doit transformer un titre structurel en contenu réordonnable ou faire du snippet une seconde source de composition.

## 7. Décision d’extension

Si une future demande impose un deuxième titre fixe ou une action structurelle, déclarez et rendez un autre bloc statique à son emplacement nécessaire. Si elle ajoute un nouvel élément éditorial compatible, autorisez-le dans le contrat dynamique afin que JSON conserve l’ordre. Si elle exige un autre modèle de parent, comme des onglets ou une grille produit, créez un parent spécialisé. Ne surchargez pas le flux éditorial générique avec des conditions de route ou des exceptions qui rendraient son API imprévisible.
