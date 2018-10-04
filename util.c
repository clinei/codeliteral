#define STB_TRUETYPE_IMPLEMENTATION
#include "stb_truetype.h"

#include "util.h"

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
void print_log(GLuint object)
{
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