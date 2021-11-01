"use strict";

let code = `/*  KEYBOARD CONTROLS

	W - move up        F - show values
	S - move down      E - show elems
	A - move left      C - show changes
	D - move right     G - expand all

	X - step next      R - prev clone
	Z - step back      T - next clone

	H - prev change    Y - prev use
	J - next change    U - next use

	K - set point      , - prev point
	L - remove point   . - next point

*/

int division_bug(int num, int denom) {
	"Why is this 0?";
	int answer = num / denom;
	"Correct result is 0.666.. but integer division rounds to 0";
	float fnum = num;
	float fdenom = denom;
	float fanswer = fnum / fdenom;
	"We need to use floating point types to avoid this error";
	return answer;
}

int square(int n) {
	if (n == 1) {
		"When a variable name has already occurred";
		"we increment a number and add it to the name";
	}
	else if (n == 0) {
		"Only the code that was run is shown";
		"because anything else is not relevant";
		"like that if statement above";
	}
	else if (n == 2) {
		"You can use R and T to move between";
		"different calls of the same function, too";
	}
	return n * n;
}

void loops() {
	"This was a for loop";
	"but we moved out the initializer";
	"and turned every cycle into an if statement";
	for (int it = 0; it < 10; it += 1) {
		if (it == 0 || it == 9) {
			"Press R and T to move between the cycles";
		}
		else if (it == 2) {
			"Press X or Z to go inside calls";
		}
		int s = square(it);
	}
}

void bookmarks() {
	"Sometimes, code is big, really really big";
	"Moving around with ZX and WASD is not fast enough";
	"And HJ and RT don't help much either";
	"Try it on this code";
	int f = 1;
	int g = 2;
	int h = 3;
	for (int iter = 0; iter < 8; iter += 1) {
		if (iter % 3 == 0) {
			f += g;
		}
		else if (iter % 5 == 0) {
			h *= f;
		}
		else if (iter % 7 == 0) {
			g = f + h;
		}
	}
	"We would like to skip most of the loops";
	"And only move between important points of interest";
	"Find the chain of decisions that led to the final result";
	int final = f + g;
	f = f;
	g = g;
	h = h;
	"Press K to mark a point of interest";
	"Press , and . to move between points of interest";
	"Press L to become disinterested";
}

void decision_chains() {
	"Try to figure out what's happening here";
	int[3] arr;
	for (int i = 0; i < arr.length; i += 1) {
		arr[i] = i + 2;
	}
	for (int j = 0; j < arr.length; j += 1) {
		arr[j] = square(arr[j]);
	}
	for (int k = 0; k < arr.length; k += 1) {
		if (arr[k] == 4) {
			arr[k] = 50;
		}
		else if (arr[k] == 9) {
			arr[k] -= 4;
		}
		else if (arr[k] == 16) {
			arr[k] = 55;
		}
	}
	for (int l = 0; l < arr.length; l += 1) {
		if (arr[l] > 50) {
			arr[l] = 5;
		}
		else if (arr[l] == 50) {
			arr[l] = 5;
		}
	}
	for (int m = 0; m < arr.length; m += 1) {
		if (arr[m] == 5) {
			"Why is this value 5?";
			"Make a chain of decision points";
			"That explain how this element ended up here";
			arr[m] = arr[m];
			"You can have multiple decision chains";
			"Press 0-9 to select the active array of points";
		}
	}
	"That's it for the tutorial, you can explore more examples in main";
	"Try to solve the bugs, or write your own code in the other panel";
	return;
}

int factorial(short number) {
	if (number > 1) {
		return factorial(number - 1) * number;
	}
	else {
		"You can use R and T to jump between";
		"rarely accessed conditional code";
		"like the following return statement";
		"that terminates a recursive factorial";
		return 1;
	}
}

void fizzbuzz(int number) {
	for (int i = 1; i <= number; i += 1) {
		if (i % 15 == 0) {
			print("FizzBuzz");
		}
		else if (i % 5 == 0) {
			"You can use R and T to jump between";
			"rarely accessed conditional code";
			"like this special loop case";
			print("Buzz");
		}
		else if (i % 3 == 0) {
			print("Fizz");
		}
		else {
			print(i);
		}
	}
}

/*
struct List_Node {
	int value;
	List_Node* next;
};
List_Node* index_of(List_Node* first, int value) {
	List_Node* curr = first;
	while (curr) {
		if (curr.value == value) {
			return curr;
		}
		curr = curr.next;
	}
	return 0;
}
void linked_list_array() {
	List_Node[4] nodes;
	for (int i = 0; i < nodes.length; i += 1) {
		nodes[i].value = (i + 1) * 2;
		if (i < nodes.length - 1) {
			nodes[i].next = &nodes[i + 1];
		}
		else {
			nodes[i].next = 0;
		}
	}
	List_Node* index = index_of(&nodes[0], 4);
	index.value == 4;
}
void linked_list_heap() {
	int N = 4;
	List_Node* nodes = malloc(sizeof(List_Node) * N);
	for (int i = 0; i < N; i += 1) {
		// @Incomplete
		// pointer math is unintuitive,
		// variables have effective values
		// that are different from the actual ones
		List_Node* ptr_curr = nodes + i;
		ptr_curr.value = (i + 1) * 2;
		if (i < N - 1) {
			ptr_curr.next = nodes + i + 1;
		}
		else {
			ptr_curr.next = 0;
		}
		// @Bug
		// Parenthesis and dot operators don't play well together
		// @Cleanup
		// This is ugly, how does it work in C?
		// (nodes + i).value = (i + 1) * 2;
		// if (i < N - 1) {
		// 	(nodes + i).next = nodes + i + 1;
		// }
		// else {
		// 	(nodes + i).next = 0;
		// }
	}
}
void linked_list() {
	// linked_list_array();
	linked_list_heap();
}
*/

int simple_code(int a, int b) {
	"Read the code and guess the return value"
	int c = a + b;
	b = c * 2;
	c = b + 4;
	"or press F to see the values directly"
	"(and press it again to turn it off)"
	return c;
}
int complex_code(int param1, int param2, int param3) {
	"WASD to move faster";
	int foo = param1;
	int bar = param2;
	int qux = param3;
	if (foo > 1) {
		"Press E to see the elements of math expressions";
		"while showing values (F)";
		bar = foo + qux;
		qux -= foo;
	}
	if ((bar - foo) * bar - 50 > 10) {
		"or go into the expressions with WASD and ZX";
		"and show values (F) and hide elements (E)";
		"and move around with ZX";
		"to see every step of the calculation";
		qux += 4;
		bar += (qux + bar) / 10;
	}
	if (qux) {
		if (qux == 10) {
			"Knowing what values things have is not enough";
			"You want to know _why_";
			"Move the cursor onto a variable name";
			"Press H to see where a value was changed last";
			"Press J to see where a value was changed next";
			qux += bar - 2;
			bar += 3;
		}
		if (qux == 20) {
			"Press C to see what the value was before";
			qux *= 2;
		}
	}
	"Use your new tricks to find out";
	"how we got this return value";
	return qux;
}

int func() {
	"Return values become variables";
	"Return statements become assignments";
	return 4;
}

void func2(int param) {
	"Parameters also become variables"
	param = param + 2;
	return;
}

struct Triangle {
    double x1;
    double y1;
    double x2;
    double y2;
    double x3;
    double y3;
};

double sqr(double x) {
	return x * x;
}

double distance(double x1, double y1, double x2, double y2) {
	double d1 = x1 - x2;
	double d2 = y1 - y2;
	double sd1 = sqr(d1);
	double sd2 = sqr(d1);
	return sqrt(sd1 + sd2);
}

double triangle_circumference(Triangle* triangle) {
	double side1 = distance(triangle.x1, triangle.y1, triangle.x2, triangle.y2);
	double side2 = distance(triangle.x2, triangle.y2, triangle.x3, triangle.y3);
	double side3 = distance(triangle.x3, triangle.y3, triangle.x1, triangle.y1);
	return side1 + side2 + side3;
}

void triangle_bug() {
    Triangle* tri = malloc(sizeof(Triangle));
    tri.x1 = 0;
    tri.y1 = 0;
    tri.x2 = 3;
    tri.y2 = 0;
    tri.x3 = 3;
    tri.y3 = 4;
    triangle_circumference(tri);
}

int main() {
	"Press Z to move backward";
	simple_code(1, 2);
	complex_code(2, 4, 8);

	int variable = func();
	func2(4);
	loops();
	bookmarks();
	decision_chains();

	fizzbuzz(15);
	factorial(5);
	factorial(3);
	triangle_bug();
	division_bug(2, 3);

	// linked_list();
	return 0;
}
"Starting tutorial";
"Press X to move forward";
main();
`;

const old_code = `
bool test_nested_loop() {
	bool passed = true;
	int[6] results;
	int width = 2;
	int height = 3;
	int i = 0;
	for (int width_iter = 0; width_iter < width; width_iter += 1) {
		for (int height_iter = 0; height_iter < height; height_iter += 1) {
			int d = width_iter * height + height_iter;
			results[i] = d;
			i += 1;
		}
	}
	for (int j = 0; j < 6; j += 1) {
		passed &= results[j] == j;
	}
	return passed;
}
bool test_array() {
	bool passed = true;
	int[8] arr;
	passed &= arr.length == 8;
	arr[7] = 12345;
	passed &= arr[7] == 12345;
	arr[0] = arr[7];
	passed &= arr[0] == 12345;
	return passed;
}
bool test_pointer() {
	bool passed = true;
	int a = 0;
	int* b;
	b = &a;
	*b = 12345;
	passed &= a == 12345;
	a = 0;
	int** c;
	c = &b;
	**c = 12345;
	passed &= a == 12345;
	int d = 0;
	d = **c;
	passed &= d == 12345;
	return passed;
}
bool test_malloc_free() {
	bool passed = true;
	uchar* ptr = malloc(1);
	*ptr = 123;
	passed &= *ptr == 123;
	free(ptr);
	uint* ptr2 = malloc(4);
	*ptr2 = 12345;
	passed &= *ptr2 == 12345;
	free(ptr2);
	return passed;
}
bool test_heap() {
	bool passed = true;
	for (uint i = 0; i < 100; i += 1) {
		void* ptr  = malloc(1);
		free(ptr);
	}
	return passed;
}
bool test_struct() {
	bool passed = true;
	struct Car {
		uint type;
		uint age;
	}
	struct Person {
		uint age;
		Car car;
	}
	Person steve;
	steve.age = 20;
	passed &= steve.age == 20;
	steve.car.age = 2;
	passed &= steve.car.age == 2;
	steve.age += 4;
	passed &= steve.age == 24;
	steve.car.age += 4;
	passed &= steve.car.age == 6;
	return passed;
}
bool test_struct_array() {
	bool passed = true;
	struct Person {
		uint age;
	}
	Person[2] people;
	for (int i = 0; i < people.length; i += 1) {
		people[i].age = (i + 1) * 10;
	}
	passed &= people[0].age == 10;
	passed &= people[1].age == 20;
	return passed;
}
bool test_do_while() {
	bool passed = true;
	int n = 1;
	do {
		n += 1;
	} while (n < 1)
	passed &= n == 2;
	return passed;
}
bool test_inc_dec() {
	bool passed = true;
	int m = 0;
	m++;
	passed &= m == 1;
	m--;
	passed &= m == 0;
	return passed;
}
/*
bool test_unary() {
	bool passed = true;
	int n = 1;
	passed &= -n == -1;
	return passed;
}
*/
bool test_string() {
	bool passed = true;
	string str = "Hello, World!";
	passed &= str == "Hello, World!";
	str = "Hi there.";
	passed &= str == "Hi there.";
	string str2 = "I'm here, too!";
	passed &= str2 == "I'm here, too!";
	str = str2;
	passed &= str == "I'm here, too!";
	return passed;
}
void tests() {
	test_array();
	test_pointer();
	test_malloc_free();
	// test_heap();
	// test_dynamic_array();
	test_struct();
	test_struct_array();
	test_do_while();
	test_nested_loop();
	test_inc_dec();
	// test_unary();
	test_string();
}`;

let Global_Block;
let Main_call;

let values_shown = false;
let lhs_values_shown = false;
let binop_values_shown = true;
let expand_all = false;

let inspection_mode = false;
let memory_mode = false;

let debug_gui_elem;
let source_gui_elem;
let run_gui_elem;
let reset_gui_elem;

function main() {
	debug_gui_elem = document.getElementById("code");
	source_gui_elem = document.getElementById("source");
	run_gui_elem = document.getElementById("run");
	reset_gui_elem = document.getElementById("reset");
	map_controls();
	init_text();
	start_debugging();
	debug_gui_elem.focus();
}

function init_text() {
	code_composed = false;
	let stored_code = window.localStorage.getItem("code");
	if (!stored_code) {
		window.localStorage.setItem("code", code);
	}
	else {
		code = stored_code;
	}
	source_gui_elem.value = code;
	Global_Block = parse(tokenize(code));
	Main_call = Global_Block.statements[Global_Block.statements.length-1];
	Stdlib_Block.statements.push(Global_Block);
	infer_last_block = null;
	infer(Stdlib_Block);
	fill_rodata();
	code_composed = true;

}
function set_text(text) {
	window.localStorage.setItem("code", text);
}
function reset_text() {
	window.localStorage.removeItem("code");
}

function map_controls() {
	document.addEventListener("keydown", document_keydown);
	document.addEventListener("keyup", document_keyup);
	debug_gui_elem.addEventListener("mouseup", function(event) {
		debug_gui_elem.is_focused = true;
	});
	source_gui_elem.addEventListener("mouseup", function(event) {
		debug_gui_elem.is_focused = false;
	});
	slider_element.addEventListener("mousedown", slider_mousedown);
	slider_element.addEventListener("mouseup", slider_mouseup);
	run_gui_elem.addEventListener("mouseup", function(event) {
		set_text(source_gui_elem.value);
		location.reload();
	});
	reset_gui_elem.addEventListener("mouseup", function(event) {
		reset_text();
		location.reload();
	});
}

let instant_scroll = true;

function slider_mousedown() {
	instant_scroll = true;
}
function slider_mouseup() {
	instant_scroll = false;
}

function document_keyup(event) {
	instant_scroll = true;
}

function document_keydown(event) {
	if (debug_gui_elem.is_focused == false) {
		return;
	}

	// press Z
	if (event.keyCode == 90) {
		step_back();
		print();
	}

	// press X
	if (event.keyCode == 88) {
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
		prev_use();
		print();
	}

	// press U
	if (event.keyCode == 85) {
		next_use();
		print();
	}

	// press H
	if (event.keyCode == 72) {
		prev_change();
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
		prev_flowpoint();
		print();
	}

	// press .
	if (event.keyCode == 190) {
		next_flowpoint();
		print();
	}

	// press R
	if (event.keyCode == 82) {
		prev_original();
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

	// press M
	if (event.keyCode == 77) {
		toggle_memory();
		// print();
	}
	let number = event.keyCode - 48;
	if (number >= 0 && number <= 9) {
		active_dataflow = number;
		flowpoints = dataflows[active_dataflow];	
		print();
	}
	instant_scroll = true;
}

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
function toggle_memory() {
	memory_mode = !memory_mode;
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
		let index = find_next_index_in_array(flowpoints, execution_index);
		if (index >= flowpoints.length) {
			index = 0;
		}
		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor = execution_stack[flowpoint];
	}
}
function prev_flowpoint() {
	if (flowpoints.length) {
		if (!inspection_mode) {	
			toggle_inspection();
		}
		let index = find_prev_index_in_array(flowpoints, execution_index);
		if (index < 0) {
			index = flowpoints.length-1;
		}
		let flowpoint = flowpoints[index];
		execution_index = flowpoint;
		slider_element.value = flowpoint;
		inspection_cursor = execution_stack[flowpoint];
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
			inspection_cursor = execution_stack[execution_index];
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
			inspection_cursor = execution_stack[execution_index];
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
	inspection_cursor = execution_stack[execution_index];
}
function right_line() {
	let indices = map_line_to_execution_indices[current_line];
	if (column_index < indices.length-1) {
		column_index += 1;
	}
	execution_index = indices[column_index];
	slider_element.value = execution_index;
	inspection_cursor = execution_stack[execution_index];
}
function prev_change() {
	if (inspection_cursor.base.pointer >= 0) {
		let indices = map_memory_to_changes.get(inspection_cursor.base.pointer);
		if (!indices) return;
		let index = find_prev_index_in_array(indices, execution_index);
		if (index < 0) return;
		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
	else if (inspection_cursor.is_void_return) {
		execution_index = inspection_cursor.declaration.ident.execution_index;
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
}
function next_change() {
	if (inspection_cursor.base.pointer >= 0) {
		let indices = map_memory_to_changes.get(inspection_cursor.base.pointer);
		if (!indices) return;
		let index = find_next_index_in_array(indices, execution_index);
		if (index >= indices.length) return;
		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
	else if (inspection_cursor.is_void_return && inspection_cursor.next_change) {
		execution_index = inspection_cursor.next_change.execution_index;
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
}
function prev_use() {
	if (inspection_cursor.base.pointer >= 0) {
		let indices = map_memory_to_uses.get(inspection_cursor.base.pointer);
		if (!indices) return;
		let index = find_prev_index_in_array(indices, execution_index);
		if (index < 0) return;
		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
}
function next_use() {
	if (inspection_cursor.base.pointer >= 0) {
		let indices = map_memory_to_uses.get(inspection_cursor.base.pointer);
		if (!indices) return;
		let index = find_next_index_in_array(indices, execution_index);
		if (index >= indices.length) return;
		execution_index = indices[index];
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
	else if (inspection_cursor.is_void_return) {
		execution_index = inspection_cursor.next_use.execution_index;
		slider_element.value = execution_index;
		inspection_cursor = execution_stack[execution_index];
	}
}
function prev_original() {
	let indices = map_original_to_indices.get(inspection_cursor.original);
	let index = find_prev_index_in_array(indices, execution_index);
	if (index < 0) {
		return;
	}
	execution_index = indices[index];
	slider_element.value = execution_index;
	inspection_cursor = execution_stack[execution_index];
}
function next_original() {
	let indices = map_original_to_indices.get(inspection_cursor.original);
	let index = find_next_index_in_array(indices, execution_index);
	if (index >= indices.length) {
		return;
	}
	execution_index = indices[index];
	slider_element.value = execution_index;
	inspection_cursor = execution_stack[execution_index];
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
function find_prev_index_in_array(array, index) {
	let i = array.length-1;
	while (i >= 0) {
		if (array[i] < index) {
			return i;
		}
		i -= 1;
	}
	return i;
}
function find_prev_index_in_array_inclusive(array, elem) {
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
	let flowpoint = flowpoints[find_prev_index_in_array_inclusive(flowpoints, execution_index)];
	if (hidden_flowzones[active_dataflow].indexOf(flowpoint) >= 0) {
		return;
	}
	hidden_flowzones[active_dataflow].push(flowpoint);
}
function unhide_flowzone() {
	let flowpoint = flowpoints[find_prev_index_in_array_inclusive(flowpoints, execution_index)];
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
let map_memory_to_uses = new Map();
let map_memory_to_changes = new Map();
let map_original_to_indices = new Map();

let map_original_to_clone = new Map();

let debugging = false;
let execution_cursor = null;
let execution_index = 0;
let idents_used = new Map();
let call_stack = new Array();
let block_stack = new Array();
let loop_stack = new Array();
let execution_stack = new Array();
let stack_pointer = 0;
let memory_buffer = new ArrayBuffer(64 * 64 * 64);
let memory_view = new DataView(memory_buffer);
let heap_start = memory_buffer.byteLength / 2;
let heap_allocations = new Array();
function add_memory_use(offset, node) {
	let uses = map_memory_to_uses.get(offset);
	if (!uses) {
		uses = new Array();
		map_memory_to_uses.set(offset, uses);
	}
	node.base.pointer = offset;
	if (node.execution_index >= 0) {
		uses.push(node.execution_index);
	}
}
function add_memory_change(offset, node) {
	let changes = map_memory_to_changes.get(offset);
	if (!changes) {
		changes = new Array();
		map_memory_to_changes.set(offset, changes);
	}
	node.base.pointer = offset;
	if (node.execution_index >= 0) {
		changes.push(node.execution_index);
	}
}
function get_memory(offset, type) {
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.size_in_bytes == 1) {
			if (type.signed) {
				return memory_view.getInt8(offset);
			}
			else {
				return memory_view.getUint8(offset);
			}
		}
		else if (type.size_in_bytes == 2) {
			if (type.signed) {
				return memory_view.getInt16(offset);
			}
			else {
				return memory_view.getUint16(offset);
			}
		}
		else if (type.size_in_bytes == 4) {
			if (type.signed) {
				return memory_view.getInt32(offset);
			}
			else {
				return memory_view.getUint32(offset);
			}
		}
		// @Incomplete
		// 64bit int has to be faked
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.size_in_bytes == 4) {
			return memory_view.getFloat32(offset);
		}
		else if (type.size_in_bytes == 8) {
			return memory_view.getFloat64(offset);
		}
		// @Incomplete
		// 80bit float has to be faked
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		return get_memory(offset, Types.size_t);
	}
}
function set_memory(offset, type, value) {
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.size_in_bytes == 1) {
			if (type.signed) {
				return memory_view.setInt8(offset, value);
			}
			else {
				return memory_view.setUint8(offset, value);
			}
		}
		else if (type.size_in_bytes == 2) {
			if (type.signed) {
				return memory_view.setInt16(offset, value);
			}
			else {
				return memory_view.setUint16(offset, value);
			}
		}
		else if (type.size_in_bytes == 4) {
			if (type.signed) {
				return memory_view.setInt32(offset, value);
			}
			else {
				return memory_view.setUint32(offset, value);
			}
		}
		// @Incomplete
		// 64bit int has to be faked
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.size_in_bytes == 4) {
			return memory_view.setFloat32(offset, value);
		}
		else if (type.size_in_bytes == 8) {
			return memory_view.setFloat64(offset, value);
		}
		// @Incomplete
		// 80bit float has to be faked
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		return set_memory(offset, Types.size_t, value);
	}
}
function get_memory_array(offset, type, length) {
	let array = new Array(length);
	for (let i = 0; i < length; i += 1) {
		array[i] = get_memory(offset + type.size_in_bytes * i, type);
	}
	return array;
}
function set_memory_array(offset, type, length, array) {
	for (let i = 0; i < length; i += 1) {
		set_memory(offset + type.size_in_bytes * i, type, array[i]);
	}
}
function get_memory_bytes(offset, length) {
	let array = new Array(length);
	for (let i = 0; i < length; i += 1) {
		array[i] = memory_view.getUint8(offset + i);
	}
	return array;
}
function set_memory_bytes(offset, length, array) {
	for (let i = 0; i < length; i += 1) {
		memory_view.setUint8(offset + i, array[i]);
	}
}
// @Audit
function allocate_memory(size_in_bytes) {
	let pointer = heap_start;
	if (heap_allocations.length == 0) {
		heap_allocations[pointer] = size_in_bytes;
		return pointer;
	}
	while (pointer < memory_buffer.byteLength) {
		// @Bug
		// if we allocate twice, and then deallocate and allocate again and repeat,
		// we will run out of memory
		let foo = find_prev_index_in_array_inclusive(heap_allocations, pointer);
		let bar = find_prev_index_in_array_inclusive(heap_allocations, pointer + size_in_bytes);
		if (foo == bar) {
			heap_allocations[foo] = size_in_bytes;
			return pointer;
		}
		else {
			pointer += heap_allocations[bar];
		}
	}
	return pointer;
}
function deallocate_memory(pointer) {
	heap_allocations.splice(pointer, 1);
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
let print_procedure = console.log;
let print_declaration = make_declaration(make_ident("print"), print_procedure);

function assert_procedure(arg) {
	if (arg != true) {
		// throw Error;
	}
}
let assert_declaration = make_declaration(make_ident("assert"), assert_procedure);

let malloc_procedure = allocate_memory;
let malloc_declaration = make_declaration(make_ident("malloc"), malloc_procedure);

let free_procedure = deallocate_memory;
let free_declaration = make_declaration(make_ident("free"), free_procedure);

function sqrt_procedure(arg) {
	return Math.sqrt(arg);
}
let sqrt_declaration = make_declaration(make_ident("sqrt"), sqrt_procedure);

function sizeof_procedure(arg) {
	if (arg.declaration && arg.declaration.ident.base.type.base.kind == Type_Kind.STRUCT) {
		return arg.declaration.ident.base.type.size_in_bytes;
	}
	else if (arg.base.kind == Code_Kind.IDENT && Types.hasOwnProperty(arg.name)) {
		return Types[arg.name].size_in_bytes;
	}
	else {
		throw Error;
	}
}
let sizeof_declaration = make_declaration(make_ident("sizeof"), sizeof_procedure);

let Stdlib_Block = make_block();
Stdlib_Block.statements = [
	print_declaration,
	assert_declaration,
	malloc_declaration,
	free_declaration,
	sqrt_declaration,
	sizeof_declaration,
];
{
    let string_code = `
    struct string {
        char* pointer;
        size_t length;
    }
    `;
	Stdlib_Block.statements.push(infer(parse(tokenize(string_code))).statements[0]);
}

function fill_rodata() {
	for (let i = 0; i < strings.length; i += 1) {
		let string = strings[i];
		let elem_type = Types.char;
		string.pointer = stack_pointer;
		let char_array = new Array(string.length);
		for (let j = 0; j < string.length; j += 1) {
			char_array[j] = string.str.charCodeAt(j);
		}
		set_memory_array(stack_pointer, elem_type, string.length, char_array);
		stack_pointer += elem_type.size_in_bytes * string.length;
	}
}

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

let prev_top = 0;
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
	print_to_dom(Global_Block, code_element, code_element, true, false);
	
	if (!map_line_to_execution_indices[current_line]) {
		console.log("something went really wrong");
		return;
	}
	column_index = map_line_to_execution_indices[current_line].indexOf(execution_index);
	if (column_index < 0) {
		console.log("something went really wrong");
		return;
	}

	let printed_cursor = map_expr_to_printed.get(inspection_cursor);
	let curr_top = printed_cursor.getBoundingClientRect().top - code_element.getBoundingClientRect().top;
	
	let position_y = printed_cursor.offsetTop - code_element.scrollTop;
	let midpoint_y = code_element.clientHeight / 2;
	let radius_y = 20;

	let position_x = printed_cursor.offsetLeft - code_element.scrollLeft;
	let midpoint_x = code_element.clientWidth / 2;
	let radius_x = code_element.clientWidth / 8;

	let diff_top = curr_top - prev_top;

	if (diff_top > (midpoint_y + radius_y)) {

		code_element.scrollTop = printed_cursor.offsetTop - prev_top;
	}

	if (position_y < (midpoint_y - radius_y) ||
		position_y > (midpoint_y + radius_y)) {
		
		code_element.scrollTop = printed_cursor.offsetTop - midpoint_y;
	}
	if (position_x < (midpoint_x - radius_x) ||
		position_x > (midpoint_x + radius_x)) {

		printed_cursor.scrollIntoView(code_element.scroll_options);
	}
	prev_top = curr_top;
}

function start_debugging() {
	execution_cursor = Global_Block;
	run_statement(Global_Block);
	slider_element.max = execution_stack.length-1;
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
		inspection_cursor = execution_stack[execution_index];
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
	inspection_cursor = execution_stack[execution_index];
}

// @Cleanup
// @Hack
let global_disable_add_execution_node = false;
function add_node_to_execution_stack(node) {
	if (global_disable_add_execution_node) {
		return;
	}
	// :DebugLimiter
	/*
	if (execution_index > 99999) {
		throw Error("Execution took too long, probably an infinite loop!");
	}
	*/
	if (node.execution_index) {
		throw Error("Internal error: Adding something to the execution stack twice!");
	}
	node.execution_index = execution_index;
	execution_stack.push(node);
	execution_index += 1;
	if (node.original) {
		let indices = map_original_to_indices.get(node.original);
		if (indices) {
			indices.push(node.execution_index);
		}
	}
}

function run_lvalue(node, push_index = true) {
	if (node.base.kind == Code_Kind.STRUCT) {
		return;
	}
	let return_value;
	let return_node;
	if (node.base.kind == Code_Kind.IDENT) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		// @Copypaste
		// :IdentNameUpdate
		node.usage_count = node.declaration.ident.usage_count;
		if (node.declaration.type.name != "void") {
			return_value = node.declaration.pointer;
		}
		else {
			throw Error;
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		if (node.ident.base.kind == Code_Kind.IDENT &&
		    node.ident.declaration.type.name == "string") {
			if (node.expression.base.type.base.kind == Type_Kind.STRING) {
				let lhs_pointer = run_lvalue(node.ident);
				let length = node.expression.length;
				let length_type = node.ident.base.type.members.length.type;
				let length_offset = node.ident.base.type.members.length.offset;
				set_memory(lhs_pointer, Types.size_t, node.expression.pointer);
				set_memory(lhs_pointer + length_offset, length_type, length);
				return_value = node.ident.declaration.pointer;
			}
			else if (node.expression.base.kind == Code_Kind.IDENT && 
			         node.expression.declaration.type.name == "string") {

				let lhs_pointer = run_lvalue(node.ident);
				let rhs_pointer = run_lvalue(node.expression, false);
				let rhs_memory = get_memory_bytes(rhs_pointer, node.expression.base.type.size_in_bytes);
				set_memory_bytes(lhs_pointer, node.ident.base.type.size_in_bytes, rhs_memory);
				run_rvalue(node.expression);
				return_value = node.ident.declaration.pointer;
			}
		}
		else {
			let expression_value = run_rvalue(node.expression);
			node.ident.is_lhs = true;
			let lhs_pointer = run_lvalue(node.ident);
			let prev_value = get_memory(lhs_pointer, node.ident.base.type);
			node.ident.last_return = prev_value;
			node.ident.last_return_node = make_literal(prev_value);
			set_memory(lhs_pointer, node.ident.base.type, expression_value);
			add_memory_change(lhs_pointer, node.ident);
			/*
			map_ident_to_value.set(node.ident.declaration.ident, expression_value);
			map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);
			*/
			return_value = expression_value;
		}
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		let expression_value = run_rvalue(node.expression);
		node.ident.is_lhs = true;
		let lhs_pointer = run_lvalue(node.ident);
		let prev_value = get_memory(lhs_pointer, node.ident.base.type);
		add_memory_use(lhs_pointer, node.ident);
		node.ident.last_return = prev_value;
		node.ident.last_return_node = make_literal(prev_value);
		node.ident.last_return_node.base.type = node.ident.base.type;
		let result = math_binop(node.ident.last_return_node, node.operation_type, node.expression.last_return_node);
		set_memory(lhs_pointer, node.ident.base.type, result);
		add_memory_change(lhs_pointer, node.ident);
		/*
		map_ident_to_value.set(node.ident.declaration.ident, expression_value);
		map_ident_to_changes.get(node.ident.declaration.ident).push(node.ident.execution_index);
		*/
		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		return_value = run_lvalue(node.expression);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		if (node.array.base.type.base.kind != Type_Kind.ARRAY) {
			// @Incomplete
			throw Error;
		}
		node.array.is_lhs = node.is_lhs;
		node.base.pointer = run_lvalue(node.array) + run_rvalue(node.index) * node.base.type.size_in_bytes;
		return_value = node.base.pointer;
		return_node = make_literal(return_value);
		return_node.type = node.array.base.type.elem_type;
		if (push_index) {
			add_node_to_execution_stack(node);
		}
	}
	else if (node.base.kind == Code_Kind.CALL) {
		call_stack.push(node);
		node.returned = false;
		let proc = node.ident.declaration.expression;
		if (typeof proc == "function") {
			// native JS function
			let values = [];
			for (let arg of node.args) {
				values.push(run_rvalue(arg));
			}
			return_value = proc.apply(null, values);
			if (return_value) {
				return_node = make_literal(return_value);
				// :TypeNeeded
				return_node.type;
			}
			node.returned = true;
			if (push_index) {
				add_node_to_execution_stack(node);
			}
		}
		else {
			let transformed = transform(node);
			// :IdentNameUpdate
			// args and parameters are separate nodes for display purposes
			// so they have to be updated separately
			// @Cleanup
			// @Hack
			// maybe this can happen in one place
			global_disable_add_execution_node = true;
			for (let arg of node.args) {
				run_rvalue(arg, false);
			}
			global_disable_add_execution_node = false;
			let run_result = run_statement(transformed);
			// maybe not a good idea
			node.returned = true;
			if (node.returned == false) {
				throw Error;
			}
			if (push_index) {
				add_node_to_execution_stack(node);
			}
			if (proc.return_type.name != "void") {
				add_memory_use(transformed.statements[0].pointer, node);
				return_value = run_result;
				return_node = node.last_return_node;
			}
		}
		call_stack.pop();
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.expression.is_lhs = node.is_lhs;
		let pointer = run_lvalue(node.expression);
		return_value = get_memory(pointer, Types.size_t);
		// :TypeNeeded
		return_node = make_literal(return_value);
		if (push_index) {
			add_node_to_execution_stack(node);
		}
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		node.left.is_lhs = node.is_lhs;
		node.right.is_lhs = node.is_lhs;
		// @Refactor
		// dynamic arrays are structs
		if (node.left.base.type.base.kind == Type_Kind.ARRAY) {
			if (node.right.base.kind == Code_Kind.IDENT) {
				
				if (push_index) {
					add_node_to_execution_stack(node.left);
					add_node_to_execution_stack(node.right);
				}
				if (node.right.name == "length") {
					if (node.left.base.type.length) {
						return_value = node.left.base.type.length;
						return_node = make_literal(return_value);
					}
					else {
						let base_pointer = node.left.base.pointer;
						let length_offset = node.left.base.type.members.length.offset;
						let length_type = node.left.base.type.members.length.type;
						return_value = get_memory(base_pointer + length_offset, length_type);
						return_node = make_literal(return_value);
					}
					// :TypeNeeded
				}
				else {
					throw Error;
				}
			}
		}
		else {
			// @Incomplete
			// we can have multiple levels of dot operators
			// and the elements might not be idents
			// they could be pointers or lvalue expressions
			let left = node.left;
			let right = node.right;
			let pointer = run_lvalue(node.left);
			while (true) {
				left.is_lhs = node.is_lhs;
				right.is_lhs = node.is_lhs;
				if (right.base.kind == Code_Kind.DOT_OPERATOR) {
					pointer += left.base.type.members[right.left.name].offset;
					add_memory_use(pointer, right);
					left = right.left;
					right = right.right;
					if (push_index) {
						add_node_to_execution_stack(left);
					}
				}
				else if (right.base.kind == Code_Kind.IDENT) {
					if (push_index) {
						add_node_to_execution_stack(right);
					}
					if (left.base.type.base.kind == Type_Kind.POINTER) {
						pointer = get_memory(pointer, left.base.type);
						if (left.base.type.elem_type.base.kind == Type_Kind.STRUCT) {
							pointer += left.base.type.elem_type.members[right.name].offset;
						}
						else {
							throw Error("Tried to access a member of a pointer, which is only allowed for struct pointers");
						}
					}
					else {
						pointer += left.base.type.members[right.name].offset;
					}
					add_memory_use(pointer, right);
					break;
				}
			}
			node.base.pointer = pointer;
			return_value = pointer;
			return_node = make_literal(return_value);
			// :TypeNeeded
		}
		add_node_to_execution_stack(node);
	}
	else {
		throw Error;
	}
	node.last_return = return_value;
	node.last_return_node = return_node;
	return return_value;
}
function run_rvalue(node, push_index = true) {
	if (node.base.kind == Code_Kind.STRUCT) {
		return;
	}
	let return_value;
	let return_node;
	if (node.base.kind == Code_Kind.LITERAL) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		return_value = math_solve(node);
		return_node = node;
	}
	else if (node.base.kind == Code_Kind.STRING) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		let chars = get_memory_array(node.pointer, Types.char, node.length);
		let char_array = new Array(node.length);
		for (let i = 0; i < node.length; i += 1) {
			char_array[i] = String.fromCharCode(chars[i]);
		}
		return_value = char_array.join("");
		return_node = make_string(return_value);
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		return_value = math_solve(node);
		return_node = make_literal(return_value);
		if (push_index) {
			add_node_to_execution_stack(node);
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		// @Copypaste
		// :IdentNameUpdate
		node.usage_count = node.declaration.ident.usage_count;
		if (Types.hasOwnProperty(node.name)) {
			// native type
			return node;
		}
		if (node.base.type.base.kind == Type_Kind.STRUCT) {
			// @Incomplete
			// is this safe?
			return node;
		}
		if (node.declaration.type.name == "void") {
			if (node.is_void_return) {
				add_node_to_execution_stack(node);
				return;
			}
			else {
				throw Error;
			}
		}
		else if (node.declaration.type.name == "string") {
			let base_pointer = run_lvalue(node);
			let char_type = node.base.type.members.pointer.type.elem_type;
			let pointer = get_memory(base_pointer + node.base.type.members.pointer.offset, Types.size_t);
			let length = get_memory(base_pointer + node.base.type.members.length.offset, Types.size_t);
			let chars = get_memory_array(pointer, char_type, length);
			let char_array = new Array(length);
			for (let i = 0; i < length; i += 1) {
				char_array[i] = String.fromCharCode(chars[i]);
			}
	
			return_value = char_array.join("");
			return_node = make_string(return_value);
			add_memory_use(node.declaration.pointer, node);
		}
		else {
			return_value = get_memory(run_lvalue(node), node.base.type);
			return_node = make_literal(return_value);
			add_memory_use(node.declaration.pointer, node);
		}
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		return_value = -run_rvalue(node.ident);
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.NOT) {
		return_value = !run_rvalue(node.ident);
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		node.ident.is_lhs = true;
		let lhs_pointer = run_lvalue(node.ident);
		let prev_value = get_memory(lhs_pointer, node.ident.base.type);
		add_memory_use(lhs_pointer, node.ident);
		node.ident.last_return = prev_value;
		// @Incomplete
		// pointer types work differently
		let result = prev_value + 1;
		set_memory(lhs_pointer, node.ident.base.type, result);
		add_memory_change(lhs_pointer, node.ident);
		return_value = result;
		return_node = make_literal(result);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		node.ident.is_lhs = true;
		let lhs_pointer = run_lvalue(node.ident);
		let prev_value = get_memory(lhs_pointer, node.ident.base.type);
		add_memory_use(lhs_pointer, node.ident);
		node.ident.last_return = prev_value;
		// @Incomplete
		// pointer types work differently
		let result = prev_value - 1;
		set_memory(lhs_pointer, node.ident.base.type, result);
		add_memory_change(lhs_pointer, node.ident);
		return_value = result;
		return_node = make_literal(result);
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		return_value = run_rvalue(node.expression);
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		let pointer = run_lvalue(node);
		add_memory_use(pointer, node);
		return_value = get_memory(pointer, node.base.type);
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		return_value = get_memory(run_lvalue(node), node.base.type);
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {

		if (push_index) {
			add_node_to_execution_stack(node);
			add_node_to_execution_stack(node.expression);
		}
		let address = run_lvalue(node.expression, false);
		// let address = node.expression.declaration.pointer;
		node.base.pointer = address;
		add_memory_use(address, node.expression);
		return_value = address;
		return_node = make_literal(return_value);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		// @Refactor
		// dynamic arrays are structs
		if (node.left.base.type.base.kind == Type_Kind.ARRAY) {
			if (node.right.base.kind == Code_Kind.IDENT) {
				if (push_index) {
					add_node_to_execution_stack(node.left);
					add_node_to_execution_stack(node.right);
					add_node_to_execution_stack(node);
				}
				if (node.right.name == "length") {
					return_value = node.left.base.type.length;
				}
				else {
					throw Error;
				}
			}
		}
		else {
			return_value = get_memory(run_lvalue(node), node.base.type);
		}
		return_node = make_literal(return_value);
	}
	else {
		return_value = run_lvalue(node);
		return_node = node.last_return_node;
		if (!return_node) {
			return_node = make_literal(return_value);
		}
	}
	return_node.base.type = node.base.type;
	node.last_return = return_value;
	node.last_return_node = return_node;
	return return_value;
}
function run_statement(node, push_index = true) {
	if (node.base.kind == Code_Kind.DECLARATION && node.expression && 
		(typeof node.expression == "function" ||
		 node.expression.base.kind == Code_Kind.PROCEDURE ||
		 node.expression.base.kind == Code_Kind.STRUCT)) {

		return;
	}
	let return_value;
	let return_node;
	let last_block = block_stack[block_stack.length-1];
	let last_loop = loop_stack[loop_stack.length-1];
	let last_call = call_stack[call_stack.length-1];
	if (node.base.kind == Code_Kind.BLOCK) {
		node.index = 0;
		block_stack.push(node);
		node.allocations = new Array();
		while (node.index < node.statements.length) {
			let stmt = node.statements[node.index];
			return_value = run_statement(stmt);
			return_node = stmt.last_return_node;
			node.index += 1;
			if ((last_call && last_call.returned) ||
			    (last_loop && (last_loop.broken || last_loop.continued))) {

				break;
			}
		}
		for (let i = 0; i < node.allocations.length; i += 1) {
			let decl = node.allocations[i];
			stack_pointer -= decl.ident.base.type.size_in_bytes;
		}
		block_stack.pop();
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		let expression_value = null;
		node.ident.is_lhs = true;
		if (push_index) {
			add_node_to_execution_stack(node.ident);
		}

		if (node.ident.base.type.base.kind == "void") {
			node.ident.is_void_return = true;
		}
		else {
			let prev_value = get_memory(stack_pointer, node.ident.base.type, node.ident);
			node.ident.last_return = prev_value;
			node.pointer = stack_pointer;
			stack_pointer += node.ident.base.type.size_in_bytes;
			last_block.allocations.push(node);
			if (node.expression && node.type) {
				expression_value = run_rvalue(node.expression);
				if (node.type.name == "string") {
					let length = expression_value.length;
					let length_type = node.ident.base.type.members.length.type;
					let length_offset = node.ident.base.type.members.length.offset;
					let elem_type = node.ident.base.type.members.pointer.type.elem_type;
					let array_pointer = allocate_memory(length * elem_type.size_in_bytes);
					let char_array = new Array(expression_value.length);
					for (let j = 0; j < expression_value.length; j += 1) {
						char_array[j] = expression_value.charCodeAt(j);
					}
					set_memory_array(array_pointer, elem_type, length, char_array);
					set_memory(node.pointer, Types.size_t, array_pointer);
					set_memory(node.pointer + length_offset, length_type, length);
				}
				else {
					set_memory(node.pointer, node.ident.base.type, expression_value);
				}
			}
			add_memory_use(node.pointer, node.ident);
			add_memory_change(node.pointer, node.ident);
		}
		// node.ident.name = get_final_name(node.ident.original.name);
		set_and_increase_name_usage_count(node.ident);
		return_value = expression_value;
	}
	else if (node.base.kind == Code_Kind.STRUCT) {
	}
	else if (node.base.kind == Code_Kind.IF) {
		let else_expr = last_block.statements[last_block.index + 1];
		if (else_expr && else_expr.base.kind == Code_Kind.ELSE) {
			else_expr.if_expr = node;
		}
		if (run_rvalue(node.condition)) {
			return_value = run_statement(node.expression);
		}
		else {
			if (else_expr && else_expr.base.kind == Code_Kind.ELSE) {
				last_block.index += 1;
				return_value = run_statement(else_expr);
			}
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		if (node.if_expr && node.if_expr.condition.last_return == false) {
			return_value = run_statement(node.expression);
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		loop_stack.push(node);
		last_loop = node;
		let block_index = last_block.statements.indexOf(node);
		let should_run = true;
		node.broken = false;
		while (should_run) {
			let condition = clone(node.condition);
			should_run = run_rvalue(condition);
			let cloned_expr = clone(node.expression);
			node.continued = false;
			if (should_run) {
				return_value = run_statement(cloned_expr);
			}
			let cycle = make_if(condition, cloned_expr);
			cycle.loop = node;
			last_block.statements.splice(block_index, 0, cycle);
			block_index += 1;
			if ((last_call && last_call.returned) ||
			    (last_loop && last_loop.broken)) {

				break;
			}
		}
		loop_stack.pop();
		last_block.index = block_index;
	}
	else if (node.base.kind == Code_Kind.DO_WHILE) {
		loop_stack.push(node);
		last_loop = node;
		let block_index = last_block.statements.indexOf(node);
		let should_run = true;
		node.broken = false;
		let first = true;
		while (should_run) {
			let condition;
			if (first) {
				first = false;
				condition = make_literal(true);
			}
			else {
				condition = clone(node.condition);
			}
			should_run = run_rvalue(condition);
			let cloned_expr = clone(node.expression);
			node.continued = false;
			if (should_run) {
				return_value = run_statement(cloned_expr);
			}
			let cycle = make_if(condition, cloned_expr);
			cycle.loop = node;
			last_block.statements.splice(block_index, 0, cycle);
			block_index += 1;
			if ((last_call && last_call.returned) ||
			    (last_loop && last_loop.broken)) {

				break;
			}
		}
		loop_stack.pop();
		last_block.index = block_index;
	}
	else if (node.base.kind == Code_Kind.FOR) {
		loop_stack.push(node);
		let block_index = last_block.statements.indexOf(node);
		if (node.begin) {
			last_block.statements.splice(block_index, 0, node.begin);
			block_index += 1;
			// should this be run_lvalue?
			run_statement(node.begin);
		}
		if (!node.condition) {
			node.condition = make_literal(true);
		}
		if (node.cycle_end) {
			if (node.expression.base.kind != Code_Kind.BLOCK) {
				node.expression = make_block([node.expression]);
			}
			node.expression.statements.push(node.cycle_end);
		}
		let should_run = true;
		node.broken = false;
		while (should_run && node.broken == false && last_call.returned == false) {
			let condition = clone(node.condition);
			should_run = run_rvalue(condition);
			let cloned_expr = clone(node.expression);
			node.continued = false;
			if (should_run) {
				return_value = run_statement(cloned_expr);
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
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		last_loop.broken = true;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		if (push_index) {
			add_node_to_execution_stack(node);
		}
		last_loop.continued = true;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		let transformed = transform(node);
		if (node.expression) {
			return_value = run_statement(transformed);
			return_node = transformed.statements[0].expression.last_return_node;
			let return_decl = last_call.transformed.statements[0];
			add_memory_change(return_decl.pointer, transformed.statements[0].ident);
		}
		else {
			let void_return = transformed.statements[0];
			void_return.is_void_return = true;
			run_statement(void_return);
			let return_decl = last_call.transformed.statements[0];
			return_decl.ident.next_change = void_return;
			return_decl.ident.next_use = last_call;
			void_return.next_use = last_call;
			
		}
		last_call.returned = true;
		last_call.last_return = return_value;
		last_call.last_return_node = return_node;
	}
	else {
		return_value = run_rvalue(node);
		return_node = node.last_return_node;
	}
	node.last_return = return_value;
	node.last_return_node = return_node;
	return return_value;
}

function math_binop(left, operation_type, right) {
	let is_array = left.base.type && (left.base.type.base.kind == Type_Kind.STRING ||
	                                  left.base.type.base.kind == Type_Kind.ARRAY) ||
				   right.base.type && (right.base.type.base.kind == Type_Kind.STRING ||
								       right.base.type.base.kind == Type_Kind.ARRAY);
	let is_float = left.base.type && left.base.type.base.kind == Type_Kind.FLOAT && 
				   right.base.type && right.base.type.base.kind == Type_Kind.FLOAT;
	// :PointerMath
	if (left.base.type) {
		if (left.base.type.base.kind == Type_Kind.POINTER) {
			if (right.base.type && right.base.type.base.kind == Type_Kind.POINTER) {
				throw Error("Pointer math requires only one pointer, not two!");
			}
			else {
				right.value *= left.base.type.elem_type.size_in_bytes;
			}
		}
	}
	else if (right.base.type && right.base.type.base.kind == Type_Kind.POINTER) {
		if (left.base.type) {
			if (left.base.type.base.kind == Type_Kind.POINTER) {
				throw Error("Pointer math requires only one pointer, not two!");
			}
			else {
				left.value *= right.base.type.elem_type.size_in_bytes;
			}
		}
	}
	// we are piggybacking on Javascript's operations,
	// especially string compare, need to rewrite when porting to C
	if (operation_type == "+") {
		return left.value + right.value;
	}
	else if (operation_type == "-") {
		return left.value - right.value;
	}
	else if (operation_type == "*") {
		return left.value * right.value;
	}
	else if (operation_type == "/") {
		if (is_float) {
			return left.value / right.value;
		}
		else {
			// emulate actual int division
			return Math.floor(left.value / right.value);
		}
	}
	else if (operation_type == "%") {
		return left.value % right.value;
	}
	else if (operation_type == "<") {
		return left.value < right.value;
	}
	else if (operation_type == ">") {
		return left.value > right.value;
	}
	else if (operation_type == "<=") {
		return left.value <= right.value;
	}
	else if (operation_type == ">=") {
		return left.value >= right.value;
	}
	else if (operation_type == "==") {
		return left.value == right.value;
	}
	else if (operation_type == "!=") {
		return left.value != right.value;
	}
	else if (operation_type == "&&") {
		return left.value && right.value;
	}
	else if (operation_type == "||") {
		return left.value || right.value;
	}
	else if (operation_type == "&") {
		return left.value & right.value;
	}
	else if (operation_type == "|") {
		return left.value | right.value;
	}
}
function math_solve(node) {
	if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		run_rvalue(node.left);
		run_rvalue(node.right);
		return math_binop(node.left.last_return_node, node.operation_type, node.right.last_return_node);
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		let ident = node;
		return map_ident_to_value.get(ident.declaration.ident);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {
		return node.value;
	}
	else if (node.base.kind == Code_Kind.CALL) {
		return run_rvalue(node);
	}
}

function clone(node, set_original = true) {
	let cloned;
	if (node.base.kind == Code_Kind.BLOCK) {
		let statements = new Array();
		cloned = make_block(statements, null);
		map_original_to_clone.set(node, cloned);
		cloned.enclosing_scope = map_original_to_clone.get(node.enclosing_scope);
		if (!cloned.enclosing_scope) {
			// @Audit
			// does this cause problems?
			cloned.enclosing_scope = node.enclosing_scope;
		}
		for (let statement of node.statements) {
			statements.push(clone(statement));
		}
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
	else if (node.base.kind == Code_Kind.STRUCT) {
		cloned = make_struct(clone(node.block));
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
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		cloned = make_array_index(clone(node.array), clone(node.index));
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		cloned = make_dot_operator(clone(node.left), clone(node.right));
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
	else if (node.base.kind == Code_Kind.DO_WHILE) {
		cloned = make_do_while(clone(node.expression), clone(node.condition));
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
		let type;
		if (node.type && node.type.base.kind == Code_Kind.IDENT) {
			type = clone(node.type);
		}
		else {
			type = node.type;
		}
		let decl = make_declaration(clone(node.ident), expr, type);
		decl.enclosing_scope = map_original_to_clone.get(decl.enclosing_scope);
		map_original_to_clone.set(node, decl);
		cloned = decl;
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		let ident = make_ident(node.name);
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
	else if (node.base.kind == Code_Kind.MINUS) {

		cloned = make_minus(clone(node.ident));
	}
	else if (node.base.kind == Code_Kind.NOT) {
		cloned = make_not(clone(node.ident));
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		cloned = make_increment(clone(node.ident));
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		cloned = make_decrement(clone(node.ident));
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		cloned = make_assign(clone(node.ident), clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		cloned = make_opassign(clone(node.ident), node.operation_type, clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		cloned = make_parens(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		cloned = make_binary_operation(clone(node.left), node.operation_type, clone(node.right));
	}
	else if (node.base.kind == Code_Kind.LITERAL) {
		cloned = make_literal(node.value);
	}
	else if (node.base.kind == Code_Kind.STRING) {
		cloned = make_string(node.str);
		cloned.pointer = node.pointer;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		let expr;
		if (node.expression) {
			expr = clone(node.expression);
		}
		cloned = make_return(expr);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		cloned = make_reference(clone(node.expression));
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		cloned = make_dereference(clone(node.expression));
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
	cloned.base.type = node.base.type;
	return cloned;
}

function set_and_increase_name_usage_count(node) {
	if (node.base.kind != Code_Kind.IDENT) {
		throw Error("This function can only be used with idents!");
	}
	let count = idents_used.get(node.name);
	if (count) {
		count += 1;
	}
	else {
		count = 1;
	}
	idents_used.set(node.name, count);
	node.usage_count = count;
}

function transform(node) {
	let replacement = make_block();
	// @Audit
	// does not setting replacement.enclosing_scope cause problems?
	node.transformed = replacement;
	let last_call = call_stack[call_stack.length-1];
	if (node.base.kind == Code_Kind.CALL) {
		let procedure = node.ident.declaration.expression;
		if (typeof procedure.transformed == "undefined") {
			procedure.transformed = make_block();
			procedure.transformed.enclosing_scope = node.ident.declaration.enclosing_scope;
			let return_ident = make_ident("return_"+ node.ident.name);
			procedure.transformed.return_ident = return_ident;
			let return_decl = make_declaration(return_ident, null, procedure.return_type);
			return_decl.enclosing_scope = procedure.transformed;
			procedure.transformed.statements.push(return_decl);
			for (let i = 0; i < procedure.parameters.length; i += 1) {
				let param = procedure.parameters[i];
				procedure.transformed.statements.push(param);
			}
			// the original statements go in a separate block
			let proc_body = make_block();
			proc_body.enclosing_scope = procedure.transformed;
			for (let i = 0; i < procedure.block.statements.length; i += 1) {
				let stmt = procedure.block.statements[i];
				proc_body.statements.push(stmt);
			}
			procedure.transformed.statements.push(proc_body);
			// :BlockEnclosingScope
			infer_last_block = procedure.transformed.enclosing_scope;
			infer(procedure.transformed);
			infer_last_block = null;
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
		// @Hack
		// @Cleanup
		code_composed = false;
		let cloned_ident = clone(ident);
		last_call.transformed.return_ident = clone(ident);
		code_composed = true;
		cloned_ident.original = node.original;
		// @Copypaste
		let indices = map_original_to_indices.get(cloned_ident.original);
		if (typeof indices == "undefined") {
			indices = new Array();
			map_original_to_indices.set(cloned_ident.original, indices);
		}
		let expr = cloned_ident;
		if (node.expression) {
			expr = make_assign(cloned_ident, node.expression);
		}
		replacement.statements.push(expr);
	}
	if (replacement.statements.length > 0) {
		return replacement;
	}
	else {
		delete node.transformed;
	}
}

function mark_containment(node) {
	node.is_inspection = Object.is(node, inspection_cursor);
	node.is_flowpoint = flowpoints.indexOf(node.execution_index) >= 0;
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
	else if (node.base.kind == Code_Kind.STRUCT) {
		mark_containment(node.block);
		node.contains_flowpoint = node.block.contains_flowpoint;
		node.contains_inspection = node.block.contains_inspection;
		node.contains_execution = node.block.contains_execution;
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
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		mark_containment(node.array);
		mark_containment(node.index);
		node.contains_flowpoint = node.array.contains_flowpoint || node.array.is_flowpoint ||
		                          node.index.contains_flowpoint || node.index.is_flowpoint;
		node.contains_inspection = node.array.contains_inspection || node.array.is_inspection ||
		                           node.index.contains_inspection || node.index.is_inspection;
		node.contains_execution = node.array.contains_execution || node.array.is_execution ||
		                          node.index.contains_execution || node.index.is_execution;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		mark_containment(node.left);
		mark_containment(node.right);
		node.contains_flowpoint = node.left.contains_flowpoint || node.left.is_flowpoint ||
		                          node.right.contains_flowpoint || node.right.is_flowpoint;
		node.contains_inspection = node.left.contains_inspection || node.left.is_inspection ||
		                          node.right.contains_inspection || node.right.is_inspection;
		node.contains_execution = node.left.contains_execution || node.left.is_execution ||
		                          node.right.contains_execution || node.right.is_execution;
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
	else if (node.base.kind == Code_Kind.INCREMENT) {
		mark_containment(node.ident);
		node.contains_flowpoint = node.ident.contains_flowpoint || node.ident.is_flowpoint;
		node.contains_inspection = node.ident.contains_inspection || node.ident.is_inspection;
		node.contains_execution = node.ident.contains_execution || node.ident.is_execution;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		mark_containment(node.expression);
		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
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
	else if (node.base.kind == Code_Kind.REFERENCE) {
		mark_containment(node.expression);
		node.contains_flowpoint = node.expression.contains_flowpoint || node.expression.is_flowpoint;
		node.contains_inspection = node.expression.contains_inspection || node.expression.is_inspection;
		node.contains_execution = node.expression.contains_execution || node.expression.is_execution;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
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
	return node.contains_flowpoint || node.contains_inspection || node.contains_execution
	       || node.base.kind == Code_Kind.RETURN;
}

function should_hide(node) {
	if (node.is_execution || node.is_inspection || node.is_flowpoint) {
		return false;
	}
	if (Object.is(node, Global_Block)) {
		return false;
	}
	if (node.base.kind == Code_Kind.DECLARATION ||
		node.base.kind == Code_Kind.ASSIGN ||
		node.base.kind == Code_Kind.OPASSIGN) {
		return should_hide(node.ident);
	}
	if (node.base.kind == Code_Kind.WHILE ||
		node.base.kind == Code_Kind.DO_WHILE ||
	    node.base.kind == Code_Kind.FOR) {
		return true;
	}
	if (node.base.kind == Code_Kind.BLOCK) {
		// the body of a transformed function call should always be shown
		if (node.enclosing_scope.transformed_from_call) {
			return false;
		}
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
		let if_expr_was_run = false;
		if (node.if_expr) {
			if_expr_was_run = node.if_expr.condition.last_return;
		}
		// @Cleanup
		// last element might be redundant
		return !node.if_expr || if_expr_was_run || should_hide(node.if_expr);
	}
	if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		return should_hide(node.left) || should_hide(node.right);
	}
	// hide code that has not been run
	if (typeof node.execution_index == "undefined" &&
		typeof node.last_return_node == "undefined") {

		return true;
	}
	for (let i = 0; i < hidden_flowzones.length; i += 1) {
		for (let j = 0; j < dataflows.length; j += 1) {
			let flowpoint = dataflows[j][find_prev_index_in_array(dataflows[j], node.execution_index)];
			if (hidden_flowzones[i].indexOf(flowpoint) >= 0) {
				return true;
			}
		}
	}

	return false;
}

let palette = ["250, 0, 0", "0, 200, 0", "0, 0, 200"];
let palette_index = 0;
let print_expression_stack = new Array();
let map_expr_to_printed = new Map();
let map_line_to_execution_indices = new Array();
let line_count = 0;
let current_line = 0;
let column_index = 0;
let force_expand = false;

// @Incomplete
// Rendering everything into a DOM element after every move is expensive
// Maybe this will improve when we start using direct text rendering,
// but we might want to only re-render the parts of the tree that actually change
function print_to_dom(node, print_target, block_print_target, is_transformed_block = false, push_index = true) {

	let expr = document.createElement("expr");
	expr.node = node;

	let last_expression = print_expression_stack[print_expression_stack.length-1];
	let should_expand_node = should_expand(node) || force_expand;
	// @Cleanup
	// should_hide could probably be done in should_expand or computed in mark_containment
	let should_hide_node = should_hide(node);
	let is_blocklevel_expanded_call = node.base.kind == Code_Kind.CALL && should_expand_node &&
	                                  last_expression && last_expression.base.kind == Code_Kind.BLOCK;

	if (last_expression && last_expression.base.kind == Code_Kind.BLOCK &&
	    should_hide_node && should_expand_node != true) {

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

		if (node.base.kind == Code_Kind.CALL) {
			let last = block_print_target.children[block_print_target.children.length-1];
			let ident = last.children[0].children[0].children[1];
			ident.classList.add("code-return");
		}
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
	if (node.base.kind == Code_Kind.BINARY_OPERATION ||
	    node.base.kind == Code_Kind.DOT_OPERATOR) {

		order_last = true;
	}
	if (should_expand_node) {
		push_index = false;
	}
	if (push_index && order_last == false && node.execution_index >= 0 && !is_blocklevel_expanded_call) {
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
		if (!is_transformed_block) {
			style += "padding-left: 4ch";
		}
		block.style = style;
		for (let stmt of node.statements) {
			let stmt_elem = document.createElement("stmt");
			print_to_dom(stmt, stmt_elem, block);
			if (stmt_elem.children.length > 0) {
				if (stmt.base.kind != Code_Kind.NEWLINE &&
					stmt.base.kind != Code_Kind.IF      &&
					stmt.base.kind != Code_Kind.ELSE    &&
					stmt.base.kind != Code_Kind.WHILE   ) {

					let stmt_end = document.createElement("div");
					stmt_end.classList.add("stmt-end");
					stmt_end.appendChild(document.createTextNode(";"));
					stmt_elem.appendChild(stmt_end);
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
		if ((should_expand_node || expand_all) && node.transformed) {
			if (last_expression.base.kind != Code_Kind.BLOCK) {
				print_to_dom(node.transformed.return_ident, expr, block_print_target);
				expr.classList.add("code-return");
				print_target.appendChild(expr);
			}
		}
		else if ((node.is_lhs ? lhs_values_shown : values_shown) &&
			node.last_return_node !== null && typeof node.last_return_node !== "undefined" &&
			typeof node.last_return !== "undefined" && should_expand_node != true) {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
			print_target.appendChild(expr);
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
			print_target.appendChild(expr);
		}
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
		else {
			expr.appendChild(document.createTextNode("{}"));
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
		throw Error;
	}
	else if (node.base.kind == Code_Kind.FOR) {
		console.log("a for loop slipped through!");
		throw Error;
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		if (values_shown && binop_values_shown && should_expand_node != true) {
			// @Incomplete
			if (true) {
				print_to_dom(node.last_return_node, expr, block_print_target, false, false);
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
		else if (node.expression && node.expression.base.kind == Code_Kind.STRUCT) {
			/*
			// @Hack
			force_expand = true;
			print_to_dom(node.expression, expr);
			force_expand = false;
			print_target.appendChild(expr);
			*/
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
	else if (node.base.kind == Code_Kind.STRUCT) {
		let struct_expr = document.createElement("expr");
		struct_expr.appendChild(document.createTextNode("struct"));
		struct_expr.classList.add("code-keyword");
		expr.appendChild(struct_expr);
		expr.appendChild(document.createTextNode(" "));
		print_to_dom(last_expression.ident, expr);
		expr.appendChild(document.createTextNode(" "));
		print_to_dom(node.block, expr);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		let op = document.createElement("expr");
		op.appendChild(document.createTextNode("-"));
		op.classList.add("code-op");
		expr.appendChild(op);
		print_to_dom(node.ident, expr, block_print_target);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.NOT) {
		let op = document.createElement("expr");
		op.appendChild(document.createTextNode("!"));
		op.classList.add("code-op");
		expr.appendChild(op);
		print_to_dom(node.ident, expr, block_print_target);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		print_to_dom(node.ident, expr, block_print_target);
		let op = document.createElement("expr");
		op.appendChild(document.createTextNode("++"));
		op.classList.add("code-op");
		expr.appendChild(op);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		print_to_dom(node.ident, expr, block_print_target);
		let op = document.createElement("expr");
		op.appendChild(document.createTextNode("--"));
		op.classList.add("code-op");
		expr.appendChild(op);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		// if we print the expression after the ident, up_line will be incorrect
		let temp_expr = document.createElement("expr");
		print_to_dom(node.expression, temp_expr, block_print_target);
		print_to_dom(node.ident, expr, block_print_target);
		// @Copypaste
		let line = map_line_to_execution_indices[line_count];
		if (line.length >= 2) {
			let cut_index = line.indexOf(node.expression.execution_index) + 1;
			line = line.slice(cut_index, line.length).concat(line.slice(0, cut_index));
			map_line_to_execution_indices[line_count] = line;
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
			let cut_index = line.indexOf(node.expression.execution_index) + 1;
			line = line.slice(cut_index, line.length).concat(line.slice(0, cut_index));
			map_line_to_execution_indices[line_count] = line;
		}
		let op = document.createElement("expr");
		op.appendChild(document.createTextNode(" "+ node.operation_type +"= "));
		op.classList.add("code-op");
		expr.appendChild(op);
		expr.appendChild(temp_expr.children[0]);
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.IDENT) {

		// @Copypaste
		if ((node.is_lhs ? lhs_values_shown : values_shown) &&
		    node.last_return_node !== null && typeof node.last_return_node !== "undefined") {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
		}
		else {
			if (Object.getOwnPropertyNames(Types).indexOf(node.name) >= 0) {
				expr.classList.add("code-type");
			}
			else if (node.declaration && node.declaration.expression &&
			         typeof node.declaration.expression != "function" &&
			         node.declaration.expression.base.kind == Code_Kind.PROCEDURE) {

				expr.classList.add("code-func");
			}
			else {
				expr.classList.add("code-ident");
			}
			expr.appendChild(document.createTextNode(node.name));
			if (node.usage_count >= 2) {
				let usage_count_elem = document.createElement("div");
				usage_count_elem.classList.add("code-usage-count");
				let usage_count_text = "_" + node.usage_count.toString();
				usage_count_elem.appendChild(document.createTextNode(usage_count_text));
				expr.appendChild(usage_count_elem);
			}
		}
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		// @Copypaste
		if ((node.is_lhs ? lhs_values_shown : values_shown) && should_expand_node == false &&
		    node.last_return_node !== null && typeof node.last_return_node !== "undefined") {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
		}
		else {

			expr.appendChild(document.createTextNode("&"));
			print_to_dom(node.expression, expr, block_print_target);
		}

		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		// @Copypaste
		if ((node.is_lhs ? lhs_values_shown : values_shown) && should_expand_node == false &&
		    node.last_return_node !== null && typeof node.last_return_node !== "undefined") {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
		}
		else {
			expr.appendChild(document.createTextNode("*"));
			print_to_dom(node.expression, expr, block_print_target);
		}
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		expr.appendChild(document.createTextNode("("));
		print_to_dom(node.expression, expr, block_print_target);
		expr.appendChild(document.createTextNode(")"));
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		// @Copypaste
		if ((node.is_lhs ? lhs_values_shown : values_shown) && should_expand_node == false &&
		    node.last_return_node !== null && typeof node.last_return_node !== "undefined") {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
		}
		else {
			print_to_dom(node.array, expr, block_print_target);
			expr.appendChild(document.createTextNode("["));
			print_to_dom(node.index, expr, block_print_target);
			expr.appendChild(document.createTextNode("]"));
		}
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		// @Copypaste
		if ((node.is_lhs ? lhs_values_shown : values_shown) && should_expand_node == false &&
		    node.last_return_node !== null && typeof node.last_return_node !== "undefined") {

			print_to_dom(node.last_return_node, expr, block_print_target, false, false);
		}
		else {
			print_to_dom(node.left, expr, block_print_target);
			expr.appendChild(document.createTextNode("."));
			print_to_dom(node.right, expr, block_print_target);
		}
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.LITERAL) {
		expr.classList.add("code-literal");
		expr.appendChild(document.createTextNode(node.value));
		print_target.appendChild(expr);
	}
	else if (node.base.kind == Code_Kind.STRING) {
		expr.classList.add("code-string");
		expr.appendChild(document.createTextNode("\""));
		expr.appendChild(document.createTextNode(node.str));
		expr.appendChild(document.createTextNode("\""));
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
			let expr = document.createElement("expr");
			print_to_dom(node.transformed.statements[0], expr, block_print_target);
			if (node.expression) {
				expr.children[0].children[0].classList.add("code-return");
			}
			else {
				expr.children[0].classList.add("code-return");
			}
			print_target.appendChild(expr);
		}
	}
	else if (node.base.kind == Type_Kind.POINTER) {
		print_to_dom(node.elem_type, expr, block_print_target);
		expr.appendChild(document.createTextNode("*"));
		print_target.appendChild(expr);		
	}
	else if (node.base.kind == Type_Kind.ARRAY) {
		print_to_dom(node.elem_type, expr, block_print_target);
		expr.appendChild(document.createTextNode("["));
		if (node.length) {
			let length_expr = document.createElement("expr");
			length_expr.appendChild(document.createTextNode(node.length));
			length_expr.classList.add("code-literal");
			expr.appendChild(length_expr);
		}
		expr.appendChild(document.createTextNode("]"));
		print_target.appendChild(expr);
	}

	print_expression_stack.pop();
	map_expr_to_printed.set(node, expr);

	if (push_index && order_last && node.execution_index >= 0 && !is_blocklevel_expanded_call) {
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
	if (node.execution_index >= 0 && flowpoints.indexOf(node.execution_index) >= 0) {
		expr.classList.add("flow-"+ active_dataflow);
	}
}

main();