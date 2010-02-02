== μTil, a tiny Javascript library

μTil (mutil) is a tiny Javascript utility library that looks a lot like jQuery but is much smaller. It has a simple selector engine, some basic event methods and a simple plugin architecture to easily add functions to its core.

Here's some demo code:

    $('#content p.leader a').addEvent('click', function(e) {
        e.stop();
        $(this.parentNode).setCss({ background: '#ffffe1' });
    });

This is still very much a work in progress. Here's whats on my todo-list:

* Create a test suite
* Add some more useful plugins
* simplify and shorten the code

Here's what I don't want to:

* AJAX
* Advanced selectors
* Complete DOM traversal

Community contributions are welcomed, so please do fork this project and create topic branches for your features.