<!-- STATUS: final -->
# Chapter 24 — Exercise

## Goal
Préparer une surface de thème dans laquelle un marchand peut conserver et utiliser des blocs générés tout en respectant l’espacement, les schemes et les responsabilités de maintenance de **Atelier North**.

## Context
La directrice e-commerce d’Atelier North veut tester des blocs générés pour des campagnes saisonnières : un témoignage, un bandeau éditorial ou une comparaison de matières. Elle veut pouvoir les ajouter dans une zone de contenu souple, ou demander une nouvelle section lorsqu’aucune surface existante n’est appropriée. L’équipe design accepte cette expérimentation à une condition : aucun résultat généré ne doit créer une seconde identité visuelle, casser la largeur de lecture du thème, ni contourner les contrôles nécessaires au contenu d’application déjà installé.

Le thème comporte une bande de contenu qui ne sait aujourd’hui rendre que ses blocs historiques et une tentative de wrapper qui ressemble à une section ordinaire mais ne satisfait pas le contrat de plateforme. Votre travail est de rendre les surfaces compatibles sans transformer l’IA en source de vérité. Le marchand doit obtenir une zone de composition claire; l’équipe doit conserver une base de design et une procédure de revue pour les fichiers qui seront ajoutés à la bibliothèque de blocks.

Prévoyez environ **45 minutes**. Travaillez dans une copie de développement, puis observez l’éditeur à la fois avec une section existante et avec une demande de nouvelle section contenant un bloc généré.

## Requirements

- [ ] Transformez la bande de contenu en une surface ouverte qui peut accepter les blocs de thème appropriés et, lorsque la page le permet, le contenu d’application. Son markup doit fournir un conteneur stable, sémantique et visuellement neutre pour des enfants qu’elle ne connaît pas à l’avance.
- [ ] Conservez une distinction nette entre les blocks propres à cette bande et les blocks ajoutés depuis la bibliothèque du thème. Le parent ne doit pas supposer que tous les enfants ont les mêmes réglages ou le même markup.
- [ ] Réparez le wrapper destiné aux blocs ajoutés comme nouvelle section afin qu’il soit reconnu par la plateforme, puisse accueillir les catégories nécessaires et ne se présente pas comme une section manuelle ordinaire.
- [ ] Donnez au wrapper un petit ensemble de contrôles de système — par exemple largeur, espacement ou scheme — que le marchand peut comprendre. Ne fournissez pas une liste de réglages CSS granulaires à chaque bloc généré.
- [ ] Définissez dans `generated-block-review.md` une procédure de revue avant conservation : données et defaults, markup, clavier, mobile, schemes, CSS, scripts, ownership et suppression. Elle doit permettre à une équipe de décider de conserver, corriger ou supprimer un fichier généré.
- [ ] Testez le résultat avec au moins une sortie générée : elle doit rester dans le rythme de largeur et d’espacement d’Atelier North, être lisible dans deux contextes de surface et ne pas empêcher l’ajout d’un app block compatible.
- [ ] Vérifiez que la surface de nouveau bloc et le wrapper de plateforme ne sont pas rendus manuellement ou proposés comme de fausses sections dans l’interface marchand.

> [VERIFY] Vérifiez sur la documentation Shopify actuelle les préconditions exactes de `_blocks.liquid`, l’acceptation de `@theme` et `@app`, les restrictions de schema, ainsi que les conditions réelles d’accès à la génération de blocks.

## Constraints

N’utilisez pas de framework JavaScript, de CSS global qui cible les éléments internes de tous les blocks, ni de boucle qui suppose un champ de réglage commun pour un block généré. Ne copiez pas une section de thème tierce. N’ajoutez pas d’attribut de restriction de templates, même indirectement, au wrapper spécial. Ne déclarez pas de limite sur la catégorie app si ce paramètre est interdit par son contrat.

Ne conservez pas un bloc généré sur la seule base de son aperçu initial. La génération crée du code qui doit être contrôlé, inventorié et possédé par l’équipe. Les choix de design appartiennent au wrapper et aux tokens du thème; le contenu et l’implémentation du block doivent rester explicitement revus.

## Starter

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/sections/campaign-content-band.liquid` | Surface de campagne existante dont le contrat enfant est trop fermé. |
| `starter/sections/_blocks.liquid` | Wrapper volontairement incomplet des blocs placés dans une nouvelle section. |
| `starter/assets/generated-blocks.css` | Primitives d’espacement et de surface à relier au système de design. |
| `starter/generated-block-review.md` | Registre de revue à compléter avant qu’un fichier généré soit conservé. |

Les fichiers contiennent des intentions visibles mais pas la composition correcte. Gardez les décisions intéressantes — surfaces acceptées, slot de rendu, contrôles de wrapper et gouvernance — à votre charge.

## Done when

Dans l’éditeur, le marchand peut ajouter un block de thème à la bande de campagne et demander un block dans une nouvelle section sans erreur de wrapper. Le contenu généré reçoit une largeur et un espacement cohérents avec le thème, tout en gardant sa propre structure. Le parent n’impose pas de réglages fictifs aux enfants inconnus. Votre registre permet à une autre personne de vérifier la sortie sur mobile, au clavier et dans plusieurs schemes avant conservation. Aucune section spéciale n’est présentée comme un composant que le marchand ajoute manuellement.

## Stretch

Proposez une convention de métadonnées ou de documentation permettant d’inventorier chaque block généré, les surfaces qui l’acceptent et son propriétaire, puis d’identifier les fichiers inactifs avant suppression. La solution de ce chapitre ne fournit pas cette automatisation.
