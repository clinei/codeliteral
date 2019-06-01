#include "bytecode.h"

char* bytecode_kind_to_string(enum Bytecode_Kind kind) {
    switch (kind) {
        case BYTECODE_KIND_ADD:{
            return "add";
        }
        case BYTECODE_KIND_MOVE:{
            return "move";
        }
        case BYTECODE_KIND_SHIFT_LEFT:{
            return "shift left";
        }
        case BYTECODE_KIND_SHIFT_RIGHT:{
            return "shift right";
        }
    }
    return NULL;
}

// @Cleanup
// unused
u8 map_node_to_addressing_mode(struct Code_Node* node) {
    switch (node->kind) {
        case CODE_KIND_CALL:{
            // register
            return 1;
        }
        case CODE_KIND_IDENT:{
            // memory
            return 2;
        }
        case CODE_KIND_LITERAL_INT:
        case CODE_KIND_LITERAL_UINT:{
            // value
            return 3;
        }
        default:{
            abort();
        }
    }
}
u8 get_instruction_addressing_mode(struct Bytecode_Place left, struct Bytecode_Place right) {
    if (left.mode == ADDRESSING_MODE_REGISTER && right.mode == ADDRESSING_MODE_REGISTER) {
        return ADDRESSING_MODE_REGISTER;
    }
    else if (left.mode == ADDRESSING_MODE_REGISTER && right.mode == ADDRESSING_MODE_MEMORY) {
        return ADDRESSING_MODE_MEMORY;
    }
    else if (left.mode == ADDRESSING_MODE_REGISTER && right.mode == ADDRESSING_MODE_IMMEDIATE) {
        return ADDRESSING_MODE_IMMEDIATE;
    }
    else {
        abort();
    }
}

void push_u8(struct Bytecode_Array* array, u8* ptr) {
    array_push(array, ptr);
}
void push_u16(struct Bytecode_Array* array, u8* ptr) {
    array_push(array, ptr);
    ptr += 1;
    array_push(array, ptr);
}
void push_u32(struct Bytecode_Array* array, u8* ptr) {
    array_push(array, ptr);
    ptr += 1;
    array_push(array, ptr);
    ptr += 1;
    array_push(array, ptr);
    ptr += 1;
    array_push(array, ptr);
}
void push(struct Bytecode_Array* array, u8* ptr, size_t size) {
    if (size == 1) {
        push_u8(array, ptr);
    }
    else if (size == 2) {
        push_u16(array, ptr);
    }
    else if (size == 4) {
        push_u32(array, ptr);
    }
    else {
        abort();
    }
}

struct Bytecode_Place ast_to_bytecode(struct Code_Node* node, struct Bytecode_Array* out_array) {
    printf("ast_to_bytecode: (%s)\n", code_kind_to_string(node->kind));
    switch (node->kind) {
        case CODE_KIND_BINARY_OPERATION:{
            // @Incomplete
            // :OperationTypeStringToEnum
            if (strcmp(node->binary_operation.operation_type, "+") == 0) {
                struct Bytecode_Place left = ast_to_bytecode(node->binary_operation.left, out_array);
                if (left.mode == ADDRESSING_MODE_IMMEDIATE) {
                    printf("left was not a register\n");
                    u8 opcode = BYTECODE_KIND_MOVE;
                    u8 mode = ADDRESSING_MODE_IMMEDIATE;
                    u8 reg = REGISTER_EAX;
                    push_u8(out_array, &opcode);
                    push_u8(out_array, &mode);
                    push_u8(out_array, &left.size);
                    push_u8(out_array, &reg);
                    push(out_array, &left.value, left.size);
                    left.mode = ADDRESSING_MODE_REGISTER;
                    left.value = reg;
                }
                struct Bytecode_Place right = ast_to_bytecode(node->binary_operation.right, out_array);
                if (right.size > left.size) {
                    printf("padding with zeroes\n");
                    u8 opcode = BYTECODE_KIND_SHIFT_LEFT;
                    array_push(out_array, &opcode);
                    u8 shift_count = right.size - left.size;
                    array_push(out_array, &shift_count);
                    opcode = BYTECODE_KIND_SHIFT_RIGHT;
                    array_push(out_array, &opcode);
                    array_push(out_array, &shift_count);
                    left.size = right.size;
                }
                else if (left.size > right.size) {
                    // wat do?
                    abort();
                }
                u8 opcode = BYTECODE_KIND_ADD;
                array_push(out_array, &opcode);
                u8 mode = get_instruction_addressing_mode(left, right);
                array_push(out_array, &mode);
                array_push(out_array, &left.size);
                array_push(out_array, &left.value);
                push(out_array, &right.value, right.size);
                return left;
            }
            else {
                abort();
            }
        }
        case CODE_KIND_LITERAL_INT:{
            struct Bytecode_Place place;
            place.mode = ADDRESSING_MODE_IMMEDIATE;
            place.size = 4;
            place.value = node->literal_int.value;
            return place;
        }
        case CODE_KIND_LITERAL_UINT:{
            struct Bytecode_Place place;
            place.mode = ADDRESSING_MODE_IMMEDIATE;
            place.size = 4;
            place.value = node->literal_uint.value;
            return place;
        }
        default:{
            abort();
        }
    }
}

void run_bytecode(struct Bytecode_Array* array, struct Virtual_Machine* vm) {
    for (size_t i = 0; i < array->length; i += 1) {
        printf("%zu / %zu\n", i, array->length);
        enum Bytecode_Kind kind = array->first[i];
        printf("run_bytecode: (%s)\n", bytecode_kind_to_string(kind));
        switch (kind) {
            case BYTECODE_KIND_ADD:{
                u8 mode = array->first[i + 1];
                u8 size = array->first[i + 2];
                i += 3;
                // @Robustness
                // we assume that the result is always a register
                u8 result_index = array->first[i];
                u8* result_ptr = &vm->register_eax + result_index;
                u8* operand_ptr = 0;
                switch (mode) {
                    case ADDRESSING_MODE_REGISTER:{
                        u8 operand_index = array->first[i + 1];
                        operand_ptr = &vm->register_eax + operand_index;
                        break;
                    }
                    case ADDRESSING_MODE_IMMEDIATE:{
                        // :here
                        operand_ptr = array->first + i + 1;
                        break;
                    }
                    default:{
                        printf("addressing mode (%u) not implemented for bytecode kind (%s)\n", mode, bytecode_kind_to_string(kind));
                        abort();
                    }
                }
                switch (size) {
                    case 1:{
                        u8 operand = *(u8*)operand_ptr;
                        u8 result = *(u8*)result_ptr;
                        result += operand;
                        memcpy(result_ptr, &result, size);
                        break;
                    }
                    case 2:{
                        u16 operand = *(u16*)operand_ptr;
                        u16 result = *(u16*)result_ptr;
                        result += operand;
                        memcpy(result_ptr, &result, size);
                        break;
                    }
                    case 4:{
                        u32 operand = *(u32*)operand_ptr;
                        u32 result = *(u32*)result_ptr;
                        result += operand;
                        memcpy(result_ptr, &result, size);
                        break;
                    }
                }
                if (mode == ADDRESSING_MODE_REGISTER) {
                    i += 1;
                }
                else {
                    i += size;
                }
                break;
            }
            case BYTECODE_KIND_MOVE:{
                // @Copypaste
                // @Copypaste
                // @Copypaste
                u8 mode = array->first[i + 1];
                u8 size = array->first[i + 2];
                i += 3;
                // @Robustness
                // we assume that the result is always a register
                u8 result_index = array->first[i];
                u8* result_ptr = &vm->register_eax + result_index;
                u8* operand_ptr = 0;
                switch (mode) {
                    case ADDRESSING_MODE_REGISTER:{
                        u8 operand_index = array->first[i + 1];
                        operand_ptr = &vm->register_eax + operand_index;
                        break;
                    }
                    case ADDRESSING_MODE_IMMEDIATE:{
                        operand_ptr = array->first + i + 1;
                        break;
                    }
                    default:{
                        printf("addressing mode (%u) not implemented for bytecode kind (%s)\n", mode, bytecode_kind_to_string(kind));
                        abort();
                    }
                }
                memcpy(result_ptr, operand_ptr, size);
                if (mode == ADDRESSING_MODE_REGISTER) {
                    i += 1;
                }
                else {
                    i += size;
                }
                break;
            }
        }
    }
}