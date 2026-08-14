<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 23 — Solution

## The approach

La solution fait de chaque section une petite frontière autonome. Son wrapper stable porte `section.shopify_attributes`; chaque panneau porte `block.shopify_attributes`. Le script ne cherche jamais « la » section dans tout le document. Il reçoit ou découvre une racine précise, monte une seule fois cette racine et conserve une fonction de nettoyage sur l’élément. Les événements d’éditeur deviennent alors une paire opérationnelle : charge = montage ciblé, retrait = nettoyage ciblé.

La sélection est un état de prévisualisation, pas une donnée. Les classes ajoutées par les événements sont supprimées lors de la désélection et ne sont jamais enregistrées. Les blocks n’utilisent pas leur position dans le DOM comme identité : le markup et les attributs d’éditeur portent la relation. Le réordonnancement n’a donc pas besoin de réécrire l’état; le DOM réordonné reste rendu par la même logique d’instance.

La note de collection est un réglage de texte riche prévu pour recevoir une source dynamique dans le contexte de collection. Le Liquid le traite comme éventuellement vide et fournit un fallback éditorial local. Le preset crée un panneau initial pour une installation neuve; il ne tente pas de modifier une configuration persistante de marchand.

> [VERIFY] Confirmez pour votre thème et votre version Shopify le payload de tous les événements utilisés, la portée de `event.target`, les types de réglages qui offrent une source dynamique, et le rendu Liquid d’un metafield riche. L’exemple démontre l’architecture; ne supposez pas qu’un détail de contrat non vérifié est universel.

## Walkthrough

### 1. Une identité pour chaque unité éditable

La section garde une racine même si le contenu lié est absent. Cette racine est l’unité que l’éditeur peut monter et cibler. Le wrapper de block est tout aussi important : il permet de sélectionner le panneau réellement configuré, sans ajouter l’attribut à un parent qui représenterait plusieurs blocks. Le markup reste sémantique, avec des articles regroupés dans une zone de panneaux.

### 2. Un ordre qui appartient à l’éditeur

La boucle Liquid rend les blocks dans l’ordre configuré. Le JavaScript ne lit ni n’écrit d’index de panneau. Ainsi, l’ajout, la suppression et le glisser-déposer restent des décisions de composition. Le CSS peut répondre à une sélection par classe, mais ne devient pas une autre source d’ordre.

### 3. Montage, retrait et sélection ciblés

`mountCollectionNotes` est idempotente : un marqueur empêche le double montage. Elle attache son écouteur au wrapper, non au document. La fonction de cleanup retire cet écouteur et les classes éphémères. Les événements de l’éditeur trouvent la racine à partir de l’instance concernée, puis appellent la même API de montage ou nettoyage. `section:select` et `section:deselect` signalent la section; `block:select` et `block:deselect` ciblent le panneau émis par l’événement.

### 4. Résilience après remplacement et réordonnancement

Lorsqu’un réglage provoque un nouveau markup, la charge de la nouvelle instance construit une nouvelle fermeture et de nouveaux écouteurs seulement pour cette racine. Le retrait libère l’ancienne instance. Lors d’un réordonnancement, aucune référence à un ordinal n’est nécessaire; le script peut supprimer ses classes de prévisualisation de la section touchée et laisser la composition décidée par le marchand visible telle quelle.

### 5. Source dynamique et fallback

Le réglage `collection_note` est local à la présentation de cette section, mais il peut être connecté à une donnée structurée compatible de la collection. Cela donne au marchand un choix : fournir un texte éditorial local ou relier une note gérée avec la ressource. Le fallback `section.settings.fallback_note` existe pour l’absence de source, pas pour écraser une source ni pour prétendre que toute collection contient une donnée.

### 6. Première installation

Le preset installe un panneau et ses defaults rendent la fonction intelligible. La section peut donc être ajoutée à un template sans catalogue complet. Une installation existante garde ses réglages parce que la solution ne touche pas `settings_data.json`, ne renomme pas d’ID et ne réinitialise rien au runtime.

### 7. Vérification avec plusieurs instances

Ajoutez deux sections. Modifiez l’une, sélectionnez leurs blocks alternativement, réordonnez-les puis retirez-en une. Vérifiez que les classes de prévisualisation restent locales, que la section restante réagit encore à son propre clic, et qu’aucun retrait ne laisse de gestionnaire sur `window` ou sur le document. Répétez le test avec une source dynamique vide et une source liée avant de considérer l’intégration terminée.

## Full code

### `sections/collection-notes.liquid`

```liquid
{{ 'collection-notes.css' | asset_url | stylesheet_tag }}
<script src="{{ 'collection-notes.js' | asset_url }}" defer></script>

{% assign collection_note = section.settings.collection_note | default: section.settings.fallback_note %}
<section class="collection-notes" {{ section.shopify_attributes }}>
  <div class="collection-notes__inner page-width">
    <header class="collection-notes__header">
      <p class="collection-notes__eyebrow">{{ section.settings.eyebrow | escape }}</p>
      <h2 class="collection-notes__title">{{ section.settings.heading | escape }}</h2>
      {% if collection_note != blank %}<div class="collection-notes__note rte">{{ collection_note }}</div>{% endif %}
    </header>
    <div class="collection-notes__panels">
      {% for block in section.blocks %}
        <article class="collection-notes__panel" {{ block.shopify_attributes }}>
          <h3>{{ block.settings.heading | escape }}</h3>
          {% if block.settings.body != blank %}<div class="rte">{{ block.settings.body }}</div>{% endif %}
        </article>
      {% endfor %}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Collection notes",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Collection notes" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Details worth keeping" },
    { "type": "richtext", "id": "collection_note", "label": "Collection note" },
    { "type": "richtext", "id": "fallback_note", "label": "Fallback note", "default": "<p>Connect this section to collection context when it is ready.</p>" }
  ],
  "blocks": [
    { "type": "note", "name": "Note", "settings": [
      { "type": "text", "id": "heading", "label": "Heading", "default": "Made with intention" },
      { "type": "richtext", "id": "body", "label": "Body", "default": "<p>Add collection context here.</p>" }
    ] }
  ],
  "presets": [{ "name": "Collection notes", "blocks": [{ "type": "note" }] }]
}
{% endschema %}
```

### `assets/collection-notes.js`

```js
const rootSelector = '.collection-notes';

function mountCollectionNotes(root) {
  if (!root || root.dataset.collectionNotesMounted === 'true') return;
  root.dataset.collectionNotesMounted = 'true';

  const onClick = (event) => {
    const panel = event.target.closest('.collection-notes__panel');
    if (!panel || !root.contains(panel)) return;
    panel.classList.toggle('collection-notes__panel--expanded');
  };

  root.addEventListener('click', onClick);
  root.collectionNotesCleanup = () => {
    root.removeEventListener('click', onClick);
    root.classList.remove('collection-notes--editor-selected');
    root.querySelectorAll('.collection-notes__panel--editor-selected').forEach((panel) => panel.classList.remove('collection-notes__panel--editor-selected'));
    delete root.collectionNotesCleanup;
    delete root.dataset.collectionNotesMounted;
  };
}

function rootFor(event) { return event.target?.matches?.(rootSelector) ? event.target : event.target?.querySelector?.(rootSelector); }
function initialMount() { document.querySelectorAll(rootSelector).forEach(mountCollectionNotes); }

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialMount, { once: true });
else initialMount();

document.addEventListener('shopify:section:load', (event) => mountCollectionNotes(rootFor(event)));
document.addEventListener('shopify:section:unload', (event) => rootFor(event)?.collectionNotesCleanup?.());
document.addEventListener('shopify:section:select', (event) => rootFor(event)?.classList.add('collection-notes--editor-selected'));
document.addEventListener('shopify:section:deselect', (event) => rootFor(event)?.classList.remove('collection-notes--editor-selected'));
document.addEventListener('shopify:section:reorder', (event) => rootFor(event)?.classList.remove('collection-notes--editor-selected'));
document.addEventListener('shopify:block:select', (event) => event.target?.classList?.add('collection-notes__panel--editor-selected'));
document.addEventListener('shopify:block:deselect', (event) => event.target?.classList?.remove('collection-notes__panel--editor-selected'));
```

### `assets/collection-notes.css`

```css
.collection-notes { padding-block: 3rem; }
.collection-notes__inner { display: grid; gap: 1.5rem; }
.collection-notes__panels { display: grid; gap: 1rem; }
.collection-notes__panel { border: 1px solid currentColor; padding: 1rem; }
.collection-notes__panel h3, .collection-notes__panel p { margin-block: 0; }
.collection-notes__panel h3 { margin-bottom: 0.5rem; }
.collection-notes--editor-selected { outline: 3px solid Highlight; outline-offset: 0.35rem; }
.collection-notes__panel--editor-selected { background: color-mix(in srgb, currentColor 10%, transparent); }
.collection-notes__panel--expanded { border-width: 2px; }
```

The complete three files are mirrored under `solution/` for a meaningful comparison with the starter.

## What people get wrong here

- They put `block.shopify_attributes` on the section or on a shared panels wrapper. The editor can no longer target one configured panel accurately.
- They attach global document listeners on every `section:load` and never remove them. Repeated editor operations then multiply one interaction into many.
- They use an `nth-child` selector or JavaScript index to identify a block. Reordering makes the code refer to the wrong merchant-owned item.
- They treat a dynamic source as guaranteed text. A source can be unconnected, unavailable in the context, or typed differently from the intended output, so the render path needs a compatible setting and fallback.

## Stretch: direction only

Treat auto-scroll as an editor-only enhancement attached to the selected block event. It needs feature detection for scroll behavior, a containment check that the block belongs to the current section, and cleanup that prevents a delayed callback from scrolling a section that has already unloaded. Do not save its position or selection; the editor, not the storefront, owns that transient state.

### Test de destruction observable

Pour vérifier réellement le nettoyage, ouvrez les outils du navigateur pendant les opérations d’éditeur et posez un compteur ou un point d’arrêt dans le gestionnaire local. Chargez, modifiez puis retirez plusieurs fois la même section. Un clic sur une instance nouvellement créée ne doit provoquer qu’un seul changement de classe. Cette vérification est plus révélatrice qu’un simple rendu correct : elle expose les références qui restent attachées au document et les comportements qui semblent fonctionner jusqu’à la troisième modification de marchand.
