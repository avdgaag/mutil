/**
 * Query the DOM to generate a Mutil.Collection object of DOM nodes.
 * 
 * This is a simple selector engine that can use various strategies to parse
 * a selector string. When it is unable to parse the selector an error
 * will be thrown.
 * 
 * The following strategies can be parsed:
 * 
 * * tag names (e.g. 'p' or 'div')
 * * IDs (e.g. '#foo')
 * * classes (e.g. '.foo', 'p.foo')
 * * Multiple selectors (e.g. 'p.foo, #bar')
 * * Adjacent elements (e.g. 'p + p')
 * * Child elements (e.g. 'div p')
 * * Direct descendents (e.g. 'div > p')
 * * Attributes (e.g. 'a[href=foo]')
 * 
 * Selector strategies can be found in Mutil.Selectors.
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

    console.log('New query:');
    console.log(root);
    console.log(selector);

    if(root instanceof Collection) {
        output = new Collection();
        root.forEach(function(v) {
            console.log("Selector in the inner function: ");
            console.log(selector);
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
        // throw new Mutil.Error('Invalid selector: ' + selector);
        console.log('arg');
    }
};

/**
 * Check if a Node matches a selector
 * 
 * @todo test and optimize
 * @param <Node> node is a DOM element
 * @param <String> selector is a CSS-like selector string
 * @return <Boolean>
 */
Query.matches = function(node, selector) {
    return new Query(selector).indexOf(node) >= 0;
};