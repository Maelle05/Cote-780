uniform sampler2D uTexture;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uRandomScale;

varying vec2 vUv;
varying float vRandom;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
	float textureColor = texture2D(uTexture, vUv).r;
	textureColor = map(textureColor, 0., .2, 0., 1.);

	// float random = (vRandom * 2. - 1.) * uRandomScale;
	// vec4 color = textureColor * vec4(uColor, 1.0);

	vec3 color = mix(uColorA, uColorB, vRandom);

	gl_FragColor = vec4(vec3(textureColor) * color, 1.0);
}