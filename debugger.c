#include "debugger.h"

#include "debug.h"

bool initialized = false;

char* my_text;
struct Code_Nodes* my_code_nodes;

EM_BOOL keydown(int event_type, const struct EmscriptenKeyboardEvent* event, void* user_data) {
    EM_BOOL consumed = false;
    if (strcmp(event->key, "f") == 0) {
        interaction_data.show_values = interaction_data.show_values == false;
        consumed = true;
    }
    else if (strcmp(event->key, "c") == 0) {
        interaction_data.show_changes = interaction_data.show_changes == false;
        consumed = true;
    }
    else if (strcmp(event->key, "g") == 0) {
        interaction_data.expand_all = interaction_data.expand_all == false;
        consumed = true;
    }
    else if (strcmp(event->key, "e") == 0) {
        interaction_data.show_elements = interaction_data.show_elements == false;
        consumed = true;
    }
    else if (strcmp(event->key, "v") == 0) {
        interaction_data.show_parens = interaction_data.show_parens == false;
        consumed = true;
    }
    /*
    else if (strcmp(event->key, "c") == 0) {
        // comments
        consumed = true;
    }
    */
    else if (strcmp(event->key, "z") == 0) {
        if (interaction_data.execution_index > 0) {
            interaction_data.execution_index -= 1;
            interaction_data.cursor = run_data.execution_stack->first[interaction_data.execution_index];
        }
        consumed = true;
    }
    else if (strcmp(event->key, "x") == 0) {
        if (interaction_data.execution_index < run_data.execution_stack->length - 1) {
            interaction_data.execution_index += 1;
            interaction_data.cursor = run_data.execution_stack->first[interaction_data.execution_index];
        }
        consumed = true;
    }
    else if (strcmp(event->key, "w") == 0) {
        move_up_line();
        consumed = true;
    }
    else if (strcmp(event->key, "s") == 0) {
        move_down_line();
        consumed = true;
    }
    else if (strcmp(event->key, "a") == 0) {
        move_left_line();
        consumed = true;
    }
    else if (strcmp(event->key, "d") == 0) {
        move_right_line();
        consumed = true;
    }
    else if (strcmp(event->key, "r") == 0) {
        prev_clone();
        consumed = true;
    }
    else if (strcmp(event->key, "t") == 0) {
        next_clone();
        consumed = true;
    }
    else if (strcmp(event->key, "y") == 0) {
        prev_use();
        consumed = true;
    }
    else if (strcmp(event->key, "u") == 0) {
        next_use();
        consumed = true;
    }
    else if (strcmp(event->key, "h") == 0) {
        prev_change();
        consumed = true;
    }
    else if (strcmp(event->key, "j") == 0) {
        next_change();
        consumed = true;
    }
    return consumed;
}

// @Incomplete
// column_index must get truncated
void move_up_line() {
    if (my_render_data.cursor_line > 0) {
        struct Code_Node_Array* nodes = NULL;
        size_t i = my_render_data.cursor_line - 1;
        while (i >= 0) {
            nodes = my_render_data.lines->first + i;
            if (nodes->length > 0) {
                break;
            }
            if (i == 0) {
                return;
            }
            i -= 1;
        }
        size_t last_column_index = nodes->length - 1;
        if (interaction_data.column_index > last_column_index) {
            interaction_data.column_index = last_column_index;
        }
        struct Code_Node* node = nodes->first[interaction_data.column_index];
        interaction_data.cursor = node;
        interaction_data.execution_index = node->execution_index;
    }
}
void move_down_line() {
    size_t last_line_index = my_render_data.line_index - 1;
    if (my_render_data.cursor_line < last_line_index) {
        struct Code_Node_Array* nodes = NULL;
        size_t i = my_render_data.cursor_line + 1;
        while (i <= last_line_index) {
            nodes = my_render_data.lines->first + i;
            if (nodes->length > 0) {
                break;
            }
            if (i == last_line_index) {
                return;
            }
            i += 1;
        }
        size_t last_column_index = nodes->length - 1;
        if (interaction_data.column_index > last_column_index) {
            interaction_data.column_index = last_column_index;
        }
        struct Code_Node* node = nodes->first[interaction_data.column_index];
        interaction_data.cursor = node;
        interaction_data.execution_index = node->execution_index;
    }
}
void move_left_line() {
    struct Code_Node_Array* nodes = my_render_data.lines->first + my_render_data.cursor_line;
    if (interaction_data.column_index > 0) {
        interaction_data.column_index -= 1;
        struct Code_Node* node = nodes->first[interaction_data.column_index];
        interaction_data.cursor = node;
        interaction_data.execution_index = node->execution_index;
    }
}
void move_right_line() {
    struct Code_Node_Array* nodes = my_render_data.lines->first + my_render_data.cursor_line;
    if (interaction_data.column_index < nodes->length - 1) {
        interaction_data.column_index += 1;
        struct Code_Node* node = nodes->first[interaction_data.column_index];
        interaction_data.cursor = node;
        interaction_data.execution_index = node->execution_index;
    }
}

void prev_clone() {
    struct Indices_Array* indices = map_original_to_indices(interaction_data.cursor->original);
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t prev_index = find_prev_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}
void next_clone() {
    struct Indices_Array* indices = map_original_to_indices(interaction_data.cursor->original);
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t next_index = find_next_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[next_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}

void prev_use() {
    if (interaction_data.cursor->pointer == 0xdeadbeef) {
        return;
    }
    struct Indices_Array* indices = map_uses_to_indices(interaction_data.cursor->pointer);
    if (indices == NULL) {
        printf("use indices not found!\n");
        return;
    }
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t prev_index = find_prev_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}
void next_use() {
    if (interaction_data.cursor->pointer == 0xdeadbeef) {
        return;
    }
    struct Indices_Array* indices = map_uses_to_indices(interaction_data.cursor->pointer);
    if (indices == NULL) {
        printf("use indices not found!\n");
        return;
    }
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t next_index = find_next_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[next_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}

void prev_change() {
    if (interaction_data.cursor->pointer == 0xdeadbeef) {
        return;
    }
    struct Indices_Array* indices = map_changes_to_indices(interaction_data.cursor->pointer);
    if (indices == NULL) {
        printf("change indices not found!\n");
        return;
    }
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t prev_index = find_prev_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}
void next_change() {
    if (interaction_data.cursor->pointer == 0xdeadbeef) {
        return;
    }
    struct Indices_Array* indices = map_changes_to_indices(interaction_data.cursor->pointer);
    printf("pointer: %zu\n", interaction_data.cursor->pointer);
    for (size_t i = 0; i < indices->length; i += 1) {
        printf("%zu\n", indices->first[i]);
    }
    printf("-------------------\n");
    if (indices == NULL) {
        printf("change indices not found!\n");
        return;
    }
    size_t curr_index = interaction_data.cursor->execution_index;
    size_t next_index = find_next_index_in_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[next_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}

size_t find_prev_index_in_array(struct Indices_Array* array, size_t index) {
	size_t i = array->length;
	while (i > 0) {
		i -= 1;
        size_t prev_index = array->first[i];
		if (prev_index < index) {
			return prev_index;
		}
	}
	return index;
}
size_t find_next_index_in_array(struct Indices_Array* array, size_t index) {
	size_t i = 0;
	while (i < array->length) {
        size_t next_index = array->first[i];
		if (next_index > index) {
			return next_index;
		}
		i += 1;
	}
	return index;
}

EMSCRIPTEN_KEEPALIVE
int init(int start_width, int start_height) {

    init_parser();
    init_renderer();

    resize(start_width, start_height);

    interaction_data.show_values = false;
    interaction_data.show_changes = false;
    interaction_data.show_parens = false;
    interaction_data.show_elements = false;
    interaction_data.expand_all = false;
    interaction_data.execution_index = 0;
    interaction_data.column_index = 0;
    interaction_data.scroll_x = 0;
    interaction_data.scroll_y = 0;

    emscripten_set_keydown_callback("#window", NULL, false, &keydown);
    emscripten_set_main_loop(&step, 20, 0);

    initialized = true;

    return 1;
}
EMSCRIPTEN_KEEPALIVE
int deinit() {

    emscripten_webgl_destroy_context(debugger_context);
    emscripten_cancel_main_loop();

    initialized = false;

    return 1;
}

EMSCRIPTEN_KEEPALIVE
void step() {
    if (my_code_nodes != NULL) {
        render(my_code_nodes->first);
    }
}

EMSCRIPTEN_KEEPALIVE
void resize(int new_width, int new_height) {
    my_render_data.width = new_width;
    my_render_data.height = new_height;
}

EMSCRIPTEN_KEEPALIVE
void set_text(char* new_text) {
    if (initialized) {
        free(my_text);
    }
    my_text = new_text;
    
    struct Token_Array* token_array = tokenize(my_text);
    
    token_array->curr_token = token_array->first;

    struct Code_Nodes* code_nodes = parse(token_array);

    infer(code_nodes->first);
    
    my_code_nodes = code_nodes;
    
    init_run(code_nodes);

    run_statement(code_nodes->first);
    run_data.did_run = true;
    interaction_data.cursor = run_data.execution_stack->first[0];
}

int main() {
    return 0;
}