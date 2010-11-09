Mutil.addLoadEvent = function(fn) {
    var oldonload = window.onload;
    if (typeof window.onload !== 'function') {
        window.onload = fn;
    } else {
        window.onload = function() {
            oldonload();
            fn();
        };
    }
};
