uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform sampler2D uTexture;

varying vec2 vUv;

#define time (uTime * 0.15)
#define tau 6.2831853

float noise(in vec2 x) {
	return texture2D(uNoiseTexture, x * .01).x;
}

void main() {
	float alpha = pow(vUv.y, 2.) * pow(uProgress, 2.);
	gl_FragColor = vec4(vec3(1., 1., 1.), alpha);
}
