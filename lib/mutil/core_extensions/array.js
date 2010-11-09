Array.prototype.improve({
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
     inject: function(init, fn) {
         if(!fn.isFunction()) throw new TypeError();
         this.forEach(function() {
             init = fn.call(this, init);
         });
         return init;
     },
     every: function(fn) {
         if(!fn.isFunction()) throw new TypeError();
         return this.inject(true, function(memo) {
             return memo && fn.call(this);
         });
     },
     some: function(fn) {
         if(!fn.isFunction()) throw new TypeError();
         return this.inject(false, function(memo) {
             return memo || fn.call(this);
         });
     },
     map: function(fn) {
         if(!fn.isFunction()) throw new TypeError();
         return this.inject([], function(output) {
             return output.push(fn.call(this));
         });
     },
     filter: function(fn) {
         if(!fn.isFunction()) throw new TypeError();
         return this.inject([], function(output) {
             if(fn.call(this)) output.push(this);    
             return output;
         });
     },
     reject: function(fn) {
         if(!fn.isFunction()) throw new TypeError();
         return this.inject([], function(output) {
             if(!fn.call(this)) output.push(this);    
             return output;
         });
     },
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
    lastIndexOf: function(obj) {
        var pos = false;
        for(var i = this.length; i >= 0; i--) {
            if(this[i] === obj) {
                pos = i;
                break;
            }
        }
        return pos;
    },
    compact: function() {
        return this.filter(function() {
            return this === null;
        });
    },
    includes: function(obj) {
        return !!this.indexOf(obj);
    },
    uniq: function() {
        return this.inject([], function(memo) {
            if(!memo.indexOf(this)) {
                memo.push(this);
            }
            return memo;
        });
    },
    flatten: function() {
        return this.inject([], function(memo) {
            return memo.concat(this);
        });
    }
});