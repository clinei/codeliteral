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

let map_call_to_settings = new Map();

let map_ident_to_value = new Map();
let map_ident_to_changes = new Map();
let map_ident_to_uses = new Map();
let map_original_to_indices = new Map();

let map_original_to_clone = new Map();

let debugging = false;
let execution_cursor = null;
let execution_index = 0;
let idents_used = new Set();
let call_stack = new Array();
let block_stack = new Array();
let loop_stack = new Array();
let execution_stack = new Array();
let stack_pointer = 0;
let stack_buffer = new ArrayBuffer(64 * 64 * 64);
let stack_view = new DataView(stack_buffer);
let heap_buffer = new ArrayBuffer(64 * 64 * 64);
let heap_view = new DataView(heap_buffer);
function get_ident_value(node) {
	let type = node.declaration.ident.base.type;
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.size_in_bytes == 1) {
			if (type.signed) {
				return stack_view.getInt8(node.declaration.pointer);
			}
			else {
				return stack_view.getUint8(node.declaration.pointer);
			}
		}
		else if (type.size_in_bytes == 2) {
			if (type.signed) {
				return stack_view.getInt16(node.declaration.pointer);
			}
			else {
				return stack_view.getUint16(node.declaration.pointer);
			}
		}
		else if (type.size_in_bytes == 4) {
			if (type.signed) {
				return stack_view.getInt32(node.declaration.pointer);
			}
			else {
				return stack_view.getUint32(node.declaration.pointer);
			}
		}
		// @Incomplete
		// 64bit int has to be faked
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.size_in_bytes == 4) {
			return stack_view.getFloat32(node.declaration.pointer);
		}
		else if (type.size_in_bytes == 8) {
			return stack_view.getFloat64(node.declaration.pointer);
		}
		// @Incomplete
		// 80bit float has to be faked
	}
}
function set_ident_value(node, value) {
	let type = node.declaration.ident.base.type;
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.size_in_bytes == 1) {
			if (type.signed) {
				return stack_view.setInt8(node.declaration.pointer, value);
			}
			else {
				return stack_view.setUint8(node.declaration.pointer, value);
			}
		}
		else if (type.size_in_bytes == 2) {
			if (type.signed) {
				return stack_view.setInt16(node.declaration.pointer, value);
			}
			else {
				return stack_view.setUint16(node.declaration.pointer, value);
			}
		}
		else if (type.size_in_bytes == 4) {
			if (type.signed) {
				return stack_view.setInt32(node.declaration.pointer, value);
			}
			else {
				return stack_view.setUint32(node.declaration.pointer, value);
			}
		}
		// @Incomplete
		// 64bit int has to be faked
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.size_in_bytes == 4) {
			return stack_view.setFloat32(node.declaration.pointer, value);
		}
		else if (type.size_in_bytes == 8) {
			return stack_view.setFloat64(node.declaration.pointer, value);
		}
		// @Incomplete
		// 80bit float has to be faked
	}
}

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
let stdlib = [
	print_declaration,
];

let code = `
int some_other_function(char number) {
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
int some_function(uchar num_iters) {
	int sum = 0;
	for (int i = 0; i < num_iters; i += 1) {
		sum += i * 20;
	}
	return some_other_function(sum);
}
int factorial(short number) {
	if (number > 1) {
		return factorial(number - 1) * number;
	}
	else {
		return 1;
	}
}
void fizzbuzz(ushort number) {
	for (uint i = 1; i <= number; i += 1) {
		if (i % 15 == 0) {
			print(1234);
		}
		else if (i % 5 == 0) {
			print(4321);
		}
		else if (i % 3 == 0) {
			print(9999);
		}
		else {
			print(i);
		}
	}
}
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
int main() {
    int local_variable = 3;
	some_function(local_variable);
	factorial(local_variable);
	fizzbuzz(30);
	nested_loops(2, 2);
	return local_variable;
}
main();
`;
let parsed = parse(tokenize(code));
parsed.statements = stdlib.concat(parsed.statements);
let Global_Block = infer(parsed);
let Main_call = Global_Block.statements[Global_Block.statements.length-1];
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

	mark_containment(Main_call);
	
	print_to_dom(Main_call, code_element, code_element);
	
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

	execution_cursor = Main_call;
	run(Main_call);

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

	if (node.base.kind == Code_Kind.CALL) {

		call_stack.push(node);

		node.returned = false;

		let run_result = null;
		let proc = node.ident.declaration.expression;

		if (typeof proc == "function") {
			// native JS function
			let values = [];
			for (let arg of node.args) {
				values.push(run(arg));
			}
			run_result = proc.apply(null, values);
			node.returned = true;
		}
		else {
			run_result = run(transform(node));
			if (proc.return_type.name != "void") {
				return_value = run_result;
			}
			else {
				return_value = null;
			}
		}

		call_stack.pop();
	}

	if (node.base.kind == Code_Kind.RETURN) {

		return_value = run(transform(node));

		last_call.returned = true;

		last_call.last_return = return_value;
	}

	if (node.base.kind == Code_Kind.IF) {

		let else_expr = last_block.statements[last_block.index + 1];
		if (else_expr && else_expr.base.kind == Code_Kind.ELSE) {

			else_expr.if_expr = node;
		}

		if (run(node.condition)) {

			return_value = run(node.expression);
		}
		else {

			if (else_expr && else_expr.base.kind == Code_Kind.ELSE) {

				last_block.index += 1;
				return_value = run(else_expr);
			}
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		if (node.if_expr && node.if_expr.condition.last_return == false) {
			return_value = run(node.expression);
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		// could pass this as a param
		let block_index = last_block.statements.indexOf(node);

		loop_stack.push(node);

		let should_run = true;
		node.broken = false;
		while (should_run && node.broken == false && last_call.returned == false) {
			let condition = clone(node.condition);
			should_run = run(condition);
			let cloned_expr = clone(node.expression);
			node.continued = false;
			if (should_run) {
				return_value = run(cloned_expr);
			}
			let cycle = make_if(condition, cloned_expr);
			cycle.loop = node;

			last_block.statements.splice(block_index, 0, cycle);
			block_index += 1;
		}

		loop_stack.pop();

		last_block.index = block_index;
	}
	else if (node.base.kind == Code_Kind.FOR) {

		// could pass this as a param
		let block_index = last_block.statements.indexOf(node);
		if (node.begin) {
			last_block.statements.splice(block_index, 0, node.begin);
			block_index += 1;
			run(node.begin);
		}
		if (!node.condition) {
			node.condition = make_literal(42);
		}
		if (node.cycle_end) {
			if (node.expression.base.kind != Code_Kind.BLOCK) {
				node.expression = make_block([node.expression]);
			}
			node.expression.statements.push(node.cycle_end);
		}

		loop_stack.push(node);

		let should_run = true;
		node.broken = false;
		while (should_run && node.broken == false && last_call.returned == false) {
			let condition = clone(node.condition);
			should_run = run(condition);
			let cloned_expr = clone(node.expression);
			node.continued = false;
			if (should_run) {
				return_value = run(cloned_expr);
			}
			let cycle = make_if(condition, cloned_expr);
			cycle.loop = node;

			last_block.statements.splice(block_index, 0, cycle);
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

		set_ident_value(node.ident, expression_value);
		map_ident_to_value.set(node.ident.declaration.ident, expression_value);
		map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);

		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		let binop = make_binary_operation(node.ident, node.operation_type, node.expression);
		
		node.ident.is_lhs = true;

		let expression_value = math_solve(binop);

		set_ident_value(node.ident, expression_value);
		map_ident_to_value.set(node.ident.declaration.ident, expression_value);
		map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);

		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		let expression_value = null;

		node.ident.is_lhs = true;
		run(node.ident);

		if (node.type.name != "void") {
			node.pointer = stack_pointer;
			stack_pointer += node.ident.base.type.size_in_bytes;
			last_block.allocations.push(node);

			if (node.expression) {
				expression_value = run(node.expression);
				
				set_ident_value(node.ident, expression_value);
				map_ident_to_value.set(node.ident.declaration.ident, expression_value);
			}
		}
		
		idents_used.add(node.ident.name);

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

		// return_value = map_ident_to_value.get(node.declaration.ident);
		if (node.declaration.type.name != "void") {
			return_value = get_ident_value(node);
		}
		else {
			return_value = null;
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {

		node.index = 0;
		node.elements = node.statements;
		block_stack.push(node);
		node.allocations = new Array();

		while (node.index < node.elements.length) {
			let executing_expr = node.elements[node.index];
			return_value = run(executing_expr);
			node.index += 1;

			if (last_call.returned || (last_loop && (last_loop.broken || last_loop.continued))) {

				break;
			}
		}

		for (let i = 0; i < node.allocations.length; i += 1) {
			let decl = node.allocations[i];
			stack_pointer -= decl.ident.base.type.size_in_bytes;
		}

		block_stack.pop();
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {

		return_value = math_solve(node);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {

		return_value = math_solve(node);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {

		// @Audit
		return_value = node.expression.declaration.pointer;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {

		return_value = get_ident_value(node.expression);
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
		else if (node.operation_type == "&") {
			return left & right;
		}
		else if (node.operation_type == "|") {
			return left | right;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		let ident = node;
		return map_ident_to_value.get(ident.declaration.ident);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {
		return parseInt(node.value);
	}
	else if (node.base.kind == Code_Kind.CALL) {
		return run(node);
	}
}

function clone(node, set_original = true) {

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
	else if (node.base.kind == Code_Kind.CALL) {

		let args = null;

		if (node.args) {

			args = new Array();

			for (let arg of node.args) {

				args.push(clone(arg));
			}
		}

		cloned = make_call(node.ident, args);
	}
	else if (node.base.kind == Code_Kind.IF) {

		cloned = make_if(clone(node.condition), clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		cloned = make_else(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.WHILE) {

		cloned = make_while(clone(node.condition), clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.FOR) {

		let begin, condition, cycle_end;
		if (node.begin) {
			begin = clone(node.begin);
		}
		if (node.condition) {
			condition = clone(node.condition);
		}
		if (node.cycle_end) {
			cycle_end = clone(node.cycle_end);
		}
		cloned = make_for(begin, condition, cycle_end, clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.BREAK) {

		cloned = make_break();
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {

		cloned = make_continue();
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {

		let expr;
		if (node.expression) {
			expr = clone(node.expression);
		}

		let decl = make_declaration(clone(node.ident), expr, node.type);

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
		
		ident.base.type = node.declaration.ident.base.type;

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

	if (code_composed && set_original) {
		cloned.original = node.original ? node.original : node;
		let indices = map_original_to_indices.get(cloned.original);
		if (typeof indices == "undefined") {
			indices = new Array();
			map_original_to_indices.set(cloned.original, indices);
		}
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

	node.transformed = replacement;

	let last_call = call_stack[call_stack.length-1];

	if (node.base.kind == Code_Kind.CALL) {

		let procedure = node.ident.declaration.expression;

		if (typeof procedure.transformed == "undefined") {

			procedure.transformed = make_block();

			let return_ident = make_ident(node.ident.name +"_return");
			procedure.transformed.return_ident = return_ident;

			let return_decl = infer(make_declaration(return_ident, null, procedure.return_type));
			procedure.transformed.statements.push(return_decl);

			for (let i = 0; i < procedure.parameters.length; i += 1) {
				let param = procedure.parameters[i];
				procedure.transformed.statements.push(param);
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
		replacement.return_ident = clone(procedure.transformed.return_ident);
		replacement.transformed_from_call = node;
		node.transformed = replacement;

		call_stack.pop();
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {

		let binop = make_binary_operation(node.ident, node.operation_type, node.expression);

		let assign = make_assign(node.ident, binop);

		replacement.statements.push(assign);
	}
	else if (node.base.kind == Code_Kind.RETURN) {

		let ident = last_call.transformed.statements[0].ident;

		let assign = make_assign(clone(ident), node.expression);

		replacement.statements.push(assign);
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

			mark_containment(stmt);

			node.contains_flowpoint |= stmt.contains_flowpoint || stmt.is_flowpoint;
			node.contains_inspection |= stmt.contains_inspection || stmt.is_inspection;
			node.contains_execution |= stmt.contains_execution || stmt.is_execution;
		}
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
		mark_containment(node.expression);

		node.contains_flowpoint = node.condition.contains_flowpoint || node.condition.is_flowpoint ||
		                          node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.condition.contains_inspection || node.condition.is_inspection ||
		                          node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.condition.contains_execution || node.condition.is_execution ||
		                          node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		mark_containment(node.expression);

		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.CALL &&
	         typeof node.ident.declaration.expression == "function") {
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

			should = should || should_hide(stmt);
		}

		return should;
	}
	
	if (node.base.kind == Code_Kind.IF) {

		node = node.condition;
	}

	if (node.base.kind == Code_Kind.ELSE) {

		return !node.if_expr || node.if_expr.condition.last_return;
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
	
	if (last_expression && last_expression.base.kind == Code_Kind.BLOCK &&
	    should_hide(node) && should_expand_node != true) {

		return;
	}

	print_expression_stack.push(node);

	if (node.transformed && (should_expand_node || expand_all) && 
		node.transformed.base.kind == Code_Kind.BLOCK &&
		node.base.kind != Code_Kind.RETURN &&
		node.base.kind != Code_Kind.OPASSIGN &&
		node.base.kind != Code_Kind.IDENT &&
		is_transformed_block == false) {

		print_to_dom(node.transformed, block_print_target, block_print_target, true);

		if (node.base.kind == Code_Kind.BINARY_OPERATION ||
			node.base.kind == Code_Kind.RETURN ||
			node.base.kind == Code_Kind.BLOCK ||
			(node.base.kind == Code_Kind.CALL &&
			 node.ident.name == "main")
			) {

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

		for (let stmt of node.statements) {

			let stmt_elem = document.createElement("stmt");

			print_to_dom(stmt, stmt_elem, block);

			if (stmt_elem.children.length > 0) {

				if (stmt.base.kind != Code_Kind.NEWLINE &&
					stmt.base.kind != Code_Kind.IF &&
					stmt.base.kind != Code_Kind.ELSE &&
					stmt.base.kind != Code_Kind.WHILE) {

					stmt_elem.appendChild(document.createTextNode(";"));
				}

				block.appendChild(stmt_elem);
			}
			
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
	else if (node.base.kind == Code_Kind.CALL) {

		if (values_shown && node.last_return !== null &&
			typeof node.last_return !== "undefined") {

			expr.classList.add("code-literal");
			expr.appendChild(document.createTextNode(node.last_return));
		}
		else if ((should_expand_node || expand_all) && node.transformed) {
				
			print_to_dom(node.transformed.return_ident, expr, block_print_target);
		}
		else {

			print_to_dom(node.ident, expr, block_print_target);

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

		if (node.condition.last_return) {
			print_to_dom(node.expression, print_target, block_print_target);
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {

		let else_keyword = document.createElement("expr");
		else_keyword.classList.add("code-keyword");
		else_keyword.appendChild(document.createTextNode("else"));
		expr.appendChild(else_keyword);

		expr.appendChild(document.createTextNode(" "));

		print_target.appendChild(expr);

		if (node.if_expr) {
			print_to_dom(node.expression, print_target, block_print_target);
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		console.log("a while loop slipped through!");
		debugger;
	}
	else if (node.base.kind == Code_Kind.FOR) {

		console.log("a for loop slipped through!");
		debugger;
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

			print_to_dom(node.transformed.statements[0], print_target, block_print_target);
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