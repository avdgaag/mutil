/**
 * Basic error class for all Mutil-specific errors.
 * 
 * @constructor
 * @param <String> message is the error message
 */
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