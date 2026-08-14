<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 27 — Solution

## The approach

La solution définit `current_variant` une fois avec `product.selected_or_first_available_variant`, puis fait dériver toutes les valeurs transactionnelles de cette référence : ID de formulaire, prix, compare-at, disponibilité, règles de quantité, média de variant et allocations de plan. Ce fallback ne remplace pas une sélection explicite : une variante deep-linked continue d’être renvoyée même si elle est indisponible, afin que la fiche révèle l’état demandé au lieu de modifier le produit choisi par le client.

Le produit reste la source de l’identité, du contenu, des options, de la galerie et des métadonnées. Le snippet média reçoit la variante courante et le produit; il essaie le media du variant puis le featured media. Il traite les types de média par case plutôt que de supposer une image. Les plans de vente, le metafield de matière et les données de merchandising sont tous gardés derrière des conditions de présence et de contrat.

> [VERIFY] Vérifiez la forme actuelle de `product_option_value`, la disponibilité des swatches, les filtres media applicables, les propriétés d’allocation de selling plan et le type du metafield cible dans votre boutique. Les éléments de cette solution sont des contrats Liquid à tester contre les données administrées réelles.

## Walkthrough

### 1. Variante courante et lien profond

`selected_or_first_available_variant` est l’initialisation correcte lorsque la page doit afficher une variante. Si l’URL contient une variante, elle est conservée, même si elle est vendue; sinon le premier variant disponible est choisi, puis le premier variant si aucun n’est disponible. Cette logique rend la valeur de formulaire, le bouton et le prix cohérents dès le rendu serveur.

### 2. Options ordonnées, non supposées

La boucle emploie `product.options_with_values`. Chaque option et valeur conserve l’ordre Shopify; l’input porte l’ID de valeur, un libellé visible et son état sélectionné. Le code ne cherche pas une option par index fixe, ne lit pas `variant.option1` déprécié et n’invente pas une couleur depuis une chaîne. Un vrai picker de swatches peut enrichir ce markup lorsqu’une représentation administrée existe, avec le même fallback textuel.

### 3. Prix et promotion de la variante

Le prix principal est `current_variant.price`. Le compare-at ne s’affiche que lorsqu’il est supérieur, ce qui rend la promotion spécifique au variant. `product.price_min`, `price_max` et `price_varies` seraient réservés à une carte ou à une annonce « à partir de », pas substitués au montant de la sélection active.

### 4. Achat et quantité

Le bouton suit `current_variant.available`. L’input commence à `quantity_rule.min`, fixe `max` seulement s’il existe, et utilise l’incrément du contrat. Les breaks sont montrés seulement lorsqu’ils sont configurés dans le contexte client. Cette réponse n’annonce aucune quantité de stock brute : disponibilité, policy et règles sont plus importantes que le nombre technique à lui seul.

### 5. Média, plans et données structurées

Le snippet choisit le média de variant ou le featured media, puis rend image, vidéo, media externe et model au moyen de leurs filtres. La liste de plans est liée à la variante et conserve l’allocation avec son prix résultant. Enfin, le metafield `custom.material_notes` est rendu uniquement s’il existe; dans un thème réel, vérifiez que son type et son output correspondent au contenu administré.

### 6. Scénarios de test

Ouvrez une URL avec `?variant=` sur une variante disponible puis indisponible. Vérifiez que les deux états montrent le bon prix, média et bouton. Retirez le média du variant, puis les selling plans. Testez un produit avec et sans metafield. Les changements client futurs doivent synchroniser exactement les mêmes surfaces à partir d’une sélection de variant mise à jour; le DOM ne doit pas inventer un second état commercial.

## Full code

### `sections/main-product.liquid`

```liquid
{{ 'main-product.css' | asset_url | stylesheet_tag }}
{% assign current_variant = product.selected_or_first_available_variant %}

<section class="main-product" data-product-id="{{ product.id }}">
  <div class="page-width">
    {% if product.vendor != blank %}<p>{{ product.vendor | escape }}</p>{% endif %}
    <h1>{{ product.title | escape }}</h1>
    {% render 'product-media', product: product, current_variant: current_variant %}

    {% if current_variant %}
      <p class="main-product__price">
        <span>{{ current_variant.price | money }}</span>
        {% if current_variant.compare_at_price > current_variant.price %}<s>{{ current_variant.compare_at_price | money }}</s>{% endif %}
      </p>

      <form method="post" action="{{ routes.cart_add_url }}">
        {% for option in product.options_with_values %}
          <fieldset><legend>{{ option.name | escape }}</legend>
            {% for value in option.values %}
              <label><input type="radio" name="option-{{ option.position }}" value="{{ value.id }}" {% if value.selected %}checked{% endif %}><span>{{ value.name | escape }}</span></label>
            {% endfor %}
          </fieldset>
        {% endfor %}

        <input type="hidden" name="id" value="{{ current_variant.id }}">
        <label for="Quantity-{{ section.id }}">Quantity</label>
        <input id="Quantity-{{ section.id }}" type="number" name="quantity" value="{{ current_variant.quantity_rule.min }}" min="{{ current_variant.quantity_rule.min }}" step="{{ current_variant.quantity_rule.increment }}" {% if current_variant.quantity_rule.max != nil %}max="{{ current_variant.quantity_rule.max }}"{% endif %}>

        {% if current_variant.quantity_price_breaks_configured? %}
          <ul>{% for price_break in current_variant.quantity_price_breaks %}<li>{{ price_break.minimum_quantity }}+: {{ price_break.price | money }}</li>{% endfor %}</ul>
        {% endif %}

        {% if current_variant.selling_plan_allocations != blank %}
          <fieldset><legend>Purchase option</legend>
            <label><input type="radio" name="selling_plan" value="" checked>One-time purchase</label>
            {% for allocation in current_variant.selling_plan_allocations %}
              <label><input type="radio" name="selling_plan" value="{{ allocation.selling_plan.id }}" {% if allocation.selling_plan.selected %}checked{% endif %}>{{ allocation.selling_plan.name | escape }} — {{ allocation.price | money }}</label>
            {% endfor %}
          </fieldset>
        {% endif %}

        <button type="submit" {% unless current_variant.available %}disabled{% endunless %}>{% if current_variant.available %}Add to cart{% else %}Sold out{% endif %}</button>
      </form>
    {% endif %}

    {% if product.metafields.custom.material_notes != blank %}<div class="rte">{{ product.metafields.custom.material_notes | metafield_tag }}</div>{% endif %}
    {% if product.type != blank %}<p>Type: {{ product.type | escape }}</p>{% endif %}
    {% if product.template_suffix != blank %}<p class="visually-hidden">Product template: {{ product.template_suffix | escape }}</p>{% endif %}
  </div>
</section>

{% schema %}
{ "name": "Main product", "settings": [] }
{% endschema %}
```

### `snippets/product-media.liquid`

```liquid
{% assign primary_media = current_variant.featured_media | default: product.featured_media %}
{% if primary_media %}
  <div class="main-product__media" data-media-id="{{ primary_media.id }}">
    {% case primary_media.media_type %}
      {% when 'image' %}{{ primary_media | image_url: width: 1600 | image_tag: alt: product.title }}
      {% when 'video' %}{{ primary_media | video_tag: controls: true }}
      {% when 'external_video' %}{{ primary_media | external_video_tag }}
      {% when 'model' %}{{ primary_media | model_viewer_tag }}
      {% else %}{{ primary_media | media_tag }}
    {% endcase %}
  </div>
{% endif %}

{% if product.media.size > 1 %}
  <ul>{% for media in product.media %}<li>{{ media.media_type | escape }}</li>{% endfor %}</ul>
{% endif %}
```

### `assets/main-product.css`

```css
.main-product { padding-block: 3rem; }
.main-product .page-width { display: grid; gap: 1rem; }
.main-product__price { display: flex; gap: 0.5rem; font-size: 1.5rem; font-weight: 700; }
.main-product form { display: grid; gap: 0.75rem; max-width: 28rem; }
.main-product fieldset { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.main-product__media img, .main-product__media video, .main-product__media model-viewer { display: block; max-width: 100%; }
```

The three files are mirrored under `solution/` at the starter paths.

## What people get wrong here

- They use `product.price` as the active price. It is a range minimum, not the selected variant price.
- They default away from a deep-linked sold-out variant. This makes a campaign link describe a different configuration from the URL.
- They show `inventory_quantity` as a promised stock count. Availability also depends on inventory policy, management and customer context.
- They render subscription text without the allocation’s result. A plan name and price adjustment intent are not the final purchasable price alone.

## Stretch: direction only

Define one serialized source of variant data that a client controller can consume after an option change. The controller should resolve a single variant, update URL, price, media, availability, quantity rule and plan allocations from that variant, then render the server-derived contract into the UI. Preserve the server-rendered initial state as the baseline and define how an invalid option combination is represented rather than guessing a fallback variant.

### Contrat de synchronisation à conserver

Quand l’interface cliente sera ajoutée, chaque changement d’option doit résoudre une seule variante réelle avant toute mise à jour visuelle. Cette variante devient l’unique entrée pour l’ID de formulaire, le prix, l’ancien prix, le média, le bouton, la quantité et les plans. Si aucune combinaison ne correspond, l’interface doit rendre un état explicite non achetable au lieu de réutiliser les données de la dernière variante valide. Garder ce contrat unique évite les erreurs les plus coûteuses de fiche produit : un prix affiché pour une option et un variant différent ajouté au panier.
