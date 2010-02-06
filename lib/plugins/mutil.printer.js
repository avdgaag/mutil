/*
 * Print plugin: let something print on click
 */
(function($){
	$.fn.printer = function() {
		return this.each(function() {
			$(this).addEvent('click', function(e) {
				e.stop();
				window.print();
			});
		});
	};
})(mutil);