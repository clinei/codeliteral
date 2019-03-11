#pragma once

#include "util.h"
#include "parser.h"

struct Indices_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    size_t* first;
    size_t* last;
};
struct Flow_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Indices_Array* first;
    struct Indices_Array* last;
};
struct Interaction_Data {
    bool show_values;
    bool show_changes;
    bool show_parens;
    bool expand_all;
    bool show_elements;
    size_t execution_index;
    size_t column_index;
    size_t flow_index;
    struct Flow_Array* flows;
    struct Code_Node* cursor;
    struct Code_Node* cursor_rendered;
    float scroll_x;
    float scroll_y;
};
struct Interaction_Data interaction_data;

void init_interaction();