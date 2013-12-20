var DataStructures = {
    stack : function() {                  
        var elements;
        
        this.push = function(element) {
            if (typeof(elements) === 'undefined') {
                elements = [];   
            }                            
            elements.push(element);
        }
        this.pop = function() {
            return elements.pop();
        }
        this.top = function(element) {
            return elements[elements.length - 1];
        }
    }
}

function AstNode(type, params) {
	this.type = type;
	for(var key in params){ this[key] = params[key];}
	return this;
}

function eval(astNode) {
	
	var v;
	switch(astNode.type) {
		case 'function': 
			// Function only has a left branch
			v = eval(astNode.left); 
			break;
		case 'Statement': 
			// Only need to eval the right hand side since thats your return statement
			// The left hand side is either a no op, or the line before that does not matter
			eval(astNode.left); 
			v = eval(astNode.right); 
			break; 
		case 'array':
			// Handle the right hand side of an array declaration
			// Set the values to real values
			var vec = [];
			
			var members = astNode.value;
			for(var i=0;i<members.length;i++) {
				if(!members[i].name) {
					vec.push(members[i].value);
				} else {
					var identifierValue = executionstack.top()[members[i].name];
					if(!members[i].name in executionstack.top()) {
						throw "NameError: name '"+members[i].name+"' is not defined in list declaration\n";
					}
					vec.push(identifierValue);
				}
			}
			v = vec;
			break;
		case 'arrayindex':
			// Handle rhs of a array index value retrieval
			var identifierValue = executionstack.top()[astNode.name];
			if(!astNode.name in executionstack.top()) {
				throw "NameError: name '"+astNode.name+"' is not defined\n";
			}
			v = identifierValue[parseInt(eval(astNode.index))]
			break;
		case 'len':
			// Handle len()
			var identifierValue = executionstack.top()[astNode.name];
			if(!astNode.name in executionstack.top()) {
				throw "NameError: name '"+astNode.name+"' is not defined in list declaration\n";
			}
			
			if(!Array.isArray(identifierValue)) {
				throw "TypeError: object of type '"+(typeof identifierValue)+"' has no len()";
			}
			v = identifierValue.length;
			break; 
		case 'method':
			// Handle list.append(expr) and list.pop(expr)
			var identifierValue = executionstack.top()[astNode.name];
			if(!astNode.name in executionstack.top()) {
				throw "NameError: name '"+astNode.name+"' is not defined in list declaration\n";
			}
			if(!Array.isArray(identifierValue)) {
				throw "AttributeError: '"+(typeof identifierValue)+"' object has no attribute '"+astNode.method+"'";
			}

			if(astNode.method == "append") {
				identifierValue.push(eval(astNode.argument));
			} else if(astNode.method == "pop") {
				identifierValue.pop();				
			} else {
				throw "AttributeError: '"+astNode.name+"' has no method '"+astNode.method+"'";
			}
			
			break;	
		case 'FunctionCall':
			// Get function node and evaluate it
			funcName = astNode.name;
		 	functionNode = functions[funcName];
			if(!funcName in functions) {
				throw "NameError: function named '"+funcName+"' is not defined";
			}
			
			// Match given parameters to function signature in number only (no typing for piethon)
			functionparams = functionNode.parameters;
			callparams = astNode.parameters;
			if(functionparams.length != callparams.length) {
				throw "TypeError: "+funcName+"() takes exactly "+functionparams.length+" arguments ("+callparams.length+" given)";
			}
			
			// New stack with given params included to match signature
			var newstackframe = {};
			for(var i = 0;i<functionparams.length;i++) {
				// If an identifier verify it
				var callpari = callparams[i];
				var funcpari = functionparams[i];
				if(callpari.name) {
					var identifierValue = executionstack.top()[callpari.name];
					if(!callpari.name in executionstack.top()) {
						throw "NameError: name '"+astNode.name+"' is not defined\n";
					}
					newstackframe[funcpari.name] = identifierValue
				} else {
					// Otherwise just set to value
					newstackframe[funcpari.name] = callpari.value;
				}
			}
		
			// Push new stack frame
			executionstack.push(newstackframe);
			// Call function
			v = eval(functionNode);
			
			// Pop, back to old stack frame
			executionstack.pop();
			break;
		case 'if': 
			// If 
			if(eval(astNode.left)) {
				v = eval(astNode.right); 	
			}
			break;
		case 'ifelse': 
			// If-else
			if(eval(astNode.left)) {
				v = eval(astNode.middle); 	
			} else {
				v = eval(astNode.right); 	
			}
			break;
		case 'while': 
			// while
			while(eval(astNode.left)) {
				v = eval(astNode.right); 	
			}
			break;
		case 'IDENT': 
			// Look up value in table
			var identifierValue = executionstack.top()[astNode.name];
			if(!astNode.name in executionstack.top()) {
				throw "NameError: name '"+astNode.name+"' is not defined\n";
			}
			v = identifierValue;
			break;
		case '=':
			// Set value of identifier in table
			if(astNode.left.type == 'arrayindex') {
				var vec2 = executionstack.top()[astNode.left.name];
				vec2[parseInt(eval(astNode.left.index))] = eval(astNode.right);
			} else {
				executionstack.top()[astNode.left.name] = eval(astNode.right);	
			}
			break;
		case '>':
			if(eval(astNode.left) >  eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;
		case '>=':
			if(eval(astNode.left) >=  eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;
		case '<':
			if(eval(astNode.left) <  eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;
		case '<=':
			if(eval(astNode.left) <=  eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;

		case '==':
			if(eval(astNode.left) == eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;	
		case '!=':
			if(eval(astNode.left) != eval(astNode.right)) {
				v = true;
			} else {
				v = false;
			}
			break;			
		case 'no-op': 
			// Do nothing!
		break;
		case 'print':	
			v = eval(astNode.left);
			var strPrint;
			if(Array.isArray(v)) {
				strPrint = '['+v.toString()+']';
			} else {
				strPrint = v;
			}
			// Print 
			jqconsole.Write(strPrint+'\n', 'jqconsole-output');
			break;
		case 'return': v = eval(astNode.left); break; 
		case 'NUMBER': v = astNode.value; break;
		case 'STRING': v = astNode.value.replace(/\"/g,''); break;
		case '+': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = (left + right); 	
			break;
		case '-': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = left - right; 	
			break;
		case '*': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = (left * right); 	
		break;
		case '/': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = (left / right); 	
			break;		
		case '%': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = (left % right); 	
			break;		
		case '**': 
			left = eval(astNode.left);
			right = eval(astNode.right);
			v = Math.pow(left, right); 	
			break;		
		
		case 'UMINUS': v = -1 * eval(astNode.left); break;
		default: throw "internal error: bad node '"+astNode.type+"'";
	}
	return v;
}

function resetForRun() {
	functions = {
		// Pre-create the main function
		'#main#' : new AstNode('function', {name : '#main#'})
	};
}

// The whole program tree
var finalprogram;
// Function map
var functions = {
	// Pre-create the main function
	'#main#' : new AstNode('function', {name : '#main#'})
};
// Execution stack
var executionstack = new DataStructures.stack();
executionstack.push({});