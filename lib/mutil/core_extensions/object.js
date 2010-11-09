/**
 * Implement a bunch of core Object extensions that should have been in
 * Javascript by default.
 */
(function() {
    var extensions = {
        /**
         * Copy all attributes from the given object into the current
         * object, overriding any that are already there.
         * 
         * @see #improve
         * @param <Object> src is the source object to copy from
         */
        extend: function(src) {
            for(var i in src) {
                if(src.hasOwnProperty(i)) {
                    this[i] = src[i];
                }
            }
        },
        
        /**
         * Same as extend, but does not override existing members in the
         * current object. This can be useful to define functions on an
         * object that may or may not have native (faster) implementations.
         * 
         * @see #extend
         * @param <Object> src to copy members from
         */
        improve: function(src) {
            for(var i in src) {
                if(src.hasOwnProperty(i) && !this[i]) {
                    this[i] = src[i];
                }
            }
        },
        
        /**
         * Test whether the current object is a function.
         * 
         * @return <Boolean>
         */
        isFunction: function() {
            return typeof this === 'function';
        },
        
        /**
         * Test whether the current object is a string.
         * 
         * @return <Boolean>
         */
        isString: function() {
            return Object.prototype.toString.call(this) === '[object String]';
        },
        
        /**
         * Test whether the current object is a number.
         * 
         * @return <Boolean>
         */
        isNumber: function() {
            return Object.prototype.toString.call(this) === '[object Number]';
        },
        
        /**
         * Test whether the current object is a boolean.
         * 
         * @return <Boolean>
         */
        isBoolean: function() {
            return Object.prototype.toString.call(this) === '[object Boolean]';
        },
        
        /**
         * Test whether the current object is a DOM node element.
         * 
         * @return <Boolean>
         */
        isElement: function() {
            return this.nodeType && this.nodeType === 1;
        },
        
        /**
         * Test whether the current object is an array.
         * 
         * @return <Boolean>
         */
        isArray: (function() {
            if((typeof Array.isArray == 'function') && Array.isArray([]) && !Array.isArray({})) {
                return function() {
                    return Array.isArray(this);
                };
            } else {
                return function() {
                    Object.prototype.toString.call(this) === '[object Array]';
                };
            }
        })()
    };
    for(var i in extensions) {
        if(extensions.hasOwnProperty(i) && !Object.prototype[i]) {
            Object.prototype[i] = extensions[i];
        }
    }
})();
