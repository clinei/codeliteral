"use strict";

let code = `/*  KEYBOARD CONTROLS

	W :: move up         F :: show values
	S :: move down       E :: show elems
	A :: move left       Q :: show cycles
	D :: move right      V :: show visual

	Z :: step prev       C :: switch cursor
	X :: step next       P :: expand all

	K :: set bookmark    I :: prev bookmark
	L :: bookmark text   O :: next bookmark

	H :: prev change     Y :: prev use
	J :: next change     U :: next use

	N :: prev clone      R :: jump to repl
	M :: next clone      0-9 :: quick command

	B :: show bookmark
	G :: show changes

	T :: show tools

*/

//  Please finish the tutorial
//  before editing the source code

void simple_code() {
	"Read the code and guess the result";
	int a = 1;
	int b = 2;
	int c = a + b;
	b = c * b;
	c = a + b;
	"or press F to see the values directly";
	"(and press it again to turn it off)";
	int result = c;
}
void detailed_data() {
	"Press WASD to move faster";
	int foo = 1;
	int bar = 2;
	if (foo > 0) {
		"Press E to see every element of an expression";
		"when values are shown (F)";
		bar = foo + bar;
	}
	if (bar * (bar + foo) > 10) {
		"show values (F) and hide elements (E)";
		"and press ZX to move around in expressions";
		"to see every step of the calculation";
		foo = (foo - bar) * (2 + 4);
	}
	int result = foo * (0-1) + bar;
}
void complex_code() {
	int shrek = 0;
	int fiona = 0;
	int donkey = 0;
	int farquaad = 666;
	int happy = 999;
	if (donkey <= 0) {
		donkey = 42;
		shrek -= 3;
	}
	if (farquaad > fiona) {
		farquaad *= 16;
		fiona -= 11;
	}
	if (shrek < happy && farquaad > 9000) {
		shrek += 10;
		donkey += 50;
	}
	if (shrek > 6 && donkey > 12) {
		fiona += 32;
		shrek *= 4;
	}
	if (shrek > 24 && fiona == 21) {
		farquaad = 0;
		donkey *= 2;
	}
	{
		"It is not enough to know the values";
		"We want to know how they changed and why";
		shrek = 420;
		fiona = 69;
		donkey = 42;
		farquaad = 0;
	}
	{
		"Move the cursor to the name of a variable";
		"Press H to jump to where it was changed last";
		"Press J to jump to where it was changed next";
		happy = true;
		"Press C to see what the value was before the change";
	}
}

int func() {
	"Return values become variables";
	"Return statements become assignments";
	return 4;
}

void func2(int param) {
	"Parameters also become variables";
	param = param + 2;
	return;
}

int square(int n) {
	if (n == 1) {
		"When a variable name has already occurred";
		"we increment a number and add it to the name";
	}
	else if (n == 0) {
		"Only the code that was run is shown";
		"because anything else is not relevant";
		"like the content of that if statement above";
	}
	else if (n == 2) {
		"You can use R and T to move between";
		"different calls of the same function, too";
	}
	return n * n;
}

void loops() {
	// :Next
	// this is not linear enough
	// some things will not be discovered
	// or will be discovered in the wrong order
	"This was a for loop";
	"but we moved out the initializer";
	"and turned every cycle into an if statement";
	for (int it = 0; it < 4; it += 1) {
		if (it == 0 || it == 3) {
			"Press R and T to move between the cycles";
		}
		else if (it == 1) {
			"Press X and Z to move into calls";
		}
		int s = square(it);
	}
}

void decision_chains() {
	"Sometimes, code is big, really really big";
	"Moving around with ZX and WASD is not fast enough";
	"RT and HJ don't help much either";
	int f = 1;
	"Jumping to where a variable was changed is useful, but";
	"it can also be useful to jump to where a variable was used";
	int g = f + f;
	"Move the cursor to the name of a variable";
	"Press Y to jump to where it was used last";
	"Press U to jump to where it was used next";
	for (int idx = 0; idx < 7; idx += 1) {
		if (idx % 4 == 0) {
			f += g;
		}
		if (idx % 4 == 1) {
			g += f;
		}
	}
	"We would like to skip most of the loops";
	"And only move between important points of interest";
	"Find the chain of decisions that led to the final result";
	int final = g;
	"Press K to mark a point of interest";
	"Press , and . to move between points of interest";
	"Press L to become disinterested";
}

void array_processing() {
	"When we try to understand how a piece of code works";
	"We want to track many chains of logic at the same time";
	"Press numbers 1 to 9 to select the active chain of points";
	int[3] arr;
	"Track the path of each element in this array";
	"Using 3 separate chains of points";
	for (int i = 0; i < arr.length; i += 1) {
		arr[i] = i + 2;
	}
	int[3] phase_1 = arr;
	for (int j = 0; j < arr.length; j += 1) {
		arr[j] = square(arr[j]);
	}
	int[3] phase_2 = arr;
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
	int[3] phase_3 = arr;
	for (int l = 0; l < arr.length; l += 1) {
		if (arr[l] > 50) {
			arr[l] = 5;
		}
		else if (arr[l] == 50) {
			arr[l] = 5;
		}
	}
	int[3] phase_4 = arr;
	for (int m = 0; m < arr.length; m += 1) {
		if (arr[m] == 5) {
			"Why is this value 5?";
			"Can you make a chain of decision points to explain?";
			arr[m] = arr[m];
			"Press numbers 1 to 9 to select which chain of points is active";
		}
	}
	"Congratulations, you made it to the end of the tutorial!";
	"You can explore more examples in the main function";
	"Try to solve the bugs, or write your own code in the side panel";
	return;
}

int factorial_recursive(int number) {
	if (number > 1) {
		return number * factorial_recursive(number - 1);
	}
	else {
		"You can use R and T to jump between";
		"rarely accessed conditional code";
		"like the following return statement";
		"that terminates a recursive factorial";
		return 1;
	}
}
int factorial_iterative(int number) {
	int product = 1;
	int i = 1;
	while (i <= number) {
		product *= i;
		i += 1;
	}
	return product;
}
void factorial(int number) {
	int recr = factorial_recursive(number);
	int iter = factorial_iterative(number);
	recr == iter;
}

int fib(int number) {
	if (number > 1) {
		return fib(number - 2) + fib(number - 1);
	}
	else {
		"You can use R and T to jump between";
		"rarely accessed conditional code";
		"like the following return statement";
		"that terminates a recursive fibonacci";
		return number;
	}
}
int fibonacci_iterative(int number) {
	int first = 0;
	int second = 1;
	int temp = 0;
	for (int i = 0; i < number; i += 1) {
		temp = first;
		first = second;
		second = temp + second;
	}
	return first;
}
void fibonacci(int number) {
	int recr = fib(number);
	int iter = fibonacci_iterative(number);
	recr == iter;
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
		if (i < nodes.length-1) {
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

float sqr(float x) {
	return x * x;
}
float distance(float x1, float y1, float x2, float y2) {
	float d1 = x1 - x2;
	float d2 = y1 - y2;
	// sneaky copypaste error
	float sd1 = sqr(d1);
	float sd2 = sqr(d1);
	return sqrt(sd1 + sd2);
}
struct Point {
	float x;
	float y;
};
float triangle_circumference(Point[3] tri) {
	float side1 = distance(tri[0].x, tri[0].y, tri[1].x, tri[1].y);
	float side2 = distance(tri[1].x, tri[1].y, tri[2].x, tri[2].y);
	float side3 = distance(tri[2].x, tri[2].y, tri[0].x, tri[0].y);
	return side1 + side2 + side3;
}
void triangle_bug() {
	Point[3] triangle;
	"First point";
	triangle[0].x = 0;
	triangle[0].y = 0;
	"Second point";
	triangle[1].x = 3;
	triangle[1].y = 0;
	"Third point";
	triangle[2].x = 3;
	triangle[2].y = 4;
	"This is a triangle with sides of length 3, 4, 5";
	"The circumference should be 12, but it's not. Why?";
	float result = triangle_circumference(triangle);
}

void subtle_bug_bad() {
	float sum = 0;
	for (int i = 1; i < 7; i += 1) {
		sum += 10 / i;
	}
	"Should be 24.5";
	float result = sum;
}
void subtle_bug_fix() {
	float sum = 0;
	"By adding a decimal point to the literal";
	"we turn the result of the division into a float";
	for (int i = 1; i < 7; i += 1) {
		sum += 10.0 / i;
	}
	"Bugs like these can be hard to notice";
	"when the problem is not in the logic";
	"but in how it's applied to real values";
	float result = sum;
}
void subtle_bug() {
	subtle_bug_bad();
	subtle_bug_fix();
}

void strings() {
	string h = "foo";
	string w = "bar";
	string s = h + w;
	if (s == "foobar") {
		s[2] = s[0];
		s[0] = s[1];
	}
	if (s.length == h.length + w.length) {
		s.length = h.length;
		// s.pointer;
	}
	for (int i = 0; i < 2; i += 1) {
		s += s;
	}
	// s[s.length-1] = "f";
	/*
	// string empty;
	string empty = "";
	if (empty == "") {
		true;
	}
	*/
}

int main() {
	"Press Z to move backward";
	simple_code();
	detailed_data();
	complex_code();

	int variable = func();
	func2(4);
	loops();
	strings();
	decision_chains();
	array_processing();

	subtle_bug();
	triangle_bug();

	fizzbuzz(15);
	factorial(5);
	fibonacci(7);

	// linked_list();
	return 0;
}
"Starting tutorial";
"Press X to move forward";
`;

const test_code = `// Tests
bool test_int() {
	bool passed = true;
	int value;
	passed &= value == 0;
	value = 12345;
	passed &= value == 12345;
	return passed;
}
bool test_float() {
	bool passed = true;
	float value;
	passed &= value == 0.0;
	value = 123.45;
	passed &= compare_float(value, 123.45);
	return passed;
}
bool test_bool() {
	bool passed = true;
	bool value;
	passed &= value == false;
	value = true;
	passed &= value == true;
	return passed;
}
bool test_char() {
	bool passed = true;
	char value;
	passed &= value == '\0';
	value = 'a';
	passed &= value == 'a';
	value = '\n';
	passed &= value == '\n';
	return passed;
}
bool test_primitives() {
	bool passed = true;
	passed &= test_int();
	passed &= test_float();
	passed &= test_bool();
	passed &= test_char();
	return passed;
}
enum Fruit {
	APPLE,
	BANANA,
	CHERRY
}
bool test_enum() {
	bool passed = true;
	Fruit f = Fruit.BANANA;
	passed &= f == Fruit.BANANA;
	f = Fruit.CHERRY;
	passed &= f == Fruit.CHERRY;
	f = f;
	passed &= f == Fruit.CHERRY;
	return passed;
}
enum_flags Taste {
	NONE,
	SWEET,
	SALTY,
	SOUR,
	UMAMI
}
bool test_enum_flags() {
	bool passed = true;
	Taste t;
	passed &= t == Taste.NONE;
	t = Taste.SWEET;
	passed &= t == Taste.SWEET;
	t |= Taste.UMAMI;
	passed &= t == (Taste.SWEET | Taste.UMAMI);
	t = Taste.SALTY | Taste.SWEET;
	passed &= t == (Taste.SALTY | Taste.SWEET);
	t = Taste.SOUR;
	passed &= t == Taste.SOUR;
	return passed;
}
/*
bool test_string() {
	bool passed = true;
	string str1 = "foo";
	string str2 = "bar";
	passed &= str1[0] == 'f';
	passed &= str1.length == 3;
	passed &= str1 == "foo";
	str1 += str2;
	passed &= str1 == "foobar";
	// unsafe, but allowed
	str1.length = 2;
	passed &= str1.length == 2;
	passed &= str1[1] + str1[1] + str1[0] == "oof";
	return passed;
}
void test_string_malloc() {
	// @Incomplete
	string* f = malloc(sizeof(string));
	*f;
}
*/
bool test_struct() {
	bool passed = true;
	struct Car {
		int type;
		int age;
	}
	struct Person {
		int age;
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
bool test_int_array() {
	bool passed = true;
	int[8] arr;
	passed &= arr.length == 8;
	arr[7] = 12345;
	passed &= arr[7] == 12345;
	arr[0] = arr[7];
	passed &= arr[0] == 12345;
	return passed;
}
bool test_float_array() {
	bool passed = true;
	float[3] float_arr;
	// @Incomplete
	// nocheckin
	// [1.0, 2, 3.0]
	// [1, 2.0, 3]
	passed = false;
	return passed;
}
bool test_char_array() {
	bool passed = true;
	char[3] char_arr;
	// @Incomplete
	// nocheckin
	// ['o', 'o', 'f']
	// ['o', 101, 'f']
	passed = false;
	return passed;
}
bool test_enum_array() {
	bool passed = true;
	Fruit[2] enum_arr;
	passed &= enum_arr[0] == Fruit.APPLE;
	passed &= enum_arr[1] == Fruit.APPLE;
	enum_arr[0] = Fruit.BANANA;
	enum_arr[1] = Fruit.CHERRY;
	passed &= enum_arr[0] == Fruit.BANANA;
	passed &= enum_arr[1] == Fruit.CHERRY;
	return passed;
}
/*
bool test_string_array() {
	bool passed = true;
	string[3] str_arr;
	str_arr[0] = "foo";
	str_arr[1] = "bar";
	str_arr[2] = str_arr[0];
	str_arr[2] += str_arr[1];
	passed &= str_arr[2] == "foobar";
	return passed;
}
*/
bool test_struct_array() {
	bool passed = true;
	struct Person {
		int age;
	}
	Person[2] people;
	for (int i = 0; i < people.length; i += 1) {
		people[i].age = (i + 1) * 10;
	}
	passed &= people[0].age == 10;
	passed &= people[1].age == 20;
	for (int i = 0; i < people.length; i += 1) {
		people[i].age += 4;
	}
	passed &= people[0].age == 14;
	passed &= people[1].age == 24;
	return passed;
}
bool test_array() {
	bool passed = true;
	passed &= test_int_array();
	passed &= test_float_array();
	passed &= test_char_array();
	passed &= test_enum_array();
	// @Incomplete
	// nocheckin
	// passed &= test_pointer_array();
	// passed &= test_string_array();
	passed &= test_struct_array();
	return passed;
}
bool test_int_array_literal() {
	bool passed = true;
	int[3] arr;
	passed &= arr == [0, 0, 0];
	arr = [1, 2, 3];
	passed &= arr == [1, 2, 3];
	return passed;
}
bool test_enum_array_literal() {
	bool passed = true;
	Fruit[2] enum_arr;
	passed &= enum_arr == [Fruit.APPLE, Fruit.APPLE];
	enum_arr = [Fruit.BANANA, Fruit.CHERRY];
	passed &= enum_arr == [Fruit.BANANA, Fruit.CHERRY];
	// these next ones should cause type errors
	// [Fruit.APPLE, Taste.UMAMI]
	// [Fruit.APPLE, 1.0]
	// [Fruit.APPLE, 1]
	return passed;
}
bool test_pointer_array_literal() {
	bool passed = true;
	// @Incomplete
	return passed;
}
bool test_string_array_literal() {
	bool passed = true;
	// @Incomplete
	return passed;
}
bool test_struct_array_literal() {
	bool passed = true;
	struct Point {
		float x;
		float y;
	}
	Point[2] point_arr;
	passed &= point_arr == [{x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}];
	/*
	point_arr = [{x: 1.0, y: 2.0}, {x: 3.0, y: 4.0}];
	passed &= point_arr == [{x: 1.0, y: 2.0}, {x: 3.0, y: 4.0}];
	point_arr = [{x: 1.0, y: 2.0}, {y: 3.0, x: 4.0}];
	passed &= point_arr == [{x: 1.0, y: 2.0}, {x: 4.0, x: 3.0}];
	// for arrays, the order matters
	passed &= point_arr != [{x: 3.0, y: 4.0}, {x: 1.0, y: 2.0}];
	// these next ones should cause type errors
	// [{x: 1.0, y: 2.0}, {x: 3, y: 4.0}]
	// [{x: 1.0, y: 2.0}, {x: 3}]
	*/
	return passed;
}
bool test_array_literal() {
	bool passed = true;
	passed &= test_int_array_literal();
	passed &= test_enum_array_literal();
	// @Incomplete
	// nocheckin
	// does this even make sense?
	// passed &= test_pointer_array_literal();
	// @Incomplete
	// nocheckin
	// passed &= test_string_array_literal();
	passed &= test_struct_array_literal();
	return passed;
}
bool test_simple_struct_literal() {
	bool passed = true;
	struct Point {
		float x;
		float y;
	}
	Point p;
	passed &= p.x == 0.0;
	passed &= p.y == 0.0;
	p = {x: 1.0, y: 2.0};
	passed &= p.x == 1.0;
	passed &= p.y == 2.0;
	// the order should not matter
	p = {y: 3.0, x: 4.0};
	passed &= p == {x: 4.0, y: 3.0};
	return passed;
}
bool test_complex_struct_literal() {
	bool passed = true;
	struct Triangle {
		float[3] side_lengths;
		float circumference;
	}
	Triangle t;
	// @Incomplete
	// nocheckin
	// should allow side_lengths: [0, 0, 0]
	passed &= t == {side_lengths: [0.0, 0.0, 0.0], circumference: 0.0}
	t = {side_lengths: [3.0, 4.0, 5.0], circumference: 12.0};
	passed &= t == {side_lengths: [3.0, 4.0, 5.0], circumference: 12.0};
	// the order should not matter
	t = {circumference: 12.0, side_lengths: [5.0, 4.0, 3.0]};
	passed &= t == {side_lengths: [5.0, 4.0, 3.0], circumference: 12.0};
	return passed;
}
bool test_struct_literal() {
	bool passed = true;
	passed &= test_simple_struct_literal();
	passed &= test_complex_struct_literal();
	return passed;
}
bool test_literals() {
	bool passed = true;
	passed &= test_array_literal();
	passed &= test_struct_literal();
	return passed;
}
bool test_unary_minus() {
	bool passed = true;
	int n = 1;
	passed &= -n == -1;
	return passed;
}
bool test_unary_not() {
	bool passed = true;
	bool n = true;
	passed &= !n == false;
	return passed;
}
bool test_unary() {
	bool passed = true;
	passed &= test_unary_minus();
	passed &= test_unary_not();
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
bool test_cast_primitives() {
	bool passed = true;
	int steel = 42;
	float flint = cast(float) steel;
	passed &= flint == 42.0;
	flint = cast(float) 12;
	passed &= flint == 12.0;
	flint = 12.3;
	steel = cast(int) flint;
	passed &= steel == 12.0;
	return passed;
}
bool test_cast_array() {
	bool passed = true;
	int[3] arr;
	float[3] arr2;
	arr[0] = 1;
	arr[1] = 2;
	arr[2] = 3;
	arr2 = cast(float[3]) arr;
	passed &= arr2[0] == 1.0;
	passed &= arr2[1] == 2.0;
	passed &= arr2[2] == 3.0;
	arr2[0] = 11.1;
	arr2[1] = 22.4;
	arr2[2] = 33.9;
	arr = cast(int[3]) arr2;
	passed &= arr[0] == 11;
	passed &= arr[1] == 22;
	passed &= arr[2] == 33;
	size_t[3] arr3;
	arr3 = cast(size_t[3]) arr;
	passed &= arr3[0] == 11;
	passed &= arr3[1] == 22;
	passed &= arr3[2] == 33;
	return passed;
}
// @Incomplete
bool test_cast_struct() {
	bool passed = false;
	return passed;
}
bool test_cast() {
	bool passed = true;
	passed &= test_cast_primitives();
	// passed &= test_cast_array();
	passed &= test_cast_struct();
	return passed;
}
/*
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
*/
/*
bool test_malloc_free() {
	bool passed = true;
	char* ptr = malloc(1);
	*ptr = 123;
	passed &= *ptr == 123;
	free(ptr);
	int* ptr2 = malloc(4);
	*ptr2 = 12345;
	passed &= *ptr2 == 12345;
	free(ptr2);
	return passed;
}
bool test_heap() {
	bool passed = true;
	for (int i = 0; i < 100; i += 1) {
		void* ptr  = malloc(1);
		free(ptr);
	}
	return passed;
}
*/
bool test_do_while() {
	bool passed = true;
	int n = 1;
	do {
		n += 1;
	} while (n < 1)
	passed &= n == 2;
	return passed;
}
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
void main() {
	test_primitives();
	test_enum();
	test_enum_flags();
	test_array();
	test_struct();
	// test_pointer();
	// test_string();
	test_unary();
	// test_inc_dec();
	test_cast();
	test_literals();
	// test_string_malloc();
	// test_malloc_free();
	// test_heap();
	// test_dynamic_array();
	// test_do_while();
	// test_nested_loop();
}
`;

let wip_code = `// Work in Progress
main :: () {
	arr : [3] int;
	arr[0] = 1;
	arr[1] = 2;
	arr[2] = 3;
	arr = arr;
	// arr = [1, 2, 3];
	arr.count;
	/*
	sum : int;
	i : int = 0;
	while (i < 10) {
		sum += i;
		i += 1;
	}
	*/
	/*
	for 0..10 {
		sum += it;
	}
	*/
	/*
	arr : [3] int;
	arr = [1, 2, 3];
	for arr {
		it;
	}
	*/
}
`;
// code = test_code;
// code = wip_code;

let temp_code = `
movement :: () {
	a :: 1;
	b :: 2;
	c :: 3;
	d :: 4;
}
values :: () {
	a :: 8;
	b :: 69;
	c :: 420;
	d :: a + b + c;
}
math :: () {
	foo := 1 + 1;
	foo = foo * foo - foo;
	foo = (foo / foo) * (foo * foo - foo);
	bar :: foo * foo * foo * foo;
}
if_else :: () {
	variable := 2;
	if variable < 42 {
		variable += 42 - variable;
	}
	else {
		this  :: 1;
		code  :: 2;
		is    :: 3;
		not   :: 4;
		shown :: 5;
	}
	if variable != 42 {
		variable -= 42;
	}
	else {
		variable += 8;
	}
	variable = variable - variable;
}
square :: (number: int) -> int {
	if number < 3 {
		number = number;
	}
	else if number == 3 {
		number = number * number - number * 2;
	}
	return number * number;
}
loops :: (max_num: int) {
	i : int = 1;
	sum : int = 0;
	while (i <= max_num) {
		sum += square(i);
		i += 1;
	}
	sum = sum;
}
bookmarks :: () {
	shrek := 0;
	fiona := 0;
	donkey := 0;
	farquaad := 666;
	happy := false;
	if (donkey <= 0) {
		donkey = 42;
		shrek -= 3;
	}
	if (farquaad > fiona) {
		farquaad *= 16;
		fiona -= 11;
	}
	if (shrek < farquaad && farquaad > 9000) {
		shrek += 10;
		donkey += 50;
	}
	if (shrek > 6 && donkey > 12) {
		fiona += 32;
		shrek *= 4;
	}
	if (shrek > 24 && fiona == 21) {
		farquaad = 0;
		donkey *= 2;
		happy = true;
	}
	if (happy) {
		shrek = 420;
		fiona = 69;
		donkey = 42;
		farquaad = 0;
	}
}
the_end :: () {
	fin :: true;
}
main :: () {
	movement();
	help :: 42;
	values();
	math();
	if_else();
	loops(3);
	bookmarks();
	the_end();
}
`;
code = temp_code;

let User_Block;
let main_call;

const Tree_View_Modes = {
	values_shown: false,
	lhs_values_shown: false,
	elements_shown: true,
	loop_cycles_shown: false,
	bookmark_text_inline: false,
	expand_all: false,
}
function make_tree_view_modes() {
	let view_modes = Object.assign({}, Tree_View_Modes);
	return view_modes;
}
let tree_view_modes = make_tree_view_modes();
function save_tree_view_modes() {
	window.localStorage.setItem("tree_view_modes", JSON.stringify(tree_view_modes));
}
function reset_tree_view_modes() {
	window.localStorage.removeItem("tree_view_modes");
}
function init_tree_view_modes() {
	let stored_tree_view_modes = window.localStorage.getItem("tree_view_modes");
	if (!stored_tree_view_modes) {
		save_tree_view_modes();
	}
	else {
		tree_view_modes = JSON.parse(stored_tree_view_modes);
	}
}
const Tree_View_State = {
	cursor_index: 0,
	cursor_stack: null,
	node: null,
	current_line: 0,
	current_column_index: 0,
};
function make_tree_view_state() {
	let view_state = Object.assign({}, Tree_View_State);
	return view_state;
}
let run_tree_view_state = make_tree_view_state();
function save_run_tree_view_state() {
	// the cursor stack is big, so we don't store it
	let temp_cursor_stack = run_tree_view_state.cursor_stack;
	run_tree_view_state.cursor_stack = null;
	// same with this
	let temp_map_line_number_to_cursor_indexes = run_tree_view_state.map_line_number_to_cursor_indexes;
	run_tree_view_state.map_line_number_to_cursor_indexes = null;
	// and this
	let temp_node = run_tree_view_state.node;
	run_tree_view_state.node = null;
	window.localStorage.setItem("run_tree_view_state", JSON.stringify(run_tree_view_state));
	run_tree_view_state.cursor_stack = temp_cursor_stack;
	run_tree_view_state.map_line_number_to_cursor_indexes = temp_map_line_number_to_cursor_indexes;
	run_tree_view_state.node = temp_node;
}
function reset_run_tree_view_state() {
	window.localStorage.removeItem("run_tree_view_state");
}
function init_run_tree_view_state() {
	let stored_run_tree_view_state = window.localStorage.getItem("run_tree_view_state");
	if (!stored_run_tree_view_state) {
		window.localStorage.setItem("run_tree_view_state", JSON.stringify(run_tree_view_state));
	}
	else {
		run_tree_view_state = JSON.parse(stored_run_tree_view_state);
	}
}
function save_user_progress() {
	window.localStorage.setItem("unlocked_abilities", JSON.stringify(unlocked_abilities));
	window.localStorage.setItem("bookmark_layers", JSON.stringify(bookmark_layers));
}
function reset_user_progress() {
	window.localStorage.removeItem("unlocked_abilities");
	window.localStorage.removeItem("bookmark_layers");
}
function init_user_progress() {
	let stored_unlocked_abilities = window.localStorage.getItem("unlocked_abilities");
	if (!stored_unlocked_abilities) {
		window.localStorage.setItem("unlocked_abilities", JSON.stringify(unlocked_abilities));
	}
	else {
		unlocked_abilities = JSON.parse(stored_unlocked_abilities);
	}
	let stored_bookmark_layers = window.localStorage.getItem("bookmark_layers");
	if (!stored_bookmark_layers) {
		window.localStorage.setItem("bookmark_layers", JSON.stringify(bookmark_layers));
	}
	else {
		bookmark_layers = JSON.parse(stored_bookmark_layers);
	}
}

let ab_test = false;
let developer_controls_shown = false;
let visible_token_nodes = null;

// nocheckin
// this should be a toggle
// we have to change update_code for that
let implicit_call_block = false;

let mouse_style_gui_elem;
let wrap_grid_gui_elem;
let wrap_top_gui_elem;
let timeline_gui_elem;
let bookmark_text_gui_elem;
let bookmark_text_input_gui_elem;
let code_gui_elem;
let run_tree_gui_elem;
let cursor_gui_elem;
let controls_gui_elem;
let source_gui_elem;
let run_gui_elem;
let reset_gui_elem;
let status_gui_elem;
let error_gui_elem;
let wrap_error_gui_elem;

let canvas_elem = null;
let render_target = null;

// nocheckin
// move execution and rendering to separate files

let dummy_token_node = null;
let dummy_width = null;
let dummy_height = null;

function main() {
	mouse_style_gui_elem = document.getElementById("mouse-style");
	wrap_grid_gui_elem = document.getElementById("wrap-grid");
	wrap_top_gui_elem = document.getElementById("wrap-top");
	timeline_gui_elem = document.getElementById("timeline");
	bookmark_text_gui_elem = document.getElementById("bookmark-text");
	bookmark_text_input_gui_elem = document.getElementById("bookmark-text-input");
	code_gui_elem = document.getElementById("code");
	run_tree_gui_elem = document.getElementById("syntax-tree");
	cursor_gui_elem = document.getElementById("cursor");
	controls_gui_elem = document.getElementById("controls");
	source_gui_elem = document.getElementById("source");
	run_gui_elem = document.getElementById("run");
	reset_gui_elem = document.getElementById("reset");
	status_gui_elem = document.getElementById("status");
	error_gui_elem = document.getElementById("error");
	wrap_error_gui_elem = document.getElementById("wrap-error");
	window.onerror = unhandled_error_handler;
	window.addEventListener("error", unhandled_error);
	code_gui_elem.focus();
	canvas_elem = document.createElement("canvas");
	run_tree_gui_elem.appendChild(canvas_elem);
	render_target = code_gui_elem;
	render_target.style.tabSize = indent_tab_size;
	render_target.style.opacity = "0";
	{
		let dummy_text = document.createTextNode("M");
		dummy_token_node = document.createElement("token");
		dummy_token_node.appendChild(dummy_text);
		dummy_token_node.style.opacity = "0";
		run_tree_gui_elem.appendChild(dummy_token_node);
	}
	map_controls();
	init_text();
	init_sounds();
	// for some reason, if we call start_debugging directly
	// it sometimes sets dummy_width and dummy_height to the wrong value
	// which causes visual glitches at the start, but it gets fixed after the user interacts
	window.setTimeout(start_debugging, 20);
}

function unhandled_error(event) {
	let message = event.message;
	if (event.error != null) {
		message = event.error.message;
	}
	unhandled_error_handler(message);
}
function unhandled_error_handler(message, file, line, col, error) {
	status_gui_elem.style.color = "hsla(0, 50%, 60%, 0.9)";
	set_status("Internal error");
	set_error(message);
}
function set_error(str) {
	error_gui_elem.style.color = "hsla(0, 50%, 60%, 0.9)";
	error_gui_elem.innerHTML = "";
	error_gui_elem.appendChild(document.createTextNode(str));
}
function set_status(str) {
	status_gui_elem.innerHTML = "";
	status_gui_elem.appendChild(document.createTextNode(str));
}

function init_text() {
	let in_tutorial = false;
	let stored_code = window.localStorage.getItem("code");
	if (!stored_code) {
		window.localStorage.setItem("code", code);
		in_tutorial = true;
	}
	else {
		if (code == stored_code) {
			in_tutorial = true;
		}
		code = stored_code;
	}
	if (in_tutorial) {
		populate_tutorial_bookmarks();
	}
	else {
		god_mode = true;
		bookmark_layers[0] = new Array();
		save_user_progress();
	}
	source_gui_elem.value = code;
	let file = parse_text(code);
	User_Block = file.global_block;
	User_Block.base.enclosing_scope = Stdlib_Block.delimited.scope;
	Stdlib_Block.delimited.is_implicit = true;
	Stdlib_Block.base.was_generated = true;
	let global_scope = make_scope();
	Stdlib_Block.base.enclosing_scope = global_scope;
	infer(Stdlib_Block);
	infer(User_Block);
	let main_decl = infer_decl_of_name_in_scope("main", User_Block.delimited.scope);
	if (!main_decl) {
		throw Error("declaration of 'main' was not found");
	}
	if (main_decl.expression.base.kind != Code_Kind.PROCEDURE_DEFINITION) {
		throw Error("'main' must be a procedure");
	}
	let main_ident = clone(main_decl.ident);
	main_call = make_call(main_ident, null);
	main_call.base.type = Types.void;
	let main_call_stmt = make_statement(main_call);
	main_call_stmt.base.file = main_ident.base.file;
	User_Block.delimited.elements.push(main_call_stmt);
	infer(User_Block);
	fill_rodata();
}
function save_code(text) {
	window.localStorage.setItem("code", text);
}
function reset_code() {
	window.localStorage.removeItem("code");
}
function populate_tutorial_bookmarks() {
	{
		let dummy_bookmark = make_bookmark(0, 0, "Press X to move forward\nand Z to move backward");
		// nocheckin
		// @Incomplete
		// check this to step_prev and step_next
		dummy_bookmark.unlocks = ["move_basic"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(2, 0, "Follow the red blinking lights, Neo");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(6, 0, "Press WASD to move between lines");
		dummy_bookmark.unlocks = ["move_line"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(11, 0, "Press X two times to enter the next call");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(20, 0, "Press F to replace variable names with their values");
		dummy_bookmark.unlocks = ["show_values"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(24, 0, "Make sure you find all the blinking lights \nSome of them are well hidden");
		dummy_bookmark.unlocks = ["show_values"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(28, 0, "Press E to show math results\n(if it doesn't work, press F to show values and then press E)");
		dummy_bookmark.unlocks = ["show_elements"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(48, 0, "Press X to move through the math, and see the result of every step\n(if it doesn't work, press E until elements are not shown)");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(63, 0, "Press H to jump to previous change\nPress J to jump to next change");
		dummy_bookmark.unlocks = ["move_change"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(72, 0, "Press Y to jump to previous use\nPress U to jump to next use");
		dummy_bookmark.unlocks = ["move_use"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(74, 0, "Only the code that was executed is shown, like the code in that else statement\nThe code that didn't run is hidden, like the content of that if statement");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(78, 0, "Getting close to the end, only a few more things to learn!\n(this is all very useful, I promise)");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(82, 0, "Press Q to expand a loop and see all the iterations\n");
		dummy_bookmark.unlocks = ["expand_loop"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(87, 0, "Move into this call by pressing X\n");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(94, 0, "Press M to jump to the next time this code ran\n");
		dummy_bookmark.unlocks = ["move_clone"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(113, 0, "Press N to jump to the previous time this code was executed\n(you can also press F and E for fun)");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(116, 0, "Press M to jump to the third iteration\n");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(125, 0, "Press Q to collapse the loop and show only the current iteration \nand then press N and M to move between all the iterations");
		dummy_bookmark.unlocks = ["expand_loop"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(153, 0, "Press Q until the loop is not expanded, \nand then press W to skip all the iterations\n");
		dummy_bookmark.unlocks = ["expand_loop"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(157, 0, "Congratulations on getting this far! \nNow you will see how all this is useful!");
		dummy_bookmark.unlocks = ["bookmark"];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(165, 0, "Press J to find out where this variable changes next\n");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(206, 0, "Check out all the changes and uses of `shrek` first (and maybe add some bookmarks)\nand then do the same with `fiona`, until you understand what makes us happy");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(203, 0, "Press K to create your own blinking lights (they're called bookmarks BTW)\nand then press I and O to move between them (press K again to kill the lights)");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(214, 0, "Okay nice, we are happy. But why?\nMove onto `shrek` and press HJ / YU to find out");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}

	{
		let dummy_bookmark = make_bookmark(227, 0, "You have reached The End. Press G to activate God Mode (no restrictions) \nPress Ctrl + Q to open Developer Mode, and write your own code, if you dare");
		dummy_bookmark.unlocks = [];
		bookmark_layers[0].push(dummy_bookmark);
	}
}

function map_controls() {
	document.addEventListener("keydown", document_keydown);
	document.addEventListener("keyup", document_keyup);
	document.addEventListener("mousedown", document_mousedown);
	document.addEventListener("mousemove", document_mousemove);
	document.addEventListener("mouseup", document_mouseup);
	source_gui_elem.addEventListener("mouseup", source_gui_elem_mouseup);
	run_tree_gui_elem.addEventListener("mouseup", run_tree_gui_elem_mouseup);
	run_gui_elem.addEventListener("mouseup", run_gui_elem_mouseup);
	reset_gui_elem.addEventListener("mouseup", reset_gui_elem_mouseup);
}
function source_gui_elem_mouseup(event) {
	source_gui_elem.is_focused = true;
	run_tree_gui_elem.is_focused = false;
}
function run_tree_gui_elem_mouseup(event) {
	source_gui_elem.is_focused = false;
	run_tree_gui_elem.is_focused = true;
}
function run_gui_elem_mouseup(event) {
	save_code(source_gui_elem.value);
	location.reload();
}
function reset_gui_elem_mouseup(event) {
	reset_code();
	reset_user_progress();
	reset_tree_view_modes();
	reset_run_tree_view_state();
	location.reload();
}

let instant_scroll = true;
function document_keyup(event) {
	instant_scroll = true;
}

function document_keydown(event) {
	let prevent_default = true;
	// @Cleanup
	// we need this for stupid browser reasons
	can_play_sounds = true;

	// press Ctrl + F5
	if (event.keyCode == 116 && event.ctrlKey) {
		reset_gui_elem_mouseup(event);
	}
	// press F5
	else if (event.keyCode == 116) {
		run_gui_elem_mouseup(event);
	}

	if (source_gui_elem.is_focused) {
		if (event.key == "Tab") {
			event.preventDefault();
			const tab = "\t";
			const spaces = " ".repeat(4);
			const insertion = tab;
			document.execCommand('insertText', false, insertion);
			return;
		}
		if (event.key == "Enter") {
			// @Incomplete
			// should read the starting whitespace of the last line and insert them
		}
	}
	if (bookmark_text_menu.active) {
		if (event.key == "Enter" && event.shiftKey == false) {
			exit_bookmark_text_menu();
			event.preventDefault();
		}
	}
	if (run_tree_gui_elem.is_focused == false) {
		return;
	}

	// press Ctrl + Z
	if (event.keyCode == 90 && event.ctrlKey) {
		undo();
	}

	// press Z
	else if (event.keyCode == 90) {
		step_prev();
	}

	// press Ctrl + X
	if (event.keyCode == 88 && event.ctrlKey) {
		redo();
	}

	// press X
	else if (event.keyCode == 88) {
		step_next();
	}

	// press W
	else if (event.keyCode == 87) {
		up_line();
	}

	// press Ctrl + S
	else if (event.keyCode == 83 && event.ctrlKey) {
		// free
	}

	// press S
	else if (event.keyCode == 83) {
		down_line();
	}

	// press Shift + A
	else if (event.keyCode == 65 && event.shiftKey) {
		start_line();
	}

	// press Shift + D
	else if (event.keyCode == 68 && event.shiftKey) {
		end_line();
	}

	// press A
	else if (event.keyCode == 65) {
		left_line();
	}

	// press D
	else if (event.keyCode == 68) {
		right_line();
	}

	// press Shift + Y
	else if (event.keyCode == 89 && event.shiftKey) {
		first_use();
	}

	// press Shift + U
	else if (event.keyCode == 85 && event.shiftKey) {
		last_use();
	}

	// press Y
	else if (event.keyCode == 89) {
		prev_use();
	}

	// press U
	else if (event.keyCode == 85) {
		next_use();
	}

	// press Shift + H
	else if (event.keyCode == 72 && event.shiftKey) {
		first_change();
	}

	// press Shift + J
	else if (event.keyCode == 74 && event.shiftKey) {
		last_change();
	}

	// press H
	else if (event.keyCode == 72) {
		prev_change();
	}

	// press J
	else if (event.keyCode == 74) {
		next_change();
	}

	// press Shift + N
	else if (event.keyCode == 78 && event.shiftKey) {
		first_clone();
	}

	// press Shift + M
	else if (event.keyCode == 77 && event.shiftKey) {
		last_clone();
	}

	// press N
	else if (event.keyCode == 78) {
		prev_clone();
	}

	// press M
	else if (event.keyCode == 77) {
		next_clone();
	}

	// press Ctrl + I
	else if (event.keyCode == 73 && event.ctrlKey) {
		prev_call();
	}

	// press Ctrl + O
	else if (event.keyCode == 79 && event.ctrlKey) {
		next_call();
	}

	// press Shift + I
	else if (event.keyCode == 73 && event.shiftKey) {
		first_bookmark();
	}

	// press Shift + O
	else if (event.keyCode == 79 && event.shiftKey) {
		last_bookmark();
	}

	// press I
	else if (event.keyCode == 73) {
		prev_bookmark();
	}

	// press O
	else if (event.keyCode == 79) {
		next_bookmark();
	}

	// press K
	else if (event.keyCode == 75) {
		toggle_bookmark();
	}

	// press L
	else if (event.keyCode == 76) {
		enter_bookmark_text_menu();
	}
	// press Ctrl + L
	else if (event.keyCode == 76 && event.ctrlKey) {
		toggle_bookmark_text_inline();
	}

	// press R
	else if (event.keyCode == 82) {
		// free
		// nocheckin
		// simulate bug
		ab_test = !ab_test;
		need_update = true;
	}

	// press T
	else if (event.keyCode == 84) {
		// free
	}

	// press Shift + F
	else if (event.keyCode == 70 && event.shiftKey) {
		toggle_lhs_values_shown();
	}

	// press F
	else if (event.keyCode == 70) {
		toggle_values_shown();
	}

	// press E
	else if (event.keyCode == 69) {
		toggle_elements_shown();
	}

	// press G
	else if (event.keyCode == 71) {
		toggle_god_mode();
	}

	// press Ctrl + Q
	else if (event.keyCode == 81 && event.ctrlKey) {
		toggle_developer_controls();
		// toggle_sync_source_and_execution_tree();
	}

	// press Q
	else if (event.keyCode == 81) {
		toggle_loop_cycles_shown();
	}

	// press C
	else if (event.keyCode == 67) {
		// toggle_cursor_menu();
	}

	// press P
	else if (event.keyCode == 80) {
		toggle_expand_all();
	}

	// press B
	else if (event.keyCode == 66) {
		// toggle_bookmark_menu();
	}

	// press T
	else if (event.keyCode == 84) {
		// toggle_memory_view();
	}
	else {
		prevent_default = false;
	}

	// nocheckin
	// pressing a number key executes the registered quick command
	// 1 :: benny_test
	// we can also have a version that shows each graphics frame in realtime
	// by pressing Space

	// @Incomplete
	// if show_bookmark_menu
	// then toggle the visibility of the bookmark
	let number = event.keyCode - 48;
	if (number >= 0 && number <= 9) {
		if (event.shiftKey) {
			selected_bookmark_layer = number;
			need_update = true;
		}
	}
	instant_scroll = true;
	if (prevent_default) {
		event.preventDefault();
	}
}
function toggle_values_shown() {
	if (user_has_unlocked_ability("show_values") == false) {
		trigger_cursor_error();
		return;
	}
	tree_view_modes.values_shown = !tree_view_modes.values_shown;
	need_update = true;
	if (tree_view_modes.values_shown == true) {
		play_mode_up_sound();
	}
	else {
		play_mode_down_sound();
	}
}
function toggle_lhs_values_shown() {
	tree_view_modes.lhs_values_shown = !tree_view_modes.lhs_values_shown;
	need_update = true;
	if (tree_view_modes.lhs_values_shown == true) {
		play_mode_up_sound();
	}
	else {
		play_mode_down_sound();
	}
}
function toggle_elements_shown() {
	if (user_has_unlocked_ability("show_elements") == false) {
		trigger_cursor_error();
		return;
	}
	if (tree_view_modes.values_shown == false) {
		trigger_cursor_error();
		return;
	}
	tree_view_modes.elements_shown = !tree_view_modes.elements_shown;
	need_update = true;
	if (tree_view_modes.elements_shown == true) {
		play_mode_up_sound();
	}
	else {
		play_mode_down_sound();
	}
}
function toggle_loop_cycles_shown() {
	if (user_has_unlocked_ability("expand_loop") == false) {
		trigger_cursor_error();
		return;
	}
	tree_view_modes.loop_cycles_shown = !tree_view_modes.loop_cycles_shown;
	need_update = true;
}
function toggle_bookmark_text_inline() {
	tree_view_modes.bookmark_text_inline = !tree_view_modes.bookmark_text_inline;
	need_update = true;
	if (tree_view_modes.bookmark_text_inline == true) {
		play_mode_up_sound();
	}
	else {
		play_mode_down_sound();
	}
}
function toggle_expand_all() {
	tree_view_modes.expand_all = !tree_view_modes.expand_all;
	need_update = true;
	if (tree_view_modes.expand_all) {
		play_expand_sound();
	}
	else {
		play_collapse_sound();
	}
}
function toggle_god_mode() {
	god_mode = !god_mode;
}
function toggle_developer_controls() {
	developer_controls_shown = !developer_controls_shown;
	need_update = true;
}

function step_prev() {
	let valid = true;
	if (context.view_state.cursor_index > 0) {
		let cursor_index = context.view_state.cursor_index - 1;
		change_cursor_position_with_undo(cursor_index);
	}
	else {
		valid = false;
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function step_next() {
	let valid = true;
	if (context.view_state.cursor_index < context.view_state.cursor_stack.length-1) {
		let cursor_index = context.view_state.cursor_index + 1;
		change_cursor_position_with_undo(cursor_index);
	}
	else {
		valid = false;
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function up_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = false;
	let cursor_index = -1;
	while (true) {
		if (context.view_state.current_line == 0) {
			break;
		}
		context.view_state.current_line -= 1;
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		if (indexes.length > 0) {
			valid = user_has_unlocked_ability("move_line");
			if (valid) {
				if (context.view_state.current_column_index >= indexes.length) {
					context.view_state.current_column_index = indexes.length-1;
				}
				cursor_index = indexes[context.view_state.current_column_index];
				change_cursor_position_with_undo(cursor_index);
			}
			break;
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function down_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = false;
	while (true) {
		if (context.view_state.current_line == map_line_number_to_cursor_indexes.length-1) {
			break;
		}
		context.view_state.current_line += 1;
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		if (indexes.length > 0) {
			valid = user_has_unlocked_ability("move_line");
			if (valid) {
				if (context.view_state.current_column_index >= indexes.length) {
					context.view_state.current_column_index = indexes.length-1;
				}
				let cursor_index = indexes[context.view_state.current_column_index];
				change_cursor_position_with_undo(cursor_index);
			}
			break;
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function start_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = user_has_unlocked_ability("move_line");
	if (valid) {
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		valid = context.view_state.current_column_index > 0;
		if (valid) {
			context.view_state.current_column_index = 0;
			let cursor_index = indexes[context.view_state.current_column_index];
			change_cursor_position_with_undo(cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function end_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = user_has_unlocked_ability("move_line");
	if (valid) {
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		valid = context.view_state.current_column_index < indexes.length-1;
		if (valid) {
			context.view_state.current_column_index = indexes.length-1;
			let cursor_index = indexes[context.view_state.current_column_index];
			change_cursor_position_with_undo(cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function left_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = user_has_unlocked_ability("move_line");
	if (valid) {
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		if (context.view_state.current_column_index > 0) {
			context.view_state.current_column_index -= 1;
			let cursor_index = indexes[context.view_state.current_column_index];
			change_cursor_position_with_undo(cursor_index);
		}
		else {
			valid = false;
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function right_line() {
	let map_line_number_to_cursor_indexes = context.view_state.map_line_number_to_cursor_indexes;
	let valid = user_has_unlocked_ability("move_line");
	if (valid) {
		let indexes = map_line_number_to_cursor_indexes[context.view_state.current_line];
		if (context.view_state.current_column_index < indexes.length-1) {
			context.view_state.current_column_index += 1;
			let cursor_index = indexes[context.view_state.current_column_index];
			change_cursor_position_with_undo(cursor_index);
		}
		else {
			valid = false;
		}
	}
	if (valid) {
		need_update = true;
		play_move_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function get_access_indexes(memory_accesses) {
	// @Cleanup
	// @Speed
	let address = context.view_state.node.base.pointer;
	let declaration = null;
	if (context.view_state.node.base.kind == Code_Kind.IDENT) {
		declaration = context.view_state.node.declaration;
	}
	let size = context.view_state.node.base.type.base.size_in_bytes;
	let accesses = filter_memory_accesses(memory_accesses, address, size, declaration);
	accesses.sort((a, b) => a.cursor_index > b.cursor_index);
	let indexes = accesses.map(a => a.cursor_index);
	return indexes;
}
function first_use() {
	if (user_has_unlocked_ability("move_use") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_uses.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		if (indexes.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function last_use() {
	if (user_has_unlocked_ability("move_use") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_uses.slice();
		let indexes = get_access_indexes(copy);
		let index = indexes.length-1;
		if (indexes.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function prev_use() {
	if (user_has_unlocked_ability("move_use") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_uses.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		({ index, valid } = find_prev_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function next_use() {
	if (user_has_unlocked_ability("move_use") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_uses.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		({ index, valid } = find_next_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function first_change() {
	if (user_has_unlocked_ability("move_change") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_changes.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		if (indexes.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function last_change() {
	if (user_has_unlocked_ability("move_change") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_changes.slice();
		let indexes = get_access_indexes(copy);
		let index = indexes.length-1;
		if (indexes.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function prev_change() {
	if (user_has_unlocked_ability("move_change") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_changes.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		({ index, valid } = find_prev_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function next_change() {
	if (user_has_unlocked_ability("move_change") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	valid &= context.view_state.node.base.pointer >= 0;
	if (valid) {
		let copy = context.run_state.memory_changes.slice();
		let indexes = get_access_indexes(copy);
		let index = 0;
		({ index, valid } = find_next_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function first_clone() {
	if (user_has_unlocked_ability("move_clone") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	let map_original_to_indexes = context.run_state.map_original_to_indexes;
	let original = get_original(context.view_state.node);
	let indexes = map_original_to_indexes.get(original);
	let index = 0;
	if (indexes.length == 0) {
		valid = false;
	}
	if (valid) {
		change_cursor_position_with_undo(indexes[index]);
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function last_clone() {
	if (user_has_unlocked_ability("move_clone") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	let map_original_to_indexes = context.run_state.map_original_to_indexes;
	let original = get_original(context.view_state.node);
	let indexes = map_original_to_indexes.get(original);
	let index = indexes.length-1;
	if (indexes.length == 0) {
		valid = false;
	}
	if (valid) {
		change_cursor_position_with_undo(indexes[index]);
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function prev_clone() {
	if (user_has_unlocked_ability("move_clone") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	let map_original_to_indexes = context.run_state.map_original_to_indexes;
	let original = get_original(context.view_state.node);
	let indexes = map_original_to_indexes.get(original);
	let index = 0;
	({ index, valid } = find_prev_index_in_array(indexes, context.view_state.cursor_index));
	if (valid) {
		change_cursor_position_with_undo(indexes[index]);
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function next_clone() {
	if (user_has_unlocked_ability("move_clone") == false) {
		trigger_cursor_error();
		return;
	}
	let valid = true;
	let map_original_to_indexes = context.run_state.map_original_to_indexes;
	let original = get_original(context.view_state.node);
	let indexes = map_original_to_indexes.get(original);
	let index = 0;
	({ index, valid } = find_next_index_in_array(indexes, context.view_state.cursor_index));
	if (valid) {
		change_cursor_position_with_undo(indexes[index]);
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function first_bookmark() {
	let valid = true;
	let bookmarks = get_selected_bookmarks();
	valid &= bookmarks.length > 0;
	if (valid) {
		let index = 0;
		if (bookmarks.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(bookmarks[index].cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function last_bookmark() {
	let valid = true;
	let bookmarks = get_selected_bookmarks();
	valid &= bookmarks.length > 0;
	if (valid) {
		let index = bookmarks.length-1;
		if (bookmarks.length == 0) {
			valid = false;
		}
		if (valid) {
			change_cursor_position_with_undo(bookmarks[index].cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function prev_bookmark() {
	let valid = true;
	let bookmarks = get_selected_bookmarks();
	valid &= bookmarks.length > 0;
	if (valid) {
		let index = 0;
		({ index, valid } = bookmark_array_find_prev_index(bookmarks, run_tree_view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(bookmarks[index].cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function next_bookmark() {
	let valid = true;
	let bookmarks = get_selected_bookmarks();
	valid &= bookmarks.length > 0;
	if (valid) {
		let index = 0;
		({ index, valid } = bookmark_array_find_next_index(bookmarks, run_tree_view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(bookmarks[index].cursor_index);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function prev_call() {
	let valid = true;
	let calls = context.run_state.procedure_calls;
	valid &= calls.length > 0;
	if (valid) {
		let indexes = calls.map(a => a.cursor_index);
		let index = 0;
		({ index, valid } = find_prev_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "left";
		trigger_cursor_error();
	}
}
function next_call() {
	let valid = true;
	let calls = context.run_state.procedure_calls;
	valid &= calls.length > 0;
	if (valid) {
		// :curr
		// we need to get call.cursor_index_at_end
		// from call.cursor_index_at_begin
		// we could just add those properties to everything
		// and then loop over all the nodes
		// and reconstruct the cursor stack and call stack
		// and set node.cursor_index based on the position in cursor_stack
		let indexes = calls.map(a => a.cursor_index_at_begin);
		let index = 0;
		({ index, valid } = find_next_index_in_array(indexes, context.view_state.cursor_index));
		if (valid) {
			change_cursor_position_with_undo(indexes[index]);
		}
	}
	if (valid) {
		need_update = true;
		play_jump_sound();
	}
	else {
		run_cursor.error_animation.direction = "right";
		trigger_cursor_error();
	}
}
function toggle_bookmark() {
	let bookmarks = bookmark_layers[selected_bookmark_layer];
	if (bookmark_array_has_index(bookmarks, run_tree_view_state.cursor_index)) {
		delete_bookmark();
	}
	else {
		add_bookmark();
	}
}
function add_bookmark() {
	if (user_has_unlocked_ability("bookmark") == false) {
		trigger_cursor_error();
		return;
	}
	let bookmarks = bookmark_layers[selected_bookmark_layer];
	if (bookmark_array_has_index(bookmarks, run_tree_view_state.cursor_index)) {
		return;
	}
	// insertion sort
	let index = 0;
	while (index < bookmarks.length) {
		if (bookmarks[index].cursor_index > run_tree_view_state.cursor_index) {
			break;
		}
		index += 1;
	}
	let bookmark = make_bookmark(run_tree_view_state.cursor_index, selected_bookmark_layer, null);
	bookmarks.splice(index, 0, bookmark);
	need_update = true;
	play_bookmark_add_sound();
}
function delete_bookmark() {
	if (user_has_unlocked_ability("bookmark") == false) {
		trigger_cursor_error();
		return;
	}
	let bookmarks = bookmark_layers[selected_bookmark_layer];
	let find = bookmark_array_find(bookmarks, run_tree_view_state.cursor_index);
	if (find.found) {
		bookmarks.splice(find.index, 1);
		need_update = true;
		play_bookmark_remove_sound();
	}
}
function find_next_index_in_array(array, starting_index) {
	let valid = false;
	// @Speed
	let index = 0;
	while  (index < array.length) {
		if (array[index] > starting_index) {
			valid = true;
			break;
		}
		index += 1;
	}
	return { index, valid };
}
function find_prev_index_in_array(array, starting_index) {
	let valid = false;
	// @Speed
	let index = array.length-1;
	while (index >= 0) {
		if (array[index] < starting_index) {
			valid = true;
			break;
		}
		index -= 1;
	}
	return { index, valid };
}

let context = {
	run_state: null,
};

const Tree_Run_State = {
	block_stack: null,
	call_stack: null,
	loop_stack: null,
	cursor_stack: null,
	cursor_index: 0,
	stack_pointer: 0,
	memory_buffer: null,
	memory_view: null,
	heap_start: 0,
	heap_allocations: null,
	memory_uses: null,
	memory_changes: null,
	procedure_calls: null,
	map_original_to_indexes: null,
};
function make_tree_run_state() {
	let run_state = Object.assign({}, Tree_Run_State);
	run_state.block_stack = new Array();
	run_state.call_stack = new Array();
	run_state.loop_stack = new Array();
	run_state.cursor_stack = new Array();
	run_state.cursor_index = 0;
	run_state.stack_pointer = 16;
	run_state.memory_buffer = new ArrayBuffer(64 * 64 * 64);
	run_state.memory_view = new DataView(run_state.memory_buffer);
	run_state.heap_start = run_state.memory_buffer.byteLength / 2;
	run_state.heap_allocations = new Array();
	run_state.memory_uses = new Array();
	run_state.memory_changes = new Array();
	run_state.procedure_calls = new Array();
	run_state.map_original_to_indexes = new Map();
	return run_state;
}
let run_tree_run_state = make_tree_run_state();
function add_procedure_call(node) {
	node.cursor_index_at_begin = context.run_state.cursor_index;
	context.run_state.procedure_calls.push(node);
}
const Memory_Access = {
	cursor_index: -1,
	address: 0,
	size: 0,
	declaration: null,
};
function make_memory_access(cursor_index, address, size, declaration = null) {
	let memory_access = Object.assign({}, Memory_Access);
	memory_access.cursor_index = cursor_index;
	memory_access.address = address;
	memory_access.size = size;
	memory_access.declaration = declaration;
	return memory_access;
}
function add_memory_use(node, address, size, declaration = null) {
	if (node.base.kind == Code_Kind.IDENT) {
		declaration = node.declaration;
	}
	let memory_access = make_memory_access(node.cursor_index, address, size, declaration);
	context.run_state.memory_uses.push(memory_access);
	node.base.pointer = address;
}
function add_memory_change(node, address, size, declaration = null) {
	if (node.base.kind == Code_Kind.IDENT) {
		declaration = node.declaration;
	}
	let memory_access = make_memory_access(node.cursor_index, address, size, declaration);
	context.run_state.memory_changes.push(memory_access);
	node.base.pointer = address;
}
function filter_memory_accesses(memory_accesses, address, size, declaration = null) {
	function filter(a) {
		if (a.address != address) {
			return false;
		}
		if (a.size != size) {
			return false;
		}
		if (declaration != null && a.declaration != declaration) {
			return false;
		}
		return true;
	}
	return memory_accesses.filter(filter);
}
function get_memory(offset, type) {
	let memory_view = context.run_state.memory_view;
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.base.size_in_bytes == 1) {
			if (type.signed) {
				return memory_view.getInt8(offset);
			}
			else {
				return memory_view.getUint8(offset);
			}
		}
		else if (type.base.size_in_bytes == 2) {
			if (type.signed) {
				return memory_view.getInt16(offset);
			}
			else {
				return memory_view.getUint16(offset);
			}
		}
		else if (type.base.size_in_bytes == 4) {
			if (type.signed) {
				return memory_view.getInt32(offset);
			}
			else {
				return memory_view.getUint32(offset);
			}
		}
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.base.size_in_bytes == 4) {
			return memory_view.getFloat32(offset);
		}
		else if (type.base.size_in_bytes == 8) {
			return memory_view.getFloat64(offset);
		}
	}
	else if (type.base.kind == Type_Kind.BOOL) {
		if (memory_view.getUint8(offset) > 0) {
			return true;
		}
		else {
			return false;
		}
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		return get_memory(offset, Types.size_t);
	}
	else {
		throw Error;
	}
}
function set_memory(offset, type, value) {
	let memory_view = context.run_state.memory_view;
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.base.size_in_bytes == 1) {
			if (type.signed) {
				return memory_view.setInt8(offset, value);
			}
			else {
				return memory_view.setUint8(offset, value);
			}
		}
		else if (type.base.size_in_bytes == 2) {
			if (type.signed) {
				return memory_view.setInt16(offset, value);
			}
			else {
				return memory_view.setUint16(offset, value);
			}
		}
		else if (type.base.size_in_bytes == 4) {
			if (type.signed) {
				return memory_view.setInt32(offset, value);
			}
			else {
				return memory_view.setUint32(offset, value);
			}
		}
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.base.size_in_bytes == 4) {
			return memory_view.setFloat32(offset, value);
		}
		else if (type.base.size_in_bytes == 8) {
			return memory_view.setFloat64(offset, value);
		}
	}
	else if (type.base.kind == Type_Kind.BOOL) {
		if (value) {
			return memory_view.setUint8(offset, 1);
		}
		else {
			return memory_view.setUint8(offset, 0);
		}
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		return set_memory(offset, Types.size_t, value);
	}
	else {
		throw Error;
	}
}
function get_memory_bytes(offset, length) {
	let memory_view = context.run_state.memory_view;
	let array = new Array(length);
	for (let i = 0; i < length; i += 1) {
		array[i] = memory_view.getUint8(offset + i);
	}
	return array;
}
function set_memory_bytes(offset, length, array) {
	let memory_view = context.run_state.memory_view;
	for (let i = 0; i < length; i += 1) {
		memory_view.setUint8(offset + i, array[i]);
	}
}
function get_memory_string(offset, length) {
	let chars = get_memory_bytes(offset, length);
	let char_array = new Array(length);
	for (let i = 0; i < length; i += 1) {
		char_array[i] = String.fromCharCode(chars[i]);
	}
	return char_array.join("");
}
function set_memory_string(offset, str) {
	let bytes = new Array(str.length);
	for (let i = 0; i < str.length; i += 1) {
		bytes[i] = str.charCodeAt(i);
	}
	set_memory_bytes(offset, str.length, bytes);
}
function get_memory_node(offset, type) {
	let memory_view = context.run_state.memory_view;
	let result = null;
	if (type.base.kind == Type_Kind.INTEGER) {
		result = make_integer();
		if (type.base.size_in_bytes == 1) {
			if (type.signed) {
				result.value = memory_view.getInt8(offset);
			}
			else {
				result.value = memory_view.getUint8(offset);
			}
		}
		else if (type.base.size_in_bytes == 2) {
			if (type.signed) {
				result.value = memory_view.getInt16(offset);
			}
			else {
				result.value = memory_view.getUint16(offset);
			}
		}
		else if (type.base.size_in_bytes == 4) {
			if (type.signed) {
				result.value = memory_view.getInt32(offset);
			}
			else {
				result.value = memory_view.getUint32(offset);
			}
		}
		else {
			throw Error;
		}
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		result = make_float();
		if (type.base.size_in_bytes == 4) {
			result.value = memory_view.getFloat32(offset);
		}
		else if (type.base.size_in_bytes == 8) {
			result.value = memory_view.getFloat64(offset);
		}
		else {
			throw Error;
		}
	}
	else if (type.base.kind == Type_Kind.BOOL) {
		result = make_bool(memory_view.getUint8(offset) > 0);
	}
	else if (type.base.kind == Type_Kind.CHAR) {
		const value = get_memory_bytes(offset, type.base.size_in_bytes);
		result = make_char(value[0]);
	}
	else if (type.base.kind == Type_Kind.ENUM) {
		const value = get_memory(offset, type.elem_type);
		result = get_enum_node_from_value(value, type);
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		result = get_memory_node(offset, Types.size_t);
	}
	else if (type.base.kind == Type_Kind.ARRAY) {
		// @Incomplete
		// :DynamicArrays
		let elem_type = type.elem_type;
		let size = type.size;
		let pointer = offset;
		let elements = new Array(size);
		for (let i = 0; i < size; i += 1) {
			elements[i] = get_memory_node(pointer + i * elem_type.base.size_in_bytes, elem_type);
		}
		// @Cleanup
		// nocheckin
		let begin_operator = make_operator("[");
		let separator = make_operator(",");
		let end_operator = make_operator("]");
		let delimited = make_delimited(elements, begin_operator, separator, end_operator);
		begin_operator.base.was_generated = true;
		separator.base.was_generated = true;
		end_operator.base.was_generated = true;
		delimited.base.was_generated = true;
		result = make_array_literal(null, delimited);
	}
	else if (type.base.kind == Type_Kind.STRUCT) {
		let return_value = {};
		let pointer = offset;
		let names = Object.keys(type.members);
		for (let i = 0; i < names.length; i += 1) {
			let name = names[i];
			let member = type.members[name];
			return_value[name] = get_memory_node(pointer + member.offset, member.type);
		}
		result = make_struct_literal(return_value, type);
		/*
		// nocheckin
		// remove this
		// if (type.base.kind == Type_Kind.STRING) {
		if (type == primitive_type_infos.string) {
			throw Error;
			let str = get_memory_string(result.value.pointer.value, result.value.length.value);
			let string_node = make_string(str);
			string_node.value = node.value;
			result = string_node;
		}
		*/
	}
	result.base.type = type;
	result.base.was_generated = true;
	return result;
}
function set_memory_node(offset, type, node) {
	let memory_view = context.run_state.memory_view;
	// @Incomplete
	// types need to match!
	// nocheckin
	if (type.base.kind == Type_Kind.INTEGER) {
		if (type.base.size_in_bytes == 1) {
			if (type.signed) {
				memory_view.setInt8(offset, node.value);
			}
			else {
				memory_view.setUint8(offset, node.value);
			}
		}
		else if (type.base.size_in_bytes == 2) {
			if (type.signed) {
				memory_view.setInt16(offset, node.value);
			}
			else {
				memory_view.setUint16(offset, node.value);
			}
		}
		else if (type.base.size_in_bytes == 4) {
			if (type.signed) {
				memory_view.setInt32(offset, node.value);
			}
			else {
				memory_view.setUint32(offset, node.value);
			}
		}
	}
	else if (type.base.kind == Type_Kind.FLOAT) {
		if (type.base.size_in_bytes == 4) {
			memory_view.setFloat32(offset, node.value);
		}
		else if (type.base.size_in_bytes == 8) {
			memory_view.setFloat64(offset, node.value);
		}
	}
	else if (type.base.kind == Type_Kind.BOOL) {
		if (node.value) {
			memory_view.setUint8(offset, 1);
		}
		else {
			memory_view.setUint8(offset, 0);
		}
	}
	else if (type.base.kind == Type_Kind.CHAR) {
		const bytes = [node.value];
		set_memory_bytes(offset, type.base.size_in_bytes, bytes);
	}
	else if (type.base.kind == Type_Kind.ENUM) {
		// there are 3 possible versions of enums
		// the value itself, as an integer
		// the member, as a dot operator
		// or a combination of flags, as a sequence of binary operator |
		if (node.base.type.base.kind == Type_Kind.ENUM) {
			run_rvalue(node);
			node = node.base.result;
		}
		if (node.base.type.base.kind == Type_Kind.ENUM) {
			run_rvalue(node);
			node = node.base.result;
		}
		let types_match = check_that_types_match(type.elem_type, node.base.type);
		if (types_match == false) {
			// :Next
			// make test
			throw Error("Trying to set an enum value but the types don't match");
		}
		set_memory(offset, type.elem_type, node.value);
	}
	else if (type.base.kind == Type_Kind.POINTER) {
		set_memory(offset, Types.size_t, node.value);
	}
	else if (type.base.kind == Type_Kind.ARRAY) {
		// @Incomplete
		// :DynamicArray
		if (node.base.kind != Code_Kind.ARRAY_LITERAL) {
			throw Error("set_memory_node: trying to set memory of array but node is not an array literal");
		}
		let elem_type = type.elem_type;
		let size = type.size;
		for (let i = 0; i < size; i += 1) {
			set_memory_node(offset + i * elem_type.base.size_in_bytes, elem_type, node.delimited.elements[i]);
		}
	}
	else if (type.base.kind == Type_Kind.STRUCT) {
		let names = Object.keys(type.members);
		for (let name of names) {
			let member = type.members[name];
			let member_value = node.value[name];
			set_memory_node(offset + member.offset, member.type, member_value);
		}
	}
}

function get_value_node_from_enum_node(node, type) {
	return get_value_node_from_enum_name(node.right.name, type);
}
function get_value_node_from_enum_name(member_name, type) {
	if (member_name in type.map_name_to_value == false) {
		throw Error("Name '" + member_name + "' not found in enum '" + type.enum_name + "'");
	}
	let node = make_node_from_type(type.elem_type);
	node.value = type.map_name_to_value[member_name];
	return node;
}
function get_enum_node_from_value_node(value_node, type) {
	return get_enum_node_from_value(value_node.value, type);
}
function get_enum_node_from_value(value, type) {
	let node;
	if (type.is_flags && value != 0) {
		type.is_flags = false;
		let curr_flag = 1;
		while (curr_flag != 0 && isFinite(curr_flag)) {
			if (value & curr_flag) {
				const new_node = get_enum_node_from_value(curr_flag, type);
				if (node) {
					node = make_binary_operation(node, "|", new_node);
					node.base.run_silent = true;
					node.base.type = type;
				}
				else {
					node = new_node;
				}
			}
			curr_flag *= 2;
		}
		type.is_flags = true;
	}
	else {
		if (value in type.map_value_to_name == false) {
			throw Error("Value '" + value + "' not found in enum '" + type.enum_name + "'");
		}
		let member_name = type.map_value_to_name[value];
		node = make_node_from_type(type);
		node.left.name = type.enum_name;
		node.right.name = member_name;
		node.base.run_silent = true;
	}
	if (type.is_flags) {
		node = make_parens(node);
		node.base.run_silent = true;
	}
	node.base.type = type;
	return node;
}

// nocheckin
// this should be an auto cast in infer
function do_implicit_cast(type, expression) {
	// @Incomplete
	// :ImplicitCast
	// this should probably happen in the infer stage
	let dummy_ident = make_ident("cast_dummy_ident", null);
	let dummy_ident_decl = make_declaration(dummy_ident);
	dummy_ident.base.type = type;
	let cast_node = make_cast(dummy_ident, expression);
	cast_node.is_implicit = true;
	cast_node.base.type = type;
	infer(cast_node);
	cast_node.expression.base.run_silent = true;
	cast_node.base.run_silent = true;
	run_rvalue(cast_node);
	if (cast_node.base.result == null) {
		throw Error("Trying to do implicit cast, but didn't get a result");
	}
	return cast_node.base.result;
}

// @Incomplete
// nocheckin
// allocate_memory_stack
// allocate_memory_heap
// deallocate_memory_stack
// deallocate_memory_heap
function allocate_memory(size_in_bytes) {
	let memory_buffer = context.run_state.memory_buffer;
	let heap_allocations = context.run_state.heap_allocations;
	let heap_start = context.run_state.heap_start;
	let pointer = heap_start;
	if (heap_allocations.length == 0) {
		heap_allocations[pointer] = size_in_bytes;
		return pointer;
	}
	while (pointer < memory_buffer.byteLength) {
		if (pointer in heap_allocations) {
			pointer += heap_allocations[pointer];
		}
		else {
			let enough_free_space = true;
			for (let i = 0; i < size_in_bytes; i += 1) {
				if (pointer in heap_allocations) {
					enough_free_space = false;
					pointer += heap_allocations[pointer];
					break;
				}
				pointer += 1;
			}
			if (enough_free_space) {
				pointer -= size_in_bytes;
				heap_allocations[pointer] = size_in_bytes;
				// :MemoryInitialize
				let bytes = new Array(size_in_bytes);
				bytes.fill(0);
				set_memory_bytes(pointer, size_in_bytes, bytes);
				return pointer;
			}
		}
	}
	throw Error("Out of memory");
}
function deallocate_memory(pointer) {
	let heap_allocations = context.run_state.heap_allocations;
	if (pointer in heap_allocations) {
		delete heap_allocations[pointer];
	}
	else {
		throw Error("Trying to free memory that has not been allocated (maybe a double free?)");
	}
}

let god_mode = false;
let unlocked_abilities = new Array();
function user_has_unlocked_ability(ability_name) {
	if (god_mode) {
		return true;
	}
	return unlocked_abilities.indexOf(ability_name) >= 0;
}

// nocheckin
// @Cleanup
// rename "layer" to "trail"
let selected_bookmark_layer = 1;
const bookmark_layer_count = 10;
let bookmark_layers = new Array(bookmark_layer_count);
for (let i = 0; i < bookmark_layers.length; i += 1) {
	bookmark_layers[i] = new Array();
}

const bookmark_colors = {
	black: make_color_rgba(20, 20, 20, 0.8),
	grey: make_color_rgba(80, 80, 80, 0.8),
	red: make_color_rgba(230, 25, 25, 0.8),
	yellow: make_color_rgba(191, 191, 64, 0.8),
	green: make_color_rgba(20, 184, 20, 0.8),
	blue: make_color_rgba(25, 161, 230, 0.8),
	orange: make_color_rgba(230, 111, 25, 0.8),
	pink: make_color_rgba(235, 71, 153, 0.8),
	cyan: make_color_rgba(25, 230, 230, 0.8),
};
// nocheckin
// we should create layers that have two different colors for the vertical and horizontal lines
// and maybe a different shape?
// needs to be recognizable for people with colorblindness
// also, what happens when the bookmarks overlap?
let bookmark_layer_colors = new Array(bookmark_layer_count);
bookmark_layer_colors[0] = bookmark_colors.red;
bookmark_layer_colors[1] = bookmark_colors.yellow;
bookmark_layer_colors[2] = bookmark_colors.green;
bookmark_layer_colors[3] = bookmark_colors.blue;
bookmark_layer_colors[4] = bookmark_colors.orange;
bookmark_layer_colors[5] = bookmark_colors.pink;
bookmark_layer_colors[6] = bookmark_colors.cyan;
// @Incomplete
// repeat
// should be striped or something
bookmark_layer_colors[7] = bookmark_colors.red;
bookmark_layer_colors[8] = bookmark_colors.yellow;
bookmark_layer_colors[9] = bookmark_colors.green;
const Bookmark = {
	cursor_index: null,
	layer_index: null,
	text: null,
	unlocks: null, // array of strings
};
function make_bookmark(cursor_index, layer_index, text = null, unlocks = null) {
	let bookmark = Object.assign({}, Bookmark);
	bookmark.cursor_index = cursor_index;
	bookmark.layer_index = layer_index;
	bookmark.text = text;
	bookmark.unlocks = unlocks;
	return bookmark;
}

let active_bookmarks = new Array(bookmark_layer_count);
for (let i = 0; i < active_bookmarks.length; i += 1) {
	active_bookmarks[i] = true;
}
active_bookmarks[0] = true;
function get_active_bookmarks() {
	let bookmarks = new Array();
	for (let i = 0; i < bookmark_layers.length; i += 1) {
		let bookmark_array = bookmark_layers[i];
		let is_bookmark_array_active = active_bookmarks[i];
		if (is_bookmark_array_active || selected_bookmark_layer == i) {
			// @Cleanup
			// @Incomplete
			// we should copy the entire array
			for (let j = 0; j < bookmark_array.length; j += 1) {
				let bookmark = bookmark_array[j];
				bookmarks.push(bookmark);
			}
		}
	}
	bookmarks.sort((a, b) => a.cursor_index - b.cursor_index);
	return bookmarks;
}
function get_selected_bookmarks() {
	let bookmarks = bookmark_layers[selected_bookmark_layer];
	bookmarks.sort((a, b) => a.cursor_index - b.cursor_index);
	return bookmarks;
}
let expanding_bookmarks = new Array(bookmark_layer_count);
for (let i = 0; i < expanding_bookmarks.length; i += 1) {
	expanding_bookmarks[i] = true;
}
// we use this for the tutorial
expanding_bookmarks[0] = false;
function get_expanding_bookmarks() {
	let bookmarks = new Array();
	for (let i = 0; i < bookmark_layers.length; i += 1) {
		let bookmark_array = bookmark_layers[i];
		let is_bookmark_array_expanding = expanding_bookmarks[i];
		let is_bookmark_array_active = active_bookmarks[i];
		if (is_bookmark_array_expanding && is_bookmark_array_active || selected_bookmark_layer == i) {
			// @Cleanup
			// @Incomplete
			// we should copy the entire array
			for (let j = 0; j < bookmark_array.length; j += 1) {
				let bookmark = bookmark_array[j];
				bookmarks.push(bookmark);
			}
		}
	}
	return bookmarks;
}
let bookmark_text_menu = {
	target: null,
	active: false,
};
function enter_bookmark_text_menu() {
	let bookmarks = get_active_bookmarks();
	let {valid, index} = bookmark_array_find_prev_index(bookmarks, run_tree_view_state.cursor_index + 1);
	bookmark_text_menu.target = bookmarks[index];
	bookmark_text_menu.active = true;
	let bookmark_text = "";
	if (bookmark_text_menu.target.text != null) {
		bookmark_text = bookmark_text_menu.target.text;
	}
	bookmark_text_input_gui_elem.value = bookmark_text;
	bookmark_text_input_gui_elem.setSelectionRange(0, bookmark_text.length);
	bookmark_text_gui_elem.style.display = "none";
	bookmark_text_input_gui_elem.style.display = "";
	bookmark_text_input_gui_elem.focus();
	run_tree_gui_elem.is_focused = false;
	play_bookmark_text_sound();
}
function exit_bookmark_text_menu() {
	bookmark_text_menu.target.text = bookmark_text_input_gui_elem.value;
	bookmark_text_menu.target = null;
	bookmark_text_menu.active = false;
	run_tree_gui_elem.is_focused = true;
	run_tree_gui_elem.focus();
	need_update = true;
	play_bookmark_text_confirm_sound();
}
function bookmark_array_has_index(array, cursor_index) {
	return bookmark_array_find(array, cursor_index).found;
}
function bookmark_array_find(array, cursor_index) {
	let found = false;
	let index = -1;
	for (let i = 0; i < array.length; i += 1) {
		let bookmark = array[i];
		if (bookmark.cursor_index == cursor_index) {
			found = true;
			index = i;
			break;
		}
	}
	return {found, index};
}
function bookmark_array_find_next_index(array, starting_index) {
	let valid = false;
	// @Speed
	let index = 0;
	while  (index < array.length) {
		if (array[index].cursor_index > starting_index) {
			valid = true;
			break;
		}
		index += 1;
	}
	return { index, valid };
}
function bookmark_array_find_prev_index(array, starting_index) {
	let valid = false;
	// @Speed
	let index = array.length-1;
	while (index >= 0) {
		if (array[index].cursor_index < starting_index) {
			valid = true;
			break;
		}
		index -= 1;
	}
	return { index, valid };
}

const syscall_name_to_id = {
	print: 1,
	assert: 2,
	sizeof: 3,
	malloc: 4,
	free: 5,
	sqrt: 6,
}
const syscall_id_to_name = {};
const syscall_names = Object.keys(syscall_name_to_id);
const syscall_ids = Object.values(syscall_name_to_id);
for (let i = 0; i < syscall_names.length; i += 1) {
	const name = syscall_names[i];
	const id = syscall_ids[i];
	syscall_id_to_name[id] = name;
}

function run_syscall(node, args) {
	if (node.base.run_disable) {
		return;
	}
	if (args.length > node.parameters.length) {
		throw Error("Syscall received more arguments than parameters");
	}
	else if (args.length < node.parameters.length) {
		throw Error("Syscall received fewer arguments than parameters");
	}
	// @Incomplete
	// check that arguments have correct types
	for (const arg of args) {
	}
	const values = [];
	for (const arg of args) {
		// @Incomplete
		// nocheckin
		// if (arg.base.result.base.type.base.kind == Type_Kind.STRING) {
		if (arg.base.result.base.type == primitive_type_infos.string) {
			throw Error;
			values.push(arg.base.result.str);
		}
		else {
			values.push(arg.base.result.value);
		}
	}
	let native_function;
	const name = syscall_id_to_name[node.id];
	if (name == "print") {
		native_function = console.log;
	}
	else if (name == "assert") {
		native_function = assert_procedure;
	}
	else if (name == "sizeof") {
		// @Incomplete
		// native_function = sizeof_procedure;
		throw Error;
	}
	else if (name == "malloc") {
		native_function = allocate_memory;
	}
	else if (name == "free") {
		native_function = deallocate_memory;
	}
	else if (name == "sqrt") {
		native_function = Math.sqrt;
	}
	else {
		throw Error("Unhandled syscall {id: " + node.id + ", name: " + name + "}");
	}
	// :MultipleReturns
	// @Incomplete
	// check that return values have correct types
	for (const retn of node.returns) {
	}
	const return_value = native_function.apply(null, values);
	if (node.returns.length > 0) {
		node.base.result = make_node_from_type(node.returns.elements[0].base.type);
		node.base.result.value = return_value;
		node.base.result.base.result_of = node;
	}
}

/*
function assert_procedure(arg) {
	if (arg) {
		throw Error;
	}
}

const print_param_str = make_ident("str");
// print_param_str.base.type = primitive_type_infos.string;
let print_syscall = make_syscall(syscall_name_to_id["print"], [print_param_str], null);
let print_declaration = make_declaration(make_ident("print"), print_syscall);

let assert_syscall = make_syscall(syscall_name_to_id["assert"], null, null);
let assert_declaration = make_declaration(make_ident("assert"), assert_syscall);

function sizeof_procedure(arg) {
	if (arg.declaration && arg.declaration.ident.base.type.base.kind == Type_Kind.STRUCT) {
		return arg.declaration.ident.base.type.base.size_in_bytes;
	}
	else if (arg.base.kind == Code_Kind.IDENT && Types.hasOwnProperty(arg.name)) {
		return Types[arg.name].base.size_in_bytes;
	}
	else {
		throw Error;
	}
}
// @Incomplete
// also need to create typeof(ident)
const sizeof_param_type = make_ident("type");
sizeof_param_type.base.type = Types.size_t;
let sizeof_syscall = make_syscall(syscall_name_to_id["sizeof"], [sizeof_param_type], null);
sizeof_syscall.base.run_disable = true;
let sizeof_declaration = make_declaration(make_ident("sizeof"), sizeof_syscall);

const malloc_param_num_bytes = make_ident("num_bytes");
malloc_param_num_bytes.base.type = Types.size_t;
const malloc_return_pointer = make_ident("pointer");
malloc_return_pointer.base.type = Types.size_t;
let malloc_syscall = make_syscall(syscall_name_to_id["malloc"], [malloc_param_num_bytes], [malloc_return_pointer]);
let malloc_declaration = make_declaration(make_ident("malloc"), malloc_syscall);

const free_param_pointer = make_ident("pointer");
free_param_pointer.base.type = Types.size_t;
let free_syscall = make_syscall(syscall_name_to_id["free"], [free_param_pointer], null);
let free_declaration = make_declaration(make_ident("free"), free_syscall);

const sqrt_param_number = make_ident("number");
sqrt_param_number.base.type = Types.float;
const sqrt_return_result = make_ident("result");
sqrt_return_result.base.type = Types.float;
let sqrt_syscall = make_syscall(syscall_name_to_id["sqrt"], [sqrt_param_number], [sqrt_return_result]);
let sqrt_declaration = make_declaration(make_ident("sqrt"), sqrt_syscall);
*/

let stdlib_statements = [
	// make_statement(print_declaration),
	// make_statement(assert_declaration),
	// make_statement(sizeof_declaration),
	// make_statement(malloc_declaration),
	// make_statement(free_declaration),
	// make_statement(sqrt_declaration),
];
let Stdlib_Block = make_block(stdlib_statements);
if (false) {
	let string_code = `
	string :: struct {
		pointer: *char;
		length: size_t;
	}
	`;
	let file = parse_text(string_code);
	for (let stmt of file.global_block.delimited.elements) {
		Stdlib_Block.delimited.elements.push(stmt);
	}
}
if (false) {
	let float_code = `
	fabs :: (f: float) {
		if (f > 0) {
			return f;
		}
		else {
			return -f;
		}
	}
	compare_float :: (a: float, b: float, margin_of_error := 0.00001) -> float {
		return fabs(a - b) < margin_of_error;
	}
	`;
	let file = parse_text(float_code);
	for (let stmt of file.global_block.delimited.elements) {
		Stdlib_Block.delimited.elements.push(stmt);
	}
}
// :TypeInfo
if (false) {
	let type_code = `
	Type :: struct {
		kind: Type_Kind;
		size_in_bytes: size_t;
		pointer: *Type;
	}
	`;
	let file = parse_text(type_code);
	infer(file.global_block);
	let type_decl = file.global_block.delimited.elements[0];
	Types.Type = type_decl.expression.base.type;
	Stdlib_Block.delimited.elements.push(type_decl);
}

// nocheckin
// @Incomplete
function fill_rodata(run_state) {
	let already_stored_strings = {};
	for (let i = 0; i < strings.length; i += 1) {
		let string = strings[i];
		if (string.str in already_stored_strings) {
			const old_string = already_stored_strings[string.str];
			string.value = old_string.value;
			continue;
		}
		// @Incomplete
		throw Error("fill_rodata: strings not implemented yet");
		let pointer_member = primitive_type_infos.string.members.pointer;
		let length_member = primitive_type_infos.string.members.length;
		let elem_type = pointer_member.type.elem_type;
		let struct_pointer = context.run_state.stack_pointer;
		context.run_state.stack_pointer += primitive_type_infos.string.base.size_in_bytes;
		let pointer = make_integer(context.run_state.stack_pointer);
		let length = make_integer(string.str.length);
		pointer.base.type = primitive_type_infos.string.members.pointer.type;
		length.base.type = primitive_type_infos.string.members.length.type;
		string.value = {pointer: pointer, length: length};
		set_memory_node(struct_pointer, primitive_type_infos.string, string);
		set_memory_string(context.run_state.stack_pointer, string.str);
		// :Alignment
		context.run_state.stack_pointer += elem_type.base.size_in_bytes * string.value.length.value;
		const padding_size = pointer_member.type.base.size_in_bytes;
		const padding = (padding_size - (context.run_state.stack_pointer % padding_size) % padding_size);
		context.run_state.stack_pointer += padding;
		already_stored_strings[string.str] = string;
	}
}
let timeline_grabbed = false;
function document_mousedown(event) {
	let box = timeline_gui_elem.getBoundingClientRect();
	let inside_timeline = (box.left < event.pageX && event.pageX < box.right) && (box.top < event.pageY && event.pageY < box.bottom);
	if (inside_timeline) {
		timeline_grabbed = true;
		instant_scroll = true;
		mouse_style_gui_elem.style.display = "inline";
		mouse_style_gui_elem.style.cursor = "grabbing";
		timeline_update_position(event.pageX, event.pageY);
	}
}
function document_mousemove(event) {
	if (timeline_grabbed) {
		timeline_update_position(event.pageX, event.pageY);
	}
}
function document_mouseup(event) {
	if (timeline_grabbed) {
		instant_scroll = false;
		mouse_style_gui_elem.style.display = "none";
		mouse_style_gui_elem.style.cursor = "auto";
		timeline_grabbed = false;
		timeline_update_position(event.pageX, event.pageY);
	}
}
function timeline_update_position(pageX, pageY) {
	let box = timeline_gui_elem.getBoundingClientRect();
	let offsetX = pageX - box.left;
	let offsetY = pageY - box.top;
	let width = timeline_gui_elem.clientWidth;
	let height = timeline_gui_elem.clientHeight;
	if (offsetX <= 0) {
		offsetX = 0;
	}
	if (width <= offsetX) {
		offsetX = width;
	}
	timeline_change_position(offsetX, width);
}

function timeline_change_position(offset, width) {
	const max_index = run_tree_view_state.cursor_stack.length-1;
	let cursor_index = Math.round(offset / width * max_index);
	change_cursor_position(cursor_index);
	need_update = true;
}
function update_timeline() {
	timeline_gui_elem.max = context.view_state.cursor_stack.length-1;
	timeline_gui_elem.value = run_tree_view_state.cursor_index;
	timeline_gui_elem.setAttribute("max", timeline_gui_elem.max);
	timeline_gui_elem.setAttribute("value", timeline_gui_elem.value);
	const track = timeline_gui_elem.children[0];
	const thumb = timeline_gui_elem.children[1];
	const progress = timeline_gui_elem.value / timeline_gui_elem.max;
	const width = timeline_gui_elem.clientWidth;
	const pixel_offset = progress * width;
	thumb.style.left = pixel_offset + "px";
}

const Scroll_Animation_State = {
	x: 0,
	y: 0,
};
function make_scroll_animation_state() {
	let state = Object.assign({}, Scroll_Animation_State);
	return state;
}
const Scroll_Animation = {
	start: null,
	end: null,
	curr: null,
	start_time: 0,
	duration: 0.2,
	easing: "sineInOut",
	active: false,
};
function make_scroll_animation() {
	let animation = Object.assign({}, Scroll_Animation);
	animation.start = make_scroll_animation_state();
	animation.end = make_scroll_animation_state();
	animation.curr = make_scroll_animation_state();
	return animation;
}
function start_scroll_animation(animation) {
	Object.assign(animation.curr, animation.start);
	animation.start_time = context.curr_time;
	animation.easing = "sine";
	animation.active = true;
}
function end_scroll_animation(animation) {
	Object.assign(animation.curr, animation.end);
	Object.assign(animation.start, animation.curr);
	animation.active = false;
}
let scroll_animation = make_scroll_animation();
function update_scroll_animation_goal(animation, cursor) {
	let mid_x = canvas_elem.width / 2;
	let mid_y = canvas_elem.height / 2;
	let cursor_mid_x = cursor.animation.end.x + cursor.animation.end.width  / 2 - animation.curr.x;
	let cursor_mid_y = cursor.animation.end.y + cursor.animation.end.height / 2 - animation.curr.y;
	let diff_x = mid_x - cursor_mid_x;
	let diff_y = mid_y - cursor_mid_y;
	// nocheckin
	// this should be based on the edges of the screen
	// not the distance from the midpoint of the screen
	let trigger_distance_x = mid_x / 1.5;
	let trigger_distance_y = mid_y / 1.5;
	let distance_x = Math.abs(diff_x);
	let distance_y = Math.abs(diff_y);
	let trigger = false;
	if (distance_x > trigger_distance_x) {
		animation.end.x = cursor.animation.end.x - mid_x + cursor.animation.end.width / 2;
		trigger = true;
	}
	if (distance_y > trigger_distance_y) {
		animation.end.y = cursor.animation.end.y - mid_y + cursor.animation.end.height / 2;
		trigger = true;
	}
	if (trigger) {
		if (animation.end.x < 0) {
			animation.end.x = 0;
		}
		if (animation.end.y < 0) {
			animation.end.y = 0;
		}
		if (animation.active) {
			end_scroll_animation(animation);
		}
		start_scroll_animation(animation);
	}
	if (trigger) {
		// at the end of the scroll animation, we should be outside the trigger area
		trigger = false;
		let mid_x = canvas_elem.width / 2;
		let mid_y = canvas_elem.height / 2;
		let cursor_mid_x = mid_x + animation.end.x + cursor.animation.end.width  / 2 - animation.curr.x;
		let cursor_mid_y = mid_y + animation.end.y + cursor.animation.end.height / 2 - animation.curr.y;
		let diff_x = mid_x - cursor_mid_x;
		let diff_y = mid_y - cursor_mid_y;
		let distance_x = Math.abs(diff_x);
		let distance_y = Math.abs(diff_y);
		if (distance_x > trigger_distance_x) {
			trigger = true;
		}
		if (distance_y > trigger_distance_y) {
			trigger = true;
		}
		if (trigger) {
			// nocheckin
			// the math is probably a little wrong
			// throw Error("scroll end position is in the trigger area");
			// debugger;
		}
	}
}
function update_scroll_animation(animation) {
	if (animation.active) {
		let elapsed = (context.curr_time - animation.start_time) / 1000;
		if (elapsed > animation.duration) {
			end_scroll_animation(animation);
		}
		else {
			let degree = elapsed / animation.duration;
			degree = easeInOutSine(degree);
			animation.curr.x = lerp(animation.start.x, animation.end.x, degree);
			animation.curr.y = lerp(animation.start.y, animation.end.y, degree);
		}
	}
}

const Cursor = {
	index: 0,
	prev_index: 0,
	animation: null,
	error_animation: null,
};
function make_cursor() {
	let cursor = Object.assign({}, Cursor);
	cursor.animation = make_cursor_animation();
	cursor.error_animation = make_cursor_error_animation();
	return cursor;
}
const Cursor_Animation = {
	start: null,
	end: null,
	curr: null,
	duration: 0.1,
	start_time: 0,
	active: false,
};
function make_cursor_animation() {
	let cursor_anim = Object.assign({}, Cursor_Animation);
	cursor_anim.start = make_cursor_animation_state();
	cursor_anim.end   = make_cursor_animation_state();
	cursor_anim.curr  = make_cursor_animation_state();
	return cursor_anim;
}
const Cursor_Animation_State = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
};
function make_cursor_animation_state() {
	let state = Object.assign({}, Cursor_Animation_State);
	return state;
}
function start_cursor_animation(cursor, curr_time) {
	if (cursor.animation.active) {
		end_cursor_animation(cursor);
	}
	Object.assign(cursor.animation.curr, cursor.animation.start);
	cursor.animation.start_time = curr_time;
	cursor.animation.active = true;
}
function end_cursor_animation(cursor) {
	Object.assign(cursor.animation.curr, cursor.animation.end);
	Object.assign(cursor.animation.start, cursor.animation.curr);
	cursor.animation.active = false;
}
function update_cursor_animation(cursor, curr_time) {
	if (cursor.animation.active == false) {
		return;
	}
	let duration = cursor.animation.duration;
	let elapsed = (curr_time - cursor.animation.start_time) / 1000;
	if (elapsed >= duration) {
		end_cursor_animation(cursor);
	}
	else {
		// in the middle of animation
		let degree = elapsed / duration;
		cursor.animation.curr.x      = lerp(cursor.animation.start.x, cursor.animation.end.x, degree);
		cursor.animation.curr.y      = lerp(cursor.animation.start.y, cursor.animation.end.y, degree);
		cursor.animation.curr.width  = lerp(cursor.animation.start.width, cursor.animation.end.width, degree);
		cursor.animation.curr.height = lerp(cursor.animation.start.height, cursor.animation.end.height, degree);
	}
}
const Cursor_Error_Animation = {
	start: null,
	curr: null,
	direction: "right",
	duration: 0.4,
	start_time: 0,
	active: false,
};
function make_cursor_error_animation() {
	let cursor_anim = Object.assign({}, Cursor_Error_Animation);
	cursor_anim.start = make_cursor_error_animation_state();
	cursor_anim.end = make_cursor_error_animation_state();
	cursor_anim.curr  = make_cursor_error_animation_state();
	return cursor_anim;
}
const Cursor_Error_Animation_State = {
	x: 0,
	saturation: 0,
};
function make_cursor_error_animation_state() {
	let state = Object.assign({}, Cursor_Error_Animation_State);
	return state;
}
function start_cursor_error_animation(cursor, curr_time) {
	if (cursor.error_animation.active) {
		end_cursor_animation(cursor);
	}
	Object.assign(cursor.error_animation.curr, cursor.error_animation.start);
	cursor.error_animation.start_time = curr_time;
	cursor.error_animation.active = true;
}
function end_cursor_error_animation(cursor) {
	Object.assign(cursor.error_animation.curr, cursor.error_animation.end);
	cursor.error_animation.active = false;
}
function update_cursor_error_animation(cursor, curr_time) {
	let animation = cursor.error_animation;
	if (animation.active == false) {
		return;
	}
	let duration = animation.duration;
	let elapsed = (curr_time - animation.start_time) / 1000;
	if (elapsed >= duration) {
		end_cursor_error_animation(cursor);
	}
	else {
		// in the middle of animation
		let linear = elapsed / duration;
		let shake_width = 10;
		let period_count = 4;
		let direction_diff = 0;
		if (animation.direction == "left") {
			direction_diff = 1.0 / period_count;
		}
		if (animation.direction == "right") {
			direction_diff = 0;
		}
		let shake = Math.sin((linear + direction_diff) * Math.PI * period_count) * shake_width * (1 - linear);
		animation.curr.x = animation.start.x + shake;
		let pulse_count = 2;
		let increment = duration / pulse_count;
		let saturation = 0;
		if ((linear % increment) < (increment / 2)) {
			saturation = 1;
		}
		animation.curr.saturation = saturation;
	}
}
function update_cursor_goal(cursor) {
	let find = find_visible_token_begin_and_end(context.view_state.node.token_begin, context.view_state.node.token_end);
	let begin_token_node = find.begin_token_node;
	let end_token_node = find.end_token_node;
	if (begin_token_node == null) {
		throw Error("update_cursor_goal: begin_token_node == null");
	}
	if (end_token_node == null) {
		throw Error("update_cursor_goal: end_token_node == null");
	}
	let cursor_left = begin_token_node.animation.end.x;
	let cursor_top = begin_token_node.animation.end.y;
	let cursor_right = end_token_node.animation.end.x + end_token_node.animation.end.width;
	let cursor_bottom = end_token_node.animation.end.y + end_token_node.animation.end.height;
	cursor.animation.end.x = cursor_left;
	cursor.animation.end.y = cursor_top;
	cursor.animation.end.width = cursor_right - cursor_left;
	cursor.animation.end.height = cursor_bottom - cursor_top;
}
function update_developer_controls() {
	if (developer_controls_shown) {
		wrap_grid_gui_elem.style = "grid-template-columns: 1fr 1fr;"
		controls_gui_elem.style = "";
		wrap_error_gui_elem.style = "";
		source_gui_elem.style = "";
	}
	else {
		wrap_grid_gui_elem.style = "grid-template-columns: 1fr 0fr;"
		controls_gui_elem.style = "display: none";
		wrap_error_gui_elem.style = "display: none";
		source_gui_elem.style = "display: none";
	}
}
function update_bookmark_text() {
	if (bookmark_text_menu.active) {
		return;
	}
	bookmark_text_gui_elem.style.display = "";
	bookmark_text_input_gui_elem.style.display = "none";
	let bookmarks = get_active_bookmarks();
	let {index, valid} = bookmark_array_find_prev_index(bookmarks, run_tree_view_state.cursor_index + 1);
	let bookmark_text = null;
	if (valid) {
		bookmark_text = bookmarks[index].text;
	}
	if (bookmark_text == null) {
		bookmark_text = "press L to set bookmark text";
	}
	set_bookmark_text(bookmark_text);
}
function set_bookmark_text(str) {
	bookmark_text_gui_elem.innerHTML = "";
	bookmark_text_gui_elem.appendChild(document.createTextNode(str));
}
function lerp(a, b, degree) {
	return a * (1 - degree) + b * degree;
}
// https://easings.net/
function easeInOutSine(x) {
	return -(Math.cos(Math.PI * x) - 1) / 2;
}
function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}
function easeOutElastic(x) {
	const c4 = (2 * Math.PI) / 3;
	return x === 0
	       ? 0
	       : x === 1
	       ? 1
	       : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
let need_update = true;
function main_loop() {
	{
		let cs = window.getComputedStyle(run_tree_gui_elem);
		canvas_elem.width = convert_size_string_to_float(cs.width);
		canvas_elem.height = convert_size_string_to_float(cs.height);
	}
	tick();
	draw();
	window.requestAnimationFrame(main_loop);
}
let draw_padding = 10;
function draw() {
	const ctx = canvas_elem.getContext("2d");
	ctx.clearRect(0, 0, canvas_elem.width, canvas_elem.height);
	ctx.save();
	ctx.translate(draw_padding, draw_padding);
	draw_tokens(global_token_buffer, ctx);
	draw_bookmarks(ctx);
	draw_cursor(run_cursor);
	ctx.restore();
}
let bookmark_anim_t = 0.0;
function draw_bookmarks(ctx) {
	bookmark_anim_t += 0.01;
	bookmark_anim_t = bookmark_anim_t % 1.0;
	let bookmarks = get_active_bookmarks();
	let cursor_stack = context.view_state.cursor_stack;
	for (let i = 0; i < bookmarks.length; i += 1) {
		let bookmark = bookmarks[i];
		if (bookmark.cursor_index >= context.view_state.cursor_stack.length) {
			continue;
		}
		let node = context.view_state.cursor_stack[bookmark.cursor_index];
		let find = find_visible_token_begin_and_end(node.token_begin, node.token_end);
		if (find.begin_token_node == null || find.end_token_node == null) {
			// @Speed
			// we should filter out all non-visible bookmarks much earlier
			continue;
		}
		let begin = find.begin_token_node.animation.end;
		let end = find.end_token_node.animation.end;
		let diff_x = dummy_width * 0.1 * Math.sin(bookmark_anim_t * Math.PI);

		ctx.save();
		ctx.translate(0-scroll_animation.curr.x, 0-scroll_animation.curr.y);

		let bookmark_color = bookmark_layer_colors[bookmark.layer_index];
		bookmark_color = Object.assign({}, bookmark_color);
		bookmark_color.a = 0.8;
		bookmark_color.a *= (1 + Math.sin(bookmark_anim_t * Math.PI * 2)) / 2;
		if (bookmark_color.a < 0.4) {
			bookmark_color.a = 0.4;
		}
		let base_color = convert_color_rgba_to_css(bookmark_color);
		ctx.fillStyle = base_color;
		ctx.strokeStyle = base_color;
		ctx.lineWidth = 20 / dummy_height;
		ctx.lineCap = "round";

		let reduction = 0.2;
		// top left
		ctx.beginPath();
		ctx.moveTo(begin.x - diff_x, begin.y + (begin.height * reduction));
		ctx.lineTo(begin.x - diff_x, begin.y);
		ctx.lineTo(begin.x - diff_x + (begin.height * reduction), begin.y);
		ctx.stroke();

		// top right
		ctx.beginPath();
		ctx.moveTo(end.x + diff_x + end.width, begin.y + (begin.height * reduction));
		ctx.lineTo(end.x + diff_x + end.width, begin.y);
		ctx.lineTo(end.x + diff_x + end.width - (begin.height * reduction), begin.y);
		ctx.stroke();

		// bottom left
		ctx.beginPath();
		ctx.moveTo(begin.x - diff_x, begin.y + begin.height - (begin.height * reduction));
		ctx.lineTo(begin.x - diff_x, begin.y + begin.height);
		ctx.lineTo(begin.x - diff_x + (begin.height * reduction), begin.y + begin.height);
		ctx.stroke();

		// bottom right
		ctx.beginPath();
		ctx.moveTo(end.x + diff_x + end.width, begin.y + begin.height - (begin.height * reduction));
		ctx.lineTo(end.x + diff_x + end.width, begin.y + begin.height);
		ctx.lineTo(end.x + diff_x + end.width - (begin.height * reduction), begin.y + begin.height);
		ctx.stroke();

		ctx.restore();
	}
}
function find_visible_token_begin_and_end(token_begin, token_end) {
	let begin_token_node = null;
	let end_token_node = null;
	for (let i = token_begin; i <= token_end; i += 1) {
		let token_node = global_token_buffer.token_nodes[i];
		if (token_node.should_show) {
			begin_token_node = token_node;
			break;
		}
	}
	for (let i = token_end - 1; i >= token_begin; i -= 1) {
		let token_node = global_token_buffer.token_nodes[i];
		if (token_node.should_show) {
			end_token_node = token_node;
			break;
		}
	}
	return {begin_token_node, end_token_node};
}
let curr_time = 0;
function tick() {
	curr_time = new Date().getTime();
	context.curr_time = curr_time;

	let needed_update = need_update;

	if (needed_update) {
		end_tokens_animation(global_token_buffer);
	}

	if (needed_update) {
		update_developer_controls();
	}

	if (timeline_grabbed == false) {
		// nocheckin
		// @Incomplete
		// need to start from the last timeline position
		update_benny_test(curr_time);
	}

	if (needed_update) {
		context.view_state = run_tree_view_state;
		context.view_state.node = context.view_state.cursor_stack[context.view_state.cursor_index];

		update_timeline();

		update_bookmark_text();

		did_expand_call = false;
		did_collapse_call = false;
		did_expand_loop = false;
		did_collapse_loop = false;
		did_expand_binop = false;
		did_collapse_binop = false;

		mark_containment(User_Block);
		update_code(User_Block);
		update_line_number(User_Block);

		update_tokens_width_and_height(global_token_buffer);

		context.view_state.current_line = context.view_state.node.line_number;
		context.view_state.current_column_index = context.view_state.node.column_index;

		if (context.view_state.node == null) {
			throw Error("tick: context.view_state.node == null");
		}

		start_tokens_animation(global_token_buffer);

		update_tokens_goal(global_token_buffer, curr_time);
		update_tokens_goal_x(global_token_buffer, curr_time);

		update_sounds();
	}
	update_tokens_animation(global_token_buffer, curr_time);

	if (needed_update) {
		update_cursor_goal(run_cursor, curr_time);
		start_cursor_animation(run_cursor, curr_time);
	}
	update_cursor_animation(run_cursor, curr_time);
	update_cursor_error_animation(run_cursor, curr_time);

	if (needed_update) {
		update_scroll_animation_goal(scroll_animation, run_cursor);
	}
	update_scroll_animation(scroll_animation);

	if (needed_update) {
		visible_token_nodes = new Array();
		for (let i = 0; i < global_token_buffer.token_nodes.length; i += 1) {
			let token_node = global_token_buffer.token_nodes[i];
			if (token_node.should_show) {
				if (token_node.token.kind != Token_Kind.TAB) {
					// continue;
				}
				visible_token_nodes.push(token_node);
			}
		}
	}

	if (needed_update) {
		need_update = false;
	}
	did_mode_sound = false;
	did_expand_sound = false;
	did_collapse_sound = false;

	if (needed_update) {
		save_user_progress();
		save_tree_view_modes();
		save_run_tree_view_state();
	}
}
function convert_size_string_to_float(size_string) {
	return parseFloat(size_string.substr(0, size_string.length - 2));
}
function draw_cursor(cursor) {
	let curr_x = cursor.animation.curr.x + cursor.error_animation.curr.x - scroll_animation.curr.x;
	let curr_y = cursor.animation.curr.y - scroll_animation.curr.y;
	curr_x += draw_padding;
	curr_y += draw_padding;
	cursor_gui_elem.style.left = curr_x + "px";
	cursor_gui_elem.style.top = curr_y + "px";
	cursor_gui_elem.style.width = cursor.animation.curr.width + "px";
	cursor_gui_elem.style.height = cursor.animation.curr.height + "px";
	let saturation = cursor.error_animation.curr.saturation;
	let cursor_background = cursor_gui_elem.children[0];
	let background_inner = cursor_background.children[0];
	let background_outer = cursor_background.children[1];
	if (cursor.error_animation.active && saturation > 0.5) {
		background_inner.style.border = "1pt solid hsla(0, 60%, 10%, 0.5)";
		background_inner.style.boxShadow = "inset 0 0 4pt 3pt hsla(0, " + saturation * 100 + "%, 8%, 1.0)";
	}
	else {
		background_inner.style.border = "1pt solid hsla(240, 20%, 10%, 0.5)";
		background_inner.style.boxShadow = "inset 0 0 8pt 1pt hsla(240, 10%, 8%, 1.0)";
	}
}
function draw_tokens(buffer, ctx) {
	let cs = window.getComputedStyle(code_gui_elem);
	let font = cs.fontStyle + " " + cs.fontVariant + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
	for (let token_node of buffer.token_nodes) {
		// @Speed
		// we should have a separate array with only the nodes that should be shown
		// so that we don't have to do this check every time
		// and the cache is coherent
		// @Speed
		// don't draw tokens that are off the screen
		if (token_node.should_show == false && token_node.animation.active == false) {
			continue;
		}
		else if (token_node.token.kind == Token_Kind.NEWLINE) {
			continue;
		}
		else if (token_node.token.kind == Token_Kind.WHITESPACE) {
			continue;
		}
		else if (token_node.token.kind == Token_Kind.TAB) {
			continue;
		}
		ctx.font = font;
		ctx.fillStyle = convert_rgba_to_css(token_node.color.r, token_node.color.g, token_node.color.b, token_node.animation.curr.opacity);
		let x = token_node.animation.curr.x;
		let y = token_node.animation.curr.y + token_node.height - 4;
		x -= scroll_animation.curr.x;
		y -= scroll_animation.curr.y;
		ctx.fillText(token_node.token.str, x, y);
	}
}
function start_tokens_animation(buffer) {
	curr_time = new Date().getTime();
	for (let token_node of buffer.token_nodes) {
		start_token_animation(token_node, curr_time);
	}
}
function end_tokens_animation(buffer) {
	curr_time = new Date().getTime();
	for (let token_node of buffer.token_nodes) {
		end_token_animation(token_node, curr_time);
	}
}

const run_cursor = make_cursor();
function print() {
	{
		// trigger scroll_animation
		let syntax_tree_box = run_tree_gui_elem.getBoundingClientRect();
		let code_window_height = syntax_tree_box.bottom - syntax_tree_box.top;
		let code_box = code_gui_elem.getBoundingClientRect();
		let code_height = code_box.bottom - code_box.top;
		let diff_y = run_cursor.animation.end.y - scroll_animation.curr.y;
		let move_increment = code_window_height / 4;
		// nocheckin
		// @Bug
		// move down once and then up
		// run_cursor.animation is messed up, probably because scroll_animation is messed up
		// add some print statements so that we can see the data and how and why it changed
		// also we should look at the old version of the debugger and how it handles scrolling
		if (diff_y < (code_window_height / 2) - move_increment) {
			scroll_animation.start.y = scroll_animation.curr.y;
			scroll_animation.end.y = scroll_animation.curr.y - move_increment;
			scroll_animation.active = true;
			scroll_animation.duration = 0.1;
			if (instant_scroll) {
				scroll_animation.duration = 0;
			}
		}
		else if (diff_y > (code_window_height / 2) + move_increment) {
			scroll_animation.start.y = scroll_animation.curr.y;
			scroll_animation.end.y = scroll_animation.curr.y + move_increment;
			scroll_animation.active = true;
			scroll_animation.duration = 0.1;
			if (instant_scroll) {
				scroll_animation.duration = 0;
			}
		}
		if (scroll_animation.end.y < 0 || scroll_animation.end.y > code_height) {
			scroll_animation.active = false;
		}
	}
}

let taking_too_long = false;
let debug_timeout_ms = 4000;
let start_time = 0;
function debug_timeout_start() {
	let curr_time = new Date().getTime();
	start_time = curr_time;
}
function debug_timeout_poll() {
	let curr_time = new Date().getTime();
	if (curr_time - start_time > debug_timeout_ms) {
		taking_too_long = true;
	}
}
function start_debugging() {
	{
		let cs = window.getComputedStyle(dummy_token_node);
		dummy_width = convert_size_string_to_float(cs.width);
		dummy_height = convert_size_string_to_float(cs.height);
	}
	set_status("Running program...");
	curr_time = new Date().getTime();
	debug_timeout_start();
	context.run_state = run_tree_run_state;
	run_statement(User_Block);
	init_run_tree_view_state();
	context.view_state = run_tree_view_state;
	undo_index = -1;
	run_tree_view_state.cursor_stack = run_tree_run_state.cursor_stack;	
	change_cursor_position_with_undo(run_tree_view_state.cursor_index);
	init_user_progress();
	init_tree_view_modes();
	set_status("Rendering code...");
	render_code(User_Block, global_token_buffer);
	update_tokens_style(global_token_buffer);
	need_update = true;
	set_status("Ready");
	main_loop();
}

let undo_index = -1;
let undo_stack = new Array();
function change_cursor_position_with_undo(index) {
	undo_index += 1;
	undo_stack.splice(undo_index);
	undo_stack.push(index);
	change_cursor_position(index);
	for (let i = 0; i < bookmark_layers[0].length; i += 1) {
		let bookmark = bookmark_layers[0][i];
		if (bookmark.cursor_index == index) {
			let unlocks = bookmark.unlocks;
			if (unlocks == null) {
				continue;
			}
			for (let j = 0; j < unlocks.length; j += 1) {
				let unlock = unlocks[j];
				if (user_has_unlocked_ability(unlock) == false) {
					unlocked_abilities.push(unlock);
				}
			}
		}
	}
}
function change_cursor_position(index) {
	context.view_state.cursor_index = index;
}
function undo() {
	if (undo_index < 1) {
		trigger_cursor_error();
		return;
	}
	undo_index -= 1;
	let cursor_index = undo_stack[undo_index];
	change_cursor_position(cursor_index);
	need_update = true;
	play_jump_sound();
}
function redo() {
	if (undo_index == undo_stack.length-1) {
		trigger_cursor_error();
		return;
	}
	undo_index += 1;
	let cursor_index = undo_stack[undo_index];
	change_cursor_position(cursor_index);
	need_update = true;
	play_jump_sound();
}

const benny_test = {
	start: null,
	end: null,
	curr: null,
	start_time: 0,
	duration: 0.2,
	active: false,
};
function toggle_benny_test() {
	let curr_time = new Date().getTime();
	benny_test.active = benny_test.active == false;
	if (benny_test.active) {
		benny_test.start = run_tree_view_state.cursor_index;
		benny_test.curr = benny_test.start;
		benny_test.start_time = curr_time;
	}
}
function update_benny_test(curr_time) {
	if (benny_test.active == false) {
		return;
	}
	let duration = benny_test.duration;
	let elapsed = (curr_time - benny_test.start_time) / 1000;
	if (elapsed >= duration) {
		benny_test.curr += 1;
		if (benny_test.curr >= run_tree_view_state.cursor_stack.length) {
			benny_test.curr = 0;
		}
		change_cursor_position(benny_test.curr);
		benny_test.start_time = curr_time;
		need_update = true;
		play_move_sound();
	}
}

function maybe_add_node_to_cursor_stack(node) {
	if (node.base.run_silent == false) {
		add_node_to_cursor_stack(node);
	}
}

function add_node_to_cursor_stack(node) {
	if (typeof node.cursor_index != "undefined") {
		throw Error("add_node_to_cursor_stack: node has already been added");
	}
	// :curr
	node.cursor_index = context.run_state.cursor_index;
	context.run_state.cursor_stack.push(node);
	context.run_state.cursor_index += 1;
	let original = get_original(node);
	let indexes = context.run_state.map_original_to_indexes.get(original);
	if (indexes == null) {
		indexes = new Array();
		context.run_state.map_original_to_indexes.set(original, indexes);
	}
	indexes.push(node.cursor_index);
}

function run_lvalue(node) {
	if (node.base.run_disable) {
		return;
	}
	let return_value;
	if (node.base.kind == Code_Kind.IDENT) {
		maybe_add_node_to_cursor_stack(node);
		if (node.declaration.ident.base.type == null) {
			return_value = 0;
		}
		else if (node.declaration.ident.base.type.base.kind == Type_Kind.VOID) {
			return_value = 0;
		}
		else {
			return_value = node.declaration.ident.pointer;
		}
	}
	else if (node.base.kind == Code_Kind.STRING) {
		return_value = node.pointer;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		if (node.expression != null) {
			return_value = run_lvalue(node.expression);
		}
		else {
			throw Error("run_lvalue: parens doesn't have an expression");
		}
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		node.target.base.is_lhs = node.base.is_lhs;
		// nocheckin
		// @Incomplete
		// we could just do infer_run_disable at the top of the function
		// and also set is_lhs in it
		node.target.base.run_silent = node.base.run_silent;
		node.index.base.run_silent = node.base.run_silent;
		let base_pointer = run_lvalue(node.target);
		run_rvalue(node.index);
		if (node.index.base.result.base.kind != Code_Kind.INTEGER) {
			throw Error("Array index was not an integer");
		}
		let index_value = node.index.base.result.value;
		// nocheckin
		// if (node.target.base.type.base.kind == Type_Kind.STRING) {
		if (node.target.base.type == primitive_type_infos.string) {
			throw Error;
			let pointer_member = primitive_type_infos.string.members.pointer;
			let pointer = get_memory(base_pointer + pointer_member.offset, pointer_member.type);
			return_value = pointer + index_value * pointer_member.type.elem_type.base.size_in_bytes;
		}
		else if (node.target.base.type.base.kind == Type_Kind.ARRAY) {
			return_value = base_pointer + index_value * node.base.type.base.size_in_bytes;
		}
		else {
			throw Error;
		}
		maybe_add_node_to_cursor_stack(node);
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.expression.base.is_lhs = node.base.is_lhs;
		node.expression.base.run_silent = false;
		let pointer = run_lvalue(node.expression);
		return_value = get_memory(pointer, Types.size_t);
		node.base.result = make_integer(return_value);
		node.base.result.base.type = Types.size_t;
		node.base.result.base.result_of = node;
		maybe_add_node_to_cursor_stack(node);
	}
	else if (node.base.kind == Code_Kind.CAST) {
		// @Incomplete
		throw Error;
		return 0;
		if (node.expression.base.type.base.kind != Type_Kind.POINTER) {
			throw Error("Only pointers can be casted as an lvalue");
		}
		return run_lvalue(node.expression);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		node.left.base.is_lhs = node.base.is_lhs;
		node.right.base.is_lhs = node.base.is_lhs;
		node.left.base.run_silent = node.base.run_silent;
		node.right.base.run_silent = node.base.run_silent;
		// @Refactor
		// dynamic arrays are structs
		if (node.left.base.type.base.kind == Type_Kind.ARRAY) {
			if (node.right.base.kind == Code_Kind.IDENT) {
				maybe_add_node_to_cursor_stack(node.left);
				maybe_add_node_to_cursor_stack(node.right);
				if (node.right.name == "count") {
					if (node.left.base.type.length) {
						node.base.result = make_integer(node.left.base.type.length);
						node.base.result.base.type = Types.size_t;
						node.base.result.base.result_of = node;
						// @Cleanup
						// this is probably not necessary
						node.base.result.base.run_silent = true;
						throw Error;
					}
					else {
						throw Error;
						// :DynamicArray
						let base_pointer = node.left.base.pointer;
						let length_offset = node.left.base.type.members.length.offset;
						let length_type = node.left.base.type.members.length.type;
						let length = get_memory(base_pointer + length_offset, length_type);
						node.base.result = make_integer(length);
						node.base.result.base.type = Types.size_t;
						node.base.result.base.result_of = node;
					}
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
				left.base.is_lhs = node.base.is_lhs;
				right.base.is_lhs = node.base.is_lhs;
				if (right.base.kind == Code_Kind.DOT_OPERATOR) {
					pointer += left.base.type.members[right.left.name].offset;
					// @Incomplete
					// how should we handle statically declared structs?
					add_memory_use(right, pointer, right.base.type.size_in_bytes);
					left = right.left;
					right = right.right;
					maybe_add_node_to_cursor_stack(left);
				}
				else if (right.base.kind == Code_Kind.IDENT) {
					maybe_add_node_to_cursor_stack(right);
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
					add_memory_use(right, pointer, right.base.type.size_in_bytes);
					break;
				}
			}
			return_value = pointer;
		}
		maybe_add_node_to_cursor_stack(node);
	}
	else {
		return_value = 0;
	}
	return return_value;
}
function run_rvalue(node) {
	if (node.base.result != null) {
		return;
	}
	if (node.base.run_disable) {
		return;
	}
	node.base.result = null;
	if (node.base.kind == Code_Kind.STATEMENT) {
		throw Error("run_rvalue: statements don't have value");
	}
	let call_stack = context.run_state.call_stack;
	// @Cleanup
	// maybe these can be merged?
	if (node.base.kind == Code_Kind.INTEGER) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.STRING) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		maybe_add_node_to_cursor_stack(node);
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		maybe_add_node_to_cursor_stack(node);
		throw Error("run_rvalue: struct literal incomplete");
		let names = Object.keys(node.value);
		for (let name of names) {
			let member = node.value[name];
			member.base.run_silent = node.base.run_silent;
			run_rvalue(member);
		}
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		maybe_add_node_to_cursor_stack(node);
		for (let element of node.delimited.elements) {
			element.base.run_silent = node.base.run_silent;
			run_rvalue(element);
		}
		node.base.result = node;
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		maybe_add_node_to_cursor_stack(node);
		if (node.base.type.base.kind != Type_Kind.VOID) {
			node.base.result = get_memory_node(node.declaration.ident.pointer, node.base.type);
			node.base.result.base.run_silent = true;
			run_rvalue(node.base.result);
			if (node.base.is_lhs == false) {
				add_memory_use(node, node.declaration.ident.pointer, node.base.type.base.size_in_bytes);
			}
		}
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		node.base.result = math_binop(node);
		maybe_add_node_to_cursor_stack(node);
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		maybe_add_node_to_cursor_stack(node);
		let zero = make_integer(0);
		zero.base.type = Types.int;
		let binop = make_binary_operation(zero, "-", node.expression);
		binop.base.run_silent = true;
		binop.left.base.run_silent = true;
		infer(binop);
		run_rvalue(binop);
		node.base.result = binop.base.result;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		maybe_add_node_to_cursor_stack(node);
		let false_node = make_bool(false);
		let binop = make_binary_operation(false_node, "==", node.expression);
		binop.base.run_silent = true;
		binop.left.base.run_silent = true;
		// @Audit
		// should we just infer here?
		binop.base.type = binop.left.base.type;
		run_rvalue(binop);
		node.base.result = binop.base.result;
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		if (node.base.type.base.kind != Type_Kind.INTEGER) {
			throw Error("Only integers can be incremented");
		}
		node.target.base.is_lhs = true;
		node.target.base.run_silent = true;
		let lhs_pointer = run_lvalue(node.target);
		node.target.base.run_silent = false;
		run_rvalue(node.target);
		let cloned_target = clone(node.target);
		let one = make_integer(1);
		let binop = make_binary_operation(cloned_target, make_operator("+"), one);
		binop.left.base.run_silent = true;
		binop.right.base.run_silent = true;
		binop.base.run_silent = true;
		infer(binop);
		run_rvalue(binop);
		node.base.result = binop.base.result;
		set_memory_node(lhs_pointer, node.base.result);
		add_memory_change(node.target, lhs_pointer, node.target.base.type.base.size_in_bytes);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		if (node.base.type.base.kind != Type_Kind.INTEGER) {
			throw Error("Only integers can be decremented");
		}
		node.target.base.is_lhs = true;
		node.target.base.run_silent = true;
		let lhs_pointer = run_lvalue(node.target);
		node.target.base.run_silent = false;
		run_rvalue(node.target);
		let cloned_target = clone(node.target);
		let one = make_integer(1);
		let binop = make_binary_operation(cloned_target, make_operator("-"), one);
		binop.left.base.run_silent = true;
		binop.right.base.run_silent = true;
		binop.base.run_silent = true;
		infer(binop);
		run_rvalue(binop);
		node.base.result = binop.base.result;
		set_memory_node(lhs_pointer, node.base.result);
		add_memory_change(node.target, lhs_pointer, node.target.base.type.base.size_in_bytes);
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		if (node.expression != null) {
			run_rvalue(node.expression);
			node.base.result = node.expression.base.result;
		}
		else {
			throw Error("run_rvalue: parens doesn't have an expression");
		}
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		let elem_pointer = run_lvalue(node);
		// nocheckin
		// @Incomplete
		// bounds check
		node.base.result = get_memory_node(elem_pointer, node.base.type);
		// @Incomplete
		// how should we handle statically declared arrays?
		add_memory_use(node, elem_pointer, node.base.type.base.size_in_bytes);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		maybe_add_node_to_cursor_stack(node);
		maybe_add_node_to_cursor_stack(node.expression);
		node.expression.base.run_silent = true;
		let pointer = run_lvalue(node.expression);
		node.expression.base.run_silent = false;
		node.base.pointer = pointer;
		node.base.result = make_integer(pointer);
		node.base.result.base.type = Types.size_t;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		node.base.result = get_memory_node(run_lvalue(node), node.base.type);
	}
	else if (node.base.kind == Code_Kind.CAST) {
		run_rvalue(node.expression);
		if (node.expression.base.type.base.kind == Type_Kind.INTEGER) {
			if (node.base.type.base.kind == Type_Kind.INTEGER) {
				node.base.result = make_integer(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.FLOAT) {
				node.base.result = make_float(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.BOOL) {
				node.base.result = make_bool(node.expression.base.result.value != 0);
			}
			else if (node.base.type.base.kind == Type_Kind.CHAR) {
				// @Incomplete
				// :SignedMismatch
				node.base.result = make_char(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.ENUM) {
				node.base.result = get_enum_node_from_value(node.expression.base.result.value, node.base.type);
			}
			else {
				throw Error("Trying to cast with incompatible types");
			}
		}
		else if (node.expression.base.type.base.kind == Type_Kind.FLOAT) {
			if (node.base.type.base.kind == Type_Kind.INTEGER) {
				console.log("Warning: casting float to int");
				node.base.result = make_integer(Math.floor(node.expression.base.result.value));
			}
			else if (node.base.type.base.kind == Type_Kind.FLOAT) {
				node.base.result = make_float(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.BOOL) {
				throw Error("Trying to cast float to bool, but that is not allowed");
			}
			else if (node.base.type.base.kind == Type_Kind.CHAR) {
				throw Error("Trying to cast float to char, but that is not allowed");
			}
			else if (node.base.type.base.kind == Type_Kind.ENUM) {
				throw Error("Trying to cast float to enum, but that is not allowed");
			}
			else {
				throw Error("Trying to cast with incompatible types");
			}
		}
		else if (node.expression.base.type.base.kind == Type_Kind.BOOL) {
			if (node.base.type.base.kind == Type_Kind.INTEGER) {
				node.base.result = make_integer(node.expression.base.result.value ? true : false);
			}
			else if (node.base.type.base.kind == Type_Kind.FLOAT) {
				node.base.result = make_float(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.BOOL) {
				node.base.result = make_bool(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.CHAR) {
				node.base.result = make_char(node.expression.base.result.value);
			}
			else if (node.base.type.base.kind == Type_Kind.ENUM) {
				node.base.result = get_enum_node_from_value(node.expression.base.result.value ? 1 : 0, node.base.type);
			}
			else {
				throw Error("Trying to cast with incompatible types");
			}
		}
		else if (node.expression.base.type.base.kind == Type_Kind.ARRAY) {
			// :DynamicArray
			let elem_type = node.base.type.elem_type;
			let length = node.expression.base.type.length;
			let value = new Array(length);
			let elements = node.expression.base.result.value;
			for (let i = 0; i < elements.length; i += 1) {
				let element = elements[i];
				value[i] = do_implicit_cast(elem_type, element);
			}
			node.base.result = make_array_literal(value, node.base.type);
		}
		else if (node.expression.base.type.base.kind == Type_Kind.STRUCT) {
			if (node.base.type.base.kind == Type_Kind.STRUCT) {
				let value = new Object();
				let members = node.base.type.members;
				let names = Object.keys(members);
				let expr_members = node.expression.base.result.value;
				let expr_names = Object.keys(expr_members);
				for (let name of names) {
					if (name in expr_members == false) {
						throw Error("Missing '" + name + "' in the source when casting to struct type");
					}
					let member = members[name];
					let expr_member = expr_members[name];
					value[name] = do_implicit_cast(member.type, expr_member);
				}
				for (let expr_name of expr_names) {
					if (expr_name in members == false) {
						throw Error("Missing '" + name + "' in the destination when casting from struct type");
					}
				}
			}
			node.base.result = make_struct_literal(value, node.base.type);
			throw Error;
		}
		else {
			throw Error("Unhandled cast");
		}
		node.base.result.base.type = node.base.type;
		maybe_add_node_to_cursor_stack(node);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		// @Refactor
		// :DynamicArray
		// dynamic arrays are structs
		// nocheckin
		// @Cleanup
		if (node.left.base.type.base.kind == Type_Kind.ARRAY) {
			if (node.right.base.kind == Code_Kind.IDENT) {
				if (node.right.name == "count") {
					// @Incomplete
					// need to use the actual array struct
					// :DynamicArray
					node.base.result = make_integer(node.left.base.type.size);
					node.base.result.base.type = node.base.type;
				}
				else {
					throw Error;
				}
				node.left.base.run_silent = node.base.run_silent;
				node.right.base.run_silent = node.base.run_silent;
				maybe_add_node_to_cursor_stack(node.left);
				maybe_add_node_to_cursor_stack(node.right);
				maybe_add_node_to_cursor_stack(node);
			}
			else {
				throw Error;
			}
		}
		else if (node.left.base.type.base.kind == Type_Kind.ENUM) {
			if (node.right.base.kind == Code_Kind.IDENT) {
				node.base.result = get_value_node_from_enum_node(node, node.base.type);
			}
			else {
				throw Error;
			}
			maybe_add_node_to_cursor_stack(node);
		}
		else {
			node.base.result = get_memory_node(run_lvalue(node), node.base.type);
		}
	}
	else if (node.base.kind == Code_Kind.CALL) {
		add_procedure_call(node);
		call_stack.push(node);
		node.returned = false;
		let proc_decl = node.procedure.declaration;
		if (proc_decl.expression.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
			// :MultipleReturns
			let call_scope = make_scope();
			let statements = new Array();
			let return_decls = new Array();
			let param_decls = new Array();
			if (proc_decl.expression.returns == null) {
				let retn_type = clone(Types.void);
				let retn_ident = make_ident("return_" + proc_decl.ident.name);
				let retn_decl = make_declaration(retn_ident, retn_type);
				retn_decl.base.enclosing_scope = call_scope;
				retn_decl.base.was_generated = true;
				return_decls.push(retn_decl);
			}
			else {
				let retns = proc_decl.expression.returns.elements;
				for (let i = 0; i < retns.length; i += 1) {
					let retn = retns[i];
					let retn_decl = null;
					let retn_name = "return_" + proc_decl.ident.name;
					if (retn.base.kind == Code_Kind.DECLARATION) {
						retn_decl = clone(retn);
						retn_decl.ident.name = retn_name + retn_decl.ident.name;
					}
					else {
						let retn_type = clone(retn);
						if (retns.length > 1) {
							retn_name += i + 1;
						}
						let retn_ident = make_ident(retn_name);
						retn_decl = make_declaration(retn_ident, retn_type);
					}
					retn_decl.base.enclosing_scope = call_scope;
					retn_decl.base.was_generated = true;
					retn_decl.base.generated_from = retn;
					retn_decl.ident.base.generated_from = retn;
					return_decls.push(retn_decl);
				}
			}
			for (let retn_decl of return_decls) {
				let retn_stmt = make_statement(retn_decl);
				retn_stmt.base.was_generated = true;
				statements.push(retn_stmt);
			}
			let original_param_decls = proc_decl.expression.parameters.elements;
			for (let i = 0; i < original_param_decls.length; i += 1) {
				let param_decl = original_param_decls[i];
				let cloned_param_decl = clone(param_decl);
				cloned_param_decl.base.was_generated = true;
				param_decls.push(cloned_param_decl);
			}
			for (let param_decl of param_decls) {
				let param_stmt = make_statement(param_decl);
				param_stmt.base.was_generated = true;
				statements.push(param_stmt);
			}
			let cloned_proc_block = clone(proc_decl.expression.block);
			// nocheckin
			// is the code easier to read when we don't have an extra block and level of indentation?
			// or when there is a clear separation between returns, parameters, and declarations in the function body?
			cloned_proc_block.delimited.is_implicit = implicit_call_block;
			cloned_proc_block.delimited.base.was_generated = true;
			cloned_proc_block.base.was_generated = true;
			let cloned_proc_block_stmt = make_statement(cloned_proc_block);
			cloned_proc_block_stmt.base.was_generated = true;
			statements.push(cloned_proc_block_stmt);
			node.block = make_block(statements);
			node.block.base.enclosing_scope = proc_decl.expression.scope;
			node.block.delimited.is_implicit = true;
			node.block.delimited.base.was_generated = true;
			node.block.base.was_generated = true;
			infer(node.block);
			if (param_decls.length < node.args.length) {
				throw Error("run_rvalue: passed too many arguments to call!");
			}
			for (let i = 0; i < param_decls.length; i += 1) {
				let param_decl = param_decls[i];
				let arg = null;
				// @Incomplete
				// :NamedArguments
				if (i < node.args.elements.length) {
					arg = node.args.elements[i];
				}
				if (arg != null) {
					let cloned_arg = clone(arg);
					cloned_arg.base.enclosing_scope = arg.base.enclosing_scope;
					infer(cloned_arg);
					param_decl.expression = cloned_arg;
				}
				else if (param_decl.expression != null) {
					// @Incomplete
					// :DefaultArguments
					throw Error("not yet implemented: default arguments for calls");
				}
				else {
					throw Error("run_rvalue: did not pass enough arguments to call!");
				}
				param_decl.expression_operator = make_operator("=");
			}
			// @Incomplete
			// :MultipleReturns
			node.base.replacement = clone(return_decls[0].ident);
			node.base.replacement.base.was_generated = true;
			// @Incomplete
			// need to move between return declarations of many calls of the same function 
			infer(node.base.replacement);
			run_statement(node.block);
			// copy the results of arguments back into the call
			for (let i = 0; i < param_decls.length; i += 1) {
				// :NamedArguments
				let arg = node.args.elements[i];
				let param_decl = param_decls[i];
				let cloned_result = clone(param_decl.expression.base.result);
				cloned_result.base.enclosing_scope = arg.base.enclosing_scope;
				infer(cloned_result);
				arg.base.result = cloned_result;
			}
			node.returned = true;
		}
		else if (node.procedure.declaration.expression.base.kind == Code_Kind.SYSCALL) {
			throw Error("Syscalls are not handled yet");
		}
		if (node.returned == false) {
			throw Error("Call did not return");
		}
		let block_stmt = make_statement(node.block);
		block_stmt.base.was_generated = true;
		maybe_add_node_to_cursor_stack(node);
		call_stack.pop();
	}
	else if (node.base.kind == Code_Kind.SYSCALL) {
		node.returned = false;
		for (let arg of node.args) {
			run_rvalue(arg);
		}
		run_syscall(node, node.args);
		if (node.base.result) {
			node.base.type = node.base.result.base.type;
		}
		node.returned = true;
		maybe_add_node_to_cursor_stack(node);
	}
	else if(node.base.kind == Code_Kind.POINTER_TYPE) {
		node.base.result = node;
		throw Error("Trying to run pointer type");
	}
	else if(node.base.kind == Code_Kind.ARRAY_TYPE) {
		node.base.result = node;
		throw Error("Trying to run array type");
	}
	else {
		run_lvalue(node);
	}
	// @Cleanup
	if (node.base.result != null) {
		let types_match = check_that_types_match(node.base.result.base.type, node.base.type);
		if (types_match == false && node.base.type.base.kind == Type_Kind.ENUM) {
			types_match = check_that_types_match(node.base.result.base.type, node.base.type.elem_type);
		}
		if (types_match == false) {
			throw Error("run_rvalue had a result with an invalid type");
		}
	}
	else {
		if (node.base.type.base.kind != Type_Kind.VOID) {
			throw Error("run_rvalue had no result, but the type was not void");
		}
	}
	after_run(node);
}
function run_statement(node) {
	// nocheckin enable
	// this should also be in run_rvalue and run_lvalue
	// debug_timeout_poll();
	if (taking_too_long) {
		throw Error("Execution is taking too long, probably an infinite loop");
	}
	if (node == null) {
		return;
	}
	if (node.base.run_disable) {
		return;
	}
	let block_stack = context.run_state.block_stack;
	let loop_stack = context.run_state.loop_stack;
	let call_stack = context.run_state.call_stack;
	let last_loop = loop_stack[loop_stack.length-1];
	let last_call = call_stack[call_stack.length-1];
	if (node.base.kind == Code_Kind.STATEMENT) {
		run_statement(node.expression);
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		block_stack.push(node);
		init_block_allocations(node);
		let should_run_statement = true;
		for (let stmt of node.delimited.elements) {
			if (should_run_statement) {
				run_statement(stmt);
			}
			else {
				stmt.base.run_disable = true;
			}
			if ((last_call && last_call.returned) ||
				(last_loop && (last_loop.broken || last_loop.continued))) {

				should_run_statement = false;
			}
		}
		deinit_block_allocations(node);
		block_stack.pop();
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		if (node.expression != null && node.expression.base.run_disable == true) {
			node.base.run_disable = true;
		}
		else {
			maybe_add_node_to_cursor_stack(node.ident);
			node.ident.base.is_lhs = true;
			// nocheckin
			// @Cleanup
			// instead of this, we can press Shift + WS
			// :TypeInfo
			if (node.base.type && node.ident.base.type.base.kind == Type_Kind.VOID) {
				node.ident.is_void_return = true;
			}
			else if (node.ident.base.type && node.ident.base.type.base.size_in_bytes) {
				// :MemoryInitialize
				// :TypeInfo
				const size_in_bytes = node.ident.base.type.base.size_in_bytes;
				let bytes = new Array(size_in_bytes);
				bytes.fill(0);
				set_memory_bytes(context.run_state.stack_pointer, size_in_bytes, bytes);
				let prev_value = get_memory_node(context.run_state.stack_pointer, node.ident.base.type);
				node.ident.base.result = prev_value;
				node.ident.pointer = context.run_state.stack_pointer;
				context.run_state.stack_pointer += size_in_bytes;
				node.base.enclosing_scope.block.allocations.push(node);
				if (node.expression && node.ident.base.type) {
					let type = node.ident.base.type;
					run_rvalue(node.expression);
					let expression_type = node.expression.base.type;
					set_memory_node(node.ident.pointer, type, node.expression.base.result);
				}
				add_memory_change(node.ident, node.ident.pointer, node.ident.base.type.base.size_in_bytes);
			}
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		if (node.target.base.kind == Code_Kind.IDENT) {
			let expression_operator = node.target.declaration.expression_operator;
			if (expression_operator != null && expression_operator.str == ":") {
				throw Error("trying to assign to a const identifier");
			}
		}
		node.target.base.is_lhs = true;
		run_rvalue(node.target);
		run_rvalue(node.expression);
		node.target.base.run_silent = true;
		let lhs_pointer = run_lvalue(node.target);
		node.target.base.run_silent = false;
		set_memory_node(lhs_pointer, node.target.base.type, node.expression.base.result);
		add_memory_change(node.target, lhs_pointer, node.target.base.type.base.size_in_bytes);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		node.target.base.is_lhs = true;
		let cloned_target = clone(node.target);
		cloned_target.base.enclosing_scope = node.base.enclosing_scope;
		cloned_target.base.was_generated = true;
		let operation_type = node.operator.str.slice(0, node.operator.str.length-1);
		let binop_operator = make_operator(operation_type);
		binop_operator.base.was_generated = true;
		const binop = make_binary_operation(cloned_target, binop_operator, node.expression);
		binop.base.enclosing_scope = node.base.enclosing_scope;
		binop.base.was_generated = true;
		let assign = make_assign(node.target, binop);
		assign.base.enclosing_scope = node.base.enclosing_scope;
		assign.base.was_generated = true;
		infer(assign);
		assign.base.run_silent = true;
		binop.base.run_silent = true;
		cloned_target.base.run_silent = true;
		run_statement(assign);
	}
	else if (node.base.kind == Code_Kind.IF) {
		run_rvalue(node.condition);
		if (node.condition.base.result.value == true) {
			if (node.else_stmt != null) {
				node.else_stmt.base.run_disable = true;
			}
		}
		else {
			node.statement.base.run_disable = true;
		}
		run_statement(node.statement);
		let replacement_block = make_block();
		replacement_block.base.enclosing_scope = node.enclosing_scope;
		infer(replacement_block);
		node.statement.base.replacement = replacement_block;
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		run_statement(node.statement);
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		loop_stack.push(node);
		node.base.replacement = make_block(new Array());
		node.base.replacement.base.enclosing_scope = node.base.enclosing_scope;
		node.base.replacement.base.was_generated = true;
		node.base.replacement.delimited.base.was_generated = true;
		node.base.replacement.delimited.is_implicit = true;
		infer(node.base.replacement);
		if (node.condition == null) {
			node.condition = make_bool(true);
		}
		last_loop = node;
		node.broken = false;
		let should_run = true;
		while (should_run) {
			let condition = clone(node.condition);
			let then_keyword = null;
			if (node.statement.expression.base.kind != Code_Kind.BLOCK) {
				then_keyword = make_keyword("then");
			}
			let cloned_stmt = clone(node.statement);
			let cycle = make_if(condition, cloned_stmt, null, then_keyword);
			cycle.loop = node;
			let cycle_stmt = make_statement(cycle);
			cycle_stmt.base.enclosing_scope = node.base.replacement.delimited.scope;
			cycle_stmt.base.was_generated = true;
			node.continued = false;
			infer(cycle_stmt);
			run_statement(cycle_stmt);
			should_run = cycle.condition.base.result.value;
			node.base.replacement.delimited.elements.push(cycle_stmt);
			if (last_call && last_call.returned) {
				break;
			}
			if (last_loop && last_loop.broken) {
				break;
			}
		}
		let replacement_block = make_block();
		replacement_block.base.enclosing_scope = node.enclosing_scope;
		infer(replacement_block);
		node.statement.base.replacement = replacement_block;
		update_delimited(node.base.replacement.delimited);
		loop_stack.pop();
	}
	else if (node.base.kind == Code_Kind.FOR) {
		// @Audit
		// this was written a long time ago
		// maybe there is a better way to do this
		loop_stack.push(node);
		node.base.replacement = clone(node.block);
		node.base.replacement.base.enclosing_scope = node.base.enclosing_scope;
		node.base.replacement.base.was_generated = true;
		node.base.replacement.delimited.base.was_generated = true;
		node.base.replacement.delimited.is_implicit = true;
		infer(node.base.replacement);
		init_block_allocations(node.base.replacement);
		for (let stmt of node.base.replacement.delimited.elements) {
			if (stmt.expression.base.kind != Code_Kind.DECLARATION) {
				throw Error("run_statement: error in for loop");
			}
			run_statement(stmt);
		}
		last_loop = node;
		node.broken = false;
		let should_run = true;
		let first_cycle = true;
		while (should_run) {
			if (first_cycle == true) {
				first_cycle = false;
			}
			else {
				let cloned_it_index_assign = clone(node.it_index_assign);
				cloned_it_index_assign.base.clone_of = null;
				cloned_it_index_assign.base.enclosing_scope = node.base.replacement.delimited.scope;
				infer(cloned_it_index_assign);
				run_statement(cloned_it_index_assign);
				node.base.replacement.delimited.elements.push(cloned_it_index_assign);

				let cloned_it_assign = clone(node.it_assign);
				cloned_it_assign.base.clone_of = null;
				cloned_it_assign.base.enclosing_scope = node.base.replacement.delimited.scope;
				infer(cloned_it_assign);
				run_statement(cloned_it_assign);
				node.base.replacement.delimited.elements.push(cloned_it_assign);
			}

			let cloned_condition = clone(node.condition);
			cloned_condition.base.clone_of = null;
			let then_keyword = null;
			if (node.statement.expression.base.kind != Code_Kind.BLOCK) {
				then_keyword = make_keyword("then");
			}
			let cloned_stmt = clone(node.statement);
			let cycle = make_if(cloned_condition, cloned_stmt, null, then_keyword);
			cycle.loop = node;
			let cycle_stmt = make_statement(cycle);
			cycle_stmt.base.enclosing_scope = node.base.replacement.delimited.scope;
			cycle_stmt.base.was_generated = true;
			node.continued = false;
			infer(cycle_stmt);
			run_statement(cycle_stmt);
			should_run = cycle.condition.base.result.value;
			node.base.replacement.delimited.elements.push(cycle_stmt);

			if (last_call && last_call.returned) {
				break;
			}
			if (last_loop && last_loop.broken) {
				break;
			}
		}
		let replacement_block = make_block();
		replacement_block.base.enclosing_scope = node.enclosing_scope;
		infer(replacement_block);
		node.statement.base.replacement = replacement_block;
		update_delimited(node.base.replacement.delimited);
		deinit_block_allocations(node.base.replacement);
		loop_stack.pop();
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		maybe_add_node_to_cursor_stack(node);
		last_loop.broken = true;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		maybe_add_node_to_cursor_stack(node);
		last_loop.continued = true;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		let cloned_ident = clone(last_call.base.replacement);
		cloned_ident.base.enclosing_scope = node.base.enclosing_scope;
		cloned_ident.base.was_generated = true;
		cloned_ident.base.generated_from = node;
		if (node.expression != null) {
			if (last_call.base.type.kind == Type_Kind.VOID) {
				throw Error("Trying to return with an expression but the procedure has no return type");
			}
			let cloned_expression = clone(node.expression);
			let assign = make_assign(cloned_ident, cloned_expression);
			assign.base.enclosing_scope = node.base.enclosing_scope;
			assign.base.was_generated = true;
			infer(assign);
			run_statement(assign);
			// :MultipleReturns
			last_call.base.result = clone(assign.expression.base.result);
			let types_match = check_that_types_match(last_call.base.result.base.type, last_call.base.type);
			if (types_match == false) {
				last_call.base.result = do_implicit_cast(last_call.base.type, assign.expression.base.result);
				types_match = check_that_types_match(last_call.base.result.base.type, last_call.base.type);
			}
			if (types_match == false) {
				throw Error("run_statement: return expression result did not match call return type");
			}
			node.base.replacement = assign;
		}
		else {
			node.base.replacement = cloned_ident;
		}
		last_call.returned = true;
	}
	else {
		run_rvalue(node);
	}
	after_run(node);
}
function after_run(node) {
	if (node.base.replacement != null) {
		node.base.replacement.base.replacement_of = node;
	}
	if (node.base.result != null) {
		node.base.result.base.result_of = node;
		node.base.result.base.enclosing_scope = node.base.enclosing_scope;
		// nocheckin
		// this messes up node.base.result.base.type
		// signed integer becomes unsigned
		// infer(node.base.result);
	}
}
function init_block_allocations(node) {
	node.allocations = new Array();
}
function deinit_block_allocations(node) {
	for (let i = 0; i < node.allocations.length; i += 1) {
		let decl = node.allocations[i];
		context.run_state.stack_pointer -= decl.ident.base.type.base.size_in_bytes;
	}
}

function compare_array(left, right) {
	let max_index = Math.min(left.length, right.length);
	for (let i = 0; i < max_index; i += 1) {
		if (left[i] != right[i]) {
			return false;
		}
	}
	return true;
}
function strcmp(left, right) {
	throw Error;
	let pointer_member = primitive_type_infos.string.members.pointer;
	let length_member = primitive_type_infos.string.members.length;

	let left_pointer = get_memory(left.pointer + pointer_member.offset, pointer_member.type);
	let left_length = get_memory(left.pointer + length_member.offset, length_member.type);

	let right_pointer = get_memory(right.pointer + pointer_member.offset, pointer_member.type);
	let right_length = get_memory(right.pointer + length_member.offset, length_member.type);

	if (left_pointer == right_pointer && left_length && right_length) {
		return true;
	}
	let left_bytes = get_memory_bytes(left_pointer, left_length);
	let right_bytes = get_memory_bytes(right_pointer, right_length);
	if (compare_array(left_bytes, right_bytes)) {
		return true;
	}
	else {
		return false;
	}
}
function math_binop(node) {
	run_rvalue(node.left);
	run_rvalue(node.right);
	let left = node.left;
	let right = node.right;
	let operation_type = node.operator.str;
	let type = node.base.type;
	let left_type_kind = left.base.type.base.kind;
	let right_type_kind = right.base.type.base.kind;
	// @Cleanup
	// :TypeInfo
	if (left.base.type == primitive_type_infos.string) {
		left_type_kind = Type_Kind.STRING;
	}
	if (right.base.type == primitive_type_infos.string) {
		right_type_kind = Type_Kind.STRING;
	}
	if (left_type_kind == Type_Kind.STRING && right_type_kind == Type_Kind.STRING) {
		if (operation_type == "+") {
			throw Error;
			let pointer_member = primitive_type_infos.string.members.pointer;
			let length_member = primitive_type_infos.string.members.length;
			let struct_pointer = allocate_memory(primitive_type_infos.string.base.size_in_bytes);
			let left_pointer = left.value.pointer.value;
			let left_length = left.value.length.value;
			let left_bytes = get_memory_bytes(left_pointer, left_length);
			let right_pointer = right.value.pointer.value;
			let right_length = right.value.length.value;
			let right_bytes = get_memory_bytes(right_pointer, right_length);
			let result_length = left_length + right_length;
			// :Alignment
			let allocation_size = result_length * pointer_member.type.elem_type.base.size_in_bytes;
			const padding_size = pointer_member.type.base.size_in_bytes;
			const padding = (padding_size - (allocation_size % padding_size) % padding_size);
			allocation_size += padding;
			let char_pointer = allocate_memory(allocation_size);
			set_memory_bytes(char_pointer, left_length, left_bytes);
			set_memory_bytes(char_pointer + left_bytes.length, right_length, right_bytes);
			set_memory(struct_pointer + pointer_member.offset, pointer_member.type, char_pointer);
			set_memory(struct_pointer + length_member.offset, length_member.type, result_length);
			let result = get_memory_node(struct_pointer, primitive_type_infos.string);
			result.str = get_memory_string(result.value.pointer.value, result.value.length.value);
			return result;
		}
		else if (operation_type == "==") {
			let result = make_bool(strcmp(left, right));
			return result;
		}
		else if (operation_type == "!=") {
			let result = make_bool(!strcmp(left, right));
			return result;
		}
		else {
			throw Error("Operator '" + operation_type + "' is not allowed on strings");
		}
	}
	else {
		let string;
		let char;
		if (left_type_kind == Type_Kind.STRING && right_type_kind == Type_Kind.CHAR) {
			string = left;
			char = right;
		}
		else if (left_type_kind == Type_Kind.CHAR && right_type_kind == Type_Kind.STRING) {
			string = right;
			char = left;
		}
		if (string && char) {
			if (operation_type == "+") {
				let pointer_member = primitive_type_infos.string.members.pointer;
				let length_member = primitive_type_infos.string.members.length;
				let struct_pointer = allocate_memory(primitive_type_infos.string.base.size_in_bytes);
				let string_pointer = string.value.pointer.value;
				let string_length = string.value.length.value;
				let string_bytes = get_memory_bytes(string_pointer, string_length);
				let result_length = string_length + 1;
				// :Alignment
				let allocation_size = result_length * pointer_member.type.elem_type.base.size_in_bytes;
				const padding_size = pointer_member.type.base.size_in_bytes;
				const padding = (padding_size - (allocation_size % padding_size) % padding_size);
				allocation_size += padding;
				let char_pointer = allocate_memory(allocation_size);
				set_memory_bytes(char_pointer, string_length, string_bytes);
				set_memory_bytes(char_pointer + string_bytes.length, char.base.type.base.size_in_bytes, [char.value]);
				let str = get_memory_string(char_pointer, result_length);
				let result = make_string(str);
				let pointer = make_integer(char_pointer);
				let length = make_integer(result_length);
				pointer.base.type = primitive_type_infos.string.members.pointer.type;
				length.base.type = primitive_type_infos.string.members.length.type;
				result.value = {pointer: pointer, length: length};
				set_memory_node(struct_pointer, primitive_type_infos.string, result);
				return result;
			}
			else if (operation_type == "==" || operation_type == "!=") {
				throw Error("Strings and chars cannot be compared");
			}
			else {
				throw Error("Unhandled operation type with string and char");
			}
		}
	} 
	if (left_type_kind == Type_Kind.CHAR && right_type_kind == Type_Kind.CHAR) {
		if (operation_type == "+") {
			// allocate_string()
			throw Error;
			let struct_pointer = allocate_memory(primitive_type_infos.string.base.size_in_bytes);
			let pointer_member = primitive_type_infos.string.members.pointer;
			let length_member = primitive_type_infos.string.members.length;
			let result_length = 1 + 1;
			// :Alignment
			let allocation_size = result_length * pointer_member.type.elem_type.base.size_in_bytes;
			const padding_size = pointer_member.type.base.size_in_bytes;
			const padding = (padding_size - (allocation_size % padding_size) % padding_size);
			allocation_size += padding;
			let char_pointer = allocate_memory(allocation_size);
			set_memory_bytes(char_pointer, left.base.type.base.size_in_bytes, [left.value]);
			set_memory_bytes(char_pointer + left.base.type.base.size_in_bytes, right.base.type.base.size_in_bytes, [right.value]);
			let str = get_memory_string(char_pointer, result_length);
			let result = make_string(str);
			let pointer = make_integer(char_pointer);
			let length = make_integer(result_length);
			pointer.base.type = primitive_type_infos.string.members.pointer.type;
			length.base.type = primitive_type_infos.string.members.length.type;
			result.value = {pointer: pointer, length: length};
			set_memory_node(struct_pointer, primitive_type_infos.string, result);
			return result;
		}
	}
	if (left_type_kind == Type_Kind.ENUM && right_type_kind == Type_Kind.ENUM) {
		let binop = make_binary_operation(left.base.result, operation_type, right.base.result);
		binop.base.run_silent = true;
		// nocheckin
		// this is probably not necessary
		// or maybe it is
		binop.left.base.run_silent = true;
		binop.right.base.run_silent = true;
		binop.base.enclosing_scope = node.base.enclosing_scope;
		infer(binop);
		run_rvalue(binop);
		throw Error("enum binop incomplete");
		return binop.base.result;
	}
	// :PointerMath
	if (left.base.type) {
		if (left.base.type.base.kind == Type_Kind.POINTER) {
			if (right.base.type && right.base.type.base.kind == Type_Kind.POINTER) {
				throw Error("Pointer math requires only one pointer, not two");
			}
			else {
				right.value *= left.base.type.elem_type.base.size_in_bytes;
			}
		}
	}
	else if (right.base.type && right.base.type.base.kind == Type_Kind.POINTER) {
		if (left.base.type) {
			if (left.base.type.base.kind == Type_Kind.POINTER) {
				throw Error("Pointer math requires only one pointer, not two");
			}
			else {
				left.value *= right.base.type.elem_type.base.size_in_bytes;
			}
		}
	}
	// arithmetic
	let result = make_node_from_type(type);
	left = left.base.result;
	right = right.base.result;
	if (operation_type == "+") {
		result.value = left.value + right.value;
	}
	else if (operation_type == "-") {
		result.value = left.value - right.value;
	}
	else if (operation_type == "*") {
		result.value = left.value * right.value;
	}
	else if (operation_type == "/") {
		result.value = left.value / right.value;
	}
	else if (operation_type == "%") {
		result.value = left.value % right.value;
	}
	else if (operation_type == "<") {
		result.value = left.value < right.value;
	}
	else if (operation_type == ">") {
		result.value = left.value > right.value;
	}
	else if (operation_type == "<=") {
		result.value = left.value <= right.value;
	}
	else if (operation_type == ">=") {
		result.value = left.value >= right.value;
	}
	else if (operation_type == "==") {
		result.value = left.value == right.value;
	}
	else if (operation_type == "!=") {
		result.value = left.value != right.value;
	}
	else if (operation_type == "&&") {
		result.value = left.value && right.value;
	}
	else if (operation_type == "||") {
		result.value = left.value || right.value;
	}
	else if (operation_type == "&") {
		result.value = left.value & right.value;
	}
	else if (operation_type == "|") {
		result.value = left.value | right.value;
	}
	return result;
}

function mark_containment(node) {
	if (node == null) {
		return;
	}
	node.is_cursor = Object.is(node, context.view_state.node);
	let bookmarks = get_expanding_bookmarks();
	node.is_bookmark = bookmark_array_has_index(bookmarks, node.cursor_index);
	node.contains_bookmark = node.is_bookmark;
	node.contains_cursor = node.is_cursor;
	if (node.base.kind == Code_Kind.DELIMITED) {
		for (let elem of node.elements) {
			mark_containment(elem);
			node.contains_bookmark |= elem.contains_bookmark;
			node.contains_cursor |= elem.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		mark_containment(node.delimited);
		node.contains_bookmark |= node.delimited.contains_bookmark;
		node.contains_cursor |= node.delimited.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			mark_containment(node.expression);
			node.contains_bookmark |= node.expression.contains_bookmark;
			node.contains_cursor |= node.expression.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.STRING) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		for (let element of node.delimited.elements) {
			mark_containment(element);
			node.contains_bookmark |= element.contains_bookmark;
			node.contains_cursor |= element.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		throw Error("mark_containment: struct literal incomplete");
		let names = Object.keys(node.value);
		for (let name of names) {
			let member = node.value[name];
			mark_containment(member);
			node.contains_bookmark |= member.contains_bookmark;
			node.contains_cursor |= member.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		mark_containment(node.block);
		node.contains_bookmark |= node.block.contains_bookmark;
		node.contains_cursor |= node.block.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		mark_containment(node.block);
		node.contains_bookmark |= node.block.contains_bookmark;
		node.contains_cursor |= node.block.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		if (node.parameters != null) {
			mark_containment(node.parameters);
			node.contains_bookmark |= node.parameters.contains_bookmark;
			node.contains_cursor |= node.parameters.contains_cursor;
		}
		if (node.operator != null) {
			mark_containment(node.operator);
			node.contains_bookmark |= node.operator.contains_bookmark;
			node.contains_cursor |= node.operator.contains_cursor;
		}
		if (node.returns != null) {
			mark_containment(node.returns);
			node.contains_bookmark |= node.returns.contains_bookmark;
			node.contains_cursor |= node.returns.contains_cursor;
		}
		if (node.block != null) {
			mark_containment(node.block);
			node.contains_bookmark |= node.block.contains_bookmark;
			node.contains_cursor |= node.block.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		mark_containment(node.ident);
		node.contains_bookmark |= node.ident.contains_bookmark;
		node.contains_cursor |= node.ident.contains_cursor;
		if (node.expression) {
			mark_containment(node.expression);
			node.contains_bookmark |= node.expression.contains_bookmark;
			node.contains_cursor |= node.expression.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		mark_containment(node.target);
		node.contains_bookmark |= node.target.contains_bookmark;
		node.contains_cursor |= node.target.contains_cursor;
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		mark_containment(node.target);
		node.contains_bookmark |= node.target.contains_bookmark;
		node.contains_cursor |= node.target.contains_cursor;
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		mark_containment(node.delimited);
		node.contains_bookmark |= node.delimited.contains_bookmark;
		node.contains_cursor |= node.delimited.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		mark_containment(node.target);
		node.contains_bookmark |= node.target.contains_bookmark;
		node.contains_cursor |= node.target.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		mark_containment(node.target);
		node.contains_bookmark |= node.target.contains_bookmark;
		node.contains_cursor |= node.target.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		mark_containment(node.left);
		node.contains_bookmark |= node.left.contains_bookmark;
		node.contains_cursor |= node.left.contains_cursor;
		mark_containment(node.right);
		node.contains_bookmark |= node.right.contains_bookmark;
		node.contains_cursor |= node.right.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		mark_containment(node.target);
		node.contains_bookmark |= node.target.contains_bookmark;
		node.contains_cursor |= node.target.contains_cursor;
		mark_containment(node.index);
		node.contains_bookmark |= node.index.contains_bookmark;
		node.contains_cursor |= node.index.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		mark_containment(node.left);
		node.contains_bookmark |= node.left.contains_bookmark;
		node.contains_cursor |= node.left.contains_cursor;
		mark_containment(node.right);
		node.contains_bookmark |= node.right.contains_bookmark;
		node.contains_cursor |= node.right.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.CALL) {
		if (node.block != null) {
			mark_containment(node.block);
			node.contains_bookmark |= node.block.contains_bookmark;
			node.contains_cursor |= node.block.contains_cursor;
		}
		for (let arg of node.args.elements) {
			mark_containment(arg);
			node.contains_bookmark |= arg.contains_bookmark;
			node.contains_cursor |= arg.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		// leaf node
	}
	else if (node.base.kind == Code_Kind.IF) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
		mark_containment(node.condition);
		node.contains_bookmark |= node.condition.contains_bookmark;
		node.contains_cursor |= node.condition.contains_cursor;
		if (node.then_keyword != null) {
			mark_containment(node.then_keyword);
			node.contains_bookmark |= node.then_keyword.contains_bookmark;
			node.contains_cursor |= node.then_keyword.contains_cursor;
		}
		mark_containment(node.statement);
		node.contains_bookmark |= node.statement.contains_bookmark;
		node.contains_cursor |= node.statement.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
		mark_containment(node.statement);
		node.contains_bookmark |= node.statement.contains_bookmark;
		node.contains_cursor |= node.statement.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
		if (node.base.replacement != null) {
			mark_containment(node.base.replacement);
			node.contains_bookmark |= node.base.replacement.contains_bookmark;
			node.contains_cursor |= node.base.replacement.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.FOR) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
		if (node.base.replacement != null) {
			mark_containment(node.base.replacement);
			node.contains_bookmark |= node.base.replacement.contains_bookmark;
			node.contains_cursor |= node.base.replacement.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.BREAK) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.CONTINUE) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		mark_containment(node.keyword);
		node.contains_bookmark |= node.keyword.contains_bookmark;
		node.contains_cursor |= node.keyword.contains_cursor;
		if (node.base.replacement != null) {
			mark_containment(node.base.replacement);
			node.contains_bookmark |= node.base.replacement.contains_bookmark;
			node.contains_cursor |= node.base.replacement.contains_cursor;
		}
		else {
			mark_containment(node.expression);
			node.contains_bookmark |= node.expression.contains_bookmark;
			node.contains_cursor |= node.expression.contains_cursor;
		}
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		mark_containment(node.expression);
		node.contains_bookmark |= node.expression.contains_bookmark;
		node.contains_cursor |= node.expression.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		mark_containment(node.elem_type);
		node.contains_bookmark |= node.elem_type.contains_bookmark;
		node.contains_cursor |= node.elem_type.contains_cursor;
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		mark_containment(node.size);
		node.contains_bookmark |= node.size.contains_bookmark;
		node.contains_cursor |= node.size.contains_cursor;
		mark_containment(node.elem_type);
		node.contains_bookmark |= node.elem_type.contains_bookmark;
		node.contains_cursor |= node.elem_type.contains_cursor;
	}
	else {
		throw Error("mark_containment: unknown code kind '" + node.base.kind + "'");
	}
}

let wip_code_2 = `
factorial_iterative :: (number: int) -> int {
	product : int = 1;
	i : int = 1;
	while i <= number {
		product *= i;
		i += 1;
	}
	return product;
}
factorial_recursive :: (number: int) -> int {
	if number > 1 {
		return number * factorial_recursive(number - 1);
	}
	else {
		return 1;
	}
}
factorial_recursive_2 :: (number: int) -> int {
	if number <= 1 then return 1;
	return number * factorial_recursive_2(number - 1);
}
main :: () {
	factorial := factorial_iterative(30);
	factorial  = factorial_recursive(30);
}
`;
// code = wip_code_2;

let wip_code_3 = `
main :: () {
	a := 1;
	b := 2;
	c := 3;
	d := 4;
	a + b * c + d;
}
`;
// code = wip_code_3;

let wip_code_4 = `
square :: (number: int) -> int {
	return number * number;
}
sum_of_squares :: (max_num: int) -> int {
	foo :: 1 + 2 * 3 - 4;
	i: int = 1;
	sum: int = 0;
	while i <= max_num {
		sum += square(i);
		i += 1;
	}
	return sum;
}
main :: () {
	sum_of_squares(3);
	sum_of_squares(3);
}
`;
// code = wip_code_4;

const Token_Buffer = {
	token_nodes: null,
	token_index: 0,
	enclosing_buffer: null,
	token_nodes_not_yet_flushed: null,
	code_nodes_not_yet_flushed: null,
};
function make_token_buffer(enclosing_buffer) {
	const buffer = Object.assign({}, Token_Buffer);
	buffer.token_nodes = new Array();
	buffer.token_index = 0;
	buffer.enclosing_buffer = enclosing_buffer;
	buffer.token_nodes_not_yet_flushed = new Array();
	buffer.code_nodes_not_yet_flushed = new Array();
	return buffer;
}
function push_token_buffer(buffer, token_node) {
	really_push_token_buffer(buffer, token_node);
	buffer.token_index += 1;
}
function really_push_token_buffer(buffer, token_node) {
	buffer.token_nodes.push(token_node);
	buffer.token_nodes_not_yet_flushed.push(token_node);
}
function flush_token_buffer(buffer) {
	if (buffer.enclosing_buffer == null) {
		return;
	}
	for (let token_node of buffer.token_nodes_not_yet_flushed) {
		really_push_token_buffer(buffer.enclosing_buffer, token_node);
	}
	let already_flushed = new Array();
	for (let node of buffer.code_nodes_not_yet_flushed) {
		if (already_flushed.includes(node)) {
			throw Error("flush_token_buffer: trying to flush a node twice!");
		}
		node.token_begin += buffer.enclosing_buffer.token_index;
		node.token_end   += buffer.enclosing_buffer.token_index;
		buffer.enclosing_buffer.code_nodes_not_yet_flushed.push(node);
		already_flushed.push(node);
	}
	buffer.enclosing_buffer.token_index += buffer.token_nodes_not_yet_flushed.length;
	buffer.token_nodes_not_yet_flushed.length = 0;
}
function render_token_buffer(buffer, render_target) {
	for (let token_node of buffer.token_nodes) {
		render_target.appendChild(token_node);
	}
}

const global_token_buffer = make_token_buffer(null);

const Token_Animation_State = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	opacity: 0,
};
function make_token_animation_state() {
	let state = Object.assign({}, Token_Animation_State);
	return state;
}

const Token_Animation = {
	start: null,
	end: null,
	curr: null,
	active: false,
	duration: 0.2,
	start_time: 0,
	easing: "sine",
};
function make_token_animation() {
	let token_anim = Object.assign({}, Token_Animation);
	token_anim.start = make_token_animation_state();
	token_anim.end   = make_token_animation_state();
	token_anim.curr  = make_token_animation_state();
	return token_anim;
}
function start_token_animation(token_node, curr_time) {
	let token_anim = token_node.animation;
	Object.assign(token_anim.curr, token_anim.start);
	token_anim.start_time = curr_time;
	token_anim.easing = "sine";
	token_anim.active = true;
}
function end_token_animation(token_node) {
	let token_anim = token_node.animation;
	Object.assign(token_anim.curr, token_anim.end);
	Object.assign(token_anim.start, token_anim.curr);
	token_anim.active = false;
}

function load_sound(url) {
	let sound = new Audio(url);
	return sound;
}
let can_play_sounds = false;
const sounds = {
	startup: load_sound("sounds/startup.mp3"),
	error: load_sound("sounds/error.mp3"),
	tock: load_sound("sounds/tock.mp3"),
	pen_click: load_sound("sounds/pen_click.mp3"),
	pen_click_reverse: load_sound("sounds/pen_click_reverse.mp3"),
	pen_write: load_sound("sounds/pen_write.mp3"),
	pen_write_reverse: load_sound("sounds/pen_write_reverse.mp3"),
	step: load_sound("sounds/step.mp3"),
	jump: load_sound("sounds/jump.mp3"),
	mode: load_sound("sounds/mode.mp3"),
	mode_up: load_sound("sounds/mode_up.mp3"),
	mode_down: load_sound("sounds/mode_down.mp3"),
	expand: load_sound("sounds/expand.mp3"),
	collapse: load_sound("sounds/collapse.mp3"),
	button: load_sound("sounds/button.mp3"),
	button_reverse: load_sound("sounds/button_reverse.mp3"),
};
function init_sounds() {
	let keys = Object.keys(sounds);
	for (let i = 0; i < keys.length; i += 1) {
		let key = keys[i];
		let sound = sounds[key];
		sound.volume = 0.8;
	}
	sounds.step.volume *= 0.4;
	play_sound(sounds.startup);
}
function play_sound(sound) {
	if (can_play_sounds) {
		let new_sound = sound.cloneNode(false);
		new_sound.volume = sound.volume;
		new_sound.play();
	}
}
function play_sound_reset(sound) {
	if (can_play_sounds) {
		if (sound.ended == false) {
			sound.currentTime = 0;
		}
		sound.play();
	}
}
function play_sound_until_end(sound) {
	if (can_play_sounds) {
		if (sound.ended == true || sound.currentTime == 0) {
			sound.currentTime = 0;
			sound.play();
		}
	}
}
function play_move_sound() {
	// play_sound_reset(sounds.step);
	// play_sound_until_end(sounds.step);
	play_sound(sounds.step);
}
function play_mode_sound() {
	if (did_mode_sound == false) {
		// without this, we would play the sound twice
		// first in the toggle, then in did_expand_binop
		play_sound(sounds.mode);
	}
	did_mode_sound = true;
}
function play_mode_up_sound() {
	if (did_mode_sound == false) {
		play_sound(sounds.mode_up);
	}
	did_mode_sound = true;
}
function play_mode_down_sound() {
	if (did_mode_sound == false) {
		play_sound(sounds.mode_down);
	}
	did_mode_sound = true;
}
function play_jump_sound() {
	play_sound(sounds.jump);
}
function play_expand_sound() {
	if (did_expand_sound == false) {
		play_sound(sounds.expand);
	}
	did_expand_sound = true;
}
function play_collapse_sound() {
	if (did_collapse_sound == false) {
		play_sound(sounds.collapse);
	}
	did_collapse_sound = true;
}
function play_bookmark_add_sound() {
	play_sound(sounds.pen_click);
}
function play_bookmark_remove_sound() {
	play_sound(sounds.pen_click_reverse);
}
function play_bookmark_text_sound() {
	play_sound(sounds.pen_write);
}
function play_bookmark_text_confirm_sound() {
	play_sound(sounds.button);
}
function play_error_sound() {
	play_sound(sounds.error);
}
function trigger_cursor_error() {
	start_cursor_error_animation(run_cursor, curr_time);
	play_error_sound();
}
let did_expand_call = false;
let did_collapse_call = false;
let did_expand_loop = false;
let did_collapse_loop = false;
let did_expand_binop = false;
let did_collapse_binop = false;
let did_mode_sound = false;
let did_expand_sound = false;
let did_collapse_sound = false;
function update_sounds() {
	if (did_expand_call || did_expand_loop) {
		play_expand_sound();
	}
	else if (did_collapse_call || did_collapse_loop) {
		play_collapse_sound();
	}
	else if (did_expand_binop) {
		play_mode_up_sound();
	}
	else if (did_collapse_binop) {
		play_mode_down_sound();
	}
}

// nocheckin
// @Incomplete
// we should infer this from the parser
// we should log all the tabs and spaces between every newline followed by a statement
let indent_text = "\t";
let indent_tab_size = 4;
let indent_level = 0;
let map_line_number_to_cursor_indexes = new Array();

const token_colors = {
	literal: make_color_rgba(115, 191, 178, 1),
	char_start: make_color_rgba(89, 166, 128, 1),
	char: make_color_rgba(89, 166, 102, 1),
	string_start: make_color_rgba(115, 191, 178, 1),
	string_end: make_color_rgba(115, 191, 178, 1),
	string_escape: make_color_rgba(64, 140, 127, 1),
	string: make_color_rgba(80, 175, 159, 1),
	operator: make_color_rgba(175, 120, 80, 1),
	semicolon: make_color_rgba(70, 70, 70, 1),
	ident: make_color_rgba(200, 188, 188, 1),
	type: make_color_rgba(106, 143, 175, 1),
	keyword: make_color_rgba(169, 112, 169, 1),
	procedure: make_color_rgba(193, 193, 139, 1),
	return_ident: make_color_rgba(184, 199, 184, 1),
	escaped: make_color_rgba(113, 132, 142, 1),
};

function render_tokens(tokens, buffer) {
	for (let token of tokens) {
		// nocheckin
		if (token.kind == Token_Kind.SINGLE_LINE_COMMENT) {
			debugger;
		}
		let token_node = render_token(token);
		// nocheckin
		// make this an error
		if (token_node == null) {
			continue;
		}
		push_token_buffer(buffer, token_node);
	}
}
// nocheckin
// @Incomplete
// add more members
const Token_Node = {
	token: null,
	color: null,
	animation: null,
	should_show: true,
	height: 20,
	width: 10,
};
function make_token_node() {
	let token_node = Object.assign({}, Token_Node);
	return token_node;
}
function render_token(token) {
	if (token == null) {
		throw Error("render_token: token was null!");
	}
	if (token.str == "") {
		throw Error("render_token: token string was empty!");
	}
	let token_node = make_token_node();
	if (token.kind == Token_Kind.IDENT) {
		token_node.color = token_colors.ident;
	}
	else if (token.kind == Token_Kind.CHAR_START) {
		token_node.color = token_colors.char_start;
	}
	else if (token.kind == Token_Kind.CHAR) {
		token_node.color = token_colors.char;
	}
	else if (token.kind == Token_Kind.STRING_START) {
		token_node.color = token_colors.string_start;
	}
	else if (token.kind == Token_Kind.STRING) {
		token_node.color = token_colors.string;
	}
	else if (token.kind == Token_Kind.STRING_END) {
		token_node.color = token_colors.string_end;
	}
	else if (token.kind == Token_Kind.OPERATOR) {
		token_node.color = token_colors.operator;
	}
	else if (token.kind == Token_Kind.DELIMITED) {
		token_node.color = token_colors.operator;
	}
	else if (token.kind == Token_Kind.SEMICOLON) {
		token_node.color = token_colors.semicolon;
	}
	else if (token.kind == Token_Kind.SINGLE_LINE_COMMENT) {
		token_node.color = token_colors.comment;
	}
	else if (token.kind == Token_Kind.MULTI_LINE_COMMENT) {
		token_node.color = token_colors.comment;
	}
	token_node.animation = make_token_animation();
	token_node.token = token;
	token_node.should_show = true;
	return token_node;
}
function render_newline(buffer) {
	let text = "\n";
	let token = make_token(Token_Kind.NEWLINE, 0, text.length, text);
	render_tokens([token], buffer);
}
function render_newline_if_not_existing(buffer, count) {
	// nocheckin
	// when parsing, we need to count how many newlines were between the last statement and the current one
	// for now, we just assume that it is always 1
	count = 1;
	let last_token_index = buffer.token_index;
	let last_token = null;
	while (true) {
		last_token_index -= 1;
		last_token = buffer.token_nodes[last_token_index].token;
		if (last_token_index == 0) {
			break;
		}
		else {
			break;
		}
	}
	if (last_token.kind != Token_Kind.NEWLINE) {
		for (let i = 0; i < count; i += 1) {
			render_newline(buffer);
		}
	}
}
function render_indentation(buffer) {
	for (let i = 0; i < indent_level; i += 1) {
		let text = indent_text;
		let token = make_token(Token_Kind.TAB, 0, text.length, text);
		render_tokens([token], buffer);
	}
}
function render_single_space(buffer) {
	let text = " ";
	let token = make_token(Token_Kind.WHITESPACE, 0, text.length, text);
	render_tokens([token], buffer);
}
function render_code(node, buffer) {
	if (node == null) {
		return;
	}
	if (buffer == null) {
		throw Error("render_code: buffer was null!");
	}
	buffer.code_nodes_not_yet_flushed.push(node);
	node.token_begin = buffer.token_index;
	if (node.base.kind == Code_Kind.DELIMITED) {
		if (node.begin != null) {
			if (node.is_implicit == false) {
				render_code(node.begin, buffer);
				if (node.begin.str == "{" && node.elements.length > 0) {
					render_newline_if_not_existing(buffer);
				}
			}
		}
		let separator = null;
		for (let i = 0; i < node.elements.length; i += 1) {
			let elem = node.elements[i];
			if (separator != null) {
				render_code(separator, buffer);
				if (separator.base.file == null || elem.base.file == null) {
					if (elem.base.kind != Code_Kind.STATEMENT) {
						render_single_space(buffer);
					}
				}
			}
			render_code(elem, buffer);
			if (node.separator != null) {
				separator = node.all_separators[i];
			}
		}
		if (node.end != null) {
			if (node.is_implicit == false) {
				if (node.end.str == "}" && node.elements.length > 0) {
					indent_level -= 1;
					render_indentation(buffer);
					indent_level += 1;
				}
				render_code(node.end, buffer);
			}
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		if (node.delimited.is_implicit == false) {
			indent_level += 1;
		}
		render_code(node.delimited, buffer);
		if (node.delimited.is_implicit == false) {
			indent_level -= 1;
		}
		if (node.delimited.is_implicit == false) {
			render_newline_if_not_existing(buffer);
		}
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			const new_buffer = make_token_buffer(buffer);
			if (node.should_indent) {
				render_indentation(new_buffer);
			}
			render_code(node.expression, new_buffer);
			if (node.token_begin < buffer.token_index) {
				// we might render something to new_buffer.enclosing_buffer
				// so we have to update node.token_begin
				node.token_begin = buffer.token_index;
			}
			if (node.needs_semicolon == true) {
				// nocheckin
				// we should render this from the file
				// and we should also render the whitespace between the expression and the semicolon
				let text = ";";
				let token = make_token(Token_Kind.SEMICOLON, 0, text.length, text);
				render_tokens([token], new_buffer);
			}
			render_newline_if_not_existing(new_buffer);
			flush_token_buffer(new_buffer);
		}
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		let text = node.value.toString();
		let token = make_token(Token_Kind.DIGITS, 0, text.length, text);
		render_tokens([token], buffer);
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		let text = node.value.toString();
		if (text.data.length > 9) {
			text = text.data.substr(0, 9);
		}
		if (text.indexOf(".") < 0 && text != "NaN" && text != "Infinity") {
			text += ".0";
		}
		let token = make_token(Token_Kind.DIGITS, 0, text.length, text);
		render_tokens([token], buffer);
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		let text = node.value.toString();
		let token = make_token(Token_Kind.DIGITS, 0, text.length, text);
		render_tokens([token], buffer);
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		let text = node.value.toString();
		let token_1 = make_token(Token_Kind.CHAR_START, 0, 1, "'");
		let token_2 = make_token(Token_Kind.CHAR, 0, text.length, text);
		let token_3 = make_token(Token_Kind.CHAR_END, 0, 1, "'");
		render_tokens([token_1, token_2, token_3], buffer);
	}
	else if (node.base.kind == Code_Kind.STRING) {
		let text = node.str;
		let token_1 = make_token(Token_Kind.STRING_START, 0, 1, "\"");
		let token_2 = make_token(Token_Kind.STRING, 0, text.length, text);
		let token_3 = make_token(Token_Kind.STRING_END, 0, 1, "\"");
		render_tokens([token_1, token_2, token_3], buffer);
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		render_code(node.delimited, buffer);
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		render_code(node.delimited, buffer);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		render_code(node.parameters, buffer);
		if (node.operator != null) {
			render_single_space(buffer);
			render_code(node.operator, buffer);
			render_single_space(buffer);
			render_code(node.returns, buffer);
			render_single_space(buffer);
		}
		else {
			render_single_space(buffer);
		}
		render_code(node.block, buffer);
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		// @Incomplete
		// nocheckin
		throw Error("not yet implemented: struct definition");
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		// @Incomplete
		throw Error("not yet implemented: enum definition");
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		render_code(node.ident, buffer);
		if (node.type_operator != null) {
			render_single_space(buffer);
			render_code(node.type_operator, buffer);
		}
		if (node.type != null) {
			render_single_space(buffer);
			render_code(node.type, buffer);
		}
		if (node.expression_operator != null) {
			if (node.type != null) {
				render_single_space(buffer);
			}
			render_code(node.expression_operator, buffer);
		}
		if (node.expression != null) {
			render_single_space(buffer);
			render_code(node.expression, buffer);
		}
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		if (node.base.result != null) {
			render_code(node.base.result, buffer);
		}
		render_tokens(node.tokens, buffer);
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		render_code(node.target, buffer);
		render_single_space(buffer);
		render_code(node.operator, buffer);
		render_single_space(buffer);
		render_code(node.expression, buffer);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		render_code(node.target, buffer);
		render_single_space(buffer);
		render_code(node.operator, buffer);
		render_single_space(buffer);
		render_code(node.expression, buffer);
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		render_code(node.target, buffer);
		render_code(node.operator, buffer);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		render_code(node.target, buffer);
		render_code(node.operator, buffer);
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		render_code(node.target, buffer);
		render_code(node.delimited, buffer);
		render_code(node.base.result, buffer);
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		let text = node.str;
		let token = make_token(Token_Kind.OPERATOR, 0, text.length, text);
		render_tokens([token], buffer);
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		render_code(node.left, buffer);
		render_code(node.operator, buffer);
		render_code(node.right, buffer);
		render_code(node.base.result, buffer);
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		render_code(node.left, buffer);
		render_single_space(buffer);
		render_code(node.operator, buffer);
		render_single_space(buffer);
		render_code(node.right, buffer);
		render_code(node.base.result, buffer);
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		render_code(node.delimited, buffer);
	}
	else if (node.base.kind == Code_Kind.CALL) {
		render_code(node.block, buffer.enclosing_buffer);
		render_code(node.procedure, buffer);
		render_code(node.args, buffer);
		render_code(node.base.replacement, buffer);
		render_code(node.base.result, buffer);
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		let text = node.str;
		let token = make_token(Token_Kind.IDENT, 0, text.length, text);
		token.extra_kind = Extra_Token_Kind.KEYWORD;
		render_tokens([token], buffer);
	}
	else if (node.base.kind == Code_Kind.IF) {
		render_code(node.keyword, buffer);
		render_single_space(buffer);
		render_code(node.condition, buffer);
		if (node.then_keyword != null) {
			render_single_space(buffer);
			render_code(node.then_keyword, buffer);
		}
		render_single_space(buffer);
		render_code(node.statement, buffer);
		render_code(node.statement.base.replacement, buffer);
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		render_code(node.keyword, buffer);
		render_single_space(buffer);
		node.statement.should_indent = false;
		render_code(node.statement, buffer);
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		render_code(node.keyword, buffer);
		render_single_space(buffer);
		render_code(node.condition, buffer);
		render_single_space(buffer);
		node.statement.should_indent = false;
		render_code(node.statement, buffer);
		render_code(node.statement.base.replacement, buffer);
		render_code(node.base.replacement, buffer.enclosing_buffer);
	}
	else if (node.base.kind == Code_Kind.FOR) {
		render_code(node.keyword, buffer);
		render_single_space(buffer);
		render_code(node.set, buffer);
		render_single_space(buffer);
		node.statement.should_indent = false;
		render_code(node.statement, buffer);
		render_code(node.statement.base.replacement, buffer);
		render_code(node.base.replacement, buffer.enclosing_buffer);
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		render_code(node.begin_it, buffer);
		render_code(node.separator, buffer);
		render_code(node.end_it, buffer);
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		render_code(node.keyword, buffer);
		if (node.expression != null) {
			render_single_space(buffer);
			render_code(node.expression, buffer);
		}
		if (node.base.replacement != null) {
			render_code(node.base.replacement, buffer);
		}
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		render_code(node.operator, buffer);
		render_code(node.elem_type, buffer);
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		render_code(node.begin_operator, buffer);
		render_code(node.size, buffer);
		render_code(node.end_operator, buffer);
		render_single_space(buffer);
		render_code(node.elem_type, buffer);
	}
	else {
		throw Error("render_code: unknown code kind '" + node.base.kind + "'");
	}
	node.token_end = buffer.token_index;
}
// nocheckin
// factor this out
function update_tokens_style(buffer) {
	for (let token_node of buffer.token_nodes) {
		if (token_node.token.kind == Token_Kind.DIGITS) {
			token_node.color = token_colors.literal;
		}
		if (token_node.token.extra_kind == Extra_Token_Kind.TYPE) {
			token_node.color = token_colors.type;
		}
		else if (token_node.token.extra_kind == Extra_Token_Kind.KEYWORD) {
			token_node.color = token_colors.keyword;
		}
		else if (token_node.token.extra_kind == Extra_Token_Kind.PROCEDURE) {
			token_node.color = token_colors.procedure;
		}
		// nocheckin
		// not used anymore
		else if (token_node.token.extra_kind == Extra_Token_Kind.RETURN_IDENT) {
			token_node.color = token_colors.return_ident;
		}
	}
}
function update_tokens_width_and_height(buffer) {
	for (let token_node of buffer.token_nodes) {
		let character_count = token_node.token.str.length;
		if (token_node.token.str == "\t") {
			character_count = indent_tab_size;
		}
		token_node.width = character_count * dummy_width;
		token_node.height = dummy_height;
	}
}
function update_tokens_goal(buffer, curr_time) {
	let curr_x_end = 0;
	let curr_y_end = 0;
	for (let i = 0; i < buffer.token_nodes.length; i += 1) {
		let token_node = buffer.token_nodes[i];
		let token_anim = token_node.animation;
		token_anim.end.x = curr_x_end;
		token_anim.end.y = curr_y_end;
		if (token_node.should_show) {
			token_anim.end.width = token_node.width;
			token_anim.end.height = token_node.height;
			token_anim.end.opacity = 1;
		}
		else {
			token_anim.end.width = 0;
			token_anim.end.height = 0;
			token_anim.end.opacity = 0;
		}
		if (token_node.animation.active == false) {
			start_token_animation(token_node, curr_time);
		}
		if (token_node.should_show) {
			curr_x_end += token_node.width;
		}
		if (token_node.token.kind == Token_Kind.NEWLINE && token_node.should_show) {
			curr_x_end = 0;
			curr_y_end += token_node.height;
		}
	}
}
function update_tokens_goal_x(buffer, curr_time) {
	let last_newline_index = 0;
	for (let i = 0; i < buffer.token_nodes.length; i += 1) {
		let token_node = buffer.token_nodes[i];
		if (token_node.token.kind == Token_Kind.NEWLINE && token_node.should_show) {
			for (let j = last_newline_index; j < i; j += 1) {
				let token_node = buffer.token_nodes[j];
				let token_anim = token_node.animation;
				if (token_node.should_show) {
					token_anim.start.x = token_anim.end.x;
					token_anim.easing = "sine";
				}
				else {
					token_anim.end.x = token_anim.curr.x;
					token_anim.easing = "sine";
				}
			}
			last_newline_index = i;
		}
	}
}
function update_tokens_animation(buffer, curr_time) {
	for (let i = 0; i < buffer.token_nodes.length; i += 1) {
		let token_node = buffer.token_nodes[i];
		let token_anim = token_node.animation;
		if (token_anim.active == false) {
			continue;
		}
		let duration = token_anim.duration;
		let elapsed = (curr_time - token_anim.start_time) / 1000;
		if (elapsed >= duration) {
			end_token_animation(token_node);
		}
		else {
			// in the middle of animation
			let degree = elapsed / duration;
			if (token_anim.easing == "sine") {
				degree = easeInOutSine(degree);
			}
			token_anim.curr.x = lerp(token_anim.start.x, token_anim.end.x, degree);
			token_anim.curr.y = lerp(token_anim.start.y, token_anim.end.y, degree);
			token_anim.curr.width = lerp(token_anim.start.width, token_anim.end.width, degree);
			token_anim.curr.height = lerp(token_anim.start.height, token_anim.end.height, degree);
			let linear = elapsed / duration * 1;
			if (linear > 1) {
				linear = 1;
			}
			linear = easeOutSine(linear);
			token_anim.curr.opacity = lerp(token_anim.start.opacity, token_anim.end.opacity, linear);
		}
	}
}
function update_tokens_between(left, right, show) {
	if (left == null) {
		return;
	}
	if (right == null) {
		return;
	}
	return update_tokens(left.token_end, right.token_begin, show);
}
function update_tokens(token_begin, token_end, show) {
	for (let i = token_begin; i < token_end; i += 1) {
		let token_node = global_token_buffer.token_nodes[i];
		token_node.should_show = show;
		// nocheckin
		const token = token_node.token;
		if (token.serial == 1072 && show == true) {
			// debugger;
		}
	}
}
function update_code(node, show = true) {
	if (node == null) {
		return;
	}
	if (node.base.run_disable) {
		show = false;
	}
	node.base.can_go = show;
	if (node.base.kind == Code_Kind.DELIMITED) {
		if (node.begin != null) {
			// we might have a newline before node.begin
			update_tokens(node.token_begin, node.begin.token_begin, show);
			if (node.is_implicit == true) {
				update_code(node.begin, false);
			}
			else {
				update_code(node.begin, show);
			}
			if (node.first_element != null) {
				update_tokens_between(node.begin, node.first_element, show);
			}
			else if (node.end != null) {
				update_tokens_between(node.begin, node.end, show);
			}
		}
		let separator = null;
		for (let i = 0; i < node.elements.length; i += 1) {
			let elem = node.elements[i];
			if (separator != null) {
				update_code(separator, show);
				update_tokens_between(separator, elem, show);
			}
			update_code(elem, show);
			if (node.separator != null) {
				separator = node.all_separators[i];
			}
		}
		if (node.end != null) {
			if (node.last_element != null) {
				update_tokens_between(node.last_element, node.end, show);
			}
			if (node.is_implicit == true) {
				update_code(node.end, false);
			}
			else {
				update_code(node.end, show);
			}
		}
	}
	else if (node.base.kind == Code_Kind.BLOCK) {
		update_code(node.delimited, show);
		// we also have to show the newline
		update_tokens(node.delimited.token_end, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.STATEMENT) {
		if (node.expression != null) {
			// hide top-level declarations
			if (node.expression.base.kind == Code_Kind.DECLARATION) {
				if (node.base.enclosing_scope.block == User_Block) {
					show = false;
				}
			}
			update_code(node.expression, show);
			update_tokens(node.expression.token_end, node.token_end, show);
			let show_indent = show;
			// nocheckin
			// @Cleanup
			// we should not need to do this
			if (node.expression.base.kind == Code_Kind.ELSE) {
				show_indent &= node.expression.base.show;
			}
			if (node.expression.base.replacement != null) {
				if (node.expression.base.kind == Code_Kind.WHILE) {
					show_indent &= node.expression.base.expand == false;
				}
				if (node.expression.base.kind == Code_Kind.FOR) {
					show_indent &= node.expression.base.expand == false;
				}
			}
			update_tokens(node.token_begin, node.expression.token_begin, show_indent);
		}
	}
	else if (node.base.kind == Code_Kind.INTEGER) {
		node.base.expand = false;
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.FLOAT) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.BOOL) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.CHAR) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.STRING) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.ARRAY_LITERAL) {
		update_code(node.delimited, show);
	}
	else if (node.base.kind == Code_Kind.STRUCT_LITERAL) {
		update_code(node.delimited, show);
	}
	else if (node.base.kind == Code_Kind.PROCEDURE_DEFINITION) {
		update_code(node.parameters, show);
		if (node.operator != null) {
			update_tokens_between(node.parameters, node.operator, show);
			update_code(node.operator, show);
		}
		if (node.returns != null) {
			update_tokens_between(node.operator, node.returns, show);
			update_code(node.returns, show);
			update_tokens_between(node.returns, node.block, show);
		}
		else {
			update_tokens_between(node.parameters, node.block, show);
		}
		update_code(node.block, false);
		// nocheckin
		/*
		// update_code(node.block, show);
		// we should show only the curly brackets
		let block_begin = node.block.delimited.token_begin;
		let block_end = node.block.delimited.token_end - 1;
		update_tokens(block_begin, block_begin + 1, show);
		update_tokens(block_end, block_end + 1, show);
		*/
	}
	else if (node.base.kind == Code_Kind.STRUCT_DEFINITION) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.ENUM_DEFINITION) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.DECLARATION) {
		update_code(node.ident, show);
		update_tokens_between(node.ident, node.type_operator, show);
		update_code(node.type_operator, show);
		update_tokens_between(node.type_operator, node.type, show);
		update_code(node.type, show);
		update_tokens_between(node.type, node.expression_operator, show);
		update_code(node.expression_operator, show);
		update_tokens_between(node.expression_operator, node.expression, show);
		update_code(node.expression, show);
	}
	else if (node.base.kind == Code_Kind.IDENT) {
		if (node.base.result != null) {
			if (node.base.is_lhs ? tree_view_modes.lhs_values_shown : tree_view_modes.values_shown) {
				update_tokens(node.token_begin, node.token_end, false);
				update_code(node.base.result, show);
			}
			else {
				update_tokens(node.token_begin, node.token_end, show);
				update_code(node.base.result, false);
			}
		}
		else {
			update_tokens(node.token_begin, node.token_end, show);
		}
	}
	else if (node.base.kind == Code_Kind.ASSIGN) {
		update_code(node.target, show);
		update_tokens_between(node.target, node.operator, show);
		update_code(node.operator, show);
		update_tokens_between(node.operator, node.expression, show);
		update_code(node.expression, show);
	}
	else if (node.base.kind == Code_Kind.OPASSIGN) {
		update_code(node.target, show);
		update_tokens_between(node.target, node.operator, show);
		update_code(node.operator, show);
		update_tokens_between(node.operator, node.expression, show);
		update_code(node.expression, show);
	}
	else if (node.base.kind == Code_Kind.INCREMENT) {
		update_code(node.target, show);
		update_tokens_between(node.target, node.operator, show);
		update_code(node.operator, show);
	}
	else if (node.base.kind == Code_Kind.DECREMENT) {
		update_code(node.target, show);
		update_tokens_between(node.target, node.operator, show);
		update_code(node.operator, show);
	}
	else if (node.base.kind == Code_Kind.OPERATOR) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.BINARY_OPERATION) {
		let should_expand = !(tree_view_modes.values_shown && tree_view_modes.elements_shown == false);
		should_expand |= node.contains_cursor && node.is_cursor == false;
		should_expand |= node.contains_bookmark && node.is_bookmark == false;
		if (node.base.result != null) {
			if (should_expand) {
				update_code(node.left, show);
				update_code(node.right, show);
				update_code(node.base.result, false);
			}
			else {
				update_code(node.left, false);
				update_code(node.right, false);
				update_code(node.base.result, show);
			}
		}
		else {
			update_code(node.left, show);
			update_code(node.right, show);
		}
		if (show == true) {
			if (node.base.expand == false && should_expand == true) {
				did_expand_binop = true;
			}
			if (node.base.expand == true && should_expand == false) {
				did_collapse_binop = true;
			}
		}
		let should_show_operator = show && should_expand;
		update_tokens_between(node.left, node.operator, should_show_operator);
		update_code(node.operator, should_show_operator);
		update_tokens_between(node.operator, node.right, should_show_operator);
		node.base.expand = should_expand;
		node.base.can_go &= node.base.expand == false;
	}
	else if (node.base.kind == Code_Kind.MINUS) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.NOT) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.PARENS) {
		node.base.can_go = false;
		update_code(node.delimited, show);
	}
	else if (node.base.kind == Code_Kind.REFERENCE) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.DEREFERENCE) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.CAST) {
		// @Incomplete
		throw Error;
	}
	else if (node.base.kind == Code_Kind.ARRAY_INDEX) {
		let value_shown = node.base.is_lhs ? tree_view_modes.lhs_values_shown : tree_view_modes.values_shown;
		let should_expand = true;
		should_expand &= value_shown == false;
		should_expand |= (node.contains_cursor || node.contains_bookmark) && (node.is_cursor || node.is_bookmark) == false;
		if (should_expand) {
			update_code(node.target, show);
			update_tokens_between(node.target, node.delimited, show);
			update_code(node.delimited, show);
			update_code(node.base.result, false);
		}
		else {
			update_code(node.target, false);
			update_tokens_between(node.target, node.delimited, false);
			update_code(node.delimited, false);
			update_code(node.base.result, show);
		}
		node.base.expand = should_expand;
		node.base.can_go = node.base.expand == false;
	}
	else if (node.base.kind == Code_Kind.DOT_OPERATOR) {
		let value_shown = node.base.is_lhs ? tree_view_modes.lhs_values_shown : tree_view_modes.values_shown;
		let should_expand = true;
		should_expand &= value_shown == false;
		should_expand |= (node.contains_cursor || node.contains_bookmark) && (node.is_cursor || node.is_bookmark) == false;
		if (should_expand) {
			update_code(node.left, show);
			update_tokens_between(node.left, node.right, show);
			update_code(node.right, show);
			update_code(node.base.result, false);
		}
		else {
			update_code(node.left, false);
			update_tokens_between(node.left, node.right, false);
			update_code(node.right, false);
			update_code(node.base.result, show);
		}
		node.base.expand = should_expand;
		node.base.can_go = node.base.expand == false;
	}
	else if (node.base.kind == Code_Kind.KEYWORD) {
		update_tokens(node.token_begin, node.token_end, show);
	}
	else if (node.base.kind == Code_Kind.IF) {
		update_code(node.keyword, show);
		update_tokens_between(node.keyword, node.condition, show);
		update_code(node.condition, show);
		if (node.then_keyword != null) {
			update_tokens_between(node.then_keyword, node.statement, show);
			update_code(node.then_keyword, show);
		}
		if (node.statement.base.run_disable) {
			update_tokens_between(node.condition, node.statement, show);
			update_code(node.statement, false);
			update_code(node.statement.base.replacement, show);
		}
		else {
			update_tokens_between(node.condition, node.statement, show);
			update_code(node.statement, show);
			update_code(node.statement.base.replacement, false);
		}
	}
	else if (node.base.kind == Code_Kind.ELSE) {
		update_code(node.keyword, show);
		update_tokens_between(node.keyword, node.statement, show);
		update_code(node.statement, show);
		// nocheckin
		// this is probably not necessary
		if (node.base.run_disable) {
			update_tokens(node.keyword.token_begin, node.statement.token_end, false);
		}
	}
	else if (node.base.kind == Code_Kind.WHILE) {
		let should_expand = tree_view_modes.loop_cycles_shown || tree_view_modes.expand_all;
		if (should_expand == false && node.base.replacement != null) {
			let block = node.base.replacement;
			let cycles = block.statements;
			node.prev_cycle_index = node.current_cycle_index;
			node.current_cycle_index = -1;
			if (block.contains_cursor || block.contains_bookmark) {
				should_expand = true;
				update_tokens(node.token_begin, node.token_end, false);
				for (let i = 0; i < 2; i += 1) {
					let stmt = block.statements[i];
					update_code(stmt, show);
				}
				let cycle = null;
				for (let i = 0; i < cycles.length; i += 1) {
					cycle = cycles[i];
					if (cycle.contains_cursor) {
						node.current_cycle_index = i;
					}
					if (cycle.contains_cursor || cycle.contains_bookmark) {
						update_code(cycle, show);
					}
					else {
						update_code(cycle, false);
					}
				}
				if (node.current_cycle_index != node.prev_cycle_index) {
					did_expand_loop = true;
				}
			}
			else {
				update_code(node.base.replacement, false);
				update_code(node.statement, false);
				update_code(node.statement.base.replacement, show);
			}
		}
		else if (should_expand == true && node.base.replacement != null) {
			update_tokens(node.token_begin, node.token_end, false);
			update_code(node.base.replacement, show);
		}
		else {
			update_code(node.keyword, show);
			update_tokens_between(node.keyword, node.condition, show);
			update_code(node.condition, show);
			update_tokens_between(node.condition, node.statement, show);
			update_code(node.statement, show);
		}
		if (should_expand == true && node.base.expand == false) {
			did_expand_loop = true;
		}
		if (should_expand == false && node.base.expand == true) {
			did_collapse_loop = true;
		}
		node.base.expand = should_expand;
	}
	else if (node.base.kind == Code_Kind.FOR) {
		let should_expand = tree_view_modes.loop_cycles_shown || tree_view_modes.expand_all;
		if (should_expand == false && node.base.replacement != null) {
			let block = node.base.replacement;
			let cycles = block.statements.slice(2);
			node.prev_cycle_index = node.current_cycle_index;
			node.current_cycle_index = -1;
			if (block.contains_cursor || block.contains_bookmark) {
				should_expand = true;
				update_tokens(node.token_begin, node.token_end, false);
				for (let i = 0; i < 2; i += 1) {
					let stmt = block.statements[i];
					update_code(stmt, show);
				}
				let cycle = null;
				for (let i = 0; i < cycles.length; i += 1) {
					cycle = cycles[i];
					if (cycle.contains_cursor) {
						node.current_cycle_index = i;
					}
					if (cycle.contains_cursor || cycle.contains_bookmark) {
						update_code(cycle, show);
					}
					else {
						update_code(cycle, false);
					}
				}
				if (node.current_cycle_index != node.prev_cycle_index) {
					did_expand_loop = true;
				}
			}
			else {
				update_code(node.base.replacement, false);
				update_code(node.statement, false);
				update_code(node.statement.base.replacement, show);
			}
		}
		else if (should_expand == true && node.base.replacement != null) {
			update_tokens(node.token_begin, node.token_end, false);
			update_code(node.base.replacement, show);
		}
		else {
			update_code(node.keyword, show);
			update_tokens_between(node.keyword, node.set, show);
			update_code(node.set, show);
			update_tokens_between(node.set, node.statement, show);
			update_code(node.statement, show);
		}
		if (should_expand == true && node.base.expand == false) {
			did_expand_loop = true;
		}
		if (should_expand == false && node.base.expand == true) {
			did_collapse_loop = true;
		}
		node.base.expand = should_expand;
	}
	else if (node.base.kind == Code_Kind.INTEGER_SET) {
		update_code(node.begin_it, show);
		update_code(node.separator, show);
		update_code(node.end_it, show);
	}
	else if (node.base.kind == Code_Kind.RETURN) {
		if (node.base.replacement != null) {
			update_code(node.keyword, false);
			update_tokens_between(node.keyword, node.expression, false);
			update_code(node.expression, false);
			update_code(node.base.replacement, show);
		}
		else {
			update_code(node.keyword, show);
			if (node.expression != null) {
				update_tokens_between(node.keyword, node.expression, show);
				update_code(node.expression, show);
			}
		}
	}
	else if (node.base.kind == Code_Kind.CALL) {
		if (node.block != null) {
			// nocheckin
			// @Cleanup
			let should_expand = show && tree_view_modes.expand_all;
			should_expand |= node.block.contains_cursor || node.block.contains_bookmark;
			if (should_expand) {
				update_code(node.block, show);
				update_code(node.base.replacement, show);
				update_code(node.base.result, false);
				update_code(node.procedure, false);
				update_code(node.args, false);
				if (node.base.expand == false) {
					did_expand_call = true;
				}
			}
			else {
				update_code(node.block, false);
			}
			if (node.base.expand == true && should_expand == false) {
				did_collapse_call = true;
			}
			if (should_expand) {
				update_code(node.base.replacement, show);
			}
			else {
				update_code(node.base.replacement, false);
			}
			if (should_expand == false) {
				let should_show_result = node.base.is_lhs ? tree_view_modes.lhs_values_shown : tree_view_modes.values_shown;
				should_show_result &= tree_view_modes.elements_shown == false;
				if (node.base.result == null) {
					should_show_result = false;
				}
				if (should_show_result) {
					update_code(node.base.result, show);
					update_code(node.procedure, false);
					update_code(node.args, false);
				}
				else {
					update_code(node.base.result, false);
					update_code(node.procedure, show);
					update_code(node.args, show);
				}
			}
			node.base.expand = should_expand;
		}
		else {
			update_code(node.procedure, show);
			update_code(node.args, show);
			update_code(node.base.replacement, false);
		}
	}
	else if (node.base.kind == Code_Kind.POINTER_TYPE) {
		update_code(node.operator, show);
		update_tokens(node.operator.token_end, node.elem_type.token_begin, show);
		update_code(node.elem_type, show);
	}
	else if (node.base.kind == Code_Kind.ARRAY_TYPE) {
		update_code(node.begin_operator, show);
		update_code(node.size, show);
		update_code(node.end_operator, show);
		update_tokens(node.end_operator.token_end, node.elem_type.token_begin, show);
		update_code(node.elem_type, show);
	}
	else {
		throw Error("update_code: unknown Code_Kind '" + node.base.kind + "'");
	}
	node.base.show = show;
}

function update_line_number() {
	let line_number = 0;
	let column_index = 0;
	let map_line_number_to_cursor_indexes = new Array();
	map_line_number_to_cursor_indexes[0] = new Array();
	let nodes = global_token_buffer.code_nodes_not_yet_flushed;
	let last_shown_node = null;
	for (let i = 0; i < nodes.length; i += 1) {
		let node = nodes[i];
		if (node.base.show == false) {
			continue;
		}
		let cursor_can_go = node.base.can_go;
		if (last_shown_node != null) {
			for (let j = last_shown_node.token_end; j < node.token_begin; j += 1) {
				let token_node = global_token_buffer.token_nodes[j];
				if (token_node.should_show == false) {
					continue;
				}
				if (token_node.token.kind == Token_Kind.NEWLINE) {
					if (map_line_number_to_cursor_indexes[line_number].length != 0) {
						column_index = 0;
						line_number += 1;
						map_line_number_to_cursor_indexes[line_number] = new Array();
					}
				}
			}
		}
		cursor_can_go &= node.cursor_index != null;
		if (cursor_can_go) {
			node.line_number = line_number;
			node.column_index = column_index;
			map_line_number_to_cursor_indexes[line_number].push(node.cursor_index);
			column_index += 1;
		}
		else {
			node.line_number = line_number;
			node.column_index = column_index;
		}
		last_shown_node = node;
	}
	context.view_state.map_line_number_to_cursor_indexes = map_line_number_to_cursor_indexes;
}

// give the UI some time to render
// window.setTimeout(main, 10);
main();