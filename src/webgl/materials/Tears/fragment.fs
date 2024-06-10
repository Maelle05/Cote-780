uniform sampler2D uBaseTex;
uniform sampler2D uMaskTex;
uniform float u_gAlpha;
uniform vec3 u_color;
uniform float u_time;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main()	{
  vec2 uv = vUv;
  uv.y *= 0.5;
  uv.y += mod(u_time * 0.6, 1.) * 0.5;
  uv.x += sin(u_time) * 0.07;
  float tear = 1. - smoothstep(0.02, 0.025, distance(uv, vec2(0.5)));
  vec4 final = mix(vec4(1., 1., 1., 0.), vec4(u_color, 1.), tear);
  float mask = 1. - smoothstep(0., 0.2, vUv.y);
  final.w -= mask;
  final.w -= 1. - u_gAlpha;
	gl_FragColor = final;
}