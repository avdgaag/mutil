Mutil.Error = function(message) {
    this.message = message;
};

Mutil.Error.prototype = {
    getMessage: function() {
        return this.message;
    },
    toString: function() {
        return this.message;
    }
};