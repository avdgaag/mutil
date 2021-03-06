// ### A tiny javascript utility belt
//
// Mutil is a micro-framework, a collection of helper functions that I have
// often needed. Sometimes you don't need the Ajax, animation, advanced
// selectors etc. that full-blown frameworks like Prototype or jQuery provide.
// This is a light-weight framework with the basics needed to write custom tiny
// Javascript apps.
//
// Mutil provides some basic functional programming functions, basic DOM
// querying, event handling and class manipulation. It does provide
// implementations of all new javascript features missing in older browsers,
// only the most used. It does try to fall back to native implementations,
// should they exist.
//
// ### Object-oriented or functional style
//
// You can use Mutil in two ways:
//
// * As a stand-alone global object, using a functional style like
//   `Mutil.filter([1,2,3], function(i) { return i > 2; });`.
//
// * Let Mutil extend native objects, enabling an object-oriented style, like
//   `[1,2,3].filter(function(i) { return i > 2; });`.
//
// Which way you go depends on possible conflicts with other code and your
// personal preference.
//
// ### Credits & More information
//
// **Author**: [Arjan van der Gaag](http://arjanvandergaag.nl)  
// **Date**: 2011-07-06  
// **License**: MIT License  
// **Source**: [http://github.com/avdgaag/mutil](http://github.com/avdgaag/mutil)  
// **Homepage**: [http://avdgaag.com/mutil](http://avdgaag.com/mutil)
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
// * Include proper attribution to John Resig, Underscore, Backbone and
//   all the other sources good ideas and code were stolen from.
//
(function() {
    // ### Initial setup

    // Shortcuts to commonly used functions
    var slice = Array.prototype.slice;

    // Test for native implementations of some our helper functions before we
    // do anything else
    var native = {
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
        VERSION: '0.1.3',

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
            improve(Array,    ['forEach', 'reduce', 'map', 'filter', 'without', 'pluck', 'invoke', 'include', 'without', 'tap']);
            improve(String,   ['trim', 'format', 'toElement']);
            improve(Object,   ['extend', 'tap', 'forEach']);
            improve(Function, ['bind', 'tap']);
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
                classes     = node.className.split(/\s+/),
                that        = this;
            node.className = classes.concat(new_classes.filter(function(e) {
                return !that.include(classes, e);
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

        // Use a **custom Event object** to make working with events across browsers easier.
        // Most common differences between browsers are handled here, so your event handlers
        // can work with a consistent interface.
        //
        // What's happening:
        //
        // * Clone all the properties of the event into this object
        //
        // * Provide `preventDefault()`, `stopPropagation()` and `stopImmediatePropagation()`
        //   that work across browsers
        //
        // * Set the right poperties for `target`, `relatedTarget` and `which`.
        //
        // To make sure event handlers are passed an instance of Mutil.Event,
        // the `addEvent` and `removeEvent` use `normalizeEvent` and
        // `denormalizeEvent` to wrap event handlers in a custom function that
        // creates a `Mutil.Event` object for the actual handler.
        Event: (function(Mutil) {
            var fntrue = function() { return true; },
                fnfalse = function() { return false; };

            function Event(e) {
                Mutil.extend(this, (e || window.event));

                if(!this.target) {
                    this.target = event.srcElement || document;
                }

                this.relatedTarget                 = this.fromElement === this.target ? this.toElement : this.fromElement;
                this.isDefaultPrevented            = fnfalse;
                this.isPropagationStopped          = fnfalse;
                this.isImmediatePropagationStopped = fnfalse;

                this.which = this.charCode || this.keyCode;
            }

            Event.prototype.preventDefault = function() {
                this.returnValue = false;
                this.isDefaultPrevented = fntrue;
            };

            Event.prototype.stopPropagation = function() {
                this.cancelBubble = true;
                this.isPropagationStopped = fntrue;
            };

            Event.prototype.stopImmediatePropagation = function() {
                this.isImmediatePropagationStopped = fntrue;
                this.stopPropagation();
            };

            return Event;
        })(this),

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

        // Normalize the event the given event handler will work with. Simply
        // provide a new function that will call `fn` with a new `Mutil.Event`.
        //
        // Store the created wrapper function in `fn` so you can get to it
        // when you want to remove it later.
        normalizeEvent: function(fn) {
            return fn._mutil_wrapper = function(e) {
                fn.call(this, new Mutil.Event(e));
            };
        },

        // Return either the original function, or its wrapper function if it
        // has been set.
        denormalizeEvent: function(fn) {
            return fn._mutil_wrapper ? fn._mutil_wrapper : fn;
        },

        // Add an event handler to a DOM element. Based on [John Resig's
        // flexible javascript
        // events](http://ejohn.org/projects/flexible-javascript-events/).
        addEvent: function(node, type, fn) {
            fn = this.normalizeEvent(fn);
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
            fn = this.denormalizeEvent(fn);
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

        // Return a copy of the input array with all additional arguments
        // removed from it.
        //
        // Example:
        //
        //     Mutil.without([1,2,3,4], 1, 3);
        //     // => [2, 4]
        //
        without: function(obj) {
            var exceptions = this.toArray(arguments).slice(1);
            return this.filter(obj, function(el) {
                return !exceptions.include(el);
            });
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

        // Parse a string representation of a DOM element into an
        // actual element. It follows a special format:
        //
        //     [tag name][#id][.class1.class2][{Element content}]
        //
        // Example:
        //
        //     Mutil.toElement('p#main.leader{Welcome}')
        //     // => <p id="main" class="leader">Welcome</p>
        //
        toElement: function(str) {
            var id      = str.match(/#([a-zA-Z\-_0-9]+)/),
                classes = str.match(/\.([^#\s{}]+)/),
                content = str.match(/\{([^}]+)\}/),
                el_name = str.match(/^([a-zA-Z]+)/);
            if(!el_name) throw new TypeError();
            return this.tap(document.createElement(el_name[1]), function(e) {
                if(id)      e.setAttribute('id', id[1]);
                if(classes) e.className = classes[1].replace('.', ' ');
                if(content) e.appendChild(document.createTextNode(content[1]));
            });
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

        // Set up a kind of inheritance chain as seen in traditional class-based
        // object-oriented languages.
        //
        // This does a couple a things:
        //
        // * Copy all attributes from parent to child
        // * Create a new ghost class with the parent as prototype
        // * Set the prototype to a new ghost class instance
        // * Add a _super property to child to access the parent
        //
        // Example:
        //
        //    var ParentClass = (function() {
        //      function ParentClass() {
        //        this.message = 'hello';
        //      }
        //      ParentClass.prototype.speak = function() {
        //        return this.message;
        //      };
        //      return ParentClass;
        //    })();
        //    var ChildClass = (function() {
        //      Mutil.inherits(ParentClass);
        //      function ChildClass() {
        //        this.name = 'John';
        //        this._super.constructor.apply(arguments);
        //      }
        //      ChildClass.prototype.shout = function() {
        //        return this.message + ' ' + this.name + '!';
        //      };
        //      return ChildClass;
        //    })();
        //    p = new ParentClass();
        //    p.speak() # => 'hello'
        //    c = new ChildClass();
        //    c.speak() # => 'hello'
        //    c.shout() # => 'hello john!'
        //    
        inherits: function(child, parent) {
            for(var k in parent) if(parent.hasOwnProperty(k)) child[k] = parent[k];
            function F() { this.constructor = child; }
            F.prototype     = parent.prototype;
            child.prototype = new F;
            child._super    = parent.prototype;
            return child;
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

        // Here is a `toArray` function that converts basically anything
        // safely to an array. Use this function rather than
        // `Array.prototype.slice.call`, since that is not allowed to operate
        // on, for example, `NodeList`s or `arguments`. It still works in
        // most browsers, but not in IE.
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

