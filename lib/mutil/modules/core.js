Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.core) {
    /**
     * Core module for Mutil adds the shorthand $ function to add listeners
     * to the window onload event.
     * 
     * @todo test interface
     * @param <Mutil.App> app is the app object to attach to.
     */
    Mutil.modules.core = function(app) {
        
        /**
         * Shorthand function for adding an onLoad event
         * handler.
         *          * 
         * @param <Function> callback function to fire when the document has
         *   loaded.
         */
        app.$ = function(subject) {
            if(subject.isFunction()) {
                app.addLoadEvent(subject);
            }
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