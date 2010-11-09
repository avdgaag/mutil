(function() {
    var extensions = {
        extend: function(src) {
            for(var i in src) {
                if(src.hasOwnProperty(i)) {
                    this[i] = src[i];
                }
            }
        },
        improve: function(src) {
            for(var i in src) {
                if(src.hasOwnProperty(i) && !this[i]) {
                    this[i] = src[i];
                }
            }
        },
        isFunction: function() {
            return typeof this === 'function';
        },
        isString: function() {
            return Object.prototype.toString.call(this) === '[object String]';
        },
        isNumber: function() {
            return Object.prototype.toString.call(this) === '[object Number]';
        },
        isBoolean: function() {
            return Object.prototype.toString.call(this) === '[object Boolean]';
        },
        isElement: function() {
            return this.nodeType && this.nodeType === 1;
        },
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
