uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

void main()	{
	vec2 uv = vUv;
    vec3 textColor = vec3(0., 0., 0.);

    float progress = uTime;
    float window = 2.;
    
     float opacity = smoothstep(
      0. + progress, 
      window + progress, 
      uv.y + window * (1. - progress) * (1. - uv.x) + window * (1. - progress)
     );

    vec4 color = vec4(textColor, opacity);
    gl_FragColor = color;
}