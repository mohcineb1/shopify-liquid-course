class QuickAddCard extends HTMLElement {
  connectedCallback() {
    // TODO: establish a component-owned cleanup boundary.
    // TODO: read data-show-confirmation as a deliberate boolean.
    // TODO: enhance this element's form without breaking ordinary submission.
  }

  refreshFromMarkup() {
    // TODO: reconcile only safe local presentation state.
  }
}

if (!customElements.get('quick-add-card')) {
  customElements.define('quick-add-card', QuickAddCard);
}

// TODO: listen for shopify:section:load and limit work to event.target.
