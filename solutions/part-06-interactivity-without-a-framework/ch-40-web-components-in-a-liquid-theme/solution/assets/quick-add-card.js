class QuickAddCard extends HTMLElement {
  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.form = this.querySelector('form');
    this.confirmation = this.querySelector('[data-confirmation]');
    this.showConfirmation = this.dataset.showConfirmation === 'true';
    this.form?.addEventListener('submit', (event) => this.handleSubmit(event), { signal: this.controller.signal });
  }
  disconnectedCallback() { this.controller?.abort(); }
  handleSubmit(event) {
    if (!this.showConfirmation || !this.confirmation) return;
    event.preventDefault();
    this.confirmation.hidden = false;
  }
  refreshFromMarkup() { this.confirmation?.setAttribute('hidden', ''); }
}
if (!customElements.get('quick-add-card')) customElements.define('quick-add-card', QuickAddCard);
document.addEventListener('shopify:section:load', (event) => {
  event.target.querySelectorAll('quick-add-card').forEach((card) => card.refreshFromMarkup());
});
