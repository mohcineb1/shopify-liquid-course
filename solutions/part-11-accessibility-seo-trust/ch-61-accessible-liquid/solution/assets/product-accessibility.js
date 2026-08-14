(function () {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;
  let returnFocus = null;
  function open(trigger) { returnFocus = trigger; drawer.hidden = false; drawer.querySelector('[data-drawer-title]').focus(); }
  function close() { drawer.hidden = true; if (returnFocus && document.contains(returnFocus)) returnFocus.focus(); returnFocus = null; }
  document.addEventListener('click', (event) => { const trigger = event.target.closest('[data-open-cart]'); if (trigger) open(trigger); if (event.target.closest('[data-close-cart]')) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !drawer.hidden) close(); });
}());
