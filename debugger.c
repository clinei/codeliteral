#include "debugger.h"
#include "util.h"
#include "parser.h"
#include "run.h"
#include "renderer.h"

bool initialized = false;

char* my_text;
struct Code_Nodes* my_code_nodes;
struct Code_Node* main_call = NULL;

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
    return consumed;
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

    emscripten_set_keydown_callback("#window", NULL, false, &keydown);
    emscripten_set_main_loop(&step, 12, 0);

    initialized = true;

    struct Render_Data* render_data = &my_render_data;

    size_t execution_index = 42;

    if (true) {
        for (size_t j = 0; j < 10; j += 1) {
            printf("-----new frame\n");
            array_clear((struct Dynamic_Array*)(my_render_data.lines->first[0]));
            render_data->line_index = 0;
            for (size_t i = 0; i < 4; i += 1) {
                for (size_t k = 0; k < 2; k += 1) {
                    printf("---new node\n");
                    struct Indices_Array* indices = render_data->lines->first[render_data->line_index];
                    printf("line index: %zu\n", render_data->line_index);
                    printf("indices: %zu\n", indices);
                    printf("length: %zu\n", indices->length);
                    printf("before size: %zu\n", indices->element_size);
                    array_push((struct Dynamic_Array*)indices, &execution_index);
                    printf("after size: %zu\n", indices->element_size);
                    execution_index = indices->first[0];
                    printf("exec index: %zu\n", execution_index);
                    
                    if (indices->element_size != 4) {
                        abort();
                    }
                }
                // newline
                render_data->line_index += 1;
                printf("before lines length: %zu\n", render_data->lines->length);
                if (render_data->line_index >= render_data->lines->length) {
                    printf("adding new index arrays\n");
                    size_t new_capacity = render_data->line_index * 2;
                    while (render_data->lines->length < new_capacity) {
                        struct Indices_Array* indices = malloc(sizeof(struct Indices_Array));
                        array_init((struct Dynamic_Array*)indices, sizeof(size_t), 10);
                        array_push((struct Dynamic_Array*)render_data->lines, &indices);
                    }
                }
                array_clear((struct Dynamic_Array*)render_data->lines->first[render_data->line_index]);
            }
        }
        abort();
    }

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
    interaction_data.cursor = run_data.execution_stack->first[interaction_data.execution_index];
}

int main() {
    return 0;
}