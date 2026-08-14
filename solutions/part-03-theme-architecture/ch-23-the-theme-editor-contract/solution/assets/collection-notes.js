const rootSelector = '.collection-notes';
function mountCollectionNotes(root) { if (!root || root.dataset.collectionNotesMounted === 'true') return; root.dataset.collectionNotesMounted = 'true'; const onClick = (event) => { const panel = event.target.closest('.collection-notes__panel'); if (panel && root.contains(panel)) panel.classList.toggle('collection-notes__panel--expanded'); }; root.addEventListener('click', onClick); root.collectionNotesCleanup = () => { root.removeEventListener('click', onClick); root.classList.remove('collection-notes--editor-selected'); root.querySelectorAll('.collection-notes__panel--editor-selected').forEach((panel) => panel.classList.remove('collection-notes__panel--editor-selected')); delete root.collectionNotesCleanup; delete root.dataset.collectionNotesMounted; }; }
function rootFor(event) { return event.target?.matches?.(rootSelector) ? event.target : event.target?.querySelector?.(rootSelector); }
function initialMount() { document.querySelectorAll(rootSelector).forEach(mountCollectionNotes); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialMount, { once: true }); else initialMount();
document.addEventListener('shopify:section:load', (event) => mountCollectionNotes(rootFor(event)));
document.addEventListener('shopify:section:unload', (event) => rootFor(event)?.collectionNotesCleanup?.());
document.addEventListener('shopify:section:select', (event) => rootFor(event)?.classList.add('collection-notes--editor-selected'));
document.addEventListener('shopify:section:deselect', (event) => rootFor(event)?.classList.remove('collection-notes--editor-selected'));
document.addEventListener('shopify:section:reorder', (event) => rootFor(event)?.classList.remove('collection-notes--editor-selected'));
document.addEventListener('shopify:block:select', (event) => event.target?.classList?.add('collection-notes__panel--editor-selected'));
document.addEventListener('shopify:block:deselect', (event) => event.target?.classList?.remove('collection-notes__panel--editor-selected'));
