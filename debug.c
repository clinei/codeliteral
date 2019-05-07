#include "debug.h"

void* debug_ptr;
int debug_num;

void set_debug_ptr(void* ptr) {
    debug_ptr = ptr;
}
void* get_debug_ptr() {
    return debug_ptr;
}
void set_debug(int num) {
    debug_num = num;
}
int get_debug() {
    return debug_num;
}