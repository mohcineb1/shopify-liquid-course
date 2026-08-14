<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 24 — Solution

## The approach

La solution ouvre deux contrats distincts. La bande de campagne est une surface existante qui peut accueillir des enfants inconnus, mais elle reste responsable de son landmark, de sa largeur et de ses espaces. Le wrapper `_blocks.liquid` est la surface spéciale que Shopify emploie lorsqu’un bloc généré est ajouté comme nouvelle section. Il n’est ni un template de page ni une section à rendre manuellement. Son schema doit répondre exactement aux préconditions de la plateforme.

Dans les deux cas, le parent rend un slot de blocks plutôt que de parcourir des settings imaginés. C’est ce qui permet à un block généré de garder sa propre structure. Le système de design intervient au niveau du wrapper : layout, espacement et scheme. La revue est traitée comme une étape de livraison du code, parce qu’un bloc conservé devient un fichier maintenable de `blocks/`, non une configuration passagère.

> [VERIFY] Vérifiez le contrat actuel de `{% content_for 'blocks' %}`, les types `@theme` et `@app`, les règles de `_blocks.liquid` et les conditions de génération pour la boutique ciblée. Cette solution se fonde sur la documentation Shopify consultée pour ce chapitre; les capacités de plateforme doivent être revalidées avant production.

## Walkthrough

### 1. Une surface ouverte mais responsable

La bande devient un parent qui accepte `@theme` et `@app`, puis rend les enfants par le slot géré par Shopify. Sa responsabilité ne disparaît pas : elle garde la section sémantique, le wrapper intérieur et une classe de surface. Elle ne connaît pas le markup, les IDs ni les settings de chaque block; elle ne prétend donc pas afficher `block.settings.heading` pour tous les enfants.

### 2. Pas d’API fictive de block

Le point de départ supposait que chaque block portait un `heading`. Cette hypothèse marche seulement pour un block local très spécifique. Un résultat généré peut contenir une image, un formulaire, une comparaison ou une structure sans titre. `content_for` laisse à chaque child son renderer et à Shopify son contrat de composition. La surface parente reste indépendante de la forme interne de l’enfant.

### 3. Un wrapper spécial réellement valide

Le wrapper accepte à la fois `@theme` et `@app`, comporte un preset et rend le slot. Il ne comporte aucune clé `templates`, y compris en indirect via activation ou désactivation. Shopify peut alors l’utiliser pour envelopper un block de niveau section. Le fichier n’est jamais appelé avec `{% section '_blocks' %}` et n’est pas présenté comme une option que le marchand ajoute directement : la plateforme décide de son utilisation.

### 4. Contrainte visuelle sans micro-contrôles

Le wrapper propose une densité nommée et un color scheme. Ces décisions se comprennent sans connaître CSS et s’appliquent au contexte de la nouvelle section. La feuille de style ne cible pas les descendants internes d’un block généré; elle règle seulement le wrapper, sa largeur et son rythme. Un block peut alors suivre le système sans que le parent le force à adopter un arbre DOM imaginaire.

### 5. Revue avant conservation

Le registre commence par l’identité du fichier et du propriétaire, puis recueille les preuves de qualité. La décision finale est explicite : conserver, corriger, ou supprimer. Le protocole teste données, markup, clavier, mobile, schemes, styles et scripts, avant de faire entrer le fichier dans l’inventaire de la bibliothèque de blocks.

### 6. Test d’intégration

Ajoutez d’abord un block généré dans la bande, puis créez un nouveau block qui doit être enveloppé. Vérifiez les deux surfaces dans plusieurs schemes et sur viewport étroit. Ajoutez aussi un app block quand le contexte le permet. L’objectif n’est pas de prouver que toutes les sorties sont belles, mais que le contrat accepte l’enfant sans que l’enfant échappe aux règles de largeur et d’espacement du thème.

### 7. Garder le rôle spécial du wrapper

Si le wrapper apparaît dans un picker normal ou fonctionne seulement parce qu’il est rendu manuellement, l’implémentation a perdu le contrat de plateforme. Le chemin correct est observable par l’absence d’erreur de code editor lors de la génération et par la présence d’un contexte visuel cohérent lorsque Shopify crée la section enveloppante.

## Full code

### `sections/campaign-content-band.liquid`

```liquid
{{ 'generated-blocks.css' | asset_url | stylesheet_tag }}

<section class="campaign-content-band color-{{ section.settings.color_scheme }}" {{ section.shopify_attributes }}>
  <div class="campaign-content-band__inner page-width">
    {% content_for 'blocks' %}
  </div>
</section>

{% schema %}
{
  "name": "Campaign content band",
  "settings": [
    { "type": "color_scheme", "id": "color_scheme", "label": "Colour scheme", "default": "scheme-1" }
  ],
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [{ "name": "Campaign content band" }]
}
{% endschema %}
```

### `sections/_blocks.liquid`

```liquid
{{ 'generated-blocks.css' | asset_url | stylesheet_tag }}

<section class="generated-blocks color-{{ section.settings.color_scheme }} generated-blocks--{{ section.settings.spacing }}" {{ section.shopify_attributes }}>
  <div class="generated-blocks__inner page-width">
    {% content_for 'blocks' %}
  </div>
</section>

{% schema %}
{
  "name": "Generated blocks",
  "settings": [
    {
      "type": "select",
      "id": "spacing",
      "label": "Section spacing",
      "default": "normal",
      "options": [
        { "value": "compact", "label": "Compact" },
        { "value": "normal", "label": "Normal" },
        { "value": "generous", "label": "Generous" }
      ]
    },
    { "type": "color_scheme", "id": "color_scheme", "label": "Colour scheme", "default": "scheme-1" }
  ],
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [{ "name": "Generated blocks" }]
}
{% endschema %}
```

There is deliberately no `templates`, `enabled_on`, or `disabled_on` key in the wrapper schema.

### `assets/generated-blocks.css`

```css
.campaign-content-band,
.generated-blocks { padding-block: 2rem; }

.generated-blocks--compact { padding-block: 1rem; }
.generated-blocks--generous { padding-block: clamp(3rem, 7vw, 6rem); }

.campaign-content-band__inner,
.generated-blocks__inner {
  max-width: 72rem;
  margin-inline: auto;
}

/* Wrapper-only rules: never style a generated block’s private descendants here. */
.generated-blocks { background: rgb(var(--color-background)); color: rgb(var(--color-foreground)); }
```

### `generated-block-review.md`

```markdown
# Generated block review

## Candidate

| Field | Evidence |
| --- | --- |
| File | `blocks/<file>.liquid` |
| Request summary | Record the merchant intent, not a private prompt transcript. |
| Owner | Named theme maintainer. |
| Accepted surfaces | List compatible sections and wrapper contexts. |
| Decision | Pending / keep / correct / delete. |

## Data and markup

- [ ] Settings describe merchant decisions, have safe defaults, and do not duplicate global ownership.
- [ ] Empty values, long content, and resource absence have been rendered deliberately.
- [ ] Heading hierarchy, landmarks, images, and controls remain semantic without CSS.

## Interaction and responsive evidence

- [ ] Keyboard operation and visible focus were tested where interactive elements exist.
- [ ] Desktop, narrow viewport, and at least two color schemes were reviewed.
- [ ] CSS does not reset global styles or target another block’s private descendants.
- [ ] Scripts are instance-safe, do not inject repeatedly, and introduce no unreviewed external dependency.

## Decision record

- [ ] Keep: ownership and an inventory entry recorded.
- [ ] Correct: issues and a retest owner recorded.
- [ ] Delete: references checked before removal.
```

The four complete files above are mirrored in `solution/` at the same paths as the starter so that the comparison stays meaningful.

## What people get wrong here

- They add `@theme` but retain a loop that assumes every child owns the same settings. The block picker becomes broader while the renderer remains falsely narrow.
- They add a `templates` restriction to `_blocks.liquid` to control placement. This invalidates the special wrapper contract and can block merchant use.
- They add a `limit` to `@app`. Shopify’s generic app block type does not accept that parameter.
- They write wrapper CSS that styles arbitrary descendants like `.generated-blocks h2` or `.generated-blocks button`. A generated block then cannot own its own semantics, spacing, or component styles safely.

## Stretch: direction only

Use a human-maintained inventory first: file path, owner, review date and allowed surfaces are enough to establish governance. Any future automation must search both JSON composition and wrapper-compatible usage before it labels a block inactive, because a file may be added dynamically through valid theme-block contracts. Treat a candidate for deletion as a code change that needs reference checks and storefront regression testing, not as routine configuration cleanup.

La décision de conservation doit rester réversible : un block généré qui échoue à cette revue peut être supprimé après vérification de ses références, sans devenir une exception permanente au système du thème.
