uniform float uTime;
uniform float uSize;
uniform float uProgress;
uniform vec2 uResolution;
uniform float uRadius;

attribute float particleIndex;

varying vec2 vUv;
varying vec3 vPosition;
varying float vIndex;

const float PI = 3.141592653589793238;

vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float grad(int hash, vec2 p) {
  int h = hash & 7;
  float u = h < 4 ? p.x : p.y;
  float v = h < 4 ? p.y : p.x;
  return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

float perlinNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  f = fade(f);
  int a = int(i.x) + int(i.y) * 57;
  int aa = a;
  int ab = a + 1;
  int ba = a + 57;
  int bb = a + 58;

  float res = mix(mix(grad(aa, f), grad(ba, f - vec2(1.0, 0.0)), f.x), mix(grad(ab, f - vec2(0.0, 1.0)), grad(bb, f - vec2(1.0, 1.0)), f.x), f.y);
  return res * 0.5 + 0.5;
}

void main() {
  // Oscillate in a range of 0.02 arround the radius
  float oscillatingRadius = uRadius + ((sin(uTime) + 1.0) * 0.5) * 0.02 - 0.01;

  // Use Perlin noise to affect the radius
  float noiseValue = perlinNoise(vec2(uTime * 0.1 + particleIndex, uTime * 0.1 + particleIndex));
  float radius = oscillatingRadius + noiseValue * 0.05; // Adjust the noise scaling as needed

  float theta = particleIndex * 2.0 * PI;
  float phi = acos(2.0 * fract(sin(dot(vec2(particleIndex, particleIndex), vec2(12.9898, 78.233))) * 43758.5453) - 1.0);

  // Convert to Cartesian coordinates using the new radius
  vec3 originalPosition;
  originalPosition.x = radius * sin(phi) * cos(theta);
  originalPosition.y = radius * sin(phi) * sin(theta);
  originalPosition.z = radius * cos(phi);

  // Calculate the direction vector 
  vec3 direction = normalize(originalPosition);

  // Calculate the new position
  vec3 transformedPosition = originalPosition + direction * uProgress * 0.05;

  vec4 mvPosition = modelViewMatrix * vec4(transformedPosition, 1.0);
  gl_PointSize = uSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vIndex = particleIndex;
}
