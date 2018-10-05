#include "parser.h"

void init_parser() {
    init_type_infos();
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

struct Code_Node* make_procedure(struct Code_Node_Array* code_node_array,
                                 struct Code_Node** params,
                                 size_t params_length,
                                 struct Type_Info* return_type,
                                 struct Code_Node* block) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_PROCEDURE;

	node->procedure.params = params;
	node->procedure.params_length = params_length;
	node->procedure.return_type = return_type;
	node->procedure.block = block;

	set_serial(node);

	return node;
}

struct Code_Node* make_call(struct Code_Node_Array* code_node_array,
                            struct Code_Node* ident,
                            struct Code_Node** args,
                            size_t args_length) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_CALL;

	node->call.ident = ident;
	node->call.args = args;
	node->call.args_length = args_length;

	set_serial(node);

	return node;
}

struct Code_Node* make_declaration(struct Code_Node_Array* code_node_array,
                                   struct Type_Info* type,
                                   struct Code_Node* ident,
                                   struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_DECLARATION;

	ident->ident.declaration = node;

	node->declaration.ident = ident;
	node->declaration.type = type;
	node->declaration.expression = expression;
	
	set_serial(node);

	return node;
}

struct Code_Node* make_reference(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_REFERENCE;

	node->reference.expression = expression;
    
	set_serial(node);

	return node;
}

struct Code_Node* make_dereference(struct Code_Node_Array* code_node_array,
                                   struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_DEREFERENCE;

	node->dereference.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_array_index(struct Code_Node_Array* code_node_array,
                                   struct Code_Node* array,
                                   struct Code_Node* index) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_ARRAY_INDEX;

	node->array_index.array = array;
	node->array_index.index = index;

	set_serial(node);

	return node;
}

struct Code_Node* make_dot_operator(struct Code_Node_Array* code_node_array,
                                    struct Code_Node* left,
                                    struct Code_Node* right) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_DOT_OPERATOR;

	node->dot_operator.left = left;
	node->dot_operator.right = right;

	set_serial(node);

	return node;
}

struct Code_Node* make_block(struct Code_Node_Array* code_node_array,
                             struct Code_Node** statements,
                             size_t statements_length) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_BLOCK;

	node->block.statements = statements;
	node->block.statements_length = statements_length;
    node->block.is_transformed_block = false;

	set_serial(node);

	return node;
}

struct Code_Node* make_return(struct Code_Node_Array* code_node_array,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_RETURN;

	node->return_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_struct(struct Code_Node_Array* code_node_array,
                              struct Code_Node* block) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_STRUCT;

	node->struct_.block = block;

	set_serial(node);

	return node;
}

struct Code_Node* make_if(struct Code_Node_Array* code_node_array,
                          struct Code_Node* condition,
                          struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_IF;

	node->if_.condition = condition;
	node->if_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_else(struct Code_Node_Array* code_node_array,
                            struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_ELSE;

	node->else_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_while(struct Code_Node_Array* code_node_array,
                             struct Code_Node* condition,
                             struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_WHILE;

	node->while_.condition = condition;
	node->while_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_do_while(struct Code_Node_Array* code_node_array,
                                struct Code_Node* condition,
                                struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_DO_WHILE;

	node->do_while_.condition = condition;
	node->do_while_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_for(struct Code_Node_Array* code_node_array,
                           struct Code_Node* begin,
                           struct Code_Node* condition,
                           struct Code_Node* cycle_end,
                           struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_FOR;

	node->for_.begin = begin;
	node->for_.condition = condition;
	node->for_.cycle_end = cycle_end;
	node->for_.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_break(struct Code_Node_Array* code_node_array) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_BREAK;

	set_serial(node);

	return node;
}

struct Code_Node* make_continue(struct Code_Node_Array* code_node_array) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_CONTINUE;

	set_serial(node);

	return node;
}

struct Code_Node* make_minus(struct Code_Node_Array* code_node_array,
                             struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_MINUS;

	node->minus.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_not(struct Code_Node_Array* code_node_array,
                           struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_NOT;

	node->not.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_increment(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* ident) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_INCREMENT;

	node->increment.ident = ident;

	set_serial(node);

	return node;
}

struct Code_Node* make_decrement(struct Code_Node_Array* code_node_array,
                                 struct Code_Node* ident) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_DECREMENT;

	node->decrement.ident = ident;

	set_serial(node);

	return node;
}

struct Code_Node* make_assign(struct Code_Node_Array* code_node_array,
                              struct Code_Node* ident,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_ASSIGN;

	node->assign.ident = ident;
	node->assign.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_opassign(struct Code_Node_Array* code_node_array,
                                struct Code_Node* ident,
                                char* operation_type,
                                struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_OPASSIGN;

	node->opassign.ident = ident;
	node->opassign.operation_type = operation_type;
	node->opassign.expression = expression;

	set_serial(node);

	return node;
}

struct Code_Node* make_binary_operation(struct Code_Node_Array* code_node_array,
                                        struct Code_Node* left,
                                        char* operation_type,
                                        struct Code_Node* right) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_BINARY_OPERATION;

	node->binary_operation.left = left;
	node->binary_operation.operation_type = operation_type;
	node->binary_operation.right = right;

	set_serial(node);

	return node;
}

struct Code_Node* make_ident(struct Code_Node_Array* code_node_array,
                             char* name,
                             struct Code_Node* declaration) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_IDENT;

	node->ident.name = name;
	node->ident.declaration = declaration;

	set_serial(node);

	return node;
}

struct Code_Node* make_literal_int(struct Code_Node_Array* code_node_array,
                                   int value) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_LITERAL_INT;

	node->literal_int.value = value;

	set_serial(node);

	return node;
}
struct Code_Node* make_literal_float(struct Code_Node_Array* code_node_array,
                                     float value) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_LITERAL_FLOAT;

	node->literal_float.value = value;

	set_serial(node);

	return node;
}
struct Code_Node* make_literal_bool(struct Code_Node_Array* code_node_array,
                                    bool value) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_LITERAL_BOOL;

	node->literal_bool.value = value;

	set_serial(node);

	return node;
}

struct Code_Node* make_string(struct Code_Node_Array* code_node_array,
                              char* pointer) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_STRING;

	node->string_.pointer = pointer;
    node->string_.length = strlen(pointer);

	set_serial(node);

	return node;
}

struct Code_Node* make_parens(struct Code_Node_Array* code_node_array,
                              struct Code_Node* expression) {

	struct Code_Node* node = get_new_node_from_code_node_array(code_node_array);
	node->kind = CODE_KIND_PARENS;

	node->parens.expression = expression;

	set_serial(node);

	return node;
}

void init_type_infos() {
    type_infos = malloc(sizeof(struct Type_Infos));
    type_infos->length = 0;
    type_infos->capacity = 1000;
    type_infos->first = malloc(sizeof(struct Type_Info) * type_infos->capacity);
    type_infos->last = type_infos->first--;
    Native_Type_Char = make_type_info_integer(1, false);
    Native_Type_UChar = make_type_info_integer(1, false);
    Native_Type_Bool = make_type_info_integer(1, false);
    Native_Type_Short = make_type_info_integer(2, true);
    Native_Type_UShort = make_type_info_integer(2, false);
    Native_Type_Int = make_type_info_integer(4, true);
    Native_Type_UInt = make_type_info_integer(4, false);
    Native_Type_Long = make_type_info_integer(8, true);
    Native_Type_ULong = make_type_info_integer(8, false);
    Native_Type_Float = make_type_info_float(4);
    Native_Type_Double = make_type_info_float(8);
    Native_Type_Void = make_type_info_void();
    Native_Type_Size_t = make_type_info_integer(4, false);

    init_user_types();
}
void init_user_types() {
    user_types = malloc(sizeof(struct User_Types));
    user_types->length = 0;
    user_types->capacity = 100;
    user_types->names = malloc(sizeof(char*) * user_types->capacity);
    user_types->types = malloc(sizeof(struct Type_Info*) * user_types->capacity);
}
void add_user_type(char* name, struct Type_Info* user_type) {
    
    user_types->names[user_types->length] = name;
    user_types->types[user_types->length] = user_type;
    user_types->length += 1;

    // @Audit
    // @Realloc
    // pointers might be invalid
    if (user_types->capacity == user_types->length) {
        user_types->capacity *= 2;
        user_types->names = realloc(user_types->names, user_types->capacity);
        user_types->types = realloc(user_types->types, user_types->capacity);
    }
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
// let User_Types = {};
struct Type_Info* get_new_type_info() {

    // @Audit
    // @Realloc
    // might have to fix pointers for the entire tree
    if (type_infos->capacity == type_infos->length) {
        type_infos->capacity *= 2;
        type_infos->first = realloc(type_infos->first, type_infos->capacity);
    }

    type_infos->length += 1;
    type_infos->last++;
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
// no need to create dummies anymore
struct Type_Info* make_type_info_struct_dummy() {
    struct Type_Info* info = get_new_type_info();
    info->kind = TYPE_INFO_TAG_STRUCT;

    info->struct_.members_length = 0;
    info->struct_.members_capacity = 10;
    info->struct_.members = malloc(sizeof(struct Type_Info*) * info->struct_.members_capacity);

    return info;
}
/*
struct Type_Info* fill_type_info_struct(struct Type_Info* struct_) {
    let info = struct_.base.type;

    let members = info.members;
    let size_in_bytes = 0;

    for (let i = 0; i < struct.block.statements.length; i += 1) {
        let stmt = struct.block.statements[i];
        if (stmt.base.kind == CODE_KIND_DECLARATION) {
            infer(stmt);
            let member = new Object();
            member.offset = size_in_bytes;
            member.type = stmt.ident.base.type;
            members[stmt.ident.name] = member;
            size_in_bytes += member.type.size_in_bytes;
        }
        else {
            abort();
        }
    }

    info.size_in_bytes = size_in_bytes;

    return info;
}
struct Type_Info* make_type_info_struct(struct) {

    make_type_info_struct_dummy(struct);

    return fill_type_info_struct(struct);
}
*/
struct Type_Info* make_type_info_ident(char* name,
                                       struct Type_Info* type) {

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
/*

// let infer_block_stack = new Array();
function infer_decl_of_ident(ident) {
    for (let i = infer_block_stack.length-1; i >= 0; i -= 1) {
        let block = infer_block_stack[i];
        for (let j = 0; j < block.declarations.length; j += 1) {
            let decl = block.declarations[j];
            if (decl.ident.name == ident.name) {
                return decl;
            }
        }
    }
}
function infer(node) {
    let last_block = infer_block_stack[infer_block_stack.length-1];
    if (node.base.kind == CODE_KIND_BLOCK) {
        if (!node.declarations) {
            node.declarations = new Array();
        }
        infer_block_stack.push(node);
        for (let stmt of node.statements) {
            infer(stmt);
        }
        infer_block_stack.pop();
    }
    else if (node.base.kind == CODE_KIND_DECLARATION) {
        // should error here when ident already declared in current scope
        if (last_block) {
            last_block.declarations.push(node);
        }
        if (node.type) {
            node.ident.base.type = infer_type(node.type);
        }
        if (node.expression && node.expression.base) {
            if (node.expression.base.kind == CODE_KIND_STRUCT) {
                // implicit declaration so we can refer to the type inside the struct
                // when the struct type itself has not been declared yet
                let dummy = make_type_info_struct_dummy();
                node.expression.base.type = dummy;
                node.ident.base.type = dummy;
            }
            infer(node.expression);
        }
    }
    else if (node.base.kind == CODE_KIND_MINUS) {
        infer(node.ident);
    }
    else if (node.base.kind == CODE_KIND_NOT) {
        infer(node.ident);
    }
    else if (node.base.kind == CODE_KIND_INCREMENT) {
        infer(node.ident);
    }
    else if (node.base.kind == CODE_KIND_DECREMENT) {
        infer(node.ident);
    }
    else if (node.base.kind == CODE_KIND_ASSIGN) {
        infer(node.ident);
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_OPASSIGN) {
        infer(node.ident);
        infer(node.expression);
    }
	else if (node.base.kind == CODE_KIND_PARENS) {
        infer(node.expression);
        node.base.type = node.expression.base.type;
	}
    else if (node.base.kind == CODE_KIND_ARRAY_INDEX) {
        infer(node.array);
        infer(node.index);
        node.base.type = node.array.base.type.elem_type;
    }
    else if (node.base.kind == CODE_KIND_DOT_OPERATOR) {

        let left = node.left;
        let right = node.right;
        
        while (true) {
            left.is_lhs = node.is_lhs;
            right.is_lhs = node.is_lhs;
            infer(left);
            if (right.base.kind == CODE_KIND_DOT_OPERATOR) {
                right.base.type = left.base.type.members[right.left.name].type;
                // ###
                // left.base.type = ;
                left = right.left;
                right = right.right;
            }
            else if (left.base.type.base.kind == TYPE_INFO_TAG_ARRAY) {
                if (right.name == "length") {
                    right.base.type = Native_Type_Size_t;
                }
                else abort();
                break;
            }
            else if (right.base.kind == CODE_KIND_IDENT) {
                right.base.type = left.base.type.members[right.name].type;
                break;
            }
        }
        node.base.type = right.base.type;
    }
    else if (node.base.kind == CODE_KIND_STRUCT) {
        infer_type(node);
    }
    else if (node.base.kind == CODE_KIND_STRING) {
    }
    else if (node.base.kind == CODE_KIND_PROCEDURE) {
        infer_block_stack.push(node.block);
        node.block.declarations = new Array();
        for (let param of node.parameters) {
            infer(param);
        }
        infer_block_stack.pop();
        infer(node.block);
    }
    else if (node.base.kind == CODE_KIND_IF) {
        infer(node.condition);
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_ELSE) {
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_WHILE) {
        infer(node.condition);
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_DO_WHILE) {
        infer(node.expression);
        infer(node.condition);
    }
    else if (node.base.kind == CODE_KIND_FOR) {
        if (node.begin) {
            infer(node.begin);
        }
        if (node.condition) {
            infer(node.condition);
        }
        if (node.cycle_end) {
            infer(node.cycle_end);
        }
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_CALL) {
        infer(node.ident);
        for (let arg of node.args) {
            infer(arg);
        }
        node.base.type = node.ident.declaration.expression.return_type;
    }
    else if (node.base.kind == CODE_KIND_RETURN) {
        infer(node.expression);
    }
    else if (node.base.kind == CODE_KIND_IDENT) {
        node.declaration = infer_decl_of_ident(node);
        node.base.type = node.declaration.ident.base.type;
    }
	else if (node.base.kind == CODE_KIND_REFERENCE) {
        node.base.type = infer_type(node);
        infer(node.expression);
	}
	else if (node.base.kind == CODE_KIND_DEREFERENCE) {
        node.base.type = infer_type(node);
        infer(node.expression);
	}
    else if (node.base.kind == CODE_KIND_BINARY_OPERATION) {
        infer(node.left);
        infer(node.right);
        // @Incomplete
        // should compromise between left and right
        node.base.type = node.left.base.type;
    }
    return node;
}
function infer_type(node) {
    if (node.base.kind == CODE_KIND_IDENT) {
        let primitive = Types[node.name];
        if (primitive) {
            return primitive;
        }
        else {
            infer(node);
            let user_type = node.declaration.ident.base.type;
            if (user_type.base.kind == TYPE_INFO_TAG_STRUCT) {
                return user_type;
            }
            else abort();
        }
    }
    else if (node.base.kind == CODE_KIND_REFERENCE) {
        infer(node.expression);
        if (node.expression.base.kind == CODE_KIND_REFERENCE) {
            abort();
        }
        return make_type_info_pointer(node.expression.base.type);
    }
    else if (node.base.kind == CODE_KIND_DEREFERENCE) {
        infer(node.expression);
        if (node.expression.base.type.base.kind == TYPE_INFO_TAG_POINTER) {
            return node.expression.base.type.elem_type;
        }
        else {
            abort();
        }

    }
    else if (node.base.kind == TYPE_INFO_TAG_STRUCT) {
        return fill_type_info_struct(node);
    }
    else if (node.base.kind == TYPE_INFO_TAG_POINTER) {
        let elem_type = infer_type(node.elem_type);
        let type = make_type_info_pointer(elem_type);
        return type;
    }
    else if (node.base.kind == TYPE_INFO_TAG_ARRAY) {
        let elem_type = infer_type(node.elem_type);
        let type = make_type_info_array(elem_type, node.length);
        type.size_in_bytes = elem_type.size_in_bytes * node.length;
        return type;
    }
    else if (node.base.kind == CODE_KIND_STRING) {
        node.base.type = User_Types.string;
        return node.base.type;
    }
}
*/
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
    else if (strcmp(operator, ",") == 0) {
        return OPERATOR_PRECEDENCE_COMMA;
    }
    else {
        return OPERATOR_PRECEDENCE_NONE;
    }
}
bool maybe_binary(enum Operator_Precedence prev_prec,
                  struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    enum Operator_Precedence curr_prec = map_operator_to_precedence(token_array->curr_token->str);
    if (curr_prec < prev_prec) {
        struct Code_Node* left = code_node_array->last;
        char* op = token_array->curr_token->str;
        token_array->curr_token++;
        parse_rvalue_atom(token_array, code_node_array);
        bool was_binary = maybe_binary(curr_prec, token_array, code_node_array);
        struct Code_Node* right = code_node_array->last;
        struct Code_Node* binop = make_binary_operation(code_node_array, left, op, right);
        maybe_binary(prev_prec, token_array, code_node_array);
        return true;
    }
    return false;
}
struct Code_Node_Array* parse(struct Token_Array* token_array) {
    struct Code_Node_Array* code_node_array = malloc(sizeof(struct Code_Node_Array));
    code_node_array->length = 0;
    code_node_array->capacity = 1000;
    code_node_array->first = malloc(sizeof(struct Code_Node) * code_node_array->capacity);
    code_node_array->last = code_node_array->first;
    code_node_array->last--;
    token_array->curr_token = token_array->first;

    size_t length = 0;
    struct Code_Node** statements;
    delimited(NULL, NULL, ";", &parse_statement, &length, &statements, token_array, code_node_array);
    make_block(code_node_array, statements, length);
    code_node_array->last->block.is_transformed_block = true;

    return code_node_array;
}
bool parse_statement(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array) {

    struct Token* next_token = &token_array->curr_token[1];
    if (strcmp(token_array->curr_token->str, "{") == 0) {
        return parse_block(token_array, code_node_array);
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_KEYWORD) {
        if (strcmp(token_array->curr_token->str, "if") == 0) {
            return parse_if(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "else") == 0) {
            return parse_else(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "while") == 0) {
            return parse_while(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "do") == 0) {
            return parse_do_while(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "for") == 0) {
            return parse_for(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "continue") == 0) {
            return parse_continue(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "break") == 0) {
            return parse_break(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "return") == 0) {
            return parse_return(token_array, code_node_array);
        }
        else if (strcmp(token_array->curr_token->str, "struct") == 0) {
            return parse_struct_declaration(token_array, code_node_array);
        }
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_IDENT) {
        struct Type_Info* type;
        // @Incomplete
        // statements other than declarations
        // that have a type on the left hand side
        // are errors but not handled yet
        bool was_type = parse_type(token_array, code_node_array, &type);
        next_token = &token_array->curr_token[1];
        if (was_type && token_array->curr_token->kind == TOKEN_KIND_IDENT) {
            if (next_token->str[0] == '(') {
                return parse_procedure_declaration(token_array, code_node_array, type);
            }
            else {
                return parse_declaration_precomputed_type(token_array, code_node_array, type);
            }
        }
    }
    bool was_lvalue = parse_lvalue(token_array, code_node_array);
    if (was_lvalue) {
        if (token_array->curr_token->kind == TOKEN_KIND_OP) {
            if (strcmp(token_array->curr_token->str, "++") == 0) {
                return parse_increment(token_array, code_node_array);
            }
            else if (strcmp(token_array->curr_token->str, "--") == 0) {
                return parse_decrement(token_array, code_node_array);
            }
            else if (strcmp(token_array->curr_token->str, "=") == 0) {
                return parse_assign(token_array, code_node_array);
            }
            else if (token_array->curr_token->str[strlen(token_array->curr_token->str)-1] == '=') {
                return parse_opassign(token_array, code_node_array);
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
    else {
        return parse_rvalue(token_array, code_node_array);
    }
}
bool parse_rvalue_atom(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array) {

    if (token_array->curr_token->kind == TOKEN_KIND_LITERAL) {
        return parse_literal(token_array, code_node_array);
    }
    else if (token_array->curr_token->kind == TOKEN_KIND_STRING) {
        return parse_string(token_array, code_node_array);
    }
    else if (strcmp(token_array->curr_token->str, "&") == 0) {
        return parse_reference(token_array, code_node_array);
    }
    else if (strcmp(token_array->curr_token->str, "true") == 0) {
        make_literal_bool(code_node_array, true);
        token_array->curr_token++;
        return true;
    }
    else if (strcmp(token_array->curr_token->str, "false") == 0) {
        make_literal_bool(code_node_array, false);
        token_array->curr_token++;
        return true;
    }
    else if (token_array->curr_token->str[0] == '(') {
        token_array->curr_token++;
        parse_rvalue(token_array, code_node_array);
        struct Code_Node* expression = code_node_array->last;
        if (token_array->curr_token->str[0] == ')') {
            token_array->curr_token++;
            make_parens(code_node_array, expression);
            return true;
        }
        else abort();
    }
    else {
        return parse_lvalue(token_array, code_node_array);
    }
}
bool parse_rvalue(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    struct Token* prev_token = token_array->curr_token;
    parse_rvalue_atom(token_array, code_node_array);
    // where do we use this?
    if (prev_token == token_array->curr_token) {
        token_array->curr_token = prev_token;
        return false;
    }
    enum Operator_Precedence prec = map_operator_to_precedence(token_array->curr_token->str);
    if (prec != OPERATOR_PRECEDENCE_NONE) {
        maybe_binary(OPERATOR_PRECEDENCE_LAST, token_array, code_node_array);
        return true;
    }

    return true;
}
bool parse_lvalue(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    bool ret = false;
    if (token_array->curr_token->str[0] == '*') {
        return parse_dereference(token_array, code_node_array);
    }
    struct Token* prev_token = 0;
    struct Token* prev_token_2 = 0;
    do {
        prev_token = token_array->curr_token;
        prev_token_2 = token_array->curr_token;
        
        if (parse_ident(token_array, code_node_array)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (ret && parse_call(token_array, code_node_array)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (parse_array_index(token_array, code_node_array)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }

        prev_token_2 = token_array->curr_token;
        if (parse_dot_operator(token_array, code_node_array)) {
            ret = true;
        }
        else {
            token_array->curr_token = prev_token_2;
        }
    } while (prev_token < token_array->curr_token);

    return ret;
}
bool parse_call(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array) {

    if (token_array->curr_token->str != NULL &&
        strcmp(token_array->curr_token->str, "(") == 0) {
        
        struct Code_Node* ident = code_node_array->last;
        struct Code_Node** args;
        size_t args_length;
        delimited("(", ")", ",", &parse_rvalue, &args_length, &args, token_array, code_node_array);
        make_call(code_node_array, ident, args, args_length);
        return true;
    }
    else {
        return false;
    }
}
bool parse_literal(struct Token_Array* token_array,
                   struct Code_Node_Array* code_node_array) {

    if (is_one_of(token_array->curr_token->str, '.')) {
        float value = atof(token_array->curr_token->str);
        make_literal_float(code_node_array, value);
    }
    else {
        int value = atoi(token_array->curr_token->str);
        make_literal_int(code_node_array, value);
    }
    token_array->curr_token++;
    return true;
}
bool parse_string(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    make_string(code_node_array, token_array->curr_token->str);
    token_array->curr_token++;
    return true;
}
bool parse_reference(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    parse_lvalue(token_array, code_node_array);
    struct Code_Node* expression = code_node_array->last;
    make_reference(code_node_array, expression);
    return true;
}
bool parse_dereference(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array) {

    char* str = token_array->curr_token->str;
    size_t levels = strlen(token_array->curr_token->str);
    token_array->curr_token++;
    parse_lvalue(token_array, code_node_array);
    struct Code_Node* node = code_node_array->last;
    for (size_t i = 0; i < levels; i += 1) {
        if (str[i] == '*') {
            make_dereference(code_node_array, node);
            node = code_node_array->last;
        }
        else abort();
    }
    return true;
}
bool parse_array_index(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array) {

    struct Code_Node* array = code_node_array->last;
    if (token_array->curr_token->str[0] == '[') {
        token_array->curr_token++;
        bool had_index = parse_rvalue(token_array, code_node_array);
        if (had_index) {
            struct Code_Node* index = code_node_array->last;
            if (token_array->curr_token->str[0] == ']') {
                token_array->curr_token++;
                make_array_index(code_node_array, array, index);
                return true;
            }
            else abort();
        }
        else abort();
    }
    return false;
}
bool parse_dot_operator(struct Token_Array* token_array,
                        struct Code_Node_Array* code_node_array) {

    struct Code_Node* left = code_node_array->last;
    if (token_array->curr_token->str[0] == '.') {
        token_array->curr_token++;
        bool has_right = parse_ident(token_array, code_node_array);
        if (has_right) {
            struct Code_Node* right = code_node_array->last;
            make_dot_operator(code_node_array, left, right);
            return true;
        }
        else abort();
    }
    return false;
}
bool parse_ident(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array) {

    if (token_array->curr_token->kind == TOKEN_KIND_IDENT &&
        token_array->curr_token->str != NULL) {

        make_ident(code_node_array, token_array->curr_token->str, NULL);

        token_array->curr_token++;
        return true;
    }
    else {
        return false;
    }
}
bool parse_if(struct Token_Array* token_array,
              struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    token_array->curr_token++;
    parse_rvalue(token_array, code_node_array);
    struct Code_Node* condition = code_node_array->last;
    if (strcmp(token_array->curr_token->str, ")") == 0) {
        token_array->curr_token++;
    }
    else abort();
    parse_statement(token_array, code_node_array);
    struct Code_Node* expression = code_node_array->last;
    make_if(code_node_array, condition, expression);
    return true;
}
bool parse_else(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    parse_statement(token_array, code_node_array);
    struct Code_Node* expression = code_node_array->last;
    make_else(code_node_array, expression);
    return true;
}
bool parse_while(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    token_array->curr_token++;
    parse_rvalue(token_array, code_node_array);
    struct Code_Node* condition = code_node_array->last;
    if (token_array->curr_token->str[0] == ')') {
        token_array->curr_token++;
    }
    else abort();
    parse_statement(token_array, code_node_array);
    struct Code_Node* expression = code_node_array->last;
    make_while(code_node_array, condition, expression);
    return true;
}
bool parse_do_while(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    parse_statement(token_array, code_node_array);
    struct Code_Node* expression = code_node_array->last;
    if (strcmp(token_array->curr_token->str, "while") == 0) {
        token_array->curr_token++;
    }
    else abort();
    if (token_array->curr_token->str[0] == '(') {
        token_array->curr_token++;
    }
    else abort();
    parse_rvalue(token_array, code_node_array);
    struct Code_Node* condition = code_node_array->last;
    if (token_array->curr_token->str[0] == ')') {
        token_array->curr_token++;
    }
    else abort();
    make_do_while(code_node_array, condition, expression);
    return true;
}
#define DEBUG_FOR false
bool parse_for(struct Token_Array* token_array,
               struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    token_array->curr_token++;
    struct Code_Node* begin = NULL;
    struct Code_Node* condition = NULL;
    struct Code_Node* cycle_end = NULL;
    struct Code_Node* expression = NULL;
    #if DEBUG_FOR
    printf("begin\n");
    #endif
    if (token_array->curr_token->str[0] != ';') {
        bool was_stmt = parse_statement(token_array, code_node_array);
        if (was_stmt == false) {
            #if DEBUG_FOR
            printf("begin false\n");
            #endif
            abort();
        }
        begin = code_node_array->last;
        if (token_array->curr_token->str[0] == ';') {
            token_array->curr_token++;
        }
        else abort();
    }
    else {
        token_array->curr_token++;
    }
    #if DEBUG_FOR
    printf("cond\n");
    #endif
    if (token_array->curr_token->str[0] != ';') {
        bool was_rvalue = parse_rvalue(token_array, code_node_array);
        if (was_rvalue == false) {
            #if DEBUG_FOR
            printf("cond false\n");
            #endif
            abort();
        }
        condition = code_node_array->last;
        if (token_array->curr_token->str[0] == ';') {
            token_array->curr_token++;
        }
        else abort();
    }
    else {
        token_array->curr_token++;
    }
    #if DEBUG_FOR
    printf("end\n");
    #endif
    if (token_array->curr_token->str[0] != ';') {
        bool was_stmt = parse_statement(token_array, code_node_array);
        if (was_stmt == false) {
            #if DEBUG_FOR
            printf("end false\n");
            #endif
            abort();
        }
        cycle_end = code_node_array->last;
        if (token_array->curr_token->str[0] == ')') {
            token_array->curr_token++;
        }
        else abort();
    }
    #if DEBUG_FOR
    printf("expr\n");
    #endif
    bool was_stmt = parse_statement(token_array, code_node_array);
    if (was_stmt == false) {
        #if DEBUG_FOR
        printf("expr false\n");
        #endif
        abort();
    }
    expression = code_node_array->last;
    make_for(code_node_array, begin, condition, cycle_end, expression);
    return true;
}
bool parse_continue(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    make_continue(code_node_array);
    return true;
}
bool parse_break(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    make_break(code_node_array);
    return true;
}
bool parse_return(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    struct Code_Node* expression = NULL;
    if (token_array->curr_token->str[0] != ';') {
        parse_rvalue(token_array, code_node_array);
        expression = code_node_array->last;
    }
    make_return(code_node_array, expression);
    return true;
}
bool parse_block(struct Token_Array* token_array,
                 struct Code_Node_Array* code_node_array) {

    size_t length = 0;
    struct Code_Node** statements;
    delimited("{", "}", ";", &parse_statement, &length, &statements, token_array, code_node_array);
    make_block(code_node_array, statements, length);
    return true;
}
bool parse_increment(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array) {

    struct Code_Node* left = code_node_array->last;
    token_array->curr_token++;
    make_increment(code_node_array, left);
    return true;
}
bool parse_decrement(struct Token_Array* token_array,
                     struct Code_Node_Array* code_node_array) {

    struct Code_Node* left = code_node_array->last;
    token_array->curr_token++;
    make_decrement(code_node_array, left);
    return true;
}
bool parse_assign(struct Token_Array* token_array,
                  struct Code_Node_Array* code_node_array) {

    struct Code_Node* left = code_node_array->last;
    token_array->curr_token++;
    parse_rvalue(token_array, code_node_array);
    struct Code_Node* right = code_node_array->last;
    make_assign(code_node_array, left, right);
    return true;
}
bool parse_opassign(struct Token_Array* token_array,
                    struct Code_Node_Array* code_node_array) {

    struct Code_Node* ident = code_node_array->last;
    size_t op_length = strlen(token_array->curr_token->str) - 1;
    char* operation_type = malloc(sizeof(char) * op_length);
    memcpy(operation_type, token_array->curr_token->str, op_length);
    operation_type[op_length] = '\0';
    token_array->curr_token++;
    parse_rvalue(token_array, code_node_array);
    struct Code_Node* expr = code_node_array->last;
    make_opassign(code_node_array, ident, operation_type, expr);
    return true;
}
bool parse_procedure_declaration(struct Token_Array* token_array,
                                 struct Code_Node_Array* code_node_array,
                                 struct Type_Info* return_type) {

    parse_ident(token_array, code_node_array);
    struct Code_Node* ident = code_node_array->last;
    size_t params_length;
    struct Code_Node** params;
    delimited("(", ")", ",", &parse_declaration, &params_length, &params, token_array, code_node_array);
    parse_block(token_array, code_node_array);
    struct Code_Node* block = code_node_array->last;
    make_procedure(code_node_array, params, params_length, return_type, block);
    struct Code_Node* proc = code_node_array->last;
    // @Incomplete
    // should have function pointer type
    make_declaration(code_node_array, NULL, ident, proc);
    return true;
}
bool parse_type(struct Token_Array* token_array,
                struct Code_Node_Array* code_node_array,
                struct Type_Info** out_type) {

    struct Code_Node* prev_node = code_node_array->last;
    size_t prev_length = code_node_array->length;
    struct Token* prev_token = token_array->curr_token;

    bool was_ident = parse_ident(token_array, code_node_array);
    if (was_ident == false) {
        return false;
    }
    char* ident_name = code_node_array->last->ident.name;
    code_node_array->length -= 1;
    code_node_array->last--;
    struct Type_Info* prev_type = map_name_to_type(ident_name);
    if (prev_type == NULL) {
        code_node_array->last = prev_node;
        code_node_array->length = prev_length;
        token_array->curr_token = prev_token;
        return false;
    }
    prev_type = make_type_info_ident(ident_name, prev_type);

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
bool parse_declaration(struct Token_Array* token_array,
                       struct Code_Node_Array* code_node_array) {

    struct Type_Info* type;
    parse_type(token_array, code_node_array, &type);
    return parse_declaration_precomputed_type(token_array, code_node_array, type);
}
bool parse_declaration_precomputed_type(struct Token_Array* token_array,
                                        struct Code_Node_Array* code_node_array,
                                        struct Type_Info* type) {

    bool was_ident = parse_ident(token_array, code_node_array);
    if (!was_ident) {
        abort();
        return false;
    }
    struct Code_Node* ident = code_node_array->last;
    struct Code_Node* expression;
    if (strcmp(token_array->curr_token->str, "=") == 0) {
        token_array->curr_token++;
        parse_rvalue(token_array, code_node_array);
        expression = code_node_array->last;
    }
    make_declaration(code_node_array, type, ident, expression);
    return true;
}
bool parse_struct_declaration(struct Token_Array* token_array,
                              struct Code_Node_Array* code_node_array) {

    token_array->curr_token++;
    parse_ident(token_array, code_node_array);
    struct Code_Node* ident = code_node_array->last;
    add_user_type(ident->ident.name, make_type_info_struct_dummy());
    parse_block(token_array, code_node_array);
    struct Code_Node* block = code_node_array->last;
    struct Code_Node* expression = make_struct(code_node_array, block);
    make_declaration(code_node_array, NULL, ident, expression);
    return true;
}
#define DEBUG_DELIM false
#if DEBUG_DELIM
int delim = 0;
#endif
bool delimited(char* start, char* stop, char* separator,
               bool (*elem_func)(struct Token_Array*, struct Code_Node_Array*),
               size_t* out_length,
               struct Code_Node*** out_nodes,
               struct Token_Array* token_array,
               struct Code_Node_Array* code_node_array) {

    #if DEBUG_DELIM
    printf("start delim %d\n", delim);
    delim++;
    #endif
    size_t capacity = 100;
    size_t length = 0;
    struct Code_Node** nodes = malloc(sizeof(struct Code_Node*) * capacity);

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
            elem_func(token_array, code_node_array);
            nodes[length] = code_node_array->last;
            length += 1;
        }
        else {
            // @Bug
            printf("no string\n");
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

    *out_length = length;
    *out_nodes = nodes;
    return true;
}

struct Code_Node* get_new_node_from_code_node_array(struct Code_Node_Array* code_node_array) {

    // @Audit
    // @Realloc
    // might have to fix pointers for the entire tree
    if (code_node_array->length == code_node_array->capacity) {
        code_node_array->capacity *= 2;
        code_node_array->first = realloc(code_node_array->first, code_node_array->capacity);
    }

    code_node_array->length += 1;
    code_node_array->last++;
    return code_node_array->last;
}

struct Token_Array* tokenize(char* input) {
    // we can use the input length to assume a mostly optimal starting capacity
    size_t input_length = strlen(input);

    struct Token_Array* token_array = malloc(sizeof(struct Token_Array));
    token_array->length = 0;
    token_array->capacity = 10000;
    token_array->first = malloc(sizeof(struct Token) * token_array->capacity);
    token_array->curr_token = token_array->first;

    char* prev = input;
    for (size_t i = 0; *input; i += 1) {
        read_token(token_array->curr_token, &input);
        if (input == prev) {
            printf("lexing error!\n");
            break;
        }

        if (token_array->curr_token->kind == TOKEN_KIND_COMMENT_SINGLE ||
            token_array->curr_token->kind == TOKEN_KIND_COMMENT_MULTI) {

        }
        else {

            token_array->curr_token++;
            token_array->length += 1;
            prev = input;
        }

        // @Bug
        // @Audit
        // @Realloc
        if (token_array->length == token_array->capacity) {
            token_array->capacity *= 2;
            token_array->first = realloc(token_array->first, token_array->capacity);
            token_array->curr_token = &token_array->first[token_array->length];
        }
    }

    // @Weird
    // we have to do this twice to have a valid pointer
    token_array->curr_token--;
    token_array->curr_token--;
    token_array->last = token_array->curr_token;

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
        (*input)++;
    }
    else if (is_punc(ch)) {
        (*input)++;
        token->kind = TOKEN_KIND_PUNC;
        char* str = malloc(sizeof(char) * 2);
        str[0] = ch;
        str[1] = '\0';
        token->str = str;
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
    // @MemoryHog
    // we should start lower and reallocate
    size_t capacity = 100;
    char* str = malloc(sizeof(char) * capacity);
    size_t length = 0;
    while (**input && func(**input)) {
        str[length] = **input;
        (*input)++;
        length += 1;
        // @Realloc
        // @Audit
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
    // @MemoryHog
    // we should start lower and reallocate
    size_t capacity = 100;
    char* str = malloc(sizeof(char) * capacity);
    size_t length = 0;
    while (**input && func(**input, (*input)[1])) {
        str[length] = **input;
        (*input)++;
        length += 1;
        // @Realloc
        // @Audit
        if (length == capacity) {
            capacity *= 2;
            str = realloc(str, sizeof(char) * capacity);
        }
    }
    str[length] = '\0';
    str = realloc(str, sizeof(char) * length);
    return str;
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