app.Selector.create({
    name:       'direct_descendant',
    identifier: />/,
    fn:         function(selector) {
                    var parts  = selector.split(/\s*>\s*/),
                        output = new app.Query(parts.shift());
                    for(var i = 0, j = parts.length; i < j; i++) {
                        var temp_collection = [];
                        for(k = 0, l = output.length; k < l; k++) {
                            var children = Array.prototype.slice.call(output[k].childNodes);
                            for(m = 0, n = children.length; m < n; m++) {
                                if(app.Query.matches(children[m], parts[i])) {
                                    temp_collection.push(children[m]);
                                }
                            }
                        }
                        output = temp_collection;
                    }
                    return output;
                }
});
