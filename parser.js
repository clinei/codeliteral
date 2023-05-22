// nocheckin
// reorder everything according to this
const Code_Kind = {
	INTEGER: "integer",
	FLOAT: "float",
	BOOL: "bool",
	CHAR: "char",
	STRING: "string",
	ARRAY_LITERAL: "array literal",
	STRUCT_LITERAL: "struct literal",
	STRUCT_LITERAL_ELEMENT: "struct literal element",
	IDENT: "ident",
	DECLARATION: "declaration",
	ASSIGN: "assign",
	OPASSIGN: "opassign",
	ENUM_DEFINITION: "enum definition",
	STRUCT_DEFINITION: "struct definition",
	PROCEDURE_DEFINITION: "procedure definition",
	OPERATOR: "operator",
	// nocheckin
	// turn this into a binary operation
	DOT_OPERATOR: "dot operator",
	BINARY_OPERATION: "binop",
	INCREMENT: "increment",
	DECREMENT: "decrement",
	MINUS: "minus",
	NOT: "not",
	PARENS: "parens",
	REFERENCE: "reference",
	DEREFERENCE: "dereference",
	CAST: "cast",
	ARRAY_INDEX: "array index",
	KEYWORD: "keyword",
	IF: "if",
	ELSE: "else",
	WHILE: "while",
	FOR: "for",
	INTEGER_SET: "integer set",
	BREAK: "break",
	CONTINUE: "continue",
	CALL: "call",
	RETURN: "return",
	SYSCALL: "syscall",
	POINTER_TYPE: "pointer type",
	ARRAY_TYPE: "array type",
	STATEMENT: "statement",
	BLOCK: "block",
	DELIMITED: "delimited",
	SCOPE: "scope",
};

const Code_Node = {
	kind: null,
	type: null,
	serial: null,
	token_begin: 0,
	token_end: 0,
	file: null,
	run_silent: false,
	run_disable: false,
	is_lhs: false,
	enclosing_scope: null,
	was_generated: false,
	generated_from: null,
	needs_semicolon_in_declaration: true,
	needs_semicolon_in_statement: true,
	replacement: null,
	replacement_of: null,
	result: null,
	result_of: null,
	argument_of: null,
	clone_of: null,
	show: true,
	expand: true,
};
let next_node_serial = 0;
function make_node() {
	let base = Object.assign({}, Code_Node);
	base.serial = next_node_serial;
	// nocheckin
	if (base.serial == 204) {
		// debugger;
	}
	next_node_serial += 1;
	return base;
}

const Code_Scope = {
	base: null,
	block: null,
	belongs_to: null,
	declarations: null,
	is_implicit: false,
	is_argument_scope: false,
};
function make_scope() {
	let node = Object.assign({}, Code_Scope);
	node.base = make_node();
	node.base.kind = Code_Kind.SCOPE;

	node.declarations = new Array();

	return node;
}

const Code_Integer = {
	base: null,
	value: null,
};
function make_integer(value) {
	let node = Object.assign({}, Code_Integer);
	node.base = make_node();
	node.base.kind = Code_Kind.INTEGER;
	node.value = value;
	return node;
}

const Code_Float = {
	base: null,
	value: null,
};
function make_float(value) {
	let node = Object.assign({}, Code_Float);
	node.base = make_node();
	node.base.kind = Code_Kind.FLOAT;
	node.base.type = primitive_type_infos.float;
	node.value = value;
	return node;
}

const Code_Bool = {
	base: null,
	value: null,
};
function make_bool(value) {
	let node = Object.assign({}, Code_Bool);
	node.base = make_node();
	node.base.kind = Code_Kind.BOOL;
	node.base.type = primitive_type_infos.bool;
	node.value = value ? true : false;
	return node;
}

const Code_Char = {
	base: null,
	value: null,
};
function make_char(value) {
	let node = Object.assign({}, Code_Char);
	node.base = make_node();
	node.base.kind = Code_Kind.CHAR;
	node.base.type = primitive_type_infos.char;
	node.value = value;
	return node;
}

const Code_String = {
	base: null,
	str: "",
	value: null,
};
let strings = [];
function make_string(str) {
	let node = Object.assign({}, Code_String);
	node.base = make_node();
	node.base.kind = Code_Kind.STRING;
	node.base.type = primitive_type_infos.string;
	node.str = str;
	if (code_composed != true) {
		strings.push(node);
	}
	return node;
}

const Code_Array_Literal = {
	base: null,
	type: null,
	delimited: null,
};
function make_array_literal(type, delimited) {
	let node = Object.assign({}, Code_Array_Literal);
	node.base = make_node();
	node.base.kind = Code_Kind.ARRAY_LITERAL;

	node.type = type;
	node.delimited = delimited;

	return node;
}

const Code_Struct_Literal = {
	base: null,
	type: null,
	delimited: null,
};
function make_struct_literal(type, delimited) {
	let node = Object.assign({}, Code_Struct_Literal);
	node.base = make_node();
	node.base.kind = Code_Kind.STRUCT_LITERAL;
	node.base.type = type;

	node.type = type;
	node.delimited = delimited;

	return node;
}

const Code_Struct_Literal_Element = {
	base: null,
	ident: null,
	expression: null,
};
function make_struct_literal_element(ident, expression) {
	let node = Object.assign({}, Code_Struct_Literal_Element);
	node.base = make_node();
	node.base.kind = Code_Kind.STRUCT_LITERAL_ELEMENT;

	node.ident = ident;
	node.expression = expression;

	return node;
}

const Code_Declaration = {
	base: null,
	ident: null,
	type: null,
	expression: null,
	type_operator: null,
	expression_operator: null,
};
function make_declaration(ident, type, expression = null, type_operator = null, expression_operator = null) {
	let node = Object.assign({}, Code_Declaration);
	node.base = make_node();
	node.base.kind = Code_Kind.DECLARATION;

	node.ident = ident;
	node.type = type;
	node.expression = expression;
	node.type_operator = type_operator;
	node.expression_operator = expression_operator;

	if (node.type != null) {
		if (node.type_operator == null) {
			node.type_operator = make_operator(":");
		}
	}
	if (node.expression != null) {
		node.base.needs_semicolon_in_statement = node.expression.base.needs_semicolon_in_statement;
		if (node.expression_operator == null) {
			node.expression_operator = make_operator("=");
		}
	}

	node.ident.declaration = node;

	return node;
}

const Code_Ident = {
	base: null,
	name: null,
	declaration: null,
	tokens: null,
};
function make_ident(name, tokens = null) {
	let node = Object.assign({}, Code_Ident);
	node.base = make_node();
	node.base.kind = Code_Kind.IDENT;

	node.name = name;
	node.tokens = tokens;

	if (node.name == null) {
		if (node.tokens != null) {
			node.name = "";
			for (let token of tokens) {
				if (token.kind == Token_Kind.IDENT) {
					node.name += token.str;
				}
			}
		}
		else {
			throw Error("make_ident: could not infer name");
		}
	}
	if (node.tokens == null) {
		node.tokens = new Array();
		let text = node.name;
		let token = make_token(Token_Kind.IDENT, 0, text.length, text);
		node.tokens.push(token);
	}

	return node;
}

const Code_Assign = {
	base: null,
	target: null,
	operator: null,
	expression: null,
};
function make_assign(target, expression, operator) {
	let node = Object.assign({}, Code_Assign);
	node.base = make_node();
	node.base.kind = Code_Kind.ASSIGN;

	node.target = target;
	node.expression = expression;
	node.operator = operator;

	if (node.operator == null) {
		node.operator = make_operator("=");
	}

	return node;
}

const Code_OpAssign = {
	base: null,
	target: null,
	expression: null,
	operator: null,
};
function make_opassign(target, expression, operator) {
	let node = Object.assign({}, Code_OpAssign);
	node.base = make_node();
	node.base.kind = Code_Kind.OPASSIGN;

	node.target = target;
	node.expression = expression;
	node.operator = operator;

	return node;
}

const Code_Reference = {
	base: null,
	expression: null,
};
function make_reference(expression) {
	let node = Object.assign({}, Code_Reference);
	node.base = make_node();
	node.base.kind = Code_Kind.REFERENCE;
	node.expression = expression;
	return node;
}

const Code_Dereference = {
	base: null,
	expression: null,
};
function make_dereference(expression) {
	let node = Object.assign({}, Code_Dereference);
	node.base = make_node();
	node.base.kind = Code_Kind.DEREFERENCE;
	node.expression = expression;
	return node;
}

const Code_Cast = {
	base: null,
	expression: null,
	target_type: null,
	is_implicit: null,
};
function make_cast(target_type, expression) {
	let node = Object.assign({}, Code_Cast);
	node.base = make_node();
	node.base.kind = Code_Kind.CAST;

	node.expression = expression;
	node.target_type = target_type;

	return node;
}

const Code_Array_Index = {
	base: null,
	target: null,
	index: null,
	delimited: null,
};
function make_array_index(target, index, delimited = null) {
	let node = Object.assign({}, Code_Array_Index);
	node.base = make_node();
	node.base.kind = Code_Kind.ARRAY_INDEX;

	node.target = target;
	node.index = index;
	node.delimited = delimited;

	return node;
}

const Code_Dot_Operator = {
	base: null,
	left: null,
	right: null,
	operator: null,
};
function make_dot_operator(left, right, operator) {
	let node = Object.assign({}, Code_Dot_Operator);
	node.base = make_node();
	node.base.kind = Code_Kind.DOT_OPERATOR;

	node.left = left;
	node.right = right;
	node.operator = operator;

	if (node.operator == null) {
		node.operator = make_operator(".");
	}

	return node;
}

const Code_Block = {
	base: null,
	statements: null,
	delimited: null,
	prev_if_stmt: null,
	allocations: null,
};
function make_block(statements = null, delimited = null) {
	let node = Object.assign({}, Code_Block);
	node.base = make_node();
	node.base.kind = Code_Kind.BLOCK;
	node.base.needs_semicolon_in_statement = false;

	if (statements == null) {
		if (delimited != null) {
			statements = new Array();
			for (let elem of delimited.elements) {
				statements.push(elem);
			}
		}
		else if (delimited == null) {
			statements = new Array();
			let begin_operator = make_operator("{");
			let separator_operator = null;
			let end_operator = make_operator("}");
			delimited = make_delimited(statements, begin_operator, separator_operator, end_operator);
		}
	}
	else {
		if (delimited == null) {
			let begin_operator = make_operator("{");
			let separator_operator = null;
			let end_operator = make_operator("}");
			delimited = make_delimited(statements, begin_operator, separator_operator, end_operator);
		}
	}

	node.statements = statements;
	node.delimited = delimited;

	return node;
}

const Code_Statement = {
	base: null,
	expression: null,
	needs_semicolon: true,
	should_indent: true,
};
function make_statement(expression) {
	let node = Object.assign({}, Code_Statement);
	node.base = make_node();
	node.base.kind = Code_Kind.STATEMENT;

	node.expression = expression;

	node.needs_semicolon = node.expression.base.needs_semicolon_in_statement;

	return node;
}

const Code_Enum_Definition = {
	base: null,
	members: null,
	is_flags: false,
};
function make_enum_definition(members) {
	let node = Object.assign({}, Code_Enum_Definition);
	node.base = make_node();
	node.base.kind = Code_Kind.ENUM_DEFINITION;
	node.base.needs_semicolon_in_statement = false;
	node.members = members;
	node.base.run_disable = true;
	return node;
}

const Code_Struct_Definition = {
	base: null,
	block: null,
};
function make_struct_definition(block) {
	let node = Object.assign({}, Code_Struct_Definition);
	node.base = make_node();
	node.base.kind = Code_Kind.STRUCT_DEFINITION;
	node.base.needs_semicolon_in_statement = false;
	node.block = block;
	node.base.run_disable = true;
	return node;
}

const Code_Procedure_Definition = {
	base: null,
	parameters: null,
	operator: null,
	returns: null,
	block: null,
};
function make_procedure_definition(parameters, operator, returns, block) {
	let node = Object.assign({}, Code_Procedure_Definition);
	node.base = make_node();
	node.base.kind = Code_Kind.PROCEDURE_DEFINITION;
	node.base.needs_semicolon_in_statement = false;

	node.parameters = parameters;
	node.returns = returns;
	node.operator = operator;
	node.block = block;

	node.scope = make_scope();

	return node;
}

const Code_If = {
	base: null,
	condition: null,
	statement: null,
	keyword: null,
	then_keyword: null,
	else_stmt: null,
};
function make_if(condition, statement, keyword = null, then_keyword = null) {
	let node = Object.assign({}, Code_If);
	node.base = make_node();
	node.base.kind = Code_Kind.IF;
	node.base.needs_semicolon_in_statement = false;

	if (keyword == null) {
		keyword = make_keyword("if");
	}

	node.condition = condition;
	node.statement = statement;
	node.keyword = keyword;
	node.then_keyword = then_keyword;

	return node;
}

const Code_Else = {
	base: null,
	statement: null,
	keyword: null,
	if_stmt: null,
};
function make_else(statement, keyword = null) {
	let node = Object.assign({}, Code_Else);
	node.base = make_node();
	node.base.kind = Code_Kind.ELSE;
	node.base.needs_semicolon_in_statement = false;

	if (keyword == null) {
		keyword = make_keyword("else");
	}

	node.keyword = keyword;
	node.statement = statement;

	return node;
}

const Code_While = {
	base: null,
	condition: null,
	statement: null,
	keyword: null,
};
function make_while(condition, statement, keyword = null) {
	let node = Object.assign({}, Code_While);
	node.base = make_node();
	node.base.kind = Code_Kind.WHILE;
	node.base.needs_semicolon_in_statement = false;

	if (keyword == null) {
		keyword = make_keyword("while");
	}

	node.keyword = keyword;
	node.condition = condition;
	node.statement = statement;

	return node;
}

const Code_For = {
	base: null,
	set: null,
	statement: null,
	keyword: null,
	scope: null,
};
function make_for(set, statement, keyword = null) {
	let node = Object.assign({}, Code_For);
	node.base = make_node();
	node.base.kind = Code_Kind.FOR;
	node.base.needs_semicolon_in_statement = false;

	node.set = set;
	node.statement = statement;
	node.keyword = keyword;

	if (node.keyword == null) {
		node.keyword = make_keyword("for");
	}

	node.scope = make_scope();

	return node;
}

const Code_Integer_Set = {
	base: null,
	begin_it: null,
	end_it: null,
	separator: null,
};
function make_integer_set(begin_it, end_it, separator = null) {
	let node = Object.assign({}, Code_Integer_Set);
	node.base = make_node();
	node.base.kind = Code_Kind.INTEGER_SET;

	node.begin_it = begin_it;
	node.end_it = end_it;
	node.separator = separator;

	if (node.separator == null) {
		node.separator = make_operator("..");
	}

	return node;
}

const Code_Break = {
	base: null,
	keyword: null,
};
function make_break(keyword = null) {
	let node = Object.assign({}, Code_Break);
	node.base = make_node();
	node.base.kind = Code_Kind.BREAK;

	if (keyword == null) {
		keyword = make_keyword("break");
	}
	node.keyword = keyword;

	return node;
}

const Code_Continue = {
	base: null,
	keyword: null,
};
function make_continue(keyword = null) {
	let node = Object.assign({}, Code_Continue);
	node.base = make_node();
	node.base.kind = Code_Kind.CONTINUE;

	if (keyword == null) {
		keyword = make_keyword("continue");
	}
	node.keyword = keyword;

	return node;
}

const Code_Return = {
	base: null,
	expression: null,
	keyword: null,
};
function make_return(expression, keyword = null) {
	let node = Object.assign({}, Code_Return);
	node.base = make_node();
	node.base.kind = Code_Kind.RETURN;

	node.expression = expression;
	// nocheckin
	// why do we need this?
	node.clone_of = node;

	if (keyword == null) {
		keyword = make_keyword("return");
	}
	node.keyword = keyword;

	return node;
}

const Code_Minus = {
	base: null,
	expression: null,
};
function make_minus(expression) {
	let node = Object.assign({}, Code_Minus);
	node.base = make_node();
	node.base.kind = Code_Kind.MINUS;
	node.expression = expression;
	return node;
}

const Code_Not = {
	base: null,
	expression: null,
};
function make_not(expression) {
	let node = Object.assign({}, Code_Not);
	node.base = make_node();
	node.base.kind = Code_Kind.NOT;
	node.expression = expression;
	return node;
}

const Code_Increment = {
	base: null,
	target: null,
};
function make_increment(target, operator = null) {
	let node = Object.assign({}, Code_Increment);
	node.base = make_node();
	node.base.kind = Code_Kind.INCREMENT;
	node.target = target;
	if (node.operator == null) {
		node.operator = make_operator("++");
	}
	return node;
}

const Code_Decrement = {
	base: null,
	target: null,
};
function make_decrement(target, operator = null) {
	let node = Object.assign({}, Code_Decrement);
	node.base = make_node();
	node.base.kind = Code_Kind.DECREMENT;
	node.target = target;
	if (node.operator == null) {
		node.operator = make_operator("--");
	}
	return node;
}

const Code_Binary_Operation = {
	base: null,
	left: null,
	right: null,
	operator: null,
};
function make_binary_operation(left, operator, right) {
	let node = Object.assign({}, Code_Binary_Operation);
	node.base = make_node();
	node.base.kind = Code_Kind.BINARY_OPERATION;

	node.left = left;
	node.operator = operator;
	node.right = right;

	return node;
}

const Code_Operator = {
	base: null,
	str: "",
};
function make_operator(str) {
	let node = Object.assign({}, Code_Operator);
	node.base = make_node();
	node.base.kind = Code_Kind.OPERATOR;
	node.str = str;
	return node;
}

const Code_Parens = {
	base: null,
	expression: null,
	delimited: null,
};
function make_parens(expression, delimited = null) {
	let node = Object.assign({}, Code_Parens);
	node.base = make_node();
	node.base.kind = Code_Kind.PARENS;

	node.expression = expression;
	node.delimited = delimited;

	if (node.delimited == null) {
		node.delimited = make_delimited([expression], "(", "", ")");
	}
	else if (node.expression == null) {
		node.expression = node.delimited.elements[0];
	}

	return node;
}

const Code_Call = {
	base: null,
	procedure: null,
	args: null,
	returned: false,
	block: null,
};
function make_call(procedure, args) {
	let node = Object.assign({}, Code_Call);
	node.base = make_node();
	node.base.kind = Code_Kind.CALL;

	if (args == null) {
		let elements = new Array();
		let begin_operator = make_operator("(");
		let separator_operator = make_operator(",");
		let end_operator = make_operator(")");
		args = make_delimited(elements, begin_operator, separator_operator, end_operator);
	}

	node.procedure = procedure;
	node.args = args;

	return node;
}

const Code_Syscall = {
	base: null,
	id: null,
	parameters: null,
	returns: null,
};
function make_syscall(id, parameters, returns) {
	let node = Object.assign({}, Code_Syscall);
	node.base = make_node();
	node.base.kind = Code_Kind.SYSCALL;

	node.id = id;
	node.parameters = parameters ? parameters : [];
	node.returns = returns ? returns : [];

	return node;
}

const Code_Pointer_Type = {
	base: null,
	elem_type: null,
	operator: null,
};
function make_pointer_type(elem_type, operator = null) {
	let node = Object.assign({}, Code_Pointer_Type);
	node.base = make_node();
	node.base.kind = Code_Kind.POINTER_TYPE;

	if (operator == null) {
		operator = make_operator("*");
	}

	node.elem_type = elem_type;
	node.operator = operator;

	return node;
}

const Code_Array_Type = {
	base: null,
	size: null,
	elem_type: null,
	begin_operator: null,
	end_operator: null,
};
function make_array_type(size, elem_type, begin_operator = null, end_operator = null) {
	let node = Object.assign({}, Code_Array_Type);
	node.base = make_node();
	node.base.kind = Code_Kind.ARRAY_TYPE;

	if (begin_operator == null) {
		begin_operator = make_operator("[");
	}
	if (end_operator == null) {
		end_operator = make_operator("]");
	}

	node.size = size;
	node.elem_type = elem_type;
	node.begin_operator = begin_operator;
	node.end_operator = end_operator;

	return node;
}

const Code_Delimited = {
	base: null,
	scope: null,
	elements: null,
	begin: null,
	separator: null,
	end: null,
	first_element: null,
	all_separators: null,
	last_element: null,
	is_implicit: false,
};
function make_delimited(elements, begin = null, separator = null, end = null) {
	let node = Object.assign({}, Code_Delimited);
	node.base = make_node();
	node.base.kind = Code_Kind.DELIMITED;

	node.elements = elements;
	node.begin = begin;
	node.separator = separator;
	node.end = end;

	node.scope = make_scope();

	update_delimited(node);

	return node;
}
function update_delimited(node) {
	node.all_separators = new Array();
	if (node.separator == null) {
		return;
	}
	if (node.elements.length > 0) {
		node.first_element = node.elements[0];
		node.last_element = node.elements[node.elements.length - 1];
		if (node.separator != null) {
			for (let elem of node.elements) {
				let new_separator = make_operator(node.separator.str);
				// nocheckin
				// this is not entirely correct
				new_separator.base.token_begin = elem.base.token_end;
				new_separator.base.token_end = elem.base.token_end;
				new_separator.base.file = elem.base.file;
				node.all_separators.push(new_separator);
			}
		}
	}
	// nocheckin
	// @Cleanup
	/*
	if (node.elements.length > 0) {
		node.first_element = node.elements[0];
		node.last_element = node.elements[node.elements.length - 1];
		let separator_str = "";
		if (node.separator != null) {
			separator_str = node.separator.str;
		}
		if (node.first_element.base.kind == Code_Kind.STATEMENT) {
			// statements will deal with their own separator
			separator_str = "";
		}
		for (let elem of node.elements) {
			let new_separator = null;
			if (separator_str != "") {
				new_separator = make_operator(separator_str);
				// nocheckin
				// this is not entirely correct
				new_separator.base.token_begin = elem.base.token_end;
				new_separator.base.token_end = elem.base.token_end;
				new_separator.base.file = elem.base.file;
			}
			node.all_separators.push(new_separator);
		}
	}
	*/
}

const Code_Keyword = {
	base: null,
	str: "",
};
function make_keyword(str) {
	let node = Object.assign({}, Code_Keyword);
	node.base = make_node();
	node.base.kind = Code_Kind.KEYWORD;

	node.str = str;

	return node;
}

function parse(file) {
	// @Todo
	// use enum
	const operator_precedence = {
		// ",": 15,
		// "=": 14,
		// ternary 13
		"||": 12,
		"&&": 11,
		"|": 10,
		"^": 9,
		"&": 8,
		"==": 7, "!=": 7,
		">": 6, ">=": 6, "<": 6, "<=": 6,
		"+": 4, "-": 4,
		"*": 3, "/": 3, "%": 3,
	};
	const MAX_PRECEDENCE = 99;
	let prev_prec = MAX_PRECEDENCE;
	const binary_ops = Object.getOwnPropertyNames(operator_precedence);
	function maybe_binary(left) {
		if (file.tokens[file.token_index].str != ";") {
			let prev_index = file.token_index;
			let operator_lookahead = parse_operator();
			file.token_index = prev_index;
			let curr_prec = operator_precedence[operator_lookahead.str];
			if (curr_prec && curr_prec < prev_prec) {
				let operator = parse_operator();
				let temp_prec = prev_prec;
				prev_prec = curr_prec;
				let right = maybe_binary(parse_expression());
				prev_prec = temp_prec;
				let binop = make_binary_operation(left, operator, right);
				binop.base.token_begin = left.base.token_begin;
				binop.base.token_end = right.base.token_end;
				binop.base.file = file;
				return maybe_binary(binop);
			}
		}
		return left;
	}
	function parse_statement() {
		parse_dirty();
		let start_index = file.token_index;
		prev_prec = MAX_PRECEDENCE;
		let expression = null;
		if (file.tokens[file.token_index].str == ";") {
			let result = make_statement(null);
			file.token_index += 1;
			result.base.token_begin = start_index;
			result.base.token_end = file.token_index;
			result.base.file = file;
			return result;
		}
		else if (file.tokens[file.token_index].str == "{") {
			expression = parse_block();
		}
		else if (file.tokens[file.token_index].kind == Token_Kind.IDENT) {
			let keyword = file.tokens[file.token_index];
			if (keyword.str == "if") {
				expression = parse_if();
			}
			else if (keyword.str == "else") {
				expression = parse_else();
			}
			else if (keyword.str == "while") {
				expression = parse_while();
			}
			else if (keyword.str == "for") {
				expression = parse_for();
			}
			else if (keyword.str == "continue") {
				expression = parse_continue();
			}
			else if (keyword.str == "break") {
				expression = parse_break();
			}
			else if (keyword.str == "return") {
				expression = parse_return();
			}
		}
		if (expression == null) {
			expression = parse_expression();
			parse_dirty();
			if (file.tokens[file.token_index].str != ";") {
				let operator = parse_operator();
				if (operator.str[0] == ":") {
					expression = parse_declaration_with_ident_and_type_operator(expression, operator);
				}
				else if (operator.str == "=") {
					expression = parse_assign_with_target_and_operator(expression, operator);
				}
				else if (operator.str[operator.str.length-1] == "=") {
					expression = parse_opassign_with_target_and_operator(expression, operator);
				}
			}
		}
		if (expression.base.needs_semicolon_in_statement) {
			parse_dirty();
			if (file.tokens[file.token_index].str != ";") {
				throw Error("parse_statement: missing semicolon ';'");
			}
			file.token_index += 1;
		}
		let result = make_statement(expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_keyword() {
		parse_dirty();
		let start_index = file.token_index;
		let curr_token = file.tokens[file.token_index];
		if (curr_token.kind != Token_Kind.IDENT) {
			throw Error("parse_keyword: unexpected token kind '" + curr_token.kind + "'");
		}
		let result = make_keyword(curr_token.str);
		curr_token.extra_kind = Extra_Token_Kind.KEYWORD;
		file.token_index += 1;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_if() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let condition = parse_expression();
		let then_keyword = null;
		let then_lookahead_prev_index = file.token_index;
		parse_dirty();
		if (file.tokens[file.token_index].str == "then") {
			then_keyword = parse_keyword();
		}
		else {
			file.token_index = then_lookahead_prev_index;
		}
		let statement = parse_statement();
		if (then_keyword == null && statement.expression.base.kind != Code_Kind.BLOCK) {
			throw Error("parse_if: single statement requires 'then' keyword");
		}
		let result = make_if(condition, statement, keyword, then_keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_else() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let statement = parse_statement();
		let result = make_else(statement, keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_while() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let condition = parse_expression();
		let statement = parse_statement();
		let result = make_while(condition, statement, keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_for() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let set = parse_set();
		let statement = parse_statement();
		let result = make_for(set, statement, keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_set() {
		parse_dirty();
		let start_index = file.token_index;
		let result = null;
		let left = parse_expression();
		let operator = parse_operator();
		let right = parse_expression();
		if (operator.str == "..") {
			result = make_integer_set(left, right, operator);
		}
		else if (operator.str == ":") {
			throw Error("parse_set: named iterators are not yet supported");
			// @Incomplete
			// nocheckin
			// also need to handle the renaming of it_index
			result = make_named_set();
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_continue() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let result = make_continue(keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_break() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let result = make_break(keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_return() {
		parse_dirty();
		let start_index = file.token_index;
		let keyword = parse_keyword();
		let expression = parse_expression();
		let result = make_return(expression, keyword);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_expression() {
		parse_dirty();
		let start_index = file.token_index;
		let result = null;
		if (file.tokens[file.token_index].str == "(") {
			result = parse_parens();
		}
		else if (file.tokens[file.token_index].str == "-") {
			result = parse_minus();
		}
		else if (file.tokens[file.token_index].str == "!") {
			result = parse_not();		}
		else if (file.tokens[file.token_index].kind == Token_Kind.DIGITS) {
			result = parse_integer_or_float();
		}
		else if (file.tokens[file.token_index].str == "true") {
			result = parse_bool();
		}
		else if (file.tokens[file.token_index].str == "false") {
			result = parse_bool();
		}
		else if (file.tokens[file.token_index].kind == Token_Kind.CHAR_START) {
			result = parse_char();
		}
		else if (file.tokens[file.token_index].kind == Token_Kind.STRING_START) {
			result = parse_string();
		}
		else if (file.tokens[file.token_index].str == "[") {
			result = parse_array_literal();
		}
		else if (file.tokens[file.token_index].str == "{") {
			result = parse_struct_literal();
		}
		else if (file.tokens[file.token_index].str == "&") {
			result = parse_reference();
		}
		else if (file.tokens[file.token_index].str == "*") {
			result = parse_dereference();
		}
		else if (file.tokens[file.token_index].str == "cast") {
			result = parse_cast();
		}
		else if (file.tokens[file.token_index].kind == Token_Kind.IDENT) {
			result = parse_ident();
		}
		result.base.file = file;
		result = maybe_parse_expression_operation(result);
		parse_dirty();
		if (file.tokens[file.token_index].str != ";") {
			let operator_lookahead_prev_index = file.token_index;
			let operator_lookahead = parse_operator();
			file.token_index = operator_lookahead_prev_index;
			if (binary_ops.indexOf(operator_lookahead.str) >= 0) {
				result = maybe_binary(result);
			}
		}
		file.token_index = result.base.token_end;
		return result;
	}
	function parse_parens() {
		parse_dirty();
		let start_index = file.token_index;
		let temp_prec = prev_prec;
		prev_prec = MAX_PRECEDENCE;
		let delimited = parse_delimited(parse_expression, "(", "", ")", 0, 1);
		prev_prec = temp_prec;
		let result = make_parens(null, delimited);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_minus() {
		parse_dirty();
		let start_index = file.token_index;
		if (file.tokens[file.token_index].str != "-") {
			throw Error("parse_minus: expected '-'");
		}
		file.token_index += 1;
		let temp_prec = prev_prec;
		prev_prec = 0;
		let expression = parse_expression();
		prev_prec = temp_prec;
		let result = make_minus(expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_not() {
		parse_dirty();
		let start_index = file.token_index;
		if (file.tokens[file.token_index].str != "!") {
			throw Error("parse_not: expected '!'");
		}
		file.token_index += 1;
		let temp_prec = prev_prec;
		prev_prec = 0;
		let expression = parse_expression();
		prev_prec = temp_prec;
		let result = make_not(expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_bool() {
		parse_dirty();
		let start_index = file.token_index;
		let value;
		if (file.tokens[file.token_index].str == "true") {
			value = true;
		}
		else if (file.tokens[file.token_index].str == "false") {
			value = false;
		}
		else {
			throw Error("parse_bool: expected 'true' or 'false'");
		}
		file.token_index += 1;
		let result = make_bool(value);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function maybe_parse_expression_operation(result) {
		let start_index = file.token_index;
		let start_result = result;
		parse_dirty();
		let prev_result = null;
		while (true) {
			prev_result = result;
			parse_dirty();
			result = maybe_parse_call(result);
			parse_dirty();
			result = maybe_parse_array_index(result);
			parse_dirty();
			result = maybe_parse_dot_operator(result);
			parse_dirty();
			result = maybe_parse_increment(result);
			parse_dirty();
			result = maybe_parse_decrement(result);
			if (result == prev_result) {
				break;
			}
		}
		if (result == start_result) {
			file.token_index = start_index;
		}
		return result;
	}
	function maybe_parse_call(target) {
		parse_dirty();
		let start_index = target.base.token_begin;
		if (file.tokens[file.token_index].str != "(") {
			return target;
		}
		// resetting the precedence is required
		// for parsing things like `f(a + 1) * f(b - 2)`
		let temp_prec = prev_prec;
		prev_prec = MAX_PRECEDENCE;
		let args = parse_delimited(parse_expression, "(", ",", ")");
		prev_prec = temp_prec;
		let result = make_call(target, args);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function maybe_parse_array_index(target) {
		parse_dirty();
		let start_index = target.base.token_begin;
		if (file.tokens[file.token_index].str != "[") {
			return target;
		}
		let delimited = parse_delimited(parse_expression, "[", ",", "]", 1, 1);
		let index = delimited.elements[0];
		let result = make_array_index(target, index, delimited);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function maybe_parse_dot_operator(target) {
		parse_dirty();
		let start_index = target.base.token_begin;
		if (file.tokens[file.token_index].str != ".") {
			return target;
		}
		let operator = parse_single_operator();
		let right = parse_ident();
		let result = make_dot_operator(target, right, operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function maybe_parse_increment(target) {
		parse_dirty();
		let start_index = target.base.token_begin;
		if (file.tokens[file.token_index].str != "++") {
			return target;
		}
		let operator = parse_single_operator();
		let result = make_increment(target, operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function maybe_parse_decrement(target) {
		parse_dirty();
		let start_index = target.base.token_begin;
		if (file.tokens[file.token_index].str != "--") {
			return target;
		}
		let operator = parse_single_operator();
		let result = make_decrement(target, operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_constant_expression() {
		parse_dirty();
		let start_index = file.token_index;
		let result = null;
		if (file.tokens[file.token_index].str == "struct") {
			result = parse_struct_definition();
		}
		else if (file.tokens[file.token_index].str == "enum") {
			result = parse_enum_definition();
		}
		else if (file.tokens[file.token_index].str == "enum_flags") {
			result = parse_enum_flags_definition();
		}
		else if (file.tokens[file.token_index].str == "(") {
			result = parse_procedure_definition();
		}
		else {
			result = parse_expression();
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_single_operator() {
		parse_dirty();
		let start_index = file.token_index;
		if (file.tokens[file.token_index].kind != Token_Kind.OPERATOR) {
			return null;
		}
		let result = make_operator(file.tokens[file.token_index].str);
		file.token_index += 1;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_operator() {
		parse_dirty();
		let start_index = file.token_index;
		// nocheckin
		// this is probably not necessary
		if (file.tokens[file.token_index].str == ";") {
			return null;
		}
		if (file.tokens[file.token_index].str == ":") {
			return parse_single_operator();
		}
		let str = "";
		while (true) {
			let token = file.tokens[file.token_index];
			// nocheckin
			// delimited is probably a bad idea
			if (token.kind == Token_Kind.OPERATOR || token.kind == Token_Kind.DELIMITED) {
				str += file.tokens[file.token_index].str;
			}
			else {
				break;
			}
			file.token_index += 1;
		}
		let result = make_operator(str);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_dirty() {
		let result_tokens = new Array();
		while (true) {
			if (file.token_index >= file.tokens.length) {
				break;
			}
			if (file.tokens[file.token_index].kind == Token_Kind.WHITESPACE) {
				result_tokens.push(file.tokens[file.token_index]);
			}
			else if (file.tokens[file.token_index].kind == Token_Kind.TAB) {
				result_tokens.push(file.tokens[file.token_index]);
			}
			else if (file.tokens[file.token_index].kind == Token_Kind.NEWLINE) {
				result_tokens.push(file.tokens[file.token_index]);
			}
			else if (file.tokens[file.token_index].kind == Token_Kind.SINGLE_LINE_COMMENT) {
				result_tokens.push(file.tokens[file.token_index]);
			}
			else if (file.tokens[file.token_index].kind == Token_Kind.MULTI_LINE_COMMENT) {
				result_tokens.push(file.tokens[file.token_index]);
			}
			else {
				break;
			}
			file.token_index += 1;
		}
		return result_tokens;
	}
	function parse_integer() {
		parse_dirty();
		let start_index = file.token_index;
		if (file.tokens[file.token_index].kind == Token_Kind.DIGITS) {
			let value = parseInt(file.tokens[file.token_index].str);
			let result = make_integer(value);
			file.token_index += 1;
			result.base.token_begin = start_index;
			result.base.token_end = file.token_index;
			result.base.file = file;
			return result;
		}
		return null;
	}
	function parse_float() {
		let prev_index = file.token_index;
		parse_dirty();
		let start_index = file.token_index;
		let first = "";
		let second = "";
		if (file.tokens[file.token_index].kind == Token_Kind.DIGITS) {
			first = file.tokens[file.token_index].str;
			file.token_index += 1;
		}
		if (file.token_index < file.tokens.length && file.tokens[file.token_index].str == ".") {
			file.token_index += 1;
			if (file.tokens[file.token_index].kind == Token_Kind.DIGITS) {
				second = file.tokens[file.token_index].str;
				file.token_index += 1;
				let value = parseFloat(first + "." + second);
				let result = make_float(value);
				result.base.token_begin = start_index;
				result.base.token_end = file.token_index;
				result.base.file = file;
				return result;
			}
		}
		file.token_index = prev_index;
		return null;
	}
	function parse_integer_or_float() {
		parse_dirty();
		let result = parse_float();
		if (result == null) {
			result = parse_integer();
		}
		if (result == null) {
			throw Error("parse_integer_or_float: error");
		}
		return result;
	}
	function parse_char() {
		parse_dirty();
		let start_index = file.token_index;
		let curr_token = file.tokens[file.token_index];
		if (curr_token.kind != Token_Kind.CHAR_START) {
			throw Error("parse_char: unexpected token kind '" + curr_token.kind + "'");
		}
		file.token_index += 1;
		curr_token = file.tokens[file.token_index];
		let result = make_char(curr_token.str.charCodeAt(0));
		file.token_index += 1;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_string() {
		parse_dirty();
		let start_index = file.token_index;
		let curr_token = file.tokens[file.token_index];
		if (curr_token.kind != Token_Kind.STRING_START) {
			throw Error("parse_string: unexpected token kind '" + curr_token.kind + "'");
		}
		file.token_index += 1;
		curr_token = file.tokens[file.token_index];
		let result = make_string(curr_token.str);		
		file.token_index += 1;
		curr_token = file.tokens[file.token_index];
		if (curr_token.kind != Token_Kind.STRING_END) {
			throw Error("parse_string: unexpected token kind '" + curr_token.kind + "'");
		}
		file.token_index += 1;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_array_literal() {
		parse_dirty();
		let start_index = file.token_index;
		let type = null;
		let delimited = parse_delimited(parse_expression, "[", ",", "]");
		let result = make_array_literal(type, delimited);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_struct_literal() {
		parse_dirty();
		let start_index = file.token_index;
		let delimited = parse_delimited(parse_struct_literal_element, "{", ",", "}");
		let type = null;
		let result = make_struct_literal(type, delimited);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_struct_literal_element() {
		parse_dirty();
		let start_index = file.token_index;
		let ident = parse_ident();
		if (file.tokens[file.token_index].str != ":") {
			throw Error("Expected ':' after struct literal member name");
		}
		file.token_index += 1;
		let expression = parse_expression();
		let result = make_struct_literal_element(ident, expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_declaration() {
		parse_dirty();
		let start_index = file.token_index;
		let ident = parse_ident();
		let type_operator = parse_single_operator();
		let result = parse_declaration_with_ident_and_type_operator(ident, type_operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_declaration_with_ident_and_type_operator(ident, type_operator) {
		parse_dirty();
		let type = null;
		if (file.tokens[file.token_index].str != ":" && file.tokens[file.token_index].str != "=") {
			type = parse_type();
		}
		parse_dirty();
		let expression_operator = null;
		if (file.tokens[file.token_index].str == ":") {
			expression_operator = parse_single_operator();
		}
		else if (file.tokens[file.token_index].str == "=") {
			expression_operator = parse_single_operator();
		}
		parse_dirty();
		let expression = null;
		if (expression_operator != null) {
			if (expression_operator.str == ":") {
				expression = parse_constant_expression();
			}
			else if (expression_operator.str == "=") {
				expression = parse_expression();
			}
		}
		let result = make_declaration(ident, type, expression, type_operator, expression_operator);
		result.base.token_begin = ident.base.token_begin;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_assign() {
		let target = parse_expression();
		let operator = parse_operator();
		return parse_assign_with_target_and_operator(target, operator);
	}
	function parse_assign_with_target_and_operator(target, operator) {
		let expression = parse_expression();
		let result = make_assign(target, expression, operator);
		result.base.token_begin = target.base.token_begin;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_opassign() {
		let target = parse_expression();
		let operator = parse_operator();
		return parse_opassign_with_target_and_operator(target, operator);
	}
	function parse_opassign_with_target_and_operator(target, operator) {
		parse_dirty();
		let expression = parse_expression();
		let result = make_opassign(target, expression, operator);
		result.base.token_begin = target.base.token_begin;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_ident() {
		parse_dirty();
		let start_index = file.token_index;
		if (file.tokens[file.token_index].kind != Token_Kind.IDENT) {
			throw Error("parse_ident: unexpected token '" + file.tokens[file.token_index].str + "'");
		}
		let tokens = new Array();
		tokens.push(file.tokens[file.token_index]);
		file.token_index += 1;
		let result = make_ident(null, tokens);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_reference() {
		parse_dirty();
		let start_index = file.token_index;
		file.token_index += 1;
		let expression = parse_expression();
		let result = make_reference(expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_dereference() {
		parse_dirty();
		let start_index = file.token_index;
		let operator = parse_operator();
		let expression = parse_expression();
		let result = expression;
		for (let i = 0; i < operator.str.length; i += 1) {
			if (operator.str[i] == "*") {
				result = make_dereference(result);
			}
			else {
				throw Error("parse_dereference: expected '*', got '" + operator.str[i] + "'");
			}
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_cast() {
		parse_dirty();
		let start_index = file.token_index;
		file.token_index += 1;
		if (file.tokens[file.token_index].str != "(") {
			throw Error("parse_cast: expected '('");
		}
		file.token_index += 1;
		// @Incomplete
		// can be any expression
		// like `typeof(ident)`
		let target_type = parse_type();
		if (file.tokens[file.token_index].str != ")") {
			throw Error("parse_cast: expected '('");
		}
		file.token_index += 1;
		let expression = parse_expression();
		let result = make_cast(target_type, expression);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_struct_definition() {
		parse_dirty();
		let start_index = file.token_index;
		file.token_index += 1;
		let block = parse_block();
		let result = make_struct_definition(block);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_enum_definition() {
		parse_dirty();
		let start_index = file.token_index;
		file.token_index += 1;
		let members = parse_block();
		let result = make_enum_definition(members);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_enum_flags_definition() {
		parse_dirty();
		let start_index = file.token_index;
		file.token_index += 1;
		let members = parse_block();
		let result = make_enum_definition(members);
		result.is_flags = true;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_block() {
		parse_dirty();
		let start_index = file.token_index;
		let delimited = parse_delimited(parse_statement, "{", "", "}", 0, 0);
		let result = make_block(null, delimited);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_procedure_definition() {
		parse_dirty();
		let start_index = file.token_index;
		let parameters = parse_procedure_parameters();
		let operator = parse_procedure_operator();
		let returns = null;
		if (operator) {
			returns = parse_procedure_returns();
		}
		let block = parse_block();
		let result = make_procedure_definition(parameters, operator, returns, block);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_procedure_operator() {
		parse_dirty();
		let start_index = file.token_index;
		let result = parse_operator();
		if (result.str != "->") {
			file.token_index = start_index;
			return null;
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_procedure_parameters() {
		parse_dirty();
		return parse_delimited(parse_declaration, "(", ",", ")");
	}
	function parse_procedure_returns() {
		parse_dirty();
		let start_index = file.token_index;
		// nocheckin
		// need to handle named returns
		let result = null;
		if (file.tokens[file.token_index].str == "(") {
			result = parse_delimited(parse_type, "(", ",", ")");
		}
		else {
			let single_return_type = parse_type();
			let single_return_array = new Array();
			single_return_array.push(single_return_type);
			let begin_operator = null;
			let separator = null;
			let end_operator = null;
			// nocheckin
			// @Cleanup
			/*
			let begin_operator = make_operator("");
			begin_operator.base.token_begin = single_return_type.base.token_begin;
			begin_operator.base.token_end = begin_operator.base.token_begin;
			begin_operator.base.file = file;
			let separator = make_operator(",");
			separator.base.token_begin = single_return_type.base.token_end;
			separator.base.token_end = separator.base.token_begin;
			separator.base.file = file;
			let end_operator = make_operator("");
			end_operator.base.token_begin = single_return_type.base.token_end;
			end_operator.base.token_end = end_operator.base.token_begin;
			end_operator.base.file = file;
			*/
			result = make_delimited(single_return_array, begin_operator, separator, end_operator);
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_type() {
		parse_dirty();
		let start_index = file.token_index;
		let result = null;
		if (file.tokens[file.token_index].str == "*") {
			result = parse_pointer_type();
		}
		else if (file.tokens[file.token_index].str == "[") {
			result = parse_array_type(result);
		}
		else if (file.tokens[file.token_index].kind == Token_Kind.IDENT) {
			result = parse_ident();
			result.tokens[0].extra_kind = Extra_Token_Kind.TYPE;
		}
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_pointer_type() {
		parse_dirty();
		let start_index = file.token_index;
		let elem_type = null;
		let operator = null;
		if (file.tokens[file.token_index].str != "*") {
			throw Error("parse_pointer_type: expected '*'");
		}
		operator = parse_operator();
		elem_type = parse_type();
		let result = make_pointer_type(elem_type, operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_array_type() {
		parse_dirty();
		let start_index = file.token_index;
		let size = null;
		let elem_type = null;
		let begin_operator = null;
		let end_operator = null;
		if (file.tokens[file.token_index].str != "[") {
			throw Error("parse_array_type: expected '['");
		}
		begin_operator = parse_operator();
		parse_dirty();
		if (file.tokens[file.token_index].kind == Token_Kind.DIGITS) {
			size = parse_integer();
			parse_dirty();
			if (file.tokens[file.token_index].str != "]") {
				throw Error("parse_array_type: did not end with ']'");
			}
			end_operator = parse_operator();
		}
		else if (file.tokens[file.token_index].str == "]") {
			throw Error("Dynamic arrays are not yet implemented");
		}
		else {
			throw Error("parse_array_type: non-integer array size not yet implemented");
		}
		elem_type = parse_type();
		let result = make_array_type(size, elem_type, begin_operator, end_operator);
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	function parse_delimited(elem_func, begin = "", separator = "", end = "", min_length = 0, max_length = 0) {
		parse_dirty();
		let start_index = file.token_index;
		let elements = new Array();
		let first_element = null;
		let all_separators = new Array();
		let last_element = null;
		let begin_operator = null;
		if (begin != "") {
			parse_dirty();
			if (file.token_index >= file.tokens.length) {
				throw Error("parse_delimited: unexpected end of text at begin");
			}
			if (file.tokens[file.token_index].str != begin) {
				throw Error("parse_delimited: begin token was '" + file.tokens[file.token_index].str + "' (expected: '" + begin + "')");
			}
			file.token_index += 1;
			begin_operator = make_operator(begin);
			begin_operator.base.token_begin = start_index;
			begin_operator.base.token_end = file.token_index;
			begin_operator.base.file = file;
		}
		let prev_index = file.token_index;
		while (file.token_index < file.tokens.length) {
			let end_lookahead_index = file.token_index;
			parse_dirty();
			if (file.token_index >= file.tokens.length) {
				break;
			}
			if (file.tokens[file.token_index].str == end) {
				break;
			}
			file.token_index = end_lookahead_index;
			prev_index = prev_index;
			let elem = elem_func();
			prev_index = file.token_index;
			elements.push(elem);
			let end_lookahead_prev_index = file.token_index;
			parse_dirty();
			let separator_operator = null;
			if (separator != "") {
				separator_operator = make_operator(separator);
				separator_operator.base.token_begin = file.token_index;
				separator_operator.base.token_end = file.token_index;
				separator_operator.base.file = file;
				all_separators.push(separator_operator);
			}
			if (file.token_index >= file.tokens.length) {
				break;
			}
			if (file.tokens[file.token_index].str == end) {
				break;
			}
			if (separator != "") {
				if (file.tokens[file.token_index].str != separator) {
					throw Error("parse_delimited: separator token was '" + file.tokens[file.token_index].str + "' (expected: '" + separator + "')");
				}
				file.token_index += 1;
				end_lookahead_prev_index = file.token_index;
				if (separator_operator != null) {
					separator_operator.base.token_end = file.token_index;
				}
			}
			if (file.token_index >= file.tokens.length) {
				break;
			}
			if (file.tokens[file.token_index].str == end) {
				break;
			}
			file.token_index = end_lookahead_prev_index;
		}
		let end_operator = null;
		if (end != "") {
			parse_dirty();
			if (file.token_index >= file.tokens.length) {
				throw Error("parse_delimited: unexpected end of text at end");
			}
			if (file.tokens[file.token_index].str != end) {
				throw Error("parse_delimited: end token was '" + file.tokens[file.token_index].str + "' (expected: '" + end + "')");
			}
			let end_index = file.token_index;
			file.token_index += 1;
			end_operator = make_operator(end);
			end_operator.base.token_begin = end_index;
			end_operator.base.token_end = file.token_index;
			end_operator.base.file = file;
		}
		if (min_length > 0 && min_length > elements.length) {
			throw Error("parse_delimited: too few elements (expected: '" + min_length + "', actual: '" + elements.length + "'");
		}
		if (max_length > 0 && max_length < elements.length) {
			throw Error("parse_delimited: too many elements (expected: '" + max_length + "', actual: '" + elements.length + "'");
		}
		let separator_operator = null;
		if (all_separators.length == 0) {
			if (separator != "") {
				separator_operator = make_operator(separator);
				separator_operator.base.token_begin = begin_operator.token_end;
				separator_operator.base.token_end = begin_operator.token_end;
				separator_operator.base.file = file;
			}
		}
		else {
			separator_operator = all_separators[0];
		}
		let result = make_delimited(elements, begin_operator, separator_operator, end_operator);
		result.all_separators = all_separators;
		result.base.token_begin = start_index;
		result.base.token_end = file.token_index;
		result.base.file = file;
		return result;
	}
	let delimited = parse_delimited(parse_statement);
	delimited.is_implicit = true;
	let parse_result = make_block(null, delimited);
	parse_result.base.token_begin = delimited.base.token_begin;
	parse_result.base.token_end = delimited.base.token_end;
	parse_result.base.file = file;
	let file_scope = make_scope();
	parse_result.base.enclosing_scope = file_scope;
	return parse_result;
}