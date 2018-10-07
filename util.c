#define STB_TRUETYPE_IMPLEMENTATION
#include "stb_truetype.h"

#include "util.h"

#define DEBUG_DYNAMIC_ARRAY false
#define DEBUG_DYNAMIC_ARRAY_INIT true
#define DEBUG_DYNAMIC_ARRAY_PUSH true
#define DEBUG_DYNAMIC_ARRAY_NEXT true
#define DEBUG_DYNAMIC_ARRAY_REALLOC true
void array_init(struct Dynamic_Array* array, size_t element_size, size_t capacity) {
    #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_INIT
    printf("dynamic array init\n");
    printf("element_size: %zu\n", element_size);
    printf("capacity: %zu\n", capacity);
    #endif
    array->element_size = element_size;
    array->capacity = capacity;
    array->length = 0;
    array->first = malloc(element_size * capacity);
    array->last = (void*)((size_t)array->first - element_size);
}
bool array_push(struct Dynamic_Array* array, void* element) {
    array->length += 1;
    #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_PUSH
    printf("dynamic array push\n");
    printf("length: %zu\n", array->length);
    #endif
    bool did_realloc = array_maybe_realloc(array);
    array->last += array->element_size;
    memcpy(array->last, &element, array->element_size);
    return did_realloc;
}
bool array_next(struct Dynamic_Array* array) {
    array->length += 1;
    #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_NEXT
    printf("dynamic array next\n");
    printf("length: %zu\n", array->length);
    #endif
    bool did_realloc = array_maybe_realloc(array);
    array->last += array->element_size;
    return did_realloc;
}
bool array_maybe_realloc(struct Dynamic_Array* array) {
    if (array->length == array->capacity) {
        array->capacity *= 2;
        #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_REALLOC
        void* first_before = array->first;
        printf("capacity: %zu\n", array->capacity);
        printf("first before: %zu\n", (size_t)first_before);
        #endif
        array->first = realloc(array->first, array->element_size * array->capacity);
        #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_REALLOC
        void* first_after = array->first;
        printf("first after: %zu\n", (size_t)first_after);
        void* last_before = array->last;
        printf("last before: %zu\n", (size_t)last_before);
        #endif
        array->last = (void*)((size_t)array->first + (array->length - 2) * array->element_size);
        #if DEBUG_DYNAMIC_ARRAY && DEBUG_DYNAMIC_ARRAY_REALLOC
        void* last_after = array->last;
        printf("last after: %zu\n", (size_t)last_after);
        printf("first diff: %ld\n", (long)first_before - (long)first_after);
        printf("last diff: %ld\n", (long)last_before - (long)last_after);
        #endif
        return true;
    }
    else {
        return false;
    }
}

#define DEBUG_DYNAMIC_SOA false
#define DEBUG_DYNAMIC_SOA_INIT true
#define DEBUG_DYNAMIC_SOA_PUSH true
#define DEBUG_DYNAMIC_SOA_REALLOC true
void soa_init(struct Dynamic_SOA* soa, size_t capacity, size_t members_length, ...) {
    soa->length = 0;
    soa->capacity = capacity;
    soa->members_length = members_length;

    soa->element_sizes = malloc(sizeof(size_t) * members_length);

    #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_INIT
    printf("dynamic soa init\n");
    printf("soa ptr: %zu\n", (size_t)soa);
    printf("capacity: %zu\n", capacity);
    printf("members_length: %zu\n", members_length);
    #endif

    va_list args;
    va_start(args, members_length);
    void** member_ptr = (void**)((size_t)soa + DYNAMIC_SOA_FIRST_MEMBER_OFFSET);
    for (size_t i = 0; i < soa->members_length; i += 1) {
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_INIT
        printf("member %zu\n", i);
        #endif
        size_t element_size = va_arg(args, size_t);
        soa->element_sizes[i] = element_size;
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_INIT
        printf("member_ptr diff: %zu\n", (size_t)member_ptr - (size_t)&(soa->element_sizes));
        printf("element_size: %zu\n", soa->element_sizes[i]);
        #endif
        *member_ptr = malloc(element_size * soa->capacity);
        member_ptr = (void**)((size_t)member_ptr + DYNAMIC_SOA_NEXT_MEMBER_OFFSET);
    }
    va_end(args);
}
bool soa_push(struct Dynamic_SOA* soa, ...) {
    soa->length += 1;

    bool did_realloc = soa_maybe_realloc(soa);

    #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_PUSH
    printf("dynamic soa push\n");
    printf("soa ptr: %zu\n", (size_t)soa);
    #endif

    va_list args;
    va_start(args, soa);
    void** member_ptr = (void**)((size_t)soa + DYNAMIC_SOA_FIRST_MEMBER_OFFSET);
    for (size_t i = 0; i < soa->members_length; i += 1) {
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_PUSH
        printf("member %zu\n", i);
        #endif
        size_t element_size = soa->element_sizes[i];
        void* src = va_arg(args, void*);
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_PUSH
        printf("member_ptr diff: %zu\n", (size_t)member_ptr - (size_t)&(soa->element_sizes));
        printf("element_size: %zu\n", element_size);
        printf("src: %zu\n", (size_t)src);
        printf("*member_ptr: %zu\n", (size_t)*member_ptr);
        #endif
        void* elem_ptr = (void*)((size_t)*member_ptr + (soa->length - 1) * element_size);
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_PUSH
        printf("elem_ptr: %zu\n", (size_t)elem_ptr);
        #endif
        memcpy(elem_ptr, &src, element_size);
        member_ptr = (void**)((size_t)member_ptr + DYNAMIC_SOA_NEXT_MEMBER_OFFSET);
    }
    va_end(args);

    return did_realloc;
}
bool soa_maybe_realloc(struct Dynamic_SOA* soa) {
    if (soa->length == soa->capacity) {
        soa->capacity *= 2;
        #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_REALLOC
        printf("dynamic soa realloc\n");
        #endif
        void** member_ptr = (void**)((size_t)soa + DYNAMIC_SOA_FIRST_MEMBER_OFFSET);
        for (size_t i = 0; i < soa->members_length; i += 1) {
            #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_REALLOC
            void* first_before = *member_ptr;
            printf("capacity: %zu\n", soa->capacity);
            printf("first before: %zu\n", (size_t)first_before);
            #endif
            *member_ptr = realloc(*member_ptr, soa->element_sizes[i] * soa->capacity);
            member_ptr = (void*)((size_t)member_ptr + DYNAMIC_SOA_NEXT_MEMBER_OFFSET);
            #if DEBUG_DYNAMIC_SOA && DEBUG_DYNAMIC_SOA_REALLOC
            void* first_after = *member_ptr;
            printf("first after: %zu\n", (size_t)first_after);
            printf("diff: %ld\n", (long)first_before - (long)first_after);
            #endif
        }
        return true;
    }
    else {
        return false;
    }
}

GLuint compile_shader(GLenum type, const char* source) {

    GLuint shader = glCreateShader(type);

    if (shader == 0) {
        printf("failed creating shader!\n");
        return 0;
    }

    GLint length = strlen(source);
    glShaderSource(shader, 1, &source, &length);
    glCompileShader(shader);

    GLint infoLen = 0;
    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &infoLen);

    if (infoLen > 1) {
        char* infoLog = malloc(infoLen);

        glGetShaderInfoLog(shader, infoLen, NULL, infoLog);
        printf("%s\n", infoLog);

        free(infoLog);
    }

    return shader;
}
char* read_file(const char* filename) {
    FILE* in = fopen(filename, "rb");
    if (in == NULL) return NULL;

    const size_t start_size = 4096;
    size_t res_size = start_size;
    char* res = malloc(res_size);
    size_t total_bytes_read = 0;

    while (!feof(in) && !ferror(in)) {
        if (total_bytes_read + start_size > res_size) {
            if (res_size > 10*1024*1024) break;
            res_size = res_size * 2;
            res = (char*)realloc(res, res_size);
        }
        char* p_res = res + total_bytes_read;
        total_bytes_read += fread(p_res, 1, start_size, in);
    }

    fclose(in);
    res = realloc(res, total_bytes_read + 1);
    res[total_bytes_read] = '\0';

    return res;
}
void print_log(GLuint object) {
  GLint log_length = 0;
  if (glIsShader(object))
    glGetShaderiv(object, GL_INFO_LOG_LENGTH, &log_length);
  else if (glIsProgram(object))
    glGetProgramiv(object, GL_INFO_LOG_LENGTH, &log_length);
  else {
    printf("printlog: Not a shader or a program\n");
    return;
  }

  char* log = (char*)malloc(log_length);

  if (glIsShader(object))
    glGetShaderInfoLog(object, log_length, NULL, log);
  else if (glIsProgram(object))
    glGetProgramInfoLog(object, log_length, NULL, log);

  printf("%s", log);
  free(log);
}
GLuint create_program(const char* vertex_shader_filename, const char* fragment_shader_filename) {
    GLuint program_id = glCreateProgram();

    char* vertex_shader_source = read_file(vertex_shader_filename);
    GLuint vertex_shader = compile_shader(GL_VERTEX_SHADER, vertex_shader_source);
    // free(vertex_shader_source);

    char* fragment_shader_source = read_file(fragment_shader_filename);
    GLuint fragment_shader = compile_shader(GL_FRAGMENT_SHADER, fragment_shader_source);
    // free(fragment_shader_source);

    glAttachShader(program_id, vertex_shader);
    glAttachShader(program_id, fragment_shader);

    glLinkProgram(program_id);
	GLint link_ok = GL_FALSE;
	glGetProgramiv(program_id, GL_LINK_STATUS, &link_ok);
	if (!link_ok) {
		printf("glLinkProgram: ");
		print_log(program_id);
        printf("\n");
		glDeleteProgram(program_id);
		return 0;
	}

    return program_id;
}