precision mediump float;

attribute vec4 coord;
attribute vec4 color;
varying vec4 frag_color;

void main(void) {
    gl_Position = vec4(coord.xy, 0, 1);
    frag_color = color;
}