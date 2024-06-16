uniform float uTime;

attribute float frameOffset;
attribute float birdScale;
attribute vec2 birdOffset;

varying float vFrameOffset;

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
  vec3 pos = position;
  pos.xy += birdOffset;
  pos.xy += vec2(noise(vec2(frameOffset, uTime)), noise(vec2(uTime, frameOffset))) * .2;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = 8.0 * (300.0 / -mvPosition.z) * birdScale;
  gl_Position = projectionMatrix * mvPosition;

  vFrameOffset = frameOffset;
}