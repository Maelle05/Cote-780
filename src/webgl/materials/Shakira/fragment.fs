uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uOffset;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main() {
	vec2 displacedUv = vUv + uOffset / 100.;
	vec4 color = texture2D(uTexture, displacedUv);

	gl_FragColor = color;
}