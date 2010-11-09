/**
 * Implement a bunch of core String extensions that should have been in
 * Javascript by default. We 'improve', not 'extend' -- so we don't override
 * native functions that may already exist (and will inevitably be faster).
 */
String.prototype.improve({
    /**
     * Remove beginning and trailing whitespace.
     * 
     * @return <String>
     */
    trim: function() {
        return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
    },

    /**
     * Remove beginning whitespace.
     * 
     * @return <String>
     */
    trimLeft: function() {
        return this.replace(/^\s*/, '');
    },

    /**
     * Remove trailing whitespace.
     * 
     * @return <String>
     */
    trimRight: function() {
        return this.replace(/\s*$/, '');
    },

    /**
     * Encode all special HTML characters.
     * 
     * This handles the following characters: <, >, &
     * 
     * @example
     * "<p>foo</p>".toHtml()
     * // "&lt;p&gt;foo&lt;/p&gt;"
     * 
     * @return <String>
     */
    toHtml: function() {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    
    /**
     * Use the string as a format for a given dictionary. Keys from the
     * dictionary can be used in the string surrounded by curly braces, like
     * so: "normal string {key}". 
     * 
     * @example
     * "Hello, {who}!".format({ who: 'world' }); // "Hello, world!"
     * 
     * @param <Object> dict is a set of name/value pairs to interpolate into
     *   the current string.
     * @return <String>
     */
    format: function(dict) {
        return this.replace(/{([^{}]+)}/g, function(full_match, name) {
            var replacement = dict[name];
            return typeof replacement === 'string' || typeof replacement === 'number' ? replacement : full_match;
        });
    },
    
    /**
     * Test if the current string is empty or consists only of whitespace.
     * 
     * @return <Boolean>
     */
    isBlank: function() {
        return !!this.match(/^\s*$/);
    }
});