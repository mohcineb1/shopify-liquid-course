<!-- STATUS: draft -->
# Chapter 27 — Exercise

## Goal
Refactorer la fiche produit d’**Atelier North** pour que prix, média, disponibilité, quantité et plan d’achat reflètent une seule variante courante au lieu d’un mélange de données produit et de données de variante.

## Context
La marque vend des infusions en vrac avec plusieurs formats, intensités et moyens d’achat. Une fiche produit actuelle affiche toujours le premier prix de gamme, montre une image de produit même lorsqu’un variant sélectionné possède son propre média, traite une quantité d’inventaire comme une promesse de stock, et présente les abonnements comme un simple badge. Les liens envoyés par les campagnes incluent déjà des variantes précises; l’équipe ne peut donc pas se permettre de rediriger silencieusement un client vers une autre option disponible.

Votre tâche est de rendre une première version Liquid solide de la fiche. Elle doit décrire correctement l’état initial avant toute amélioration JavaScript, utiliser les options administrées dans leur ordre, et préparer les données dont une interface client aura besoin pour synchroniser un changement de variant. Le thème ne doit pas inventer de modèle de données : la provenance de chaque prix, média, règle de quantité, metafield et plan doit rester visible dans le code.

Prévoyez environ **60 minutes**. Testez, si possible, un produit avec plusieurs options, une variante non disponible, une variante avec média, une remise compare-at, et un plan de vente. Lorsque la boutique de développement ne possède pas l’un de ces états, notez le scénario manquant au lieu de le simuler avec une valeur littérale.

## Requirements

- [ ] Identifiez une variante courante au chargement qui respecte un lien profond de variant et ne remplace pas silencieusement une sélection indisponible. Toute information transactionnelle initiale doit venir de cette variante.
- [ ] Affichez les options produit dans l’ordre administré, avec une représentation textuelle accessible de chaque valeur et un état sélectionné. Ne supposez ni nom d’option, ni position, ni nombre d’options.
- [ ] Rendez le prix actif et un prix compare-at uniquement lorsque la relation de promotion est vraie pour la variante active. Si une surface de résumé de gamme est ajoutée, elle doit annoncer clairement qu’il s’agit d’une plage.
- [ ] Faites refléter au média principal la variante active quand elle a un média, avec un fallback à une surface produit raisonnable. Préparez la galerie pour des images, vidéos, modèles 3D et médias externes sans les réduire à un seul type.
- [ ] Désactivez l’achat lorsque la variante n’est pas disponible et rendez les contraintes de quantité min/max/increment de la variante. Ne publiez pas une promesse « stock restant » qui ignore la policy ou le contexte.
- [ ] Lorsqu’un plan de vente est disponible ou exigé, rendez un choix qui conserve le lien entre plan, variant et montant résultant. Le plan ne doit pas être présenté comme une réduction calculée à partir de son nom.
- [ ] Rendez une donnée produit structurée pertinente, avec une garde lorsque le metafield est absent ou de forme incompatible. Affichez aussi vendor/type/tags/collections/template suffix uniquement si chaque exposition a une raison de merchandising claire.
- [ ] Vérifiez quatre états : variant profond disponible, variant profond indisponible, produit sans média de variante, et produit sans plan de vente. Documentez ce qui resterait à synchroniser côté client après ce rendu Liquid initial.

> [VERIFY] Vérifiez les propriétés de variant, option values, media, quantity rules, breaks, selling-plan allocations et metafields actuellement offertes à votre thème avant de rendre une fiche produit de production.

## Constraints

N’utilisez pas le prix minimal du produit comme prix de la variante active. Ne remplacez pas une variante explicitement ciblée dans l’URL parce qu’une autre est achetable. N’utilisez pas `option1`, `option2` ou `option3` dépréciés; ne déduisez pas un swatch depuis la seule chaîne de couleur. N’appelez pas une quantité brute une disponibilité client sans considérer policy, management et règle de quantité.

N’écrivez pas une réduction d’abonnement en dur et ne copiez pas une spécification produit dans un réglage de section. N’ajoutez pas de framework ou de demande Ajax : le livrable est le contrat Liquid initial et les données nécessaires à une future synchronisation. Gardez les fichiers de départ à leurs chemins et ne transformez pas l’exercice en une refonte de design.

## Starter

| Fichier | Rôle dans le point de départ |
| --- | --- |
| `starter/sections/main-product.liquid` | Fiche produit qui mélange prix de gamme, stock et média produit. |
| `starter/snippets/product-media.liquid` | Média principal limité à une image de produit. |
| `starter/assets/main-product.css` | Mise en page de base pour la fiche et ses états. |

Le point de départ rend un produit, mais il ne construit pas encore un contrat de variante fiable. Vous décidez des fallbacks, des gardes, de la hiérarchie d’achat et des valeurs à préparer pour la suite.

## Done when

Un lien profond affiche la variante demandée, son prix, son état d’achat et son média lorsque disponible. Les options sont accessibles et reflètent l’ordre du produit. Aucun prix compare-at n’apparaît sans promotion applicable à la variante. L’achat et la quantité respectent les contraintes de la variante, tandis que les plans de vente et données structurées disparaissent proprement lorsqu’ils ne sont pas présents. Les métadonnées affichées servent une décision de merchandising réelle plutôt qu’un dump de propriétés.

## Stretch

Définissez un contrat de données client minimal pour mettre à jour variante, prix, disponibilité, média, quantité et allocations de plan après un changement d’option, sans faire du DOM local une seconde source de vérité. La solution n’implémente pas ce comportement.
