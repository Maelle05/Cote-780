uniform float uTime;
uniform float uProgress;
uniform vec4 uResolution;
uniform sampler2D tDiffuse;
varying vec2 vUv;


float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 4
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main()
{
  float aspect = uResolution.x / uResolution.y;
  float time = uTime * 0.001;
  vec4 sceneTex = texture2D(tDiffuse, vUv);
  vec4 bgColor = vec4(0.85, 0.8, 0.7, 1.);

  // Noise displacement
  float disp = fbm(vUv * 50.) * aspect;
  vec4 noiseTex = vec4(vec3(disp), 1.);

  // Circle mask
  vec3 metaballs[5]; // posX, PosY, R
  metaballs[0] = vec3(0.4 + sin(time) * 0.1, 0.3 + cos(time) * 0.1, 0.2);
  metaballs[1] = vec3(0.5 + cos(time) * 0.07, 0.5, 0.15);
  metaballs[2] = vec3(0.25, 0.25, 0.15);
  metaballs[3] = vec3(0.7, 0.7, 0.15);
  metaballs[4] = vec3(0.7, 0.6, 0.09);

  vec2 uv = vec2(vUv.x, vUv.y);
  float paint = 0.0;
  for(int i = 0; i < metaballs.length(); i++){
      metaballs[i].z *= uProgress;
      paint += metaballs[i].z / distance(metaballs[i].xy, uv);
  }


  float marge1 = 1.2;
  float smallMask = (paint >= 1.) ? 1. - ((paint - 1.) / (marge1 - 1.)) : 1.;
  vec4 smallMaskCircle = vec4(vec3(smallMask), 1.0);
  
  paint = clamp(paint, 0.0, 1.0);

  float marge2 = 0.8;
  float bigMask = (paint > marge2) ? (paint - marge2) / (1. - marge2) : 0.0;
  vec4 bigMaskCircle = vec4(vec3(bigMask), 1.0);


  // Mix
  vec4 maskMixBig = mix(bigMaskCircle, noiseTex, -noiseTex);
  maskMixBig = clamp(maskMixBig, 0., 1.);

  vec4 maskMixSmall = mix(smallMaskCircle, noiseTex, -noiseTex);
  maskMixSmall = mix(maskMixSmall, vec4(1.), smallMaskCircle);
  maskMixSmall = clamp(maskMixSmall, 0., 1.);

  vec4 finalMix = mix(maskMixBig, vec4(1.), 1. - maskMixSmall);

  vec4 finalColor = mix(bgColor, sceneTex, finalMix);

  gl_FragColor = finalColor;
}