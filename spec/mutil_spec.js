describe('Mutil', function() {
    describe('classes', function() {
        var p;

        beforeEach(function() {
            p = document.createElement('p');
            p.className = 'foo';
        });

        it('should throw type error when working on a non-element', function() {
            expect(function() { Mutil.addClass(false); }).toThrow();
            expect(function() { Mutil.addClass('string'); }).toThrow();
            expect(function() { Mutil.addClass(10); }).toThrow();
            expect(function() { Mutil.addClass({}); }).toThrow();
            expect(function() { Mutil.addClass([]); }).toThrow();
        });

        it('should add a single class name', function() {
            Mutil.addClass(p, 'bar');
            expect(p.className).toEqual('foo bar');
        });

        it('should add multiple class names', function() {
            Mutil.addClass(p, 'bar', 'baz');
            expect(p.className).toEqual('foo bar baz');
        });

        it('should not add duplicate class names', function() {
            Mutil.addClass(p, 'foo', 'bar');
            expect(p.className).toEqual('foo bar');
        });

        it('should remove a single class name', function() {
            Mutil.removeClass(p, 'foo');
            expect(p.className).toEqual('');
        });

        it('should remove multiple class names', function() {
            p.className = 'foo bar baz';
            Mutil.removeClass(p, 'foo', 'baz');
            expect(p.className).toEqual('bar');
        });

        it('should remove duplicate class names', function() {
            p.className = 'foo foo bar bar baz';
            Mutil.removeClass(p, 'foo');
            expect(p.className).toEqual('bar bar baz');
        });
    });

    describe('testing functions', function() {
        var a, s, f, n, e;

        beforeEach(function() {
            a = [1,2,3];
            s = 'foo';
            f = function() {};
            n = 10;
            e = document.createElement('p');
        });

        it('should identify arrays', function() {
            var x;
            expect(Mutil.isArray(a)).toBeTruthy();
            expect(Mutil.isArray(s)).toBeFalsy();
            expect(Mutil.isArray(f)).toBeFalsy();
            expect(Mutil.isArray(n)).toBeFalsy();
            expect(Mutil.isArray(x)).toBeFalsy();
            expect(Mutil.isArray(e)).toBeFalsy();
        });

        it('should identify functions', function() {
            var x;
            expect(Mutil.isFunction(a)).toBeFalsy();
            expect(Mutil.isFunction(s)).toBeFalsy();
            expect(Mutil.isFunction(f)).toBeTruthy();
            expect(Mutil.isFunction(n)).toBeFalsy();
            expect(Mutil.isFunction(x)).toBeFalsy();
            expect(Mutil.isArray(e)).toBeFalsy();
        });

        it('should identify strings', function() {
            var x;
            expect(Mutil.isString(a)).toBeFalsy();
            expect(Mutil.isString(s)).toBeTruthy();
            expect(Mutil.isString(f)).toBeFalsy();
            expect(Mutil.isString(n)).toBeFalsy();
            expect(Mutil.isString(x)).toBeFalsy();
            expect(Mutil.isArray(e)).toBeFalsy();
        });

        it('should identify numbers', function() {
            var x;
            expect(Mutil.isNumber(a)).toBeFalsy();
            expect(Mutil.isNumber(s)).toBeFalsy();
            expect(Mutil.isNumber(f)).toBeFalsy();
            expect(Mutil.isNumber(n)).toBeTruthy();
            expect(Mutil.isNumber(x)).toBeFalsy();
            expect(Mutil.isArray(e)).toBeFalsy();
        });

        it('should identify elements', function() {
            var x;
            expect(Mutil.isElement(a)).toBeFalsy();
            expect(Mutil.isElement(s)).toBeFalsy();
            expect(Mutil.isElement(f)).toBeFalsy();
            expect(Mutil.isElement(n)).toBeFalsy();
            expect(Mutil.isElement(x)).toBeFalsy();
            expect(Mutil.isElement(e)).toBeTruthy();
        });

        it('should identify undefined', function() {
            var x;
            expect(Mutil.isUndefined(a)).toBeFalsy();
            expect(Mutil.isUndefined(s)).toBeFalsy();
            expect(Mutil.isUndefined(f)).toBeFalsy();
            expect(Mutil.isUndefined(n)).toBeFalsy();
            expect(Mutil.isUndefined(x)).toBeTruthy();
            expect(Mutil.isUndefined(e)).toBeFalsy();
        });
    });
    describe('Object functions', function() {
        var obj;

        beforeEach(function() {
            obj = { foo: 'bar' }
        });

        describe('tap', function() {
            it('should yield itself', function() {
                Mutil.tap(obj, function(o) {
                    expect(o).toBe(obj);
                });
            });

            it('should return itself', function() {
                expect(Mutil.tap(obj, function() {})).toBe(obj);
            });
        });

        describe('extend', function() {
            var obj2, obj3;

            beforeEach(function() {
                obj2 = { foo: 'baz', qux: 'foo' };
                obj3 = { foo: 'oof' };
            });

            it('should add new properties', function() {
                Mutil.extend(obj, obj2);
                expect(obj.qux).toEqual('foo');
            });

            it('should override existing properties', function() {
                Mutil.extend(obj, obj2);
                expect(obj.foo).toEqual('baz');
            });

            it('should apply multiple other objects in order', function() {
                Mutil.extend(obj, obj2, obj3);
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
            fn = Mutil.bind(fn, context);
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
                expect(Mutil.trim(str)).toEqual('foo bar baz');
            });
        });

        describe('format', function() {
            var template, vars;

            beforeEach(function() {
                template = "Hello, {who}!";
                vars = { who: 'world' };
            });

            it('should replace placeholders with values', function() {
                expect(Mutil.format(template, vars)).toEqual('Hello, world!');
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
                Mutil.forEach(arr, function(el) { i++; });
                expect(i).toEqual(10);
            });

            it('should not invoke the callback when empty', function() {
                var i = 0;
                Mutil.forEach([], function(el) { i++; });
                expect(i).toEqual(0);
            });

            it('should throw a TypeError when not using something iterable', function() {
                expect(function() {
                    Mutil.forEach(true, function() {});
                }).toThrow();
            });

            it('should throw a TypeError when not passed a function', function() {
                expect(function() {
                    Mutil.forEach(arr, 'string');
                }).toThrow();
            });

            it('should loop over properties in an object', function() {
                var i = 0, j ='';
                Mutil.forEach(obj, function(k, v) {
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
                Mutil.forEach(new foo(), function(k, v) {
                    expect(k).not.toEqual('baz');
                });
            });

            it('should bind the callback to a generic context', function() {
                context = { i: 0 };
                Mutil.forEach(arr, function() { this.i++; });
                expect(context.i).toEqual(0);
            });

            it('should bind the callback to a given context', function() {
                context = { i: 0 };
                Mutil.forEach(arr, function() { this.i++; }, context);
                expect(context.i).toEqual(10);
            });

            it('should pass counter and array to callback', function() {
                Mutil.forEach(arr, function(e, i, a) {
                    expect(arr).toContain(e);
                    expect(i).toBeGreaterThan(-1);
                    expect(i).toBeLessThan(10);
                    expect(a).toBe(arr);
                });
            });
        });

        describe('filter', function() {
            it('should return array of found values', function() {
                expect(Mutil.filter(arr, function(e) { return e > 4; }).length).toBe(6);
            });

            it('should return empty array if nothing is found', function() {
                expect(Mutil.filter(arr, function(e) { return false; }).length).toBe(0);
            });

            it('should invoke callback in context', function() {
                context = {};
                Mutil.filter(arr, function(e) {
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
                expect(Mutil.pluck(collection, 'foo')).toEqual(['bar', 'rab']);
            });
        });

        describe('invoke', function() {
            var arr;

            beforeEach(function() {
                arr = ['foo', 'bar'];
            });

            it('should invoke return array of same size as input', function() {
                expect(Mutil.invoke(arr, 'toLowerCase').length).toEqual(arr.length);
            });

            it('should call function on all input elements', function() {
                expect(Mutil.invoke(arr, 'toUpperCase')).toEqual(['FOO', 'BAR']);
            });

            it('should pass along extra parameters to the called function', function() {
                expect(Mutil.invoke(arr, 'substr', 1)).toEqual(['oo', 'ar']);
            });
        });

        describe('map', function() {
            it('should return empty array for empty input', function() {
                expect(Mutil.map([], function() {})).toEqual([]);
            });

            it('should return array of equal size', function() {
                expect(Mutil.map(arr, function() {}).length).toEqual(arr.length);
            });

            it('should apply callback to every element', function() {
                expect(Mutil.map([1,2,3], function(e) { return e * 2; })).toEqual([2,4,6]);
            });
        });

        describe('reduce', function() {
            it('should apply callback to generate single value', function() {
                expect(Mutil.reduce(arr, 0, function(m, e) {
                    return m + e;
                })).toEqual(55);
            });

            it('should bind callbacks to context', function() {
                context = {};
                Mutil.reduce(arr, 0, function() {
                    expect(this).toBe(context);
                }, context);
            });
        });

        describe('include', function() {
            it('should find value in array', function() {
                expect(Mutil.include(arr, 4)).toBeTruthy();
            });

            it('should return false for unfound values', function() {
                expect(Mutil.include(arr, 11)).toBeFalsy();
            });

            it('should not compare via typecasting', function() {
                expect(Mutil.include(arr, '4')).toBeFalsy();
            });
        });
    });
});

