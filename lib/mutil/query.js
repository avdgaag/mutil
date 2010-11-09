Mutil.Query = function(selector, root) {
    root = root || document;

    if(root instanceof Mutil.Collection) {
        output = new Mutil.Collection();
        root.each(function() {
            var r = new Mutil.Query(selector, this);
            for(var i = 0, j = r.length; i < j; i++) {
                output.push(r[i]);
            }
        });
        return output;
    }

    var selected_strategy = null;
    for(strategy in Mutil.Query.selectors) {
        if(Mutil.Query.selectors.hasOwnProperty(strategy)) {
            s = Mutil.Query.selectors[strategy];
            if(s.handles && s.handles(selector)) {
                selected_strategy = s;
            }
        }
    }

    if(selected_strategy) {
        return new Mutil.Collection(selected_strategy(selector, root));
    } else {
        throw new Mutil.Error('Invalid selector: ' + selector);
    }
};
Mutil.Query.matches = function(node, selector) {
    return new Mutil.Query(selector).indexOf(node) >= 0;
};