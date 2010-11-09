Mutil.Collection = function(nodelist) {
    // Constructor takes a nodelist and pushes all to its internal array
    var nodes = Array.prototype.slice.call(nodelist);
    for(var i = 0, j = nodes.length; i < j; i++) {
        this.push(nodes[i]);
    }
};
Mutil.Collection.prototype = new Array();
Mutil.Collection.prototype.each = function(fn) {
    for(var i = 0, j = this.length; i < j; i++) {
        fn.call(this[i]);
    }
};
Mutil.Collection.prototype.query = function(selector) {
    var output = [];
    this.each(function() {
        output = output.concat(Array.prototype.slice.call(new Mutil.Query(selector, this)));
    });
    return new Mutil.Collection(output);
};
