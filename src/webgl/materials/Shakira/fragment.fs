uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTextureShake;
uniform sampler2D uPerlin;
uniform vec2 uOffset;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main() {
	// vec4 noise = texture2D(uPerlin, vUv * 10.);
	vec2 displacedUv = fract((vUv + uOffset / 100.0) * 10.);

	vec4 textureColor = texture2D(uTexture, vUv);
	vec4 shakeTexture = texture2D(uTextureShake, displacedUv);

	vec4 color = textureColor + shakeTexture * 0.02;

	gl_FragColor = color;
}