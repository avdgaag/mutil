Mutil.App = function() {
    var args    = Array.prototype.slice.call(arguments),
        fn      = args.pop(),
        modules = (args[0] && args[0].isString()) ? args : args[0],
        i;

    // Make sure the new keyword is used
    if(!(this instanceof Mutil.App)) {
        return new Mutil.App(modules, fn);
    }

    // When given no modules or * include all modules
    if(!modules || modules === '*') {
        modules = [];
        for(i in Mutil.modules) {
            if(Mutil.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }

    // Initialize all required modules
    for(i = 0, j = modules.length; i < j; i++) {
        Mutil.modules[modules[i]](this);
    }

    // Run the application callback (sandbox environment)
    fn(this, this.$);
};