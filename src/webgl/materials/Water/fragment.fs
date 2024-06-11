uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vIndex;
varying vec3 vPosition;

float PI = 3.141592653589793238;

float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u * u * (3.0 - 2.0 * u);

	float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
	return res * res;
}

void main() {
	float time = uTime * 0.0001;
	vec2 displacedUv = vec2(vUv.x, vUv.y);

	vec4 textureColor = texture2D(uTexture, displacedUv);
	float noise = noise(displacedUv * 20. * sin(time)) * noise(displacedUv * 20.);
	textureColor += noise * 0.3;
	textureColor.w = 0.82;

	gl_FragColor = textureColor;
}
