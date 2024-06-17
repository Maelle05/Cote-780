uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main() {
	vec2 uv = vUv;
	uv.x += noise(vec2(uv.y, uTime * 0.001)) * noise(vec2(uTime * 0.001, uv.x)) * (1. - uv.y) * 0.3;

	vec4 texture = texture2D(uTexture, uv);

	if (texture.a < 0.1) {
		discard;
	}

	gl_FragColor = vec4(texture.rgb, texture.a);
}