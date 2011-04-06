/**
 * Array-like collection of DOM nodes
 * 
 * A Mutil.Collection gets returned by DOM queries and works just like an
 * array, but with benefits, such as the #query method. Other modules may
 * extend it with more functionality.
 * 
 * @example Query from a collection: the following are equivalent
 * var paragraphs_in_divs = $('div').query('p');
 * var paragraphs_in_divs = $('p', $('div'));
 * 
 * @todo refactor, as we cannot really subclass Array
 * @todo replace custom iterator #each with core extension
 * @constructor
 * @param <Nodelist> nodelist is a set of nodes to convert into a Collection.
 */
function Collection(nodelist) {
    // Constructor takes a nodelist and pushes all to its internal array
    // Firefox does not convert undefined to [], so do it manually
    var nodes = (typeof nodelist === 'undefined') ? [] : Array.prototype.slice.call(nodelist);
    for(var i = 0, j = nodes.length; i < j; i++) {
        this.push(nodes[i]);
    }
};

// Subclass array
// @todo: this will not work, so we need to mix in specific behaviours
Collection.prototype = new Array();

/**
 * Helper method to base new queries on an existing collection of objects.
 * 
 * @example
 * var collection = $('div').query('p');
 * 
 * @param <String> selector is the selector to use in a new query with the
 *   current colletion as its root.
 * @return <Collection>
 */
Collection.prototype.query = function(selector) {
    var output = [];
    this.forEach(function(el) {
        output = output.concat(Array.prototype.slice.call(new Query(selector, el)));
    });
    return new Collection(output);
};