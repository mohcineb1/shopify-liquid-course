<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 22 — Solution

## The approach

La bonne réponse ne transforme pas le thème en éditeur CSS. Elle crée une petite API marchande globale dont les groupes suivent l’ordre de décision : identité, surface promotionnelle, puis contenu de campagne. La section est un consommateur : elle ne redéclare ni le message ni les couleurs et ne choisit pas elle-même ce qui est global. Cette séparation évite que deux promotions situées sur des templates différents dérivent sans raison.

Le contrat dispose de valeurs par défaut capables de rendre une promotion utile dès l’installation. Il rend une destination pertinente seulement quand l’appel à l’action est activé, mais le Liquid garde malgré tout la sortie : l’état persistant peut contenir une ancienne URL lorsque le contrôle est masqué. La CSS reçoit un nom de scheme comme intention, et non une série de variables que le marchand devrait réconcilier à la main.

> [VERIFY] Avant de copier cette configuration, vérifiez dans la documentation Shopify de la version ciblée la syntaxe active de `color_scheme`, le nom des classes de schemes de votre thème, les opérateurs permis dans `visible_if` et les attributs acceptés par chaque type. Ces détails évoluent avec les contrats de thème; ne les déduisez pas d’un exemple.

## Walkthrough

### 1. Groupes, ordre et explication de l’ownership

Le premier groupe pose le nom de marque. Le second sélectionne la surface du système; il ne présente pas deux entrées de couleur isolées. Le troisième décrit une campagne globale. Les `header` et `paragraph` donnent une hiérarchie lisible et la description rappelle que ces valeurs affectent toutes les instances de promotion. Les IDs sont stables, explicitement préfixés, et leurs defaults évitent l’état vide.

### 2. Contenu, choix nommés et valeurs sûres

Le titre court, le message riche et le libellé de lien répondent à des formes de contenu distinctes. Le mode visuel reste une liste de variantes éditoriales nommées. Cette solution ne prétend pas enseigner tous les réglages possibles : ce serait un inventaire, non une réponse au problème. Le principe est de choisir le type qui décrit la décision du marchand et de laisser les sélections de ressources ou les réglages de données structurées au besoin qui les justifie.

### 3. Intention de surface plutôt que micro-réglages

`promotion_color_scheme` fait choisir une surface de design existante. La section dérive une classe de ce choix; la feuille de style ne fabrique pas de valeurs hexadécimales à partir d’un champ marchand. Dans un thème réel, les schemes doivent être définis et testés comme un système de tokens cohérent, notamment pour le texte, les liens et les états interactifs.

### 4. Condition et garde de rendu

L’URL est une décision secondaire. `visible_if` évite qu’elle encombre l’éditeur lorsque l’appel à l’action est désactivé. Le rendu exige à la fois le booléen et une URL non vide. Cette double condition est volontaire : masquer un contrôle ne vide pas nécessairement l’état déjà enregistré dans `settings_data.json`.

### 5. Section consommatrice et état absent

La section lit l’état global, attribue un fallback de texte pour que la structure reste compréhensible, et rend un lien uniquement si son contrat est satisfait. Sa schema locale ne comporte pas de doublon de campagne. Dans une boutique réelle, placez la section là où le parcours marchand le justifie; son existence ne rend pas automatiquement toutes les promotions globales.

### 6. CSS, tokens et test marchand

La CSS ne décide pas du scheme; elle fournit une structure, une densité et une présentation accessibles. Le thème doit posséder les classes de scheme auxquelles elle se rattache. Testez la nouvelle configuration avec l’état neuf, avec un message long, avec chaque mode, avec l’appel à l’action activé sans destination, et après avoir désactivé un appel à l’action précédemment renseigné.

### 7. État marchand et entretien

Ne modifiez jamais arbitrairement un ID une fois qu’une boutique l’utilise. `settings_data.json` contient des décisions de marchand; les presets et defaults du schéma ne constituent pas une permission de les réinitialiser. Quand une évolution s’impose, conservez l’ID compatible ou préparez et testez une migration explicite sur une copie de configuration représentative.

## Full code

### `config/settings_schema.json`

```json
[
  {
    "name": "Atelier North — Brand",
    "settings": [
      {
        "type": "header",
        "content": "Brand identity"
      },
      {
        "type": "text",
        "id": "brand_name",
        "label": "Brand name",
        "default": "Atelier North"
      },
      {
        "type": "paragraph",
        "content": "These settings are shared by every brand promotion in the theme."
      }
    ]
  },
  {
    "name": "Atelier North — Promotion surface",
    "settings": [
      {
        "type": "header",
        "content": "Choose a governed surface"
      },
      {
        "type": "color_scheme",
        "id": "promotion_color_scheme",
        "label": "Promotion colour scheme",
        "default": "scheme-1"
      },
      {
        "type": "radio",
        "id": "promotion_layout",
        "label": "Promotion emphasis",
        "default": "quiet",
        "options": [
          { "value": "quiet", "label": "Quiet" },
          { "value": "prominent", "label": "Prominent" }
        ]
      }
    ]
  },
  {
    "name": "Atelier North — Promotion content",
    "settings": [
      {
        "type": "text",
        "id": "promotion_title",
        "label": "Campaign title",
        "default": "New season, considered essentials"
      },
      {
        "type": "richtext",
        "id": "promotion_message",
        "label": "Campaign message",
        "default": "<p>Meet the pieces designed for the next chapter of your wardrobe.</p>"
      },
      {
        "type": "checkbox",
        "id": "promotion_show_cta",
        "label": "Show a call to action",
        "default": true
      },
      {
        "type": "text",
        "id": "promotion_cta_label",
        "label": "Call-to-action label",
        "default": "Shop the collection",
        "visible_if": "{{ settings.promotion_show_cta }}"
      },
      {
        "type": "url",
        "id": "promotion_cta_url",
        "label": "Call-to-action destination",
        "visible_if": "{{ settings.promotion_show_cta }}"
      }
    ]
  }
]
```

### `sections/brand-promotion.liquid`

```liquid
{{ 'brand-promotion.css' | asset_url | stylesheet_tag }}

{% assign promotion_title = settings.promotion_title | default: 'New season, considered essentials' %}
{% assign promotion_brand = settings.brand_name | default: shop.name %}

<aside class="brand-promotion color-{{ settings.promotion_color_scheme }} brand-promotion--{{ settings.promotion_layout }}" aria-label="{{ promotion_brand | escape }} promotion">
  <div class="brand-promotion__inner page-width">
    <p class="brand-promotion__eyebrow">{{ promotion_brand | escape }}</p>
    <h2 class="brand-promotion__title">{{ promotion_title | escape }}</h2>
    {% if settings.promotion_message != blank %}
      <div class="brand-promotion__message rte">{{ settings.promotion_message }}</div>
    {% endif %}
    {% if settings.promotion_show_cta and settings.promotion_cta_url != blank %}
      <a class="brand-promotion__link" href="{{ settings.promotion_cta_url }}">
        {{ settings.promotion_cta_label | default: 'Explore' | escape }}
      </a>
    {% endif %}
  </div>
</aside>

{% schema %}
{
  "name": "Brand promotion",
  "settings": [],
  "presets": [{ "name": "Brand promotion" }]
}
{% endschema %}
```

### `assets/brand-promotion.css`

```css
.brand-promotion {
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
}

.brand-promotion--prominent {
  border-block: 1px solid rgb(var(--color-foreground) / 0.18);
}

.brand-promotion__inner {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  padding-block: clamp(2rem, 5vw, 4rem);
}

.brand-promotion__eyebrow,
.brand-promotion__title,
.brand-promotion__message {
  margin: 0;
}

.brand-promotion__eyebrow { font: inherit; letter-spacing: 0.08em; text-transform: uppercase; }
.brand-promotion__link { color: inherit; font-weight: 700; text-underline-offset: 0.2em; }
```

The three rendered files above are also supplied under `solution/` as a direct mirror of the starter paths.

## What people get wrong here

- They make the section own the campaign fields. That creates several conflicting campaigns and defeats the stated global ownership.
- They use `visible_if` as the only guard. A hidden URL can remain stored, so a Liquid condition must still prevent a stale link from rendering.
- They expose background, foreground, hover and border colors as four unrelated controls. The merchant receives more work while the design system loses contrast guarantees.
- They rename an existing setting ID because the label changed. Labels are copy; IDs are persisted configuration contracts and must be handled as such.

## Stretch: direction only

Inventory the old IDs and the values they can hold before proposing any replacement. Define which legacy values map safely to a new intent, which need a conservative fallback, and which require a merchant decision. Test the transition against copied `settings_data.json` states rather than assuming a preset can repair an existing storefront. Keep the migration plan separate from this component implementation so that an uncertain conversion cannot silently rewrite merchant-owned choices.

### Validation opérationnelle avant livraison

Lancez d’abord la configuration avec les defaults et confirmez que le groupe de campagne donne un résultat éditorialement acceptable sans intervention. Ensuite, choisissez chaque surface proposée et observez le texte, les liens et les bordures; une couleur de fond acceptable ne garantit pas à elle seule une combinaison lisible. Activez l’appel à l’action sans fournir de destination : le contrôle doit rester intelligible dans l’éditeur, tandis que le storefront ne doit pas créer de lien vide. Renseignez une URL, confirmez le rendu, puis désactivez l’appel à l’action sans supprimer l’URL. L’absence finale du lien prouve que le garde Liquid, et pas uniquement la visibilité de l’interface, porte le contrat.

Enfin, testez une copie de configuration qui contient déjà des valeurs. Les valeurs nouvellement ajoutées doivent avoir un fallback sûr; les IDs existants ne doivent ni changer de sens ni disparaître. Cette vérification est la différence entre un schéma qui fonctionne pour une démo neuve et une évolution qui respecte réellement les décisions déjà possédées par un marchand.
