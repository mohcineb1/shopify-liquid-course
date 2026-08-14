<!-- STATUS: final -->
---
id: ch-27
title: "Products"
part: 4
---

# Chapter 27 — Products

Un produit Liquid n’est pas une fiche plate. C’est une ressource à variantes, avec un résumé de gamme, une sélection issue de l’URL ou du contexte, des prix dans la devise de présentation, des règles de disponibilité, des médias ordonnés, des options d’achat et des données structurées. Les bugs de fiche produit viennent presque toujours d’une confusion de niveau : afficher `product.price` comme si c’était le prix de la variante choisie, traiter une quantité comme une promesse de stock, ou maintenir le prix alors que la variante et le média ont changé. Construisez la fiche autour d’une variante courante et rendez chaque état dont le marchand ou Shopify est propriétaire.

## What you’ll be able to do

- Séparer les données de résumé du produit et les données de la variante sélectionnée.
- Rendre des options et swatches sans supposer leur ordre, leur nombre ou leur valeur textuelle.
- Préserver les liens profonds de variante et synchroniser prix, média et disponibilité.
- Gérer les prix, stock, règles de quantité, médias et selling plans avec des gardes explicites.
- Attribuer type, tags, vendor, collections, template suffix et metafields au bon rôle de rendu.

## 27.1 The `product` object in full

`product` représente la ressource commerciale : `id`, `handle`, `title`, `description`/`content`, `url`, `vendor`, `type`, `category`, `tags`, `collections`, `template_suffix`, `metafields`, `variants`, `variants_count`, options, médias, prix de gamme, disponibilité de gamme et selling plans. C’est le bon objet pour un titre, une description, une galerie de produit, une liste d’options ou une décision de template. Il n’est pas automatiquement la source exacte du prix ou de la disponibilité qu’un client est en train d’acheter. [1]

Les propriétés de gamme comprennent `price`/`price_min`, `price_max`, `price_varies`, `compare_at_price`, `compare_at_price_min`, `compare_at_price_max`, `compare_at_price_varies`, `available`, `first_available_variant`, `featured_image`, `featured_media`, `images`, `media`, `selling_plan_groups` et `requires_selling_plan`. Elles synthétisent plusieurs variants. Si une fiche possède des options, une interface d’achat doit ensuite choisir une variante courante et s’appuyer sur elle pour les valeurs transactionnelles.

`product.available` est vrai lorsqu’au moins une variante satisfait le contrat de disponibilité. Une variante peut être disponible parce que sa quantité est positive, sa politique d’inventaire est `continue`, son inventaire n’est pas suivi, ou qu’un profil de livraison associé offre un tarif valide. Ce booléen est utile pour un état de produit global, mais il ne remplace pas `current_variant.available` dans un bouton Ajouter au panier. [1]

Les `variants` retournent au maximum 250 variants sans pagination; ne construisez pas une expérience lourde qui suppose que tous les variants d’un catalogue immense sont toujours une petite liste inline. Les propriétés de produit sont aussi contextuelles dans recherche et collections filtrées : `featured_media`, URL et variante pertinente peuvent refléter la pertinence de recherche ou les filtres. [1]

> [VERIFY] Vérifiez le contexte du produit avant de lire une propriété à coût élevé ou à sémantique de résultat de recherche. Une carte de collection, une recherche et une fiche produit ne portent pas toujours la même sélection implicite.

## 27.2 Options and `options_with_values`, option ordering, swatches

`product.options` expose seulement les noms d’options. `product.options_with_values` fournit des objets d’option capables de décrire les valeurs, leur ordre et leur état de sélection. Une interface de variantes doit présenter chaque option séparément, car Shopify recommande cette approche pour les produits à plusieurs options et pour la compatibilité future. [3]

L’ordre des options est un contrat : un deep link par `option_values` exige une valeur par option dans le même ordre que le produit. Ne supposez pas que « Color » est la première option ni que les produits ont toujours Size et Color. Lisez la collection d’options du produit, utilisez les labels administrés et laissez la logique de sélection maintenir la combinaison de variant valable.

Un swatch est une représentation d’une valeur d’option, non une permission de déduire une couleur depuis le texte « Blue ». Certaines valeurs ont une représentation de swatch administrée, d’autres non. Préparez donc un fallback textuel accessible, un label, un état choisi et un état indisponible. Le visuel n’est jamais le seul signal : un clavier et un lecteur d’écran doivent identifier la valeur et son état.

```liquid
<!-- snippets/product-options.liquid -->
{% for option in product.options_with_values %}
  <fieldset>
    <legend>{{ option.name | escape }}</legend>
    {% for value in option.values %}
      <label>
        <input type="radio" name="{{ option.name | handleize }}" value="{{ value.id }}" {% if value.selected %}checked{% endif %}>
        <span>{{ value.name | escape }}</span>
      </label>
    {% endfor %}
  </fieldset>
{% endfor %}
```

> [VERIFY] Vérifiez les propriétés actuelles de `product_option` et `product_option_value`, notamment la forme de swatch et les signaux d’accessibilité/availability, avant d’implémenter un picker de production.

## 27.3 `selected_variant`, `selected_or_first_available_variant`, and URL variant state

`product.selected_variant` est la variante sélectionnée par le contexte. Sur une fiche produit, elle vient du paramètre URL `variant`; en recherche ou collection filtrée, elle peut être la variante la plus pertinente. Si aucune variante n’est sélectionnée, elle vaut `nil`. `product.selected_or_first_available_variant` renvoie la sélection si elle existe, même si elle est indisponible; sinon la première disponible; sinon la première variante. [1]

```liquid
<!-- sections/main-product.liquid -->
{% assign current_variant = product.selected_or_first_available_variant %}
{% if current_variant %}
  <p>{{ current_variant.price | money }}</p>
  {% if current_variant.compare_at_price > current_variant.price %}
    <s>{{ current_variant.compare_at_price | money }}</s>
  {% endif %}
{% endif %}
```

Le mauvais pattern rend `product.price` dans une fiche avec un variant sélectionné. Ce prix est le minimum de gamme et peut être différent de la sélection. Le bon pattern choisit une variante initiale, rend prix, média et disponibilité depuis cette variante, puis fait synchroniser ces mêmes surfaces lorsque l’acheteur change d’option. [1] [3]

Un lien profond de variante ne doit jamais être annulé par un fallback d’interface. Si l’URL cible une variante vendue ou indisponible, `selected_or_first_available_variant` conserve cette sélection; la fiche doit montrer son état réel, non passer silencieusement à une autre option achetable. Les deep links par `option_values` existent aussi; une combinaison demandée mais absente peut laisser `selected_variant` et `selected_or_first_available_variant` à `null`. [3]

## 27.4 Price fields: `price`, `compare_at_price`, `price_min`/`price_max`, `price_varies`

Les montants Liquid sont en sous-unités de la devise de présentation. Formatez-les avec les filtres money, ne les divisez pas manuellement et ne les comparez pas à une chaîne formatée. `product.price` est le prix minimal de la gamme et équivaut à `price_min`; `price_max` est le maximum; `price_varies` signale une gamme. Ces valeurs conviennent à une carte de produit qui annonce « à partir de », alors qu’une fiche rend généralement `current_variant.price`. [1]

`compare_at_price` de produit est également un agrégat minimal. Pour une promotion honnête sur variante, comparez `current_variant.compare_at_price` et `current_variant.price`, puis n’affichez l’ancien montant que s’il est strictement supérieur. Ne déclarez pas une remise parce qu’un autre variant a un compare-at price; l’acheteur doit voir le prix de la configuration active. [1] [2]

```liquid
<!-- snippets/product-price.liquid -->
{% if current_variant.compare_at_price > current_variant.price %}
  <span class="price price--sale">{{ current_variant.price | money }}</span>
  <s class="price price--compare">{{ current_variant.compare_at_price | money }}</s>
{% else %}
  <span class="price">{{ current_variant.price | money }}</span>
{% endif %}
```

## 27.5 Availability, inventory policy, inventory quantity, `quantity_rule`, `quantity_price_breaks`

`variant.available` répond à la possibilité d’acheter, pas à un seuil de quantité affichable. `inventory_policy` vaut `continue` ou `deny`; `inventory_management` peut être `nil`; `inventory_quantity` a une sémantique particulière lorsqu’aucun inventaire n’est suivi. Évitez de promettre « seulement 3 restants » sans comprendre les droits d’affichage, la politique de vente continue et le contexte de stock. [2]

`quantity_rule` donne les règles de quantité du variant; lorsqu’aucune règle spécifique n’existe, la valeur par défaut est minimum 1, maximum nul et incrément 1. Les quantity price breaks sont des objets de variante disponibles dans le contexte client courant; l’existence peut varier selon le client ou un catalogue B2B. Validez l’input quantité contre min, max et increment, puis rendez les breaks comme des données contextuelles, jamais comme un tableau de remises universel. [2]

L’interface d’achat doit aligner le disabled state du bouton, la validation de quantité, le message d’indisponibilité et le variant `name="id"` envoyé au panier. Le JavaScript peut améliorer le changement dynamique, mais le Liquid initial doit déjà représenter la variante courante et ses garde-fous.

## 27.6 Media: images, videos, 3D models, external video, media ordering, featured media

`product.media` contient des médias ordonnés par date d’ajout. Il peut réunir images, vidéos, modèles 3D et vidéos externes. `product.images` est une collection d’images seulement; ne l’utilisez pas si la galerie doit couvrir tous les types. `featured_media` est le premier média attaché, avec une nuance : dans recherche ou collection filtrée, Shopify peut renvoyer le média de la variante la plus pertinente. [1]

Rendez chaque type avec le filtre média approprié — image, video, external_video, model viewer — et conservez ordre, alternative textuelle et contrôles nécessaires. Une galerie ne doit pas supposer que le premier média est une image ni qu’un variant possède une image. Utilisez le média de variante lorsque la configuration choisie en offre un, avec un fallback vers featured media ou la galerie produit selon l’intention de la fiche. [3]

> [VERIFY] Vérifiez les filtres média, paramètres de player, contraintes de modèle 3D et règles de performance/chargement avant d’expédier une galerie multi-média.

## 27.7 Selling plans and subscriptions in the theme layer

Les selling plans sont des options d’achat, pas un badge marketing générique. `product.selling_plan_groups` expose les groupes disponibles; `product.requires_selling_plan` est vrai lorsque toutes les variantes exigent un plan. La sélection dépend du paramètre URL `selling_plan`; une allocation sélectionnée ou première disponible peut fournir les résultats de prix appropriés. [1]

Un `selling_plan` décrit l’intention : nom, description, options, charge checkout, livraisons récurrentes et ajustements de prix. La liste `price_adjustments` contient au maximum deux éléments et décrit l’intention du plan; les montants résultants vivent dans l’allocation. Ne calculez pas vous-même la remise depuis le nom « 10 % off ». [4]

Le thème doit proposer les plans quand ils existent, gérer les produits qui les exigent et envoyer la sélection avec le formulaire d’achat. Les détails de contrat de panier et app purchase-options appartiennent aux chapitres d’intégration; ici, le principe est de ne jamais transformer un abonnement en toggle visuel déconnecté de l’allocation et du prix courant.

## 27.8 Product metafields and structured product data

`product.metafields` contient des données structurées attachées au produit : guide de taille, matières, documents, références ou contenu éditorial. Le type de metafield décide le rendu. Un texte riche, une référence, une liste, un fichier et une valeur booléenne ne sont pas des chaînes interchangeables. Gardez une garde d’absence et rendez selon le type; `ch-35-metaobjects` approfondit les relations structurées et les références.

Le metafield est le bon propriétaire lorsque la même donnée fait partie de l’entité produit et doit être maintenue dans l’administration. Une phrase de mise en page locale est plutôt un réglage de section. Ne copiez pas une spécification dans des settings de thème pour contourner un modèle de données manquant, et n’imprimez pas une valeur brute si Shopify fournit un rendu typé requis.

## 27.9 Tags, type, vendor, collections, and template suffix

`tags`, `type`, `vendor`, `collections` et `template_suffix` sont des métadonnées et décisions d’organisation. Les tags sont renvoyés par ordre alphabétique; ne les présentez pas comme une hiérarchie de merchandising garantie. `collections` ne contient que les collections disponibles sur le canal Online Store. Le type et vendor peuvent informer une carte, une recherche ou un lien filtré, mais ne doivent pas devenir l’unique logique de template fragile. [1]

`template_suffix` indique un template personnalisé attribué au produit, sans préfixe `product.` ni extension; il vaut `nil` lorsqu’il n’y en a pas. Utilisez-le pour un diagnostic ou une variation explicitement gouvernée, pas pour créer un système parallèle de routage qui reproduit les templates. Le handle est un identifiant, tandis que `product.url` est la destination contextualisée qui peut contenir un variant pertinent ou des paramètres de recommandations. [1]

## Gotchas

- Vous affichez `product.price` alors qu’un variant sélectionné a un autre prix.
- Vous remplacez silencieusement un variant deep-linked indisponible par le premier achetable.
- Vous déduisez un swatch depuis du texte et oubliez label, état choisi et fallback.
- Vous montrez une quantité brute comme promesse de stock malgré policy, management ou contexte B2B.
- Vous itérez seulement `images` dans une galerie qui doit accepter vidéo, modèle ou media externe.
- Vous appelez une remise d’abonnement sans rendre l’allocation et les montants associés au plan.

## Checklist

- [ ] Le résumé de produit et la variante courante ont des responsabilités de rendu distinctes.
- [ ] Les options suivent leur ordre marchand et ne reposent pas sur des positions ou noms supposés.
- [ ] Prix, compare-at, média, disponibilité et quantité reflètent la variante active.
- [ ] Les plans de vente, quantity rules, breaks et métadonnées structurées restent des contrats de données, pas des libellés décoratifs.
- [ ] La galerie prend en compte tous les types de media et les liens utilisent le contexte de produit/variant pertinent.

## Related

- `ch-26-global-objects` — contexte, routes et ownership de données globales.
- `ch-28-collections` — listes, contextes de collection et filtering.
- `ch-35-metaobjects` — metafields, références et modèle de données structuré.
- `ch-37-client-side-javascript` — synchronisation client de variants et interactions.

## References

[1]: https://shopify.dev/docs/api/liquid/objects/product "Shopify — Liquid object: product"
[2]: https://shopify.dev/docs/api/liquid/objects/variant "Shopify — Liquid object: variant"
[3]: https://shopify.dev/docs/storefronts/themes/product-merchandising/variants "Shopify — Support product variants"
[4]: https://shopify.dev/docs/api/liquid/objects/selling_plan "Shopify — Liquid object: selling plan"
