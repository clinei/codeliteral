#include "renderer.h"

#include "debug.h"

#define FONT_BYTE_COUNT 290816
#define CHAR_COUNT 96

GLfloat hilite_literal_fg_color[4] = { 15/255.0f,  218/255.0f, 184/255.0f, 1.0 };
GLfloat hilite_string_fg_color[4]  = { 15/255.0f,  218/255.0f, 184/255.0f, 1.0 };
GLfloat hilite_ident_fg_color[4]   = { 220/255.0f, 220/255.0f, 220/255.0f, 1.0 };
GLfloat hilite_type_fg_color[4]    = { 118/255.0f, 140/255.0f, 252/255.0f, 1.0 };
GLfloat hilite_proc_fg_color[4]    = { 220/255.0f, 221/255.0f, 140/255.0f, 1.0 };
GLfloat hilite_return_fg_color[4]  = { 231/255.0f, 250/255.0f, 236/255.0f, 1.0 };
GLfloat hilite_keyword_fg_color[4] = { 248/255.0f, 130/255.0f, 248/255.0f, 1.0 };
GLfloat hilite_op_fg_color[4]      = { 80/255.0f,  240/255.0f,  80/255.0f, 1.0 };
GLfloat hilite_comment_fg_color[4] = { 80/255.0f,  180/255.0f,  80/255.0f, 1.0 };

void init_renderer() {
    init_gl();
    emscripten_webgl_make_context_current(debugger_context);
    init_quad_program();
    init_atlas_program();

    my_render_data.font_atlas = malloc(sizeof(struct Atlas));
    init_atlas(my_render_data.font_atlas, "assets/fonts/SourceCodeVariable-Roman.ttf", 24.0, 4, 128);
    my_render_data.fg_color = malloc(sizeof(GLfloat) * 4);
    my_render_data.bg_color = malloc(sizeof(GLfloat) * 4);
    my_render_data.cursor_color = malloc(sizeof(GLfloat) * 4);

    my_render_data.coords_length = 0;
    my_render_data.coords_capacity = 1000 * 4;
    my_render_data.coords = malloc(sizeof(GLfloat) * 4 * my_render_data.coords_capacity);
    my_render_data.fg_coords = malloc(sizeof(GLfloat) * 4 * my_render_data.coords_capacity);
    my_render_data.indices_length = 0;
    my_render_data.indices_capacity = 1000 * 6;
    my_render_data.indices = malloc(sizeof(GLuint) * my_render_data.indices_capacity);

    my_render_data.bg_coords_length = 0;
    my_render_data.bg_coords_capacity = 100 * 4;
    my_render_data.bg_coords = malloc(sizeof(GLfloat) * 4 * my_render_data.bg_coords_capacity);
    my_render_data.bg_colors = malloc(sizeof(GLfloat) * 4 * my_render_data.bg_coords_capacity);
    // we reuse vertex indices

    my_render_data.lines = malloc(sizeof(struct Lines_Array));
    array_init(my_render_data.lines, sizeof(struct Code_Node_Array), 100);

    // two because first newline needs something to clear
    for (size_t i = 0; i < 2; i += 1) {
        array_next((my_render_data.lines));
        array_init((my_render_data.lines->last), sizeof(struct Code_Node*), 10);
    }

    my_render_data.cursor_line = 0;

    my_render_data.render_nodes = malloc(sizeof(struct Render_Nodes));
    array_init(my_render_data.render_nodes, sizeof(struct Render_Node), 10000);

    my_render_data.debugger_root = make_list(my_render_data.render_nodes, LIST_DIRECTION_VERTICAL);
}

void init_gl() {
    EmscriptenWebGLContextAttributes attribs;
    attribs.explicitSwapControl = 0;
    attribs.depth = 1;
    attribs.stencil = 1;
    attribs.antialias = 1;
    attribs.majorVersion = 2;
    attribs.minorVersion = 0;
    debugger_context = emscripten_webgl_create_context("debugger", &attribs);
}

void init_quad_program() {
    GLuint program_id = create_program("assets/shaders/quad.vert.glsl",
                                       "assets/shaders/quad.frag.glsl");

    quad_program.program_id = program_id;

    glUseProgram(program_id);
	quad_program.attrib_coord_loc = glGetAttribLocation(program_id, "coord");
	quad_program.attrib_color_loc = glGetAttribLocation(program_id, "color");

    glGenBuffers(1, &quad_program.coord_buffer_id);
    glGenBuffers(1, &quad_program.color_buffer_id);
    glGenBuffers(1, &quad_program.index_buffer_id);
}

typedef unsigned char pixel;

void init_atlas_program() {
    GLuint program_id = create_program("assets/shaders/texture_atlas.vert.glsl",
                                       "assets/shaders/texture_atlas.frag.glsl");

    atlas_program.program_id = program_id;

    glUseProgram(program_id);
	atlas_program.attrib_coord_loc    = glGetAttribLocation(program_id, "coord");
	atlas_program.attrib_fg_coord_loc = glGetAttribLocation(program_id, "fg_coord");
	atlas_program.uniform_tex_loc     = glGetUniformLocation(program_id, "tex");

    glGenBuffers(1, &atlas_program.coord_buffer_id);
    glGenBuffers(1, &atlas_program.fg_coord_buffer_id);
    glGenBuffers(1, &atlas_program.index_buffer_id);
}

void init_atlas(struct Atlas* atlas, char* font_filename, float font_size, float scale, size_t char_count) {
    const unsigned char* font_source = (const unsigned char*)read_file(font_filename);
    stbtt_fontinfo font_info;
    stbtt_InitFont(&font_info, font_source, stbtt_GetFontOffsetForIndex(font_source, 0));
    
    int advance, lsb;
    float px_scale = stbtt_ScaleForPixelHeight(&font_info, font_size);
    stbtt_GetCodepointHMetrics(&font_info, 'm', &advance, &lsb);
    float char_width = advance * px_scale;

    uint bake_width = 512 * scale;
    uint bake_height = 512 * scale;
    pixel* bake_bitmap = malloc(sizeof(pixel) * bake_width * bake_height);
    stbtt_bakedchar* chars = malloc(sizeof(stbtt_bakedchar) * char_count);
    stbtt_BakeFontBitmap(font_source, 0, font_size * scale, bake_bitmap, (int)bake_width, (int)bake_height, 0, char_count, chars);

    glUseProgram(atlas_program.program_id);
    GLuint tex;
    glActiveTexture(GL_TEXTURE0);
    glGenTextures(1, &tex);
    glBindTexture(GL_TEXTURE_2D, tex);
    glUniform1i(atlas_program.uniform_tex_loc, 0);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_ALPHA, bake_width, bake_height, 0, GL_ALPHA, GL_UNSIGNED_BYTE, bake_bitmap);
    free(bake_bitmap);

    atlas->tex = tex;
    atlas->width = bake_width;
    atlas->height = bake_height;
    atlas->scale = scale;
    atlas->font_size = font_size;
    atlas->char_width = char_width;
    atlas->font_info = font_info;
    atlas->chars = chars;
    atlas->char_count = char_count;
}

struct Render_Node* make_text(struct Render_Nodes* render_nodes,
                              char* text,
                              GLfloat* color) {

    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_TEXT;

    node->text.text = text;
    node->text.color = color;

    return node;
}
struct Render_Node* make_list(struct Render_Nodes* render_nodes,
                              enum List_Direction direction) {
    
    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_LIST;

    node->list.elements = malloc(sizeof(struct Render_Node_Array));
    array_init(node->list.elements, sizeof(struct Render_Node*), 10);
    node->list.direction = direction;

    return node;
}
struct Render_Node* make_background_begin(struct Render_Nodes* render_nodes,
                                          GLfloat* color) {
    
    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_BACKGROUND_BEGIN;

    node->background_begin.color = color;

    return node;
}
struct Render_Node* make_background_end(struct Render_Nodes* render_nodes) {
    
    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_BACKGROUND_END;

    return node;
}
struct Render_Node* make_cursor_begin(struct Render_Nodes* render_nodes) {
    
    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_CURSOR_BEGIN;

    return node;
}
struct Render_Node* make_cursor_end(struct Render_Nodes* render_nodes) {
    
    struct Render_Node* node = get_new_render_node(render_nodes);
    node->kind = RENDER_KIND_CURSOR_END;

    return node;
}

struct Render_Node* get_new_render_node(struct Render_Nodes* render_nodes) {
    bool was_realloc = array_next(render_nodes);
    return render_nodes->last;
}


void find_expanded_nodes(struct Code_Node* node) {
    // printf("find_expanded_nodes: (%s)\n", code_kind_to_string(node->kind));

    node->demands_expand = false;
    node->should_expand = false;

    switch (node->kind) {
        case CODE_KIND_BLOCK:{
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                struct Code_Node* stmt = node->block.statements->first[i];
                find_expanded_nodes(stmt);
                node->demands_expand |= stmt->demands_expand;
            }
            if (run_data.did_run == false) {
                node->should_expand = true;
            }
            else {
                node->should_expand = node->was_run;
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            if (run_data.did_run == false) {
                find_expanded_nodes(node->procedure.block);
                node->should_expand = true;
                node->demands_expand = true;
            }
            break;
        }
        case CODE_KIND_DECLARATION:{
            find_expanded_nodes(node->declaration.ident);
            node->demands_expand = node->declaration.ident->demands_expand;
            if (node->declaration.expression != NULL) {
                find_expanded_nodes(node->declaration.expression);
                node->demands_expand |= node->declaration.expression->demands_expand;
            }
            break;
        }
        case CODE_KIND_IF:{
            find_expanded_nodes(node->if_.condition);
            find_expanded_nodes(node->if_.expression);
            node->demands_expand = node->if_.condition->demands_expand |
                                   node->if_.expression->demands_expand;
            node->should_expand = node->if_.expression->was_run;
            if (run_data.did_run == false) {
                node->should_expand = true;
            }
            break;
        }
        case CODE_KIND_ELSE:{
            find_expanded_nodes(node->else_.expression);
            node->demands_expand = node->else_.expression->demands_expand;
            node->should_expand = node->else_.expression->was_run;
            if (run_data.did_run == false) {
                node->should_expand = true;
                node->else_.expression->should_expand = true;
            }
            break;
        }
        case CODE_KIND_ASSIGN:{
            find_expanded_nodes(node->assign.ident);
            find_expanded_nodes(node->assign.expression);
            node->demands_expand = node->assign.ident->demands_expand |
                                   node->assign.expression->demands_expand;
            node->should_expand = true;
            break;
        }
        case CODE_KIND_OPASSIGN:{
            find_expanded_nodes(node->opassign.ident);
            find_expanded_nodes(node->opassign.expression);
            node->demands_expand = node->opassign.ident->demands_expand |
                                   node->opassign.expression->demands_expand;
            node->should_expand = true;
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            find_expanded_nodes(node->binary_operation.left);
            find_expanded_nodes(node->binary_operation.right);
            node->demands_expand = node->binary_operation.left->demands_expand |
                                   node->binary_operation.right->demands_expand |
                                   (node == interaction_data.cursor);
            node->should_expand = node->binary_operation.left->demands_expand |
                                  node->binary_operation.right->demands_expand;

            break;
        }
        case CODE_KIND_CALL:{
            if (node->transformed != NULL) {
                find_expanded_nodes(node->transformed);
                node->transformed->should_expand = node->transformed->demands_expand;
                if (interaction_data.expand_all) {
                    node->transformed->should_expand = true;
                }
                node->should_expand = node->transformed->should_expand;
                node->demands_expand = node->transformed->demands_expand;
            }
            else {
                // native code
                for (size_t i = 0; i < node->call.args->length; i += 1) {
                    struct Code_Node* arg = node->call.args->first[i];
                    find_expanded_nodes(arg);
                    node->demands_expand |= arg->demands_expand;
                }
            }
            if (node == interaction_data.cursor) {
                node->demands_expand = true;
            }
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            find_expanded_nodes(node->array_index.array);
            find_expanded_nodes(node->array_index.index);
            node->demands_expand = node->array_index.array->demands_expand |
                                   node->array_index.index->demands_expand |
                                   (node == interaction_data.cursor);
            node->should_expand = node->array_index.array->demands_expand |
                                  node->array_index.index->demands_expand;
        }
        case CODE_KIND_DOT_OPERATOR:{
            find_expanded_nodes(node->dot_operator.left);
            find_expanded_nodes(node->dot_operator.right);
            node->demands_expand = node->dot_operator.left->demands_expand |
                                   node->dot_operator.right->demands_expand |
                                   (node == interaction_data.cursor);
            node->should_expand = node->dot_operator.left->demands_expand |
                                  node->dot_operator.right->demands_expand;
            break;
        }
        case CODE_KIND_WHILE:{
            if (node->was_run) {
                if (node->transformed != NULL) {
                    find_expanded_nodes(node->transformed);
                    node->transformed->should_expand = true;
                    node->demands_expand = node->transformed->demands_expand;
                    node->should_expand = false;
                }
            }
            else {
                find_expanded_nodes(node->while_.condition);
                find_expanded_nodes(node->while_.expression);
                node->should_expand = true;
            }
            break;
        }
        case CODE_KIND_DO_WHILE:{
            if (node->was_run) {
                if (node->transformed != NULL) {
                    find_expanded_nodes(node->transformed);
                    node->transformed->should_expand = true;
                    node->demands_expand = node->transformed->demands_expand;
                    node->should_expand = false;
                }
            }
            else {
                find_expanded_nodes(node->do_while_.condition);
                find_expanded_nodes(node->do_while_.expression);
                node->should_expand = true;
            }
            break;
        }
        case CODE_KIND_FOR:{
            if (node->was_run) {
                if (node->transformed != NULL) {
                    find_expanded_nodes(node->transformed);
                    node->transformed->should_expand = true;
                    node->demands_expand = node->transformed->demands_expand;
                    node->should_expand = false;
                }
            }
            else {
                find_expanded_nodes(node->for_.begin);
                find_expanded_nodes(node->for_.condition);
                find_expanded_nodes(node->for_.cycle_end);
                find_expanded_nodes(node->for_.expression);
                node->should_expand = true;
            }
            break;
        }
        case CODE_KIND_RETURN:{
            if (node->transformed && run_data.did_run) {
                find_expanded_nodes(node->transformed);
                node->should_expand = node->transformed->demands_expand;
                node->demands_expand = node->should_expand;
            }
            else {
                find_expanded_nodes(node->return_.expression);
            }
            break;
        }
        case CODE_KIND_STRUCT:{
            find_expanded_nodes(node->struct_.block);
            node->struct_.block->should_expand = true;
            break;
        }
        case CODE_KIND_IDENT:{
            node->demands_expand = node == interaction_data.cursor;
            break;
        }
        case CODE_KIND_REFERENCE:{
            find_expanded_nodes(node->reference.expression);
            node->demands_expand = node->reference.expression->demands_expand |
                                   (node == interaction_data.cursor);
            node->should_expand = node->reference.expression->demands_expand;
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            find_expanded_nodes(node->dereference.expression);
            node->demands_expand = node->dereference.expression->demands_expand |
                                   (node == interaction_data.cursor);
            node->should_expand = node->dereference.expression->demands_expand;
            break;
        }
        case CODE_KIND_STRING:
        case CODE_KIND_LITERAL_INT:
        case CODE_KIND_LITERAL_UINT:
        case CODE_KIND_LITERAL_FLOAT:
        case CODE_KIND_LITERAL_BOOL:{
            node->demands_expand = node == interaction_data.cursor;
            if (node->result == NULL || node->result->str == NULL) {
                node->result = node;
                fill_result_str(node);
            }
            break;
        }
        case CODE_KIND_BREAK:
        case CODE_KIND_CONTINUE:{
            node->demands_expand = node == interaction_data.cursor;
            break;
        }
        case CODE_KIND_NATIVE_CODE: {
            break;
        }
        default:{
            printf("find_expanded_nodes not implemented for node kind (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
    // printf("find_expanded_nodes: (%s) ###\n", code_kind_to_string(node->kind));
}

void destroy_render_node(struct Render_Node* node) {
    switch (node->kind) {
        case RENDER_KIND_LIST:{
            array_destroy(node->list.elements);
            break;
        }
        case RENDER_KIND_TEXT:
        case RENDER_KIND_BACKGROUND_BEGIN:
        case RENDER_KIND_BACKGROUND_END:
        case RENDER_KIND_CURSOR_BEGIN:
        case RENDER_KIND_CURSOR_END:{
            break;
        }
        default:{
            printf("trying to destroy node kind %u\n", node->kind);
            abort();
            break;
        }
    }
}
void destroy_render_nodes(struct Render_Nodes* render_nodes) {
    for (size_t i = 0; i < render_nodes->length; i += 1) {
        destroy_render_node(render_nodes->first + i);
    }
}

void render(struct Code_Node* node) {
    // printf("cursor kind: (%s)\n", code_kind_to_string(interaction_data.cursor->kind));
    // printf("-----new frame\n");

    GLfloat white[4] =        { 230 / 255.0f, 230 / 255.0f, 230 / 255.0f, 1 };
    GLfloat clear_color[4] =  { 37 / 255.0f, 37 / 255.0f, 37 / 255.0f, 1 };
    GLfloat bg_color[4] =     { 120 / 255.0f, 60 / 255.0f, 20 / 255.0f, 0 };
    GLfloat cursor_color[4] = { 120 / 255.0f, 60 / 255.0f, 20 / 255.0f, 1 };

    struct Render_Data* render_data = &my_render_data;

    render_data->indent_level = 0;
    render_data->line_height = 1.01;

    render_data->coords_length = 0;
    render_data->indices_length = 0;
    render_data->bg_coords_length = 0;

    render_data->block_depth = 0;
    
    memcpy(render_data->fg_color, &white, sizeof(GLfloat) * 4);
    memcpy(render_data->bg_color, &bg_color, sizeof(GLfloat) * 4);
    memcpy(render_data->cursor_color, &cursor_color, sizeof(GLfloat) * 4);

    find_expanded_nodes(node);

    array_clear((render_data->lines->first));
    render_data->line_index = 0;

    destroy_render_nodes(render_data->render_nodes);
    array_clear(render_data->render_nodes);

    render_data->debugger_root = make_list(render_data->render_nodes, LIST_DIRECTION_VERTICAL);
    render_newline(render_data);

    render_code_node(node, render_data);

    render_data->layout_data.curr_x = 0;
    render_data->layout_data.curr_y = 0;
    layout_node(render_data->debugger_root, NULL, render_data);

	float position_y = render_data->cursor_begin->y - interaction_data.scroll_y;
	float midpoint_y = render_data->height / 2;
	float radius_y = render_data->height / 8;

	float position_x = render_data->cursor_begin->x - interaction_data.scroll_x;
	float midpoint_x = render_data->width / 2;
	float radius_x = render_data->width / 8;
    
    float target_x = render_data->cursor_begin->x - midpoint_x;
    if (target_x < 0) {
        target_x = 0;
    }
    float target_y = render_data->cursor_begin->y - midpoint_y;
    if (target_y < 0) {
        target_y = 0;
    }

    bool instant_scroll = true;

	if ((position_x < (midpoint_x - radius_x) ||
		 position_x > (midpoint_x + radius_x) ||
		 position_y < (midpoint_y - radius_y) ||
		 position_y > (midpoint_y + radius_y)) &&
        (render_data->cursor_begin->y > midpoint_y ||
         render_data->cursor_begin->y < interaction_data.scroll_y)) {

		if (instant_scroll) {
			interaction_data.scroll_x = target_x;
			interaction_data.scroll_y = target_y;
		}
		else {
            // interpolate
		}
	}

    render_data->offset_x = -interaction_data.scroll_x;
    render_data->offset_y = -interaction_data.scroll_y + render_data->font_atlas->font_size;

    render_node(render_data->debugger_root, render_data);

    emscripten_webgl_make_context_current(debugger_context);

	glClearColor(clear_color[0], clear_color[1], clear_color[2], clear_color[3]);
	glClear(GL_COLOR_BUFFER_BIT);
	glEnable(GL_BLEND);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glDisable(GL_DEPTH_TEST);

    // draw backgrounds
    glUseProgram(quad_program.program_id);

    glBindBuffer(GL_ARRAY_BUFFER, quad_program.coord_buffer_id);
    glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * render_data->bg_coords_length, render_data->bg_coords, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(quad_program.attrib_coord_loc);
    glVertexAttribPointer(quad_program.attrib_coord_loc, 4, GL_FLOAT, GL_FALSE, 0, 0);

    glBindBuffer(GL_ARRAY_BUFFER, quad_program.color_buffer_id);
    glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * render_data->bg_coords_length, render_data->bg_colors, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(quad_program.attrib_color_loc);
    glVertexAttribPointer(quad_program.attrib_color_loc, 4, GL_FLOAT, GL_FALSE, 0, 0);
    
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, atlas_program.index_buffer_id);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(GLuint) * render_data->coords_length / 4 / 4 * 6, render_data->indices, GL_DYNAMIC_DRAW);

    glDrawElements(GL_TRIANGLES, render_data->bg_coords_length / 4 / 4 * 6, GL_UNSIGNED_INT, 0);
    
    // draw text
    glUseProgram(atlas_program.program_id);

    glBindTexture(GL_TEXTURE_2D, render_data->font_atlas->tex);
    glUniform1i(atlas_program.uniform_tex_loc, 0);

    glBindBuffer(GL_ARRAY_BUFFER, atlas_program.coord_buffer_id);
    glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * render_data->coords_length, render_data->coords, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(atlas_program.attrib_coord_loc);
    glVertexAttribPointer(atlas_program.attrib_coord_loc, 4, GL_FLOAT, GL_FALSE, 0, 0);

    glBindBuffer(GL_ARRAY_BUFFER, atlas_program.fg_coord_buffer_id);
    glBufferData(GL_ARRAY_BUFFER, sizeof(GLfloat) * render_data->coords_length, render_data->fg_coords, GL_DYNAMIC_DRAW);
    glEnableVertexAttribArray(atlas_program.attrib_fg_coord_loc);
    glVertexAttribPointer(atlas_program.attrib_fg_coord_loc, 4, GL_FLOAT, GL_FALSE, 0, 0);
    
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, atlas_program.index_buffer_id);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(GLuint) * render_data->indices_length, render_data->indices, GL_DYNAMIC_DRAW);

    glDrawElements(GL_TRIANGLES, render_data->indices_length, GL_UNSIGNED_INT, 0);

    // abort();
}

float get_text_width(char* text, struct Atlas* font_atlas) {
    float width = 0;
    while (*text) {
        width += font_atlas->char_width;
        text++;
    }
    return width;
}
void layout_node(struct Render_Node* node,
                 struct Render_Node* parent,
                 struct Render_Data* render_data) {

    // printf("layout_node: (%u)\n", node->kind);

    /*
    if (parent == NULL) {
        render_data->layout_data.curr_x = node->x;
        render_data->layout_data.curr_y = node->y;
    }
    */

    node->x = render_data->layout_data.curr_x;
    node->y = render_data->layout_data.curr_y;

    switch (node->kind) {
        case RENDER_KIND_TEXT:{
            node->width = get_text_width(node->text.text, render_data->font_atlas);
            node->height = render_data->font_atlas->font_size;
            break;
        }
        case RENDER_KIND_LIST:{
            float main_distance = 0;
            float max_cross_distance = 0;
            for (size_t i = 0; i < node->list.elements->length; i += 1) {
                struct Render_Node* elem = node->list.elements->first[i];
                layout_node(elem, node, render_data);
                if (node->list.direction == LIST_DIRECTION_VERTICAL) {
                    render_data->layout_data.curr_y += elem->height;
                    render_data->layout_data.curr_x = node->x;
                    main_distance += elem->height;
                    if (elem->width > max_cross_distance) {
                        max_cross_distance = elem->width;
                    }
                }
                else if (node->list.direction == LIST_DIRECTION_HORIZONTAL) {
                    render_data->layout_data.curr_x += elem->width;
                    render_data->layout_data.curr_y = node->y;
                    main_distance += elem->width;
                    if (elem->height > max_cross_distance) {
                        max_cross_distance = elem->height;
                    }
                }
            }
            if (node->list.direction == LIST_DIRECTION_VERTICAL) {
                node->height = main_distance;
                node->width = max_cross_distance;
            }
            else if (node->list.direction == LIST_DIRECTION_HORIZONTAL) {
                node->width = main_distance;
                node->height = max_cross_distance;
            }
            break;
        }
        case RENDER_KIND_BACKGROUND_BEGIN:
        case RENDER_KIND_BACKGROUND_END:
        case RENDER_KIND_CURSOR_BEGIN:
        case RENDER_KIND_CURSOR_END:{
            node->width = 0;
            node->height = 0;
            break;
        }
        default:{
            printf("layout_node not implemented for node kind: %u\n", node->kind);
            abort();
            break;
        }
    }

    /*
    printf("x: %f\n", node->x);
    printf("y: %f\n", node->y);
    printf("width: %f\n", node->width);
    printf("height: %f\n", node->height);
    */
    
    // printf("exit layout_node: (%u)\n", node->kind);
}

void render_node(struct Render_Node* node, struct Render_Data* render_data) {
    float x = node->x + render_data->offset_x;
    float y = node->y + render_data->offset_y;
    switch (node->kind) {
        case RENDER_KIND_TEXT:{
            render_text(node->text.text,
                        &x, &y,
                        node->text.color,
                        render_data->bg_color,
                        render_data);
            break;
        }
        case RENDER_KIND_LIST:{
            for (size_t i = 0; i < node->list.elements->length; i += 1) {
                render_node(node->list.elements->first[i], render_data);
            }
            break;
        }
        case RENDER_KIND_BACKGROUND_BEGIN:{
            // @Incomplete
            // we need a stack
            mark_background_begin(render_data, node->background_begin.color, x, y);
            break;
        }
        case RENDER_KIND_BACKGROUND_END:{
            mark_background_end(render_data, x, y);
            break;
        }
        case RENDER_KIND_CURSOR_BEGIN:
        case RENDER_KIND_CURSOR_END:{
            break;
        }
        default:{
            printf("render_node not implemented for kind: %u\n", node->kind);
            abort();
            break;
        }
    }
}

void render_code_node(struct Code_Node* node,
                      struct Render_Data* render_data) {

    // @Refactor
    // should be in layout_node
    /*
    // clip
    if (0 > render_data->ypos && render_data->ypos > render_data->height) {
        return;
    }
    */

    struct Render_Node* last_line = *render_data->debugger_root->list.elements->last;
    if (node == interaction_data.cursor) {
        struct Render_Node* cursor_background_begin = make_background_begin(render_data->render_nodes, render_data->cursor_color);
        array_push(last_line->list.elements, &cursor_background_begin);
        struct Render_Node* cursor_begin = make_cursor_begin(render_data->render_nodes);
        array_push(last_line->list.elements, &cursor_begin);
        render_data->cursor_begin = cursor_begin;
        render_data->cursor_line = render_data->line_index;
    }

    // printf("render_node: (%s)\n", code_kind_to_string(node->kind));

    bool order_last = false;
    if (node->kind == CODE_KIND_BINARY_OPERATION) {
        order_last = true;
    }

    if (node->is_on_execution_stack && order_last == false) {
        struct Code_Node_Array* nodes = render_data->lines->first + render_data->line_index;
        array_push(nodes, &node);
    }

    switch (node->kind) {
        case CODE_KIND_IF:{
            struct Render_Node* if_keyword = make_text(render_data->render_nodes, "if ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &if_keyword);
            struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
            array_push(last_line->list.elements, &open_brace);
            render_code_node(node->if_.condition, render_data);
            struct Render_Node* close_brace = make_text(render_data->render_nodes, ") ", render_data->fg_color);
            array_push(last_line->list.elements, &close_brace);
            if (node->if_.expression->was_run) {
                render_code_node(node->if_.expression, render_data);
                if (node->if_.expression->kind != CODE_KIND_BLOCK){
                    struct Render_Node* semicolon = make_text(render_data->render_nodes, ";", render_data->fg_color);
                    array_push(last_line->list.elements, &semicolon);
                }
            }
            else {
                struct Render_Node* empty_block = make_text(render_data->render_nodes, "{}", render_data->fg_color);
                array_push(last_line->list.elements, &empty_block);
            }
            break;
        }
        case CODE_KIND_ELSE:{
            struct Render_Node* else_keyword = make_text(render_data->render_nodes, "else ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &else_keyword);
            render_code_node(node->else_.expression, render_data);
            if (node->else_.expression->kind != CODE_KIND_BLOCK &&
                node->else_.expression->kind != CODE_KIND_IF) {

                    struct Render_Node* semicolon = make_text(render_data->render_nodes, ";", render_data->fg_color);
                    array_push(last_line->list.elements, &semicolon);
            }
            break;
        }
        case CODE_KIND_WHILE:{
            struct Render_Node* while_keyword = make_text(render_data->render_nodes, "while ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &while_keyword);
            struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
            array_push(last_line->list.elements, &open_brace);
            render_code_node(node->while_.condition, render_data);
            struct Render_Node* close_brace = make_text(render_data->render_nodes, ") ", render_data->fg_color);
            array_push(last_line->list.elements, &close_brace);
            render_code_node(node->while_.expression, render_data);
            break;
        }
        case CODE_KIND_DO_WHILE:{
            struct Render_Node* do_keyword = make_text(render_data->render_nodes, "do ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &do_keyword);
            render_code_node(node->do_while_.expression, render_data);
            struct Render_Node* while_keyword = make_text(render_data->render_nodes, "while ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &while_keyword);
            struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
            array_push(last_line->list.elements, &open_brace);
            render_code_node(node->do_while_.condition, render_data);
            struct Render_Node* close_brace = make_text(render_data->render_nodes, ")", render_data->fg_color);
            array_push(last_line->list.elements, &close_brace);
            break;
        }
        case CODE_KIND_FOR:{
            struct Render_Node* for_keyword = make_text(render_data->render_nodes, "for ", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &for_keyword);
            struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
            array_push(last_line->list.elements, &open_brace);
            if (node->for_.begin != NULL) {
                render_code_node(node->for_.begin, render_data);
            }
            struct Render_Node* semicolon = make_text(render_data->render_nodes, ";", render_data->fg_color);
            array_push(last_line->list.elements, &semicolon);
            if (node->for_.condition != NULL) {
                render_code_node(node->for_.condition, render_data);
            }
            struct Render_Node* semicolon_2 = make_text(render_data->render_nodes, ";", render_data->fg_color);
            array_push(last_line->list.elements, &semicolon_2);
            if (node->for_.cycle_end != NULL) {
                render_code_node(node->for_.cycle_end, render_data);
            }
            struct Render_Node* close_brace = make_text(render_data->render_nodes, ") ", render_data->fg_color);
            array_push(last_line->list.elements, &close_brace);
            render_code_node(node->for_.expression, render_data);
            break;
        }
        case CODE_KIND_BREAK:{
            struct Render_Node* break_keyword = make_text(render_data->render_nodes, "break", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &break_keyword);
            break;
        }
        case CODE_KIND_CONTINUE:{
            struct Render_Node* continue_keyword = make_text(render_data->render_nodes, "continue", hilite_keyword_fg_color);
            array_push(last_line->list.elements, &continue_keyword);
            break;
        }
        case CODE_KIND_INCREMENT:{
            render_code_node(node->increment.ident, render_data);
            struct Render_Node* op = make_text(render_data->render_nodes, "++", hilite_op_fg_color);
            array_push(last_line->list.elements, &op);
            break;
        }
        case CODE_KIND_DECREMENT:{
            render_code_node(node->increment.ident, render_data);
            struct Render_Node* op = make_text(render_data->render_nodes, "--", hilite_op_fg_color);
            array_push(last_line->list.elements, &op);
            break;
        }
        case CODE_KIND_DECLARATION:{
            if (node->declaration.expression != NULL &&
                node->declaration.expression->kind == CODE_KIND_PROCEDURE) {

                struct Code_Procedure* proc = &(node->declaration.expression->procedure);
                render_type(proc->return_type, render_data);
                render_space(render_data);
                render_code_node(node->declaration.ident, render_data);
                struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
                array_push(last_line->list.elements, &open_brace);
                bool first = true;
                for (size_t i = 0; i < proc->params->length; i += 1) {
                    if (first == false) {
                        struct Render_Node* comma = make_text(render_data->render_nodes, ", ", render_data->fg_color);
                        array_push(last_line->list.elements, &comma);
                    }
                    else {
                        first = false;
                    }
                    render_code_node(proc->params->first[i], render_data);
                }
                if (proc->has_varargs) {
                    if (first == false) {
                        struct Render_Node* comma = make_text(render_data->render_nodes, ", ", render_data->fg_color);
                        array_push(last_line->list.elements, &comma);
                    }
                    else {
                        first = false;
                    }
                    struct Render_Node* three_dots = make_text(render_data->render_nodes, "...", hilite_ident_fg_color);
                    array_push(last_line->list.elements, &three_dots);
                }
                struct Render_Node* close_brace = make_text(render_data->render_nodes, ") ", render_data->fg_color);
                array_push(last_line->list.elements, &close_brace);
                render_code_node(proc->block, render_data);
            }
            else if (node->declaration.expression != NULL &&
                     node->declaration.expression->kind == CODE_KIND_STRUCT) {

                struct Render_Node* struct_keyword = make_text(render_data->render_nodes, "struct ", hilite_type_fg_color);
                array_push(last_line->list.elements, &struct_keyword);
                render_code_node(node->declaration.ident, render_data);
                render_space(render_data);
                render_code_node(node->declaration.expression->struct_.block, render_data);
            }
            else {
                render_type(node->declaration.type, render_data);
                render_space(render_data);
                render_code_node(node->declaration.ident, render_data);
                if (node->declaration.expression != NULL) {
                    render_space(render_data);
                    struct Render_Node* equals_sign = make_text(render_data->render_nodes, "=", hilite_op_fg_color);
                    array_push(last_line->list.elements, &equals_sign);
                    render_space(render_data);
                    render_code_node(node->declaration.expression, render_data);
                }
            }
            break;
        }
        case CODE_KIND_ASSIGN:{
            render_code_node(node->assign.ident, render_data);
            render_space(render_data);
            struct Render_Node* equals_sign = make_text(render_data->render_nodes, "=", hilite_op_fg_color);
            array_push(last_line->list.elements, &equals_sign);
            render_space(render_data);
            render_code_node(node->assign.expression, render_data);
            break;
        }
        case CODE_KIND_OPASSIGN:{
            render_code_node(node->opassign.ident, render_data);
            render_space(render_data);
            struct Render_Node* op = make_text(render_data->render_nodes, node->opassign.operation_type, hilite_op_fg_color);
            array_push(last_line->list.elements, &op);
            struct Render_Node* equals_sign = make_text(render_data->render_nodes, "=", hilite_op_fg_color);
            array_push(last_line->list.elements, &equals_sign);
            render_space(render_data);
            render_code_node(node->opassign.expression, render_data);
            break;
        }
        case CODE_KIND_REFERENCE:{
            if (interaction_data.show_values && node->should_expand == false && node->result != NULL) {
                render_code_node(node->result, render_data);
            }
            else {
                struct Render_Node* ampersand = make_text(render_data->render_nodes, "&", hilite_op_fg_color);
                array_push(last_line->list.elements, &ampersand);
                render_code_node(node->reference.expression, render_data);
            }
            break;
        }
        case CODE_KIND_DEREFERENCE:{
            if ((node->is_lhs ? interaction_data.show_changes : interaction_data.show_values) &&
                node->should_expand == false && node->result != NULL) {

                render_code_node(node->result, render_data);
            }
            else {
                struct Render_Node* star = make_text(render_data->render_nodes, "*", hilite_op_fg_color);
                array_push(last_line->list.elements, &star);
                render_code_node(node->dereference.expression, render_data);
            }
            break;
        }
        case CODE_KIND_ARRAY_INDEX:{
            if ((node->is_lhs ? interaction_data.show_changes : interaction_data.show_values) &&
                node->should_expand == false && node->result != NULL) {

                render_code_node(node->result, render_data);
            }
            else {
                render_code_node(node->array_index.array, render_data);
                struct Render_Node* open_angle_brace = make_text(render_data->render_nodes, "[", render_data->fg_color);
                array_push(last_line->list.elements, &open_angle_brace);
                render_code_node(node->array_index.index, render_data);
                struct Render_Node* close_angle_brace = make_text(render_data->render_nodes, "]", render_data->fg_color);
                array_push(last_line->list.elements, &close_angle_brace);
            }
            break;
        }
        case CODE_KIND_DOT_OPERATOR:{
            if ((node->is_lhs ? interaction_data.show_changes : interaction_data.show_values) &&
                node->should_expand == false && node->result != NULL) {
                
                render_code_node(node->result, render_data);
            }
            else {
                render_code_node(node->dot_operator.left, render_data);
                struct Render_Node* dot = make_text(render_data->render_nodes, ".", render_data->fg_color);
                array_push(last_line->list.elements, &dot);
                render_code_node(node->dot_operator.right, render_data);
            }
            break;
        }
        case CODE_KIND_CALL:{
            if ((node->is_lhs ? interaction_data.show_changes : interaction_data.show_values) &&
                (node->should_expand == false && interaction_data.expand_all == false) && node->result != NULL) {
                
                render_code_node(node->result, render_data);
            }
            else if (node->should_expand || interaction_data.expand_all) {
                render_code_node(node->call.return_ident, render_data);
            }
            else {
                render_code_node(node->call.ident, render_data);
                struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
                array_push(last_line->list.elements, &open_brace);
                bool first = true;
                for (size_t i = 0; i < node->call.args->length; i += 1) {
                    if (first == false) {
                        struct Render_Node* comma = make_text(render_data->render_nodes, ", ", render_data->fg_color);
                        array_push(last_line->list.elements, &comma);
                    }
                    else {
                        first = false;
                    }
                    render_code_node(node->call.args->first[i], render_data);
                }
                struct Render_Node* close_brace = make_text(render_data->render_nodes, ")", render_data->fg_color);
                array_push(last_line->list.elements, &close_brace);
            }
            break;
        }
        case CODE_KIND_RETURN:{
            if (node->transformed != NULL) {
                render_code_node(node->transformed, render_data);
            }
            else {
                struct Render_Node* return_keyword = make_text(render_data->render_nodes, "return", hilite_keyword_fg_color);
                array_push(last_line->list.elements, &return_keyword);
                if (node->return_.expression != NULL) {
                    render_space(render_data);
                    render_code_node(node->return_.expression, render_data);
                }
            }
            break;
        }
        case CODE_KIND_PROCEDURE:{
            break;
        }
        case CODE_KIND_STRUCT:{
            break;
        }
        case CODE_KIND_BINARY_OPERATION:{
            if (interaction_data.show_values && node->result != NULL &&
                (node->should_expand == false && interaction_data.show_elements == false)) {

                render_code_node(node->result, render_data);
            }
            else {
                // @Incomplete
                // should show parens only when operator precedence changes
                if (interaction_data.show_parens) {
                    struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
                    array_push(last_line->list.elements, &open_brace);
                }
                render_code_node(node->binary_operation.left, render_data);
                render_space(render_data);
                struct Render_Node* op = make_text(render_data->render_nodes, node->binary_operation.operation_type, hilite_op_fg_color);
                array_push(last_line->list.elements, &op);
                render_space(render_data);
                render_code_node(node->binary_operation.right, render_data);
                if (interaction_data.show_parens) {
                    struct Render_Node* close_brace = make_text(render_data->render_nodes, ")", render_data->fg_color);
                    array_push(last_line->list.elements, &close_brace);
                }
            }
            break;
        }
        case CODE_KIND_PARENS:{
            struct Render_Node* open_brace = make_text(render_data->render_nodes, "(", render_data->fg_color);
            array_push(last_line->list.elements, &open_brace);
            render_code_node(node->parens.expression, render_data);
            struct Render_Node* close_brace = make_text(render_data->render_nodes, ")", render_data->fg_color);
            array_push(last_line->list.elements, &close_brace);
            break;
        }
        case CODE_KIND_IDENT:{
            if ((node->is_lhs ? interaction_data.show_changes : interaction_data.show_values) &&
                node->result != NULL) {

                render_code_node(node->result, render_data);
            }
            else {
                struct Render_Node* ident = make_text(render_data->render_nodes, node->ident.name, hilite_ident_fg_color);
                array_push(last_line->list.elements, &ident);
            }
            break;
        }
        case CODE_KIND_LITERAL_INT:
        case CODE_KIND_LITERAL_UINT:
        case CODE_KIND_LITERAL_FLOAT:
        case CODE_KIND_LITERAL_BOOL:{
            struct Render_Node* literal = make_text(render_data->render_nodes, node->str, hilite_literal_fg_color);
            array_push(last_line->list.elements, &literal);
            break;
        }
        case CODE_KIND_STRING:{
            struct Render_Node* open_double_quote = make_text(render_data->render_nodes, "\"", hilite_literal_fg_color);
            array_push(last_line->list.elements, &open_double_quote);
            struct Render_Node* str = make_text(render_data->render_nodes, node->string_.pointer, hilite_literal_fg_color);
            array_push(last_line->list.elements, &str);
            struct Render_Node* close_double_quote = make_text(render_data->render_nodes, "\"", hilite_literal_fg_color);
            array_push(last_line->list.elements, &close_double_quote);
            break;
        }
        case CODE_KIND_BLOCK:{
            if (node->demands_expand == false && node->should_expand == false) {
                struct Render_Node* empty_block = make_text(render_data->render_nodes, "{}", render_data->fg_color);
                array_push(last_line->list.elements, &empty_block);
                break;
            }
            if (node->block.is_transformed_block == false) {
                struct Render_Node* open_bracket = make_text(render_data->render_nodes, "{", render_data->fg_color);
                array_push(last_line->list.elements, &open_bracket);
                render_newline(render_data);
                render_data->indent_level += 1;
            }
            render_data->block_depth += 1;
            for (size_t i = 0; i < node->block.statements->length; i += 1) {
                if (node->block.extras != NULL && i < node->block.extras->length) {
                    for (size_t j = 0; j < node->block.extras->first[i].length; j += 1) {
                        struct Code_Node* extra = node->block.extras->first[i].first[j];
                        if (interaction_data.expand_all || extra->demands_expand || extra->should_expand) {
                            render_code_node(extra, render_data);
                        }
                    }
                }
                struct Code_Node* stmt = node->block.statements->first[i];
                // don't render toplevel procedure declarations
                if (stmt->kind == CODE_KIND_DECLARATION && render_data->block_depth == 1 &&
                    stmt->declaration.expression != NULL && run_data.did_run &&
                    stmt->declaration.expression->kind == CODE_KIND_PROCEDURE) {

                    continue;
                }
                if (stmt->should_expand == false &&
                    (stmt->kind == CODE_KIND_ELSE ||
                     stmt->kind == CODE_KIND_WHILE ||
                     stmt->kind == CODE_KIND_DO_WHILE ||
                     stmt->kind == CODE_KIND_FOR)) {

                    continue;
                }
                render_indent(render_data);
                render_code_node(stmt, render_data);
                if (stmt->kind != CODE_KIND_IF &&
                    stmt->kind != CODE_KIND_ELSE &&
                    stmt->kind != CODE_KIND_WHILE &&
                    stmt->kind != CODE_KIND_FOR &&
                    !(stmt->kind == CODE_KIND_DECLARATION &&
                    stmt->declaration.expression != NULL &&
                    stmt->declaration.expression->kind == CODE_KIND_PROCEDURE
                    )
                ) {

                    last_line = *render_data->debugger_root->list.elements->last;
                    struct Render_Node* semicolon = make_text(render_data->render_nodes, ";", render_data->fg_color);
                    array_push(last_line->list.elements, &semicolon);
                }
                render_newline(render_data);
                if (stmt->kind == CODE_KIND_BREAK || stmt->kind == CODE_KIND_CONTINUE) {
                    break;
                }
            }
            render_data->block_depth -= 1;
            if (node->block.is_transformed_block == false) {
                render_data->indent_level -= 1;
                render_indent(render_data);
                last_line = *render_data->debugger_root->list.elements->last;
                struct Render_Node* close_bracket = make_text(render_data->render_nodes, "}", render_data->fg_color);
                array_push(last_line->list.elements, &close_bracket);
            }
            break;
        }
        case CODE_KIND_NATIVE_CODE:{
            struct Render_Node* open_bracket = make_text(render_data->render_nodes, "{", render_data->fg_color);
            array_push(last_line->list.elements, &open_bracket);
            render_space(render_data);
            struct Render_Node* text = make_text(render_data->render_nodes, "[native_code]", hilite_comment_fg_color);
            array_push(last_line->list.elements, &text);
            render_space(render_data);
            struct Render_Node* close_bracket = make_text(render_data->render_nodes, "}", render_data->fg_color);
            array_push(last_line->list.elements, &close_bracket);
            break;
        }
        default:{
            printf("render_code_node not implemented for code kind: (%s)\n", code_kind_to_string(node->kind));
            abort();
            break;
        }
    }
    
    if (node->is_on_execution_stack && order_last == true) {
        struct Code_Node_Array* nodes = render_data->lines->first + render_data->line_index;
        array_push(nodes, &node);
    }
    
    if (node == interaction_data.cursor) {
        struct Render_Node* cursor_background_end = make_background_end(render_data->render_nodes);
        array_push(last_line->list.elements, &cursor_background_end);
        struct Render_Node* cursor_end = make_cursor_end(render_data->render_nodes);
        array_push(last_line->list.elements, &cursor_end);
    }
}

void render_text(char* text, float* xpos, float* ypos,
                 GLfloat* fg_color,
                 GLfloat* bg_color,
                 struct Render_Data* render_data) {

    // clip
    if (0 > *ypos && *ypos > render_data->height) {
        return;
    }

    for (char* p = text; *p; p++) {

        if (*p == '\n') {
            *ypos += render_data->font_atlas->font_size * render_data->line_height;
            *xpos = 0;
            continue;
        }
        if (*p =='\t') {
            *xpos += render_data->font_atlas->char_width * 4;
            continue;
        }
        
        // clip
        if (0 > *xpos && *xpos > render_data->width) {
            continue;
        }
        if (0 > *ypos && *ypos > render_data->height) {
            break;
        }

        for (size_t i = 0; i < 4; i += 1) {
            render_data->fg_coords[render_data->coords_length + i * 4 + 0] = fg_color[0];
            render_data->fg_coords[render_data->coords_length + i * 4 + 1] = fg_color[1];
            render_data->fg_coords[render_data->coords_length + i * 4 + 2] = fg_color[2];
            render_data->fg_coords[render_data->coords_length + i * 4 + 3] = fg_color[3];
        }

        stbtt_aligned_quad q;
        get_baked_quad_scaled(render_data->font_atlas->chars,
                              render_data->font_atlas->width, render_data->font_atlas->height,
                              *p, xpos, ypos,
                              render_data->font_atlas->scale, &q, 1);

        float top_left_x, top_left_y;
        convert_screen_coords_to_view_coords(q.x0, q.y0, render_data->width, render_data->height, &top_left_x, &top_left_y);
        float top_right_x, top_right_y;
        convert_screen_coords_to_view_coords(q.x1, q.y0, render_data->width, render_data->height, &top_right_x, &top_right_y);
        float bottom_right_x, bottom_right_y;
        convert_screen_coords_to_view_coords(q.x1, q.y1, render_data->width, render_data->height, &bottom_right_x, &bottom_right_y);
        float bottom_left_x, bottom_left_y;
        convert_screen_coords_to_view_coords(q.x0, q.y1, render_data->width, render_data->height, &bottom_left_x, &bottom_left_y);

        render_data->coords[render_data->coords_length + 4 * 0 + 0] = top_left_x;
        render_data->coords[render_data->coords_length + 4 * 0 + 1] = top_left_y;
        render_data->coords[render_data->coords_length + 4 * 0 + 2] = q.s0;
        render_data->coords[render_data->coords_length + 4 * 0 + 3] = q.t0;
        
        render_data->coords[render_data->coords_length + 4 * 1 + 0] = top_right_x;
        render_data->coords[render_data->coords_length + 4 * 1 + 1] = top_right_y;
        render_data->coords[render_data->coords_length + 4 * 1 + 2] = q.s1;
        render_data->coords[render_data->coords_length + 4 * 1 + 3] = q.t0;
        
        render_data->coords[render_data->coords_length + 4 * 2 + 0] = bottom_right_x;
        render_data->coords[render_data->coords_length + 4 * 2 + 1] = bottom_right_y;
        render_data->coords[render_data->coords_length + 4 * 2 + 2] = q.s1;
        render_data->coords[render_data->coords_length + 4 * 2 + 3] = q.t1;
        
        render_data->coords[render_data->coords_length + 4 * 3 + 0] = bottom_left_x;
        render_data->coords[render_data->coords_length + 4 * 3 + 1] = bottom_left_y;
        render_data->coords[render_data->coords_length + 4 * 3 + 2] = q.s0;
        render_data->coords[render_data->coords_length + 4 * 3 + 3] = q.t1;

        render_data->indices[render_data->indices_length + 0] = render_data->coords_length / 4 + 0;
        render_data->indices[render_data->indices_length + 1] = render_data->coords_length / 4 + 1;
        render_data->indices[render_data->indices_length + 2] = render_data->coords_length / 4 + 2;
        render_data->indices[render_data->indices_length + 3] = render_data->coords_length / 4 + 2;
        render_data->indices[render_data->indices_length + 4] = render_data->coords_length / 4 + 3;
        render_data->indices[render_data->indices_length + 5] = render_data->coords_length / 4 + 0;

        render_data->indices_length += 6;
        render_data->coords_length += 4 * 4;

        // @Bug
        // @Realloc
        // breaks after a few reallocs
        // setting the capacity high enough in the beginning for now
        if (render_data->indices_length == render_data->indices_capacity) {
            render_data->indices_capacity *= 2;
            render_data->indices = realloc(render_data->indices, sizeof(GLuint) * render_data->indices_capacity);
        }
        // @Realloc
        if (render_data->coords_length == render_data->coords_capacity) {
            render_data->coords_capacity *= 2;
            render_data->coords = realloc(render_data->coords, sizeof(GLfloat) * 4 * render_data->coords_capacity);
            render_data->fg_coords = realloc(render_data->fg_coords, sizeof(GLfloat) * 4 * render_data->coords_capacity);
        }
    }
}

void mark_background_begin(struct Render_Data* render_data,
                           GLfloat* color,
                           float x, float y) {
    
    for (size_t i = 0; i < 4; i += 1) {
        render_data->bg_colors[render_data->bg_coords_length + 4 * i + 0] = color[0];
        render_data->bg_colors[render_data->bg_coords_length + 4 * i + 1] = color[1];
        render_data->bg_colors[render_data->bg_coords_length + 4 * i + 2] = color[2];
        render_data->bg_colors[render_data->bg_coords_length + 4 * i + 3] = color[3];
    }

    // @Incomplete
    // we need a stack
    render_data->mark_begin_xpos = x;
    render_data->mark_begin_ypos = y - render_data->font_atlas->font_size + 4;
}
void mark_background_end(struct Render_Data* render_data,
                         float x, float y) {

    float start_xpos = render_data->mark_begin_xpos;
    float start_ypos = render_data->mark_begin_ypos;
    float end_xpos = x;
    float end_ypos = y + 6;

    convert_screen_coords_to_view_coords(start_xpos, start_ypos, render_data->width, render_data->height, &start_xpos, &start_ypos);
    convert_screen_coords_to_view_coords(end_xpos, end_ypos, render_data->width, render_data->height, &end_xpos, &end_ypos);
    
    render_data->bg_coords[render_data->bg_coords_length + 4 * 0 + 0] = start_xpos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 0 + 1] = start_ypos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 0 + 2] = 0;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 0 + 3] = 0;
    
    render_data->bg_coords[render_data->bg_coords_length + 4 * 1 + 0] = end_xpos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 1 + 1] = start_ypos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 1 + 2] = 0;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 1 + 3] = 0;
    
    render_data->bg_coords[render_data->bg_coords_length + 4 * 2 + 0] = end_xpos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 2 + 1] = end_ypos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 2 + 2] = 0;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 2 + 3] = 0;
    
    render_data->bg_coords[render_data->bg_coords_length + 4 * 3 + 0] = start_xpos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 3 + 1] = end_ypos;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 3 + 2] = 0;
    render_data->bg_coords[render_data->bg_coords_length + 4 * 3 + 3] = 0;

    render_data->bg_coords_length += 4 * 4;

    // @Realloc
    if (render_data->bg_coords_length == render_data->bg_coords_capacity) {
        render_data->bg_coords_capacity *= 2;
        render_data->bg_coords = realloc(render_data->bg_coords, sizeof(GLfloat) * 4 * render_data->bg_coords_capacity);
        render_data->bg_colors = realloc(render_data->bg_colors, sizeof(GLfloat) * 4 * render_data->bg_coords_capacity);
    }
}

void render_type(struct Type_Info* type,
                 struct Render_Data* render_data) {

    struct Render_Node* last_line = *render_data->debugger_root->list.elements->last;

    switch (type->kind) {
        case TYPE_INFO_TAG_IDENT:{
            struct Render_Node* ident = make_text(render_data->render_nodes, type->ident.name, hilite_type_fg_color);
            array_push(last_line->list.elements, &ident);
            break;
        }
        case TYPE_INFO_TAG_ARRAY:{
            render_type(type->array.elem_type, render_data);
            struct Render_Node* open_angle_brace = make_text(render_data->render_nodes, "[", render_data->fg_color);
            array_push(last_line->list.elements, &open_angle_brace);
            char* length = malloc(sizeof(char) * 19);
            // @Refactor
            snprintf(length, 19, "%zu", type->array.length);
            struct Render_Node* length_node = make_text(render_data->render_nodes, length, hilite_literal_fg_color);
            array_push(last_line->list.elements, &length_node);
            // @MemoryLeak
            // free(length);
            struct Render_Node* close_angle_brace = make_text(render_data->render_nodes, "]", render_data->fg_color);
            array_push(last_line->list.elements, &close_angle_brace);
            break;
        }
        case TYPE_INFO_TAG_POINTER:{
            render_type(type->pointer.elem_type, render_data);
            struct Render_Node* star = make_text(render_data->render_nodes, "*", render_data->fg_color);
            array_push(last_line->list.elements, &star);
            break;
        }
        default:{
            break;
        }
    }
}

void render_indent(struct Render_Data* render_data) {
    struct Render_Node* last_line = *render_data->debugger_root->list.elements->last;
    struct Render_Node* space = make_text(render_data->render_nodes, " ", render_data->fg_color);
    for (size_t i = 0; i < render_data->indent_level; i += 1) {
        for (size_t j = 0; j < 4; j += 1) {
            array_push(last_line->list.elements, &space);
        }
    }
    // render_data->xpos = render_data->indent_level * 4 * render_data->font_atlas->char_width;
}
void render_space(struct Render_Data* render_data) {
    struct Render_Node* last_line = *render_data->debugger_root->list.elements->last;
    struct Render_Node* space = make_text(render_data->render_nodes, " ", render_data->fg_color);
    array_push(last_line->list.elements, &space);
}
void render_newline(struct Render_Data* render_data) {
    /*
    render_data->xpos = 0;
    render_data->ypos += render_data->font_atlas->font_size * render_data->line_height;
    */
    
    render_data->line_index += 1;
    if (render_data->line_index >= render_data->lines->length) {
        size_t new_capacity = render_data->line_index * 2;
        while (render_data->lines->length < new_capacity) {
            array_next((render_data->lines));
            array_init((render_data->lines->last), sizeof(struct Code_Node*), 10);
        }
    }
    array_clear((render_data->lines->first + render_data->line_index));

    struct Render_Node* new_line = make_list(render_data->render_nodes, LIST_DIRECTION_HORIZONTAL);
    array_push(render_data->debugger_root->list.elements, &new_line);
}

void convert_screen_coords_to_view_coords(float x, float y,
                                          float width, float height,
                                          float* out_x, float* out_y) {
    *out_x = x * 2 / width - 1;
    *out_y = -(y * 2 / height - 1);
}

void get_baked_quad_scaled(const stbtt_bakedchar *chardata,
                           int pw, int ph,
                           int char_index,
                           float *xpos, float *ypos,
                           float scale,
                           stbtt_aligned_quad *q,
                           int opengl_fillrule) {

   float d3d_bias = opengl_fillrule ? 0 : -0.5f;
   float ipw = 1.0f / pw, iph = 1.0f / ph;
   if (char_index < 0) {
       printf("char_index is less than 0, did you forget to null-terminate a string?\n");
       abort();
   }
   const stbtt_bakedchar *b = chardata + char_index;
   int round_x = (int)floor(*xpos + b->xoff / scale + 0.5f);
   int round_y = (int)floor(*ypos + b->yoff / scale + 0.5f);

   q->x0 = round_x + d3d_bias;
   q->y0 = round_y + d3d_bias;
   q->x1 = round_x + (b->x1 - b->x0) / scale + d3d_bias;
   q->y1 = round_y + (b->y1 - b->y0) / scale + d3d_bias;

   q->s0 = b->x0 * ipw;
   q->t0 = b->y0 * iph;
   q->s1 = b->x1 * ipw;
   q->t1 = b->y1 * iph;

   *xpos += b->xadvance / scale;
}