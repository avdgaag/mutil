/*
 * Mutil plugin that gathers the entire inner text of a given (set of)
 * element(s).
 * 
 * Example:
 * 
 *   <p>Hello, <strong>world</strong>!</p>
 *   $('p').innerText() # => 'Hello, world!'
 * 
 */
(function($) {
	$.fn.innerText = function() {
		return this.elements.length > 1 ? 
			Array.prototype.slice.call(this.elements).collect(function() {
				return $(this).innerText();
			}) :
			Array.prototype.slice.call(this.elements[0].childNodes).inject('', function(output) {
				return this.nodeType == 3 ? output + this.nodeValue : output + $(this).innerText();
			});
	};
}(mutil));