uniform sampler2D tSpritesheet;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tSpritesheet, vUv);

  color.rgb *= uColor.rgb * 1.1;

  gl_FragColor = color;

  #include <colorspace_fragment>
}