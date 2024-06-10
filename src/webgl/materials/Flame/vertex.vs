uniform float uTime;
uniform float uSize;
uniform vec2 uResolution;
uniform float uScale;

varying vec2 vUv;
varying vec3 vPosition;

attribute vec3 instancePosition;
attribute float aSize, aSpeed;

varying float vSize;
varying float vSpeed;
varying float vElevation;

float PI = 3.141592653589793238;

void main() {
  vSize = aSize;
  vSpeed = aSpeed;
  vUv = uv;

  vec3 pos = position;
  pos.y += 0.1;

  vec3 scaledPosition = pos * uScale;

  vec4 modelPosition = modelMatrix * vec4(scaledPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

}

//  vSize = aSize;
//   vSpeed = aSpeed;
//   vUv = uv;
//   float speed = 0.5;
//   float elevation = .05;

//   vec3 pos = position + instancePosition;
//   // pos += instancePosition;

//   //Life of flame trought size
//   float life = fract(-uTime * aSpeed * speed) * uScale;
//   float size = smoothstep(.0, .7, life) * smoothstep(1., .9, life) * aSize;
//   pos *= size;

//   //Position update
//   pos.y += fract(uTime * aSpeed * speed) * elevation * 2. + 0.05;
//   vElevation = pos.y;