/**
 * Selector strategy that parses a selector string and returns an array of
 * nodes.
 * 
 * This is a simple stub that specific strategies in Mutil.Selectors use
 * to generate a suitable selector function. The implementation is fully
 * defined in the callback, which should always return an array and receives
 * two arguments: a selector string an a root element to work from.
 * 
 * @example Creating a strategy to find by ID
 * var s = new Mutil.Selector(/^#\w+$/, function(selector, root) {
 *   return [root.getElementById(selector)];
 * });
 * 
 * @see Mutil.Selectors
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
            return selector.match(pattern);
        };        
    }
    return fn;
};
