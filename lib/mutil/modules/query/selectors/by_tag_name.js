/**
 * Selector that returns elements by tag name using native
 * getElementsByTagName.
 */
Selector.create({
    name:       'by tag name',
    identifier: /^\w+$/,
    fn:         function(selector, root) {
                    return root.getElementsByTagName(selector);
                }
});