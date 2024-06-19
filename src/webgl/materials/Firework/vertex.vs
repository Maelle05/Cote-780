uniform float uTime;

void main() {

    // Calculate the angle and radius for the cone shape
  float angle = position.y * 10.0 + uTime;
  float radius = position.y * 2.0;

    // Displace the particle positions in X and Z to form a cone
  vec3 displacedPosition = vec3(cos(angle) * radius, position.y, sin(angle) * radius);

  vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
  gl_PointSize = 5.0 * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}