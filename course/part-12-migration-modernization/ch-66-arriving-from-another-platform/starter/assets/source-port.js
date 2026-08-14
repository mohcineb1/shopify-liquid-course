fetch('https://sfcc.example.test/ocapi/customers/me/orders', {headers: {Authorization: 'Bearer SOURCE_SECRET'}}).then(r => r.json()).then(console.log);
document.querySelector('#price').textContent = '$0.00';
