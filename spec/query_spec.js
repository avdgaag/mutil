describe('Mutil', function() {
    describe('DOM querying', function() {
        var content, p, id, child1, child2, single_class, multiple_class;

        content = document.createElement('div');
        p = document.createElement('p');
        p.className = 'foo';
        id = document.createElement('abbr');
        id.setAttribute('id', 'el-with-id');
        id.className = 'foo';
        child1 = document.createElement('span');
        child2 = document.createElement('span');
        p.appendChild(child1);
        id.appendChild(child2);
        single_class = document.createElement('form');
        single_class.className = 'foo';
        multiple_class = document.createElement('table');
        multiple_class.className = 'foo bar baz';
        content.appendChild(multiple_class);
        content.appendChild(single_class);
        content.appendChild(p);
        content.appendChild(id);

        beforeEach(function() {
            document.body.appendChild(content);
        });

        afterEach(function() {
            document.body.removeChild(content);
        });

        it('should find an element by name', function() {
            expect(Mutil.query('p')).toEqual([p]);
        });

        it('should find an element by ID', function() {
            expect(Mutil.query('#el-with-id')).toEqual([id]);
        });

        it('should find all elements by class', function() {
            expect(Mutil.query('.foo')).toEqual([multiple_class, single_class, p, id]);
        });

        it('should find an element by name and class', function() {
            expect(Mutil.query('form.foo')).toEqual([single_class]);
        });

        it('should find an element by id and class', function() {
            expect(Mutil.query('#el-with-id.foo')).toEqual([id]);
        });

        it('should find element with multiple classes', function() {
            expect(Mutil.query('table.foo.bar')).toEqual([multiple_class]);
            expect(Mutil.query('table.baz.bar')).toEqual([multiple_class]);
            expect(Mutil.query('table.foo')).toEqual([multiple_class]);
        });

        it('should find child elements', function() {
            expect(Mutil.query('p span')).toEqual([child1]);
        });

        it('should find multiple elements', function() {
            expect(Mutil.query('p, #el-with-id')).toEqual([p, id]);
        });

        it('should scope query to another element', function() {
            expect(Mutil.query('span', p)).toEqual([child1]);
        });

        it('should scope query to other elements', function() {
            expect(Mutil.query('span', [p, id])).toEqual([child1, child2]);
        });
    });
});
