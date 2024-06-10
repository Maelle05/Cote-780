uniform sampler2D tSpritesheet;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(tSpritesheet, vUv);

  #include <colorspace_fragment>
}