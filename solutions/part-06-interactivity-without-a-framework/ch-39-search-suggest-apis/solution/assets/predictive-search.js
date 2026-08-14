class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('[role="combobox"]'); this.slot = this.querySelector('[data-predictive-slot]');
    this.timer = null; this.controller = null; this.version = 0; this.active = -1;
    this.input.addEventListener('input', () => { clearTimeout(this.timer); this.timer = setTimeout(() => this.change(), 250); });
    this.input.addEventListener('keydown', (event) => this.keys(event));
  }
  options() { return [...this.slot.querySelectorAll('[role="option"]')]; }
  close() { this.active = -1; this.input.setAttribute('aria-expanded', 'false'); this.input.removeAttribute('aria-activedescendant'); this.slot.replaceChildren(); }
  async change() {
    const term = this.input.value.trim(); if (!term) return this.close();
    this.controller?.abort(); this.controller = new AbortController(); const mine = ++this.version;
    const url = new URL(`${window.Shopify.routes.root}search/suggest`, window.location.origin);
    url.searchParams.set('q', term); url.searchParams.set('resources[type]', 'product,collection,query');
    url.searchParams.set('resources[limit]', '6'); url.searchParams.set('resources[limit_scope]', 'all');
    url.searchParams.set('section_id', this.dataset.sectionId);
    try {
      const response = await fetch(url, { signal: this.controller.signal }); if (!response.ok) throw new Error(response.status);
      const html = await response.text(); if (mine !== this.version) return;
      const incoming = new DOMParser().parseFromString(html, 'text/html').querySelector('#predictive-search-results');
      if (!incoming) throw new Error('Predictive root missing');
      this.slot.replaceChildren(incoming); this.input.setAttribute('aria-expanded', 'true');
    } catch (error) { if (error.name !== 'AbortError' && mine === this.version) this.close(); }
  }
  keys(event) {
    const options = this.options(); if (event.key === 'Escape') return this.close();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!options.length) return; event.preventDefault();
      this.active = event.key === 'ArrowDown' ? Math.min(this.active + 1, options.length - 1) : Math.max(this.active - 1, 0);
      options.forEach((node, index) => node.setAttribute('aria-selected', index === this.active ? 'true' : 'false'));
      this.input.setAttribute('aria-activedescendant', options[this.active].id);
    }
    if (event.key === 'Enter' && this.active >= 0) { event.preventDefault(); options[this.active].querySelector('a')?.click(); }
    if (event.key === 'Tab') this.close();
  }
}
customElements.define('predictive-search', PredictiveSearch);
