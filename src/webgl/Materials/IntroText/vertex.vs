uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;

  float progress = uTime;

  float centerX = 1. - progress * 1.;
  float centerY = progress * 2. - 1. * (1. - progress);

  float distanceCenter = distance(vec2(centerX, centerY), uv.xy);

  float effectRadius = 1.2;
  float effectRadius2 = .8;

  float displacement = smoothstep(effectRadius, 0.0, distanceCenter);
  float displacement2 = smoothstep(effectRadius2, 0.0, distanceCenter);

  vec3 pos = position + vec3(
    displacement * 0. + displacement2 * 0., 
    displacement * .5 + displacement2 * 0.2, 
    displacement * .2 + displacement2 * 0.
  );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}