Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.core) {
    /**
     * Core module for Mutil adds the shorthand $ function to query the DOM
     * or adding onLoad events.
     * 
     * @todo test interface
     * @param <Mutil.App> app is the app object to attach to.
     */
    Mutil.modules.core = function(app) {
        
        /**
         * Shorthand function for quering the DOM or adding an onLoad event
         * handler.
         * 
         * When passing in a function as argument, that will be attached
         * as an event handler to window.onload. Otherwise, the first two
         * arguments will be passed into a new Mutil.Query object.
         * 
         * @param <Function, String> subject is either an event handler
         *   callback or a selector string.
         * @param <String, Node, Mutil.Collection> root (optional) is the root
         *   element or collection to query against (defaults to document).
         * @return <undefined, Mutil.Collection> either nothing when passed
         *   a function, or a new Mutil.Collection object.
         */
        app.$ = function() {
            var args    = Array.prototype.slice.call(arguments),
                subject = args.shift(),
                root    = args[0];
            if(subject.isFunction()) {
                app.addLoadEvent(subject);
            } else {
                return new Mutil.Query(subject, root);
            };
        };
        
        /**
         * Attach a functon to the document's onLoad-event. This gracefully handles
         * multiple functions on the event.
         * 
         * @example
         * Mutil.addLoadEvent(function() {
         *   console.log('Page has loaded.');
         * });
         * 
         * @author Simon Willison
         * @see http://simonwillison.net/2004/May/26/addLoadEvent/
         * @param <Function> fn is the callback to call when the event fires.
         */
        app.addLoadEvent = function(fn) {
            var oldonload = window.onload;
            if (typeof window.onload !== 'function') {
                window.onload = fn;
            } else {
                window.onload = function() {
                    oldonload();
                    fn();
                };
            }
        };
    };
}