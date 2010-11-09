/**
 * Sandbox for an application.
 * 
 * Creates a sandbox environment to run your application in, with specific
 * submodules attached to the sandbox.
 * 
 * By default, all submodules are loaded, but you can manually specify
 * which to load. Specifying no modules or '*' will load all available modules.
 * 
 * Your callback function gets passed two arguments:
 *
 * * app is the sandbox objeect, to which submodules may attach their own
 *   functionality.
 * * $ is a shortcut to app.$, the shorthand query function.
 * 
 * You can nest multiple sandbox environments and use specific modules in
 * specific parts of your application without polluting the namespace.
 * 
 * @example Loading specific submodules
 * new Mutil.App(['module1', 'module2'], function(app, $) {
 *   // application code goes here...
 * })
 * 
 * @example Nested sandboxes
 * new Mutil.App(['classes'], function(app, $) {
 *   // do some stuff here with all the modules...
 *   
 *   new Mutil.App(['ajax'], function(app, $) {
 *     // do some other stuff here with brand new
 *     // app and $ variables...
 *   });
 * 
 *   // original sandbox continues...
 * });
 * 
 * @param <Array, String> [modules] is an optional specification of which
 *   submodules to load for the sandbox environment. Omitting the argument
 *   or using '*' will load all modules; passing an array of module names
 *   will load only those.
 * @param <Function> fn is the callback sandbox function, in which your
 *   application runs.
 */
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