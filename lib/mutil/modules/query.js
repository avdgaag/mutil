Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.query) {
    Mutil.modules.query = function(app) {

        // require 'query/query'
        // require 'query/collection'
        // require 'query/selector'
        // require 'query/selectors'

        app.Query = Query;
        app.Collection = Collection;
    };
}