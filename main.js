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
	};
	struct Person {
		uint age;
		Car car;
	};
	Person steve;
	/*
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
	};
	Person[2] people;
	for (int i = 0; i < people.length; i += 1) {
		people[i].age = (i + 1) * 10;
	};
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
// bool test_unary() {
// 	bool passed = true;
// 	int n = 1;
// 	passed &= -n == -1;
// 	return passed;
// }
bool test_string() {
	bool passed = true;
	char* str = "Hello, World!";
	passed &= str == "Hello, World!";
	str = "Hi there.";
	passed &= str == "Hi there.";
	char* str2 = "I'm here, too!";
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
}
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
			printf("%s\n", "FizzBuzz");
		}
		else if (i % 5 == 0) {
			printf("%s\n", "Buzz");
		}
		else if (i % 3 == 0) {
			printf("%s\n", "Fizz");
		}
		else {
			printf("%u\n", i);
		}
	}
}
void linked_list() {
	struct List_Node {
		void* data;
		List_Node*[2] links;
	};
	List_Node first;
}
int main() {
	float f;
	f = 0.3 - 0.2;
	printf("%f\n", f);
	tests();
    int local_variable = 3;
	some_function(local_variable);
	factorial(local_variable);
	fizzbuzz(15);
	// linked_list();
	return local_variable;
}
main();
`;
/*
const code = `
1 + 2 * 3 + 4;
`;
*/

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