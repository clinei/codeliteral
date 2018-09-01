"use strict";

function main() {

	map_keyboard();

	start_debugging();
	print();
}

function map_keyboard() {

	document.addEventListener("keydown", document_keydown);
}

function document_keydown(event) {

	/* disabled
	// press R
	if (event.keyCode == 82) {

		start_debugging();
		print();
	}
	*/

	/*
	// press S
	if (event.keyCode == 83) {

		stop_debugging();
		print();
	}
	*/

	// press B
	if (event.keyCode == 66) {

		step_back();
		print();
	}

	// press N
	if (event.keyCode == 78) {

		step_next();
		print();
	}

	// press I
	if (event.keyCode == 73) {

		step_into();
		print();
	}

	// press O
	if (event.keyCode == 79) {

		step_out();
		print();
	}

	// press F
	if (event.keyCode == 70) {

		add_flowpoint();
		print();
	}

	// press D
	if (event.keyCode == 68) {

		delete_flowpoint();
		print();
	}

	// press C
	if (event.keyCode == 67) {

		previous_flowpoint();
		print();
	}

	// press V
	if (event.keyCode == 86) {

		next_flowpoint();
		print();
	}

	// press K
	if (event.keyCode == 75) {

		toggle_values_shown();
		print();
	}

	// press M
	if (event.keyCode == 77) {

		toggle_inspection();
		print();
	}

	let number = event.keyCode - 48;

	if (number >= 0 && number <= 9) {

		active_dataflow = number;

		flowpoints = dataflows[active_dataflow];
		
		print();
	}
}

let values_shown = false;
function toggle_values_shown() {

	values_shown = !values_shown;
}

let inspection_mode = false;
function toggle_inspection() {

	if (!inspection_mode) {

		inspection_cursor = execution_cursor;

		inspection_mode = true;
	}
	else {

		slider_element.value = slider_element.min;

		inspection_cursor = null;

		inspection_mode = false;
	}
}

function add_flowpoint() {

	// @Incomplete
	// disallow duplicates

	// insertion sort
	let index = 0;
	while (index < flowpoints.length) {

		if (flowpoints[index] > execution_index) {

			break;
		}

		index += 1;
	}

	flowpoints.splice(index, 0, execution_index);
}
function delete_flowpoint() {

	let flowpoint_index = flowpoints.indexOf(execution_index);

	if (flowpoint_index >= 0) {
		flowpoints.splice(flowpoint_index, 1);
	}
}
function next_flowpoint() {

	if (flowpoints.length) {

		if (!inspection_mode) {

			toggle_inspection();
		}

		let index = 0;
		while (index < flowpoints.length) {

			if (flowpoints[index] > execution_index) {

				break;
			}

			index += 1;
		}

		if (index >= flowpoints.length) {

			index = 0;
		}

		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor = execution_stack[flowpoint];
	}
}
function previous_flowpoint() {
	
	if (flowpoints.length) {

		if (!inspection_mode) {
			
			toggle_inspection();
		}

		let index = flowpoints.length-1;
		while (index >= 0) {

			if (flowpoints[index] < execution_index) {

				break;
			}

			index -= 1;
		}

		if (index < 0) {

			index = flowpoints.length-1;
		}

		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor = execution_stack[flowpoint];
	}
}

function map_index_get(expression) {

	return expression.index;
}
function map_index_set(expression, index) {

	expression.index = index;
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

let map_call_to_settings = new Map();

let map_ident_replace = new Map();
let map_ident_to_value = new Map();

let map_original_to_clone = new Map();

let debugging = false;
let execution_cursor = null;
let execution_index = 0;
let call_stack = new Array();
let block_stack = new Array();
let expression_stack = new Array();
let execution_stack = new Array();
let execution_block_stack = block_stack;
let execution_expression_stack = expression_stack;
let idents_used = new Set();

let inspection_cursor = null;

let dataflows = new Array(10);

dataflows[0] = new Array();
dataflows[1] = new Array();
dataflows[2] = new Array();
dataflows[3] = new Array();
dataflows[4] = new Array();
dataflows[5] = new Array();
dataflows[6] = new Array();
dataflows[7] = new Array();
dataflows[8] = new Array();
dataflows[9] = new Array();

let active_dataflow = 1;
let flowpoints = dataflows[active_dataflow];

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
	while (local_variable <= 24) {
		local_variable += factorial(local_variable - 1) - 4;
	}
	return local_variable;
}
*/
let local_variable = make_declaration(make_ident("local_variable"), make_literal("42"), Types.int);
let some_function_call = make_procedure_call(some_function_declaration, [local_variable.ident]);
let binop = make_binary_operation(make_literal("2"), "+", some_function_call);
let some_function_call_2 = make_procedure_call(some_function_declaration, [binop]);
let local_variable_assign = make_assign(local_variable.ident, some_function_call_2);

let while_block = make_block();
let while_condition = make_binary_operation(local_variable.ident, "<=", make_literal("24"));
let binop_2 = make_binary_operation(local_variable.ident, "-", make_literal("1"));
let factorial_call = make_procedure_call(factorial_declaration, [binop_2]);
let binop_3 = make_binary_operation(factorial_call, "-", make_literal("4"));
let local_variable_opassign = make_opassign(local_variable.ident, "+", binop_3);
let while_loop = make_while(while_condition, while_block);

while_block.statements.push(newline);
while_block.statements.push(make_statement(local_variable_opassign));
Main_block.statements.push(make_statement(local_variable));
Main_block.statements.push(newline);
Main_block.statements.push(make_statement(local_variable_assign));
Main_block.statements.push(newline);
/*
Main_block.statements.push(make_statement(while_loop));
Main_block.statements.push(newline);
*/
Main_block.statements.push(make_statement(make_return(clone(local_variable.ident))));

let code_element = document.getElementById("code");

code_element.scroll_options = {

	behavior: "smooth",
	block: "center",
	inline: "center"
};

let slider_element = document.getElementById("slider");

slider.addEventListener("input", slider_oninput);

function slider_oninput() {

	if (!inspection_mode) {

		toggle_inspection();
	}

	execution_index = parseInt(slider_element.value);

	inspection_cursor = execution_stack[execution_index];

	print();
}

function print() {

	slider_element.max = execution_stack.length-1;
	slider_element.value = execution_index;

	while (code_element.firstChild) {

		code_element.removeChild(code_element.firstChild);
	}

	mark_containment(Global_Block.statements[0]);

	print_to_dom(Global_Block.statements[0], code_element, code_element);

	let cursor = null;

	if (inspection_mode) {

		cursor = inspection_cursor;
	}
	else {

		cursor = execution_cursor;
	}

	if (cursor) {

		let printed_cursor = map_expr_to_printed.get(cursor);

		let position_x = printed_cursor.offsetLeft - code_element.scrollLeft;
		let midpoint_x = code_element.clientWidth / 2;
		let radius_x = code_element.clientWidth / 8;

		let position_y = printed_cursor.offsetTop - code_element.scrollTop;
		let midpoint_y = code_element.clientHeight / 2;
		let radius_y = 20;

		if (position_x < (midpoint_x - radius_x) ||
			position_x > (midpoint_x + radius_x) ||
			position_y < (midpoint_y - radius_y) ||
			position_y > (midpoint_y + radius_y)) {

			printed_cursor.scrollIntoView(code_element.scroll_options);
		}
	}
}

function start_debugging() {

	expression_stack.push(Global_Block);

	execution_cursor = Global_Block;

	execution_cursor.index = 0;
	execution_cursor.elements = execution_cursor.statements;

	execution_cursor = Global_Block.elements[0].expression;

	debugging = true;
}
function stop_debugging() {

	execution_cursor = null;

	debugging = false;
}
function step_into() {

	if (inspection_mode) {

		return;
	}

	let cursor = execution_cursor;

	let last_expression = expression_stack[expression_stack.length-1];

	if (cursor.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.push(execution_cursor);

		cursor.returned = false;

		transform(cursor);

		expression_stack.push(cursor);

		cursor = cursor.transformed;

		execution_cursor = cursor;

		step_into();

		return;
	}
	else if (cursor.base.kind == Code_Kind.DECLARATION) {

		let index = 1;

		cursor.elements = [cursor.type, cursor.ident];

		if (cursor.expression) {

			cursor.elements.push(cursor.expression);
			index += 1;
		}

		map_index_set(cursor, index);

		expression_stack.push(cursor);

		cursor = cursor.elements[index];

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.ASSIGN) {

		let index = 1;

		map_index_set(cursor, index);

		cursor.elements = [cursor.ident, cursor.expression];

		expression_stack.push(cursor);

		cursor = cursor.elements[index];

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.OPASSIGN) {

		let index = 1;

		map_index_set(cursor, index);

		cursor.elements = [cursor.ident, cursor.expression];

		expression_stack.push(cursor);

		cursor = cursor.elements[index];

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.RETURN) {

		let transformed = cursor.transformed.statements[0].expression;

		// need this to show return values
		transformed.times_executed = 0;

		let index = 1;

		map_index_set(cursor, index);

		cursor.elements = [transformed.ident, transformed.expression];

		expression_stack.push(cursor);

		cursor = cursor.expression;

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.BINARY_OPERATION) {

		let index = 0;

		map_index_set(cursor, index);

		expression_stack.push(cursor);

		cursor.elements = [cursor.left, cursor.right];

		cursor = cursor.left;

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.BLOCK) {

		block_stack.push(cursor);

		let index = 0;

		map_index_set(cursor, index);

		cursor.elements = cursor.statements;

		expression_stack.push(cursor);

		cursor = get_current_executable_expression(cursor);

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.IF) {

		let index = 0;

		map_index_set(cursor, index);

		cursor.elements = [cursor.condition, cursor.block];

		expression_stack.push(cursor);

		cursor = cursor.condition;

		execution_cursor = cursor;
	}
	else if (cursor.base.kind == Code_Kind.ELSE) {

		let index = 0;

		map_index_set(cursor, index);

		cursor.elements = [cursor.block];

		expression_stack.push(cursor);

		cursor = cursor.block;

		execution_cursor = cursor;

		step_into();
	}
	else if (cursor.base.kind == Code_Kind.WHILE) {

		let index = 0;

		map_index_set(cursor, index);

		cursor.elements = [cursor.condition, cursor.block];

		expression_stack.push(cursor);

		cursor = cursor.condition;

		execution_cursor = cursor;
	}
}
function step_out() {

	if (inspection_mode) {

		return;
	}

	let cursor = execution_cursor;

	if (cursor.base.kind == Code_Kind.STATEMENT) {

		cursor = cursor.expression;
	}

	let last_expression = expression_stack.pop();

	let last_call = call_stack[call_stack.length-1];

	if (last_expression.base.kind == Code_Kind.BLOCK) {

		block_stack.pop();

		let second_last_expression = expression_stack[expression_stack.length-1];

		// @Audit
		if (second_last_expression.base.kind == Code_Kind.WHILE) {

			cursor = second_last_expression.condition;

			map_index_set(second_last_expression, 0);
		}
		else if (second_last_expression.base.kind == Code_Kind.IF) {

			step_out();

			return;

		}
		else if (second_last_expression.base.kind == Code_Kind.ELSE) {

			step_out();

			return;
		}
	}

	if (last_expression.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.pop();
	}

	last_call = call_stack[call_stack.length-1];

	if (last_call && last_call.returned) {

		step_out();

		return;
	}

	if (last_expression.transformed_from_call) {

		// if we're stepping out of a call without returning

		cursor = last_expression.transformed_from_call;

		execution_cursor = cursor;

		step_out();
	}

	// @Audit
	if (last_expression.base.kind == Code_Kind.BINARY_OPERATION ||
		last_expression.base.kind == Code_Kind.DECLARATION ||
		last_expression.base.kind == Code_Kind.ASSIGN ||
		last_expression.base.kind == Code_Kind.OPASSIGN ||
		last_expression.base.kind == Code_Kind.IF ||
		last_expression.base.kind == Code_Kind.ELSE ||
		last_expression.base.kind == Code_Kind.WHILE ||
		last_expression.base.kind == Code_Kind.RETURN) {

		cursor = last_expression;
	}

	execution_cursor = cursor;
}

function get_current_executable_expression(parent) {

	let index = parent.index;

	let current = parent.elements[index];

	if (current.base.kind == Code_Kind.STATEMENT) {

		current = current.expression;
	}

	// @Copypaste
	if (current.base.kind != Code_Kind.NEWLINE) {

		return current;
	}
	else {

		return goto_next_executable_expression(parent);
	}
}
function goto_previous_executable_expression(parent) {

	let index = map_index_get(parent);

	let current = null;

	while (index >= 0) {

		index -= 1;

		current = parent.elements[index];

		if (current) {

			if (current.base.kind == Code_Kind.STATEMENT) {

				current = current.expression;
			}

			if (current.base.kind != Code_Kind.NEWLINE) {

				break;
			}
		}
	}

	map_index_set(parent, index);

	return current;
}
function goto_next_executable_expression(parent) {

	let index = map_index_get(parent);

	let current = null;

	while (index <= parent.elements.length) {

		index += 1;

		current = parent.elements[index];

		if (current) {

			if (current.base.kind == Code_Kind.STATEMENT) {

				current = current.expression;
			}

			if (current.base.kind != Code_Kind.NEWLINE) {

				break;
			}
		}

	}

	map_index_set(parent, index);

	return current;
}
function step_next() {

	if (inspection_mode) {

		if (execution_index < execution_stack.length-1) {

			execution_index += 1;

			inspection_cursor = execution_stack[execution_index];
		}
		else {

			toggle_inspection();
		}

		return;
	}

	let last_call = call_stack[call_stack.length-1];

	let last_block = block_stack[block_stack.length-1];

	let last_expression = expression_stack[expression_stack.length-1];

	if (execution_cursor.base.kind == Code_Kind.IF) {

		// @Audit
		// @Ugly
		if (typeof execution_cursor.loop === "undefined") {

			step_into();

			step_next();

			return;
		}
	}
	else if (execution_cursor.base.kind == Code_Kind.ELSE) {

		step_into();

		return;
	}

	// we're gonna test the condition later
	if (last_expression.base.kind != Code_Kind.IF &&
	    last_expression.base.kind != Code_Kind.WHILE) {

		run(execution_cursor);
	}

	if (typeof last_call === "undefined") {

		// we have exited the main call and there is nothing more to do
		return;
	}

	if (last_call.returned) {

		execution_cursor = last_call;

		return;
	}

	let cursor = goto_next_executable_expression(last_expression);

	let index = map_index_get(last_expression);

	if (index >= last_expression.elements.length) {

		// @Audit
		// :ExtraExpressions
		// execution_stack.push(last_expression);

		step_out();

		return;
	}

	execution_cursor = cursor;

	if (last_expression.base.kind == Code_Kind.IF) {

		if (run(last_expression.condition)) {

			execution_cursor = last_expression.block;

			step_into();
		}
		else {

			step_out();

			last_expression = expression_stack[expression_stack.length-1];

			execution_cursor = goto_next_executable_expression(last_expression);
		}
	}
	else if (last_expression.base.kind == Code_Kind.WHILE) {

		let condition = clone(last_expression.condition);

		// @Audit
		// should we transform here or just clone the .transformed?
		let block = transform(clone(last_expression.block));

		let cycle = make_if(condition, block);

		cycle.loop = last_expression;

		let should_run = run(condition);

		if (should_run) {

			// @Speed
			let while_index = last_block.statements.findIndex(

				function(elem) {

					return Object.is(elem.expression, last_expression);
				}
			);

			// @Audit
			last_block.statements.splice(while_index, 0, make_statement(cycle));

			let while_expr = expression_stack.pop();

			execution_cursor = cycle;

			step_into();
		}
		else {

			run(last_expression.condition);

			step_out();

			last_expression = expression_stack[expression_stack.length-1];

			execution_cursor = goto_next_executable_expression(last_expression);
		}
	}

	execution_index = execution_stack.length-1;
}
function step_back() {

	if (!inspection_mode) {

		toggle_inspection();

		execution_index = execution_stack.length-1;
	}
	else if (execution_index > 0) {

		execution_index -= 1;
	}

	inspection_cursor = execution_stack[execution_index];
}

let disable_execution_recording = false;
function run(target, force = false) {

	let last_expression = expression_stack[expression_stack.length-1];

	if (typeof target.times_executed == "undefined") {

		target.times_executed = 0;
	}

	// @Audit
	// what do we need this for?
	if (typeof last_expression.times_executed == "undefined") {

		last_expression.times_executed = 0;
	}

	if (target.times_executed > last_expression.times_executed && force === false) {
		
		return target.last_return;
	}

	if (typeof target.transformed_from_return === "undefined" &&
		typeof target.transformed_from_opassign === "undefined" &&
		target.base.kind != Code_Kind.BLOCK &&
		disable_execution_recording == false) {

		execution_stack.push(target);
	}

	let return_value = null;

	// :SameCodePath
	if (target.base.kind != Code_Kind.WHILE) {

		expression_stack.push(target);
	}

	let last_call = call_stack[call_stack.length-1];

	if (target.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.push(target);

		target.returned = false;

		transform(target);
	}
	else if (target.base.kind == Code_Kind.BLOCK) {

		block_stack.push(target);
	}

	if (target.base.kind == Code_Kind.RETURN) {

		return_value = run(target.transformed);

		last_call.returned = true;

		last_call.last_return = return_value;

		// :ExtraExpressions
		execution_stack.push(last_call);

		step_out();
	}

	if (target.base.kind == Code_Kind.STATEMENT) {

		return_value = run(target.expression);
	}
	else if (target.base.kind == Code_Kind.IF) {

		if (run(target.condition)) {

			return_value = run(target.block);
		}
		else {

			let else_expr = goto_next_executable_expression(last_expression);

			return_value = run(else_expr);
		}
	}
	else if (target.base.kind == Code_Kind.ELSE) {

		return_value = run(target.block);
	}
	else if (target.base.kind == Code_Kind.WHILE) {

		// @Incomplete
		// what about returns inside whiles?

		let condition = clone(target.condition);

		// @MassiveHack
		// the other approach would be to pass everything through functions, which is more messy
		disable_execution_recording = true;

		let should_run = run(condition);

		disable_execution_recording = false;

		let old_execution_cursor = execution_cursor;

		execution_cursor = target;

		while (should_run) {

			// @Ugly

			step_into();

			step_next();

			step_out();

			step_next();

			disable_execution_recording = true;

			should_run = run(condition, true);

			disable_execution_recording = false;
		}

		execution_cursor = old_execution_cursor;
	}
	else if (target.base.kind == Code_Kind.ASSIGN) {

		// OPASSIGNs get transformed into assigns which are run here

		let expression_value = run(target.expression);

		map_ident_to_value.set(target.ident.declaration.ident, expression_value);

		return_value = expression_value;
	}
	else if (target.base.kind == Code_Kind.DECLARATION) {

		let expression_value = null;

		if (target.expression) {

			expression_value = run(target.expression);
		}

		map_ident_to_value.set(target.ident.declaration.ident, expression_value);

		return_value = expression_value;
	}
	else if (target.base.kind == Code_Kind.IDENT) {

		if (target.transformed) {

			return_value = map_ident_to_value.get(target.transformed.statements[0].expression);
		}
		else {

			return_value = map_ident_to_value.get(target.declaration.ident);
		}
	}
	else if (target.base.kind == Code_Kind.BLOCK) {

		target.index = 0;
		target.elements = target.statements;

		let executing_expr = get_current_executable_expression(target);

		do {

			return_value = run(executing_expr);

			executing_expr = goto_next_executable_expression(target);

			if (last_call.returned) {

				break;
			}

		} while (executing_expr)
	}
	else if (!return_value && target.transformed) { // @Audit

		return_value = run(target.transformed);
	}
	else if (target.base.kind == Code_Kind.BINARY_OPERATION) {

		return_value = math_solve(target);
	}
	else if (target.base.kind == Code_Kind.LITERAL) {

		return_value = math_solve(target);
	}

	target.last_return = return_value;

	target.times_executed += 1;

	// @Audit
	// :ExtraExpressions
	// execution_stack.push(target);

	// calls pop themselves when they return
	if (target.base.kind !== Code_Kind.PROCEDURE_CALL &&
		last_call.returned === false) {

		expression_stack.pop();

		if (target.base.kind === Code_Kind.BLOCK) {

			block_stack.pop();
		}
	}

	return return_value;
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

		for (let statement of node.statements) {

			statements.push(clone(statement));
		}

		return make_block(statements);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE) {

		let params = null;

		if (node.parameters) {

			params = new Array();

			for (let param of node.parameters) {

				params.push(clone(param));
			}
		}

		return make_procedure(params, node.return_type, clone(node.block));
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		let args = null;

		if (node.args) {

			args = new Array();

			for (let arg of node.args) {

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

let transform_stack = new Array();
function transform(node, force = false) {

	if (node.transformed && force != true) {

		return node.transformed;
	}

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

					// @Audit
					// does anything bad happen because of the clone?
					let arg = clone(node.args[param_index]);

					let param_ident = make_ident(get_final_name(param.ident.name));

					let param_decl = make_declaration(param_ident, arg, param.type);

					replacement.statements.push(make_statement(param_decl));

					map_ident_replace.set(param.ident, param_ident);

					transform(arg);
				}
			}

			replacement.statements.push(newline);

			for (let stmt of procedure.block.statements) {

				replacement.statements.push(stmt);
			}

			transform(replacement);

			replacement.transformed_from_call = node;

			call_stack.pop();
		}
		else {

			for (let arg of node.args) {

				transform(arg);
			}
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		block_stack.push(node);

		node.declarations = new Array();

		for (let stmt of node.statements) {

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

		let ident = clone(node.ident);

		ident.transformed_from_opassign = node;

		let binop = make_binary_operation(ident, node.operation_type, node.expression);

		binop.transformed_from_opassign = node;

		let assign = make_assign(node.ident, binop);

		assign.transformed_from_opassign = node;

		replacement.statements.push(assign);
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

		let assign = make_assign(clone(ident), node.expression);

		assign.transformed_from_return = node;

		transform(node.expression);

		replacement.statements.push(make_statement(assign));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		/* @Disabled

		// @Incomplete
		// need dynamic type
		let ident = make_ident(get_final_name("binop"));

		// if (Object.is(node.left.declaration.type, Types.int)) {}
		let type = Types.int;

		let decl = make_declaration(ident, null, type);

		// @Audit
		last_block.declarations.push(decl);

		replacement.statements.push(make_statement(decl));
		*/

		transform(node.left);
		transform(node.right);

		/* @Disabled

		// @Incomplete
		// if neither the left or the right are transformed, combine declaration and assign

		let binop = make_binary_operation(node.left, node.operation_type, node.right);

		let assign = make_assign(make_ident(ident.name, ident.declaration), binop);

		replacement.statements.push(make_statement(assign));

		*/
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = node.declaration.ident;

		let ident_replacement = map_ident_replace.get(ident);

		if (ident_replacement) {

			ident = ident_replacement;
		}

		// @Hack
		// for use highlighting
		node.declaration = ident.declaration;

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

function mark_containment(node) {

	node.is_flowpoint = flowpoints.indexOf(execution_stack.indexOf(node)) >= 0 ||
	                          flowpoints.indexOf(execution_stack.lastIndexOf(node)) >= 0;

	node.is_inspection = Object.is(node, inspection_cursor);

	node.is_execution = Object.is(node, execution_cursor);

	node.contains_flowpoint = 0;
	node.contains_inspection = 0;
	node.contains_execution = 0;

	if (node.transformed) {

		mark_containment(node.transformed);

		node.contains_flowpoint |= node.transformed.contains_flowpoint;
		node.contains_inspection |= node.transformed.contains_inspection;
		node.contains_execution |= node.transformed.contains_execution;
	}

	if (node.base.kind == Code_Kind.STATEMENT) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		if (node.expression) {

			mark_containment(node.expression);

			node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
			node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
			node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		mark_containment(node.left);
		mark_containment(node.right);

		node.contains_flowpoint = node.left.contains_flowpoint || node.left.is_flowpoint ||
		                          node.right.contains_flowpoint || node.right.is_flowpoint;
		node.contains_inspection = node.left.contains_inspection || node.left.is_inspection ||
		                          node.right.contains_inspection || node.right.is_inspection;
		node.contains_execution = node.left.contains_execution || node.left.is_execution ||
		                          node.right.contains_execution || node.right.is_execution;
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		for (let stmt of node.statements) {

			mark_containment(stmt);

			node.contains_flowpoint |= stmt.contains_flowpoint || stmt.is_flowpoint;
			node.contains_inspection |= stmt.contains_inspection || stmt.is_inspection;
			node.contains_execution |= stmt.contains_execution || stmt.is_execution;
		}
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

function should_inline(node) {

	return node.contains_flowpoint | node.contains_inspection | node.contains_execution;
}

/* @Incomplete
// need to use flex for block indentation
let palette = ["rgba(200, 0, 0, 0.1)", "rgba(0, 200, 0, 0.1)", "rgba(0, 0, 200, 0.1)"];
let palette_index = 0;
*/
let print_expression_stack = new Array();
let map_expr_to_printed = new Map();
function print_to_dom(node, print_target, block_print_target, is_transformed_block = false) {

	let expr = document.createElement("expr");

	expr.node = node;

	let should_inline_node = should_inline(node);

	if (node.transformed && should_inline_node && 
		node.transformed.base.kind == Code_Kind.BLOCK &&
		node.base.kind != Code_Kind.RETURN &&
		node.base.kind != Code_Kind.OPASSIGN &&
	    node.base.kind != Code_Kind.IDENT) {

		/*
		let inlined = document.createElement("inlined");
		inlined.style = "background-color: "+ palette[palette_index];
		palette_index += 1;
		palette_index %= palette.length;

		print_to_dom(node.transformed, inlined, inlined, true);
		block_print_target.appendChild(inlined);
		*/
		print_to_dom(node.transformed, block_print_target, block_print_target, true);

		print_newline(block_print_target);

		if (node.base.kind == Code_Kind.BINARY_OPERATION ||
			node.base.kind == Code_Kind.RETURN ||
			node.base.kind == Code_Kind.BLOCK) {

			return;
		}
	}

	let last_expression = print_expression_stack[print_expression_stack.length-1];

	print_expression_stack.push(node);

	if (node.base.kind == Code_Kind.BLOCK) {

		if (!is_transformed_block) {

			block_print_target.appendChild(document.createTextNode("{"));

			print_newline(block_print_target);

			indent_level += 1;
		}

		for (let statement of node.statements) {

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

		if (node.expression.base.kind == Code_Kind.PROCEDURE_CALL &&
			should_inline(node.expression) == true) {

			print_to_dom(node.expression, expr, block_print_target);
		}
		else {

			print_indent(expr);

			print_to_dom(node.expression, expr, block_print_target);

			if (expr.children.length > 0) {

				if (node.expression.base.kind != Code_Kind.NEWLINE &&
					node.expression.base.kind != Code_Kind.IF &&
					node.expression.base.kind != Code_Kind.ELSE &&
					node.expression.base.kind != Code_Kind.WHILE) {

					print_semicolon(expr);
				}

				print_target.appendChild(expr);

			}

			print_newline(print_target);
		}
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		if (values_shown && node.last_return !== null &&
		    typeof node.last_return !== "undefined" &&
		    node.times_executed >= last_expression.times_executed) {

			expr.appendChild(document.createTextNode(node.last_return));
		}
		else if (should_inline_node && node.transformed) {

			let return_ident = node.transformed.statements[0].expression.ident;

			print_to_dom(clone(return_ident), expr, block_print_target);
		}
		else {

			print_to_dom(node.declaration.ident, expr, block_print_target);

			expr.appendChild(document.createTextNode("("));

			if (node.args) {

				for (let arg of node.args) {

					print_to_dom(arg, expr, block_print_target);

					expr.appendChild(document.createTextNode(", "));
				}

				expr.removeChild(expr.lastChild);
			}

			expr.appendChild(document.createTextNode(")"));
		}

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.IF) {

		expr.appendChild(document.createTextNode("if ("));

		print_to_dom(node.condition, expr, block_print_target);

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, print_target);
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		expr.appendChild(document.createTextNode("else "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, print_target);
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		expr.appendChild(document.createTextNode("while ("));

		print_to_dom(node.condition, expr, block_print_target);

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, print_target);
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		// @Audit
		if (values_shown && should_inline_node == false && node.last_return !== null &&
		    typeof node.last_return !== "undefined" &&
		    node.times_executed >= last_expression.times_executed) {

			expr.appendChild(document.createTextNode(node.last_return));
		}
		else {

			print_to_dom(node.left, expr, block_print_target);

			expr.appendChild(document.createTextNode(" "+ node.operation_type +" "));

			print_to_dom(node.right, expr, block_print_target);
		}

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		// @Audit
		// @NotTested
		if (node.expression && node.expression.base.kind == Code_Kind.PROCEDURE) {

			let procedure = node.expression;

			print_to_dom(procedure.return_type, expr);

			expr.appendChild(document.createTextNode(" "));

			print_to_dom(node.ident, expr);

			expr.appendChild(document.createTextNode("("));

			if (procedure.parameters) {

				for (let param of procedure.parameters) {

					print_to_dom(param, expr, block_print_target);
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

				print_to_dom(node.expression, expr, block_print_target);
			}

			print_target.appendChild(expr);
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		print_to_dom(node.ident, expr, block_print_target);

		expr.appendChild(document.createTextNode(" = "));

		print_to_dom(node.expression, expr, block_print_target);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		print_to_dom(node.ident, expr, block_print_target);

		expr.appendChild(document.createTextNode(" "+ node.operation_type +"= "));

		print_to_dom(node.expression, expr, block_print_target);

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

		let text = null;

		// @Incomplete
		// what about `ident = ident`
		if (values_shown && node.last_return !== null &&
			typeof node.last_return !== "undefined") {

			text = node.last_return;
		}
		else {

			text = ident.name;
		}

		expr.appendChild(document.createTextNode(text));

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

	print_expression_stack.pop();

	map_expr_to_printed.set(node, expr);

	if (Object.is(node, execution_cursor)) {

		expr.classList.add("executing");

		if (!inspection_mode) {

			expr.classList.add("active_cursor");
		}
	}
	if (Object.is(node, inspection_cursor)) {

		expr.classList.add("selected");

		if (inspection_mode) {

			expr.classList.add("active_cursor");
		}
	}
	// procedure calls show up twice in execution stack
	if (flowpoints.indexOf(execution_stack.indexOf(node)) >= 0 ||
	    flowpoints.indexOf(execution_stack.lastIndexOf(node)) >= 0) {

		expr.classList.add("flow-"+ active_dataflow);
	}
}

main();