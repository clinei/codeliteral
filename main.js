"use strict";

function main() {

	map_keyboard();

	start_debugging();
	print();
}

let values_shown = false;
let lhs_values_shown = false;
let binop_values_shown = true;
let expand_all = false;

function number_compare(a, b) {
	if (a < b) {
		return -1;
	}
	else {
		return 1;
	}
}

function map_keyboard() {

	document.addEventListener("keydown", document_keydown);
}

let prev_cursor;
function document_keydown(event) {

	prev_cursor = inspection_cursor;

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

	// press W
	if (event.keyCode == 87) {

		up_line();
		print();
	}

	// press S
	if (event.keyCode == 83) {

		down_line();
		print();
	}

	// press A
	if (event.keyCode == 65) {

		left_line();
		print();
	}

	// press D
	if (event.keyCode == 68) {

		right_line();
		print();
	}

	// press Y
	if (event.keyCode == 89) {

		previous_use();
		print();
	}

	// press U
	if (event.keyCode == 85) {

		next_use();
		print();
	}

	// press H
	if (event.keyCode == 72) {

		previous_change();
		print();
	}

	// press J
	if (event.keyCode == 74) {

		next_change();
		print();
	}

	// press I
	if (event.keyCode == 73) {

		hide_flowzone();
		print();
	}

	// press O
	if (event.keyCode == 79) {

		unhide_flowzone();
		print();
	}

	// press K
	if (event.keyCode == 75) {

		add_flowpoint();
		print();
	}

	// press L
	if (event.keyCode == 76) {

		delete_flowpoint();
		print();
	}

	// press ,
	if (event.keyCode == 188) {

		previous_flowpoint();
		print();
	}

	// press .
	if (event.keyCode == 190) {

		next_flowpoint();
		print();
	}

	// press R
	if (event.keyCode == 82) {

		// move_between_original_idents = !move_between_original_idents;
		previous_original();
		print();
	}

	// press T
	if (event.keyCode == 84) {

		next_original();
		print();
	}

	// press F
	if (event.keyCode == 70) {

		values_shown = !values_shown;
		print();
	}

	// press C
	if (event.keyCode == 67) {

		lhs_values_shown = !lhs_values_shown;
		print();
	}

	// press E
	if (event.keyCode == 69) {

		binop_values_shown = !binop_values_shown;
		print();
	}

	// press G
	if (event.keyCode == 71) {

		expand_all = !expand_all;
		print();
	}

	/*
	// press M
	if (event.keyCode == 77) {

		toggle_inspection();
		print();
	}
	*/

	let number = event.keyCode - 48;

	if (number >= 0 && number <= 9) {

		active_dataflow = number;

		flowpoints = dataflows[active_dataflow];
		
		print();
	}
}

let inspection_mode = false;
function toggle_inspection() {

	if (!inspection_mode) {

		inspection_cursor = execution_cursor;
		inspection_cursor.is_inspection = true;

		inspection_mode = true;
	}
	else {

		slider_element.value = slider_element.min;

		inspection_cursor.is_inspection = false;
		inspection_cursor = null;

		inspection_mode = false;
	}
}

function add_flowpoint() {

	if (flowpoints.indexOf(execution_index) >= 0) {

		return;
	}

	// insertion sort
	let index = 0;
	while (index < flowpoints.length) {

		if (flowpoints[index] > execution_index) {

			break;
		}

		index += 1;
	}
	
	inspection_cursor.is_flowpoint = true;

	flowpoints.splice(index, 0, execution_index);
}
function delete_flowpoint() {

	let flowpoint_index = flowpoints.indexOf(execution_index);

	if (flowpoint_index >= 0) {

		inspection_cursor.is_flowpoint = false;
		flowpoints.splice(flowpoint_index, 1);
	}
}
function next_flowpoint() {

	if (flowpoints.length) {

		if (!inspection_mode) {

			toggle_inspection();
		}

		let index = find_next_index_in_array(flowpoints, execution_index);

		if (index >= flowpoints.length) {

			index = 0;
		}

		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[flowpoint];
		inspection_cursor.is_inspection = true;
	}
}
function previous_flowpoint() {
	
	if (flowpoints.length) {

		if (!inspection_mode) {
			
			toggle_inspection();
		}

		let index = find_previous_index_in_array(flowpoints, execution_index);

		if (index < 0) {

			index = flowpoints.length-1;
		}

		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[flowpoint];
		inspection_cursor.is_inspection = true;
	}
}
function down_line() {

	let line = current_line;

	while (line < map_line_to_execution_indices.length) {

		line += 1;
		if (typeof map_line_to_execution_indices[line] == "undefined") {

			continue;
		}
		let indices = map_line_to_execution_indices[line];
		if (indices.length) {

			if (column_index >= indices.length) {
				column_index = indices.length - 1;
			}
			execution_index = indices[column_index];
			slider_element.value = execution_index;
			inspection_cursor.is_inspection = false;
			inspection_cursor = execution_stack[execution_index];
			inspection_cursor.is_inspection = true;

			return;
		}
	}
}
function up_line() {

	let line = current_line;

	while (line >= 0) {

		line -= 1;
		if (typeof map_line_to_execution_indices[line] == "undefined") {

			continue;
		}
		let indices = map_line_to_execution_indices[line];
		if (indices.length) {

			if (column_index >= indices.length) {
				column_index = indices.length - 1;
			}
			execution_index = indices[column_index];
			slider_element.value = execution_index;
			inspection_cursor.is_inspection = false;
			inspection_cursor = execution_stack[execution_index];
			inspection_cursor.is_inspection = true;

			return;
		}
	}
}
function left_line() {

	let indices = map_line_to_execution_indices[current_line];

	if (column_index > 0) {
		column_index -= 1;
	}

	execution_index = indices[column_index];
	slider_element.value = execution_index;
	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;
}
function right_line() {

	let indices = map_line_to_execution_indices[current_line];

	if (column_index < indices.length-1) {
		column_index += 1;
	}

	execution_index = indices[column_index];
	slider_element.value = execution_index;
	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;
}
function previous_change() {

	if (inspection_cursor.base.kind == Code_Kind.IDENT) {

		let indices = map_ident_to_changes.get(inspection_cursor.declaration.ident);
		let index = find_previous_index_in_array(indices, execution_index);

		if (index < 0) {
	
			return;
		}

		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[execution_index];
		inspection_cursor.is_inspection = true;
	}
}
function next_change() {

	if (inspection_cursor.base.kind == Code_Kind.IDENT) {

		let indices = map_ident_to_changes.get(inspection_cursor.declaration.ident);
		let index = find_next_index_in_array(indices, execution_index);

		if (index >= indices.length) {

			return;
		}

		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[execution_index];
		inspection_cursor.is_inspection = true;
	}
}
function previous_use() {

	if (inspection_cursor.base.kind == Code_Kind.IDENT) {

		let indices = map_ident_to_uses.get(inspection_cursor.declaration.ident);
		let index = find_previous_index_in_array(indices, execution_index);

		if (index < 0) {
	
			return;
		}

		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[execution_index];
		inspection_cursor.is_inspection = true;
	}
}
function next_use() {

	if (inspection_cursor.base.kind == Code_Kind.IDENT) {

		let indices = map_ident_to_uses.get(inspection_cursor.declaration.ident);
		let index = find_next_index_in_array(indices, execution_index);

		if (index >= indices.length) {

			return;
		}

		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[execution_index];
		inspection_cursor.is_inspection = true;
	}
}
function previous_original() {
	let indices = map_original_to_indices.get(inspection_cursor.original);
	let index = find_previous_index_in_array(indices, execution_index);
	
	if (index < 0) {

		return;
	}

	execution_index = indices[index];
	slider_element.value = execution_index;
	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;
}
function next_original() {
	let indices = map_original_to_indices.get(inspection_cursor.original);
	let index = find_next_index_in_array(indices, execution_index);
	
	if (index >= indices.length) {

		return;
	}

	execution_index = indices[index];
	slider_element.value = execution_index;
	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;
}
function find_next_index_in_array(array, index) {

	let i = 0;
	while  (i < array.length) {

		if (array[i] > index) {

			return i;
		}

		i += 1;
	}

	return i;
}
function find_next_index_in_array_inclusive(array, index) {

	let i = 0;
	while  (i < array.length) {

		if (array[i] >= index) {

			return i;
		}

		i += 1;
	}

	return i;
}
function find_previous_index_in_array(array, index) {

	let i = array.length-1;
	while (i >= 0) {

		if (array[i] < index) {

			return i;
		}

		i -= 1;
	}

	return i;
}
function find_previous_index_in_array_inclusive(array, elem) {

	let i = array.length-1;
	while (i >= 0) {

		if (array[i] <= elem) {

			return i;
		}

		i -= 1;
	}

	return i;
}
function hide_flowzone() {

	let flowpoint = flowpoints[find_previous_index_in_array_inclusive(flowpoints, execution_index)];

	if (hidden_flowzones[active_dataflow].indexOf(flowpoint) >= 0) {

		return;
	}

	hidden_flowzones[active_dataflow].push(flowpoint);
}
function unhide_flowzone() {

	let flowpoint = flowpoints[find_previous_index_in_array_inclusive(flowpoints, execution_index)];

	let index = hidden_flowzones[active_dataflow].indexOf(flowpoint);

	if (index >= 0) {

		hidden_flowzones[active_dataflow].splice(index, 1);
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
	FOR: "for",
	BREAK: "break",
	CONTINUE: "continue",
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

	procedure.parameters = parameters ? parameters : [];
	procedure.return_type = return_type ? return_type : Types.void;
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
	procedure_call.args = args ? args : [];

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

let Code_For = {

	base: null,

	begin: null,
	condition: null,
	cycle_end: null,
	block: null
};
function make_for(begin, condition, cycle_end, block) {

	let for_ = Object.assign({}, Code_For);
	for_.base = make_node();
	for_.base.kind = Code_Kind.FOR;

	for_.begin = begin;
	for_.condition = condition;
	for_.cycle_end = cycle_end;
	for_.block = block;

	return for_;
}

let Code_Break = {

	base: null,
};
function make_break() {

	let break_ = Object.assign({}, Code_Break);
	break_.base = make_node();
	break_.base.kind = Code_Kind.BREAK;

	return break_;
}

let Code_Continue = {

	base: null,
};
function make_continue() {

	let continue_ = Object.assign({}, Code_Continue);
	continue_.base = make_node();
	continue_.base.kind = Code_Kind.CONTINUE;

	return continue_;
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

	original: null,
	name: null,
	block: null,
	declaration: null
};
function make_ident(name, declaration) {

	let ident = Object.assign({}, Code_Ident);
	ident.base = make_node();
	ident.base.kind = Code_Kind.IDENT;

	ident.original = ident;
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

let Types = {
	int : make_ident("int"),
	float : make_ident("float"),
	void : make_ident("void"),
	Any: make_ident("Any")
};

let map_call_to_settings = new Map();

let map_ident_to_value = new Map();
let map_ident_to_changes = new Map();
let map_ident_to_uses = new Map();
let map_original_to_indices = new Map();

let map_original_to_clone = new Map();

let debugging = false;
let execution_cursor = null;
let execution_index = 0;
let call_stack = new Array();
let block_stack = new Array();
let loop_stack = new Array();
let execution_stack = new Array();
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

let hidden_flowzones = new Array(10);

hidden_flowzones[0] = new Array();
hidden_flowzones[1] = new Array();
hidden_flowzones[2] = new Array();
hidden_flowzones[3] = new Array();
hidden_flowzones[4] = new Array();
hidden_flowzones[5] = new Array();
hidden_flowzones[6] = new Array();
hidden_flowzones[7] = new Array();
hidden_flowzones[8] = new Array();
hidden_flowzones[9] = new Array();

let active_dataflow = 1;
let flowpoints = dataflows[active_dataflow];

let code_composed = false;

/*
void print(let arg) {
	console.log(arg);
}
*/
let print_procedure = console.log;
let print_declaration = make_declaration(make_ident("print"), print_procedure);

/*
int some_other_function(int number) {
	while (number > 0) {
		if (number > 50) {
			number -= 5;
			continue;
		}
		if (number < 40) {
			number = 5;
			break;
		}
		number -= 10;
	}
	return number;
}
*/
let some_other_function_block = make_block();
let some_other_function_param = make_declaration(make_ident("number"), null, Types.int);
let some_other_function_procedure = make_procedure([some_other_function_param], Types.int, some_other_function_block);
let some_other_function_declaration = make_declaration(make_ident("some_other_function"), some_other_function_procedure);
let while_block_2 = make_block();
let while_cond_2 = make_binary_operation(clone(some_other_function_param.ident), ">", make_literal("0"));
let while_2 = make_while(while_cond_2, while_block_2);
let while_if_cond_2 = make_binary_operation(clone(some_other_function_param.ident), ">", make_literal("50"));
let while_if_block_2 = make_block();
let while_if_2 = make_if(while_if_cond_2, while_if_block_2);
let while_if_opassign_2 = make_opassign(clone(some_other_function_param.ident), "-", make_literal("5"));
let while_if_continue_2 = make_continue();
while_if_block_2.statements.push(make_statement(while_if_opassign_2));
while_if_block_2.statements.push(make_statement(while_if_continue_2));
let while_if_cond_3 = make_binary_operation(clone(some_other_function_param.ident), "<", make_literal("40"));
let while_if_block_3 = make_block();
let while_if_3 = make_if(while_if_cond_3, while_if_block_3);
let while_if_assign_3 = make_assign(clone(some_other_function_param.ident), make_literal("5"));
let while_if_break_3 = make_break();
while_if_block_3.statements.push(make_statement(while_if_assign_3));
while_if_block_3.statements.push(make_statement(while_if_break_3));
let while_opassign_4 = make_opassign(clone(some_other_function_param.ident), "-", make_literal("10"));
while_block_2.statements.push(make_statement(while_if_2));
while_block_2.statements.push(make_statement(while_if_3));
while_block_2.statements.push(make_statement(while_opassign_4));
some_other_function_block.statements.push(make_statement(while_2));
some_other_function_block.statements.push(make_statement(make_return(clone(some_other_function_param.ident))));

/*
int some_function(int num_iters) {
	int sum = 0;
	for (int i = 0; i < num_iters; i += 1) {
		sum += i * 20;
	}
	return some_other_function(sum);
}
*/
let some_function_block = make_block();
let some_function_param = make_declaration(make_ident("num_iters"), null, Types.int);
let some_function_procedure = make_procedure([some_function_param], Types.int, some_function_block);
let some_function_declaration = make_declaration(make_ident("some_function"), some_function_procedure);

let some_function_sum = make_declaration(make_ident("sum"), make_literal("0"), Types.int);
let some_function_for_begin = make_declaration(make_ident("i"), make_literal("0"), Types.int);
let some_function_for_cond = make_binary_operation(clone(some_function_for_begin.ident), "<", some_function_param.ident);
let some_function_for_end = make_opassign(clone(some_function_for_begin.ident), "+", make_literal("1"));
let some_function_for_block = make_block();
let some_function_for = make_for(make_statement(some_function_for_begin), 
								 some_function_for_cond, 
								 make_statement(some_function_for_end), 
								 some_function_for_block);
let for_block_stmt = make_statement(
                     make_opassign(clone(some_function_sum.ident), 
                                   "+", 
                                   make_binary_operation(clone(some_function_for_begin.ident), "*", make_literal("20"))));
some_function_for_block.statements.push(for_block_stmt);
let some_other_function_call = make_procedure_call(some_other_function_declaration, [clone(some_function_sum.ident)]);

some_function_block.statements.push(make_statement(some_function_sum));
some_function_block.statements.push(make_statement(some_function_for));
some_function_block.statements.push(make_statement(make_return(some_other_function_call)));

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
let if_condition = make_binary_operation(clone(factorial_param.ident), ">", make_literal("1"));
let factorial_binop = make_binary_operation(clone(factorial_param.ident), "-", make_literal("1"));
let factorial_recursive_call = make_procedure_call(factorial_declaration, [factorial_binop]);
let factorial_binop_2 = make_binary_operation(factorial_recursive_call, "*", clone(factorial_param.ident));
if_block.statements.push(make_statement(make_return(factorial_binop_2)));

let else_block = make_block();
else_block.statements.push(make_statement(make_return(make_literal("1"))));

factorial_block.statements.push(make_statement(make_if(if_condition, if_block)));
factorial_block.statements.push(make_statement(make_else(else_block)));

/*
int factorial_iter(int number) {
	int sum = 1;
	while (number > 1) {
		sum *= number;
		number -= 1;
	}
	return sum;
}
*/
let factorial_iter_block = make_block();
let factorial_iter_param = make_declaration(make_ident("number"), null, Types.int);
let factorial_iter_procedure = make_procedure([factorial_iter_param], Types.int, factorial_iter_block);
let factorial_iter_declaration = make_declaration(make_ident("factorial_iter"), factorial_iter_procedure);

let factorial_iter_sum = make_declaration(make_ident("sum"), make_literal("1"), Types.int);
let factorial_iter_while_block = make_block();
let factorial_iter_while_cond = make_binary_operation(clone(factorial_iter_param.ident), ">", make_literal("1"));
let factorial_iter_while = make_while(factorial_iter_while_cond, factorial_iter_while_block);
let factorial_iter_while_opassign = make_opassign(clone(factorial_iter_sum.ident), "*", clone(factorial_iter_param.ident));
let factorial_iter_while_opassign_2 = make_opassign(clone(factorial_iter_param.ident), "-", make_literal("1"));
factorial_iter_while_block.statements.push(make_statement(factorial_iter_while_opassign));
factorial_iter_while_block.statements.push(make_statement(factorial_iter_while_opassign_2));
factorial_iter_block.statements.push(make_statement(factorial_iter_sum));
factorial_iter_block.statements.push(make_statement(factorial_iter_while));
factorial_iter_block.statements.push(make_statement(make_return(clone(factorial_iter_sum.ident))));

/*
int nested_loops(int width, int height) {
	for (int width_iter = 0; width_iter < width; width_iter += 1) {
		for (int height_iter = 0; height_iter < height; height_iter += 1) {
			int d = width_iter * width + height_iter;
			print(d);
			factorial(d);
		}
	}
	return 42;
}
*/
let nested_loops_block = make_block();
let nested_loops_width = make_declaration(make_ident("width"), null, Types.int);
let nested_loops_height = make_declaration(make_ident("height"), null, Types.int);
let nested_loops_procedure = make_procedure([nested_loops_width, nested_loops_height], Types.int, nested_loops_block);
let nested_loops_declaration = make_declaration(make_ident("nested_loops"), nested_loops_procedure);
let nested_loops_for_block = make_block();
let nested_loops_for_begin = make_declaration(make_ident("width_iter"), make_literal("0"), Types.int);
let nested_loops_for_cond = make_binary_operation(clone(nested_loops_for_begin.ident), "<", clone(nested_loops_width.ident));
let nested_loops_for_end = make_opassign(clone(nested_loops_for_begin.ident), "+", make_literal("1"));
let nested_loops_for = make_for(make_statement(nested_loops_for_begin), 
								nested_loops_for_cond, 
								make_statement(nested_loops_for_end), 
								nested_loops_for_block);
let nested_loops_for_2_block = make_block();
let nested_loops_for_2_begin = make_declaration(make_ident("height_iter"), make_literal("0"), Types.int);
let nested_loops_for_2_cond = make_binary_operation(clone(nested_loops_for_2_begin.ident), "<", clone(nested_loops_height.ident));
let nested_loops_for_2_end = make_opassign(clone(nested_loops_for_2_begin.ident), "+", make_literal("1"));
let nested_loops_for_2 = make_for(make_statement(nested_loops_for_2_begin), 
								nested_loops_for_2_cond, 
								make_statement(nested_loops_for_2_end), 
								nested_loops_for_2_block);
let nested_loops_binop = make_binary_operation(clone(nested_loops_for_begin.ident), "*", make_literal("2"));
let nested_loops_binop_2 = make_binary_operation(nested_loops_binop, "+", clone(nested_loops_for_2_begin.ident));
let nested_loops_inner = make_declaration(make_ident("inner"), nested_loops_binop_2, Types.int);
let nested_loops_print_call = make_procedure_call(print_declaration, [clone(nested_loops_inner.ident)]);
let nested_loops_factorial_call = make_procedure_call(factorial_declaration, [clone(nested_loops_inner.ident)]);
nested_loops_for_2_block.statements.push(make_statement(nested_loops_inner));
nested_loops_for_2_block.statements.push(make_statement(nested_loops_print_call));
nested_loops_for_2_block.statements.push(make_statement(nested_loops_factorial_call));
nested_loops_for_block.statements.push(make_statement(nested_loops_for_2));
nested_loops_block.statements.push(make_statement(nested_loops_for));
nested_loops_block.statements.push(make_statement(make_return(make_literal("42"))));

let Main_block = make_block();
let Main_procedure = make_procedure(null, Types.int, Main_block);
let Main_declaration = make_declaration(make_ident("main"), Main_procedure);
let Main_call = make_procedure_call(Main_declaration);

Global_Block.statements.push(make_statement(Main_call));

/*
int main() {
    int local_variable = 3;
	local_variable = some_function(local_variable);
	local_variable = factorial(local_variable);
	local_variable = factorial_iter(5);
	local_variable = nested_loops();
	return local_variable;
}
*/
let local_variable = make_declaration(make_ident("local_variable"), make_literal("3"), Types.int);
let some_function_call = make_procedure_call(some_function_declaration, [clone(local_variable.ident)]);
let local_variable_assign = make_assign(clone(local_variable.ident), some_function_call);
let factorial_call = make_procedure_call(factorial_declaration, [clone(local_variable.ident)]);
let local_variable_assign_2 = make_assign(clone(local_variable.ident), factorial_call);
let factorial_iter_call = make_procedure_call(factorial_iter_declaration, [make_literal("5")]);
let local_variable_assign_3 = make_assign(clone(local_variable.ident), factorial_iter_call);
let nested_loops_call = make_procedure_call(nested_loops_declaration, [make_literal("2"), make_literal("2")]);
let local_variable_assign_4 = make_assign(clone(local_variable.ident), nested_loops_call);

Main_block.statements.push(make_statement(local_variable));
Main_block.statements.push(make_statement(local_variable_assign));
Main_block.statements.push(make_statement(local_variable_assign_2));
Main_block.statements.push(make_statement(local_variable_assign_3));
Main_block.statements.push(make_statement(local_variable_assign_4));
Main_block.statements.push(make_statement(make_return(clone(local_variable.ident))));

code_composed = true;

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

	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;

	print();
}

function print() {

	slider_element.max = execution_stack.length-1;
	slider_element.value = execution_index;

	while (code_element.firstChild) {

		code_element.removeChild(code_element.firstChild);
	}

	palette_index = 0;
	line_count = 0;

	map_line_to_execution_indices = new Array();
	map_line_to_execution_indices[0] = new Array();

	mark_containment(Global_Block.statements[0]);
	
	print_to_dom(Global_Block.statements[0], code_element, code_element);
	
	column_index = map_line_to_execution_indices[current_line].indexOf(execution_index);

	let printed_cursor = map_expr_to_printed.get(inspection_cursor);
	
	let position_y = printed_cursor.offsetTop - code_element.scrollTop;
	let midpoint_y = code_element.clientHeight / 2;
	let radius_y = 20;

	if (Object.is(inspection_cursor, prev_cursor) && expand_all && false) {

		code_element.scrollTop = position_y - midpoint_y / 2;
	}
	else {

		let position_x = printed_cursor.offsetLeft - code_element.scrollLeft;
		let midpoint_x = code_element.clientWidth / 2;
		let radius_x = code_element.clientWidth / 8;
	
		if (position_x < (midpoint_x - radius_x) ||
			position_x > (midpoint_x + radius_x) ||
			position_y < (midpoint_y - radius_y) ||
			position_y > (midpoint_y + radius_y)) {
	
			printed_cursor.scrollIntoView(code_element.scroll_options);
		}
	}
}

function start_debugging() {

	execution_cursor = Global_Block;

	execution_cursor.index = 0;
	execution_cursor.elements = execution_cursor.statements;

	execution_cursor.is_execution = false;
	execution_cursor = Global_Block.elements[0].expression;
	execution_cursor.is_execution = true;

	run(execution_cursor);

	slider_element.value = 0;
	slider_oninput();

	debugging = true;
}
function stop_debugging() {

	execution_cursor.is_execution = false;
	execution_cursor = null;

	debugging = false;
}

function step_next() {

	if (execution_index < execution_stack.length-1) {

		execution_index += 1;

		inspection_cursor.is_inspection = false;
		inspection_cursor = execution_stack[execution_index];
		inspection_cursor.is_inspection = true;
	}
}
function step_back() {

	if (!inspection_mode) {

		toggle_inspection();

		execution_index = execution_stack.length-1;
	}
	else if (execution_index > 0) {

		execution_index -= 1;
	}

	inspection_cursor.is_inspection = false;
	inspection_cursor = execution_stack[execution_index];
	inspection_cursor.is_inspection = true;
}

let disable_execution_recording = false;
function run(node, force = false) {

	let last_block = block_stack[block_stack.length-1];
	let last_loop = loop_stack[loop_stack.length-1];

	let return_value = null;

	let last_call = call_stack[call_stack.length-1];

	if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		call_stack.push(node);

		node.returned = false;

		if (typeof node.declaration.expression == "function") {
			// native JS function
			let values = [];
			for (let arg of node.args) {
				values.push(run(arg));
			}
			return_value = node.declaration.expression.apply(null, values);
			node.returned = true;
		}
		else {

			return_value = run(transform(node));
		}

		call_stack.pop();
	}

	if (node.base.kind == Code_Kind.RETURN) {

		return_value = run(transform(node));

		/*
		map_ident_to_changes.get(last_call.transformed.statements[0].expression.ident).push(node.execution_cursor);
		map_original_ident_to_changes.get(last_call.transformed.statements[0].expression.ident.original).push(node.execution_cursor);
		*/

		last_call.returned = true;

		last_call.last_return = return_value;
	}

	if (node.base.kind == Code_Kind.STATEMENT) {

		return_value = run(node.expression);
	}
	else if (node.base.kind == Code_Kind.IF) {

		let else_stmt = last_block.statements[last_block.index + 1];
		let else_expr;
		if (else_stmt && else_stmt.expression.base.kind == Code_Kind.ELSE) {

			else_expr = else_stmt.expression;
			else_expr.if_expr = node;
		}

		if (run(node.condition)) {

			return_value = run(node.block);
		}
		else if (else_expr) {

			last_block.index += 1;
			return_value = run(else_expr);
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		return_value = run(node.block);
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		// could pass this as a param
		let block_index = last_block.statements.findIndex(
			function(elem) {
				return Object.is(elem.expression, node);
			}
		);

		loop_stack.push(node);

		let should_run = true;
		node.broken = false;
		while (should_run && node.broken == false && last_call.returned == false) {
			let condition = clone(node.condition);
			should_run = run(condition);
			let block = clone(node.block);
			node.continued = false;
			if (should_run) {
				return_value = run(block);
			}
			let cycle = make_if(condition, block);
			cycle.loop = node;

			last_block.statements.splice(block_index, 0, make_statement(cycle));
			block_index += 1;
		}

		loop_stack.pop();

		last_block.index = block_index;
	}
	else if (node.base.kind == Code_Kind.FOR) {

		// could pass this as a param
		let block_index = last_block.statements.findIndex(
			function(elem) {
				return Object.is(elem.expression, node);
			}
		);
		last_block.statements.splice(block_index, 0, node.begin);
		block_index += 1;
		run(node.begin.expression);
		node.block.statements.push(node.cycle_end);

		loop_stack.push(node);

		let should_run = true;
		node.broken = false;
		while (should_run && node.broken == false && last_call.returned == false) {
			let condition = clone(node.condition);
			should_run = run(condition);
			let block = clone(node.block);
			node.continued = false;
			if (should_run) {
				return_value = run(block);
			}
			let cycle = make_if(condition, block);
			cycle.loop = node;

			last_block.statements.splice(block_index, 0, make_statement(cycle));
			block_index += 1;
		}

		loop_stack.pop();

		last_block.index = block_index;
	}
	else if (node.base.kind == Code_Kind.BREAK) {

		last_loop.broken = true;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {

		last_loop.continued = true;
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		let expression_value = run(node.expression);

		node.ident.is_lhs = true;
		run(node.ident);

		map_ident_to_value.set(node.ident.declaration.ident, expression_value);
		map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);

		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		let binop = make_binary_operation(node.ident, node.operation_type, node.expression);
		
		node.ident.is_lhs = true;

		let expression_value = math_solve(binop);

		map_ident_to_value.set(node.ident.declaration.ident, expression_value);
		map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);

		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		let expression_value = null;

		node.ident.is_lhs = true;
		run(node.ident);
		
		idents_used.add(node.ident.name);

		if (node.expression) {

			expression_value = run(node.expression);
		}

		map_ident_to_value.set(node.ident.declaration.ident, expression_value);

		let changes = new Array();
		changes.push(node.ident.execution_index);
		map_ident_to_changes.set(node.ident.declaration.ident, changes);

		let uses = new Array();
		map_ident_to_uses.set(node.ident.declaration.ident, uses);

		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		if (node.is_lhs != true && node.execution_index) {

			map_ident_to_uses.get(node.declaration.ident).push(node.execution_index);
		}

		return_value = map_ident_to_value.get(node.declaration.ident);
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		node.index = 0;
		node.elements = node.statements;
		block_stack.push(node);

		while (node.index < node.elements.length) {
			let executing_expr = node.elements[node.index].expression;
			return_value = run(executing_expr);
			node.index += 1;

			if (last_call.returned || (last_loop && (last_loop.broken || last_loop.continued))) {

				break;
			}
		}

		block_stack.pop();
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		return_value = math_solve(node);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		return_value = math_solve(node);
	}

	if (node.base.kind != Code_Kind.BLOCK &&
		node.base.kind != Code_Kind.WHILE &&
		node.base.kind != Code_Kind.FOR &&
		node.base.kind != Code_Kind.IF &&
		node.base.kind != Code_Kind.ELSE &&
		node.base.kind != Code_Kind.DECLARATION &&
		node.base.kind != Code_Kind.ASSIGN &&
		node.base.kind != Code_Kind.OPASSIGN &&
		node.base.kind != Code_Kind.RETURN) {

		if (disable_execution_recording == false) {

			node.execution_index = execution_index;
			execution_stack.push(node);
			execution_index += 1;
		}

		if (typeof node.original != "undefined") {

			map_original_to_indices.get(node.original).push(node.execution_index);
		}
	}

	node.last_return = return_value;

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

	// @@@
	if (node === null) {
		return;
	}

	let cloned;

	if (node.base.kind == Code_Kind.BLOCK) {

		let statements = new Array();

		for (let statement of node.statements) {

			statements.push(clone(statement));
		}

		cloned = make_block(statements);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE) {

		let params = null;

		if (node.parameters) {

			params = new Array();

			for (let param of node.parameters) {

				params.push(clone(param));
			}
		}

		cloned = make_procedure(params, node.return_type, clone(node.block));
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		let args = null;

		if (node.args) {

			args = new Array();

			for (let arg of node.args) {

				args.push(clone(arg));
			}
		}

		cloned = make_procedure_call(node.declaration, args);
	}
	else if (node.base.kind == Code_Kind.IF) {

		cloned = make_if(clone(node.condition), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		cloned = make_else(clone(node.block));
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		cloned = make_while(clone(node.condition), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.FOR) {

		cloned = make_for(clone(node.begin), clone(node.condition), clone(node.cycle_end), clone(node.block));
	}
	else if (node.base.kind == Code_Kind.BREAK) {

		cloned = make_break();
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {

		cloned = make_continue();
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		let decl = make_declaration(clone(node.ident), clone(node.expression), node.type);

		decl.ident.name = get_final_name(node.ident.original.name);

		map_original_to_clone.set(node, decl);

		cloned = decl;
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let ident = make_ident(node.name);

		// @Cleanup
		let decl_clone = map_original_to_clone.get(node.declaration);

		if (decl_clone) {

			ident.declaration = decl_clone;
			ident.name = decl_clone.ident.name;
		}
		else {

			// @Audit
			ident.declaration = node.declaration;
		}

		cloned = ident;
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		cloned = make_assign(clone(node.ident), clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		cloned = make_opassign(clone(node.ident), node.operation_type, clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		cloned = make_binary_operation(clone(node.left), node.operation_type, clone(node.right));
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		cloned = make_literal(node.value);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		cloned = make_return(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.NEWLINE) {

		cloned = node;
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		cloned = make_statement(clone(node.expression));
	}

	if (code_composed) {
		cloned.original = node.original ? node.original : node;
		let indices = map_original_to_indices.get(cloned.original);
		if (typeof indices == "undefined") {
			indices = new Array();
			map_original_to_indices.set(cloned.original, indices);
		}
		// map_instance_to_original.set(cloned, indices);
	}

	return cloned;
}

function get_final_name(name) {

	let final_name = name;

	let count = 1;

	while (idents_used.has(final_name)) {

		count += 1;

		final_name = name +"_"+ count;
	}

	return final_name;
}

function transform(node) {

	let replacement = make_block();

	replacement.declarations = new Array();

	node.transformed = replacement;

	let last_block = block_stack[block_stack.length-1];

	let last_call = call_stack[call_stack.length-1];

	if (node.base.kind == Code_Kind.PROCEDURE_CALL) {


		let procedure = node.declaration.expression;

		if (typeof procedure.transformed == "undefined") {

			procedure.transformed = make_block();

			let return_ident = make_ident(node.declaration.ident.name +"_return");
			procedure.transformed.return_ident = return_ident;

			let return_decl = make_declaration(return_ident, null, procedure.return_type);

			procedure.transformed.statements.push(make_statement(return_decl));

			for (let i = 0; i < procedure.parameters.length; i += 1) {

				let param = procedure.parameters[i];
				procedure.transformed.statements.push(make_statement(param));
			}

			for (let i = 0; i < procedure.block.statements.length; i += 1) {

				let stmt = procedure.block.statements[i];
				procedure.transformed.statements.push(stmt);
			}
		}

		call_stack.push(node);

		for (let i = 0; i < procedure.parameters.length; i += 1) {

			let param = procedure.parameters[i];
			let arg = node.args[i];
			param.expression = arg;
		}

		replacement = clone(procedure.transformed);
		replacement.declarations = new Array();
		replacement.return_ident = clone(procedure.transformed.return_ident);
		replacement.transformed_from_call = node;
		node.transformed = replacement;

		call_stack.pop();
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		let binop = make_binary_operation(node.ident, node.operation_type, node.expression);

		let assign = make_assign(node.ident, binop);

		replacement.statements.push(make_statement(assign));
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		let ident = last_call.transformed.statements[0].expression.ident;

		let assign = make_assign(clone(ident), node.expression);

		replacement.statements.push(make_statement(assign));
	}

	if (replacement.statements.length > 0) {

		return replacement;
	}
	else {

		delete node.transformed;
	}
}

function mark_containment(node) {

	node.contains_flowpoint = 0;
	node.contains_inspection = 0;
	node.contains_execution = 0;

	if (node.transformed && node.base.kind != Code_Kind.BLOCK &&
		node.base.kind != Code_Kind.IDENT &&
		node.base.kind != Code_Kind.OPASSIGN) {

		mark_containment(node.transformed);

		node.contains_flowpoint |= node.transformed.contains_flowpoint;
		node.contains_inspection |= node.transformed.contains_inspection;
		node.contains_execution |= node.transformed.contains_execution;
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		for (let stmt of node.statements) {

			mark_containment(stmt.expression);

			node.contains_flowpoint |= stmt.expression.contains_flowpoint || stmt.expression.is_flowpoint;
			node.contains_inspection |= stmt.expression.contains_inspection || stmt.expression.is_inspection;
			node.contains_execution |= stmt.expression.contains_execution || stmt.expression.is_execution;
		}
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		if (node.expression) {

			mark_containment(node.ident);
			mark_containment(node.expression);
	
			node.contains_flowpoint = node.ident.contains_flowpoint || node.ident.is_flowpoint ||
									  node.expression.contains_flowpoint || node.expression.is_flowpoint;
			node.contains_inspection = node.ident.contains_inspection || node.ident.is_inspection ||
									   node.expression.contains_inspection || node.expression.is_inspection;
			node.contains_execution = node.ident.contains_execution || node.ident.is_execution ||
									  node.expression.contains_execution || node.expression.is_execution;
		}
		else {
	
			mark_containment(node.ident);

			node.contains_flowpoint = node.ident.contains_flowpoint || node.ident.is_flowpoint;
			node.contains_inspection = node.ident.contains_inspection || node.ident.is_inspection;
			node.contains_execution = node.ident.contains_execution || node.ident.is_execution;
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		mark_containment(node.ident);
		mark_containment(node.expression);

		node.contains_flowpoint = node.ident.contains_flowpoint || node.ident.is_flowpoint ||
		                          node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.ident.contains_inspection || node.ident.is_inspection ||
		                           node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.ident.contains_execution || node.ident.is_execution ||
		                          node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		mark_containment(node.ident);
		mark_containment(node.expression);

		node.contains_flowpoint = node.ident.contains_flowpoint || node.ident.is_flowpoint ||
		                          node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.ident.contains_inspection || node.ident.is_inspection ||
		                           node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.ident.contains_execution || node.ident.is_execution ||
		                          node.expression.contains_execution || node.expression.is_execution;
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
	else if (node.base.kind == Code_Kind.IF) {

		mark_containment(node.condition);
		mark_containment(node.block);

		node.contains_flowpoint = node.condition.contains_flowpoint || node.condition.is_flowpoint ||
		                          node.block.contains_flowpoint || node.block.is_flowpoint;
		node.contains_inspection = node.condition.contains_inspection || node.condition.is_inspection ||
		                          node.block.contains_inspection || node.block.is_inspection;
		node.contains_execution = node.condition.contains_execution || node.condition.is_execution ||
		                          node.block.contains_execution || node.block.is_execution;
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		mark_containment(node.block);

		node.contains_flowpoint = node.block.contains_flowpoint || node.block.is_flowpoint;
		node.contains_inspection = node.block.contains_inspection || node.block.is_inspection;
		node.contains_execution = node.block.contains_execution || node.block.is_execution;
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		mark_containment(node.condition);
		mark_containment(node.block);

		node.contains_flowpoint = node.condition.contains_flowpoint || node.condition.is_flowpoint ||
		                          node.block.contains_flowpoint || node.block.is_flowpoint;
		node.contains_inspection = node.condition.contains_inspection || node.condition.is_inspection ||
		                          node.block.contains_inspection || node.block.is_inspection;
		node.contains_execution = node.condition.contains_execution || node.condition.is_execution ||
		                          node.block.contains_execution || node.block.is_execution;
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL &&
	         typeof node.declaration.expression == "function") {
		// native function
		for (let arg of node.args) {

			mark_containment(arg);

			node.contains_flowpoint |= arg.contains_flowpoint || arg.is_flowpoint;
			node.contains_inspection |= arg.contains_inspection || arg.is_inspection;
			node.contains_execution |= arg.contains_execution || arg.is_execution;
		}
	}
}

let indent_level = 0;

function print_semicolon(print_target) {

	print_target.appendChild(document.createTextNode(";"));
}

function should_expand(node) {
	return node.contains_flowpoint || node.contains_inspection || node.contains_execution;
}

function should_hide(node) {

	if (node.is_execution || node.is_inspection || node.is_flowpoint) {

		return false;
	}

	if (node.base.kind == Code_Kind.DECLARATION ||
		node.base.kind == Code_Kind.ASSIGN ||
		node.base.kind == Code_Kind.OPASSIGN) {

		return should_hide(node.ident);
	}

	if (node.base.kind == Code_Kind.WHILE ||
	    node.base.kind == Code_Kind.FOR) {

		return true;
	}

	if (node.base.kind == Code_Kind.BLOCK) {

		let should = false;

		for (let stmt of node.statements) {

			should = should || should_hide(stmt.expression);
		}

		return should;
	}
	
	if (node.base.kind == Code_Kind.IF) {

		node = node.condition;
	}

	if (node.base.kind == Code_Kind.ELSE) {

		return node.if_expr.condition.last_return;
	}
	
	// hide code that has not been run
	if (typeof node.execution_index == "undefined" &&
		typeof node.last_return == "undefined") {

		return true;
	}

	for (let i = 0; i < hidden_flowzones.length; i += 1) {

		for (let j = 0; j < dataflows.length; j += 1) {

			let flowpoint = dataflows[j][find_previous_index_in_array(dataflows[j], node.execution_index)];

			if (hidden_flowzones[i].indexOf(flowpoint) >= 0) {

				return true;
			}
		}
	}

	return false;
}

// need to use flex for block indentation
let palette = ["250, 0, 0", "0, 200, 0", "0, 0, 200"];
let palette_index = 0;
let print_expression_stack = new Array();
let map_expr_to_printed = new Map();
let map_line_to_execution_indices = new Array();
let line_count = 0;
let current_line = 0;
let column_index = 0;
function print_to_dom(node, print_target, block_print_target, is_transformed_block = false, push_index = true) {

	let expr = document.createElement("expr");

	expr.node = node;

	let should_expand_node = should_expand(node);

	let last_expression = print_expression_stack[print_expression_stack.length-1];
	
	if (last_expression && last_expression.base.kind == Code_Kind.STATEMENT &&
	    should_hide(node) && should_expand_node != true) {

		return;
	}

	print_expression_stack.push(node);

	if (node.transformed && (should_expand_node || expand_all) && 
		node.transformed.base.kind == Code_Kind.BLOCK &&
		node.base.kind != Code_Kind.RETURN &&
		node.base.kind != Code_Kind.OPASSIGN &&
		node.base.kind != Code_Kind.IDENT &&
		last_expression.base.kind != Code_Kind.IF &&
		last_expression.base.kind != Code_Kind.ELSE &&
		last_expression.base.kind != Code_Kind.WHILE &&
		is_transformed_block == false) {

		print_to_dom(node.transformed, block_print_target, block_print_target, true);

		if (node.base.kind == Code_Kind.BINARY_OPERATION ||
			node.base.kind == Code_Kind.RETURN ||
			node.base.kind == Code_Kind.BLOCK) {

			return;
		}
	}

	let order_last = false;
	if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		order_last = true;
	}
	
	if (push_index && order_last == false && node.execution_index >= 0) {
		if (map_line_to_execution_indices[line_count]) {
			map_line_to_execution_indices[line_count].push(node.execution_index);
		}
	}

	if (node.base.kind == Code_Kind.BLOCK) {

		if (!is_transformed_block) {

			print_target.appendChild(document.createTextNode("{"));

			indent_level += 1;
		}
		
		line_count += 1;
		map_line_to_execution_indices[line_count] = new Array();

		let block = document.createElement('block');
		let style = "";

		if (is_transformed_block) {

			// style += "background-color: rgba("+ palette[palette_index] +", 0.03)";
			style += "background-color: rgba(250, 250, 250, 0.02)";
			palette_index += 1;
			palette_index %= palette.length;
		}
		else {

			style += "padding-left: 4ch";
		}

		block.style = style;

		for (let statement of node.statements) {

			print_to_dom(statement, block, block);
			
			line_count += 1;
			map_line_to_execution_indices[line_count] = new Array();
		}

		if (block.children.length > 0) {

			print_target.appendChild(block);
		}

		if (!is_transformed_block) {

			indent_level -= 1;

			print_target.appendChild(document.createTextNode("}"));
		}
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {

		if (node.expression.base.kind == Code_Kind.PROCEDURE_CALL &&
			node.expression.declaration.ident.name == "main") {

			print_to_dom(node.expression, expr, block_print_target);
		}
		else {

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
		}
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_CALL) {

		if (values_shown && node.last_return !== null &&
			typeof node.last_return !== "undefined") {

			expr.classList.add("code-literal");
			expr.appendChild(document.createTextNode(node.last_return));
		}
		else if ((should_expand_node || expand_all) && node.transformed) {

			print_to_dom(node.transformed.return_ident, expr, block_print_target);
		}
		else {

			print_to_dom(node.declaration.ident, expr, block_print_target);

			expr.appendChild(document.createTextNode("("));

			if (node.args.length) {

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

		let if_keyword = document.createElement("expr");
		if_keyword.classList.add("code-keyword");
		if_keyword.appendChild(document.createTextNode("if"));
		expr.appendChild(if_keyword);

		expr.appendChild(document.createTextNode(" ("));

		print_to_dom(node.condition, expr, block_print_target);

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, block_print_target);
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		let else_keyword = document.createElement("expr");
		else_keyword.classList.add("code-keyword");
		else_keyword.appendChild(document.createTextNode("else"));
		expr.appendChild(else_keyword);

		expr.appendChild(document.createTextNode(" "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, block_print_target);
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		expr.appendChild(document.createTextNode("while ("));

		print_to_dom(node.condition, expr, block_print_target);

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, block_print_target);
	}
	else if (node.base.kind == Code_Kind.FOR) {

		expr.appendChild(document.createTextNode("for ("));

		print_to_dom(node.begin, expr, block_print_target);
		expr.appendChild(document.createTextNode("; "));
		print_to_dom(node.condition, expr, block_print_target);
		expr.appendChild(document.createTextNode("; "));
		print_to_dom(node.cycle_end, expr, block_print_target);

		expr.appendChild(document.createTextNode(") "));

		print_target.appendChild(expr);

		print_to_dom(node.block, print_target, block_print_target);
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		if (values_shown && binop_values_shown && should_expand_node != true) {

			// ###
			if (true) {

				expr.classList.add("code-literal");
				expr.appendChild(document.createTextNode(node.last_return));
			}
			if (expand_all) {
				let temp_expr = document.createElement("expr");
				print_to_dom(node.left, temp_expr, block_print_target, false, false);
				temp_expr = document.createElement("expr");
				print_to_dom(node.right, temp_expr, block_print_target, false, false);
			}
		}
		else {

			print_to_dom(node.left, expr, block_print_target);

			let op = document.createElement("expr");
			op.appendChild(document.createTextNode(" "+ node.operation_type +" "));
			op.classList.add("code-op");
			expr.appendChild(op);

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

				let op = document.createElement("expr");
				op.appendChild(document.createTextNode(" = "));
				op.classList.add("code-op");
				expr.appendChild(op);

				print_to_dom(node.expression, expr, block_print_target);
			}

			print_target.appendChild(expr);
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {

		// if we print the expression after the ident, up_line will be incorrect
		let temp_expr = document.createElement("expr");
		print_to_dom(node.expression, temp_expr, block_print_target);

		print_to_dom(node.ident, expr, block_print_target);

		let line = map_line_to_execution_indices[line_count];
		if (line.length >= 2) {
			line.unshift(line.pop());
		}

		let op = document.createElement("expr");
		op.appendChild(document.createTextNode(" = "));
		op.classList.add("code-op");
		expr.appendChild(op);

		expr.appendChild(temp_expr.children[0]);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		let temp_expr = document.createElement("expr");

		print_to_dom(node.expression, temp_expr, block_print_target);

		print_to_dom(node.ident, expr, block_print_target);

		// @Copypaste
		let line = map_line_to_execution_indices[line_count];
		if (line.length >= 2) {
			line.unshift(line.pop());
		}

		let op = document.createElement("expr");
		op.appendChild(document.createTextNode(" "+ node.operation_type +"= "));
		op.classList.add("code-op");
		expr.appendChild(op);

		expr.appendChild(temp_expr.children[0]);

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		let text = null;

		if ((node.is_lhs ? lhs_values_shown : values_shown) && node.last_return !== null &&
			typeof node.last_return !== "undefined") {

			text = node.last_return;
			expr.classList.add("code-literal");
		}
		else {

			text = node.name;
			if (Object.getOwnPropertyNames(Types).indexOf(node.name) >= 0) {
				expr.classList.add("code-type");
			}
			else if (node.declaration.expression &&
			         typeof node.declaration.expression != "function" &&
			         node.declaration.expression.base.kind == Code_Kind.PROCEDURE) {

				expr.classList.add("code-func");
			}
			else {
				expr.classList.add("code-ident");
			}
		}

		expr.appendChild(document.createTextNode(text));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		expr.classList.add("code-literal");
		expr.appendChild(document.createTextNode(node.value));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {

		expr.classList.add("code-keyword");
		expr.appendChild(document.createTextNode("continue"));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.BREAK) {

		expr.classList.add("code-keyword");
		expr.appendChild(document.createTextNode("break"));

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		if (node.transformed) {

			print_to_dom(node.transformed.statements[0].expression, print_target, block_print_target);
		}
	}

	print_expression_stack.pop();

	map_expr_to_printed.set(node, expr);

	if (push_index && order_last && node.execution_index >= 0) {
		if (map_line_to_execution_indices[line_count]) {
			map_line_to_execution_indices[line_count].push(node.execution_index);
		}
	}

	if (Object.is(node, execution_cursor)) {

		expr.classList.add("executing");

		if (!inspection_mode) {

			expr.classList.add("active_cursor");
		}
	}
	if (Object.is(node, inspection_cursor)) {

		current_line = line_count;

		expr.classList.add("selected");

		if (inspection_mode) {

			expr.classList.add("active_cursor");
		}
	}
	if (flowpoints.indexOf(execution_stack.indexOf(node)) >= 0) {

		expr.classList.add("flow-"+ active_dataflow);
	}
}

main();