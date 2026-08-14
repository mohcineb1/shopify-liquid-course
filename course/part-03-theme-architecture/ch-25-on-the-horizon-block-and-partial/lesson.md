<!-- STATUS: final -->
---
id: ch-25
title: "On the Horizon: `{% block %}` and `{% partial %}`"
part: 3
---

# Chapter 25 — On the Horizon: `{% block %}` and `{% partial %}`

Shopify’s Liquid July ’26 developer preview proposes un modèle de composition Liquid-first : un template peut désormais nommer et rendre directement des theme blocks, puis marquer des régions HTML que le serveur peut rafraîchir sans rechargement complet. Cela ne remplace pas aujourd’hui les sections, les groupes de sections ou les templates JSON d’un thème stable. C’est une piste d’architecture qui doit être étudiée comme telle : utile pour comprendre une direction de plateforme, dangereuse si elle est vendue comme un contrat de production universel.

> **Statut de plateforme.** `{% block %}` et `{% partial %}` sont disponibles uniquement avec la feature preview **Liquid July ’26 changes**, introduite le 21 juillet 2026. Les thèmes existants continuent de fonctionner avec sections, settings et JSON templates. [1] [2] [3]

## What you’ll be able to do

- Lire le modèle Liquid-first sans le confondre avec l’architecture stable actuelle.
- Distinguer un appel direct de block, une zone marchande `content_for` et un snippet `render`.
- Délimiter une région partielle qui mérite un rafraîchissement serveur ciblé.
- Évaluer les conséquences de ce modèle pour JSON, groupes de sections et ownership marchand.
- Organiser une expérimentation isolée, réversible et observable.

## 25.1 The July '26 developer preview and what it changes

La préversion ajoute deux tags à Liquid. `{% block %}` compose une page avec un theme block nommé directement dans un template. `{% partial %}` définit une région de HTML rendu serveur que du JavaScript peut demander et appliquer sans recharger la page entière. Ensemble, ils rendent la structure de page visible dans un fichier Liquid et permettent des interactions dynamiques sans déplacer le rendu principal dans un framework client. [1]

Le changement est donc d’abord une question d’ownership. Dans un template JSON, la composition est largement stockée comme données : sections, ordre et settings sont gérés par le marchand dans l’éditeur. Avec un appel `{% block %}` dans un template Liquid, le développeur nomme le block et passe les valeurs; le template contrôle explicitement la structure de page. Aucun modèle n’est intrinsèquement supérieur. Ils servent des responsabilités différentes : composition éditoriale et réordonnable d’un côté, composition déclarée et lisible dans le code de l’autre.

Une developer preview n’est pas une promesse de stabilité. La syntaxe, les règles de validation, l’intégration des outils et les conventions peuvent évoluer. Shopify signale d’ailleurs de nouvelles règles Theme Check pour les thèmes Liquid-first, concernant la syntaxe, la complexité, la taille de fichier, les schemas et la correspondance entre arguments de block, schemas et `{% doc %}`. Gardez la préversion dans une boutique de développement et un chemin de code explicitement expérimental. [1]

Ne migrez pas une architecture stable parce qu’un exemple semble plus court. Déterminez d’abord si la page requiert réellement que le code possède sa structure, si les marchands perdraient une capacité de composition, et si l’équipe peut supporter une feature preview. Une ligne de Liquid en moins ne compense pas une régression d’édition ou une dépendance non stabilisée.

## 25.2 `{% block %}` — rendering a theme block directly from a template

Le tag `{% block %}` nomme un fichier du dossier `blocks/`. `{% block 'container' %}` rend `blocks/container.liquid`. L’appel peut recevoir des paramètres nommés et du contenu entre le tag ouvrant et `{% endblock %}`. Dans le fichier de block, `{{ block.content }}` rend ce body content. Le template devient donc un arbre de composition lisible de haut en bas. [2]

```liquid
<!-- templates/index.liquid — developer preview only -->
{% block 'container', tag: 'main', class: 'page-shell' %}
  <h1>{{ page_title | default: shop.name | escape }}</h1>
  {% block 'button', type: 'button', class: 'button button--primary' %}
    Explore the collection
  {% endblock %}
{% endblock %}
```

```liquid
<!-- blocks/container.liquid — developer preview only -->
{% assign tag = tag | default: 'div' %}
<{{ tag }} class="{{ class }}">
  {{ block.content }}
</{{ tag }}>

{% schema %}
{ "name": "Container", "settings": [] }
{% endschema %}
```

Les paramètres appartiennent au template : ce sont des entrées que la composition connaît et contrôle. Les réglages de schema appartiennent au marchand. Shopify documente qu’un appel peut aussi fixer directement une valeur `block.settings.<id>` lorsque le template connaît cette valeur; ce pouvoir doit rester exceptionnel, car il change l’ownership attendu d’un réglage d’éditeur. Le block devrait rester petit et focalisé; la documentation de préversion suggère d’en viser six settings ou moins et de scinder une abstraction trop chargée. [2]

Voici le mauvais réflexe : utiliser `{% block %}` comme simple synonyme de snippet, sans se demander si le code a besoin d’un schema ou d’une identité de theme block.

```liquid
<!-- templates/index.liquid — inappropriate preview use -->
{% block 'format-price', amount: product.price %}{% endblock %}
```

Un formatage interne sans settings d’éditeur appartient encore à un snippet rendu avec `{% render %}`. Le bon choix dépend du contrôleur de composition : `{% block %}` quand le template compose une page avec un thème block, `{% content_for %}` quand le marchand ajoute et ordonne des blocks en JSON, `{% render %}` pour une primitive interne sans réglage d’éditeur. [2]

> [VERIFY] Vérifiez la syntaxe de paramètres, les restrictions de nesting, la disponibilité des arrays littéraux et les règles Theme Check de la version de preview installée. Ces détails ne doivent pas être extrapolés vers Liquid stable.

## 25.3 `{% partial %}` — named server-rendered regions refreshed without a full reload

`{% partial %}` encadre une région nommée de markup Liquid rendu serveur. Au chargement initial, son contenu est rendu normalement. Ensuite, du JavaScript peut demander la région fraîche et appliquer la réponse à l’endroit correspondant, sans rechargement complet. La région doit être assez petite pour que le changement soit ciblé, mais assez complète pour rester cohérente avec les données serveur qu’elle représente. [3]

```liquid
<!-- templates/collection.liquid — developer preview only -->
{% partial 'product-grid' %}
  <div class="collection-grid" data-product-list>
    {% for product in collection.products %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
{% endpartial %}
```

Le client relie le nom de région à la réponse. Le package `@shopify/partial-rendering` documente `partials.fetch()` pour demander du HTML frais, `partials.apply()` pour remplacer les régions correspondantes, et `partials.refresh()` pour combiner les deux lorsque l’URL courante suffit. Construisez l’URL à partir de l’URL courante ou des routes, pas d’un chemin de storefront codé en dur, afin de préserver locales, marchés et paramètres existants. [3]

```js
// assets/collection-preview.js — developer preview only
import {partials} from '@shopify/partial-rendering';

const url = new URL(window.location.href);
url.searchParams.set('sort_by', 'price-ascending');
const update = await partials.fetch('product-grid', {url: url.toString()});
partials.apply(update);
```

Un refresh partiel n’efface pas vos responsabilités d’interface. Une réponse lente antérieure peut remplacer une réponse récente : utilisez un `AbortSignal` si le dernier geste doit gagner. Le swap ne fournit pas de feedback de chargement : exposez `aria-busy` si cela est utile. Les changements pertinents doivent être annoncés; l’état DOM transitoire peut devoir être restauré. Le serveur reste la source de vérité des valeurs qu’il possède, par exemple un total panier ou le résultat d’un filtre. [3]

Ne marquez pas la page entière comme partial par habitude. Un filtre qui affecte grille, compteur et filtres actifs peut demander plusieurs régions ensemble; une navigation de page ou un changement qui reconstruit tout le layout ne gagne pas forcément en fiabilité avec un swap partiel. Délimitez le plus petit ensemble cohérent de données et de markup.

## 25.4 Composing whole pages in Liquid: fewer files, one readable source

Un template Liquid-first peut présenter sa hiérarchie de page en un endroit : un container, une zone principale, un appel de card, un bouton, puis les contenus imbriqués. Pour une équipe qui maintient des pages fortement codées, cette lisibilité réduit le saut entre template JSON, section, schema et block. Le template montre directement ce qu’il compose; les blocks gardent leurs markup, comportement, accessibilité et réglages ensemble. [1] [2]

Mais « moins de fichiers » n’est pas une exigence de qualité. Une page énorme qui encode toutes les branches, tous les variants et toute la logique de contenu devient illisible même si elle est dans un seul fichier. Le bon découpage reste fondé sur la responsabilité : le template décrit l’assemblage, le block encapsule une pièce éditable, le snippet isole un rendu interne. Les docs de préversion mentionnent précisément des contrôles de complexité et de taille; ils sont un signal qu’un arbre Liquid-first nécessite la même discipline qu’une architecture multi-fichiers. [1]

Le body content est particulièrement utile pour garder l’intention de page près de l’appel. Passez un body lorsque le block doit envelopper du markup; passez un paramètre lorsqu’il doit modifier un comportement ou une forme de rendu. Sinon, vous recréez une API de settings pour des contenus que le template possède déjà, ce qui masque l’ownership au lieu de le clarifier.

## 25.5 What this means for the future of section groups and JSON templates

La préversion ajoute un modèle, elle n’annonce pas la disparition de JSON templates ou des groupes de sections. Les thèmes existants continuent de les utiliser; les sections et leurs données d’éditeur restent essentielles lorsque le marchand doit composer, réordonner et configurer une page. Les appels directs de blocks sont plutôt adaptés à une structure que le template doit contrôler et rendre visible dans le code. [1] [2]

Les groupes de sections restent une réponse aux surfaces persistantes comme header et footer, tandis que JSON reste la source de composition marchand pour de nombreuses pages. N’interprétez pas un futur possible comme une migration imposée. Une équipe peut expérimenter une page Liquid-first isolée, comparer sa lisibilité et ses besoins d’édition, puis garder son architecture stable principale intacte.

La question pratique est : qui doit pouvoir changer l’arbre ? Si la réponse est « un développeur dans le template », la préversion peut être un terrain d’étude. Si la réponse est « un marchand qui ajoute et réordonne des composants », `content_for` et JSON conservent leur raison d’être. Le design de systèmes consiste à préserver cette distinction, pas à choisir une technologie unique pour tout le thème.

## 25.6 Preview-track discipline: how to experiment without shipping instability

Isolez l’expérimentation dans une boutique de développement avec la preview sélectionnée. Gardez une liste de fichiers, de pages et de comportements qui en dépendent. Écrivez des tests manuels pour le chargement normal, les erreurs de partial, les tailles étroites, le clavier et les données absentes. Activez les règles Theme Check pertinentes et notez les hypothèses qui proviennent de la documentation de preview.

Établissez une sortie réversible. Une page de test doit pouvoir revenir à une template et des sections stables sans migration silencieuse des données d’un marchand. Évitez de fonder une exigence commerciale, un calendrier de livraison ou une migration de thème sur une capacité qui peut changer. Lorsque vous découvrez une limite, utilisez le canal de feedback de la preview plutôt que de fabriquer un contournement qui enferme le thème dans un contrat non documenté.

La discipline est aussi communicationnelle. Marquez le code, les tickets et les démonstrations comme preview. Expliquez ce qui est mesuré — lisibilité du template, coût d’un partial, ergonomie de maintenance — et ce qui n’est pas promis. Cette clarté protège les marchands et permet à l’équipe de retirer l’expérience si la plateforme évolue dans une direction incompatible.

## Gotchas

- Vous déployez `{% block %}` ou `{% partial %}` sans que la feature preview soit sélectionnée.
- Vous confondez paramètre de template et réglage marchand, puis masquez l’ownership des valeurs.
- Vous utilisez un block pour un rendu interne qui appartient à un snippet.
- Vous encadrez toute la page avec un partial et créez un refresh disproportionné ou incohérent.
- Vous ignorez réponses concurrentes, focus, état transitoire et annonces lors d’un swap serveur.
- Vous annoncez la fin de JSON templates ou section groups alors que la préversion ajoute un modèle parallèle.

## Checklist

- [ ] Le code est isolé dans une boutique de développement avec **Liquid July ’26 changes** sélectionnée.
- [ ] Chaque appel de block, zone `content_for` et snippet est choisi selon son contrôleur de composition.
- [ ] Chaque partial représente une région serveur cohérente et son client gère les états de chargement, d’erreur et de concurrence.
- [ ] Les valeurs restent attribuées au bon propriétaire : template, merchant ou serveur.
- [ ] Le test possède une voie de retrait vers l’architecture stable et n’est pas une promesse de production.

## Related

- `ch-20-content-for` — composition dont l’ordre est détenu par JSON et l’éditeur.
- `ch-21-snippets` — rendu interne, API de snippets et isolation de scope.
- `ch-23-the-theme-editor-contract` — comportements d’éditeur à ne pas confondre avec les préversions Liquid-first.
- `ch-37-client-side-javascript` — architecture JavaScript de storefront stable.

## References

[1]: https://shopify.dev/changelog/developer-preview-liquid-block-and-partial-tags "Shopify — Liquid templates can now compose pages with blocks and partials"
[2]: https://shopify.dev/docs/storefronts/themes/getting-started/developer-preview/block "Shopify — Block tag developer preview"
[3]: https://shopify.dev/docs/storefronts/themes/getting-started/developer-preview/partial "Shopify — Partial tag developer preview"
