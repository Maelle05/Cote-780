uniform float uTime;

varying vec2 vUv;
varying float vNoise;

void main()	{
  vec3 blue = vec3(0., 0., 1.);
  vec3 white = vec3(0.34, 0.16, 0.);

  vec3 color = mix(white, blue, vNoise - 0.1);
	gl_FragColor = vec4(color, 1.);
}