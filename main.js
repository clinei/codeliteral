"use strict";

function main() {

	map_keyboard();

	print();
}

function map_keyboard() {

	document.addEventListener("keydown", document_keydown);
}

function document_keydown(event) {

	// press R
	if (event.keyCode == 82) {

		start_debugging();
	}

	/*
	// press S
	if (event.keyCode == 83) {

		stop_debugging();
	}
	*/

	// press N
	if (event.keyCode == 78) {

		step_next();
	}

	// press B
	if (event.keyCode == 66) {

		step_back();
	}

	// press I
	if (event.keyCode == 73) {

		step_into();
	}

	// press O
	if (event.keyCode == 79) {

		step_out();
	}
}

let Code_Kind = {

	IF: "if",
	ELSE: "else",
	WHILE: "while",
	IDENT: "identifier",
	ASSIGN: "assign",
	LITERAL: "literal",
	OPASSIGN: "opassign",
	BINARY_OPERATION: "binary op",
	BLOCK: "block",
	STATEMENT: "statement",
	DECLARATION: "declaration",
	PROCEDURE_CALL: "call",
	PROCEDURE: "procedure",
	RETURN: "return",
	NEWLINE: "newline",
	SETTINGS_BOX: "settings box"
};

let Code_Node = {

	kind: null,
	type: null,
	serial: null
};
let next_serial = 0;
function make_node() {

	let node = Object.assign({}, Code_Node);
	node.serial = next_serial;

	next_serial += 1;

	return node;
}

let Code_Statement = {

	base: null,

	expression: null
};
function make_statement(expression) {

	let statement = Object.assign({}, Code_Statement);
	statement.base = make_node();
	statement.base.kind = Code_Kind.STATEMENT;

	statement.expression = expression;

	return statement;
}

let Code_Settings_Box = {

	base: null,

	target: null
};
function make_settings_box(target) {

	let settings_box = Object.assign({}, Code_Settings_Box);
	settings_box.base = make_node();
	settings_box.base.kind = Code_Kind.SETTINGS_BOX;

	settings_box.target = target;

	return settings_box;
}

let Code_Procedure = {

	base: null,

	parameters: null,
	return_type: null,
	block: null
};
function make_procedure(parameters, return_type, block) {

	let procedure = Object.assign({}, Code_Procedure);
	procedure.base = make_node();
	procedure.base.kind = Code_Kind.PROCEDURE;

	procedure.parameters = parameters;
	procedure.return_type = return_type;
	procedure.block = block;

	return procedure;
}

let Code_Procedure_Call = {

	base: null,

	declaration: null,
	args: null
};
function make_procedure_call(declaration, args) {

	let procedure_call = Object.assign({}, Code_Procedure_Call);
	procedure_call.base = make_node();
	procedure_call.base.kind = Code_Kind.PROCEDURE_CALL;

	procedure_call.declaration = declaration;
	procedure_call.args = args;

	return procedure_call;
}

let Code_Declaration = {

	base: null,

	ident: null,
	expression: null,
	type: null
};
function make_declaration(ident, expression, type) {

	let declaration = Object.assign({}, Code_Declaration);
	declaration.base = make_node();
	declaration.base.kind = Code_Kind.DECLARATION;

	ident.declaration = declaration;

	declaration.ident = ident;
	declaration.expression = expression;
	declaration.type = type;

	return declaration;
}

let Code_Block = {

	base: null,

	statements: null
};
function make_block(statements) {

	let block = Object.assign({}, Code_Block);
	block.base = make_node();
	block.base.kind = Code_Kind.BLOCK;

	block.statements = statements;

	if (!block.statements) {

		block.statements = new Array();
	}

	return block;
}

let Code_Return = {

	base: null,

	expression: null
};
function make_return(expression) {

	let return_ = Object.assign({}, Code_Return);
	return_.base = make_node();
	return_.base.kind = Code_Kind.RETURN;

	return_.expression = expression;

	return return_;
}

let Code_If = {

	base: null,

	condition: null,
	block: null
};
function make_if(condition, block) {

	let if_ = Object.assign({}, Code_If);
	if_.base = make_node();
	if_.base.kind = Code_Kind.IF;

	if_.condition = condition;
	if_.block = block;

	return if_;
}

let Code_Else = {

	base: null,

	block: null
};
function make_else(block) {

	let else_ = Object.assign({}, Code_Else);
	else_.base = make_node();
	else_.base.kind = Code_Kind.ELSE;

	else_.block = block;

	return else_;
}

let Code_While = {

	base: null,

	condition: null,
	block: null
};
function make_while(condition, block) {

	let while_ = Object.assign({}, Code_While);
	while_.base = make_node();
	while_.base.kind = Code_Kind.WHILE;

	while_.condition = condition;
	while_.block = block;

	return while_;
}

let Code_Assign = {

	base: null,

	ident: null,
	expression: null
};
function make_assign(ident, expression) {

	let assign = Object.assign({}, Code_Assign);
	assign.base = make_node();
	assign.base.kind = Code_Kind.ASSIGN;

	assign.ident = ident;
	assign.expression = expression;

	return assign;
}

let Code_OpAssign = {

	base: null,

	ident: null,
	operation_type: null,
	expression: null
};
function make_opassign(ident, operation_type, expression) {

	let opassign = Object.assign({}, Code_OpAssign);
	opassign.base = make_node();
	opassign.base.kind = Code_Kind.OPASSIGN;

	opassign.ident = ident;
	opassign.operation_type = operation_type;
	opassign.expression = expression;

	return opassign;
}

let Code_Binary_Operation = {

	base: null,

	operation_type: null,
	left: null,
	right: null
};
function make_binary_operation(left, operation_type, right) {

	let binary_operation = Object.assign({}, Code_Binary_Operation);
	binary_operation.base = make_node();
	binary_operation.base.kind = Code_Kind.BINARY_OPERATION;

	binary_operation.left = left;
	binary_operation.operation_type = operation_type;
	binary_operation.right = right;

	return binary_operation;
}

let Code_Ident = {

	base: null,

	name: null,
	block: null,
	declaration: null
};
function make_ident(name, declaration) {

	let ident = Object.assign({}, Code_Ident);
	ident.base = make_node();
	ident.base.kind = Code_Kind.IDENT;

	ident.name = name;
	ident.declaration = declaration;

	return ident;
}

let Code_Literal = {

	base: null,

	value: null
};
function make_literal(value) {

	let literal = Object.assign({}, Code_Literal);
	literal.base = make_node();
	literal.base.kind = Code_Kind.LITERAL;

	literal.value = value;

	return literal;
}

let newline_expr = {};
newline_expr.base = make_node();
newline_expr.base.kind = Code_Kind.NEWLINE;

let newline = make_statement(newline_expr);

let Global_Block = make_block();

Global_Block.settings = {

	past_shown: true,
	future_shown: true,
	values_shown: false,
	math_solve: false,
	inline : false
};

let Types = {
	int : make_ident("int"),
	float : make_ident("float"),
	void : make_ident("void"),
	Any: make_ident("Any")
};

/*
int some_function(int number) {
	return number - 20;
}
*/
let some_function_block = make_block();
let some_function_param = make_declaration(make_ident("number"), null, Types.int);
let some_function_procedure = make_procedure([some_function_param], Types.int, some_function_block);
let some_function_declaration = make_declaration(make_ident("some_function"), some_function_procedure);

let some_function_sub = make_binary_operation(some_function_param.ident, "-", make_literal("20"));

some_function_block.statements.push(make_statement(make_return(some_function_sub)));

/*
int factorial(int number) {
	if (number > 1) {
		return factorial(number - 1) * number;
	}
	else {
		return 1;
	}
}
*/
let factorial_block = make_block();
let factorial_param = make_declaration(make_ident("number"), null, Types.int);
let factorial_procedure = make_procedure([factorial_param], Types.int, factorial_block);
let factorial_declaration = make_declaration(make_ident("factorial"), factorial_procedure);

let if_block = make_block();
let if_condition = make_binary_operation(factorial_param.ident, ">", make_literal("1"));
let factorial_binop = make_binary_operation(factorial_param.ident, "-", make_literal("1"));
let factorial_recursive_call = make_procedure_call(factorial_declaration, [factorial_binop]);
let factorial_binop_2 = make_binary_operation(factorial_recursive_call, "*", factorial_param.ident);
if_block.statements.push(newline);
if_block.statements.push(make_statement(make_return(factorial_binop_2)));

let else_block = make_block();
else_block.statements.push(newline);
else_block.statements.push(make_statement(make_return(make_literal("1"))));

factorial_block.statements.push(newline);
factorial_block.statements.push(make_statement(make_if(if_condition, if_block)));
factorial_block.statements.push(newline);
factorial_block.statements.push(make_statement(make_else(else_block)));

let Main_block = make_block();
let Main_procedure = make_procedure(null, Types.int, Main_block);
let Main_declaration = make_declaration(make_ident("main"), Main_procedure);
let Main_call = make_procedure_call(Main_declaration);

Global_Block.statements.push(make_statement(Main_call));

/*
int main() {
    int local_variable = 42;
    local_variable = some_function(2 + some_function(local_variable));
	while (local_variable < 24) {
		local_variable += some_factorialtion(local_variable);
	}
	return local_variable;
}
*/
let local_variable = make_declaration(make_ident("local_variable"), make_literal("42"), Types.int);
let some_function_call = make_procedure_call(some_function_declaration, [local_variable.ident]);
let binop = make_binary_operation(make_literal("0"), "+", some_function_call);
let some_function_call_2 = make_procedure_call(some_function_declaration, [binop]);
let local_variable_assign = make_assign(local_variable.ident, some_function_call_2);

let while_block = make_block();
let while_condition = make_binary_operation(local_variable.ident, "<=", make_literal("24"));
let factorial_call = make_procedure_call(factorial_declaration, [local_variable.ident]);
let local_variable_opassign = make_opassign(local_variable.ident, "+", factorial_call);
let while_loop = make_while(while_condition, while_block);

while_block.statements.push(newline);
while_block.statements.push(make_statement(local_variable_opassign));

Main_block.statements.push(make_statement(local_variable));
Main_block.statements.push(newline);
Main_block.statements.push(make_statement(local_variable_assign));
Main_block.statements.push(newline);
Main_block.statements.push(make_statement(while_loop));
Main_block.statements.push(newline);
Main_block.statements.push(make_statement(make_return(local_variable.ident)));

let map_call_to_settings = new Map();

let map_ident_replace = new Map();
let map_ident_to_value = new Map();

let map_original_to_clone = new Map();

let debugging = false;
let execution_cursor = null;
let reached_cursor = false;
let call_stack = null;
let block_stack = null;
let expression_stack = null;
let transform_stack = new Array();
let idents_used = new Set();

let code_element = document.getElementById("code");

function print() {

	while (code_element.firstChild) {

		code_element.removeChild(code_element.firstChild);
	}

	print_to_dom(Global_Block.statements[0], code_element, code_element);
}

function start_debugging() {

	call_stack = new Array();
	block_stack = new Array();
	expression_stack = new Array();
	map_ident_to_value = new Map();

	// @Redundant?
	Global_Block.inline = true;

	expression_stack.push(Global_Block);

	execution_cursor = Global_Block;

	execution_cursor.index = 0;
	execution_cursor.elements = execution_cursor.statements;

	execution_cursor = Global_Block.elements[0].expression;

	debugging = true;

	print();
}
function stop_debugging() {

	execution_cursor = null;

	debugging = false;

	print();
}
function step_into() {

	let last_expression = expression_stack[expression_stack.length-1];

	if (execution_cursor.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.push(execution_cursor);
		expression_stack.push(execution_cursor);

		execution_cursor.returned = false;

		execution_cursor.settings = {...last_expression.settings};

		transform(execution_cursor);

		execution_cursor.inline = true;

		execution_cursor = execution_cursor.transformed;

		step_into();

		return;
	}
	else if (execution_cursor.base.kind == Code_Kind.DECLARATION) {

		execution_cursor.index = 1;
		execution_cursor.elements = [execution_cursor.type, execution_cursor.ident];

		if (execution_cursor.expression) {

			execution_cursor.elements.push(execution_cursor.expression);
			execution_cursor.index += 1;
		}

		execution_cursor.settings = {...last_expression.settings};

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.elements[execution_cursor.index];

		print();
	}
	else if (execution_cursor.base.kind == Code_Kind.ASSIGN) {

		execution_cursor.index = 1;
		execution_cursor.elements = [execution_cursor.ident, execution_cursor.expression];

		execution_cursor.settings = {...last_expression.settings};

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.elements[execution_cursor.index];

		print();
	}
	else if (execution_cursor.base.kind == Code_Kind.RETURN) {

		let transformed = execution_cursor.transformed.statements[0].expression;

		execution_cursor.index = 1;
		execution_cursor.elements = [transformed.ident, transformed.expression];

		execution_cursor.settings = {...last_expression.settings};
		execution_cursor.inline = true;

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.expression;

		print();
	}
	else if (execution_cursor.base.kind == Code_Kind.OPASSIGN) {

		execution_cursor.settings = {...last_expression.settings};
		execution_cursor.inline = true;

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.transformed;

		step_into();
	}
	else if (execution_cursor.base.kind == Code_Kind.BINARY_OPERATION) {

		execution_cursor.settings = {...last_expression.settings};

		expression_stack.push(execution_cursor);

		if (execution_cursor.transformed) {

			execution_cursor.inline = true;

			execution_cursor = execution_cursor.transformed;

			step_into();
		}
		else {

			execution_cursor.index = 0;
			execution_cursor.elements = [execution_cursor.left, execution_cursor.right];

			execution_cursor = execution_cursor.left;

			print();
		}
	}
	else if (execution_cursor.base.kind == Code_Kind.BLOCK) {

		block_stack.push(execution_cursor);

		execution_cursor.index = 0;
		execution_cursor.elements = execution_cursor.statements;

		execution_cursor.settings = {...last_expression.settings};

		expression_stack.push(execution_cursor);

		execution_cursor = get_current_executable_expression(execution_cursor);

		print();	
	}
	else if (execution_cursor.base.kind == Code_Kind.IF) {

		execution_cursor.index = 0;
		execution_cursor.elements = [execution_cursor.condition, execution_cursor.block];

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.condition;

		print();
	}
	else if (execution_cursor.base.kind == Code_Kind.ELSE) {

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.block;

		step_into();
	}
	else if (execution_cursor.base.kind == Code_Kind.WHILE) {

		execution_cursor.index = 0;
		execution_cursor.elements = [execution_cursor.condition, execution_cursor.block];

		expression_stack.push(execution_cursor);

		execution_cursor = execution_cursor.condition;

		print();
	}
}
function step_out() {

	let last_expression = expression_stack.pop();

	last_expression.inline = false;

	if (last_expression.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.pop();
	}

	if (last_expression.base.kind == Code_Kind.BLOCK) {

		block_stack.pop();

		if (last_expression.declarations) {

			for (var decl of last_expression.declarations) {

				idents_used.delete(decl.ident.name);

				map_ident_to_value.delete(decl.ident);
			}
		}
	}

	if (execution_cursor && execution_cursor.base.kind == Code_Kind.STATEMENT) {

		execution_cursor = execution_cursor.expression;
	}

	// @Audit
	if (last_expression.base.kind == Code_Kind.BINARY_OPERATION) {

		execution_cursor = last_expression;
	}

	let last_call = call_stack[call_stack.length-1];

	if (last_call.returned) {

		step_out();

		return;
	}

	// @Copypaste
	if (last_expression.index && last_expression.index >= last_expression.elements.length-1) {

		if (last_expression.base.kind == Code_Kind.BLOCK) {

			step_out();

			return;
		}

		execution_cursor = last_expression;
	}

	print();
}

function get_current_executable_expression(parent) {

	let current = parent.elements[parent.index];

	if (current.base.kind == Code_Kind.STATEMENT) {

		current = current.expression;
	}

	// @Copypaste
	if (current.base.kind != Code_Kind.NEWLINE &&
	    current.base.kind != Code_Kind.SETTINGS_BOX) {

		return current;
	}
	else {

		return goto_next_executable_expression(parent);
	}
}
function goto_next_executable_expression(parent) {

	let current = null;

	do {

		parent.index += 1;

		current = parent.elements[parent.index];

		if (current) {

			if (current.base.kind == Code_Kind.STATEMENT) {

				current = current.expression;
			}

			if (current.base.kind != Code_Kind.NEWLINE &&
			    current.base.kind != Code_Kind.SETTINGS_BOX) {

				break;
			}
		}

	} while (parent.index < parent.elements.length)

	return current;
}
function step_next() {

	let last_call = call_stack[call_stack.length-1];

	let last_block = block_stack[block_stack.length-1];

	let last_expression = expression_stack[expression_stack.length-1];

	if (execution_cursor.base.kind == Code_Kind.IF) {

		if (run(execution_cursor.condition)) {

			execution_cursor = execution_cursor.block;

			step_into();
		}
		else {

			execution_cursor = goto_next_executable_expression(last_block);
		}

		return;
	}

	run(execution_cursor);

	if (last_call.returned) {

		last_expression = expression_stack[expression_stack.length-1];

		execution_cursor = last_call;

		print();

		return;
	}

	if (last_expression.index && last_expression.index >= last_expression.elements.length-1) {

		step_out();

		return;
	}

	execution_cursor = goto_next_executable_expression(last_expression);

	if (execution_cursor.base.kind == Code_Kind.BLOCK) {

		step_into();

		return;
	}

	if (last_expression.base.kind == Code_Kind.IF) {

		let condition_ident = last_expression.condition.transformed.statements[0].expression.ident;

		if (map_ident_to_value.get(condition_ident)) {

			execution_cursor = last_expression.block;

			step_into();

			step_next();
		}
		else {

			step_out();

			step_next();
		}
	}
	else if (last_expression.base.kind == Code_Kind.WHILE) {

		let condition_ident = last_expression.condition.transformed.statements[0].expression.ident;

		if (map_ident_to_value.get(condition_ident)) {

			execution_cursor = last_expression.block;

			step_into();
		}
	}

	// @Incomplete
	// crashes when leaving main

	print();
}
function step_back() {

	let last_expression = expression_stack[expression_stack.length-1];

	if (last_expression.index >= 1) {

		// @Refactor
		// :Backwards
		// we can use a single direction parameter in the goto_next_executable_expression

		last_expression.index += -1;
	}

	execution_cursor = last_expression.elements[last_expression.index];

	print();
}
function run(target) {

	let last_expression = expression_stack[expression_stack.length-1];

	let last_call = call_stack[call_stack.length-1];

	if (target.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.push(target);
		expression_stack.push(target);

		target.returned = false;

		// @Audit
		transform(target);
	}

	if (target.base.kind == Code_Kind.RETURN) {

		let return_value = run(target.transformed.statements[0].expression);

		last_call.returned = true;

		last_call.inline = false;

		step_out();

		return return_value;
	}

	if (target.base.kind == Code_Kind.STATEMENT) {

		return run(target.expression);
	}
	else if (target.base.kind == Code_Kind.IF) {

		if (run(target.condition)) {

			return run(target.block);
		}
		else {

			let else_expr = goto_next_executable_expression(last_expression);

			return run(else_expr);
		}
	}
	else if (target.base.kind == Code_Kind.ELSE) {

		return run(target.block);
	}
	else if (target.base.kind == Code_Kind.WHILE) {

		// @Incomplete
		// what about returns inside whiles?

		while (run(target.condition)) {

			run(target.block);
		}
	}
	else if (target.base.kind == Code_Kind.ASSIGN) {

		let expression_value = run(target.expression);

		map_ident_to_value.set(target.ident.declaration.ident, expression_value);

		return expression_value;
	}
	else if (target.base.kind == Code_Kind.DECLARATION) {

		let expression = null;

		if (target.expression) {

			expression = run(target.expression);
		}

		map_ident_to_value.set(target.ident.declaration.ident, expression);

		return expression;
	}
	else if (target.base.kind == Code_Kind.IDENT) {

		if (target.transformed) {

			return run(target.transformed.statements[0].expression);
		}
		else {

			return map_ident_to_value.get(target);
		}
	}
	else if (target.base.kind == Code_Kind.BLOCK) {

		block_stack.push(target);
		expression_stack.push(target);

		// @Audit
		target.index = 0;
		target.elements = target.statements;

		let return_value = null;

		let last_call = call_stack[call_stack.length-1];

		let executing_expr = get_current_executable_expression(target);

		do {

			return_value = run(executing_expr);

			executing_expr = goto_next_executable_expression(target);

			if (last_call.returned) {

				break;
			}

		} while (executing_expr)

		/*
		if (!last_call.returned) {

			expression_stack.pop();
		}
		*/

		return return_value;
	}
	else if (target.transformed) {

		return run(target.transformed);
	}
	else if (target.base.kind == Code_Kind.BINARY_OPERATION) {

		return math_solve(target);
	}
	else if (target.base.kind == Code_Kind.LITERAL) {

		return math_solve(target);
	}
}

function math_solve(node) {

	if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		let left = run(node.left);

		let right = run(node.right);

		if (node.operation_type == "+") {

			return left + right;
		}
		else if (node.operation_type == "-") {

			return left - right;
		}
		else if (node.operation_type == "*") {

			return left * right;
		}
		else if (node.operation_type == "/") {

			// emulate actual int division
			return Math.floor(left / right);
		}
		else if (node.operation_type == "%") {

			return left % right;
		}
		else if (node.operation_type == "<") {

			return left < right;
		}
		else if (node.operation_type == ">") {

			return left > right;
		}
		else if (node.operation_type == "<=") {

			return left <= right;
		}
		else if (node.operation_type == ">=") {

			return left >= right;
		}
		else if (node.operation_type == "==") {

			return left == right;
		}
		else if (node.operation_type == "!=") {

			return left != right;
		}
		else if (node.operation_type == "&&") {

			return left && right;
		}
		else if (node.operation_type == "||") {

			return left || right;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = node;

		if (ident.transformed) {

			ident = ident.transformed.statements[0].expression;
		}

		return map_ident_to_value.get(ident.declaration.ident);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		return parseInt(node.value);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		return run(node);
	}
}

function clone(node) {

	if (node.base.kind == Code_Kind.BLOCK) {

		let statements = new Array();

		for (var statement of node.statements) {

			statements.push(clone(statement));
		}

		return make_block(statements);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE) {

		let params = null;

		if (node.parameters) {

			params = new Array();

			for (var param of node.parameters) {

				params.push(clone(param));
			}
		}

		return make_procedure(params, node.return_type, clone(node.block));
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		let args = null;

		if (node.args) {

			args = new Array();

			for (var arg of node.args) {

				args.push(clone(arg));
			}
		}

		return make_procedure_call(node.declaration, args);
	}
	else if (node.base.kind == Code_Kind.IF) {

		return make_if(clone(node.condition), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		return make_else(clone(node.block));
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		return make_while(clone(node.condition), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		let expression = null;

		if (node.expression) {

			expression = clone(node.expression);
		}

		let decl = make_declaration(clone(node.ident), expression, node.type);

		map_original_to_clone.set(node, decl);

		return decl;
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = make_ident(node.name);

		let cloned_decl = map_original_to_clone.get(node.declaration);

		if (cloned_decl) {

			ident.declaration = cloned_decl;
		}
		else {

			ident.declaration = node.declaration;
		}

		return ident;
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		return make_assign(clone(node.ident), clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		return make_opassign(clone(node.ident), node.operation_type, clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		return make_binary_operation(clone(node.left), node.operation_type, clone(node.right));
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		return make_literal(node.value);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		return make_return(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.NEWLINE) {

		return node;
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		return make_statement(clone(node.expression));
	}
}

function get_final_name(name) {

	let final_name = name;

	let count = 0;

	while (idents_used.has(final_name)) {

		count += 1;

		final_name = name +"_"+ count;
	}

	idents_used.add(final_name);

	return final_name;
}

function transform(node) {

	let replacement = make_block();

	replacement.declarations = new Array();

	node.transformed = replacement;

	let last_block = block_stack[block_stack.length-1];

	let last_call = call_stack[call_stack.length-1];

	transform_stack.push(node);

	if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		if (transform_stack.length == 1) {

			let procedure = clone(node.declaration.expression);

			if (procedure.return_type != Types.void) {

				let return_ident = make_ident(get_final_name(node.declaration.ident.name +"_return"));

				// @Incomplete
				// we might have to combine assign and declaration
				let return_decl = make_declaration(return_ident, null, node.declaration.expression.return_type);

				replacement.statements.push(make_statement(return_decl));
			}

			call_stack.push(node);

			if (procedure.parameters) {

				for (let param_index = 0; param_index < procedure.parameters.length; param_index += 1) {

					let param = procedure.parameters[param_index];
					let arg = node.args[param_index];

					let param_ident = make_ident(get_final_name(param.ident.name));

					let param_decl = make_declaration(param_ident, arg, param.type);

					replacement.statements.push(make_statement(param_decl));

					map_ident_replace.set(param.ident, param_ident);

					transform(arg);
				}
			}

			let settings_box = make_settings_box(node);

			// replacement.statements.push(make_statement(settings_box));
			replacement.statements.push(newline);

			for (var stmt of procedure.block.statements) {

				replacement.statements.push(stmt);
			}

			transform(replacement);

			call_stack.pop();
		}
		else {

			for (var arg of node.args) {

				transform(arg);
			}
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		block_stack.push(node);

		node.declarations = new Array();

		for (var stmt of node.statements) {

			transform(stmt);

			replacement.statements.push(stmt);
		}

		block_stack.pop();
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		if (node.expression.base.kind != Code_Kind.NEWLINE) {

				transform(node.expression);
		}
	}
	else if (node.base.kind == Code_Kind.PROCEDURE) {

		transform(node.block);

		replacement.push(make_procedure(node.parameters, node.return_type, node.block));
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		last_block.declarations.push(node);

		if (node.expression) {

			transform(node.expression);
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		transform(node.expression);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		transform(node.expression);

		let binop = make_binary_operation(node.ident, node.operation_type, node.expression);

		let assign = make_assign(node.ident, binop);

		replacement.statements.push(make_statement(assign));
	}
	else if (node.base.kind == Code_Kind.IF) {

		transform(node.condition);

		transform(node.block);
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		transform(node.block);
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		transform(node.condition);

		transform(node.block);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		let ident = last_call.transformed.statements[0].expression.ident;

		let assign = make_assign(ident, node.expression);

		transform(node.expression);

		replacement.statements.push(make_statement(assign));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		// @Incomplete
		// need dynamic type
		let ident = make_ident(get_final_name("binop"));

		// if (Object.is(node.left.declaration.type, Types.int)) {}
		let type = Types.int;

		let decl = make_declaration(ident, null, type);

		// @Audit
		last_block.declarations.push(decl);

		replacement.statements.push(make_statement(decl));
		
		transform(node.left);
		transform(node.right);

		// @Incomplete
		// if neither the left or the right are transformed, combine declaration and assign

		let binop = make_binary_operation(node.left, node.operation_type, node.right);

		let assign = make_assign(ident, binop);

		replacement.statements.push(make_statement(assign));
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = node.declaration.ident;

		let ident_replacement = map_ident_replace.get(ident);

		if (ident_replacement) {

			ident = ident_replacement;
		}

		replacement.statements.push(make_statement(ident));
	}

	transform_stack.pop();

	if (replacement.statements.length > 0) {

		return replacement;
	}
	else {

		delete node.transformed;
	}
}

let indent_level = 0;

function print_indent(print_target) {

	print_target.appendChild(document.createTextNode("    ".repeat(indent_level)));
}

function print_semicolon(print_target) {

	print_target.appendChild(document.createTextNode(";"));
}

function print_newline(print_target) {

	print_target.appendChild(document.createElement("br"));
}

function print_to_dom(node, print_target, block_print_target, is_transformed_block = false) {

	let expr = document.createElement("expr");

	expr.node = node;

	if (node.transformed && node.inline &&
		node.transformed.base.kind == Code_Kind.BLOCK) {

		print_to_dom(node.transformed, block_print_target, block_print_target, true);

		if (node.base.kind == Code_Kind.PROCEDURE_CALL ||
			node.base.kind == Code_Kind.BINARY_OPERATION ||
			node.base.kind == Code_Kind.RETURN ||
			node.base.kind == Code_Kind.BLOCK ||
			node.base.kind == Code_Kind.OPASSIGN) {

			return;
		}
	}

	if (node.base.kind == Code_Kind.BLOCK) {

		if (!is_transformed_block) {

			block_print_target.appendChild(document.createTextNode("{"));

			print_newline(block_print_target);

			indent_level += 1;
		}

		for (var statement of node.statements) {

			print_to_dom(statement, block_print_target, block_print_target);
		}
		// @Incomplete
		// should pop the extra newline

		if (!is_transformed_block) {

			indent_level -= 1;

			print_indent(block_print_target);

			block_print_target.appendChild(document.createTextNode("}"));
		}
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		print_indent(expr);

		print_to_dom(node.expression, expr, block_print_target);

		if (expr.children.length > 0) {

			if (node.expression.base.kind != Code_Kind.NEWLINE &&
				node.expression.base.kind != Code_Kind.IF &&
				node.expression.base.kind != Code_Kind.ELSE &&
				node.expression.base.kind != Code_Kind.WHILE &&
				node.expression.base.kind != Code_Kind.SETTINGS_BOX) {

				print_semicolon(expr);
			}

			print_target.appendChild(expr);

		}

		print_newline(print_target);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		print_to_dom(node.declaration.ident, expr, block_print_target);

		expr.appendChild(document.createTextNode("("));

		if (node.args) {

			for (var arg of node.args) {

				if (arg.inline) {

					arg = arg.transformed.statements[0].expression.ident;
				}

				print_to_dom(arg, expr, block_print_target);

				expr.appendChild(document.createTextNode(", "));
			}

			expr.removeChild(expr.lastChild);
		}

		expr.appendChild(document.createTextNode(")"));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.IF) {

		expr.appendChild(document.createTextNode("if ("));

		print_to_dom(node.condition, expr, block_print_target);

		if (node.condition.inline) {

			print_to_dom(node.condition.transformed.statements[0].expression.ident, expr, block_print_target);
		}

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, expr, expr);
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		expr.appendChild(document.createTextNode("else "));

		print_target.appendChild(expr);

		print_to_dom(node.block, expr, expr);
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		expr.appendChild(document.createTextNode("while ("));

		print_to_dom(node.condition, expr, block_print_target);

		if (node.condition.inline) {

			print_to_dom(node.condition.transformed.statements[0].expression.ident, expr, block_print_target);
		}

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, expr, expr);
	}
	else if (node.base.kind == Code_Kind.SETTINGS_BOX) {

		/*
		// disabled because we're gonna use keyboard shortcuts and something else

		let settings_elem = document.createElement("settings");

		let click_area = document.createElement("a");
		click_area.appendChild(document.createTextNode("..."));
		click_area.onclick = settings_elem_onclick;
		settings_elem.appendChild(click_area);

		let dropdown = document.createElement("dropdown");
		dropdown.style.display = "none";

		for (var key of Object.keys(node.target.settings)) {

			let option = document.createElement("option");
			option.value = key;
			option.appendChild(document.createTextNode(key));
			option.classList.add(node.target.settings[key]);
			option.onclick = option_onclick;
			dropdown.appendChild(option);
		}
		dropdown.onclick = dropdown_onclick;

		settings_elem.appendChild(dropdown);
		
		dropdown.settings_elem = settings_elem;
		click_area.settings_elem = settings_elem;
		settings_elem.node = node;
		settings_elem.dropdown = dropdown;

		print_target.appendChild(settings_elem);

		*/
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		let left_expr = node.left;

		// @Copypaste
		if (node.left.inline) {

			print_to_dom(node.left, block_print_target, block_print_target);

			left_expr = node.left.transformed.statements[0].expression.ident;
		}

		print_to_dom(left_expr, expr, block_print_target);

		expr.appendChild(document.createTextNode(" "+ node.operation_type +" "));

		let right_expr = node.right;

		// @Copypaste
		if (node.right.inline) {

			print_to_dom(node.right, block_print_target, block_print_target);

			right_expr = node.right.transformed.statements[0].expression.ident;
		}

		print_to_dom(right_expr, expr, block_print_target);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		// @Audit
		if (node.expression && node.expression.base.kind == Code_Kind.PROCEDURE) {

			let procedure = node.expression;

			print_to_dom(procedure.return_type, expr);

			expr.appendChild(document.createTextNode(" "));

			print_to_dom(node.ident, expr);

			expr.appendChild(document.createTextNode("("));

			if (procedure.parameters) {

				for (var param of procedure.parameters) {

					print_to_dom(param, print_target, block_print_target);
				}
			}

			expr.appendChild(document.createTextNode(") "));

			print_to_dom(procedure.block, expr);

			print_target.appendChild(expr);
		}
		else {

			print_to_dom(node.type, expr);

			expr.appendChild(document.createTextNode(" "));

			print_to_dom(node.ident, expr);

			if (node.expression) {

				expr.appendChild(document.createTextNode(" = "));
			
				let expression = node.expression;

				// @Copypaste
				if (node.expression.inline) {

					expression = node.expression.transformed.statements[0].expression.ident;

					print_to_dom(node.expression, block_print_target, block_print_target);
				}

				print_to_dom(expression, expr, block_print_target);
			}

			print_target.appendChild(expr);
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		print_to_dom(node.ident, expr, block_print_target);

		expr.appendChild(document.createTextNode(" = "));

		let expression = node.expression;

		// @Copypaste
		if (node.expression.inline) {

			expression = node.expression.transformed.statements[0].expression.ident;

			print_to_dom(node.expression, block_print_target, block_print_target);
		}

		print_to_dom(expression, expr, block_print_target);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		print_to_dom(node.ident, expr, block_print_target);

		expr.appendChild(document.createTextNode(" "+ node.operation_type +"= "));

		let expression = node.expression;

		// @Copypaste
		if (node.expression.inline) {

			expression = node.expression.transformed.statements[0].expression.ident;
		}

		print_to_dom(expression, expr, block_print_target);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = null;

		if (node.transformed) {

			ident = node.transformed.statements[0].expression;
		}
		else {

			ident = node;
		}

		expr.appendChild(document.createTextNode(ident.name));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		expr.appendChild(document.createTextNode(node.value));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		print_to_dom(node.transformed.statements[0].expression, expr, block_print_target);

		print_target.appendChild(expr);
	}

	// @Incomplete
	if (Object.is(execution_cursor, node) || 
		(execution_cursor && execution_cursor.transformed &&
		 Object.is(execution_cursor.transformed.statements[0].expression, node))) {

		expr.classList.add("executing");
	}
}

function settings_elem_onclick(event) {

	event.target.settings_elem.dropdown.style.display = "block";
}

function option_onclick(event) {

	let dropdown = event.target.parentNode;

	let settings = dropdown.settings_elem.node.target.settings;
	let target_setting = event.target.value;

	settings[target_setting] = !settings[target_setting];

	print();
}
function dropdown_onclick(event) {

	if (event.button == 0) {

		if (event.target.getAttribute("opened")) {

			for (var child of event.target.children) {
				child.style.display = "none";
			}

			event.target.setAttribute("opened", "false");
		}
		else {

			for (var child of event.target.children) {
				child.style.display = "block";
			}

			event.target.setAttribute("opened", "true");
		}
	}
}

// transform(Global_Block);
main();