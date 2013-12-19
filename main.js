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
	/*	case 'A':
			// Handle the right hand side of an array declaration
			// Set the values to real values
			vec = new std::vector<Primitive>();
			members = *astNode->getMembers();
			for(int i=0;i<members.size();i++) {
				if(members[i].name == "") {
					vec->push_back(members[i].value);
				} else {
					stackitr = executionstack.top().find(members[i].name);
					if(stackitr == executionstack.top().end()) {
						std::cout << "	Semantics error: undefined variables in array declaration" << std::endl;				
						exit (EXIT_FAILURE);
					}
					vec->push_back(executionstack.top()[members[i].name]);
				}
			}
			v = Primitive(vec);
			v.type = ARRAY;
			break;
		case 'arrayindex':
			// Handle rhs of a array index value retrieval
			stackitr = executionstack.top().find(astNode->getName());
			if(stackitr == executionstack.top().end()) {
				std::cout << "	Semantics error: list named " << astNode->getName() << " not defined" << std::endl;				
				exit (EXIT_FAILURE);
			}
			
			vec2 = *(executionstack.top()[astNode->getName()].array);
			v = vec2[(int)eval(astNode.left).value];
			break;
		case 'l':
			// Handle len()
			stackitr = executionstack.top().find(astNode->getName());
			if(stackitr == executionstack.top().end()) {
				std::cout << "	Semantics error: list named " << astNode->getName() << " not defined" << std::endl;				
				exit (EXIT_FAILURE);
			}
			if(executionstack.top()[astNode->getName()].type != ARRAY) {
				std::cout << "	Semantics error: " << astNode->getName() << " is not a list, cant call len()" << std::endl;				
				exit (EXIT_FAILURE);
			}
			vec2 = *(executionstack.top()[astNode->getName()].array);
			v = Primitive((int)vec2.size());
			break;
		case 'm':
			// Handle list.append(expr) and list.pop(expr)
			stackitr = executionstack.top().find(astNode->getName());
			if(stackitr == executionstack.top().end()) {
				std::cout << "	Semantics error: list named " << astNode->getName() << " not defined" << std::endl;				
				exit (EXIT_FAILURE);
			}
			if(executionstack.top()[astNode->getName()].type != ARRAY) {
				std::cout << "	Semantics error: " << astNode->getName() << " is not a list, cant call append()" << std::endl;				
				exit (EXIT_FAILURE);
			}
			if(astNode->getMethod() == "append") {
				executionstack.top()[astNode->getName()].array->push_back(eval(astNode.left));
			} else if(astNode->getMethod() == "pop") {
				executionstack.top()[astNode->getName()].array->pop_back();
			} else {
				std::cout << "	Semantics error: " << astNode->getMethod()  << " method not supported" << std::endl;				
				exit (EXIT_FAILURE);
			}
			
			break;	*/
		case 'FunctionCall':
			// Get function node and evaluate it
			funcName = astNode.name;
		 	functionNode = functions[funcName];
			if(!functionNode) {
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
					if(!identifierValue) {
						throw "NameError: name '"+astNode.name+"' is not defined\n";
					}
					newstackframe[funcpari.name] = executionstack.top()[callpari.name];
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
			if(!identifierValue) {
				throw "NameError: name '"+astNode.name+"' is not defined\n";
			}
			v = identifierValue;
			break;
		case '=':
			// Set value of identifier in table
			if(astNode.left.type == 'arrayindex') {
				var vec2 = executionstack.top()[astNode.left.name].value;
				vec2[parseInt(eval(astNode.left.left))] = eval(astNode.right);
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