precision mediump float;

attribute vec4 coord;
attribute vec4 fg_coord;
varying vec2 texpos;
varying vec4 fg_color;

void main(void) {
    gl_Position = vec4(coord.xy, 0, 1);
    texpos = coord.zw;
    fg_color = fg_coord;
}