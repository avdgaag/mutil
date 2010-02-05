/*
 * Hidden plugin: see if an element is hidden or not
 */
(function($){
	/*
	 * Get the computed style for a given element if the user agent
	 * does not already give us that function.
	 */
	if(!window.getComputedStyle) {
	    window.getComputedStyle = function(el, pseudo) {
	        this.el = el;
	        this.getPropertyValue = function(prop) {
	        var re = /(\-([a-z]){1})/g;
	        if (prop == 'float') prop = 'styleFloat';
	        if (re.test(prop)) {
	            prop = prop.replace(re, function () {
	            	return arguments[2].toUpperCase();
	           });
	        }
	        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
	      };
	      return this;
	   };
	}

	/**
	 * See if any of the elements in the current collection are
	 * hidden, having a computed style of display: none.
	 */
	$.fn.isHidden = function() {
		return this.inject(false, function(memo) {
			return memo || window.getComputedStyle(this, '').getPropertyValue('display') == 'none';
		});
	};
	
	/**
	 * Returns those elements in the current collection that
	 * are hidden.
	 */
	$.fn.findHidden = function() {
		return this.select(function() { return $(this).isHidden(); });
	};
})(mutil);