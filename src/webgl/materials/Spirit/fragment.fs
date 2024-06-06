varying vec2 vUv;
uniform float u_time;
uniform float u_mouve;


// --------------------------------
// 2D noise

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


void main() {
  vec2 st = vUv;

  // Color
  vec4 transparent = vec4(0., 0., 0., 0.);
  vec4 color = vec4(.945, .945, .902, 1.);

  // Create base shape with circle mask
  vec3 metaballs[3]; // posX, PosY, R
  metaballs[0] = vec3(0.5, 0.65, 0.10 - abs(u_mouve) * 0.01);
  metaballs[1] = vec3(0.5 + u_mouve * 0.2, 0.40 + abs(u_mouve) * 0.17, 0.03 - abs(u_mouve) * 0.01);
  metaballs[2] = vec3(0.5 + u_mouve * 0.42, 0.25 + abs(u_mouve) * 0.3, 0.015 - abs(u_mouve) * 0.01);
  float paint = 0.0;
  for(int i = 0; i < metaballs.length(); i++){
    paint += metaballs[i].z / distance(metaballs[i].xy, vUv);
  }
  vec4 shapeMask = vec4(smoothstep(.6, .85, paint));


  // Noise
  vec2 noise_pos = vec2(st * 6.);
  float noise = snoise(noise_pos + vec2(0., u_time)) * .25 + .25;
  noise += snoise(noise_pos) * .25 + .3;
  vec4 noiseTex = mix(transparent, color, smoothstep(.3, .6, noise));

  // Add face
  float faceBall = smoothstep(.83 + abs(u_mouve) * 0.05, .86 + abs(u_mouve) * 0.05, 1. - distance( st, metaballs[0].xy ));
  vec4 faceTex = vec4(faceBall);

  // Apply color scheme
  vec4 resultNoiseBaseShape = mix(transparent, noiseTex, shapeMask);
  vec4 result = mix(resultNoiseBaseShape, color, faceTex);

  gl_FragColor = result;
}