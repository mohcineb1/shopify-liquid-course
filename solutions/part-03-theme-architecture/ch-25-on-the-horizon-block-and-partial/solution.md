<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 25 — Solution

## The approach

Cette réponse est un prototype de developer preview, pas un pattern stable à recopier dans un thème client. Le template de collection porte clairement son statut, compose un frame via `{% block %}` et encadre uniquement la grille dans une région `{% partial %}`. Le template contrôle la structure de la page et les classes de layout; le block encapsule son markup et rend le body fourni par le template. Aucune donnée de marchand n’est migrée et aucune page JSON existante n’est modifiée.

Le script utilise le package de préversion pour demander une grille fraîche après changement de tri. Il construit l’URL depuis l’URL actuelle, garde les paramètres de locale et de marché, annule une requête précédente et marque la région comme occupée. Après application, le HTML serveur est de nouveau la source de vérité. La page n’essaie pas de reconstruire le résultat sur le client.

> [VERIFY] Vérifiez que la boutique de développement a la feature preview **Liquid July ’26 changes**, que `@shopify/partial-rendering` est disponible dans votre pipeline, et que les signatures de `partials.fetch` et `partials.apply` correspondent à la preview active. N’expédiez pas ces tags dans un thème stable.

## Walkthrough

### 1. Isoler la préversion

Le fichier porte un commentaire de preview, une classe de laboratoire et une note d’évaluation. Le retrait est simple : supprimer cette route de test et ses fichiers; les templates JSON, sections et groupes existants n’ont jamais été modifiés. Cette isolation est plus importante que la démonstration technique elle-même.

### 2. Rendre le frame depuis le template

Le template appelle `preview-frame` avec une balise et une classe contrôlées par le template. Le contenu entre les tags est rendu par `{{ block.content }}` dans le block. Les valeurs de structure — `main`, classes de page, heading de collection — appartiennent au template. Le block n’ajoute aucun réglage marchand parce que son travail est seulement d’encapsuler du contenu de page.

### 3. Délimiter le partial utile

La grille de produits est la région qui varie avec le tri. Le sélecteur et le titre restent hors du partial : ils ne doivent pas être remplacés au moindre changement. Le conteneur porte `aria-busy`, et une région de statut annonce le début ou l’échec de la mise à jour. Cette frontière rend le refresh petit, lisible et testable.

### 4. Demander puis appliquer le rendu serveur

Le script conserve un `AbortController`. Une nouvelle sélection annule la demande en cours, puis construit une URL à partir de `window.location`. Il met à jour l’historique, demande le partial nommé, puis applique la réponse. L’état `aria-busy` est toujours retiré. Le gestionnaire de `popstate` relit l’URL et rafraîchit la même région, afin que retour et avance du navigateur restent cohérents avec le serveur.

### 5. Tester les comportements de preview

Exécutez deux tris, déclenchez plusieurs changements rapides, utilisez retour/avance, réduisez la largeur et désactivez temporairement le réseau. Observez la région et le statut. Si la preview ne peut pas être activée ou si l’intégration ne garde pas la cohérence d’URL, arrêtez le prototype et documentez la raison plutôt que de remplacer son mécanisme par une API stable différente.

### 6. Consigner la décision

La note ne conclut pas que le modèle doit remplacer JSON. Elle recueille les preuves : lisibilité locale de la page, frontière de refresh, focus, statut, erreurs, compatibilité navigateur et coût d’entretien. La décision peut être de continuer le test ou de retirer les fichiers. Dans les deux cas, l’architecture stable reste indépendante.

## Full code

### `templates/collection.preview.liquid`

```liquid
<!-- Liquid July ’26 developer preview only. Do not ship to a stable theme. -->
{% block 'preview-frame', tag: 'main', class: 'collection-preview page-width' %}
  <header class="collection-preview__header">
    <h1>{{ collection.title | escape }}</h1>
    <label for="collection-preview-sort">Sort</label>
    <select id="collection-preview-sort" data-collection-preview-sort>
      <option value="">Featured</option>
      <option value="price-ascending">Price, low to high</option>
      <option value="price-descending">Price, high to low</option>
    </select>
  </header>

  <p data-collection-preview-status aria-live="polite"></p>
  {% partial 'product-grid' %}
    <div class="collection-preview__results" data-collection-preview-results aria-busy="false">
      {% for product in collection.products %}
        <article><h2>{{ product.title | escape }}</h2></article>
      {% endfor %}
    </div>
  {% endpartial %}
{% endblock %}
<script type="module" src="{{ 'collection-preview.js' | asset_url }}"></script>
```

### `blocks/preview-frame.liquid`

```liquid
{% doc %}
  @param {string} [tag] - HTML element selected by the preview template.
  @param {string} [class] - Class names selected by the preview template.
{% enddoc %}

{% assign tag = tag | default: 'div' %}
<{{ tag }} class="{{ class }}">
  {{ block.content }}
</{{ tag }}>

{% schema %}
{ "name": "Preview frame", "settings": [] }
{% endschema %}
```

### `assets/collection-preview.js`

```js
import {partials} from '@shopify/partial-rendering';

const control = document.querySelector('[data-collection-preview-sort]');
const results = document.querySelector('[data-collection-preview-results]');
const status = document.querySelector('[data-collection-preview-status]');
let activeRequest;

async function refreshGrid({push = false} = {}) {
  if (!control || !results) return;
  activeRequest?.abort();
  activeRequest = new AbortController();

  const url = new URL(window.location.href);
  if (control.value) url.searchParams.set('sort_by', control.value);
  else url.searchParams.delete('sort_by');
  if (push) window.history.pushState({}, '', url);

  results.setAttribute('aria-busy', 'true');
  status.textContent = 'Updating products…';
  try {
    const update = await partials.fetch('product-grid', {
      url: url.toString(),
      signal: activeRequest.signal,
    });
    partials.apply(update);
    status.textContent = 'Products updated.';
  } catch (error) {
    if (error.name !== 'AbortError') status.textContent = 'Products could not be updated. Try again.';
  } finally {
    results.setAttribute('aria-busy', 'false');
  }
}

control?.addEventListener('change', () => refreshGrid({push: true}));
window.addEventListener('popstate', () => {
  const url = new URL(window.location.href);
  control.value = url.searchParams.get('sort_by') || '';
  refreshGrid();
});
```

### `preview-evaluation.md`

```markdown
# Liquid July ’26 preview evaluation

## Environment

| Check | Evidence |
| --- | --- |
| Development store | Record store URL or identifier. |
| Feature preview | `Liquid July ’26 changes` selected. |
| Prototype route | `collection.preview` only. |
| Stable theme touched | No. |

## Evidence

- [ ] The template exposes page structure and block ownership clearly.
- [ ] Only `product-grid` refreshes after two different sort choices.
- [ ] Rapid changes cancel or prevent stale results from winning.
- [ ] Loading, error, focus and live-status behavior were observed.
- [ ] Back and forward return the region to the URL-owned state.

## Withdrawal decision

- Continue experiment / remove prototype:
- Reason and owner:
- No migration promise made to JSON templates or section groups:
```

All four files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They enable the tags in a stable theme without the feature preview. The syntax belongs to an unstable platform track.
- They wrap the entire page in a partial. A small sort change then replaces unrelated controls and makes focus/state management harder.
- They hardcode a storefront URL or discard existing query parameters. The request stops respecting markets, locales or shareable state.
- They issue concurrent fetches without cancellation. A slow first response can overwrite the latest merchant choice.

## Stretch: direction only

Add a `product-count` named partial and fetch it with `product-grid` in one request so both server-owned values update together. Put `partials.apply(update)` inside a View Transition only after detecting support; otherwise call it directly. Evaluate whether an animated swap changes focus, announcement timing or perceived loading, and retain the direct update as the baseline fallback.

### Observations de sécurité du refresh

Pendant le test, vérifiez le cas où la requête est interrompue après avoir posé `aria-busy`. Le chemin `finally` doit toujours rétablir une région disponible, tandis que le statut ne doit pas annoncer un échec pour une demande volontairement annulée. Vérifiez aussi la réponse serveur : après `apply`, toute valeur contrôlée par le serveur doit provenir du markup retourné et non d’un cache de quantité, de titre ou de tri construit avant la requête. Cette règle évite de maintenir deux états contradictoires lorsque les données de collection, les marchés ou les paramètres URL changent.

Si le prototype utilise des contrôles additionnels, définissez lesquels font partie de la même transaction. Un changement de tri qui affecte grille, compteur et filtres actifs doit demander ces régions ensemble, ou ne pas prétendre que la page est synchronisée. À l’inverse, n’élargissez pas la frontière par confort : chaque région remplacée demande une stratégie de focus, de chargement et d’état transitoire. Cette mesure précise de frontière est justement ce que la préversion doit permettre à l’équipe d’évaluer.

### Critères de sortie du prototype

Retirez l’expérience si l’activation de preview n’est pas fiable pour l’environnement de développement, si le package change son contrat sans chemin de mise à jour clair, si les tests de navigation et de lecteur d’écran échouent, ou si la structure Liquid-first ne produit pas un gain de lisibilité démontrable. Un retrait propre est un résultat valable : il confirme que l’équipe a appris sans transformer une hypothèse de plateforme en dette de production.
