window.addEventListener('message', (event) => window.dispatchEvent(new CustomEvent('anything', {detail: event.data})));
