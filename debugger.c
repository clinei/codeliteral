#include "debugger.h"
#include "util.h"
#include "parser.h"
#include "renderer.h"

bool initialized = false;

char* my_text;
struct Code_Node_Array* my_code_node_array;

EMSCRIPTEN_KEEPALIVE
void step() {
    render(my_code_node_array);
}

EMSCRIPTEN_KEEPALIVE
void resize(int new_width, int new_height) {
    my_render_data->width = new_width;
    my_render_data->height = new_height;
}

EMSCRIPTEN_KEEPALIVE
void set_text(char* new_text) {
    if (initialized) {
        free(my_text);
    }
    my_text = new_text;
    
    struct Token_Array* token_array = tokenize(my_text);
    
    token_array->curr_token = token_array->first;
    /*
    // print all tokens
    while (token_array->curr_token <= token_array->last) {
        printf("token: %d, %s\n", token_array->curr_token->kind, token_array->curr_token->str);
        token_array->curr_token++;
    }
    */

    struct Code_Node_Array* code_node_array = parse(token_array);

    infer(code_node_array->first);

    /*
    // print all nodes
    code_node_array->curr_node = code_node_array->first;
    while (code_node_array->curr_node <= code_node_array->last) {
        printf("node: %d\n", code_node_array->curr_node->kind);
        code_node_array->curr_node++;
    }
    */
    
    my_code_node_array = code_node_array;
}

EMSCRIPTEN_KEEPALIVE
int init(int start_width, int start_height) {

    init_parser();
    init_renderer();

    resize(start_width, start_height);

    emscripten_set_main_loop(&step, 12, 0);

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

int main() {
    return 0;
}