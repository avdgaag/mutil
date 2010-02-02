/*
 * Create function bindings, executing a function in the scope
 * of another object.
 */
Function.prototype.bind = function(scope) {
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	};
};

/*
 * The enumerable mix in provides helper functions for working with arrays.
 * It is mixed into the array prototype and is applied to all element
 * collections.
 */
var Enumerable = function() {};
Enumerable.prototype = {
	/*
	 * Loop over the elements in an array, yielding each to the callback. The
	 * callback receives as arguments the index of iteration and the entire array.
	 * 
	 * Usage:
	 * 
	 *   ['one', 'two', 'three'].each(function(i, arr) {
	 *     console.log(this);
	 *   });
	 * 
	 * Produces:
	 * 
	 *   one
	 *   two
	 *   three
	 * 
	 */
	each: function(callback) {
	    for(var i = 0, j = this.length; i < j; i++) {
			callback.call(this[i], i, this);
		}
		return this;
	},

	/*
	 * Reduce an array to a single value with a callback.
	 * 
	 * Usage:
	 * 
	 *   [1, 2, 3].inject(0, function(output, i, arr) {
	 *     return output + this;
	 *   });
	 * 
	 * Produces:
	 * 
	 *   6
	 *
	 */
	inject: function(init, callback) {
		this.each(function(i, arr) {
			init = callback.call(this, init, i, arr);
		});
		return init;
	},

	/*
	 * Create a new array containing those elements from the original array for
	 * which the callback return value evaluates to true.
	 * 
	 * Usage:
	 * 
	 *   [1, 2, 3, 4].select(function(i, arr) {
	 *     return this > 2;
	 *   });
	 * 
	 * Produces:
	 * 
	 *   [3, 4]
	 * 
	 */
	select: function(callback) {
		return this.inject([], function(memo, i, arr) {
			if(callback.call(this, i, arr)) memo.push(this);
			return memo;
		});
	},

	/*
	 * Returns if the array has any elements. If the optional callback is given,
	 * it will return the count of elements that evaluate to true for the
	 * callback.
	 * 
	 * Usage:
	 * 
	 *   [].any();
	 *   [1, 2, 3].any();
	 *   [1, 2, 3].any(function() {
	 *     return this > 2;
	 *   });
	 *   [1, 2, 3].any(function() {
	 *     return this > 4;
	 *   });
	 * 
	 * Produces:
	 * 
	 *   false
	 *   true
	 *   true
	 *   false
	 * 
	 */
	any: function(callback) {
		if(typeof callback == 'function') {
			return count(this.select(callback)) > 0;
		} else {
			return count(this) > 0;
		}
	},

	/*
	 * Apply a callback function to every element in the array.
	 * 
	 * Usage:
	 * 
	 *   [1,2,3].map(function(i, arr) {
	 *     return this * 2;
	 *   });
	 * 
	 * Produces:
	 * 
	 *   [2,4,6];
	 * 
	 */
	map: function(callback) {
		return this.inject([], function(memo, i, arr) {
			return memo.push(callback.call(this, i, arr));
		});
	}
};
for(method in Enumerable.prototype) {
	if(!Array.prototype[method]) Array.prototype[method] = Enumerable.prototype[method];
}


/*
 * Remove leading and trailing whitespace.
 * 
 * Usage:
 * 
 *   " my string   ".trim()
 * 
 * Produces:
 * 
 *   "my string"
 */
String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

/*
 * Substitute arguments into a format string. The format string has numeric
 * placeholders for the arguments passed in.
 * 
 * Usage:
 * 
 *   "First: %1, Third: %3, Second: %2".format(1, 2, 3);
 * 
 * Produces:
 * 
 *   "First: 1, Third: 3, Second: 2"
 * 
 */
String.prototype.format = function() {
	return arguments.inject(this, function(string, i) {
		var r = new RegExp('%' + (i-1), 'g'); 
		return string.replace(re, this); 
	});
};

/*
 * Run a loop this number of times.
 * 
 * Usage:
 * 
 *   3.times(function(i) {
 *     document.write(i);
 *   });
 * 
 * Produces:
 * 
 *   1
 *   2
 *   3
 *
 */
Number.prototype.times = function(callback) {
	for(var i = 0; i < this; i++) {
		callback(i);
	}
};

(function() {

	/*
	 * Select DOM elements by using a really simple CSS selector syntax.
	 * 
	 * Supported selectors:
	 * 
	 * - by ID: #content
	 * - by tag name: div
	 * - by descendant: div p
	 * - by class name: p.test
	 * 
	 * You can combine these selectors to your liking, i.e. '#content div p.test'.
	 * 
	 * If you pass in an existing DOM element or Nodelist, that is returned
	 * (the result is always an array).
	 * 
	 * Usage:
	 * 
	 *   $('#content p.test');
	 * 
	 * Produces:
	 * 
	 *   [p.test, p.test]
	 * 
	 */
	function _$(arg, root) {
		var find = function(arg, root) {
			
			// Helper method to convert a nodelist to an array
			this.nodelistToArray = function(nodelist) {
				var arr = [];
				for(var i = 0, j = nodelist.length; i < j; i++) { arr.push(nodelist[i]); }
				return arr;
			};
			
			// Set the root element to select from. Default to document.
			// If there are multiple roots run this function that many times.
			if(typeof root == 'undefined') root = document;
			if(root == null) return [];
			if(typeof root.length != 'undefined') {
				return root.inject([], function(output) {
					return output.concat($(arg, this));
				});
			}

			// Select by NodeList: return a real array of elements
			if(typeof arg.length != 'undefined' && typeof arg.item != 'undefined') return this.nodelistToArray(arg);
			
			// Select by Node: return a node element
			if(typeof arg.nodeType != 'undefined') return [arg];

			// Select by ID: return the element
			if(matches = arg.match(/^#([a-zA-Z0-9\-_]+)$/)) {
				return root.getElementById(matches[1]);
			}

			// Select multiple: find selectors seperated by commas
			if(arg.match(/,/)) {
				return arg.split(',').inject([], function(output) {
					return output.concat($(this.trim()));
				});
			}

			// Select by descendent: find elements inside other elements
			// #foo bar table.test
			if(arg.match(/ /)) {
				var parts = arg.split(' '),
				    parent = parts.shift(),
				    selector = parts.join(' ');
				return $(selector, $(parent, root));
			}

			// Select by classname: split by dot and find all elements, filter by the rest
			if(arg.match(/[#a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_.]+/)) {
				var parts = arg.split('.'),
				    tagname = parts.shift(),
				    classes = new RegExp(parts.join('|'), 'gi');
				return $(tagname, root).select(function() {
					return this.className.match(classes);
				});
			}

			// Select by tagname: return array of elements
			return this.nodelistToArray(root.getElementsByTagName(arg));
		};
		var addLoadEvent = function(func) {
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
				window.onload = func;
			} else {
				window.onload = function() {
					if (oldonload) oldonload();
					func();
				};
			}
		};
		
		if(typeof arguments[0] == 'function') {
			addLoadEvent(arguments[0]);
		} else {
			this.elements = find(arguments[0], arguments[1]);
		}
	}
	_$.prototype = {
		/*
		 * Import Enumerable functions
		 */
		each:   function() { return Enumerable.prototype.each  .apply(this.elements, arguments); },
		inject: function() { return Enumerable.prototype.inject.apply(this.elements, arguments); },
		select: function() { return Enumerable.prototype.select.apply(this.elements, arguments); },
		map:    function() { return Enumerable.prototype.map   .apply(this.elements, arguments); },
		any:    function() { return Enumerable.prototype.any   .apply(this.elements, arguments); },
		
		/*
		 * Add an event to a DOM element.
		 * 
		 * Usage:
		 * 
		 *   addEvent(document.getElementById('test'), 'click', function(e) {
		 *     console.log('clicked!');
		 *   });
		 * 
		 * You can also use this method as an array function, applying it to
		 * all elements in an array.
		 * 
		 * The single argument to the callback function is an Event object that
		 * works just like the native event object, but is cross-browser consistent.
		 */
		addEvent: function(type, callback) {
			function FwEvent(e) {
				var base = this;
				this.event = e || window.event;
				this.target = this.event.target || this.event.srcElement;
				this.stopPropagation = function() {
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				};
				this.preventDefault = function() {
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
				};
				this.stop = function() {
					this.stopPropagation();
					this.preventDefault();
				};
			}
			var add = function(el, fn) {
				if(window.addEventListener) {
					el.addEventListener(type, fn, false);
				} else if(window.attachEvent) {
					el.attachEvent('on' + type, fn);
				} else {
					el['on' + type] = fn;
				}
			};
			this.each(function() {
				add(this, function(e) { callback.call(this, new FwEvent(e)); });
			});
			return this;
		},
		
		/*
		 * Give an element a class.
		 */
		addClass: function(value) {
			return this.each(function() {
				if(!this.className)
					this.className = value;
				else if(!this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)')))
					this.className += ' ' + value;
			});
		},
		
		/*
		 * Remove an element's class.
		 */
		removeClass: function(value) {
			return this.each(function() {
				this.className = this.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
			});
		},
		
		/*
		 * Tell if an element has a given class.
		 */
		hasClass: function(value) {
			return this.inject(false, function(m) {
				return m || this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
			});
		},
		
		/*
		 * Switch an element's class on or off.
		 * Either remove or add the class to the element, depending on
		 * whether the element already has the class.
		 */
		toggleClass: function(value) {
			return this.each(function() {
				$(this).hasClass(value) ? $(this).removeClass(value) : $(this).addClass(value);
			});
		},
		
		/*
		 * Give an element an arbitrary set of CSS properties.
		 * 
		 * Usage:
		 * 
		 *   $('p').setCss({ color: '#f00' });
		 *
		 */
		setCss: function(styles) {
			return this.each(function() {
				for(var prop in styles) {
					if(!styles.hasOwnProperty(prop)) continue;
					this.style[prop] = styles[prop];
				}
			});
		}
	};
	window.mutil = window.$ = function(arg, root) { return new _$(arg, root); };
	window.mutil.fn = _$.prototype;
})();