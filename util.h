#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <stdarg.h>
#include <memory.h>
#include <assert.h>

#include <emscripten.h>
#include <emscripten/html5.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>

#include "debug.h"

GLuint compile_shader(GLenum type, const char* source);
GLuint create_program(const char* vertex_shader_filename, const char* fragment_shader_filename);
char* read_file(const char* filename);

typedef unsigned char bool;
#define false 0
#define true 1

typedef unsigned int uint;

struct Dynamic_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    void* first;
    void* last;
};

void array_init(struct Dynamic_Array* array, size_t element_size, size_t capacity);
bool array_push(struct Dynamic_Array* array, void* element);
void array_pop(struct Dynamic_Array* array);
bool array_next(struct Dynamic_Array* array);
void array_clear(struct Dynamic_Array* array);
void array_clear_after(struct Dynamic_Array* array, size_t index);
bool array_splice(struct Dynamic_Array* array, size_t insert_index,
                  size_t remove_count, size_t add_count, void* new_elements);
size_t find_index(struct Dynamic_Array* array, void* element);
size_t find_index_reverse(struct Dynamic_Array* array, void* element);
size_t find_next_index(struct Dynamic_Array* array, void* element, int (*compare)(void*, void*));
size_t find_prev_index(struct Dynamic_Array* array, void* element, int (*compare)(void*, void*));
bool array_maybe_realloc(struct Dynamic_Array* array);
void array_destroy(struct Dynamic_Array* array);

struct Dynamic_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
};
#define DYNAMIC_SOA_FIRST_MEMBER_OFFSET sizeof(size_t) * 3 + sizeof(size_t*)
#define DYNAMIC_SOA_NEXT_MEMBER_OFFSET sizeof(void*)

void soa_init(struct Dynamic_SOA* soa, size_t capacity, size_t members_length, ...);
bool soa_push(struct Dynamic_SOA* soa, ...);
bool soa_maybe_realloc(struct Dynamic_SOA* soa);