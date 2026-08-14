<!-- STATUS: final -->
---
id: ch-24
title: "AI-Generated Blocks"
part: 3
---

# Chapter 24 — AI-Generated Blocks

Les blocs générés par IA modifient l’extension du thème sans abolir sa responsabilité d’architecture. Un marchand peut décrire un besoin dans l’éditeur, obtenir un nouveau theme block, le conserver et le rendre dans une surface compatible. Le résultat devient alors du code Liquid, HTML, CSS et parfois JavaScript placé dans le dossier `blocks/`. Vous ne contrôlez pas le prompt exact ni toutes les décisions du code produit; vous contrôlez donc ce qui importe le plus : les surfaces qui l’acceptent, le wrapper qui le situe, les tokens qui le contraignent et la revue qui décide s’il est digne de rester.

## What you’ll be able to do

- Distinguer la capacité de générer un block de l’acceptation d’un block dans une section.
- Rendre une section éligible aux theme blocks et aux app blocks sans perdre son contrat de composition.
- Construire un wrapper `_blocks.liquid` valide et comprendre pourquoi il n’est pas une section ordinaire.
- Fournir des contraintes de système visuel qui rendent les sorties générées cohérentes et révisables.
- Évaluer une sortie générée comme du code propriétaire, et non comme une configuration sans risque.

## 24.1 What merchants can now generate in the editor, and the constraints it puts on your schema

Dans l’éditeur de thème, un marchand peut générer un theme block à partir d’une description, le prévisualiser, le conserver ou le supprimer. Lorsqu’il est conservé, Shopify ajoute son fichier Liquid dans `blocks/`; le block rejoint alors la bibliothèque de thème et peut être ajouté dans les sections qui acceptent les theme blocks. Il n’est pas une réponse éphémère d’IA : il devient une dépendance de votre thème, avec une surface de maintenance, de compatibilité et de qualité.

La capacité n’est pas automatique pour toutes les sections. Une section doit déclarer qu’elle accepte les theme blocks. Cette déclaration est une décision de contrat : quelles zones peuvent contenir un composant dont le thème ne connaît pas à l’avance les détails ? Une liste de caractéristiques ou une zone de contenu libre peut être ouverte; une ligne de prix, une action critique ou un flux dont les enfants doivent respecter une structure ARIA stricte doit rester plus borné. Ouvrir une zone n’est pas une preuve que tous les outputs générés seront corrects dans cette zone.

Le schema devient une frontière de design. Il doit exposer assez de surface pour que le marchand compose, sans laisser un block inattendu casser la sémantique, le rythme ou les attentes d’accessibilité. Les conditions acceptées, le conteneur de rendu, les tokens et les règles de largeur définissent cette frontière. Le code généré ne doit pas devenir une exception qui contourne tout ce que le thème a établi dans les chapitres sur sections, blocks et settings.

Shopify prévient explicitement que le code généré peut contenir des erreurs, des résultats imprévus ou des pratiques incomplètes de performance et d’accessibilité. Le marchand et l’équipe de thème restent responsables de la revue et des tests. Vérifiez le rendu desktop et mobile, les réglages produits, l’état vide, le clavier, le contraste, les assets, les répétitions de script et l’impact du block dans toutes les sections où il peut être ajouté.

> [VERIFY] Vérifiez l’éligibilité de la boutique, du plan, de l’architecture de thème et des permissions utilisateur dans l’aide Shopify actuelle avant de présenter la génération comme une capacité disponible pour une boutique précise.

## 24.2 Making a section eligible: `@theme` + `@app`, presets, `content_for 'blocks'`, no `templates` attribute

Pour accepter tous les theme blocks, le schema de la section déclare `@theme` dans `blocks`. Si une section JSON doit aussi accueillir du contenu d’application, déclarez `@app`. Ces types génériques sont des permissions de composition; ils ne remplacent pas les blocks locaux lorsque votre composant a une structure spécialisée. Le parent doit toujours avoir une raison d’exister, une sémantique de conteneur et un état vide défini.

Le rendu correspondant doit utiliser le slot de blocs approprié. Pour les architectures de blocks composables, `{% content_for 'blocks' %}` laisse Shopify rendre les enfants configurés, ce qui inclut les types compatibles selon le contrat du parent. N’écrivez pas une boucle qui prétend connaître la forme de chaque block généré. Le parent fournit la surface; les blocks rendent leur propre contenu.

```liquid
<!-- sections/composable-content-band.liquid — correct -->
<section class="content-band" {{ section.shopify_attributes }}>
  <div class="content-band__inner page-width">
    {% content_for 'blocks' %}
  </div>
</section>

{% schema %}
{
  "name": "Content band",
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [{ "name": "Content band" }]
}
{% endschema %}
```

Ne confondez pas cette capacité avec un simple `for` sur des blocks de section que vous avez définis vous-même. Le code suivant constitue un mauvais contrat lorsqu’il prétend pouvoir rendre des types générés inconnus en accédant à leurs réglages supposés :

```liquid
<!-- sections/composable-content-band.liquid — incorrect -->
{% for block in section.blocks %}
  <div>{{ block.settings.heading }}</div>
{% endfor %}
```

Le mauvais exemple force tous les enfants à ressembler à un block « heading » local; un block généré peut avoir une autre API et une autre structure. Le bon parent conserve une zone de rendu neutre, des classes de layout et des règles de largeur plutôt qu’une dépendance à des settings inventés.

Un preset est nécessaire pour qu’une section proposée comme wrapper soit reconnue dans le contrat Shopify. Un attribut `templates` — directement ou caché à l’intérieur de `enabled_on` ou `disabled_on` — n’est pas permis pour `_blocks.liquid`. Cette interdiction protège le rôle particulier de wrapper, qui doit pouvoir être appliqué par la plateforme plutôt que choisi comme une section habituelle à un endroit arbitraire.

Pour `@app`, ne déclarez pas `limit`: Shopify indique que les app blocks n’acceptent pas ce paramètre. Les app blocks ne sont pas pris en charge dans les sections rendues statiquement. Ces distinctions relèvent du contrat de composition, non d’un détail décoratif de schema.

> [VERIFY] Vérifiez la syntaxe et les contraintes actuelles de `@theme`, `@app`, `content_for 'blocks'`, les contextes de section et les règles de schema avant de modifier un thème de production.

## 24.3 The `_blocks.liquid` wrapper section and overriding it

Un block généré n’est pas une section. Lorsqu’un marchand veut l’utiliser comme nouvelle section, Shopify l’enveloppe dans une section générée par plateforme nommée `_blocks.liquid`. Un thème peut fournir son propre `sections/_blocks.liquid` pour prendre possession de cette enveloppe visuelle. C’est le point où vous imposez la largeur, les marges, les surfaces, la grille et les limites responsables du thème.

Le wrapper n’est pas une section standard. Vous ne pouvez pas le rendre manuellement avec `{% section '_blocks' %}`, et il n’apparaît pas dans la liste de sections que le marchand peut ajouter. Essayer de le traiter comme une section normale contourne le flux de la plateforme et crée une fausse surface de support.

Un wrapper valide doit satisfaire quatre conditions. Son schema accepte `@theme` et `@app`; il définit des presets; son Liquid contient `{% content_for 'blocks' %}`; et il ne déclare pas l’attribut `templates`, y compris dans `enabled_on` et `disabled_on`. Si l’une manque, Shopify retourne une erreur dans l’éditeur de code et les marchands ne peuvent pas utiliser la section. Ce sont des préconditions, non des recommandations de style.

```liquid
<!-- sections/_blocks.liquid -->
<section class="generated-blocks" {{ section.shopify_attributes }}>
  <div class="generated-blocks__inner page-width">
    {% content_for 'blocks' %}
  </div>
</section>

{% schema %}
{
  "name": "Generated blocks",
  "settings": [
    { "type": "select", "id": "spacing", "label": "Section spacing", "default": "normal", "options": [
      { "value": "compact", "label": "Compact" },
      { "value": "normal", "label": "Normal" },
      { "value": "generous", "label": "Generous" }
    ] }
  ],
  "blocks": [{ "type": "@theme" }, { "type": "@app" }],
  "presets": [{ "name": "Generated blocks" }]
}
{% endschema %}
```

Le réglage de wrapper doit porter une décision de système, comme une variante d’espacement, pas donner carte blanche à chaque valeur CSS. Cette couche améliore le résultat d’un block généré sans imposer de code interne au block ni reconfigurer son contenu.

## 24.4 Keeping generated output visually consistent with your design system

La cohérence ne consiste pas à espérer que le prompt nomme votre police. Elle consiste à offrir un contexte que tout block peut habiter : une largeur de lecture, des espaces de section, des color schemes, des tokens de texte et surfaces, des primitives de boutons et des règles de responsive déjà cohérentes. Le wrapper est le premier niveau de cette intégration; les patterns de CSS documentés et les règles de revue sont le second.

Ne laissez pas une sortie générée introduire un système parallèle de variables, de reset CSS global, de scripts non modulaires ou de noms de classes qui entrent en collision. Inspectez les styles pour les sélecteurs trop larges, les valeurs fixes qui cassent les schemes, les images sans alternative, les interactivités sans clavier et les scripts attachés globalement. Un block autonome ne signifie pas qu’il peut ignorer les limites de performance du document partagé.

Le meilleur prompt marchand décrit une intention de contenu et de layout, mais il ne remplace pas une revue. Demander « image, titre, texte et appel à l’action, empilés sur mobile » donne une direction plus testable qu’une demande vague. Ensuite, comparez le résultat à votre langage de design : hiérarchie typographique, densité, largeur, focus, contraste et traduction. Acceptez, corrigez ou supprimez le fichier généré comme n’importe quel changement de thème.

La gouvernance est également nécessaire. Inventoriez les blocks générés, notez leur surface d’usage, attribuez un propriétaire et recherchez leurs références avant suppression. Un fichier ajouté dans `blocks/` compte dans les limites de bibliothèque du thème; `docs/DEPRECATIONS.md` indique que chaque fichier `.liquid` de ce dossier compte, qu’il soit référencé ou non. Un prototype oublié peut ainsi devenir dette de maintenance et consommation de capacité.

## Gotchas

- Vous ajoutez `@theme` à une section dont le conteneur impose une structure enfant incompatible; le block apparaît mais le rendu ou la sémantique se dégrade.
- Vous bouclez sur des settings supposés au lieu de donner le slot `{% content_for 'blocks' %}` à Shopify.
- Vous traitez `_blocks.liquid` comme une section manuelle et tentez de l’inclure avec le tag `section`.
- Vous ajoutez un attribut `templates`, directement ou indirectement, au wrapper spécial et empêchez son utilisation.
- Vous conservez un code généré sans test de mobile, de clavier, de schemes, de réglages ni nettoyage des scripts.
- Vous laissez des blocks expérimentaux s’accumuler sans inventaire, ownership ni suppression contrôlée.

## Checklist

- [ ] Les sections ouvertes acceptent intentionnellement `@theme` et, lorsque le contrat le justifie, `@app`.
- [ ] Le parent rend les enfants au moyen du slot compatible et n’impose pas une API de settings fictive aux blocks générés.
- [ ] `_blocks.liquid` respecte toutes les préconditions de wrapper et n’est jamais rendu manuellement.
- [ ] Le wrapper fournit des contraintes de largeur, d’espacement et de scheme cohérentes avec le thème.
- [ ] Chaque block généré est revu, testé, inventorié et traitable comme code maintenu.

## Related

- `ch-19-theme-blocks-in-depth` — blocks publics, privés et contrats d’acceptation.
- `ch-20-content-for` — slots d’enfants et ownership de composition.
- `ch-22-settings-architecture` — décisions marchandes, schemes et ownership d’état.
- `ch-23-the-theme-editor-contract` — identités et comportements d’éditeur.
- `ch-56-app-extensions` — mécanique approfondie des extensions d’application.

## References

[1]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/ai-generated-theme-blocks "Shopify — AI generated theme blocks"
[2]: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/shopify-magic/generate-blocks "Shopify Help Center — Automatically generating theme blocks"
[3]: https://shopify.dev/docs/storefronts/themes/architecture/blocks/app-blocks "Shopify — App blocks for themes"

## Review protocol for generated blocks

Avant de conserver un bloc, relisez-le comme une contribution externe. Commencez par son contrat de données : les réglages correspondent-ils à des décisions marchandes observables, possèdent-ils des defaults sûrs et évitent-ils les doublons de réglages déjà globaux ? Ensuite, inspectez le markup sans styles. Une hiérarchie de titres cohérente, des contrôles atteignables au clavier, des images alternatives pertinentes et des landmarks non redondants doivent survivre à l’apparence visuelle.

Passez ensuite à l’intégration. Vérifiez les classes, les variables CSS et les sélecteurs afin que le bloc consomme le système existant au lieu de le redéfinir. Testez chaque scheme et une largeur étroite. Recherchez les scripts qui ajoutent des écouteurs globaux, les dépendances à des nœuds uniques ou les injections de styles répétées; un bloc peut sembler isolé dans sa prévisualisation et dégrader une page qui en contient plusieurs. Enfin, enregistrez pourquoi le fichier a été conservé, les sections qui l’acceptent et la personne qui le maintient. Cette trace permet de décider plus tard si le bloc doit être corrigé, promu comme composant officiel ou supprimé.

L’IA accélère la production d’une première version, non le passage de responsabilité. La qualité durable vient du contrat de parent, de la cohérence de tokens, des tests et de l’inventaire que le thème impose autour de cette première version.
