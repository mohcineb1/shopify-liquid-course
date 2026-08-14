document.addEventListener('change', (event) => {
  if (!event.target.matches('[data-filter-form] input')) return;
  fetch('/collections/all?sections=facets,main-collection-product-grid')
    .then((response) => response.json())
    .then((sections) => { document.querySelector('[data-product-grid]').innerHTML = sections['main-collection-product-grid']; history.pushState({}, '', '/collections/all'); });
});
