uniform float uTime;
uniform bool uIsWater;
uniform vec4 uResolution;
uniform sampler2D tDiffuse;
uniform sampler2D tWater;

varying vec2 vUv;

vec2 resizeUvCover(vec2 uv, vec2 size, vec2 resolution) {
    vec2 ratio = vec2(
        min((resolution.x / resolution.y) / (size.x / size.y), 1.0),
        min((resolution.y / resolution.x) / (size.y / size.x), 1.0)
    );

    return vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
}

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
  vec2 uv = vUv;
  vec2 waterUv = vUv;

  if(uIsWater) {
    uv.x = uv.x + sin(vUv.y * 3.0 + time) * 0.005;
    uv.y = uv.y + sin(vUv.x * 3.0 + time) * 0.02;
    waterUv.x *= aspect;
  }

  float waterTexA = texture2D(tWater, vec2(waterUv.x * 0.2 - time * 0.01, waterUv.y * 0.3 + time * 0.008)).r;
  float waterTexB = texture2D(tWater, vec2(waterUv.x * 0.2 + time * 0.008, waterUv.y * 0.2 - time * 0.01)).r;
  float offset = waterTexA * waterTexB;

  if (uIsWater) uv += vec2(offset) * 0.1;

  vec4 sceneTex = texture2D(tDiffuse, uv);

  vec4 finalColor = sceneTex;
  if (uIsWater) finalColor += vec4(offset) * 1.;

  gl_FragColor = finalColor;
}