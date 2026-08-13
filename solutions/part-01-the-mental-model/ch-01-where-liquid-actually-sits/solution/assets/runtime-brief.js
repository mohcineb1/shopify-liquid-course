(() => {
  const brief = document.querySelector('[data-runtime-brief]');

  if (!brief) return;

  const preview = brief.querySelector('[data-dispatch-preview]');
  const choices = brief.querySelectorAll('input[name^="dispatch-"]');

  const messages = {
    standard: 'Standard dispatch usually leaves our studio within two business days.',
    priority: 'Priority dispatch moves this order to the next available packing window.',
  };

  for (const choice of choices) {
    choice.addEventListener('change', () => {
      if (!choice.checked) return;
      preview.textContent = messages[choice.value];
    });
  }
})();
