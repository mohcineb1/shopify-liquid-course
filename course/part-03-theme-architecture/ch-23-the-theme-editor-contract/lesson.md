<!-- STATUS: final -->
---
id: ch-23
title: "The Theme Editor Contract"
part: 3
---

# Chapter 23 — The Theme Editor Contract

Le thème n’est pas seulement rendu à la demande d’un navigateur. Dans l’éditeur, Shopify monte, remplace, sélectionne et réordonne des portions de markup pendant qu’un marchand travaille. Une section qui paraît correcte après un chargement de page peut donc échouer dès que l’éditeur la déplace ou la recharge. Le contrat de l’éditeur impose une discipline claire : markup identifiable, comportement JavaScript réinitialisable, ownership explicite des instances, et données éditables qui ne sont pas confondues avec une implémentation locale.

## What you’ll be able to do

- Concevoir une section qui garde son comportement lorsqu’elle est sélectionnée, déplacée ou rechargée dans l’éditeur.
- Attacher correctement l’identité d’éditeur aux wrappers de sections et de blocks.
- Traiter les événements de cycle de vie comme des frontières d’initialisation et de nettoyage, pas comme un simple signal de débogage.
- Décider quand une valeur de section peut être reliée à une source dynamique plutôt que dupliquée à la main.
- Préparer une première installation utile sans dépendre de contenu marchand déjà présent.

## 23.1 How the editor mounts, targets, and reorders your markup

Dans un storefront normal, le navigateur charge le document, les scripts s’initialisent, puis l’utilisateur interagit. Dans l’éditeur, une modification de section peut remplacer seulement une instance de markup. Une sélection peut donner un focus éditorial à cette instance. Un glisser-déposer peut changer son ordre tout en laissant le reste de la page vivant. Votre code ne peut donc pas supposer que `DOMContentLoaded` est l’unique début de vie d’un composant.

Traitez une section comme une instance ayant une identité, un wrapper racine et un cycle de vie. Le wrapper est la frontière de la section : il contient le DOM que son comportement doit interroger et il fournit le point que l’éditeur doit pouvoir cibler. Un script qui fait une recherche globale, réattache ses écouteurs à chaque événement et conserve des références à des nœuds supprimés finit par produire des interactions doublées ou un état visuel erroné.

C’est là que beaucoup de développeurs venant de React se font piéger. Le thème n’offre pas automatiquement votre cycle de montage de composant ni la garantie qu’un module sera détruit avant chaque remplacement. Vous devez rendre l’initialisation idempotente et le nettoyage explicite. Une section qui possède un carrousel, un dialogue ou une observation de taille doit savoir réinitialiser uniquement sa propre instance, pas toute la page.

Le réordonnancement révèle les dépendances cachées. Ne sélectionnez pas une section par sa position dans le document, par un ID HTML constant ou par le premier élément correspondant à une classe. L’ordre appartient à la composition JSON et à l’éditeur; le code doit partir de l’élément de l’instance concernée. La rubrique précédente a établi que l’ordre des blocs dynamiques est une source de vérité de configuration, pas une convention CSS.

> [VERIFY] Vérifiez la stratégie de montage et de remplacement utilisée par la version actuelle de l’éditeur ainsi que le payload exact de ses événements avant d’attacher une intégration de production.

## 23.2 `shopify_attributes` on sections and blocks — non-negotiable

L’éditeur doit pouvoir relier une décision d’interface à l’instance Liquid qui l’a produite. `section.shopify_attributes` et `block.shopify_attributes` portent cette identité vers le markup. Placez-les sur l’élément qui représente réellement l’unité configurable : le wrapper racine de la section pour une section, le wrapper de chaque block pour un block. Ce n’est pas une décoration facultative ni un détail réservé à l’accessibilité.

```liquid
<!-- sections/editor-aware-promo.liquid -->
<section class="editor-aware-promo" {{ section.shopify_attributes }}>
  <div class="editor-aware-promo__inner">
    {% for block in section.blocks %}
      <article class="editor-aware-promo__item" {{ block.shopify_attributes }}>
        <h2>{{ block.settings.heading | escape }}</h2>
      </article>
    {% endfor %}
  </div>
</section>
```

Ne placez pas un attribut de block sur une balise qui enveloppe tous les blocks. L’éditeur perdrait la correspondance un-à-un entre l’item choisi et le markup qu’il doit viser. Ne le dupliquez pas non plus sur plusieurs descendants pour tenter d’obtenir plus de comportement : l’identité devient ambiguë, et les styles de sélection ou outils d’édition peuvent cibler un résultat inattendu.

Pour les sections, demandez-vous quel nœud doit rester valide lorsqu’un réglage vide retire une partie du contenu. Si votre wrapper est conditionnel, l’éditeur peut perdre sa cible dans précisément l’état que le marchand est en train de corriger. Gardez une racine stable et mettez les conditions à l’intérieur. Cette décision simplifie également les sélecteurs JavaScript limités à l’instance.

> [VERIFY] Confirmez les emplacements autorisés et les attentes actuelles de `shopify_attributes` pour les sections, blocks de section et theme blocks dans la documentation Shopify applicable.

## 23.3 Theme editor JavaScript events: `shopify:section:load|unload|select|deselect|reorder`, `shopify:block:select|deselect`

Les événements `shopify:section:load` et `shopify:section:unload` forment la paire essentielle. À la charge, initialisez la seule section concernée. Au retrait, détruisez tout comportement qui survit au DOM : timers, observers, écouteurs attachés à `window`, instances de librairie et état de module. Les événements de sélection et désélection ajoutent une intention éditoriale : un composant peut exposer un état de prévisualisation, mettre en pause une animation ou révéler le block ciblé, sans modifier l’expérience client par défaut.

`shopify:section:reorder` est un signal que l’ordre a changé. Il n’autorise pas à réécrire les données de composition; il vous demande de rendre votre comportement tolérant au nouvel ordre. `shopify:block:select` et `shopify:block:deselect` concernent l’item choisi au sein d’une section. Servez-vous-en pour une interface dont l’état sélectionné est local, réversible et sans effet persistant. Une sélection d’éditeur n’est pas une préférence client et ne doit pas écrire dans le stockage du navigateur ou déclencher une analyse commerciale.

```js
// assets/editor-aware-promo.js
function mountPromotion(root) {
  if (!root || root.dataset.promotionMounted === 'true') return;
  root.dataset.promotionMounted = 'true';

  const onResize = () => root.classList.toggle('editor-aware-promo--compact', root.clientWidth < 480);
  window.addEventListener('resize', onResize);
  onResize();

  root.promotionCleanup = () => {
    window.removeEventListener('resize', onResize);
    delete root.promotionCleanup;
    delete root.dataset.promotionMounted;
  };
}

document.addEventListener('shopify:section:load', (event) => {
  mountPromotion(event.target.querySelector('.editor-aware-promo'));
});

document.addEventListener('shopify:section:unload', (event) => {
  const root = event.target.querySelector('.editor-aware-promo');
  root?.promotionCleanup?.();
});
```

L’exemple limite volontairement le travail à l’instance issue de l’événement. Dans un thème qui charge ce script hors éditeur, vous pouvez aussi monter les racines présentes au chargement initial; la fonction doit alors être sûre si l’éditeur appelle ensuite une charge pour une nouvelle instance.

> [VERIFY] Vérifiez le support actuel, le bouillonnement, `event.target`, `detail.sectionId` et les champs de block de ces événements. Ne codez pas contre un payload retenu de mémoire.

## 23.4 Writing sections that survive live reordering

Une section résiliente sépare les données persistantes, le DOM rendu et l’état éphémère de comportement. Les réglages restent la source de vérité. Le markup peut être remplacé. L’état JavaScript se reconstruit à partir de la nouvelle racine. Cette règle exclut les index globaux, les IDs dupliqués et les cache de nœuds conservés à travers un `unload`.

Construisez une racine stable, une initialisation bornée et un nettoyage symétrique. Attachez les écouteurs de clic à la racine plutôt qu’à chaque enfant quand la délégation est appropriée. Utilisez des classes ou attributs de données propres à l’instance. Si une section contrôle un média, son `select` peut suspendre une transition ou afficher le panneau actuel; son `deselect` doit annuler seulement ce changement transitoire. Ne faites jamais dépendre le fonctionnement client d’un événement qui existe uniquement dans l’éditeur.

Les blocks demandent la même discipline mais à une granularité différente. Le block sélectionné peut disparaître, changer de position ou être remplacé. Le parent doit donc pouvoir retrouver le block par une identité de markup, sans présumer que le troisième enfant est encore le troisième block. La composition est d’abord une donnée marchand; le code l’accompagne sans tenter de la posséder.

## 23.5 Dynamic sources: connecting settings to metafields

Une source dynamique relie un réglage compatible à une donnée structurée du contexte courant, par exemple un metafield de produit ou de collection. Elle ne rend pas un réglage universellement intelligent : la source disponible dépend du template, de la ressource et du type attendu. Choisissez un réglage dont le type exprime réellement la forme de donnée à afficher, puis prévoyez le cas où aucune connexion n’est établie ou où la valeur est vide.

La séparation est importante. Une valeur saisie dans la section est une décision de présentation locale. Un metafield est généralement une donnée gérée dans l’administration, réutilisable et attachée à une ressource. Dupliquer une spécification produit dans chaque section crée des divergences; forcer une phrase promotionnelle globale dans un metafield crée aussi un mauvais propriétaire. Demandez toujours : qui maintient cette valeur, sur quelle ressource, et sur combien de surfaces doit-elle apparaître ?

La valeur dynamique doit être rendue selon son type. Une référence de produit, un texte riche et une liste ne possèdent pas le même contrat Liquid ni le même état vide. Les chapitres sur les objets et les metafields approfondiront l’accès et le rendu de types structurés; ici, retenez que l’éditeur crée une relation entre une entrée compatible et une source disponible, pas une autorisation de traiter toutes les valeurs comme des chaînes.

> [VERIFY] Vérifiez les types de réglages pouvant accepter des sources dynamiques, les contextes de ressources éligibles et la manière dont les valeurs typées sont exposées dans Liquid avant de concevoir une interface de production.

## 23.6 Onboarding defaults and the first-install experience

Une boutique nouvelle est un cas de production, pas une absence de test. Un thème doit présenter une première expérience utilisable avant que le marchand n’ait relié des sources, importé un catalogue ou configuré chaque section. Les presets créent une composition initiale; les defaults de réglages donnent des décisions réversibles; les états vides expliquent l’absence de données sans transformer la vitrine en maquette factice.

N’utilisez pas un défaut pour prendre possession d’une configuration déjà modifiée. Le schema propose des valeurs initiales, alors que `settings_data.json` représente l’état marchand conservé. Ajouter un default peut aider une nouvelle installation; changer ou supprimer un ID peut détériorer une boutique existante. Testez donc au minimum une copie vierge, une section déjà configurée et une ressource sans la donnée dynamique attendue.

Un bon onboarding n’est pas un grand écran d’instructions destiné aux clients. Dans l’éditeur, des labels précis, des descriptions modestes et une composition initiale parlante aident le marchand. Sur le storefront, les fallbacks doivent préserver structure, accessibilité et hiérarchie, sans inventer de promesse commerciale. Lorsque des données indispensables manquent, rendez un état vide sobre ou masquez le sous-composant non pertinent selon le contrat de la section.

## Gotchas

- Vous initialisez seulement à `DOMContentLoaded`; une section remplacée dans l’éditeur n’a alors plus de comportement.
- Vous attachez les mêmes écouteurs à chaque `section:load` sans nettoyage; les interactions s’exécutent plusieurs fois.
- Vous déposez `shopify_attributes` sur un descendant instable ou mutualisez l’attribut d’un block sur tout le parent.
- Vous confondez une sélection d’éditeur temporaire avec un changement à persister pour un client.
- Vous reliez une source dynamique sans garde de type ni état vide, puis supposez qu’un metafield existe sur toutes les ressources.
- Vous « corrigez » une première installation en écrasant l’état déjà détenu par le marchand.

## Checklist

- [ ] Chaque section et block éditable possède une racine stable et correctement identifiable.
- [ ] Le JavaScript monte, nettoie et remonte une seule instance sans écouteurs doublés.
- [ ] Les comportements de sélection et réordonnancement sont transitoires et bornés à l’éditeur.
- [ ] Les valeurs de source dynamique correspondent à un type, un contexte et un fallback connus.
- [ ] Une installation vierge, une configuration existante et un état de données absent restent tous cohérents.

## Related

- `ch-17-sections` — schéma, instances et ressources de section.
- `ch-19-theme-blocks-in-depth` — identité, sélection et contrats de blocks.
- `ch-22-settings-architecture` — ownership, état marchand et valeurs par défaut.
- `ch-35-metaobjects` — données structurées et références de contenu.

## A practical editor-resilience test

Testez le contrat comme une suite de transitions, pas comme une capture d’écran. Ajoutez deux instances de la section, sélectionnez chacune à son tour, modifiez un réglage qui force son remplacement, changez leur ordre, puis supprimez l’une d’elles. Après chaque étape, inspectez le comportement de l’instance restante. Un contrôle ne doit pas perdre son état par erreur, un écouteur ne doit pas être dupliqué, et aucune référence JavaScript ne doit continuer à manipuler une racine retirée.

Faites aussi varier le contenu. Un titre vide, une source dynamique non reliée, un block manquant et une ressource sans metafield constituent des états normaux lors de l’onboarding. Le wrapper de section reste identifiable, l’éditeur conserve une cible, et le storefront évite à la fois une erreur technique et une promesse fictive. Cette approche paraît plus stricte qu’un test d’interaction isolé, mais elle révèle précisément les bugs qui n’apparaissent que lorsque le marchand compose réellement son thème.

La limite importante est d’architecturer la section pour le client avant tout. Les événements d’éditeur améliorent la prévisualisation et la sélection; ils ne doivent pas devenir le seul chemin qui initialise une fonctionnalité commerciale. Une expérience qui fonctionne uniquement avec l’éditeur ouvert est un comportement incomplet, pas une intégration réussie.
