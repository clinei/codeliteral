#pragma once

#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include <string.h>

#include "util.h"

void init_parser();
void init_type_infos();
void init_user_types();
void init_infer();

enum Token_Kind {
    TOKEN_KIND_KEYWORD = 0,
    TOKEN_KIND_IDENT = 1,
    TOKEN_KIND_STRING = 2,
    TOKEN_KIND_PUNC = 3,
    TOKEN_KIND_OP = 4,
    TOKEN_KIND_LITERAL = 5,
    TOKEN_KIND_COMMENT_SINGLE = 6,
    TOKEN_KIND_COMMENT_MULTI = 7,
};
struct Token {
    enum Token_Kind kind;
    char* str;
};
struct Token_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Token* first;
    struct Token* last;
    struct Token* curr_token;
};

enum Code_Kind {
	CODE_KIND_IF = 0,
	CODE_KIND_ELSE = 1,
	CODE_KIND_WHILE = 2,
	CODE_KIND_DO_WHILE = 3,
    // 4
	CODE_KIND_FOR = 5,
	CODE_KIND_BREAK = 6,
	CODE_KIND_CONTINUE = 7,
    CODE_KIND_IDENT = 8,
    CODE_KIND_INCREMENT = 9,
    CODE_KIND_DECREMENT = 10,
    CODE_KIND_MINUS = 11,
    CODE_KIND_NOT = 12,
	CODE_KIND_ASSIGN = 13,
	CODE_KIND_OPASSIGN = 14,
	CODE_KIND_BLOCK = 15,
	CODE_KIND_PROCEDURE = 16,
    CODE_KIND_STRUCT = 17,
    CODE_KIND_DECLARATION = 18,
    CODE_KIND_REFERENCE = 19,
    CODE_KIND_DEREFERENCE = 20,
    CODE_KIND_ARRAY_INDEX = 21,
    CODE_KIND_DOT_OPERATOR = 22,
	CODE_KIND_CALL = 23,
	CODE_KIND_RETURN = 24,
	CODE_KIND_BINARY_OPERATION = 25,
    CODE_KIND_STRING = 26,
    CODE_KIND_PARENS = 27,
    CODE_KIND_LITERAL_INT = 28,
    CODE_KIND_LITERAL_UINT = 29,
    CODE_KIND_LITERAL_FLOAT = 30,
    CODE_KIND_LITERAL_BOOL = 31,
    CODE_KIND_NATIVE_CODE = 32,
};

struct Code_Procedure {
    struct Code_Node_Array* params;
    bool has_varargs;
	struct Type_Info* return_type;
	struct Code_Node* block;

    struct Code_Node* return_ident;
};
struct Code_Call {
	struct Code_Node* ident;
    struct Code_Node_Array* args;

    bool returned;
    struct Code_Node* return_ident;
};
struct Code_Declaration {
	struct Type_Info* type;
	struct Code_Node* ident;
	struct Code_Node* expression;

    size_t pointer;
    size_t alignment_pad;
};
struct Code_Reference {
    struct Code_Node* expression;
};
struct Code_Dereference {
    struct Code_Node* expression;
};
struct Code_Array_Index {
    struct Code_Node* array;
    struct Code_Node* index;
};
struct Code_Dot_Operator {
    struct Code_Node* left;
    struct Code_Node* right;
};
struct Extras {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Code_Node_Array* first;
    struct Code_Node_Array* last;
};
struct Code_Block {
    struct Code_Node_Array* statements;
    struct Code_Node_Array* declarations;
    struct Code_Node_Array* typedefs;
    struct Code_Node_Array* allocations;
    struct Extras* extras;
    struct Code_Node* parent;
    // which of these do we actually need?
    struct Code_Node* transformed_from;
    bool is_transformed_block;
};
struct Code_Return {
    struct Code_Node* expression;
    // for moving between clones and uses and changes
    struct Code_Node* ident;
};
struct Code_Struct {
    struct Code_Node* block;
};
struct Code_If {
    struct Code_Node* condition;
    struct Code_Node* expression;
};
struct Code_Else {
    struct Code_Node* expression;
    struct Code_Node* if_expr;
};
struct Code_While {
    struct Code_Node* condition;
    struct Code_Node* expression;
};
struct Code_Do_While {
    struct Code_Node* condition;
    struct Code_Node* expression;
};
struct Code_For {
    struct Code_Node* begin;
    struct Code_Node* condition;
    struct Code_Node* cycle_end;
    struct Code_Node* expression;
};
struct Code_Minus {
    struct Code_Node* expression;
};
struct Code_Not {
    struct Code_Node* expression;
};
struct Code_Increment {
    struct Code_Node* ident;
};
struct Code_Decrement {
    struct Code_Node* ident;
};
struct Code_Assign {
    struct Code_Node* ident;
    struct Code_Node* expression;
};
struct Code_Opassign {
    struct Code_Node* ident;
    char* operation_type;
    struct Code_Node* expression;
};
struct Code_Binary_Operation {
    struct Code_Node* left;
    char* operation_type;
    struct Code_Node* right;
};
struct Code_Ident {
    char* name;
    struct Code_Node* declaration;
};
struct Code_Literal_Int {
    signed long int value;
};
struct Code_Literal_Uint {
    unsigned long int value;
};
struct Code_Literal_Float {
    double value;
    float value_f32;
};
struct Code_Literal_Bool {
    bool value;
};
struct Code_String {
    char* pointer;
    size_t length;
};
struct Code_Parens {
    struct Code_Node* expression;
};
struct Code_Native_Code {
    void* func_ptr;
};
struct Code_Node {
	enum Code_Kind kind;
	struct Type_Info* type;
	size_t serial;

    // @Incomplete
    // convert to flags
    bool was_run;
    bool broken;
    bool continued;
    bool is_lhs;
    bool is_on_execution_stack;
    size_t execution_index;
    size_t pointer;
    struct Code_Node* original;
    struct Code_Node* result;
    struct Code_Node* transformed;

    bool demands_expand;
    bool should_expand;
    char* str;

    union {
        struct Code_Procedure procedure;
        struct Code_Call call;
        struct Code_Declaration declaration;
        struct Code_Reference reference;
        struct Code_Dereference dereference;
        struct Code_Array_Index array_index;
        struct Code_Dot_Operator dot_operator;
        struct Code_Block block;
        struct Code_Return return_;
        struct Code_Struct struct_;
        struct Code_If if_;
        struct Code_Else else_;
        struct Code_While while_;
        struct Code_Do_While do_while_;
        struct Code_For for_;
        struct Code_Minus minus;
        struct Code_Not not;
        struct Code_Increment increment;
        struct Code_Decrement decrement;
        struct Code_Assign assign;
        struct Code_Opassign opassign;
        struct Code_Binary_Operation binary_operation;
        struct Code_Ident ident;
        struct Code_String string_;
        struct Code_Parens parens;
        struct Code_Literal_Int literal_int;
        struct Code_Literal_Uint literal_uint;
        struct Code_Literal_Float literal_float;
        struct Code_Literal_Bool literal_bool;
        struct Code_Native_Code native_code;
    };
};
struct Code_Nodes {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Code_Node* first;
    struct Code_Node* last;
};
struct Code_Node_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Code_Node** first;
    struct Code_Node** last;
};

struct Code_Node* get_new_code_node(struct Code_Nodes* code_nodes);

struct Type_Info* make_type_info_integer(size_t size_in_bytes, bool is_signed);
struct Type_Info* make_type_info_float(size_t size_in_bytes);
struct Type_Info* make_type_info_array(struct Type_Info* elem_type, size_t length, char* length_str);
struct Type_Info* make_type_info_string();
struct Type_Info* make_type_info_pointer(struct Type_Info* elem_type);
struct Type_Info* make_type_info_function_pointer(struct Type_Info* return_type,
                                                  struct Type_Info** param_types);
struct Type_Info* make_type_info_struct_dummy();
struct Type_Info* make_type_info_ident(char* name, struct Type_Info* type);
struct Type_Info* make_type_info_void();

struct Code_Node* make_procedure(struct Code_Nodes* code_nodes,
                                 struct Code_Node_Array* params,
                                 bool has_varargs,
                                 struct Type_Info* return_type,
                                 struct Code_Node* block);
struct Code_Node* make_call(struct Code_Nodes* code_nodes,
                            struct Code_Node* ident,
                            struct Code_Node_Array* args);
struct Code_Node* make_declaration(struct Code_Nodes* code_nodes,
                                   struct Type_Info* type,
                                   struct Code_Node* ident,
                                   struct Code_Node* expression);
struct Code_Node* make_reference(struct Code_Nodes* code_nodes,
                                 struct Code_Node* expression);
struct Code_Node* make_dereference(struct Code_Nodes* code_nodes,
                                   struct Code_Node* expression);
struct Code_Node* make_array_index(struct Code_Nodes* code_nodes,
                                   struct Code_Node* array,
                                   struct Code_Node* index);
struct Code_Node* make_dot_operator(struct Code_Nodes* code_nodes,
                                    struct Code_Node* left,
                                    struct Code_Node* right);
struct Code_Node* make_block(struct Code_Nodes* code_nodes,
                             struct Code_Node_Array* statements);
struct Code_Node* make_return(struct Code_Nodes* code_nodes,
                              struct Code_Node* expression,
                              struct Code_Node* ident);
struct Code_Node* make_struct(struct Code_Nodes* code_nodes,
                              struct Code_Node* block);
struct Code_Node* make_if(struct Code_Nodes* code_nodes,
                          struct Code_Node* condition,
                          struct Code_Node* expression);
struct Code_Node* make_else(struct Code_Nodes* code_nodes,
                            struct Code_Node* expression);
struct Code_Node* make_while(struct Code_Nodes* code_nodes,
                             struct Code_Node* condition,
                             struct Code_Node* expression);
struct Code_Node* make_do_while(struct Code_Nodes* code_nodes,
                                struct Code_Node* condition,
                                struct Code_Node* expression);
struct Code_Node* make_for(struct Code_Nodes* code_nodes,
                           struct Code_Node* begin,
                           struct Code_Node* condition,
                           struct Code_Node* cycle_end,
                           struct Code_Node* expression);
struct Code_Node* make_break(struct Code_Nodes* code_nodes);
struct Code_Node* make_continue(struct Code_Nodes* code_nodes);
struct Code_Node* make_minus(struct Code_Nodes* code_nodes,
                             struct Code_Node* expression);
struct Code_Node* make_not(struct Code_Nodes* code_nodes,
                           struct Code_Node* expression);
struct Code_Node* make_increment(struct Code_Nodes* code_nodes,
                                 struct Code_Node* ident);
struct Code_Node* make_decrement(struct Code_Nodes* code_nodes,
                                 struct Code_Node* ident);
struct Code_Node* make_assign(struct Code_Nodes* code_nodes,
                              struct Code_Node* ident,
                              struct Code_Node* expression);
struct Code_Node* make_opassign(struct Code_Nodes* code_nodes,
                                struct Code_Node* ident,
                                char* operation_type,
                                struct Code_Node* expression);
struct Code_Node* make_binary_operation(struct Code_Nodes* code_nodes,
                                        struct Code_Node* left,
                                        char* operation_type,
                                        struct Code_Node* right);
struct Code_Node* make_ident(struct Code_Nodes* code_nodes,
                             char* name,
                             struct Code_Node* declaration);
struct Code_Node* make_literal_int(struct Code_Nodes* code_nodes,
                                   signed long int value);
struct Code_Node* make_literal_uint(struct Code_Nodes* code_nodes,
                                    unsigned long int value);
struct Code_Node* make_literal_float(struct Code_Nodes* code_nodes,
                                     double value);
struct Code_Node* make_literal_bool(struct Code_Nodes* code_nodes,
                                    bool value);
struct Code_Node* make_string(struct Code_Nodes* code_nodes,
                              char* pointer);
struct Code_Node* make_parens(struct Code_Nodes* code_nodes,
                              struct Code_Node* expression);
struct Code_Node* make_native_code(struct Code_Nodes* code_nodes,
                                   void* func_ptr);

struct Parse_Data {
    struct Code_Node* last_block;
};
struct Parse_Data parse_data;

enum Type_Info_Tag {
    TYPE_INFO_TAG_INTEGER = 0,
    TYPE_INFO_TAG_FLOAT = 1,
    TYPE_INFO_TAG_VOID = 2,
    TYPE_INFO_TAG_ARRAY = 3,
    TYPE_INFO_TAG_POINTER = 4,
    TYPE_INFO_TAG_STRING = 5,
    TYPE_INFO_TAG_FUNCTION_POINTER = 6,
    TYPE_INFO_TAG_STRUCT = 7,
    TYPE_INFO_TAG_IDENT = 8,
};
struct Type_Info_Integer {
    bool is_signed;
};
struct Type_Info_Float {
};
struct Type_Info_Array { // static
    struct Type_Info* elem_type;
    size_t length;
    char* length_str;
};
struct Type_Info_String {
    size_t length;
};
struct Type_Info_Pointer {
    struct Type_Info* elem_type;
};
struct Type_Info_Function_Pointer {
    struct Type_Info* return_type;
    struct Type_Info** param_types;
    size_t param_types_capacity;
    size_t param_types_length;
};
struct Type_Info_Struct {
    struct Type_Info** members;
    char** member_names;
    size_t* offsets;
    size_t members_capacity;
    size_t members_length;
};
struct Type_Info_Ident {
    char* name;
    struct Type_Info* type;
};
struct Type_Info {
    enum Type_Info_Tag kind;
    size_t size_in_bytes;

    union {
        struct Type_Info_Integer integer;
        struct Type_Info_Float float_;
        struct Type_Info_Array array;
        struct Type_Info_String string_;
        struct Type_Info_Pointer pointer;
        struct Type_Info_Function_Pointer function_pointer;
        struct Type_Info_Struct struct_;
        struct Type_Info_Ident ident;
    };
};
struct Type_Infos {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Type_Info* first;
    struct Type_Info* last;
};
struct Type_Infos* type_infos;
struct Type_Info* Native_Type_Char;
struct Type_Info* Native_Type_UChar;
struct Type_Info* Native_Type_Bool;
struct Type_Info* Native_Type_Short;
struct Type_Info* Native_Type_UShort;
struct Type_Info* Native_Type_Int;
struct Type_Info* Native_Type_UInt;
struct Type_Info* Native_Type_Long;
struct Type_Info* Native_Type_ULong;
struct Type_Info* Native_Type_Float;
struct Type_Info* Native_Type_Double;
struct Type_Info* Native_Type_String;
struct Type_Info* Native_Type_Void;
struct Type_Info* Native_Type_Size_t;

struct User_Types {
    size_t length;
    size_t capacity;
    size_t members_length;
    size_t* element_sizes;
    char** names;
    struct Type_Info** types;
};
struct User_Types* user_types;

void add_user_type(char* name, struct Type_Info* user_type);
size_t index_of_string(char* str, char** strings, size_t length);

struct Type_Info* map_name_to_type(char* name);
struct Type_Info* map_name_to_native_type(char* name);

char* code_kind_to_string(enum Code_Kind kind);
char* type_kind_to_string(enum Type_Info_Tag kind);

struct Code_Node* infer(struct Code_Node* node);
struct Type_Info* infer_type(struct Code_Node* node);

struct Infer_Data {
    struct Code_Node_Array* block_stack;

    struct Code_Node* last_block;
    size_t statement_index;

    struct Code_Node* last_declaration;
};

struct Code_Nodes* parse(struct Token_Array* token_array);
struct Code_Node* parse_statement(struct Token_Array* token_array,
                     struct Code_Nodes* code_nodes);
struct Code_Node* parse_if(struct Token_Array* token_array,
              struct Code_Nodes* code_nodes);
struct Code_Node* parse_else(struct Token_Array* token_array,
                struct Code_Nodes* code_nodes);
struct Code_Node* parse_while(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes);
struct Code_Node* parse_do_while(struct Token_Array* token_array,
                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_for(struct Token_Array* token_array,
               struct Code_Nodes* code_nodes);
struct Code_Node* parse_continue(struct Token_Array* token_array,
                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_break(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes);
struct Code_Node* parse_return(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes);
struct Code_Node* parse_block(struct Token_Array*,
                              struct Code_Nodes* code_nodes);
struct Code_Node* parse_increment(struct Token_Array*,
                                  struct Code_Nodes* code_nodes);
struct Code_Node* parse_decrement(struct Token_Array*,
                                  struct Code_Nodes* code_nodes);
struct Code_Node* parse_rvalue(struct Token_Array* token_array,
                               struct Code_Nodes* code_nodes);
struct Code_Node* parse_rvalue_atom(struct Token_Array* token_array,
                                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_lvalue(struct Token_Array* token_array,
                               struct Code_Nodes* code_nodes);
struct Code_Node* parse_procedure_declaration(struct Token_Array* token_array,
                                              struct Code_Nodes* code_nodes,
                                              struct Type_Info* return_type);
struct Code_Node* parse_param(struct Token_Array* token_array,
                              struct Code_Nodes* code_nodes);
struct Code_Node* parse_declaration(struct Token_Array* token_array,
                                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_declaration_precomputed_type(struct Token_Array* token_array,
                                                     struct Code_Nodes* code_nodes,
                                                     struct Type_Info* type);
struct Code_Node* parse_struct_declaration(struct Token_Array* token_array,
                                           struct Code_Nodes* code_nodes);
struct Code_Node* parse_assign(struct Token_Array* token_array,
                               struct Code_Nodes* code_nodes);
struct Code_Node* parse_opassign(struct Token_Array* token_array,
                                 struct Code_Nodes* code_nodes);
struct Code_Node* parse_call(struct Token_Array* token_array,
                             struct Code_Nodes* code_nodes);
struct Code_Node* parse_string(struct Token_Array* token_array,
                               struct Code_Nodes* code_nodes);
struct Code_Node* parse_literal(struct Token_Array* token_array,
                                struct Code_Nodes* code_nodes);
struct Code_Node* parse_ident(struct Token_Array* token_array,
                              struct Code_Nodes* code_nodes);
struct Code_Node* parse_reference(struct Token_Array* token_array,
                                  struct Code_Nodes* code_nodes);
struct Code_Node* parse_dereference(struct Token_Array* token_array,
                                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_array_index(struct Token_Array* token_array,
                                    struct Code_Nodes* code_nodes);
struct Code_Node* parse_dot_operator(struct Token_Array* token_array,
                                     struct Code_Nodes* code_nodes);
struct Type_Info* parse_type(struct Token_Array* token_array,
                             struct Code_Nodes* code_nodes,
                             struct Type_Info** out_type);
struct Type_Info* parse_array_type(struct Token_Array* token_array,
                                   struct Type_Info* prev_type,
                                   struct Type_Info** out_type);
struct Type_Info* parse_pointer_type(struct Token_Array* token_array,
                                     struct Type_Info* prev_type,
                                     struct Type_Info** out_type);
void delimited(char* start, char* stop, char* separator,
               struct Code_Node* (*elem_func)(struct Token_Array*, struct Code_Nodes*),
               struct Dynamic_Array* results,
               struct Token_Array* token_array,
               struct Code_Nodes* code_nodes);

enum Operator_Precedence {
    OPERATOR_PRECEDENCE_NONE = 12345,
    OPERATOR_PRECEDENCE_LAST = 999,
    OPERATOR_PRECEDENCE_COMMA = 15,
    OPERATOR_PRECEDENCE_ASSIGN = 14,
    OPERATOR_PRECEDENCE_TERNARY = 13,
    OPERATOR_PRECEDENCE_OR = 12,
    OPERATOR_PRECEDENCE_AND = 11,
    OPERATOR_PRECEDENCE_BITWISE_OR = 10,
    OPERATOR_PRECEDENCE_BITWISE_XOR = 9,
    OPERATOR_PRECEDENCE_BITWISE_AND = 8,
    OPERATOR_PRECEDENCE_EQUAL = 7,
    OPERATOR_PRECEDENCE_NOT_EQUAL = 7,
    OPERATOR_PRECEDENCE_GREATER_THAN = 6,
    OPERATOR_PRECEDENCE_GREATER_THAN_OR_EQUAL = 6,
    OPERATOR_PRECEDENCE_LESS_THAN = 6,
    OPERATOR_PRECEDENCE_LESS_THAN_OR_EQUAL = 6,
    OPERATOR_PRECEDENCE_PLUS = 4,
    OPERATOR_PRECEDENCE_MINUS = 4,
    OPERATOR_PRECEDENCE_MULTIPLY = 3,
    OPERATOR_PRECEDENCE_DIVIDE = 3,
    OPERATOR_PRECEDENCE_MODULO = 3,
};
enum Operator_Precedence map_operator_to_precedence(char* operator);
bool is_operator_result_boolean(char* operation_type);
bool maybe_binary(enum Operator_Precedence prev_prec,
                  struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes);

struct Token_Array* tokenize(char* input);
void read_token(struct Token* token, char** input);
char* read_while(bool (*func)(char), char** input);
char* read_while_lookahead(bool (*func)(char, char), char** input);
char* escape_string(char* str);
bool is_one_of(char* options, char ch);
bool is_one_of_strings(char** strings, size_t length, char* str);
bool is_in_range(char start, char end, char ch);
bool is_whitespace(char ch);
bool is_not_newline(char ch);
bool is_not_mlc_end(char ch, char next_ch);
bool is_string_start(char ch);
bool is_not_string_end(char ch);
bool is_punc(char ch);
bool is_ident_start(char ch);
bool is_ident_char(char ch);
bool is_digit(char ch);
bool is_digit_or_dot(char ch);
bool is_op_char(char ch);