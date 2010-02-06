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
  end
end

describe 'Mutil'
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
		describe 'by tagname'
			it 'should find by tag'
				$('p.foo').should.have_nodes 1
			end
			
			it 'should find by tag in multiple class names'
				$('p.bar').should.have_nodes 2
			end

			it 'should return an empty array when nothing is found'
			  $('p.foobar').elements.should.be_empty
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
			  $('div p').should.have_nodes 1
			end
			
			it 'should find multiple elements in another'
			  $('div div').should.have_nodes 1
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