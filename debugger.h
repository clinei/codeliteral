#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>
#include <emscripten/html5.h>

#include "util.h"
#include "parser.h"
#include "run.h"
#include "interaction.h"
#include "renderer.h"

EM_BOOL keydown(int event_type, const struct EmscriptenKeyboardEvent* event, void* user_data);

void move_up_line();
void move_down_line();
void move_left_line();
void move_right_line();

void prev_clone();
void next_clone();

void prev_use();
void next_use();

void prev_change();
void next_change();

void add_flowpoint();
void remove_flowpoint();

void prev_flowpoint();
void next_flowpoint();

int compare_indices(void* a, void* b);

size_t find_prev_elem_in_indices_array(struct Indices_Array* array, size_t index);
size_t find_next_elem_in_indices_array(struct Indices_Array* array, size_t index);

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