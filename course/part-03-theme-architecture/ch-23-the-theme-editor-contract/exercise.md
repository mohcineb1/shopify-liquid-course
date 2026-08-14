<!-- STATUS: final -->
# Chapter 23 — Exercise

## Goal
Rendre une section de panneaux de collection fiable dans l’éditeur de thème lorsqu’un marchand la sélectionne, modifie son contenu, la déplace ou la supprime.

## Context
**Atelier North** utilise une section « Notes de collection » pour donner du contexte à une collection : matière, fabrication et entretien. L’équipe contenu veut ajouter des panneaux, les réordonner et les sélectionner dans l’éditeur sans devoir recharger la page. Chaque collection peut aussi fournir une note d’origine dans un metafield; lorsqu’elle est liée, cette note doit pouvoir alimenter le texte de la section. La boutique est encore en phase de lancement : si aucune collection ni source n’est disponible, le thème doit conserver une première expérience calme et compréhensible plutôt qu’afficher une erreur ou du contenu fictif.

La section actuelle contient une structure storefront minimale et un script qui traite toute la page comme une seule instance. Cette approche devient fragile dès que l’éditeur remplace ou réordonne une section. Votre travail est d’établir un contrat d’instance robuste : le marchand doit savoir ce qu’il sélectionne et votre comportement client ne doit ni se dupliquer ni dépendre du contexte d’édition pour fonctionner.

Prévoyez environ **50 minutes** et testez dans une copie de développement du thème. Le résultat doit être observable dans l’éditeur et utilisable sur le storefront public.

## Requirements

- [ ] Donnez à la section et à chacun de ses panneaux une identité correcte dans le markup afin que l’éditeur puisse cibler et sélectionner l’instance attendue.
- [ ] Permettez au marchand d’ajouter, supprimer, sélectionner et réordonner les panneaux sans que l’ordre visuel repose sur un index JavaScript, un ID HTML constant ou le premier élément correspondant sur la page.
- [ ] Lorsque l’éditeur sélectionne la section ou un panneau, fournissez un retour visuel temporaire et local à l’instance concernée. Ce retour doit disparaître lorsqu’il est désélectionné et ne doit pas modifier le comportement normal pour un client.
- [ ] Garantissez que le comportement de la section reste correct après un chargement, un retrait, une modification de réglage qui remplace le markup, puis un réordonnancement. Une interaction ne doit jamais être exécutée deux fois à cause d’écouteurs accumulés.
- [ ] Ajoutez un réglage de contenu pouvant être relié à une source dynamique appropriée pour le contexte de collection. La section doit présenter un fallback cohérent lorsqu’aucune source n’est connectée ou lorsqu’aucune valeur n’est disponible.
- [ ] Concevez des valeurs de première installation qui donnent une section compréhensible sans catalogue configuré. Elles doivent aider le marchand à reconnaître la fonction de la section sans écraser une configuration existante.
- [ ] Vérifiez le résultat avec deux instances de la section : sélectionnez-les séparément, déplacez-les, modifiez un panneau, puis supprimez-en une. L’autre doit rester correctement interactive et ciblable.

> [VERIFY] Vérifiez les événements de l’éditeur, leur payload, la syntaxe des sources dynamiques et les règles de `shopify_attributes` auprès de la documentation Shopify actuelle avant de transformer cette pratique en code de production.

## Constraints

N’utilisez ni framework JavaScript, ni application, ni identifiant DOM global servant à distinguer des instances. Ne vous appuyez pas sur un rechargement complet de page pour réparer l’état après une modification d’éditeur. Ne dupliquez pas la note de collection à la fois dans un champ de section et dans une donnée structurée comme si ces sources appartenaient au même niveau. Ne stockez aucune sélection d’éditeur dans une préférence client ou dans une donnée persistante.

Ne modifiez pas un fichier de données marchand pour simuler une valeur de première installation. Les defaults et presets doivent préparer le cas neuf, tandis que les données existantes conservent leur ownership marchand. Gardez la structure sémantique du point de départ et n’ajoutez que le CSS nécessaire pour rendre les états d’éditeur visibles sans dépendre de l’éditeur.

## Starter

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/sections/collection-notes.liquid` | Section de collection avec panneaux éditables et structure storefront initiale. |
| `starter/assets/collection-notes.js` | Comportement délibérément global et incomplet à remplacer par une logique d’instance. |
| `starter/assets/collection-notes.css` | Mise en page de base et emplacements pour les états temporaires de sélection. |

Les fichiers de départ rendent une section statique minimale, mais ils ne fournissent ni l’identité d’éditeur, ni le cycle de vie, ni la décision de source dynamique. Vous devez décider comment les articuler sans recopier une réponse externe.

## Done when

Dans l’éditeur, le marchand voit clairement la section et le panneau sélectionné, et l’indicateur de sélection n’est pas laissé sur le storefront normal. Après une modification de panneau, un déplacement ou la suppression d’une instance, aucune autre instance ne perd son comportement ou ne reçoit des écouteurs supplémentaires. Une note de collection reliée apparaît lorsque la donnée existe; l’absence de liaison ou de donnée laisse un fallback éditorial sobre. Une première installation rend une section compréhensible avant toute configuration, alors qu’une configuration préexistante conserve ses choix.

## Stretch

Ajoutez un comportement de prévisualisation qui fait défiler le panneau de block actuellement sélectionné dans le viewport de l’éditeur, sans provoquer de scroll pour un client ni conserver de position persistante. La solution de ce chapitre n’implémente pas ce scénario : décrivez ses contraintes de cycle de vie après votre tentative.
