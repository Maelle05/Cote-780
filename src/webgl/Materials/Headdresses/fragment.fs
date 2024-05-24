uniform sampler2D uTex;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main()	{
  vec4 tex = texture2D(uTex, vec2(vUv.x, 1. - vUv.y));
	gl_FragColor = tex;
}