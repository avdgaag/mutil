describe('Mutil', function() {
    describe('handling onload events', function() {
        var original_onload;

        beforeEach(function() {
            original_onload = window.onload;
            window.onload = null;
        });

        afterEach(function() {
            window.onload = original_onload;
        });

        describe('when there is no function yet', function() {
            it('should set an onload function', function() {
                var fn = function() {};
                Mutil.addLoadEvent(fn);
                expect(window.onload).toEqual(fn);
            });
        });

        describe('when there already is a function', function() {
            var a,
                b,
                fna = function() { a++; },
                fnb = function() { b++; };

            beforeEach(function() {
                a = 0;
                b = 1;
                window.onload = fna;
            });

            it('should call the old function', function() {
                Mutil.addLoadEvent(fnb);
                window.onload();
                expect(a).toEqual(1);
            });

            it('should call the new function', function() {
                Mutil.addLoadEvent(fnb);
                window.onload();
                expect(b).toEqual(2);
            });
        });
    });
});
