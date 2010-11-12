Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.query) {
    Mutil.modules.query = function(app) {

        // require 'query/query'
        // require 'query/collection'
        // require 'query/selector'
        // require 'query/selectors'

        // Attach our objects to the application.
        app.Query = Query;
        app.Collection = Collection;
        
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