var $break = 'mutil-break';

Object.extend = function(dest, src) {
    for(var property in src)
        dest[property] = src[property];
    return dest;
};
Object.isArray = function(obj) {
    return obj && !(obj.propertyIsEnumerable('length')) && typeof obj === 'object' && typeof obj.length === 'number';
};

Object.extend(Array.prototype, {
    forEach: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        for(var i = 0, l = this.length; i < l; i++) {
            try {
                fn.call(this[i], i);
            } catch($break) {
                break;
            }
        }
    },
    inject: function(init, fn) {
        if(typeof fn != 'function') throw new TypeError();
        this.forEach(function() {
            init = fn.call(this, init);
        });
        return init;
    },
    every: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        return this.inject(true, function(memo) {
            return memo && fn.call(this);
        });
    },
    some: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        return this.inject(false, function(memo) {
            return memo || fn.call(this);
        });
    },
    map: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        return this.inject([], function(output) {
            return output.push(fn.call(this));
        });
    },
    filter: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        return this.inject([], function(output) {
            if(fn.call(this)) output.push(this);    
            return output;
        });
    },
    reject: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        return this.inject([], function(output) {
            if(!fn.call(this)) output.push(this);    
            return output;
        });
    },
    indexOf: function(obj) {
        var pos = false;
        this.forEach(function(i) {
            if(this === obj) {
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
    }
});

Object.extend(String, {
    trim: function() {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    },
    toHtml: function() {
        return this.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
    },
    format: function(dict) {
        return this.replace(/{([^{}]+)}/g, function(full_match, name) {
            var replacement = dict[name];
            return typeof replacement === 'string' || typeof replacement === 'number' ? replacement : full_match;
        });
    },
    blank: function() {
        return !!this.match(/^\s*$/);
    }
});

Object.extend(Number, {
    times: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        for(var i = 0; i <= this; i++) {
            fn.call(null, i);
        }
    }
});


if(typeof window.console == 'undefined') {
    window.console = {
        log: function(msg) {
            alert(msg);
        }
    };
}

var Mutil = (function() {
    function Collection(query, root) {
        this.root     = root || document;
        this.query    = query;
        this.elements = this.find();
    }
    
    Object.extend(Collection.prototype, {
        addEvent: function(event_name, fn) {
            if(typeof fn != 'function') throw new TypeError();

            function MutilEvent(e) {
                var that = this;
                that.event = e || window.event;
                that.target = that.event.target || that.event.srcElement;

                return {
                    stopPropagation: function() {
                        that.event.stopPropagation ? that.event.stopPropagation() : that.event.cancelBubble = true;
                    },
                    preventDefault: function() {
                        that.event.preventDefault ? that.event.preventDefault() : that.event.returnValue = false;
                    },
                    stop: function() {
                        this.stopPropagation();
                        this.preventDefault();
                    }
                };
            }

            var add = function(element, fn) {
                if(window.addEventListener) {
                    el.addEventListener(type, fn, false);
                } else if(window.attachEvent) {
                    el.attachEvent('on' + type, fn);
                } else {
                    el['on' + type] = fn;
                }
            };

            this.forEach(function() {
                add(this, function(e) {
                    fn.call(this, new MutilEvent(e));
                });
            });

            return this;
        },
        find: function() {
            var that = this;
            
            var elements = null;
            selectors.forEach(function() {
                result = this.call(that, that.query, that.root);
                if(typeof result != 'undefined') {
                    output = result;
                    throw $break;
                }
            });
            
            if(elements) {
                return elements;
            } else {
                throw('Invalid query: ' + that.query);
            }
        }
    });
    
    function init(fn_or_query) {
        if(typeof fn_or_query != 'function') {
            addLoadEvent(fn_or_query);
        } else if(typeof fn_or_query != 'string') {
            return new Collection(fn_or_query, document);
        } else {
            throw new TypeError();
        }
    }
    
    function addLoadEvent() {
        var oldonload = window.onload;
        if(typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function() {
                if(oldonload) oldonload();
                func();
            };
        }
    }
    
    return {
        addLoadEvent: addLoadEvent,
        init:         init
    };
})();
var $ = Mutil.init;