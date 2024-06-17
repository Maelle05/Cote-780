uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform sampler2D uTexture;

varying vec2 vUv;

#define time (uTime * 0.15)
#define tau 6.2831853

mat2 makem2(in float theta) {
	float c = cos(theta);
	float s = sin(theta);
	return mat2(c, -s, s, c);
}

float noise(in vec2 x) {
	return texture2D(uNoiseTexture, x * .01).x;
}

float fbm(in vec2 p) {
	vec4 tt = fract(vec4(time * 2.) + vec4(0.0, 0.25, 0.5, 0.75));
	vec2 p1 = p - normalize(p) * tt.x;
	vec2 p2 = vec2(1.0) + p - normalize(p) * tt.y;
	vec2 p3 = vec2(2.0) + p - normalize(p) * tt.z;
	vec2 p4 = vec2(3.0) + p - normalize(p) * tt.w;
	vec4 tr = vec4(1.0) - abs(tt - vec4(0.5)) * 2.0;
	float z = 2.;
	vec4 rz = vec4(0.);
	for(float i = 1.; i < 4.; i++) {
		rz += abs((vec4(noise(p1), noise(p2), noise(p3), noise(p4)) - vec4(0.5)) * 2.) / z;
		z = z * 2.;
		p1 = p1 * 2.;
		p2 = p2 * 2.;
		p3 = p3 * 2.;
		p4 = p4 * 2.;
	}
	return dot(rz, tr) * 0.25;
}

float dualfbm(in vec2 p) {
	vec2 p2 = p * .7;
	vec2 basis = vec2(fbm(p2 - time * 1.6), fbm(p2 + time * 1.7));
	basis = (basis - .5) * .2;
	p += basis;
	return fbm(p);
}

float circ(vec2 p) {
	float r = length(p);
	r = log(sqrt(r));
	return abs(mod(r * 2., tau) - 4.54) * 3. + .5;
}

void main() {
	vec2 p = vUv * uResolution - 0.5 * uResolution;
	p.x *= uResolution.x / uResolution.y;
	p *= 4.;

	float rz = dualfbm(p);
	rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
	rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
	rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));

	vec3 col = vec3(0.89, 0.565, 0.467) / rz * 0.5;
	col = pow(abs(col), vec3(.99));
	float alpha = 1. - rz;

	vec4 textureColor = texture2D(uTexture, 1. - vUv);

	gl_FragColor = vec4(col, alpha);
	// gl_FragColor = vec4(vec3(rz), 1.0);
}
