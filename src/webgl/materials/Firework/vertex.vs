uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

uniform float uSize;
uniform vec2 uResolution;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
