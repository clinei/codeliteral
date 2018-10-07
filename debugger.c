#include "debugger.h"
#include "util.h"
#include "parser.h"
#include "renderer.h"

bool initialized = false;

char* my_text;
struct Code_Node_Array* my_code_node_array;
struct Code_Node* main_call = NULL;

struct Code_Node* clone(struct Code_Node* node) {
    struct Code_Node* cloned = NULL;
    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            cloned = make_block(my_code_node_array, NULL);
            cloned->block.is_transformed_block = node->block.is_transformed_block;
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                struct Code_Node* cloned_stmt = clone(node->block.statements->first[i]);
                array_push((struct Dynamic_Array*)cloned->block.statements, cloned_stmt);
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            cloned = make_procedure(my_code_node_array, NULL, node->procedure.has_varargs, node->procedure.return_type, NULL);
            for (size_t i = 0; i < node->procedure.params->length; i += 1) {
                struct Code_Node* cloned_param = clone(node->procedure.params->first[i]);
                array_push((struct Dynamic_Array*)cloned->procedure.params, cloned_param);
            }
            break;
        }
        case CODE_KIND_CALL:{
            cloned = make_call(my_code_node_array, clone(node->call.ident), NULL);
            for (size_t i = 0; i < node->call.args->length; i += 1) {
                struct Code_Node* cloned_arg = clone(node->call.args->first[i]);
                array_push((struct Dynamic_Array*)cloned->call.args, cloned_arg);
            }
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            cloned = make_array_index(my_code_node_array, clone(node->array_index.array), clone(node->array_index.index));
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            cloned = make_dot_operator(my_code_node_array, clone(node->dot_operator.left), clone(node->dot_operator.right));
            break;
        }
        case CODE_KIND_IF:{
            cloned = make_if(my_code_node_array, clone(node->if_.condition), clone(node->if_.expression));
            break;
        }
        case CODE_KIND_ELSE:{
            cloned = make_else(my_code_node_array, clone(node->else_.expression));
            break;
        }
        case CODE_KIND_WHILE:{
            cloned = make_while(my_code_node_array, clone(node->while_.condition), clone(node->while_.expression));
            break;
        }
        case CODE_KIND_DO_WHILE:{
            cloned = make_do_while(my_code_node_array, clone(node->do_while_.condition), clone(node->do_while_.expression));
            break;
        }
        case CODE_KIND_FOR:{
            struct Code_Node* begin = NULL;
            struct Code_Node* condition = NULL;
            struct Code_Node* cycle_end = NULL;
            if (node->for_.begin) {
                begin = clone(node->for_.begin);
            }
            if (node->for_.condition) {
                condition = clone(node->for_.condition);
            }
            if (node->for_.cycle_end) {
                cycle_end = clone(node->for_.cycle_end);
            }
            cloned = make_for(my_code_node_array, begin, condition, cycle_end, clone(node->for_.expression));
            break;
        }
        case CODE_KIND_BREAK:{
            cloned = make_break(my_code_node_array);
            break;
        }
        case CODE_KIND_CONTINUE:{
            cloned = make_continue(my_code_node_array);
            break;
        }
        case CODE_KIND_DECLARATION:{
            struct Code_Node* expression = NULL;
            if (node->declaration.expression != NULL) {
                expression = clone(node->declaration.expression);
            }
            cloned = make_declaration(my_code_node_array, node->declaration.type, clone(node->declaration.ident), expression);
            break;
        }
        case CODE_KIND_INCREMENT:{
            cloned = make_increment(my_code_node_array, clone(node->increment.ident));
            break;
        }
        case CODE_KIND_DECREMENT:{
            cloned = make_decrement(my_code_node_array, clone(node->decrement.ident));
            break;
        }
        case CODE_KIND_ASSIGN:{
            cloned = make_assign(my_code_node_array, clone(node->assign.ident), clone(node->assign.expression));
            break;
        }
        case CODE_KIND_OPASSIGN:{
            cloned = make_opassign(my_code_node_array, clone(node->assign.ident), node->opassign.operation_type, clone(node->assign.expression));
            break;
        }
        case CODE_KIND_RETURN:{
            cloned = make_return(my_code_node_array, clone(node->return_.expression));
            break;
        }
        case CODE_KIND_PARENS:{
            cloned = make_parens(my_code_node_array, clone(node->parens.expression));
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            cloned = make_binary_operation(my_code_node_array, clone(node->binary_operation.left), node->binary_operation.operation_type, clone(node->binary_operation.right));
            break;
        }
        case CODE_KIND_REFERENCE:{
            cloned = make_reference(my_code_node_array, clone(node->reference.expression));
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            cloned = make_dereference(my_code_node_array, clone(node->dereference.expression));
            break;
        }
        case CODE_KIND_MINUS:{
            break;
        }
        case CODE_KIND_NOT:{
            break;
        }
        case CODE_KIND_STRUCT:{
            cloned = make_struct(my_code_node_array, clone(node->struct_.block));
            break;
        }
        case CODE_KIND_LITERAL_INT:{
            cloned = make_literal_int(my_code_node_array, node->literal_int.value);
            break;
        }
        case CODE_KIND_LITERAL_FLOAT:{
            cloned = make_literal_float(my_code_node_array, node->literal_float.value);
            break;
        }
        case CODE_KIND_LITERAL_BOOL:{
            cloned = make_literal_bool(my_code_node_array, node->literal_bool.value);
            break;
        }
        case CODE_KIND_STRING:{
            cloned = make_string(my_code_node_array, node->string_.pointer);
            break;
        }
        case CODE_KIND_IDENT:{
            // @Incomplete
            // have to link up cloned idents with their declarations
            cloned = make_ident(my_code_node_array, node->ident.name, NULL);
            break;
        }
        default:{
            printf("cloning not implemented for node kind %zu\n", node->kind);
            break;
        }
    }

    return cloned;
}

void transform(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_CALL:{
            struct Code_Node* proc = node->call.ident->ident.declaration->declaration.expression;
            if (proc->transformed == NULL) {
                proc->transformed = make_block(my_code_node_array, NULL);
                proc->transformed->block.is_transformed_block = true;
                char* proc_name = node->call.ident->ident.name;
                size_t proc_name_length = strlen(proc_name);
                char* return_ident_name = malloc(sizeof(char) * (8 + proc_name_length));
                memcpy(return_ident_name, "return_", sizeof(char) * 7);
                memcpy(return_ident_name + 7 * sizeof(char), proc_name, sizeof(char) * proc_name_length);
                struct Code_Node* return_ident = make_ident(my_code_node_array, return_ident_name, NULL);
                // procedure.transformed.return_ident = return_ident;
                struct Code_Node* return_decl = make_declaration(my_code_node_array, proc->procedure.return_type, return_ident, NULL);
                array_push((struct Dynamic_Array*)proc->transformed->block.statements, return_decl);

                for (size_t i = 0; i < proc->procedure.params->length; i += 1) {
                    struct Code_Node* param = proc->procedure.params->first[i];
                    array_push((struct Dynamic_Array*)proc->transformed->block.statements, param);
                }
                for (size_t i = 0; i < proc->procedure.block->block.statements->length; i += 1) {
                    struct Code_Node* stmt = proc->procedure.block->block.statements->first[i];
                    array_push((struct Dynamic_Array*)proc->transformed->block.statements, stmt);
                }
            }

            node->transformed = clone(proc->transformed);
            // replacement.return_ident = clone(procedure.transformed.return_ident);
            break;
        }
        case CODE_KIND_PROCEDURE:{
            break;
        }
        default:{
            printf("transforming a node of kind %u not implemented!\n", node->kind);
            break;
        }
    }
}

struct Run_Data {
    struct Run_Block_Stack* block_stack;
};
struct Run_Data* run_data;
void run_push_block(struct Code_Node* block) {
    // same as infer
}

void run_statement(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_CALL:{
            struct Code_Node* proc = node->call.ident->ident.declaration->declaration.expression;
            if (proc->kind == CODE_KIND_NATIVE_CODE) {
                printf("native code\n");
            }
            else if (proc->kind == CODE_KIND_PROCEDURE) {
                transform(node);
                // run(node->transformed);
            }
            break;
        }
        /*
        case CODE_KIND_BLOCK:{
            run_push_block();
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                run_statement(node->block.statements->first[i]);
            }
        }
        */
        default:{
            printf("running a node of kind %u not implemented!\n", node->kind);
            abort();
            break;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void step() {
    if (main_call != NULL && main_call->transformed != NULL) {
        render(main_call->transformed);
    }
}

EMSCRIPTEN_KEEPALIVE
void resize(int new_width, int new_height) {
    my_render_data->width = new_width;
    my_render_data->height = new_height;
}

EMSCRIPTEN_KEEPALIVE
void set_text(char* new_text) {
    if (initialized) {
        free(my_text);
    }
    my_text = new_text;
    
    struct Token_Array* token_array = tokenize(my_text);
    
    token_array->curr_token = token_array->first;

    /*
    // print all tokens
    while (token_array->curr_token <= token_array->last) {
        printf("token: %d, %s\n", token_array->curr_token->kind, token_array->curr_token->str);
        token_array->curr_token++;
    }
    */

    struct Code_Node_Array* code_node_array = parse(token_array);

    infer(code_node_array->first);

    /*
    // print all nodes
    code_node_array->curr_node = code_node_array->first;
    while (code_node_array->curr_node <= code_node_array->last) {
        printf("node: %d\n", code_node_array->curr_node->kind);
        code_node_array->curr_node++;
    }
    */
    
    my_code_node_array = code_node_array;

    size_t last_index = code_node_array->first->block.statements->length - 1;
    struct Code_Node* maybe_main_call = code_node_array->first->block.statements->first[last_index];
    if (maybe_main_call->kind == CODE_KIND_CALL) {
        main_call = maybe_main_call;
        run_statement(main_call);
    }
    else {
        printf("last statement is not a call!\n");
    }
}

EMSCRIPTEN_KEEPALIVE
int init(int start_width, int start_height) {

    init_parser();
    init_renderer();

    resize(start_width, start_height);

    emscripten_set_main_loop(&step, 12, 0);

    initialized = true;

    return 1;
}
EMSCRIPTEN_KEEPALIVE
int deinit() {

    emscripten_webgl_destroy_context(debugger_context);
    emscripten_cancel_main_loop();

    initialized = false;

    return 1;
}

int main() {
    return 0;
}