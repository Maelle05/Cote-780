uniform float uTime;
uniform float uSize;
uniform float uProgress;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uNoiseOffset;
uniform vec3 uP1;
uniform vec3 uP2;
uniform vec3 uP3;
uniform vec3 uP4;

attribute float particleIndex;

varying vec2 vUv;
varying vec3 vPosition;
varying float vIndex;
varying float vStep4Progress;

const float PI = 3.141592653589793238;
const float step1Duration = 0.1;
const float step2Duration = 0.3;
const float step3Duration = 0.5;
const float step4Duration = 0.1;

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

//Calculate base angle of circle
float calculateAngle(vec3 pointOfCenter, vec3 center, float r) {
  vec3 OA = pointOfCenter - center;
  float angle = atan(OA.z, OA.x);
  angle = mod(angle, 2.0 * PI);

    // Ensure angle is positive
  if(angle < 0.0) {
    angle += 2.0 * PI;
  }

  return angle;
}

// Function to generate a point on a sphere using spherical coordinates
vec3 getSpherePosition(float idx, vec3 center) {
  float phi = acos(2.0 * fract(sin(dot(vec2(idx, idx), vec2(12.9898, 78.233))) * 43758.5453) - 1.0);  // Latitude
  float theta = particleIndex * 2.0 * PI;    // Longitude
  float radius = uRadius; // Sphere radius
  float x = radius * sin(phi) * cos(theta);
  float y = radius * sin(phi) * sin(theta);
  float z = radius * cos(phi);
  return center + vec3(x, y, z);
}

vec3 getCirclePosition(float idx, float progress, vec3 center) {
  float turns = 3.0;
  float radius = uRadius + 0.1;
  float baseAngle = calculateAngle(uP2, uP3, radius);
  float angle = 2.0 * PI * progress * turns + baseAngle;

    // Calculate the upward movement in Y
  float y = center.y + uRadius * (1.0 + progress * 3.5); // Moves up and converges to the center

    // Calculate the X and Z positions based on the circular path
  float x = center.x + radius * cos(angle) * (1.0 - progress); // Converge to center as progress reaches 1
  float z = center.z + radius * sin(angle) * (1.0 - progress); // Converge to center as progress reaches 1

  return vec3(x, y, z);
}

//p0 = start
//p1 = controlPoint
//p2 = end
vec3 quadraticBezier(vec3 p0, vec3 p1, vec3 p2, float t) {
  float u = 1.0 - t;
  return u * u * p0 + 2.0 * u * t * p1 + t * t * p2;
}

void main() {

  // Step progress values
  float step1End = step1Duration;
  float step2End = step1End + step2Duration;
  float step3End = step2End + step3Duration;

  float noise = perlinNoise(vec2(particleIndex, particleIndex));
  float progress = clamp(uProgress * noise * 2.0, 0.0, 1.0);
  float scalingFactor = uNoiseOffset;

  if(progress >= step2End) {
        // Calculate the progress within step 3
    float step3Progress = (progress - step2End) / step3Duration;
        // Gradually reduce the noise effect to 1
    scalingFactor = mix(scalingFactor, 1.0, progress);

  }

  progress = clamp(uProgress * noise * 2.0, 0.0, 1.0);

  vec3 spherePos = getSpherePosition(particleIndex, position);

  vec3 pos;
  if(progress < step1End) {
    // Step 1: Sphere to uP1
    float adjustedProgress = progress / step1Duration;
    pos = mix(position, uP1, adjustedProgress);
  } else if(progress < step2End) {
    // Step 2: uP1 to uP2
    float adjustedProgress = (progress - step1End) / step2Duration;
    vec3 controlPoint = mix(uP1, uP2, 0.5);
    controlPoint.y += 0.1;
    pos = quadraticBezier(uP1, controlPoint, uP2, adjustedProgress);
    // pos = mix(uP1, uP2, adjustedProgress);
  } else if(progress < step3End) {
        // Step 3: uP2 to circle
    float adjustedProgress = (progress - step2End) / step3Duration;
    pos = getCirclePosition(particleIndex, adjustedProgress, uP3);
  } else {
    // Step 4: Circle to sphere centered at uP4
    float adjustedProgress = (progress - step3End) / step4Duration;
    vStep4Progress = adjustedProgress;
    vec3 circlePos = getCirclePosition(particleIndex, 1.0, uP3); // Position on circle
    vec3 finalSpherePos = getSpherePosition(particleIndex, uP4);
    pos = mix(circlePos, finalSpherePos, adjustedProgress);
  }

  // vec3 newPosition = mix(spherePos, uP1, progress);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vIndex = particleIndex;
  vPosition = pos;
  vUv = uv;
}

  // // Oscillate in a range of 0.02 arround the radius
  // float oscillatingRadius = uRadius + ((sin(uTime) + 1.0) * 0.5) * 0.02 - 0.01;

  // // Use Perlin noise to affect the radius
  // float noiseValue = perlinNoise(vec2(uTime * 0.1 + particleIndex, uTime * 0.1 + particleIndex));
  // float radius = oscillatingRadius + noiseValue * 0.05; // Adjust the noise scaling as needed

  // float theta = particleIndex * 2.0 * PI;
  // float phi = acos(2.0 * fract(sin(dot(vec2(particleIndex, particleIndex), vec2(12.9898, 78.233))) * 43758.5453) - 1.0);

  // // Convert to Cartesian coordinates using the new radius
  // vec3 originalPosition;
  // originalPosition.x = radius * sin(phi) * cos(theta);
  // originalPosition.y = radius * sin(phi) * sin(theta);
  // originalPosition.z = radius * cos(phi);

  // // Calculate the direction vector 
  // vec3 direction = normalize(originalPosition);

  // // Calculate the new position
  // vec3 transformedPosition = originalPosition + direction * uProgress * 0.05;