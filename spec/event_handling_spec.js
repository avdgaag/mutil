describe('Mutil', function() {
    describe('Event handlers', function() {
        var node, event;

        beforeEach(function() {
            node = document.createElement('div');
            event = document.createEvent('MouseEvents');
            event.initMouseEvent(
                'click',
                true,
                true,
                document.defaultView,
                1,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
        });

        it('should add an event', function() {
            var called = false;
            Mutil.addEvent(node, 'click', function() { called = true; });
            node.dispatchEvent(event);
            expect(called).toBeTruthy();
        });

        it('should remove an event', function() {
            var called = false,
                fn = function() { called = true; };
            Mutil.addEvent(node, 'click', fn);
            Mutil.removeEvent(node, 'click', fn);
            node.dispatchEvent(event);
            expect(called).toBeFalsy();
        });
    });
});
