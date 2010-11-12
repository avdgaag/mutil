app.Selector.create({
    name:       'adjacent',
    identifier: /[^+]+(\+[^+]+)+[^+]*/,
    fn:         function(selector) {
                    var selectors = selector.split(/\s*\+\s*/),
                        output    = new app.Query(selectors.shift());
                    for(var i = 0, j = selectors.length; i < j; i++) {
                        var temp_collection = [];
                        for(var k = 0, l = output.length; k < l; k++) {
                            var ns = output[k].nextSibling;
                            while(ns && ns.nodeType !== 1) {
                                ns = ns.nextSibling;
                            }
                            if(ns && app.Query.matches(ns, selectors[i])) {
                                temp_collection.push(ns);
                            }
                        }
                        output = temp_collection;
                    }
                    return output;
                }
});