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
  uv.x -= u_move * smoothstep(0.3, 1., (1. - vUv.y)) * 0.2;

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
  vec4 noiseTex = smoothstep( 0.2, 0.3, noise2 * noise1);
  noiseTex.w = noiseTex.x;

  // Texture
  // vec4 baseTex = texture2D(u_texture, uv);
  vec4 baseTex = vec4(u_color);
  vec4 transFlameMask = mix(noiseTex, transparent, transMask);

  baseTex.w = transMask.x;
  baseTex.w -= shapeMask.x;
  baseTex.w += transFlameMask.x;
  baseTex.w *= 1. - mix(transparent, black, texture2D(u_texture, uv).w).w;


  // Apply color scheme
  // TO - DO test avec distence et cercle
  vec4 result = mix(baseTex, transparent, smoothstep(0.65, 0.85, vUv.y));
  result.w *= u_gOpacity;

  gl_FragColor = result;
}