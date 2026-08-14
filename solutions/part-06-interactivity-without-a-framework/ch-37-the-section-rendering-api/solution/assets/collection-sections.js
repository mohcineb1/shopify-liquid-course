const contract = {
  sections: ['facets', 'main-collection-product-grid'], // replace with target instance IDs
  selector(id) { return `#shopify-section-${CSS.escape(id)}`; }
};
let controller;
let version = 0;

function targetUrl(form) {
  const url = new URL(form.action, window.location.origin);
  url.search = new URLSearchParams(new FormData(form)).toString();
  url.searchParams.set('sections', contract.sections.join(','));
  return url;
}

function parsedRoots(payload) {
  return contract.sections.map((id) => {
    if (payload[id] == null) throw new Error(`Section unavailable: ${id}`);
    const current = document.querySelector(contract.selector(id));
    const incoming = new DOMParser().parseFromString(payload[id], 'text/html').querySelector(contract.selector(id));
    if (!current || !incoming) throw new Error(`Section root mismatch: ${id}`);
    return { current, incoming };
  });
}

async function requestUpdate(destination, push = true) {
  controller?.abort();
  controller = new AbortController();
  const mine = ++version;
  document.documentElement.classList.add('is-loading');
  try {
    const response = await fetch(destination, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const roots = parsedRoots(JSON.parse(text));
    if (mine !== version) return;
    roots.forEach(({ current, incoming }) => current.replaceWith(incoming));
    const committed = new URL(destination); committed.searchParams.delete('sections');
    if (push) history.pushState({}, '', committed);
    document.querySelector('[data-collection-status]')?.replaceChildren(document.createTextNode('Results updated.'));
    document.querySelector('[data-results-heading]')?.focus();
    console.info('collection sections bytes', text.length);
  } catch (error) {
    if (error.name !== 'AbortError' && mine === version) {
      document.querySelector('[data-collection-status]')?.replaceChildren(document.createTextNode('Could not update results. Use Apply filters to load the page.'));
    }
  } finally {
    if (mine === version) document.documentElement.classList.remove('is-loading');
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-filter-form]');
  if (!form) return;
  event.preventDefault();
  requestUpdate(targetUrl(form));
});
window.addEventListener('popstate', () => requestUpdate(new URL(window.location.href), false));
