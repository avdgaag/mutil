/*
 * Use a simple CSS-like syntax to quickly create DOM elements.
 * 
 * Example:
 * 
 *   $.create('p.leader{Hello, world!}')
 *   $.create('#foo.bar.baz')
 *   $.create('table#listing')
 * 
 * These generate the following DOM elements:
 * 
 *   <p class="leader">Hello, world!</p>
 *   <div id="foo" class="bar baz"></div>
 *   <table id="listing"></table>
 * 
 * You can also immediately add the new element to an existing (set of)
 * element(s):
 * 
 *   $.createIn(document.getElementById('foo'), 'p.leader{Hello!}')
 *   $.createIn('#foo', 'p.leader{Hello!}')
 * 
 */
(function($) {
	function Element(source) {
		if(!isValid()) throw 'Unparsable HTML expression: "' + source + '"';

		/*
		 * Test if the source string is a valid creator expression.
		 * 
		 * Tests:
		 * 
		 * - make sure there is either an element name or ID
		 * - allow one id prefixed with #
		 * - allow multiple classes prefixed with .
		 * - allow content wrapped in accolades ({})
		 * - order: element name, id, classes, content
		 */
		function isValid() {
			return (/^\w+(#[\w\-]+)?(\.[\w\-]+)*(\{[^}]+\})?$|^#[\w\-]+(\.[\w\-]+)*(\{[^}]+\})?$/).test(source);
		}
		
		/*
		 * Try to extract part of the element from the source string.
		 * If nothing matches return null.
		 * 
		 * You can supply an index to directly get to a capture group, and a
		 * callback function to do something to the result when there is
		 * something there.
		 */
		function match_or_null(pattern, index, callback) {
			try {
				var value = source.match(pattern)[index];
				return callback ? callback.call(value) : value;
			} catch(TypeError) {
				return null;
			}
		}
		
		return {
			text: 		match_or_null(/\{([^\}]+)\}/, 1),
			id: 		match_or_null(/#([^\.{]+)/, 1),
			classes: 	match_or_null(/\.([^\#\{]+)/, 1, function() { return this.split('.'); }),
			name: 		match_or_null(/^[^\.#{]+/, 0)
		};
	}
	
	/*
	 * Parse an Element object into a DOM node.
	 * 
	 * This will simply create a new element and apply any ID, classes and
	 * text contents to it. The element is returned.
	 * 
	 * By default a div element will be created.
	 */
	function parse(element) {
		var e = document.createElement((element.name || 'div'));
		if(element.text) 	e.appendChild(document.createTextNode(element.text));
		if(element.id)   	e.setAttribute('id', element.id);
		if(element.classes)	e.className = element.classes.join(' ');
		return e;
	}
	
	/*
	 * Create and return a new DOM element.
	 */
	$.create = function(string) {
		return parse(new Element(string));
	};
	
	/*
	 * Create a new DOM element and immediately insert it into the DOM at the
	 * location specified by element_to_add_to (either a mutil selector or
	 * DOM element).
	 * 
	 * When given a selector this will actually add a copy of the created
	 * element to every element in the selected collection. Beware!
	 * 
	 * The created element is returned.
	 */
	$.createIn = function(element_to_add_to, string) {
		// Parse our new element.
		var element = $.create(string);

		// See if this is a node. If not, try to select it using mutil.
		if(!element_to_add_to || !element_to_add_to.nodeType || element_to_add_to.nodeType != 1) {
			$(element_to_add_to).each(function() { this.appendChild(element.cloneNode(true)); });
		} else {
			element_to_add_to.appendChild(element);
		}
		return element;
	};
}(mutil));