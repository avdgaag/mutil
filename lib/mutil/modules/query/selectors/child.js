Selector.create((function() {
    function identifier(selector) {
        return (/[^+>,~]\s+(?![+>~])/).test(selector.replace(/\[.+\]/, ''));
    }
    
    function callback(selector) {
        var selectors = selector.split(/\s+(?!\+>~)/),
            output    = new Query(selectors.shift());
        selectors.forEach(function(v) {
            output = new Query(v, output);
        });
        return output;
    }
    
    return {
        name:       'child',
        identifier: identifier, 
        fn:         callback
    };
})());
