uniform float uTime;
uniform vec3 uColor;
uniform float uOffset;

varying vec2 vUv;

void main() {
	float fadeY = smoothstep(0.0, 0.1, vUv.y) * (1. - smoothstep(0.9, 1.0, vUv.y));

	float wind = smoothstep(0.0, 0.1, mod(uTime * 0.001 + uOffset * 10. - vUv.y, 5.)) * (1. - smoothstep(0.9, 1.0, mod(uTime * 0.001 + uOffset * 10. - vUv.y, 5.)));

	float alpha = fadeY * wind;

	gl_FragColor = vec4(uColor, alpha * .8);
}