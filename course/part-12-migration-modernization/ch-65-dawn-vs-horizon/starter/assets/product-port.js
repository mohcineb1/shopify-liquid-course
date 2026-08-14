const picker = document.querySelector('.product-form__input');
const price = document.querySelector('.product-price');
picker.addEventListener('change', () => { price.innerHTML = '$' + picker.value; });
new MutationObserver(() => document.querySelector('.product-form__input').focus())
  .observe(document.querySelector('[data-product-main]'), {childList: true, subtree: true});
