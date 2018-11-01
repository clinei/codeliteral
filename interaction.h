#pragma once

#include "util.h"
#include "parser.h"

struct Interaction_Data {
    bool show_values;
    bool show_changes;
    bool show_parens;
    bool expand_all;
    bool show_elements;
    size_t execution_index;
    size_t column_index;
    struct Code_Node* cursor;
    float scroll_x;
    float scroll_y;
};
struct Interaction_Data interaction_data;