app.Selector.create({
    name:       'by_attribute',
    identifier: /\[\w+[+$~*|^]?=('|"|).*\1\]/,
    fn:         function(selector) {
                    var matches             = /(.+)(\[\w+[*+$~|^]?=.*\])+/i.exec(selector),
                        base_selector       = matches[1],
                        attribute_selectors = matches[2].replace(/^\[|\]$/g, '').split(']['),
                        elements            = new app.Query(base_selector),
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
                }
});