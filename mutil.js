/**
 * @fileoverview the mutil.js tiny javascript library.
 * 
 * <h2>Introduction</h2>
 * 
 * <p>μtil (mutil) is a tiny Javascript utility library that looks a lot like 
 * jQuery but is much smaller. It has a simple selector engine, some basic 
 * event methods and a simple plugin architecture to easily add functions to 
 * its core.</p>
 * 
 * <h2>Example code</h2>
 * 
 * <p>Here's some demo code:</p>
 * 
 * <pre class="code">
 * // on page load
 * $(function() {
 * 
 *   // Select all links in the content leader
 *   $('#content p.leader a')
 * 
 *     // observe the click event
 *     .addEvent('click', function(e) {
 * 
 *       // stop event propagation and prevent default link behaviour
 *       e.stop();
 * 
 *       // Set a nice background color on its parent
 *       $(this.parentNode).setCss({ background: '#ffffe1' });
 *   });
 * });
 * </pre>
 * 
 * <h2>Plugins</h2>
 * 
 * <p>You can add extra functions to the μtil toolkit using plugins:</p>
 * 
 * <pre class="code">
 * // Use a closure to make sure $ is μtil in this context. 
 * (function($){
 * 
 *   // Declare a new function on the fn property of μtil
 *   // which will then be available on all collectionss
 *   $.fn.printer = function() {
 * 
 *     // Loop over all selected elements and return the iterator,
 *     // so we can chain methods
 *     return this.each(function() {
 * 
 *       // run the plugin code here: attach an event.
 *       $(this).addEvent('click', function(e) {
 *         e.stop();
 *         window.print();
 *       });
 *     });
 *   };
 * })(mutil);
 * </pre>
 * 
 * After loading this snippet in your page you can let any object open the
 * print dialog when clicked upon:
 * 
 * <pre class="code">
 * $('#print-link').printer();
 * </pre>
 * 
 * <h2>Progress</h2>
 * 
 * <p>This is still very much a work in progress. Here's whats on my 
 * todo-list:</p>
 * 
 * <ol>
 *   <li>Create a test suite</li>
 *   <li>Add some more useful plugins</li>
 *   <li>simplify and shorten the code</li>
 * </ol>
 * 
 * <p>Here's what I don't want to:</p>
 * 
 * <ol>
 * <li>AJAX</li>
 * <li>Advanced selectors</li>
 * <li>Complete DOM traversal</li>
 * </ol>
 * 
 * <p>When you're in need of that stuff, you're probably better off using
 * prototype or jQuery or some other major framework.</p>
 * 
 * <p>Community contributions are welcomed, so please do fork this project and 
 * create topic branches for your features.</p>
 * 
 * @author <a href="http://arjanvandergaag.nl">Arjan van der Gaag</a>
 * @version 0.1
 */

/**
 * Create function bindings, executing a function in the scope
 * of another object.
 * 
 * @param {Object} scope is the object that sets the scope for this function.
 * @returns a new function in the given scope.
 * @type Function
 */
Function.prototype.bind = function(scope) {
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	};
};

/**
 * Empty constructor, since this is a mix-in module and not a real class.
 * @class The enumerable mix in provides helper functions for working with
 * arrays. It is mixed into the array prototype and is applied to all element
 * collections.
 * 
 * @constructor
 */
function Enumerable() {};
Enumerable.prototype = {
	/**
	 * Loop over the elements in an array, yielding each to the callback. The
	 * callback receives as arguments the index of iteration and the entire array.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * ['one', 'two', 'three'].each(function(i, arr) {
	 *   console.log(this);
	 * });
	 * </pre>
	 * 
	 * Produces:
	 * 
	 * <pre class="code">
	 * one
	 * two
	 * three
	 * </pre>
	 * 
	 * @param {Function} callback is the function to call for every element.
	 * @returns itself
	 * @type Array
	 */
	each: function(callback) {
	    for(var i = 0, j = this.length; i < j; i++) {
			callback.call(this[i], i, this);
		}
		return this;
	},

	/**
	 * Reduce an array to a single value with a callback.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * [1, 2, 3].inject(0, function(output, i, arr) {
	 *   return output + this;
	 * });
	 * </pre>
	 * 
	 * Produces:
	 * 
	 * <pre class="code">
	 * 6
	 * </pre>
	 *
	 * @param init the starting value
	 * @param {Function} callback is the function to call for every element.
	 * @returns the cumulative result value
	 */
	inject: function(init, callback) {
		this.each(function(i, arr) {
			init = callback.call(this, init, i, arr);
		});
		return init;
	},

	/**
	 * Create a new array containing those elements from the original array for
	 * which the callback return value evaluates to true.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * [1, 2, 3, 4].select(function(i, arr) {
	 *   return this > 2;
	 * });
	 * </pre>
	 * 
	 * Produces:
	 * 
	 * <pre class="code">
	 * [3, 4]
	 * </pre>
	 * 
	 * @param {Function} callback to determine to select an element or not
	 * @returns a new array with only the selected elements
	 * @type Array
	 */
	select: function(callback) {
		return this.inject([], function(memo, i, arr) {
			if(callback.call(this, i, arr)) memo.push(this);
			return memo;
		});
	},

	/**
	 * Returns if the array has any elements. If the optional callback is given,
	 * it will return the count of elements that evaluate to true for the
	 * callback.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * [].any();
	 * [1, 2, 3].any();
	 * [1, 2, 3].any(function() {
	 *   return this > 2;
	 * });
	 * [1, 2, 3].any(function() {
	 *   return this > 4;
	 * });
	 * </pre>
	 * 
	 * Produces:
	 * 
	 * <pre class="code">
	 * false
	 * true
	 * true
	 * false
	 * </pre>
	 * 
	 * @param {Function} callback to select which elements to count (optional)
	 * @returns whether there are any elements
	 * @type Bool
	 */
	any: function(callback) {
		if(typeof callback == 'function') {
			return count(this.select(callback)) > 0;
		} else {
			return count(this) > 0;
		}
	},

	/**
	 * Apply a callback function to every element in the array.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * [1,2,3].map(function(i, arr) {
	 *   return this * 2;
	 * });
	 * </pre>
	 * 
	 * Produces:
	 * 
	 * <pre class="code">[2,4,6];</pre>
	 * 
	 * @param {Function} callback to apply to every element
	 * @returns a new array with callback applied to every element
	 * @type Array
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


/**
 * Remove leading and trailing whitespace.
 * 
 * Usage:
 * 
 * <pre class="code">" my string   ".trim()</pre>
 * 
 * Produces:
 * 
 * <pre class="code">"my string"</pre>
 * 
 * @returns itself with leading and trailing whitespace removed
 * @type String
 */
String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

/**
 * Create a new mutil object, selecting either some DOM elements or adding
 * and onload event in the process.
 * 
 * @class Select DOM elements by using a really simple CSS selector syntax.
 * 
 * Supported selectors:
 * 
 * <ol>
 *   <li>by ID: <code>#content</code></li>
 *   <li>by tag name: <code>div</code></li>
 *   <li>by descendant: <code>div p</code></li>
 *   <li>by class name: <code>p.test</code></li>
 * </ol>
 * 
 * You can combine these selectors to your liking, i.e. '#content div p.test'.
 * 
 * If you pass in an existing DOM element or Nodelist, that is returned
 * (the result is always an array).
 * 
 * Usage:
 * 
 *   <pre class="code">$('#content p.test');</pre>
 * 
 * Produces:
 * 
 *   <pre class="code">[p.test, p.test]</pre>
 * 
 * In addition you can pass in a function as an argument and have it fire
 * when the onLoad-event fires.
 * 
 * Usage:
 * 
 * <pre class="code">
 * $(function() {
 *   $('p').addEvent(...);
 * });
 * </pre>
 * 
 * @constructor
 * @requires Enumerable
 * @param arg A simple CSS selector, DOM element or Nodelist.
 * @param root is a DOM element in whose children to search for arg.
 * @augments Enumerable
 * @borrows Enumerable#each as #each
 */
function Mutil(arg, root) {
	/**
	 * Select DOM elements helper function.
	 * 
	 * @inner
	 */
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
	
	/**
	 * Register a load event function helper function.
	 * 
	 * @inner
	 */
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

Mutil.prototype = {
	/*
	 * Import Enumerable functions
	 * 
	 * TODO: clean this up somehow.
	 */
	each:   function() { return Enumerable.prototype.each  .apply(this.elements, arguments); },
	inject: function() { return Enumerable.prototype.inject.apply(this.elements, arguments); },
	select: function() { return Enumerable.prototype.select.apply(this.elements, arguments); },
	map:    function() { return Enumerable.prototype.map   .apply(this.elements, arguments); },
	any:    function() { return Enumerable.prototype.any   .apply(this.elements, arguments); },
	
	/**
	 * Add an event to a DOM element.
	 * 
	 * Usage:
	 * 
	 * <pre class="code">
	 * addEvent(document.getElementById('test'), 'click', function(e) {
	 *   console.log('clicked!');
	 * });
	 * </pre>
	 * 
	 * You can also use this method as an array function, applying it to
	 * all elements in an array.
	 * 
	 * The single argument to the callback function is an {@link Event} object
	 * that works just like the native event object, but is cross-browser
	 * compatible.
	 * 
	 * @see Event
	 * @param {String} type is the event to observe.
	 * @param {Function} callback is the observer function.
	 * @returns itself for chaining purposes.
	 * @type Mutil
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
	
	/**
	 * Give an element a class.
	 * 
	 * @example
	 * $('p').addClass('highlight');
	 * 
	 * @param {String} value is the class name to add
	 * @returns itself for chaining purposes
	 * @type Mutil
	 */
	addClass: function(value) {
		return this.each(function() {
			if(!this.className)
				this.className = value;
			else if(!this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)')))
				this.className += ' ' + value;
		});
	},
	
	/**
	 * Remove an element's class.
	 * 
	 * @example
	 * $('p').removeClass('highlight');
	 * 
	 * @param {String} value is the class name to remove
	 * @returns itself for chaining purposes
	 * @type Mutil
	 */
	removeClass: function(value) {
		return this.each(function() {
			this.className = this.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
		});
	},
	
	/**
	 * Tell if an element has a given class.
	 * 
	 * When working on multiple elements this returns whether ALL the elements
	 * have the given class.
	 * 
	 * @example
	 * if($('p').hasClass('highlight')) { ... }
	 * 
	 * @param {String} value is the class name to add
	 * @returns whether the element(s) has the class or not
	 * @type Boolean
	 */
	hasClass: function(value) {
		return this.inject(false, function(m) {
			return m || this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
		});
	},
	
	/**
	 * Switch an element's class on or off.
	 * 
	 * Either remove or add the class to the element, depending on
	 * whether the element already has the class.
	 * 
	 * @param {String} value the class name to switch on or off
	 * @returns itself for chaining purposes
	 * @type Mutil
	 */
	toggleClass: function(value) {
		return this.each(function() {
			$(this).hasClass(value) ? $(this).removeClass(value) : $(this).addClass(value);
		});
	},
	
	/**
	 * Give an element an arbitrary set of CSS properties.
	 * 
	 * @example
	 * $('p').setCss({ color: '#f00' });
	 * 
	 * @param {Object} key/value object of CSS attributes and values.
	 * @returns itself for chaining purposes
	 * @type Mutil
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

window.mutil = window.$ = function(arg, root) { return new Mutil(arg, root); };
window.mutil.fn = Mutil.prototype;