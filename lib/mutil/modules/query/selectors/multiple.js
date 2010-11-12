Selector.create({
    name:       'multiple',
    identifier: /[^,]+(,[^,]+)+[^,]*/,
    fn:         function(selector) {
                    var selectors  = selector.split(/,\s*/),
                        output     = [];

                    for(var i = 0, j = selectors.length; i < j; i++) {
                        var result = new Query(selectors[i]);
                        for(var k = 0, l = result.length; k < l; k++) {
                            output.push(result[k]);
                        }
                    }
                    return output;
                }
});