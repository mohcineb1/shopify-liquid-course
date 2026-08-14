<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 26 — Solution

## The approach

Le footer ne calcule aucune donnée de commerce lui-même. Il consomme `shop` pour les informations administrées du magasin, `routes` pour les destinations standard, `localization` dans son formulaire prévu, et `linklists` pour le menu dont l’administration possède l’ordre et le contenu. Les conditions protègent les politiques, menus et options absents. La structure visuelle conserve la CSS de départ; seuls les contrats de données changent.

La condition `request.design_mode` ne touche pas le markup du footer. Elle entoure uniquement un hook analytique représenté ici par un commentaire. Ainsi, l’aperçu reste fidèle à ce que voit un client. Le résumé de contexte reste volontairement éditorial et minimal : il utilise une langue sélectionnée au lieu d’afficher host, path ou données de diagnostic au public. Les propriétés de requête aident à intégrer ou déboguer, mais ne sont pas nécessairement du contenu client.

> [VERIFY] Confirmez les noms de menu, les propriétés de chaque link, les objets de locale, les réglages de comptes et les URL de routes de votre version Shopify. Un footer de production doit être testé avec les comptes clients réellement activés et les marchés réellement publiés.

## Walkthrough

### 1. Routes et données magasin

Les ancres de système partent de `routes`. Le panier, la recherche et le compte suivent alors locale, redirect de compte et format d’URL configurés par Shopify. Les liens de politiques sont parcourus depuis `shop.policies`; une absence ne crée ni URL fictive ni wrapper vide. Le nom et la description viennent du magasin, car c’est lui qui en est le propriétaire.

### 2. L’éditeur ne modifie pas l’expérience client

Le footer a la même structure dans l’éditeur et sur le storefront. Seul le bloc de suivi reste absent lorsque `request.design_mode` est vrai. Il serait incorrect de cacher le menu, le bouton compte ou le sélecteur de langue avec cette condition : le marchand doit prévisualiser l’expérience réelle.

### 3. Settings, canonical et taxonomie

Un réglage de theme peut choisir une variante de présentation du footer, mais ne doit pas dupliquer politique, menu, URL de système ni locale. `canonical_url`, `template`, `current_page` et `current_tags` ne sont pas nécessaires pour rendre ce footer; cela est intentionnel. Ajouter un objet global sans question métier mène à un contrat inutile. Une navigation active vient de `link.current`, pas d’une comparaison artisanale à `request.path`.

### 4. Localization et navigation

Le formulaire itère les langues et pays disponibles et montre les sélections actuelles. Il garde une sortie simple quand une boutique propose une seule option. Le snippet de menu lit une liste par handle, puis les enfants déjà définis par le marchand. Les liens eux-mêmes apportent leurs URLs et leur état actif; le thème n’essaie pas de reconstituer les destinations.

### 5. Vérification des états

Testez sans politique, sans menu, avec comptes désactivés, en preview et avec une sélection de marché différente. Chaque état doit laisser du HTML cohérent. Le footer ne promet pas que toutes les ressources existent; il rend seulement les décisions réellement publiées par le marchand ou Shopify.

## Full code

### `sections/site-footer.liquid`

```liquid
{{ 'site-footer.css' | asset_url | stylesheet_tag }}

<footer class="site-footer" role="contentinfo">
  <div class="page-width">
    <div class="site-footer__identity">
      <p class="site-footer__brand">{{ shop.name | escape }}</p>
      {% if shop.description != blank %}<p>{{ shop.description | escape }}</p>{% endif %}
    </div>

    <nav aria-label="Footer utilities">
      <a href="{{ routes.search_url }}">Search</a>
      <a href="{{ routes.cart_url }}">Cart</a>
      {% if shop.customer_accounts_enabled %}
        <a href="{{ routes.account_url }}">Account</a>
      {% endif %}
    </nav>

    {% render 'footer-navigation', menu_handle: section.settings.menu %}

    {% if localization.available_languages.size > 1 or localization.available_countries.size > 1 %}
      {% form 'localization' %}
        <fieldset>
          <legend>Store preferences</legend>
          {% if localization.available_languages.size > 1 %}
            <label for="FooterLanguage">Language</label>
            <select id="FooterLanguage" name="locale_code">
              {% for language in localization.available_languages %}
                <option value="{{ language.iso_code }}" {% if language.iso_code == localization.language.iso_code %}selected{% endif %}>{{ language.endonym_name }}</option>
              {% endfor %}
            </select>
          {% endif %}
          {% if localization.available_countries.size > 1 %}
            <label for="FooterCountry">Country</label>
            <select id="FooterCountry" name="country_code">
              {% for country in localization.available_countries %}
                <option value="{{ country.iso_code }}" {% if country.iso_code == localization.country.iso_code %}selected{% endif %}>{{ country.name }}</option>
              {% endfor %}
            </select>
          {% endif %}
          <button type="submit">Update preferences</button>
        </fieldset>
      {% endform %}
    {% endif %}

    {% if shop.policies != blank %}
      <nav aria-label="Policies"><ul>{% for policy in shop.policies %}<li><a href="{{ policy.url }}">{{ policy.title | escape }}</a></li>{% endfor %}</ul></nav>
    {% endif %}

    {% if shop.enabled_payment_types != blank %}
      <ul aria-label="Accepted payment types">{% for payment_type in shop.enabled_payment_types %}<li>{{ payment_type | payment_type_svg_tag }}</li>{% endfor %}</ul>
    {% endif %}

    <p class="site-footer__locale">{{ localization.language.endonym_name }} · {{ localization.country.name }}</p>
  </div>
</footer>

{% unless request.design_mode %}
  {%- comment -%} Merchant-approved analytics hook; never alter footer functionality in editor. {%- endcomment -%}
{% endunless %}

{% schema %}
{
  "name": "Site footer",
  "settings": [
    { "type": "link_list", "id": "menu", "label": "Footer menu" }
  ]
}
{% endschema %}
```

### `snippets/footer-navigation.liquid`

```liquid
{% assign footer_menu = linklists[menu_handle] %}
{% if footer_menu != blank %}
  <nav aria-label="Footer menu">
    <ul class="site-footer__menu">
      {% for link in footer_menu.links %}
        <li>
          <a href="{{ link.url }}" {% if link.current %}aria-current="page"{% endif %}>{{ link.title | escape }}</a>
          {% if link.links != blank %}
            <ul>
              {% for child_link in link.links %}
                <li><a href="{{ child_link.url }}" {% if child_link.current %}aria-current="page"{% endif %}>{{ child_link.title | escape }}</a></li>
              {% endfor %}
            </ul>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </nav>
{% endif %}
```

### `assets/site-footer.css`

```css
.site-footer { border-top: 1px solid currentColor; padding-block: 2rem; }
.site-footer .page-width { display: grid; gap: 1rem; }
.site-footer__brand, .site-footer__locale, .site-footer__identity p { margin: 0; }
.site-footer__menu { display: flex; flex-wrap: wrap; gap: 0.75rem; list-style: none; margin: 0; padding: 0; }
.site-footer ul ul { display: grid; gap: 0.5rem; margin-block-start: 0.5rem; padding-inline-start: 1rem; }
```

The three files are mirrored under `solution/` at the same paths as the starter.

## What people get wrong here

- They replace `/cart` with a local-looking path from another store. A route is an API surface, so use `routes.cart_url` rather than any path literal.
- They use `shop.locale` or `shop.enabled_locales`. Both are deprecated for the relevant contextual or published alternatives.
- They check `request.design_mode` around customer navigation. That hides defects from the merchant and produces a preview unlike the live storefront.
- They compare a link’s URL to `request.path` to mark activity. This misses localized and special links; use Shopify’s `link.current` contract.

## Stretch: direction only

Extract the child-list rendering into an explicitly recursive snippet API. Pass a finite depth counter, the links to render, and an accessible label context. Stop before unbounded recursion, preserve `link.current` at each level and test a deliberately deep merchant menu. The production decision should balance menu information architecture, keyboard usability and markup complexity rather than merely allowing as many levels as Liquid can traverse.

### Matrice de vérification de contexte

Examinez le footer avec une boutique qui possède un menu mais aucune politique, puis avec une politique publiée et un menu absent. Dans les deux cas, aucun landmark vide ne doit apparaître. Désactivez les comptes clients : l’URL de compte doit disparaître avec sa décision d’affichage, au lieu de mener vers un chemin historique. Activez ensuite un autre pays et une autre langue publiés : les options disponibles doivent venir du formulaire de localisation et les liens de système doivent toujours provenir de `routes`, jamais d’un préfixe ajouté manuellement.

Ouvrez enfin l’éditeur. Le DOM visible doit rester le même, car c’est celui que le client verra. Seul le hook de suivi est volontairement exclu dans `request.design_mode`. Cette séparation rend le test honnête : vous vérifiez simultanément les données de magasin, la requête contextualisée et la navigation administrée, sans laisser un mode de développement masquer une régression de storefront.

### Pourquoi ne pas tout exposer

`shop` contient beaucoup d’informations, mais un footer n’est pas un dump de configuration. L’adresse, les comptes de collections, les fournisseurs ou les formats monétaires ne s’affichent que lorsqu’un besoin de contenu, de conformité ou de design le justifie. La solution préfère quelques contrats fermes — politiques publiées, paiement actif, identité de marque, menu et localisation — à une surface chargée de propriétés techniques qui ne représentent pas une décision client utile.
