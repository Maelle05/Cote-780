uniform float uTime;
uniform float uBirth;
uniform float uLifetime;
uniform float uSize;
uniform float uRandom;

attribute float particleIndex;
attribute float particleRandom;

varying float vLife;

#define HALF_PI 1.5707963267948966

float sineOut(float t) {
  return sin(t * HALF_PI);
}

void main() {
  float life = (uTime - uBirth) / uLifetime;
  life = sineOut(life);
  float rand = particleRandom * 2. - 1.;
  rand *= (uRandom * 2.);
  float speed = 0.2 + rand * 0.1;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  mvPosition.x += sin(particleIndex * 3.14 * 2. + rand) * life * speed;
  mvPosition.y += cos(particleIndex * 3.14 * 2. + rand) * life * speed;

  gl_PointSize = uSize * (300.0 / -mvPosition.z) * (1. - life * .5);
  gl_Position = projectionMatrix * mvPosition;

  vLife = life;
}