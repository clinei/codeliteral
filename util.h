#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <emscripten.h>
#include <emscripten/html5.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>

GLuint compile_shader(GLenum type, const char* source);
GLuint create_program(const char* vertex_shader_filename, const char* fragment_shader_filename);
char* read_file(const char* filename);

typedef unsigned char bool;
#define false 0
#define true 1

typedef unsigned int uint;