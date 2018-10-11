#include "debug.h"

void* gets_corrupted;

void set_gets_corrupted(void* ptr) {
    gets_corrupted = ptr;
}
void* get_gets_corrupted() {
    return gets_corrupted;
}