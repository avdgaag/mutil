/**
 * Selector that returns elements by ID using native
 * getElementsById.
 */
Selector.create({
    name:       'by_id',
    identifier: /^#[a-z][a-z0-9\-_]*$/i,
    fn:         function(selector, root) {
                    return [root.getElementById(selector.replace('#', ''))];
                }
});