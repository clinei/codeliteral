#include "run.h"

void init_run(struct Code_Nodes* code_nodes) {
    run_data.code_nodes = code_nodes;

    run_data.did_run = false;
    run_data.last_block = NULL;
    run_data.last_call = NULL;
    run_data.last_loop = NULL;

    run_data.execution_stack = malloc(sizeof(struct Code_Node_Array));
    array_init((struct Dynamic_Array*)run_data.execution_stack, sizeof(struct Code_Node*), 10);

    run_data.original_to_clone = malloc(sizeof(struct Original_To_Clone_Map_SOA));
    soa_init((struct Dynamic_SOA*)run_data.original_to_clone, 100, 2, sizeof(struct Code_Node*), sizeof(struct Code_Node*));

    run_data.count_uses = true;
    run_data.name_uses = malloc(sizeof(struct Name_Uses_Map_SOA));
    soa_init((struct Dynamic_SOA*)run_data.name_uses, 100, 2, sizeof(char*), sizeof(size_t));

    run_data.memory_size = 1000;
    run_data.memory = malloc(run_data.memory_size);
    run_data.stack_pointer = 0;
}

void* get_memory(size_t offset, size_t num_bytes) {
    if (offset + num_bytes > run_data.memory_size) {
        printf("invalid attempt to get_memory at address %zu until %zu (max address is %zu)\n", offset, offset + num_bytes, run_data.memory_size);
        abort();
        return NULL;
    }
    return run_data.memory + offset;
}
void set_memory(size_t offset, void* data, size_t num_bytes) {
    if (offset + num_bytes > run_data.memory_size) {
        run_data.memory_size *= 2;
        run_data.memory = realloc(run_data.memory, run_data.memory_size);
    }
    memcpy(run_data.memory + offset, data, num_bytes);
}

void add_node_to_execution_stack(struct Code_Node* node) {
    node->is_on_execution_stack = true;
    node->execution_index = run_data.execution_stack->length;
    array_push((struct Dynamic_Array*)run_data.execution_stack, &node);
}

void add_name_use(char* name) {
    for (size_t i = 0; i < run_data.name_uses->length; i += 1) {
        if (strcmp(run_data.name_uses->names[i], name) == 0) {
            run_data.name_uses->uses[i] += 1;
            return;
        }
    }
    soa_push((struct Dynamic_SOA*)run_data.name_uses, name, 1);
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
    char type = 0;
    if (left->type != Native_Type_Bool) {
        if (left->type->ident.type->kind == TYPE_INFO_TAG_FLOAT) {
            type = 3;
        }
        else {
            type = 2;
        }
    }
    else {
        type = 1;
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
        int left_value = left->literal_int.value;
        int right_value = right->literal_int.value;
        int result;
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
        // float
        float left_value = left->literal_float.value;
        float right_value = right->literal_float.value;
        float result;
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
    else {
        abort();
        return NULL;
    }
}

struct Code_Node* math_solve(struct Code_Node* node) {
    struct Code_Node* result = NULL;
    switch (node->kind) {
        case CODE_KIND_BINARY_OPERATION:{
            struct Code_Node* left_result = run_rvalue(node->binary_operation.left);
            struct Code_Node* right_result = run_rvalue(node->binary_operation.right);
            result = math_binop(left_result, node->binary_operation.operation_type, right_result);
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
        case CODE_KIND_LITERAL_FLOAT:{
            return &(node->result->literal_float.value);
            break;
        }
        case CODE_KIND_LITERAL_BOOL:{
            return &(node->result->literal_bool.value);
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
        case CODE_KIND_LITERAL_INT:{
            int value = node->literal_int.value;
            int chars_needed = snprintf(NULL, 0, "%d", value) + 1;
            char* str = malloc(sizeof(char) * chars_needed);
            snprintf(str, chars_needed, "%d", value);
            node->str = str;
            break;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            float value = node->literal_float.value;
            int chars_needed = 20;
            char* str = malloc(sizeof(char) * chars_needed);
            snprintf(str, chars_needed, "%.19f", value);
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
            // we don't account for size
            if (type == Native_Type_Bool->ident.type) {
                return *(bool*)value;
            }
            else {
                return *(int*)value > 0;
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
            // @Incomplete
            // we don't account for size
            if (type == Native_Type_Bool->ident.type) {
                result = make_literal_bool(run_data.code_nodes, *(bool*)value);
            }
            else {
                printf("int ptr: %zu\n", (size_t)value);
                result = make_literal_int(run_data.code_nodes, *(int*)value);
            }
            break;
        }
        case TYPE_INFO_TAG_FLOAT:{
            result = make_literal_float(run_data.code_nodes, *(float*)value);
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
    printf("get_ident\n");
    return get_result(value, node->type);
}
void run_call(struct Code_Node* node) {
    add_node_to_execution_stack(node);
    node->was_run = true;
    struct Code_Node* prev_last_call = run_data.last_call;
    run_data.last_call = node;
    struct Code_Node* proc = node->call.ident->ident.declaration->declaration.expression;
    if (proc->kind == CODE_KIND_NATIVE_CODE) {
        printf("native code\n");
    }
    else if (proc->kind == CODE_KIND_PROCEDURE) {
        transform(node);
        array_push((struct Dynamic_Array*)run_data.last_block->block.extras[run_data.statement_index], &(node->transformed));
        run_statement(node->transformed);
    }
    run_data.last_call = prev_last_call;
    add_node_to_execution_stack(node);
}
size_t run_lvalue(struct Code_Node* node) {
    // printf("run_lvalue: (%s)\n", code_kind_to_string(node->kind));
    node->was_run = true;
    size_t result = 0;
    switch (node->kind) {
        case CODE_KIND_IDENT:{
            add_node_to_execution_stack(node);
            result = node->ident.declaration->declaration.pointer;
            if (node->type->kind != TYPE_INFO_TAG_ARRAY) {
                node->result = get_ident_result(node);
            }
            break;
        }
        case CODE_KIND_ASSIGN:{
            node->assign.ident->is_lhs = true;
            size_t lhs_pointer = run_lvalue(node->assign.ident);
            run_rvalue(node->assign.expression);
            node->result = node->assign.expression->result;
            void* prev_value = get_memory(lhs_pointer, node->assign.ident->type->size_in_bytes);
            if (node->assign.ident->type->kind != TYPE_INFO_TAG_ARRAY) {
                node->assign.ident->result = get_result(prev_value, node->assign.ident->type);
            }
            set_memory(lhs_pointer, get_result_ptr(node), node->assign.ident->type->size_in_bytes);
            break;
        }
        case CODE_KIND_OPASSIGN:{
            size_t lhs_pointer = run_lvalue(node->opassign.ident);
            run_rvalue(node->opassign.expression);
            node->result = math_binop(node->opassign.ident->result, node->opassign.operation_type, node->opassign.expression->result);
            set_memory(lhs_pointer, get_result_ptr(node), node->opassign.ident->type->size_in_bytes);
            break;
        }
        case CODE_KIND_CALL:{
            run_call(node);
            result = *(size_t*)get_result_ptr(node);
            break;
        }
        case CODE_KIND_ARRAY_INDEX: {
            size_t lhs_pointer = run_lvalue(node->array_index.array);
            run_rvalue(node->array_index.index);
            size_t index_result = (size_t)(*(int*)get_result_ptr(node->array_index.index));
            size_t array_length = node->array_index.array->type->array.length;
            if (index_result >= array_length) {
                printf("array index out of bounds! index: (%zu) length: (%zu)\n", index_result, array_length);
                abort();
            }
            result = lhs_pointer + index_result * node->type->size_in_bytes;
            add_node_to_execution_stack(node);
            break;
        }
        default:{
            printf("run_lvalue not implemented for node kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
    return result;
}
struct Code_Node* run_rvalue(struct Code_Node* node) {
    // printf("run_rvalue: (%s)\n", code_kind_to_string(node->kind));
    node->was_run = true;
    struct Code_Node* result = NULL;
    switch (node->kind) {
        case CODE_KIND_LITERAL_BOOL:{
            add_node_to_execution_stack(node);
            node->result = node;
            return node;
        }
        case CODE_KIND_LITERAL_INT:{
            add_node_to_execution_stack(node);
            node->result = node;
            return node;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            add_node_to_execution_stack(node);
            node->result = node;
            return node;
        }
        case CODE_KIND_BINARY_OPERATION:{
            result = math_solve(node);
            add_node_to_execution_stack(node);
            break;
        }
        case CODE_KIND_IDENT:{
            add_node_to_execution_stack(node);
            result = get_ident_result(node);
            break;
        }
        case CODE_KIND_CALL:{
            run_call(node);
            result = node->result;
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            // @@@
            void* real_pointer = (void*)(run_data.memory + run_lvalue(node));
            result = get_result(real_pointer, node->type);
            break;
        }
        default:{
            // @Incomplete
            // need size_t literal
            result = make_literal_int(run_data.code_nodes, (int)run_lvalue(node));
            break;
        }
    }

    node->result = result;
    fill_result_str(result);

    return result;
}
bool run_loop_broken_or_continued(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_WHILE:{
            return node->while_.broken || node->while_.continued;
        }
        case CODE_KIND_DO_WHILE:{
            return node->do_while_.broken || node->do_while_.continued;
        }
        case CODE_KIND_FOR:{
            return node->for_.broken || node->for_.continued;
        }
        default:{
            abort();
            return false;
        }
    }
}
bool run_loop_broken(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_WHILE:{
            return node->while_.broken;
        }
        case CODE_KIND_DO_WHILE:{
            return node->do_while_.broken;
        }
        case CODE_KIND_FOR:{
            return node->for_.broken;
        }
        default:{
            abort();
            return false;
        }
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
            node->block.allocations = malloc(sizeof(struct Code_Node_Array));
            array_init((struct Dynamic_Array*)node->block.allocations, sizeof(struct Code_Node*), 10);
            node->block.extras = malloc(sizeof(struct Code_Node_Array*) * node->block.statements->length);
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                node->block.extras[i] = malloc(sizeof(struct Code_Node_Array));
                array_init((struct Dynamic_Array*)node->block.extras[i], sizeof(struct Code_Node*), 2);
                run_data.statement_index = i;
                run_statement(node->block.statements->first[i]);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_loop_broken_or_continued(run_data.last_loop))) {

                    break;
                }
            }
            for (size_t i = 0; i < node->block.allocations->length; i += 1) {
                struct Code_Node* decl = node->block.allocations->first[i];
                run_data.stack_pointer -= decl->declaration.type->size_in_bytes + decl->declaration.alignment_pad;
            }
            run_data.last_block = prev_last_block;
            break;
        }
        case CODE_KIND_DECLARATION:{
            struct Type_Info* type = node->declaration.type;
            struct Code_Node* expression = node->declaration.expression;
            if (expression != NULL && expression->kind == CODE_KIND_PROCEDURE) {
                break;
            }
            add_node_to_execution_stack(node->declaration.ident);
            if (type && type->kind == TYPE_INFO_TAG_IDENT && type->ident.type->kind != TYPE_INFO_TAG_VOID) {
                size_t align;
                if (type->kind == TYPE_INFO_TAG_ARRAY) {
                    align = type->array.elem_type->size_in_bytes;
                }
                else {
                    align = type->size_in_bytes;
                }
                // size_t alignment_pad = align - ((*(size_t*)run_data.memory + run_data.stack_pointer) % align);
                size_t alignment_pad = ((size_t)run_data.memory + run_data.stack_pointer) % align;
                node->declaration.pointer = run_data.stack_pointer + alignment_pad;
                printf("align pad: %zu\n", alignment_pad);
                printf("mem ptr:   %zu\n", run_data.memory);
                printf("stack ptr: %zu\n", run_data.stack_pointer);
                printf("decl ptr:  %zu\n", node->declaration.pointer);
                if ((size_t)(node->declaration.pointer + run_data.memory) % align) {
                    printf("memory alignment error!\n");
                    abort();
                }
                node->declaration.alignment_pad = alignment_pad;
                run_data.stack_pointer += alignment_pad + type->size_in_bytes;
                array_push((struct Dynamic_Array*)run_data.last_block->block.allocations, &node);

                if (expression != NULL) {
                    run_rvalue(expression);
                    set_memory(node->declaration.pointer, get_result_ptr(expression), node->declaration.type->size_in_bytes);
                }
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
            else {
                size_t maybe_else_index = run_data.statement_index + 1;
                if (maybe_else_index < run_data.last_block->block.statements->length) {
                    struct Code_Node* maybe_else = run_data.last_block->block.statements->first[maybe_else_index];
                    if (maybe_else->kind == CODE_KIND_ELSE) {
                        node->if_.else_expr = maybe_else;
                        maybe_else->else_.if_expr = node;
                        run_statement(maybe_else);
                    }
                }
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
            array_push((struct Dynamic_Array*)run_data.last_block->block.extras[run_data.statement_index], &(node->transformed));
            bool should_run = true;
            while (should_run) {
                struct Code_Node* condition = clone(node->while_.condition);
                struct Code_Node* expression = clone(node->while_.expression);
                struct Code_Node* if_stmt = make_if(run_data.code_nodes, condition, expression);
                if_stmt->was_run = true;
                run_rvalue(condition);
                should_run = convert_to_bool(get_result_ptr(condition), condition->type);
                if (should_run) {
                    run_statement(expression);
                }
                array_push((struct Dynamic_Array*)node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_loop_broken(run_data.last_loop))) {

                    break;
                }
            }
            run_data.last_loop = prev_last_loop;
            break;
        }
        case CODE_KIND_DO_WHILE:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = node;
            node->transformed = make_block(run_data.code_nodes, NULL);
            node->transformed->block.is_transformed_block = true;
            array_push((struct Dynamic_Array*)run_data.last_block->block.extras[run_data.statement_index], &(node->transformed));
            bool first = true;
            bool should_run = true;
            while (should_run) {
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
                array_push((struct Dynamic_Array*)node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_loop_broken(run_data.last_loop))) {

                    break;
                }
            }
            run_data.last_loop = prev_last_loop;
            break;
        }
        case CODE_KIND_FOR:{
            struct Code_Node* prev_last_loop = run_data.last_loop;
            run_data.last_loop = node;
            node->transformed = make_block(run_data.code_nodes, NULL);
            node->transformed->block.is_transformed_block = true;
            array_push((struct Dynamic_Array*)run_data.last_block->block.extras[run_data.statement_index], &(node->transformed));
            run_statement(node->for_.begin);
            array_push((struct Dynamic_Array*)node->transformed->block.statements, &(node->for_.begin));
            if (node->for_.expression->kind != CODE_KIND_BLOCK) {
                struct Code_Node* block = make_block(run_data.code_nodes, NULL);
                array_push((struct Dynamic_Array*)block->block.statements, &(node->for_.expression));
                node->for_.expression = block;
            }
            array_push((struct Dynamic_Array*)node->for_.expression->block.statements, &(node->for_.cycle_end));
            bool should_run = true;
            while (should_run) {
                struct Code_Node* condition = clone(node->for_.condition);
                struct Code_Node* expression = clone(node->for_.expression);
                struct Code_Node* if_stmt = make_if(run_data.code_nodes, condition, expression);
                if_stmt->was_run = true;
                run_rvalue(condition);
                should_run = convert_to_bool(get_result_ptr(condition), condition->type);
                if (should_run) {
                    run_statement(expression);
                }
                array_push((struct Dynamic_Array*)node->transformed->block.statements, &if_stmt);
                if ((run_data.last_call != NULL && run_data.last_call->call.returned) ||
                    (run_data.last_loop != NULL && run_loop_broken(run_data.last_loop))) {

                    break;
                }
            }
            run_data.last_loop = prev_last_loop;
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

struct Code_Node* clone(struct Code_Node* node) {
    struct Code_Node* cloned = NULL;
    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            cloned = make_block(run_data.code_nodes, NULL);
            cloned->block.is_transformed_block = node->block.is_transformed_block;
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                struct Code_Node* cloned_stmt = clone(node->block.statements->first[i]);
                array_push((struct Dynamic_Array*)cloned->block.statements, &cloned_stmt);
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            cloned = make_procedure(run_data.code_nodes, NULL, node->procedure.has_varargs, node->procedure.return_type, NULL);
            run_data.count_uses = false;
            for (size_t i = 0; i < node->procedure.params->length; i += 1) {
                struct Code_Node* cloned_param = clone(node->procedure.params->first[i]);
                array_push((struct Dynamic_Array*)cloned->procedure.params, &cloned_param);
            }
            run_data.count_uses = true;
            break;
        }
        case CODE_KIND_CALL:{
            cloned = make_call(run_data.code_nodes, node->call.ident, NULL);
            for (size_t i = 0; i < node->call.args->length; i += 1) {
                struct Code_Node* cloned_arg = clone(node->call.args->first[i]);
                array_push((struct Dynamic_Array*)cloned->call.args, &cloned_arg);
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
            char* ident_name = node->declaration.ident->ident.name;
            size_t uses = get_name_uses(ident_name);
            if (uses > 0) {
                int chars_needed = snprintf(NULL, 0, "%s_%zu", ident_name, uses) + 1;
                char* new_ident_name = malloc(sizeof(char) * chars_needed);
                int more_chars_needed = snprintf(new_ident_name, chars_needed, "%s_%zu", ident_name, uses);
                cloned->declaration.ident->ident.name = new_ident_name;
            }
            if (run_data.count_uses) {
                add_name_use(ident_name);
            }
            soa_push((struct Dynamic_SOA*)run_data.original_to_clone, node, cloned);
            break;
        }
        case CODE_KIND_IDENT:{
            cloned = make_ident(run_data.code_nodes, node->ident.name, NULL);
            struct Code_Node* cloned_decl = map_original_to_clone(node->ident.declaration);
            if (cloned_decl != NULL) {
                cloned->ident.declaration = cloned_decl;
                cloned->ident.name = cloned_decl->declaration.ident->ident.name;
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
            soa_push((struct Dynamic_SOA*)run_data.original_to_clone, node, cloned);
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
            cloned = make_return(run_data.code_nodes, clone(node->return_.expression));
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
            cloned = make_struct(run_data.code_nodes, clone(node->struct_.block));
            break;
        }
        case CODE_KIND_LITERAL_INT:{
            cloned = make_literal_int(run_data.code_nodes, node->literal_int.value);
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
                array_push((struct Dynamic_Array*)proc->transformed->block.statements, &return_decl);

                for (size_t i = 0; i < proc->procedure.params->length; i += 1) {
                    struct Code_Node* param = proc->procedure.params->first[i];
                    array_push((struct Dynamic_Array*)proc->transformed->block.statements, &param);
                }
                for (size_t i = 0; i < proc->procedure.block->block.statements->length; i += 1) {
                    struct Code_Node* stmt = proc->procedure.block->block.statements->first[i];
                    array_push((struct Dynamic_Array*)proc->transformed->block.statements, &stmt);
                }
            }

            node->transformed = clone(proc->transformed);
            node->transformed->block.transformed_from = node;
            struct Code_Node* return_decl = node->transformed->block.statements->first[0];
            node->call.return_ident = clone(return_decl->declaration.ident);

            for (size_t i = 0; i < proc->procedure.params->length; i += 1) {
                struct Code_Node* param = node->transformed->block.statements->first[i + 1];
                struct Code_Node* arg = node->call.args->first[i];
                param->declaration.expression = arg;
            }

            break;
        }
        case CODE_KIND_RETURN:{
            struct Code_Node* return_ident = run_data.last_call->call.return_ident;
            if (return_ident->type == Native_Type_Void) {
                node->transformed = clone(return_ident);
            }
            else {
                node->transformed = make_assign(run_data.code_nodes, clone(return_ident), node->return_.expression);
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