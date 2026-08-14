const picker = document.querySelector('[data-option-picker]');
const variants = window.productVariants || [];
picker?.addEventListener('change', () => {
  const labels = [...picker.querySelectorAll('input:checked')].map((input) => input.value);
  const match = variants.find((variant) => variant.title === labels.join(' / '));
  document.querySelector('[data-variant-id]').value = match?.id || '';
});
