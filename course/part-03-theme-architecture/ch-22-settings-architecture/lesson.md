<!-- STATUS: final -->
---
id: ch-22
title: "Settings Architecture"
part: 3
---

# Chapter 22 — Settings Architecture

Les réglages de thème constituent une API marchande globale. Ils ne sont pas une liste commode de variables Liquid : ils définissent les décisions que le marchand peut prendre, l’état qu’il possède après configuration, et les invariants visuels que le thème doit conserver. Une bonne architecture réduit les décisions répétitives, regroupe les choix selon un modèle de design, et distingue les valeurs globales des réglages de section, bloc, template ou ressource.

## 22.1 `settings_schema.json` structure and ordering

`config/settings_schema.json` déclare les groupes et contrôles affichés dans l’éditeur des réglages de thème. Sa structure et son ordre sont une interface utilisateur. Organisez les groupes par décision marchande stable—identité, couleurs, typographie, layout, comportements globaux—plutôt que par fichier CSS ou propriété interne. Les IDs sont des contrats techniques durables; les labels et descriptions sont des contrats de compréhension pour marchands.

Chaque groupe doit avoir un objectif clair, des choix cohérents, et des valeurs par défaut sûres. Renommer ou supprimer un ID n’est pas un simple refactor car l’état existant le référence. Traitez le schéma comme une API versionnée et conservez une migration consciente de l’état marchand.

## 22.2 Every input setting type: text, textarea, richtext, inline_richtext, html, checkbox, radio, select, range, number, color, color_background, color_scheme, color_scheme_group, font_picker, image_picker, video, video_url, url, link_list, collection, collection_list, product, product_list, blog, page, article, metaobject, metaobject_list, text_alignment, style.layout_panel, liquid

Les types textuels servent des objectifs différents : `text` pour une courte valeur atomique, `textarea` pour texte brut long, `richtext` pour contenu riche, `inline_richtext` pour contenu riche bref intégré à une ligne, et `html` ou `liquid` uniquement quand l’exposition de code fait réellement partie du contrat et que sa surface de risque est assumée. Un réglage de contenu n’est pas automatiquement un réglage global : une phrase de hero appartient souvent à une section, pas au thème entier.

Les contrôles de choix comprennent `checkbox`, `radio`, `select`, `range`, `number`, `text_alignment`, `style.layout_panel`, ainsi que les contrôles couleur `color`, `color_background`, `color_scheme` et `color_scheme_group`. Choisissez-les selon la décision : une checkbox pour un oui/non, un select pour quelques modes nommés, un range pour un continuum lisible. Ne donnez pas une valeur numérique libre si l’éditeur doit choisir parmi trois variantes de layout approuvées.

Les sélecteurs de ressources comprennent `font_picker`, `image_picker`, `video`, `video_url`, `url`, `link_list`, `collection`, `collection_list`, `product`, `product_list`, `blog`, `page`, `article`, `metaobject` et `metaobject_list`. Ils créent des dépendances vers des objets marchands. Utilisez-les quand la sélection globale est réellement stable; une section de collection éditoriale doit généralement sélectionner sa collection localement. Les valeurs de ressources doivent être traitées comme éventuellement absentes et rendues avec des gardes explicites.

> [VERIFY] Vérifiez les types actuellement pris en charge, leurs attributs, leurs limites et leur contexte autorisé dans la documentation Shopify avant de choisir un type de réglage de production.

## 22.3 Sidebar setting types: header, paragraph, and visual grouping

`header` et `paragraph` organisent l’interface latérale sans créer de données de rendu. Ils servent à expliquer une décision, regrouper des contrôles associés et limiter la charge cognitive. Un header ne doit pas compenser un groupe de réglages mal conçu; s’il faut beaucoup de texte pour expliquer une combinaison, réduisez les choix ou créez une abstraction de design plus claire.

## 22.4 Conditional settings and `visible_if`

`visible_if` conditionne la visibilité d’un réglage selon un autre réglage. Utilisez-le pour révéler une option qui n’a de sens que lorsque son mode parent est actif : couleur personnalisée après activation d’un override, URL vidéo après sélection d’un mode vidéo. Il réduit le bruit, mais ne remplace pas les valeurs par défaut, les gardes Liquid, ni une validation de contrat. Un réglage caché peut conserver une valeur; le rendu doit rester cohérent si le mode change.

## 22.5 `settings_data.json`, presets, and the merchant-owned state problem

`settings_data.json` stocke l’état configuré, y compris les valeurs que le marchand a modifiées. Les presets proposent des valeurs initiales ou de référence, mais ne sont pas une autorisation pour écraser silencieusement l’état marchand. Modifier un schéma ou un preset exige donc une décision de compatibilité : conserver l’ID existant, fournir une migration, documenter la nouvelle valeur attendue, et tester un thème déjà configuré.

## 22.6 Color schemes and design tokens as a system

Les color schemes et design tokens doivent exprimer un système : foreground, background, accents, frontières, contrastes et contextes de surface. Une section choisit un scheme intentionnel plutôt que de demander au marchand de régler chaque couleur locale. Les tokens réduisent les combinaisons invalides, gardent l’identité cohérente et permettent d’évoluer un thème sans éditer chaque section.

## 22.7 Designing settings that don't overwhelm the merchant

Chaque réglage doit répondre à une décision stable et observable. Préférez une poignée de modes nommés, de valeurs par défaut solides et de schemes cohérents à un panneau qui expose toutes les propriétés CSS. Évaluez l’architecture dans l’éditeur : un marchand sait-il pourquoi ce contrôle existe, ce qu’il modifie, et quand il doit l’utiliser? Si non, déplacez la décision vers un composant local ou remplacez plusieurs options par une abstraction.

## Checklist

- [ ] Les IDs, valeurs par défaut et groupes de schéma sont traités comme une API stable.
- [ ] Chaque type de contrôle correspond à une décision marchand réelle et au bon niveau d’ownership.
- [ ] Les ressources sélectionnées sont gardées contre les valeurs absentes.
- [ ] `visible_if` réduit le bruit sans masquer un contrat de rendu nécessaire.
- [ ] Les color schemes gouvernent des tokens et évitent les combinaisons locales incohérentes.
- [ ] Les changements préservent ou migrent explicitement l’état marchand existant.

## Related

- `ch-17-sections` — schémas de sections et contrôles locaux.
- `ch-24-theme-settings` — consommation des réglages globaux dans Liquid.
- `ch-35-metaobjects` — objets et références de contenu structurés.

## Choisir le type selon la décision, pas selon la donnée disponible

Un même résultat visuel peut être obtenu par plusieurs types, mais le type doit refléter la décision que le marchand comprend. Utilisez `radio` ou `select` pour des modes discrets explicitement nommés; utilisez `range` lorsqu’une échelle graduée est intelligible; utilisez `number` seulement quand une valeur libre est réellement un paramètre de design utile. `color_scheme` sélectionne une combinaison de tokens déjà gouvernée; une succession de réglages `color` locaux transfère au marchand la responsabilité de maintenir contraste et cohérence.

Les sélectionneurs de ressources exigent la même discipline. `product_list` convient à une sélection globale de produits, alors qu’une grille éditoriale locale peut devoir vivre dans une section. `metaobject` et `metaobject_list` lient un thème à du contenu structuré; ils ne doivent pas devenir un substitut opaque à un modèle de données absent. `video` et `video_url` ont des contrats de source et de rendu différents. `url` exprime une destination; `link_list` exprime une navigation. Choisir le bon type réduit les validations manuelles et rend l’éditeur plus explicite.

Les réglages `html` et `liquid` doivent être exceptionnels. Ils peuvent confier au marchand une puissance qui contourne les garde-fous du composant, complique l’échappement et rend la maintenance imprévisible. Préférez des paramètres structurés, des blocks ou des sections lorsque le besoin est un modèle de contenu connu. Si une surface de code est réellement nécessaire, documentez son niveau de responsabilité, ses limites et les scénarios de test.

## État, presets et évolution sans surprise

Le schéma décrit les possibilités; `settings_data.json` représente ce que le marchand possède aujourd’hui. Cette distinction rend les changements risqués. Ajouter un réglage avec une valeur par défaut peut être sûr, mais modifier le sens d’un ID existant peut transformer une configuration réelle. Supprimer un choix peut laisser une valeur ancienne ou nécessiter une migration. Les presets sont des points de départ, pas un mécanisme de réinitialisation forcée de boutiques configurées.

Avant toute évolution, examinez un état neuf et un état marchand représentatif. Conservez les IDs dont la signification reste compatible. Si une valeur doit changer de forme, introduisez une transition explicite ou une valeur de repli documentée. Testez aussi les réglages conditionnels : si `visible_if` masque une option, le rendu doit savoir comment traiter une ancienne valeur enregistrée quand le mode parent n’est plus actif.

## Tokens comme langage de design

Un token global encode une intention réutilisable : surface principale, surface inversée, texte par défaut, texte secondaire, bordure, accent, ou espace de layout. Un color scheme assemble ces intentions dans un contexte cohérent. Les sections choisissent un scheme; elles ne redéfinissent pas chaque couleur au hasard. Cela réduit les matrices de test, améliore la cohérence et facilite le changement d’identité visuelle.

Testez les schemes dans leurs contextes les plus exigeants : texte long, bouton, lien, état hover, image de fond, surface superposée et contenu de section répété. Un token ne réussit pas parce que sa valeur hexadécimale semble correcte; il réussit parce que ses usages maintiennent lisibilité et hiérarchie. Les réglages globaux doivent proposer des choix de système, pas une palette de micro-exceptions.

## Revue de charge cognitive

Parcourez l’éditeur comme un marchand. Chaque groupe doit répondre à une question simple. Chaque réglage doit modifier un résultat observable. Les contrôles conditionnels doivent révéler une décision suivante logique, non cacher une dépendance mystique. Une description est utile quand elle explique une conséquence ou une limite; elle ne doit pas compenser un ID incompréhensible ou un ensemble de choix excessif.

Lorsqu’un marchand doit régler beaucoup d’options pour obtenir un résultat banal, remplacez les options par une valeur par défaut solide, un preset, un color scheme ou un composant local spécialisé. L’objectif est une liberté structurée : assez de contrôle pour l’identité de la boutique, assez de contraintes pour préserver une expérience cohérente et maintenable.

## Architecture de groupes et ordre de lecture

L’ordre de `settings_schema.json` doit suivre le parcours de décision plutôt que l’ordre dans lequel les développeurs ont ajouté des propriétés. Commencez par l’identité visible de la marque, poursuivez par tokens et couleurs, puis typographie, layout et comportements réellement globaux. Évitez de mélanger dans le même groupe une police de titre, un réglage de panier et une image de promotion : le marchand ne peut plus prédire où chercher ni quelle décision il est en train de prendre.

Les `header` et `paragraph` sont des outils de hiérarchie. Utilisez un header lorsque plusieurs contrôles sont les aspects d’une même décision, par exemple un scheme et ses variantes d’utilisation. Utilisez un paragraph pour une conséquence non évidente ou une limite opérationnelle, pas pour documenter une implementation CSS. Si un groupe nécessite plusieurs paragraphes pour être compréhensible, il est probablement trop large ou son abstraction est insuffisante.

## Réglages globaux versus réglages locaux

Un réglage global doit avoir un effet cohérent à travers le thème : logo, color scheme, police, traitement de layout, navigation principale ou comportement global. Un réglage de section doit décrire une instance de page : titre de hero, collection présentée, position de média ou bloc éditorial. Un réglage de block décrit un item répété. Confondre ces niveaux crée un état difficile à maintenir : un marchand cherche une décision locale dans les réglages globaux ou doit la répéter dans chaque section.

Un bon test est le cycle de vie. Si le marchand doit choisir une valeur différemment pour une page, elle n’est probablement pas globale. Si la valeur doit changer avec une campagne temporaire, elle appartient sans doute à une section ou à une ressource. Si elle représente une règle de marque stable, le thème global est le bon propriétaire. Cette répartition réduit le nombre de contrôles affichés et rend les conséquences d’un changement plus prévisibles.

## Procédure de test

Testez le schéma avec une boutique neuve, une boutique configurée et une boutique utilisant plusieurs color schemes. Vérifiez les valeurs par défaut, les états manquants de ressources, les valeurs conditionnelles conservées, le contraste des schemes, et l’ordre des groupes dans l’éditeur. Testez chaque sélection de ressource avec un objet absent et un objet représentatif. Enfin, relisez l’interface sans consulter le code : si les labels, regroupements et defaults ne permettent pas de comprendre l’effet d’un changement, l’architecture doit être simplifiée avant publication.
 Une architecture de réglages réussie protège simultanément le temps du marchand, la cohérence de marque, l’état configuré existant et la capacité future du thème à évoluer sans surprises opérationnelles.
 Les contrôles globaux doivent donc être peu nombreux, intentionnels, localisés, testables, compatibles avec les états existants et clairement séparés des décisions de composants locaux.
 Cette discipline transforme le panneau de réglages en système de décision fiable plutôt qu’en inventaire de propriétés techniques sans hiérarchie ni responsabilité durable.
 Cette cohérence réduit les demandes de support, facilite les évolutions du thème et permet aux équipes de livrer des expériences de marque robustes sans exposer inutilement les détails internes de leur implémentation.
 Ce cadre protège durablement la qualité du thème.
