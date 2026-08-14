function connectVariantStatus(root) {
  const status = root.querySelector('[data-variant-status]');
  const configNode = root.querySelector('[data-variant-status-config]');
  if (!status || !configNode) return;
  let initial;
  try { initial = JSON.parse(configNode.textContent); } catch { return; }
  const update = (input) => {
    if (!input?.checked) return;
    status.textContent = input.value === String(initial.id) ? `Selected: ${initial.title}` : `Selected variant ${input.value}`;
  };
  root.addEventListener('change', (event) => {
    if (event.target.matches('input[name="id"]')) update(event.target);
  });
  update(root.querySelector('input[name="id"]:checked'));
}
document.querySelectorAll('[data-variant-status-root]').forEach(connectVariantStatus);
