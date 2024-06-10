uniform sampler2D tSpritesheet;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tSpritesheet, vUv);
  vec3 ouiColor = uColor;

  float red = uColor.x;

  color.rgb *= uColor.rgb;

  gl_FragColor = color;

  #include <colorspace_fragment>
}