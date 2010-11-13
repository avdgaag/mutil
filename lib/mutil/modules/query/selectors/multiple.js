/**
 * Selector strategy that selects multiple selectors, separated by a comma.
 * 
 * @todo refactor using some array methods like #foreach and #inject.
 */
Selector.create((function() {
    function callback(selector) {
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
    
    return {
        name:       'multiple',
        identifier: /[^,]+(,[^,]+)+[^,]*/,
        fn:         callback
    };
})());