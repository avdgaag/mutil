Number.prototype.improve({
    times: function(fn) {
        if(typeof fn != 'function') throw new TypeError();
        for(var i = 0; i < this; i++) {
            fn.call(null, i);
        }
    }
});
