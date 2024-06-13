uniform float uTime;
uniform float uNoiseScale;
uniform sampler2D uTexture;
uniform sampler2D uTextureShake;
uniform sampler2D uPerlin;
uniform vec2 uOffset;
uniform vec3 uBoundingSize;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float PI = 3.141592653589793238;

void main() {

  vNormal = normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vec4 temp = vec4(position, 1.0);
  vPosition = temp.xyz;
}