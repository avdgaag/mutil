Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.events) {
    /**
     * Provide helper functions and a unified API interface for browser event
     * handling.
     *
     * @todo add proper documentation
     */
    Mutil.modules.events = function(app) {
        /**
         * Simple wrapper around native events that is branched at init-time
         * to provide a unified API to different browser implementations of
         * events.
         *
         * @constructor
         * @todo test the implementation details and branching.
         * @param <Event> e native browser event, if available (defaults to
         *   #window.event, which IE uses)
         * @return <Mutil.Event> wrapped event.
         */
        app.Event = function(e) {

            this.original_event = e || window.event;
            this.target         = e.target || e.srcElement;
            this.keyCode        = e.keyCode || e.which;
            this.keyChar        = String.fromCharCode(this.keyCode);
            
            /**
             * Stop event propagation.
             */
            this.stopPropagation = (function() {
                if(e.stopPropagation) {
                    return function() { e.stopPropagation(); };
                } else {
                    return function() { e.cancelBubble = true; };
                }
            })();

            /**
             * Prevent the default event behaviour.
             */
            this.preventDefault = (function() {
                if(e.preventDefault) {
                    return function() { e.preventDefault(); };
                } else {
                    return function() { e.returnValue = false; };
                }
            })();

            /**
             * Shortcut to both stop propagation and prevent default
             * action for an event.
             */
            this.halt = function() {
                this.stopPropagation();
                this.preventDefault();
            };
        };

        /**
         * Helper function for #bind that is branched at init-time for adding
         * event listeners to an object.
         *
         * It uses #addEventListener when available, falls back to IE-specific
         * #attachEvent and as a last resort uses a raw on[event] property.
         *
         * @param <Node> element is the DOM node to watch.
         * @param <String> event_name is the event to act on.
         * @param <Function> fn is the callback function to fire on trigger.
         */
        var bindEvent = (function() {
            if(document.addEventListener) {
                return function(element, event_name, fn) {
                    element.addEventListener(event_name, fn);
                };
            } else if(document.attachEvent) {
                return function(element, event_name, fn) {
                    element.attachEvent(event_name, fn);
                };
            } else {
                return function(el, name) {
                    el['on' + name] = fn;
                };
            }
        })();

        /**
         * Bind a callback function to an event on an element.
         *
         * @param <Node> element is the DOM node to watch.
         * @param <String> event_name is the event to act on.
         * @param <Function> fn is the callback function to fire on trigger.
         */
        app.bind = function(element, event_name, fn) {
            if(!element.isElement()) {
                throw new Mutil.Error('Events can only be bound to DOM elements.');
            }
            if(!event_name.isString()) {
                throw new Mutil.Error('Specify an event name to listen to as a string.');
            }
            if(!fn.isFunction()) {
                throw new Mutil.Error('Specify a valid callback function to bind to the event.');
            }
            bindEvent(element, event_name, function(e) {
                return fn(new app.Event(e));
            });
        };
        
        /**
         * Remove a callback function from an element event.
         * 
         * @param <Node> element is the DOM node to watch.
         * @param <String> event_name is the event to act on.
         * @param <Function> fn is the callback function to fire on trigger.
         */
        app.unbind = function(element, event_name, fn) {
            if(element.removeEventListener) {
                element.removeEventListener(element, fn, false);
            } else if(element.detachEvent) {
                obj.detachEvent('on' + event_name, fn);
            }
        };

        /**
         * Use event delegation on a root element, using a selector to filter
         * desired child nodes to handle the event on.
         *
         * This relieves regular callback functions from filtering out
         * unwanted child nodes that trigger the event.
         *
         * @example Use event delegation to catch clicks on a menu
         * bindDelegator(
         *   document.getElementsByTagName('nav')[0],
         *   'li > a',
         *   'click',
         *   function() {
         *     console.log("Menu item was clicked");
         *   }
         * )
         *
         * @param <Node> element is the DOM root to watch. All its children
         *   will trigger the event.
         * @param <String> selector is a selector string specifying to which
         *   child nodes of element the callback function will be applied.
         * @param <String> event_name is the event to watch.
         * @param <Function> fn is the callback function to fire on the event.
         */
        app.bindDelegator = function(element, selector, event_name, fn) {
            app.bind(element, event_name, delegatedCallback(selector, fn));
        };

        /**
         * Helper function to create a callback that is only fired when the
         * target of an incoming event matches a selector.
         *
         * @param <String> selector to determine wither the event target
         *   qualifies for the callback.
         * @param <Function> fn is the original callback function to fire.
         */
        function delegatedCallback(selector, fn) {
            return function(e) {
                if(app.Query.matches(e.target, selector)) {
                    fn(e);
                }
            };
        }

        /**
         * Trigger an event on an element.
         *
         * @param <Node> element is the DOM element to use
         * @param <String> event_name is the name of the event to fire.
         */
        app.trigger = function(element, event_name) {
            if(element[event_name] && element[event_name].isFunction()) {
                element[event_name]();
            }
        };

        // todo: implement decorating like this
        // This should add a method to the sandbox Collection 'class' to
        // quickly bind an event to all elements in the collection.
        app.Collection.prototype.bind = function() {
            this.forEach(function() {
                app.bind.apply(this, arguments.toArray());
            });
            return this;
        };

        // todo: implement decorating like this
        // This should add a method to the sandbox Collection 'class' to
        // quickly bind an event to all elements in the collection.
        app.Collection.prototype.bindDelegator = function() {
            this.forEach(function() {
                app.bindDelegator.apply(this, arguments.toArray());
            });
            return this;
        };
    };
}
