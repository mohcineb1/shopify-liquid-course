window.themeEvents = new EventTarget(); window.themeEvents.emit = (name, detail = {}) => { window.themeEvents.dispatchEvent(new CustomEvent(name, { detail })); };
