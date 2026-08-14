export function enhanceSummary(controls, summary) {
  if (!summary || controls.dataset.enhanced === 'true') return;
  controls.dataset.enhanced = 'true';
  const update = () => {
    const selected = controls.querySelector('input:checked');
    if (selected) summary.textContent = `Selected configuration: ${selected.value}`;
  };
  controls.addEventListener('change', update);
  update();
}
