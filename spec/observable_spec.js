describe('Mutil', function() {
    describe('Observable', function() {
        var subject, observer;

        beforeEach(function() {
            subject = {};
            Mutil.extend(subject, Mutil.Observable);
        });

        it('should add an observer', function() {
            expect(function() {
                subject.observe('event', function() {})
            }).not.toThrow();
        });

        it('should remove a single observer', function() {
            var fn1 = function() {};
            var fn2 = function() {};
            subject.observe('event', fn1);
            subject.observe('event', fn2);
            subject.unobserve('event', fn1);
            expect(subject._observers).toEqual({ 'event': [null, fn2] });
        });

        it('should remove all observers for an event', function() {
            var fn = function() {};
            subject.observe('event1', fn);
            subject.observe('event2', fn);
            subject.unobserve('event2');
            expect(subject._observers).toEqual({ 'event1': [fn], 'event2': [] });
        });

        it('should remove all observers for all events', function() {
            subject.unobserve();
            expect(subject._observers).toEqual({});
        });

        it('should call observers for an event', function() {
            var i = 1,
                fn1 = function() { i++ },
                fn2 = function() { i = i * 2 };

            subject.observe('event', fn2);
            subject.observe('event', fn1);
            subject.trigger('event');
            expect(i).toEqual(3);
        });
    });
});
