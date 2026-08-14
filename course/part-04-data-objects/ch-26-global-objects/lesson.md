<!-- STATUS: final -->
---
id: ch-26
title: "Global Objects"
part: 4
---

# Chapter 26 — Global Objects

Les objets globaux Liquid sont les entrées de contexte qui évitent à un thème de deviner le magasin, la requête, l’URL, la localisation ou la navigation. Leur danger vient de leur facilité d’accès : parce qu’ils existent partout, on les traite comme des constantes interchangeables, puis un thème casse sur un marché, une locale, un compte client moderne ou un état d’éditeur. Le bon usage n’est pas de mémoriser chaque propriété; c’est de comprendre qui possède l’information, ce qui est contextuel, ce qui doit générer un lien, et ce qui doit être gardé hors d’un contrat client.

## What you’ll be able to do

- Choisir les propriétés `shop` qui représentent réellement l’identité et les capacités du magasin.
- Utiliser `request` pour diagnostiquer un contexte sans créer une expérience client différente dans l’éditeur.
- Construire liens et endpoints à partir de `routes` plutôt que de chemins supposés.
- Distinguer état de thème, template, URL canonique et taxonomie de tags.
- Rendre une interface de localisation et un arbre de navigation à partir de leurs objets appropriés.

## 26.1 `shop` — every property worth knowing

`shop` décrit une ressource magasin stable : nom, domaines, marque, adresse, contact, politiques, capacités de comptes, devises, moyens de paiement, types, vendeurs, collections et produits. Utilisez `shop.name`, `shop.brand`, `shop.policies`, `shop.enabled_payment_types` et les capacités de compte pour rendre ce que le magasin a effectivement configuré. N’inventez pas une marque depuis le domaine et ne simulez pas une politique lorsqu’aucune politique n’est fournie.

Les propriétés se répartissent en quelques familles utiles. L’identité comprend `name`, `description`, `brand`, `address`, `email`, `phone`, `domain`, `permanent_domain`, `secure_url` et `url`. Les capacités et offres comprennent `accepts_gift_cards`, `customer_accounts_enabled`, `customer_accounts_optional`, `currency`, `enabled_currencies`, `enabled_payment_types`, `products_count`, `collections_count`, `types`, `vendors` et `search_types`. Les obligations et contenus administrés comprennent `policies`, `privacy_policy`, `refund_policy`, `shipping_policy`, `subscription_policy`, `terms_of_service` et `metafields`. Les langues publiées sont disponibles via `published_locales`. [1]

Cette liste ne signifie pas « imprimez toutes les propriétés ». Chaque lecture a un propriétaire. Un footer peut itérer les politiques réellement disponibles; une icône de moyen de paiement doit partir des moyens actifs et utiliser un filtre Shopify prévu à cet effet; une adresse administrative ne doit pas être exposée seulement parce que l’objet la fournit. Comptez aussi les valeurs absentes : une politique, un téléphone ou une subscription policy peut ne pas exister.

Certaines propriétés héritées sont précisément des pièges. La documentation actuelle marque `shop.enabled_locales` comme déprécié au profit de `shop.published_locales`. Elle marque `shop.locale` comme déprécié au profit de `request.locale`, car la locale est contextuelle à la requête et non une propriété intrinsèque du magasin. `shop.metaobjects` est remplacé par l’objet global `metaobjects`; `shop.taxes_included` est remplacé par `cart.taxes_included`, car l’inclusion fiscale dépend du pays client. [1]

> [VERIFY] Vérifiez la page de l’objet `shop` pour toute propriété que vous ajoutez au thème. Ne déduisez jamais le contrat actuel d’un ancien cheat sheet ou d’un thème historique.

## 26.2 `request` — `page_type`, `path`, `host`, `origin`, `design_mode`, `visual_preview_mode`, `locale`

`request` décrit la demande en cours, pas le magasin. `page_type` donne la famille de page rendue; `path` est le chemin de la requête et peut être `nil` lorsque la page n’existe pas; `host` est le domaine hôte; `origin` associe protocole et hôte; `locale` représente la locale de cette requête. Ces valeurs permettent un template conscient de son contexte sans coder un domaine, une langue ou une structure d’URL en dur. [2]

`request.origin` est utile lorsqu’une sortie fournit une URL relative et qu’un contrat exige une URL absolue. Il ne doit pas devenir le réflexe pour les liens internes ordinaires : `routes` reste la source de liens standardisés. `request.path` est approprié pour afficher ou comparer un contexte de requête, non pour reconstituer naïvement une hiérarchie de ressources ou fabriquer des URLs localisées.

`request.design_mode` vaut vrai dans l’éditeur de thème. Il peut empêcher par exemple l’envoi de données de session par un script de suivi pendant l’édition. Il ne doit pas changer la fonctionnalité destinée au client : l’aperçu doit refléter la boutique live. `request.visual_preview_mode` identifie le preview visuel de section et peut aider à désactiver un script qui empêche cet affichage. Ce sont des garde-fous d’environnement, pas des branches de produit. [2]

```liquid
<!-- snippets/analytics-guard.liquid -->
{% unless request.design_mode %}
  <!-- Load the merchant-approved analytics integration here. -->
{% endunless %}
```

Le piège est de masquer un prix, un bouton ou une validation uniquement dans l’éditeur. Le marchand ne peut plus contrôler une expérience fidèle, et le bug arrive au client sans avoir été vu. Gardez les différences limitées à l’observation, aux scripts perturbateurs et aux outils qui n’appartiennent pas au storefront.

> [VERIFY] Vérifiez les valeurs actuellement documentées de `request.page_type` si vous écrivez une branche exhaustive. Elles forment un ensemble fermé qui peut évoluer avec la plateforme.

## 26.3 `routes` — never hardcode a URL again

`routes` génère les URLs standard du storefront : racine, panier, recherche, collections, comptes, login, endpoints de panier Ajax, recherche prédictive et recommandations. Les liens doivent consommer par exemple `routes.root_url`, `routes.cart_url`, `routes.search_url`, `routes.collections_url`, `routes.account_url` ou `routes.storefront_login_url`, selon la destination. Shopify précise que cet objet protège la prise en charge des langues multiples et les changements possibles de format d’URL. [3]

```liquid
<!-- snippets/site-utilities.liquid -->
<nav aria-label="Utilities">
  <a href="{{ routes.search_url }}">Search</a>
  <a href="{{ routes.cart_url }}">Cart</a>
  {% if shop.customer_accounts_enabled %}
    <a href="{{ routes.account_url }}">Account</a>
  {% endif %}
</nav>
```

Le mauvais code suppose une structure de chemin anglophone et une architecture de comptes qui peut rediriger :

```liquid
<!-- Incorrect: assumes storefront paths and ignores localization. -->
<a href="/cart">Cart</a>
<a href="/account/login">Sign in</a>
```

Les URLs de compte peuvent rediriger vers Customer Accounts lorsque ce système est activé. Un lien généré par `routes` respecte ce contrat, alors qu’un chemin littéral contraint le thème à une implémentation devenue fausse. Les endpoints `cart_add_url`, `cart_change_url`, `cart_update_url` et `cart_clear_url` sont aussi des propriétés de routes, ce qui évite de coudre un endpoint Ajax à la locale de la boutique. [3]

## 26.4 `settings`, `template`, `canonical_url`, `handle`, `current_page`, `current_tags`

`settings` est l’interface des réglages globaux de `settings_schema.json`. Les valeurs sont détenues par le marchand, stockées dans l’état de configuration et consommées par le thème. Ne donnez pas à `settings` le rôle d’une ressource de page : un titre de campagne propre à une section, une collection ou un article appartient souvent à une surface plus locale. Le chapitre `ch-22-settings-architecture` détaille cet ownership.

`template` informe sur le template actuellement rendu; ses propriétés permettent de distinguer nom et suffixe sans parser une chaîne d’URL. `canonical_url` est l’URL canonique calculée pour la page et sert au SEO; ne le fabriquez pas à partir de `request.path`. `handle` est disponible dans les contextes qui l’exposent et identifie une ressource ou une taxonomie, mais un handle n’est pas un lien. Générez la destination avec l’objet de ressource ou `routes`, puis utilisez un handle seulement pour une décision de présentation justifiée.

`current_page` décrit la page de pagination en cours; il doit être consommé avec le contrat de pagination plutôt que supposé comme un entier global. `current_tags` décrit les tags actuellement actifs dans les pages qui ont cette taxonomie. Il convient à l’état de filtre ou au libellé d’une vue de blog/collection, pas à un système de navigation général. Une page sans tags actifs doit rester correcte sans rendre une liste vide ou une virgule orpheline.

> [VERIFY] Vérifiez les contextes d’exposition de `template`, `handle`, `current_page` et `current_tags` avant d’en faire une dépendance de layout; ce ne sont pas des objets universels de la même façon que `shop` ou `routes`.

## 26.5 `localization`, `country`, `language`, `market`

`localization` donne les pays et langues disponibles, ainsi que le pays, la langue et le market sélectionnés pour le storefront. Il est conçu pour être utilisé dans un formulaire de localisation. Les valeurs ne sont pas des préférences décoratives : elles affectent le contexte de commerce dans lequel les prix, domaines, URL et contenu sont interprétés. [4]

```liquid
<!-- snippets/localization-summary.liquid -->
{% form 'localization' %}
  <label for="locale">Language</label>
  <select id="locale" name="locale_code">
    {% for language in localization.available_languages %}
      <option value="{{ language.iso_code }}" {% if language.iso_code == localization.language.iso_code %}selected{% endif %}>
        {{ language.endonym_name }}
      </option>
    {% endfor %}
  </select>
  <button type="submit">Update preferences</button>
{% endform %}
```

N’écrivez pas une liste de codes de pays codée en dur ou une URL de locale manuelle. Le formulaire et l’objet de localisation relient le choix à ce que le magasin a effectivement rendu disponible. `localization.country`, `localization.language` et `localization.market` décrivent la sélection présente; `available_countries` et `available_languages` décrivent les options. Un country, une language et un market sont des objets avec leurs propres contrats, à approfondir lorsqu’une interface de sélection complète est nécessaire.

## 26.6 `linklists` and the `link` object — navigation trees

`linklists` permet de récupérer une navigation définie dans l’administration par son handle, tandis qu’un objet `link` représente une entrée : titre, URL, type, objet cible éventuel, état actif et enfants. Une navigation n’est pas une série d’ancres codées dans le thème; c’est une donnée marchand hiérarchique qui doit garder ses liens, son ordre et sa profondeur.

```liquid
<!-- snippets/footer-menu.liquid -->
{% assign footer_menu = linklists['footer'] %}
{% if footer_menu != blank %}
  <nav aria-label="Footer">
    <ul>
      {% for link in footer_menu.links %}
        <li>
          <a href="{{ link.url }}" {% if link.current %}aria-current="page"{% endif %}>{{ link.title | escape }}</a>
        {% if link.links != blank %}
          <ul>
            {% for child_link in link.links %}
              <li><a href="{{ child_link.url }}">{{ child_link.title | escape }}</a></li>
            {% endfor %}
          </ul>
        {% endif %}
      {% endfor %}
    </ul>
  </nav>
{% endif %}
```

La condition `link.current` appartient à la navigation rendue par Shopify; ne comparez pas manuellement des chaînes de chemins pour déduire l’élément actif. Traitez les enfants comme un arbre potentiellement absent, et ne présumez pas qu’un lien a toujours un objet ressource ou que le menu existe. Les patterns récursifs et les contrats de snippet associés sont développés dans `ch-21-snippets`; ici, le point est l’ownership : l’administration possède la structure, le thème lui donne un rendu sémantique et accessible.

## Gotchas

- Vous utilisez une propriété `shop` dépréciée alors que la donnée est contextuelle à la requête ou au panier.
- Vous changez l’expérience client avec `request.design_mode` au lieu de seulement protéger les outils d’édition.
- Vous codez `/cart`, `/account` ou une URL de locale en dur au lieu d’employer `routes` et le formulaire de localisation.
- Vous utilisez `canonical_url` comme un constructeur de navigation ou un handle comme une URL.
- Vous affichez tous les liens de menu sans gérer l’absence de menu, d’enfant ou d’état actif.
- Vous confondez les options disponibles de localisation avec la sélection actuelle du visiteur.

## Checklist

- [ ] Les informations de magasin sont rendues seulement lorsqu’elles ont un owner et un état de présence clairs.
- [ ] Les décisions de requête restent contextuelles et ne falsifient pas le storefront dans l’éditeur.
- [ ] Les liens internes et endpoints Shopify proviennent de `routes`.
- [ ] Les valeurs globales, contextuelles et taxonomiques sont attribuées à l’objet approprié.
- [ ] La localisation utilise ses objets et son formulaire; la navigation utilise un arbre marchand et des URLs de link.

## Related

- `ch-21-snippets` — arbre de navigation, recursion et API de rendu.
- `ch-22-settings-architecture` — state global détenu par le marchand.
- `ch-27-product-objects` — ressources produit et handles contextuels.
- `ch-35-metaobjects` — contenu structuré et objet global `metaobjects`.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/shop "Shopify — Liquid object: shop"
[2]: https://shopify.dev/docs/api/liquid/objects/request "Shopify — Liquid object: request"
[3]: https://shopify.dev/docs/api/liquid/objects/routes "Shopify — Liquid object: routes"
[4]: https://shopify.dev/docs/api/liquid/objects/localization "Shopify — Liquid object: localization"

## Context audit before adding a global read

Avant d’ajouter un objet global à un layout ou à un snippet, notez la question métier, le propriétaire de la donnée, le contexte minimal et l’état absent. « Quel est le chemin courant ? » appartient à `request`; « quelle destination cart est valide pour ce storefront ? » appartient à `routes`; « quelle langue est sélectionnée ? » appartient à `localization` ou à la locale de requête; « quel élément de menu doit être actif ? » appartient au `link` rendu. Cette courte discipline évite les raccourcis qui semblent fonctionner sur une boutique monolingue et échouent au premier changement de marché.

Testez aussi les contextes opposés : page de ressource et page 404, magasin avec et sans comptes, politique présente et absente, menu avec et sans sous-liens, locale et pays alternatifs, aperçu d’éditeur et storefront public. Les objets globaux ne garantissent pas que toutes leurs propriétés aient une valeur utile dans chaque scénario. Le rendu robuste ne substitue pas une donnée inventée à une valeur absente; il conserve une structure accessible et ne montre une information que lorsqu’elle représente une décision administrée réelle.
