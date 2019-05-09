const canvas = document.getElementById("debugger");

const call_init = Module.cwrap("init", "number", ["number", "number"]);
const call_deinit = Module.cwrap("deinit", "number");
const call_render = Module.cwrap("render");
const call_set_text = Module.cwrap("set_text", null, ["number"]);
const call_resize = Module.cwrap("resize", null, ["number", "number"]);
const call_malloc = Module.cwrap("malloc", "number", ["number"]);

function writeAsciiToMemory(str, ptr){
    for (let i = 0; i < str.length; i += 1) {
        Module.HEAP8[ptr++>>0] = str.charCodeAt(i);
    }
    Module.HEAP8[ptr>>0] = 0;
}
function set_text(new_text) {
    const ptr = call_malloc(new_text.length + 1);
    writeAsciiToMemory(new_text, ptr);
    call_set_text(ptr);
}

const code = `
bool test_floats() {
	bool passed = true;
	passed &= 0.3 - 0.2 < 0.10001;
	passed &= 0.3 - 0.2 > 0.09999;
	passed &= 0.3 + 0.2 < 0.50001;
	passed &= 0.3 + 0.2 > 0.49999;
	passed &= 0.3 / 0.2 < 1.50001;
	passed &= 0.3 / 0.2 > 1.49999;
	passed &= 0.3 * 0.2 < 0.06001;
	passed &= 0.3 * 0.2 > 0.05999;
	passed &= 0.3 < 0.2 == false;
	passed &= 0.3 < 0.4 == true;
	passed &= 0.3 <= 0.2 == false;
	passed &= 0.3 <= 0.4 == true;
	passed &= 0.3 > 0.2 == true;
	passed &= 0.3 > 0.4 == false;
	passed &= 0.3 >= 0.2 == true;
	passed &= 0.3 >= 0.4 == false;
	passed &= 0.3 == 0.2 == false;
	passed &= 0.3 == 0.3 == true;
	passed &= 0.3 != 0.2 == true;
	passed &= 0.3 != 0.3 == false;
	float floot = 1.3;
	float flaat = floot;
	passed &= floot == flaat;
	passed &= floot == 1.3;
	passed &= flaat == 1.3;
	floot += flaat;
	passed &= floot == flaat + 1.3;
	return passed;
}
bool test_if_else(){
	bool passed = true;

	int i = 0;
	if (false) i = 1;
	else if (true) i = 2;
	else i = 3;
	passed &= i == 2;

	if (false) i = 1;
	else if (false) i = 2;
	else if (true) i = 3;
	else if (true) i = 4;
	else if (true) i = 5;
	else i = 6;
	passed &= i == 3;

	if (false) {
		i = 0;
	}
	else {
		i = 123;
	}
	passed &= i == 123;
	return passed;
}
bool test_nested_proc() {
	bool passed = false;
	int foo(int param) {
		return param;
	}
	int bar = foo(40) + foo(2);
	passed = bar == 42;
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
bool test_array_pointer() {
	bool passed = true;
	int[4] arr;
	int* head = &arr;
	for (int i = 0; i < arr.length; i++) {
		*head = i + 1;
		head++;
	}
	passed &= arr[0] == 1;
	passed &= arr[1] == 2;
	passed &= arr[2] == 3;
	passed &= arr[3] == 4;
	return passed;
}
bool test_pointer_math() {
	bool passed = true;
	struct Foo {
		int one;
		int two;
	};
	Foo[2] arr;
	// dot operators can dereference one level deep
	// just like the -> operator in C
	Foo* head = &arr;
	head.one = 1;
	head.two = 2;
	head++;
	head.one = 3;
	head.two = 4;
	head--;
	passed &= arr[0].one == 1;
	passed &= arr[0].two == 2;
	passed &= arr[1].one == 3;
	passed &= arr[1].two == 4;
	// pointers can be array indexed
	passed &= head[0].one == 1;
	passed &= head[0].two == 2;
	passed &= head[1].one == 3;
	passed &= head[1].two == 4;
	// these mechanics work together
	Foo*[2] ptr_arr;
	ptr_arr[0] = &arr[0];
	ptr_arr[1] = &arr[1];
	Foo** ptr_arr_ptr = &ptr_arr;
	passed &= ptr_arr_ptr[0].one == 1;
	passed &= ptr_arr_ptr[0].two == 2;
	passed &= ptr_arr_ptr[1].one == 3;
	passed &= ptr_arr_ptr[1].two == 4;
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
	};
	struct Person {
		uint age;
		Car car;
	};
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
bool test_nested_struct() {
	bool passed = true;
	struct Car_Model {
		uint type;
		uint date;
	};
	struct Car {
		uint date;
		Car_Model model;
	};
	struct Person {
		uint age;
		Car car;
	};
	struct Company {
		uint age;
		Person leader;
	};
	Company company;
	company.age = 5;
	company.leader.age = 33;
	company.leader.car.date = 20170104;
	company.leader.car.model.type = 42;
	company.leader.car.model.date = 20120601;
	passed &= company.age == 5;
	passed &= company.leader.age == 33;
	passed &= company.leader.car.date == 20170104;
	passed &= company.leader.car.model.type == 42;
	passed &= company.leader.car.model.date == 20120601;
	return passed;
}
bool test_struct_array() {
	bool passed = true;
	struct Person {
		uint age;
	};
	Person[2] people;
	for (int i = 0; i < people.length; i += 1) {
		people[i].age = (i + 1) * 10;
	};
	passed &= people[0].age == 10;
	passed &= people[1].age == 20;
	return passed;
}
bool test_nested_struct_array() {
	bool passed = true;
	
	struct Wheel {
		float pressure;
	};
	struct Car {
		Wheel[4] wheels;
		uint date;
	};
	struct Person {
		Car[4] cars;
		uint age;
	};
	struct Company {
		Person[10] employees;
		uint age;
	};
	Company company;
	company.employees[3].cars[3].wheels[3].pressure = 1.2;
	passed &= company.employees[3].cars[3].wheels[3].pressure == 1.2;
	return passed;
}
bool test_struct_pointer_dot() {
	struct Foo {
		int value;
	};
	Foo foo;
	Foo* ptr = &foo;
	ptr.value = 42;
	ptr.value = ptr.value;
}
bool test_while_break_continue() {
	bool passed = true;
	bool stop = false;
	int n = 0;
	while (n < 10) {
		if (stop) {
			n = 4;
			break;
		}
		if (n == 2) {
			stop = true;
			continue;
			passed = false;
		}
		n += 1;
	}
	passed &= n == 4;
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
	int m = 4;
	m++;
	m++;
	m++;
	passed &= m == 7;
	m--;
	m--;
	passed &= m == 5;
	return passed;
}
// bool test_unary() {
// 	bool passed = true;
// 	int n = 1;
// 	passed &= -n == -1;
// 	return passed;
// }
bool test_string() {
	bool passed = true;
	string str = "Hello, World!";
	passed &= str == "Hello, World!";
	str = "Hi there.";
	passed &= str == "Hi there.";
	string str2 = "I'm here, too!";
	passed &= str != str2;
	str = str2;
	passed &= str == "I'm here, too!";
	return passed;
}
void tests() {
	test_if_else();
	test_array();
	test_pointer();
	test_array_pointer();
	test_pointer_math();
	// test_malloc_free();
	// test_heap();
	// test_dynamic_array();
	test_struct();
	test_struct_array();
	test_nested_struct();
	test_nested_struct_array();
	test_struct_pointer_dot();
	test_while_break_continue();
	test_do_while();
	test_nested_loop();
	test_inc_dec();
	// test_unary();
	test_string();
}
// void bugs() {
// 	// The size of this struct is infinity or zero
// 	struct Recurse {
// 		Recurse bug;
// 	};
// 	// The same thing can happen with indirect recursion
// 	// but because our language has forward declaration
// 	// we are safe, for now
// 	struct Recurse2 {
// 		Recurse3 bug;
// 	};
// 	struct Recurse3 {
// 		Recurse2 bug;
// 	};
// }
void linked_list() {
	struct List_Item {
		int value;
		List_Item* next;
	};
	List_Item[4] list;
	list[0].value = 1;
	list[1].value = 2;
	list[2].value = 3;
	list[3].value = 4;
	list[0].next = &list[1];
	list[1].next = &list[2];
	list[2].next = &list[3];
	list[3].next = 0;
	list[0].next.next.next.value = list[0].next.next.next.value;
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
			"FizzBuzz";
		}
		else if (i % 5 == 0) {
			"Buzz";
		}
		else if (i % 3 == 0) {
			"Fizz";
		}
		else {
			i;
		}
	}
}
int main() {
	// bug with strings and comments
	// tests();

    int local_variable = 3;
	// some_function(local_variable);

	// factorial(local_variable);

	// fizzbuzz(30);

	linked_list();
	linked_list();
	return local_variable;
}
main();
`;

function main() {

    canvas.width = screen.width;
    canvas.height = screen.height;

    // window.addEventListener("resize", handle_resize);
    function handle_resize() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        call_resize(canvas.width, canvas.height);
    }
    
    call_init(canvas.width, canvas.height);
    // handle_resize();
    set_text(code);
    window.addEventListener("beforeunload", handle_beforeunload);
}
function handle_beforeunload() {
    call_deinit();
}
Module.postRun.push(main);