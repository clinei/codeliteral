precision mediump float;

varying vec2 texpos;
uniform sampler2D tex;
uniform vec4 fg_color;
uniform vec4 bg_color;

void main(void) {
  vec4 tex_color = texture2D(tex, texpos);
  // vec4 foreground = vec4(tex_color.a, tex_color.a, tex_color.a, tex_color.a) * fg_color;
  vec4 foreground = fg_color;
  vec4 background = clamp(foreground + bg_color, 0.0, 1.0);
  gl_FragColor = background;
}
