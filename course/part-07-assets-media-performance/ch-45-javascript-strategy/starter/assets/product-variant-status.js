export function connectVariantStatus(root) {
  root.addEventListener('change', () => {
    document.querySelector('[data-variant-status]').textContent = 'Selected';
  });
}
