varying vec2 vUv;
uniform vec4 u_color;
uniform float u_gOpacity;
uniform float u_time;
uniform float u_move;
uniform sampler2D u_faceMask;
uniform sampler2D u_texture;
uniform sampler2D u_noise;

void main() {
  vec2 uv = vUv;
  uv.x -= u_move * smoothstep(0.3, 1., (vUv.y)) * 0.2;
  uv.x -= sin(u_time) * 0.05;

  // Color
  vec4 transparent = vec4(0., 0., 0., 0.);
  vec4 black = vec4(.0, .0, .0, 1.);
  vec4 white = vec4(.1, .1, .1, 1.);

  // Create base shape mask
  vec4 shapeMask = texture2D(u_faceMask, uv);

  // 
  vec4 transMask = vec4(smoothstep(0.7, 0.5, vUv.y));

  // Noise
  vec2 noiseUv = vUv * 0.3;
  vec2 uv1 = vec2(noiseUv.x, noiseUv.y + u_time * 0.1);
  vec4 noise1 = texture2D(u_noise, uv1);
  noiseUv *= 2.;
  vec2 uv2 = vec2(noiseUv.x, noiseUv.y - u_time * 0.2);
  vec4 noise2 = texture2D(u_noise, uv2);
  vec4 noiseTex = smoothstep( 0.1, 0.3, noise2 * noise1);
  noiseTex.w = noiseTex.x;

  // Texture
  // vec4 baseTex = texture2D(u_texture, uv);
  vec4 baseTex = vec4(u_color);
  vec4 transFlameMask = mix(noiseTex, transparent, transMask);
  

  baseTex.w = transMask.x;
  baseTex.w -= shapeMask.x;
  baseTex.w += transFlameMask.x;
  baseTex.w *= 1. - mix(transparent, black, texture2D(u_texture, uv).w).w;

  // Face
  vec2 distortUV = vUv;
  distortUV.y *= 0.5;
  // distortUV.x *= sin(u_time) - 0.5;
  distortUV.y += 0.2;
  float eye1 = smoothstep(0.03, 0.01, distance(distortUV, vec2(0.37, 0.4)));
  float eye2 = smoothstep(0.03, 0.01, distance(distortUV, vec2(0.63, 0.4)));
  baseTex.w -= eye1;
  baseTex.w -= eye2;


  // Apply color scheme
  // TO - DO test avec distence et cercle
  vec4 result = mix(baseTex, transparent, smoothstep(0.65, 0.85, vUv.y));
  result.w *= u_gOpacity;

  gl_FragColor = result;
}