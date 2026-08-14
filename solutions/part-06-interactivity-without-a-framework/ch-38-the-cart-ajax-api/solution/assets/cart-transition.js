const cartSections = ['cart-drawer', 'cart-icon-bubble']; // replace with target instance IDs
let sequence = 0;

function rootFor(id, html) {
  if (html == null) throw new Error(`Cart section unavailable: ${id}`);
  const selector = `#shopify-section-${CSS.escape(id)}`;
  const current = document.querySelector(selector);
  const incoming = new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  if (!current || !incoming) throw new Error(`Cart section root mismatch: ${id}`);
  return { current, incoming };
}

async function mutateCart(endpoint, body) {
  const mine = ++sequence;
  body.sections = cartSections;
  body.sections_url = window.location.pathname;
  const response = await fetch(`${window.Shopify.routes.root}${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok) throw payload;
  const roots = cartSections.map((id) => rootFor(id, payload.sections?.[id]));
  if (mine !== sequence) return null;
  roots.forEach(({ current, incoming }) => current.replaceWith(incoming));
  document.dispatchEvent(new CustomEvent('cart:changed', { detail: { cart: payload, reason: endpoint, version: mine } }));
  return payload;
}

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('form[action*="/cart/add"]');
  if (!form) return;
  event.preventDefault();
  const button = form.querySelector('[type="submit"]'); button.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form));
    await mutateCart('cart/add.js', { items: [{ id: data.id, quantity: Number(data.quantity || 1) }] });
  } catch (error) { announce(error.description || 'Unable to add this item.'); }
  finally { button.disabled = false; }
});

document.addEventListener('click', async (event) => {
  const line = event.target.closest('[data-line-key]');
  if (!line || !event.target.matches('[data-cart-remove]')) return;
  try { await mutateCart('cart/change.js', { id: line.dataset.lineKey, quantity: 0 }); }
  catch (error) { announce(error.description || 'Unable to update the cart.'); }
});

function announce(message) { document.querySelector('[data-cart-status]')?.replaceChildren(document.createTextNode(message)); }
