/**
 * Implement a bunch of core Array extensions that should have been in
 * Javascript by default. We 'improve', not 'extend' -- so we don't override
 * native functions that may already exist (and will inevitably be faster).
 *
 * @todo make sure these functions are compatible with the ones they replace
 */
Array.prototype.improve({
    /**
     * Call a callback function for every element in this array.
     * 
     * @example
     * [1,2,3].forEach(function(i) {
     *   console.log(this);
     * });
     * // logs 1, 2 and 3
     * 
     * @param <Function> fn is the callback function to call (gets passed
     *   a single argument: the index of the current element)
     */
    forEach: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        for(var i = 0, l = this.length; i < l; i++) {
            try {
                fn.call(this[i], i);
            } catch($break) {
                break;
            }
        }
    },
    
    /**
     * Reduce this a array to a single value using a callback function. The
     * callback gets passed the accumulator as an argument.
     * 
     * @example
     * [1,2,3].inject(0, function(a) { return a + this; }); // 6
     * 
     * @param init initial value, could be anything you want
     * @param <Function> fn callback function
     * @return <Object> return value of last iteration
     */
    inject: function(init, fn) {
        if(!fn.isFunction()) throw new TypeError();
        this.forEach(function() {
            init = fn.call(this, init);
        });
        return init;
    },
    
    /**
     * Test if a callback returns true for all elements in this array.
     * 
     * @example
     * [1,2,3].every(function() { return this > 0 }); // true
     * [1,2,3].every(function() { return this > 1 }); // false
     * 
     * @param <Function> fn is the callback function to test elements.
     * @return <Boolean>
     */
    every: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        return this.inject(true, function(memo) {
            return memo && fn.call(this);
        });
    },
    
    /**
     * Test if a given callback returns true for at least one element of this
     * array.
     * 
     * @example
     * [1,2,3].some(function() { return this > 2 }); // true
     * [1,2,3].some(function() { return this > 4 }); // false
     * 
     * @param <Function> fn is the callback function to test elements
     * @return <Boolean>
     */
    some: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        return this.inject(false, function(memo) {
            return memo || fn.call(this);
        });
    },
    
    /**
     * Return a copy of this array with a callback function applied to all
     * elements.
     * 
     * @example
     * [1,2,3].map(function() { return this * 2 }); // [2,4,6]
     * 
     * @param <Function> fn is the callback function to apply
     * @return <Array>
     */
    map: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        return this.inject([], function(output) {
            return output.push(fn.call(this));
        });
    },
    
    /**
     * Return a copy of this array with all elements for which the callback
     * does not return true removed.
     * 
     * @example
     * [1,2,3].filter(function() { return this > 1 }); // [2,3]
     * 
     * @param <Function> fn callback function to include elements.
     * @return <Array>
     */
    filter: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        return this.inject([], function(output) {
            if(fn.call(this)) output.push(this);    
            return output;
        });
    },
    
    /**
     * Return a copy of this array with all elements for which the callback
     * returns true removed.
     * 
     * @example
     * [1,2,3].reject(function() { return this > 2 }); // [1,2]
     * 
     * @param <Function> fn callback function to remove elements.
     * @return <Array>
     */
    reject: function(fn) {
        if(!fn.isFunction()) throw new TypeError();
        return this.inject([], function(output) {
            if(!fn.call(this)) output.push(this);    
            return output;
        });
    },
    
    /**
     * Get the position of a given object in this array.
     * 
     * @param <Object> obj is the item to look for
     * @return <Number> position in this array or -1 if not found
     */
    indexOf: function(obj) {
        var pos = -1;
        this.forEach(function(i) {
            if(this == obj) {
                pos = i;
                throw $break;
            }
        });
        return pos;
    },
    
    /**
     * Get the index of an object in this array, starting from the back.
     * 
     * @param <Object> obj item to look for
     * @return <Number> position in this array or -1 if not found
     */
    lastIndexOf: function(obj) {
        var pos = -1;
        for(var i = this.length; i >= 0; i--) {
            if(this[i] === obj) {
                pos = i;
                break;
            }
        }
        return pos;
    },
    
    /**
     * Returns a copy of this array with all null elements removed.
     *
     * @return <Array>
     */
    compact: function() {
        return this.filter(function() {
            return this === null;
        });
    },
    
    /**
     * Test if the current array includes a given item.
     * 
     * @param <Object> obj item to look for
     * @return <Boolean>
     */
    includes: function(obj) {
        return !!this.indexOf(obj);
    },
    
    /**
     * Return a copy of this array with all duplicate elements removed.
     * 
     * @return <Array>
     */
    uniq: function() {
        return this.inject([], function(memo) {
            if(!memo.indexOf(this)) {
                memo.push(this);
            }
            return memo;
        });
    },
    
    /**
     * Return a new array with all nested elements from this array, turning
     * an array of arrays into a single array.
     * 
     * @example
     * [[1,2,3], [4,5,6], 7,8,9].flatten(); // [1,2,3,4,5,6,7,8,9]
     * 
     * @return <Array>
     */
    flatten: function() {
        return this.inject([], function(memo) {
            return memo.concat(this);
        });
    }
});