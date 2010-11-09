String.prototype.improve({
    trim: function() {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    },
    trimLeft: function() {
        return this.replace(/^\s*/, '');
    },
    trimRight: function() {
        return this.replace(/\s*$/, '');
    },
    toHtml: function() {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    format: function(dict) {
        return this.replace(/{([^{}]+)}/g, function(full_match, name) {
            var replacement = dict[name];
            return typeof replacement === 'string' || typeof replacement === 'number' ? replacement : full_match;
        });
    },
    isBlank: function() {
        return !!this.match(/^\s*$/);
    }
});