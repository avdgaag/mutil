Mutil.Selector = function(pattern_or_callback, fn) {
    if(pattern_or_callback.isFunction()) {
        fn.handles = pattern_or_callback;
    } else {
        fn.handles = function(selector) {
            return selector.match(pattern);
        };        
    }
    return fn;
};
