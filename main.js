function AstNode(type, params) {
	this.type = type;
	this.params = params;
	
	return this;
}

// Function map
var functions = {};