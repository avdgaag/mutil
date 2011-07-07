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

        describe('tap', function() {
            var fn;

            beforeEach(function() {
                fn = function() {};
            });

            it('should yield itself', function() {
                fn.tap(function(o) {
                    expect(o).toBe(fn);
                });
            });

            it('should return itself', function() {
                expect(fn.tap(function() {})).toBe(fn);
            });
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

        describe('toElement', function() {
            it('should throw type error on bad input string', function() {
                expect(function() {
                    '$$$'.toElement();
                }).toThrow();
            });

            it('should parse a simple element', function() {
                var p = 'p'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
            });

            it('should parse text content', function() {
                var p = 'p{foo bar}'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
                expect(p.innerHTML).toEqual('foo bar');
            });

            it('should parse an ID', function() {
                var p = 'p#foo'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
                expect(p.getAttribute('id')).toEqual('foo');
            });

            it('should parse a single class name', function() {
                var p = 'p.foo'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
                expect(p.className).toEqual('foo');
            });

            it('should parse multiple classes', function() {
                var p = 'p.foo.bar'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
                expect(p.className).toEqual('foo bar');
            });

            it('should parse everything in one go', function() {
                var p = 'p#foo.bar.baz{qux}'.toElement();
                expect(p.nodeType).toEqual(1);
                expect(p.tagName.toLowerCase()).toEqual('p');
                expect(p.className).toEqual('bar baz');
                expect(p.innerHTML).toEqual('qux');
                expect(p.getAttribute('id')).toEqual('foo');
            });
        });
    });

    describe('Array functions', function() {
        var arr, obj;

        beforeEach(function() {
            arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            obj = { 'a': 1, 'b': 2, 'c': 3 };
        });

        describe('tap', function() {
            it('should yield itself', function() {
                arr.tap(function(o) {
                    expect(o).toBe(arr);
                });
            });

            it('should return itself', function() {
                expect(arr.tap(function() {})).toBe(arr);
            });
        });

        describe('without', function() {
            beforeEach(function() {
                arr = [1, 2, 3];
            });

            it('should return input array when no arguments given', function() {
                expect(arr.without()).toEqual(arr);
            });

            it('should remove a single element', function() {
                expect(arr.without(2)).toEqual([1,3]);
            });

            it('should remove multiple elements', function() {
                expect(arr.without(2, 3)).toEqual([1]);
            });

            it('should not typecast', function() {
                expect(arr.without('1')).toEqual([1,2,3]);
            });
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
