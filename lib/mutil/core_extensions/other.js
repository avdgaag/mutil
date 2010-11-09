/**
 * Provide a fallback functionality for environments that do not support
 * window.console. It falls back to annoying but effective alerts.
 * 
 * @todo implement maybe some non-browser related debugger...?
 */
if(typeof window.console === 'undefined') {
    window.console.log = function(msg) {
        alert(msg);
    };
}