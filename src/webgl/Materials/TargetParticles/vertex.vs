float rand(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

    // Four corners in 2D of a tile
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u = f * f * (3.0 - 2.0 * f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

uniform float uTime;
uniform float uSize;
uniform float uProgress;
uniform vec2 uResolution;

attribute float particleIndex;

varying vec2 vUv;
varying vec3 vPosition;
varying float vIndex;

const float PI = 3.141592653589793238;

void main() {
  float noise = noise(vec2(sin(uTime), particleIndex));

  float theta = particleIndex * 2.0 * PI;
  float phi = acos(2.0 * fract(sin(dot(vec2(particleIndex, particleIndex), vec2(12.9898, 78.233))) * 43758.5453) - 1.0);
  float radius = 0.1;

  // Convert to Cartesian coordinates
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

  float vIndex = particleIndex;

}