Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.query) {
    /**
     * Add CSS-like DOM querying to your application.
     * 
     * The query module extends an application with capabilities to query
     * the DOM with a CSS-like syntax. It extends the shorthand function
     * $ to accept a selector string and return a new collection of DOM nodes.
     * 
     * The Query modules comes with a couple of default, commonly used
     * selectors, but you can extend its capabilities with other modules.
     * 
     * These are available by default:
     * 
     * * by tag name: 'p'
     * * by ID: '#foo'
     * * by child: 'div p'
     * * by class name: 'p.foo'
     * * multiple selectors: 'div, p'
     * 
     * The result of every query against the DOM is a Collection object,
     * which is an array-like object that holds all selected nodes. It has a
     * few helper functions, and can be extended by other modules.
     * 
     * @example Select some elements on the page
     * var result = new Query('#page a');
     * console.log(result) # => [...]
     * 
     * @example using the shorthand dollar function
     * var result = $('#page a');
     * 
     * @example Selecting child elements of an existing collection
     * var result = $('#page').query('a')
     * 
     */
    Mutil.modules.query = function(app) {

        // require 'query/query'
        // require 'query/collection'
        // require 'query/selector'
        // require 'query/selectors'

        // Attach our objects to the application.
        app.Query = Query;
        app.Collection = Collection;
        app.Selector = Selector;
        
        // Decorate dollar function from core with the query function,
        // adding features for when passed a string.
        app.$ = (function() {
            var uber = app.$;
            return function(selector, root) {
                if(selector && selector.isString()) {
                    return new Query(selector, root);
                } else {
                    uber.apply(this, arguments);
                }
            };
        })();
    };
}