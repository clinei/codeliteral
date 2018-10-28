#include "debug.h"

void* debug_ptr;

void set_debug_ptr(void* ptr) {
    debug_ptr = ptr;
}
void* get_debug_ptr() {
    return debug_ptr;
}