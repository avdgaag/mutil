Selector.create({
    name:       'child',
    identifier: function(selector) {
                    return (/[^+>,~]\s+(?![+>~])/).test(selector.replace(/\[.+\]/, ''));
                }, 
    fn:         function(selector) {
                    var selectors = selector.split(/\s+(?!\+>~)/),
                        output    = new Query(selectors.shift());
                    for(var i = 0, j = selectors.length; i < j; i++) {
                        output = new Query(selectors[i], output);
                    }
                    return output;
                }
});