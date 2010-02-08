describe 'String'
  it 'should remove leading and trailing whitespace with #trim'
    " a \n 	".trim().should.equal 'a'
  end
end

describe 'Array'
  describe 'with some elements'
    before
			arr = ['a', 'b', 'c', 'd']
		end
		
		it 'should yield each element'
		  arr.each(function() {
				this.should.be_a String
			})
		end
		
		it 'should select some elements'
		  var s = arr.select(function() {
				return this == 'a' || this == 'b'
		  })
		  s.should.have_length 2
		end
		
		it 'should return empty when nothing can be selected'
		  var s = arr.select(function() {
				return this == 'e'
		  })
		  s.should.be_empty
			s.should.be_an Array
		end
		
		it 'should accumulate elements with #inject'
		  var x = arr.inject('now: ', function(memo) {
				return memo + this
			})
			x.should.equal 'now: abcd'
		end
		
		it 'should return all element but a few'
		  arr.except('a').should.have_length 3
		  arr.except('a', 'b').should.have_length 2
		  arr.except(['a', 'b']).should.have_length 2
		end
		
		it 'should return true for #any'
		  arr.any().should.be_true
		end
		
		it 'should return for #any with a condition'
		  arr.any(function() { return this == 'a' }).should.be_true
			arr.any(function() { return this == 0   }).should.be_false
		end
		
		it 'should return a boolean for #all'
		  arr.all(function() { return this.length == 1 }).should.be_true
			arr.all(function() { return this == 'a' }).should.be_false
		end

		it 'should map all elements using #collect'
		  var x = arr.collect(function() { return '--' + this })
			x[0].should.equal '--a'
			x[1].should.equal '--b'
			x[2].should.equal '--c'
			x[3].should.equal '--d'
		end
  end

  describe 'with no elements'
    before
			arr = []
		end
		
		it 'should yield nothing'
			var yielded = false
		  arr.each(function() { 
				yielded = true
			})
			yielded.should.be_false
		end
		
		it 'should return itself on selecting'
		  var s = arr.select(function() {
				return this == 'a' || this == 'b'
		  })
		  s.should.be_empty
			s.should.be_an Array
		end
		
		it 'should return the initial value with #inject'
		  var x = arr.inject('now: ', function(memo) {
				return memo + this
			})
			x.should.equal 'now: '
		end
		
		it 'should return itself when using #except'
		  arr.except(1, 2).should.be_empty
		end
		
		it 'should return false for #any'
		  arr.any().should.be_false
		  arr.any(function() { return this > 0 }).should.be_false
		end
		
		it 'should return false for #all'
		  arr.all(function() { return this < 0; }).should.be_false
		end
		
		it 'should return itself for #map'
		  arr.map(function() { return true }).should.be_empty
		end
  end
end

describe 'Mutil'
	describe 'handling functions'
		before
			fn = function() { return 2 + 2; };
		end
		
	  it 'should not return anything'
	    $(fn).elements.should.be_undefined
	  end
	
		it 'should change the window onload function'
			x = window.onload
			window.onload.should.equal x
		  $(fn)
			window.onload.should_not.equal x
		end
	end
	
  describe 'selecting'
	  describe 'by element name'
      it 'should find an element'
        $('p').should.have_nodes 3
				$('div').should.have_nodes 5
      end

			it 'should have no elements when nothing is found'
				$('foo').elements.should.be_empty
			end
    end
		describe 'by classname'
			it 'should find by tag'
				$('p.foo').should.have_nodes 1
			end
			
			it 'should find by class in multiple class names'
				$('p.bar').should.have_nodes 2
			end
			
			it 'should find only elements with all class names'
			  $('p.foo.bar').should.have_nodes 1
			end

			it 'should return an empty array when nothing is found'
			  $('p.foobar').elements.should.be_empty
			end
		end
		
		describe 'by using native objects'
		  it 'should return an array of nodes'
		    $(document.getElementsByTagName('p')).should.have_nodes 3
		  end
		
			it 'should return an empty array for an empty nodelist'
	    	$(document.getElementsByTagName('foo')).elements.should.be_empty
			end
			
			it 'should collect a single element'
	    	$(document.getElementsByTagName('p')[0]).should.have_nodes 1
			end

			it 'should not collect other objects'
	    	-{ $(5) }.should.throw_error
			end
		end
		
		describe 'by ID'
		  it 'should find by existing ID'
		    $('#sandbox').should.have_nodes 1
		  end
		
			it 'should return an empty array when nothing is found'
			  $('#bar').elements.should.be_empty
			end
		end
		
		describe 'by descendant'
			it 'should find one element in another'
			  $('blockquote p').should.have_nodes 1
			end
			
			it 'should find multiple elements in another'
			  $('div div').should.have_nodes 1
			end
			
			it 'should find all elements in another'
			  $('div p').should.have_nodes 3
			end
			
			it 'should return an empty array when nothing is found'
			  $('p div').elements.should.be_empty
			end
		end
		
		describe 'multiple'
		  it 'should select both if found'
		    $('p.foo, p.bar').should.have_nodes 2
		  end
		
			it 'should select one if one is not found'
				$('p.foo, p.bla').should.have_nodes 1
			end
			
			it 'should return an empty array when nothing is found'
			  $('p.bla, p.blabla').elements.should.be_empty
			end
		end
  end
end