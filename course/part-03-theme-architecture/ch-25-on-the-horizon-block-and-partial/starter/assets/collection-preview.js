const control = document.querySelector('[data-collection-preview-sort]');
control?.addEventListener('change', () => {
  const url = new URL(window.location.href);
  url.searchParams.set('sort_by', control.value);
  window.history.pushState({}, '', url);
});
