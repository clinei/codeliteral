#pragma once

#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include <string.h>

#include "util.h"

void init_parser();
void init_type_infos();
void init_user_types();

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
    CODE_KIND_LITERAL_FLOAT = 29,
    CODE_KIND_LITERAL_BOOL = 30,
};

struct Code_Procedure {
	struct Code_Node** params;
    size_t params_length;
	struct Type_Info* return_type;
	struct Code_Node* block;
};
struct Code_Call {
	struct Code_Node* ident;
	struct Code_Node** args;
    size_t args_length;
};
struct Code_Declaration {
	struct Type_Info* type;
	struct Code_Node* ident;
	struct Code_Node* expression;
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
struct Code_Block {
    struct Code_Node** statements;
    size_t statements_length;
    bool is_transformed_block;
};
struct Code_Return {
    struct Code_Node* expression;
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
    int value;
};
struct Code_Literal_Float {
    float value;
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
struct Code_Node {
	enum Code_Kind kind;
	struct Type_Info* type;
	size_t serial;

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
        struct Code_Literal_Float literal_float;
        struct Code_Literal_Bool literal_bool;
    };
};
struct Code_Node_Array {
    size_t length;
    size_t capacity;
    struct Code_Node* first;
    struct Code_Node* last;
    struct Code_Node* curr_node;
};

struct Code_Node* get_new_node_from_code_node_array(struct Code_Node_Array* code_node_array);

struct Type_Info* make_type_info_integer(size_t size_in_bytes, bool is_signed);
struct Type_Info* make_type_info_float(size_t size_in_bytes);
struct Type_Info* make_type_info_string();
struct Type_Info* make_type_info_pointer(struct Type_Info* elem_type);
struct Type_Info* make_type_info_function_pointer(struct Type_Info* return_type,
                                                  struct Type_Info** param_types);
struct Type_Info* make_type_info_struct_dummy();
struct Type_Info* make_type_info_ident(char* name, struct Type_Info* type);
struct Type_Info* make_type_info_void();

struct Code_Node* make_procedure(struct Code_Node_Array* code_node_array,
                                 struct Code_Node** params,
                                 size_t params_length,
                                 struct Type_Info* return_type,
                                 struct Code_Node* block);
struct Code_Node* make_call(struct Code_Node_Array* code_node_array,
                            struct Code_Node* ident,
                            struct Code_Node** args,
                            size_t args_length);
struct Code_Node* make_declaration(struct Code_Node_Array* code_node_array,
                                   struct Type_Info* type,
                                   struct Code_Node* ident,
                                   struct Code_Node* expression);
struct Code_Node* make_reference(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* expression);
struct Code_Node* make_dereference(struct Code_Node_Array* code_node_array,
                                   struct Code_Node* expression);
struct Code_Node* make_array_index(struct Code_Node_Array* code_node_array,
                                   struct Code_Node* array,
                                   struct Code_Node* index);
struct Code_Node* make_dot_operator(struct Code_Node_Array* code_node_array,
                                    struct Code_Node* left,
                                    struct Code_Node* right);
struct Code_Node* make_block(struct Code_Node_Array* code_node_array,
                             struct Code_Node** statements,
                             size_t statements_length);
struct Code_Node* make_return(struct Code_Node_Array* code_node_array,
                              struct Code_Node* expression);
struct Code_Node* make_struct(struct Code_Node_Array* code_node_array,
                              struct Code_Node* block);
struct Code_Node* make_if(struct Code_Node_Array* code_node_array,
                          struct Code_Node* condition,
                          struct Code_Node* expression);
struct Code_Node* make_else(struct Code_Node_Array* code_node_array,
                            struct Code_Node* expression);
struct Code_Node* make_while(struct Code_Node_Array* code_node_array,
                             struct Code_Node* condition,
                             struct Code_Node* expression);
struct Code_Node* make_do_while(struct Code_Node_Array* code_node_array,
                                struct Code_Node* condition,
                                struct Code_Node* expression);
struct Code_Node* make_for(struct Code_Node_Array* code_node_array,
                           struct Code_Node* begin,
                           struct Code_Node* condition,
                           struct Code_Node* cycle_end,
                           struct Code_Node* expression);
struct Code_Node* make_break(struct Code_Node_Array* code_node_array);
struct Code_Node* make_continue(struct Code_Node_Array* code_node_array);
struct Code_Node* make_minus(struct Code_Node_Array* code_node_array,
                             struct Code_Node* expression);
struct Code_Node* make_not(struct Code_Node_Array* code_node_array,
                           struct Code_Node* expression);
struct Code_Node* make_increment(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* ident);
struct Code_Node* make_decrement(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* ident);
struct Code_Node* make_assign(struct Code_Node_Array* code_node_array,
                              struct Code_Node* ident,
                              struct Code_Node* expression);
struct Code_Node* make_opassign(struct Code_Node_Array* code_node_array,
                                struct Code_Node* ident,
                                char* operation_type,
                                struct Code_Node* expression);
struct Code_Node* make_binary_operation(struct Code_Node_Array* code_node_array,
                                        struct Code_Node* left,
                                        char* operation_type,
                                        struct Code_Node* right);
struct Code_Node* make_ident(struct Code_Node_Array* code_node_array,
                             char* name,
                             struct Code_Node* declaration);
struct Code_Node* make_literal_int(struct Code_Node_Array* code_node_array,
                                   int value);
struct Code_Node* make_literal_float(struct Code_Node_Array* code_node_array,
                                     float value);
struct Code_Node* make_literal_bool(struct Code_Node_Array* code_node_array,
                                    bool value);
struct Code_Node* make_string(struct Code_Node_Array* code_node_array,
                              char* pointer);
struct Code_Node* make_parens(struct Code_Node_Array* code_node_array,
                              struct Code_Node* expression);

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
struct Type_Info* Native_Type_Void;
struct Type_Info* Native_Type_Size_t;

struct User_Types {
    size_t length;
    size_t capacity;
    char** names;
    struct Type_Info** types;
};
struct User_Types* user_types;
void add_user_type(char* name, struct Type_Info* user_type);
struct Type_Info* map_name_to_type(char* name);
struct Type_Info* map_name_to_native_type(char* name);

struct Code_Node_Array* parse(struct Token_Array* token_array);
bool parse_statement(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array);
bool parse_if(struct Token_Array* token_array,
              struct Code_Node_Array* code_node_array);
bool parse_else(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array);
bool parse_while(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array);
bool parse_do_while(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array);
bool parse_for(struct Token_Array* token_array,
               struct Code_Node_Array* code_node_array);
bool parse_continue(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array);
bool parse_break(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array);
bool parse_return(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);
bool parse_block(struct Token_Array*,
                 struct Code_Node_Array* code_node_array);
bool parse_increment(struct Token_Array*,
                     struct Code_Node_Array* code_node_array);
bool parse_decrement(struct Token_Array*,
                     struct Code_Node_Array* code_node_array);
bool parse_rvalue(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);
bool parse_rvalue_atom(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array);
bool parse_lvalue(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);
bool parse_procedure_declaration(struct Token_Array* token_array,
                                 struct Code_Node_Array* code_node_array,
                                 struct Type_Info* return_type);
bool parse_declaration(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array);
bool parse_declaration_precomputed_type(struct Token_Array* token_array,
                                        struct Code_Node_Array* code_node_array,
                                        struct Type_Info* type);
bool parse_struct_declaration(struct Token_Array* token_array,
                              struct Code_Node_Array* code_node_array);
bool parse_assign(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);
bool parse_opassign(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array);
bool parse_type(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array,
                struct Type_Info** out_type);
bool parse_array_type(struct Token_Array* token_array,
                      struct Type_Info* prev_type,
                      struct Type_Info** out_type);
bool parse_pointer_type(struct Token_Array* token_array,
                        struct Type_Info* prev_type,
                        struct Type_Info** out_type);
bool parse_call(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array);
bool parse_string(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);
bool parse_literal(struct Token_Array* token_array,
                   struct Code_Node_Array* code_node_array);
bool parse_ident(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array);
bool parse_reference(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array);
bool parse_dereference(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array);
bool parse_array_index(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array);
bool parse_dot_operator(struct Token_Array* token_array,
                        struct Code_Node_Array* code_node_array);
bool delimited(char* start, char* stop, char* separator,
               bool (*elem_func)(struct Token_Array*, struct Code_Node_Array*),
               size_t* out_length,
               struct Code_Node*** out_nodes,
               struct Token_Array* token_array,
               struct Code_Node_Array* code_node_array);

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
bool maybe_binary(enum Operator_Precedence prev_prec,
                  struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array);

struct Token_Array* tokenize(char* input);
void read_token(struct Token* token, char** input);
char* read_while(bool (*func)(char), char** input);
char* read_while_lookahead(bool (*func)(char, char), char** input);
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