/*
 * Hover plugin: add a 'hover' class when an element is hovered over
 */
(function($){
	$.fn.toggleHover = function() {
		return this.each(function() {
			$(this).addEvent('mouseover', function(e) {
				$(this).addClass('hover');
			}).addEvent('mouseout', function(e) {
				$(this).removeClass('hover');
			});
		});
	};
})(mutil);