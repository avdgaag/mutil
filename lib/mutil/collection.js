/**
 * Array-like collection of DOM nodes
 * 
 * A Mutil.Collection gets returned by DOM queries and works just like an
 * array, but with benefits, such as the #query method.
 * 
 * @example Query from a collection: the following are equivalent
 * var paragraphs_in_divs = $('div').query('p');
 * var paragraphs_in_divs = $('p', $('div'));
 * 
 * @todo refactor
 * @todo replace custom iterator #each with core extension
 * @constructor
 * @param <Nodelist> nodelist is a set of nodes to convert into a Collection.
 */
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
