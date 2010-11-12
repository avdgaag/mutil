/**
 * All available selector strategies used in DOM queries.
 * 
 * @todo refactor and split into basic and advanced modules
 * @see Selector
 * @see Query
 */
Selector.selectors = {
    by_tag_name: new Selector(/^\w+$/, function(selector, root) {
        return root.getElementsByTagName(selector);
    }),

    by_id: new Selector(/^#[a-z][a-z0-9\-_]*$/i, function(selector, root) {
        return [root.getElementById(selector.replace('#', ''))];
    }),

    multiple: new Selector(/[^,]+(,[^,]+)+[^,]*/, function(selector) {
        var selectors  = selector.split(/,\s*/),
            output     = [];

        for(var i = 0, j = selectors.length; i < j; i++) {
            var result = new Query(selectors[i]);
            for(var k = 0, l = result.length; k < l; k++) {
                output.push(result[k]);
            }
        }
        return output;
    }),

    by_class_name: new Selector(/^(\w+)?(\.[a-z][a-z0-9\-_]*)+$/, function(selector) {
        var classes = selector.split('.'),
            element = classes.shift();

        elements_with_classes = document.getElementsByClassName(classes.join(' '));
        if(element !== '') {
            var output = [];
            var results = new Query(element);
            for(var i = elements_with_classes.length - 1; i >= 0; i--){
                if(results.indexOf(elements_with_classes[i])) {
                    output.push(elements_with_classes[i]);
                }
            }
            elements_with_classes = output;
        }
        return elements_with_classes;
    }),

    by_attribute: new Selector(/\[\w+[+$~*|^]?=('|"|).*\1\]/, function(selector) {
        var matches             = /(.+)(\[\w+[*+$~|^]?=.*\])+/i.exec(selector),
            base_selector       = matches[1],
            attribute_selectors = matches[2].replace(/^\[|\]$/g, '').split(']['),
            elements            = new Query(base_selector),
            output              = [];
        var match = (function() {
            var attributes = {};
            for(var i = 0, j = attribute_selectors.length; i < j; i++) {
                var m = /^(\w+)([+~$*|^])?=('|"|)(.+)\3$/.exec(attribute_selectors[i]);
                attributes[m[1]] = (function(operator, value) {
                    var fn = null;
                    switch(operator) {
                    case '*':
                        fn = function(element, attribute) {
                            return element.getAttribute(attribute) && element.getAttribute(attribute).match(value);
                        };
                        break;
                    case '~':
                        fn = function(element, attribute) {
                            var val = element.getAttribute(attribute);
                            return val && val.split(/\s+/).indexOf(value) >= 0;
                        };
                        break;
                    case '^':
                        fn = function(element, attribute) {
                            var val = element.getAttribute(attribute);
                            return val && val.match(new RegExp('^' + value));
                        };
                        break;
                    case '$':
                        fn = function(element, attribute) {
                            var val = element.getAttribute(attribute);
                            return val && val.match(new RegExp('' + value + '$'));
                        };
                        break;
                    default:
                        fn = function(element, attribute) {
                            return element.getAttribute(attribute) == value;
                        };
                    }
                    return fn;
                })(m[2], m[4]);
            }
            return function(element) {
                var all = true;
                for(attr in attributes) {
                    if(attributes.hasOwnProperty(attr)) {
                        all = all && attributes[attr](element, attr);
                    }
                }
                return all;
            };
        })();
        for(var i = 0, j = elements.length; i < j; i++) {
            if(match(elements[i])) {
                output.push(elements[i]);
            }
        }
        return output;
    }),

    adjacent: new Selector(/[^+]+(\+[^+]+)+[^+]*/, function(selector) {
        var selectors = selector.split(/\s*\+\s*/),
            output    = new Query(selectors.shift());
        for(var i = 0, j = selectors.length; i < j; i++) {
            var temp_collection = [];
            for(var k = 0, l = output.length; k < l; k++) {
                var ns = output[k].nextSibling;
                while(ns && ns.nodeType !== 1) {
                    ns = ns.nextSibling;
                }
                if(ns && Query.matches(ns, selectors[i])) {
                    temp_collection.push(ns);
                }
            }
            output = temp_collection;
        }
        return output;
    }),

    child: new Selector(function(selector) {
        return (/[^+>,~]\s+(?![+>~])/).test(selector.replace(/\[.+\]/, ''));
    }, function(selector) {
        var selectors = selector.split(/\s+(?!\+>~)/),
            output    = new Query(selectors.shift());
        for(var i = 0, j = selectors.length; i < j; i++) {
            output = new Query(selectors[i], output);
        }
        return output;
    }),

    direct_descendant: new Selector(/>/, function(selector) {
        var parts  = selector.split(/\s*>\s*/),
            output = new Query(parts.shift());
        for(var i = 0, j = parts.length; i < j; i++) {
            var temp_collection = [];
            for(k = 0, l = output.length; k < l; k++) {
                var children = Array.prototype.slice.call(output[k].childNodes);
                for(m = 0, n = children.length; m < n; m++) {
                    if(Query.matches(children[m], parts[i])) {
                        temp_collection.push(children[m]);
                    }
                }
            }
            output = temp_collection;
        }
        return output;
    })
};
