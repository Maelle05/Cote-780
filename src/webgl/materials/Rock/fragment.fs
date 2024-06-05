uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;
float radius = 0.19;
float size = 0.5;

// Simplex noise function
vec3 mod289(vec3 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
	return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
	return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
	0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
	-0.577350269189626,  // -1.0 + 2.0 * C.x
	0.024390243902439); // 1.0 / 41.0
	vec2 i = floor(v + dot(v, C.yy));
	vec2 x0 = v - i + dot(i, C.xx);

	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;

	i = mod289(i);
	vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

	vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
	m = m * m;
	m = m * m;

	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;

	m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

	vec3 g;
	g.x = a0.x * x0.x + h.x * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

void main() {
	float yOffset = 1.7;
	float noise = snoise(vUv * 20.0 + uProgress * 0.2);
	float noise2 = snoise(vUv * 20.0 + uProgress * 0.5);
	float edge0 = uProgress + noise * 0.05 - yOffset * (1. - uProgress);
	float edge1 = uProgress + clamp(0.3 * uProgress, 0., 1.) + noise2 * 0.05 - yOffset * (1. - uProgress);

	if(vPosition.y < edge0) {
		gl_FragColor = vec4(0.44, 0.44, 0.44, 1.0);
	} else if(vPosition.y < edge1) {
		gl_FragColor = vec4(0.0, 1.0, 0.35, 1.0);
	} else {
		discard;
	}

}