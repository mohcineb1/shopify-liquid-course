<!-- STATUS: final -->
# Chapter 25 — Exercise

## Goal
Évaluer, dans une boutique de développement configurée pour **Liquid July ’26 changes**, une page collection Liquid-first qui compose un cadre réutilisable et rafraîchit seulement sa région de résultats après un changement de tri.

## Context
L’équipe d’Atelier North étudie la préversion Liquid-first avant de choisir ses prochaines conventions de thème. Elle ne veut pas migrer son architecture JSON, ses groupes de sections ni ses parcours marchands existants. Elle veut cependant répondre à deux questions précises dans un prototype isolé : est-il plus lisible de déclarer une hiérarchie de page directement dans un template Liquid, et une région de résultats rendue serveur peut-elle être rafraîchie sans reconstruire tout le document ?

Vous allez construire une page de collection de laboratoire. Le template doit posséder explicitement son cadre de page et rendre une région de produits nommée. Un contrôle de tri doit demander un rendu serveur actualisé de la seule région qui change. Tout le travail doit rester reconnaissable comme expérimental, réversible et impossible à confondre avec une fonctionnalité stable livrée à des marchands.

Prévoyez **50 à 60 minutes**. Commencez par confirmer que vous utilisez une boutique de développement et que la feature preview indiquée dans le chapitre est sélectionnée. Si ce n’est pas possible, documentez pourquoi vous ne pouvez pas exécuter le prototype au lieu de remplacer la préversion par une API stable hors scope.

## Requirements

- [ ] Placez tout le prototype dans une surface clairement identifiée comme préversion, avec une note de retrait indiquant que l’expérience ne remplace pas les templates JSON ni les groupes de sections existants.
- [ ] Composez le cadre de page à partir d’une unité de theme block réutilisable. La structure de la collection doit pouvoir être lue dans le template sans devoir reconstruire mentalement une composition JSON séparée.
- [ ] Assurez-vous que les valeurs contrôlées par le template et les valeurs destinées à l’éditeur ne sont pas confondues. Documentez en une phrase l’owner de chaque type de valeur utilisé dans le prototype.
- [ ] Délimitez une région nommée qui contient uniquement les éléments réellement affectés par le tri. Ne transformez pas l’intégralité de la page en région rafraîchie.
- [ ] Créez un comportement client qui applique un nouveau tri à cette région. Il doit préserver l’URL de la page, proposer un état de chargement observable et éviter qu’une réponse plus lente remplace une demande plus récente.
- [ ] Vérifiez que la mise à jour ne dépend pas d’un framework client ni d’un chemin de storefront codé en dur. Testez au moins deux tris et le retour arrière du navigateur.
- [ ] Rédigez une courte note d’évaluation : lisibilité du template, intégrité de la région, focus et annonce utilisateur, comportement d’erreur, et conditions qui exigeraient d’abandonner le prototype.

> [VERIFY] Confirmez avant de coder la preview active, la syntaxe actuelle de `{% block %}` et `{% partial %}`, ainsi que l’installation et le contrat du package de rafraîchissement partiel applicables à votre environnement de développement.

## Constraints

Ne modifiez pas un template JSON de production et ne migrez ni groupes de sections ni données de marchand. Ne présentez pas le résultat comme prêt pour une boutique réelle. N’encadrez pas la page entière dans la région de rafraîchissement. N’utilisez pas une API de rendu de section stable comme substitut : l’objectif est d’évaluer les responsabilités spécifiques de la préversion.

N’ajoutez pas de paramètres de block pour du contenu que le template possède déjà, et n’utilisez pas un block comme un simple helper interne dépourvu de rôle de theme block. Le code du client doit annuler ou ignorer la demande précédente lorsque le marchand déclenche rapidement plusieurs tris. Tous les chemins de sortie, y compris l’impossibilité d’activer la preview, doivent rester documentés.

## Starter

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/templates/collection.preview.liquid` | Surface de test Liquid-first avec une collection et un contrôle de tri incomplets. |
| `starter/blocks/preview-frame.liquid` | Cadre réutilisable qui ne rend pas encore son contenu de template. |
| `starter/assets/collection-preview.js` | Contrôle de tri qui modifie l’URL sans demander ni appliquer une région fraîche. |
| `starter/preview-evaluation.md` | Registre de validation et de retrait du prototype. |

Ces fichiers rendent volontairement une page insuffisante. Décidez vous-même de la frontière de partial, du contrat du block, de l’URL et de la stratégie de concurrence; ne copiez pas une implémentation sans pouvoir l’expliquer.

## Done when

La page de laboratoire affiche une composition lisible dans son template et garde le contenu de page sous contrôle du template. Un changement de tri met à jour seulement la région de résultats appropriée, avec une URL partageable et un état de chargement clair. Les interactions rapides ne peuvent pas afficher une réponse périmée. Votre note prouve que le prototype a été évalué comme préversion, inclut une voie de retrait et n’annonce aucune migration de JSON ou de groupes de sections.

## Stretch

Rafraîchissez de façon cohérente le compteur de résultats en même temps que la grille, tout en utilisant une transition de vue seulement lorsque le navigateur la prend en charge. Décrivez le fallback et les implications d’accessibilité; la solution ne fournit pas cette extension.
