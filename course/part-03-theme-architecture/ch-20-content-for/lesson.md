<!-- STATUS: final -->
---
id: ch-20
title: "`content_for`"
part: 3
---

# Chapter 20 — `content_for`

`content_for` rend une composition que Shopify possède déjà. Une section ou un theme block l’emploie pour placer ses enfants configurés dans une position sémantique, sans reconstruire leur ordre ni leur identité dans Liquid. Le parent définit le conteneur, les contraintes et l’interface éditoriale; Shopify rend les enfants choisis par la configuration. Cette séparation est la base d’une composition réellement maintenable.

## 20.1 `{% content_for 'blocks' %}` — le slot de rendu des enfants

`{% content_for 'blocks' %}` est un slot de rendu dynamique. Dans un parent qui accepte des children, il rend les blocs enfants configurés à cet endroit précis. Ce n’est ni une variable ni une collection à boucler manuellement. Il préserve le contrat de l’éditeur, l’identité de chaque instance, l’imbrication, et l’ordre de la composition.

```liquid
<section class="editorial-stack" {{ block.shopify_attributes }}>
  {% if block.settings.heading != blank %}
    <h2>{{ block.settings.heading | escape }}</h2>
  {% endif %}
  <div class="editorial-stack__children">
    {% content_for 'blocks' %}
  </div>
</section>
```

Le parent possède le `section`, le titre, le rôle du conteneur et la décision d’état vide. Le slot possède le rendu des enfants acceptés. Un parent d’éditorial vertical peut ainsi accepter des cartes compatibles tout en gardant une structure prévisible. Ne remplacez pas ce slot par une boucle historique sur des blocs : la boucle reconstruit une responsabilité que Shopify gère déjà pour les theme blocks.

Un slot ne rend pas un parent générique par magie. Avant de l’ajouter, définissez le sens de la région enfant : liste, grille, flux, pile d’actions ou zone éditoriale. Les types acceptés doivent respecter ce sens, les données disponibles et les exigences d’accessibilité. Un prix produit ou une barre d’actions compacte n’est pas automatiquement un bon parent ouvert.

> [VERIFY] Vérifiez l’éligibilité et le comportement actuel de `{% content_for 'blocks' %}` pour le modèle section ou theme block concerné.

## 20.2 `{% content_for 'block', type: '...', id: '...' %}` — rendre un bloc statique précis

La forme singulière rend un bloc **statique** déclaré par le parent, en précisant son `type` et son `id`. Elle convient à une sous-région qui doit conserver une place fixe dans la grammaire du composant : titre requis, séparateur interne, ou cluster d’action stable.

```liquid
<header class="product-heading">
  {% content_for 'block', type: '_title', id: 'title' %}
</header>
```

`type` désigne le type de bloc, et `id` désigne cette instance statique dans le contrat du parent. L’appel ne cherche pas un bloc arbitraire dans le thème et ne constitue pas une requête de données. Il rend le composant dont le parent assume explicitement la position.

Un bloc statique peut avoir des réglages et être masquable selon son schéma, mais il ne devient pas une zone dynamique réordonnable. Cette limite est utile : le titre d’une carte doit rester avant son contenu même si les détails éditoriaux peuvent être réorganisés. Si un marchand doit ajouter, supprimer ou déplacer plusieurs éléments, utilisez plutôt un slot dynamique et un contrat enfant approprié.

> [VERIFY] Vérifiez la syntaxe de déclaration des blocs statiques et les règles exactes de correspondance `type`/`id` avant un usage en production.

## 20.3 Sémantique d’ordre et JSON comme source de vérité

L’ordre des enfants dynamiques ne vient ni de l’ordre des fichiers Liquid, ni de l’ordre alphabétique, ni de l’ordre des types dans le schéma. Il vient de la composition JSON administrée par Shopify et l’éditeur. Le parent définit les types possibles; la configuration enregistre les instances et leur ordre; `content_for` rend ce résultat autoritatif.

Cela impose une règle de conception : le balisage du parent doit rester correct après une réorganisation par le marchand. Une pile éditoriale peut rendre ses cards dans l’ordre choisi. Une liste doit garantir que les enfants se comportent comme des éléments de liste. Une zone dont l’ordre visuel et sémantique est invariant ne doit pas accepter un ensemble dynamique sans contrainte.

| Décision | Propriétaire |
| --- | --- |
| Types enfants autorisés | Schéma du parent |
| Instances et ordre actuels | JSON / éditeur Shopify |
| Sortie au slot parent | `{% content_for 'blocks' %}` |
| Région structurelle fixe | Parent + appel singulier |
| Sémantique et wrapper | Balisage parent |

Ne combinez pas un slot dynamique et une seconde boucle destinée à forcer un enfant à une position. Vous créez alors deux sources d’ordre et risquez le doublon. Si une région est obligatoire, déclarez-la statique et rendez-la explicitement. Pour diagnostiquer un ordre inattendu, inspectez d’abord la configuration dans l’éditeur, puis l’acceptation du parent, puis les wrappers Liquid.

## 20.4 Envelopper les enfants : le pattern `capture` + `render 'group'`

Un parent doit parfois confier l’enveloppe des enfants à un snippet réutilisable. Capturez d’abord le slot, puis passez la sortie capturée à un snippet via une API explicite. Le slot conserve ainsi l’ordre et l’identité Shopify; le snippet possède uniquement la présentation ou la sémantique d’enveloppe.

```liquid
{% capture child_content %}
  {% content_for 'blocks' %}
{% endcapture %}

{% render 'group',
  content: child_content,
  class: 'editorial-stack__children'
%}
```

L’ordre est important. `content_for` rend la composition. `capture` conserve le HTML résultant. `render` appelle un snippet avec des paramètres explicites. Le snippet ne doit pas chercher lui-même les enfants, déduire le parent, ou inventer une nouvelle règle d’ordre. Son contrat doit préciser ce qu’est `content`, comment sont traités les contenus vides, et quels attributs de groupe il peut recevoir.

N’abstraitez pas une simple `div` sans responsabilité réutilisable. `capture` et `render` ajoutent une frontière à tester : espaces, contenu vide, validité HTML, et traitement du contenu déjà rendu. Employez ce pattern si le snippet fournit réellement une structure de groupe, un landmark, une liste, ou un système d’espacement partagé par des parents compatibles.

## 20.5 Construire une section réellement composable depuis zéro

Commencez par une tâche marchande bornée. Une section « flux éditorial » peut proposer un titre optionnel et une séquence de contenus compatibles. Son schéma précise le titre et les enfants admis. Son markup fournit un seul conteneur sémantique. Son slot rend les enfants configurés. Elle ne suppose pas `product`, n’impose pas une carte précise, et ne cache pas un routeur de page dans une série de conditions.

Une section composable possède cinq couches. Premièrement, un **but borné** : ce qu’elle organise et où elle appartient. Deuxièmement, un **contrat enfant** : types explicites ou wildcard justifié par une mise en page, des données et un fallback compatibles. Troisièmement, un **contrat d’ordre** : JSON pour le dynamique, statique pour l’invariant. Quatrièmement, une **frontière de rendu** : slot dans un markup valide, avec capture/render seulement si le snippet a une API claire. Cinquièmement, un **cycle éditorial** : états vide, configuré, réordonné, parent répété et placement incompatible.

```liquid
<section class="feature-flow" {{ section.shopify_attributes }}>
  {% if section.settings.heading != blank %}
    <h2>{{ section.settings.heading | escape }}</h2>
  {% endif %}
  {% content_for 'blocks' %}
</section>
```

Le code est court parce que le schéma et la configuration portent la composition. Une longue chaîne de conditions indique souvent que le parent accepte des enfants sans modèle cohérent ou tente de servir plusieurs architectures de page contradictoires. Simplifiez le contrat avant d’ajouter plus de flexibilité.

Évaluez la composition depuis l’éditeur. Le marchand comprend-il ce qui va dans le parent ? Peut-il prévoir l’effet d’une réorganisation ? Un app block admis conserve-t-il les mêmes sémantiques ? L’état vide reste-t-il acceptable ? Un autre développeur voit-il pourquoi une région est statique ? Les réponses doivent être visibles dans le schéma et le markup, pas seulement dans l’intention du premier auteur.

## Gotchas

- **Boucler manuellement les theme-block children.** Le slot conserve le contrat de composition Shopify.
- **Prendre l’ordre Liquid pour l’ordre éditorial.** JSON est la source de vérité dynamique.
- **Utiliser un slot dynamique pour un titre invariant.** Rendez le bloc statique à son emplacement sémantique.
- **Laisser un snippet retrouver ses propres enfants.** Capturez la sortie et passez-la explicitement.
- **Ouvrir un parent sans modèle de données ou de layout.** Un wildcard a besoin de limites.
- **Abstraire sans responsabilité.** Capture/render est un choix de frontière, pas un rituel.

## Checklist

- [ ] La région dynamique utilise `{% content_for 'blocks' %}` dans un markup parent valide.
- [ ] Les enfants fixes utilisent la forme singulière déclarée du bloc statique.
- [ ] JSON/éditeur possède l’ordre dynamique sans boucle concurrente.
- [ ] Un snippet wrapper éventuel reçoit du contenu rendu par une API explicite.
- [ ] But, enfants, état vide, ordre et workflow éditeur forment un seul contrat.

## Related

- `ch-17-sections` — schémas et contrat éditeur.
- `ch-19-theme-blocks-in-depth` — fichiers de blocs et contrats parent/enfant.
- `ch-21-snippets-as-apis` — frontières d’API explicites pour snippets.

[1]: ../docs/DEPRECATIONS.md

## Le slot est une frontière de responsabilité

La valeur principale de `content_for` est de supprimer une décision qui ne devrait pas appartenir au parent. Un parent n’a pas besoin de connaître le nombre d’enfants, leurs IDs configurés, ni leur ordre actuel. Il déclare une région et délègue le rendu de la composition à Shopify. Cette délégation permet au thème de supporter les modifications opérées dans l’éditeur sans transformer chaque déplacement de bloc en changement Liquid.

Le parent garde toutefois des responsabilités importantes. Il choisit le bon élément HTML autour du slot. Il décide si les enfants forment une liste, une grille ou un flux. Il fournit les titres, landmarks et attributs accessibles nécessaires. Il limite les types enfants via son schéma. Il doit aussi décider ce qui se passe quand aucun enfant n’est configuré. Un slot vide peut être correct pour une zone optionnelle; il ne l’est pas nécessairement pour une région essentielle de la page.

Cette répartition évite les bugs de contexte. Un enfant app block ou theme block est rendu selon son propre contrat. Le parent ne doit pas l’envelopper dans une logique de produit supposée disponible parce que le parent est parfois placé sur une page produit. Si un parent exige des données spécifiques, cette exigence doit être explicite dans son rôle et son placement, plutôt qu’être cachée dans une condition autour du slot.

## Ordre visuel, ordre DOM et ordre marchand

La configuration JSON fixe l’ordre des enfants dynamiques; le parent doit traduire cet ordre dans un DOM cohérent. Dans une pile verticale, ordre JSON, ordre DOM et ordre visuel devraient normalement coïncider. Réordonner visuellement avec CSS tout en laissant le DOM dans un autre ordre peut produire une expérience confuse pour les lecteurs d’écran, le clavier et l’éditeur. Définissez le parent afin que le contrôle marchand préserve le sens du contenu.

Une grille illustre la même règle. Le parent peut définir les colonnes, les espacements et les breakpoints, mais il ne doit pas réordonner arbitrairement les enfants configurés pour obtenir un effet décoratif. Si le design exige une carte principale fixe suivie d’éléments réordonnables, rendez la carte principale statique, puis utilisez le slot pour le reste. Cela rend visible le fait qu’il existe deux modèles d’ordre différents.

Avant de rendre un enfant spécifique, demandez si son emplacement est une invariant de la sémantique du composant. Un titre interne, une image obligatoire ou un séparateur fixe peut être statique. Une série de témoignages, de cartes ou de colonnes éditoriales est généralement dynamique. Cette distinction améliore à la fois la compréhension du marchand et la robustesse du code.

## Encapsulation et snippets sans contexte caché

Le pattern `capture` + `render` est utile parce qu’il transforme la sortie de composition en une valeur passée explicitement à un snippet. Le snippet reçoit `content`, éventuellement une classe, un rôle ou un label. Il ne reçoit pas implicitement l’autorité de parcourir les enfants ou de connaître le parent. Cette API limite les dépendances : un autre parent peut utiliser le même wrapper s’il peut fournir le même contenu et les mêmes options.

Testez toujours le wrapper avec contenu vide, un enfant et plusieurs enfants. Vérifiez que le snippet ne double pas le rôle ou le titre fourni par le parent. Vérifiez aussi l’espacement produit par `capture`, surtout si le contenu est placé dans des éléments dont le whitespace a un impact. Le wrapper doit améliorer le regroupement, pas masquer une structure de parent ambiguë.

## Procédure de revue d’une section composable

Testez six états avant de déclarer une section composable terminée. Premièrement, l’état vide : le parent reste-t-il valide? Deuxièmement, un enfant : la sémantique du wrapper reste-t-elle utile? Troisièmement, plusieurs enfants : ordre et spacing restent-ils cohérents? Quatrièmement, réorganisation : l’ordre JSON est-il rendu sans code concurrent? Cinquièmement, parent répété : les IDs et le comportement restent-ils isolés? Sixièmement, enfant inattendu permis par wildcard : respecte-t-il toujours le contrat de layout et de données?

Cette procédure replace l’éditeur au centre du test. La composition réussie n’est pas seulement celle qui affiche la démo initiale; elle tolère les changements permis par le schéma tout en refusant clairement les changements qui sortiraient du rôle du parent.
