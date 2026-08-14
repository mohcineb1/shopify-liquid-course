<!-- STATUS: final -->
# Chapter 26 — Exercise

## Goal
Transformer le footer d’**Atelier North** en une surface contextuelle qui utilise les données globales et les objets de navigation Shopify au lieu de chemins, langues et informations magasin codés en dur.

## Context
Le footer actuel a été assemblé pour une boutique de démonstration anglophone. Il contient un lien panier fixe, une URL de compte historique, un menu écrit directement dans le Liquid et une locale affichée depuis une propriété de magasin qui ne représente pas forcément la requête du visiteur. L’entreprise vend désormais sur plusieurs marchés, utilise des comptes clients modernes et confie les menus, politiques et réglages de marque à l’administration. L’équipe ne veut pas une refonte graphique : elle veut que le footer rende les décisions administrées, respecte les URLs de storefront et continue de fonctionner lorsqu’une politique, un menu ou une option de localisation n’est pas présent.

Votre rôle consiste à définir les frontières de donnée. Le magasin doit fournir son identité et les éléments de confiance qu’il possède vraiment; la requête doit fournir son contexte; les routes doivent définir les destinations standard; la navigation doit rester un arbre marchand; et une interface de localisation doit proposer seulement les choix disponibles. Le résultat doit rester lisible pour un client et observable dans le thème editor sans créer une expérience produit différente.

Prévoyez environ **45 minutes**. Travaillez dans une copie du thème et testez au moins une locale ou un marché alternatif si la boutique de développement le permet.

## Requirements

- [ ] Remplacez chaque destination storefront codée en dur par une destination générée par l’objet approprié. Les liens panier, recherche et compte doivent rester corrects lorsque l’architecture de compte ou le format d’URL change.
- [ ] Rendez l’identité de magasin, le message de marque, les politiques et les moyens de paiement à partir de données dont le magasin est propriétaire. Les éléments optionnels ne doivent pas laisser de wrapper ou de séparateur inutile lorsqu’ils sont absents.
- [ ] Affichez un résumé de contexte qui utilise des données de requête pertinentes sans exposer des informations techniques aux clients. La preview d’éditeur doit pouvoir éviter une intégration de diagnostic ou de suivi, mais le contenu client doit rester fonctionnel et fidèle.
- [ ] Utilisez les réglages de thème uniquement pour une décision globale de présentation raisonnable. Ne déplacez pas dans `settings` les données de politique, les URLs de système ou la structure de menu déjà détenues ailleurs.
- [ ] Rendez un menu administré avec son état actif et ses éventuels enfants. Le footer doit gérer l’absence de menu et ne doit pas déduire l’élément actif avec une comparaison de chemin manuelle.
- [ ] Ajoutez une interface de localisation fondée sur les langues et pays réellement disponibles, avec la sélection actuelle visible. Une boutique qui ne propose qu’une option doit rester sobre et valide.
- [ ] Vérifiez le footer dans un contexte de page ordinaire, avec une politique absente, sans menu secondaire, avec comptes activés ou désactivés, et dans l’éditeur. Notez les valeurs dont le contexte est requis avant rendu.

> [VERIFY] Vérifiez les contrats actuels de `shop`, `request`, `routes`, `localization`, `linklists`, les formulaires de localisation et les propriétés de link avant de livrer un footer de production.

## Constraints

N’écrivez aucun chemin interne comme `/cart`, `/account` ou `/search`. N’utilisez pas une propriété `shop` marquée dépréciée pour représenter une locale ou une donnée contextuelle. N’ajoutez pas de liste de pays et langues à la main. Ne cachez pas un élément client essentiel sous `request.design_mode`; cette condition ne peut servir qu’à limiter une intégration de développement ou de suivi perturbatrice.

N’écrasez pas le système de navigation par une hiérarchie écrite dans le code. N’utilisez pas de JavaScript pour décider quelle URL Shopify est correcte. Conservez les trois fichiers de départ comme une surface de rendu : l’exercice porte sur la sélection d’objets et les états absents, pas sur une refonte de styles ou un framework.

## Starter

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/sections/site-footer.liquid` | Structure de footer avec données et URLs volontairement figées. |
| `starter/snippets/footer-navigation.liquid` | Menu de démonstration à remplacer par un arbre marchand. |
| `starter/assets/site-footer.css` | Mise en page finalisée, sans décisions de données. |

Les fichiers de départ permettent de voir un footer, mais l’intérêt de l’exercice — ownership, routes, contexte, localisation et navigation — reste entièrement à concevoir.

## Done when

Le footer affiche une identité et des politiques réellement configurées, des liens standards localisés sans chemins supposés et un menu administré dont l’élément actif est signalé. Les comptes activés ou désactivés ne génèrent pas un lien inutile. Les options de localisation correspondent aux possibilités du magasin et la sélection actuelle est lisible. Les valeurs manquantes ne produisent ni HTML vide ni contenu fictif. L’éditeur ne transmet pas d’événement de suivi, sans que le footer lui-même cesse de représenter ce que verra un client.

## Stretch

Ajoutez une stratégie de navigation récursive qui conserve la sémantique et l’état actif au-delà d’un seul niveau d’enfants, puis documentez une limite de profondeur et sa justification. La solution ne fournit pas cette extension.
