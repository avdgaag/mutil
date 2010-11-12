Selector.create({
    name:       'by_class_name',
    identifier: /^(\w+)?(\.[a-z][a-z0-9\-_]*)+$/,
    fn:         function(selector) {
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
                }
});