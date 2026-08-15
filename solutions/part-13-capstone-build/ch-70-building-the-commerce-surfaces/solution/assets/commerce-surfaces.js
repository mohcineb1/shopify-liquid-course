export async function refreshOwnedSections(sectionIds, statusElement) {
  const ids = sectionIds.slice(0, 5);
  try {
    const query = new URLSearchParams({ sections: ids.join(',') });
    const response = await fetch(`${window.Shopify.routes.root}?${query}`);
    if (!response.ok) throw new Error('Section refresh failed');
    const rendered = await response.json();
    let updated = 0;
    for (const id of ids) {
      if (typeof rendered[id] !== 'string') continue;
      const target = document.querySelector(`[data-section-id="${CSS.escape(id)}"] [data-owned-replacement]`);
      const replacement = new DOMParser().parseFromString(rendered[id], 'text/html').querySelector('[data-owned-replacement]');
      if (!target || !replacement) continue;
      target.replaceWith(replacement); updated += 1;
    }
    if (statusElement) statusElement.textContent = updated ? 'Cart display updated.' : 'Cart display could not be refreshed.';
    return updated;
  } catch (error) {
    if (statusElement) statusElement.textContent = 'Cart display could not be refreshed. Use the cart page to review your order.';
    return 0;
  }
}
