/**
 * Implement a bunch of core Number extensions that should have been in
 * Javascript by default. We 'improve', not 'extend' -- so we don't override
 * native functions that may already exist (and will inevitably be faster).
 */
Number.prototype.improve({
    
    /**
     * Run a given callback this number of times.
     * 
     * @example Log the numbers 0 to 9
     * (10).times(function(i) {
     *   console.log(i);
     * });
     * 
     * @param <Function> fn is the callback function to use.
     */
    times: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        for(var i = 0; i < this; i++) {
            fn.call(null, i);
        }
    }
});
