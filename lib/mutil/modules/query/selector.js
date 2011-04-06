/**
 * Selector strategy that parses a selector string and returns an array of
 * nodes.
 * 
 * This is a simple stub that specific strategies in Mutil.Selectors use
 * to generate a suitable selector function. The implementation is fully
 * defined in the callback, which should always return an array and receives
 * two arguments: a selector string an a root element to work from.
 * 
 * You can create a new selector just like that, but you can also register it
 * for use by new queries using the static #create function.
 * 
 * @example Creating a strategy to find by ID
 * Selector.create({
 *   name:       'by id',
 *   identifier: /^#\w+$/,
 *   fn:         function(selector, root) {
 *                 return [root.getElementById(selector)];
 *               }
 * });
 * 
 * @see Query
 * @see Collection
 * @constructor
 * @param <Function, RegExp> pattern_or_callback is either a function
 *   that returns whether this strategy is suitable to parse the selector
 *   string, or a regular expression that matches a selector string.
 * @param <Function> fn is the implementation of the DOM lookup.
 * @return <Function> selector strategy
 */
function Selector(pattern_or_callback, fn) {
    if(pattern_or_callback.isFunction()) {
        fn.handles = pattern_or_callback;
    } else {
        fn.handles = function(selector) {
            return selector.match(pattern_or_callback);
        };        
    }
    return fn;
};

/**
 * Select a selector strategy for a given selector.
 * 
 * @todo: refactor using iterator methods
 * @param <String> selector is the selector to act upon.
 * @return <Selector> the first Selector object that says it can handle the
 *   selector string.
 */
Selector.handlerFor = function(selector) {
    var selected_strategy = null;
    for(strategy in Selector.selectors) {
        if(Selector.selectors.hasOwnProperty(strategy)) {
            s = Selector.selectors[strategy];
            if(s.handles && s.handles(selector)) {
                selected_strategy = s;
            }
        }
    }
    return selected_strategy;
};

/**
 * List of all available selectors
 */
Selector.selectors = {};

/**
 * Static function to create a new selector object and register it in the
 * selectors list.
 * 
 * @param <Object> obj is a options hash that defines the name of the
 *   new selector, the identifier and callback (the two arguments for
 *   the Selector constructor)
 */
Selector.create = function(obj) {
    Selector.selectors[obj.name] = new Selector(obj.identifier, obj.fn);
};
