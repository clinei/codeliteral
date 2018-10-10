#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>
#include <emscripten/html5.h>

#include "util.h"
#include "parser.h"

struct Interaction_Data {
    bool show_values;
    bool show_changes;
    bool show_parens;
    bool expand_all;
    bool show_elements;
    size_t execution_index;
    struct Code_Node* cursor;
};
struct Interaction_Data interaction_data;

EM_BOOL keydown(int event_type, const struct EmscriptenKeyboardEvent* event, void* user_data);

EMSCRIPTEN_KEEPALIVE
int init(int start_width, int start_height);
EMSCRIPTEN_KEEPALIVE
int deinit();
EMSCRIPTEN_KEEPALIVE
void step();
EMSCRIPTEN_KEEPALIVE
void resize(int new_width, int new_height);
EMSCRIPTEN_KEEPALIVE
void set_text(char* new_text);