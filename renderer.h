#pragma once

#include <memory.h>
#include <math.h>

#include <emscripten.h>
#include <emscripten/html5.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>

#include "parser.h"
#include "run.h"
#include "debugger.h"
#include "stb_truetype.h"

EMSCRIPTEN_WEBGL_CONTEXT_HANDLE debugger_context;

struct Render_Data {
    struct Atlas* font_atlas;
    float width;
    float height;
    float xpos;
    float ypos;
    float line_height;
    size_t indent_level;

    size_t coords_length;
    size_t coords_capacity;
    GLfloat* coords;
    GLfloat* fg_coords;
    size_t indices_length;
    size_t indices_capacity;
    GLuint* indices;

    GLfloat* fg_color;
    GLfloat* bg_color;
    GLfloat* cursor_color;

    size_t bg_coords_length;
    size_t bg_coords_capacity;
    GLfloat* bg_coords;
    GLfloat* bg_colors;

    float mark_start_xpos;
    float mark_start_ypos;
    size_t block_depth;
};
struct Render_Data my_render_data;

struct Quad_Program {
    GLuint program_id;
    GLuint coord_buffer_id;
    GLuint color_buffer_id;
    GLuint index_buffer_id;
    GLint attrib_coord_loc;
    GLint attrib_color_loc;
};
struct Quad_Program quad_program;

struct Atlas_Program {
    GLuint program_id;
    GLuint coord_buffer_id;
    GLuint fg_coord_buffer_id;
    GLuint index_buffer_id;
    GLint attrib_coord_loc;
    GLint attrib_fg_coord_loc;
    GLint uniform_tex_loc;
};
struct Atlas_Program atlas_program;

struct Atlas {
    GLuint tex;

    uint width;
    uint height;
    float scale;
    float font_size;
    float char_width;

    size_t char_count;
    stbtt_fontinfo font_info;
    stbtt_bakedchar* chars;
};

void init_renderer();
void init_gl();
void init_quad_program();
void init_atlas_program();
void init_atlas(struct Atlas* atlas, char* font_filename, float font_size, float scale, size_t char_count);
void init_hilite();

void render(struct Code_Node* node);
void render_node(struct Code_Node* node,
                 struct Render_Data* render_data);
void render_text(char* text, float* xpos, float* ypos,
                 GLfloat* fg_color,
                 GLfloat* bg_color,
                 struct Render_Data* render_data);
void render_type(struct Type_Info* type,
                 struct Render_Data* render_data);
void render_indent(struct Render_Data* render_data);
void render_space(struct Render_Data* render_data);
void render_newline(struct Render_Data* render_data);

void mark_background_start(struct Render_Data* render_data, GLfloat* bg_color);
void mark_background_end(struct Render_Data* render_data);

void convert_screen_coords_to_view_coords(float x, float y,
                                          float width, float height,
                                          float* out_x, float* out_y);
void get_baked_quad_scaled(const stbtt_bakedchar *chardata,
                           int pw, int ph,
                           int char_index,
                           float *xpos, float *ypos,
                           float scale,
                           stbtt_aligned_quad *q,
                           int opengl_fillrule);