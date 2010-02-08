(function($){
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
	$.fn.addClass = function(value) {
		return this.each(function() {
			if(!this.className)
				this.className = value;
			else if(!this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)')))
				this.className += ' ' + value;
		});
	};

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
	$.fn.removeClass = function(value) {
		return this.each(function() {
			this.className = this.className.replace(new RegExp('(\\s|^)' + value + '(\\s|$)'), '');
		});
	};

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
	$.fn.hasClass = function(value) {
		return this.inject(false, function(m) {
			return m || this.className.match(new RegExp('(\\s|^)' + value + '(\\s|$)'));
		});
	};

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
	$.fn.toggleClass = function(value) {
		return this.each(function() {
			$(this).hasClass(value) ? $(this).removeClass(value) : $(this).addClass(value);
		});
	};
})(mutil);