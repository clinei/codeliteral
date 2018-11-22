#include "parser.h"

void init_parser() {
    init_type_infos();
    init_infer();
}

const char* keyword_strings[11] = {
    "if",
    "else",
    "while",
    "true",
    "false",
    "do",
    "for",
    "continue",
    "break",
    "return",
    "struct",
};
const size_t keyword_strings_length = 11;

size_t next_serial = 0;
void set_serial(struct Code_Node* node) {
    node->serial = next_serial;
	next_serial += 1;
}

char* code_kind_to_string(enum Code_Kind kind) {
    switch (kind) {
        case CODE_KIND_IF:{
            return "if";
        }
        case CODE_KIND_ELSE:{
            return "else";
        }
        case CODE_KIND_WHILE:{
            return "while";
        }
        case CODE_KIND_DO_WHILE:{
            return "do while";
        }
        case CODE_KIND_FOR:{
            return "for";
        }
        case CODE_KIND_BREAK:{
            return "break";
        }
        case CODE_KIND_CONTINUE:{
            return "continue";
        }
        case CODE_KIND_IDENT:{
            return "ident";
        }
        case CODE_KIND_INCREMENT:{
            return "increment";
        }
        case CODE_KIND_DECREMENT:{
            return "decrement";
        }
        case CODE_KIND_MINUS:{
            return "minus";
        }
        case CODE_KIND_NOT:{
            return "not";
        }
        case CODE_KIND_ASSIGN:{
            return "assign";
        }
        case CODE_KIND_OPASSIGN:{
            return "opassign";
        }
        case CODE_KIND_BLOCK:{
            return "block";
        }
        case CODE_KIND_PROCEDURE:{
            return "procedure";
        }
        case CODE_KIND_STRUCT:{
            return "struct";
        }
        case CODE_KIND_DECLARATION:{
            return "declaration";
        }
        case CODE_KIND_REFERENCE:{
            return "reference";
        }
        case CODE_KIND_DEREFERENCE:{
            return "dereference";
        }
        case CODE_KIND_ARRAY_INDEX:{
            return "array index";
        }
        case CODE_KIND_DOT_OPERATOR:{
            return "dot operator";
        }
        case CODE_KIND_CALL:{
            return "call";
        }
        case CODE_KIND_RETURN:{
            return "return";
        }
        case CODE_KIND_BINARY_OPERATION:{
            return "binary operation";
        }
        case CODE_KIND_STRING:{
            return "string";
        }
        case CODE_KIND_PARENS:{
            return "parens";
        }
        case CODE_KIND_LITERAL_INT:{
            return "literal int";
        }
        case CODE_KIND_LITERAL_UINT:{
            return "literal uint";
        }
        case CODE_KIND_LITERAL_FLOAT:{
            return "literal float";
        }
        case CODE_KIND_LITERAL_BOOL:{
            return "literal bool";
        }
        case CODE_KIND_NATIVE_CODE:{
            return "native code";
        }
    }
}

struct Code_Node* make_procedure(struct Code_Nodes* code_nodes,
                                 struct Code_Procedure_Params* params,
                                 bool has_varargs,
                                 struct Type_Info* return_type,
                                 struct Code_Node* block) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_PROCEDURE;

    if (params == NULL) {
        params = malloc(sizeof(struct Code_Procedure_Params));
        array_init(params, sizeof(struct Code_Node*), 10);
    }
    if (block == NULL) {
        block = make_block(code_nodes, NULL);
    }
	node->procedure.params = params;
	node->procedure.has_varargs = has_varargs;
	node->procedure.return_type = return_type;
	node->procedure.block = block;

    node->procedure.return_ident = NULL;

	set_serial(node);

	return node;
}

struct Code_Node* make_call(struct Code_Nodes* code_nodes,
                            struct Code_Node* ident,
                            struct Code_Call_Args* args) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_CALL;

    if (args == NULL) {
        args = malloc(sizeof(struct Code_Call_Args));
        array_init(args, sizeof(struct Code_Node*), 10);
    }
	node->call.ident = ident;
	node->call.args = args;

    node->call.returned = false;
    node->call.return_ident = NULL;

	set_serial(node);

	return node;
}

struct Code_Node* make_declaration(struct Code_Nodes* code_nodes,
                                   struct Type_Info* type,
                                   struct Code_Node* ident,
                                   struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_DECLARATION;

	node->declaration.ident = ident;
	node->declaration.type = type;
	node->declaration.expression = expression;

    node->declaration.pointer = 0xdeadbeef;

	ident->ident.declaration = node;
    ident->type = type;
	
	set_serial(node);

	return node;
}

struct Code_Node* make_reference(struct Code_Nodes* code_nodes,
                                 struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_REFERENCE;

	node->reference.expression = expression;
    
	set_serial(node);

	return node;
}

struct Code_Node* make_dereference(struct Code_Nodes* code_nodes,
                                   struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_DEREFERENCE;

	node->dereference.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_array_index(struct Code_Nodes* code_nodes,
                                   struct Code_Node* array,
                                   struct Code_Node* index) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_ARRAY_INDEX;

	node->array_index.array = array;
	node->array_index.index = index;

	set_serial(node);

	return node;
}

struct Code_Node* make_dot_operator(struct Code_Nodes* code_nodes,
                                    struct Code_Node* left,
                                    struct Code_Node* right) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_DOT_OPERATOR;

	node->dot_operator.left = left;
	node->dot_operator.right = right;

	set_serial(node);

	return node;
}

struct Code_Node* make_block(struct Code_Nodes* code_nodes,
                             struct Code_Node_Array* statements) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_BLOCK;

    if (statements == NULL) {
        statements = malloc(sizeof(struct Code_Node_Array));
        array_init(statements, sizeof(struct Code_Node*), 10);
    }
	node->block.statements = statements;
    node->block.declarations = NULL;
    
    node->block.allocations = NULL;
    node->block.is_transformed_block = false;
    node->block.transformed_from = NULL;
    node->block.extras = NULL;

	set_serial(node);

	return node;
}

struct Code_Node* make_return(struct Code_Nodes* code_nodes,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_RETURN;

	node->return_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_struct(struct Code_Nodes* code_nodes,
                              struct Code_Node* block) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_STRUCT;

	node->struct_.block = block;

	set_serial(node);

	return node;
}

struct Code_Node* make_if(struct Code_Nodes* code_nodes,
                          struct Code_Node* condition,
                          struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_IF;

	node->if_.condition = condition;
	node->if_.expression = expression;

    node->if_.else_expr = NULL;

	set_serial(node);

	return node;
}

struct Code_Node* make_else(struct Code_Nodes* code_nodes,
                            struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_ELSE;

	node->else_.expression = expression;

    node->else_.if_expr = NULL;

	set_serial(node);

	return node;
}

struct Code_Node* make_while(struct Code_Nodes* code_nodes,
                             struct Code_Node* condition,
                             struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_WHILE;

	node->while_.condition = condition;
	node->while_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_do_while(struct Code_Nodes* code_nodes,
                                struct Code_Node* condition,
                                struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_DO_WHILE;

	node->do_while_.condition = condition;
	node->do_while_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_for(struct Code_Nodes* code_nodes,
                           struct Code_Node* begin,
                           struct Code_Node* condition,
                           struct Code_Node* cycle_end,
                           struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_FOR;

	node->for_.begin = begin;
	node->for_.condition = condition;
	node->for_.cycle_end = cycle_end;
	node->for_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_break(struct Code_Nodes* code_nodes) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_BREAK;

	set_serial(node);

	return node;
}

struct Code_Node* make_continue(struct Code_Nodes* code_nodes) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_CONTINUE;

	set_serial(node);

	return node;
}

struct Code_Node* make_minus(struct Code_Nodes* code_nodes,
                             struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_MINUS;

	node->minus.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_not(struct Code_Nodes* code_nodes,
                           struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_NOT;

	node->not.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_increment(struct Code_Nodes* code_nodes,
                                 struct Code_Node* ident) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_INCREMENT;

	node->increment.ident = ident;

	set_serial(node);

	return node;
}

struct Code_Node* make_decrement(struct Code_Nodes* code_nodes,
                                 struct Code_Node* ident) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_DECREMENT;

	node->decrement.ident = ident;

	set_serial(node);

	return node;
}

struct Code_Node* make_assign(struct Code_Nodes* code_nodes,
                              struct Code_Node* ident,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_ASSIGN;

	node->assign.ident = ident;
	node->assign.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_opassign(struct Code_Nodes* code_nodes,
                                struct Code_Node* ident,
                                char* operation_type,
                                struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_OPASSIGN;

	node->opassign.ident = ident;
	node->opassign.operation_type = operation_type;
	node->opassign.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_binary_operation(struct Code_Nodes* code_nodes,
                                        struct Code_Node* left,
                                        char* operation_type,
                                        struct Code_Node* right) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_BINARY_OPERATION;

	node->binary_operation.left = left;
	node->binary_operation.operation_type = operation_type;
	node->binary_operation.right = right;

	set_serial(node);

	return node;
}

struct Code_Node* make_ident(struct Code_Nodes* code_nodes,
                             char* name,
                             struct Code_Node* declaration) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_IDENT;

	node->ident.name = name;
	node->ident.declaration = declaration;

	set_serial(node);

	return node;
}

struct Code_Node* make_literal_int(struct Code_Nodes* code_nodes,
                                   signed long int value) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_LITERAL_INT;
    node->type = Native_Type_Int;

	node->literal_int.value = value;

	set_serial(node);

	return node;
}
struct Code_Node* make_literal_uint(struct Code_Nodes* code_nodes,
                                    unsigned long int value) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_LITERAL_UINT;
    node->type = Native_Type_UInt;

	node->literal_uint.value = value;

	set_serial(node);

	return node;
}
struct Code_Node* make_literal_float(struct Code_Nodes* code_nodes,
                                     float value) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_LITERAL_FLOAT;
    node->type = Native_Type_Float;

	node->literal_float.value = value;

	set_serial(node);

	return node;
}
struct Code_Node* make_literal_bool(struct Code_Nodes* code_nodes,
                                    bool value) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_LITERAL_BOOL;
    node->type = Native_Type_Bool;

	node->literal_bool.value = value;

	set_serial(node);

	return node;
}

struct Code_Node* make_string(struct Code_Nodes* code_nodes,
                              char* pointer) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_STRING;

	node->string_.pointer = pointer;
    node->string_.length = strlen(pointer);

	set_serial(node);

	return node;
}

struct Code_Node* make_parens(struct Code_Nodes* code_nodes,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_PARENS;

	node->parens.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_native_code(struct Code_Nodes* code_nodes,
                                   void* func_ptr) {
    
	struct Code_Node* node = get_new_code_node(code_nodes);
	node->kind = CODE_KIND_NATIVE_CODE;

	node->native_code.func_ptr = func_ptr;

	set_serial(node);

	return node;
}

void init_type_infos() {
    type_infos = malloc(sizeof(struct Type_Infos));
    array_init(type_infos, sizeof(struct Type_Info), 1000);

    Native_Type_Char = make_type_info_ident("char", make_type_info_integer(1, false));
    Native_Type_UChar = make_type_info_ident("uchar", make_type_info_integer(1, false));
    Native_Type_Bool = make_type_info_ident("bool", make_type_info_integer(1, false));
    Native_Type_Short = make_type_info_ident("short", make_type_info_integer(2, true));
    Native_Type_UShort = make_type_info_ident("ushort", make_type_info_integer(2, false));
    Native_Type_Int = make_type_info_ident("int", make_type_info_integer(4, true));
    Native_Type_UInt = make_type_info_ident("uint", make_type_info_integer(4, false));
    Native_Type_Long = make_type_info_ident("long", make_type_info_integer(8, true));
    Native_Type_ULong = make_type_info_ident("ulong", make_type_info_integer(8, false));
    Native_Type_Float = make_type_info_ident("float", make_type_info_float(4));
    Native_Type_Double = make_type_info_ident("double", make_type_info_float(8));
    Native_Type_Void = make_type_info_ident("void", make_type_info_void());
    Native_Type_Size_t = make_type_info_ident("size_t", make_type_info_integer(4, false));

    init_user_types();
}
void init_user_types() {
    user_types = malloc(sizeof(struct User_Types));
    soa_init((struct Dynamic_SOA*)user_types, 1000, 2, sizeof(char*), sizeof(struct Type_Info*));
}
void add_user_type(char* name, struct Type_Info* user_type) {
    soa_push((struct Dynamic_SOA*)user_types, name, user_type);
}
size_t index_of_string(char* str, char** strings, size_t length) {
    for (size_t i = 0; i < length; i += 1) {
        if (strcmp(str, strings[i]) == 0) {
            return i;
        }
    }
    return length;
}
struct Type_Info* map_name_to_type(char* name) {
    for (size_t i = 0; i < user_types->length; i += 1) {
        if (strcmp(user_types->names[i], name) == 0) {
            return user_types->types[i];
        }
    }
    return map_name_to_native_type(name);
}
struct Type_Info* map_name_to_native_type(char* name) {
    if (strcmp(name, "char") == 0) {
        return Native_Type_Char;
    }
    else if (strcmp(name, "uchar") == 0) {
        return Native_Type_UChar;
    }
    else if (strcmp(name, "bool") == 0) {
        return Native_Type_Bool;
    }
    else if (strcmp(name, "short") == 0) {
        return Native_Type_Short;
    }
    else if (strcmp(name, "ushort") == 0) {
        return Native_Type_UShort;
    }
    else if (strcmp(name, "int") == 0) {
        return Native_Type_Int;
    }
    else if (strcmp(name, "uint") == 0) {
        return Native_Type_UInt;
    }
    else if (strcmp(name, "long") == 0) {
        return Native_Type_Long;
    }
    else if (strcmp(name, "ulong") == 0) {
        return Native_Type_ULong;
    }
    else if (strcmp(name, "float") == 0) {
        return Native_Type_Float;
    }
    else if (strcmp(name, "double") == 0) {
        return Native_Type_Double;
    }
    else if (strcmp(name, "void") == 0) {
        return Native_Type_Void;
    }
    else if (strcmp(name, "size_t") == 0) {
        return Native_Type_Size_t;
    }
    else {
        return NULL;
    }
}
struct Type_Info* get_new_type_info() {
    array_next(type_infos);
    return type_infos->last;
}
struct Type_Info* make_type_info_integer(size_t size_in_bytes, bool is_signed) {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_INTEGER;
    info->size_in_bytes = size_in_bytes;

    info->integer.is_signed = is_signed;

    return info;
}
struct Type_Info* make_type_info_float(size_t size_in_bytes) {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_FLOAT;
    info->size_in_bytes = size_in_bytes;
    
    return info;
}
struct Type_Info* make_type_info_array(struct Type_Info* elem_type, size_t length) {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_ARRAY;
    info->size_in_bytes = elem_type->size_in_bytes * length;

    info->array.elem_type = elem_type;
    info->array.length = length;

    return info;
}
struct Type_Info* make_type_info_string() {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_STRING;
    
    return info;
}
struct Type_Info* make_type_info_pointer(struct Type_Info* elem_type) {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_POINTER;
    info->size_in_bytes = Native_Type_Size_t->size_in_bytes;

    info->pointer.elem_type = elem_type;

    return info;
}
struct Type_Info* make_type_info_function_pointer(struct Type_Info* return_type,
                                                  struct Type_Info** param_types) {

    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_FUNCTION_POINTER;
    info->size_in_bytes = Native_Type_Size_t->size_in_bytes;

    info->function_pointer.return_type = return_type;
    info->function_pointer.param_types = param_types;

    return info;
}
struct Type_Info* make_type_info_struct_dummy() {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_STRUCT;

    info->struct_.members_length = 0;
    info->struct_.members_capacity = 10;
    info->struct_.members = malloc(sizeof(struct Type_Info*) * info->struct_.members_capacity);
    info->struct_.member_names = malloc(sizeof(char*) * info->struct_.members_capacity);
    info->struct_.offsets = malloc(sizeof(size_t*) * info->struct_.members_capacity);
    // we don't resize yet

    return info;
}
struct Type_Info* fill_type_info_struct(struct Code_Node* struct_) {
    struct Type_Info* info = struct_->type;

    size_t size_in_bytes = 0;

    for (size_t i = 0; i < struct_->struct_.block->block.statements->length; i += 1) {
        struct Code_Node* stmt = struct_->struct_.block->block.statements->first[i];
        if (stmt->kind == CODE_KIND_DECLARATION) {
            infer(stmt);
            info->struct_.offsets[i] = size_in_bytes;
            info->struct_.members[i] = stmt->declaration.type;
            info->struct_.member_names[i] = stmt->declaration.ident->ident.name;
            size_in_bytes += stmt->declaration.type->size_in_bytes;
            info->struct_.members_length += 1;
        }
        else {
            abort();
        }
    }

    info->size_in_bytes = size_in_bytes;

    return info;
}
struct Type_Info* make_type_info_ident(char* name,
                                       struct Type_Info* type) {

    if (type->kind == TYPE_INFO_TAG_IDENT) {
        printf("double type_info_ident!\n");
        abort();
    }

    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_IDENT;
    info->size_in_bytes = type->size_in_bytes;

    info->ident.name = name;
    info->ident.type = type;

    return info;
}
struct Type_Info* make_type_info_void() {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_VOID;

    return info;
}

struct Infer_Data infer_data;
void init_infer() {
    infer_data.block_stack = malloc(sizeof(struct Code_Node_Array));
    array_init(infer_data.block_stack, sizeof(struct Code_Node*), 10);
    infer_data.last_block = NULL;
    infer_data.last_declaration = NULL;
}
void infer_push_block(struct Code_Node* block) {
    array_push(infer_data.block_stack, &block);
    infer_data.last_block = block;
    if (block->block.declarations == NULL) {
        block->block.declarations = malloc(sizeof(struct Code_Node_Array));
        array_init(block->block.declarations, sizeof(struct Code_Node*), 10);
    }
}
void infer_pop_block() {
    array_pop(infer_data.block_stack);
    if (infer_data.block_stack->length > 0) {
        infer_data.last_block = infer_data.block_stack->first[infer_data.block_stack->length - 1];
    }
    else {
        infer_data.last_block = NULL;
    }
}

struct Code_Node* infer_decl_of_ident(struct Code_Node* ident) {
    for (size_t i = infer_data.block_stack->length - 1; i >= 0; i -= 1) {
        struct Code_Node* block = infer_data.block_stack->first[i];
        for (size_t j = 0; j < block->block.declarations->length; j += 1) {
            struct Code_Node* decl = block->block.declarations->first[j];
            // printf("%s, %s\n", decl->declaration.ident->ident.name, ident->ident.name);
            if (decl->kind == CODE_KIND_DECLARATION) {
                if (strcmp(decl->declaration.ident->ident.name, ident->ident.name) == 0) {
                    return decl;
                }
            }
            else abort();
        }
    }
    return NULL;
}
struct Code_Node* infer(struct Code_Node* node) {
    // printf("infer kind: (%s)\n", code_kind_to_string(node->kind));
    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            infer_push_block(node);
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                infer_data.statement_index = i;
                infer(node->block.statements->first[i]);
            }
            infer_pop_block();
            break;
        }
        case CODE_KIND_PROCEDURE:{
            // native code should not add declarations
            if (node->procedure.block->kind == CODE_KIND_BLOCK) {
                infer_push_block(node->procedure.block);
                for (size_t i = 0; i < node->procedure.params->length; i += 1) {
                    infer(node->procedure.params->first[i]);
                }
                infer_pop_block();
                infer(node->procedure.block);
            }
            break;
        }
        case CODE_KIND_DECLARATION:{
            // should error here when ident already declared in current scope
            array_push(infer_data.last_block->block.declarations, &node);
            infer(node->declaration.ident);
            if (node->declaration.expression != NULL) {
                infer(node->declaration.expression);
            }
            break;
        }
        case CODE_KIND_IDENT:{
            node->ident.declaration = infer_decl_of_ident(node);
            node->type = node->ident.declaration->declaration.type;
            break;
        }
        case CODE_KIND_MINUS:{
            infer(node->minus.expression);
            break;
        }
        case CODE_KIND_NOT:{
            infer(node->not.expression);
            break;
        }
        case CODE_KIND_INCREMENT:{
            infer(node->increment.ident);
            break;
        }
        case CODE_KIND_DECREMENT:{
            infer(node->decrement.ident);
            break;
        }
        case CODE_KIND_ASSIGN:{
            infer(node->assign.ident);
            infer(node->assign.expression);
            break;
        }
        case CODE_KIND_OPASSIGN:{
            infer(node->opassign.ident);
            infer(node->opassign.expression);
            break;
        }
        case CODE_KIND_PARENS:{
            infer(node->parens.expression);
            node->type = node->parens.expression->type;
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            infer(node->array_index.array);
            infer(node->array_index.index);
            /*
            if (node->array_index.index->type != Native_Type_Int) {
                printf("only int type array index is currently allowed\n");
                abort();
            }
            */
            node->type = node->array_index.array->type->array.elem_type;
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            struct Code_Node* left = node->dot_operator.left;
            struct Code_Node* right = node->dot_operator.right;
            infer(left);
            if (right->kind == CODE_KIND_IDENT) {
                if (left->type->kind == TYPE_INFO_TAG_IDENT) {
                    if (left->type->ident.type->kind == TYPE_INFO_TAG_STRUCT) {
                        struct Type_Info_Struct* struct_ = &(left->type->ident.type->struct_);
                        size_t member_index = index_of_string(right->ident.name, struct_->member_names, struct_->members_length);
                        right->type = struct_->members[member_index];
                    }
                    else abort();
                }
                else if (left->type->kind == TYPE_INFO_TAG_ARRAY) {
                    if (strcmp(right->ident.name, "length") == 0) {
                        right->type = Native_Type_Size_t;
                    }
                    else abort();
                }
                else abort();
            }
            else abort();
            node->type = right->type;
            // abort();
            break;
        }
        case CODE_KIND_STRUCT:{
            fill_type_info_struct(node);
            break;
        }
        case CODE_KIND_STRING:{
            break;
        }
        case CODE_KIND_IF:{
            infer(node->if_.condition);
            infer(node->if_.expression);
            break;
        }
        case CODE_KIND_ELSE:{
            infer(node->else_.expression);
            break;
        }
        case CODE_KIND_WHILE:{
            infer(node->while_.condition);
            infer(node->while_.expression);
            break;
        }
        case CODE_KIND_DO_WHILE:{
            infer(node->do_while_.expression);
            infer(node->do_while_.condition);
            break;
        }
        case CODE_KIND_FOR:{
            if (node->for_.begin != NULL) {
                infer(node->for_.begin);
            }
            if (node->for_.condition != NULL) {
                infer(node->for_.condition);
            }
            if (node->for_.cycle_end != NULL) {
                infer(node->for_.cycle_end);
            }
            infer(node->for_.expression);
            break;
        }
        case CODE_KIND_CALL:{
            infer(node->call.ident);
            for (size_t i = 0; i < node->call.args->length; i += 1) {
                infer(node->call.args->first[i]);
            }
            node->type = node->call.ident->ident.declaration->declaration.expression->procedure.return_type;
            break;
        }
        case CODE_KIND_RETURN:{
            infer(node->return_.expression);
            break;
        }
        case CODE_KIND_REFERENCE:{
            infer(node->reference.expression);
            if (node->reference.expression->kind == CODE_KIND_REFERENCE) {
                abort();
            }
            node->type = make_type_info_pointer(node->reference.expression->type);
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            infer(node->dereference.expression);
            if (node->dereference.expression->type->kind != TYPE_INFO_TAG_POINTER) {
                abort();
            }
            node->type = node->dereference.expression->type->pointer.elem_type;
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            infer(node->binary_operation.left);
            infer(node->binary_operation.right);
            if (is_operator_boolean(node->binary_operation.operation_type)) {
                node->type = Native_Type_Bool;
            }
            else {
                // @Incomplete
                // should compromise between left and right
                node->type = node->binary_operation.left->type;
            }
            break;
        }
        default:{
            break;
        }
    }
    return node;
}

bool is_operator_boolean(char* operator){
    return strcmp(operator, ">")  == 0 || strcmp(operator, ">=") == 0 ||
           strcmp(operator, "<")  == 0 || strcmp(operator, "<=") == 0 ||
           strcmp(operator, "==") == 0 || strcmp(operator, "!=") == 0;
}

enum Operator_Precedence map_operator_to_precedence(char* operator) {
    if (strcmp(operator, "*") == 0) {
        return OPERATOR_PRECEDENCE_MULTIPLY;
    }
    else if (strcmp(operator, "/") == 0) {
        return OPERATOR_PRECEDENCE_DIVIDE;
    }
    else if (strcmp(operator, "%") == 0) {
        return OPERATOR_PRECEDENCE_MODULO;
    }
    else if (strcmp(operator, "+") == 0) {
        return OPERATOR_PRECEDENCE_PLUS;
    }
    else if (strcmp(operator, "-") == 0) {
        return OPERATOR_PRECEDENCE_MINUS;
    }
    else if (strcmp(operator, ">") == 0) {
        return OPERATOR_PRECEDENCE_GREATER_THAN;
    }
    else if (strcmp(operator, ">=") == 0) {
        return OPERATOR_PRECEDENCE_GREATER_THAN_OR_EQUAL;
    }
    else if (strcmp(operator, "<") == 0) {
        return OPERATOR_PRECEDENCE_LESS_THAN;
    }
    else if (strcmp(operator, "<=") == 0) {
        return OPERATOR_PRECEDENCE_LESS_THAN_OR_EQUAL;
    }
    else if (strcmp(operator, "==") == 0) {
        return OPERATOR_PRECEDENCE_EQUAL;
    }
    else if (strcmp(operator, "!=") == 0) {
        return OPERATOR_PRECEDENCE_NOT_EQUAL;
    }
    else if (strcmp(operator, "&") == 0) {
        return OPERATOR_PRECEDENCE_BITWISE_AND;
    }
    else if (strcmp(operator, "^") == 0) {
        return OPERATOR_PRECEDENCE_BITWISE_XOR;
    }
    else if (strcmp(operator, "|") == 0) {
        return OPERATOR_PRECEDENCE_BITWISE_OR;
    }
    else if (strcmp(operator, "&&") == 0) {
        return OPERATOR_PRECEDENCE_AND;
    }
    else if (strcmp(operator, "||") == 0) {
        return OPERATOR_PRECEDENCE_OR;
    }
    else if (strcmp(operator, "=") == 0) {
        return OPERATOR_PRECEDENCE_ASSIGN;
    }
    else if (strcmp(operator, "?") == 0) {
        return OPERATOR_PRECEDENCE_TERNARY;
    }
    /*
    else if (strcmp(operator, ",") == 0) {
        return OPERATOR_PRECEDENCE_COMMA;
    }
    */
    else {
        return OPERATOR_PRECEDENCE_NONE;
    }
}
bool maybe_binary(enum Operator_Precedence prev_prec,
                  struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    enum Operator_Precedence curr_prec = map_operator_to_precedence(token_array->curr_token->str);
    if (curr_prec < prev_prec) {
        struct Code_Node* left = code_nodes->last;
        char* op = token_array->curr_token->str;
        token_array->curr_token++;
        parse_rvalue_atom(token_array, code_nodes);
        bool was_binary = maybe_binary(curr_prec, token_array, code_nodes);
        struct Code_Node* right = code_nodes->last;
        struct Code_Node* binop = make_binary_operation(code_nodes, left, op, right);
        maybe_binary(prev_prec, token_array, code_nodes);
        return true;
    }
    return false;
}
void inject_stdlib(struct Code_Nodes* code_nodes,
                   struct Code_Node_Array* statements) {

    // void* malloc(size_t num_bytes)
    struct Type_Info* malloc_return_type = make_type_info_pointer(Native_Type_Void);

    bool malloc_has_varargs = false;
    struct Code_Procedure_Params* malloc_params = malloc(sizeof(struct Code_Procedure_Params));
    array_init(malloc_params, sizeof(struct Code_Node*), 1);

    struct Type_Info* num_bytes_type = Native_Type_Size_t;
    struct Code_Node* num_bytes_ident = make_ident(code_nodes, "num_bytes", NULL);
    struct Code_Node* num_bytes_param = make_declaration(code_nodes, num_bytes_type, num_bytes_ident, NULL);
    
    array_push(malloc_params, &num_bytes_param);

    struct Code_Node* malloc_block = make_native_code(code_nodes, &malloc);
    struct Code_Node* malloc_proc = make_procedure(code_nodes, malloc_params, malloc_has_varargs, malloc_return_type, malloc_block);
    struct Code_Node* malloc_ident = make_ident(code_nodes, "malloc", NULL);
    struct Code_Node* malloc_decl = make_declaration(code_nodes, NULL, malloc_ident, malloc_proc);

    array_push(statements, &malloc_decl);

    // void free(void* ptr)
    struct Type_Info* free_return_type = Native_Type_Void;

    bool free_has_varargs = false;
    struct Code_Procedure_Params* free_params = malloc(sizeof(struct Code_Procedure_Params));
    array_init(free_params, sizeof(struct Code_Node*), 1);

    struct Type_Info* ptr_type = make_type_info_pointer(Native_Type_Void);
    struct Code_Node* ptr_ident = make_ident(code_nodes, "ptr", NULL);
    struct Code_Node* ptr_param = make_declaration(code_nodes, ptr_type, ptr_ident, NULL);

    array_push(free_params, &ptr_param);

    struct Code_Node* free_block = make_native_code(code_nodes, &free);
    struct Code_Node* free_proc = make_procedure(code_nodes, free_params, free_has_varargs, free_return_type, free_block);
    struct Code_Node* free_ident = make_ident(code_nodes, "free", NULL);
    struct Code_Node* free_decl = make_declaration(code_nodes, NULL, free_ident, free_proc);

    array_push(statements, &free_decl);
    
    // void printf(char* fmt, ...)
    struct Type_Info* printf_return_type = Native_Type_Void;

    bool printf_has_varargs = true;
    struct Code_Procedure_Params* printf_params = malloc(sizeof(struct Code_Procedure_Params));
    array_init(printf_params, sizeof(struct Code_Node*), 1);

    struct Type_Info* fmt_type = make_type_info_pointer(Native_Type_Char);
    struct Code_Node* fmt_ident = make_ident(code_nodes, "fmt", NULL);
    struct Code_Node* fmt_param = make_declaration(code_nodes, fmt_type, fmt_ident, NULL);

    array_push(printf_params, &fmt_param);

    struct Code_Node* printf_block = make_native_code(code_nodes, &printf);
    struct Code_Node* printf_proc = make_procedure(code_nodes, printf_params, printf_has_varargs, printf_return_type, printf_block);

    struct Code_Node* printf_ident = make_ident(code_nodes, "printf", NULL);
    struct Code_Node* printf_decl = make_declaration(code_nodes, NULL, printf_ident, printf_proc);

    array_push(statements, &printf_decl);
}
struct Code_Nodes* parse(struct Token_Array* token_array) {
    struct Code_Nodes* code_nodes = malloc(sizeof(struct Code_Nodes));
    array_init(code_nodes, sizeof(struct Code_Node), 10000);
    token_array->curr_token = token_array->first;

    struct Code_Node_Array* statements = malloc(sizeof(struct Code_Node_Array));
    array_init(statements, sizeof(struct Code_Node*), 10);
    struct Code_Node* global_block = make_block(code_nodes, statements);

    inject_stdlib(code_nodes, statements);

    delimited(NULL, NULL, ";", &parse_statement, statements, token_array, code_nodes);
    code_nodes->first->block.is_transformed_block = true;

    return code_nodes;
}
bool parse_statement(struct Token_Array* token_array,
                     struct Code_Nodes* code_nodes) {

    // printf("parse_statement: %s\n", token_array->curr_token->str);
    struct Token* next_token = &token_array->curr_token[1];
    if (strcmp(token_array->curr_token->str, "{") == 0) {
        return parse_block(token_array, code_nodes);
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_KEYWORD) {
        if (strcmp(token_array->curr_token->str, "if") == 0) {
            return parse_if(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "else") == 0) {
            return parse_else(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "while") == 0) {
            return parse_while(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "do") == 0) {
            return parse_do_while(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "for") == 0) {
            return parse_for(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "continue") == 0) {
            return parse_continue(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "break") == 0) {
            return parse_break(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "return") == 0) {
            return parse_return(token_array, code_nodes);
        }
        else if (strcmp(token_array->curr_token->str, "struct") == 0) {
            return parse_struct_declaration(token_array, code_nodes);
        }
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_IDENT) {
        struct Type_Info* type;
        // @Incomplete
        // statements other than declarations
        // that have a type on the left hand side
        // are errors but not handled yet
        bool was_type = parse_type(token_array, code_nodes, &type);
        next_token = &token_array->curr_token[1];
        if (was_type && token_array->curr_token->kind == TOKEN_KIND_IDENT) {
            if (next_token->str[0] == '(') {
                return parse_procedure_declaration(token_array, code_nodes, type);
            }
            else {
                return parse_declaration_precomputed_type(token_array, code_nodes, type);
            }
        }
    }
    bool was_lvalue = parse_lvalue(token_array, code_nodes);
    if (was_lvalue) {
        if (token_array->curr_token->kind == TOKEN_KIND_OP) {
            if (strcmp(token_array->curr_token->str, "++") == 0) {
                return parse_increment(token_array, code_nodes);
            }
            else if (strcmp(token_array->curr_token->str, "--") == 0) {
                return parse_decrement(token_array, code_nodes);
            }
            else if (strcmp(token_array->curr_token->str, "=") == 0) {
                return parse_assign(token_array, code_nodes);
            }
            else if (map_operator_to_precedence(token_array->curr_token->str) != OPERATOR_PRECEDENCE_NONE) {
                token_array->curr_token--;
            }
            else if (token_array->curr_token->str[strlen(token_array->curr_token->str)-1] == '=') {
                return parse_opassign(token_array, code_nodes);
            }
            else {
                // actually, we have a problem
                return true;
            }
        }
        else {
            return true;
        }
    }
    return parse_rvalue(token_array, code_nodes);
}
bool parse_rvalue_atom(struct Token_Array* token_array,
                       struct Code_Nodes* code_nodes) {

    if (strcmp(token_array->curr_token->str, "&") == 0) {
        return parse_reference(token_array, code_nodes);
    }
    else if (token_array->curr_token->str[0] == '*') {
        return parse_dereference(token_array, code_nodes);
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_OP ||
        token_array->curr_token->kind == TOKEN_KIND_LITERAL) {
        
        return parse_literal(token_array, code_nodes);
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_STRING) {
        return parse_string(token_array, code_nodes);
    }
    else if (strcmp(token_array->curr_token->str, "true") == 0) {
        struct Code_Node* bool_literal = make_literal_bool(code_nodes, true);
        bool_literal->str = "true";
        token_array->curr_token++;
        return true;
    }
    else if (strcmp(token_array->curr_token->str, "false") == 0) {
        struct Code_Node* bool_literal = make_literal_bool(code_nodes, false);
        bool_literal->str = "false";
        token_array->curr_token++;
        return true;
    }
    else if (token_array->curr_token->str[0] == '(') {
        token_array->curr_token++;
        parse_rvalue(token_array, code_nodes);
        struct Code_Node* expression = code_nodes->last;
        if (token_array->curr_token->str[0] == ')') {
            token_array->curr_token++;
            make_parens(code_nodes, expression);
            return true;
        }
        else abort();
    }
    else {
        return parse_lvalue(token_array, code_nodes);
    }
}
bool parse_rvalue(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    struct Token* prev_token = token_array->curr_token;
    if (parse_rvalue_atom(token_array, code_nodes) == false) {
        return false;
    }
    enum Operator_Precedence prec = map_operator_to_precedence(token_array->curr_token->str);
    if (prec != OPERATOR_PRECEDENCE_NONE) {
        maybe_binary(OPERATOR_PRECEDENCE_LAST, token_array, code_nodes);
        return true;
    }
    else {
        return true;
    }
}
bool parse_lvalue(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    // printf("parse_lvalue: %s\n", token_array->curr_token->str);
    bool ret = false;
    if (token_array->curr_token->str[0] == '*') {
        return parse_dereference(token_array, code_nodes);
    }
    struct Token* prev_token = 0;
    struct Token* prev_token_2 = 0;
    do {
        prev_token = token_array->curr_token;
        prev_token_2 = token_array->curr_token;
        
        if (parse_ident(token_array, code_nodes)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (ret && parse_call(token_array, code_nodes)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (parse_array_index(token_array, code_nodes)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (parse_dot_operator(token_array, code_nodes)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }
    } while (prev_token < token_array->curr_token);

    return ret;
}
bool parse_call(struct Token_Array* token_array,
                struct Code_Nodes* code_nodes) {

    if (token_array->curr_token->str != NULL &&
        strcmp(token_array->curr_token->str, "(") == 0) {
        
        struct Code_Node* ident = code_nodes->last;
        struct Code_Call_Args* args = malloc(sizeof(struct Code_Call_Args));
        array_init(args, sizeof(struct Code_Node*), 10);
        delimited("(", ")", ",", &parse_rvalue, args, token_array, code_nodes);
        make_call(code_nodes, ident, args);
        return true;
    }
    else {
        return false;
    }
}
bool parse_literal(struct Token_Array* token_array,
                   struct Code_Nodes* code_nodes) {

    bool minus = false;
    if (strcmp(token_array->curr_token->str, "-") == 0) {
        minus = true;
        token_array->curr_token++;
    }
    else if (strcmp(token_array->curr_token->str, "+") == 0) {
        token_array->curr_token++;
    }
    if (is_one_of(token_array->curr_token->str, '.')) {
        char* str = token_array->curr_token->str;
        double value = atof(token_array->curr_token->str);
        if (minus) {
            value = -value;
        }
        struct Code_Node* float_literal = make_literal_float(code_nodes, value);
        float_literal->str = str;
    }
    else if (minus) {
        char* str = token_array->curr_token->str;
        signed long int value = strtoll(token_array->curr_token->str, NULL, 10);
        value = -value;
        struct Code_Node* int_literal = make_literal_int(code_nodes, value);
        // int_literal->str = str;
        size_t str_length = strlen(str) + 1;
        int_literal->str = malloc(str_length + 1);
        int_literal->str[0] = '-';
        memcpy(int_literal->str + 1, str, str_length);
    }
    else {
        char* str = token_array->curr_token->str;
        unsigned long int value = strtoul(token_array->curr_token->str, NULL, 10);
        struct Code_Node* uint_literal = make_literal_uint(code_nodes, value);
        uint_literal->str = str;
    }
    token_array->curr_token++;
    return true;
}
bool parse_string(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    make_string(code_nodes, token_array->curr_token->str);
    token_array->curr_token++;
    return true;
}
bool parse_reference(struct Token_Array* token_array,
                     struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    parse_lvalue(token_array, code_nodes);
    struct Code_Node* expression = code_nodes->last;
    make_reference(code_nodes, expression);
    return true;
}
bool parse_dereference(struct Token_Array* token_array,
                       struct Code_Nodes* code_nodes) {

    char* str = token_array->curr_token->str;
    size_t levels = strlen(token_array->curr_token->str);
    token_array->curr_token++;
    parse_lvalue(token_array, code_nodes);
    struct Code_Node* node = code_nodes->last;
    for (size_t i = 0; i < levels; i += 1) {
        if (str[i] == '*') {
            make_dereference(code_nodes, node);
            node = code_nodes->last;
        }
        else abort();
    }
    return true;
}
bool parse_array_index(struct Token_Array* token_array,
                       struct Code_Nodes* code_nodes) {

    struct Code_Node* array = code_nodes->last;
    if (token_array->curr_token->str[0] == '[') {
        token_array->curr_token++;
        bool had_index = false;
        bool was_lvalue = parse_lvalue(token_array, code_nodes);
        if (was_lvalue) {
            had_index = true;
        }
        else {
            bool was_rvalue = parse_rvalue(token_array, code_nodes);
            if (was_rvalue) {
                had_index = true;
            }
            else abort();
        }
        if (had_index) {
            struct Code_Node* index = code_nodes->last;
            if (token_array->curr_token->str[0] == ']') {
                token_array->curr_token++;
                make_array_index(code_nodes, array, index);
                return true;
            }
            else abort();
        }
        else abort();
    }
    return false;
}
bool parse_dot_operator(struct Token_Array* token_array,
                        struct Code_Nodes* code_nodes) {

    struct Code_Node* left = code_nodes->last;
    if (strcmp(token_array->curr_token->str, ".") == 0) {
        token_array->curr_token++;
        bool has_right = parse_ident(token_array, code_nodes);
        if (has_right) {
            struct Code_Node* right = code_nodes->last;
            make_dot_operator(code_nodes, left, right);
            return true;
        }
        else abort();
    }
    return false;
}
bool parse_ident(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes) {

    if (token_array->curr_token->kind == TOKEN_KIND_IDENT &&
        token_array->curr_token->str != NULL) {

        make_ident(code_nodes, token_array->curr_token->str, NULL);

        token_array->curr_token++;
        return true;
    }
    else {
        return false;
    }
}
bool parse_if(struct Token_Array* token_array,
              struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    token_array->curr_token++;
    parse_rvalue(token_array, code_nodes);
    struct Code_Node* condition = code_nodes->last;
    if (strcmp(token_array->curr_token->str, ")") == 0) {
        token_array->curr_token++;
    }
    else abort();
    parse_statement(token_array, code_nodes);
    struct Code_Node* expression = code_nodes->last;
    make_if(code_nodes, condition, expression);
    return true;
}
bool parse_else(struct Token_Array* token_array,
                struct Code_Nodes* code_nodes) {

    struct Code_Node* if_expr;
    struct Code_Node* maybe_if = code_nodes->last;
    if (maybe_if->kind == CODE_KIND_IF) {
        if_expr = maybe_if;
    }
    else if (maybe_if->kind == CODE_KIND_ELSE &&
             maybe_if->else_.expression->kind == CODE_KIND_IF) {

        if_expr = maybe_if->else_.expression;
    }
    else {
        printf("else statement does not follow an if statement\n");
        abort();
        return false;
    }
    token_array->curr_token++;
    parse_statement(token_array, code_nodes);
    struct Code_Node* expression = code_nodes->last;
    struct Code_Node* else_expr = make_else(code_nodes, expression);
    else_expr->else_.if_expr = if_expr;
    if_expr->if_.else_expr = else_expr;
    return true;
}
bool parse_while(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    token_array->curr_token++;
    parse_rvalue(token_array, code_nodes);
    struct Code_Node* condition = code_nodes->last;
    if (token_array->curr_token->str[0] == ')') {
        token_array->curr_token++;
    }
    else abort();
    parse_statement(token_array, code_nodes);
    struct Code_Node* expression = code_nodes->last;
    make_while(code_nodes, condition, expression);
    return true;
}
bool parse_do_while(struct Token_Array* token_array,
                    struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    parse_statement(token_array, code_nodes);
    struct Code_Node* expression = code_nodes->last;
    if (strcmp(token_array->curr_token->str, "while") == 0) {
        token_array->curr_token++;
    }
    else abort();
    if (token_array->curr_token->str[0] == '(') {
        token_array->curr_token++;
    }
    else abort();
    parse_rvalue(token_array, code_nodes);
    struct Code_Node* condition = code_nodes->last;
    if (token_array->curr_token->str[0] == ')') {
        token_array->curr_token++;
    }
    else abort();
    make_do_while(code_nodes, condition, expression);
    return true;
}
#define DEBUG_FOR false
bool parse_for(struct Token_Array* token_array,
               struct Code_Nodes* code_nodes) {

    struct Code_Node* begin = NULL;
    struct Code_Node* condition = NULL;
    struct Code_Node* cycle_end = NULL;
    struct Code_Node* expression = NULL;
    token_array->curr_token++;
    if (token_array->curr_token->str[0] == '(') {
        token_array->curr_token++;
    }
    else {
        printf("for starting paren missing!\n");
        abort();
    }
    #if DEBUG_FOR
    printf("for begin\n");
    #endif
    if (token_array->curr_token->str[0] != ';') {
        bool was_stmt = parse_statement(token_array, code_nodes);
        if (was_stmt) {
            #if DEBUG_FOR
            printf("for begin true\n");
            #endif
            begin = code_nodes->last;
            if (token_array->curr_token->str[0] == ';') {
                token_array->curr_token++;
            }
            else abort();
        }
        else abort();
    }
    else {
        #if DEBUG_FOR
        printf("for begin false\n");
        #endif
        token_array->curr_token++;
    }
    #if DEBUG_FOR
    printf("for cond\n");
    #endif
    if (token_array->curr_token->str[0] != ';') {
        bool was_rvalue = parse_rvalue(token_array, code_nodes);
        if (was_rvalue) {
            #if DEBUG_FOR
            printf("for cond true\n");
            #endif
            condition = code_nodes->last;
            if (token_array->curr_token->str[0] == ';') {
                token_array->curr_token++;
            }
            else abort();
        }
        else abort();
    }
    else {
        #if DEBUG_FOR
        printf("for cond false\n");
        #endif
        token_array->curr_token++;
    }
    #if DEBUG_FOR
    printf("for end\n");
    #endif
    if (token_array->curr_token->str[0] != ')') {
        bool was_stmt = parse_statement(token_array, code_nodes);
        if (was_stmt) {
            #if DEBUG_FOR
            printf("for end true\n");
            #endif
            cycle_end = code_nodes->last;
        }
        else abort();
    }
    else {
        #if DEBUG_FOR
        printf("for end false\n");
        #endif
    }
    if (token_array->curr_token->str[0] == ')') {
        token_array->curr_token++;
    }
    else {
        printf("for ending paren missing!\n");
        abort();
    }
    #if DEBUG_FOR
    printf("for expr\n");
    #endif
    bool was_stmt = parse_statement(token_array, code_nodes);
    if (was_stmt) {
        #if DEBUG_FOR
        printf("for expr true\n");
        #endif
        expression = code_nodes->last;
    }
    else {
        #if DEBUG_FOR
        printf("for expr false\n");
        #endif
        abort();
    }
    make_for(code_nodes, begin, condition, cycle_end, expression);
    return true;
}
bool parse_continue(struct Token_Array* token_array,
                    struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    make_continue(code_nodes);
    return true;
}
bool parse_break(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    make_break(code_nodes);
    return true;
}
bool parse_return(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    struct Code_Node* expression = NULL;
    if (token_array->curr_token->str[0] != ';') {
        parse_rvalue(token_array, code_nodes);
        expression = code_nodes->last;
    }
    make_return(code_nodes, expression);
    return true;
}
bool parse_block(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes) {

    struct Code_Node_Array* statements = malloc(sizeof(struct Code_Node_Array));
    array_init(statements, sizeof(struct Code_Node*), 10);
    delimited("{", "}", ";", &parse_statement, statements, token_array, code_nodes);
    make_block(code_nodes, statements);
    return true;
}
bool parse_increment(struct Token_Array* token_array,
                     struct Code_Nodes* code_nodes) {

    struct Code_Node* left = code_nodes->last;
    token_array->curr_token++;
    make_increment(code_nodes, left);
    return true;
}
bool parse_decrement(struct Token_Array* token_array,
                     struct Code_Nodes* code_nodes) {

    struct Code_Node* left = code_nodes->last;
    token_array->curr_token++;
    make_decrement(code_nodes, left);
    return true;
}
bool parse_assign(struct Token_Array* token_array,
                  struct Code_Nodes* code_nodes) {

    struct Code_Node* left = code_nodes->last;
    token_array->curr_token++;
    parse_rvalue(token_array, code_nodes);
    struct Code_Node* right = code_nodes->last;
    make_assign(code_nodes, left, right);
    return true;
}
bool parse_opassign(struct Token_Array* token_array,
                    struct Code_Nodes* code_nodes) {

    struct Code_Node* ident = code_nodes->last;
    size_t op_length = strlen(token_array->curr_token->str) - 1;
    char* operation_type = malloc(sizeof(char) * op_length);
    memcpy(operation_type, token_array->curr_token->str, op_length);
    operation_type[op_length] = '\0';
    token_array->curr_token++;
    parse_rvalue(token_array, code_nodes);
    struct Code_Node* expr = code_nodes->last;
    make_opassign(code_nodes, ident, operation_type, expr);
    return true;
}
bool parse_procedure_declaration(struct Token_Array* token_array,
                                 struct Code_Nodes* code_nodes,
                                 struct Type_Info* return_type) {

    parse_ident(token_array, code_nodes);
    struct Code_Node* ident = code_nodes->last;
    token_array->curr_token++;
    struct Code_Procedure_Params* params = malloc(sizeof(struct Code_Procedure_Params));
    array_init(params, sizeof(struct Code_Node*), 10);
    delimited("(", ")", ",", &parse_param, params, token_array, code_nodes);
    bool has_varargs = false;
    if (strcmp(token_array->curr_token->str, "...") == 0) {
        has_varargs = true;
        token_array->curr_token++;
    }
    token_array->curr_token++;
    parse_block(token_array, code_nodes);
    struct Code_Node* block = code_nodes->last;
    make_procedure(code_nodes, params, has_varargs, return_type, block);
    struct Code_Node* proc = code_nodes->last;
    // @Incomplete
    // should have function pointer type
    make_declaration(code_nodes, NULL, ident, proc);
    return true;
}
bool parse_type(struct Token_Array* token_array,
                struct Code_Nodes* code_nodes,
                struct Type_Info** out_type) {

    struct Code_Node* prev_node = code_nodes->last;
    size_t prev_length = code_nodes->length;
    struct Token* prev_token = token_array->curr_token;

    bool was_ident = parse_ident(token_array, code_nodes);
    if (was_ident == false) {
        return false;
    }
    char* ident_name = code_nodes->last->ident.name;
    code_nodes->length -= 1;
    code_nodes->last--;
    struct Type_Info* prev_type = map_name_to_type(ident_name);
    if (prev_type == NULL) {
        // @Audit
        // does this ever happen?
        code_nodes->last = prev_node;
        code_nodes->length = prev_length;
        token_array->curr_token = prev_token;
        return false;
    }
    if (prev_type->kind == TYPE_INFO_TAG_STRUCT) {
        prev_type = make_type_info_ident(ident_name, prev_type);
    }

    struct Token* prev_token_2 = 0;
    do {
        prev_token = token_array->curr_token;
        prev_token_2 = token_array->curr_token;

        if (parse_pointer_type(token_array, prev_type, &prev_type) == false) {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (parse_array_type(token_array, prev_type, &prev_type) == false) {
            token_array->curr_token = prev_token_2;
        }
    } while (prev_token < token_array->curr_token);

    *out_type = prev_type;
    return true;
}
bool parse_array_type(struct Token_Array* token_array,
                      struct Type_Info* prev_type,
                      struct Type_Info** out_type) {

    if (token_array->curr_token->str[0] != '[') {
        return false;
    }
    else {
        token_array->curr_token++;
        if (token_array->curr_token->kind == TOKEN_KIND_LITERAL) {
            *out_type = make_type_info_array(prev_type, atoi(token_array->curr_token->str));
            token_array->curr_token++;
            if (token_array->curr_token->str[0] == ']') {
                token_array->curr_token++;
            }
            else abort();
            return true;
        }
        else if (token_array->curr_token->str[0] == ']') {
            token_array->curr_token++;
            *out_type = make_type_info_array(prev_type, 0);
            return true;
        }
        else abort();
        return false;
    }
}
bool parse_pointer_type(struct Token_Array* token_array,
                        struct Type_Info* prev_type,
                        struct Type_Info** out_type) {

    if (token_array->curr_token->str[0] != '*') {
        return false;
    }
    else {
        size_t levels = strlen(token_array->curr_token->str);
        for (size_t i = 0; i < levels; i += 1) {
            if (token_array->curr_token->str[i] == '*') {
                prev_type = make_type_info_pointer(prev_type);
            }
            else abort();
        }
        *out_type = prev_type;
        token_array->curr_token++;
        return true;
    }
}
bool parse_param(struct Token_Array* token_array,
                 struct Code_Nodes* code_nodes) {

    // varargs
    if (strcmp(token_array->curr_token->str, "...") == 0) {
        return false;
    }
    struct Type_Info* type;
    parse_type(token_array, code_nodes, &type);
    return parse_declaration_precomputed_type(token_array, code_nodes, type);
}
bool parse_declaration(struct Token_Array* token_array,
                       struct Code_Nodes* code_nodes) {

    struct Type_Info* type;
    parse_type(token_array, code_nodes, &type);
    return parse_declaration_precomputed_type(token_array, code_nodes, type);
}
bool parse_declaration_precomputed_type(struct Token_Array* token_array,
                                        struct Code_Nodes* code_nodes,
                                        struct Type_Info* type) {

    bool was_ident = parse_ident(token_array, code_nodes);
    if (!was_ident) {
        abort();
        return false;
    }
    struct Code_Node* ident = code_nodes->last;
    struct Code_Node* expression;
    if (strcmp(token_array->curr_token->str, "=") == 0) {
        token_array->curr_token++;
        parse_rvalue(token_array, code_nodes);
        expression = code_nodes->last;
    }
    make_declaration(code_nodes, type, ident, expression);
    return true;
}
bool parse_struct_declaration(struct Token_Array* token_array,
                              struct Code_Nodes* code_nodes) {

    token_array->curr_token++;
    parse_ident(token_array, code_nodes);
    struct Code_Node* ident = code_nodes->last;
    struct Type_Info* type = make_type_info_struct_dummy();
    add_user_type(ident->ident.name, type);
    parse_block(token_array, code_nodes);
    struct Code_Node* block = code_nodes->last;
    struct Code_Node* expression = make_struct(code_nodes, block);
    expression->type = type;
    make_declaration(code_nodes, type, ident, expression);
    return true;
}
#define DEBUG_DELIM false
#if DEBUG_DELIM
int delim = 0;
#endif
bool delimited(char* start, char* stop, char* separator,
               bool (*elem_func)(struct Token_Array*, struct Code_Nodes*),
               struct Dynamic_Array* results,
               struct Token_Array* token_array,
               struct Code_Nodes* code_nodes) {

    #if DEBUG_DELIM
    printf("start delim %d\n", delim);
    delim++;
    #endif

    if (token_array->curr_token->str != NULL && stop != NULL &&
        strcmp(token_array->curr_token->str, start) == 0) {

        token_array->curr_token++;
    }
    bool first = false;
    struct Token* prev_token = token_array->curr_token;
    while (token_array->curr_token <= token_array->last) {

        if (token_array->curr_token->str != NULL && stop != NULL &&
            strcmp(token_array->curr_token->str, stop) == 0) {

            break;
        };
        if (first) {
            first = false;
        }
        else if (token_array->curr_token->str != NULL && separator != NULL &&
                 strcmp(token_array->curr_token->str, separator) == 0) {

            token_array->curr_token++;
            if (token_array->curr_token > token_array->last) {
                break;
            }
        }
        if (token_array->curr_token->str != NULL && stop != NULL &&
            strcmp(token_array->curr_token->str, stop) == 0) {

            break;
        };
        if (token_array->curr_token->str != NULL) {

            #if DEBUG_DELIM
            printf("delim: %d, %s\n", token_array->curr_token->kind, token_array->curr_token->str);
            #endif
            bool was_elem = elem_func(token_array, code_nodes);
            if (!was_elem) {
                break;
            }
            else {
                array_push(results, &(code_nodes->last));
            }
        }
        
        if (prev_token == token_array->curr_token) {
            printf("parsing_error!\n");
            abort();
        }
        prev_token = token_array->curr_token;
    }
    if (token_array->curr_token->str != NULL && stop != NULL &&
        strcmp(token_array->curr_token->str, stop) == 0) {

        token_array->curr_token++;
    }
    #if DEBUG_DELIM
    delim--;
    printf("end delim %d\n", delim);
    #endif

    return true;
}

struct Code_Node* get_new_code_node(struct Code_Nodes* code_nodes) {

    bool was_realloc = array_next(code_nodes);

    // @Incomplete
    // if realloc, we need to fix pointers using a diff
    // actually, we can store pointers as diffs from the base pointer
    // and when we need to dereference, we add it to the base pointer
    // that way, we don't have to fix pointers

    struct Code_Node* node = code_nodes->last;

    node->type = NULL;

    node->was_run = false;
    node->broken = false;
    node->continued = false;
    node->is_lhs = false;
    node->is_on_execution_stack = false;
    node->execution_index = 0;
    node->result = NULL;
    node->transformed = NULL;

    node->demands_expand = false;
    node->should_expand = false;
    node->str = NULL;

    return node;
}

struct Token_Array* tokenize(char* input) {
    // we can use the input length to assume a mostly optimal starting capacity
    size_t input_length = strlen(input);

    struct Token_Array* token_array = malloc(sizeof(struct Token_Array));
    array_init(token_array, sizeof(struct Token), 100);

    // token_array->last = token_array->first;
    char* prev = input;
    for (size_t i = 0; *input; i += 1) {
        array_next(token_array);
        read_token(token_array->last, &input);
        if (input == prev) {
            printf("lexing error!\n");
            break;
        }

        if (token_array->last->kind == TOKEN_KIND_COMMENT_SINGLE ||
            token_array->last->kind == TOKEN_KIND_COMMENT_MULTI) {

        }
        else {
            prev = input;
        }
    }

    // @Weird
    // we have to do this twice to have a valid pointer
    token_array->last--;
    token_array->last--;

    return token_array;
}

void read_token(struct Token* token, char** input) {
    // skip whitespace
    read_while(&is_whitespace, input);
    if (**input == '\0') {
        return;
    }
    char ch = **input;
    while (ch == '/') {
        char next_ch = (*input)[1];
        if (next_ch == '/') {
            // single-line comment
            (*input)++;
            (*input)++;
            token->kind = TOKEN_KIND_COMMENT_SINGLE;
            /*
            token->str = read_while(&is_not_newline, input);
            */
            read_while(&is_not_newline, input);
            if (**input == '\n') {
                (*input)++;
            }
        }
        else if (next_ch == '*') {
            // multi-line comment
            (*input)++;
            (*input)++;
            token->kind = TOKEN_KIND_COMMENT_MULTI;
            /*
            token->str = read_while_lookahead(&is_not_mlc_end, input);
            */
            read_while_lookahead(&is_not_mlc_end, input);
            (*input)++;
            (*input)++;
            if (**input == '\n') {
                (*input)++;
            }
        }
        else {
            // could be a divide
            break;
        }
        // skip whitespace
        read_while(&is_whitespace, input);
        ch = **input;
        if (**input == '\0') {
            return;
        }
    }
    if (**input == '\0') {
        return;
    }
    if (is_ident_start(ch)) {
        token->str = read_while(&is_ident_char, input);
        if (is_one_of_strings((char**)keyword_strings, keyword_strings_length, token->str)) {
            token->kind = TOKEN_KIND_KEYWORD;
        }
        else {
            token->kind = TOKEN_KIND_IDENT;
        }
    }
    else if (is_string_start(ch)) {
        (*input)++;
        token->kind = TOKEN_KIND_STRING;
        token->str = read_while(&is_not_string_end, input);
        token->str = escape_string(token->str);
        (*input)++;
    }
    else if (is_punc(ch)) {
        // varargs
        if (ch == '.' && (*input)[0] == '.' && (*input)[1] == '.') {
            (*input)++;
            (*input)++;
            (*input)++;
            token->kind = TOKEN_KIND_PUNC;
            token->str = "...";
        }
        else {
            (*input)++;
            token->kind = TOKEN_KIND_PUNC;
            char* str = malloc(sizeof(char) * 2);
            str[0] = ch;
            str[1] = '\0';
            token->str = str;
        }
    }
    else if (is_op_char(ch)) {
        token->kind = TOKEN_KIND_OP;
        token->str = read_while(&is_op_char, input);
    }
    else if (is_digit(ch)) {
        token->kind = TOKEN_KIND_LITERAL;
        token->str = read_while(&is_digit_or_dot, input);
    }
    else {
        printf("encountered some weird character we don't handle yet: %u\n", ch);
    }
    // printf("token: %d, %s\n", token->kind, token->str);
}

char* read_while(bool (*func)(char), char** input) {
    size_t capacity = 100;
    char* str = malloc(sizeof(char) * capacity);
    size_t length = 0;
    while (**input && func(**input)) {
        str[length] = **input;
        (*input)++;
        length += 1;
        if (length == capacity) {
            capacity *= 2;
            str = realloc(str, sizeof(char) * capacity);
        }
    }
    str[length] = '\0';
    str = realloc(str, sizeof(char) * length + 1);
    return str;
}
char* read_while_lookahead(bool (*func)(char, char), char** input) {
    size_t capacity = 100;
    char* str = malloc(sizeof(char) * capacity);
    size_t length = 0;
    while (**input && func(**input, (*input)[1])) {
        str[length] = **input;
        (*input)++;
        length += 1;
        if (length == capacity) {
            capacity *= 2;
            str = realloc(str, sizeof(char) * capacity);
        }
    }
    str[length] = '\0';
    str = realloc(str, sizeof(char) * length);
    return str;
}

char* escape_string(char* str) {
    size_t capacity = 10;
    char* result = malloc(sizeof(char) * capacity);
    size_t length = 0;
    while (*str) {
        if (*str == '\n') {
            result[length] = '\\';
            length += 1;
            result[length] = 'n';
            length += 1;
        }
        else if (*str == '\r') {
            result[length] = '\\';
            length += 1;
            result[length] = 'r';
            length += 1;
        }
        // @Incomplete
        // there are more escape characters
        else {
            result[length] = *str;
            length += 1;
        }
        if ((length + 1) >= capacity) {
            capacity *= 2;
            result = realloc(result, sizeof(char) * capacity);
        }
        str++;
    }
    result[length] = '\0';
    result = realloc(result, sizeof(char) * length);
    return result;
}

bool is_one_of(char* options, char ch) {
    while (*options) {
        if (ch == *options) {
            return true;
        }
        options++;
    }
    return false;
}

bool is_one_of_strings(char** strings, size_t length, char* str) {
    for (size_t i = 0; i < length; i += 1) {
        if (strcmp(strings[i], str) == 0) {
            return true;
        }
    }
    return false;
}

bool is_in_range(char start, char end, char ch) {
    return start <= ch && ch <= end;
}

bool is_whitespace(char ch) {
    return is_one_of(" \t\r\n", ch) || is_in_range(0, 31, ch);
}

bool is_not_newline(char ch) {
    return ch != '\n';
}

bool is_not_mlc_end(char ch, char next_ch) {
    return !(ch == '*' && next_ch == '/');
}

bool is_string_start(char ch) {
    return ch == '"';
}
bool is_not_string_end(char ch) {
    return ch != '"';
}

bool is_punc(char ch) {
    return is_one_of(".,;:(){}[]\"\'", ch);
}

bool is_ident_start(char ch) {
    return ch == '_' || is_in_range('a', 'z', ch) || is_in_range('A', 'Z', ch);
}

bool is_ident_char(char ch) {
    return is_ident_start(ch) || is_digit(ch);
}

bool is_digit(char ch) {
    return is_in_range('0', '9', ch);
}

bool is_digit_or_dot(char ch) {
    return is_digit(ch) || ch == '.';
}

bool is_op_char(char ch) {
    return is_one_of("+-*/%=&|<>!", ch);
}