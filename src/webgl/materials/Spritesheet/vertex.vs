uniform vec2 uOffset;
uniform vec2 uSize;
uniform vec2 uScale;
uniform vec2 uPosition;

varying vec2 vUv;

void main() {
  vUv = uv;
  vUv *= uSize;
  vUv += uOffset;

  vec3 pos = position;
  pos.xy *= uScale;
  pos.xy += uPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}