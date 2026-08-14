<!-- STATUS: final -->
<!-- DO NOT OPEN until you have attempted the exercise. -->
# Chapter 3 — Solution

## The approach

The probe is not a data browser. Its only job is to make the render context inspectable on three template types. That constraint determines the shape: one section can be added on product, collection, and cart templates; global rows identify the request and current cart state; template-specific rows state whether product or collection exists; and one section setting demonstrates a local scoped value.

The important design choice is to render absence as information. A product row that says “Unavailable in this render” on a cart page is more useful than silently disappearing. It proves that `product` is not a global object and prevents a developer from interpreting a blank output as a failed query. The panel is deliberately server-rendered. If browser code populated it later, it would stop teaching which values Shopify supplied to Liquid for this request.

The section also keeps the merchant-facing settings separate from the diagnostic data. `section.settings.heading` and `section.settings.audit_label` belong to this section instance. `request.page_type` and `cart` are global roots: one describes the request and one describes current cart state. `product` and `collection` are template-scoped roots. Giving each of those sources a visible label turns the object graph into a reviewable contract rather than a list of convenient variable names.

## Walkthrough

### 1. One merchant-addable panel for three template types

The schema’s `enabled_on` entry admits the section on product, collection, and cart templates. It does not create three copies of the feature. A developer can add the same section through the theme editor on each page type and compare the results under different render contexts. The preset provides the normal editor entry point, while the template restriction prevents the diagnostic panel from being added to unrelated contexts where its comparison would be less useful.

The implementation does not need a separate template file or a route-specific script. Template placement is Shopify’s responsibility; the section reacts only to the objects Shopify makes available once that placement has been chosen.

### 2. Identify a global request value

`request.page_type` is rendered first because it gives every output a context label. It is a global object property: it describes this storefront request rather than the current product or the current section. The probe does not infer the page type from a title or CSS class, and it does not use the result to fetch anything. It only outputs the supplied value so a reviewer can say, “this is a cart render” before interpreting the other rows.

That order is worth preserving in a real debugging panel. If a template-scoped object is blank, the page type tells you whether the expectation was reasonable. Starting with an expected product title and discovering later that the section sits on a collection page reverses the diagnostic process.

### 3. Render template-scoped identities honestly

The product and collection rows test their respective roots before reading their titles. When the object exists, the probe outputs a meaningful identity; when it does not, it outputs an explicit unavailable state. This is not defensive decoration. It distinguishes “Shopify did not supply this object in this render” from “the object exists but its title is empty.”

The cart row has a different classification: `cart` is global cart state, not a template-scoped resource. It can therefore report the current item count on each supported template, while the request context still tells the reviewer which page is being inspected. The result is intentionally small. The exercise does not require a line-item dump, product lookup, or a catalogue query, and adding one would make the example look like Liquid owns an arbitrary data API.

### 4. Make the local scope visible

The audit label is stored in section settings and rendered in its own row. It has a different owner from the request value and resource objects: a merchant edits it on this section instance in the theme editor. It is neither a shop-global setting nor a property of `product`, `collection`, or `cart`.

Showing it twice is deliberate. The top occurrence lets the panel have a merchant-controlled description. The final row classifies that same value as a scoped object. This makes the difference between “available here” and “available everywhere” visible without inventing another data source.

### 5. Keep the first response self-contained

Everything in the panel is Liquid, HTML, and section schema. There is no client framework, request, app proxy, or delayed hydration step. Viewing page source shows the current page type, each available identity, and each unavailable state. Disabling JavaScript changes nothing because JavaScript has no role in discovering the object graph.

This does not mean browser code is forbidden in a theme. It means browser code would be the wrong owner for this diagnostic. The question is what Shopify handed to the server-side render. A later browser request can answer a different question, but it cannot retroactively prove what Liquid knew when the original HTML was built.

### 6. Preserve safe text output

Every merchant-controlled string and resource title passes through `escape`. The context probe should never make a product title containing `<`, `&`, or quotes look like markup. The item count is numeric output, while the values that might contain merchant text are escaped at the point they enter HTML.

### 7. Read the access-class explanation as a contract

The final paragraph summarizes the three classes used by this implementation. It is not a substitute for the Liquid reference; it tells a reviewer which root to inspect when a row behaves unexpectedly. Global values describe the request or current cart state, template-scoped values arrive only with the matching template, and scoped values belong to the local section instance. That sentence is the design rule behind the markup above it.

## Full code

### `sections/context-probe.liquid`

```liquid
<section class="context-probe" aria-labelledby="ContextProbe-{{ section.id }}">
  <h2 id="ContextProbe-{{ section.id }}">{{ section.settings.heading | escape }}</h2>
  <p>{{ section.settings.audit_label | escape }}</p>

  <dl>
    <div>
      <dt>Global object — request context</dt>
      <dd>{{ request.page_type | escape }}</dd>
    </div>

    <div>
      <dt>Template-scoped object — product</dt>
      <dd>
        {% if product != blank %}
          Available: {{ product.title | escape }}
        {% else %}
          Unavailable in this render
        {% endif %}
      </dd>
    </div>

    <div>
      <dt>Template-scoped object — collection</dt>
      <dd>
        {% if collection != blank %}
          Available: {{ collection.title | escape }}
        {% else %}
          Unavailable in this render
        {% endif %}
      </dd>
    </div>

    <div>
      <dt>Global object — cart state</dt>
      <dd>Available: {{ cart.item_count }} item{% if cart.item_count != 1 %}s{% endif %}</dd>
    </div>

    <div>
      <dt>Scoped object — section setting</dt>
      <dd>{{ section.settings.audit_label | escape }}</dd>
    </div>
  </dl>

  <p>Global values describe the request or current cart state. Template-scoped values exist only when this template supplies them. Scoped values belong to this section instance.</p>
</section>

{% schema %}
{
  "name": "Context probe",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Render context probe"
    },
    {
      "type": "text",
      "id": "audit_label",
      "label": "Audit label",
      "default": "Development theme diagnostic"
    }
  ],
  "presets": [
    {
      "name": "Context probe"
    }
  ],
  "enabled_on": {
    "templates": ["product", "collection", "cart"]
  }
}
{% endschema %}
```

## What people get wrong here

- **Treating an unavailable product as an empty product.** A fallback such as “Unknown product” hides the critical fact that the current template did not supply `product`. The probe must preserve that absence as diagnostic evidence.
- **Using a global-looking snippet dependency.** A reusable file that silently assumes `product` exists can work on one template and fail elsewhere. This section keeps the context inspection at the template boundary, where its roots are visible.
- **Dumping large objects to discover properties.** Broad dumps make the storefront noisy, can traverse far more data than the panel displays, and encourage guessing from incidental output. Start from documented roots and inspect the specific relationship you need.
- **Calling a browser endpoint to populate the rows.** That changes the task from “what did Liquid receive?” to “what can the browser request later?” It produces a different answer and weakens the exercise.
- **Calling section settings global configuration.** The audit label belongs to this section instance. Moving it to an unrelated root would make the access-class labels dishonest.

## Stretch: direction only

If a requirement names a value absent from every supported template context, record the template type, the expected root object, the relationship you checked, and the exact product behavior the value must support. Then consult the documented object graph and the runtime boundary before selecting another Shopify surface. The correct next step may be a merchant configuration decision, browser interaction, app capability, or a headless architecture; it is not an automatic reason to bolt an arbitrary request onto this section.
