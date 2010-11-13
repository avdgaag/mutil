/**
 * Query the DOM to generate a Collection object of DOM nodes.
 * 
 * This is a simple selector engine that can use various strategies to parse
 * a selector string. When it is unable to parse the selector an error
 * will be thrown.
 * 
 * The following strategies can be parsed by default:
 * 
 * * by tag name: 'p'
 * * by ID: '#foo'
 * * by child: 'div p'
 * * by class name: 'p.foo'
 * * multiple selectors: 'div, p'
 * 
 * Selector strategies can be found in Selector.Selectors.
 * 
 * @example Look for all <p>-elements
 *   var collection = new Mutil.Query('p');
 * 
 * @example Look for all <p>- or <div>-elements
 *   var collection = new Mutil.Query('p, div');
 * 
 * @example Look in a different root element
 *   // implicit root: document
 *   var collection = new Mutil.Query('p')
 *   // explicit root
 *   var collection = new Mutil.Query('p', document.getElementById('page'));
 * 
 * @constructor
 * @param <String> selector is the CSS-like selector string
 * @param <Object, Node, Mutil.Collection> is the root element(s) to look in
 * @return <Mutil.Collection> collection of nodes
 */
function Query(selector, root) {
    root = root || document;

    if(root instanceof Collection) {
        output = new Collection();
        root.forEach(function(v) {
            var r = new Query(selector, v);
            for(var i = 0, j = r.length; i < j; i++) {
                output.push(r[i]);
            }
        });
        return output;
    }

    var strategy = Selector.handlerFor(selector);
    if(strategy) {
        return new Collection(strategy(selector, root));
    } else {
        throw new Mutil.Error('Invalid selector: ' + selector);
    }
};

/**
 * Check if a Node matches a selector
 * 
 * @todo optimize
 * @param <Node> node is a DOM element
 * @param <String> selector is a CSS-like selector string
 * @return <Boolean>
 */
Query.matches = function(node, selector) {
    return new Query(selector).indexOf(node) >= 0;
};