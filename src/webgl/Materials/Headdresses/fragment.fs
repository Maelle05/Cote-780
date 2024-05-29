uniform sampler2D uBaseTex;
uniform sampler2D uMaskTex;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main()	{
  vec4 maskTex = texture2D(uMaskTex, vec2(vUv.x, 1. - vUv.y));
  vec4 baseTex = texture2D(uBaseTex, vec2(vUv.x, 1. - vUv.y));

  vec4 resultTex = mix(maskTex, baseTex, maskTex);

  vec4 final = vec4(resultTex.x, resultTex.y, resultTex.z, 1. * maskTex.z + 0.2);
	gl_FragColor = final;
}