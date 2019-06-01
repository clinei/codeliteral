#pragma once

#include "parser.h"
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

enum Bytecode_Kind {
    BYTECODE_KIND_ADD,
    BYTECODE_KIND_MOVE,
    BYTECODE_KIND_SHIFT_LEFT,
    BYTECODE_KIND_SHIFT_RIGHT,
};

char* bytecode_kind_to_string(enum Bytecode_Kind kind);

enum Addressing_Mode {
    ADDRESSING_MODE_NONE,
    ADDRESSING_MODE_REGISTER,
    ADDRESSING_MODE_MEMORY,
    ADDRESSING_MODE_IMMEDIATE
};

enum Register {
    REGISTER_EAX,
    REGISTER_EBX,
    REGISTER_ECX,
    REGISTER_EDX,
    REGISTER_ESP,
    REGISTER_EBP,
    REGISTER_ESI,
    REGISTER_EDI
};

struct Bytecode_Place {
    u8 mode;
    u8 size;
    u32 value;
};

struct Bytecode_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    u8* first;
    u8* last;
};

struct Virtual_Machine {
    u32 register_eax;
    u32 register_ebx;
    u32 register_ecx;
    u32 register_edx;
    u32 register_esp;
    u32 register_ebp;
    u32 register_esi;
    u32 register_edi;
    u8* memory;
    size_t memory_size;
};

struct Bytecode_Place ast_to_bytecode(struct Code_Node* node, struct Bytecode_Array* out_array);

void run_bytecode(struct Bytecode_Array* array, struct Virtual_Machine* vm);