<!-- STATUS: final -->
# Chapter 22 — Exercise

## Goal
Construire une couche de réglages de marque pilotée par tokens, puis faire consommer à une section de promotion un choix global cohérent et compréhensible dans l’éditeur de thème.

## Context
La boutique fictive **Atelier North** utilise les mêmes promotions sur ses collections, son blog et sa page d’accueil. Son équipe a laissé se multiplier les couleurs locales, les titres de campagne et des règles CSS qui ne correspondent plus à la charte. La responsable e-commerce doit pouvoir maintenir quelques décisions globales — identité de marque, traitement des surfaces et annonce promotionnelle — sans transformer les réglages de thème en panneau technique incompréhensible.

Votre objectif est de concevoir une configuration qui donne à cette personne un petit nombre de décisions reconnaissables. Les valeurs doivent conduire à un rendu stable sur le storefront, y compris si le marchand n’a pas encore renseigné les options facultatives. Ne résolvez pas le problème en exposant chaque propriété CSS comme un réglage séparé : l’exercice évalue votre capacité à construire une abstraction de design et à attribuer chaque décision au bon niveau.

Prévoyez environ **45 minutes**. Travaillez avec une copie de développement du thème afin de pouvoir examiner simultanément les réglages et le storefront.

## Requirements

- [ ] Organisez les réglages globaux en groupes dont l’ordre correspond au parcours d’un marchand : identité de marque, choix de surface/couleur, puis annonce promotionnelle. Les titres et le texte d’aide doivent expliquer une décision marchand, et non une propriété interne du thème.
- [ ] Permettez au marchand de configurer un nom de campagne court, un message plus long, une destination facultative et un mode visuel parmi des choix nommés. Les valeurs par défaut doivent produire une promotion utile dans une boutique neuve.
- [ ] Créez un mécanisme de design-token qui donne à la promotion une surface cohérente avec le reste de la marque. Le marchand doit sélectionner une intention de design; il ne doit pas devoir coordonner manuellement plusieurs codes couleur dans la section.
- [ ] Ajoutez un contrôle conditionnel : l’option de destination ne doit apparaître que lorsque le marchand a choisi d’afficher un appel à l’action. Si une ancienne valeur de destination existe, le storefront ne doit pas afficher un lien trompeur lorsque l’appel à l’action est désactivé.
- [ ] Rendez la section de promotion à partir des réglages globaux. Elle doit garder une structure sémantique lisible, afficher un état cohérent sans lien facultatif et rendre visible le mode de surface choisi.
- [ ] Ajoutez une courte description dans les réglages qui avertit que ces choix sont globaux et doivent rester peu nombreux. Vérifiez que chaque label peut être compris sans lire le code source.
- [ ] Vérifiez manuellement une configuration neuve et une configuration modifiée : changez le mode visuel, activez puis désactivez l’appel à l’action, renseignez une destination, et contrôlez le rendu de tous les états sur le storefront.

> [VERIFY] Vérifiez dans la documentation Shopify actuelle les types de réglage, attributs de `visible_if`, contextes autorisés et comportement de persistance applicables à votre version de thème avant de publier une configuration de production.

## Constraints

N’utilisez ni application, ni framework JavaScript, ni données de démonstration copiées depuis un autre thème. N’ajoutez pas de réglages locaux qui dupliquent les décisions globales demandées ici. N’utilisez pas de HTML ou de Liquid libre comme échappatoire à une décision de contenu ou de design structurée. Gardez l’implémentation dans les fichiers de départ fournis et les emplacements de thème appropriés.

Ne modifiez pas `settings_data.json` comme s’il s’agissait de la source de vérité du schéma. Traitez les IDs et les valeurs existantes comme un contrat marchand : si vous expérimentez dans l’éditeur, comprenez quelle configuration est persistée et évitez tout écrasement de l’état d’une boutique réelle.

## Starter

Commencez avec les fichiers ci-dessous. Le fichier de configuration contient seulement l’enveloppe et une note d’intention; choisissez vous-même les réglages nécessaires et leur hiérarchie. La section contient le squelette sémantique de la promotion mais aucune consommation de réglage. La feuille de style fournit des tokens CSS neutres et une mise en page minimale, sans décider pour vous du système de surfaces.

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/config/settings_schema.json` | Emplacement de la configuration globale à concevoir. |
| `starter/sections/brand-promotion.liquid` | Surface storefront qui doit refléter les décisions globales. |
| `starter/assets/brand-promotion.css` | Base de style que vous relierez à votre système de tokens. |

## Done when

Dans l’éditeur, une personne non technique peut parcourir les groupes dans un ordre logique, reconnaître le choix de surface et comprendre la conséquence de l’appel à l’action. Les contrôles secondaires n’apparaissent que lorsqu’ils sont pertinents. Sur le storefront, la promotion a une surface cohérente, affiche le nom et le message configurés, et n’affiche un lien que lorsqu’un appel à l’action est activé et qu’une destination exploitable existe. Les changements globaux sont visibles sans ajouter une collection de réglages locaux à la section.

## Stretch

Proposez une stratégie de migration pour remplacer un ancien ensemble de couleurs libres par votre nouveau système de choix intentionnels, en protégeant une boutique déjà configurée. Décrivez le plan et les scénarios de test; la solution de ce chapitre ne répondra volontairement pas à cette partie.
