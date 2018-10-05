precision mediump float;

varying vec2 texpos;
uniform sampler2D tex;
varying vec4 fg_color;

void main(void) {
  vec4 tex_color = texture2D(tex, texpos);
  gl_FragColor = vec4(tex_color.a, tex_color.a, tex_color.a, tex_color.a) * fg_color;
}
