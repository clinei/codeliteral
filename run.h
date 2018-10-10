#pragma once

#include "parser.h"

void init_run();

struct Original_To_Clone_Map_SOA {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    struct Code_Node** originals;
    struct Code_Node** clones;
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

    void* memory;
    size_t memory_size;
    size_t stack_pointer;

    struct Code_Node* last_block;
    struct Code_Node* last_call;
    struct Code_Node* last_loop;
    size_t statement_index;

    bool did_run;

    bool count_uses;
    struct Name_Uses_Map_SOA* name_uses;
};
struct Run_Data run_data;

struct Code_Node* math_binop(struct Code_Node* left, char* op, struct Code_Node* right);
struct Code_Node* math_solve(struct Code_Node* node);

size_t run_lvalue(struct Code_Node* node);
struct Code_Node* run_rvalue(struct Code_Node* node);
struct Code_Node* run_statement(struct Code_Node* node);

struct Code_Node* clone(struct Code_Node* node);
void transform(struct Code_Node* node);

void fill_result_str(struct Code_Node* node);