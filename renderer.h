#pragma once

#include <memory.h>
#include <math.h>

#include <emscripten.h>
#include <emscripten/html5.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>

#include "stb_truetype.h"

#include "util.h"
#include "parser.h"
#include "run.h"
#include "interaction.h"

EMSCRIPTEN_WEBGL_CONTEXT_HANDLE debugger_context;

struct Lines_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Code_Node_Array* first;
    struct Code_Node_Array* last;
};
struct Render_Nodes {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Render_Node* first;
    struct Render_Node* last;
};
struct Render_Node_Array {
    size_t length;
    size_t capacity;
    size_t element_size;
    struct Render_Node** first;
    struct Render_Node** last;
};
struct Layout_Data {
    float curr_x;
    float curr_y;
};
struct Render_Data {
    struct Atlas* font_atlas;
    float width;
    float height;

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

    float mark_begin_xpos;
    float mark_begin_ypos;
    size_t indent_level;
    size_t block_depth;

    struct Lines_Array* lines;
    size_t line_index;
    size_t cursor_line;

    struct Layout_Data layout_data;
    struct Render_Nodes* render_nodes;
    struct Render_Node* debugger_root;
    struct Render_Node* cursor_begin;
    
    float offset_x;
    float offset_y;
    float line_height;
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

struct Render_Text {
    char* text;
    GLfloat* color;
    float font_size;
};
enum List_Direction {
    LIST_DIRECTION_VERTICAL,
    LIST_DIRECTION_HORIZONTAL
};
struct Render_List {
    struct Render_Node_Array* elements;
    enum List_Direction direction;
};
struct Render_Background_Begin {
    GLfloat* color;
};
enum Render_Kind {
    RENDER_KIND_TEXT,
    RENDER_KIND_LIST,
    RENDER_KIND_BACKGROUND_BEGIN,
    RENDER_KIND_BACKGROUND_END,
    RENDER_KIND_CURSOR_BEGIN,
    RENDER_KIND_CURSOR_END
};
struct Render_Node {
    enum Render_Kind kind;

    float x;
    float y;
    float width;
    float height;

    union {
        struct Render_Text text;
        struct Render_List list;
        struct Render_Background_Begin background_begin;
    };
};

void init_renderer();
void init_gl();
void init_quad_program();
void init_atlas_program();
void init_atlas(struct Atlas* atlas, char* font_filename, float font_size, float scale, size_t char_count);
void init_hilite();

struct Render_Node* get_new_render_node(struct Render_Nodes* render_nodes);
struct Render_Node* make_text(struct Render_Nodes* render_nodes,
                              char* text,
                              GLfloat* color);
struct Render_Node* make_list(struct Render_Nodes* render_nodes,
                              enum List_Direction direction);
struct Render_Node* make_background_begin(struct Render_Nodes* render_nodes,
                                          GLfloat* color);
struct Render_Node* make_background_end(struct Render_Nodes* render_nodes);
struct Render_Node* make_cursor_begin(struct Render_Nodes* render_nodes);
struct Render_Node* make_cursor_end(struct Render_Nodes* render_nodes);

void render(struct Code_Node* node);
void render_code_node(struct Code_Node* node,
                      struct Render_Data* render_data);
void render_type(struct Type_Info* type,
                 struct Render_Data* render_data);
void layout_node(struct Render_Node* node,
                 struct Render_Node* parent,
                 struct Render_Data* render_data);
void render_node(struct Render_Node* node,
                 struct Render_Data* render_data);
void render_text(char* text, float* xpos, float* ypos,
                 GLfloat* fg_color,
                 GLfloat* bg_color,
                 struct Render_Data* render_data);
void render_indent(struct Render_Data* render_data);
void render_space(struct Render_Data* render_data);
void render_newline(struct Render_Data* render_data);

void mark_background_begin(struct Render_Data* render_data,
                           GLfloat* bg_color,
                           float x, float y);
void mark_background_end(struct Render_Data* render_data,
                         float x, float y);

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