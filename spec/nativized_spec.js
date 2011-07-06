describe('Mutil', function() {
    Mutil.nativize();

    describe('Object functions', function() {
        var obj;

        beforeEach(function() {
            obj = { foo: 'bar' }
        });

        describe('tap', function() {
            it('should yield itself', function() {
                obj.tap(function(o) {
                    expect(o).toBe(obj);
                });
            });

            it('should return itself', function() {
                expect(obj.tap(function() {})).toBe(obj);
            });
        });

        describe('extend', function() {
            var obj2, obj3;

            beforeEach(function() {
                obj2 = { foo: 'baz', qux: 'foo' };
                obj3 = { foo: 'oof' };
            });

            it('should add new properties', function() {
                obj.extend(obj2);
                expect(obj.qux).toEqual('foo');
            });

            it('should override existing properties', function() {
                obj.extend(obj2);
                expect(obj.foo).toEqual('baz');
            });

            it('should apply multiple other objects in order', function() {
                obj.extend(obj2, obj3);
                expect(obj.foo).toEqual('oof');
            });
        });
    });

    describe('Function functions', function() {
        beforeEach(function() {
            context = {};
        });

        it('should bind to a context', function() {
            var fn = function() {
                expect(this).toBe(context);
            };
            fn = fn.bind(context);
            fn();
        });
    });

    describe('String functions', function() {
        var str;

        beforeEach(function() {
            str = ' foo bar baz  ';
        });

        describe('trim', function() {
            it('should remove surrounding white space', function() {
                expect(str.trim()).toEqual('foo bar baz');
            });
        });

        describe('format', function() {
            var template, vars;

            beforeEach(function() {
                template = "Hello, {who}!";
                vars = { who: 'world' };
            });

            it('should replace placeholders with values', function() {
                expect(template.format(vars)).toEqual('Hello, world!');
            });
        });
    });

    describe('Array functions', function() {
        var arr, obj;

        beforeEach(function() {
            arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            obj = { 'a': 1, 'b': 2, 'c': 3 };
        });

        describe('forEach', function() {
            it('should loop over all elements', function() {
                var i = 0;
                arr.forEach(function(el) { i++; });
                expect(i).toEqual(10);
            });

            it('should not invoke the callback when empty', function() {
                var i = 0;
                [].forEach(function(el) { i++; });
                expect(i).toEqual(0);
            });

            it('should throw a TypeError when not passed a function', function() {
                expect(function() {
                    arr.forEach('string');
                }).toThrow();
            });

            it('should loop over properties in an object', function() {
                var i = 0, j ='';
                obj.forEach(function(k, v) {
                    j = j + k;
                    i = i + v;
                });
                expect(i).toEqual(6);
                expect(j).toEqual('abc');
            });

            it('should not loop over prototype properties in an object', function() {
                var foo = function() {
                    this.bar = 'baz';
                };
                foo.prototype.baz = 'qux';
                (new foo()).forEach(function(k, v) {
                    expect(k).not.toEqual('baz');
                });
            });

            it('should bind the callback to a generic context', function() {
                context = { i: 0 };
                arr.forEach(function() { this.i++; });
                expect(context.i).toEqual(0);
            });

            it('should bind the callback to a given context', function() {
                context = { i: 0 };
                arr.forEach(function() { this.i++; }, context);
                expect(context.i).toEqual(10);
            });

            it('should pass counter and array to callback', function() {
                arr.forEach(function(e, i, a) {
                    expect(arr).toContain(e);
                    expect(i).toBeGreaterThan(-1);
                    expect(i).toBeLessThan(10);
                    expect(a).toBe(arr);
                });
            });
        });

        describe('filter', function() {
            it('should return array of found values', function() {
                expect(arr.filter(function(e) { return e > 4; }).length).toBe(6);
            });

            it('should return empty array if nothing is found', function() {
                expect(arr.filter(function(e) { return false; }).length).toBe(0);
            });

            it('should invoke callback in context', function() {
                context = {};
                arr.filter(function(e) {
                    expect(this).toBe(context);
                }, context);
            });
        });

        describe('pluck', function() {
            it('should return array of values', function() {
                var collection = [
                    { foo: 'bar', baz: 'qux' },
                    { foo: 'rab', baz: 'xuq' }
                ];
                expect(collection.pluck('foo')).toEqual(['bar', 'rab']);
            });
        });

        describe('invoke', function() {
            var arr;

            beforeEach(function() {
                arr = ['foo', 'bar'];
            });

            it('should invoke return array of same size as input', function() {
                expect(arr.invoke('toLowerCase').length).toEqual(arr.length);
            });

            it('should call function on all input elements', function() {
                expect(arr.invoke('toUpperCase')).toEqual(['FOO', 'BAR']);
            });

            it('should pass along extra parameters to the called function', function() {
                expect(arr.invoke('substr', 1)).toEqual(['oo', 'ar']);
            });
        });

        describe('map', function() {
            it('should return empty array for empty input', function() {
                expect([].map(function() {})).toEqual([]);
            });

            it('should return array of equal size', function() {
                expect(arr.map(function() {}).length).toEqual(arr.length);
            });

            it('should apply callback to every element', function() {
                expect([1,2,3].map(function(e) { return e * 2; })).toEqual([2,4,6]);
            });
        });

        describe('reduce', function() {
            it('should apply callback to generate single value', function() {
                expect(arr.reduce(function(m, e) {
                    return m + e;
                }, 0)).toEqual(55);
            });
        });

        describe('include', function() {
            it('should find value in array', function() {
                expect(arr.include(4)).toBeTruthy();
            });

            it('should return false for unfound values', function() {
                expect(arr.include(11)).toBeFalsy();
            });

            it('should not compare via typecasting', function() {
                expect(arr.include('4')).toBeFalsy();
            });
        });
    });
});
