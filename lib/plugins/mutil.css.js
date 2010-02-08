(function() {
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
	$.fn.setCss = function(styles) {
		return this.each(function() {
			for(var prop in styles) {
				if(!styles.hasOwnProperty(prop)) continue;
				this.style[prop] = styles[prop];
			}
		});
	}
})();