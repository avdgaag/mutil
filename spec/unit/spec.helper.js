JSpec.addMatchers({
	be_node: {
		match: function(actual, expected) {
			return (
				actual.nodeName && 
				actual.nodeType && 
				actual.nodeType == 1
			);
		}
	},
	have_nodes: {
		match: function(actual, expected) {
			if(!actual.elements) return false;
			if(!actual.elements.length) return false;
			if(actual.elements.length != expected) return false;
			var all_nodes = true;
			for(i = 0; i < expected; i++) {
				all_nodes = all_nodes && actual.elements[i].nodeName;
				all_nodes = all_nodes && actual.elements[i].nodeType;
				all_nodes = all_nodes && actual.elements[i].nodeType == 1;
			}
			return all_nodes;
		}
	}
});