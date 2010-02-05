/**
 * Hover plugin: add a 'hover' class when an element is hovered over.
 * 
 * @param {String} classname the class name to toggle, defaults to 'hover'
 * @param {Integer} delay is the number of milliseconds to wait before firing the event.
 */
(function($){
	$.fn.hover = function(classname, delay) {
		classname = classname || 'hover';
		
		/*
		 * Return a new callback function that only fires after
		 * a delay, if such was specified.
		 */
		function afterDelay(obj, callback) {
			return function() {
				if(obj.timer) {
					clearTimeout(obj.timer);
					obj.timer = null;
				}
				obj.timer = setTimeout(function() {
					callback.apply(this, arguments);
				}, delay);
			};
		}
		
		return this.each(function() {
			var obj = $(this);
			if(delay) obj.timer = null;
			obj.addEvent('mouseover', afterDelay(obj, function(e) {
				obj.addClass(classname);
			})).addEvent('mouseout', afterDelay(obj, function(e) {
				obj.removeClass(classname);
			}));
		});
	};
})(mutil);