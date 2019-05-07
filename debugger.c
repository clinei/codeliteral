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
    else if (strcmp(event->key, "k") == 0) {
        add_flowpoint();
        consumed = true;
    }
    else if (strcmp(event->key, "l") == 0) {
        remove_flowpoint();
        consumed = true;
    }
    else if (strcmp(event->key, "i") == 0) {
        prev_flowpoint();
        consumed = true;
    }
    else if (strcmp(event->key, "o") == 0) {
        next_flowpoint();
        consumed = true;
    }
    else if (strcmp(event->key, "0") == 0) {
        interaction_data.flow_index = 0;
        consumed = true;
    }
    else if (strcmp(event->key, "1") == 0) {
        interaction_data.flow_index = 1;
        consumed = true;
    }
    else if (strcmp(event->key, "2") == 0) {
        interaction_data.flow_index = 2;
        consumed = true;
    }
    else if (strcmp(event->key, "3") == 0) {
        interaction_data.flow_index = 3;
        consumed = true;
    }
    else if (strcmp(event->key, "4") == 0) {
        interaction_data.flow_index = 4;
        consumed = true;
    }
    else if (strcmp(event->key, "5") == 0) {
        interaction_data.flow_index = 5;
        consumed = true;
    }
    else if (strcmp(event->key, "6") == 0) {
        interaction_data.flow_index = 6;
        consumed = true;
    }
    else if (strcmp(event->key, "7") == 0) {
        interaction_data.flow_index = 7;
        consumed = true;
    }
    else if (strcmp(event->key, "8") == 0) {
        interaction_data.flow_index = 8;
        consumed = true;
    }
    else if (strcmp(event->key, "9") == 0) {
        interaction_data.flow_index = 9;
        consumed = true;
    }
    else if (strcmp(event->key, "q") == 0) {
        // :Debug
        printf("serial: %zu\n", interaction_data.cursor->serial);
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
    size_t curr_index = interaction_data.execution_index;
    size_t prev_index = find_prev_elem_in_indices_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}
void next_clone() {
    struct Indices_Array* indices = map_original_to_indices(interaction_data.cursor->original);
    size_t curr_index = interaction_data.execution_index;
    size_t next_index = find_next_elem_in_indices_array(indices, curr_index);
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
    size_t curr_index = interaction_data.execution_index;
    size_t prev_index = find_prev_elem_in_indices_array(indices, curr_index);
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
    size_t curr_index = interaction_data.execution_index;
    size_t next_index = find_next_elem_in_indices_array(indices, curr_index);
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
    size_t curr_index = interaction_data.execution_index;
    size_t prev_index = find_prev_elem_in_indices_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}
void next_change() {
    if (interaction_data.cursor->pointer == 0xdeadbeef) {
        return;
    }
    struct Indices_Array* indices = map_changes_to_indices(interaction_data.cursor->pointer);
    if (indices == NULL) {
        printf("change indices not found!\n");
        return;
    }
    size_t curr_index = interaction_data.execution_index;
    size_t next_index = find_next_elem_in_indices_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[next_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = node->execution_index;
}

void add_flowpoint() {
    if (interaction_data.flow_index >= interaction_data.flows->length) {
        printf("flow index out of bounds when trying to add flowpoint!\n");
        return;
    }
    struct Indices_Array* indices = interaction_data.flows->first + interaction_data.flow_index;
    size_t curr_index = interaction_data.execution_index;
    size_t flowpoint_index = find_next_index(indices, &curr_index, &compare_indices);
    if (indices->length == 0) {
        flowpoint_index = 0;
    }
    else if (indices->first[flowpoint_index] == curr_index) {
        // no duplicates
        return;
    }
    array_splice(indices, flowpoint_index, 0, 1, &curr_index);
}
void remove_flowpoint() {
    if (interaction_data.flow_index >= interaction_data.flows->length) {
        printf("flow index out of bounds when trying to remove flowpoint!\n");
        return;
    }
    struct Indices_Array* indices = interaction_data.flows->first + interaction_data.flow_index;
    size_t curr_index = interaction_data.execution_index;
    size_t flowpoint_index = find_index(indices, &curr_index);
    if (flowpoint_index < indices->length) {
        array_splice(indices, flowpoint_index, 1, 0, NULL);
    }
}

void prev_flowpoint() {
    if (interaction_data.flow_index >= interaction_data.flows->length) {
        printf("flow index out of bounds when trying to go to prev flowpoint!\n");
        return;
    }
    struct Indices_Array* indices = interaction_data.flows->first + interaction_data.flow_index;
    size_t curr_index = interaction_data.execution_index;
    size_t prev_index = find_prev_elem_in_indices_array(indices, curr_index);

    struct Indices_Array* array = indices;
    struct Code_Node* node = run_data.execution_stack->first[prev_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = prev_index;
}
void next_flowpoint() {
    if (interaction_data.flow_index >= interaction_data.flows->length) {
        printf("flow index out of bounds when trying to go to next flowpoint!\n");
        return;
    }
    struct Indices_Array* indices = interaction_data.flows->first + interaction_data.flow_index;
    size_t curr_index = interaction_data.execution_index;
    size_t next_index = find_next_elem_in_indices_array(indices, curr_index);
    struct Code_Node* node = run_data.execution_stack->first[next_index];
    interaction_data.cursor = node;
    interaction_data.execution_index = next_index;
}

int compare_indices(void* a, void* b) {
    size_t left = *(size_t*)a;
    size_t right = *(size_t*)b;
    if (left > right) {
        return 1;
    }
    else if (left < right) {
        return -1;
    }
    else {
        return 0;
    }
}
size_t find_prev_elem_in_indices_array(struct Indices_Array* array, size_t index) {
    size_t prev_index = find_prev_index(array, &index, &compare_indices);
    if (prev_index == array->length) {
        return index;
    }
    else {
        return array->first[prev_index];
    }
}
size_t find_next_elem_in_indices_array(struct Indices_Array* array, size_t index) {
    size_t next_index = find_next_index(array, &index, &compare_indices);
    if (next_index == array->length) {
        return index;
    }
    else {
        return array->first[next_index];
    }
}

EMSCRIPTEN_KEEPALIVE
int init(int start_width, int start_height) {

    init_parser();
    init_renderer();
    init_interaction();

    resize(start_width, start_height);

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