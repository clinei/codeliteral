#include "run.h"

#include "debug.h"

void init_run(struct Code_Nodes* code_nodes) {
    run_data.code_nodes = code_nodes;

    run_data.did_run = false;
    run_data.last_block = NULL;
    run_data.last_call = NULL;
    run_data.last_loop = NULL;
    run_data.execution_index = 0;

    run_data.execution_stack = malloc(sizeof(struct Code_Node_Array));
    array_init(run_data.execution_stack, sizeof(struct Code_Node*), 10);

    run_data.original_to_clone = malloc(sizeof(struct Original_To_Clone_Map_SOA));
    soa_init(run_data.original_to_clone, 100, 2, sizeof(struct Code_Node*), sizeof(struct Code_Node*));

    run_data.original_to_indices = malloc(sizeof(struct Original_To_Indices_Map_SOA));
    soa_init(run_data.original_to_indices, 100, 2, sizeof(struct Code_Node*), sizeof(struct Indices_Array*));

    run_data.uses_to_indices = malloc(sizeof(struct Offsets_To_Indices_Map_SOA));
    soa_init(run_data.uses_to_indices, 100, 2, sizeof(size_t), sizeof(struct Indices_Array*));

    run_data.changes_to_indices = malloc(sizeof(struct Offsets_To_Indices_Map_SOA));
    soa_init(run_data.changes_to_indices, 100, 2, sizeof(size_t), sizeof(struct Indices_Array*));

    run_data.count_uses = true;
    run_data.name_uses = malloc(sizeof(struct Name_Uses_Map_SOA));
    soa_init(run_data.name_uses, 100, 2, sizeof(char*), sizeof(size_t));

    run_data.memory_size = 1000;
    run_data.memory = malloc(run_data.memory_size);
    run_data.stack_pointer = 0;
}

void add_memory_use(size_t offset, size_t execution_index) {
    struct Indices_Array* indices = map_uses_to_indices(offset);
    if (indices == NULL) {
        indices = malloc(sizeof(struct Indices_Array));
        array_init(indices, sizeof(size_t), 100);
        soa_push(run_data.uses_to_indices, offset, indices);
    }
    bool should_push = true;
    if (indices->length > 0) {
        size_t last_index = indices->first[indices->length-1];
        if (last_index > execution_index - 2) {
            // should_push = false;
        }
    }
    if (should_push) {
        array_push(indices, &execution_index);
    }
    if (offset == 0) {
        // abort();
    }
}
void add_memory_change(size_t offset, size_t execution_index) {
    struct Indices_Array* indices = map_changes_to_indices(offset);
    if (indices == NULL) {
        indices = malloc(sizeof(struct Indices_Array));
        array_init(indices, sizeof(size_t), 100);
        soa_push(run_data.changes_to_indices, offset, indices);
    }
    array_push(indices, &execution_index);
}
void* get_memory(size_t offset, size_t num_bytes) {
    if (offset + num_bytes > run_data.memory_size) {
        printf("invalid attempt to get_memory at address %zu until %zu (max address is %zu)\n", offset, offset + num_bytes, run_data.memory_size);
        abort();
        return NULL;
    }
    return run_data.memory + offset;
}
void* get_memory_tracked(size_t offset, size_t num_bytes) {
    add_memory_use(offset, run_data.execution_index);
    return get_memory(offset, num_bytes);
}
void set_memory(size_t offset, void* data, size_t num_bytes) {
    if (offset + num_bytes > run_data.memory_size) {
        run_data.memory_size *= 2;
        run_data.memory = realloc(run_data.memory, run_data.memory_size);
    }
    memcpy(run_data.memory + offset, data, num_bytes);
}
void set_memory_tracked(size_t offset, void* data, size_t num_bytes) {
    add_memory_change(offset, run_data.execution_index);
    set_memory(offset, data, num_bytes);
}

struct Indices_Array* map_uses_to_indices(size_t offset) {
    for (size_t i = 0; i < run_data.uses_to_indices->length; i += 1) {
        if (run_data.uses_to_indices->offsets[i] == offset) {
            return run_data.uses_to_indices->indices[i];
        }
    }
    return NULL;
}

struct Indices_Array* map_changes_to_indices(size_t offset) {
    for (size_t i = 0; i < run_data.changes_to_indices->length; i += 1) {
        if (run_data.changes_to_indices->offsets[i] == offset) {
            return run_data.changes_to_indices->indices[i];
        }
    }
    return NULL;
}

struct Indices_Array* map_original_to_indices(struct Code_Node* original) {
    for (size_t i = 0; i < run_data.original_to_indices->length; i += 1) {
        if (run_data.original_to_indices->originals[i] == original) {
            return run_data.original_to_indices->indices[i];
        }
    }
    return NULL;
}

void add_node_to_execution_stack(struct Code_Node* node) {
    run_data.execution_index = run_data.execution_stack->length;
    node->is_on_execution_stack = true;
    node->execution_index = run_data.execution_index;
    array_push(run_data.execution_stack, &node);

    struct Indices_Array* indices = map_original_to_indices(node->original);
    if (indices == NULL) {
        indices = malloc(sizeof(struct Indices_Array));
        array_init(indices, sizeof(size_t), 100);
        soa_push(run_data.original_to_indices, node->original, indices);
    }
    array_push(indices, &node->execution_index);
}

void add_name_use(char* name) {
    for (size_t i = 0; i < run_data.name_uses->length; i += 1) {
        if (strcmp(run_data.name_uses->names[i], name) == 0) {
            run_data.name_uses->uses[i] += 1;
            return;
        }
    }
    soa_push(run_data.name_uses, name, 1);
}
size_t get_name_uses(char* name) {
    for (size_t i = 0; i < run_data.name_uses->length; i += 1) {
        if (strcmp(run_data.name_uses->names[i], name) == 0) {
            return run_data.name_uses->uses[i];
        }
    }
    return 0;
}

struct Code_Node* math_binop(struct Code_Node* left, char* op, struct Code_Node* right) {

    // @Incomplete
    // we need to compromise between left and right types
    struct Type_Info* left_type = left->type;
    if (left_type->kind == TYPE_INFO_TAG_IDENT) {
        left_type = left_type->ident.type;
    }
    struct Type_Info* right_type = right->type;
    if (right_type->kind == TYPE_INFO_TAG_IDENT) {
        right_type = right_type->ident.type;
    }

    char type = 0;
    if (left_type == Native_Type_Bool) {
        type = 1;
    }
    else if (left_type->kind == TYPE_INFO_TAG_INTEGER) {
        if (left_type->integer.is_signed) {
            type = 2;
        }
        else {
            type = 3;
        }
    }
    else if (left_type->kind == TYPE_INFO_TAG_FLOAT) {
        type = 4;
    }
    else if (left_type->kind == TYPE_INFO_TAG_STRING) {
        type = 5;
    }

    // @Ugh
    // this would be so much easier if we just had bytecode
    if (type == 1) {
        // bool
        bool left_value = left->literal_bool.value;
        bool right_value = right->literal_bool.value;
        bool result;
        // @Copypaste
        if (strcmp(op, "+") == 0) {
            result = left_value + right_value;
        }
        else if (strcmp(op, "-") == 0) {
            result = left_value - right_value;
        }
        else if (strcmp(op, "*") == 0) {
            result = left_value * right_value;
        }
        else if (strcmp(op, "/") == 0) {
            result = left_value / right_value;
        }
        else if (strcmp(op, "%") == 0) {
            result = left_value % right_value;
        }
        else if (strcmp(op, "<") == 0) {
            result = left_value < right_value;
        }
        else if (strcmp(op, "<=") == 0) {
            result = left_value <= right_value;
        }
        else if (strcmp(op, ">") == 0) {
            result = left_value > right_value;
        }
        else if (strcmp(op, ">=") == 0) {
            result = left_value >= right_value;
        }
        else if (strcmp(op, "!=") == 0) {
            result = left_value != right_value;
        }
        else if (strcmp(op, "==") == 0) {
            result = left_value == right_value;
        }
        else if (strcmp(op, "&") == 0) {
            result = left_value & right_value;
        }
        else if (strcmp(op, "^") == 0) {
            result = left_value ^ right_value;
        }
        else if (strcmp(op, "|") == 0) {
            result = left_value | right_value;
        }
        else if (strcmp(op, "&&") == 0) {
            result = left_value && right_value;
        }
        else if (strcmp(op, "||") == 0) {
            result = left_value || right_value;
        }
        else {
            printf("math_binop not implemented for bool op kind: (%s)\n", op);
            abort();
        }
        return make_literal_bool(run_data.code_nodes, result);
    }
    else if (type == 2) {
        // integer
        // we really should store operation type as an enum
        // how should we handle custom operators then?
        signed long int left_value = left->literal_int.value;
        signed long int right_value = right->literal_int.value;
        signed long int result;
        bool is_bool_op = false;
        // @Copypaste
        if (strcmp(op, "+") == 0) {
            result = left_value + right_value;
        }
        else if (strcmp(op, "-") == 0) {
            result = left_value - right_value;
        }
        else if (strcmp(op, "*") == 0) {
            result = left_value * right_value;
        }
        else if (strcmp(op, "/") == 0) {
            result = left_value / right_value;
        }
        else if (strcmp(op, "%") == 0) {
            result = left_value % right_value;
        }
        else if (strcmp(op, "&") == 0) {
            result = left_value & right_value;
        }
        else if (strcmp(op, "^") == 0) {
            result = left_value ^ right_value;
        }
        else if (strcmp(op, "|") == 0) {
            result = left_value | right_value;
        }
        else if (strcmp(op, "<") == 0) {
            is_bool_op = true;
            result = left_value < right_value;
        }
        else if (strcmp(op, "<=") == 0) {
            is_bool_op = true;
            result = left_value <= right_value;
        }
        else if (strcmp(op, ">") == 0) {
            is_bool_op = true;
            result = left_value > right_value;
        }
        else if (strcmp(op, ">=") == 0) {
            is_bool_op = true;
            result = left_value >= right_value;
        }
        else if (strcmp(op, "!=") == 0) {
            is_bool_op = true;
            result = left_value != right_value;
        }
        else if (strcmp(op, "==") == 0) {
            is_bool_op = true;
            result = left_value == right_value;
        }
        else if (strcmp(op, "&&") == 0) {
            is_bool_op = true;
            result = left_value && right_value;
        }
        else if (strcmp(op, "||") == 0) {
            is_bool_op = true;
            result = left_value || right_value;
        }
        else {
            printf("math_binop not implemented for int op kind: (%s)\n", op);
            abort();
        }
        if (is_bool_op) {
            return make_literal_bool(run_data.code_nodes, (bool)result);
        }
        else {
            return make_literal_int(run_data.code_nodes, result);
        }
    }
    else if (type == 3) {
        // integer
        // we really should store operation type as an enum
        // how should we handle custom operators then?
        unsigned long int left_value = left->literal_uint.value;
        unsigned long int right_value = right->literal_uint.value;
        unsigned long int result;
        bool is_bool_op = false;
        // @Copypaste
        if (strcmp(op, "+") == 0) {
            result = left_value + right_value;
        }
        else if (strcmp(op, "-") == 0) {
            result = left_value - right_value;
        }
        else if (strcmp(op, "*") == 0) {
            result = left_value * right_value;
        }
        else if (strcmp(op, "/") == 0) {
            result = left_value / right_value;
        }
        else if (strcmp(op, "%") == 0) {
            result = left_value % right_value;
        }
        else if (strcmp(op, "&") == 0) {
            result = left_value & right_value;
        }
        else if (strcmp(op, "^") == 0) {
            result = left_value ^ right_value;
        }
        else if (strcmp(op, "|") == 0) {
            result = left_value | right_value;
        }
        else if (strcmp(op, "<") == 0) {
            is_bool_op = true;
            result = left_value < right_value;
        }
        else if (strcmp(op, "<=") == 0) {
            is_bool_op = true;
            result = left_value <= right_value;
        }
        else if (strcmp(op, ">") == 0) {
            is_bool_op = true;
            result = left_value > right_value;
        }
        else if (strcmp(op, ">=") == 0) {
            is_bool_op = true;
            result = left_value >= right_value;
        }
        else if (strcmp(op, "!=") == 0) {
            is_bool_op = true;
            result = left_value != right_value;
        }
        else if (strcmp(op, "==") == 0) {
            is_bool_op = true;
            result = left_value == right_value;
        }
        else if (strcmp(op, "&&") == 0) {
            is_bool_op = true;
            result = left_value && right_value;
        }
        else if (strcmp(op, "||") == 0) {
            is_bool_op = true;
            result = left_value || right_value;
        }
        else {
            printf("math_binop not implemented for uint op kind: (%s)\n", op);
            abort();
        }
        if (is_bool_op) {
            return make_literal_bool(run_data.code_nodes, (bool)result);
        }
        else {
            return make_literal_uint(run_data.code_nodes, result);
        }
    }
    else if (type == 4) {
        double left_value = left->literal_float.value;
        double right_value = right->literal_float.value;
        double epsilon = 0.0000001;
        bool is_almost_equal = left_value - epsilon < right_value && left_value + epsilon > right_value;
        double result;
        bool is_bool_op = false;
        // @Copypaste
        if (strcmp(op, "+") == 0) {
            result = left_value + right_value;
        }
        else if (strcmp(op, "-") == 0) {
            result = left_value - right_value;
        }
        else if (strcmp(op, "*") == 0) {
            result = left_value * right_value;
        }
        else if (strcmp(op, "/") == 0) {
            result = left_value / right_value;
        }
        else if (strcmp(op, "<") == 0) {
            is_bool_op = true;
            result = left_value < right_value;
        }
        else if (strcmp(op, "<=") == 0) {
            is_bool_op = true;
            // result = left_value <= right_value;
            if (is_almost_equal) {
                result = 1.0;
            }
        }
        else if (strcmp(op, ">") == 0) {
            is_bool_op = true;
            result = left_value > right_value;
        }
        else if (strcmp(op, ">=") == 0) {
            is_bool_op = true;
            // result = left_value >= right_value;
            if (is_almost_equal) {
                result = 1.0;
            }
        }
        else if (strcmp(op, "!=") == 0) {
            is_bool_op = true;
            // result = left_value != right_value;
            if (is_almost_equal == false) {
                result = 1.0;
            }
        }
        else if (strcmp(op, "==") == 0) {
            is_bool_op = true;
            // result = left_value == right_value;
            if (is_almost_equal) {
                result = 1.0;
            }
        }
        else if (strcmp(op, "&&") == 0) {
            is_bool_op = true;
            result = left_value && right_value;
        }
        else if (strcmp(op, "||") == 0) {
            is_bool_op = true;
            result = left_value || right_value;
        }
        else {
            printf("math_binop not implemented for float op kind: (%s)\n", op);
            abort();
        }
        if (is_bool_op) {
            return make_literal_bool(run_data.code_nodes, (bool)result);
        }
        else {
            return make_literal_float(run_data.code_nodes, result);
        }
    }
    else if (type == 5) {
        // string
        bool result;
        if (strcmp(op, "==") == 0) {
            result = strcmp(left->string_.pointer, right->string_.pointer) == 0;
        }
        else if (strcmp(op, "!=") == 0) {
            result = strcmp(left->string_.pointer, right->string_.pointer) != 0;
        }
        else {
            printf("math_binop not implemented for string op kind: (%s)\n", op);
        }
        return make_literal_bool(run_data.code_nodes, result);
    }
    else {
        printf("math_binop not implemented for type kind: %d\n", left->type->kind);
        abort();
        return NULL;
    }
}

struct Code_Node* math_solve(struct Code_Node* node) {
    struct Code_Node* result = NULL;
    switch (node->kind) {
        case CODE_KIND_BINARY_OPERATION:{
            char* operation_type = node->binary_operation.operation_type;
            run_rvalue(node->binary_operation.left);
            run_rvalue(node->binary_operation.right);
            node->binary_operation.right->result = maybe_cast(node->binary_operation.left->result, node->binary_operation.right->result);
            struct Code_Node* left_result = node->binary_operation.left->result;
            struct Code_Node* right_result = node->binary_operation.right->result;
            struct Code_Node* ptr_result = NULL;
            struct Code_Node* add_result = NULL;
            size_t elem_size;
            if (node->binary_operation.left->type->kind == TYPE_INFO_TAG_POINTER &&
                node->binary_operation.right->type->kind != TYPE_INFO_TAG_POINTER) {

                ptr_result = left_result;
                add_result = right_result;
                elem_size = node->binary_operation.left->type->pointer.elem_type->size_in_bytes;
            }
            else if (node->binary_operation.left->type->kind != TYPE_INFO_TAG_POINTER &&
                     node->binary_operation.right->type->kind == TYPE_INFO_TAG_POINTER) {

                ptr_result = right_result;
                add_result = left_result;
                elem_size = node->binary_operation.right->type->pointer.elem_type->size_in_bytes;
            }
            else if (node->binary_operation.left->type->kind == TYPE_INFO_TAG_POINTER &&
                     node->binary_operation.right->type->kind == TYPE_INFO_TAG_POINTER) {

                printf("can't do binary operations with two pointers!\n");
                abort();
            }
            if (ptr_result != NULL) {
                if (strcmp(operation_type, "+") == 0 ||
                    strcmp(operation_type, "-") == 0) {
                }
                else {
                    printf("only + and - are allowed for pointer math, was (%s)\n", operation_type);
                    abort();
                }
                if (elem_size == 0) {
                    elem_size = 1;
                }
                // @Incomplete
                // @UserExperience
                // will the user understand why 4 + 1 = 12?
                switch (add_result->kind) {
                    case CODE_KIND_LITERAL_UINT:{
                        add_result->literal_uint.value *= elem_size;
                        break;
                    }
                    case CODE_KIND_LITERAL_INT:{
                        add_result->literal_int.value *= elem_size;
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
            result = math_binop(left_result, operation_type, right_result);
            break;
        }
        default:{
            printf("math_solve not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
    return result;
}

void* get_result_ptr(struct Code_Node* node) {
    switch (node->result->kind) {
        case CODE_KIND_LITERAL_INT:{
            return &(node->result->literal_int.value);
            break;
        }
        case CODE_KIND_LITERAL_UINT:{
            return &(node->result->literal_uint.value);
            break;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            if (node->result->type->size_in_bytes == 4) {
                return &(node->result->literal_float.value_f32);
            }
            else if (node->result->type->size_in_bytes == 8) {
                return &(node->result->literal_float.value);
            }
            else {
                printf("expected float type to have size 4 or 8 (was %zu)\n", node->result->type->size_in_bytes);
                abort();
            }
            break;
        }
        case CODE_KIND_LITERAL_BOOL:{
            return &(node->result->literal_bool.value);
            break;
        }
        case CODE_KIND_STRING:{
            return &(node->result->string_.pointer);
            break;
        }
        default:{
            printf("get_result_ptr not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
}
void fill_result_str(struct Code_Node* node) {
    if (node == NULL || node->str != NULL) {
        return;
    }
    switch (node->kind) {
        case CODE_KIND_STRING:{
            break;
        }
        case CODE_KIND_LITERAL_INT:{
            signed long int value = node->literal_int.value;
            int chars_needed = snprintf(NULL, 0, "%ld", value) + 1;
            char* str = malloc(sizeof(char) * chars_needed);
            snprintf(str, chars_needed, "%ld", value);
            node->str = str;
            break;
        }
        case CODE_KIND_LITERAL_UINT:{
            unsigned long int value = node->literal_uint.value;
            int chars_needed = snprintf(NULL, 0, "%lu", value) + 1;
            char* str = malloc(sizeof(char) * chars_needed);
            snprintf(str, chars_needed, "%lu", value);
            node->str = str;
            break;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            double value = node->literal_float.value;
            int chars_needed = 20;
            char* str = malloc(sizeof(char) * chars_needed);
            snprintf(str, chars_needed, "%.6f", value);
            node->str = str;
            break;
        }
        case CODE_KIND_LITERAL_BOOL:{
            bool value = node->literal_bool.value;
            if (value) {
                node->str = "true";
            }
            else {
                node->str = "false";
            }
            break;
        }
        default:{
            printf("fill_result_str not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
}
bool convert_to_bool(void* value, struct Type_Info* type) {
    switch (type->kind) {
        case TYPE_INFO_TAG_IDENT:{
            return convert_to_bool(value, type->ident.type);
        }
        case TYPE_INFO_TAG_INTEGER:{
            // @Incomplete
            if (type == Native_Type_Bool->ident.type) {
                return *(bool*)value;
            }
            else if (type->integer.is_signed) {
                return *(signed long int*)value > 0;
            }
            else {
                return *(unsigned long int*)value > 0;
            }
        }
        case TYPE_INFO_TAG_FLOAT:{
            return true;
        }
        default:{
            abort();
            return false;
        }
    }
}
struct Code_Node* get_result(void* value, struct Type_Info* type) {
    struct Code_Node* result = NULL;
    switch (type->kind) {
        case TYPE_INFO_TAG_IDENT:{
            return get_result(value, type->ident.type);
        }
        case TYPE_INFO_TAG_INTEGER:{
            if (type == Native_Type_Bool->ident.type) {
                result = make_literal_bool(run_data.code_nodes, *(bool*)value);
            }
            else if (type->integer.is_signed) {
                result = make_literal_int(run_data.code_nodes, 0);
                memcpy(&result->literal_int.value, value, type->size_in_bytes);
            }
            else {
                result = make_literal_uint(run_data.code_nodes, 0);
                memcpy(&result->literal_uint.value, value, type->size_in_bytes);
            }
            break;
        }
        case TYPE_INFO_TAG_FLOAT:{
            result = make_literal_float(run_data.code_nodes, 0);
            if (type->size_in_bytes == 4) {
                double value_f64 = *(float*)value;
                memcpy(&result->literal_float.value, &value_f64, 8);
                memcpy(&result->literal_float.value_f32, value, 4);
            }
            else if (type->size_in_bytes == 8) {
                float value_f32 = *(double*)value;
                memcpy(&result->literal_float.value, value, 8);
                memcpy(&result->literal_float.value_f32, &value_f32, 4);
            }
            else {
                printf("expected float type to have size 4 or 8 (was %zu)\n", type->size_in_bytes);
                abort();
            }
            break;
        }
        case TYPE_INFO_TAG_POINTER:{
            result = make_literal_uint(run_data.code_nodes, 0);
            memcpy(&result->literal_uint.value, value, type->size_in_bytes);
            break;
        }
        case TYPE_INFO_TAG_STRUCT:{
            return NULL;
        }
        case TYPE_INFO_TAG_STRING:{
            result = make_string(run_data.code_nodes, *(char**)value);
            break;
        }
        default:{
            printf("get_result not implemented for type kind %u\n", type->kind);
            abort();
            break;
        }
    }

    fill_result_str(result);
    return result;
}
struct Code_Node* get_ident_result(struct Code_Node* node) {
    void* value = get_memory(node->ident.declaration->declaration.pointer, node->type->size_in_bytes);
    return get_result(value, node->type);
}
void run_call(struct Code_Node* node) {
    node->was_run = true;
    struct Code_Node* prev_last_call = run_data.last_call;
    run_data.last_call = node;
    struct Code_Node* proc = node->call.ident->ident.declaration->declaration.expression;
    if (proc->procedure.block->kind == CODE_KIND_BLOCK) {
        // printf("entering %s\n", node->call.ident->ident.name);
        transform(node);
        struct Code_Node_Array* extras = run_data.last_block->block.extras->first + run_data.statement_index;
        array_push(extras, &(node->transformed));
        run_statement(node->transformed);
        add_node_to_execution_stack(node);
        node->pointer = node->call.return_ident->pointer;
        add_memory_use(node->pointer, node->execution_index);
        node->call.return_ident = clone(node->call.return_ident);
        // printf("exiting %s\n", node->call.ident->ident.name);
    }
    else if (proc->procedure.block->kind == CODE_KIND_NATIVE_CODE) {
        // printf("native code\n");
        for (size_t i = 0; i < node->call.args->length; i += 1) {
            run_rvalue(node->call.args->first[i]);
        }
        // @Incomplete
        // need to import a libc, like musl
    }
    run_data.last_call = prev_last_call;
}
struct Code_Node* maybe_cast(struct Code_Node* lhs, struct Code_Node* rhs) {
    struct Type_Info* lhs_type = lhs->type;
    if (lhs_type->kind == TYPE_INFO_TAG_IDENT) {
        lhs_type = lhs_type->ident.type;
    }
    struct Type_Info* rhs_type = rhs->type;
    if (rhs_type->kind == TYPE_INFO_TAG_IDENT) {
        rhs_type = rhs_type->ident.type;
    }
    if (lhs_type->kind == TYPE_INFO_TAG_INTEGER && rhs_type->kind == TYPE_INFO_TAG_INTEGER) {
        if (lhs_type->integer.is_signed == true && rhs_type->integer.is_signed == false) {
            signed long int value = (signed long int)rhs->literal_uint.value;
            rhs = make_literal_int(run_data.code_nodes, value);
        }
        else if (lhs_type->integer.is_signed == false && rhs_type->integer.is_signed == true) {
            unsigned long int value = (unsigned long int)rhs->literal_int.value;
            rhs = make_literal_uint(run_data.code_nodes, value);
            // @Incomplete
            // possible underflow
        }
    }
    fill_result_str(rhs);
    return rhs;
}
size_t run_lvalue(struct Code_Node* node) {
    // printf("run_lvalue: (%s)\n", code_kind_to_string(node->kind));
    node->was_run = true;
    size_t result = 0;
    switch (node->kind) {
        case CODE_KIND_IDENT:{
            // would be nice if we could update names while cloning
            node->ident.name = node->ident.declaration->declaration.ident->ident.name;
            node->pointer = node->ident.declaration->declaration.pointer;
            result = node->pointer;
            // @Incomplete
            // maybe we should not get the result here
            if (node->type->kind != TYPE_INFO_TAG_ARRAY) {
                node->result = get_ident_result(node);
            }
            break;
        }
        case CODE_KIND_ASSIGN:{
            // maybe this should be in run_rvalue
            struct Code_Node* lhs = node->assign.ident;
            struct Code_Node* rhs = node->assign.expression;
            lhs->is_lhs = true;
            size_t lhs_pointer = run_lvalue(lhs);
            add_node_to_execution_stack(lhs);
            void* prev_value = get_memory(lhs_pointer, lhs->type->size_in_bytes);
            if (lhs->type->kind != TYPE_INFO_TAG_ARRAY) {
                lhs->result = get_result(prev_value, lhs->type);
            }
            run_rvalue(rhs);
            rhs->result = maybe_cast(lhs, rhs->result);
            node->result = rhs->result;
            set_memory(lhs_pointer, get_result_ptr(node), lhs->type->size_in_bytes);
            add_memory_change(lhs_pointer, lhs->execution_index);
            break;
        }
        case CODE_KIND_OPASSIGN:{
            struct Code_Node* lhs = node->opassign.ident;
            struct Code_Node* rhs = node->opassign.expression;
            lhs->is_lhs = true;
            size_t lhs_pointer = run_lvalue(lhs);
            struct Code_Node* binop = make_binary_operation(run_data.code_nodes, lhs, node->opassign.operation_type, rhs);
            node->result = math_solve(binop);
            set_memory(lhs_pointer, get_result_ptr(node), lhs->type->size_in_bytes);
            add_memory_change(lhs_pointer, lhs->execution_index);
            break;
        }
        case CODE_KIND_CALL:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = NULL;
            run_call(node);
            run_data.last_loop = prev_last_loop;
            result = *(size_t*)get_result_ptr(node);
            break;
        }
        case CODE_KIND_ARRAY_INDEX: {
            struct Code_Node* lhs = node->array_index.array;
            size_t lhs_pointer = run_lvalue(lhs);
            run_rvalue(node->array_index.index);
            // @Incomplete
            // index can be negative
            size_t index_result = (size_t)(*(int*)get_result_ptr(node->array_index.index));
            if (lhs->type->kind == TYPE_INFO_TAG_ARRAY) {
                // array bounds check
                size_t array_length = lhs->type->array.length;
                if (index_result >= array_length) {
                    printf("array index out of bounds! index: (%zu) length: (%zu)\n", index_result, array_length);
                    abort();
                }
            }
            else if (lhs->type->kind == TYPE_INFO_TAG_POINTER) {
                size_t* value = get_memory(lhs_pointer, lhs->type->size_in_bytes);
                lhs_pointer = *value;
            }
            else {
                printf("array indexes can only be done on arrays and pointers, was (%s)\n", type_kind_to_string(lhs->type->kind));
                abort();
            }
            result = lhs_pointer + index_result * node->type->size_in_bytes;
            lhs->pointer = lhs_pointer;
            node->pointer = result;
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            struct Code_Node* left = node->dot_operator.left;
            struct Code_Node* right = node->dot_operator.right;
            struct Type_Info* left_type = left->type;
            // @Cleanup
            // :DotOperatorDedupe
            if (left_type->kind == TYPE_INFO_TAG_POINTER) {
                left_type = left_type->pointer.elem_type;
            }
            if (left_type->kind == TYPE_INFO_TAG_IDENT) {
                left_type = left_type->ident.type;
            }
            if (left_type->kind == TYPE_INFO_TAG_POINTER) {
                printf("dot operators can only dereference one level deep!\n");
                abort();
            }
            size_t pointer = run_lvalue(left);
            if (left->type->kind == TYPE_INFO_TAG_POINTER) {
                pointer = *(size_t*)get_memory(pointer, node->type->size_in_bytes);
            }
            left->is_lhs = node->is_lhs;
            right->is_lhs = node->is_lhs;
            struct Type_Info_Struct* struct_ = &(left_type->struct_);
            size_t member_index = index_of_string(right->ident.name, struct_->member_names, struct_->members_length);
            result = pointer + struct_->offsets[member_index];
            right->pointer = result;
            node->pointer = result;
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            node->dereference.expression->is_lhs = node->is_lhs;
            struct Code_Node* loc = run_rvalue(node->dereference.expression);
            size_t pointer = loc->literal_uint.value;
            node->result = loc;
            result = pointer;
            break;
        }
        case CODE_KIND_PARENS:{
            result = run_lvalue(node->parens.expression);
            break;
        }
        default:{
            printf("run_lvalue not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
    node->pointer = result;
    return result;
}
struct Code_Node* run_rvalue(struct Code_Node* node) {
    // printf("run_rvalue: (%s)\n", code_kind_to_string(node->kind));
    node->was_run = true;
    struct Code_Node* result = NULL;
    switch (node->kind) {
        case CODE_KIND_STRING:
        case CODE_KIND_LITERAL_INT:
        case CODE_KIND_LITERAL_UINT:
        case CODE_KIND_LITERAL_FLOAT:
        case CODE_KIND_LITERAL_BOOL:{
            add_node_to_execution_stack(node);
            node->result = node;
            return node;
        }
        case CODE_KIND_INCREMENT:{
            size_t pointer = run_lvalue(node->increment.ident);
            void* real_pointer = (void*)(run_data.memory + pointer);
            struct Code_Node* prev = get_result(real_pointer, node->type);
            size_t amount = 1;
            if (node->type->kind == TYPE_INFO_TAG_POINTER) {
                amount = node->type->pointer.elem_type->size_in_bytes;
            }
            switch (prev->kind) {
                case CODE_KIND_LITERAL_INT:{
                    prev->literal_int.value += amount;
                    break;
                }
                case CODE_KIND_LITERAL_UINT:{
                    prev->literal_uint.value += amount;
                    break;
                }
                case CODE_KIND_LITERAL_FLOAT:{
                    prev->literal_float.value += amount;
                    prev->literal_float.value_f32 = prev->literal_float.value;
                    break;
                }
                case CODE_KIND_LITERAL_BOOL:{
                    prev->literal_bool.value = prev->literal_bool.value == 0;
                    break;
                }
                default:{
                    printf("tried to increment (%s)\n", code_kind_to_string(prev->kind));
                    abort();
                    break;
                }
            }
            node->result = prev;
            node->result->str = NULL;
            node->pointer = pointer;
            add_node_to_execution_stack(node->increment.ident);
            set_memory(pointer, get_result_ptr(node), node->type->size_in_bytes);
            add_memory_change(pointer, node->increment.ident->execution_index);
            add_node_to_execution_stack(node);
            result = prev;
            break;
        }
        case CODE_KIND_DECREMENT:{
            size_t pointer = run_lvalue(node->decrement.ident);
            void* real_pointer = (void*)(run_data.memory + pointer);
            struct Code_Node* prev = get_result(real_pointer, node->type);
            size_t amount = 1;
            if (node->type->kind == TYPE_INFO_TAG_POINTER) {
                amount = node->type->pointer.elem_type->size_in_bytes;
            }
            switch (prev->kind) {
                case CODE_KIND_LITERAL_INT:{
                    prev->literal_int.value -= amount;
                    break;
                }
                case CODE_KIND_LITERAL_UINT:{
                    prev->literal_uint.value -= amount;
                    break;
                }
                case CODE_KIND_LITERAL_FLOAT:{
                    prev->literal_float.value -= amount;
                    prev->literal_float.value_f32 = prev->literal_float.value;
                    break;
                }
                case CODE_KIND_LITERAL_BOOL:{
                    // C doesn't allow this, but we do.
                    // works the same as increment
                    prev->literal_bool.value = prev->literal_bool.value == 0;
                    break;
                }
                default:{
                    printf("tried to decrement (%s)\n", code_kind_to_string(prev->kind));
                    abort();
                    break;
                }
            }
            node->result = prev;
            node->result->str = NULL;
            node->pointer = pointer;
            add_node_to_execution_stack(node->decrement.ident);
            set_memory(pointer, get_result_ptr(node), node->type->size_in_bytes);
            add_memory_change(pointer, node->decrement.ident->execution_index);
            add_node_to_execution_stack(node);
            result = prev;
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            result = math_solve(node);
            add_node_to_execution_stack(node);
            break;
        }
        case CODE_KIND_IDENT:{
            run_lvalue(node);
            result = node->result;
            add_node_to_execution_stack(node);
            add_memory_use(node->pointer, node->execution_index);
            break;
        }
        case CODE_KIND_CALL:{
            run_call(node);
            result = node->result;
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            void* real_pointer = (void*)(run_data.memory + run_lvalue(node));
            result = get_result(real_pointer, node->type);
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            struct Code_Node* left = node->dot_operator.left;
            struct Code_Node* right = node->dot_operator.right;
            if (left->type->kind == TYPE_INFO_TAG_ARRAY &&
                right->kind == CODE_KIND_IDENT && strcmp(right->ident.name, "length") == 0) {

                left->is_lhs = node->is_lhs;
                right->is_lhs = node->is_lhs;
                add_node_to_execution_stack(node);
                result = make_literal_uint(run_data.code_nodes, left->type->array.length);
            }
            else {
                size_t pointer = run_lvalue(node);
                void* real_pointer = get_memory(pointer, node->type->size_in_bytes);
                result = get_result(real_pointer, node->type);
                add_node_to_execution_stack(node);
                add_memory_use(pointer, node->execution_index);
            }
            break;
        }
        case CODE_KIND_REFERENCE:{
            // @Audit
            // No idea why I made this restriction
            // maybe it's not necessary anymore
            if (false && node->reference.expression->kind != CODE_KIND_IDENT) {
                printf("references can only be done on idents for now\n");
                abort();
            }
            add_node_to_execution_stack(node);
            add_node_to_execution_stack(node->reference.expression);
            result = make_literal_uint(run_data.code_nodes, run_lvalue(node->reference.expression));
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            add_node_to_execution_stack(node);
            node->dereference.expression->is_lhs = node->is_lhs;
            struct Code_Node* loc = run_rvalue(node->dereference.expression);
            size_t pointer = loc->literal_uint.value;
            void* value = get_memory(pointer, node->type->size_in_bytes);
            add_memory_use(pointer, node->execution_index);
            result = get_result(value, node->type);
            break;
        }
        case CODE_KIND_PARENS:{
            result = run_rvalue(node->parens.expression);
            break;
        }
        default:{
            result = make_literal_uint(run_data.code_nodes, run_lvalue(node));
            break;
        }
    }

    node->result = result;
    fill_result_str(result);

    return result;
}
void run_start_block(struct Code_Node* node) {
    node->block.allocations = malloc(sizeof(struct Code_Node_Array));
    array_init(node->block.allocations, sizeof(struct Code_Node*), 10);
    node->block.extras = malloc(sizeof(struct Extras));
    if (node->block.statements->length == 0) {
        array_init(node->block.extras, sizeof(struct Code_Node_Array), 10);
    }
    else {
        array_init(node->block.extras, sizeof(struct Code_Node_Array), node->block.statements->length);
    }
}
void run_end_block(struct Code_Node* node) {
    for (size_t i = 0; i < node->block.allocations->length; i += 1) {
        struct Code_Node* decl = node->block.allocations->first[i];
        run_data.stack_pointer -= decl->declaration.type->size_in_bytes + decl->declaration.alignment_pad;
    }
}
struct Code_Node* run_statement(struct Code_Node* node) {
    // printf("run_statement: (%s)\n", code_kind_to_string(node->kind));
    if (node->was_run) {
        return node;
    }
    node->was_run = true;
    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            struct Code_Node* prev_last_block = run_data.last_block;
            run_data.last_block = node;
            run_start_block(node);
            size_t prev_length = node->block.statements->length;
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                struct Code_Node_Array* extras = malloc(sizeof(struct Code_Node_Array));
                array_init(extras, sizeof(struct Code_Node*), 2);
                array_push(node->block.extras, extras);
                run_data.statement_index = i;
                run_statement(node->block.statements->first[i]);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && 
                     (run_data.last_loop->broken || run_data.last_loop->continued))) {

                    break;
                }
            }
            run_end_block(node);
            run_data.last_block = prev_last_block;
            break;
        }
        case CODE_KIND_DECLARATION:{
            // guarantee unique variable names
            char* ident_name = node->declaration.ident->ident.name;
            char* new_ident_name = ident_name;
            size_t uses = get_name_uses(ident_name) + 1;
            if (uses > 1) {
                int chars_needed = snprintf(NULL, 0, "%s_%zu", ident_name, uses) + 1;
                new_ident_name = malloc(sizeof(char) * chars_needed);
                int more_chars_needed = snprintf(new_ident_name, chars_needed, "%s_%zu", ident_name, uses);
                node->declaration.ident->ident.name = new_ident_name;
            }
            if (run_data.count_uses) {
                add_name_use(ident_name);
                ident_name = new_ident_name;
            }
            struct Type_Info* type = node->declaration.type;
            if (type == NULL) {
                printf("decl type was null! ident: \"%s\"", ident_name);
                break;
            }
            struct Code_Node* expression = node->declaration.expression;
            if (expression != NULL) {
                if (expression->kind == CODE_KIND_PROCEDURE) {
                    break;
                }
                if (expression->kind == CODE_KIND_STRUCT) {
                    // @Incomplete
                    // We should make initializers instead of using memory
                    run_data.count_uses = false;
                    run_statement(expression->struct_.block);
                    run_data.count_uses = true;
                    if (type->kind == TYPE_INFO_TAG_IDENT) {
                        type->ident.name = ident_name;
                    }
                    else {
                        printf("struct declaration type was not an ident type!\n");
                    }
                    break;
                }
            }
            if (type->kind == TYPE_INFO_TAG_IDENT) {
                type = type->ident.type;
            }
            add_node_to_execution_stack(node->declaration.ident);
            if (type->kind == TYPE_INFO_TAG_VOID) {
                break;
            }
            size_t align = 0;
            size_t max_align = 4;
            if (type->kind == TYPE_INFO_TAG_STRUCT) {
                align = max_align;
            }
            else if (type->kind == TYPE_INFO_TAG_ARRAY) {
                align = max_align;
            }
            else {
                align = type->size_in_bytes;
            }
            if (align == 0) {
                printf("alignment is zero!\n");
                abort();
            }
            size_t alignment_pad = (align - (run_data.stack_pointer % align)) % align;
            size_t pointer = run_data.stack_pointer + alignment_pad;
            node->declaration.pointer = pointer;
            node->declaration.ident->pointer = pointer;
            node->declaration.alignment_pad = alignment_pad;
            // fake, but useful for moving between returns and their declarations
            // @Incomplete
            // doesn't work for void pointers, because they have no memory location
            add_memory_change(pointer, node->declaration.ident->execution_index);
            if (type->size_in_bytes == 0) {
                printf("size is 0!\n");
                printf("type: %d\n", type->kind);
                printf("type2: %d\n", type->array.elem_type->kind);
                printf("elem size: %zu\n", type->array.elem_type->ident.type->size_in_bytes);
            }
            run_data.stack_pointer += alignment_pad + type->size_in_bytes;
            array_push(run_data.last_block->block.allocations, &node);
            // printf("decl ptr: %zu\n", node->declaration.pointer);

            if (expression != NULL) {
                run_rvalue(expression);
                expression->result = maybe_cast(node->declaration.ident, expression->result);
                set_memory(node->declaration.pointer, get_result_ptr(expression), type->size_in_bytes);
            }
            break;
        }
        case CODE_KIND_RETURN:{
            transform(node);
            run_statement(node->transformed);
            run_data.last_call->call.returned = true;
            run_data.last_call->result = node->return_.expression->result;
            break;
        }
        case CODE_KIND_IF:{
            run_rvalue(node->if_.condition);
            bool should_run = convert_to_bool(get_result_ptr(node->if_.condition), node->if_.condition->type);
            if (should_run) {
                run_statement(node->if_.expression);
            }
            break;
        }
        case CODE_KIND_ELSE:{
            if (node->else_.if_expr != NULL &&
                node->else_.if_expr->if_.condition->was_run == true &&
                node->else_.if_expr->if_.expression->was_run == false) {

                run_statement(node->else_.expression);
            }
            else {
                node->was_run = false;
            }
            break;
        }
        case CODE_KIND_WHILE:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = node;
            node->transformed = make_block(run_data.code_nodes, NULL);
            node->transformed->block.is_transformed_block = true;
            run_statement(node->transformed);
            struct Code_Node_Array* extras = run_data.last_block->block.extras->first + run_data.statement_index;
            array_push(extras, &(node->transformed));
            struct Code_Node* prev_last_block = run_data.last_block;
            run_data.last_block = node->transformed;
            run_data.statement_index = 0;
            run_start_block(node->transformed);
            bool should_run = true;
            size_t i = 0;
            while (should_run) {
                run_data.last_loop->broken = false;
                run_data.last_loop->continued = false;
                run_data.statement_index = i;
                struct Extras* loop_extras = malloc(sizeof(struct Code_Node_Array));
                array_init(loop_extras, sizeof(struct Code_Node*), 2);
                array_push(node->transformed->block.extras, loop_extras);
                struct Code_Node* condition = clone(node->while_.condition);
                struct Code_Node* expression = clone(node->while_.expression);
                struct Code_Node* if_stmt = make_if(run_data.code_nodes, condition, expression);
                if_stmt->was_run = true;
                run_rvalue(condition);
                should_run = convert_to_bool(get_result_ptr(condition), condition->type);
                if (should_run) {
                    run_statement(expression);
                }
                array_push(node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_data.last_loop->broken)) {

                    break;
                }
                i += 1;
            }
            run_end_block(node->transformed);
            run_data.last_block = prev_last_block;
            run_data.last_loop = prev_last_loop;
            break;
        }
        case CODE_KIND_DO_WHILE:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = node;
            node->transformed = make_block(run_data.code_nodes, NULL);
            node->transformed->block.is_transformed_block = true;
            run_statement(node->transformed);
            struct Code_Node_Array* extras = run_data.last_block->block.extras->first + run_data.statement_index;
            array_push(extras, &(node->transformed));
            struct Code_Node* prev_last_block = run_data.last_block;
            run_data.last_block = node->transformed;
            run_data.statement_index = 0;
            run_start_block(node->transformed);
            bool first = true;
            bool should_run = true;
            size_t i = 0;
            while (should_run) {
                run_data.last_loop->broken = false;
                run_data.last_loop->continued = false;
                run_data.statement_index = i;
                struct Extras* loop_extras = malloc(sizeof(struct Code_Node_Array));
                array_init(loop_extras, sizeof(struct Code_Node*), 2);
                array_push(node->transformed->block.extras, loop_extras);
                struct Code_Node* condition;
                if (first) {
                    first = false;
                    condition = make_literal_bool(run_data.code_nodes, true);
                }
                else {
                    condition = clone(node->do_while_.condition);
                }
                struct Code_Node* expression = clone(node->do_while_.expression);
                struct Code_Node* if_stmt = make_if(run_data.code_nodes, condition, expression);
                if_stmt->was_run = true;
                run_rvalue(condition);
                should_run = convert_to_bool(get_result_ptr(condition), condition->type);
                if (should_run) {
                    run_statement(expression);
                }
                array_push(node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_data.last_loop->broken)) {

                    break;
                }
                i += 1;
            }
            run_end_block(node->transformed);
            run_data.last_block = prev_last_block;
            run_data.last_loop = prev_last_loop;
            break;
        }
        case CODE_KIND_FOR:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = node;
            node->transformed = make_block(run_data.code_nodes, NULL);
            node->transformed->block.is_transformed_block = true;
            struct Code_Node_Array* extras = run_data.last_block->block.extras->first + run_data.statement_index;
            array_push(extras, &(node->transformed));
            struct Code_Node* prev_last_block = run_data.last_block;
            run_data.last_block = node->transformed;
            run_data.statement_index = 0;
            run_start_block(node->transformed);
            if (node->for_.begin != NULL) {
                struct Code_Node_Array* begin_extras = malloc(sizeof(struct Code_Node_Array));
                array_init(begin_extras, sizeof(struct Code_Node*), 2);
                array_push(node->transformed->block.extras, begin_extras);
                array_push(node->transformed->block.statements, &(node->for_.begin));
                run_statement(node->for_.begin);
                run_data.statement_index += 1;
            }
            if (node->for_.expression->kind != CODE_KIND_BLOCK) {
                struct Code_Node* block = make_block(run_data.code_nodes, NULL);
                array_push(block->block.statements, &(node->for_.expression));
                node->for_.expression = block;
            }
            if (node->for_.cycle_end != NULL) {
                array_push(node->for_.expression->block.statements, &(node->for_.cycle_end));
            }
            bool should_run = true;
            size_t i = 0;
            while (should_run) {
                run_data.last_loop->broken = false;
                run_data.last_loop->continued = false;
                run_data.statement_index = i;
                struct Extras* loop_extras = malloc(sizeof(struct Code_Node_Array));
                array_init(loop_extras, sizeof(struct Code_Node*), 2);
                array_push(node->transformed->block.extras, loop_extras);
                struct Code_Node* condition;
                if (node->for_.condition != NULL) {
                    condition = clone(node->for_.condition);
                }
                else {
                    condition = make_literal_bool(run_data.code_nodes, true);
                }
                struct Code_Node* expression = clone(node->for_.expression);
                struct Code_Node* if_stmt = make_if(run_data.code_nodes, condition, expression);
                if_stmt->was_run = true;
                run_rvalue(condition);
                should_run = convert_to_bool(get_result_ptr(condition), condition->type);
                if (should_run) {
                    run_statement(expression);
                }
                array_push(node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_data.last_loop->broken)) {

                    break;
                }
                i += 1;
            }
            run_end_block(node->transformed);
            run_data.last_block = prev_last_block;
            run_data.last_loop = prev_last_loop;
            break;
        }
        case CODE_KIND_BREAK:{
            if (run_data.last_loop == NULL) {
                printf("trying to break out of a non-existant loop!\n");
                abort();
                break;
            }
            run_data.last_loop->broken = true;
            add_node_to_execution_stack(node);
            break;
        }
        case CODE_KIND_CONTINUE:{
            if (run_data.last_loop == NULL) {
                printf("trying to continue a non-existant loop!\n");
                abort();
                break;
            }
            run_data.last_loop->continued = true;
            add_node_to_execution_stack(node);
            break;
        }
        default:{
            run_rvalue(node);
            break;
        }
    }

    return node;
}

struct Code_Node* map_original_to_clone(struct Code_Node* original) {
    for (size_t i = 0; i < run_data.original_to_clone->length; i += 1) {
        if (run_data.original_to_clone->originals[i] == original) {
            return run_data.original_to_clone->clones[i];
        }
    }
    return NULL;
}
// returns true if replace, false if add
bool add_or_replace_original_to_clone(struct Code_Node* original, struct Code_Node* cloned) {
    for (size_t i = 0; i < run_data.original_to_clone->length; i += 1) {
        if (run_data.original_to_clone->originals[i] == original) {
            run_data.original_to_clone->clones[i] = cloned;
            return true;
        }
    }
    soa_push(run_data.original_to_clone, original, cloned);
    return false;
}

struct Code_Node* clone(struct Code_Node* node) {
    // printf("clone: (%s)\n", code_kind_to_string(node->kind));
    struct Code_Node* cloned = NULL;
    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            cloned = make_block(run_data.code_nodes, NULL);
            cloned->block.is_transformed_block = node->block.is_transformed_block;
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                struct Code_Node* cloned_stmt = clone(node->block.statements->first[i]);
                array_push(cloned->block.statements, &cloned_stmt);
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            cloned = make_procedure(run_data.code_nodes, NULL, node->procedure.has_varargs, node->procedure.return_type, NULL);
            run_data.count_uses = false;
            for (size_t i = 0; i < node->procedure.params->length; i += 1) {
                struct Code_Node* cloned_param = clone(node->procedure.params->first[i]);
                array_push(cloned->procedure.params, &cloned_param);
            }
            run_data.count_uses = true;
            break;
        }
        case CODE_KIND_CALL:{
            cloned = make_call(run_data.code_nodes, node->call.ident, NULL);
            for (size_t i = 0; i < node->call.args->length; i += 1) {
                struct Code_Node* cloned_arg = clone(node->call.args->first[i]);
                array_push(cloned->call.args, &cloned_arg);
            }
            break;
        }
        case CODE_KIND_DECLARATION:{
            if (node->declaration.expression != NULL &&
                node->declaration.expression->kind == CODE_KIND_PROCEDURE) {

                return node;
            }
            struct Code_Node* expression = NULL;
            if (node->declaration.expression != NULL) {
                expression = clone(node->declaration.expression);
            }
            cloned = make_declaration(run_data.code_nodes, node->declaration.type, clone(node->declaration.ident), expression);
            cloned->declaration.ident->ident.declaration = cloned;

            add_or_replace_original_to_clone(node, cloned);
            break;
        }
        case CODE_KIND_IDENT:{
            cloned = make_ident(run_data.code_nodes, node->ident.name, node->ident.declaration);
            struct Code_Node* cloned_decl = map_original_to_clone(node->ident.declaration);
            if (cloned_decl != NULL) {
                cloned->ident.declaration = cloned_decl;
            }
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            cloned = make_array_index(run_data.code_nodes, clone(node->array_index.array), clone(node->array_index.index));
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            cloned = make_dot_operator(run_data.code_nodes, clone(node->dot_operator.left), clone(node->dot_operator.right));
            break;
        }
        case CODE_KIND_IF:{
            cloned = make_if(run_data.code_nodes, clone(node->if_.condition), clone(node->if_.expression));
            add_or_replace_original_to_clone(node, cloned);
            break;
        }
        case CODE_KIND_ELSE:{
            cloned = make_else(run_data.code_nodes, clone(node->else_.expression));
            cloned->else_.if_expr = map_original_to_clone(node->else_.if_expr);
            break;
        }
        case CODE_KIND_WHILE:{
            cloned = make_while(run_data.code_nodes, clone(node->while_.condition), clone(node->while_.expression));
            break;
        }
        case CODE_KIND_DO_WHILE:{
            cloned = make_do_while(run_data.code_nodes, clone(node->do_while_.condition), clone(node->do_while_.expression));
            break;
        }
        case CODE_KIND_FOR:{
            struct Code_Node* begin = NULL;
            struct Code_Node* condition = NULL;
            struct Code_Node* cycle_end = NULL;
            if (node->for_.begin != NULL) {
                begin = clone(node->for_.begin);
            }
            if (node->for_.condition != NULL) {
                condition = clone(node->for_.condition);
            }
            if (node->for_.cycle_end != NULL) {
                cycle_end = clone(node->for_.cycle_end);
            }
            cloned = make_for(run_data.code_nodes, begin, condition, cycle_end, clone(node->for_.expression));
            break;
        }
        case CODE_KIND_BREAK:{
            cloned = make_break(run_data.code_nodes);
            break;
        }
        case CODE_KIND_CONTINUE:{
            cloned = make_continue(run_data.code_nodes);
            break;
        }
        case CODE_KIND_RETURN:{
            cloned = make_return(run_data.code_nodes, clone(node->return_.expression), node->return_.ident);
            break;
        }
        case CODE_KIND_INCREMENT:{
            cloned = make_increment(run_data.code_nodes, clone(node->increment.ident));
            break;
        }
        case CODE_KIND_DECREMENT:{
            cloned = make_decrement(run_data.code_nodes, clone(node->decrement.ident));
            break;
        }
        case CODE_KIND_ASSIGN:{
            cloned = make_assign(run_data.code_nodes, clone(node->assign.ident), clone(node->assign.expression));
            break;
        }
        case CODE_KIND_OPASSIGN:{
            cloned = make_opassign(run_data.code_nodes, clone(node->opassign.ident), node->opassign.operation_type, clone(node->opassign.expression));
            break;
        }
        case CODE_KIND_PARENS:{
            cloned = make_parens(run_data.code_nodes, clone(node->parens.expression));
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            cloned = make_binary_operation(run_data.code_nodes, clone(node->binary_operation.left), node->binary_operation.operation_type, clone(node->binary_operation.right));
            break;
        }
        case CODE_KIND_REFERENCE:{
            cloned = make_reference(run_data.code_nodes, clone(node->reference.expression));
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            cloned = make_dereference(run_data.code_nodes, clone(node->dereference.expression));
            break;
        }
        case CODE_KIND_MINUS:{
            break;
        }
        case CODE_KIND_NOT:{
            break;
        }
        case CODE_KIND_STRUCT:{
            run_data.count_uses = false;
            struct Code_Node* cloned_block = clone(node->struct_.block);
            run_data.count_uses = true;
            cloned = make_struct(run_data.code_nodes, cloned_block);
            break;
        }
        case CODE_KIND_LITERAL_INT:{
            cloned = make_literal_int(run_data.code_nodes, node->literal_int.value);
            cloned->str = node->str;
            break;
        }
        case CODE_KIND_LITERAL_UINT:{
            cloned = make_literal_uint(run_data.code_nodes, node->literal_uint.value);
            cloned->str = node->str;
            break;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            cloned = make_literal_float(run_data.code_nodes, node->literal_float.value);
            cloned->str = node->str;
            break;
        }
        case CODE_KIND_LITERAL_BOOL:{
            cloned = make_literal_bool(run_data.code_nodes, node->literal_bool.value);
            cloned->str = node->str;
            break;
        }
        case CODE_KIND_STRING:{
            cloned = make_string(run_data.code_nodes, node->string_.pointer);
            break;
        }
        default:{
            printf("cloning not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }

    cloned->type = node->type;
    cloned->original = node;

    return cloned;
}

void transform(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_CALL:{
            struct Code_Node* proc = node->call.ident->ident.declaration->declaration.expression;
            if (proc->transformed == NULL) {
                proc->transformed = make_block(run_data.code_nodes, NULL);
                proc->transformed->block.is_transformed_block = true;
                char* proc_name = node->call.ident->ident.name;
                size_t proc_name_length = strlen(proc_name);
                char* return_ident_name = malloc(sizeof(char) * (8 + proc_name_length));
                memcpy(return_ident_name, "return_", sizeof(char) * 7);
                memcpy(return_ident_name + 7 * sizeof(char), proc_name, sizeof(char) * proc_name_length);
                return_ident_name[7 + proc_name_length] = '\0';
                struct Code_Node* return_ident = make_ident(run_data.code_nodes, return_ident_name, NULL);
                proc->procedure.return_ident = return_ident;
                struct Code_Node* return_decl = make_declaration(run_data.code_nodes, proc->procedure.return_type, return_ident, NULL);
                array_push(proc->transformed->block.statements, &return_decl);

                for (size_t i = 0; i < proc->procedure.params->length; i += 1) {
                    struct Code_Node* param = proc->procedure.params->first[i];
                    array_push(proc->transformed->block.statements, &param);
                }
                for (size_t i = 0; i < proc->procedure.block->block.statements->length; i += 1) {
                    struct Code_Node* stmt = proc->procedure.block->block.statements->first[i];
                    array_push(proc->transformed->block.statements, &stmt);
                }
            }

            node->transformed = clone(proc->transformed);
            node->transformed->block.transformed_from = node;
            struct Code_Node* return_decl = node->transformed->block.statements->first[0];
            node->call.return_ident = return_decl->declaration.ident;

            for (size_t i = 0; i < proc->procedure.params->length; i += 1) {
                struct Code_Node* param = node->transformed->block.statements->first[i + 1];
                struct Code_Node* arg = node->call.args->first[i];
                param->declaration.expression = arg;
            }

            break;
        }
        case CODE_KIND_RETURN:{
            struct Code_Node* return_ident = run_data.last_call->call.return_ident;
            node->return_.ident->ident.name = return_ident->ident.name;
            node->return_.ident->ident.declaration = return_ident->ident.declaration;
            node->return_.ident->type = return_ident->type;
            if (return_ident->type == Native_Type_Void) {
                node->transformed = clone(node->return_.ident);
            }
            else {
                node->transformed = make_assign(run_data.code_nodes, clone(node->return_.ident), node->return_.expression);
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            break;
        }
        default:{
            printf("transform not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            break;
        }
    }
}