// ### A tiny javascript utility belt
//
// Mutil is a micro-framework, a collection of helper functions that you often
// need. Full-blown frameworks like jQuery can be overkill for minor scripting
// tasks. Mutil is light-weight but still provides some useful functions for
// functional programming and dealing with DOM events across browsers.
//
// Mutil does not do Ajax, advanced templating, advanced selectors or
// animation. If you need any of those, you're better off going with
// [jQuery](http://jquery.com) or some other full-blown framework.
//
// **Note**: Mutil does not implement all the advanced javascript functions
// that are found in modern browsers, but not in IE. Although it mimicks some
// of these, some are intentionally left out to stay lean.
//
// Find the source code and tests [at Github](http://github.com/avdgaag/mutil)
// and the documentation at [the mutil homepage](http://avdgaag.github.com/mutil).
//
// **Author**: [Arjan van der Gaag](http://arjanvandergaag.nl)  
// **Date**: 2011-07-06  
// **License**: MIT License
//
// ### To Do
//
// * Implement a custom Event object that makes the most commons tasks of
//   working with events cross-browser compatible.
//
// * Provide a simple wrapper around collections returned by `query` to
//   quickly use those results as scope for a new query, bind events to
//   them or add/remove classes.
//
(function() {
    // ### Initial setup

    // Shortcuts to commonly used functions
    var slice = Array.prototype.slice,
        native = {
            forEach: Array.prototype.forEach,
            reduce:  Array.prototype.reduce,
            map:     Array.prototype.map,
            filter:  Array.prototype.filter
        };

    // All our functions are namespaced under `Mutil`, which is the only variable
    // that leaves the wrapping closure. Optionally, you may want to globalize
    // the `Mutil.$` function yourself, if that would not conflict with other
    // libraries: `window.$ = Mutil.$`.
    window.Mutil = {

        // Current version number, using [semantic
        // versioning](http://semver.org).
        VERSION: '0.1.2',

        // ### Extending native functions
        //
        // Extend native objects and types with utility functions that may or
        // may not already be present, depending on the environment (read:
        // unavailable on IE).
        //
        // This is not enabled by default, since it may interfere with other
        // code you use. You will need to opt-in by calling `Mutil.nativize()`
        // once at the start of your script.
        //
        // Example before and after:
        //
        //     // vanilla style
        //     Mutil.forEach([1, 2, 3], function(el) {
        //         console.log(el);
        //     });
        //     // nativized style
        //     [1, 2, 3].forEach(function(el) {
        //         console.log(el);
        //     });
        //
        nativize: function() {
            var that = this;
            var improve = function(obj, names) {
                that.forEach(names, function(name) {
                    if(!obj.prototype[name]) {
                        obj.prototype[name] = function() {
                            args = that.toArray(arguments);
                            args.unshift(this);
                            return that[name].apply(that, args);
                        };
                    }
                });
            };
            improve(Array,    ['forEach', 'reduce', 'map', 'filter', 'pluck', 'invoke', 'include']);
            improve(String,   ['trim', 'format']);
            improve(Object,   ['extend', 'tap', 'forEach']);
            improve(Function, ['bind']);
            return this;
        },

        // Utility shortcut function that mimicks jQuery's convention of selecting
        // DOM elements or adding onload-functions using the dollar function.
        //
        // You may want to globalize this function: `window.$ = Mutil.$`, but
        // beware of conflicts with other libraries you might be using.
        //
        // Example:
        //
        //     $(function() {
        //         console.log($('p'));
        //     });
        //     // log all paragraphs once the page has loaded
        //
        $: function(o) {
            if(this.isFunction(o)) {
                this.addLoadEvent(o);
            } else {
                args = this.toArray(arguments);
                return this.query.apply(this, args);
            }
        },

        // ## DOM helper methods

        // ### Mini DOM selector engine
        //
        // Very simple selection of DOM elements, supporting the following
        // selectors:
        //
        // * by tag: `p`
        // * by id: `#foo`
        // * by class: `.bar`, `p.bar`, `#foo.bar.baz`
        // * descendants: `#foo bar`
        // * multiples: `#foo, .bar`
        query: function(q, scope) {
            // You can scope the query to one or more elements using `scope`,
            // which defaults to `document`.
            scope = scope || document;

            // If the `scope` consists of multiple elements, simply call
            // `query` again for every element, concatenating the results into
            // one big result array.
            if(this.isArray(scope)) {
                return this.reduce(scope, [], this.bind(function(memo, s) {
                    return memo.concat(this.query(q, s));
                }, this));
            }

            // **multiple selectors**: when the selector string has multiple
            // comma-separated selectors, we simply run `query` again for each
            // selector and collect the results in one big array.
            if(q.match(/,/)) {
                return this.reduce(q.split(/\s*,\s*/), [], function(memo, part) {
                    return memo.concat(this.query(part));
                }, this);

            // **descendents**: when the selector string has white space, it
            // indicates descendent parts. We Run `query` for every part of
            // the selector, using the results of the previous query as
            // scope for the new query.
            } else if(q.match(/\s+/)) {
                return this.reduce(q.split(/\s+/), document, this.bind(function(memo, el) {
                    return memo = this.query(el, memo);
                }, this));

            // **classess**: a dot in the selector indicates one or more
            // classes. The first part of a class selector is either a
            // selector or nothing, in which case we default to all ('*').
            // We then find the first part, and filter that down to match
            // all listed classes.
            } else if(q.match(/\./)) {
                var parts   = q.split('.'),
                    el      = parts[0] || '*',
                    classes = parts.slice(1);
                return this.filter(this.query(el, scope), this.bind(function(e) {
                    return this.reduce(classes, true, function(memo, cls) {
                        return memo && e.className.indexOf(cls) >= 0;
                    });
                }, this));

            // **IDs**: a hash indicates an ID, which we can very simply
            // retrieve. To keep a consistent interface we wrap the result
            // in an array.
            } else if(matches = q.match(/#([a-zA-Z\-_0-9]+)/)) {
                return this.tap([], function(o) {
                    if(_el = scope.getElementById(matches[1])) o.push(_el);
                });

            // **tag names**: if all else fails, we simply query by tag name
            // for the selector string.
            } else {
                return this.toArray(scope.getElementsByTagName(q));
            }
        },

        // ### Classes
        //
        // Adding and removing classes to/from DOM elements isn't too hard, but it
        // occurs often enough to warrant their own helper methods.
        //
        // You can call the `addClass` and `removeClass` functions with one or more
        // classes to add or remove all of them. No duplicates will be added, and
        // when removing, no duplicates will remain (although other duplicates will
        // be ignored).
        //
        // Example:
        //
        //     Mutil.addClass(my_div_element, 'foo', 'bar');
        //

        addClass: function(node) {
            if(!this.isElement(node)) throw new TypeError();
            var new_classes = this.toArray(arguments).slice(1),
                classes     = node.className.split(/\s+/);
            node.className = classes.concat(new_classes.filter(function(e) {
                return !classes.include(e);
            })).join(' ');
        },

        removeClass: function(node) {
            if(!this.isElement(node)) throw new TypeError();
            var classes = node.className;
            this.toArray(arguments).slice(1).forEach(function(e) {
                classes = classes.replace(new RegExp('\\b' + e + '\\b', 'g'), '');
            });
            node.className = this.trim(classes.replace(/\s+/g, ' '));
        },

        // ### Events

        // Execute a function when the DOM has finished loading. Any existing
        // functions will still be called.
        addLoadEvent: function(fn) {
            var old = window.onload;
            if(!this.isFunction(old)) {
                window.onload = fn;
                return;
            }
            window.onload = function() {
                if(old) old();
                fn();
            };
        },

        // Add an event handler to a DOM element. Based on [John Resig's
        // flexible javascript
        // events](http://ejohn.org/projects/flexible-javascript-events/).
        addEvent: function(node, type, fn) {
            if(node.attachEvent) {
                node['e' + type + fn] = fn;
                node[type + fn] = function() { node['e' + type + fn](window.event) }
                node.attachEvent('on' + type, node[type + fn]);
            } else {
                node.addEventListener(type, fn, false);
            }
        },

        // Remove an event handler from a DOM element. Based on [John Resig's
        // flexible javascript
        // events](http://ejohn.org/projects/flexible-javascript-events/).
        removeEvent: function(node, type, fn) {
            if(node.detachEvent) {
                node.detachEvent('on' + type, node[type + fn]);
                node[type + fn] = null;
            } else {
                node.removeEventListener(type, fn, false);
            }
        },

        // ## Array enhancements

        // Call a function for every element in an array, or every property in
        // an object.  Use the native forEach if available. This function forms
        // the basis of most other Array enhancements.
        forEach: function(obj, fn, context) {
            if(obj == null) return;
            if(native.forEach && obj.forEach === native.forEach) {
                obj.forEach(fn, context);
            } else if(obj.length === 0 || (obj.length && obj.length.toExponential && obj.length.toFixed)) {
                for(var i = 0, j = obj.length; i < j; i++) {
                    fn.call(context, obj[i], i, obj);
                }
            } else if(typeof obj === 'object') {
                for(key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        fn.call(context, key, obj[key]);
                    }
                }
            } else {
                throw new TypeError('Not iterable: ' + typeof obj);
            }
        },

        // See if an array contains a given element.
        //
        // Example:
        //
        //     Mutil.include([1, 2, 3], 2)
        //     // => true
        //
        include: function(obj, target) {
            return this.filter(obj, function(e) {
                return e === target;
            }).length > 0;
        },

        // Create a new array with only those elements from the input array for
        // which a callback function returns a truthy value.
        //
        // Example:
        //
        //     Mutil.filter([1,2,3], function(e) { return e > 1; });
        //     // => [2, 3]
        //
        filter: function(obj, fn, context) {
            if(native.filter && obj.filter === native.filter) {
                return obj.filter(fn, context);
            } else {
                return this.reduce(obj, [], function(memo, el) {
                    if(fn.call(context, el)) {
                        memo.push(el);
                    }
                    return memo;
                });
            }
        },

        // Create a new array with the values of a given attribute for every
        // element in the input array -- a shortcut method for using `map`.
        //
        // Example:
        //
        //     Mutil.pluck(['foo', 'foofoo'], 'length');
        //     // => [3, 6]
        //
        pluck: function(obj, attr) {
            return this.map(obj, function(el) {
                return el[attr];
            });
        },

        // Create a new array with the return values of calling a given
        // function name on every element in the input array. Any additional
        // arguments are passed along to the called function.
        //
        // Example:
        //
        //     Mutil.invoke(['foo', 'bar'], 'toUpperCase');
        //     // => ['FOO', 'BAR']
        //     Mutil.invoke(['foo', 'bar'], 'substr', 1);
        //     // => ['oo', 'ar']
        //
        invoke: function(obj, name) {
            var args = this.toArray(arguments).slice(2);
            return this.map(obj, function(el) {
                return el[name].apply(el, args);
            });
        },

        // Apply a callback function to every element in the input array,
        // returning a new array with the return values.
        //
        // Example:
        //
        //     Mutil.map([1,2,3], function(e) { return e * 2; });
        //     // => [2,4,6]
        //
        map: function(obj, fn, context) {
            if(native.map && obj.map == native.map) {
                return obj.map(fn, context);
            } else {
                return this.reduce(obj, [], function(memo, el) {
                    memo.push(fn.call(context, el));
                });
            }
        },

        // Apply a callback function to all the elements in an array, using the
        // return value as the new input for the next element, to finally
        // reduce the entire array to a single, new value.
        //
        // Example:
        //
        //     Mutil.reduce([1,2,3], 10, function(memo, e) {
        //         return memo + e;
        //     });
        //     // => 16
        //
        // **Note**: this function differes slightly from the native
        // implementation. In native functions, the `memo` argument comes
        // _after_ the callback function, while the `context` argument is not
        // supported. Note that when using `Mutil.nativize` you will get the
        // native version, not this version.
        reduce: function(obj, memo, fn, context) {
            if(native.reduce && obj.reduce === native.reduce) {
                if(context) {
                    fn = this.bind(fn, context);
                }
                return obj.reduce(fn, memo);
            }
            this.forEach(obj, function(el) {
                return memo = fn.call(context, memo, el);
            });
            return memo;
        },

        // ## String functions

        // Remove any whitespace at the start and end of a string.
        //
        // Example:
        //
        //     Mutil.trim('  foo  ');
        //     // => 'foo'
        //
        trim: function(str) {
            return str.replace(/^\s*|\s*$/g, '');
        },

        // Very simple templating using string interpolation, replacing
        // all the keys in a template string with the values from a hash.
        //
        // Example:
        //
        //     Mutil.format('Hello, {who}!', { who: 'world' });
        //     // => 'Hello, world!'
        //
        format: function(template, vars) {
            this.forEach(vars, function(k, v) {
                template = template.replace(new RegExp('{' + k + '}', 'g'), v);
            });
            return template;
        },

        // ## Object/generic functions

        // 'Tap' into an object, first passing it to a callback function and then
        // returning it. This can be useful in method chains.
        //
        // Example:
        //
        //     Mutil.tap('Foo', function(s) { console.log(s); }).toLowerCase();
        //     // => 'Foo'
        //     // => 'foo'
        //
        tap: function(obj, fn) {
            fn(obj);
            return obj;
        },

        // Copy the properties of one or more objects into a host object,
        // replacing any existing properties it might have.
        //
        // Example:
        //
        //     Mutil.extend({ foo: 'bar' }, { foo: 'baz' }, { baz: 'qux' });
        //     // => { foo: 'baz', baz: 'qux' }
        //
        extend: function(host) {
            var others = this.toArray(arguments, 1),
                that   = this;
            this.forEach(others, function(other) {
                that.forEach(other, function(k, v) {
                    host[k] = v;
                });
            });
        },

        // ## Function functions

        // Force a function to be executed in a specific context, useful when
        // using object methods as event handlers.
        //
        // Example:
        //
        //     var foo = function() {
        //         return this.bar;
        //     }
        //     foo.call({ bar: 'baz' }) // => 'baz'
        //     foo = Mutil.bind(foo, { bar: 'qux' });
        //     foo.call({ bar: 'baz' }) // => 'qux'
        //
        bind: function(fn, context) {
            var that = this,
                args = this.toArray(arguments).slice(2);
            return function() {
                return fn.apply(context, args.concat(that.toArray(arguments)));
            };
        },

        // ## Testing functions
        //
        // Some simple helper functions to help you determine the the type of a
        // given value. You can test for functions, arrays, strings, numbers,
        // `undefined` and DOM elements.
        //
        // There is also a simple `toArray` function that uses
        // `Array.prototype.slice` to convert a given value to an array.

        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },

        isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },

        isString: function(obj) {
            return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
        },

        isElement: function(obj) {
            return !!(obj && obj.nodeType === 1);
        },

        isNumber: function(obj) {
            return obj === 0 || (obj && obj.toExponential && obj.toFixed);
        },

        isUndefined: function(obj) {
            return obj === void 0;
        },

        toArray: function(obj) {
            if(this.isArray(obj)) {
                return obj;
            } else if(obj.toArray) {
                return obj.toArray();
            } else if(obj && Object.prototype.hasOwnProperty.call(obj, 'callee')) {
                return slice.call(obj);
            } else {
                var arr = [];
                for(var i = obj.length; i--; arr.unshift(obj[i]));
                return arr;
            }
        },

        // ## Mixins

        // The `Observable` mixin can be added to any existing object to
        // implement the observer pattern, allowing an arbitrary number of
        // observers to listen for events in a host object.
        //
        // This code is based on the Events mixin from
        // [Backbone](http://documentcloud.github.com/backbone).
        //
        // Usage:
        //
        //     function MyObject() {
        //     }
        //     MyObject.prototype.update_attribute = function(k,v) {
        //         this[k] = v;
        //         // Trigger an event and pass it some arguments
        //         this.trigger('attribute_changed', k, v);
        //     };
        //
        //     // Mix in Observable
        //     Mutil.extend(MyObject, Mutil.Observable);
        //     obj = new MyObject();
        //
        //     // Define an observer for the 'attribute_changed' event
        //     obj.bind('attribute_changed', function(k, v) {
        //         console.log('Attribute ' + k + ' changed to ' + v + '.');
        //     });
        //
        //     obj.update_attribute('foo', 'bar');
        //     // => 'Attribute foo changed to bar'
        //
        Observable: {
            // Register a callback function as an observer for a given event.
            observe: function(event, fn) {
                var o = this._observers || (this._observers = {}),
                    l = o[event] || (o[event] = []);
                l.push(fn);
                return this;
            },

            // Remove an observer from an observable object.
            //
            // If `event` and `fn` are given, it removes function `fn` from the
            // list of observers for the `event` event. If `fn` is omitted, all
            // observers will be removed from `event`. If both `event` and `fn`
            // are omitted, all observers will be removed.
            unobserve: function(event, fn) {
                var o;
                if(!event) {
                    this._observers = {};
                } else if(o = this._observers) {
                    if(!fn) {
                        o[event] = [];
                    } else {
                        var l = o[event];
                        if(!l) return this;
                        for(var i = 0, j = l.length; i < j; i++) {
                            if(fn === l[i]) {
                                l[i] = null;
                                break;
                            }
                        }
                    }
                }
                return this;
            },

            // Trigger an event on the current object, passing along any
            // arguments to all the observers. Observers will run in the
            // context of the host object, so `this` will be the same as the
            // observed object.
            trigger: function(event) {
                if(!(o = this._observers)) return this;
                if(l = o[event]) {
                    for(var i = 0, j = l.length; i < j; i++) {
                        l[i].apply(this, slice.call(arguments, 1))
                    }
                }
                return this;
            }
        }
    };

    // ### Bind `$` to `Mutil`
    //
    // Should you want to take the `$` function elsewhere, for example by
    // assigning it to the `window` global, you can depend on it staying in the
    // appropriate `Mutil` context.
    Mutil.$ = Mutil.bind(Mutil.$, Mutil);
})();

