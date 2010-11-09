Mutil.modules = Mutil.modules || {};
if(!Mutil.modules.core) {
    Mutil.modules.core = function(app) {
        app.$ = function() {
            var args    = Array.prototype.slice.call(arguments),
                subject = args.shift(),
                root    = args[0];
            if(subject.isFunction()) {
                Mutil.addLoadEvent(subject);
            } else {
                return new Mutil.Query(subject, root);
            };
        };
    };
}