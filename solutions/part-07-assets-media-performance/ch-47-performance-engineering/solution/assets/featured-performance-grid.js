document.querySelectorAll('[data-performance-card]').forEach((link) => {
  link.addEventListener('click', () => { link.dataset.intent = 'product-card'; }, { once: true });
});
