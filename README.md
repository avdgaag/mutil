## Introduction

μtil (mutil) is a tiny Javascript utility library that looks a lot like
jQuery but is much smaller. It has a simple selector engine, some basic
event methods and a simple plugin architecture to easily add functions to
its core.

## Example code

Here's some demo code:

    // on page load
    $(function() {

      // Select all links in the content leader
      $('#content p.leader a')

        // observe the click event
        .addEvent('click', function(e) {

          // stop event propagation and prevent default link behaviour
          e.stop();

          // Set a nice background color on its parent
          $(this.parentNode).setCss({ background: '#ffffe1' });
      });
    });

## Plugins

You can add extra functions to the μtil toolkit using plugins:

    // Use a closure to make sure $ is μtil in this context.
    (function($){

      // Declare a new function on the fn property of μtil
      // which will then be available on all collectionss
      $.fn.printer = function() {

        // Loop over all selected elements and return the iterator,
        // so we can chain methods
        return this.each(function() {

          // run the plugin code here: attach an event.
          $(this).addEvent('click', function(e) {
            e.stop();
            window.print();
          });
        });
      };
    })(mutil);

After loading this snippet in your page you can let any object open the
print dialog when clicked upon:

    $('#print-link').printer();

## Progress

This is still very much a work in progress. Here's whats on my
todo-list:

* Create a test suite
* Add some more useful plugins
* simplify and shorten the code

Here's what I don't want to:

* AJAX
* Advanced selectors
* Complete DOM traversal

When you're in need of that stuff, you're probably better off using
prototype or jQuery or some other major framework.

Community contributions are welcomed, so please do fork this project and
create topic branches for your features.

## Credits & links

* **Author**: Arjan van der Gaag
* **E-mail**: arjan@arjanvandergaag.nl
* **URL**: http://arjanvandergaag.nl
* **Source code**: http://github.com/avdgaag/mutil
* **Documentation**: http://avdgaag.github.com/mutil
* **Issue tracker**: http://github.com/avdgaag/mutil/issues

## License

Copyright (c) 2009 Arjan van der Gaag

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.