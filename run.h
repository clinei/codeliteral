#pragma once

#include <setjmp.h>

#include "parser.h"
#include "bytecode.h"
#include "interaction.h"

void init_run();

struct Original_To_Clone_Map_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    struct Code_Node** originals;
    struct Code_Node** clones;
};
struct Original_To_Indices_Map_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    struct Code_Node** originals;
    struct Indices_Array** indices;
};
struct Offsets_To_Indices_Map_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    size_t* offsets;
    struct Indices_Array** indices;
};
struct Name_Uses_Map_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    char** names;
    size_t* uses;
};
struct Run_Data {
    struct Code_Nodes* code_nodes;
    struct Code_Node_Array* execution_stack;
    struct Original_To_Clone_Map_SOA* original_to_clone;
    struct Original_To_Indices_Map_SOA* original_to_indices;
    struct Offsets_To_Indices_Map_SOA* uses_to_indices;
    struct Offsets_To_Indices_Map_SOA* changes_to_indices;

    void* memory;
    size_t memory_size;
    size_t stack_pointer;

    struct Code_Node* last_block;
    struct Code_Node* last_call;
    struct Code_Node* last_loop;
    size_t statement_index;
    size_t execution_index;

    bool did_run;
    jmp_buf abort_jmp;

    bool count_uses;
    struct Name_Uses_Map_SOA* name_uses;
};
struct Run_Data run_data;

struct Code_Node* math_binop(struct Code_Node* left, char* op, struct Code_Node* right);
struct Code_Node* math_solve(struct Code_Node* node);

struct Code_Node* maybe_cast(struct Code_Node* lhs, struct Code_Node* rhs);

size_t run_lvalue(struct Code_Node* node);
struct Code_Node* run_rvalue(struct Code_Node* node);
struct Code_Node* run_statement(struct Code_Node* node);

struct Indices_Array* map_original_to_indices(struct Code_Node* original);
struct Indices_Array* map_uses_to_indices(size_t offset);
struct Indices_Array* map_changes_to_indices(size_t offset);

struct Code_Node* clone(struct Code_Node* node);
void transform(struct Code_Node* node);

void fill_result_str(struct Code_Node* node);